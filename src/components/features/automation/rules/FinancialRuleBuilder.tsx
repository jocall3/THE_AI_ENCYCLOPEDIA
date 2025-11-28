
import React, { useState, useCallback } from 'react';
import { PlusCircle, Trash2, ArrowRight, X } from 'lucide-react';

// --- TYPE DEFINITIONS ---

type Id = string;

// "IF" Conditions
type ConditionSubject = 'transaction_amount' | 'category' | 'merchant' | 'account' | 'day_of_week';
type ConditionOperator = 'is' | 'is_not' | 'greater_than' | 'less_than' | 'contains' | 'starts_with' | 'ends_with';

interface Condition {
  id: Id;
  subject: ConditionSubject;
  operator: ConditionOperator;
  value: any;
}

// "THEN" Actions
type ActionType = 'transfer_money' | 'send_notification' | 'categorize_as' | 'add_tag';

interface Action {
  id: Id;
  type: ActionType;
  parameters: { [key: string]: any };
}

// The overall Rule
interface Rule {
  id: string;
  name: string;
  conditions: Condition[];
  conditionLogic: 'AND' | 'OR';
  actions: Action[];
  isEnabled: boolean;
}

// --- MOCK DATA (In a real app, this would come from an API) ---

const MOCK_CATEGORIES = ['Groceries', 'Dining Out', 'Utilities', 'Transport', 'Entertainment', 'Shopping', 'Income', 'Transfers'];
const MOCK_ACCOUNTS = ['Checking Account', 'Savings Account', 'Credit Card', 'Investment Portfolio'];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// --- UI HELPER COMPONENTS ---

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition-colors">
    {children}
  </select>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition-colors" />
);

const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
    {children}
  </button>
);

const IconButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
        {children}
    </button>
);


// --- DYNAMIC INPUT MAPPINGS ---

const OPERATORS_BY_SUBJECT: Record<ConditionSubject, ConditionOperator[]> = {
    transaction_amount: ['greater_than', 'less_than', 'is'],
    category: ['is', 'is_not'],
    merchant: ['contains', 'is', 'starts_with', 'ends_with'],
    account: ['is', 'is_not'],
    day_of_week: ['is'],
};

// --- SUB-COMPONENTS for Conditions and Actions ---

interface ConditionRowProps {
  condition: Condition;
  onUpdate: (id: Id, field: keyof Condition, value: any) => void;
  onRemove: (id: Id) => void;
}

const ConditionRow: React.FC<ConditionRowProps> = ({ condition, onUpdate, onRemove }) => {
    const availableOperators = OPERATORS_BY_SUBJECT[condition.subject];

    const renderValueInput = () => {
        switch (condition.subject) {
            case 'transaction_amount':
                return <Input type="number" placeholder="e.g., 50.00" value={condition.value || ''} onChange={(e) => onUpdate(condition.id, 'value', parseFloat(e.target.value))} />;
            case 'category':
                return (
                    <Select value={condition.value || ''} onChange={(e) => onUpdate(condition.id, 'value', e.target.value)}>
                        <option value="" disabled>Select a category</option>
                        {MOCK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                );
            case 'account':
                return (
                     <Select value={condition.value || ''} onChange={(e) => onUpdate(condition.id, 'value', e.target.value)}>
                        <option value="" disabled>Select an account</option>
                        {MOCK_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                    </Select>
                );
            case 'day_of_week':
                 return (
                     <Select value={condition.value || ''} onChange={(e) => onUpdate(condition.id, 'value', e.target.value)}>
                        <option value="" disabled>Select a day</option>
                        {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                    </Select>
                );
            case 'merchant':
            default:
                return <Input type="text" placeholder="e.g., Starbucks" value={condition.value || ''} onChange={(e) => onUpdate(condition.id, 'value', e.target.value)} />;
        }
    };

    return (
        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                <Select value={condition.subject} onChange={(e) => onUpdate(condition.id, 'subject', e.target.value as ConditionSubject)}>
                    <option value="transaction_amount">Transaction Amount</option>
                    <option value="category">Category</option>
                    <option value="merchant">Merchant</option>
                    <option value="account">Account</option>
                    <option value="day_of_week">Day of the Week</option>
                </Select>
                <Select value={condition.operator} onChange={(e) => onUpdate(condition.id, 'operator', e.target.value as ConditionOperator)}>
                    {availableOperators.map(op => <option key={op} value={op}>{op.replace(/_/g, ' ')}</option>)}
                </Select>
                {renderValueInput()}
            </div>
            <IconButton onClick={() => onRemove(condition.id)} aria-label="Remove condition">
                <Trash2 size={16} />
            </IconButton>
        </div>
    );
};

interface ActionRowProps {
  action: Action;
  onUpdate: (id: Id, field: keyof Action, value: any) => void;
  onParameterUpdate: (id: Id, paramKey: string, value: any) => void;
  onRemove: (id: Id) => void;
}

const ActionRow: React.FC<ActionRowProps> = ({ action, onUpdate, onParameterUpdate, onRemove }) => {
    
    const renderParameterInputs = () => {
        switch (action.type) {
            case 'transfer_money':
                return (
                    <div className="flex items-center gap-2 flex-wrap flex-grow">
                        <span className="text-sm">From</span>
                        <Select value={action.parameters.fromAccount || ''} onChange={(e) => onParameterUpdate(action.id, 'fromAccount', e.target.value)} className="min-w-[150px]">
                            <option value="" disabled>Select Account</option>
                            {MOCK_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                        </Select>
                        <ArrowRight size={16} className="text-gray-500" />
                        <span className="text-sm">To</span>
                        <Select value={action.parameters.toAccount || ''} onChange={(e) => onParameterUpdate(action.id, 'toAccount', e.target.value)} className="min-w-[150px]">
                           <option value="" disabled>Select Account</option>
                           {MOCK_ACCOUNTS.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                        </Select>
                        <Input type="number" placeholder="Amount" value={action.parameters.amount || ''} onChange={(e) => onParameterUpdate(action.id, 'amount', parseFloat(e.target.value))} className="w-28" />
                    </div>
                );
            case 'categorize_as':
                return (
                    <div className="flex-grow">
                        <Select value={action.parameters.category || ''} onChange={(e) => onParameterUpdate(action.id, 'category', e.target.value)}>
                            <option value="" disabled>Select a category</option>
                            {MOCK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </Select>
                    </div>
                );
            case 'add_tag':
                return (
                    <div className="flex-grow">
                        <Input type="text" placeholder="e.g., #TaxDeductible" value={action.parameters.tag || ''} onChange={(e) => onParameterUpdate(action.id, 'tag', e.target.value)} />
                    </div>
                );
            case 'send_notification':
                 return (
                    <div className="flex-grow">
                        <Input type="text" placeholder="Notification message" value={action.parameters.message || ''} onChange={(e) => onParameterUpdate(action.id, 'message', e.target.value)} />
                    </div>
                 );
            default:
                return null;
        }
    };
    
    return (
        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
             <div className="flex items-center gap-2 flex-grow flex-wrap">
                <div className="w-full md:w-48">
                    <Select value={action.type} onChange={(e) => onUpdate(action.id, 'type', e.target.value as ActionType)}>
                        <option value="transfer_money">Transfer Money</option>
                        <option value="categorize_as">Categorize As</option>
                        <option value="add_tag">Add Tag</option>
                        <option value="send_notification">Send Notification</option>
                    </Select>
                </div>
                {renderParameterInputs()}
            </div>
            <IconButton onClick={() => onRemove(action.id)} aria-label="Remove action">
                <Trash2 size={16} />
            </IconButton>
        </div>
    );
};

// --- MAIN RULE BUILDER COMPONENT ---

export default function FinancialRuleBuilder() {
  const [rule, setRule] = useState<Rule>({
    id: crypto.randomUUID(),
    name: 'My New Financial Rule',
    conditions: [],
    conditionLogic: 'AND',
    actions: [],
    isEnabled: true,
  });

  const addCondition = () => {
    setRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, { id: crypto.randomUUID(), subject: 'transaction_amount', operator: 'greater_than', value: 100 }],
    }));
  };

  const updateCondition = useCallback((id: Id, field: keyof Condition, value: any) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.map(c => {
        if (c.id === id) {
          const updatedCondition = { ...c, [field]: value };
          // Reset operator if subject changes to a valid one
          if (field === 'subject' && !OPERATORS_BY_SUBJECT[value as ConditionSubject].includes(c.operator)) {
              updatedCondition.operator = OPERATORS_BY_SUBJECT[value as ConditionSubject][0];
          }
          return updatedCondition;
        }
        return c;
      }),
    }));
  }, []);

  const removeCondition = (id: Id) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id),
    }));
  };

  const addAction = () => {
    setRule(prev => ({
        ...prev,
        actions: [...prev.actions, { id: crypto.randomUUID(), type: 'transfer_money', parameters: { fromAccount: MOCK_ACCOUNTS[0], toAccount: MOCK_ACCOUNTS[1], amount: 10 } }],
    }));
  };

  const updateAction = useCallback((id: Id, field: keyof Action, value: any) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.map(a => a.id === id ? { ...a, [field]: value, parameters: {} } : a), // Reset params on type change
    }));
  }, []);

  const updateActionParameter = useCallback((id: Id, paramKey: string, value: any) => {
    setRule(prev => ({
        ...prev,
        actions: prev.actions.map(a => a.id === id ? { ...a, parameters: { ...a.parameters, [paramKey]: value } } : a),
    }));
  }, []);

  const removeAction = (id: Id) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.filter(a => a.id !== id),
    }));
  };
  
  const handleSave = () => {
    // In a real app, you would send this rule object to your backend API
    console.log('Saving Rule:', rule);
    alert(`Rule "${rule.name}" saved!\n\n${JSON.stringify(rule, null, 2)}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Financial Rule Builder</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create powerful 'if-this-then-that' automations for your finances.</p>
        </header>

        <div className="space-y-8">
            {/* Rule Name & Status */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <label htmlFor="ruleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rule Name</label>
                <Input
                    id="ruleName"
                    type="text"
                    value={rule.name}
                    onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 text-lg font-semibold !p-2"
                />
            </div>

            {/* IF Conditions Block */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold rounded px-2.5 py-1 mr-3">IF</span>
                    All of the following conditions are met:
                </h2>

                <div className="space-y-3">
                    {rule.conditions.length === 0 && (
                         <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">No conditions yet. Add one to get started.</p>
                        </div>
                    )}
                    {rule.conditions.map((condition, index) => (
                        <React.Fragment key={condition.id}>
                            <ConditionRow
                                condition={condition}
                                onUpdate={updateCondition}
                                onRemove={removeCondition}
                            />
                            {index < rule.conditions.length - 1 && (
                                <div className="pl-4">
                                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full px-2.5 py-1">{rule.conditionLogic}</span>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                
                <button
                    onClick={addCondition}
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                >
                    <PlusCircle size={16} /> Add Condition
                </button>
            </div>

            {/* THEN Actions Block */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                 <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 font-bold rounded px-2.5 py-1 mr-3">THEN</span>
                    Perform the following actions:
                </h2>
                <div className="space-y-3">
                    {rule.actions.length === 0 && (
                         <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">No actions specified.</p>
                        </div>
                    )}
                    {rule.actions.map(action => (
                         <ActionRow 
                            key={action.id}
                            action={action}
                            onUpdate={updateAction}
                            onParameterUpdate={updateActionParameter}
                            onRemove={removeAction}
                         />
                    ))}
                </div>
                 <button
                    onClick={addAction}
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                >
                    <PlusCircle size={16} /> Add Action
                </button>
            </div>
            
            {/* Save Action */}
            <div className="flex justify-end pt-4">
                 <Button onClick={handleSave} disabled={rule.conditions.length === 0 || rule.actions.length === 0}>
                    Save Rule
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}