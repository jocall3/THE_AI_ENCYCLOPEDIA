import React from 'react';
import { View } from './types';
import {
    Bot, Shuffle, Users, Trophy, PiggyBank, CreditCard, Megaphone, Lightbulb, TrendingUp, Scan, FileText, Truck, Landmark, BookOpen, Shield, Globe, Wallet, HeartPulse, Link as LinkIcon, FileSignature, GraduationCap, Home, Handshake, TrendingDown, Code, Presentation, GaugeCircle, Smartphone, FileCog, Accessibility, KeyRound, Palette, Leaf, Gem, GitCommit, Percent, Network, Image as ImageIcon, Cuboid, Target, User, ConciergeBell
} from 'lucide-react';

export interface NavItem {
    view: View;
    title: string;
    icon: React.ElementType;
    group?: string;
}

export const NAV_ITEMS: NavItem[] = [
    { view: View.Dashboard, title: 'Dashboard', icon: Bot },
    { view: View.Transactions, title: 'Transactions', icon: FileText },
    { view: View.SendMoney, title: 'Send Money', icon: SendIcon },
    { view: View.Budgets, title: 'Budgets', icon: PiggyBank },
    { view: View.FinancialGoals, title: 'Financial Goals', icon: Target },
    { view: View.CreditHealth, title: 'Credit Health', icon: Shield },
    { view: View.Investments, title: 'Investments', icon: TrendingUp },
    { view: View.CryptoWeb3, title: 'Crypto & Web3', icon: BitcoinIcon },
    { view: View.AlgoTradingLab, title: 'Algo-Trading Lab', icon: Code },
    { view: View.ForexArena, title: 'Forex Arena', icon: Globe },
    { view: View.CommoditiesExchange, title: 'Commodities Exchange', icon: Cuboid },
    { view: View.RealEstateEmpire, title: 'Real Estate Empire', icon: Home },
    { view: View.ArtCollectibles, title: 'Art & Collectibles', icon: Palette },
    { view: View.DerivativesDesk, title: 'Derivatives Desk', icon: Percent },
    { view: View.VentureCapital, title: 'Venture Capital', icon: RocketIcon },
    { view: View.PrivateEquity, title: 'Private Equity', icon: BriefcaseIcon },
    { view: View.TaxOptimization, title: 'Tax Optimization', icon: CalculatorIcon },
    { view: View.LegacyBuilder, title: 'Legacy Builder', icon: ScrollIcon },
    { view: View.CorporateCommand, title: 'Corporate Command', icon: BuildingIcon },
    { view: View.ModernTreasury, title: 'Modern Treasury', icon: Landmark },
    { view: View.OpenBanking, title: 'Open Banking', icon: LinkIcon },
    { view: View.FinancialDemocracy, title: 'Financial Democracy', icon: Users },
    { view: View.AIAdStudio, title: 'AI Ad Studio', icon: Megaphone },
    { view: View.QuantumWeaver, title: 'Quantum Weaver', icon: Network },
    { view: View.Marketplace, title: 'Marketplace', icon: ShoppingBagIcon },
    { view: View.ConciergeService, title: 'Concierge Service', icon: User },
    { view: View.APIStatus, title: 'API Status', icon: FileCog },
    { view: View.Settings, title: 'Settings', icon: CogIcon },
    { view: View.TheVision, title: 'The Vision', icon: EyeIcon },
];

// --- Helper Icons (if not directly in Lucide imports above) ---
function SendIcon(props: any) { return <Shuffle {...props} className="transform rotate-45" />; }
function BitcoinIcon(props: any) { return <Gem {...props} />; }
function RocketIcon(props: any) { return <TrendingUp {...props} />; }
function BriefcaseIcon(props: any) { return <Wallet {...props} />; }
function CalculatorIcon(props: any) { return <Smartphone {...props} />; }
function ScrollIcon(props: any) { return <FileSignature {...props} />; }
function BuildingIcon(props: any) { return <Landmark {...props} />; }
function ShoppingBagIcon(props: any) { return <Truck {...props} />; }
function CogIcon(props: any) { return <FileCog {...props} />; }
function EyeIcon(props: any) { return <Scan {...props} />; }