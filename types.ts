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
  institution?: string;
  balance?: number;
  type?: string;
  subtype?: string;
  status?: 'active' | 'error' | 'disconnected';
  lastUpdated?: string;
}

export const View = {
  Dashboard: 'Dashboard',
  Transactions: 'Transactions',
  'Send Money': 'Send Money',
  Budgets: 'Budgets',
  'Financial Goals': 'Financial Goals',
  'Credit Health': 'Credit Health',
  Investments: 'Investments',
  'Crypto & Web3': 'Crypto & Web3',
  'Algo-Trading Lab': 'Algo-Trading Lab',
  'Forex Arena': 'Forex Arena',
  'Commodities Exchange': 'Commodities Exchange',
  'Real Estate Empire': 'Real Estate Empire',
  'Art & Collectibles': 'Art & Collectibles',
  'Derivatives Desk': 'Derivatives Desk',
  'Venture Capital': 'Venture Capital',
  'Private Equity': 'Private Equity',
  'Tax Optimization': 'Tax Optimization',
  'Legacy Builder': 'Legacy Builder',
  'Corporate Command': 'Corporate Command',
  'Modern Treasury': 'Modern Treasury',
  'Card Programs': 'Card Programs',
  'Data Network': 'Data Network',
  Payments: 'Payments',
  SSO: 'SSO',
  'AI Advisor': 'AI Advisor',
  'Quantum Weaver': 'Quantum Weaver',
  'Agent Marketplace': 'Agent Marketplace',
  'AI Ad Studio': 'AI Ad Studio',
  'Card Customization': 'Card Customization',
  'Financial Democracy': 'Financial Democracy',
  'Open Banking': 'Open Banking',
  'API Status': 'API Status',
  'Concierge Service': 'Concierge Service',
  Philanthropy: 'Philanthropy',
  'Sovereign Wealth': 'Sovereign Wealth',
  'Security Center': 'Security Center',
  Personalization: 'Personalization',
  'The Vision': 'The Vision'
} as const;

export type View = typeof View[keyof typeof View];

export const WeaverStage = {
  initial: 'initial',
  analyzing: 'analyzing',
  planning: 'planning',
  complete: 'complete',
  error: 'error'
} as const;

export type WeaverStage = typeof WeaverStage[keyof typeof WeaverStage];

export interface QuantumWeaverState {
  stage: WeaverStage;
  progress: number;
  currentTask?: string;
  error?: string;
  result?: any;
}

export interface AIQuestion {
  id: string;
  text: string;
  type: 'text' | 'choice' | 'number' | 'boolean';
  options?: string[];
  answer?: string | number | boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  category?: string;
  logo?: string;
  status: 'active' | 'cancelled' | 'paused';
  provider?: string;
}

export interface CreditScore {
  score: number;
  provider: string;
  lastUpdated: string;
  history: { date: string; score: number }[];
  rating: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent';
  factors?: CreditFactor[];
}

export interface UpcomingBill {
  id: string;
  payee: string;
  amount: number;
  dueDate: string;
  isAutoPay: boolean;
  status: 'pending' | 'paid' | 'overdue';
  category?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
  color?: string;
  category?: string;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  sector?: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  provider: string;
  rating?: number;
  image?: string;
  features?: string[];
}

export interface FinancialGoal {
  id: string;
  title: string;
  type: 'savings' | 'investment' | 'debt_repayment' | 'purchase';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  contributionFrequency?: 'weekly' | 'monthly';
  contributionAmount?: number;
}

export interface AIGoalPlan {
  goalId: string;
  steps: AIPlanStep[];
  probabilityOfSuccess: number;
  recommendedMonthlyContribution: number;
  projectedCompletionDate: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  network: string;
  address?: string;
  logoUrl?: string;
}

export interface VirtualCard {
  id: string;
  last4: string;
  expiry: string;
  cvv?: string;
  brand: 'visa' | 'mastercard' | 'amex';
  status: 'active' | 'frozen' | 'cancelled';
  limit?: number;
  spent?: number;
  label?: string;
  currency: string;
}

export interface PaymentOperation {
  id: string;
  type: 'transfer' | 'payment' | 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  recipient: string;
  sender?: string;
  date: string;
  reference?: string;
}

export interface CorporateCard {
  id: string;
  cardholderName: string;
  last4: string;
  limit: number;
  balance: number;
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  expiry: string;
  brand: string;
}

export interface CorporateTransaction {
  id: string;
  cardId: string;
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  receiptUrl?: string;
  status: 'pending' | 'cleared' | 'declined';
  notes?: string;
}

export interface RewardPoints {
  programName: string;
  total: number;
  available: number;
  lifetime: number;
  tier: string;
  expiringSoon?: number;
  expiryDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  actionUrl?: string;
  category?: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  floorPrice?: number;
  purchasePrice?: number;
  tokenId: string;
  contractAddress?: string;
  network: string;
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  imageUrl?: string;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface APIStatus {
  service: string;
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  latency?: number;
  uptime?: number;
  lastChecked: string;
  region?: string;
}

export interface CreditFactor {
  id: string;
  name: string;
  status: 'Good' | 'Fair' | 'Poor';
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  value?: string;
}

export interface CorporateCardControls {
  cardId: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  transactionLimit?: number;
  allowedCategories?: string[];
  blockedMerchants?: string[];
  allowInternational: boolean;
  allowOnline: boolean;
  allowATM: boolean;
}

export interface Counterparty {
  id: string;
  name: string;
  type: 'individual' | 'business';
  email?: string;
  phone?: string;
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  trustScore?: number;
  tags?: string[];
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  direction: 'incoming' | 'outgoing';
  counterpartyId: string;
  status: 'processing' | 'completed' | 'failed' | 'requires_approval';
  effectiveDate: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  customerId: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  pdfUrl?: string;
}

export interface ComplianceCase {
  id: string;
  type: 'KYC' | 'AML' | 'Fraud' | 'Sanctions';
  status: 'open' | 'investigating' | 'closed' | 'escalated';
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  description: string;
}

export interface LedgerAccount {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
  code?: string;
  parentAccountId?: string;
  description?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacyMode: boolean;
  biometricEnabled: boolean;
}

export interface RecurringContribution {
  id: string;
  goalId: string;
  amount: number;
  currency: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  nextDate: string;
  status: 'active' | 'paused' | 'cancelled';
  sourceAccountId: string;
}

export interface Contribution {
  id: string;
  goalId: string;
  amount: number;
  currency: string;
  date: string;
  type: 'manual' | 'recurring';
  status: 'completed' | 'pending' | 'failed';
}

export interface LinkedGoal {
  goalId: string;
  accountId: string;
  allocationPercentage: number;
  autoDistribute: boolean;
}

export interface EIP6963ProviderDetail {
  info: {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  };
  provider: any;
}

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  foundedYear?: number;
  employees?: number;
  website?: string;
  description?: string;
  valuation?: number;
  headquarters?: string;
  taxId?: string;
}

export interface RealEstateProperty {
  id: string;
  address: string;
  type: 'residential' | 'commercial' | 'industrial' | 'land';
  estimatedValue: number;
  purchasePrice: number;
  purchaseDate: string;
  rentalIncome?: number;
  expenses?: number;
  occupancyRate?: number;
  imageUrl?: string;
}

export interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  estimatedValue: number;
  provenance?: string;
  imageUrl?: string;
  location?: string;
  insuranceValue?: number;
}

export interface AlgoStrategy {
  id: string;
  name: string;
  description: string;
  performance: number;
  riskLevel: 'low' | 'medium' | 'high';
  assets: string[];
  status: 'active' | 'backtesting' | 'stopped' | 'paused';
  created: string;
  lastRun?: string;
}

export interface VentureStartup {
  id: string;
  name: string;
  sector: string;
  stage: 'Seed' | 'Series A' | 'Series B' | 'Late Stage' | 'IPO';
  investmentAmount: number;
  equityPercentage: number;
  currentValuation: number;
  founded: number;
  ceo?: string;
  logoUrl?: string;
}

export interface DetectedSubscription {
  name: string;
  amount: number;
  currency: string;
  frequency: string;
  lastCharged: string;
  confidence: number;
  provider?: string;
  category?: string;
}

export interface StripeBalance {
  available: { amount: number; currency: string; source_types?: any }[];
  pending: { amount: number; currency: string; source_types?: any }[];
  connect_reserved?: { amount: number; currency: string }[];
  issuing?: { available: { amount: number; currency: string }[]; outstanding: { amount: number; currency: string }[] };
}

export interface StripeCharge {
  id: string;
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  currency: string;
  created: number;
  paid: boolean;
  status: string;
  receipt_url: string;
  description?: string;
  payment_method_details?: any;
  billing_details?: any;
}

export interface LoginActivity {
  id: string;
  timestamp: string;
  ip: string;
  device: string;
  browser?: string;
  location: string;
  status: 'success' | 'failed' | 'suspicious';
}

export interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastActive: string;
  isTrusted: boolean;
  ipAddress?: string;
  os?: string;
  model?: string;
}

export interface DataSharingPolicy {
  id: string;
  thirdParty: string;
  dataTypes: string[];
  purpose: string;
  status: 'allowed' | 'denied';
  lastUpdated: string;
  expiryDate?: string;
}

export interface TransactionRule {
  id: string;
  name: string;
  criteria: { field: string; operator: 'equals' | 'contains' | 'gt' | 'lt'; value: any }[];
  action: { type: 'categorize' | 'tag' | 'notify' | 'hide'; target?: string };
  active: boolean;
  priority: number;
}

export interface ThreatAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'ignored';
  recommendedAction?: string;
  source?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface APIKey {
  id: string;
  name: string;
  keyMask: string;
  scopes: string[];
  created: string;
  lastUsed?: string;
  status: 'active' | 'revoked' | 'expired';
  expiresAt?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  accessLevel: 'view' | 'manage' | 'emergency';
  addedDate: string;
}

export interface SecurityAwarenessModule {
  id: string;
  title: string;
  description: string;
  completionStatus: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  dueDate?: string;
  durationMinutes?: number;
}

export interface SecurityScoreMetric {
  category: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'critical';
  suggestions: string[];
  lastUpdated: string;
}

export interface MarqetaCardProgram {
  token: string;
  name: string;
  description?: string;
  active: boolean;
  created_time: string;
  last_modified_time?: string;
}

export interface MarqetaCardholder {
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  created_time: string;
  phone?: string;
  metadata?: Record<string, string>;
}