import React from 'react';
import { View } from './types';
import {
    Bot, FileText, Shuffle, PiggyBank, Target, Shield, TrendingUp, Gem, Code, Globe, Cuboid, Home, Palette, Percent, Rocket, Briefcase, Calculator, Scroll, Building, Landmark, Link, Users, Megaphone, Network, ShoppingBag, User, FileCog, Settings, Eye, CreditCard, Lock, Leaf
} from 'lucide-react';

export const banks = [
    { name: 'Chase', logo: <Building className="w-6 h-6 text-blue-600" />, institution_id: 'ins_1' },
    { name: 'Bank of America', logo: <Landmark className="w-6 h-6 text-red-600" />, institution_id: 'ins_2' },
    { name: 'Wells Fargo', logo: <Shield className="w-6 h-6 text-yellow-600" />, institution_id: 'ins_3' },
    { name: 'Citi', logo: <Globe className="w-6 h-6 text-blue-400" />, institution_id: 'ins_4' },
    { name: 'Capital One', logo: <CreditCard className="w-6 h-6 text-blue-800" />, institution_id: 'ins_5' },
    { name: 'Goldman Sachs', logo: <Briefcase className="w-6 h-6 text-blue-900" />, institution_id: 'ins_6' },
    { name: 'Morgan Stanley', logo: <TrendingUp className="w-6 h-6 text-gray-800" />, institution_id: 'ins_7' },
    { name: 'J.P. Morgan', logo: <Building className="w-6 h-6 text-blue-700" />, institution_id: 'ins_8' },
    { name: 'HSBC', logo: <Globe className="w-6 h-6 text-red-700" />, institution_id: 'ins_9' },
    { name: 'Barclays', logo: <Shield className="w-6 h-6 text-blue-500" />, institution_id: 'ins_10' },
    { name: 'UBS', logo: <Lock className="w-6 h-6 text-gray-600" />, institution_id: 'ins_11' },
    { name: 'Credit Suisse', logo: <Landmark className="w-6 h-6 text-blue-900" />, institution_id: 'ins_12' },
    { name: 'Deutsche Bank', logo: <Building className="w-6 h-6 text-blue-600" />, institution_id: 'ins_13' },
    { name: 'BNP Paribas', logo: <Globe className="w-6 h-6 text-green-700" />, institution_id: 'ins_14' },
    { name: 'Santander', logo: <CreditCard className="w-6 h-6 text-red-600" />, institution_id: 'ins_15' },
    { name: 'RBC', logo: <Shield className="w-6 h-6 text-yellow-500" />, institution_id: 'ins_16' },
    { name: 'TD Bank', logo: <PiggyBank className="w-6 h-6 text-green-600" />, institution_id: 'ins_17' },
    { name: 'Scotiabank', logo: <Globe className="w-6 h-6 text-red-500" />, institution_id: 'ins_18' },
    { name: 'BMO', logo: <Building className="w-6 h-6 text-blue-800" />, institution_id: 'ins_19' },
    { name: 'BlackRock', logo: <Rock className="w-6 h-6 text-black" />, institution_id: 'ins_20' },
    { name: 'Vanguard', logo: <Ship className="w-6 h-6 text-red-800" />, institution_id: 'ins_21' },
    { name: 'Fidelity', logo: <TrendingUp className="w-6 h-6 text-green-700" />, institution_id: 'ins_22' },
    { name: 'Charles Schwab', logo: <Briefcase className="w-6 h-6 text-blue-400" />, institution_id: 'ins_23' },
    { name: 'American Express', logo: <CreditCard className="w-6 h-6 text-blue-500" />, institution_id: 'ins_24' },
    { name: 'Visa', logo: <CreditCard className="w-6 h-6 text-blue-700" />, institution_id: 'ins_25' },
    { name: 'Mastercard', logo: <CreditCard className="w-6 h-6 text-red-500" />, institution_id: 'ins_26' },
    { name: 'PayPal', logo: <Shuffle className="w-6 h-6 text-blue-600" />, institution_id: 'ins_27' },
    { name: 'Stripe', logo: <Code className="w-6 h-6 text-indigo-600" />, institution_id: 'ins_28' },
    { name: 'Square', logo: <Cuboid className="w-6 h-6 text-gray-800" />, institution_id: 'ins_29' },
    { name: 'Coinbase', logo: <Gem className="w-6 h-6 text-blue-500" />, institution_id: 'ins_30' },
    { name: 'Binance', logo: <Gem className="w-6 h-6 text-yellow-500" />, institution_id: 'ins_31' },
    { name: 'Kraken', logo: <Network className="w-6 h-6 text-purple-600" />, institution_id: 'ins_32' },
    { name: 'Robinhood', logo: <Leaf className="w-6 h-6 text-green-500" />, institution_id: 'ins_33' },
    { name: 'Revolut', logo: <Rocket className="w-6 h-6 text-pink-600" />, institution_id: 'ins_34' },
    { name: 'Wise', logo: <Shuffle className="w-6 h-6 text-green-400" />, institution_id: 'ins_35' },
];

export const NAV_ITEMS = [
    {
        group: 'Enterprise OS',
        items: [
            { view: View.Dashboard, title: 'Executive Dashboard', icon: Bot },
            { view: View.GlobalOverview, title: 'Global Operations', icon: Globe },
            { view: View.CommandCenter, title: 'Command Center', icon: Building },
            { view: View.StrategicPlanning, title: 'Strategic Planning', icon: Target },
            { view: View.BusinessIntelligence, title: 'Business Intelligence', icon: Eye },
            { view: View.KPIMonitor, title: 'KPI Monitor', icon: TrendingUp },
            { view: View.RiskManagement, title: 'Risk Management', icon: Shield },
            { view: View.ComplianceAudit, title: 'Compliance & Audit', icon: FileCog },
        ]
    },
    {
        group: 'AI & Neural Systems',
        items: [
            { view: View.AIAdvisor, title: 'Chief AI Architect', icon: Bot },
            { view: View.NeuralNetwork, title: 'Neural Network Ops', icon: Network },
            { view: View.PredictiveAnalytics, title: 'Predictive Analytics', icon: TrendingUp },
            { view: View.GenerativeStudio, title: 'Generative Studio', icon: Palette },
            { view: View.AutomatedAgents, title: 'Automated Agents', icon: Users },
            { view: View.DeepLearningLab, title: 'Deep Learning Lab', icon: Code },
            { view: View.NaturalLanguage, title: 'NLP Interface', icon: Megaphone },
            { view: View.ComputerVision, title: 'Computer Vision', icon: Eye },
            { view: View.RoboticsControl, title: 'Robotics Control', icon: Settings },
            { view: View.QuantumSolver, title: 'Quantum Solver', icon: Cuboid },
        ]
    },
    {
        group: 'Global Finance & Treasury',
        items: [
            { view: View.ModernTreasury, title: 'Global Treasury', icon: Landmark },
            { view: View.LiquidityManagement, title: 'Liquidity Management', icon: PiggyBank },
            { view: View.ForexArena, title: 'Forex & Currency', icon: Globe },
            { view: View.CryptoWeb3, title: 'Digital Assets & Web3', icon: Gem },
            { view: View.SmartContracts, title: 'Smart Contracts', icon: FileText },
            { view: View.DeFiProtocol, title: 'DeFi Protocols', icon: Link },
            { view: View.Tokenomics, title: 'Tokenomics Engine', icon: Percent },
            { view: View.AlgoTradingLab, title: 'Algorithmic Trading', icon: Code },
            { view: View.HighFrequency, title: 'HFT Systems', icon: Rocket },
            { view: View.DerivativesDesk, title: 'Derivatives & Options', icon: Shuffle },
            { view: View.CommoditiesExchange, title: 'Commodities', icon: Cuboid },
        ]
    },
    {
        group: 'Investment Banking',
        items: [
            { view: View.MergersAcquisitions, title: 'M&A Advisory', icon: Handshake },
            { view: View.IPOManagement, title: 'IPO Management', icon: Megaphone },
            { view: View.CapitalMarkets, title: 'Capital Markets', icon: TrendingUp },
            { view: View.PrivateEquity, title: 'Private Equity', icon: Briefcase },
            { view: View.VentureCapital, title: 'Venture Capital', icon: Rocket },
            { view: View.HedgeFund, title: 'Hedge Fund Ops', icon: Shield },
            { view: View.WealthManagement, title: 'Wealth Management', icon: Gem },
            { view: View.FamilyOffice, title: 'Family Office', icon: Home },
            { view: View.TrustsEstates, title: 'Trusts & Estates', icon: Scroll },
            { view: View.TaxOptimization, title: 'Global Tax Optimization', icon: Calculator },
        ]
    },
    {
        group: 'Corporate Infrastructure',
        items: [
            { view: View.HumanCapital, title: 'Human Capital (HR)', icon: Users },
            { view: View.TalentAcquisition, title: 'Talent Acquisition', icon: User },
            { view: View.PayrollBenefits, title: 'Payroll & Benefits', icon: PiggyBank },
            { view: View.SupplyChain, title: 'Supply Chain', icon: Link },
            { view: View.Logistics, title: 'Global Logistics', icon: Globe },
            { view: View.Procurement, title: 'Procurement', icon: ShoppingBag },
            { view: View.InventoryControl, title: 'Inventory Control', icon: Cuboid },
            { view: View.Manufacturing, title: 'Manufacturing Ops', icon: Settings },
            { view: View.RealEstateEmpire, title: 'Corporate Real Estate', icon: Building },
            { view: View.FacilitiesMgmt, title: 'Facilities Management', icon: Home },
        ]
    },
    {
        group: 'Sales & Marketing Intelligence',
        items: [
            { view: View.CRM, title: 'CRM Enterprise', icon: Users },
            { view: View.SalesPipeline, title: 'Sales Pipeline', icon: TrendingUp },
            { view: View.RevenueOps, title: 'Revenue Operations', icon: Percent },
            { view: View.MarketingAutomation, title: 'Marketing Automation', icon: Megaphone },
            { view: View.AIAdStudio, title: 'AI Ad Studio', icon: Palette },
            { view: View.BrandManagement, title: 'Brand Management', icon: Star },
            { view: View.CustomerSuccess, title: 'Customer Success', icon: Heart },
            { view: View.SupportTickets, title: 'Support Center', icon: LifeBuoy },
            { view: View.SocialSentiment, title: 'Social Sentiment', icon: MessageCircle },
        ]
    },
    {
        group: 'Legal & Governance',
        items: [
            { view: View.LegalCounsel, title: 'General Counsel', icon: Scale },
            { view: View.ContractManagement, title: 'Contract Management', icon: FileText },
            { view: View.IPProtection, title: 'IP Protection', icon: Shield },
            { view: View.RegulatoryAffairs, title: 'Regulatory Affairs', icon: Landmark },
            { view: View.BoardRelations, title: 'Board Relations', icon: Users },
            { view: View.InvestorRelations, title: 'Investor Relations', icon: Briefcase },
            { view: View.CorporateSecretary, title: 'Corporate Secretary', icon: FileCog },
        ]
    },
    {
        group: 'Research & Development',
        items: [
            { view: View.InnovationLabs, title: 'Innovation Labs', icon: Lightbulb },
            { view: View.ProductDevelopment, title: 'Product Development', icon: Cuboid },
            { view: View.Engineering, title: 'Engineering', icon: Code },
            { view: View.QualityAssurance, title: 'Quality Assurance', icon: CheckCircle },
            { view: View.Patents, title: 'Patent Portfolio', icon: Scroll },
            { view: View.MarketResearch, title: 'Market Research', icon: Eye },
        ]
    },
    {
        group: 'Security & Infrastructure',
        items: [
            { view: View.CyberSecurity, title: 'Cyber Security', icon: Shield },
            { view: View.NetworkOps, title: 'Network Operations', icon: Network },
            { view: View.CloudInfrastructure, title: 'Cloud Infrastructure', icon: Cloud },
            { view: View.DataCenter, title: 'Data Center', icon: Server },
            { view: View.IdentityAccess, title: 'Identity & Access (IAM)', icon: Lock },
            { view: View.DisasterRecovery, title: 'Disaster Recovery', icon: RefreshCw },
            { view: View.APIStatus, title: 'API Gateway', icon: FileCog },
            { view: View.SystemHealth, title: 'System Health', icon: Activity },
        ]
    },
    {
        group: 'Personal & Lifestyle',
        items: [
            { view: View.ConciergeService, title: 'Concierge Service', icon: User },
            { view: View.TravelLogistics, title: 'Travel & Logistics', icon: Plane },
            { view: View.ArtCollectibles, title: 'Art & Collectibles', icon: Palette },
            { view: View.Philanthropy, title: 'Philanthropy & Impact', icon: Leaf },
            { view: View.LegacyBuilder, title: 'Legacy Builder', icon: Scroll },
            { view: View.Education, title: 'Education & Learning', icon: Book },
            { view: View.HealthWellness, title: 'Health & Wellness', icon: Heart },
        ]
    },
    {
        group: 'System Configuration',
        items: [
            { view: View.Settings, title: 'Global Settings', icon: Settings },
            { view: View.Personalization, title: 'Personalization', icon: Palette },
            { view: View.BillingSubscription, title: 'Billing & Subscription', icon: CreditCard },
            { view: View.TeamManagement, title: 'Team Management', icon: Users },
            { view: View.Integrations, title: 'Integrations', icon: Link },
            { view: View.AuditLogs, title: 'Audit Logs', icon: FileText },
            { view: View.SSO, title: 'Single Sign-On', icon: Lock },
            { view: View.Notifications, title: 'Notifications', icon: Bell },
        ]
    }
];