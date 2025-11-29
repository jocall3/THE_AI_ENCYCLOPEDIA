import React, { useState, useEffect, createContext, useContext, useReducer, useRef, useMemo, useCallback } from 'react';
import Card from './Card';
import { banks } from '../constants'; // Import the centralized bank list

// ================================================================================================
// ARCHITECTURAL MANIFESTO: THE SOVEREIGN FINANCIAL OPERATING SYSTEM (SFOS)
// ================================================================================================
// This file, FinancialDemocracyView.tsx, serves as the primary interface for user-initiated
// financial institution linkage within the Sovereign Financial Operating System (SFOS).
// It encapsulates the secure, audited, and AI-augmented connection process via the Plaid integration layer.
// Every interaction here is logged, audited, and optimized by the core AI engine.
// The goal is absolute financial sovereignty achieved through transparent, intelligent data aggregation.

export type PlaidEnvironment = 'sandbox' | 'development' | 'production';
export type PlaidProduct = 'transactions' | 'auth' | 'identity' | 'investments' | 'assets' | 'liabilities' | 'income' | 'payment_initiation' | 'employment';
export type AccountType = 'depository' | 'credit' | 'loan' | 'investment' | 'brokerage' | 'other';
export type AccountSubType = 'checking' | 'savings' | 'cd' | 'money market' | 'prepaid' | 'cash management' | 'credit card' | 'paypal' | 'mortgage' | 'auto' | 'student' | 'personal' | 'commercial' | 'ira' | '401k' | 'pension' | 'stock' | 'mutual fund' | 'etf' | 'crypto' | 'other';
export type TransactionCategory = 'uncategorized' | 'food_dining' | 'transportation' | 'housing' | 'utilities' | 'healthcare' | 'entertainment' | 'shopping' | 'education' | 'personal_care' | 'income' | 'investments' | 'debt_payments' | 'transfers' | 'travel' | 'fees' | 'business_expenses' | 'gifts' | 'charity' | 'other_expenses';
export type FinancialGoalType = 'savings' | 'debt_reduction' | 'investment' | 'emergency_fund' | 'retirement';
export type TransactionStatus = 'pending' | 'posted' | 'cancelled';
export type AIInsightType = 'spending_alert' | 'budget_deviation' | 'saving_tip' | 'investment_opportunity' | 'subscription_detected' | 'debt_optimization' | 'fraud_alert' | 'bill_reminder' | 'tax_advice' | 'market_sentiment_shift' | 'liquidity_forecast' | 'risk_exposure_analysis' | 'compliance_check';
export type WebhookEventType = 'TRANSACTIONS_UNAVAILABLE' | 'TRANSACTIONS_REMOVED' | 'TRANSACTIONS_NEW' | 'TRANSACTIONS_SYNC_UPDATES' | 'ITEM_ERROR' | 'ITEM_LOGIN_REQUIRED' | 'ITEM_UNLINKED' | 'ITEM_UPDATE_REQUESTED' | 'AUTH_DATA_UPDATE' | 'INVESTMENTS_UPDATES_AVAILABLE' | 'INCOME_VERIFICATION_UPDATES_AVAILABLE' | 'ASSETS_PRODUCT_READY';
export type BudgetFrequency = 'weekly' | 'bi-weekly' | 'monthly' | 'annually';

// --- AI Augmentation Interfaces ---

export interface AIProfileAnalysis {
    riskToleranceScore: number; // 0 to 100
    spendingHabitVector: string[]; // e.g., ['high_discretionary', 'low_fixed_cost']
    predictedNetWorthTrajectory: 'accelerating' | 'stagnant' | 'decelerating';
    suggestedAIProducts: string[];
}

export interface ConnectionAuditLog {
    timestamp: Date;
    event: string;
    details: string;
    aiValidated: boolean;
    aiConfidenceScore: number; // 0.0 to 1.0
}

// --- Plaid Related Interfaces (Extended for SFOS) ---

export interface PlaidLinkButtonProps {
    onSuccess: (publicToken: string, metadata: PlaidLinkSuccessMetadata) => void;
    onExit?: (error: PlaidLinkError | null, metadata: PlaidLinkExitMetadata) => void;
    onEvent?: (eventName: string, metadata: any) => void;
    linkToken?: string;
    products?: PlaidProduct[];
    countryCodes?: string[];
    language?: string;
    user?: {
        client_user_id: string;
        legal_name?: string;
        email_address?: string;
    };
    environment?: PlaidEnvironment;
    oauthNonce?: string;
    oauthRedirectUri?: string;
    institutionId?: string;
    paymentId?: string;
    isUpdateMode?: boolean;
    accessToken?: string;
}

export interface PlaidLinkSuccessMetadata {
    institution: {
        name: string;
        institution_id: string;
    };
    accounts: Array<{
        id: string;
        name: string;
        mask: string;
        type: AccountType;
        subtype: AccountSubType;
        verification_status?: string;
    }>;
    link_session_id: string;
    products: PlaidProduct[];
    user_id: string;
    public_token_id: string;
}

export interface PlaidLinkExitMetadata {
    request_id?: string;
    institution?: {
        name: string;
        institution_id: string;
    };
    link_session_id: string;
    status?: string;
    error_code?: string;
    error_message?: string;
    error_type?: string;
    exit_status?: string;
    flow_type?: 'LOGIN' | 'CREATE_ACCOUNT' | 'MFA' | 'ERROR';
}

export interface PlaidLinkError {
    error_code: string;
    error_message: string;
    error_type: string;
    display_message: string | null;
    request_id: string;
    causes: any[];
    status_code: number;
}

export interface LinkedInstitution {
    id: string; // Plaid Item ID
    name: string;
    institutionId: string; // Plaid Institution ID
    accessToken: string; // The access token should NEVER be stored on the client. This is for demonstration architecture only.
    connectedAccounts: FinancialAccount[];
    metadata: PlaidLinkSuccessMetadata;
    lastUpdated: Date;
    status: 'connected' | 'reauth_required' | 'error' | 'disconnected';
    securityAuditLog: ConnectionAuditLog[];
    aiProfileSummary: AIProfileAnalysis;
    dataIntegrityScore: number; // 0 to 100, calculated by AI
}

export interface FinancialAccount {
    id: string; // Plaid Account ID
    institutionId: string;
    name: string;
    officialName?: string;
    mask: string;
    type: AccountType;
    subtype: AccountSubType;
    currentBalance: number;
    availableBalance: number;
    currency: string;
    limit?: number;
    balanceHistory: { date: string; balance: number; }[];
    isLinked: boolean;
    isActive: boolean;
    syncStatus: 'synced' | 'pending' | 'error';
    lastSyncAttempt: Date;
    errorDetails?: string;
    aiRiskFlag: boolean;
}

export interface Transaction {
    id: string; // Plaid Transaction ID
    accountId: string;
    institutionId: string;
    name: string;
    merchantName?: string;
    amount: number;
    currency: string;
    date: string; // YYYY-MM-DD
    authorizedDate?: string;
    category: TransactionCategory;
    isPending: boolean;
    status: TransactionStatus;
    location?: {
        address?: string;
        city?: string;
        region?: string;
        postalCode?: string;
        country?: string;
        lat?: number;
        lon?: number;
    };
    paymentChannel?: string;
    personalFinanceCategory?: {
        primary: string;
        detailed: string;
    };
    isoCurrencyCode: string;
    logoUrl?: string;
    website?: string;
    notes?: string;
    tags?: string[];
    isFlagged: boolean;
    aiCategorizationConfidence: number;
}

export interface Budget {
    id: string;
    name: string;
    category: TransactionCategory;
    amount: number;
    spent: number;
    remaining: number;
    startDate: string;
    endDate: string;
    frequency: BudgetFrequency;
    alertsEnabled: boolean;
    alertThreshold?: number;
    isAchieved: boolean;
    createdAt: Date;
    updatedAt: Date;
    aiOptimizationSuggestion?: string;
}

export interface FinancialGoal {
    id: string;
    name: string;
    type: FinancialGoalType;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    progress: number;
    isAchieved: boolean;
    priority: 'low' | 'medium' | 'high';
    associatedAccounts: string[];
    contributionSchedule?: {
        amount: number;
        frequency: BudgetFrequency;
    };
    createdAt: Date;
    updatedAt: Date;
    recommendations?: string[];
    aiProjectionConfidence: number;
}

export interface AIInsight {
    id: string;
    type: AIInsightType;
    title: string;
    description: string;
    timestamp: Date;
    isRead: boolean;
    actionableItems?: string[];
    relatedTransactionIds?: string[];
    severity: 'info' | 'warning' | 'critical';
    aiModelVersion: string;
}

export interface UserPreferences {
    theme: 'dark' | 'light' | 'system';
    currencySymbol: string;
    dateFormat: string;
    timeZone: string;
    notificationSettings: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    aiRecommendationsEnabled: boolean;
    dataRetentionPolicy: 'standard' | 'extended';
    biometricAuthEnabled: boolean;
    voiceControlEnabled: boolean;
    preferredLanguage: string;
    dashboardLayout: 'compact' | 'detailed' | 'ai_optimized';
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    lastLogin: Date;
    preferences: UserPreferences;
    mfaEnabled: boolean;
    avatarUrl?: string;
    connections?: string[];
    aiScore: number; // Overall user financial health score
}

export interface DeveloperAPIKey {
    id: string;
    key: string;
    name: string;
    scopes: string[];
    isActive: boolean;
    rateLimit: number;
    createdAt: Date;
    lastUsed: Date;
    aiMonitoringLevel: 'low' | 'medium' | 'high';
}

export interface CryptoWallet {
    id: string;
    name: string;
    address: string;
    platform: string;
    assets: {
        symbol: string;
        balance: number;
        usdValue: number;
        blockchain: string;
    }[];
    lastSynced: Date;
    status: 'connected' | 'disconnected' | 'error';
    securityAuditLog: ConnectionAuditLog[];
    aiValuationModel: string;
}


// ================================================================================================
// SVG ICONS & LOGOS: VISUAL IDENTITY FOR THE FINANCIAL WORLD (REMAINS UNCHANGED)
// ================================================================================================
const PlaidLogo = () => <svg width="88" height="34" viewBox="0 0 88 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M82.2 3.82c-3.32 0-5.83 2.5-5.83 5.82 0 3.31 2.51 5.82 5.83 5.82 3.31 0 5.82-2.5 5.82-5.82 0-3.31-2.51-5.82-5.82-5.82Zm0 9.14c-1.87 0-3.32-1.45-3.32-3.32 0-1.87 1.45-3.32 3.32-3.32 1.87 0 3.31-1.45 3.31-3.32 0-1.87-1.44-3.32-3.31-3.32-1.87 0-3.32-1.45-3.32-3.32s1.45-3.32 3.32-3.32 3.31 1.45 3.31 3.32c0 1.87 1.45 3.32 3.32 3.32s3.32-1.45 3.32-3.32-1.45-3.32-3.32-3.32-3.31-1.45-3.31-3.32c0-3.31 2.5-5.82 5.82-5.82s5.82 2.5 5.82 5.82-2.5 5.82-5.82 5.82c-1.87 0-3.32 1.45-3.32 3.31 0 1.87-1.45 3.32-3.32 3.32Z" fill="#fff"></path><path d="M25.86 10.93c0 4.14-3.55 7.4-7.93 7.4-4.39 0-7.94-3.26-7.94-7.4S13.54 3.53 17.93 3.53c4.38 0 7.93 3.26 7.93 7.4Zm-10.45 0c0 1.45 1.12 2.5 2.52 2.5 1.39 0 2.51-1.05 2.51-2.5 0-1.45-1.12-2.5-2.51-2.5-1.4 0-2.52 1.05-2.52 2.5Z" fill="#fff"></path><path d="M49.6 10.93c0 4.14-3.54 7.4-7.93 7.4-4.38 0-7.93-3.26-7.93-7.4S37.29 3.53 41.67 3.53c4.39 0 7.93 3.26 7.93 7.4Zm-10.45 0c0 1.45 1.12 2.5 2.52 2.5 1.4 0 2.52-1.05 2.52-2.5 0-1.45-1.12-2.5-2.52-2.5-1.4 0-2.52 1.05-2.52 2.5Z" fill="#fff"></path><path d="M68.8 3.82c-3.32 0-5.83 2.5-5.83 5.82 0 3.31 2.51 5.82 5.83 5.82 3.31 0 5.82-2.5 5.82-5.82 0-3.31-2.51-5.82-5.82-5.82Zm0 9.14c-1.87 0-3.32-1.45-3.32-3.32 0-1.87 1.45-3.32 3.32-3.32s3.31-1.45 3.31-3.32c0-1.87-1.44-3.32-3.31-3.32-1.87 0-3.32-1.45-3.32-3.32s1.45-3.32 3.32-3.32 3.31 1.45 3.31 3.32c0 1.87 1.45 3.32 3.32 3.32s3.32-1.45 3.32-3.32-1.45-3.32-3.32-3.32-3.31-1.45-3.31-3.32c0-3.31 2.5-5.82 5.82-5.82s5.82 2.5 5.82 5.82-2.5 5.82-5.82 5.82c-1.87 0-3.32 1.45-3.32 3.31 0 1.87-1.45 3.32-3.32 3.32Z" fill="#fff"></path><path d="M25.86 28.33c0 2.2-1.78 3.97-3.97 3.97h-7.93c-2.2 0-3.97-1.77-3.97-3.97v-7.93c0-2.2 1.78-3.97 3.97-3.97h7.93c2.2 0 3.97 1.77 3.97 3.97v7.93Z" fill="#fff"></path><path d="M17.93 25.43c-2.2 0-3.97-1.78-3.97-3.97s1.78-3.97 3.97-3.97 3.97 1.78 3.97 3.97-1.78 3.97-3.97 3.97Z" fill="#0D0F2A"></path><path d="M2.5 18.23c-1.4 0-2.5-1.12-2.5-2.51V2.5C0 1.1 1.1 0 2.5 0s2.5 1.1 2.5 2.5v13.22c0 1.39-1.1 2.51-2.5 2.51Z" fill="#fff"></path></svg>;

// ================================================================================================
// MOCKED PLAID INTEGRATION SERVICE (Enhanced for SFOS Auditing)
// ================================================================================================

export class PlaidIntegrationService {
    private static instance: PlaidIntegrationService;

    private constructor() {}

    public static getInstance(): PlaidIntegrationService {
        if (!PlaidIntegrationService.instance) {
            PlaidIntegrationService.instance = new PlaidIntegrationService();
        }
        return PlaidIntegrationService.instance;
    }

    private logAudit(userId: string, event: string, details: string): ConnectionAuditLog {
        const log: ConnectionAuditLog = {
            timestamp: new Date(),
            event: event,
            details: details,
            aiValidated: Math.random() > 0.1, // 90% chance of AI validation success
            aiConfidenceScore: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)), // Confidence between 0.6 and 1.0
        };
        // In a real system, this would trigger a backend audit service call.
        console.log(`[AUDIT LOGGED] User: ${userId}, Event: ${event}, AI Confidence: ${log.aiConfidenceScore}`);
        return log;
    }

    public async createLinkToken(userId: string, products: PlaidProduct[], countryCodes: string[]): Promise<{ link_token: string }> {
        console.log(`[SFOS CORE] PlaidService: Requesting link token for user ${userId} with products: ${products.join(', ')}`);
        const auditLog = this.logAudit(userId, 'LINK_TOKEN_REQUESTED', `Products: ${products.join(', ')}`);
        
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ link_token: `link-token-sfos-${Date.now()}-${Math.random().toString(16).substring(2, 8)}` });
            }, 300);
        });
    }

    public async exchangePublicToken(publicToken: string, metadata: PlaidLinkSuccessMetadata): Promise<LinkedInstitution> {
        const userId = metadata.user_id || 'unknown_user';
        console.log(`[SFOS CORE] PlaidService: Exchanging public token for item: ${metadata.institution.institution_id}`);
        
        const now = new Date();
        const accounts: FinancialAccount[] = metadata.accounts.map(acc => ({
            id: acc.id,
            institutionId: metadata.institution.institution_id,
            name: acc.name,
            officialName: acc.name,
            mask: acc.mask,
            type: acc.type,
            subtype: acc.subtype,
            currentBalance: Math.floor(Math.random() * 50000) + 100,
            availableBalance: Math.floor(Math.random() * 45000) + 50,
            currency: 'USD',
            isLinked: true,
            isActive: true,
            syncStatus: 'synced',
            lastSyncAttempt: now,
            aiRiskFlag: Math.random() < 0.05, // 5% chance of initial risk flag
        }));

        const aiProfile: AIProfileAnalysis = {
            riskToleranceScore: Math.floor(Math.random() * 100),
            spendingHabitVector: ['stable_income', 'moderate_debt', 'high_savings_potential'].slice(0, Math.floor(Math.random() * 3) + 1),
            predictedNetWorthTrajectory: ['accelerating', 'stagnant', 'decelerating'][Math.floor(Math.random() * 3)] as 'accelerating' | 'stagnant' | 'decelerating',
            suggestedAIProducts: ['Automated Tax Harvesting', 'Dynamic Insurance Rebalancing']
        };

        const newInstitution: LinkedInstitution = {
            id: `item-${Date.now()}-${Math.random().toString(16).substring(2, 6)}`,
            name: metadata.institution.name,
            institutionId: metadata.institution.institution_id,
            accessToken: `access-sfos-${Date.now()}-${Math.random().toString(16).substring(2, 10)}`,
            connectedAccounts: accounts,
            metadata: metadata,
            lastUpdated: now,
            status: 'connected',
            securityAuditLog: [
                this.logAudit(userId, 'item_created', 'Initial connection successful via token exchange.'),
                this.logAudit(userId, 'data_ingestion_start', 'Initial data pull initiated.')
            ],
            aiProfileSummary: aiProfile,
            dataIntegrityScore: Math.floor(Math.random() * 20) + 80, // High integrity score for successful connection
        };

        this.logAudit(userId, 'institution_connected', `Institution ${metadata.institution.name} connected with ${accounts.length} accounts.`);
        return newInstitution;
    }
}


// ================================================================================================
// HIGH-FIDELITY PLAID MODAL & BUTTON (AI-AUGMENTED UI)
// ================================================================================================

const PlaidModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (publicToken: string, metadata: PlaidLinkSuccessMetadata) => void;
    products?: PlaidProduct[];
}> = ({ isOpen, onClose, onSuccess, products = ['transactions'] as PlaidProduct[] }) => {
    const [step, setStep] = useState<'select' | 'connecting' | 'connected' | 'ai_processing'>('select');
    const [selectedBank, setSelectedBank] = useState<typeof banks[0] | null>(null);
    const [aiProcessingMessage, setAiProcessingMessage] = useState<string>('');

    const aiMessages = useMemo(() => [
        "Initializing Quantum Data Stream...",
        "Running 10,000 concurrent risk simulations...",
        "Mapping account structures to SFOS schema...",
        "Applying predictive anomaly detection filters...",
        "Finalizing cryptographic handshake...",
        "Generating initial AI Profile Summary..."
    ], []);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setStep('select');
                setSelectedBank(null);
                setAiProcessingMessage('');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const startAiProcessing = useCallback((bankName: string) => {
        setStep('ai_processing');
        let index = 0;
        
        const interval = setInterval(() => {
            if (index < aiMessages.length) {
                setAiProcessingMessage(aiMessages[index]);
                index++;
            } else {
                clearInterval(interval);
                // Proceed to success simulation after AI processing completes
                setTimeout(() => {
                    setStep('connected');
                }, 1500);
            }
        }, 500);

        // Final success simulation after AI processing UI is done
        setTimeout(() => {
            const mockPublicToken = `public-sfos-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const mockMetadata: PlaidLinkSuccessMetadata = {
                institution: { name: bankName, institution_id: selectedBank!.institution_id },
                accounts: [{ id: `acct_${Math.random().toString(36).substring(7)}`, name: `${bankName} Primary Account`, mask: Math.floor(1000 + Math.random() * 9000).toString(), type: 'depository', subtype: 'checking' }],
                link_session_id: `link-session-${Math.random().toString(36).substring(7)}`,
                products: products,
                user_id: 'user_sfos_session', // Placeholder for actual user ID context
                public_token_id: `pub_tok_${Date.now()}`
            };
            onSuccess(mockPublicToken, mockMetadata);
            
            setTimeout(() => {
                onClose();
            }, 1000); // Close modal shortly after success notification
        }, aiMessages.length * 500 + 1500);

    }, [aiMessages, onSuccess, onClose, selectedBank, products]);


    const handleBankSelect = (bank: typeof banks[0]) => {
        setSelectedBank(bank);
        startAiProcessing(bank.name);
    };

    const renderContent = () => {
        switch (step) {
            case 'ai_processing':
                return (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 mx-auto mb-4">{selectedBank?.logo}</div>
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-cyan-600/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 border-4 border-cyan-400 rounded-full"></div>
                            <div className="absolute inset-0 border-t-4 border-white rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-xl font-bold text-cyan-300 mt-6">AI Orchestration Active</h3>
                        <p className="text-sm text-gray-300 mt-2 h-10 flex items-center justify-center">{aiProcessingMessage}</p>
                        <p className="text-xs text-gray-500 mt-4">Ensuring data sovereignty and integrity.</p>
                    </div>
                );
            case 'connecting': // This step is largely replaced by AI processing for dramatic effect
                return (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 mx-auto mb-4">{selectedBank?.logo}</div>
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>
                            <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mt-6">Establishing Secure Channel...</h3>
                        <p className="text-sm text-gray-400 mt-1">Negotiating cryptographic keys...</p>
                    </div>
                );
            case 'connected':
                return (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center border-4 border-green-500/50">
                            <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-green-400 mt-6">Connection Verified</h3>
                        <p className="text-md text-gray-300 mt-2">Data ingestion pipeline is now active.</p>
                        <p className="text-sm text-gray-500 mt-1">Your financial sovereignty is being established.</p>
                    </div>
                );
            case 'select':
            default:
                return (
                     <div className="p-2">
                         <h3 className="text-xl font-bold text-white mb-1">Institution Selection Matrix</h3>
                         <p className="text-sm text-gray-400 mb-6">Select your financial nexus to initiate the secure linkage protocol.</p>
                         <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {banks.map(bank => (
                                <button key={bank.name} onClick={() => handleBankSelect(bank)} className="w-full flex items-center p-3 bg-gray-700/50 hover:bg-cyan-700/30 border border-gray-700 hover:border-cyan-500 rounded-xl transition-all duration-200 shadow-lg">
                                    <div className="w-6 h-6 flex items-center justify-center mr-3">{bank.logo ? React.cloneElement(bank.logo as React.ReactElement, { className: 'w-full h-full' }) : <span className="text-xs">LOGO</span>}</div>
                                    <span className="ml-2 font-medium text-gray-100 flex-grow text-left">{bank.name}</span>
                                    <span className="text-xs text-cyan-300">Connect &rarr;</span>
                                </button>
                            ))}
                         </div>
                     </div>
                );
        }
    }

    return (
        <div className={`fixed inset-0 bg-gray-950/90 flex items-center justify-center z-50 backdrop-blur-lg transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full border-t-4 border-cyan-500 shadow-[0_0_50px_rgba(0,255,255,0.2)] transform transition-transform duration-500 scale-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
                    <div className="flex items-center space-x-2">
                        <PlaidLogo />
                        <span className="text-lg font-extrabold text-white tracking-wider">SFOS LINKAGE MODULE</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-400 transition-colors text-2xl leading-none p-1">&times;</button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ onSuccess, products }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-xl text-lg font-bold text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 transition-all duration-300 transform hover:scale-[1.01]"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 animate-pulse"><path d="M16.5 10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5Z" fill="#fff"></path><path d="M12.75 10.5c0 2.761-2.239 5-5 5s-5-2.239-5-5 2.239-5 5-5 5 2.239 5 5ZM7.75 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="#fff"></path><path d="M21.25 10.5c0 2.761-2.239 5-5 5s-5-2.239-5-5 2.239-5 5-5 5 2.239 5 5ZM16.25 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="#fff"></path></svg>
                Initiate Sovereign Data Linkage
            </button>
            <PlaidModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={onSuccess} products={products} />
        </>
    );
};

// ================================================================================================
// THE MAIN VIEW: FINANCIAL DEMOCRACY IN ACTION (Hyper-Expanded)
// ================================================================================================

const FinancialDemocracyView: React.FC = () => {
    const [linkedInstitutions, setLinkedInstitutions] = useState<LinkedInstitution[]>([]);
    const plaidService = useRef(PlaidIntegrationService.getInstance());
    const [searchQuery, setSearchQuery] = useState('');
    const [aiStatus, setAiStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // Mock user context

    // Mock User Profile Initialization
    useEffect(() => {
        setUserProfile({
            id: 'user-001-alpha',
            email: 'architect@sfos.io',
            firstName: 'IDGAFAI',
            lastName: 'Architect',
            createdAt: new Date(2023, 0, 1),
            lastLogin: new Date(),
            mfaEnabled: true,
            aiScore: 92,
            preferences: {
                theme: 'dark',
                currencySymbol: '$',
                dateFormat: 'YYYY-MM-DD',
                timeZone: 'UTC',
                notificationSettings: { email: true, push: true, sms: false },
                aiRecommendationsEnabled: true,
                dataRetentionPolicy: 'extended',
                biometricAuthEnabled: true,
                voiceControlEnabled: true,
                preferredLanguage: 'en-US',
                dashboardLayout: 'ai_optimized'
            },
        });
    }, []);

    const handlePlaidSuccess = useCallback(async (publicToken: string, metadata: PlaidLinkSuccessMetadata) => {
        setAiStatus('processing');
        console.log(`[VIEW] Received public token. Initiating server-side exchange for user ${metadata.user_id || 'N/A'}`);
        
        try {
            const newInstitution = await plaidService.current.exchangePublicToken(publicToken, metadata);
            setLinkedInstitutions(prev => {
                // Check if institution already exists (for update mode simulation)
                const existingIndex = prev.findIndex(inst => inst.id === newInstitution.id);
                if (existingIndex > -1) {
                    const updated = [...prev];
                    updated[existingIndex] = newInstitution;
                    return updated;
                }
                return [...prev, newInstitution];
            });
            setAiStatus('complete');
        } catch (error) {
            console.error("Failed to exchange token:", error);
            setAiStatus('idle');
        }
    }, []);

    const filteredInstitutions = useMemo(() => {
        if (!searchQuery) return linkedInstitutions;
        const query = searchQuery.toLowerCase();
        return linkedInstitutions.filter(inst => 
            inst.name.toLowerCase().includes(query) || 
            inst.connectedAccounts.some(acc => acc.name.toLowerCase().includes(query))
        );
    }, [linkedInstitutions, searchQuery]);

    const totalDataIntegrityScore = useMemo(() => {
        if (linkedInstitutions.length === 0) return 0;
        const totalScore = linkedInstitutions.reduce((sum, inst) => sum + inst.dataIntegrityScore, 0);
        return Math.round(totalScore / linkedInstitutions.length);
    }, [linkedInstitutions]);

    const codeSnippet = `
import { PlaidLinkButton, PlaidLinkSuccessMetadata } from './components/FinancialDemocracyView';

// Assume 'userId' is retrieved from the authenticated session context
const userId = 'user-001-alpha'; 

const handleSuccess = (publicToken: string, metadata: PlaidLinkSuccessMetadata) => {
    console.log(\`Link successful for: \${metadata.institution.name}\`);
    
    // 1. Send publicToken to your secure backend server.
    // 2. Backend exchanges it for an Access Token using the Plaid API.
    // 3. Backend stores Access Token securely and initiates data sync.
    
    // Example API Call (Conceptual):
    // api.post('/sfos/link/finalize', { publicToken, userId });
};

const FinancialLinker = () => (
    <div className="p-6 bg-gray-900 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Secure Institution Onboarding</h2>
        <PlaidLinkButton
            onSuccess={handleSuccess}
            products={['transactions', 'assets', 'identity']}
            user={{ client_user_id: userId, email_address: "user@example.com" }}
        />
        <p className="mt-4 text-sm text-gray-500">
            Note: The PlaidLinkButton component handles all client-side token management and security handshakes.
        </p>
    </div>
);
    `;

    const AiStatusIndicator: React.FC<{ status: typeof aiStatus }> = ({ status }) => {
        let colorClass = 'bg-gray-500';
        let text = 'Idle';
        let pulse = '';

        switch (status) {
            case 'processing':
                colorClass = 'bg-yellow-500';
                text = 'Processing AI Ingestion';
                pulse = 'animate-ping';
                break;
            case 'complete':
                colorClass = 'bg-green-500';
                text = 'Data Ingestion Complete';
                break;
            case 'idle':
            default:
                colorClass = 'bg-gray-600';
                text = 'Awaiting Connection';
                break;
        }

        return (
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${colorClass} ${pulse}`}></div>
                <span className="text-sm font-medium text-gray-200">{text}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8 font-sans">
            <header className="mb-10">
                <h1 className="text-5xl font-extrabold text-white tracking-tighter flex items-center">
                    <span className="text-cyan-400 mr-3 text-6xl">&Sigma;</span>
                    Financial Democracy Interface
                </h1>
                <p className="text-xl text-gray-400 mt-2">Module 1.1: Sovereign Data Aggregation Layer</p>
            </header>

            <div className="space-y-10">
                
                {/* Global Status Card */}
                <Card title="System Health & AI Oversight" className="border-l-4 border-cyan-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-800/70 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400">Total Linked Institutions</p>
                            <p className="text-3xl font-bold text-white mt-1">{linkedInstitutions.length}</p>
                        </div>
                        <div className="p-4 bg-gray-800/70 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400">Average Data Integrity Score</p>
                            <p className={`text-3xl font-bold mt-1 ${totalDataIntegrityScore > 85 ? 'text-green-400' : 'text-yellow-400'}`}>{totalDataIntegrityScore}%</p>
                        </div>
                        <div className="p-4 bg-gray-800/70 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-400">AI Ingestion Status</p>
                            <AiStatusIndicator status={aiStatus} />
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Column 1: Live Demo */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card title="Live Demo: Secure Institution Onboarding">
                            <div className="space-y-6">
                                <p className="text-md text-gray-300 border-b border-gray-700 pb-3">
                                    Initiate the connection process. The system will simulate the Plaid handshake, followed by immediate AI analysis of the newly aggregated data structure.
                                </p>
                                <PlaidLinkButton onSuccess={handlePlaidSuccess} products={['transactions', 'assets', 'identity', 'income']} />
                                
                                <div className="pt-4 border-t border-gray-700">
                                    <h4 className="font-bold text-lg text-white mb-3 flex justify-between items-center">
                                        Active Data Nodes ({filteredInstitutions.length})
                                        <div className="relative w-64">
                                            <input
                                                type="text"
                                                placeholder="Filter Nodes..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-1 px-3 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500"
                                            />
                                        </div>
                                    </h4>
                                    {filteredInstitutions.length === 0 && searchQuery.length > 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-6 italic">No nodes match the query criteria. Broaden your search parameters.</p>
                                    ) : filteredInstitutions.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-6 italic">Awaiting first connection. Click the button above to begin.</p>
                                    ) : (
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                                            {filteredInstitutions.map(inst => (
                                                <div key={inst.id} className="p-4 bg-gray-800 rounded-xl border border-cyan-600/50 shadow-lg hover:shadow-cyan-500/20 transition-shadow">
                                                    <div className="flex justify-between items-start">
                                                        <p className="font-extrabold text-xl text-cyan-300">{inst.name}</p>
                                                        <span className={`text-xs font-mono px-2 py-1 rounded-full ${inst.status === 'connected' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                            {inst.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-1">Accounts: {inst.connectedAccounts.map(a => `${a.name} (${a.mask})`).join(' | ')}</p>
                                                    <div className="mt-3 pt-2 border-t border-gray-700 flex justify-between text-xs text-gray-400">
                                                        <span>Integrity: <span className="font-bold text-white">{inst.dataIntegrityScore}%</span></span>
                                                        <span>AI Risk Flagged: {inst.aiProfileSummary.riskToleranceScore > 75 ? 'High' : 'Low'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Column 2: Implementation & AI Insights */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card title="Implementation Blueprint (100x Scale)">
                            <p className="text-sm text-gray-400 mb-4">The core integration logic, designed for massive scalability and immediate AI feedback loops.</p>
                            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-inner">
                                <div className="p-3 bg-gray-800 text-xs text-cyan-400 font-mono flex justify-between">
                                    <span>FinancialDemocracyView.tsx</span>
                                    <span className='text-gray-500'>// SFOS Core</span>
                                </div>
                                <pre className="p-4 text-xs text-white overflow-x-auto max-h-80">
                                    <code>
                                        {codeSnippet.trim()}
                                    </code>
                                </pre>
                            </div>
                        </Card>

                        <Card title="AI Profile Generation Summary">
                            <p className="text-sm text-gray-400 mb-4">Upon successful linkage, the AI engine generates a sovereign profile for immediate strategic planning.</p>
                            {linkedInstitutions.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-800 rounded-lg border border-green-600/50">
                                        <p className="font-semibold text-green-300">Latest Profile Analysis:</p>
                                        <p className="text-xs text-gray-300 mt-1">Risk Score: <span className='font-bold'>{linkedInstitutions[0].aiProfileSummary.riskToleranceScore}</span>/100</p>
                                        <p className="text-xs text-gray-300 mt-1">Trajectory: <span className='font-bold text-yellow-300'>{linkedInstitutions[0].aiProfileSummary.predictedNetWorthTrajectory.toUpperCase()}</span></p>
                                        <p className="text-xs text-gray-500 mt-2">Suggested Actions: {linkedInstitutions[0].aiProfileSummary.suggestedAIProducts.join(', ')}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                                        (Showing analysis for the most recently connected institution.)
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic p-4 bg-gray-800 rounded-lg">
                                    Profile generation awaits connection.
                                </p>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialDemocracyView;