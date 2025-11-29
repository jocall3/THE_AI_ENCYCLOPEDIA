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
import AlgoTradingLab from './components/AlgoTradingLab';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import ConciergeService from './components/ConciergeService';
import DerivativesDesk from './components/DerivativesDesk';
import VentureCapitalDesk from './components/VentureCapitalDesk';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import LegacyBuilder from './components/LegacyBuilder';
import SovereignWealth from './components/SovereignWealth';
import PhilanthropyHub from './components/PhilanthropyHub';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import PersonalizationView from './components/PersonalizationView';
import TheVisionView from './components/TheVisionView';
import { DataContext } from './context/DataContext';

export default function App() {
  const { activeView, setActiveView } = useContext(DataContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        
        <main className="w-full flex-grow p-6">
            {activeView === 'Dashboard' && <Dashboard />}
            {activeView === 'Transactions' && <TransactionsView />}
            {activeView === 'Send Money' && <SendMoneyView />}
            {activeView === 'Budgets' && <BudgetsView />}
            {activeView === 'Financial Goals' && <FinancialGoalsView />}
            {activeView === 'Credit Health' && <CreditHealthView />}
            {activeView === 'Investments' && <InvestmentsView />}
            {activeView === 'Crypto & Web3' && <CryptoView />}
            {activeView === 'Algo-Trading Lab' && <AlgoTradingLab />}
            {activeView === 'Forex Arena' && <ForexArena />}
            {activeView === 'Commodities Exchange' && <CommoditiesExchange />}
            {activeView === 'Real Estate Empire' && <RealEstateEmpire />}
            {activeView === 'Art & Collectibles' && <ArtCollectibles />}
            {activeView === 'Derivatives Desk' && <DerivativesDesk />}
            {activeView === 'Venture Capital' && <VentureCapitalDesk />}
            {activeView === 'Private Equity' && <PrivateEquityLounge />}
            {activeView === 'Tax Optimization' && <TaxOptimizationChamber />}
            {activeView === 'Legacy Builder' && <LegacyBuilder />}
            {activeView === 'Corporate Command' && <CorporateCommandView />}
            {activeView === 'Modern Treasury' && <ModernTreasuryView />}
            {activeView === 'Open Banking' && <OpenBankingView />}
            {activeView === 'Financial Democracy' && <FinancialDemocracyView />}
            {activeView === 'AI Ad Studio' && <AIAdStudioView />}
            {activeView === 'Quantum Weaver' && <QuantumWeaverView />}
            {activeView === 'Marketplace' && <MarketplaceView />}
            {activeView === 'API Status' && <APIIntegrationView />}
            {activeView === 'Settings' && <SettingsView />}
            {activeView === 'Plaid Dashboard' && <PlaidDashboardView />}
            {activeView === 'Stripe Dashboard' && <StripeDashboardView />}
            {activeView === 'Marqeta Dashboard' && <MarqetaDashboardView />}
            {activeView === 'SSO Configuration' && <SSOView />}
            {activeView === 'concierge_service' && <ConciergeService />}
            {activeView === 'Sovereign Wealth' && <SovereignWealth />}
            {activeView === 'Philanthropy Hub' && <PhilanthropyHub />}
            {activeView === 'Personalization' && <PersonalizationView />}
            {activeView === 'The Vision' && <TheVisionView />}
            {activeView === 'AI Advisor' && <AIAdvisorView />}
            {activeView === 'Security Center' && <SecurityView />}
        </main>
      </div>
      
      <VoiceControl />
    </div>
  );
}