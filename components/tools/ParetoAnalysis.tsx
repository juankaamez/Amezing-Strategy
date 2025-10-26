import React, { useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ParetoItem } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

const ParetoAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useLocalStorage<ParetoItem[]>('pareto_items', [
    { id: '1', problem: 'Slow website loading time', impact: 40 },
    { id: '2', problem: 'Poor mobile experience', impact: 30 },
    { id: '3', problem: 'Complicated checkout process', impact: 20 },
    { id: '4', problem: 'Lack of product reviews', impact: 5 },
    { id: '5', problem: 'Inaccurate search results', impact: 5 },
  ]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), problem: '', impact: 10 }]);
  };

  const handleUpdateItem = (id: string, field: 'problem' | 'impact', value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b.impact - a.impact);
  }, [items]);

  const totalImpact = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.impact), 0);
  }, [items]);

  let cumulativePercentage = 0;
  const chartData = sortedItems.map(item => {
    const percentage = totalImpact > 0 ? (Number(item.impact) / totalImpact) * 100 : 0;
    cumulativePercentage += percentage;
    return { ...item, percentage, cumulativePercentage };
  });

  const vitalFewIndex = chartData.findIndex(item => item.cumulativePercentage >= 80);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{t('paretoListProblems')}</h3>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center space-x-2 p-2 bg-white dark:bg-slate-700/50 rounded-md shadow-sm">
              <input
                type="text"
                value={item.problem}
                onChange={e => handleUpdateItem(item.id, 'problem', e.target.value)}
                className="flex-grow p-1 border-b-2 border-transparent focus:border-indigo-500 outline-none bg-transparent"
                placeholder={t('paretoProblemPlaceholder')}
              />
              <input
                type="number"
                value={item.impact}
                onChange={e => handleUpdateItem(item.id, 'impact', parseInt(e.target.value, 10))}
                className="w-20 p-1 border rounded-md text-center bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500"
                placeholder={t('paretoImpact')}
              />
              <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">&times;</button>
            </div>
          ))}
        </div>
        <button onClick={handleAddItem} className="mt-3 bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition-colors text-sm font-semibold">+ {t('paretoAddItem')}</button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{t('paretoAnalysisResults')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('paretoVitalFew')}</p>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          {chartData.map((item, index) => {
            const isVitalFew = index <= vitalFewIndex;
            return (
              <div key={item.id} className={`p-3 rounded-md mb-2 flex items-center gap-4 ${isVitalFew ? 'bg-green-500/10 border-l-4 border-green-500' : 'bg-yellow-500/10 border-l-4 border-yellow-400'}`}>
                <div className="flex-grow">
                  <p className={`font-semibold ${isVitalFew ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}`}>{item.problem}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('paretoImpact')}: {item.impact} ({item.percentage.toFixed(1)}%)</p>
                </div>
                <div className="w-1/3">
                  <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded-full w-full overflow-hidden">
                    <div className="h-4 bg-indigo-500 rounded-full" style={{ width: `${item.cumulativePercentage}%` }}></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-indigo-700 dark:text-indigo-300 font-semibold">{item.cumulativePercentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParetoAnalysis;
