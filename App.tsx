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
import ApiSettingsPage from './src/pages/ApiSettingsPage';
import SendMoneyView from './components/SendMoneyView';
import TransactionsView from './components/TransactionsView';
import InvestmentsView from './components/InvestmentsView';

function AppLayout() {
  const context = useContext(DataContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!context) return <div>Loading...</div>;
  const { activeView, setActiveView } = context;

  const renderActiveSubsystem = () => {
    switch (activeView) {
      case View.Dashboard: return <Dashboard setActiveView={setActiveView} />;
      case View.AIAdStudio: return <AIAdStudioView />;
      case View.AIAdvisor: return <AIAdvisorView />;
      case View.AlgoTradingLab: return <AlgoTradingLab />;
      case View.APIIntegration: return <APIIntegrationView />;
      case View.ApiSettings: return <ApiSettingsPage />;
      case View.ArtCollectibles: return <ArtCollectibles />;
      case View.Budgets: return <BudgetsView />;
      case View.CommoditiesExchange: return <CommoditiesExchange />;
      case View.ConciergeService: return <ConciergeService />;
      case View.CorporateCommand: return <CorporateCommandView />;
      case View.CreditHealth: return <CreditHealthView />;
      case View.Crypto: return <CryptoView />;
      case View.DerivativesDesk: return <DerivativesDesk />;
      case View.FinancialDemocracy: return <FinancialDemocracyView />;
      case View.SendMoney: return <SendMoneyView />;
      case View.Transactions: return <TransactionsView />;
      case View.Investments: return <InvestmentsView />;
      // Add other views as they are created
      default: return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} setActiveView={setActiveView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {renderActiveSubsystem()}
          </div>
        </main>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppLayout />
    </DataProvider>
  );
};

export default App;