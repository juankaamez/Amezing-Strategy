import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { DelphiRound } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { getDelphiFeedback } from '../../services/geminiService';
import GeminiButton from '../common/GeminiButton';

const DelphiMethod: React.FC = () => {
    const { t } = useTranslation();
    const [question, setQuestion] = useLocalStorage('delphi_question', '');
    const [rounds, setRounds] = useLocalStorage<DelphiRound[]>('delphi_rounds', []);
    const [currentResponse, setCurrentResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStartNewRound = () => {
        setCurrentResponse('');
        // This effectively starts a new "session" but keeps the history.
        // A more complex implementation might clear rounds, but this allows reviewing past sessions.
    };

    const handleGetFeedback = async () => {
        if (!currentResponse.trim()) return;
        setIsLoading(true);

        const feedback = await getDelphiFeedback(question, currentResponse);
        
        const newRound: DelphiRound = {
            id: `r${Date.now()}`,
            userResponse: currentResponse,
            aiFeedback: feedback,
        };
        
        setRounds([...rounds, newRound]);
        setCurrentResponse(''); // Clear for next round
        setIsLoading(false);
    };

    const currentRoundNumber = rounds.length + 1;

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="delphi-question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('delphiQuestionLabel')}</label>
                <input
                    id="delphi-question"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t('delphiQuestionPlaceholder')}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>

            {/* Past Rounds */}
            {rounds.length > 0 && (
                <div className="space-y-4 opacity-70 border-t pt-4 border-slate-200 dark:border-slate-700">
                    {rounds.map((round, index) => (
                        <div key={round.id} className="space-y-4">
                            <div className="p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg">
                                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('delphiYourResponse', { round: index + 1 })}</h3>
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{round.userResponse}</p>
                            </div>
                            <div className="p-4 bg-indigo-500/10 rounded-lg">
                                <h3 className="text-md font-semibold text-indigo-800 dark:text-indigo-300 mb-2">{t('delphiAIResponse')}</h3>
                                <p className="text-indigo-700 dark:text-indigo-200 whitespace-pre-wrap">{round.aiFeedback}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}


             {/* Current Round */}
            <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('delphiYourResponse', { round: currentRoundNumber })}</h3>
                <textarea
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    rows={6}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder={t('delphiRefineAnswer')}
                    disabled={isLoading}
                />
                <div className="mt-3">
                    <GeminiButton 
                        onClick={handleGetFeedback}
                        isLoading={isLoading}
                        disabled={!question.trim() || !currentResponse.trim()}
                        text={t('delphiGetFeedback')}
                        loadingText={t('geminiGenerating')}
                    />
                </div>
            </div>
        </div>
    );
};

export default DelphiMethod;
