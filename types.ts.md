# Type Definitions: `types.ts`

This file defines the core data structures and types for the Financial Operating System. It establishes the schema for identity, transactions, assets, and operational constructs within the application.

## Core Identity Structures

### 1. Identity Definitions

```typescript
// ID-001: Unique Identifier
// Standard UUIDv7 or hash for identifying entities and users.
export type EntityID = string;

// ID-002: User Profile
export interface UserProfile {
    user_id: EntityID;
    username: string;
    public_key: string; // Public key for secure communication
    ai_signature: string; // Signature from the assigned AI agent
    biometric_hash: string; // Secure anchor for biometric verification
    created_at: Date;
    last_active: Date;
    access_level: 'User' | 'Admin' | 'System' | 'Auditor';
    reputation_score: number;
}

// ID-003: Corporate Entity
export interface CorporateEntity {
    entity_id: EntityID;
    legal_name: string;
    jurisdiction: string;
    tax_id_hash: string;
    director_ids: EntityID[];
    governance_agent_id: EntityID;
    asset_portfolio_id: string;
    status: 'Active' | 'Staged' | 'Archived' | 'Suspended';
}
```

### 2. Transaction Primitives

```typescript
// TP-001: Transaction Record
export interface TransactionRecord {
    tx_id: EntityID;
    timestamp: Date;
    sender_id: EntityID;
    recipient_id: EntityID;
    amount: number;
    currency_code: string;
    asset_type: AssetType;
    category: TransactionCategory;
    memo: string; // Encrypted memo
    risk_assessment: {
        score: number;
        model_version: string;
        flags: string[];
    };
    blockchain_ref: string | null;
    contract_id: string | null;
}

// TP-002: Transaction Categories
export enum TransactionCategory {
    InternalTransfer = 'INT_XFER',
    ExternalPayment = 'EXT_PAY',
    InvestmentPurchase = 'INV_BUY',
    InvestmentSale = 'INV_SELL',
    LoanDisbursement = 'LOAN_DSB',
    LoanRepayment = 'LOAN_RPT',
    DividendPayout = 'DIV_PAY',
    FeeCollection = 'FEE_COLL',
    ServiceCharge = 'SVC_CHG',
    Settlement = 'SETTLE',
    ComplexOperation = 'OP_COMPLEX',
}
```

### 3. Asset Ontology

```typescript
// AO-001: Asset Types
export enum AssetType {
    FiatDigital = 'F_DIG',
    Stablecoin = 'S_COIN',
    CryptoAsset = 'C_ASSET',
    RealEstate = 'R_EST',
    Equity = 'EQ_TY',
    VentureUnit = 'VC_UNIT',
    Commodity = 'COMM',
    IntellectualProperty = 'IP_UNIT',
    License = 'LIC',
    GovernmentBond = 'GOV_BOND',
    NFT = 'NFT',
    DataStream = 'DATA',
    CarbonCredit = 'CARB',
    ComputeCredit = 'COMP',
    Stock = 'STOCK',
    Derivative = 'DERIV',
}

// AO-002: Asset Definition
export interface Asset {
    asset_id: EntityID;
    type: AssetType;
    name: string;
    ticker: string;
    valuation: number;
    ownership_percent: number;
    custodian_id: EntityID;
    metadata_hash: string;
    volatility_index: number;
    standard: string;
}
```

## Operational Constructs

### 4. Financial Goals

```typescript
// FGE-001: Goal States
export enum GoalState {
    Draft = 'DRAFT',
    Analyzing = 'ANALYZING',
    Active = 'ACTIVE',
    Completed = 'COMPLETED',
    Paused = 'PAUSED',
    Review = 'REVIEW',
}

// FGE-002: Goal Definition
export interface FinancialGoal {
    goal_id: EntityID;
    name: string;
    target_asset: AssetType;
    target_amount: number;
    current_amount: number;
    target_date: Date;
    state: GoalState;
    strategy: 'Aggressive' | 'Conservative' | 'Balanced' | 'Adaptive';
    dependencies: EntityID[];
    risk_tolerance: 'Low' | 'Medium' | 'High';
    advisor_logs: string[];
}
```

### 5. AI Integration

```typescript
// AIL-001: Agent Registry
export interface AgentRegistry {
    agent_id: EntityID;
    name: string;
    function: 'Trading' | 'Compliance' | 'Advisory' | 'Security' | 'Analytics';
    version: number;
    metrics_hash: string;
    permissions: number;
    is_autonomous: boolean;
}

// AIL-002: AI Parameters
export interface AIModelParams {
    architecture: string;
    context_window: number;
    latency_target: number;
    constraints_version: string;
    explainability_score: number;
}
```

## Navigation and System State

### 6. System Views

```typescript
export type ViewKey = 
    | 'Dashboard' 
    | 'Transactions' 
    | 'SendMoney' 
    | 'Budgets' 
    | 'FinancialGoals' 
    | 'CreditHealth' 
    | 'Investments' 
    | 'CryptoWeb3' 
    | 'AlgoTrading' 
    | 'Forex' 
    | 'Commodities' 
    | 'RealEstate' 
    | 'Collectibles' 
    | 'Derivatives' 
    | 'VentureCapital' 
    | 'PrivateEquity' 
    | 'TaxOptimization' 
    | 'LegacyPlanning' 
    | 'Corporate' 
    | 'Treasury' 
    | 'Cards' 
    | 'DataNetwork' 
    | 'Payments' 
    | 'Settings' 
    | 'AIAdvisor' 
    | 'AgentMarketplace' 
    | 'AdStudio' 
    | 'OpenBanking' 
    | 'APIStatus' 
    | 'Concierge' 
    | 'Philanthropy' 
    | 'WealthSim' 
    | 'Security' 
    | 'Profile'
    | 'ResourceAllocation'
    | 'Forecasting'
    | 'AuditTrail'
    | 'Governance'
    | 'DataFabric'
    | 'AuthMatrix'
    | 'LegalAutomation'
    | 'SupplyChain'
    | 'Education'
    | 'KeyManagement'
    | 'Privacy'
    | 'NetworkHealth'
    | 'RiskManagement';