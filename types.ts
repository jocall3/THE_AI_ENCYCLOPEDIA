export enum View {
  Dashboard = 'Dashboard',
  AIAdStudio = 'AIAdStudio',
  AIAdvisor = 'AIAdvisor',
  AlgoTradingLab = 'AlgoTradingLab',
  APIIntegration = 'APIIntegration',
  ApiSettings = 'ApiSettings',
  ArtCollectibles = 'ArtCollectibles',
  Budgets = 'Budgets',
  CommoditiesExchange = 'CommoditiesExchange',
  ConciergeService = 'ConciergeService',
  CorporateCommand = 'CorporateCommand',
  CreditHealth = 'CreditHealth',
  Crypto = 'Crypto',
  DerivativesDesk = 'DerivativesDesk',
  FinancialDemocracy = 'FinancialDemocracy',
  SendMoney = 'SendMoney',
  Transactions = 'Transactions',
  AIStrategy = 'AIStrategy',
  Rewards = 'Rewards',
  Security = 'Security',
  Goals = 'Goals',
  Investments = 'Investments'
}

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
  iconName: string;
}

export interface MarketMover {
  id: string;
  name: string;
  symbol: string;
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
    symbol: string;
    balance: number;
    price: number;
    change24h: number;
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
    },
    provider: any; // EIP1193Provider
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  status: 'Pending' | 'Completed' | 'Failed';
  created: string;
}

export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'Draft' | 'Open' | 'Paid';
  dueDate: string;
}

export interface ComplianceCase {
  id: string;
  subject: string;
  status: 'Open' | 'Under Review' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
}

export interface CorporateTransaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    category: string;
    department: string;
    approver: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface APIStatus {
    name: string;
    status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
    latency: number; // in ms
    errorRate: number; // as percentage
}

export interface AIInsight {
    id: string;
    timestamp: string;
    type: 'Optimization' | 'Warning' | 'Forecast' | 'Opportunity';
    urgency: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    suggestedActions: string[];
    relatedData: any;
}

export interface ApiKeys {
    [key: string]: string;
}

// Add other types as the application grows