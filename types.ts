
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'scheduled_expense' | 'transfer';
  category: string;
  description: string;
  amount: number;
  date: string;
  carbonFootprint?: number;
  isScheduled?: boolean;
  scheduledRule?: any;
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
  riskLevel: 'Low' | 'Medium' | 'High';
  assetClass: string;
  historicalData?: { date: string, value: number }[];
}

export interface AIInsight {
  id: string;
  title?: string;
  description?: string;
  urgency?: 'low' | 'medium' | 'high';
  chartData?: { name: string; value: number }[];
  // Stripe View Compatibility
  type?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  summary?: string;
  details?: string;
  timestamp?: number;
  source?: string;
  recommendation?: string;
  confidence?: number;
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
  institution?: string;
  institutionId?: string;
  balance?: number;
  type?: string;
  subtype?: string;
  status?: 'active' | 'error' | 'disconnected';
  lastUpdated?: string;
}

export type Account = LinkedAccount;

// --- Marqeta Specific Types ---

export interface MarqetaCardProductConfig {
    poi: {
        other: {
            allow: boolean;
            card_presence_required: boolean;
            cardholder_presence_required: boolean;
            track1_discretionary_data?: string;
            track2_discretionary_data?: string;
            use_static_pin: boolean;
        };
        ecommerce: boolean;
        atm: boolean;
    };
    transaction_controls: {
        accepted_countries_token: string;
        always_require_pin: boolean;
        always_require_icc: boolean;
        allow_gpa_auth: boolean;
        require_card_not_present_card_security_code: boolean;
        allow_mcc_group_authorization_controls: boolean;
        allow_first_pin_set_via_financial_transaction: boolean;
        ignore_card_suspended_state: boolean;
        allow_chip_fallback: boolean;
        allow_network_load: boolean;
        allow_network_load_card_activation: boolean;
        allow_quasi_cash: boolean;
        enable_partial_auth_approval: boolean;
        address_verification: {
            av_messages: {
                validate: boolean;
                decline_on_address_number_mismatch: boolean;
                decline_on_postal_code_mismatch: boolean;
            };
            auth_messages: {
                validate: boolean;
                decline_on_address_number_mismatch: boolean;
                decline_on_postal_code_mismatch: boolean;
            };
        };
    };
    card_life_cycle: {
        activate_upon_issue: boolean;
        expiration_offset: {
            unit: string;
            value: number;
        };
        card_service_code: number;
        update_expiration_upon_activation: boolean;
    };
    fulfillment: {
        payment_instrument: string;
        package_id: string;
        all_zero_card_security_code: boolean;
        bin_prefix: string;
        bulk_ship: boolean;
        pan_length: string;
        fulfillment_provider: string;
        allow_card_creation: boolean;
        uppercase_name_lines: boolean;
        enable_offline_pin: boolean;
    };
    jit_funding?: {
        program_funding_source: {
            enabled: boolean;
        }
    };
}

export interface MarqetaCardProduct {
    token: string;
    name: string;
    active: boolean;
    start_date: string;
    config: MarqetaCardProductConfig;
    created_time: string;
    last_modified_time: string;
}

export interface MarqetaAPIResponse {
    count: number;
    start_index: number;
    end_index: number;
    is_more: boolean;
    data: MarqetaCardProduct[];
}

// --- Navigation Views ---

export const View = {
  Dashboard: 'Dashboard',
  Transactions: 'Transactions',
  SendMoney: 'Send Money',
  Budgets: 'Budgets',
  FinancialGoals: 'Financial Goals',
  CreditHealth: 'Credit Health',
  Investments: 'Investments',
  CryptoWeb3: 'Crypto & Web3',
  AlgoTradingLab: 'Algo-Trading Lab',
  ForexArena: 'Forex Arena',
  CommoditiesExchange: 'Commodities Exchange',
  RealEstateEmpire: 'Real Estate Empire',
  ArtCollectibles: 'Art & Collectibles',
  DerivativesDesk: 'Derivatives Desk',
  VentureCapital: 'Venture Capital',
  PrivateEquity: 'Private Equity',
  TaxOptimization: 'Tax Optimization',
  LegacyBuilder: 'Legacy Builder',
  CorporateCommand: 'Corporate Command',
  ModernTreasury: 'Modern Treasury',
  CardPrograms: 'Card Programs', // Marqeta
  DataNetwork: 'Data Network', // Plaid
  Payments: 'Payments', // Stripe
  SSO: 'SSO',
  AIAdvisor: 'AI Advisor',
  QuantumWeaver: 'Quantum Weaver',
  AgentMarketplace: 'Agent Marketplace',
  AIAdStudio: 'AI Ad Studio',
  CardCustomization: 'Card Customization',
  FinancialDemocracy: 'Financial Democracy',
  OpenBanking: 'Open Banking',
  APIStatus: 'API Status',
  ConciergeService: 'Concierge Service',
  Philanthropy: 'Philanthropy',
  SovereignWealth: 'Sovereign Wealth',
  SecurityCenter: 'Security Center',
  Personalization: 'Personalization',
  TheVision: 'The Vision',
  Settings: 'Settings',
  APIIntegration: 'API Integration', // Added
  AIStrategy: 'AI Strategy', // Added
  Rewards: 'Rewards', // Added
  Goals: 'Goals' // Added
} as const;

export type View = typeof View[keyof typeof View];

export const WeaverStage = {
  initial: 'initial',
  analyzing: 'analyzing',
  planning: 'planning',
  complete: 'complete',
  error: 'error',
  Pitch: 'Pitch', // Added
  Analysis: 'Analysis', // Added
  Test: 'Test', // Added
  Error: 'Error', // Added
  FinalReview: 'FinalReview', // Added
  Approved: 'Approved' // Added
} as const;

export type WeaverStage = typeof WeaverStage[keyof typeof WeaverStage];

// --- Plaid Types ---

export type PlaidProduct = 'transactions' | 'auth' | 'identity' | 'assets' | 'investments' | 'liabilities';

export interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  verification_status?: string;
}

export interface PlaidLinkSuccessMetadata {
  public_token: string;
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: PlaidAccount[];
  link_session_id: string;
}

export type PlaidMetadata = PlaidLinkSuccessMetadata;

// --- Other Shared Types ---

export type QuantumWeaverState = any;
export type AIQuestion = any;
export type Subscription = any;
export type CreditScore = { score: number; history: { date: string; score: number }[]; rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'; change: number };
export type UpcomingBill = any;
export type SavingsGoal = any;
export type MarketMover = any;
export type MarketplaceProduct = any;
export type FinancialGoal = any;
export type AIGoalPlan = any;
export type CryptoAsset = any;
export type VirtualCard = any;
export type PaymentOperation = any;
export type CorporateCard = any;
export type CorporateTransaction = any;
export type RewardPoints = { balance: number; lastEarned: number; lastRedeemed: number; currency: string; };
export type Notification = { id: string | number; message: string; timestamp: string; read: boolean; view?: View; type?: 'success' | 'error' | 'info' | 'warning' | 'critical'; };
export type NFTAsset = any;
export type RewardItem = any;
export type APIStatus = any;
export type CreditFactor = { id: string; name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; impact: string; description: string };
export type CorporateCardControls = any;
export type Counterparty = any;
export type PaymentOrder = any;
export type Invoice = any;
export type ComplianceCase = any;
export type LedgerAccount = any;
export type UserPreferences = any;
export type RecurringContribution = any;
export type Contribution = any;
export type LinkedGoal = any;
export type EIP6963ProviderDetail = any;
export type CompanyProfile = any;
export type RealEstateProperty = any;
export type ArtPiece = any;
export type AlgoStrategy = any;
export type VentureStartup = any;
export type DetectedSubscription = any;
export type StripeBalance = { available: { amount: number, currency: string }[], pending: { amount: number, currency: string }[] };
export type StripeCharge = { id: string; amount: number; currency: string; status: 'succeeded' | 'pending' | 'failed'; created: number; description: string; customer_id: string; };
export type StripeCustomer = { id: string; email: string; name: string; created: number; total_spent: number; };
export type StripeSubscription = { id: string; customer_id: string; plan_id: string; status: 'active' | 'canceled' | 'past_due'; current_period_end: number; amount: number; };
export type LoginActivity = { id: string; device: string; browser: string; os: string; location: string; ip: string; timestamp: string; isCurrent: boolean; userAgent: string; };
export type Device = { id: string; name: string; type: string; model: string; lastActivity: string; location: string; ip: string; isCurrent: boolean; permissions: string[]; status: string; firstSeen: string; userAgent: string; pushNotificationsEnabled: boolean; biometricAuthEnabled: boolean; encryptionStatus: string; };
export type DataSharingPolicy = { policyId: string; policyName: string; scope: string; lastReviewed: string; isActive: boolean; };
export type TransactionRule = { ruleId: string; name: string; triggerCondition: string; action: string; isEnabled: boolean; };
export type ThreatAlert = { alertId: string; title: string; description: string; timestamp: string; };
export type AuditLogEntry = { id: string; timestamp: string; userId: string; action: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; details: string; targetResource?: string; success?: boolean; };
export type APIKey = { id: string; keyName: string; creationDate: string; scopes: string[]; };
export type TrustedContact = { id: string; name: string; relationship: string; verified: boolean; };
export type SecurityAwarenessModule = { moduleId: string; title: string; completionRate: number; };
export type SecurityScoreMetric = { metricName: string; currentValue: string; };

// --- Mega Dashboard Types (Added to fix errors) ---
export type AccessLog = any;
export type FraudCase = any;
export type MLModel = any;
export type LoanApplication = any;
export type MortgageAsset = any;
export type ThreatIntelBrief = any;
export type InsuranceClaim = any;
export type RiskProfile = any;
export type DataSet = any;
export type DataLakeStat = any;
export type NexusNode = any;
export type NexusLink = any;
export type SalesDeal = any;
export type MarketingCampaign = any;
export type GrowthMetric = any;
export type Competitor = any;
export type Benchmark = any;
export type License = any;
export type Disclosure = any;
export type LegalDoc = any;
export type SandboxExperiment = any;
export type ConsentRecord = any;
export type ContainerImage = any;
export type ApiUsage = any;
export type Incident = any;
export type BackupJob = any;
export type PayRun = any;
export type Project = any;
export type Course = any;
export type Employee = any;
export type PortfolioAsset = any;
export type FinancialAnomaly = any;
export type AnomalyStatus = any;
export type DynamicKpi = any;
export type PaymentOrderStatus = any;
export type NexusGraphData = any;
export type WalletInfo = any;
export type Recipient = any;
export type Currency = any;
export type SecurityProfile = any;
export type UserProfile = { name: string; email: string; role: string; };


// Extend the global Window interface
declare global {
    interface WindowEventMap {
        "eip6963:announceProvider": CustomEvent<EIP6963AnnounceProviderEvent['detail']>;
    }
}

export type EIP6963AnnounceProviderEvent = {
    detail: {
        info: any;
        provider: any;
    };
};
