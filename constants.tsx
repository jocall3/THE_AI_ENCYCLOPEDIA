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
    { id: View.Crypto, label: 'Crypto & Web3', icon: <CryptoIcon /> },
    { id: View.Goals, label: 'Financial Goals', icon: <GoalsIcon /> },
    { id: View.Security, label: 'Security Center', icon: <SecurityIcon /> },
    
    // Corporate Section
    { id: View.CorporateCommand, label: 'Corporate Command', icon: <CorporateIcon />, section: 'Corporate' },
    { id: View.SendMoney, label: 'Treasury & Payments', icon: <SendMoneyIcon /> },
    { id: View.Budgets, label: 'Budgeting & Cards', icon: <BudgetsIcon /> },

    // AI & Advanced Tools Section
    { id: View.AIAdvisor, label: 'AI Financial Advisor', icon: <AIAdvisorIcon />, section: 'AI & Tools' },
    { id: View.QuantumWeaver, label: 'Quantum Weaver', icon: <QuantumWeaverIcon /> },
    { id: View.Marketplace, label: 'Agent Marketplace', icon: <MarketplaceIcon /> },
    { id: View.AIAdStudio, label: 'AI Ad Studio', icon: <AdStudioIcon /> },

    // Platform & Integrations Section
    { id: View.APIIntegration, label: 'API Status', icon: <APIStatusIcon />, section: 'Platform' },
    { id: View.OpenBanking, label: 'Open Banking', icon: <OpenBankingIcon /> },
    { id: View.FinancialDemocracy, label: 'Financial Democracy', icon: <DemocracyIcon /> },
];


// ================================================================================================
// ICON COMPONENTS
// ================================================================================================
// Note: In a larger application, these would typically be in their own `components/icons` directory
// and possibly dynamically imported. For this demo, they are co-located for simplicity.
// They are designed to be minimal and use `currentColor` for easy styling via Tailwind's text color utilities.

const iconProps = {
    className: "h-5 w-5",
    strokeWidth: 1.5,
};

function DashboardIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>); }
function TransactionsIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>); }
function SendMoneyIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>); }
function BudgetsIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h.375m15.75-1.5v- .75a.75.75 0 00-.75-.75h-.75M4.5 19.5a3 3 0 00-3-3V6c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v10.5a3 3 0 00-3-3h-10.5" /></svg>); }
function InvestmentsIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>); }
function SecurityIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>); }
function AIAdvisorIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V8.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 8.25v7.5a2.25 2.25 0 002.25 2.25z" /></svg>); }
function CorporateIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6zm0 5.25h.008v.008H5.25v-.008zm0 5.25h.008v.008H5.25v-.008zm13.5 0h-.008v.008h.008v-.008zm0-5.25h-.008v.008h.008v-.008zm0-5.25h-.008v.008h.008V6z" /></svg>); }
function QuantumWeaverIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>); }
function MarketplaceIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H4.5A2.25 2.25 0 002.25 13.5V21M6 4.5h12M6 4.5v7.5M6 4.5L2.25 9M18 4.5v7.5M18 4.5L21.75 9M12 13.5v7.5M12 13.5a2.25 2.25 0 01-2.25-2.25H10.5a2.25 2.25 0 01-2.25-2.25V4.5" /></svg>); }
function APIStatusIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75H19.5a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25H8.25a2.25 2.25 0 01-2.25-2.25V6.034a2.25 2.25 0 01.996-1.858l4.5-3.375a2.25 2.25 0 012.25 0l4.5 3.375a2.25 2.25 0 01.996 1.858zM8.25 3.75v16.5" /></svg>); }
function OpenBankingIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 10.5a2.25 2.25 0 00-2.25 2.25v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-7.5zM22.5 10.5a2.25 2.25 0 00-2.25 2.25v7.5a2.25 2.25 0 002.25 2.25h.75a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75z" /></svg>); }
function DemocracyIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>); }
function AdStudioIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>); }
function CryptoIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>); }
function GoalsIcon() { return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a17.96 17.96 0 01-12.134-1.372l0 0-1.096 1.096m11.268-1.096L19.5 7.25l-.228-1.144c-.23-1.141-.832-2.135-1.541-2.844l0 0a.69.69 0 01-.1-.106c-.31-.31-.555-.555-.845-.845L16.25 2.25l-2.435 2.435m-3.926 3.926l-2.435 2.435m7.362-7.362L15.59 14.37z" /></svg>); }

// ================================================================================================
// PLAID SIMULATION CONSTANTS
// ================================================================================================
/**
 * @description A list of mock bank data for use in the Plaid Link simulation modal.
 * This provides a realistic selection of institutions for the user to "connect" to.
 * Each object includes the bank's name, a unique ID, and an SVG logo component.
 */
export const banks = [
    { id: 'ins_1', name: 'Chase', logo: <ChaseLogo /> },
    { id: 'ins_2', name: 'Bank of America', logo: <BofALogo /> },
    { id: 'ins_3', name: 'Wells Fargo', logo: <WellsFargoLogo /> },
    { id: 'ins_4', name: 'Citi', logo: <CitiLogo /> },
    { id: 'ins_5', name: 'Capital One', logo: <CapitalOneLogo /> },
    { id: 'ins_6', name: 'US Bank', logo: <USBankLogo /> },
];

function ChaseLogo() { return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#117ACA]"><title>Chase</title><path d="m12.128.12-5.45 9.423 5.45 9.439 5.45-9.44zM12.128 24l-5.45-9.423 5.45-9.439 5.45 9.44z"/></svg>; }
function BofALogo() { return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#E21827]"><title>Bank of America</title><path d="M22.03.62H1.97C.88.62 0 1.5 0 2.59V21.4c0 1.09.88 1.97 1.97 1.97h20.06c1.09 0 1.97-.88 1.97-1.97V2.59c0-1.09-.88-1.97-1.97-1.97zM5.1 19.34H2.48V8.12h2.62zm5.73 0h-2.6V8.12h2.6zm5.73 0h-2.62V8.12h2.62zm5.47-15.02H2.48V2.59h19.05z"/></svg>; }
function WellsFargoLogo() { return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#D71E28]"><title>Wells Fargo</title><path d="M12.0002 0C5.37258 0 0 5.37258 0 12.0002C0 18.6278 5.37258 24.0004 12.0002 24.0004C18.6278 24.0004 24.0004 18.6278 24.0004 12.0002C24.0004 5.37258 18.6278 0 12.0002 0ZM18.7247 11.2036L15.9329 11.0263L14.7394 6.81934H17.4764L18.7247 11.2036ZM13.8242 6.81934L12.0275 12.6074L10.176 6.81934H13.8242ZM9.20605 6.81934L10.4269 11.0263L7.63513 11.2036L6.38684 6.81934H9.20605ZM6.00049 12.5527H8.87451L9.56384 14.6362L6.38684 17.1812L6.00049 12.5527ZM9.50903 15.4951L12.0275 13.522L14.4912 15.4951L12.0275 17.5957L9.50903 15.4951ZM17.9723 12.5527L17.5859 17.1812L14.4365 14.6362L15.1259 12.5527H17.9723Z"/></svg>; }
function CitiLogo() { return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#003B70]"><title>Citi</title><path d="M22.61.032c-.378 0-.585.12-.87.35l-7.523 6.138-1.124-.877.87-4.14C13.88.63 13.58.032 12.8.032h-1.6c-.78 0-1.08.585-1.16 1.455l.87 4.14-1.124.877-7.523-6.138c-.285-.23-.493-.35-.87-.35H.032L0 1.34c0 .3.24.465.48.645l6.092 4.965-3.344 1.725c-.345.18-.51.465-.51.81V24h2.235c.42 0 .6-.21.6-.66V11.22l2.67-1.38c.135-.075.24-.075.375 0l11.41 8.805V23.34c0 .45.18.66.6.66H24V9.52c0-.345-.165-.63-.51-.81l-3.344-1.725L23.52 1.985c.24-.18.48-.345.48-.645L23.968.03l-1.358.002zM12 14.282c-2.43 0-4.395-1.965-4.395-4.395S9.57 5.507 12 5.507c2.43 0 4.395 1.965 4.395 4.38s-1.965 4.395-4.395 4.395z"/><path d="M12.012 11.24c.735 0 1.335-.6 1.335-1.335s-.6-1.335-1.335-1.335-1.335.6-1.335 1.335.6 1.335 1.335 1.335zM5.318 10.97c0-.255.195-.45.45-.45h1.335c.255 0 .45.195.45.45v2.115c0 .255-.195.45-.45.45H5.768c-.255 0-.45-.195-.45-.45v-2.115zm12.93 0c0-.255.195-.45.45-.45h1.335c.255 0 .45.195.45.45v2.115c0 .255-.195.45-.45.45h-1.335c-.255 0-.45-.195-.45-.45v-2.115z"/></svg>; }
function CapitalOneLogo() { return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#004879]"><title>Capital One</title><path d="M21.233.058l-1.282.493a11.96 11.96 0 0 0-7.85-2.52C5.46-1.97 0 3.52 0 10.16c0 6.01 5.3 11.21 12.02 11.21 6.56 0 11.95-5.07 11.98-11.37V.058h-.767zM12.02 19c-4.94 0-8.95-3.8-8.95-8.84S7.08 1.32 12.02 1.32c2.18 0 4.18.77 5.8 2.02L6.75 8.13c-.3.8-.07 1.48.56 2.05.6.53 1.38.69 2.06.39l10.5-4.4c.03 1.4-.23 2.76-.78 4.02-1.5 3.4-4.8 5.8-8.9 5.8z"/></svg>; }
function USBankLogo() { return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#D11C23]"><title>U.S. Bank</title><path d="M19.14 6.275h-1.928v-2.17h-2.11V1.996h6.12v2.11h-2.082v2.17zm-11.1 0v2.17h-1.93V6.275H4.21V4.106h6.12v2.17H8.04zM24 10.748H0v2.11h2.11v4.864c0 1.295.688 1.928 1.928 1.928h1.815V17.54h-1.37v-2.69h1.37v-2.11h4.293v2.11h1.37v2.69h-1.37v2.11h1.816c1.24 0 1.928-.633 1.928-1.928v-4.864H24v-2.11zM11.96 12.858H9.88v2.69h2.08v-2.69zm4.21 0h-2.08v2.69h2.08v-2.69z"/></svg>; }
