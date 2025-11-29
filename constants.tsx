import React from 'react';
import { View } from './types';
import {
    Bot, FileText, Shuffle, PiggyBank, Target, Shield, TrendingUp, Gem, Code, Globe, Cuboid, Home, Palette, Percent, Rocket, Briefcase, Calculator, Scroll, Building, Landmark, Link, Users, Megaphone, Network, ShoppingBag, User, FileCog, Settings, Eye, CreditCard, Lock, Leaf,
    Handshake, Star, Heart, LifeBuoy, MessageCircle, Scale, Lightbulb, CheckCircle, Cloud, Server, RefreshCw, Activity, Plane, Book, Bell, Ship, Mountain
} from 'lucide-react';

// --- Refactoring Note: This file defines navigation structure and static resources.
// We will retain the structure but drastically prune the entries to reflect the MVP scope:
// Recommended MVP: Unified business financial dashboard & Treasury automation module.
// All other non-essential/overly broad categories will be removed or marked for /future-modules.

export const banks = [
    // Keeping a small sample set of reliable financial/institutional placeholders.
    { name: 'Chase Bank', logo: <Building className="w-6 h-6 text-blue-600" />, institution_id: 'ins_chase_001' },
    { name: 'Global Reserve Bank', logo: <Landmark className="w-6 h-6 text-red-600" />, institution_id: 'ins_reserve_002' },
    { name: 'Capital One', logo: <CreditCard className="w-6 h-6 text-blue-800" />, institution_id: 'ins_capital_005' },
    { name: 'J.P. Morgan', logo: <Briefcase className="w-6 h-6 text-blue-700" />, institution_id: 'ins_jpm_008' },
    { name: 'Coinbase Custody', logo: <Gem className="w-6 h-6 text-blue-500" />, institution_id: 'ins_crypto_030' },
    { name: 'Stripe Payments', logo: <Code className="w-6 h-6 text-indigo-600" />, institution_id: 'ins_payments_028' },
];

// --- Consolidated and Scoped Navigation Items for MVP (Financial Dashboard & Treasury Automation)
export const NAV_ITEMS = [
    {
        group: 'Core Financial Operations (MVP)',
        items: [
            // Essential for MVP Dashboard and Treasury
            { view: View.Dashboard, title: 'Executive Dashboard', icon: Home },
            { view: View.ModernTreasury, title: 'Global Treasury Hub', icon: Landmark },
            { view: View.LiquidityManagement, title: 'Liquidity Management', icon: PiggyBank },
            { view: View.RiskManagement, title: 'Financial Risk Control', icon: Shield },
            { view: View.KPIMonitor, title: 'Key Performance Indicators', icon: TrendingUp },
            { view: View.APIStatus, title: 'Financial API Status', icon: Activity }, // Crucial for integration stability
        ]
    },
    {
        group: 'Financial Intelligence & Automation',
        items: [
            // Core AI/Intelligence components relevant to finance MVP
            { view: View.AIAdvisor, title: 'Treasury AI Advisor', icon: Bot },
            { view: View.PredictiveAnalytics, title: 'Cash Flow Forecasting', icon: TrendingUp },
            { view: View.AlgoTradingLab, title: 'Automated Execution', icon: Rocket }, // Can house stable transaction logic
            { view: View.ComplianceAudit, title: 'Regulatory Checks', icon: FileCog },
        ]
    },
    {
        group: 'System & Security',
        items: [
            // Essential infrastructure for stability
            { view: View.SystemHealth, title: 'System Health Monitor', icon: Server },
            { view: View.IdentityAccess, title: 'Access Control (IAM)', icon: Lock },
            { view: View.Settings, title: 'Global Configuration', icon: Settings },
        ]
    }
    // All other highly specialized or experimental modules (e.g., AI Studio, M&A, Robotics, HR)
    // are deemed out of scope for the initial stable MVP and should be archived in /future-modules.
];