import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-transform duration-300 ease-in-out animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full p-2 -mr-2"
                        aria-label={t('closeModal')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <main className="overflow-y-auto p-6 flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Modal;
