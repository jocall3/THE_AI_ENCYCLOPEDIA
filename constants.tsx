
import React from 'react';
import { View } from './types';
import { 
    LayoutDashboard, CreditCard, PieChart, TrendingUp, Shield, Settings, 
    Briefcase, Globe, DollarSign, Link, Cpu, Lock, Send
} from 'lucide-react';

export type NavItem = {
    id?: View;
    label: string;
    icon?: React.ReactElement;
    type?: 'header' | 'divider' | 'link';
    view?: View;
    title?: string;
    group?: string;
    items?: { title: string; view: View; icon?: any }[];
};

export const NAV_ITEMS: NavItem[] = [
    { type: 'header', label: 'Personal Banking' },
    { id: View.Dashboard, label: 'Dashboard', icon: <LayoutDashboard /> },
    { id: View.Transactions, label: 'Transactions', icon: <CreditCard /> },
    { id: View.SendMoney, label: 'Send Money', icon: <Send /> },
    { id: View.Budgets, label: 'Budgets', icon: <PieChart /> },
    { id: View.Investments, label: 'Investments', icon: <TrendingUp /> },
    { id: View.FinancialGoals, label: 'Goals', icon: <Globe /> },
    { id: View.CreditHealth, label: 'Credit Health', icon: <Shield /> },
    
    { type: 'divider', label: 'divider' },
    { type: 'header', label: 'Enterprise' },
    { id: View.CorporateCommand, label: 'Corporate Command', icon: <Briefcase /> },
    { id: View.DataNetwork, label: 'Data Network (Plaid)', icon: <Link /> },
    { id: View.Payments, label: 'Payments (Stripe)', icon: <DollarSign /> },
    { id: View.CardPrograms, label: 'Card Programs (Marqeta)', icon: <CreditCard /> },
    { id: View.ModernTreasury, label: 'Treasury', icon: <DollarSign /> },
    
    { type: 'divider', label: 'divider' },
    { type: 'header', label: 'Intelligence' },
    { id: View.AIAdvisor, label: 'AI Advisor', icon: <Cpu /> },
    { id: View.QuantumWeaver, label: 'Quantum Weaver', icon: <Cpu /> },
    
    { type: 'divider', label: 'divider' },
    { type: 'header', label: 'System' },
    { id: View.SecurityCenter, label: 'Security Center', icon: <Lock /> },
    { id: View.Settings, label: 'Settings', icon: <Settings /> },
];

export const banks = [
    { id: 'ins_1', name: 'Bank of America', institution_id: 'ins_1', logo: <div className="w-full h-full bg-red-600 flex items-center justify-center text-white font-bold">BoA</div> },
    { id: 'ins_2', name: 'Chase', institution_id: 'ins_2', logo: <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold">Chase</div> },
    { id: 'ins_3', name: 'Wells Fargo', institution_id: 'ins_3', logo: <div className="w-full h-full bg-yellow-600 flex items-center justify-center text-white font-bold">WF</div> },
    { id: 'ins_4', name: 'Citi', institution_id: 'ins_4', logo: <div className="w-full h-full bg-blue-400 flex items-center justify-center text-white font-bold">Citi</div> },
    { id: 'ins_5', name: 'US Bank', institution_id: 'ins_5', logo: <div className="w-full h-full bg-blue-800 flex items-center justify-center text-white font-bold">USB</div> },
];
