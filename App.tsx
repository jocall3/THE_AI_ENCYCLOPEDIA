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
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import APIIntegrationView from './components/APIIntegrationView';
import ConciergeService from './components/ConciergeService';
import PhilanthropyHub from './components/PhilanthropyHub';
import SovereignWealth from './components/SovereignWealth';
import PersonalizationView from './components/PersonalizationView';
import TheVisionView from './components/TheVisionView';
import LoginView from './components/LoginView';

import { DataContext } from './context/DataContext';
import { AuthContext } from './context/AuthContext';
import { View } from './types';

const App: React.FC = () => {
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);

  // Ensure contexts are available
  if (!dataContext || !authContext) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading System Constructs...</div>;
  }

  const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } = dataContext;
  const { isAuthenticated, user } = authContext;

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard: return <Dashboard />;
      case View.Transactions: return <TransactionsView />;
      case View.SendMoney: return <SendMoneyView />;
      case View.Budgets: return <BudgetsView />;
      case View.FinancialGoals: return <FinancialGoalsView />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Investments: return <InvestmentsView />;
      case View.Crypto: return <CryptoView />;
      case View.AlgoTrading: return <AlgoTradingLab />;
      case View.Forex: return <ForexArena />;
      case View.Commodities: return <CommoditiesExchange />;
      case View.RealEstate: return <RealEstateEmpire />;
      case View.ArtCollectibles: return <ArtCollectibles />;
      case View.Derivatives: return <DerivativesDesk />;
      case View.VentureCapital: return <VentureCapitalDesk />;
      case View.PrivateEquity: return <PrivateEquityLounge />;
      case View.TaxOptimization: return <TaxOptimizationChamber />;
      case View.LegacyBuilder: return <LegacyBuilder />;
      case View.CorporateCommand: return <CorporateCommandView />;
      case View.ModernTreasury: return <ModernTreasuryView />;
      case View.CardPrograms: return <MarqetaDashboardView />;
      case View.DataNetwork: return <PlaidDashboardView />;
      case View.Payments: return <StripeDashboardView />;
      case View.SSO: return <SSOView />;
      case View.AIAdvisor: return <AIAdvisorView />;
      case View.QuantumWeaver: return <QuantumWeaverView />;
      case View.AgentMarketplace: return <MarketplaceView />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.FinancialDemocracy: return <FinancialDemocracyView />;
      case View.OpenBanking: return <OpenBankingView />;
      case View.APIIntegration: return <APIIntegrationView />;
      case View.Concierge: return <ConciergeService />;
      case View.Philanthropy: return <PhilanthropyHub />;
      case View.SovereignWealth: return <SovereignWealth />;
      case View.Personalization: return <PersonalizationView />;
      case View.TheVision: return <TheVisionView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-6">
             {renderView()}
          </div>
        </main>
        
        <VoiceControl />
      </div>
    </div>
  );
};

export default App;