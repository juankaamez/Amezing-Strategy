import React, { useState, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { HatColor, HatNotes, HAT_COLORS } from '../../types';
import { getHatsData } from '../../constants';
import { generateHatThoughts } from '../../services/geminiService';
import GeminiButton from '../common/GeminiButton';
import { useTranslation } from '../../contexts/LanguageContext';

const SixThinkingHats: React.FC = () => {
    const { t } = useTranslation();
    const HATS_DATA = useMemo(() => getHatsData(t), [t]);
    const [topic, setTopic] = useLocalStorage('sixHats_topic', 'redesigning our company website');
    const [notes, setNotes] = useLocalStorage<HatNotes>('sixHats_notes', {
        blue: [], white: [], red: [], black: [], yellow: [], green: []
    });
    const [activeHat, setActiveHat] = useState<HatColor>('blue');
    const [loadingHat, setLoadingHat] = useState<HatColor | null>(null);

    const handleAddNote = (hat: HatColor) => {
        setNotes(prev => ({ ...prev, [hat]: [...prev[hat], ''] }));
    };

    const handleUpdateNote = (hat: HatColor, index: number, text: string) => {
        setNotes(prev => {
            const newNotes = [...prev[hat]];
            newNotes[index] = text;
            return { ...prev, [hat]: newNotes };
        });
    };
    
    const handleRemoveNote = (hat: HatColor, index: number) => {
        setNotes(prev => ({ ...prev, [hat]: prev[hat].filter((_, i) => i !== index) }));
    };

    const handleAskGemini = async (hat: HatColor) => {
        setLoadingHat(hat);
        const hatInfo = HATS_DATA[hat];
        const thoughts = await generateHatThoughts(topic, hatInfo.name, hatInfo.description);
        setNotes(prev => ({ ...prev, [hat]: [...prev[hat], ...thoughts] }));
        setLoadingHat(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="hat-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sixHatsTopicLabel')}</label>
                <input
                    id="hat-topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('sixHatsTopicPlaceholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>

            <div className="flex flex-wrap gap-2 justify-center p-2 bg-slate-100 dark:bg-slate-800/50 rounded-full">
                {HAT_COLORS.map(color => {
                    const hat = HATS_DATA[color];
                    const isActive = activeHat === color;
                    let buttonClass = '';
                    if (color === 'black') {
                        buttonClass = isActive ? `bg-gray-900 text-white ring-2 ring-gray-400` : 'bg-gray-700 text-gray-200 hover:bg-gray-600';
                    } else if (color === 'white') {
                         buttonClass = isActive ? `bg-white text-black ring-2 ring-gray-400` : 'bg-white/70 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600';
                    }
                    else {
                        buttonClass = isActive ? `${hat.bgColor} ${hat.textColor} ring-2 ${hat.borderColor}` : 'bg-white/70 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600';
                    }

                    return (
                        <button key={color} onClick={() => setActiveHat(color)} className={`px-4 py-2 rounded-full border border-transparent text-sm font-semibold transition-all duration-200 focus:outline-none ${buttonClass}`}>
                            {hat.name}
                        </button>
                    )
                })}
            </div>

            <div className="mt-4">
                {HAT_COLORS.map(color => {
                    const hat = HATS_DATA[color];
                    return (
                        <div key={color} className={activeHat === color ? 'block' : 'hidden'}>
                            <div className={`p-4 rounded-lg border ${hat.borderColor} ${hat.bgColor}`}>
                                <h3 className={`text-xl font-bold ${hat.textColor}`}>{hat.name}</h3>
                                <p className={`text-sm mb-4 ${hat.textColor} opacity-90`}>{hat.description}</p>
                                <div className="space-y-2">
                                    {notes[color].map((note, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={note}
                                                onChange={(e) => handleUpdateNote(color, index, e.target.value)}
                                                className={`flex-grow p-2 border-b-2 bg-white/70 dark:bg-slate-900/30 border-transparent focus:border-indigo-500 outline-none rounded-t-md ${hat.textColor}`}
                                                placeholder={t('hatAddThoughtPlaceholder')}
                                            />
                                            <button onClick={() => handleRemoveNote(color, index)} className={`p-1 rounded-full ${hat.textColor} opacity-60 hover:opacity-100`}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <button onClick={() => handleAddNote(color)} className={`bg-black/10 dark:bg-white/10 ${hat.textColor} px-3 py-1 rounded-md hover:bg-black/20 dark:hover:bg-white/20 transition-colors text-sm font-semibold`}>+ {t('hatAddNote')}</button>
                                    <GeminiButton text={t('geminiGetIdeas')} loadingText={t('geminiGenerating')} onClick={() => handleAskGemini(color)} isLoading={loadingHat === color} disabled={!topic.trim()} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SixThinkingHats;
