export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'scheduled_expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  carbonFootprint?: number;
  isScheduled?: boolean;
  scheduledRule?: ScheduledPaymentRule;
}

export interface Asset {
  name: string;
  value: number;
  color: string;
  esgRating?: number;
  description?: string;
  performanceYTD?: number;
  id?: string;
  category?: string;
  lastUpdated?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  chartData?: { name: string; value: number }[];
}

export interface BudgetCategory {
    id: string;
    name: string;
    limit: number;
    spent: number;
    color: string;
}

export interface GamificationState {
    score: number;
    level: number;
    levelName: string;
    progress: number;
    credits: number;
}

export interface AIPlanStep {
    title: string;
    description: string;
    timeline: string;
    category?: string;
}

export interface AIPlan {
    title: string;
    summary: string;
    steps: AIPlanStep[];
    monthlyContribution?: number;
    feasibilitySummary?: string;
    actionableSteps?: string[];
}

export type IllusionType = 'none' | 'aurora';

export interface LinkedAccount {
  id: string;
  name: string;
  mask: string;
  // Expanded fields for security view
  type?: string; 
  subtype?: string;
  balance?: number;
  lastUpdated?: string;
}

export interface QuantumWeaverState {
    stage: WeaverStage;
    progress: number;
    currentPlan: AIPlan | null;
    questions: AIQuestion[];
    answers: { [key: string]: string };
}

export interface AIQuestion {
    id: string;
    question: string;
    type: 'text' | 'number' | 'textarea';
}

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    billingCycle: 'monthly' | 'yearly';
    nextPaymentDate: string;
}

export interface DetectedSubscription extends Subscription {
    confidence: number;
}

export interface CreditScore {
    score: number;
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    lastUpdated: string;
}

export interface UpcomingBill {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
}

export interface MarketMover {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
}

export interface MarketplaceProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    author: string;
}

export interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    aiPlan?: AIGoalPlan | null;
}

export interface AIGoalPlan {
    monthlyContribution: number;
    steps: string[];
    feasibilitySummary: string;
}

export interface CryptoAsset {
    id: string;
    name: string;
    symbol: string;
    balance: number;
    usdValue: number;
    logo: string;
    price: number;
    change24h: number;
}

export interface VirtualCard {
    id: string;
    last4: string;
    expiration: string;
    cvv: string;
    balance: number;
}

export interface PaymentOperation {
    id: string;
    status: 'pending' | 'completed' | 'failed';
    error?: string;
}

export interface CorporateCard {
    id: string;
    cardholderName: string;
    last4: string;
    limit: number;
    spent: number;
    status: 'active' | 'frozen';
}

export interface CorporateTransaction {
    id: string;
    cardId: string;
    merchant: string;
    amount: number;
    date: string;
    approved: boolean;
}

export interface RewardPoints {
    balance: number;
}

export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error';
    read: boolean;
}

export interface NFTAsset {
    id: string;
    name: string;
    collection: string;
    imageUrl: string;
    floorPrice?: number;
    lastSalePrice?: number;
}

export interface RewardItem {
    id: string;
    name: string;
    cost: number;
    type: 'cashback' | 'giftcard' | 'perk';
}

export interface APIStatus {
    plaid: 'operational' | 'degraded' | 'outage';
    stripe: 'operational' | 'degraded' | 'outage';
    marqeta: 'operational' | 'degraded' | 'outage';
    modernTreasury: 'operational' | 'degraded' | 'outage';
    googleGenAI: 'operational' | 'degraded' | 'outage';
}

export interface CreditFactor {
    name: string;
    status: 'Good' | 'Fair' | 'Poor';
    description: string;
}


export interface CorporateCardControls {
    spendLimit: number;
    blockedCategories: string[];
}

export interface Counterparty {
    id: string;
    name: string;
    accountNumber: string;
}

export interface PaymentOrder {
    id: string;
    counterpartyId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
}

export interface Invoice {
    id: string;
    number: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'unpaid';
}

export interface ComplianceCase {
    id: string;
    reason: string;
    status: 'open' | 'closed';
}


export interface LedgerAccount {
    id: string;
    name: string;
    description: string;
    normal_balance: 'credit' | 'debit';
    balances: {
        pending_balance: { amount: number; currency: string; exponent: number };
        posted_balance: { amount: number; currency: string; exponent: number };
    };
}

export interface UserPreferences {
    theme: 'dark' | 'light';
    notifications: {
        largeTransactions: boolean;
        budgetWarnings: boolean;
        aiInsights: boolean;
    };
}

export interface RecurringContribution {
    goalId: string;
    amount: number;
    frequency: 'weekly' | 'monthly';
}

export interface Contribution {
    id: string;
    goalId: string;
    amount: number;
    date: string;
}

export interface LinkedGoal {
    primaryGoalId: string;
    secondaryGoalId: string;
    contributionRatio: number;
}

export interface ScheduledPaymentRule {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    month?: number; // 0-11 for yearly
    endDate?: string;
}

export interface PlaidLinkMetadata {
    institution: {
        name: string;
        institution_id: string;
    };
    accounts: Array<{ 
        id: string;
        name: string;
        mask: string;
        type: string;
        subtype: string;
    }>;
}

export interface EIP6963ProviderInfo {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
}

export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo;
    provider: any; // EIP-1193 provider object
}

export interface CompanyProfile {
    id: string;
    name: string;
    sector: string;
    marketCap: number; // in millions
    esgScore: number; // 0-100
    description: string;
}

export interface RealEstateProperty {
    id: string;
    name: string;
    location: string;
    value: number;
    yield: number;
}

export interface ArtPiece {
    id: string;
    title: string;
    artist: string;
    value: number;
    medium: string;
}

export interface AlgoStrategy {
    id: string;
    name: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
}

export interface VentureStartup {
    id: string;
    name: string;
    sector: string;
    valuation: number; // in millions
    fundingStage: string;
}



export enum View {
    Dashboard = 'dashboard',
    Transactions = 'transactions',
    SendMoney = 'send-money',
    Budgets = 'budgets',
    Investments = 'investments',
    AIAdvisor = 'ai-advisor',
    Security = 'security',
    Settings = 'settings',
    TheVision = 'the-vision',
    APIIntegration = 'api-integration',
    PlaidDashboard = 'plaid-dashboard',
    StripeDashboard = 'stripe-dashboard',
    MarqetaDashboard = 'marqeta-dashboard',
    ModernTreasury = 'modern-treasury',
    OpenBanking = 'open-banking',
    FinancialDemocracy = 'financial-democracy',
    Crypto = 'crypto',
    AIAdStudio = 'ai-ad-studio',
    QuantumWeaver = 'quantum-weaver',
    Marketplace = 'marketplace',
    CorporateCommand = 'corporate-command',
    CardCustomization = 'card-customization',
    CreditHealth = 'credit-health',
    FinancialGoals = 'financial-goals',
    Rewards = 'rewards',
    Personalization = 'personalization',
    // Enterprise Suite
    SSO = 'sso',
    AlgoTradingLab = 'algo-trading-lab',
    VentureCapitalDesk = 'venture-capital-desk',
    PrivateEquityLounge = 'private-equity-lounge',
    DerivativesDesk = 'derivatives-desk',
    ForexArena = 'forex-arena',
    CommoditiesExchange = 'commodities-exchange',
    TaxOptimizationChamber = 'tax-optimization-chamber',
    RealEstateEmpire = 'real-estate-empire',
    ArtCollectibles = 'art-collectibles',
    LegacyBuilder = 'legacy-builder',
    PhilanthropyHub = 'philanthropy-hub',
    SovereignWealth = 'sovereign-wealth',
    GlobalMarketMap = 'global-market-map',
    QuantumAssets = 'quantum-assets',
    ConciergeService = 'concierge-service',

    // New src/components/features views
    AutonomousFinanceAgentLog = 'autonomous-finance-agent-log',
    FinancialRuleBuilder = 'financial-rule-builder',
    JointBudgetTracker = 'joint-budget-tracker',
    GamifiedGroupSavings = 'gamified-group-savings',
    SharedVaultDashboard = 'shared-vault-dashboard',
    CorporateCardControlsPanel = 'corporate-card-controls-panel',
    AIAdCampaignManager = 'ai-ad-campaign-manager',
    AIInsightFeed = 'ai-insight-feed',
    RetirementPlanner = 'retirement-planner',
    AIInvoiceScanner = 'ai-invoice-scanner',
    PayrollProcessingWizard = 'payroll-processing-wizard',
    SupplyChainFinancePortal = 'supply-chain-finance-portal',
    TreasuryDashboard = 'treasury-dashboard',
    FinancialLiteracyModule = 'financial-literacy-module',
    TeenDebitCardManager = 'teen-debit-card-manager',
    ForeignExchangeHedgingTool = 'foreign-exchange-hedging-tool',
    MultiCurrencyWallet = 'multi-currency-wallet',
    APIHealthDashboard = 'api-health-dashboard',
    MarqetaCardProgramDashboard = 'marqeta-card-program-dashboard',
    PlaidConnectionManager = 'plaid-connection-manager',
    StripeChargeDashboard = 'stripe-charge-dashboard',
    DigitalTrustAndWillCreator = 'digital-trust-and-will-creator',
    CollegeSavingsPlanner529 = 'college-savings-planner-529',
    MortgageAffordabilityCalculator = 'mortgage-affordability-calculator',
    AIBillNegotiator = 'ai-bill-negotiator',
    DebtPayoffPlanner = 'debt-payoff-planner',
    DeveloperPortal = 'developer-portal',
    PitchAnalysisStepper = 'pitch-analysis-stepper',
    SecurityScoreDashboard = 'security-score-dashboard',
    DeviceManager = 'device-manager',
    TransactionRuleBuilderUI = 'transaction-rule-builder-ui',
    AccessibilitySettingsPanel = 'accessibility-settings-panel',
    TwoFactorAuthSetup = 'two-factor-auth-setup',
    ThemeBuilder = 'theme-builder',
    CarbonFootprintOptimizer = 'carbon-footprint-optimizer',
    AlternativeAssetTracker = 'alternative-asset-tracker',
    AutomatedPortfolioRebalancer = 'automated-portfolio-rebalancer',
    AITaxOptimizer = 'ai-tax-optimizer',
    DeFiYieldExplorer = 'defi-yield-explorer',
    NFTValuationTool = 'nft-valuation-tool',
    Web3CorporateWallet = 'web3-corporate-wallet'
}

export enum WeaverStage {
    INITIALIZING = 'initializing',
    GATHERING_INFO = 'gathering_info',
    ANALYZING = 'analyzing',
    PLAN_READY = 'plan_ready'
}


// Login Activity for Security View
export interface LoginActivity {
    id: string;
    timestamp: string;
    ip: string;
    location: string;
    device: string;
    status: 'success' | 'failed';
}

// Device Management for Security View
export interface Device {
    id: string;
    name: string;
    type: 'desktop' | 'mobile' | 'tablet';
    lastLogin: string;
    isTrusted: boolean;
}

// Data Sharing Policy for Security View
export interface DataSharingPolicy {
    appId: string;
    appName: string;
    permissions: string[];
    status: 'active' | 'revoked';
}

// Transaction Rules for Security View
export interface TransactionRule {
    id: string;
    description: string;
    action: 'alert' | 'block';
    isEnabled: boolean;
}

// Threat Alerts for Security View
export interface ThreatAlert {
    id: string;
    timestamp: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    status: 'new' | 'investigating' | 'resolved';
}

// Audit Logs for Security View
export interface AuditLogEntry {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

// API Key Management for Security View
export interface APIKey {
    id: string;
    name: string;
    keyPrefix: string;
    createdDate: string;
    lastUsed: string;
    scopes: string[];
}

// Trusted Contacts for Security View
export interface TrustedContact {
    id: string;
    name: string;
    relationship: string;
    contactInfo: string;
}

// Security Awareness Modules for Security View
export interface SecurityAwarenessModule {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

// Security Score Metrics for Security View
export interface SecurityScoreMetric {
    name: string;
    score: number; // 0-100
    description: string;
}

// Marqeta types (mocked)
export interface MarqetaCardProgram {
    token: string;
    name: string;
    active: boolean;
    fulfillment: any;
    created_time: string;
}

export interface MarqetaCardholder {
    token: string;
    first_name: string;
    last_name: string;
    email: string;
    active: boolean;
    status: string;
    created_time: string;
}

// Stripe types (mocked)
export interface StripeBalance {
    available: { amount: number; currency: string; }[];
    pending: { amount: number; currency: string; }[];
}

export interface StripeCharge {
    id: string;
    amount: number;
    currency: string;
    status: 'succeeded' | 'pending' | 'failed';
    created: number; // unix timestamp
    description: string | null;
}