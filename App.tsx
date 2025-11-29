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
import { View } from './types';

/**
 * Enterprise Operating System Main Application Entry Point.
 * 
 * This component serves as the central nervous system for the entire financial platform.
 * It orchestrates the rendering of all subsystems, manages global layout state, and
 * integrates the AI-driven interface layers.
 * 
 * Architecture:
 * - Layout: Responsive Flexbox Grid with Sidebar/Header/Main Content areas.
 * - State Management: Consumes DataContext for global view routing.
 * - AI Integration: Embeds VoiceControl and AI Advisor overlays.
 * - Security: Enforces view-level separation.
 */
export default function App() {
  // Global State Consumption
  const { activeView, setActiveView } = useContext(DataContext);
  
  // Local UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Renders the active subsystem based on the current global view state.
   * This switch acts as the primary router for the application, ensuring
   * that only the requested module is loaded into the DOM.
   */
  const renderActiveSubsystem = () => {
    switch (activeView) {
      // Core Banking & Dashboarding
      case View.Dashboard:
        return <Dashboard setActiveView={setActiveView} />;
      case View.Transactions:
        return <TransactionsView />;
      case View.SendMoney:
        return <SendMoneyView setActiveView={setActiveView} />;
      case View.Budgets:
        return <BudgetsView />;
      case View.FinancialGoals:
        return <FinancialGoalsView />;
      case View.CreditHealth:
        return <CreditHealthView />;
      
      // Investment & Trading Engines
      case View.Investments:
        return <InvestmentsView />;
      case View.CryptoWeb3:
        return <CryptoView />;
      case View.AlgoTradingLab:
        return <AlgoTradingLab />;
      case View.ForexArena:
        return <ForexArena />;
      case View.CommoditiesExchange:
        return <CommoditiesExchange />;
      case View.RealEstateEmpire:
        return <RealEstateEmpire />;
      case View.ArtCollectibles:
        return <ArtCollectibles />;
      case View.DerivativesDesk:
        return <DerivativesDesk />;
      
      // High Finance & Corporate
      case View.VentureCapital:
        return <VentureCapitalDesk />;
      case View.PrivateEquity:
        return <PrivateEquityLounge />;
      case View.TaxOptimization:
        return <TaxOptimizationChamber />;
      case View.LegacyBuilder:
        return <LegacyBuilder />;
      case View.CorporateCommand:
        return <CorporateCommandView setActiveView={setActiveView} />;
      case View.ModernTreasury:
        return <ModernTreasuryView />;
      
      // Advanced Tech & AI Integration
      case View.OpenBanking:
        return <OpenBankingView />;
      case View.FinancialDemocracy:
        return <FinancialDemocracyView />;
      case View.AIAdStudio:
        return <AIAdStudioView />;
      case View.QuantumWeaver:
        return <QuantumWeaverView />;
      case View.AgentMarketplace:
        return <MarketplaceView />;
      
      // Infrastructure & Settings
      case View.APIStatus:
        return <APIIntegrationView />;
      case View.Settings:
        return <SettingsView />;
      case View.DataNetwork:
        return <PlaidDashboardView />;
      case View.Payments:
        return <StripeDashboardView />;
      case View.CardPrograms:
        return <MarqetaDashboardView />;
      case View.SSO:
        return <SSOView />;
      
      // Lifestyle & Wealth Management
      case View.ConciergeService:
        return <ConciergeService />;
      case View.SovereignWealth:
        return <SovereignWealth />;
      case View.Philanthropy:
        return <PhilanthropyHub />;
      case View.Personalization:
        return <PersonalizationView />;
      case View.TheVision:
        return <TheVisionView />;
      
      // Intelligence & Security Layers
      case View.AIAdvisor:
        return <AIAdvisorView previousView={null} />;
      case View.SecurityCenter:
        return <SecurityView />;
        
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* 
        Primary Navigation Sidebar 
        Handles routing and module selection.
      */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      {/* 
        Main Content Area 
        Contains the Header and the dynamic Viewport.
      */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        
        {/* Global Application Header */}
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          setActiveView={setActiveView} 
        />
        
        {/* 
          Dynamic Viewport 
          Renders the active business logic component.
          Includes padding and layout constraints for optimal viewing.
        */}
        <main className="w-full flex-grow p-6 relative z-10">
          <div className="max-w-8xl mx-auto h-full">
            {renderActiveSubsystem()}
          </div>
        </main>

        {/* 
          AI Context Layer
          Background elements or overlays could be placed here to represent
          continuous AI monitoring and assistance.
        */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
      </div>
      
      {/* 
        Voice Command Interface
        Always active listener for natural language interaction.
      */}
      <VoiceControl setActiveView={setActiveView} />
    </div>
  );
}