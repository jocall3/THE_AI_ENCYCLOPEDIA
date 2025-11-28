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
import { View } from './types';
import { DataContext } from './context/DataContext';
import { AuthContext } from './context/AuthContext';
import FinancialGoalsView from './components/FinancialGoalsView';
import APIIntegrationView from './components/APIIntegrationView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import ModernTreasuryView from './components/ModernTreasuryView';
import CorporateCommandView from './components/CorporateCommandView';
import AIAdStudioView from './components/AIAdStudioView';
import CryptoView from './components/CryptoView';
import CreditHealthView from './components/CreditHealthView';
import TheVisionView from './components/TheVisionView';

const App: React.FC = () => {
    const authContext = useContext(AuthContext);
    const dataContext = useContext(DataContext);
    
    if (!dataContext || !authContext) {
        throw new Error("App must be used within DataProvider and AuthProvider");
    }

    const { setActiveView, activeView, isSidebarOpen, setIsSidebarOpen } = dataContext;

    // isLoading and isAuthenticated checks are removed as auth state is now static.

    const renderView = () => {
        switch (activeView) {
            case View.Dashboard:
                return <Dashboard />;
            case View.Transactions:
                return <TransactionsView />;
            case View.SendMoney:
                return <SendMoneyView />;
            case View.Investments:
                return <InvestmentsView />;
            case View.AIAdvisor:
                return <AIAdvisorView />;
            case View.Security:
                return <SecurityView />;
            case View.Budgets:
                return <BudgetsView />;
            case View.FinancialGoals:
                return <FinancialGoalsView />;
            case View.QuantumWeaver:
                return <QuantumWeaverView />;
            case View.Marketplace:
                return <MarketplaceView />;
            case View.APIIntegration:
                return <APIIntegrationView />;
            case View.PlaidDashboard:
                return <PlaidDashboardView />;
            case View.StripeDashboard:
                return <StripeDashboardView />;
            case View.MarqetaDashboard:
                return <MarqetaDashboardView />;
            case View.ModernTreasuryDashboard:
                return <ModernTreasuryView />;
            case View.CorporateCommand:
                return <CorporateCommandView />;
            case View.AIAdStudio:
                return <AIAdStudioView />;
            case View.Crypto:
                return <CryptoView />;
            case View.CreditHealth:
                return <CreditHealthView />;
            case View.TheVision:
                return <TheVisionView />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans relative" style={{ background: 'radial-gradient(ellipse at top, #1e3a8a, #111827)'}}>
            <div id="stars-container" className="absolute inset-0 z-0"></div>
            <div className="relative z-10 flex h-screen overflow-hidden">
                <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-black/10">
                        {renderView()}
                    </main>
                </div>
            </div>
            <VoiceControl />
        </div>
    );
};

export default App;