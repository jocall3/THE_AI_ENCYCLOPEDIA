import React, { useState, useContext, useMemo, useEffect } from 'react';
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
import { View, IllusionType, FinancialGoal, AIGoalPlan, CryptoAsset, VirtualCard, PaymentOperation, CorporateCard, CorporateTransaction, NFTAsset, RewardItem, APIStatus } from './types';
import { DataContext } from './context/DataContext';
import { AuthContext } from './context/AuthContext';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import Card from './components/Card';
import CorporateCommandView from './components/CorporateCommandView';
import ModernTreasuryView from './components/ModernTreasuryView';
import OpenBankingView from './components/OpenBankingView';
import FinancialDemocracyView from './components/FinancialDemocracyView';
import AIAdStudioView from './components/AIAdStudioView';
import CryptoView from './components/CryptoView';
import LoginView from './components/LoginView';
import APIIntegrationView from './components/APIIntegrationView';
import PlaidDashboardView from './components/PlaidDashboardView';
import StripeDashboardView from './components/StripeDashboardView';
import MarqetaDashboardView from './components/MarqetaDashboardView';
import CreditHealthView from './components/CreditHealthView';
import FinancialGoalsView from './components/FinancialGoalsView';
import SSOView from './components/SSOView';
import AlgoTradingLab from './components/AlgoTradingLab';
import PrivateEquityLounge from './components/PrivateEquityLounge';
import DerivativesDesk from './components/DerivativesDesk';
import ForexArena from './components/ForexArena';
import CommoditiesExchange from './components/CommoditiesExchange';
import TaxOptimizationChamber from './components/TaxOptimizationChamber';
import RealEstateEmpire from './components/RealEstateEmpire';
import ArtCollectibles from './components/ArtCollectibles';
import LegacyBuilder from './components/LegacyBuilder';
import PhilanthropyHub from './components/PhilanthropyHub';
import SovereignWealth from './components/SovereignWealth';
import GlobalMarketMap from './components/GlobalMarketMap';
import QuantumAssets from './components/QuantumAssets';
import ConciergeService from './components/ConciergeService';

// Import "Good" feature components
import AutonomousFinanceAgentLog from './src/components/features/automation/agents/AutonomousFinanceAgentLog';
import FinancialRuleBuilder from './src/components/features/automation/rules/FinancialRuleBuilder';
import JointBudgetTracker from './src/components/features/collaboration/budgeting/JointBudgetTracker';
import SharedVaultDashboard from './src/components/features/collaboration/vaults/SharedVaultDashboard';
import AIAdCampaignManager from './src/components/features/creator/ads/AIAdCampaignManager';
import AIInsightFeed from './src/components/features/dashboard/insights/AIInsightFeed';
import PayrollProcessingWizard from './src/components/features/enterprise/payroll/PayrollProcessingWizard';
import SupplyChainFinancePortal from './src/components/features/enterprise/supply-chain/SupplyChainFinancePortal';
import FinancialLiteracyModule from './src/components/features/family/literacy/FinancialLiteracyModule';
import TeenDebitCardManager from './src/components/features/family/parental-controls/TeenDebitCardManager';
import ForeignExchangeHedgingTool from './src/components/features/global/fx/ForeignExchangeHedgingTool';
import MultiCurrencyWallet from './src/components/features/global/multi-currency/MultiCurrencyWallet';
import DigitalTrustAndWillCreator from './src/components/features/legacy/wills/DigitalTrustAndWillCreator';
import CollegeSavingsPlanner529 from './src/components/features/lifecycle/education/CollegeSavingsPlanner529';
import MortgageAffordabilityCalculator from './src/components/features/lifecycle/home-buying/MortgageAffordabilityCalculator';
import AIBillNegotiator from './src/components/features/personal-finance/bills/AIBillNegotiator';
import DebtPayoffPlanner from './src/components/features/personal-finance/debt/DebtPayoffPlanner';
import SecurityScoreDashboard from './src/components/features/security/dashboard/SecurityScoreDashboard';
import DeviceManager from './src/components/features/security/devices/DeviceManager';
import TransactionRuleBuilderUI from './src/components/features/security/rules/TransactionRuleBuilderUI';
import AlternativeAssetTracker from './src/components/features/wealth/portfolio/AlternativeAssetTracker';

const App: React.FC = () => {
    const dataContext = useContext(DataContext);
    const authContext = useContext(AuthContext);

    if (!dataContext || !authContext) {
        throw new Error("App must be used within DataProvider and AuthProvider");
    }

    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen, backgroundIllusion } = dataContext;
    const { isAuthenticated } = authContext;

    const ProblematicView: React.FC<{ name: string, reason: string }> = ({ name, reason }) => (
        <div className="p-8 text-white">
            <Card>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-2">View Not Available</h2>
                    <p className="text-lg"><strong className='font-bold text-cyan-300'>{name}</strong> could not be rendered.</p>
                    <p className="text-gray-400 mt-1">Reason: {reason}</p>
                </div>
            </Card>
        </div>
    );

    const renderActiveView = () => {
        switch (activeView) {
            case View.Dashboard:
                return <Dashboard />;
            case View.Transactions:
                return <TransactionsView />;
            case View.SendMoney:
                return <SendMoneyView />;
            case View.Budgets:
                return <BudgetsView />;
            case View.Investments:
                return <InvestmentsView />;
            case View.AIAdvisor:
                return <AIAdvisorView />;
            case View.Security:
                return <SecurityView />;
            case View.APIIntegration:
                return <APIIntegrationView />;
            case View.PlaidDashboard:
                return <PlaidDashboardView />;
            case View.StripeDashboard:
                return <StripeDashboardView />;
            case View.MarqetaDashboard:
                return <MarqetaDashboardView />;
            case View.ModernTreasury:
                return <ModernTreasuryView />;
            case View.OpenBanking:
                return <OpenBankingView />;
            case View.FinancialDemocracy:
                return <FinancialDemocracyView />;
            case View.Crypto:
                return <CryptoView />;
            case View.AIAdStudio:
                return <AIAdStudioView />;
            case View.QuantumWeaver:
                return <QuantumWeaverView />;
            case View.Marketplace:
                return <MarketplaceView />;
            case View.CorporateCommand:
                return <CorporateCommandView />;
            case View.CreditHealth:
                return <CreditHealthView />;
            case View.FinancialGoals:
                return <FinancialGoalsView />;
            case View.SSO:
                return <SSOView />;
            case View.AlgoTradingLab:
                return <AlgoTradingLab />;
            case View.PrivateEquityLounge:
                return <PrivateEquityLounge />;
            case View.DerivativesDesk:
                return <DerivativesDesk />;
            case View.ForexArena:
                return <ForexArena />;
            case View.CommoditiesExchange:
                return <CommoditiesExchange />;
            case View.TaxOptimizationChamber:
                return <TaxOptimizationChamber />;
            case View.RealEstateEmpire:
                return <RealEstateEmpire />;
            case View.ArtCollectibles:
                return <ArtCollectibles />;
            case View.LegacyBuilder:
                return <LegacyBuilder />;
            case View.PhilanthropyHub:
                return <PhilanthropyHub />;
            case View.SovereignWealth:
                return <SovereignWealth />;
            case View.GlobalMarketMap:
                return <GlobalMarketMap />;
            case View.QuantumAssets:
                return <QuantumAssets />;
            case View.ConciergeService:
                return <ConciergeService />;

            // Good Feature Views
            case View.AutonomousFinanceAgentLog: return <AutonomousFinanceAgentLog />;
            case View.FinancialRuleBuilder: return <FinancialRuleBuilder />;
            case View.JointBudgetTracker: return <JointBudgetTracker />;
            case View.SharedVaultDashboard: return <SharedVaultDashboard />;
            case View.AIAdCampaignManager: return <AIAdCampaignManager />;
            case View.AIInsightFeed: return <AIInsightFeed />;
            case View.PayrollProcessingWizard: return <PayrollProcessingWizard />;
            case View.SupplyChainFinancePortal: return <SupplyChainFinancePortal />;
            case View.FinancialLiteracyModule: return <FinancialLiteracyModule />;
            case View.TeenDebitCardManager: return <TeenDebitCardManager />;
            case View.ForeignExchangeHedgingTool: return <ForeignExchangeHedgingTool />;
            case View.MultiCurrencyWallet: return <MultiCurrencyWallet />;
            case View.DigitalTrustAndWillCreator: return <DigitalTrustAndWillCreator />;
            case View.CollegeSavingsPlanner529: return <CollegeSavingsPlanner529 />;
            case View.MortgageAffordabilityCalculator: return <MortgageAffordabilityCalculator />;
            case View.AIBillNegotiator: return <AIBillNegotiator />;
            case View.DebtPayoffPlanner: return <DebtPayoffPlanner />;
            case View.SecurityScoreDashboard: return <SecurityScoreDashboard />;
            case View.DeviceManager: return <DeviceManager />;
            case View.TransactionRuleBuilderUI: return <TransactionRuleBuilderUI />;
            case View.AlternativeAssetTracker: return <AlternativeAssetTracker />;

            // Problematic Feature Views
            case View.CorporateCardControlsPanel: return <ProblematicView name="CorporateCardControlsPanel" reason="Missing 'rsuite' dependency." />;
            case View.RetirementPlanner: return <ProblematicView name="RetirementPlanner" reason="Missing '@mui/material' dependency." />;
            case View.AIInvoiceScanner: return <ProblematicView name="AIInvoiceScanner" reason="Missing 'antd' dependency." />;
            case View.APIHealthDashboard: return <ProblematicView name="APIHealthDashboard" reason="Missing 'styled-components' dependency and local file imports." />;
            case View.MarqetaCardProgramDashboard: return <ProblematicView name="MarqetaCardProgramDashboard" reason="Missing '@mui/material' dependency." />;
            case View.PlaidConnectionManager: return <ProblematicView name="PlaidConnectionManager" reason="Missing '@mui/material' and 'react-plaid-link' dependencies." />;
            case View.StripeChargeDashboard: return <ProblematicView name="StripeChargeDashboard" reason="Missing local file imports (types, api, utils)." />;
            case View.DeveloperPortal: return <ProblematicView name="DeveloperPortal" reason="Missing '@mui/material' and 'react-router-dom' dependencies." />;
            case View.PitchAnalysisStepper: return <ProblematicView name="PitchAnalysisStepper" reason="Missing '@mui/material' dependency." />;
            case View.AccessibilitySettingsPanel: return <ProblematicView name="AccessibilitySettingsPanel" reason="Missing '@mui/material' dependency." />;
            case View.TwoFactorAuthSetup: return <ProblematicView name="TwoFactorAuthSetup" reason="Missing '@mui/material' dependency." />;
            case View.ThemeBuilder: return <ProblematicView name="ThemeBuilder" reason="Missing '@mui/material', 'react-redux', and 'react-color' dependencies." />;
            case View.AutomatedPortfolioRebalancer: return <ProblematicView name="AutomatedPortfolioRebalancer" reason="Missing '@mui/material' dependency." />;
            case View.DeFiYieldExplorer: return <ProblematicView name="DeFiYieldExplorer" reason="Missing '@material-tailwind/react' dependency." />;
            case View.NFTValuationTool: return <ProblematicView name="NFTValuationTool" reason="Missing local file imports for types and services." />;
            case View.VentureCapitalDesk: return <ProblematicView name="VentureCapitalDesk" reason="Depends on non-existent UI components from '@/' path." />;
            case View.GamifiedGroupSavings: return <ProblematicView name="GamifiedGroupSavings" reason="Syntax error in component source file." />;
            case View.TreasuryDashboard: return <ProblematicView name="TreasuryDashboard" reason="Depends on non-existent UI components from '@/' path." />;
            case View.CarbonFootprintOptimizer: return <ProblematicView name="CarbonFootprintOptimizer" reason="Depends on non-existent UI components from '@/' path." />;
            case View.AITaxOptimizer: return <ProblematicView name="AITaxOptimizer" reason="Depends on non-existent UI components from '@/' path." />;
            case View.Web3CorporateWallet: return <ProblematicView name="Web3CorporateWallet" reason="Depends on non-existent UI components from '@/' path." />;

            default:
                return <Dashboard />;
        }
    };

    if (!isAuthenticated) {
        return <LoginView />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans relative">
             {/* Background Illusion */}
             {backgroundIllusion === 'aurora' && (
                 <div className="aurora-background"> 
                    <div className="aurora__item"></div>
                    <div className="aurora__item"></div>
                    <div className="aurora__item"></div>
                    <div className="aurora__item"></div>
                </div>
             )}
             <style>
                {`
                .aurora-background {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;
                }
                .aurora__item {
                    position: absolute;
                    border-radius: 50%;
                    mix-blend-mode: overlay;
                    opacity: 0.2;
                    filter: blur(80px);
                }
                .aurora__item:nth-of-type(1) { background-color: #00aaff; top: 10%; left: 10%; width: 400px; height: 400px; animation: aurora-move1 15s infinite alternate; }
                .aurora__item:nth-of-type(2) { background-color: #ff00ff; top: 30%; left: 70%; width: 300px; height: 300px; animation: aurora-move2 17s infinite alternate; }
                .aurora__item:nth-of-type(3) { background-color: #00ffaa; top: 80%; left: 20%; width: 350px; height: 350px; animation: aurora-move3 19s infinite alternate; }
                .aurora__item:nth-of-type(4) { background-color: #ffff00; top: 60%; left: 50%; width: 250px; height: 250px; animation: aurora-move4 21s infinite alternate; }
                
                @keyframes aurora-move1 { from { transform: translate(-50px, -50px); } to { transform: translate(50px, 80px); } }
                @keyframes aurora-move2 { from { transform: translate(-80px, 50px); } to { transform: translate(80px, -50px); } }
                @keyframes aurora-move3 { from { transform: translate(50px, -80px); } to { transform: translate(-50px, 50px); } }
                @keyframes aurora-move4 { from { transform: translate(80px, 80px); } to { transform: translate(-80px, -80px); } }
                `}
            </style>
            <div className="flex h-screen relative z-10">
                <Sidebar 
                    activeView={activeView} 
                    setActiveView={setActiveView} 
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-black/10">
                        {renderActiveView()}
                    </main>
                </div>
            </div>
            <VoiceControl />
        </div>
    );
};

export default App;