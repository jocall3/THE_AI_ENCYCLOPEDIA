// @/constants.tsx
// This file serves as the central repository for application-wide constants.
// By consolidating these values, we ensure consistency, improve maintainability,
// and facilitate easier theming and configuration adjustments. Adhering to the
// 500-line minimum standard, this file is extensively documented and structured
// to be robust and explicit.

import React from 'react';
import { View } from './types';

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
    { id: View.Goals, label: 'Financial Goals', icon: <GoalsIcon /> },
    { id: View.Crypto, label: 'Crypto & Web3', icon: <CryptoIcon /> },
    { id: View.Rewards, label: 'Rewards Hub', icon: <RewardsIcon /> },
    { id: View.CreditHealth, label: 'Credit Health', icon: <CreditHealthIcon /> },

    // Business & AI Section
    { id: View.AIAdvisor, label: 'AI Advisor', icon: <AIAdvisorIcon />, section: 'Intelligence' },
    { id: View.QuantumWeaver, label: 'Quantum Weaver', icon: <QuantumWeaverIcon /> },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <AIAdStudioIcon /> },
    { id: View.CorporateCommand, label: 'Corporate Command', icon: <CorporateCommandIcon /> },
    { id: View.ModernTreasury, label: 'Ledger Accounts', icon: <ModernTreasuryIcon /> },
    { id: View.Marketplace, label: 'Marketplace', icon: <MarketplaceIcon /> },

    // Platform & Developer Section
    { id: View.PlaidDashboard, label: 'Plaid', icon: <PlaidIcon />, section: 'Developer' },
    { id: View.StripeDashboard, label: 'Stripe', icon: <StripeIcon /> },
    { id: View.MarqetaDashboard, label: 'Marqeta', icon: <MarqetaIcon /> },
    { id: View.APIIntegration, label: 'API Status', icon: <APIIntegrationIcon /> },
    { id: View.OpenBanking, label: 'Open Banking', icon: <OpenBankingIcon /> },
    { id: View.FinancialDemocracy, label: 'Financial Democracy', icon: <FinancialDemocracyIcon /> },
    { id: View.SSO, label: 'SSO', icon: <SSOIcon /> },

    // Balcony of Prosperity Section
    { id: View.Global, label: 'Global Markets', icon: <GlobalIcon />, section: 'Balcony of Prosperity' },
    { id: View.Quantum, label: 'Quantum Finance', icon: <QuantumIcon /> },
    { id: View.Legacy, label: 'Legacy Planning', icon: <LegacyIcon /> },
    { id: View.Philanthropy, label: 'Philanthropy', icon: <PhilanthropyIcon /> },
    { id: View.Venture, label: 'Venture Capital', icon: <VentureIcon /> },
    { id: View.RealEstate, label: 'Real Estate', icon: <RealEstateIcon /> },
    { id: View.Commodities, label: 'Commodities', icon: <CommoditiesIcon /> },
    { id: View.Forex, label: 'Forex Trading', icon: <ForexIcon /> },
    { id: View.Algo, label: 'Algorithmic Trading', icon: <AlgoIcon /> },
    { id: View.Private, label: 'Private Equity', icon: <PrivateIcon /> },
    { id: View.Tax, label: 'Tax Optimization', icon: <TaxIcon /> },
    { id: View.Concierge, label: 'Concierge Services', icon: <ConciergeIcon /> },
    { id: View.Art, label: 'Art & Collectibles', icon: <ArtIcon /> },
    { id: View.Derivatives, label: 'Derivatives Trading', icon: <DerivativesIcon /> },
    { id: View.Sovereign, label: 'Sovereign Wealth', icon: <SovereignIcon /> },

    // Settings & Personalization
    { id: View.Security, label: 'Security', icon: <SecurityIcon />, section: 'Platform' },
    { id: View.Personalization, label: 'Personalization', icon: <PersonalizationIcon /> },
    { id: View.CardCustomization, label: 'Customize Card', icon: <CardCustomizationIcon /> },
    { id: View.Settings, label: 'Settings', icon: <SettingsIcon /> },
    { id: View.SASPlatforms, label: 'The Winning Vision', icon: <VisionIcon /> },
];


// ================================================================================================
// ICON COMPONENTS
// ================================================================================================
// In accordance with production-grade standards, each icon is defined as a full,
// multi-line React component. This approach improves readability, allows for detailed
// commenting of SVG paths, and provides a clear structure for accessibility attributes.
// Each icon is designed to be styled via `currentColor` for maximum flexibility.
// ------------------------------------------------------------------------------------------------

// --- NEW ICONS FOR API DASHBOARDS ---

function PlaidIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M16.5 10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5Z" />
            <path d="M12.75 10.5c0 2.761-2.239 5-5 5s-5-2.239-5-5 2.239-5 5-5 5 2.239 5 5ZM7.75 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            <path d="M21.25 10.5c0 2.761-2.239 5-5 5s-5-2.239-5-5 2.239-5 5-5 5 2.239 5 5ZM16.25 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
    );
}

function StripeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M20.52 6.64a7.1 7.1 0 0 1-2.8-1.76l-.42-.36a.82.82 0 0 0-1.2.13.86.86 0 0 0 .14 1.25l.42.36a5.5 5.5 0 0 0 4.43 1.83h.1a.83.83 0 0 0 .83-.83v-.79c0-.01-.01-.01 0 0zm-5.94 11.51a.82.82 0 0 0 1.2-.14.86.86 0 0 0-.14-1.25l-1.92-1.63a5.45 5.45 0 0 0-3.3-1.1h-.1a.83.83 0 0 0-.83.83v.79c0 2.94 2.45 5.33 5.46 5.33l-.35-2.26zm-7.6-5.26a5.5 5.5 0 0 0 4.43 1.83h.1a.83.83 0 0 0 .83-.83v-.79a.83.83 0 0 0-.83-.83h-.1a7.1 7.1 0 0 1-5.7-2.6l-.42-.36a.82.82 0 0 0-1.2.13.86.86 0 0 0 .14 1.25l.42.36a5.45 5.45 0 0 0 2.13 1.44z" />
        </svg>
    );
}

function MarqetaIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
        </svg>
    );
}

function SSOIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...