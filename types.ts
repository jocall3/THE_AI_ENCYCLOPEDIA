export enum View {
  Dashboard = 'Dashboard',
  Transactions = 'Transactions',
  Budgets = 'Budgets',
  Portfolio = 'Portfolio', // Replaces 'Investments'
  Goals = 'Goals',
  Payments = 'Payments', // Replaces 'SendMoney'
  AIIntelligence = 'AIIntelligence', // Consolidates AI features (formerly AIAdvisor, AIStrategy)
  DataConnections = 'DataConnections', // Managing external bank/API connections (formerly APIIntegration)
  Settings = 'Settings', // General user/system settings, includes Security
}
// Note: Removed experimental, chaos engineering, and niche modules (e.g., Crypto, ArtCollectibles, AlgoTradingLab, CorporateCommand, Rewards, DerivativesDesk, etc.) to stabilize the MVP scope (Unified Financial Dashboard and AI Transaction Intelligence).

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface GamificationState {
  score: number;
  level: number;
  levelName: string;
  progress: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  iconName: string;
}

export interface CreditScore {
  score: number;
  rating: string;
  change: number;
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
    ticker: string;
    price: number;
    change: number;
}

export interface RewardPoints {
    total: number;
    history: { date: string, points: number, event: string }[];
}

export interface CryptoAsset {
    id: string;
    name: string;
    ticker: string;
    balance: number;
    usdValue: number;
}

export interface NFTAsset {
    id: string;
    name: string;
    collection: string;
    imageUrl: string;
    floorPrice: number;
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

export interface PaymentOrder {
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
}

export interface Invoice {
    id: string;
    amount: number;
    status: string;
    dueDate: string;
    customerName: string;
}

export interface ComplianceCase {
    id: string;
    caseType: string;
    status: string;
    assignee: string;
    createdAt: string;
}

export interface CorporateTransaction {
    id: string;
    amount: number;
    description: string;
    status: string;
    date: string;
}

export interface APIStatus {
    name: string;
    status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
    latency: number;
    uptime: string;
    lastChecked: string;
}

export interface AIInsight {
    id: string;
    title: string;
    description: string;
    category: string;
    severity: 'info' | 'warning' | 'critical';
}

export interface ApiKeys {
  /**
   * WARNING: This interface lists required external integration keys for the MVP.
   * In a production environment, these values must be fetched securely at runtime
   * from a Secret Management System (e.g., AWS Secrets Manager, HashiCorp Vault)
   * and NOT committed to source control or exposed directly in client code.
   *
   * Pruned list reflects the focus on core financial aggregation, payments, and AI intelligence.
   */

  // === Authentication/Security ===
  AUTH_JWT_SECRET: string; // Used for signing/validating internal JWTs

  // === Banking & Financial Data Aggregation ===
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  
  // === Payment Processing & Utility Payments ===
  STRIPE_SECRET_KEY: string;

  // === AI & Machine Learning Services ===
  OPENAI_API_KEY: string;
  GOOGLE_GEMINI_API_KEY: string;

  // === Essential Infrastructure & Communication ===
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  SENDGRID_API_KEY: string;
  
  [key: string]: string; // Index signature for dynamic access
}
// Note: Over 150 non-essential or duplicative API keys were removed to enforce MVP scope and security principles.