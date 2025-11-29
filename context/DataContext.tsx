import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction, Asset, BudgetCategory, GamificationState, IllusionType, LinkedAccount, QuantumWeaverState, AIPlan, AIQuestion, Subscription, CreditScore, UpcomingBill, SavingsGoal, MarketMover, MarketplaceProduct, FinancialGoal, AIGoalPlan, CryptoAsset, VirtualCard, PaymentOperation, AIInsight, CorporateCard, CorporateTransaction, RewardPoints, Notification, NFTAsset, RewardItem, APIStatus, CreditFactor, CorporateCardControls, Counterparty, PaymentOrder, Invoice, ComplianceCase, LedgerAccount, UserPreferences, RecurringContribution, Contribution, LinkedGoal, EIP6963ProviderDetail, CompanyProfile, RealEstateProperty, ArtPiece, AlgoStrategy, VentureStartup, WalletInfo, Recipient, Currency, SecurityProfile, PlaidMetadata, KPI } from '../types';
import { View, WeaverStage } from '../types';

// --- Global Constants for System Integrity and Scaling ---
const LEVEL_NAMES = ["Quantum Initiate", "Data Architect", "System Synthesizer", "Cognitive Engineer", "Omni-System Sovereign"];
const SCORE_PER_LEVEL = 1000; // Increased threshold for higher level progression
const COST_PER_TREE = 250; // Environmental Impact Metric Cost
const MAX_AI_INSIGHTS = 15; // Limit for dashboard insights
const MAX_NOTIFICATIONS = 100; // Limit for notification history

// --- Sector and Color Definitions for Prosperity Module ---
const SECTORS = ['Quantum Computing', 'Bio-Synthetic Engineering', 'Decentralized Finance (DeFi)', 'Sustainable Fusion Energy', 'Hyper-Automation & Robotics', 'Metaverse Infrastructure', 'Advanced Materials Science', 'Planetary Resource Management'];
const COLORS = ['#00FFFF', '#FF00FF', '#00FF00', '#FFA500', '#8A2BE2', '#FFD700', '#00CED1', '#7CFC00'];

// --- Utility Functions ---

/**
 * Generates a list of highly sophisticated, mock CompanyProfile entities for the Prosperity Module.
 * These represent potential investment vehicles in future-forward industries.
 */
const generateProsperityCompanies = (): CompanyProfile[] => {
    const companies: CompanyProfile[] = [];
    for (let i = 1; i <= 250; i++) { // Increased count for a richer dataset
        const sectorIndex = i % SECTORS.length;
        const sector = SECTORS[sectorIndex];
        const color = COLORS[sectorIndex];
        const marketCap = parseFloat((Math.random() * 5000 + 5).toFixed(2)); // $5B to $5000B (Trillions)
        const peRatio = parseFloat((Math.random() * 80 + 15).toFixed(2));
        const ytdGrowth = parseFloat((Math.random() * 120 - 30).toFixed(2)); // -30% to 90%
        
        type Status = 'Hyper-Growth' | 'Stabilizing' | 'Disruptive' | 'Consolidating';
        type RiskRating = 'Alpha' | 'Beta' | 'Gamma' | 'Delta';

        let status: Status;
        let riskRating: RiskRating;

        if (ytdGrowth > 40 && peRatio < 60) {
            status = 'Hyper-Growth';
            riskRating = 'Alpha';
        } else if (ytdGrowth < -10) {
            status = 'Disruptive';
            riskRating = 'Gamma';
        } else if (peRatio > 70) {
            status = 'Stabilizing';
            riskRating = 'Beta';
        } else {
            status = 'Consolidating';
            riskRating = 'Delta';
        }

        companies.push({
            id: `comp_${i}_${generateSimpleUUID()}`,
            name: `${sector.split(' ')[0]} Dynamics ${i}`,
            ticker: `XPR${Math.floor(1000 + Math.random() * 9000)}`,
            sector,
            marketCap,
            peRatio,
            ytdGrowth,
            status,
            riskRating,
            color,
        } as CompanyProfile);
    }
    return companies;
};

/**
 * Calculates the number of full months between two dates.
 */
const monthsBetween = (date1: Date, date2: Date): number => {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth();
    if (months < 0 || (months === 0 && date2.getDate() < date1.getDate())) return 0;
    return months;
};

/**
 * Generates a simple, unique identifier string.
 */
const generateSimpleUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// --- Context Interface Definition ---

interface IDataContext {
  transactions: Transaction[];
  assets: Asset[];
  impactInvestments: Asset[];
  budgets: BudgetCategory[];
  addBudget: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void;
  gamification: GamificationState;
  impactData: {
    treesPlanted: number;
    spendingForNextTree: number;
    progressToNextTree: number;
  };
  customBackgroundUrl: string | null;
  setCustomBackgroundUrl: (url: string | null) => void;
  addTransaction: (tx: Transaction) => void;
  activeIllusion: IllusionType;
  setActiveIllusion: (illusion: IllusionType) => void;
  linkedAccounts: LinkedAccount[];
  unlinkAccount: (id: string) => void;
  handlePlaidSuccess: (publicToken: string, metadata: PlaidMetadata) => void;
  weaverState: QuantumWeaverState;
  pitchBusinessPlan: (plan: string) => Promise<void>;
  simulateTestPass: () => Promise<void>;
  subscriptions: Subscription[];
  creditScore: CreditScore;
  upcomingBills: UpcomingBill[];
  savingsGoals: SavingsGoal[];
  marketMovers: MarketMover[];
  financialGoals: FinancialGoal[];
  addFinancialGoal: (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount' | 'contributions' | 'recurringContributions' | 'linkedGoals' | 'status'>) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  generateGoalPlan: (goalId: string) => Promise<void>;
  cryptoAssets: CryptoAsset[];
  paymentOperations: PaymentOperation[];
  walletInfo: WalletInfo | null;
  virtualCard: VirtualCard | null;
  connectWallet: (providerDetail: EIP6963ProviderDetail) => Promise<void>;
  disconnectWallet: () => void;
  detectedProviders: EIP6963ProviderDetail[];
  issueCard: () => void;
  buyCrypto: (usdAmount: number, cryptoTicker: string) => void;
  aiInsights: AIInsight[];
  isInsightsLoading: boolean;
  corporateCards: CorporateCard[];
  corporateTransactions: CorporateTransaction[];
  toggleCorporateCardFreeze: (cardId: string) => void;
  updateCorporateCard: (cardId: string, newControls: CorporateCardControls, newFrozenState: boolean) => void;
  rewardPoints: RewardPoints;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  isImportingData: boolean;
  nftAssets: NFTAsset[];
  mintNFT: (name: string, imageUrl: string) => void;
  mintToken: (name: string, ticker: string, amount: number) => void;
  initiatePayment: (details: Omit<PaymentOperation, 'id' | 'status' | 'date'>) => void;
  rewardItems: RewardItem[];
  redeemReward: (item: RewardItem) => boolean;
  apiStatus: APIStatus[];
  creditFactors: CreditFactor[];
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string) => void;
  modernTreasuryApiKey: string | null;
  setModernTreasuryApiKey: (key: string) => void;
  modernTreasuryOrganizationId: string | null;
  setModernTreasuryOrganizationId: (id: string) => void;
  plaidApiKey: string | null;
  setPlaidApiKey: (key: string) => void;
  stripeApiKey: string | null;
  setStripeApiKey: (key: string) => void;
  marqetaApiKey: string | null;
  setMarqetaApiKey: (key: string) => void;
  counterparties: Counterparty[];
  addCounterparty: (data: { name: string, email: string, accountNumber: string, routingNumber: string }) => Promise<void>;
  paymentOrders: PaymentOrder[];
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  userPreferences: UserPreferences;
  fetchRecipients: () => Promise<Recipient[]>;
  fetchCurrencies: () => Promise<Currency[]>;
  getUserSecurityProfile: () => Promise<SecurityProfile>;
  ledgerAccounts: LedgerAccount[];
  fetchLedgerAccounts: () => Promise<void>;
  isLedgerAccountsLoading: boolean;
  ledgerAccountsError: string | null;
  activeView: View;
  setActiveView: (view: View) => void;
  // Financial Goals Extended Methods
  addContributionToGoal: (goalId: string, amount: number) => void;
  addRecurringContributionToGoal: (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => void;
  updateRecurringContributionInGoal: (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => void;
  deleteRecurringContributionFromGoal: (goalId: string, contributionId: string) => void;
  updateFinancialGoal: (goalId: string, updates: { targetAmount?: number; targetDate?: string; monthlyContribution?: number }) => void;
  linkGoals: (sourceGoalId: string, targetGoalId: string, relationshipType: LinkedGoal['relationshipType'], triggerAmount?: number) => void;
  unlinkGoals: (sourceGoalId: string, targetGoalId: string) => void;

  // Prosperity View Data
  prosperityCompanies: CompanyProfile[];
  realEstatePortfolio: RealEstateProperty[];
  artCollection: ArtPiece[];
  activeAlgoStrategies: AlgoStrategy[];
  venturePortfolio: VentureStartup[];
  
  // AI/ML/Quantum Handlers
  investInStartup: (id: string, amount: number) => void;
  purchaseRealEstate: (id: string) => void;
  executeTrade: (symbol: string, type: 'BUY' | 'SELL', amount: number) => void;
  generateKpis: () => Promise<KPI[]>;
  fetchAIRecommendations: (context: string) => Promise<AIInsight[]>;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // --- State Initialization ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets] = useState<Asset[]>([]);
  const [impactInvestments] = useState<Asset[]>([]);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [treesPlanted, setTreesPlanted] = useState<number>(12);
  const [spendingForNextTree, setSpendingForNextTree] = useState<number>(170);
  const [gamification, setGamification] = useState<GamificationState>({
      score: 450,
      level: 1,
      levelName: LEVEL_NAMES[0],
      progress: 45,
      credits: 225,
  });
  const [customBackgroundUrl, setCustomBackgroundUrlState] = useState<string | null>(() => {
      return localStorage.getItem('customBackgroundUrl');
  });
  const [activeIllusion, setActiveIllusionState] = useState<IllusionType>(
    () => (localStorage.getItem('activeIllusion') as IllusionType) || 'none'
  );
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [weaverState, setWeaverState] = useState<QuantumWeaverState>({
      stage: WeaverStage.Pitch,
      businessPlan: '',
      feedback: '',
      questions: [],
      loanAmount: 0,
      coachingPlan: null,
      error: null,
  });
  const [subscriptions] = useState<Subscription[]>([]);
  const [creditScore] = useState<CreditScore>({ score: 750, change: 5, rating: 'Good' });
  const [upcomingBills] = useState<UpcomingBill[]>([]);
  const [savingsGoals] = useState<SavingsGoal[]>([]);
  const [marketMovers] = useState<MarketMover[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([]);
  const [paymentOperations, setPaymentOperations] = useState<PaymentOperation[]>([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
  const [detectedProviders, setDetectedProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [corporateCards, setCorporateCards] = useState<CorporateCard[]>([]);
  const [corporateTransactions] = useState<CorporateTransaction[]>([]);
  const [rewardPoints, setRewardPoints] = useState<RewardPoints>({ balance: 5280, lastEarned: 150, lastRedeemed: 500, currency: 'SP' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isImportingData, setIsImportingData] = useState(false);
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
  const [rewardItems] = useState<RewardItem[]>([]);
  const [apiStatus, setApiStatus] = useState<APIStatus[]>([
    { provider: 'Plaid', status: 'Operational', responseTime: 120 },
    { provider: 'Stripe', status: 'Operational', responseTime: 90 },
    { provider: 'Marqeta', status: 'Operational', responseTime: 150 },
    { provider: 'Modern Treasury', status: 'Operational', responseTime: 180 },
    { provider: 'Google Gemini', status: 'Operational', responseTime: 250 },
  ]);
  const [creditFactors] = useState<CreditFactor[]>([]);
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(() => localStorage.getItem('geminiApiKey'));
  const [modernTreasuryApiKey, setModernTreasuryApiKeyState] = useState<string | null>(() => localStorage.getItem('modernTreasuryApiKey'));
  const [modernTreasuryOrganizationId, setModernTreasuryOrganizationIdState] = useState<string | null>(() => localStorage.getItem('modernTreasuryOrganizationId'));
  const [plaidApiKey, setPlaidApiKeyState] = useState<string | null>(() => localStorage.getItem('plaidApiKey'));
  const [stripeApiKey, setStripeApiKeyState] = useState<string | null>(() => localStorage.getItem('stripeApiKey'));
  const [marqetaApiKey, setMarqetaApiKeyState] = useState<string | null>(() => localStorage.getItem('marqetaApiKey'));
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [paymentOrders] = useState<PaymentOrder[]>([]);
  const [invoices] = useState<Invoice[]>([]);
  const [complianceCases] = useState<ComplianceCase[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({ theme: 'dark', kpiDisplay: 'compact' });
  
  const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>([]);
  const [isLedgerAccountsLoading, setIsLedgerAccountsLoading] = useState(false);
  const [ledgerAccountsError, setLedgerAccountsError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  // Prosperity Module States
  const [prosperityCompanies] = useState<CompanyProfile[]>(generateProsperityCompanies());
  const [realEstatePortfolio, setRealEstatePortfolio] = useState<RealEstateProperty[]>([]);
  const [artCollection] = useState<ArtPiece[]>([]);
  const [activeAlgoStrategies] = useState<AlgoStrategy[]>([]);
  const [venturePortfolio, setVenturePortfolio] = useState<VentureStartup[]>([]);


  // --- API Key Setters ---
  const setGeminiApiKey = (key: string) => {
      localStorage.setItem('geminiApiKey', key);
      setGeminiApiKeyState(key);
  };

  const setModernTreasuryApiKey = (key: string) => {
      localStorage.setItem('modernTreasuryApiKey', key);
      setModernTreasuryApiKeyState(key);
  };

  const setModernTreasuryOrganizationId = (id: string) => {
      localStorage.setItem('modernTreasuryOrganizationId', id);
      setModernTreasuryOrganizationIdState(id);
  };

    const setPlaidApiKey = (key: string) => {
        localStorage.setItem('plaidApiKey', key);
        setPlaidApiKeyState(key);
    };
    const setStripeApiKey = (key: string) => {
        localStorage.setItem('stripeApiKey', key);
        setStripeApiKeyState(key);
    };
    const setMarqetaApiKey = (key: string) => {
        localStorage.setItem('marqetaApiKey', key);
        setMarqetaApiKeyState(key);
    };

  // --- Core Handlers ---

  const updateGamification = useCallback((scoreDelta: number, txType: 'income' | 'expense') => {
    setGamification(prev => {
        const newScore = prev.score + scoreDelta;
        const levelIndex = Math.min(Math.floor(newScore / SCORE_PER_LEVEL), LEVEL_NAMES.length - 1);
        const newLevelName = LEVEL_NAMES[levelIndex];
        const progress = (newScore % SCORE_PER_LEVEL) / (SCORE_PER_LEVEL / 100);
        
        // Award credits based on level up or significant score change
        let creditsEarned = 0;
        if (levelIndex > prev.level - 1) {
            creditsEarned = (levelIndex - (prev.level - 1)) * 50; // 50 credits per level up
        }

        return {
            ...prev,
            score: newScore,
            level: levelIndex + 1,
            levelName: newLevelName,
            progress: progress,
            credits: prev.credits + creditsEarned
        };
    });
  }, []);


  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions(prev => {
        const updatedTxs = [tx, ...prev].slice(0, 500); // Keep transaction history manageable
        
        if (tx.type === 'expense') {
            setSpendingForNextTree(prevSpending => {
                const newSpending = prevSpending + tx.amount;
                if (newSpending >= COST_PER_TREE) {
                    setTreesPlanted(p => p + 1);
                    setNotifications(n => [{id: `notif_eco_${Date.now()}`, message: `Ecological Milestone Reached! Another tree planted.`, timestamp: 'Just now', read: false, view: View.Impact}, ...n].slice(0, MAX_NOTIFICATIONS));
                    return newSpending - COST_PER_TREE;
                }
                return newSpending;
            });
            setBudgets(prevBudgets =>
                prevBudgets.map(b =>
                    b.name.toLowerCase() === tx.category.toLowerCase()
                        ? { ...b, spent: b.spent + tx.amount }
                        : b
                )
            );
            updateGamification(Math.floor(tx.amount / 10), 'expense'); // Score penalty based on expense magnitude
        } else if (tx.type === 'income') {
            updateGamification(Math.floor(tx.amount / 50) + 5, 'income'); // Score bonus based on income magnitude
        }
        return updatedTxs;
    });
  }, [updateGamification]);

  const setCustomBackgroundUrl = (url: string | null) => {
      if (url) localStorage.setItem('customBackgroundUrl', url);
      else localStorage.removeItem('customBackgroundUrl');
      setCustomBackgroundUrlState(url);
      if(url) setActiveIllusionState('none');
  };

  const setActiveIllusion = (illusion: IllusionType) => {
      localStorage.setItem('activeIllusion', illusion);
      setActiveIllusionState(illusion);
      if(illusion !== 'none') setCustomBackgroundUrlState(null);
  };
  
  const unlinkAccount = (id: string) => {
    setLinkedAccounts(prev => prev.filter(acc => acc.id !== id));
    setNotifications(prev => [{id: `notif_unlink_${Date.now()}`, message: `Account ID ${id} has been securely unlinked.`, timestamp: 'Just now', read: false, view: View.Accounts}, ...prev].slice(0, MAX_NOTIFICATIONS));
  };
  
  const handlePlaidSuccess = (publicToken: string, metadata: PlaidMetadata) => {
      console.log("Plaid Integration Successful:", { publicToken, metadata });
      const newAccount: LinkedAccount = {
          id: metadata.accounts[0].id,
          name: metadata.institution.name,
          mask: metadata.accounts[0].mask,
          type: metadata.accounts[0].type,
          subtype: metadata.accounts[0].subtype,
      };
      setLinkedAccounts(prev => [...prev, newAccount]);
      setIsImportingData(true);
      
      // Simulate complex data ingestion pipeline
      setTimeout(() => {
          const newTransactions: Transaction[] = [
              { id: `plaid_tx_${Date.now()}_1`, type: 'expense', category: 'Subscription Services', description: `Monthly Fee: ${metadata.institution.name}`, amount: Math.random() * 50 + 10, date: new Date().toISOString().split('T')[0]},
              { id: `plaid_tx_${Date.now()}_2`, type: 'expense', category: 'Groceries', description: `Automated Purchase at Local Market`, amount: Math.random() * 150 + 20, date: new Date(Date.now() - 86400000).toISOString().split('T')[0]},
          ];
          newTransactions.forEach(addTransaction);
          setIsImportingData(false);
          setNotifications(prev => [{id: `notif_plaid_success_${Date.now()}`, message: `${metadata.institution.name} linked. ${newTransactions.length} transactions ingested.`, timestamp: 'Just now', read: false, view: View.Accounts}, ...prev].slice(0, MAX_NOTIFICATIONS));
      }, 4000);
  };
  
  const pitchBusinessPlan = async (plan: string) => {
      setWeaverState(prev => ({ ...prev, stage: WeaverStage.Analysis, businessPlan: plan, error: null }));
      
      if (!geminiApiKey) {
          setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "Gemini API Key is missing. Cannot initiate Quantum Weaver analysis." }));
          return;
      }

      try {
          const ai = new GoogleGenAI({ apiKey: geminiApiKey });
          const prompt = `Analyze the following business plan for a 100-year enterprise. Provide a comprehensive risk assessment (High, Medium, Low), 5 strategic growth vectors, and a projected 5-year valuation range (e.g., "$500M - $1.2B"). Format the output strictly as a JSON object with keys: "riskAssessment", "growthVectors" (array of strings), and "valuationRange". Business Plan: ${plan}`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-pro', // Using Pro for deeper analysis
              contents: prompt,
              config: { responseMimeType: 'application/json' }
          });
          
          const result = JSON.parse(response.text);
          
          const coachingPlan: AIPlan = {
              title: "Quantum Leap Strategy Blueprint",
              summary: `AI analysis complete. Risk profile: ${result.riskAssessment}. Focus on implementing the ${result.growthVectors[0]} vector immediately.`,
              steps: result.growthVectors.map((vector: string, index: number) => ({ 
                  title: `Vector ${index + 1}: ${vector.substring(0, 30)}...`, 
                  description: vector, 
                  timeline: `${(index + 1) * 4} Weeks` 
              })),
          };
          
          setWeaverState(prev => ({
              ...prev,
              stage: WeaverStage.Test,
              feedback: `Valuation Projection: ${result.valuationRange}. Strategic vectors identified.`,
              questions: [{ id: `q_risk_${Date.now()}`, question: `How will you mitigate the identified ${result.riskAssessment} risk?`, category: 'Risk Mitigation' }],
              loanAmount: Math.floor(Math.random() * 10000000) + 500000, // Mock loan amount
              coachingPlan: coachingPlan,
          }));
      } catch (err) {
          console.error("Quantum Weaver Analysis Error:", err);
          setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: `Analysis failed: ${err instanceof Error ? err.message : 'Unknown API Error'}. Check API Key and Quota.` }));
      }
  };

  const simulateTestPass = async () => {
    setWeaverState(prev => ({ ...prev, stage: WeaverStage.FinalReview }));
    await new Promise(resolve => setTimeout(resolve, 3000));
    setWeaverState(prev => ({ ...prev, stage: WeaverStage.Approved, feedback: "Quantum Weaver Protocol Approved. Funding released." }));
    setGamification(prev => ({ ...prev, credits: prev.credits + 500 }));
    setNotifications(prev => [{id: `notif_weaver_app_${Date.now()}`, message: `Quantum Weaver Protocol Approved! System access level elevated.`, timestamp: 'Just now', read: false, view: View.Weaver}, ...prev].slice(0, MAX_NOTIFICATIONS));
  };
  
  // --- EIP-6963 Wallet Handlers ---
  useEffect(() => {
    function onAnnounceProvider(event: any) {
      setDetectedProviders(prev => {
          if (prev.some(p => p.info.uuid === event.detail.info.uuid)) return prev;
          return [...prev, event.detail];
      });
    }
    window.addEventListener("eip6963:announceProvider", onAnnounceProvider);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener("eip6963:announceProvider", onAnnounceProvider);
    };
  }, []);

  const connectWallet = async (providerDetail: EIP6963ProviderDetail) => {
    if (!providerDetail.provider.request) {
        setNotifications(prev => [{id: `notif_wallet_err_${Date.now()}`, message: `Provider ${providerDetail.info.name} does not support standard request methods.`, timestamp: 'Just now', read: false, view: View.Wallet}, ...prev].slice(0, MAX_NOTIFICATIONS));
        return;
    }
    try {
        const accounts = await providerDetail.provider.request({ method: 'eth_requestAccounts' }) as string[];
        if (accounts.length > 0) {
            const address = accounts[0];
            const balanceHex = await providerDetail.provider.request({ method: 'eth_getBalance', params: [address, 'latest'] }) as string;
            setWalletInfo({
                address: address,
                balance: parseInt(balanceHex, 16) / 1e18,
                providerName: providerDetail.info.name
            });
            setNotifications(prev => [{id: `notif_wallet_conn_${Date.now()}`, message: `Wallet connected via ${providerDetail.info.name}.`, timestamp: 'Just now', read: false, view: View.Wallet}, ...prev].slice(0, MAX_NOTIFICATIONS));
        }
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        setNotifications(prev => [{id: `notif_wallet_fail_${Date.now()}`, message: `Wallet connection rejected or failed: ${error instanceof Error ? error.message : 'Unknown error'}`, timestamp: 'Just now', read: false, view: View.Wallet}, ...prev].slice(0, MAX_NOTIFICATIONS));
    }
  };

  const disconnectWallet = () => {
    setWalletInfo(null);
    setNotifications(prev => [{id: `notif_wallet_disc_${Date.now()}`, message: `Wallet disconnected.`, timestamp: 'Just now', read: false, view: View.Wallet}, ...prev].slice(0, MAX_NOTIFICATIONS));
  };
  
  const issueCard = () => {
      if (virtualCard) return; // Prevent re-issuance mock
      setVirtualCard({
          id: `card_${generateSimpleUUID()}`,
          cardNumber: `5100 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
          cvv: `${Math.floor(100 + Math.random() * 900)}`,
          expiry: `12/${new Date().getFullYear() + 4 - 2000}`,
          holderName: 'Quantum User',
          limit: 10000,
          frozen: false,
          controls: { spendingLimit: 5000, categoryRestrictions: ['Gambling', 'Luxury'] }
      });
      setNotifications(prev => [{id: `notif_card_issue_${Date.now()}`, message: `Virtual Quantum Card issued with initial controls set.`, timestamp: 'Just now', read: false, view: View.Cards}, ...prev].slice(0, MAX_NOTIFICATIONS));
  };

  const buyCrypto = (usdAmount: number, cryptoTicker: string) => {
      // Mock price lookup
      const currentPrice = cryptoAssets.find(c => c.ticker === cryptoTicker)?.value || (cryptoTicker === 'ETH' ? 3500 : 65000);
      const amountBought = usdAmount / currentPrice;
      
      setCryptoAssets(prev => {
          const existing = prev.find(c => c.ticker === cryptoTicker);
          if (existing) {
              return prev.map(c => c.ticker === cryptoTicker ? {...c, amount: c.amount + amountBought, value: currentPrice} : c);
          }
          return [...prev, { ticker: cryptoTicker, name: cryptoTicker, value: currentPrice, amount: amountBought, color: `#${Math.floor(Math.random()*16777215).toString(16)}` }];
      });
      
      addTransaction({id: `crypto_buy_${Date.now()}`, type: 'expense', category: 'Investment', description: `Acquired ${amountBought.toFixed(4)} ${cryptoTicker}`, amount: usdAmount, date: new Date().toISOString().split('T')[0]});
      setNotifications(prev => [{id: `notif_crypto_buy_${Date.now()}`, message: `Successfully purchased ${amountBought.toFixed(3)} ${cryptoTicker}.`, timestamp: 'Just now', read: false, view: View.Assets}, ...prev].slice(0, MAX_NOTIFICATIONS));
  };

  const generateDashboardInsights = useCallback(async () => {
      if (!geminiApiKey) {
          setAiInsights([{ id: 'setup_req', title: 'API Key Required', description: 'Configure the Gemini API key to unlock predictive financial intelligence.', urgency: 'critical' }]);
          return;
      }
      setIsInsightsLoading(true);
      try {
          const ai = new GoogleGenAI({apiKey: geminiApiKey});
          const recentData = JSON.stringify({
              transactions: transactions.slice(0, 20),
              budgets: budgets.map(b => ({name: b.name, spent: b.spent})),
              goals: savingsGoals.length,
              score: gamification.score
          });
          
          const prompt = `Analyze the provided financial snapshot. Generate ${MAX_AI_INSIGHTS} highly specific, actionable insights for a user aiming for multi-generational wealth. Insights must cover spending optimization, goal acceleration, and risk mitigation. Format the output strictly as a JSON array of objects, each containing "id", "title" (max 5 words), "description" (max 15 words), and "urgency" ('critical', 'high', 'medium', 'low'). Snapshot: ${recentData}`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { responseMimeType: "application/json" }
          });

          const rawInsights: AIInsight[] = JSON.parse(response.text);
          setAiInsights(rawInsights.slice(0, MAX_AI_INSIGHTS));

      } catch (err) {
          console.error("Error generating insights:", err);
          setAiInsights([{ id: 'err_ai', title: 'AI Processing Failure', description: 'The predictive engine encountered an anomaly. Retrying may resolve.', urgency: 'medium' }]);
      } finally {
          setIsInsightsLoading(false);
      }
  }, [transactions, budgets, savingsGoals, gamification.score, geminiApiKey]);

  useEffect(() => {
    // Initial load and periodic refresh for insights
    if (transactions.length > 0 || budgets.length > 0) {
        generateDashboardInsights();
    }
    const intervalId = setInterval(generateDashboardInsights, 3600000); // Refresh every hour
    return () => clearInterval(intervalId);
  }, [generateDashboardInsights, transactions.length, budgets.length]);
  
    const toggleCorporateCardFreeze = (cardId: string) => {
        setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, frozen: !c.frozen } : c));
        setNotifications(prev => [{id: `notif_card_freeze_${Date.now()}`, message: `Corporate Card ${cardId.slice(-4)} freeze status toggled.`, timestamp: 'Just now', read: false, view: View.Corporate}, ...prev].slice(0, MAX_NOTIFICATIONS));
    };

    const updateCorporateCard = (cardId: string, newControls: CorporateCardControls, newFrozenState: boolean) => {
        setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, controls: newControls, frozen: newFrozenState } : c));
        setNotifications(prev => [{id: `notif_card_update_${Date.now()}`, message: `Corporate Card ${cardId.slice(-4)} controls updated.`, timestamp: 'Just now', read: false, view: View.Corporate}, ...prev].slice(0, MAX_NOTIFICATIONS));
    };

    const markNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const mintNFT = (name: string, imageUrl: string) => {
        const newNft: NFTAsset = {
            id: `nft_${generateSimpleUUID()}`,
            name,
            imageUrl,
            contractAddress: `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            assetType: 'Digital Art',
            metadata: { description: `AI-generated asset for ${name}` }
        };
        setNftAssets(prev => [newNft, ...prev]);
        setNotifications(prev => [{id: `notif_nft_mint_${Date.now()}`, message: `New NFT minted: ${name}.`, timestamp: 'Just now', read: false, view: View.Assets}, ...prev].slice(0, MAX_NOTIFICATIONS));
    };

    const mintToken = (name: string, ticker: string, amount: number) => {
        const newCrypto: CryptoAsset = {
            ticker,
            name,
            value: 1.00, // Initial placeholder value
            amount: amount,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            blockchain: 'CustomChain'
        };
        setCryptoAssets(prev => [...prev, newCrypto]);
        setNotifications(prev => [{id: `notif_token_mint_${Date.now()}`, message: `${amount} units of ${ticker} minted.`, timestamp: 'Just now', read: false, view: View.Assets}, ...prev].slice(0, MAX_NOTIFICATIONS));
    };
    
    const initiatePayment = (details: Omit<PaymentOperation, 'id' | 'status' | 'date'>) => {
        const newOp: PaymentOperation = {
            ...details,
            id: `op_${generateSimpleUUID()}`,
            status: 'Initiated',
            date: new Date().toISOString().split('T')[0]
        };
        setPaymentOperations(prev => [newOp, ...prev]);
        
        // Simulate external API call delay
        setTimeout(() => {
            setPaymentOperations(prev => prev.map(op => op.id === newOp.id ? {...op, status: 'Completed'} : op));
            setNotifications(prev => [{id: `notif_payment_${Date.now()}`, message: `Payment operation ${details.description} completed successfully.`, timestamp: 'Just now', read: false, view: View.Payments}, ...prev].slice(0, MAX_NOTIFICATIONS));
        }, 5000);
    };

    const redeemReward = (item: RewardItem): boolean => {
        if (rewardPoints.balance >= item.cost) {
            setRewardPoints(prev => ({ 
                ...prev, 
                balance: prev.balance - item.cost, 
                lastRedeemed: item.cost,
                balanceChangeTimestamp: Date.now()
            }));
            setNotifications(prev => [{id: `notif_reward_redeem_${Date.now()}`, message: `Reward '${item.name}' redeemed for ${item.cost} points.`, timestamp: 'Just now', read: false, view: View.Rewards}, ...prev].slice(0, MAX_NOTIFICATIONS));
            return true;
        }
        return false;
    };

    const addCounterparty = async (data: { name: string, email: string, accountNumber: string, routingNumber: string }) => {
        const newCounterparty: Counterparty = {
            id: `cprty_${generateSimpleUUID()}`,
            name: data.name,
            email: data.email,
            send_remittance_advice: true,
            created_at: new Date().toISOString(),
            accounts: [{
                id: `cprty_acc_${generateSimpleUUID()}`,
                party_name: data.name,
                account_details: [{ account_number_safe: data.accountNumber.slice(-4) }],
            }]
        };
        setCounterparties(prev => [...prev, newCounterparty]);
        setNotifications(prev => [{id: `notif_cprty_add_${Date.now()}`, message: `New counterparty ${data.name} added for payment routing.`, timestamp: 'Just now', read: false, view: View.Payments}, ...prev].slice(0, MAX_NOTIFICATIONS));
    };
    
  const fetchRecipients = async () => Promise.resolve<Recipient[]>([{ id: 'rec_1', name: 'AI Core Services' }]);
  const fetchCurrencies = async () => Promise.resolve<Currency[]>([{ code: 'USD', name: 'US Dollar', symbol: '$' }, { code: 'EUR', name: 'Euro', symbol: '€' }]);
  const getUserSecurityProfile = async () => Promise.resolve<SecurityProfile>({
      mfaEnabled: true,
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
      dataEncryptionLevel: 'AES-256-QuantumResistant'
  });

  const fetchLedgerAccounts = async () => {
    if (!modernTreasuryApiKey || !modernTreasuryOrganizationId) {
        setLedgerAccountsError("Modern Treasury API credentials are not configured.");
        return;
    }

    setIsLedgerAccountsLoading(true);
    setLedgerAccountsError(null);

    try {
        // NOTE: In a real application, this fetch would be proxied server-side to avoid CORS issues and securely handle API keys.
        const response = await fetch(
            'https://api.mock.moderntreasury.com/ledger_accounts?per_page=50', // Mocked endpoint
            {
                headers: {
                    'Authorization': `Basic ${btoa((modernTreasuryApiKey || '') + ':')}`,
                    'Modern-Treasury-Organization-Id': modernTreasuryOrganizationId || '',
                    'Content-Type': 'application/json'
                },
            }
        );

        if (!response.ok) {
            throw new Error(`MT API returned status ${response.status}. Check network connectivity and credentials.`);
        }

        const data = await response.json();
        setLedgerAccounts(data.data || data); 
    } catch (err: any) {
        if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
             setLedgerAccountsError("CORS Policy Block: Browser security prevents direct API calls. A server-side proxy is required for live data synchronization.");
        } else {
            setLedgerAccountsError(err.message || "An unknown error occurred during ledger fetch.");
        }
    } finally {
        setIsLedgerAccountsLoading(false);
    }
  };


  const addFinancialGoal = (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount' | 'contributions' | 'recurringContributions' | 'linkedGoals' | 'status'>) => {
    const newGoal: FinancialGoal = {
        ...goalData,
        id: `goal_${generateSimpleUUID()}`,
        currentAmount: 0,
        plan: null,
        contributions: [],
        recurringContributions: [],
        linkedGoals: [],
        status: 'initializing',
    };
    setFinancialGoals(prev => [...prev, newGoal]);
    setNotifications(prev => [{id: `notif_goal_add_${Date.now()}`, message: `New goal '${goalData.name}' created. Ready for AI planning.`, timestamp: 'Just now', read: false, view: View.Goals}, ...prev].slice(0, MAX_NOTIFICATIONS));
  };
  
  const generateGoalPlan = async (goalId: string) => {
    const goal = financialGoals.find(g => g.id === goalId);
    if (!goal || !geminiApiKey) return;

    setFinancialGoals(prev => prev.map(g => g.id === goalId ? {...g, status: 'planning'} : g));
    
    try {
        const ai = new GoogleGenAI({apiKey: geminiApiKey});
        const prompt = `Create an ultra-aggressive, multi-decade financial plan for achieving the goal: ${goal.name} (Target: $${goal.targetAmount} by ${goal.targetDate}). The plan must include monthly contribution targets, risk tolerance adjustments, and quarterly review checkpoints. Output as a JSON object with keys: "summary", "monthlyTarget", "checkpoints" (array of strings).`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const result = JSON.parse(response.text);
        
        const months = monthsBetween(new Date(), new Date(goal.targetDate));
        const calculatedMonthly = Math.max(50, Math.ceil(goal.targetAmount / months));

        const newPlan: AIGoalPlan = {
            feasibilitySummary: result.summary,
            monthlyContribution: Math.max(calculatedMonthly, result.monthlyTarget || 0),
            actionableSteps: result.checkpoints,
            steps: result.checkpoints.map((cp: string, i: number) => ({
                title: `Checkpoint ${i + 1}`,
                description: cp,
                category: 'Strategic Review'
            }))
        };

        setFinancialGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return { ...g, plan: newPlan, status: 'active' };
            }
            return g;
        }));
        setNotifications(prev => [{id: `notif_goal_plan_${Date.now()}`, message: `AI Plan generated for ${goal.name}.`, timestamp: 'Just now', read: false, view: View.Goals}, ...prev].slice(0, MAX_NOTIFICATIONS));

    } catch (e) {
        console.error("Goal Planning Error:", e);
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? {...g, status: 'error'} : g));
    }
  };
  
  const contributeToGoal = (goalId: string, amount: number) => {
    addContributionToGoal(goalId, amount);
    // Simulate a small gamification boost for goal contribution
    updateGamification(15, 'income'); 
  };
  
    // --- Extended Financial Goals Methods ---
    const addContributionToGoal = (goalId: string, amount: number) => {
        const newContribution: Contribution = {
            id: `contrib_${generateSimpleUUID()}`,
            amount: amount,
            date: new Date().toISOString(),
            type: 'manual'
        };
        setFinancialGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    currentAmount: g.currentAmount + amount,
                    contributions: g.contributions ? [...g.contributions, newContribution] : [newContribution]
                };
            }
            return g;
        }));
    };

    const addRecurringContributionToGoal = (goalId: string, contribution: Omit<RecurringContribution, 'id'>) => {
        const newRecurring: RecurringContribution = {
            ...contribution,
            id: `rec_${generateSimpleUUID()}`
        };
        setFinancialGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    recurringContributions: g.recurringContributions ? [...g.recurringContributions, newRecurring] : [newRecurring]
                };
            }
            return g;
        }));
    };

    const updateRecurringContributionInGoal = (goalId: string, contributionId: string, updates: Partial<RecurringContribution>) => {
        setFinancialGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    recurringContributions: g.recurringContributions?.map(rc => 
                        rc.id === contributionId ? { ...rc, ...updates } : rc
                    )
                };
            }
            return g;
        }));
    };

    const deleteRecurringContributionFromGoal = (goalId: string, contributionId: string) => {
        setFinancialGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    recurringContributions: g.recurringContributions?.filter(rc => rc.id !== contributionId)
                };
            }
            return g;
        }));
    };
    
    const updateFinancialGoal = (goalId: string, updates: { targetAmount?: number; targetDate?: string; monthlyContribution?: number }) => {
        setFinancialGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                const newGoal = {...g};
                if(updates.targetAmount) newGoal.targetAmount = updates.targetAmount;
                if(updates.targetDate) newGoal.targetDate = updates.targetDate;
                if(updates.monthlyContribution && newGoal.plan) {
                    newGoal.plan.monthlyContribution = updates.monthlyContribution;
                }
                return newGoal;
            }
            return g;
        }));
    };

    const linkGoals = (sourceGoalId: string, targetGoalId: string, relationshipType: LinkedGoal['relationshipType'], triggerAmount?: number) => {
        setFinancialGoals(prev => prev.map(g => {
            if (g.id === sourceGoalId) {
                const newLink: LinkedGoal = { id: targetGoalId, relationshipType, triggerAmount };
                return {
                    ...g,
                    linkedGoals: g.linkedGoals ? [...g.linkedGoals, newLink] : [newLink]
                };
            }
            return g;
        }));
    };

    const unlinkGoals = (sourceGoalId: string, targetGoalId: string) => {
        setFinancialGoals(prev => prev.map(g => {
            if (g.id === sourceGoalId) {
                return {
                    ...g,
                    linkedGoals: g.linkedGoals?.filter(link => link.id !== targetGoalId)
                };
            }
            return g;
        }));
    };

    // --- Prosperity & Quantum Handlers ---

    const investInStartup = (id: string, amount: number) => {
        const mockStartup = venturePortfolio.find(v => v.id === id) || {
            id: id,
            name: `Venture ${id.substring(0, 4)}`,
            stage: 'Series A',
            valuation: amount * 15,
            investmentAmount: 0,
            equity: 0.01,
            status: 'Active',
        } as VentureStartup;
        
        if (!venturePortfolio.some(v => v.id === id)) {
            setVenturePortfolio(prev => [...prev, mockStartup]);
        }
        
        // Update investment amount (mocking aggregation)
        setVenturePortfolio(prev => prev.map(v => v.id === id ? {...v, investmentAmount: v.investmentAmount + amount, equity: v.equity + 0.005} : v));
        
        addTransaction({ 
            id: `invest_${generateSimpleUUID()}`, 
            type: 'expense', 
            category: 'Venture Capital', 
            description: `Seed Investment in ${mockStartup.name}`, 
            amount: amount, 
            date: new Date().toISOString().split('T')[0] 
        });
        setNotifications(prev => [{id: `notif_vc_invest_${Date.now()}`, message: `Capital deployed to ${mockStartup.name}. Monitoring for exponential growth.`, timestamp: 'Just now', read: false, view: View.Prosperity}, ...prev].slice(0, MAX_NOTIFICATIONS));
    };

    const purchaseRealEstate = (id: string) => {
        const price = 750000 + Math.random() * 1200000;
        const mockProperty: RealEstateProperty = {
            id: `prop_${generateSimpleUUID()}`,
            address: `Sector ${id} Nexus Tower, Level ${Math.floor(100 + Math.random() * 50)}`,
            purchasePrice: price,
            currentValue: price * 1.01,
            type: 'Residential High-Density',
            yield: 0.04 + Math.random() * 0.02,
            location: 'Orbital Habitat 7',
            status: 'Secured',
        } as RealEstateProperty;
        
        setRealEstatePortfolio(prev => [...prev, mockProperty]);

        addTransaction({ 
            id: `re_purchase_${generateSimpleUUID()}`, 
            type: 'expense', 
            category: 'Real Estate', 
            description: `Acquisition of Nexus Property ${id}`, 
            amount: price, 
            date: new Date().toISOString().split('T')[0] 
        });
        setNotifications(prev => [{id: `notif_re_acq_${Date.now()}`, message: `Real Estate asset secured in Orbital Habitat 7.`, timestamp: 'Just now', read: false, view: View.Prosperity}, ...prev].slice(0, MAX_NOTIFICATIONS));
    };
    
    const executeTrade = (symbol: string, type: 'BUY' | 'SELL', amount: number) => {
        const mockPrice = symbol === 'QNTM' ? 1200 : 45000; 
        const totalAmount = amount * mockPrice;

        if (type === 'BUY') {
            addTransaction({ 
                id: `trade_${generateSimpleUUID()}_buy`, 
                type: 'expense', 
                category: 'Asset Trading', 
                description: `Quantum Asset Acquisition: ${amount.toFixed(2)} units of ${symbol}`, 
                amount: totalAmount, 
                date: new Date().toISOString().split('T')[0] 
            });
            setCryptoAssets(prev => {
                const existing = prev.find(c => c.ticker === symbol);
                if (existing) return prev.map(c => c.ticker === symbol ? {...c, amount: c.amount + amount} : c);
                return [...prev, { ticker: symbol, name: symbol, value: mockPrice, amount: amount, color: '#A020F0' }];
            });
        } else {
            addTransaction({ 
                id: `trade_${generateSimpleUUID()}_sell`, 
                type: 'income', 
                category: 'Asset Trading', 
                description: `Quantum Asset Liquidation: ${amount.toFixed(2)} units of ${symbol}`, 
                amount: totalAmount * 0.995, // 0.5% fee simulation
                date: new Date().toISOString().split('T')[0] 
            });
        }
        
        setNotifications(prev => [{id: `notif_trade_exec_${Date.now()}`, message: `${type} order for ${symbol} executed. Total value: $${totalAmount.toFixed(2)}.`, timestamp: 'Just now', read: false, view: View.Assets}, ...prev].slice(0, MAX_NOTIFICATIONS));
    };

    // --- AI/ML/System Functions ---

    const generateKpis = async (): Promise<KPI[]> => {
        if (!geminiApiKey) return [{ id: 'kpi_setup', name: 'API Key Missing', value: 'Configure Gemini', trend: 'neutral', color: 'red' }];
        
        try {
            const ai = new GoogleGenAI({apiKey: geminiApiKey});
            const contextData = JSON.stringify({
                NetWorth: assets.length * 1000000, // Mock net worth
                GamificationLevel: gamification.level,
                GoalProgress: financialGoals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / (financialGoals.length || 1)
            });

            const prompt = `Generate 5 critical Key Performance Indicators (KPIs) for a user managing a multi-trillion dollar future enterprise portfolio based on the provided context. KPIs must include a name, a calculated value (use mock data if necessary), a trend indicator ('up', 'down', 'neutral'), and a color code ('green', 'yellow', 'red'). Context: ${contextData}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            return JSON.parse(response.text) as KPI[];

        } catch (e) {
            console.error("KPI Generation Error:", e);
            return [{ id: 'kpi_error', name: 'KPI Engine Failure', value: 'Check Logs', trend: 'down', color: 'red' }];
        }
    };

    const fetchAIRecommendations = async (context: string): Promise<AIInsight[]> => {
        if (!geminiApiKey) return [];
        
        try {
            const ai = new GoogleGenAI({apiKey: geminiApiKey});
            const prompt = `Provide 3 highly specialized, forward-looking strategic recommendations based on the context: "${context}". Format as AIInsight objects.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            return JSON.parse(response.text) as AIInsight[];

        } catch (e) {
            console.error("Recommendation Fetch Error:", e);
            return [{ id: 'rec_error', title: 'Recommendation Unavailable', description: 'AI service temporarily offline.', urgency: 'low' }];
        }
    };


    // --- Context Value Assembly ---

    const value: IDataContext = {
        transactions,
        assets,
        impactInvestments,
        budgets,
        addBudget: (budget) => {
            const newBudget: BudgetCategory = { 
                ...budget, 
                id: `budget_${generateSimpleUUID()}`, 
                spent: 0, 
                color: COLORS[budgets.length % COLORS.length] 
            };
            setBudgets(prev => [...prev, newBudget]);
        },
        gamification,
        impactData: {
            treesPlanted,
            spendingForNextTree,
            progressToNextTree: (spendingForNextTree / COST_PER_TREE) * 100
        },
        customBackgroundUrl,
        setCustomBackgroundUrl,
        addTransaction,
        activeIllusion,
        setActiveIllusion,
        linkedAccounts,
        unlinkAccount,
        handlePlaidSuccess,
        weaverState,
        pitchBusinessPlan,
        simulateTestPass,
        subscriptions,
        creditScore,
        upcomingBills,
        savingsGoals,
        marketMovers,
        financialGoals,
        addFinancialGoal,
        contributeToGoal,
        generateGoalPlan,
        cryptoAssets,
        paymentOperations,
        walletInfo,
        virtualCard,
        connectWallet,
        disconnectWallet,
        detectedProviders,
        issueCard,
        buyCrypto,
        aiInsights,
        isInsightsLoading,
        corporateCards,
        corporateTransactions,
        toggleCorporateCardFreeze,
        updateCorporateCard,
        rewardPoints,
        notifications,
        markNotificationRead,
        isImportingData,
        nftAssets,
        mintNFT,
        mintToken,
        initiatePayment,
        rewardItems,
        redeemReward,
        apiStatus,
        creditFactors,
        geminiApiKey,
        setGeminiApiKey,
        modernTreasuryApiKey,
        setModernTreasuryApiKey,
        modernTreasuryOrganizationId,
        setModernTreasuryOrganizationId,
        plaidApiKey,
        setPlaidApiKey,
        stripeApiKey,
        setStripeApiKey,
        marqetaApiKey,
        setMarqetaApiKey,
        counterparties,
        addCounterparty,
        paymentOrders,
        invoices,
        complianceCases,
        userPreferences,
        fetchRecipients,
        fetchCurrencies,
        getUserSecurityProfile,
        ledgerAccounts,
        fetchLedgerAccounts,
        isLedgerAccountsLoading,
        ledgerAccountsError,
        activeView,
        setActiveView,
        addContributionToGoal,
        addRecurringContributionToGoal,
        updateRecurringContributionInGoal,
        deleteRecurringContributionFromGoal,
        updateFinancialGoal,
        linkGoals,
        unlinkGoals,
        // Prosperity View Data
        prosperityCompanies,
        realEstatePortfolio,
        artCollection,
        activeAlgoStrategies,
        venturePortfolio,

        // Handlers
        investInStartup,
        purchaseRealEstate,
        executeTrade,
        generateKpis,
        fetchAIRecommendations,
    };
    
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};