import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIAdStudioView from './components/AIAdStudioView';
import AIAdvisorView from './components/AIAdvisorView';
import AIWorkspaceView from './components/AlgoTradingLab';
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
import InvestmentsView from './components/InvestmentsView';

// Local View enum to manage all available application views
enum View {
  Dashboard = 'Dashboard',
  AIAdStudio = 'AIAdStudio',
  AIAdvisor = 'AIAdvisor',
  AlgoTradingLab = 'AlgoTradingLab',
  APIIntegration = 'APIIntegration',
  ArtCollectibles = 'ArtCollectibles',
  Budgets = 'Budgets',
  CommoditiesExchange = 'CommoditiesExchange',
  ConciergeService = 'ConciergeService',
  CorporateCommand = 'CorporateCommand',
  CreditHealth = 'CreditHealth',
  Crypto = 'Crypto',
  DerivativesDesk = 'DerivativesDesk',
  FinancialDemocracy = 'FinancialDemocracy',
  Investments = 'Investments',
  SendMoney = 'SendMoney',
  Transactions = 'Transactions',
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveSubsystem = () => {
    switch (activeView) {
      case View.Dashboard: return <Dashboard setActiveView={setActiveView} />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.AIAdvisor: return <AIAdvisorView />;
      case View.AlgoTradingLab: return <AIWorkspaceView />;
      case View.APIIntegration: return <APIIntegrationView />;
      case View.ArtCollectibles: return <ArtCollectibles />;
      case View.Budgets: return <BudgetsView />;
      case View.CommoditiesExchange: return <CommoditiesExchange />;
      case View.ConciergeService: return <ConciergeService />;
      case View.CorporateCommand: return <CorporateCommandView />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Crypto: return <CryptoView />;
      case View.DerivativesDesk: return <DerivativesDesk />;
      case View.FinancialDemocracy: return <FinancialDemocracyView />;
      case View.Investments: return <InvestmentsView />;
      default: return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} setActiveView={setActiveView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {renderActiveSubsystem()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;