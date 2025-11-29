import React, { useContext, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIAdStudioView from './components/AIAdStudioView';
import AIAdvisorView from './components/AIAdvisorView';
import AlgoTradingLab from './components/AlgoTradingLab';
import APIIntegrationView from './components/APIIntegrationView';
import ArtCollectibles from './components/ArtCollectibles';
import BudgetsView from './components/BudgetsView';
import CommoditiesExchange from './components/CommoditiesExchange';
import ConciergeService from './components/ConciergeService';
import CorporateCommandView from './components/CorporateCommandView';
import CreditHealthView from './components/CreditHealthView';
import CryptoView from './components/CryptoView';
import DerivativesDesk from './components/DerivativesDesk';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import { DataContext, DataProvider } from './context/DataContext';
import { View } from './types';

function AppLayout() {
  const context = useContext(DataContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!context) return <div>Loading...</div>;
  const { activeView, setActiveView } = context;

  const renderActiveSubsystem = () => {
    switch (activeView) {
      case View.Dashboard: return <Dashboard setActiveView={setActiveView} />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.AIAdvisor: return <AIAdvisorView previousView={null} />;
      case View.AlgoTradingLab: return <AlgoTradingLab />;
      case View.APIIntegration: return <APIIntegrationView />;
      case View.ArtCollectibles: return <ArtCollectibles />;
      case View.Budgets: return <BudgetsView />;
      case View.CommoditiesExchange: return <CommoditiesExchange />;
      case View.ConciergeService: return <ConciergeService />;
      case View.CorporateCommand: return <CorporateCommandView setActiveView={setActiveView} />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Crypto: return <CryptoView />;
      case View.DerivativesDesk: return <DerivativesDesk />;
      case View.FinancialDemocracy: return <FinancialDemocracyView />;
      default: return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          setActiveView={setActiveView} 
        />
        <main className="w-full flex-grow p-6 relative z-10">
          <div className="max-w-8xl mx-auto h-full">
            {renderActiveSubsystem()}
          </div>
        </main>
      </div>
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