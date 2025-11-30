
import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { 
    Transaction, Asset, BudgetCategory, GamificationState, IllusionType, LinkedAccount, 
    QuantumWeaverState, AIPlan, AIQuestion, Subscription, CreditScore, UpcomingBill, 
    SavingsGoal, MarketMover, MarketplaceProduct, FinancialGoal, AIGoalPlan, CryptoAsset, 
    VirtualCard, PaymentOperation, AIInsight, CorporateCard, CorporateTransaction, 
    RewardPoints, Notification, NFTAsset, RewardItem, APIStatus, CreditFactor, 
    CorporateCardControls, Counterparty, PaymentOrder, Invoice, ComplianceCase, 
    LedgerAccount, UserPreferences, RecurringContribution, Contribution, LinkedGoal, 
    EIP6963ProviderDetail, MarqetaCardProduct, Account, SecurityScoreMetric,
    AuditLogEntry, ThreatAlert, DataSharingPolicy, APIKey, TrustedContact, 
    SecurityAwarenessModule, TransactionRule, UserProfile
} from '../types';
import { View, WeaverStage } from '../types';

// --- INITIAL MOCK DATA GENERATION ---

const INITIAL_TRANSACTIONS: Transaction[] = [
    { id: 't1', type: 'expense', category: 'Dining', description: 'Omakase Dinner', amount: 450.00, date: new Date().toISOString(), carbonFootprint: 12 },
    { id: 't2', type: 'expense', category: 'Travel', description: 'Flight to Tokyo', amount: 2400.00, date: new Date(Date.now() - 86400000).toISOString(), carbonFootprint: 800 },
    { id: 't3', type: 'income', category: 'income', description: 'Executive Compensation', amount: 15000.00, date: new Date(Date.now() - 172800000).toISOString() },
];

const INITIAL_ASSETS: Asset[] = [
    { name: 'Global Tech ETF', value: 45000, color: '#0088FE', assetClass: 'Stocks', riskLevel: 'Medium', id: 'a1' },
    { name: 'Bitcoin Cold Storage', value: 120000, color: '#00C49F', assetClass: 'Crypto', riskLevel: 'High', id: 'a2' },
    { name: 'Angel Portfolio', value: 75000, color: '#FFBB28', assetClass: 'Venture', riskLevel: 'High', id: 'a3' },
    { name: 'Cash Reserves', value: 25000, color: '#FF8042', assetClass: 'Cash', riskLevel: 'Low', id: 'a4' },
];

const INITIAL_FINANCIAL_GOALS: FinancialGoal[] = [
    { 
        id: 'g1', 
        name: 'Private Island Acquisition', 
        targetAmount: 5000000, 
        currentAmount: 1250000, 
        targetDate: '2030-01-01', 
        iconName: 'island', 
        startDate: '2020-01-01',
        status: 'on_track',
        contributions: [],
        riskProfile: 'aggressive'
    }
];

// --- INTERFACES ---

interface IDataContext {
  // Core Data
  transactions: Transaction[];
  assets: Asset[];
  impactInvestments: Asset[];
  budgets: BudgetCategory[];
  gamification: GamificationState;
  impactData: { treesPlanted: number; spendingForNextTree: number; progressToNextTree: number; };
  customBackgroundUrl: string | null;
  activeIllusion: IllusionType;
  linkedAccounts: LinkedAccount[];
  subscriptions: Subscription[];
  creditScore: CreditScore;
  upcomingBills: UpcomingBill[];
  savingsGoals: SavingsGoal[];
  marketMovers: MarketMover[];
  financialGoals: FinancialGoal[];
  cryptoAssets: CryptoAsset[];
  paymentOperations: PaymentOperation[];
  walletInfo: any | null;
  virtualCard: VirtualCard | null;
  detectedProviders: EIP6963ProviderDetail[];
  aiInsights: AIInsight[];
  isInsightsLoading: boolean;
  corporateCards: CorporateCard[];
  corporateTransactions: CorporateTransaction[];
  rewardPoints: RewardPoints;
  notifications: Notification[];
  isImportingData: boolean;
  nftAssets: NFTAsset[];
  rewardItems: RewardItem[];
  apiStatus: APIStatus[];
  creditFactors: CreditFactor[];
  counterparties: Counterparty[];
  paymentOrders: PaymentOrder[];
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  userPreferences: UserPreferences;
  ledgerAccounts: LedgerAccount[];
  isLedgerAccountsLoading: boolean;
  ledgerAccountsError: string | null;
  activeView: View;
  userProfile: UserProfile;

  // Security & Audit
  securityMetrics: SecurityScoreMetric[];
  auditLogs: AuditLogEntry[];
  threatAlerts: ThreatAlert[];
  dataSharingPolicies: DataSharingPolicy[];
  apiKeys: APIKey[];
  trustedContacts: TrustedContact[];
  securityAwarenessModules: SecurityAwarenessModule[];
  transactionRules: TransactionRule[];
  showSystemAlert: (message: string, type: 'info' | 'warning' | 'error' | 'success') => void;

  // API Keys
  geminiApiKey: string | null;
  modernTreasuryApiKey: string | null;
  modernTreasuryOrganizationId: string | null;
  plaidApiKey: string | null;
  stripeApiKey: string | null;
  marqetaApiKey: string | null;
  marqetaApiToken: string | null; // Basic Auth User
  marqetaApiSecret: string | null; // Basic Auth Pass

  // Marqeta Specific
  marqetaCardProducts: MarqetaCardProduct[];
  isMarqetaLoading: boolean;
  fetchMarqetaProducts: () => Promise<void>;
  setMarqetaCredentials: (user: string, pass: string) => void;

  // Setters & Actions
  setActiveView: (view: View) => void;
  setGeminiApiKey: (key: string) => void;
  setModernTreasuryApiKey: (key: string) => void;
  setModernTreasuryOrganizationId: (id: string) => void;
  setPlaidApiKey: (key: string) => void;
  setStripeApiKey: (key: string) => void;
  setMarqetaApiKey: (key: string) => void;
  
  addBudget: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void;
  updateBudget: (id: string, updates: Partial<BudgetCategory>) => void;
  setCustomBackgroundUrl: (url: string) => void;
  setActiveIllusion: (illusion: IllusionType) => void;
  addTransaction: (tx: Transaction) => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  unlinkAccount: (id: string) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  
  // Weaver
  weaverState: QuantumWeaverState;
  pitchBusinessPlan: (plan: string) => Promise<void>;
  simulateTestPass: () => Promise<void>;

  // Goals
  addFinancialGoal: (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount' | 'contributions' | 'recurringContributions' | 'linkedGoals' | 'status'>) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  generateGoalPlan: (goalId: string) => Promise<void>;
  addContributionToGoal: (goalId: string, amount: number) => void;
  addRecurringContributionToGoal: (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => void;
  updateRecurringContributionInGoal: (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => void;
  deleteRecurringContributionFromGoal: (goalId: string, contributionId: string) => void;
  updateFinancialGoal: (goalId: string, updates: { targetAmount?: number; targetDate?: string; monthlyContribution?: number }) => void;
  linkGoals: (sourceGoalId: string, targetGoalId: string, relationshipType: LinkedGoal['relationshipType'], triggerAmount?: number) => void;
  unlinkGoals: (sourceGoalId: string, targetGoalId: string) => void;

  // Crypto
  connectWallet: (providerDetail: any) => Promise<void>;
  disconnectWallet: () => void;
  issueCard: () => void;
  buyCrypto: (usdAmount: number, cryptoTicker: string) => void;
  mintNFT: (name: string, imageUrl: string) => void;
  mintToken: (name: string, ticker: string, amount: number) => void;

  // Corp
  toggleCorporateCardFreeze: (cardId: string) => void;
  updateCorporateCard: (cardId: string, newControls: CorporateCardControls, newFrozenState: boolean) => void;
  initiatePayment: (details: Omit<PaymentOperation, 'id' | 'status' | 'date'>) => void;
  addCounterparty: (data: { name: string, email: string, accountNumber: string, routingNumber: string }) => Promise<void>;
  fetchLedgerAccounts: () => Promise<void>;
  
  // Rewards
  redeemReward: (item: RewardItem) => boolean;
  markNotificationRead: (id: string | number) => void;
  
  // Utils
  fetchRecipients: () => Promise<any[]>;
  fetchCurrencies: () => Promise<any[]>;
  getUserSecurityProfile: () => Promise<any>;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

// Helper
const generateSimpleUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [assets] = useState<Asset[]>(INITIAL_ASSETS);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(INITIAL_FINANCIAL_GOALS);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'The Visionary', email: 'visionary@sovereign.ai', role: 'Architect' });

  // Marqeta State
  const [marqetaApiToken, setMarqetaApiToken] = useState<string | null>(localStorage.getItem('marqetaApiToken'));
  const [marqetaApiSecret, setMarqetaApiSecret] = useState<string | null>(localStorage.getItem('marqetaApiSecret'));
  const [marqetaCardProducts, setMarqetaCardProducts] = useState<MarqetaCardProduct[]>([]);
  const [isMarqetaLoading, setIsMarqetaLoading] = useState(false);

  // Keys
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(() => localStorage.getItem('geminiApiKey'));
  const [modernTreasuryApiKey, setModernTreasuryApiKeyState] = useState<string | null>(() => localStorage.getItem('modernTreasuryApiKey'));
  const [modernTreasuryOrganizationId, setModernTreasuryOrganizationIdState] = useState<string | null>(() => localStorage.getItem('modernTreasuryOrganizationId'));
  const [plaidApiKey, setPlaidApiKeyState] = useState<string | null>(() => localStorage.getItem('plaidApiKey'));
  const [stripeApiKey, setStripeApiKeyState] = useState<string | null>(() => localStorage.getItem('stripeApiKey'));
  const [marqetaApiKey, setMarqetaApiKeyState] = useState<string | null>(() => localStorage.getItem('marqetaApiKey'));

  // Other State (Simplified for implementation speed)
  const [gamification, setGamification] = useState<GamificationState>({ score: 850, level: 5, levelName: "Sovereign Architect", progress: 45, credits: 1200 });
  const [impactData] = useState({ treesPlanted: 145, spendingForNextTree: 85, progressToNextTree: 34 });
  const [customBackgroundUrl, setCustomBackgroundUrlState] = useState<string | null>(localStorage.getItem('customBackgroundUrl'));
  const [activeIllusion, setActiveIllusionState] = useState<IllusionType>((localStorage.getItem('activeIllusion') as IllusionType) || 'none');
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [creditScore] = useState<CreditScore>({ score: 815, history: [], rating: 'Excellent', change: 12 });
  const [creditFactors] = useState<CreditFactor[]>([
      { id: 'f1', name: 'Payment History', status: 'Excellent', impact: 'High', description: '100% on-time payments' },
      { id: 'f2', name: 'Credit Utilization', status: 'Good', impact: 'High', description: '12% utilization ratio' }
  ]);
  
  // Security Mocks
  const [securityMetrics] = useState<SecurityScoreMetric[]>([{ metricName: 'OverallSecurityScore', currentValue: '0.88' }]);
  const [auditLogs] = useState<AuditLogEntry[]>([]);
  const [threatAlerts] = useState<ThreatAlert[]>([]);
  const [dataSharingPolicies] = useState<DataSharingPolicy[]>([]);
  const [apiKeys] = useState<APIKey[]>([]);
  const [trustedContacts] = useState<TrustedContact[]>([]);
  const [securityAwarenessModules] = useState<SecurityAwarenessModule[]>([]);
  const [transactionRules] = useState<TransactionRule[]>([]);

  // --- MARQETA LOGIC ---
  
  const setMarqetaCredentials = (user: string, pass: string) => {
      localStorage.setItem('marqetaApiToken', user);
      localStorage.setItem('marqetaApiSecret', pass);
      setMarqetaApiToken(user);
      setMarqetaApiSecret(pass);
  };

  const fetchMarqetaProducts = async () => {
      if (!marqetaApiToken || !marqetaApiSecret) return;
      setIsMarqetaLoading(true);
      
      // Simulate API call latency
      await new Promise(resolve => setTimeout(resolve, 1500));

      // INJECTED MOCK DATA FROM PROMPT
      const mockData: MarqetaCardProduct = {
        token: "1d324ebb-6996-483e-927b-03f40e65a7de",
        name: "Reloadable Card",
        active: true,
        start_date: "2025-11-28",
        config: {
          poi: {
            other: {
              allow: true,
              card_presence_required: false,
              cardholder_presence_required: false,
              track1_discretionary_data: "000000",
              track2_discretionary_data: "00000",
              use_static_pin: false
            },
            ecommerce: true,
            atm: true
          },
          transaction_controls: {
            accepted_countries_token: "accept_us_only",
            always_require_pin: false,
            always_require_icc: false,
            allow_gpa_auth: true,
            require_card_not_present_card_security_code: false,
            allow_mcc_group_authorization_controls: true,
            allow_first_pin_set_via_financial_transaction: false,
            ignore_card_suspended_state: false,
            allow_chip_fallback: true,
            allow_network_load: false,
            allow_network_load_card_activation: false,
            allow_quasi_cash: false,
            enable_partial_auth_approval: true,
            address_verification: {
              av_messages: {
                validate: true,
                decline_on_address_number_mismatch: false,
                decline_on_postal_code_mismatch: true
              },
              auth_messages: {
                validate: true,
                decline_on_address_number_mismatch: true,
                decline_on_postal_code_mismatch: false
              }
            }
          },
          card_life_cycle: {
            activate_upon_issue: true,
            expiration_offset: { unit: "DAYS", value: 10 },
            card_service_code: 101,
            update_expiration_upon_activation: false
          },
          fulfillment: {
            payment_instrument: "VIRTUAL_PAN",
            package_id: "0",
            all_zero_card_security_code: false,
            bin_prefix: "111111",
            bulk_ship: false,
            pan_length: "16",
            fulfillment_provider: "PERFECTPLASTIC",
            allow_card_creation: true,
            uppercase_name_lines: true,
            enable_offline_pin: false
          },
          jit_funding: {
             program_funding_source: {
                 enabled: true
             }
          }
        },
        created_time: "2025-11-28T11:40:21Z",
        last_modified_time: "2025-11-28T11:40:21Z"
      };
      
      setMarqetaCardProducts([mockData]);
      setIsMarqetaLoading(false);
  };

  // --- SETTERS ---
  
  const setGeminiApiKey = (key: string) => { localStorage.setItem('geminiApiKey', key); setGeminiApiKeyState(key); };
  const setModernTreasuryApiKey = (key: string) => { localStorage.setItem('modernTreasuryApiKey', key); setModernTreasuryApiKeyState(key); };
  const setModernTreasuryOrganizationId = (id: string) => { localStorage.setItem('modernTreasuryOrganizationId', id); setModernTreasuryOrganizationIdState(id); };
  const setPlaidApiKey = (key: string) => { localStorage.setItem('plaidApiKey', key); setPlaidApiKeyState(key); };
  const setStripeApiKey = (key: string) => { localStorage.setItem('stripeApiKey', key); setStripeApiKeyState(key); };
  const setMarqetaApiKey = (key: string) => { localStorage.setItem('marqetaApiKey', key); setMarqetaApiKeyState(key); };
  const setCustomBackgroundUrl = (url: string) => { localStorage.setItem('customBackgroundUrl', url); setCustomBackgroundUrlState(url); if(url) setActiveIllusionState('none'); };
  const setActiveIllusion = (illusion: IllusionType) => { localStorage.setItem('activeIllusion', illusion); setActiveIllusionState(illusion); if(illusion !== 'none') setCustomBackgroundUrlState(null); };

  // --- PLACEHOLDER ACTIONS ---
  const addTransaction = (tx: Transaction) => setTransactions(prev => [tx, ...prev]);
  const addBudget = () => {}; 
  const updateBudget = () => {};
  const unlinkAccount = (id: string) => setLinkedAccounts(prev => prev.filter(a => a.id !== id));
  const handlePlaidSuccess = (t: string, m: any) => {
      setLinkedAccounts(prev => [...prev, { 
          id: m.institution.institution_id, 
          name: m.institution.name, 
          mask: '0000', 
          institutionId: m.institution.institution_id, 
          status: 'active',
          type: 'depository' 
      }]);
  };
  const pitchBusinessPlan = async () => {};
  const simulateTestPass = async () => {};
  const addFinancialGoal = (g: any) => setFinancialGoals(prev => [...prev, { ...g, id: generateSimpleUUID(), currentAmount: 0, status: 'needs_attention', contributions: [] }]);
  const contributeToGoal = (id: string, amt: number) => setFinancialGoals(prev => prev.map(g => g.id === id ? {...g, currentAmount: g.currentAmount + amt} : g));
  const generateGoalPlan = async (id: string) => {};
  const addContributionToGoal = (id: string, amt: number) => contributeToGoal(id, amt);
  const addRecurringContributionToGoal = () => {};
  const updateRecurringContributionInGoal = () => {};
  const deleteRecurringContributionFromGoal = () => {};
  const updateFinancialGoal = () => {};
  const linkGoals = () => {};
  const unlinkGoals = () => {};
  const connectWallet = async (provider: any) => {};
  const disconnectWallet = () => {};
  const issueCard = () => {};
  const buyCrypto = () => {};
  const mintNFT = () => {};
  const mintToken = () => {};
  const toggleCorporateCardFreeze = () => {};
  const updateCorporateCard = () => {};
  const initiatePayment = () => {};
  const addCounterparty = async () => {};
  const fetchLedgerAccounts = async () => {};
  const redeemReward = () => true;
  const markNotificationRead = (id: string | number) => {
      setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };
  const fetchRecipients = async () => [];
  const fetchCurrencies = async () => [];
  const getUserSecurityProfile = async () => ({});
  const showSystemAlert = (msg: string, type: any) => { console.log(`System Alert [${type}]: ${msg}`); };


  const value: IDataContext = {
      transactions, setTransactions, assets, impactInvestments: [], budgets: [], gamification, impactData,
      customBackgroundUrl, activeIllusion, linkedAccounts, subscriptions: [], creditScore,
      upcomingBills: [], savingsGoals: [], marketMovers: [], financialGoals, cryptoAssets: [],
      paymentOperations: [], walletInfo: null, virtualCard: null, detectedProviders: [],
      aiInsights: [], isInsightsLoading: false, corporateCards: [], corporateTransactions: [],
      rewardPoints: { balance: 1200, lastEarned: 50, lastRedeemed: 0, currency: 'PTS' },
      notifications, isImportingData: false, nftAssets: [], rewardItems: [], apiStatus: [],
      creditFactors, counterparties: [], paymentOrders: [], invoices: [], complianceCases: [],
      userPreferences: {}, ledgerAccounts: [], isLedgerAccountsLoading: false,
      ledgerAccountsError: null, activeView, geminiApiKey, modernTreasuryApiKey,
      modernTreasuryOrganizationId, plaidApiKey, stripeApiKey, marqetaApiKey,
      userProfile,
      
      marqetaApiToken, marqetaApiSecret, marqetaCardProducts, isMarqetaLoading,
      fetchMarqetaProducts, setMarqetaCredentials,

      setActiveView, setGeminiApiKey, setModernTreasuryApiKey, setModernTreasuryOrganizationId,
      setPlaidApiKey, setStripeApiKey, setMarqetaApiKey, addBudget, updateBudget, setCustomBackgroundUrl,
      setActiveIllusion, addTransaction, unlinkAccount, handlePlaidSuccess,
      weaverState: {} as any, pitchBusinessPlan, simulateTestPass, addFinancialGoal,
      contributeToGoal, generateGoalPlan, addContributionToGoal, addRecurringContributionToGoal,
      updateRecurringContributionInGoal, deleteRecurringContributionFromGoal, updateFinancialGoal,
      linkGoals, unlinkGoals, connectWallet, disconnectWallet, issueCard, buyCrypto, mintNFT,
      mintToken, toggleCorporateCardFreeze, updateCorporateCard, initiatePayment, addCounterparty,
      fetchLedgerAccounts, redeemReward, markNotificationRead, fetchRecipients, fetchCurrencies,
      getUserSecurityProfile,
      securityMetrics, auditLogs, threatAlerts, dataSharingPolicies, apiKeys, trustedContacts, securityAwarenessModules, transactionRules, showSystemAlert
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
