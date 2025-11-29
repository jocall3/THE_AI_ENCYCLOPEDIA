export enum View {
  Dashboard = 'Dashboard',
  AIAdStudio = 'AIAdStudio',
  AIAdvisor = 'AIAdvisor',
  AlgoTradingLab = 'AlgoTradingLab',
  APIIntegration = 'APIIntegration',
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
  saved: number;
  target: number;
  iconName: string;
}

export interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  change: number;
}

export interface RewardPoints {
  balance: number;
}

export interface CryptoAsset {
  name: string;
  value: number;
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress: string;
}

export interface EIP6963ProviderDetail {
  info: { uuid: string; name: string; icon: string };
  provider: any;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  status: string;
  dueDate?: string;
}

export interface Invoice {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
}

export interface ComplianceCase {
  id: string;
  type: string;
  description: string;
  status: string;
}

export interface CorporateTransaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  description: string;
}

export interface APIStatus {
  provider: string;
  status: string;
  responseTime: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  chartData?: any[];
  chartType?: string;
  chartMetricName?: string;
  recommendation?: string;
  metadata?: any;
}