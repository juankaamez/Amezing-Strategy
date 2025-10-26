import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { BrainstormingGroup, BrainstormingIdea } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import GeminiButton from '../common/GeminiButton';
import { generateBrainstormingIdeas } from '../../services/geminiService';

const Brainstorming: React.FC = () => {
    const { t } = useTranslation();
    const [topic, setTopic] = useLocalStorage('brainstorming_topic', '');
    const [groups, setGroups] = useLocalStorage<BrainstormingGroup[]>('brainstorming_groups', [
        { id: 'g1', name: 'Initial Ideas', ideas: [] }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const addGroup = () => {
        setGroups([...groups, { id: `g${Date.now()}`, name: '', ideas: [] }]);
    };
    
    const updateGroupName = (id: string, name: string) => {
        setGroups(groups.map(g => g.id === id ? { ...g, name } : g));
    };

    const removeGroup = (id: string) => {
        setGroups(groups.filter(g => g.id !== id));
    };

    const addIdea = (groupId: string) => {
        const newIdea: BrainstormingIdea = { id: `idea${Date.now()}`, text: '' };
        setGroups(groups.map(g => g.id === groupId ? { ...g, ideas: [...g.ideas, newIdea] } : g));
    };
    
    const updateIdeaText = (groupId: string, ideaId: string, text: string) => {
        setGroups(groups.map(g => {
            if (g.id === groupId) {
                return { ...g, ideas: g.ideas.map(idea => idea.id === ideaId ? { ...idea, text } : idea) };
            }
            return g;
        }));
    };
    
    const removeIdea = (groupId: string, ideaId: string) => {
        setGroups(groups.map(g => {
            if (g.id === groupId) {
                return { ...g, ideas: g.ideas.filter(idea => idea.id !== ideaId) };
            }
            return g;
        }));
    };
    
    const handleAskGemini = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        const results = await generateBrainstormingIdeas(topic);
        const newIdeas = results.map((text: string) => ({ id: `idea-${Date.now()}-${Math.random()}`, text }));
        
        // If there are no groups, create one. Otherwise, add to the first group.
        if (groups.length === 0) {
            setGroups([{ id: 'g1', name: 'Gemini Ideas', ideas: newIdeas }]);
        } else {
             setGroups(groups.map((g, index) => index === 0 ? { ...g, ideas: [...g.ideas, ...newIdeas] } : g));
        }

        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="brainstorming-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('brainstormingTopicLabel')}</label>
                <input
                    id="brainstorming-topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('brainstormingTopicPlaceholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
             <div className="flex items-center justify-end">
                <GeminiButton onClick={handleAskGemini} isLoading={isLoading} disabled={!topic.trim()} text={t('geminiGenerateIdeas')} loadingText={t('geminiGenerating')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                    <div key={group.id} className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <input
                                type="text"
                                value={group.name}
                                onChange={e => updateGroupName(group.id, e.target.value)}
                                className="text-lg font-bold text-indigo-700 dark:text-indigo-400 bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 rounded-md p-1 -ml-1 w-full"
                                placeholder={t('brainstormingGroupPlaceholder')}
                            />
                             <button onClick={() => removeGroup(group.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 ml-2 rounded-full">&times;</button>
                        </div>
                        <div className="space-y-2 flex-grow">
                            {group.ideas.map(idea => (
                                <div key={idea.id} className="flex items-center space-x-2">
                                    <span className="text-indigo-500">&bull;</span>
                                    <input
                                        type="text"
                                        value={idea.text}
                                        onChange={e => updateIdeaText(group.id, idea.id, e.target.value)}
                                        className="flex-grow p-1 border-b-2 border-transparent focus:border-indigo-500 outline-none bg-transparent"
                                        placeholder={t('brainstormingIdeaPlaceholder')}
                                    />
                                    <button onClick={() => removeIdea(group.id, idea.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">&times;</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => addIdea(group.id)} className="mt-3 bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-md hover:bg-indigo-200 dark:hover:bg-slate-600 transition-colors text-sm font-semibold self-start">+ {t('brainstormingAddIdea')}</button>
                    </div>
                ))}
            </div>
            
            <button onClick={addGroup} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-semibold">{t('brainstormingAddGroup')}</button>
        </div>
    );
};

export default Brainstorming;
