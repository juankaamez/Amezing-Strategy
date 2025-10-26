import React, { useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Criterion, Option } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

const DecisionMatrix: React.FC = () => {
    const { t } = useTranslation();
    const [criteria, setCriteria] = useLocalStorage<Criterion[]>('matrix_criteria', [
        { id: 'c1', name: 'Cost', weight: 5 },
        { id: 'c2', name: 'Ease of Use', weight: 4 },
    ]);
    const [options, setOptions] = useLocalStorage<Option[]>('matrix_options', [
        { id: 'o1', name: 'Option A', scores: { c1: 3, c2: 5 } },
        { id: 'o2', name: 'Option B', scores: { c1: 5, c2: 2 } },
    ]);

    const addCriterion = () => setCriteria([...criteria, { id: `c${Date.now()}`, name: '', weight: 3 }]);
    const addOption = () => {
        const newScores = criteria.reduce((acc, c) => ({...acc, [c.id]: 0}), {});
        setOptions([...options, { id: `o${Date.now()}`, name: '', scores: newScores }]);
    };
    
    const updateCriterion = (id: string, field: 'name' | 'weight', value: string | number) => {
        setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
    };
    
    const updateOptionName = (id: string, name: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, name } : o));
    };

    const updateScore = (optionId: string, criterionId: string, score: number) => {
        setOptions(options.map(o => o.id === optionId ? { ...o, scores: { ...o.scores, [criterionId]: score } } : o));
    };

    const removeCriterion = (id: string) => {
        setCriteria(criteria.filter(c => c.id !== id));
        setOptions(options.map(o => {
            const newScores = { ...o.scores };
            delete newScores[id];
            return { ...o, scores: newScores };
        }));
    };

    const removeOption = (id: string) => setOptions(options.filter(o => o.id !== id));

    const results = useMemo(() => {
        return options.map(option => {
            const totalScore = criteria.reduce((sum, criterion) => {
                const score = option.scores[criterion.id] || 0;
                return sum + (score * criterion.weight);
            }, 0);
            return { ...option, totalScore };
        }).sort((a, b) => b.totalScore - a.totalScore);
    }, [options, criteria]);

    return (
        <div className="overflow-x-auto">
            <div className="p-2 inline-block min-w-full">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-slate-700/50">
                            <th className="p-3 font-bold uppercase text-gray-600 dark:text-gray-300 border border-slate-300 dark:border-slate-600 text-left">{t('matrixOptions')}</th>
                            {criteria.map(c => (
                                <th key={c.id} className="p-3 font-bold uppercase text-gray-600 dark:text-gray-300 border border-slate-300 dark:border-slate-600 text-center relative">
                                    <input type="text" value={c.name} onChange={e => updateCriterion(c.id, 'name', e.target.value)} className="w-24 p-1 text-center font-bold bg-transparent outline-none focus:bg-white dark:focus:bg-slate-600 rounded" placeholder={t('matrixCriterionPlaceholder')}/>
                                    <div className="font-normal text-sm">
                                        {t('matrixWeight')}: <input type="number" min="1" max="10" value={c.weight} onChange={e => updateCriterion(c.id, 'weight', parseInt(e.target.value))} className="w-12 p-1 text-center bg-transparent outline-none focus:bg-white dark:focus:bg-slate-600 rounded"/>
                                    </div>
                                    <button onClick={() => removeCriterion(c.id)} className="absolute top-0 right-0 m-1 text-gray-400 hover:text-red-500 rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
                                </th>
                            ))}
                            <th className="p-3 font-bold uppercase text-gray-600 dark:text-gray-300 border border-slate-300 dark:border-slate-600 text-center bg-indigo-100 dark:bg-indigo-900/50">{t('matrixTotalScore')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((option, index) => (
                            <tr key={option.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${index === 0 && options.length > 1 ? 'bg-green-50 dark:bg-green-500/10' : ''}`}>
                                <td className="p-3 text-gray-800 dark:text-gray-200 border border-slate-300 dark:border-slate-600 relative">
                                    <input type="text" value={option.name} onChange={e => updateOptionName(option.id, e.target.value)} className="w-full p-1 bg-transparent outline-none focus:bg-white dark:focus:bg-slate-600 rounded" placeholder={t('matrixOptionPlaceholder')}/>
                                    <button onClick={() => removeOption(option.id)} className="absolute top-0 right-0 m-1 text-gray-400 hover:text-red-500 rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
                                </td>
                                {criteria.map(c => (
                                    <td key={`${option.id}-${c.id}`} className="p-3 text-gray-800 dark:text-gray-200 border border-slate-300 dark:border-slate-600 text-center">
                                        <input type="number" min="0" max="10" value={option.scores[c.id] || 0} onChange={e => updateScore(option.id, c.id, parseInt(e.target.value))} className="w-20 p-1 text-center outline-none focus:ring-2 focus:ring-indigo-400 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600"/>
                                    </td>
                                ))}
                                <td className={`p-3 border border-slate-300 dark:border-slate-600 text-center font-bold text-lg text-indigo-700 dark:text-indigo-300 ${index === 0 && options.length > 1 ? 'bg-green-100 dark:bg-green-800/20' : 'bg-indigo-100 dark:bg-indigo-900/50'}`}>
                                    {option.totalScore}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex space-x-4">
                <button onClick={addCriterion} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-semibold">{t('matrixAddCriterion')}</button>
                <button onClick={addOption} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-semibold">{t('matrixAddOption')}</button>
            </div>
        </div>
    );
};

export default DecisionMatrix;
