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
    { view: 'Dashboard', title: 'Dashboard', icon: Bot },
    { view: 'Transactions', title: 'Transactions', icon: FileText },
    { view: 'Send Money', title: 'Send Money', icon: SendIcon },
    { view: 'Budgets', title: 'Budgets', icon: PiggyBank },
    { view: 'Financial Goals', title: 'Financial Goals', icon: Target },
    { view: 'Credit Health', title: 'Credit Health', icon: Shield },
    { view: 'Investments', title: 'Investments', icon: TrendingUp },
    { view: 'Crypto & Web3', title: 'Crypto & Web3', icon: BitcoinIcon },
    { view: 'Algo-Trading Lab', title: 'Algo-Trading Lab', icon: Code },
    { view: 'Forex Arena', title: 'Forex Arena', icon: Globe },
    { view: 'Commodities Exchange', title: 'Commodities Exchange', icon: Cuboid },
    { view: 'Real Estate Empire', title: 'Real Estate Empire', icon: Home },
    { view: 'Art & Collectibles', title: 'Art & Collectibles', icon: Palette },
    { view: 'Derivatives Desk', title: 'Derivatives Desk', icon: Percent },
    { view: 'Venture Capital', title: 'Venture Capital', icon: RocketIcon },
    { view: 'Private Equity', title: 'Private Equity', icon: BriefcaseIcon },
    { view: 'Tax Optimization', title: 'Tax Optimization', icon: CalculatorIcon },
    { view: 'Legacy Builder', title: 'Legacy Builder', icon: ScrollIcon },
    { view: 'Corporate Command', title: 'Corporate Command', icon: BuildingIcon },
    { view: 'Modern Treasury', title: 'Modern Treasury', icon: Landmark },
    { view: 'Open Banking', title: 'Open Banking', icon: LinkIcon },
    { view: 'Financial Democracy', title: 'Financial Democracy', icon: Users },
    { view: 'AI Ad Studio', title: 'AI Ad Studio', icon: Megaphone },
    { view: 'Quantum Weaver', title: 'Quantum Weaver', icon: Network },
    { view: 'Marketplace', title: 'Marketplace', icon: ShoppingBagIcon },
    { view: 'concierge_service', title: 'Concierge Service', icon: User },
    { view: 'API Status', title: 'API Status', icon: FileCog },
    { view: 'Settings', title: 'Settings', icon: CogIcon },
    { view: 'The Vision', title: 'The Vision', icon: EyeIcon },
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