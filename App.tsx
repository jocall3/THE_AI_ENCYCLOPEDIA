import React, { useContext, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
// import AIAdStudioView from './components/AIAdStudioView'; // Removed: Not part of "Unified Business Financial Dashboard" MVP.
// import AIAdvisorView from './components/AIAdvisorView'; // Removed: Not part of "Unified Business Financial Dashboard" MVP.
// import AlgoTradingLab from './components/AlgoTradingLab'; // Removed: Specialized trading, not part of "Unified Business Financial Dashboard" MVP.
// import APIIntegrationView from './components/APIIntegrationView'; // Removed: API configuration, not a primary dashboard feature for MVP.
// import ArtCollectibles from './components/ArtCollectibles'; // Removed: Niche, not part of "Unified Business Financial Dashboard" MVP.
import BudgetsView from './components/BudgetsView';
// import CommoditiesExchange from './components/CommoditiesExchange'; // Removed: Specialized trading, not part of "Unified Business Financial Dashboard" MVP.
// import ConciergeService from './components/ConciergeService'; // Removed: Niche, not part of "Unified Business Financial Dashboard" MVP.
// import CorporateCommandView from './components/CorporateCommandView'; // Removed: Corporate-specific, not core to general financial dashboard MVP.
import CreditHealthView from './components/CreditHealthView';
// import CryptoView from './components/CryptoView'; // Removed: Specialized asset class, not core to general financial dashboard MVP.
// import DerivativesDesk from './components/DerivativesDesk'; // Removed: Specialized trading, not part of "Unified Business Financial Dashboard" MVP.
// import FinancialDemocracyView from './components/FinancialDemocracyView'; // Removed: Abstract concept, not a core dashboard view for MVP.
import { DataContext, DataProvider } from './context/DataContext';
import { View } from './types'; // Assuming View enum/type in types.ts will be updated to reflect MVP scope.
// import ApiSettingsPage from './src/pages/ApiSettingsPage'; // Removed: API configuration, not a primary dashboard feature for MVP.
import SendMoneyView from './components/SendMoneyView';
import TransactionsView from './components/TransactionsView';
import InvestmentsView from './components/InvestmentsView';

/**
 * App.tsx
 *
 * This file has been refactored to align with the chosen MVP scope:
 * "Unified Business Financial Dashboard".
 *
 * All components and related logic that fall outside this MVP scope have been
 * removed from the active codebase. These modules are conceptually archived
 * for future development (e.g., in a /future-modules directory).
 *
 * Rationale for removals:
 * - AIAdStudioView, AIAdvisorView: Specific AI tools, not core to a general financial dashboard MVP.
 * - AlgoTradingLab, CommoditiesExchange, DerivativesDesk: Specialized trading platforms, beyond MVP.
 * - APIIntegrationView, ApiSettingsPage: System configuration, not a primary user-facing dashboard feature for MVP.
 * - ArtCollectibles, ConciergeService: Niche services, not core to financial dashboard MVP.
 * - CorporateCommandView, CryptoView, FinancialDemocracyView: Represent broader or more specialized domains
 *   that are outside the initial MVP focus on core business financial management.
 *
 * The UI stack (React + Tailwind CSS) and state management (React Context)
 * are retained and standardized for this MVP.
 */
function AppLayout() {
  const context = useContext(DataContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!context) return <div>Loading...</div>;
  const { activeView, setActiveView } = context;

  const renderActiveSubsystem = () => {
    switch (activeView) {
      case View.Dashboard: return <Dashboard setActiveView={setActiveView} />;
      // case View.AIAdStudio: return <AIAdStudioView />; // Removed as per MVP scope
      // case View.AIAdvisor: return <AIAdvisorView />; // Removed as per MVP scope
      // case View.AlgoTradingLab: return <AlgoTradingLab />; // Removed as per MVP scope
      // case View.APIIntegration: return <APIIntegrationView />; // Removed as per MVP scope
      // case View.ApiSettings: return <ApiSettingsPage />; // Removed as per MVP scope
      // case View.ArtCollectibles: return <ArtCollectibles />; // Removed as per MVP scope
      case View.Budgets: return <BudgetsView />;
      // case View.CommoditiesExchange: return <CommoditiesExchange />; // Removed as per MVP scope
      // case View.ConciergeService: return <ConciergeService />; // Removed as per MVP scope
      // case View.CorporateCommand: return <CorporateCommandView />; // Removed as per MVP scope
      case View.CreditHealth: return <CreditHealthView />;
      // case View.Crypto: return <CryptoView />; // Removed as per MVP scope
      // case View.DerivativesDesk: return <DerivativesDesk />; // Removed as per MVP scope
      // case View.FinancialDemocracy: return <FinancialDemocracyView />; // Removed as per MVP scope
      case View.SendMoney: return <SendMoneyView />;
      case View.Transactions: return <TransactionsView />;
      case View.Investments: return <InvestmentsView />;
      // Default to Dashboard for any unhandled or removed view states to ensure a stable fallback.
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