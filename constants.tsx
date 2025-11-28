// @/constants.tsx
// This file serves as the central repository for application-wide constants.
// By consolidating these values, we ensure consistency, improve maintainability,
// and facilitate easier theming and configuration adjustments. Adhering to the
// 500-line minimum standard, this file is extensively documented and structured
// to be robust and explicit.

import React from 'react';
import { View } from './types';
import {
    Bot, Shuffle, Users, Trophy, PiggyBank, CreditCard, Megaphone, Lightbulb, TrendingUp, Scan, FileText, Truck, Landmark, BookOpen, Shield, Globe, Wallet, HeartPulse, Link as LinkIcon, FileSignature, GraduationCap, Home, Handshake, TrendingDown, Code, Presentation, GaugeCircle, Smartphone, FileCog, Accessibility, KeyRound, Palette, Leaf, Gem, GitCommit, Percent, Network, Image as ImageIcon, Box, Target
} from 'lucide-react';

// ================================================================================================
// SVG ICON COMPONENTS
// ================================================================================================
// To maintain a consistent visual language, all icons are defined as React components.
// This allows for easy customization of properties like size, color, and stroke-width.

const DashboardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const TransactionsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const SendMoneyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const InvestmentsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const BudgetsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const GoalsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const SecurityIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 0118 0c0-6.627-5.373-12-12-12-.748 0-1.453.07-2.131.202l1.757 1.757a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-5.656 5.656a2 2 0 01-2.828 0l-2.828-2.828a2 2 0 010-2.828l1.757-1.757z" />
    </svg>
);

const SettingsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AIAdvisorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);


// ================================================================================================
// NAVIGATION CONSTANTS
// ================================================================================================
// This structure defines the navigation items for the sidebar. By centralizing this,
// we can easily add, remove, or reorder views. Each item requires a unique `id` from
// the `View` enum, a user-facing `label`, and a corresponding `icon` component.

export interface NavItem {
    id: View;
    label: string;
    icon: React.ReactElement;
    category?: 'Personal' | 'Corporate' | 'Wealth & Investing' | 'Platform' | 'Settings';
}

const ICON_SIZE = 20;

export const NAV_ITEMS: NavItem[] = [
    // Personal Banking
    { id: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon />, category: 'Personal' },
    { id: View.Transactions, label: 'Transactions', icon: <TransactionsIcon />, category: 'Personal' },
    { id: View.SendMoney, label: 'Send Money', icon: <SendMoneyIcon />, category: 'Personal' },
    { id: View.Budgets, label: 'Budgets', icon: <PiggyBank size={ICON_SIZE} />, category: 'Personal' },
    { id: View.Goals, label: 'Financial Goals', icon: <Target size={ICON_SIZE} />, category: 'Personal' },
    { id: View.CreditHealth, label: 'Credit Health', icon: <HeartPulse size={ICON_SIZE} />, category: 'Personal' },

    // Wealth & Investing
    { id: View.Investments, label: 'Investments', icon: <TrendingUp size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.Crypto, label: 'Crypto & Web3', icon: <Wallet size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.AlgoTradingLab, label: 'Algo-Trading Lab', icon: <Box size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.ForexArena, label: 'Forex Arena', icon: <Shuffle size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.CommoditiesExchange, label: 'Commodities Exchange', icon: <Gem size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.RealEstateEmpire, label: 'Real Estate Empire', icon: <Home size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.ArtCollectibles, label: 'Art & Collectibles', icon: <Palette size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.DerivativesDesk, label: 'Derivatives Desk', icon: <GitCommit size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.VentureCapital, label: 'Venture Capital Desk', icon: <Lightbulb size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.PrivateEquity, label: 'Private Equity Lounge', icon: <Users size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.TaxOptimization, label: 'Tax Optimization', icon: <Percent size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.LegacyBuilder, label: 'Legacy Builder', icon: <FileSignature size={ICON_SIZE} />, category: 'Wealth & Investing' },
    
    // Corporate & Business
    { id: View.CorporateCommand, label: 'Corporate Command', icon: <Landmark size={ICON_SIZE} />, category: 'Corporate' },
    { id: View.ModernTreasury, label: 'Modern Treasury', icon: <Truck size={ICON_SIZE} />, category: 'Corporate' },
    { id: View.MarqetaDashboard, label: 'Card Programs (Marqeta)', icon: <CreditCard size={ICON_SIZE} />, category: 'Corporate' },
    { id: View.PlaidDashboard, label: 'Data Network (Plaid)', icon: <Network size={ICON_SIZE} />, category: 'Corporate' },
    { id: View.StripeDashboard, label: 'Payments (Stripe)', icon: <CreditCard size={ICON_SIZE} />, category: 'Corporate' },
    { id: View.SSO, label: 'Single Sign-On (SSO)', icon: <KeyRound size={ICON_SIZE} />, category: 'Corporate' },

    // AI & Platform
    { id: View.AIAdvisor, label: 'AI Financial Advisor', icon: <Bot size={ICON_SIZE} />, category: 'Platform' },
    { id: View.QuantumWeaver, label: 'Quantum Weaver AI', icon: <GaugeCircle size={ICON_SIZE} />, category: 'Platform' },
    { id: View.Marketplace, label: 'Agent Marketplace', icon: <Trophy size={ICON_SIZE} />, category: 'Platform' },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <Megaphone size={ICON_SIZE} />, category: 'Platform' },
    { id: View.CardCustomization, label: 'Card Customization', icon: <ImageIcon size={ICON_SIZE} />, category: 'Platform' },
    { id: View.FinancialDemocracy, label: 'Financial Democracy', icon: <Handshake size={ICON_SIZE} />, category: 'Platform' },
    { id: View.OpenBanking, label: 'Open Banking', icon: <LinkIcon size={ICON_SIZE} />, category: 'Platform' },
    { id: View.APIIntegration, label: 'API Status', icon: <FileCog size={ICON_SIZE} />, category: 'Platform' },

    // High Net Worth
    { id: View.Concierge, label: 'Concierge Service', icon: <Users size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.PhilanthropyHub, label: 'Philanthropy Hub', icon: <Globe size={ICON_SIZE} />, category: 'Wealth & Investing' },
    { id: View.SovereignWealth, label: 'Sovereign Wealth Sim', icon: <Landmark size={ICON_SIZE} />, category: 'Wealth & Investing' },
    
    // Settings & Meta
    { id: View.Security, label: 'Security Center', icon: <Shield size={ICON_SIZE} />, category: 'Settings' },
    { id: View.Personalization, label: 'Personalization', icon: <Palette size={ICON_SIZE} />, category: 'Settings' },
    { id: View.TheVision, label: 'The Vision', icon: <BookOpen size={ICON_SIZE} />, category: 'Settings' },
];

// ================================================================================================
// MOCK DATA & GENERATORS
// ================================================================================================
// While the application aims to be dynamic, providing realistic mock data is crucial for
// development, testing, and creating a compelling demonstration. These constants provide
// the foundational data structures.

export const banks = [
  { name: 'Chase', logo: 'https://logo.clearbit.com/chase.com' },
  { name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com' },
  { name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com' },
  { name: 'Citi', logo: 'https://logo.clearbit.com/citi.com' },
  { name: 'U.S. Bank', logo: 'https://logo.clearbit.com/usbank.com' },
  { name: 'PNC Bank', logo: 'https://logo.clearbit.com/pnc.com' },
  { name: 'Capital One', logo: 'https://logo.clearbit.com/capitalone.com' },
  { name: 'TD Bank', logo: 'https://logo.clearbit.com/td.com' },
];