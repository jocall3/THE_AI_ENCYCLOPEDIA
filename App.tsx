import React, { useContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SendMoneyView from './components/SendMoneyView';
import InvestmentsView from './components/InvestmentsView';
import AIAdvisorView from './components/AIAdvisorView';
import SecurityView from './components/SecurityView';
import BudgetsView from './components/BudgetsView';
import VoiceControl from './components/VoiceControl';
import QuantumWeaverView from './components/QuantumWeaverView';
import MarketplaceView from './components/MarketplaceView';
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import CryptoView from './components/CryptoView';
import FinancialGoalsView from './components/FinancialGoalsView';
import CreditHealthView from './components/CreditHealthView';
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import SSOView from './components/SSOView';
import APIIntegrationView from './components/APIIntegrationView';
import ConciergeService from './components/ConciergeService';
import PhilanthropyHub from './components/PhilanthropyHub';
import SovereignWealth from './components/SovereignWealth';
import LoginView from './components/LoginView';

import { DataContext } from './context/DataContext';
import { AuthContext } from './context/AuthContext';

const AppContent: React.FC = () => {
    const { isAuthenticated, isLoading } = useContext(AuthContext)!;
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } = useContext(DataContext)!;

    if (isLoading) {
         return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-cyan-500">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginView />;
    }

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard': return <Dashboard />;
            case 'Transactions': return <TransactionsView />;
            case 'Send Money': return <SendMoneyView />;
            case 'Budgets': return <BudgetsView />;
            case 'Financial Goals': return <FinancialGoalsView />;
            case 'Credit Health': return <CreditHealthView />;
            case 'Investments': return <InvestmentsView />;
            case 'Crypto & Web3': return <CryptoView />;
            case 'Algo-Trading Lab': return <AlgoTradingLab />;
            case 'Forex Arena': return <ForexArena />;
            case 'Commodities Exchange': return <CommoditiesExchange />;
            case 'Real Estate Empire': return <RealEstateEmpire />;
            case 'Art & Collectibles': return <ArtCollectibles />;
            case 'Derivatives Desk': return <DerivativesDesk />;
            case 'Venture Capital': return <VentureCapitalDesk />;
            case 'Private Equity': return <PrivateEquityLounge />;
            case 'Tax Optimization': return <TaxOptimizationChamber />;
            case 'Legacy Builder': return <LegacyBuilder />;
            
            case 'Corporate Command': return <CorporateCommandView />;
            case 'Modern Treasury': return <ModernTreasuryView />;
            case 'Card Programs': return <MarqetaDashboardView />;
            case 'Data Network': return <PlaidDashboardView />;
            case 'Payments': return <StripeDashboardView />;
            case 'SSO': return <SSOView />;
            
            case 'AI Advisor': return <AIAdvisorView />;
            case 'Quantum Weaver': return <QuantumWeaverView />;
            case 'Agent Marketplace': return <MarketplaceView />;
            case 'AI Ad Studio': return <AIAdStudioView />;
            case 'Financial Democracy': return <FinancialDemocracyView />;
            case 'Open Banking': return <OpenBankingView />;
            case 'API Status': return <APIIntegrationView />;
            
            case 'Concierge': return <ConciergeService />;
            case 'Philanthropy': return <PhilanthropyHub />;
            case 'Sovereign Wealth': return <SovereignWealth />;
            case 'Security': return <SecurityView />;
            
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden selection:bg-cyan-500/30">
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView} 
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto w-full">
                        {renderView()}
                    </div>
                </main>
                <VoiceControl />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return <AppContent />;
};

export default App;