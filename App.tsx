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
import PublicTrustAssetManagement from './components/PublicTrustAssetManagement';
import PhilanthropyHub from './components/PhilanthropyHub';
import APIIntegrationView from './components/APIIntegrationView';
import SettingsView from './components/SettingsView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import SSOView from './components/SSOView';
import PersonalizationView from './components/PersonalizationView';
import TheVisionView from './components/TheVisionView';
import { DataContext, DataProvider } from './context/DataContext';
import { View } from './types';

/**
 * Consumer Interface Main Application Entry Point.
 * 
 * This component serves as the central hub for the entire utility platform.
 * It coordinates the display of all modules, manages global layout state, and
 * incorporates the machine-driven interface layers.
 * 
 * Architecture:
 * - Layout: Standardized Grid Structure with Navigation Panel/Top Bar/Primary Content sections.
 * - State Management: Retrieves shared state for primary view routing.
 * - Machine Integration: Includes VoiceControl and Machine Advisor overlays.
 * - Access Control: Ensures module-level segregation.
 */
function AppLayout() {
  // Shared State Retrieval
  const { activeView, setActiveView } = useContext(DataContext);
  
  // Local Interface State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Displays the selected module based on the current shared view state.
   * This conditional block functions as the main application router, ensuring
   * only the necessary component is rendered in the DOM.
   */
  const renderActiveSubsystem = () => {
    switch (activeView) {
      // Primary Account & Overview
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
      
      // Asset Allocation & Trading Modules
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
      
      // Institutional & Large Scale Operations
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
      
      // Emerging Technologies & Automation
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
      
      // System Configuration & Connectivity
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
      
      // Personal Management & Future Planning
      case View.ConciergeService:
        return <ConciergeService />;
      case View.SovereignWealth:
        return <PublicTrustAssetManagement />;
      case View.Philanthropy:
        return <PhilanthropyHub />;
      case View.Personalization:
        return <PersonalizationView />;
      case View.TheVision:
        return <TheVisionView />;
      
      // Advisory & Safety Protocols
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
        Primary Navigation Panel 
        Manages navigation and module selection.
      */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      {/* 
        Main Display Area 
        Contains the Top Bar and the dynamic Content Pane.
      */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        
        {/* Global Application Top Bar */}
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          setActiveView={setActiveView} 
        />
        
        {/* 
          Dynamic Content Pane 
          Renders the currently selected functional component.
          Includes necessary spacing and layout constraints for optimal viewing.
        */}
        <main className="w-full flex-grow p-6 relative z-10">
          <div className="max-w-8xl mx-auto h-full">
            {renderActiveSubsystem()}
          </div>
        </main>

        {/* 
          Machine Context Layer
          Static background elements or overlays representing
          continuous automated monitoring.
        */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
      </div>
      
      {/* 
        Voice Command Listener
        Continuously active interface for direct input interaction.
      */}
      <VoiceControl setActiveView={setActiveView} />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppLayout />
    </DataProvider>
  );
}