import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { SWOTData } from '../../types';
import { generateSWOT } from '../../services/geminiService';
import GeminiButton from '../common/GeminiButton';
import { useTranslation } from '../../contexts/LanguageContext';

type SWOTCategory = keyof SWOTData;

const SWOTAnalysis: React.FC = () => {
    const { t } = useTranslation();
    const [topic, setTopic] = useLocalStorage('swot_topic', 'starting a coffee shop');
    const [data, setData] = useLocalStorage<SWOTData>('swot_data', {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = (category: SWOTCategory, index: number, value: string) => {
        const newData = { ...data };
        newData[category][index] = value;
        setData(newData);
    };

    const handleAdd = (category: SWOTCategory) => {
        const newData = { ...data };
        newData[category].push('');
        setData(newData);
    };

    const handleRemove = (category: SWOTCategory, index: number) => {
        const newData = { ...data };
        newData[category].splice(index, 1);
        setData(newData);
    };

    const handleAskGemini = async () => {
        setIsLoading(true);
        const result = await generateSWOT(topic);
        if (result) {
            setData(currentData => ({
                strengths: [...currentData.strengths, ...result.strengths],
                weaknesses: [...currentData.weaknesses, ...result.weaknesses],
                opportunities: [...currentData.opportunities, ...result.opportunities],
                threats: [...currentData.threats, ...result.threats],
            }));
        }
        setIsLoading(false);
    };

    const categoryStyles = {
        strengths: { title: t('swotStrengths'), placeholder: t('swotNewStrengths'), color: 'green', bg: 'bg-green-500/10', text: 'text-green-800 dark:text-green-300', button: 'bg-green-500 hover:bg-green-600' },
        weaknesses: { title: t('swotWeaknesses'), placeholder: t('swotNewWeaknesses'), color: 'red', bg: 'bg-red-500/10', text: 'text-red-800 dark:text-red-300', button: 'bg-red-500 hover:bg-red-600' },
        opportunities: { title: t('swotOpportunities'), placeholder: t('swotNewOpportunities'), color: 'blue', bg: 'bg-blue-500/10', text: 'text-blue-800 dark:text-blue-300', button: 'bg-blue-500 hover:bg-blue-600' },
        threats: { title: t('swotThreats'), placeholder: t('swotNewThreats'), color: 'yellow', bg: 'bg-yellow-500/10', text: 'text-yellow-800 dark:text-yellow-300', button: 'bg-yellow-500 hover:bg-yellow-600' },
    };

    const renderCategory = (category: SWOTCategory) => {
        const styles = categoryStyles[category];
        return (
            <div className={`${styles.bg} p-4 rounded-lg shadow-sm`}>
                <h3 className={`text-xl font-bold ${styles.text} mb-3`}>{styles.title}</h3>
                <div className="space-y-2">
                    {data[category].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleUpdate(category, index, e.target.value)}
                                className="flex-grow w-full p-2 border-b-2 border-transparent focus:border-indigo-500 outline-none bg-white dark:bg-slate-800 rounded-md"
                                placeholder={styles.placeholder}
                            />
                            <button onClick={() => handleRemove(category, index)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full transition">&times;</button>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleAdd(category)} className={`mt-3 text-white px-3 py-1 rounded-md transition-colors text-sm font-semibold ${styles.button}`}>+ {t('prosConsAdd')}</button>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="swot-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('swotTopicLabel')}</label>
                <input
                    id="swot-topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('swotTopicPlaceholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            <div className="flex items-center justify-end">
                <GeminiButton onClick={handleAskGemini} isLoading={isLoading} disabled={!topic.trim()} text={t('geminiAnalyze')} loadingText={t('geminiGenerating')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderCategory('strengths')}
                {renderCategory('weaknesses')}
                {renderCategory('opportunities')}
                {renderCategory('threats')}
            </div>
        </div>
    );
};

export default SWOTAnalysis;
