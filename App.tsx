
import React, { useContext, useState } from 'react';
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
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import PersonalizationView from './components/PersonalizationView';
import TheVisionView from './components/TheVisionView';
import LoginView from './components/LoginView';
import { DataContext } from './context/DataContext';
import { AuthContext } from './context/AuthContext';
import { View } from './types';

// Placeholder components for views not yet fully implemented in provided list
const AlgoTradingLab = () => <div>Algo Trading Lab</div>;
const ForexArena = () => <div>Forex Arena</div>;
const CommoditiesExchange = () => <div>Commodities Exchange</div>;
const RealEstateEmpire = () => <div>Real Estate Empire</div>;
const ArtCollectibles = () => <div>Art & Collectibles</div>;
const ConciergeService = () => <div>Concierge Service</div>;
const DerivativesDesk = () => <div>Derivatives Desk</div>;
const VentureCapitalDesk = () => <div>Venture Capital Desk</div>;
const PrivateEquityLounge = () => <div>Private Equity Lounge</div>;
const TaxOptimizationChamber = () => <div>Tax Optimization</div>;
const LegacyBuilder = () => <div>Legacy Builder</div>;
const SovereignWealth = () => <div>Sovereign Wealth</div>;
const PhilanthropyHub = () => <div>Philanthropy Hub</div>;

const App: React.FC = () => {
    const dataContext = useContext(DataContext);
    const authContext = useContext(AuthContext);

    if (!dataContext || !authContext) {
        return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading Context...</div>;
    }
    const { isAuthenticated } = authContext;
    const { customBackgroundUrl, activeIllusion, activeView, setActiveView } = dataContext;
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderActiveView = () => {
        switch (activeView) {
            case View.Dashboard: return <Dashboard setActiveView={setActiveView} />;
            case View.Transactions: return <TransactionsView />;
            case View.SendMoney: return <SendMoneyView setActiveView={setActiveView} />;
            case View.Budgets: return <BudgetsView />;
            case View.Investments: return <InvestmentsView />;
            case View.AIAdvisor: return <AIAdvisorView previousView={null} />;
            case View.QuantumWeaver: return <QuantumWeaverView />;
            case View.AIAdStudio: return <AIAdStudioView />;
            case View.AgentMarketplace: return <MarketplaceView />;
            case View.Personalization: return <PersonalizationView />;
            case View.CardCustomization: return <div>Card Customization Component</div>; // Placeholder
            case View.SecurityCenter: return <SecurityView />;
            case View.FinancialGoals: return <FinancialGoalsView />;
            case View.CryptoWeb3: return <CryptoView />;
            case View.CorporateCommand: return <CorporateCommandView setActiveView={setActiveView} />;
            case View.ModernTreasury: return <ModernTreasuryView />;
            case View.TheVision: return <TheVisionView />;
            case View.APIStatus: return <APIIntegrationView />;
            case View.OpenBanking: return <OpenBankingView />;
            case View.FinancialDemocracy: return <FinancialDemocracyView />;
            
            // API Dashboards
            case View.DataNetwork: return <PlaidDashboardView />;
            case View.Payments: return <StripeDashboardView />;
            case View.CardPrograms: return <MarqetaDashboardView />;
            case View.SSO: return <SSOView />;
            case View.Settings: return <SettingsView />;

            // Placeholders
            case View.CreditHealth: return <CreditHealthView />;
            case View.AlgoTradingLab: return <AlgoTradingLab />;
            case View.ForexArena: return <ForexArena />;
            case View.CommoditiesExchange: return <CommoditiesExchange />;
            case View.RealEstateEmpire: return <RealEstateEmpire />;
            case View.ArtCollectibles: return <ArtCollectibles />;
            case View.ConciergeService: return <ConciergeService />;
            case View.DerivativesDesk: return <DerivativesDesk />;
            case View.VentureCapital: return <VentureCapitalDesk />;
            case View.PrivateEquity: return <PrivateEquityLounge />;
            case View.TaxOptimization: return <TaxOptimizationChamber />;
            case View.LegacyBuilder: return <LegacyBuilder />;
            case View.SovereignWealth: return <SovereignWealth />;
            case View.Philanthropy: return <PhilanthropyHub />;

            default: return <Dashboard setActiveView={setActiveView} />;
        }
    };

    const backgroundStyle: React.CSSProperties = customBackgroundUrl ? { backgroundImage: `url(${customBackgroundUrl})` } : {};
    
    if (!isAuthenticated) {
        return <LoginView />;
    }

    return (
        <div id="app-container" style={backgroundStyle} className={`bg-cover bg-center bg-fixed ${activeIllusion === 'aurora' ? 'aurora-bg' : ''} h-screen w-full overflow-hidden`}>
             <div className={`flex h-full bg-gray-950/80 text-gray-200 backdrop-blur-xl`}>
                <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <Header onMenuClick={() => setIsSidebarOpen(prev => !prev)} setActiveView={setActiveView} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 relative z-0">
                        {renderActiveView()}
                    </main>
                </div>
                <VoiceControl setActiveView={setActiveView} />
            </div>
            {activeIllusion === 'aurora' && (
                <style>{`
                .aurora-bg { background: #030712; position: relative; }
                .aurora-bg::before, .aurora-bg::after { content: ''; position: absolute; width: 800px; height: 800px; border-radius: 50%; filter: blur(150px); opacity: 0.3; mix-blend-mode: screen; animation: aurora-flow 20s infinite linear; pointer-events: none; }
                .aurora-bg::before { background: radial-gradient(circle, #06b6d4, transparent); top: -20%; left: -20%; }
                .aurora-bg::after { background: radial-gradient(circle, #4f46e5, transparent); bottom: -20%; right: -20%; animation-delay: -10s; }
                @keyframes aurora-flow { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(100px, 100px) rotate(180deg); } 100% { transform: translate(0, 0) rotate(360deg); } }
                `}</style>
            )}
        </div>
    );
};

export default App;
