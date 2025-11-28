

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
  balances?: {
      current: number;
      available?: number;
      iso_currency_code?: string;
  };
  type?: string;
  subtype?: string;
}

export interface AIQuestion {
    id:string;
    question: string;
    category: string;
}

export enum WeaverStage {
    Pitch = 'pitch',
    Analysis = 'analysis',
    Test = 'test',
    FinalReview = 'final_review',
    Approved = 'approved',
    Error = 'error',
}

export interface QuantumWeaverState {
    stage: WeaverStage;
    businessPlan: string;
    feedback: string;
    questions: AIQuestion[];
    loanAmount: number;
    coachingPlan: AIPlan | null;
    error: string | null;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface CreditScore {
  score: number;
  change: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface SavingsGoal {
  id:string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface MarketMover {
    ticker: string;
    name: string;
    change: number;
    price: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  aiJustification: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress: string;
  description?: string; // Added description field
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export type PaymentOperationStatus = 'Initiated' | 'Processing' | 'Completed' | 'Failed';

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: PaymentOperationStatus;
  type: 'ACH' | 'Wire' | 'Crypto';
  date: string;
}

export interface CorporateCardControls {
    atm: boolean;
    contactless: boolean;
    online: boolean;
    monthlyLimit: number;
}

export interface CorporateCard {
    id: string;
    holderName: string;
    cardNumberMask: string;
    status: 'Active' | 'Suspended' | 'Lost';
    frozen: boolean;
    controls: CorporateCardControls;
}

export interface CorporateTransaction {
    id: string;
    cardId: string;
    holderName: string;
    merchant: string;
    amount: number;
    status: 'Pending' | 'Approved';
    timestamp: string;
    date: string; // Add date property for consistency
    description: string; // Add description property
}

export interface RewardPoints {
    balance: number;
    lastEarned: number;
    lastRedeemed: number;
    currency: string;
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    view?: View;
}

export interface Counterparty {
    id: string;
    name: string;
    email: string | null;
    send_remittance_advice: boolean;
    accounts: {
        id: string;
        party_name: string;
        account_details: {
            account_number_safe: string;
        }[];
    }[];
    created_at: string;
}


export enum View {
    Dashboard = 'dashboard',
    Transactions = 'transactions',
    SendMoney = 'send-money',
    Budgets = 'budgets',
    Investments = 'investments',
    SASPlatforms = 'the-vision',
    AIAdvisor = 'ai-advisor',
    QuantumWeaver = 'quantum-weaver',
    AIAdStudio = 'ai-ad-studio',
    Crypto = 'crypto',
    Goals = 'goals',
    Marketplace = 'marketplace',
    Security = 'security',
    Personalization = 'personalization',
    CardCustomization = 'card-customization',
    OpenBanking = 'open-banking',
    CorporateCommand = 'corporate-command',
    ModernTreasury = 'modern-treasury',
    APIIntegration = 'api-integration',
    Rewards = 'rewards',
    CreditHealth = 'credit-health',
    Settings = 'settings',
    FinancialDemocracy = 'financial-democracy',
    PaymentOrders = 'payment-orders', // Added for deep linking
    Invoices = 'invoices', // Added for deep linking
    Compliance = 'compliance', // Added for deep linking
    // New Views for API Dashboards & Auth
    PlaidDashboard = 'plaid-dashboard',
    StripeDashboard = 'stripe-dashboard',
    MarqetaDashboard = 'marqeta-dashboard',
    SSO = 'sso'
}

export interface AIGoalPlanStep {
    title: string;
    description: string;
    category: 'Savings' | 'Budgeting' | 'Investing' | 'Income';
}

export interface AIGoalPlan {
    feasibilitySummary: string;
    monthlyContribution: number;
    steps: AIGoalPlanStep[];
    actionableSteps?: string[];
    summary?: string; // Added summary property
}

export type Contribution = {
    id: string;
    amount: number;
    date: string;
    type: 'manual' | 'recurring';
};

export type RecurringContribution = {
    id: string;
    amount: number;
    frequency: 'monthly' | 'bi-weekly' | 'weekly';
    startDate: string;
    endDate: string | null;
    isActive: boolean;
};

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export type LinkedGoal = {
    id: string;
    relationshipType: 'prerequisite' | 'dependency' | 'overflow' | 'sibling';
    triggerAmount?: number;
};

export interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    targetDate: string;
    currentAmount: number;
    iconName: string;
    plan: AIGoalPlan | null;
    contributions?: Contribution[];
    recurringContributions?: RecurringContribution[];
    riskProfile?: RiskProfile;
    startDate?: string;
    linkedGoals?: LinkedGoal[];
    status?: 'on_track' | 'needs_attention' | 'achieved' | 'behind';
}

export interface RewardItem {
    id: string;
    name: string;
    cost: number; // in reward points
    type: 'cashback' | 'giftcard' | 'impact';
    description: string;
    iconName: string; // for an icon
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini';

export interface APIStatus {
    provider: APIProvider;
    status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
    responseTime: number; // in ms
}

export interface CreditFactor {
    name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix';
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
}

export interface LedgerAccountBalance {
  credits: number;
  debits: number;
  amount: number;
  currency: string;
  currency_exponent: number;
}

export interface LedgerAccount {
  id: string;
  object: "ledger_account";
  live_mode: boolean;
  name: string;
  ledger_id: string;
  description: string | null;
  lock_version: number;
  normal_balance: "debit" | "credit";
  balances: {
    pending_balance: LedgerAccountBalance;
    posted_balance: LedgerAccountBalance;
    available_balance: LedgerAccountBalance;
  };
  metadata: Record<string, any>;
  discarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event';
  startDate: string;
  endDate?: string; 
  executionCondition?: string;
  nextExecutionDate?: string;
  maxExecutions?: number;
  triggerEventId?: string;
  paymentReason?: string;
  biometricApprovalRequired?: boolean;
}

export interface UserPreferences {
    defaultCarbonOffset?: number;
}

// Corporate Command Center Types
export interface PaymentOrder {
    id: string;
    amount: number;
    status: 'approved' | 'needs_approval' | 'pending' | 'paid' | 'rejected';
    requestDate: string; // ISO Date
    approvalDate?: string; // ISO Date
    paymentDate?: string; // ISO Date
    dueDate?: string; // ISO Date
    paymentMethod: string;
    beneficiary: string;
}

export interface Invoice {
    id: string;
    amount: number;
    status: 'paid' | 'overdue' | 'pending';
    issueDate: string; // ISO Date
    dueDate: string; // ISO Date
    paymentDate?: string; // ISO Date
    customer: string;
}

export interface ComplianceCase {
    id: string;
    status: 'open' | 'closed' | 'investigating';
    priority: 'high' | 'medium' | 'low';
    severity?: 'high' | 'medium' | 'low';
    type: string; // e.g. AML, KYC
    description: string;
    openDate: string; // ISO Date
    closeDate?: string; // ISO Date
    potentialFine?: number;
    relatedEntity?: string;
}

// Security View Types
export interface LoginActivity {
    id: string;
    device: string;
    location: string;
    ip: string;
    timestamp: string;
    isCurrent: boolean;
    browser: string;
    os: string;
    userAgent: string;
}

export interface Device {
    id: string;
    name: string;
    type: string;
    model?: string;
    osVersion?: string;
    appVersion?: string;
    lastActivity: string;
    location: string;
    ip: string;
    isCurrent: boolean;
    permissions: string[];
    status: 'active' | 'locked' | 'revoked' | 'pending';
    firstSeen: string;
    userAgent: string;
    pushNotificationsEnabled: boolean;
    biometricAuthEnabled: boolean;
    macAddress?: string;
    encryptionStatus: 'full' | 'partial' | 'none';
}

export interface DataSharingPolicy {
    id: string;
    partner: string;
    dataCategories: ('account_balances' | 'transaction_history' | 'personal_info' | 'investment_holdings' | 'credit_score_data' | 'identity_verification' | 'spending_patterns' | 'demographic_info' | 'ip_address')[];
    purpose: string;
    active: boolean;
    lastUpdated: string;
    startDate: string;
    endDate?: string;
    revocationReason?: string;
    consentMethod: 'implicit' | 'explicit' | 'opt_out';
    dataRetentionPeriod: '30_days' | '90_days' | '1_year' | '3_years' | '7_years' | 'indefinite';
    dataLocation: 'US' | 'EU' | 'GLOBAL';
    privacyPolicyURL?: string;
}

export interface TransactionRule {
    id: string;
    name: string;
    type: 'spend_limit' | 'unusual_location' | 'large_withdrawal' | 'new_beneficiary' | 'foreign_currency' | 'merchant_category_block' | 'recurring_subscription';
    threshold?: number;
    currency?: string;
    location?: string;
    merchantCategory?: string;
    active: boolean;
    alertOnly: boolean;
    lastModified: string;
    createdBy: string;
    description: string;
    appliesToAccountIds?: string[];
    effectiveDate: string;
}

export interface ThreatAlert {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    category: string;
    description: string;
    timestamp: string;
    status: 'new' | 'investigating' | 'resolved' | 'dismissed' | 'false_positive';
    actionableItems?: string[];
    affectedEntities?: string[];
    resolutionNotes?: string;
    aiAnalysisSummary?: string;
    threatVector?: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    details: string;
    ipAddress: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    resourceAffected?: string;
    correlationId?: string;
    geolocation?: string;
}

export interface APIKey {
    id: string;
    name: string;
    keyPrefix: string;
    fullKey?: string;
    created: string;
    expires?: string;
    status: 'active' | 'revoked' | 'expired' | 'disabled';
    permissions: ('read_accounts' | 'read_transactions' | 'initiate_transfers' | 'manage_rules' | 'manage_devices' | 'read_audit_logs' | 'manage_api_keys')[];
    lastUsed?: string;
    createdBy: string;
    rateLimit?: number;
    ipWhitelist?: string[];
    description?: string;
}

export interface TrustedContact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    relation: string;
    accessLevel: 'view_only' | 'limited_action' | 'full_control';
    canReceiveEmergencyAlerts: boolean;
    canInitiateAccountLock: boolean;
    notes?: string;
    lastNotified?: string;
    authRequiredForActions?: 'none' | 'sms_otp' | 'email_otp';
}

export interface SecurityAwarenessModule {
    id: string;
    title: string;
    description: string;
    completionStatus: 'not_started' | 'in_progress' | 'completed';
    lastAccessed: string;
    url: string;
    estimatedTimeMinutes: number;
    category: 'phishing' | 'password_hygiene' | '2fa' | 'data_privacy' | 'device_security' | 'social_engineering' | 'safe_browsing';
    progressPercentage?: number;
    quizScore?: number;
}

export interface SecurityScoreMetric {
    id: string;
    name: string;
    description: string;
    currentValue: number;
    maxValue: number;
    unit: string;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    recommendations: string[];
    weight: number;
}

// --- EIP-6963 and Wallet Connection Types ---

export interface EIP6963ProviderInfo {
    rdns: string;
    uuid: string;
    name: string;
    icon: string;
}

export interface EIP6963ProviderDetail {
    info: EIP6963ProviderInfo;
    provider: EIP1193Provider;
}

export type EIP6963AnnounceProviderEvent = {
    detail: {
        info: EIP6963ProviderInfo;
        provider: Readonly<EIP1193Provider>;
    };
};

export interface EIP1193Provider {
    isStatus?: boolean;
    host?: string;
    path?: string;
    sendAsync?: (
        request: { method: string; params?: Array<unknown> },
        callback: (error: Error | null, response: unknown) => void
    ) => void;
    send?: (
        request: { method: string; params?: Array<unknown> },
        callback: (error: Error | null, response: unknown) => void
    ) => void;
    request: (request: {
        method: string;
        params?: Array<unknown>;
    }) => Promise<unknown>;
}

// Added Types for CryptoView
export interface AdvancedNFTAsset extends NFTAsset {
  collection?: string;
  floorPrice?: number;
  rarityRank?: number;
  attributes?: { trait_type: string; value: string }[];
  lastSalePrice?: number;
  lastSaleDate?: string;
}

export type BlockchainNetwork = 'Ethereum' | 'Solana' | 'Polygon' | 'Bitcoin';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';
export type TransactionType = 'Buy' | 'Sell' | 'Transfer' | 'Swap' | 'Mint' | 'Stake' | 'Unstake' | 'Claim';

// New types for Stripe and Marqeta Dashboards
export interface StripeBalance {
  available: { amount: number; currency: string; }[];
  pending: { amount: number; currency: string; }[];
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created: number; // Unix timestamp
  description: string;
}

export interface MarqetaCardProgram {
    token: string;
    name: string;
    active: boolean;
    fulfillment: {
        shipping: {
            method: string;
            care_of_line: string;
        }
    };
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

// Extend the global Window interface
declare global {
    interface WindowEventMap {
        "eip6963:announceProvider": CustomEvent<EIP6963AnnounceProviderEvent['detail']>;
    }
}