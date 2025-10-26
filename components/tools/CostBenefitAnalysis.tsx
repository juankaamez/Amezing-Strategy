import React, { useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { CostBenefitItem } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

const CostBenefitAnalysis: React.FC = () => {
    const { t } = useTranslation();
    const [items, setItems] = useLocalStorage<CostBenefitItem[]>('costBenefit_items', [
        { id: 'c1', description: 'Software License', amount: 5000, type: 'cost' },
        { id: 'c2', description: 'Employee Training', amount: 10000, type: 'cost' },
        { id: 'b1', description: 'Increased Productivity', amount: 30000, type: 'benefit' },
        { id: 'b2', description: 'Reduced Errors', amount: 8000, type: 'benefit' },
    ]);

    const handleAddItem = (type: 'cost' | 'benefit') => {
        setItems([...items, { id: `${type[0]}${Date.now()}`, description: '', amount: 0, type }]);
    };
    
    const handleUpdateItem = (id: string, field: 'description' | 'amount', value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };
    
    const { totalCosts, totalBenefits, netBenefit } = useMemo(() => {
        const totalCosts = items.filter(i => i.type === 'cost').reduce((sum, i) => sum + Number(i.amount), 0);
        const totalBenefits = items.filter(i => i.type === 'benefit').reduce((sum, i) => sum + Number(i.amount), 0);
        const netBenefit = totalBenefits - totalCosts;
        return { totalCosts, totalBenefits, netBenefit };
    }, [items]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const ItemList: React.FC<{ type: 'cost' | 'benefit' }> = ({ type }) => {
        const isCost = type === 'cost';
        const title = isCost ? t('costBenefitCosts') : t('costBenefitBenefits');
        const color = isCost ? 'red' : 'green';
        
        return (
            <div className={`bg-${color}-500/10 p-4 rounded-lg`}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className={`text-xl font-bold text-${color}-800 dark:text-${color}-300`}>{title}</h3>
                    <button onClick={() => handleAddItem(type)} className={`bg-${color}-500 text-white px-3 py-1 rounded-md hover:bg-${color}-600 transition-colors text-sm font-semibold`}>+ {t('prosConsAdd')}</button>
                </div>
                <div className="space-y-2">
                    {items.filter(i => i.type === type).map(item => (
                        <div key={item.id} className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-2 rounded-md shadow-sm">
                            <input
                                type="text"
                                value={item.description}
                                onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                                className="flex-grow p-1 border-b-2 border-transparent focus:outline-none focus:border-indigo-500 bg-transparent"
                                placeholder={t('costBenefitDescriptionPlaceholder')}
                            />
                            <span className="text-gray-400">$</span>
                            <input
                                type="number"
                                value={item.amount}
                                onChange={e => handleUpdateItem(item.id, 'amount', Number(e.target.value))}
                                className="w-28 p-1 border rounded-md text-right bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
                            />
                            <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">&times;</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ItemList type="cost" />
                <ItemList type="benefit" />
            </div>

            <div className="mt-6 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-inner border border-slate-200 dark:border-slate-700">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">{t('costBenefitFinancialSummary')}</h4>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-500/10 rounded-lg">
                        <p className="text-sm font-medium text-red-700 dark:text-red-300 text-center">{t('costBenefitTotalCosts')}</p>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-200 text-center">{formatCurrency(totalCosts)}</p>
                    </div>
                    <div className="p-4 bg-green-500/10 rounded-lg">
                        <p className="text-sm font-medium text-green-700 dark:text-green-300 text-center">{t('costBenefitTotalBenefits')}</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-200 text-center">{formatCurrency(totalBenefits)}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${netBenefit >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10'}`}>
                        <p className={`text-sm font-medium text-center ${netBenefit >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>{t('costBenefitNetBenefit')}</p>
                        <p className={`text-2xl font-bold text-center ${netBenefit >= 0 ? 'text-blue-900 dark:text-blue-200' : 'text-orange-900 dark:text-orange-200'}`}>{formatCurrency(netBenefit)}</p>
                    </div>
                </div>
                 <div className={`mt-6 text-2xl font-extrabold text-center ${netBenefit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {netBenefit > 0 ? t('costBenefitViable') : netBenefit < 0 ? t('costBenefitOutweigh') : t('costBenefitBalanced')}
                </div>
            </div>
        </div>
    );
};

export default CostBenefitAnalysis;
