import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { FishboneCategory, FishboneCause } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import GeminiButton from '../common/GeminiButton';
import { generateFishboneCauses } from '../../services/geminiService';

const FishboneDiagram: React.FC = () => {
    const { t } = useTranslation();
    const [problem, setProblem] = useLocalStorage('fishbone_problem', '');
    const [categories, setCategories] = useLocalStorage<FishboneCategory[]>('fishbone_categories', [
        { id: 'c1', name: 'People', causes: [] },
        { id: 'c2', name: 'Process', causes: [] },
        { id: 'c3', name: 'Technology', causes: [] },
        { id: 'c4', name: 'Environment', causes: [] },
    ]);
    const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

    const addCategory = () => {
        const newCategory: FishboneCategory = { id: `c${Date.now()}`, name: '', causes: [] };
        setCategories([...categories, newCategory]);
    };

    const updateCategoryName = (id: string, name: string) => {
        setCategories(categories.map(c => c.id === id ? { ...c, name } : c));
    };
    
    const removeCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    const addCause = (categoryId: string) => {
        const newCause: FishboneCause = { id: `cause${Date.now()}`, text: '' };
        setCategories(categories.map(c => c.id === categoryId ? { ...c, causes: [...c.causes, newCause] } : c));
    };

    const updateCauseText = (categoryId: string, causeId: string, text: string) => {
        setCategories(categories.map(c => {
            if (c.id === categoryId) {
                return { ...c, causes: c.causes.map(cause => cause.id === causeId ? { ...cause, text } : cause) };
            }
            return c;
        }));
    };

    const removeCause = (categoryId: string, causeId: string) => {
        setCategories(categories.map(c => {
            if (c.id === categoryId) {
                return { ...c, causes: c.causes.filter(cause => cause.id !== causeId) };
            }
            return c;
        }));
    };

    const handleAskGemini = async (category: FishboneCategory) => {
        if (!problem.trim() || !category.name.trim()) return;
        setLoadingCategory(category.id);
        const results = await generateFishboneCauses(problem, category.name);
        const newCauses = results.map((text: string) => ({ id: `cause-${Date.now()}-${Math.random()}`, text }));
        setCategories(categories.map(c => c.id === category.id ? { ...c, causes: [...c.causes, ...newCauses] } : c));
        setLoadingCategory(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="fishbone-problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fishboneProblemLabel')}</label>
                <input
                    id="fishbone-problem"
                    type="text"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder={t('fishboneProblemPlaceholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>

            <div className="space-y-4">
                {categories.map(category => (
                    <div key={category.id} className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                             <input
                                type="text"
                                value={category.name}
                                onChange={e => updateCategoryName(category.id, e.target.value)}
                                className="text-lg font-bold text-indigo-700 dark:text-indigo-400 bg-transparent outline-none focus:ring-1 focus:ring-indigo-500 rounded-md p-1 -ml-1"
                                placeholder={t('fishboneCategoryPlaceholder')}
                            />
                            <button onClick={() => removeCategory(category.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">&times;</button>
                        </div>
                        <div className="space-y-2 pl-4 border-l-2 border-indigo-200 dark:border-slate-600">
                            {category.causes.map(cause => (
                                <div key={cause.id} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={cause.text}
                                        onChange={e => updateCauseText(category.id, cause.id, e.target.value)}
                                        className="flex-grow p-1 border-b-2 border-transparent focus:border-indigo-500 outline-none bg-transparent"
                                        placeholder={t('fishboneCausePlaceholder')}
                                    />
                                    <button onClick={() => removeCause(category.id, cause.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">&times;</button>
                                </div>
                            ))}
                        </div>
                         <div className="mt-3 flex items-center gap-4">
                            <button onClick={() => addCause(category.id)} className="bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-md hover:bg-indigo-200 dark:hover:bg-slate-600 transition-colors text-sm font-semibold">+ {t('fishboneAddCause')}</button>
                            <GeminiButton text={t('geminiSuggestCauses')} loadingText={t('geminiGenerating')} onClick={() => handleAskGemini(category)} isLoading={loadingCategory === category.id} disabled={!problem.trim() || !category.name.trim()} />
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={addCategory} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-semibold">{t('fishboneAddCategory')}</button>
        </div>
    );
};

export default FishboneDiagram;
