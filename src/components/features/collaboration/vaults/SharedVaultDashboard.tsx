```tsx
import React, { useState, useMemo } from 'react';
import { PiggyBank, Target, Users, Landmark, Home, Car, Plus, MoreHorizontal, ArrowUpRight, TrendingUp, Gift, GraduationCap } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'Admin' | 'Contributor';
}

interface Vault {
  id: string;
  name: string;
  type: 'Savings' | 'Investment';
  goal: string;
  currentAmount: number;
  targetAmount: number;
  members: string[]; // Array of member IDs
  icon: React.ElementType;
}

// --- MOCK DATA ---
const mockMembers: Member[] = [
  { id: 'm1', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice', role: 'Admin' },
  { id: 'm2', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob', role: 'Contributor' },
  { id: 'm3', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', role: 'Contributor' },
];

const mockVaults: Vault[] = [
  {
    id: 'v1',
    name: 'Vacation Fund',
    type: 'Savings',
    goal: 'Trip to Japan',
    currentAmount: 7500,
    targetAmount: 10000,
    members: ['m1', 'm2'],
    icon: Gift,
  },
  {
    id: 'v2',
    name: 'House Down Payment',
    type: 'Investment',
    goal: 'Our first home',
    currentAmount: 82000,
    targetAmount: 150000,
    members: ['m1', 'm2', 'm3'],
    icon: Home,
  },
  {
    id: 'v3',
    name: 'New Car',
    type: 'Savings',
    goal: 'Reliable family SUV',
    currentAmount: 18500,
    targetAmount: 40000,
    members: ['m1', 'm2'],
    icon: Car,
  },
  {
    id: 'v4',
    name: 'Emergency Fund',
    type: 'Savings',
    goal: '6 months of expenses',
    currentAmount: 25000,
    targetAmount: 25000,
    members: ['m1', 'm2'],
    icon: Landmark,
  },
    {
    id: 'v5',
    name: 'College Fund',
    type: 'Investment',
    goal: 'Higher education for kids',
    currentAmount: 35000,
    targetAmount: 200000,
    members: ['m1', 'm2', 'm3'],
    icon: GraduationCap,
  },
];

// --- HELPER COMPONENTS ---

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; change?: string }> = ({ title, value, icon: Icon, change }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <span className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</span>
      </div>
      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
        <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      </div>
    </div>
    {change && (
      <div className="flex items-center mt-4 text-sm text-green-600 dark:text-green-400">
        <ArrowUpRight className="h-4 w-4 mr-1" />
        <span>{change} in the last 30 days</span>
      </div>
    )}
  </div>
);

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
    <div
      className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

const MemberAvatar: React.FC<{ member: Member | undefined }> = ({ member }) => {
    if (!member) return null;
    return (
        <img
            src={member.avatarUrl}
            alt={member.name}
            title={member.name}
            className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 -ml-2 first:ml-0 hover:z-10 transition-transform hover:scale-110"
        />
    );
};

const VaultCard: React.FC<{ vault: Vault; allMembers: Member[] }> = ({ vault, allMembers }) => {
  const progress = (vault.currentAmount / vault.targetAmount) * 100;
  const vaultMembers = vault.members.map(memberId => allMembers.find(m => m.id === memberId));
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <vault.icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{vault.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{vault.goal}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
        <div className="my-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(vault.currentAmount)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                Goal: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(vault.targetAmount)}
            </span>
          </div>
          <ProgressBar value={progress} />
          <div className="text-right text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{progress.toFixed(1)}%</div>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="flex">
          {vaultMembers.slice(0, 4).map(member => <MemberAvatar key={member?.id} member={member} />)}
          {vaultMembers.length > 4 && 
            <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 -ml-2 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
              +{vaultMembers.length - 4}
            </div>
          }
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${vault.type === 'Investment' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
          {vault.type}
        </span>
      </div>
    </div>
  );
};


// --- MAIN DASHBOARD COMPONENT ---
export default function SharedVaultDashboard() {
  const [vaults, setVaults] = useState<Vault[]>(mockVaults);
  const [members, setMembers] = useState<Member[]>(mockMembers);

  const stats = useMemo(() => {
    const totalValue = vaults.reduce((sum, vault) => sum + vault.currentAmount, 0);
    const totalGoal = vaults.reduce((sum, vault) => sum + vault.targetAmount, 0);
    return {
      totalValue,
      totalGoal,
      numVaults: vaults.length,
      numMembers: members.length,
    };
  }, [vaults, members]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(amount);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shared Vaults</h1>
            <p className="mt-1 text-md text-gray-600 dark:text-gray-400">Collaborative finance for your family's goals.</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button className="flex items-center justify-center bg-white dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Users className="h-4 w-4 mr-2" />
              Invite Member
            </button>
            <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Create Vault
            </button>
          </div>
        </header>

        {/* Stat Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Value in Vaults" value={formatCurrency(stats.totalValue)} icon={Landmark} change="+5.2%" />
          <StatCard title="Overall Goal" value={formatCurrency(stats.totalGoal)} icon={Target} />
          <StatCard title="Active Vaults" value={stats.numVaults.toString()} icon={PiggyBank} />
          <StatCard title="Team Members" value={stats.numMembers.toString()} icon={Users} />
        </section>

        {/* Vaults Grid */}
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Your Vaults</h2>
                {/* Could add filter/sort controls here */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaults.map(vault => (
                    <VaultCard key={vault.id} vault={vault} allMembers={members} />
                ))}
                {/* Add new vault card */}
                <button className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 transition-all duration-300">
                    <Plus className="h-10 w-10 mb-2" />
                    <span className="font-semibold">Create a New Vault</span>
                </button>
            </div>
        </section>

        {/* Members & Activity Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-4">Members</h3>
                <ul className="space-y-4">
                    {members.map(member => (
                        <li key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">{member.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-4">Contribution History</h3>
                {/* Placeholder for a chart */}
                 <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                        <p>Contribution chart coming soon.</p>
                    </div>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
```