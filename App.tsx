import React, { useState, useCallback, useMemo } from 'react';
import { getModelsData } from './constants';
import { ModelKey } from './types';
import Modal from './components/Modal';
import ProsConsAnalysis from './components/tools/ProsConsAnalysis';
import SWOTAnalysis from './components/tools/SWOTAnalysis';
import DecisionMatrix from './components/tools/DecisionMatrix';
import SixThinkingHats from './components/tools/SixThinkingHats';
import ParetoAnalysis from './components/tools/ParetoAnalysis';
import CostBenefitAnalysis from './components/tools/CostBenefitAnalysis';
import FishboneDiagram from './components/tools/FishboneDiagram';
import Brainstorming from './components/tools/Brainstorming';
import NominalGroupTechnique from './components/tools/NominalGroupTechnique';
import MultiVoting from './components/tools/MultiVoting';
import Stepladder from './components/tools/Stepladder';
import DelphiMethod from './components/tools/DelphiMethod';
import { useTranslation } from './contexts/LanguageContext';
import HeaderControls from './components/common/HeaderControls';

const App: React.FC = () => {
    const [selectedModel, setSelectedModel] = useState<ModelKey | null>(null);
    const { t } = useTranslation();

    const MODELS_DATA = useMemo(() => getModelsData(t), [t]);

    const openModal = useCallback((modelKey: ModelKey) => {
        setSelectedModel(modelKey);
    }, []);

    const closeModal = useCallback(() => {
        setSelectedModel(null);
    }, []);

    const renderTool = () => {
        if (!selectedModel) return null;

        switch (selectedModel) {
            case 'PROS_CONS':
                return <ProsConsAnalysis />;
            case 'SWOT':
                return <SWOTAnalysis />;
            case 'DECISION_MATRIX':
                return <DecisionMatrix />;
            case 'SIX_HATS':
                return <SixThinkingHats />;
            case 'PARETO':
                return <ParetoAnalysis />;
            case 'COST_BENEFIT':
                return <CostBenefitAnalysis />;
            case 'STEPLADDER':
                return <Stepladder />;
            case 'BRAINSTORMING':
                 return <Brainstorming />;
            case 'DELPHI':
                return <DelphiMethod />;
            case 'FISHBONE':
                return <FishboneDiagram />;
            case 'NOMINAL_GROUP':
                return <NominalGroupTechnique />;
            case 'MULTI_VOTING':
                return <MultiVoting />;
            default:
                return null;
        }
    };
    
    const currentModel = MODELS_DATA.find(m => m.key === selectedModel);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-800/40 dark:via-transparent dark:to-transparent min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <header className="bg-white/80 dark:bg-slate-900/80 shadow-md sticky top-0 z-20 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="container mx-auto px-4 py-6 text-center relative">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-600 animate-gradient">
                        {t('headerTitle')}
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('headerSubtitle')}</p>
                    <HeaderControls />
                </div>
            </header>

            <main className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {MODELS_DATA.map((model) => (
                        <div key={model.key} 
                             className="model-card group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-indigo-500/10 transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer flex flex-col"
                             onClick={() => openModal(model.key)}>
                            <div className="p-6 flex-grow">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                                        {model.icon}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{model.title}</h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{model.description}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700/50 p-4 rounded-b-xl mt-auto">
                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm flex items-center">
                                  {t('openTool')} <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            
            <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
                <p>{t('footerText')}</p>
            </footer>

            {selectedModel && currentModel && (
                 <Modal isOpen={!!selectedModel} onClose={closeModal} title={currentModel.title}>
                    {renderTool()}
                </Modal>
            )}
        </div>
    );
};

export default App;
