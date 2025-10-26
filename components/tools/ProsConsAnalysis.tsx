import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ProConItem } from '../../types';
import { generateProsCons } from '../../services/geminiService';
import GeminiButton from '../common/GeminiButton';
import { useTranslation } from '../../contexts/LanguageContext';

const ProsConsAnalysis: React.FC = () => {
    const { t } = useTranslation();
    const [topic, setTopic] = useLocalStorage('prosCons_topic', 'launching a new product');
    const [pros, setPros] = useLocalStorage<ProConItem[]>('prosCons_pros', []);
    const [cons, setCons] = useLocalStorage<ProConItem[]>('prosCons_cons', []);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddItem = (type: 'pro' | 'con') => {
        const newItem: ProConItem = { id: Date.now().toString(), text: '', weight: 1 };
        if (type === 'pro') {
            setPros([...pros, newItem]);
        } else {
            setCons([...cons, newItem]);
        }
    };

    const handleUpdateItem = (id: string, text: string, type: 'pro' | 'con') => {
        const list = type === 'pro' ? pros : cons;
        const setList = type === 'pro' ? setPros : setCons;
        setList(list.map(item => item.id === id ? { ...item, text } : item));
    };
    
    const handleUpdateWeight = (id: string, weight: number, type: 'pro' | 'con') => {
        const list = type === 'pro' ? pros : cons;
        const setList = type === 'pro' ? setPros : setCons;
        setList(list.map(item => item.id === id ? { ...item, weight: Math.max(1, Math.min(5, weight)) } : item));
    };

    const handleRemoveItem = (id: string, type: 'pro' | 'con') => {
        const list = type === 'pro' ? pros : cons;
        const setList = type === 'pro' ? setPros : setCons;
        setList(list.filter(item => item.id !== id));
    };

    const handleAskGemini = async () => {
        setIsLoading(true);
        const result = await generateProsCons(topic);
        if (result) {
            const newPros = result.pros.map((p: string) => ({ id: `pro-${Date.now()}-${Math.random()}`, text: p, weight: 1 }));
            const newCons = result.cons.map((c: string) => ({ id: `con-${Date.now()}-${Math.random()}`, text: c, weight: 1 }));
            setPros([...pros, ...newPros]);
            setCons([...cons, ...newCons]);
        }
        setIsLoading(false);
    };

    const totalPros = pros.reduce((sum, item) => sum + item.weight, 0);
    const totalCons = cons.reduce((sum, item) => sum + item.weight, 0);

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="decision-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('prosConsTopicLabel')}</label>
                <input
                    id="decision-topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('prosConsTopicPlaceholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            <div className="flex items-center justify-end">
                <GeminiButton onClick={handleAskGemini} isLoading={isLoading} disabled={!topic.trim()} text={t('geminiGenerateIdeas')} loadingText={t('geminiGenerating')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros Column */}
                <div className="bg-green-500/10 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-300">{t('prosConsPros')}</h3>
                        <button onClick={() => handleAddItem('pro')} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm font-semibold">+ {t('prosConsAdd')}</button>
                    </div>
                    <div className="space-y-2">
                        {pros.map(item => (
                            <div key={item.id} className="flex items-start space-x-2 bg-white dark:bg-slate-800 p-2 rounded-md shadow-sm">
                                <input type="text" value={item.text} onChange={(e) => handleUpdateItem(item.id, e.target.value, 'pro')} className="flex-grow p-1 border-b-2 border-transparent focus:border-green-500 outline-none bg-transparent" placeholder={t('prosConsPositivePlaceholder')}/>
                                <input type="number" value={item.weight} min="1" max="5" onChange={(e) => handleUpdateWeight(item.id, parseInt(e.target.value, 10), 'pro')} className="w-14 p-1 border rounded-md text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"/>
                                <button onClick={() => handleRemoveItem(item.id, 'pro')} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full transition">&times;</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cons Column */}
                <div className="bg-red-500/10 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-bold text-red-800 dark:text-red-300">{t('prosConsCons')}</h3>
                        <button onClick={() => handleAddItem('con')} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm font-semibold">+ {t('prosConsAdd')}</button>
                    </div>
                     <div className="space-y-2">
                        {cons.map(item => (
                            <div key={item.id} className="flex items-start space-x-2 bg-white dark:bg-slate-800 p-2 rounded-md shadow-sm">
                                <input type="text" value={item.text} onChange={(e) => handleUpdateItem(item.id, e.target.value, 'con')} className="flex-grow p-1 border-b-2 border-transparent focus:border-red-500 outline-none bg-transparent" placeholder={t('prosConsNegativePlaceholder')}/>
                                <input type="number" value={item.weight} min="1" max="5" onChange={(e) => handleUpdateWeight(item.id, parseInt(e.target.value, 10), 'con')} className="w-14 p-1 border rounded-md text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"/>
                                <button onClick={() => handleRemoveItem(item.id, 'con')} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full transition">&times;</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-bold">{t('prosConsWeightedScore')}</h4>
                <div className="flex justify-center items-center space-x-8 mt-2">
                    <div className="text-green-600 dark:text-green-400 font-bold text-2xl">{t('prosConsPros')}: {totalPros}</div>
                    <div className="text-red-600 dark:text-red-400 font-bold text-2xl">{t('prosConsCons')}: {totalCons}</div>
                </div>
                 <div className="mt-3 text-2xl font-extrabold">
                    {totalPros > totalCons ? <span className="text-green-700 dark:text-green-400">{t('prosConsGoForIt')}</span> : totalCons > totalPros ? <span className="text-red-700 dark:text-red-400">{t('prosConsReconsider')}</span> : <span className="text-gray-700 dark:text-gray-400">{t('prosConsTie')}</span>}
                </div>
            </div>
        </div>
    );
};

export default ProsConsAnalysis;
