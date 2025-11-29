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
    // ai_signature: string; // Removed: AI signature is not a core user identity field.
    // biometric_hash: string; // Removed: Biometric data should be handled by a dedicated security module and not stored directly in user profiles.
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
    // tax_id_hash: string; // Removed: Sensitive tax IDs should be managed via a secure vault/secrets manager and not directly in type definitions.
    director_ids: EntityID[];
    governance_agent_id: EntityID;
    asset_portfolio_id: string; // This should likely be a more specific reference or ID, e.g., PortfolioID
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
    // metadata_hash: string; // Removed: Metadata should be stored and referenced securely, not hashed directly in type definition.
    volatility_index: number;
    standard: string; // e.g., ERC20, ISIN
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
    target_asset_type: AssetType; // Renamed for clarity
    target_amount: number;
    current_amount: number;
    target_date: Date;
    state: GoalState;
    strategy: 'Aggressive' | 'Conservative' | 'Balanced' | 'Adaptive';
    dependencies: EntityID[]; // IDs of other goals or assets this goal depends on
    risk_tolerance: 'Low' | 'Medium' | 'High';
    advisor_logs: string[]; // Logs from financial advisors or AI
}
```

### 5. AI Integration

```typescript
// AIL-001: Agent Registry
export interface AgentRegistry {
    agent_id: EntityID;
    name: string;
    function: 'Trading' | 'Compliance' | 'Advisory' | 'Security' | 'Analytics' | 'Orchestration'; // Added Orchestration
    version: number;
    // metrics_hash: string; // Removed: Metrics should be managed by a monitoring system.
    permissions: number; // Bitmask for permissions
    is_autonomous: boolean;
}

// AIL-002: AI Parameters
export interface AIModelParams {
    model_name: string; // Added for clarity on which model is used
    architecture: string;
    context_window: number;
    latency_target: number; // in ms
    constraints_version: string;
    explainability_score: number; // A score indicating how explainable the model's output is.
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