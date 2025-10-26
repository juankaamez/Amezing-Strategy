import React, { useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { MultiVoteOption } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

const MultiVoting: React.FC = () => {
    const { t } = useTranslation();
    const [topic, setTopic] = useLocalStorage('multiVote_topic', '');
    const [options, setOptions] = useLocalStorage<MultiVoteOption[]>('multiVote_options', [
        { id: '1', text: 'Option Alpha', votes: 0 },
        { id: '2', text: 'Option Beta', votes: 0 },
    ]);
    const [totalVotes, setTotalVotes] = useLocalStorage('multiVote_totalVotes', 10);

    const votesCast = useMemo(() => options.reduce((sum, opt) => sum + opt.votes, 0), [options]);
    const votesLeft = totalVotes - votesCast;

    const addOption = () => {
        setOptions([...options, { id: Date.now().toString(), text: '', votes: 0 }]);
    };

    const updateOptionText = (id: string, text: string) => {
        setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
    };
    
    const removeOption = (id: string) => {
        setOptions(options.filter(opt => opt.id !== id));
    };

    const handleVote = (id: string, amount: number) => {
        setOptions(options.map(opt => {
            if (opt.id === id) {
                const newVotes = opt.votes + amount;
                if (amount > 0 && votesLeft <= 0) return opt; // Can't add votes if none left
                return { ...opt, votes: Math.max(0, newVotes) };
            }
            return opt;
        }));
    };
    
    const sortedOptions = useMemo(() => {
        return [...options].sort((a, b) => b.votes - a.votes);
    }, [options]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <label htmlFor="multivote-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('multiVotingTopicLabel')}</label>
                    <input
                        id="multivote-topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={t('multiVotingTopicPlaceholder')}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
                    />
                </div>
                 <div className="flex items-center space-x-4">
                    <label htmlFor="total-votes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('multiVotingTotalVotesLabel')}</label>
                    <input
                        id="total-votes"
                        type="number"
                        min="1"
                        value={totalVotes}
                        onChange={(e) => setTotalVotes(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-24 p-2 border border-slate-300 dark:border-slate-600 rounded-md text-center bg-white dark:bg-slate-700"
                    />
                     <div className="text-center p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                        <div className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">{votesLeft}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">{t('nominalGroupVotesLeft')}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {sortedOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-4 p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-700">
                        <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOptionText(option.id, e.target.value)}
                            className="flex-grow p-1 border-b-2 border-transparent focus:border-indigo-500 outline-none bg-transparent"
                            placeholder={t('multiVotingOptionPlaceholder')}
                        />
                        <div className="flex items-center space-x-2">
                             <button onClick={() => handleVote(option.id, -1)} disabled={option.votes <= 0} className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded-md disabled:opacity-50 transition">-</button>
                            <span className="w-8 text-center font-bold text-lg">{option.votes}</span>
                            <button onClick={() => handleVote(option.id, 1)} disabled={votesLeft <= 0} className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded-md disabled:opacity-50 transition">+</button>
                        </div>
                        <button onClick={() => removeOption(option.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full">&times;</button>
                    </div>
                ))}
            </div>
             <button onClick={addOption} className="mt-3 bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition-colors text-sm font-semibold">+ {t('multiVotingAddOption')}</button>
        </div>
    );
};

export default MultiVoting;
