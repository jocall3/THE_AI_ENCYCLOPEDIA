import React, { useState, useMemo, useCallback } from 'react';
import { Lock, Unlock, CreditCard, ClipboardList, CircleDollarSign, TrendingUp, TrendingDown, CheckCircle, MoreVertical, Settings, User } from 'lucide-react';

// UI Component Definitions
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`p-6 border-b border-gray-200 dark:border-gray-800 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`p-6 ${className}`}>{children}</div>;
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }: { children: React.ReactNode, variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost', size?: 'default' | 'sm' | 'lg' | 'icon', className?: string, [key: string]: any }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    const variantClasses = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
    };
    const sizeClasses = {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
    };
    return <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>{children}</button>
};
const Avatar = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>;
const AvatarImage = ({ src, alt, className = '' }: { src: string, alt: string, className?: string }) => <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} />;
const AvatarFallback = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <span className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}>{children}</span>;
const Input = ({ className = '', ...props }: { className?: string, [key: string]: any }) => <input className={`flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${className}`} {...props} />;
const Label = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>{children}</label>;
const Switch = ({ checked, onCheckedChange, ...props }: { checked: boolean, onCheckedChange: (checked: boolean) => void, [key: string]: any }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        {...props}
    >
        <span
            aria-hidden="true"
            className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);
const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'destructive', className?: string }) => {
    const variantClasses = {
        default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>{children}</span>
};

// Type Definitions
interface Merchant {
  name: string;
  category: string;
  icon: React.ReactNode;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit';
  merchant: Merchant;
  isFlagged: boolean;
}

interface SpendingLimitRule {
  id: string;
  category: string;
  limitAmount: number;
  period: 'daily' | 'weekly' | 'monthly';
  isAIRecommended: boolean;
}

interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  startDate: string;
  targetDate: string;
  progressPercentage: number;
  isAIOptimized: boolean;
}

interface AISpendingInsight {
  id: string;
  title: string;
  summary: string;
  impactScore: number;
  recommendation: string;
  trend: 'positive' | 'negative' | 'neutral';
}

interface BehavioralScore {
  score: number;
  factors: {
    budgetAdherence: number;
    savingsRate: number;
    choreCompletion: number;
    riskTolerance: number;
  };
  aiAnalysis: string;
}

interface DebitCard {
  last4: string;
  balance: number;
  isLocked: boolean;
  spendingLimits: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  customRules: SpendingLimitRule[];
  transactions: Transaction[];
  behavioralScore: BehavioralScore;
}

interface Chore {
  id: string;
  title: string;
  allowance: number;
  status: 'pending' | 'completed' | 'approved' | 'ai_verified';
  verificationDetails?: string;
}

interface Teen {
  id: string;
  name: string;
  avatarUrl: string;
  card: DebitCard;
  chores: Chore[];
  goals: FinancialGoal[];
  aiInsights: AISpendingInsight[];
}

// Utility Functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const MOCK_MERCHANTS: Merchant[] = [
    { name: 'Netflix', category: 'Entertainment', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Local Cafe', category: 'Food & Drink', icon: <CircleDollarSign className="w-4 h-4" /> },
    { name: 'Amazon', category: 'Online Shopping', icon: <CreditCard className="w-4 h-4" /> },
    { name: 'GameStop', category: 'Gaming', icon: <Lock className="w-4 h-4" /> },
    { name: 'Savings Transfer', category: 'Savings', icon: <CheckCircle className="w-4 h-4" /> },
];

const generateMockTransactions = (count: number): Transaction[] => {
    const txs: Transaction[] = [];
    for (let i = 0; i < count; i++) {
        const merchant = MOCK_MERCHANTS[i % MOCK_MERCHANTS.length];
        const amount = parseFloat((Math.random() * 50 + 5).toFixed(2));
        const type = Math.random() > 0.7 ? 'credit' : 'debit';
        const date = `2023-10-${String(28 - i).padStart(2, '0')}`;
        txs.push({
            id: `t-${Date.now()}-${i}`,
            description: `${merchant.name} Purchase`,
            amount: amount,
            date: date,
            type: type,
            merchant: merchant,
            isFlagged: Math.random() > 0.9,
        });
    }
    return txs;
};

// Mock Data
const MOCK_TEENS: Teen[] = [
  {
    id: 'teen-1',
    name: 'Alex Johnson',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    card: {
      last4: '4242',
      balance: 350.75,
      isLocked: false,
      spendingLimits: { daily: 75, weekly: 200, monthly: 600 },
      customRules: [
        { id: 'r1', category: 'Gaming', limitAmount: 50, period: 'monthly', isAIRecommended: true },
        { id: 'r2', category: 'Online Shopping', limitAmount: 100, period: 'weekly', isAIRecommended: false },
      ],
      transactions: generateMockTransactions(15),
      behavioralScore: {
        score: 85,
        factors: { budgetAdherence: 90, savingsRate: 80, choreCompletion: 95, riskTolerance: 75 },
        aiAnalysis: "Alex demonstrates strong financial discipline, consistently adhering to budget limits and maintaining a high savings rate. AI suggests increasing weekly allowance slightly to encourage greater autonomy."
      },
    },
    chores: [
      { id: 'c1', title: 'Clean the garage', allowance: 25, status: 'ai_verified', verificationDetails: 'AI confirmed 95% cleanliness via smart home sensor data.' },
      { id: 'c2', title: 'Walk the dog (daily)', allowance: 5, status: 'completed' },
      { id: 'c3', title: 'Mow the lawn', allowance: 30, status: 'pending' },
    ],
    goals: [
        { id: 'g1', title: 'New Gaming PC', targetAmount: 1500, savedAmount: 450, startDate: '2023-09-01', targetDate: '2024-03-01', progressPercentage: 30, isAIOptimized: true },
        { id: 'g2', title: 'Summer Trip Fund', targetAmount: 500, savedAmount: 120, startDate: '2023-10-01', targetDate: '2024-06-01', progressPercentage: 24, isAIOptimized: false },
    ],
    aiInsights: [
        { id: 'i1', title: 'High Entertainment Spend', summary: 'Alex spent 40% more on streaming services this month. AI suggests reviewing subscriptions.', impactScore: 75, recommendation: 'Review subscription limits.', trend: 'negative' },
        { id: 'i2', title: 'Excellent Savings Habit', summary: 'Savings transfers increased by 15% this week, exceeding the AI target.', impactScore: 95, recommendation: 'Reward positive behavior.', trend: 'positive' },
    ]
  },
  {
    id: 'teen-2',
    name: 'Samantha Lee',
    avatarUrl: 'https://i.pravatar.cc/150?u=samantha',
    card: {
      last4: '1234',
      balance: 78.20,
      isLocked: true,
      spendingLimits: { daily: 30, weekly: 100, monthly: 400 },
      customRules: [
        { id: 'r3', category: 'Food & Drink', limitAmount: 15, period: 'daily', isAIRecommended: true },
      ],
      transactions: generateMockTransactions(10),
      behavioralScore: {
        score: 55,
        factors: { budgetAdherence: 60, savingsRate: 40, choreCompletion: 70, riskTolerance: 85 },
        aiAnalysis: "Samantha shows inconsistent spending patterns, often hitting daily limits early. Savings contributions are low. AI recommends implementing stricter category limits and gamified savings goals."
      },
    },
    chores: [
      { id: 'c4', title: 'Wash the dishes', allowance: 5, status: 'approved' },
      { id: 'c5', title: 'Organize pantry', allowance: 15, status: 'completed' },
      { id: 'c6', title: 'Homework help for sibling', allowance: 10, status: 'pending' },
    ],
    goals: [
        { id: 'g3', title: 'New Phone', targetAmount: 800, savedAmount: 50, startDate: '2023-11-01', targetDate: '2024-05-01', progressPercentage: 6, isAIOptimized: true },
    ],
    aiInsights: [
        { id: 'i3', title: 'Impulse Spending Alert', summary: 'Three transactions flagged as high-risk impulse buys this week. Totaling $45.', impactScore: 88, recommendation: 'Discuss spending triggers and enforce a 24-hour cooling period rule.', trend: 'negative' },
    ]
  },
];

// Sub-Components
const BehavioralScorecard = React.memo(({ scoreData }: { scoreData: BehavioralScore }) => {
    const { score, factors, aiAnalysis } = scoreData;
    const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
    const scoreBadgeVariant = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'destructive';

    const FactorItem = ({ title, value }: { title: string, value: number }) => (
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
            <div className="flex items-center gap-2">
                <Badge variant={value >= 70 ? 'success' : 'warning'}>{value}%</Badge>
                <div className="w-20 h-1 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="h-1 rounded-full" style={{ width: `${value}%`, backgroundColor: value >= 70 ? '#10B981' : '#F59E0B' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AI Behavioral Score
                </CardTitle>
                <CardDescription>Real-time assessment of financial maturity and discipline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                    <p className="text-6xl font-extrabold tracking-tighter" style={{ color: scoreColor }}>{score}</p>
                    <Badge variant={scoreBadgeVariant} className="mt-2 text-base">
                        {score >= 80 ? 'Excellent Discipline' : score >= 60 ? 'Needs Improvement' : 'High Risk Alert'}
                    </Badge>
                </div>
                <div className="pt-4 border-t dark:border-gray-700">
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Key Factors:</h4>
                    <FactorItem title="Budget Adherence" value={factors.budgetAdherence} />
                    <FactorItem title="Savings Rate Consistency" value={factors.savingsRate} />
                    <FactorItem title="Chore Reliability" value={factors.choreCompletion} />
                    <FactorItem title="Financial Risk Tolerance" value={factors.riskTolerance} />
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">AI Summary:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{aiAnalysis}</p>
                </div>
            </CardContent>
        </Card>
    );
});

const AISpendingInsights = React.memo(({ insights }: { insights: AISpendingInsight[] }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    AI Financial Insights
                </CardTitle>
                <CardDescription>Actionable recommendations generated by the AI financial coach.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">No critical insights generated recently.</p>
                )}
                {insights.map(insight => (
                    <div key={insight.id} className="p-4 border rounded-lg dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h4>
                            <Badge variant={insight.trend === 'positive' ? 'success' : insight.trend === 'negative' ? 'warning' : 'default'}>
                                Impact: {insight.impactScore}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.summary}</p>
                        <div className="mt-3 flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-700 dark:text-blue-300">Action: {insight.recommendation}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
});

const FinancialGoalTracker = React.memo(({ goals }: { goals: FinancialGoal[] }) => {
    const GoalProgress = ({ goal }: { goal: FinancialGoal }) => {
        const progress = Math.min(100, goal.progressPercentage);
        const remaining = goal.targetAmount - goal.savedAmount;

        return (
            <div className="p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{goal.title}</h4>
                    {goal.isAIOptimized && <Badge variant="default">AI Optimized</Badge>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: {formatCurrency(goal.targetAmount)} | Saved: {formatCurrency(goal.savedAmount)}</p>

                <div className="mt-3">
                    <div className="flex justify-between mb-1 text-sm font-medium">
                        <span className="text-blue-600 dark:text-blue-400">{progress}% Complete</span>
                        <span className="text-gray-500 dark:text-gray-400">Remaining: {formatCurrency(remaining)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Target Date: {goal.targetDate}
                </p>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CircleDollarSign className="w-5 h-5" />
                    AI Savings Goals & Projections
                </CardTitle>
                <CardDescription>Track long-term financial goals and AI-driven savings projections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {goals.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No active goals. Use the AI coach to set one!</p>
                ) : (
                    goals.map(goal => <GoalProgress key={goal.id} goal={goal} />)
                )}
                <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure AI Savings Plan
                </Button>
            </CardContent>
        </Card>
    );
});

interface AdvancedSpendingRulesProps {
    rules: SpendingLimitRule[];
    handleRuleUpdate: (ruleId: string, amount: number) => void;
    handleRuleDelete: (ruleId: string) => void;
    handleNewRule: (category: string, amount: number, period: 'daily' | 'weekly' | 'monthly') => void;
}

const AdvancedSpendingRulesManager = React.memo(({ rules, handleRuleUpdate, handleRuleDelete, handleNewRule }: AdvancedSpendingRulesProps) => {
    const [newCategory, setNewCategory] = useState('');
    const [newAmount, setNewAmount] = useState(0);
    const [newPeriod, setNewPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

    const availableCategories = ['Gaming', 'Food & Drink', 'Online Shopping', 'Entertainment', 'Travel', 'Miscellaneous'];

    const handleAddRule = useCallback(() => {
        if (newCategory && newAmount > 0) {
            handleNewRule(newCategory, newAmount, newPeriod);
            setNewCategory('');
            setNewAmount(0);
        }
    }, [newCategory, newAmount, newPeriod, handleNewRule]);

    const RuleItem = ({ rule }: { rule: SpendingLimitRule }) => {
        const [editAmount, setEditAmount] = useState(rule.limitAmount);

        const handleSave = () => {
            if (editAmount > 0 && editAmount !== rule.limitAmount) {
                handleRuleUpdate(rule.id, editAmount);
            }
        };

        return (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex flex-col">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{rule.category} Limit ({rule.period})</p>
                    {rule.isAIRecommended && <Badge variant="default" className="mt-1">AI Suggestion</Badge>}
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-32">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                            type="number"
                            className="pl-7 h-9"
                            value={editAmount}
                            onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                            onBlur={handleSave}
                        />
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => handleRuleDelete(rule.id)}>
                        <Lock className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Advanced Category Rules
                </CardTitle>
                <CardDescription>Set granular, category-specific spending limits. AI monitors compliance and suggests optimal caps.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {rules.map(rule => <RuleItem key={rule.id} rule={rule} />)}
                </div>

                <div className="pt-4 border-t dark:border-gray-700 space-y-3">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Add New Rule</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                            <Input
                                type="number"
                                className="pl-7"
                                placeholder="Amount"
                                value={newAmount || ''}
                                onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                            value={newPeriod}
                            onChange={(e) => setNewPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <Button onClick={handleAddRule} disabled={!newCategory || newAmount <= 0} className="w-full">
                        Add Spending Rule
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});

interface ChoreManagerProps {
    chores: Chore[];
    handleChoreApproval: (choreId: string, allowance: number) => void;
}

const AIChoreManager = React.memo(({ chores, handleChoreApproval }: ChoreManagerProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    AI-Enhanced Chore Management
                </CardTitle>
                <CardDescription>Approve completed chores. AI provides verification status for automated tasks.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {chores.map(chore => (
                        <li key={chore.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <div className="flex flex-col">
                                <p className="font-medium text-gray-800 dark:text-gray-200">{chore.title}</p>
                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">{formatCurrency(chore.allowance)}</p>
                                {chore.verificationDetails && (
                                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 italic">
                                        Verification: {chore.verificationDetails}
                                    </p>
                                )}
                            </div>
                            <div className="mt-2 sm:mt-0">
                                {chore.status === 'completed' && (
                                    <Button size="sm" onClick={() => handleChoreApproval(chore.id, chore.allowance)}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Payment
                                    </Button>
                                )}
                                {chore.status === 'pending' && <Badge variant="warning">Pending Submission</Badge>}
                                {chore.status === 'approved' && <Badge variant="success">Paid</Badge>}
                                {chore.status === 'ai_verified' && (
                                    <Button size="sm" variant="secondary" onClick={() => handleChoreApproval(chore.id, chore.allowance)}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Finalize AI Payment
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                <Button variant="outline" className="w-full mt-4">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Recurring Chores & AI Verification
                </Button>
            </CardContent>
        </Card>
    );
});

const AICoachingChat = React.memo(() => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { id: 1, sender: 'AI Coach', text: 'Welcome! I am your AI Financial Coach. How can I assist you with managing this teen\'s financial profile today? Try asking about spending trends or goal optimization.' },
    ]);

    const handleSendMessage = useCallback(() => {
        if (message.trim() === '') return;

        const userMessage = { id: Date.now(), sender: 'Parent', text: message };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');

        // Simulate AI response delay and logic
        setTimeout(() => {
            let responseText = `Analyzing your request regarding "${message}". Based on recent behavioral data, I recommend reviewing the 'Gaming' category limit. Would you like me to draft a new rule?`;
            if (message.toLowerCase().includes('savings')) {
                responseText = 'The current savings trajectory suggests the goal will be met 45 days ahead of schedule. Excellent progress!';
            } else if (message.toLowerCase().includes('lock')) {
                responseText = 'Card lock initiated successfully. All non-essential transactions are now blocked. I have notified the teen via their profile dashboard.';
            }

            const aiResponse = {
                id: Date.now() + 1,
                sender: 'AI Coach',
                text: responseText,
            };
            setChatHistory(prev => [...prev, aiResponse]);
        }, 1500);
    }, [message]);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    AI Financial Coach Chat
                </CardTitle>
                <CardDescription>Instant, data-driven advice for parental controls and financial education.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between p-4">
                <div className="space-y-4 overflow-y-auto h-64 mb-4 pr-2">
                    {chatHistory.map(chat => (
                        <div key={chat.id} className={`flex ${chat.sender === 'Parent' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs p-3 rounded-xl ${chat.sender === 'Parent' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'}`}>
                                <p className="text-xs font-semibold mb-1">{chat.sender}</p>
                                <p className="text-sm">{chat.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                    <Input
                        placeholder="Ask the AI Coach..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                    />
                    <Button onClick={handleSendMessage} size="icon">
                        <TrendingUp className="w-5 h-5 rotate-90" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});


// Main Component
export default function TeenDebitCardManager() {
  const [teens, setTeens] = useState<Teen[]>(MOCK_TEENS);
  const [selectedTeenId, setSelectedTeenId] = useState<string | null>(MOCK_TEENS[0]?.id || null);

  const selectedTeen = useMemo(() => teens.find(t => t.id === selectedTeenId), [teens, selectedTeenId]);

  const handleLockToggle = useCallback(() => {
    if (!selectedTeenId) return;
    setTeens(prevTeens =>
      prevTeens.map(teen =>
        teen.id === selectedTeenId
          ? { ...teen, card: { ...teen.card, isLocked: !teen.card.isLocked } }
          : teen
      )
    );
  }, [selectedTeenId]);
  
  const handleLimitChange = useCallback((limitType: 'daily' | 'weekly' | 'monthly', value: number) => {
    if (!selectedTeenId || isNaN(value)) return;
    setTeens(prevTeens =>
      prevTeens.map(teen =>
        teen.id === selectedTeenId
          ? {
              ...teen,
              card: {
                ...teen.card,
                spendingLimits: { ...teen.card.spendingLimits, [limitType]: value },
              },
            }
          : teen
      )
    );
  }, [selectedTeenId]);

  const handleChoreApproval = useCallback((choreId: string, allowance: number) => {
    if (!selectedTeenId) return;
    setTeens(prevTeens =>
        prevTeens.map(teen =>
            teen.id === selectedTeenId
            ? {
                ...teen,
                card: {
                    ...teen.card,
                    balance: teen.card.balance + allowance,
                    transactions: [
                        { 
                            id: `t-${Date.now()}`, 
                            description: `Allowance: ${teen.chores.find(c => c.id === choreId)?.title}`, 
                            amount: allowance, 
                            date: new Date().toISOString().split('T')[0], 
                            type: 'credit',
                            merchant: { name: 'Allowance System', category: 'Income', icon: <CheckCircle className="w-4 h-4" /> },
                            isFlagged: false,
                        },
                        ...teen.card.transactions
                    ]
                },
                chores: teen.chores.map(chore =>
                    chore.id === choreId ? { ...chore, status: 'approved' } : chore
                ),
                }
            : teen
        )
    );
  }, [selectedTeenId]);

  const handleRuleUpdate = useCallback((ruleId: string, amount: number) => {
    if (!selectedTeenId) return;
    setTeens(prevTeens =>
        prevTeens.map(teen =>
            teen.id === selectedTeenId
                ? {
                    ...teen,
                    card: {
                        ...teen.card,
                        customRules: teen.card.customRules.map(rule =>
                            rule.id === ruleId ? { ...rule, limitAmount: amount } : rule
                        ),
                    },
                }
                : teen
        )
    );
  }, [selectedTeenId]);

  const handleRuleDelete = useCallback((ruleId: string) => {
    if (!selectedTeenId) return;
    setTeens(prevTeens =>
        prevTeens.map(teen =>
            teen.id === selectedTeenId
                ? {
                    ...teen,
                    card: {
                        ...teen.card,
                        customRules: teen.card.customRules.filter(rule => rule.id !== ruleId),
                    },
                }
                : teen
        )
    );
  }, [selectedTeenId]);

  const handleNewRule = useCallback((category: string, amount: number, period: 'daily' | 'weekly' | 'monthly') => {
    if (!selectedTeenId) return;
    const newRule: SpendingLimitRule = {
        id: `r-${Date.now()}`,
        category,
        limitAmount: amount,
        period,
        isAIRecommended: false,
    };
    setTeens(prevTeens =>
        prevTeens.map(teen =>
            teen.id === selectedTeenId
                ? {
                    ...teen,
                    card: {
                        ...teen.card,
                        customRules: [...teen.card.customRules, newRule],
                    },
                }
                : teen
        )
    );
  }, [selectedTeenId]);


  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-8xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">AI Financial Command Center</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Leveraging AI to optimize financial education, spending controls, and goal achievement for the next generation.</p>
        </header>

        <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Managed Profiles</h2>
            <div className="flex items-center gap-4 flex-wrap">
                {teens.map(teen => (
                    <button
                        key={teen.id}
                        onClick={() => setSelectedTeenId(teen.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all shadow-md ${selectedTeenId === teen.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/50 ring-4 ring-blue-500/30' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={teen.avatarUrl} alt={teen.name} />
                            <AvatarFallback>{teen.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <span className="font-bold text-gray-800 dark:text-gray-200">{teen.name}</span>
                            <Badge variant={teen.card.isLocked ? 'destructive' : 'success'} className="ml-2">
                                {teen.card.isLocked ? 'Card Frozen' : 'Active'}
                            </Badge>
                        </div>
                    </button>
                ))}
            </div>
        </section>

        {selectedTeen ? (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: Core Controls & Limits */}
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                {selectedTeen.name}'s Financial Overview
                            </CardTitle>
                            <CardDescription>Card ending in Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢ {selectedTeen.card.last4}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5"/>
                        </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col justify-center p-6 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-200">Current Available Balance</p>
                            <p className="text-5xl font-bold text-blue-900 dark:text-blue-100 mt-1">{formatCurrency(selectedTeen.card.balance)}</p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                             <div className="flex items-center justify-between">
                                <Label htmlFor="card-lock" className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    {selectedTeen.card.isLocked ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-green-500" />}
                                    Card Status: {selectedTeen.card.isLocked ? 'Frozen' : 'Active'}
                                </Label>
                                <Switch id="card-lock" checked={!selectedTeen.card.isLocked} onCheckedChange={() => handleLockToggle()} />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {selectedTeen.card.isLocked
                                    ? 'Immediate freeze activated. All purchases declined.'
                                    : 'Card is active. Use the limits below for control.'
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Standard Spending Limits
                        </CardTitle>
                        <CardDescription>Set global maximum spending amounts (AI monitors usage).</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-3 gap-4">
                        {['daily', 'weekly', 'monthly'].map((limitType) => (
                            <div className="space-y-1" key={limitType}>
                                <Label htmlFor={`${limitType}-limit`}>{limitType.charAt(0).toUpperCase() + limitType.slice(1)} Limit</Label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                    <Input
                                        id={`${limitType}-limit`}
                                        type="number"
                                        className="pl-7"
                                        value={selectedTeen.card.spendingLimits[limitType as 'daily' | 'weekly' | 'monthly']}
                                        onChange={(e) => handleLimitChange(limitType as 'daily' | 'weekly' | 'monthly', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <AdvancedSpendingRulesManager 
                    rules={selectedTeen.card.customRules}
                    handleRuleUpdate={handleRuleUpdate}
                    handleRuleDelete={handleRuleDelete}
                    handleNewRule={handleNewRule}
                />
            </div>
            
            {/* COLUMN 2: Data & Analytics */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Transaction History & AI Flagging
                        </CardTitle>
                        <CardDescription>Detailed transaction log. AI flags suspicious or high-risk spending.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-96 overflow-y-auto">
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                {selectedTeen.card.transactions.slice(0, 10).map(tx => (
                                    <li key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${tx.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                                {tx.type === 'credit' ? <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-300" /> : <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-300" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{tx.description}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{tx.date} - {tx.merchant.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </p>
                                            {tx.isFlagged && <Badge variant="destructive" className="mt-1">AI Flagged</Badge>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-4 border-t dark:border-gray-800">
                            <Button variant="outline" className="w-full">View Full Transaction Ledger</Button>
                        </div>
                    </CardContent>
                </Card>

                <AISpendingInsights insights={selectedTeen.aiInsights} />
                
                <FinancialGoalTracker goals={selectedTeen.goals} />
            </div>

            {/* COLUMN 3: Behavioral & Coaching */}
            <div className="space-y-6">
                <BehavioralScorecard scoreData={selectedTeen.card.behavioralScore} />
                
                <AIChoreManager 
                    chores={selectedTeen.chores} 
                    handleChoreApproval={handleChoreApproval} 
                />

                <AICoachingChat />
            </div>
          </main>
        ) : (
            <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-900 rounded-xl border-4 border-dashed border-gray-300 dark:border-gray-700">
                <User className="w-16 h-16 text-gray-400" />
                <p className="mt-4 text-xl font-medium text-gray-600 dark:text-gray-300">Select a teen profile to access the AI Command Center.</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Use the profile selector above to begin managing finances.</p>
            </div>
        )}
      </div>
    </div>
  );
}