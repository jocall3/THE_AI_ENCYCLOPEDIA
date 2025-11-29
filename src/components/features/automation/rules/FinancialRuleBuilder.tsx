import React, { useState, useCallback, useMemo } from 'react';
import { PlusCircle, Trash2, ArrowRight, X, Zap, Settings, DollarSign, ListChecks, Bell, Tag, Banknote, Cpu, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

// =============================================================================
// 1. BASIC TYPES (Standard definitions)
// =============================================================================

// --- Architectural Note ---
// The previous structure relied on simple IDs. We are maintaining this for frontend state management,
// but in a production system, these IDs would be replaced by backend UUIDs/Timestamps upon persistence.
type Id = string;
type RuleExecutionStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ERROR';
type RulePriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // 10 being highest priority

// --- IF Conditions (Simple value comparisons) ---
type ConditionSubject = 'transaction_amount' | 'category' | 'merchant' | 'account' | 'day_of_week' | 'time_of_day' | 'transaction_type' | 'ai_sentiment_score' | 'metadata_key';
type ConditionOperator = 'is' | 'is_not' | 'greater_than' | 'less_than' | 'contains' | 'starts_with' | 'ends_with' | 'is_between' | 'matches_regex';

interface Condition {
  id: Id;
  subject: ConditionSubject;
  operator: ConditionOperator;
  value: any;
  metadata?: { [key: string]: any }; // Extra data (kept for future expansion but unused in MVP logic)
}

// --- THEN Actions (Simple effects) ---
type ActionType = 'transfer_money' | 'send_notification' | 'categorize_as' | 'add_tag' | 'execute_external_api' | 'adjust_budget' | 'trigger_alert' | 'log_event';

interface Action {
  id: Id;
  type: ActionType;
  parameters: { [key: string]: any };
  executionOrder: number; // Order of operations (Re-sequenced on update)
}

// --- The Rule Structure (Data model) ---
interface Rule {
  id: string;
  name: string;
  description: string;
  priority: RulePriority;
  conditions: Condition[];
  conditionLogic: 'AND' | 'OR';
  actions: Action[];
  isEnabled: boolean;
  status: RuleExecutionStatus;
  lastExecuted: string | null;
  executionCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// 2. MOCK DATA (Static test values - Represents configuration loaded from a persistent store)
// =============================================================================

// These lists would typically be loaded via configuration endpoints in a real system.
const MOCK_CATEGORIES = ['Groceries', 'Dining Out', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'Income', 'Transfers', 'Investment_Buy', 'Subscription_Service'];
const MOCK_ACCOUNTS = ['Primary Checking (0012)', 'High-Yield Savings (9876)', 'Corporate Credit Card (VISA)', 'Brokerage Account'];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_OF_DAY_OPTIONS = ['Morning (6am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-10pm)', 'Night (10pm-6am)'];
const TRANSACTION_TYPES = ['DEBIT', 'CREDIT', 'FEE', 'INTEREST'];

// =============================================================================
// 3. UI HELPERS (Standardized Tailwind Components for consistency)
// =============================================================================

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<BaseInputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col w-full">
    {label && <label className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">{label}</label>}
    <input 
        {...props} 
        className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition duration-150 ease-in-out shadow-sm disabled:bg-gray-100 dark:disabled:bg-gray-700 ${className}`} 
    />
  </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className = '', ...props }) => (
  <div className="relative w-full">
    <select 
        {...props} 
        className={`appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition duration-150 ease-in-out shadow-sm cursor-pointer ${className}`}
    >
        {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <ArrowRight size={14} className="transform rotate-90" />
    </div>
  </div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
  <button 
    {...props} 
    className={`px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 ease-in-out shadow-md hover:shadow-lg ${className}`}
  >
    {children}
  </button>
);

const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
    <button 
        {...props} 
        className={`p-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${className}`}
    >
        {children}
    </button>
);

const ToggleSwitch: React.FC<{ checked: boolean, onChange: (checked: boolean) => void, label: string }> = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`${
                checked ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
            <span
                aria-hidden="true"
                className={`${
                    checked ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    </div>
);

// =============================================================================
// 4. STATIC MAPPINGS (Hardcoded configuration)
// =============================================================================

const OPERATORS_BY_SUBJECT: Record<ConditionSubject, ConditionOperator[]> = {
    transaction_amount: ['greater_than', 'less_than', 'is', 'is_between'],
    category: ['is', 'is_not', 'contains'],
    merchant: ['contains', 'is', 'starts_with', 'ends_with', 'matches_regex'],
    account: ['is', 'is_not'],
    day_of_week: ['is'],
    time_of_day: ['is'],
    transaction_type: ['is', 'is_not'],
    ai_sentiment_score: ['greater_than', 'less_than', 'is_between'], // Simple float value
    metadata_key: ['is', 'contains'],
};

const SUBJECT_CONFIG: Record<ConditionSubject, { label: string, icon: React.ElementType, inputType: 'text' | 'number' | 'select' }> = {
    transaction_amount: { label: 'Transaction Amount', icon: DollarSign, inputType: 'number' },
    category: { label: 'Transaction Category', icon: ListChecks, inputType: 'select' },
    merchant: { label: 'Merchant Name', icon: Tag, inputType: 'text' },
    account: { label: 'Account Used', icon: Banknote, inputType: 'select' },
    day_of_week: { label: 'Day of Week', icon: Zap, inputType: 'select' },
    time_of_day: { label: 'Time of Day', icon: Zap, inputType: 'select' },
    transaction_type: { label: 'Transaction Type', icon: AlertTriangle, inputType: 'select' },
    ai_sentiment_score: { label: 'Sentiment Score', icon: Cpu, inputType: 'number' },
    metadata_key: { label: 'Metadata Key/Value', icon: Settings, inputType: 'text' },
};

const ACTION_CONFIG: Record<ActionType, { label: string, icon: React.ElementType, defaultParams: () => { [key: string]: any } }> = {
    transfer_money: { 
        label: 'Transfer Money', 
        icon: DollarSign, 
        defaultParams: () => ({ fromAccount: MOCK_ACCOUNTS[0], toAccount: MOCK_ACCOUNTS[1], amount: 10.00, memo: 'Transfer' }) 
    },
    categorize_as: { 
        label: 'Categorize Transaction', 
        icon: ListChecks, 
        defaultParams: () => ({ category: MOCK_CATEGORIES[0] }) 
    },
    add_tag: { 
        label: 'Add Tag', 
        icon: Tag, 
        defaultParams: () => ({ tag: '#Tag', applyTo: 'Transaction' }) 
    },
    send_notification: { 
        label: 'Send Notification', 
        icon: Bell, 
        defaultParams: () => ({ message: 'Rule triggered.', recipient: 'Admin' }) 
    },
    execute_external_api: {
        label: 'Call External API (Webhook)',
        icon: Cpu,
        defaultParams: () => ({ endpoint: 'https://api.example.com/webhook', payload: {}, method: 'POST' })
    },
    adjust_budget: {
        label: 'Adjust Budget',
        icon: ShieldCheck,
        defaultParams: () => ({ budgetName: 'Monthly Spending', adjustmentType: 'ADD', amount: 50.00 })
    },
    trigger_alert: {
        label: 'Trigger Alert',
        icon: AlertTriangle,
        defaultParams: () => ({ severity: 'CRITICAL', alertCode: 'RULE_HIGH_PRIORITY' })
    },
    log_event: {
        label: 'Log Event',
        icon: Loader2,
        defaultParams: () => ({ eventType: 'RULE_EXECUTION', details: 'Rule processed successfully.' })
    }
};

// =============================================================================
// 5. CHILD COMPONENTS (Row renderers)
// Refactored for cleaner Tailwind usage and stability.
// =============================================================================

interface ConditionRowProps {
  condition: Condition;
  onUpdate: (id: Id, field: keyof Condition, value: any) => void;
  onRemove: (id: Id) => void;
}

const ConditionRow: React.FC<ConditionRowProps> = React.memo(({ condition, onUpdate, onRemove }) => {
    const availableOperators = OPERATORS_BY_SUBJECT[condition.subject] || [];
    const subjectConfig = SUBJECT_CONFIG[condition.subject];

    const handleSubjectChange = (newSubject: ConditionSubject) => {
        const newOperators = OPERATORS_BY_SUBJECT[newSubject];
        onUpdate(condition.id, 'subject', newSubject);
        // Reset operator if the new subject doesn't support the old operator
        if (!newOperators.includes(condition.operator)) {
            onUpdate(condition.id, 'operator', newOperators[0] as ConditionOperator);
        }
    };

    // Memoize input rendering for performance
    const renderValueInput = useMemo(() => {
        const commonProps = {
            value: condition.value === undefined || condition.value === null ? '' : condition.value,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                let val: any = e.target.value;
                if (subjectConfig.inputType === 'number') {
                    val = parseFloat(val);
                    if (isNaN(val)) val = ''; // Allow empty string for input fields while user is typing
                }
                onUpdate(condition.id, 'value', val);
            }
        };

        switch (condition.subject) {
            case 'transaction_amount':
            case 'ai_sentiment_score':
                return <Input type="number" step={condition.subject === 'ai_sentiment_score' ? "0.01" : "0.01"} placeholder={condition.subject === 'ai_sentiment_score' ? "-1.00 to 1.00" : "e.g., 50.00"} {...commonProps} />;
            
            case 'category':
                return (
                    <Select value={commonProps.value} onChange={commonProps.onChange}>
                        <option value="" disabled>Select Category...</option>
                        {MOCK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                );
            case 'account':
                return (
                     <Select value={commonProps.value} onChange={commonProps.onChange}>
                        <option value="" disabled>Select Account...</option>
                        {MOCK_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc.split('(')[0].trim()}</option>)}
                    </Select>
                );
            case 'day_of_week':
                 return (
                     <Select value={commonProps.value} onChange={commonProps.onChange}>
                        <option value="" disabled>Select Day...</option>
                        {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                    </Select>
                );
            case 'time_of_day':
                 return (
                     <Select value={commonProps.value} onChange={commonProps.onChange}>
                        <option value="" disabled>Select Time Window...</option>
                        {TIME_OF_DAY_OPTIONS.map(time => <option key={time} value={time}>{time}</option>)}
                    </Select>
                );
            case 'transaction_type':
                 return (
                     <Select value={commonProps.value} onChange={commonProps.onChange}>
                        <option value="" disabled>Select Type...</option>
                        {TRANSACTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </Select>
                );
            case 'merchant':
            case 'metadata_key':
            default:
                return <Input type="text" placeholder={condition.subject === 'metadata_key' ? "Key=Value or Key:Contains" : "e.g., Amazon"} {...commonProps} />;
        }
    }, [condition.id, condition.value, condition.subject, subjectConfig.inputType, onUpdate]);

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-200">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
                {/* Subject Selector */}
                <Select value={condition.subject} onChange={(e) => handleSubjectChange(e.target.value as ConditionSubject)}>
                    {Object.entries(SUBJECT_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                    ))}
                </Select>
                
                {/* Operator Selector */}
                <Select value={condition.operator} onChange={(e) => onUpdate(condition.id, 'operator', e.target.value as ConditionOperator)}>
                    {availableOperators.map(op => <option key={op} value={op}>{op.replace(/_/g, ' ')}</option>)}
                </Select>
                
                {/* Value Input */}
                <div className="col-span-1">
                    {renderValueInput}
                </div>
            </div>
            
            <IconButton onClick={() => onRemove(condition.id)} aria-label="Remove condition" className="flex-shrink-0">
                <Trash2 size={18} />
            </IconButton>
        </div>
    );
});

interface ActionRowProps {
  action: Action;
  onUpdate: (id: Id, field: keyof Action, value: any) => void;
  onParameterUpdate: (id: Id, paramKey: string, value: any) => void;
  onRemove: (id: Id) => void;
}

const ActionRow: React.FC<ActionRowProps> = React.memo(({ action, onUpdate, onParameterUpdate, onRemove }) => {
    const actionConfig = ACTION_CONFIG[action.type];
    
    const handleTypeChange = (newType: ActionType) => {
        // When type changes, reset parameters to default for the new type
        const defaultParams = ACTION_CONFIG[newType].defaultParams();
        onUpdate(action.id, 'type', newType);
        // Note: onUpdate is expected to handle setting the parameters, but we ensure default params are ready for downstream state update.
    };

    const renderParameterInputs = useMemo(() => {
        const commonParamUpdate = (paramKey: string, value: any) => {
            // Type coercion for financial/numeric fields
            if (paramKey === 'amount' && typeof value === 'string') {
                value = parseFloat(value);
                if (isNaN(value) || value < 0) value = 0; // Ensure amount is a non-negative number
            }
            onParameterUpdate(action.id, paramKey, value);
        };

        switch (action.type) {
            case 'transfer_money':
                return (
                    <div className="flex flex-wrap items-center gap-3 p-2 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex-grow">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">FROM:</span>
                        <Select value={action.parameters.fromAccount || ''} onChange={(e) => commonParamUpdate('fromAccount', e.target.value)} className="!text-xs w-32 sm:w-36">
                            {MOCK_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc.split('(')[0].trim()}</option>)}
                        </Select>
                        <ArrowRight size={14} className="text-indigo-500 hidden sm:inline" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">TO:</span>
                        <Select value={action.parameters.toAccount || ''} onChange={(e) => commonParamUpdate('toAccount', e.target.value)} className="!text-xs w-32 sm:w-36">
                           {MOCK_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc.split('(')[0].trim()}</option>)}
                        </Select>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">AMT:</span>
                        <Input type="number" step="0.01" placeholder="Amount" value={action.parameters.amount || ''} onChange={(e) => commonParamUpdate('amount', e.target.value)} className="w-20 !p-1 !text-xs" />
                    </div>
                );
            case 'categorize_as':
                return (
                    <div className="flex-grow flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Category:</span>
                        <Select value={action.parameters.category || ''} onChange={(e) => commonParamUpdate('category', e.target.value)} className="flex-grow sm:flex-grow-0 sm:w-48">
                            <option value="" disabled>Select Target Category...</option>
                            {MOCK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </Select>
                    </div>
                );
            case 'add_tag':
                return (
                    <div className="flex-grow flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tag Value:</span>
                        <Input type="text" placeholder="#NewTag" value={action.parameters.tag || ''} onChange={(e) => commonParamUpdate('tag', e.target.value)} className="flex-grow !p-2 !text-xs" />
                    </div>
                );
            case 'send_notification':
                 return (
                    <div className="flex-grow flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Message:</span>
                        <Input type="text" placeholder="Alert message..." value={action.parameters.message || ''} onChange={(e) => commonParamUpdate('message', e.target.value)} className="flex-grow !p-2 !text-xs" />
                    </div>
                 );
            case 'execute_external_api':
                return (
                    <div className="flex flex-col gap-2 p-2 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 w-full">
                        <Input type="url" placeholder="API Endpoint URL" value={action.parameters.endpoint || ''} onChange={(e) => commonParamUpdate('endpoint', e.target.value)} className="!p-2 !text-xs" />
                        <div className="flex gap-2">
                            <Select value={action.parameters.method || 'POST'} onChange={(e) => commonParamUpdate('method', e.target.value)} className="!text-xs w-24">
                                {['POST', 'GET', 'PUT', 'DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
                            </Select>
                            <Input type="text" placeholder="JSON Payload Snippet (e.g., {transactionId: $ID})" value={JSON.stringify(action.parameters.payload || {})} onChange={(e) => {
                                try {
                                    commonParamUpdate('payload', JSON.parse(e.target.value));
                                } catch (e) {
                                    // Ignore invalid JSON during typing, user sees raw string in input field if invalid
                                }
                            }} className="flex-grow !p-2 !text-xs font-mono" />
                        </div>
                    </div>
                );
            case 'adjust_budget':
                return (
                    <div className="flex flex-wrap items-center gap-3 p-2 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex-grow">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">BUDGET:</span>
                        <Input type="text" placeholder="Budget Name" value={action.parameters.budgetName || ''} onChange={(e) => commonParamUpdate('budgetName', e.target.value)} className="w-32 !p-1 !text-xs" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">OP:</span>
                        <Select value={action.parameters.adjustmentType || 'ADD'} onChange={(e) => commonParamUpdate('adjustmentType', e.target.value)} className="!text-xs w-20">
                            <option value="ADD">ADD</option>
                            <option value="DEDUCT">DEDUCT</option>
                        </Select>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">AMT:</span>
                        <Input type="number" step="0.01" placeholder="Value" value={action.parameters.amount || ''} onChange={(e) => commonParamUpdate('amount', e.target.value)} className="w-20 !p-1 !text-xs" />
                    </div>
                );
            case 'trigger_alert':
                return (
                    <div className="flex flex-wrap items-center gap-3 p-2 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex-grow">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">SEV:</span>
                        <Select value={action.parameters.severity || 'CRITICAL'} onChange={(e) => commonParamUpdate('severity', e.target.value)} className="!text-xs w-28">
                            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">CODE:</span>
                        <Input type="text" placeholder="ALERT_CODE" value={action.parameters.alertCode || ''} onChange={(e) => commonParamUpdate('alertCode', e.target.value)} className="w-24 !p-1 !text-xs" />
                    </div>
                );
            case 'log_event':
                return (
                    <div className="flex flex-wrap items-center gap-3 p-2 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex-grow">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">TYPE:</span>
                        <Input type="text" placeholder="Audit Type" value={action.parameters.eventType || ''} onChange={(e) => commonParamUpdate('eventType', e.target.value)} className="w-32 !p-1 !text-xs" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">DETAILS:</span>
                        <Input type="text" placeholder="Detailed log message" value={action.parameters.details || ''} onChange={(e) => commonParamUpdate('details', e.target.value)} className="flex-grow !p-1 !text-xs" />
                    </div>
                );
            default:
                return <p className="text-xs text-red-500">Action parameters not configured.</p>;
        }
    }, [action.id, action.parameters, onParameterUpdate]);
    
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-200">
             <div className="flex-shrink-0 w-full md:w-56">
                <Select value={action.type} onChange={(e) => handleTypeChange(e.target.value as ActionType)}>
                    {Object.entries(ACTION_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                    ))}
                </Select>
            </div>
            <div className="flex-grow w-full min-w-0">
                {renderParameterInputs}
            </div>
            <IconButton onClick={() => onRemove(action.id)} aria-label="Remove action" className="flex-shrink-0">
                <Trash2 size={18} />
            </IconButton>
        </div>
    );
});

// =============================================================================
// 6. MAIN COMPONENT (Form logic)
// Refactored state management using stable callbacks and explicit updates.
// =============================================================================

const initialRuleState: Rule = {
    id: crypto.randomUUID(),
    name: 'High Value Purchase Alert',
    description: 'Triggers when spending over $1000, excluding internal transfers.',
    priority: 2, // High Priority
    conditions: [
        { id: crypto.randomUUID(), subject: 'transaction_amount', operator: 'greater_than', value: 1000.00 },
        { id: crypto.randomUUID(), subject: 'category', operator: 'is_not', value: 'Transfers' }
    ],
    conditionLogic: 'AND',
    actions: [
        { id: crypto.randomUUID(), type: 'trigger_alert', executionOrder: 1, parameters: { severity: 'HIGH', alertCode: 'SPEND_OVER_1K' } },
        { id: crypto.randomUUID(), type: 'send_notification', executionOrder: 2, parameters: { message: 'High-value expenditure detected.', recipient: 'Treasury_Team' } },
    ],
    isEnabled: false,
    status: 'DRAFT',
    lastExecuted: null,
    executionCount: 0,
    createdBy: 'System_Migrator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export default function FinancialRuleBuilder() {
  // Initialize state with a stable, non-flawed initial structure
  const [rule, setRule] = useState<Rule>(initialRuleState);
  const [isSaving, setIsSaving] = useState(false);

  // --- Condition Management ---
  const addCondition = useCallback(() => {
    // Default to a safe, neutral condition
    setRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, { id: crypto.randomUUID(), subject: 'transaction_amount', operator: 'greater_than', value: 0 }],
    }));
  }, []);

  const updateCondition = useCallback((id: Id, field: keyof Condition, value: any) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.map(c => {
        if (c.id === id) {
          const updatedCondition: Condition = { ...c, [field]: value };
          
          // Enforce dependency: If subject changes, validate operator
          if (field === 'subject') {
              const newSubject = value as ConditionSubject;
              const validOps = OPERATORS_BY_SUBJECT[newSubject];
              if (!validOps.includes(c.operator as ConditionOperator)) {
                  updatedCondition.operator = validOps[0] as ConditionOperator;
              }
          }
          // Ensure numeric values are stored as numbers if applicable
          if (field === 'value' && (c.subject === 'transaction_amount' || c.subject === 'ai_sentiment_score')) {
              updatedCondition.value = parseFloat(value) || 0;
          }

          return updatedCondition;
        }
        return c;
      }),
    }));
  }, []);

  const removeCondition = useCallback((id: Id) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id),
    }));
  }, []);

  // --- Action Management ---
  const addAction = useCallback(() => {
    // Default to the first action type defined in configuration
    const newActionType: ActionType = Object.keys(ACTION_CONFIG)[0] as ActionType;
    const defaultParams = ACTION_CONFIG[newActionType].defaultParams();
    
    setRule(prev => ({
        ...prev,
        actions: [...prev.actions, { 
            id: crypto.randomUUID(), 
            type: newActionType, 
            executionOrder: prev.actions.length + 1, 
            parameters: defaultParams 
        }],
    }));
  }, []);

  const updateAction = useCallback((id: Id, field: keyof Action, value: any) => {
    setRule(prev => {
        const actions = prev.actions.map(a => {
            if (a.id === id) {
                const updatedAction: Action = { ...a, [field]: value };
                
                if (field === 'type') {
                    // When type changes, reset parameters to default for the new type
                    updatedAction.parameters = ACTION_CONFIG[value as ActionType].defaultParams();
                }
                return updatedAction;
            }
            return a;
        });
        
        return { ...prev, actions };
    });
  }, []);

  const updateActionParameter = useCallback((id: Id, paramKey: string, value: any) => {
    setRule(prev => ({
        ...prev,
        actions: prev.actions.map(a => a.id === id ? { ...a, parameters: { ...a.parameters, [paramKey]: value } } : a),
    }));
  }, []);

  const removeAction = useCallback((id: Id) => {
    setRule(prev => {
        const remainingActions = prev.actions.filter(a => a.id !== id);
        // Fix order numbers to maintain sequential execution flow
        const reSequencedActions = remainingActions.map((action, index) => ({
            ...action,
            executionOrder: index + 1
        }));
        return { ...prev, actions: reSequencedActions };
    });
  }, []);
  
  const handleSave = async () => {
    // Validation: MVP requires at least one IF and one THEN
    if (rule.conditions.length === 0 || rule.actions.length === 0) {
        alert("Validation Error: A rule must contain at least one condition and one action to be functional.");
        return;
    }
    
    setIsSaving(true);
    // --- Production Integration Placeholder ---
    // In a real application, this would involve:
    // 1. API call to backend service (e.g., POST /api/v1/rules/{ruleId})
    // 2. Secure payload transmission (JWT secured)
    // 3. Backend schema validation and persistence.
    // 4. Fetching updated rule metadata (like lastExecuted timestamps).
    
    await new Promise(resolve => setTimeout(resolve, 1200)); 

    setRule(prev => ({
        ...prev,
        status: prev.isEnabled ? 'ACTIVE' : 'PAUSED',
        updatedAt: new Date().toISOString(),
        // If API call successful, increment count and log last execution placeholder
        executionCount: prev.executionCount + 1, 
        lastExecuted: new Date().toISOString(),
    }));
    setIsSaving(false);
    console.log('Rule state committed:', rule);
    alert(`Rule "${rule.name}" saved successfully. Status set to ${rule.isEnabled ? 'ACTIVE' : 'PAUSED'}.`);
  };

  const handleToggleEnable = (isEnabled: boolean) => {
    setRule(prev => ({
        ...prev,
        isEnabled: isEnabled,
        // Update status immediately based on toggle state
        status: isEnabled ? 'ACTIVE' : 'PAUSED'
    }));
  };

  // Check if basic structural requirements are met for saving
  const isReadyToSave = rule.conditions.length > 0 && rule.actions.length > 0;

  // --- Helpers ---
  const getStatusBadge = (status: RuleExecutionStatus) => {
    let colorClass = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    switch (status) {
        case 'ACTIVE':
            colorClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            break;
        case 'PAUSED':
            colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            break;
        case 'ERROR':
            colorClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            break;
        case 'DRAFT':
            colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            break;
    }
    return <span className={`px-3 py-1 text-xs font-bold rounded-full ${colorClass}`}>{status}</span>;
  };
    
  // Sort actions based on executionOrder for display purposes, although the state handles the final sequence.
  const sortedActions = useMemo(() => 
    [...rule.actions].sort((a, b) => a.executionOrder - b.executionOrder), 
    [rule.actions]
  );

  return (
    <div className="p-4 sm:p-8 md:p-12 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section: Rule Metadata and Status */}
        <header className="mb-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-t-4 border-indigo-600">
          <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                    Financial Rule Builder
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-lg">Rule ID: {rule.id.substring(0, 8)}...</p>
            </div>
            {getStatusBadge(rule.status)}
          </div>

          {/* Basic Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Input
                label="Rule Name"
                type="text"
                value={rule.name}
                onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
                className="text-lg font-bold"
            />
            <Input
                label="Description"
                type="text"
                value={rule.description}
                onChange={(e) => setRule(prev => ({ ...prev, description: e.target.value }))}
                className="text-sm"
            />
            <div className="flex flex-col">
                <label className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">Priority (1=Highest)</label>
                <Select value={rule.priority} onChange={(e) => setRule(prev => ({ ...prev, priority: parseInt(e.target.value) as RulePriority }))} className="!text-sm">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
                        <option key={p} value={p}>{p} {p === 1 ? '(Critical)' : p === 10 ? '(Low)' : ''}</option>
                    ))}
                </Select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="w-full sm:w-auto">
                <ToggleSwitch 
                    label={rule.isEnabled ? "Rule is LIVE (ACTIVE)" : "Rule is DRAFT/PAUSED"}
                    checked={rule.isEnabled}
                    onChange={handleToggleEnable}
                />
            </div>
            <div className="text-left sm:text-right text-xs text-gray-500 dark:text-gray-400 mt-3 sm:mt-0">
                <p>Created: {new Date(rule.createdAt).toLocaleString()}</p>
                <p>Last Run: {rule.lastExecuted ? new Date(rule.lastExecuted).toLocaleString() : 'Never'}</p>
                <p>Total Executions: {rule.executionCount}</p>
            </div>
          </div>
        </header>

        <div className="space-y-10">
            
            {/* Conditions */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-indigo-200/50 dark:border-indigo-900/50">
                <h2 className="text-2xl font-bold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                    <Zap size={24} className="mr-3" />
                    1. IF (Conditions)
                </h2>

                <div className="space-y-4">
                    {rule.conditions.length === 0 ? (
                         <div className="text-center py-10 border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <AlertTriangle size={32} className="mx-auto text-yellow-500 mb-2" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Rule requires at least one condition to trigger.</p>
                        </div>
                    ) : (
                        rule.conditions.map((condition, index) => (
                            <React.Fragment key={condition.id}>
                                <ConditionRow
                                    condition={condition}
                                    onUpdate={updateCondition}
                                    onRemove={removeCondition}
                                />
                                {index < rule.conditions.length - 1 && (
                                    <div className="flex items-center justify-center my-2">
                                        <span className={`text-sm font-extrabold px-4 py-1 rounded-full shadow-md transition duration-150 ${rule.conditionLogic === 'AND' ? 'bg-indigo-600 text-white' : 'bg-green-600 text-white'}`}>
                                            {rule.conditionLogic === 'AND' ? 'AND' : 'OR'}
                                        </span>
                                    </div>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={addCondition}
                        className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition mb-3 sm:mb-0 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                    >
                        <PlusCircle size={18} /> Add Condition
                    </button>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Grouping Logic:</span>
                        <Button 
                            onClick={() => setRule(prev => ({ ...prev, conditionLogic: 'AND' }))}
                            className={`!py-1 !px-3 text-xs ${rule.conditionLogic === 'AND' ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                            disabled={rule.conditionLogic === 'AND'}
                        >
                            AND
                        </Button>
                        <Button 
                            onClick={() => setRule(prev => ({ ...prev, conditionLogic: 'OR' }))}
                            className={`!py-1 !px-3 text-xs ${rule.conditionLogic === 'OR' ? 'bg-green-600' : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                            disabled={rule.conditionLogic === 'OR'}
                        >
                            OR
                        </Button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-green-200/50 dark:border-green-900/50">
                 <h2 className="text-2xl font-bold mb-6 flex items-center text-green-600 dark:text-green-400">
                    <ShieldCheck size={24} className="mr-3" />
                    2. THEN (Actions)
                </h2>
                <div className="space-y-4">
                    {rule.actions.length === 0 ? (
                         <div className="text-center py-10 border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <AlertTriangle size={32} className="mx-auto text-red-500 mb-2" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Rule requires at least one action to perform.</p>
                        </div>
                    ) : (
                        sortedActions.map(action => (
                            <ActionRow 
                                key={action.id}
                                action={action}
                                onUpdate={updateAction}
                                onParameterUpdate={updateActionParameter}
                                onRemove={removeAction}
                            />
                        ))
                    )}
                </div>
                 <button
                    onClick={addAction}
                    className="mt-6 flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition border border-green-300 dark:border-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800"
                >
                    <PlusCircle size={18} /> Add Action
                </button>
            </div>
            
            {/* Save Button */}
            <div className="flex justify-end pt-6 pb-12">
                 <Button 
                    onClick={handleSave} 
                    disabled={!isReadyToSave || isSaving}
                    className="min-w-[180px] flex items-center justify-center gap-2 text-base"
                 >
                    {isSaving ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Saving Configuration...
                        </>
                    ) : (
                        'Finalize & Save Rule'
                    )}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}