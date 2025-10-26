import React from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { StepladderPerspective } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

const Stepladder: React.FC = () => {
    const { t } = useTranslation();
    const [problem, setProblem] = useLocalStorage('stepladder_problem', '');
    const [initialThoughts, setInitialThoughts] = useLocalStorage('stepladder_initial', '');
    const [perspectives, setPerspectives] = useLocalStorage<StepladderPerspective[]>('stepladder_perspectives', []);

    const addPerspective = () => {
        setPerspectives([...perspectives, { id: Date.now().toString(), title: '', ideas: [''] }]);
    };

    const updatePerspectiveTitle = (id: string, title: string) => {
        setPerspectives(perspectives.map(p => p.id === id ? { ...p, title } : p));
    };
    
    const removePerspective = (id: string) => {
        setPerspectives(perspectives.filter(p => p.id !== id));
    };

    const addIdeaToPerspective = (id: string) => {
        setPerspectives(perspectives.map(p => p.id === id ? { ...p, ideas: [...p.ideas, ''] } : p));
    };

    const updateIdeaInPerspective = (id: string, index: number, text: string) => {
        setPerspectives(perspectives.map(p => {
            if (p.id === id) {
                const newIdeas = [...p.ideas];
                newIdeas[index] = text;
                return { ...p, ideas: newIdeas };
            }
            return p;
        }));
    };
    
    const removeIdeaFromPerspective = (id: string, index: number) => {
         setPerspectives(perspectives.map(p => {
            if (p.id === id) {
                return { ...p, ideas: p.ideas.filter((_, i) => i !== index) };
            }
            return p;
        }));
    };

    return (
        <div className="space-y-6">
             <div>
                <label htmlFor="stepladder-problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('stepladderProblemLabel')}</label>
                <input
                    id="stepladder-problem"
                    type="text"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder={t('stepladderProblemPlaceholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            
            <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('stepladderInitialThoughts')}</h3>
                <textarea
                    value={initialThoughts}
                    onChange={e => setInitialThoughts(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder={t('stepladderInitialPlaceholder')}
                />
            </div>

            <div className="space-y-4">
                {perspectives.map(p => (
                    <div key={p.id} className="p-4 border-l-4 border-indigo-400 dark:border-indigo-600 bg-slate-100/50 dark:bg-slate-800/50 rounded-r-lg">
                        <div className="flex justify-between items-center mb-2">
                             <input
                                type="text"
                                value={p.title}
                                onChange={e => updatePerspectiveTitle(p.id, e.target.value)}
                                className="font-bold text-lg text-indigo-700 dark:text-indigo-300 bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 rounded-md p-1 w-full -ml-1"
                                placeholder={t('stepladderPerspectiveTitlePlaceholder')}
                            />
                            <button onClick={() => removePerspective(p.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">&times;</button>
                        </div>
                        <div className="space-y-2">
                            {p.ideas.map((idea, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <span className="text-indigo-500">&bull;</span>
                                    <input
                                        type="text"
                                        value={idea}
                                        onChange={e => updateIdeaInPerspective(p.id, index, e.target.value)}
                                        className="flex-grow p-1 border-b-2 border-transparent focus:border-indigo-500 outline-none bg-transparent"
                                        placeholder={t('stepladderPerspectiveIdeaPlaceholder')}
                                    />
                                    <button onClick={() => removeIdeaFromPerspective(p.id, index)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">&times;</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => addIdeaToPerspective(p.id)} className="mt-3 bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-md hover:bg-indigo-200 dark:hover:bg-slate-600 transition-colors text-sm font-semibold">+ {t('brainstormingAddIdea')}</button>
                    </div>
                ))}
            </div>

            <button onClick={addPerspective} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-semibold">{t('stepladderAddPerspective')}</button>
        </div>
    );
};

export default Stepladder;
