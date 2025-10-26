import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { NominalIdea } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

const NominalGroupTechnique: React.FC = () => {
    const { t } = useTranslation();
    const [topic, setTopic] = useLocalStorage('nominal_topic', '');
    const [step, setStep] = useLocalStorage('nominal_step', 1);
    const [privateIdeas, setPrivateIdeas] = useLocalStorage('nominal_privateIdeas', '');
    const [sharedIdeas, setSharedIdeas] = useLocalStorage<NominalIdea[]>('nominal_sharedIdeas', []);
    const [votesLeft, setVotesLeft] = useLocalStorage('nominal_votesLeft', 5);

    const handleConsolidate = () => {
        const ideasFromText = privateIdeas.split('\n').filter(line => line.trim() !== '');
        const newIdeas: NominalIdea[] = ideasFromText.map(idea => ({
            id: `idea-${Date.now()}-${Math.random()}`,
            text: idea,
            votes: 0,
        }));
        setSharedIdeas(newIdeas);
        setVotesLeft(Math.max(3, Math.floor(newIdeas.length / 2)));
        setStep(2);
    };

    const handleVote = (id: string) => {
        if (votesLeft > 0) {
            setSharedIdeas(sharedIdeas.map(idea =>
                idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
            ));
            setVotesLeft(votesLeft - 1);
        }
    };

    const handleReset = () => {
        setStep(1);
        setPrivateIdeas('');
        setSharedIdeas([]);
        setVotesLeft(5);
    };
    
    const sortedIdeas = [...sharedIdeas].sort((a, b) => b.votes - a.votes);

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="nominal-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('nominalGroupTopicLabel')}</label>
                <input
                    id="nominal-topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('nominalGroupTopicPlaceholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    disabled={step === 2}
                />
            </div>
            
            {step === 1 && (
                <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-2">{t('nominalGroupStep1')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('nominalGroupStep1Instruction')}</p>
                    <textarea
                        value={privateIdeas}
                        onChange={(e) => setPrivateIdeas(e.target.value)}
                        rows={8}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder={t('nominalGroupIdeasPlaceholder')}
                    />
                    <button onClick={handleConsolidate} disabled={!privateIdeas.trim()} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 transition-colors font-semibold">
                        {t('nominalGroupNextStep')}
                    </button>
                </div>
            )}
            
            {step === 2 && (
                 <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h3 className="text-lg font-semibold">{t('nominalGroupStep2')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('nominalGroupStep2Instruction')}</p>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-3xl text-indigo-600 dark:text-indigo-400">{votesLeft}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('nominalGroupVotesLeft')}</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {sortedIdeas.map(idea => (
                            <div key={idea.id} onClick={() => handleVote(idea.id)} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-md shadow-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-700/50 transition-colors">
                                <p className="flex-grow">{idea.text}</p>
                                <div className="ml-4 flex items-center space-x-2 text-indigo-600 dark:text-indigo-300">
                                    <span className="font-bold text-lg">{idea.votes}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleReset} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-semibold">
                        {t('nominalGroupReset')}
                    </button>
                </div>
            )}

        </div>
    );
};

export default NominalGroupTechnique;
