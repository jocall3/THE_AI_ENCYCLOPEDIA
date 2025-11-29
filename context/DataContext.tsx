import React, { createContext, useState, ReactNode } from 'react';
import { View, Transaction, BudgetCategory, Account, GamificationState, Subscription, CreditScore, UpcomingBill, SavingsGoal, MarketMover, RewardPoints, CryptoAsset, NFTAsset, EIP6963ProviderDetail, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction, APIStatus, AIInsight } from '../types';

interface DataContextType {
  activeView: View;
  setActiveView: (view: View) => void;
  transactions: Transaction[];
  budgets: BudgetCategory[];
  impactData: { treesPlanted: number; progressToNextTree: number };
  gamification: GamificationState;
  subscriptions: Subscription[];
  creditScore: CreditScore;
  upcomingBills: UpcomingBill[];
  savingsGoals: SavingsGoal[];
  marketMovers: MarketMover[];
  linkedAccounts: Account[];
  rewardPoints: RewardPoints;
  isImportingData: boolean;
  apiStatus: APIStatus[];
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string) => void;
  modernTreasuryApiKey: string | null;
  setModernTreasuryApiKey: (key: string) => void;
  modernTreasuryOrganizationId: string | null;
  setModernTreasuryOrganizationId: (id: string) => void;
  cryptoAssets: CryptoAsset[];
  walletInfo: any;
  virtualCard: any;
  connectWallet: (provider: EIP6963ProviderDetail) => void;
  disconnectWallet: () => void;
  detectedProviders: EIP6963ProviderDetail[];
  issueCard: () => void;
  buyCrypto: (amount: number, currency: string) => void;
  nftAssets: NFTAsset[];
  paymentOrders: PaymentOrder[];
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  corporateTransactions: CorporateTransaction[];
  creditFactors: any[];
  aiInsights: AIInsight[];
  isInsightsLoading: boolean;
  addBudget: (budget: any) => void;
  updateBudget: (budget: any) => void;
  handlePlaidSuccess: (token: string, metadata: any) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  const [modernTreasuryApiKey, setModernTreasuryApiKey] = useState<string | null>(null);
  const [modernTreasuryOrganizationId, setModernTreasuryOrganizationId] = useState<string | null>(null);

  const transactions: Transaction[] = [
    { id: '1', date: '2023-10-26', amount: 150.00, description: 'Grocery Store', category: 'Food', type: 'expense' },
    { id: '2', date: '2023-10-27', amount: 2500.00, description: 'Paycheck', category: 'Income', type: 'income' },
  ];

  const value = {
    activeView,
    setActiveView,
    transactions,
    budgets: [{ id: '1', name: 'Groceries', limit: 500, spent: 150, color: '#10B981' }],
    impactData: { treesPlanted: 12, progressToNextTree: 45 },
    gamification: { score: 750, level: 5, levelName: 'Gold', progress: 60 },
    subscriptions: [{ id: '1', name: 'Netflix', amount: 15.99, iconName: 'video' }],
    creditScore: { score: 720, rating: 'Good', change: 5 },
    upcomingBills: [{ id: '1', name: 'Electric Bill', amount: 120.50, dueDate: '2023-11-15' }],
    savingsGoals: [{ id: '1', name: 'Vacation', saved: 2000, target: 5000, iconName: 'plane' }],
    marketMovers: [{ ticker: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.5 }],
    linkedAccounts: [{ id: '1', name: 'Chase Checking', balance: 5400 }],
    rewardPoints: { balance: 1250 },
    isImportingData: false,
    apiStatus: [{ provider: 'Google Gemini', status: 'Operational', responseTime: 45 }],
    geminiApiKey,
    setGeminiApiKey,
    modernTreasuryApiKey,
    setModernTreasuryApiKey,
    modernTreasuryOrganizationId,
    setModernTreasuryOrganizationId,
    cryptoAssets: [{ name: 'Bitcoin', value: 45000, color: '#F7931A' }],
    walletInfo: null,
    virtualCard: null,
    connectWallet: () => {},
    disconnectWallet: () => {},
    detectedProviders: [],
    issueCard: () => {},
    buyCrypto: () => {},
    nftAssets: [],
    paymentOrders: [],
    invoices: [],
    complianceCases: [],
    corporateTransactions: [],
    creditFactors: [],
    aiInsights: [],
    isInsightsLoading: false,
    addBudget: () => {},
    updateBudget: () => {},
    handlePlaidSuccess: () => {},
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};