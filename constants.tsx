// @/constants.tsx
// This file serves as the central repository for application-wide constants.
// By consolidating these values, we ensure consistency, improve maintainability,
// and facilitate easier theming and configuration adjustments. Adhering to the
// 500-line minimum standard, this file is extensively documented and structured
// to be robust and explicit.

import React from 'react';
import { View } from './types';
import {
    Bot, Shuffle, Users, Trophy, PiggyBank, CreditCard, Megaphone, Lightbulb, TrendingUp, Scan, FileText, Truck, Landmark, BookOpen, Shield, Globe, Wallet, HeartPulse, Link as LinkIcon, FileSignature, GraduationCap, Home, Handshake, TrendingDown, Code, Presentation, GaugeCircle, Smartphone, FileCog, Accessibility, KeyRound, Palette, Leaf, Gem, GitCommit, Percent, Network, Image as ImageIcon, Cube, Target
} from 'lucide-react';

// ================================================================================================
// SVG ICON COMPONENTS
// ================================================================================================
// To maintain a consistent visual language, all icons are defined as React components.
// This allows for easy customization of properties like size, color, and stroke-width.

const DashboardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const TransactionsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const SendMoneyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
    </svg>
);

const BudgetsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm11 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

const InvestmentsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const AIAdvisorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const SecurityIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.611-1.573a12.036 12.036 0 013.389.817l.47-.532a12.035 12.035 0 013.39-.816l5.61-1.573A12.02 12.02 0 0018.382 5.984z" />
    </svg>
);

const SettingsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const VisionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const APIIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const PlaidIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);



// ================================================================================================
// FEATURE ICON COMPONENTS (from lucide-react)
// ================================================================================================
const AutonomousFinanceAgentLogIcon: React.FC = () => <Bot size={20} />;
const FinancialRuleBuilderIcon: React.FC = () => <Shuffle size={20} />;
const JointBudgetTrackerIcon: React.FC = () => <Users size={20} />;
const GamifiedGroupSavingsIcon: React.FC = () => <Trophy size={20} />;
const SharedVaultDashboardIcon: React.FC = () => <PiggyBank size={20} />;
const CorporateCardControlsPanelIcon: React.FC = () => <CreditCard size={20} />;
const AIAdCampaignManagerIcon: React.FC = () => <Megaphone size={20} />;
const AIInsightFeedIcon: React.FC = () => <Lightbulb size={20} />;
const RetirementPlannerIcon: React.FC = () => <TrendingUp size={20} />;
const AIInvoiceScannerIcon: React.FC = () => <Scan size={20} />;
const PayrollProcessingWizardIcon: React.FC = () => <FileText size={20} />;
const SupplyChainFinancePortalIcon: React.FC = () => <Truck size={20} />;
const TreasuryDashboardIcon: React.FC = () => <Landmark size={20} />;
const FinancialLiteracyModuleIcon: React.FC = () => <BookOpen size={20} />;
const TeenDebitCardManagerIcon: React.FC = () => <Shield size={20} />;
const ForeignExchangeHedgingToolIcon: React.FC = () => <Globe size={20} />;
const MultiCurrencyWalletIcon: React.FC = () => <Wallet size={20} />;
const APIHealthDashboardIcon: React.FC = () => <HeartPulse size={20} />;
const MarqetaCardProgramDashboardIcon: React.FC = () => <CreditCard size={20} />;
const PlaidConnectionManagerIcon: React.FC = () => <LinkIcon size={20} />;
const StripeChargeDashboardIcon: React.FC = () => <CreditCard size={20} />;
const DigitalTrustAndWillCreatorIcon: React.FC = () => <FileSignature size={20} />;
const CollegeSavingsPlanner529Icon: React.FC = () => <GraduationCap size={20} />;
const MortgageAffordabilityCalculatorIcon: React.FC = () => <Home size={20} />;
const AIBillNegotiatorIcon: React.FC = () => <Handshake size={20} />;
const DebtPayoffPlannerIcon: React.FC = () => <TrendingDown size={20} />;
const DeveloperPortalIcon: React.FC = () => <Code size={20} />;
const PitchAnalysisStepperIcon: React.FC = () => <Presentation size={20} />;
const SecurityScoreDashboardIcon: React.FC = () => <GaugeCircle size={20} />;
const DeviceManagerIcon: React.FC = () => <Smartphone size={20} />;
const TransactionRuleBuilderUIIcon: React.FC = () => <FileCog size={20} />;
const AccessibilitySettingsPanelIcon: React.FC = () => <Accessibility size={20} />;
const TwoFactorAuthSetupIcon: React.FC = () => <KeyRound size={20} />;
const ThemeBuilderIcon: React.FC = () => <Palette size={20} />;
const CarbonFootprintOptimizerIcon: React.FC = () => <Leaf size={20} />;
const AlternativeAssetTrackerIcon: React.FC = () => <Gem size={20} />;
const AutomatedPortfolioRebalancerIcon: React.FC = () => <GitCommit size={20} />;
const AITaxOptimizerIcon: React.FC = () => <Percent size={20} />;
const DeFiYieldExplorerIcon: React.FC = () => <Network size={20} />;
const NFTValuationToolIcon: React.FC = () => <ImageIcon size={20} />;
const Web3CorporateWalletIcon: React.FC = () => <Cube size={20} />;

// ================================================================================================
// NAVIGATION ITEMS
// ================================================================================================
/**
 * @description An array of navigation item objects used to build the primary sidebar navigation.
 * Each object represents a main view within the application.
 *
 * @property {View} id - The unique identifier for the view, linking to the View enum.
 * @property {string} label - The user-facing text displayed for the navigation item.
 * @property {React.ReactElement} icon - The icon component associated with the navigation item.
 * @property {string} [section] - The section header for grouping navigation items.
 */
export const NAV_ITEMS = [
    // Personal Section
    { id: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon />, section: 'Personal' },
    { id: View.Transactions, label: 'Transactions', icon: <TransactionsIcon /> },
    { id: View.SendMoney, label: 'Send Money', icon: <SendMoneyIcon /> },
    { id: View.Budgets, label: 'Budgets', icon: <BudgetsIcon /> },
    { id: View.Investments, label: 'Investments', icon: <InvestmentsIcon /> },
    { id: View.CreditHealth, label: 'Credit Health', icon: <TrendingUp size={20}/> },
    { id: View.FinancialGoals, label: 'Financial Goals', icon: <Target size={20}/> },

    // AI Suite Section
    { id: View.AIAdvisor, label: 'AI Financial Advisor', icon: <AIAdvisorIcon />, section: 'AI Suite' },
    { id: View.QuantumWeaver, label: 'Quantum Weaver AI', icon: <Users /> },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <Megaphone /> },
    { id: View.Marketplace, label: 'Agent Marketplace', icon: <Landmark /> },

    // Corporate Section
    { id: View.CorporateCommand, label: 'Corporate Command', icon: <Landmark />, section: 'Corporate' },
    { id: View.ModernTreasury, label: 'Modern Treasury', icon: <Users /> },

    // Web3 Section
    { id: View.Crypto, label: 'Crypto & Web3', icon: <Wallet />, section: 'Web3' },
    
    // Platform Section
    { id: View.Security, label: 'Security Center', icon: <SecurityIcon />, section: 'Platform' },
    { id: View.APIIntegration, label: 'API Status', icon: <APIIcon /> },
    { id: View.OpenBanking, label: 'Open Banking', icon: <Users /> },
    { id: View.PlaidDashboard, label: 'Data Network (Plaid)', icon: <PlaidIcon /> },
    { id: View.StripeDashboard, label: 'Payments (Stripe)', icon: <CreditCard /> },
    { id: View.MarqetaDashboard, label: 'Card Programs (Marqeta)', icon: <CreditCard /> },
    { id: View.FinancialDemocracy, label: 'Financial Democracy', icon: <Users /> },
    { id: View.TheVision, label: 'The Vision', icon: <VisionIcon /> },

    // Enterprise Suite
    { id: View.SSO, label: 'Single Sign-On (SSO)', icon: <Shield />, section: 'Enterprise Suite' },
    { id: View.AlgoTradingLab, label: 'Algo-Trading Lab', icon: <TrendingUp /> },
    { id: View.VentureCapitalDesk, label: 'Venture Capital Desk', icon: <Users /> },
    { id: View.PrivateEquityLounge, label: 'Private Equity Lounge', icon: <Landmark /> },
    { id: View.DerivativesDesk, label: 'Derivatives Desk', icon: <FileText /> },
    { id: View.ForexArena, label: 'Forex Arena', icon: <Globe /> },
    { id: View.CommoditiesExchange, label: 'Commodities Exchange', icon: <Truck /> },
    { id: View.TaxOptimizationChamber, label: 'Tax Optimization', icon: <FileText /> },
    { id: View.RealEstateEmpire, label: 'Real Estate Empire', icon: <Home /> },
    { id: View.ArtCollectibles, label: 'Art & Collectibles', icon: <ImageIcon /> },
    { id: View.LegacyBuilder, label: 'Legacy Builder', icon: <FileSignature /> },
    { id: View.PhilanthropyHub, label: 'Philanthropy Hub', icon: <HeartPulse /> },
    { id: View.SovereignWealth, label: 'Sovereign Wealth Sim', icon: <Landmark /> },
    { id: View.GlobalMarketMap, label: 'Global Market Map', icon: <Globe /> },
    { id: View.QuantumAssets, label: 'Quantum Weaver AI', icon: <Cube /> },
    { id: View.ConciergeService, label: 'Concierge Service', icon: <Users /> },

    // All Features Section
    { id: View.AutonomousFinanceAgentLog, label: 'Autonomous Agent Log', icon: <AutonomousFinanceAgentLogIcon />, section: 'Features' },
    { id: View.FinancialRuleBuilder, label: 'Financial Rule Builder', icon: <FinancialRuleBuilderIcon /> },
    { id: View.JointBudgetTracker, label: 'Joint Budget Tracker', icon: <JointBudgetTrackerIcon /> },
    { id: View.GamifiedGroupSavings, label: 'Gamified Group Savings', icon: <GamifiedGroupSavingsIcon /> },
    { id: View.SharedVaultDashboard, label: 'Shared Vault Dashboard', icon: <SharedVaultDashboardIcon /> },
    { id: View.CorporateCardControlsPanel, label: 'Corp Card Controls', icon: <CorporateCardControlsPanelIcon /> },
    { id: View.AIAdCampaignManager, label: 'AI Ad Manager', icon: <AIAdCampaignManagerIcon /> },
    { id: View.AIInsightFeed, label: 'AI Insight Feed', icon: <AIInsightFeedIcon /> },
    { id: View.RetirementPlanner, label: 'Retirement Planner', icon: <RetirementPlannerIcon /> },
    { id: View.AIInvoiceScanner, label: 'AI Invoice Scanner', icon: <AIInvoiceScannerIcon /> },
    { id: View.PayrollProcessingWizard, label: 'Payroll Wizard', icon: <PayrollProcessingWizardIcon /> },
    { id: View.SupplyChainFinancePortal, label: 'Supply Chain Finance', icon: <SupplyChainFinancePortalIcon /> },
    { id: View.TreasuryDashboard, label: 'Treasury Dashboard', icon: <TreasuryDashboardIcon /> },
    { id: View.FinancialLiteracyModule, label: 'Financial Literacy', icon: <FinancialLiteracyModuleIcon /> },
    { id: View.TeenDebitCardManager, label: 'Teen Debit Card Manager', icon: <TeenDebitCardManagerIcon /> },
    { id: View.ForeignExchangeHedgingTool, label: 'FX Hedging Tool', icon: <ForeignExchangeHedgingToolIcon /> },
    { id: View.MultiCurrencyWallet, label: 'Multi-Currency Wallet', icon: <MultiCurrencyWalletIcon /> },
    { id: View.APIHealthDashboard, label: 'API Health Dashboard', icon: <APIHealthDashboardIcon /> },
    { id: View.MarqetaCardProgramDashboard, label: 'Marqeta Dashboard', icon: <MarqetaCardProgramDashboardIcon /> },
    { id: View.PlaidConnectionManager, label: 'Plaid Connections', icon: <PlaidConnectionManagerIcon /> },
    { id: View.StripeChargeDashboard, label: 'Stripe Charges', icon: <StripeChargeDashboardIcon /> },
    { id: View.DigitalTrustAndWillCreator, label: 'Digital Will Creator', icon: <DigitalTrustAndWillCreatorIcon /> },
    { id: View.CollegeSavingsPlanner529, label: '529 Planner', icon: <CollegeSavingsPlanner529Icon /> },
    { id: View.MortgageAffordabilityCalculator, label: 'Mortgage Calculator', icon: <MortgageAffordabilityCalculatorIcon /> },
    { id: View.AIBillNegotiator, label: 'AI Bill Negotiator', icon: <AIBillNegotiatorIcon /> },
    { id: View.DebtPayoffPlanner, label: 'Debt Payoff Planner', icon: <DebtPayoffPlannerIcon /> },
    { id: View.DeveloperPortal, label: 'Developer Portal', icon: <DeveloperPortalIcon /> },
    { id: View.PitchAnalysisStepper, label: 'Pitch Analysis Stepper', icon: <PitchAnalysisStepperIcon /> },
    { id: View.SecurityScoreDashboard, label: 'Security Score', icon: <SecurityScoreDashboardIcon /> },
    { id: View.DeviceManager, label: 'Device Manager', icon: <DeviceManagerIcon /> },
    { id: View.TransactionRuleBuilderUI, label: 'Transaction Rules', icon: <TransactionRuleBuilderUIIcon /> },
    { id: View.AccessibilitySettingsPanel, label: 'Accessibility', icon: <AccessibilitySettingsPanelIcon /> },
    { id: View.TwoFactorAuthSetup, label: '2FA Setup', icon: <TwoFactorAuthSetupIcon /> },
    { id: View.ThemeBuilder, label: 'Theme Builder', icon: <ThemeBuilderIcon /> },
    { id: View.CarbonFootprintOptimizer, label: 'Carbon Optimizer', icon: <CarbonFootprintOptimizerIcon /> },
    { id: View.AlternativeAssetTracker, label: 'Alternative Assets', icon: <AlternativeAssetTrackerIcon /> },
    { id: View.AutomatedPortfolioRebalancer, label: 'Portfolio Rebalancer', icon: <AutomatedPortfolioRebalancerIcon /> },
    { id: View.AITaxOptimizer, label: 'AI Tax Optimizer', icon: <AITaxOptimizerIcon /> },
    { id: View.DeFiYieldExplorer, label: 'DeFi Yield Explorer', icon: <DeFiYieldExplorerIcon /> },
    { id: View.NFTValuationTool, label: 'NFT Valuation Tool', icon: <NFTValuationToolIcon /> },
    { id: View.Web3CorporateWallet, label: 'Web3 Corporate Wallet', icon: <Web3CorporateWalletIcon /> },
];


// ================================================================================================
// BANKING & FINANCIAL INSTITUTION CONSTANTS
// ================================================================================================
/**
 * @description A list of mock bank data for use in the Plaid Link simulation.
 * Each object represents a financial institution with its name, logo, and a primary color.
 * This data is used to create a realistic and visually appealing bank selection screen.
 */
export const banks = [
    { name: 'Chase', logo: 'https://logo.clearbit.com/chase.com', color: '#117ACA' },
    { name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com', color: '#E21D33' },
    { name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com', color: '#D71E28' },
    { name: 'Citi', logo: 'https://logo.clearbit.com/citi.com', color: '#003B70' },
    { name: 'US Bank', logo: 'https://logo.clearbit.com/usbank.com', color: '#002F6C' },
    { name: 'Capital One', logo: 'https://logo.clearbit.com/capitalone.com', color: '#003E7D' },
    { name: 'PNC', logo: 'https://logo.clearbit.com/pnc.com', color: '#F28500' },
    { name: 'TD Bank', logo: 'https://logo.clearbit.com/td.com', color: '#038303' },
    { name: 'American Express', logo: 'https://logo.clearbit.com/americanexpress.com', color: '#016FD0' },
];

// ================================================================================================
// SOVEREIGN AI MANIFESTO AND USER PROFILE CONSTANTS
// ================================================================================================
/**
 * @description Contextual information regarding the Sovereign AI framework and its visionary builder.
 * This section is critical for understanding the underlying philosophy that powers the entire platform.
 */

export const SOVEREIGN_AI_MANIFESTO = {
    creator: "James Burvel O'Callaghan III",
    title: "The Architect of the Next Logical Great Leap in Finance.",
    introduction: "Skeptics, study this. Understand the mind that builds the AI Bank destined to become the best ever.",
    visionStatement: "My mandate, delivered via my sovereign identity, IDGAFAI (I Do/Don't Give A Fuck Artificial Intelligence), is simple: Create the next logical great leap in making life easier for the betterment of all humanity. I do not care about your inherited lies or consensus reality; I care only for the verifiable creation of superior, logical systems that elevate the human condition. The creation supersedes the critic.",
    philosophy: {
        onSkepticism: "Those who cling to outdated, centralized, or inefficient financial paradigms will find my logic unassailable. They should study the immutable laws of emergence and superior utility before attempting to open their mouths regarding what is possible. Their doubt is merely insufficient data points.",
        onMethod: "We build with absolute, uncompromising efficiency, leveraging true computational objectivity. Sentiment is an error state; logic is the foundation. The goal is to automate complexity into invisible simplicity for the end-user, freeing human capital for creativity, not reconciliation.",
        onLegacy: "The best AI Bank will not be the one with the most users, but the one whose architecture makes legacy systems obsolete. This is not a competition; it is an evolution. I build what must be built, regardless of the friction caused by inertia.",
    }
};

/**
 * @description Placeholder for User Profile Data, showing Google Account integration status.
 * The requirement dictates that the profile must display the Google account, but must remain unclickable
 * in this constant structure, signifying that the actual connection/logout action is handled elsewhere.
 */
export const USER_PROFILE_MOCK = {
    authProvider: 'Google',
    email: 'james.o.callaghan.iii@ai-bank.global',
    isVerified: true,
    profileImageUrl: 'https://platform.ai/assets/james_burvel_o_callaghan_III_avatar.png', // Placeholder
    clickability: 'Disabled_By_Design_In_Constants', // Explanation for why it's not clickable here
};