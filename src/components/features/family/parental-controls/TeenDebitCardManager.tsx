import React, { useState, useMemo, useCallback } from 'react';
import { Lock, Unlock, CreditCard, ClipboardList, CircleDollarSign, TrendingUp, TrendingDown, CheckCircle, MoreVertical, Settings, User } from 'lucide-react';

// Assuming these are Shadcn/ui components.
// In a real project, these would be imported from '@components/ui/*'.
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`p-6 border-b border-gray-200 dark:border-gray-800 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`p-6 ${className}`}>{children}</div>;
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }: { children: React.ReactNode, variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost', size?: 'default' | 'sm' | 'lg' | 'icon', className?: string, [key: string]: any }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
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
const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning', className?: string }) => {
    const variantClasses = {
        default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    }
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>{children}</span>
};

// Type Definitions
interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit';
}

interface Chore {
  id: string;
  title: string;
  allowance: number;
  status: 'pending' | 'completed' | 'approved';
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
  transactions: Transaction[];
}

interface Teen {
  id: string;
  name: string;
  avatarUrl: string;
  card: DebitCard;
  chores: Chore[];
}

// Mock Data
const MOCK_TEENS: Teen[] = [
  {
    id: 'teen-1',
    name: 'Alex',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    card: {
      last4: '4242',
      balance: 125.50,
      isLocked: false,
      spendingLimits: { daily: 50, weekly: 150, monthly: 500 },
      transactions: [
        { id: 't1', description: 'Spotify Subscription', amount: 9.99, date: '2023-10-25', type: 'debit' },
        { id: 't2', description: 'Weekly Allowance', amount: 20.00, date: '2023-10-23', type: 'credit' },
        { id: 't3', description: 'Movie Ticket', amount: 15.00, date: '2023-10-21', type: 'debit' },
      ],
    },
    chores: [
      { id: 'c1', title: 'Clean your room', allowance: 10, status: 'completed' },
      { id: 'c2', title: 'Walk the dog', allowance: 5, status: 'pending' },
      { id: 'c3', title: 'Do laundry', allowance: 7.50, status: 'approved' },
    ],
  },
  {
    id: 'teen-2',
    name: 'Samantha',
    avatarUrl: 'https://i.pravatar.cc/150?u=samantha',
    card: {
      last4: '1234',
      balance: 78.20,
      isLocked: true,
      spendingLimits: { daily: 30, weekly: 100, monthly: 400 },
      transactions: [
        { id: 't4', description: 'Bookstore', amount: 22.50, date: '2023-10-24', type: 'debit' },
        { id: 't5', description: 'Allowance: Mow lawn', amount: 25.00, date: '2023-10-22', type: 'credit' },
        { id: 't6', description: 'Ice Cream', amount: 5.75, date: '2023-10-20', type: 'debit' },
      ],
    },
    chores: [
      { id: 'c4', title: 'Mow the lawn', allowance: 25, status: 'approved' },
      { id: 'c5', title: 'Wash the dishes', allowance: 5, status: 'completed' },
      { id: 'c6', title: 'Homework help for sibling', allowance: 10, status: 'pending' },
    ],
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

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
                        { id: `t-${Date.now()}`, description: `Allowance: ${teen.chores.find(c => c.id === choreId)?.title}`, amount: allowance, date: new Date().toISOString().split('T')[0], type: 'credit' },
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

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Parental Controls</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your teen's debit cards, spending, and chores.</p>
        </header>

        <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Select a Teen</h2>
            <div className="flex items-center gap-4 flex-wrap">
                {teens.map(teen => (
                    <button
                        key={teen.id}
                        onClick={() => setSelectedTeenId(teen.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${selectedTeenId === teen.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/50' : 'border-transparent bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <Avatar>
                            <AvatarImage src={teen.avatarUrl} alt={teen.name} />
                            <AvatarFallback>{teen.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{teen.name}</span>
                    </button>
                ))}
            </div>
        </section>

        {selectedTeen ? (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                {selectedTeen.name}'s Debit Card
                            </CardTitle>
                            <CardDescription>Card ending in â¢â¢â¢â¢ {selectedTeen.card.last4}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5"/>
                        </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col justify-center p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">Current Balance</p>
                            <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(selectedTeen.card.balance)}</p>
                        </div>
                        <div className="flex flex-col justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                             <div className="flex items-center justify-between">
                                <Label htmlFor="card-lock" className="font-medium text-gray-800 dark:text-gray-200">
                                    Card {selectedTeen.card.isLocked ? 'Locked' : 'Active'}
                                </Label>
                                <Switch id="card-lock" checked={!selectedTeen.card.isLocked} onCheckedChange={() => handleLockToggle()} />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {selectedTeen.card.isLocked
                                    ? 'Card is frozen. No transactions can be made.'
                                    : 'Card is active and can be used for purchases.'
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Spending Limits
                        </CardTitle>
                        <CardDescription>Set maximum spending amounts to encourage budgeting.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="daily-limit">Daily Limit</Label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                <Input
                                    id="daily-limit"
                                    type="number"
                                    className="pl-7"
                                    value={selectedTeen.card.spendingLimits.daily}
                                    onChange={(e) => handleLimitChange('daily', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="weekly-limit">Weekly Limit</Label>
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                <Input
                                    id="weekly-limit"
                                    type="number"
                                    className="pl-7"
                                    value={selectedTeen.card.spendingLimits.weekly}
                                    onChange={(e) => handleLimitChange('weekly', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="monthly-limit">Monthly Limit</Label>
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                <Input
                                    id="monthly-limit"
                                    type="number"
                                    className="pl-7"
                                    value={selectedTeen.card.spendingLimits.monthly}
                                    onChange={(e) => handleLimitChange('monthly', parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Recent Transactions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {selectedTeen.card.transactions.slice(0, 5).map(tx => (
                                <li key={tx.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${tx.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                                            {tx.type === 'credit' ? <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-300" /> : <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-300" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200">{tx.description}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{tx.date}</p>
                                        </div>
                                    </div>
                                    <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="w-5 h-5" />
                            Chores & Allowance
                        </CardTitle>
                        <CardDescription>Approve completed chores to release allowance funds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {selectedTeen.chores.map(chore => (
                                <li key={chore.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{chore.title}</p>
                                        <p className="text-sm text-green-600 dark:text-green-400 font-semibold">{formatCurrency(chore.allowance)}</p>
                                    </div>
                                    {chore.status === 'completed' && (
                                        <Button size="sm" onClick={() => handleChoreApproval(chore.id, chore.allowance)}>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                    )}
                                    {chore.status === 'pending' && <Badge variant="warning">Pending</Badge>}
                                    {chore.status === 'approved' && <Badge variant="success">Paid</Badge>}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
          </main>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                <User className="w-12 h-12 text-gray-400" />
                <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Select a teen to manage their card.</p>
            </div>
        )}
      </div>
    </div>
  );
}