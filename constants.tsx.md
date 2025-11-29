// This file contains basic constants for a stable financial system MVP.
// All imports are assumed to be available from the existing context (e.g., React, SVG components, etc.).

// --- START OF CORE ARCHITECTURAL DEFINITIONS ---

/**
 * This file defines basic, stable constants and parameters for the Minimum Viable Product (MVP) scope.
 * Overly complex or aspirational views have been removed to focus on core stability and functionality.
 */

// =================================================================================================
// 1. ENUMERATIONS AND TYPE DEFINITIONS (Basic Definitions)
// =================================================================================================

/**
 * Defines basic navigational views for the core application MVP.
 */
export enum View {
    // Core Financial Operations
    Dashboard = 'DASHBOARD',
    Transactions = 'TRANSACTIONS',
    Payments = 'PAYMENTS',
    Budgeting = 'BUDGETING',

    // Wealth Management & Intelligence
    Investments = 'INVESTMENTS',
    Reports = 'REPORTS',
    AIIntelligence = 'AI_INTELLIGENCE',

    // Infrastructure & User Management
    SystemStatus = 'SYSTEM_STATUS',
    Settings = 'SETTINGS',
}

/**
 * Defines the operational status codes for system components.
 */
export enum SystemStatus {
    OPERATIONAL = 'OP_OK',
    DEGRADED_PERFORMANCE = 'PERF_DEGRADED',
    MAINTENANCE_SCHEDULED = 'MAINT_SCHEDULED',
    CRITICAL_FAILURE = 'CRIT_FAIL',
    // Removed AI_OVERRIDE_ACTIVE: Focus on stable, deterministic system status reports.
}

// =================================================================================================
// 2. NAVIGATION CONSTANTS (Navigation Items)
// =================================================================================================

/**
 * This array defines the basic navigation items for the MVP application scope.
 * NOTE: Views related to advanced financial instruments, crypto, deep infrastructure
 * or excessive AI features have been temporarily archived to ensure a stable MVP focus.
 */
export const NAV_ITEMS = [
    // Core Financial Operations
    { id: View.Dashboard, label: 'Dashboard', icon: <DashboardIcon />, description: 'Unified financial overview and key metrics.' },
    { id: View.Transactions, label: 'Transaction Ledger', icon: <TransactionsIcon />, description: 'Verified history and categorization of all financial movements.' },
    { id: View.Payments, label: 'Payments & Transfers', icon: <PaymentsIcon />, description: 'Secure internal and external fund transfers and bill payments.' },
    { id: View.Budgeting, label: 'Budgeting & Spending', icon: <BudgetingIcon />, description: 'Track and manage spending limits and forecast future cash flow.' },

    // Wealth Management & Intelligence
    { id: View.Investments, label: 'Investments', icon: <InvestmentsIcon />, description: 'View, track, and manage investment portfolios (e.g., stocks, bonds).' },
    { id: View.Reports, label: 'Financial Reports', icon: <ReportsIcon />, description: 'Generate comprehensive financial statements and performance metrics.' },
    { id: View.AIIntelligence, label: 'AI Intelligence', icon: <AIIntelligenceIcon />, description: 'Access AI-driven insights, alerts, and transaction categorization.' },

    // Infrastructure & User Management
    { id: View.SystemStatus, label: 'System Health', icon: <SystemStatusIcon />, description: 'Real-time performance metrics and API health monitoring.' },
    { id: View.Settings, label: 'Profile & Security', icon: <SettingsIcon />, description: 'Manage user profile, authentication settings, and API access.' },
];

// =================================================================================================
// 3. SYSTEM PARAMETERS AND CONFIGURATION CONSTANTS
// =================================================================================================

/**
 * Global System Configuration Constants. These define basic operational settings for the MVP.
 */
export const SYSTEM_CONFIG = {
    // Security & Identity
    MIN_PASSWORD_LENGTH: 12, // Standard length requirement (replaces arbitrary score)
    SESSION_TIMEOUT_SECONDS: 1800, // 30 minutes standard session for stability
    MFA_REQUIRED_THRESHOLD_USD: 1000, // Mandatory MFA above this transaction value
    // Removed Quantum key rotation. KMS key management is handled at the infrastructure layer.

    // Transaction & Settlement
    MAX_INSTANT_TRANSFER_LIMIT_USD: 50000, // Safe, conservative limit for initial MVP transfers
    DEFAULT_FEE_RATE_PERCENT: 0.005, // 0.5% standard transactional fee
    MAX_TRANSACTION_LATENCY_MS: 150, // Acceptable latency target for ledger confirmation

    // AI & Modeling
    AI_MODEL_VERSION: 'FIN-INTELLIGENCE-V1.2', // Current deployed AI model version (Simplified Name)
    PREDICTION_HORIZON_DAYS: 365, // Default lookahead for budgeting and alerts (1 year)
    // Removed Agent Deployment Quota: Autonomous agents are scoped out of the MVP.

    // UI/UX Constants
    PRIMARY_COLOR_HEX: '#06b6d4', // Cyan of clear thought
    SECONDARY_COLOR_HEX: '#1e293b', // Deep slate for contrast
    FONT_FAMILY_PRIMARY: 'Inter, "System Default"',
    FONT_FAMILY_MONOSPACE: 'Fira Code, Consolas',
};

// =================================================================================================
// 4. THEME DEFINITION (Theme Definition)
// =================================================================================================

/**
 * A basic visual palette for the application, standardized for stability.
 */
export const AppTheme = {
    colors: {
        // Primary Spectrum (Clarity and Action)
        primary: {
            DEFAULT: SYSTEM_CONFIG.PRIMARY_COLOR_HEX, // #06b6d4 - Primary color
            light: '#67e8f9',
            dark: '#0e7490',
        },
        // Secondary Spectrum (Foundation and Security)
        secondary: {
            DEFAULT: SYSTEM_CONFIG.SECONDARY_COLOR_HEX, // #1e293b - Secondary color
            light: '#475569',
            dark: '#0f172a',
        },
        // Status Indicators
        status: {
            success: '#10b981', // Emerald Green (Transaction Confirmed)
            warning: '#f59e0b', // Amber (Risk Threshold Approaching)
            error: '#ef4444', // Crimson (Critical Failure/Security Alert)
            info: '#3b82f6', // Sapphire Blue (System Update/Guidance)
        },
        // Data Visualization Tints (Simplified palette for stability)
        dataViz: {
            alpha: '#3b82f6', // Blue
            beta: '#10b981', // Green
            gamma: '#f59e0b', // Yellow
        },
        // Text and Background
        text: {
            primary: '#f8fafc', // Near White for high contrast
            secondary: '#cbd5e1', // Light Gray for secondary information
            inverse: '#020617', // Near Black for dark mode text
        },
        background: {
            default: '#0f172a', // Deep Space Black (Primary Dark Mode Background)
            surface: '#1e293b', // Slightly lighter surface for cards/modals
            elevated: '#334155', // For floating elements
        }
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px',
    }
};

// =================================================================================================
// 5. ICON DEFINITIONS (Icon Definitions)
// NOTE: Only icons required for the MVP navigation scope are retained.
// =================================================================================================

// Placeholder for DashboardIcon
function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Standard Dashboard icon: Grid view */}
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
            <circle cx="15" cy="6" r="1" fill="currentColor" />
        </svg>
    );
}

// Placeholder for TransactionsIcon (Ledger/History)
function TransactionsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Icon representing a list or ledger */}
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="7" y1="14" x2="17" y2="14" />
            <line x1="7" y1="18" x2="13" y2="18" />
        </svg>
    );
}

// Placeholder for PaymentsIcon (Send Money/Transfers)
function PaymentsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Icon representing fast transfer/arrow */}
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    );
}

// Placeholder for BudgetingIcon
function BudgetingIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Icon representing balanced measures/limits */}
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="7" x2="9" y2="17" />
            <line x1="15" y1="7" x2="15" y2="17" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="3" y1="14" x2="21" y2="14" />
        </svg>
    );
}

// Placeholder for InvestmentsIcon
function InvestmentsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Icon representing charts/growth */}
            <polyline points="22 12 18 12 15 21 9 3 2 12" />
        </svg>
    );
}

// Placeholder for ReportsIcon (General Reporting)
function ReportsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Icon representing a document with a chart */}
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <polyline points="10 13 14 13 14 17" />
            <line x1="7" y1="17" x2="17" y2="17" />
        </svg>
    );
}

// Placeholder for AIIntelligenceIcon
function AIIntelligenceIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Icon representing a brain/cog */}
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 8v4M12 16h.01" />
            <circle cx="12" cy="12" r="6" />
        </svg>
    );
}

// Placeholder for SystemStatusIcon (API Status)
function SystemStatusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Icon representing API health monitoring (speedometer/gauge) */}
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16V12M12 12H8" />
            <path d="M12 2v2M20 12h-2M12 20v2M4 12h2" />
        </svg>
    );
}

// Placeholder for SettingsIcon (Profile and Security)
function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Icon representing a gear/cog */}
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9.4 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9.4a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 12 4.09V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09A1.65 1.65 0 0 0 19.4 15z" />
        </svg>
    );
}

// =================================================================================================
// 6. AI CONSTANTS AND METADATA
// =================================================================================================

/**
 * Constants governing basic AI interaction for transaction intelligence and insights.
 */
export const AI_CONSTANTS = {
    // Core AI Parameters
    INFERENCE_COST_PER_QUERY_ESTIMATE: 0.00005, // Cost estimate for basic categorization
    MAX_RECURSION_DEPTH: 5, // Safety limit for iterative AI tasks
    SAFETY_GUARDRAIL_VERSION: 'V1.0-STABLE', // Version of the safety constraints

    // Data Feed Priority (Simplified for MVP focus on core data)
    DATA_FEED_PRIORITY_WEIGHTS: {
        INTERNAL_LEDGER: 0.70,
        MARKET_DATA: 0.20,
        SOCIAL_SENTIMENT: 0.10,
    },
};

// =================================================================================================
// 7. REGULATORY AND COMPLIANCE CONSTANTS
// =================================================================================================

/**
 * Defines the jurisdictional constants required for global operation.
 */
export const JURISDICTION_CONSTANTS = {
    // Primary Operating Jurisdiction (For legal anchoring)
    PRIMARY_JURISDICTION_CODE: 'US-DELAWARE', // Simplified to a stable US anchor for MVP
    GLOBAL_COMPLIANCE_STANDARD: 'ISO-27001-2022-COMPLIANT', // Standardized nomenclature

    // AML/KYC Tiers
    KYC_TIER_LEVELS: {
        BASIC: 1,
        ENHANCED: 2,
    },
    AML_THRESHOLD_DAILY_USD: 5000, // Reduced threshold for stricter MVP monitoring
    
    // Data Residency Zones (Crucial for GDPR/CCPA compliance)
    DATA_RESIDENCY_ZONES: [
        { code: 'EU-CORE', name: 'European Union Core', compliance: 'GDPR' },
        { code: 'US-EAST', name: 'US Eastern Seaboard', compliance: 'CCPA' },
    ],
};

// =================================================================================================
// 8. INFRASTRUCTURE AND PARTNER CONSTANTS (External Dependencies Mapping)
// =================================================================================================

/**
 * Configuration mapping for critical external service providers (Simplified to MVP dependencies).
 */
export const INFRASTRUCTURE_MAP = {
    DATA_AGGREGATION_SYNC_VERSION: 'v4.5.0', // Plaid/Yodlee equivalent
    PAYMENTS_API_KEY_ALIAS: 'PAYMENTS_PROD_001', // Stripe/Adyen equivalent
    SSO_PROVIDER_URL: 'https://auth.sovereign.io/oauth2/authorize', // Standardized OAuth2 flow
    SYSTEM_HEALTH_API_BASE: '/telemetry/v1/status',
};

// =================================================================================================
// END OF FILE
// =================================================================================================