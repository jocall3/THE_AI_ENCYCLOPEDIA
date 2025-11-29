import React, { useState, useMemo } from 'react';
import { PiggyBank, Target, Users, Landmark, Home, Car, Plus, MoreHorizontal, ArrowUpRight, TrendingUp, Gift, GraduationCap } from 'lucide-react';

// --- TYPE DEFINITIONS ---

// Core User & Member Management
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Admin' | 'Contributor' | 'Viewer';
  permissions: string[]; // e.g., ['create_vault', 'edit_vault', 'invite_member']
  lastActive: string; // ISO date string
  bio: string;
  contactInfo: {
    phone?: string;
    linkedin?: string;
  };
}

interface Member extends UserProfile {
  vaultAccess: { vaultId: string; role: 'Admin' | 'Contributor' | 'Viewer' }[];
}

// Financial Transactions & Activity
interface Transaction {
  id: string;
  vaultId: string;
  memberId: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Investment';
  amount: number;
  date: string; // ISO date string
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface VaultActivity {
  id: string;
  vaultId: string;
  memberId: string;
  type: 'VaultCreated' | 'GoalUpdated' | 'MemberAdded' | 'Transaction' | 'AIInsightGenerated';
  timestamp: string; // ISO date string
  description: string;
  details?: any;
}

// Vaults & Goals
interface Vault {
  id: string;
  name: string;
  type: 'Savings' | 'Investment' | 'Debt Reduction' | 'Education';
  goal: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  members: string[]; // Array of member IDs
  icon: React.ElementType;
  status: 'Active' | 'Completed' | 'On Hold';
  riskLevel: 'Low' | 'Medium' | 'High';
  investmentStrategy?: string; // For investment vaults
  autoContributionAmount?: number;
  autoContributionFrequency?: 'Weekly' | 'Bi-Weekly' | 'Monthly';
}

// AI & Insights
interface AIRecommendation {
  id: string;
  vaultId?: string; // Can be general or vault-specific
  memberId?: string; // Can be general or member-specific
  type: 'SavingsOptimization' | 'InvestmentStrategy' | 'RiskMitigation' | 'GoalAdjustment' | 'CollaborationSuggestion';
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  actionable: boolean;
  suggestedAction?: string;
  timestamp: string; // ISO date string
  status: 'New' | 'Reviewed' | 'Implemented' | 'Dismissed';
}

interface FinancialProjection {
  date: string; // ISO date string
  projectedAmount: number;
  confidenceInterval: { lower: number; upper: number };
}

interface KPIData {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'Up' | 'Down' | 'Stable';
  changePercentage: number;
  description: string;
  icon: React.ElementType;
}

// Chat & Collaboration
interface ChatMessage {
  id: string;
  senderId: string;
  vaultId: string;
  timestamp: string; // ISO date string
  content: string;
  isAI?: boolean; // If message is from an AI assistant
}

interface ChatThread {
  id: string;
  vaultId: string;
  name: string;
  messages: ChatMessage[];
  participants: string[]; // Member IDs
  lastActivity: string; // ISO date string
}

// Audit & Compliance
interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO date string
  actorId: string; // Member ID
  action: string; // e.g., 'VaultCreated', 'MemberRoleUpdated', 'TransactionApproved'
  targetType: 'Vault' | 'Member' | 'System';
  targetId: string;
  details: any;
}

// --- MOCK DATA GENERATION UTILITIES ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatCompactCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

// --- MOCK DATA ---
const mockUsers: UserProfile[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=alice', role: 'Admin', permissions: ['manage_all'], lastActive: '2023-10-26T10:30:00Z', bio: 'Lead administrator and financial strategist.', contactInfo: { phone: '555-1234' } },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=bob', role: 'Contributor', permissions: ['create_vault', 'add_transaction'], lastActive: '2023-10-26T09:45:00Z', bio: 'Active contributor to family and personal vaults.', contactInfo: { linkedin: 'bob-smith' } },
  { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', role: 'Contributor', permissions: ['add_transaction'], lastActive: '2023-10-25T18:00:00Z', bio: 'Focuses on investment growth and long-term planning.', contactInfo: {} },
  { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=diana', role: 'Viewer', permissions: [], lastActive: '2023-10-24T11:00:00Z', bio: 'Observes financial progress and provides feedback.', contactInfo: {} },
  { id: 'u5', name: 'Eve Adams', email: 'eve@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=eve', role: 'Contributor', permissions: ['add_transaction'], lastActive: '2023-10-26T08:15:00Z', bio: 'Manages education and emergency funds.', contactInfo: {} },
];

const mockMembers: Member[] = mockUsers.map(user => ({
  ...user,
  vaultAccess: [], // Will be populated by vault data
}));

const mockVaults: Vault[] = [
  {
    id: 'v1',
    name: 'Japan Vacation Fund',
    type: 'Savings',
    goal: 'Experience the culture and beauty of Japan',
    description: 'Saving for a two-week family trip to Japan, including flights, accommodation, and activities.',
    currentAmount: 7500,
    targetAmount: 10000,
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2024-06-30T00:00:00Z',
    members: ['u1', 'u2'],
    icon: Gift,
    status: 'Active',
    riskLevel: 'Low',
    autoContributionAmount: 200,
    autoContributionFrequency: 'Monthly',
  },
  {
    id: 'v2',
    name: 'First Home Down Payment',
    type: 'Investment',
    goal: 'Secure a down payment for our dream home',
    description: 'Aggressive investment strategy to accumulate funds for a significant down payment on a family home.',
    currentAmount: 82000,
    targetAmount: 150000,
    startDate: '2022-03-15T00:00:00Z',
    endDate: '2025-12-31T00:00:00Z',
    members: ['u1', 'u2', 'u3'],
    icon: Home,
    status: 'Active',
    riskLevel: 'Medium',
    investmentStrategy: 'Diversified Growth Portfolio',
  },
  {
    id: 'v3',
    name: 'New Family SUV',
    type: 'Savings',
    goal: 'Purchase a reliable and spacious family SUV',
    description: 'Saving specifically for a new vehicle, considering both new and certified pre-owned options.',
    currentAmount: 18500,
    targetAmount: 40000,
    startDate: '2023-05-01T00:00:00Z',
    endDate: '2024-11-30T00:00:00Z',
    members: ['u1', 'u2'],
    icon: Car,
    status: 'Active',
    riskLevel: 'Low',
  },
  {
    id: 'v4',
    name: 'Emergency Fund',
    type: 'Savings',
    goal: 'Maintain 6 months of living expenses for unforeseen circumstances',
    description: 'A critical fund for unexpected events like job loss, medical emergencies, or major home repairs.',
    currentAmount: 25000,
    targetAmount: 25000,
    startDate: '2021-01-01T00:00:00Z',
    endDate: '2021-12-31T00:00:00Z', // Goal reached, but still active for maintenance
    members: ['u1', 'u2'],
    icon: Landmark,
    status: 'Completed', // Reached target, now maintaining
    riskLevel: 'Low',
  },
  {
    id: 'v5',
    name: 'Children\'s College Fund',
    type: 'Investment',
    goal: 'Ensure higher education for all children',
    description: 'Long-term investment for future college tuition and related educational expenses.',
    currentAmount: 35000,
    targetAmount: 200000,
    startDate: '2020-09-01T00:00:00Z',
    endDate: '2035-08-31T00:00:00Z',
    members: ['u1', 'u2', 'u3', 'u5'],
    icon: GraduationCap,
    status: 'Active',
    riskLevel: 'Medium',
    investmentStrategy: 'Aggressive Long-Term Growth',
  },
  {
    id: 'v6',
    name: 'Retirement Portfolio',
    type: 'Investment',
    goal: 'Build a robust retirement fund for financial independence',
    description: 'Diversified portfolio aimed at maximizing growth for retirement, with regular contributions.',
    currentAmount: 150000,
    targetAmount: 1000000,
    startDate: '2015-01-01T00:00:00Z',
    endDate: '2040-12-31T00:00:00Z',
    members: ['u1', 'u3'],
    icon: PiggyBank,
    status: 'Active',
    riskLevel: 'High',
    investmentStrategy: 'Balanced Growth & Income',
    autoContributionAmount: 500,
    autoContributionFrequency: 'Monthly',
  },
  {
    id: 'v7',
    name: 'Business Expansion Capital',
    type: 'Investment',
    goal: 'Fund the next phase of business growth and innovation',
    description: 'Capital accumulation for strategic business expansion, including R&D and market penetration.',
    currentAmount: 250000,
    targetAmount: 750000,
    startDate: '2023-03-01T00:00:00Z',
    endDate: '2026-03-01T00:00:00Z',
    members: ['u1', 'u2', 'u4'],
    icon: Landmark,
    status: 'Active',
    riskLevel: 'High',
    investmentStrategy: 'Venture Capital & Growth Stocks',
  },
];

// Populate vaultAccess for members
mockMembers.forEach(member => {
  mockVaults.forEach(vault => {
    if (vault.members.includes(member.id)) {
      member.vaultAccess.push({ vaultId: vault.id, role: member.role }); // Simplified: member's global role applies to vault
    }
  });
});

const mockTransactions: Transaction[] = [];
mockVaults.forEach(vault => {
  for (let i = 0; i < 20; i++) { // Generate 20 transactions per vault
    const type: Transaction['type'] = Math.random() > 0.7 ? 'Withdrawal' : (Math.random() > 0.5 ? 'Investment' : 'Deposit');
    const amount = type === 'Withdrawal' ? Math.floor(Math.random() * 1000) + 100 : Math.floor(Math.random() * 2000) + 500;
    const memberId = vault.members[Math.floor(Math.random() * vault.members.length)];
    mockTransactions.push({
      id: generateId(),
      vaultId: vault.id,
      memberId: memberId,
      type: type,
      amount: amount,
      date: getRandomDate(new Date(vault.startDate), new Date()).toISOString(),
      description: `${type} for ${vault.name}`,
      status: 'Completed',
    });
  }
});

const mockAIRecommendations: AIRecommendation[] = [
  {
    id: generateId(),
    vaultId: 'v1',
    type: 'SavingsOptimization',
    title: 'Accelerate Japan Fund',
    description: 'Increase monthly contributions by $50 to reach your Japan vacation goal 2 months earlier.',
    severity: 'Medium',
    actionable: true,
    suggestedAction: 'Adjust auto-contribution for Japan Vacation Fund.',
    timestamp: '2023-10-20T09:00:00Z',
    status: 'New',
  },
  {
    id: generateId(),
    vaultId: 'v2',
    type: 'InvestmentStrategy',
    title: 'Diversify Home Down Payment',
    description: 'Consider rebalancing 10% of your Home Down Payment vault into emerging markets for higher potential returns.',
    severity: 'High',
    actionable: true,
    suggestedAction: 'Review investment portfolio for v2.',
    timestamp: '2023-10-18T14:30:00Z',
    status: 'New',
  },
  {
    id: generateId(),
    vaultId: 'v5',
    type: 'GoalAdjustment',
    title: 'Review College Fund Target',
    description: 'Based on current inflation and tuition trends, your college fund target may need to be adjusted upwards by 15%.',
    severity: 'Critical',
    actionable: true,
    suggestedAction: 'Update target amount for Children\'s College Fund.',
    timestamp: '2023-10-15T11:00:00Z',
    status: 'Reviewed',
  },
  {
    id: generateId(),
    memberId: 'u1',
    type: 'RiskMitigation',
    title: 'Emergency Fund Review',
    description: 'Your emergency fund is fully funded. Consider allocating surplus to a higher-yield savings account or short-term investment.',
    severity: 'Low',
    actionable: true,
    suggestedAction: 'Explore options for v4 surplus funds.',
    timestamp: '2023-10-10T16:00:00Z',
    status: 'Implemented',
  },
  {
    id: generateId(),
    type: 'CollaborationSuggestion',
    title: 'Engage New Member Diana',
    description: 'Diana Prince has viewer access to Business Expansion Capital. Encourage her to provide feedback or insights.',
    severity: 'Low',
    actionable: true,
    suggestedAction: 'Send a welcome message to Diana in v7 chat.',
    timestamp: '2023-10-22T10:00:00Z',
    status: 'New',
  },
];

const mockKPIData: KPIData[] = [
  { id: 'kpi1', name: 'Total Assets Under Management', value: mockVaults.reduce((sum, v) => sum + v.currentAmount, 0), unit: '$', trend: 'Up', changePercentage: 5.2, description: 'Combined value across all active vaults.' , icon: Landmark},
  { id: 'kpi2', name: 'Average Goal Attainment', value: mockVaults.filter(v => v.status === 'Completed').length / mockVaults.length * 100, unit: '%', trend: 'Up', changePercentage: 1.5, description: 'Percentage of vaults that have reached their target goal.' , icon: Target},
  { id: 'kpi3', name: 'Active Collaborators', value: new Set(mockVaults.flatMap(v => v.members)).size, unit: 'members', trend: 'Up', changePercentage: 2.1, description: 'Unique members actively participating in vaults.' , icon: Users},
  { id: 'kpi4', name: 'Monthly Contribution Rate', value: mockVaults.reduce((sum, v) => sum + (v.autoContributionAmount || 0), 0) + 1200, unit: '$', trend: 'Up', changePercentage: 3.8, description: 'Total estimated monthly contributions across all vaults.' , icon: PiggyBank},
];

const mockChatThreads: ChatThread[] = mockVaults.map(vault => ({
  id: generateId(),
  vaultId: vault.id,
  name: `${vault.name} Discussion`,
  participants: vault.members,
  lastActivity: getRandomDate(new Date(vault.startDate), new Date()).toISOString(),
  messages: [
    { id: generateId(), senderId: vault.members[0], vaultId: vault.id, timestamp: getRandomDate(new Date(vault.startDate), new Date()).toISOString(), content: `Hey team, how are we feeling about the progress on the ${vault.name}?` },
    { id: generateId(), senderId: vault.members[1], vaultId: vault.id, timestamp: getRandomDate(new Date(vault.startDate), new Date()).toISOString(), content: `Looking good! I just made a deposit of $${Math.floor(Math.random() * 500) + 100}.` },
    { id: generateId(), senderId: 'AI', vaultId: vault.id, timestamp: getRandomDate(new Date(vault.startDate), new Date()).toISOString(), content: `AI Assistant: Based on current contributions, you are projected to reach your goal by ${formatDate(new Date(new Date().setMonth(new Date().getMonth() + Math.floor(Math.random() * 6) + 1)).toISOString())}. Consider increasing contributions by 5% to accelerate.` , isAI: true},
  ],
}));

const mockAuditLogs: AuditLogEntry[] = [
  { id: generateId(), timestamp: '2023-10-26T10:05:00Z', actorId: 'u1', action: 'VaultCreated', targetType: 'Vault', targetId: 'v7', details: { name: 'Business Expansion Capital' } },
  { id: generateId(), timestamp: '2023-10-26T09:50:00Z', actorId: 'u2', action: 'Transaction', targetType: 'Vault', targetId: 'v1', details: { type: 'Deposit', amount: 250 } },
  { id: generateId(), timestamp: '2023-10-25T14:15:00Z', actorId: 'u1', action: 'MemberRoleUpdated', targetType: 'Member', targetId: 'u4', details: { vaultId: 'v7', oldRole: 'Viewer', newRole: 'Contributor' } },
  { id: generateId(), timestamp: '2023-10-24T11:30:00Z', actorId: 'u3', action: 'InvestmentStrategyUpdated', targetType: 'Vault', targetId: 'v6', details: { oldStrategy: 'Growth', newStrategy: 'Balanced Growth & Income' } },
];

const mockVaultActivities: VaultActivity[] = [];
mockVaults.forEach(vault => {
  for (let i = 0; i < 10; i++) {
    const memberId = vault.members[Math.floor(Math.random() * vault.members.length)];
    const activityType: VaultActivity['type'] = Math.random() > 0.8 ? 'AIInsightGenerated' : (Math.random() > 0.6 ? 'GoalUpdated' : (Math.random() > 0.3 ? 'MemberAdded' : 'Transaction'));
    let description = '';
    let details: any = {};

    switch (activityType) {
      case 'VaultCreated':
        description = `${mockMembers.find(m => m.id === memberId)?.name} created the vault.`;
        break;
      case 'GoalUpdated':
        description = `${mockMembers.find(m => m.id === memberId)?.name} updated the goal for ${vault.name}.`;
        details = { oldGoal: 'Old Goal', newGoal: vault.goal };
        break;
      case 'MemberAdded':
        const newMember = mockMembers[Math.floor(Math.random() * mockMembers.length)];
        description = `${mockMembers.find(m => m.id === memberId)?.name} added ${newMember.name} to ${vault.name}.`;
        details = { newMemberId: newMember.id };
        break;
      case 'Transaction':
        const transaction = mockTransactions.find(t => t.vaultId === vault.id && t.memberId === memberId);
        description = `${mockMembers.find(m => m.id === memberId)?.name} made a ${transaction?.type.toLowerCase()} of ${formatCurrency(transaction?.amount || 0)} to ${vault.name}.`;
        details = { transactionId: transaction?.id, amount: transaction?.amount, type: transaction?.type };
        break;
      case 'AIInsightGenerated':
        const insight = mockAIRecommendations[Math.floor(Math.random() * mockAIRecommendations.length)];
        description = `AI generated a new insight for ${vault.name}: "${insight.title}".`;
        details = { insightId: insight.id, insightType: insight.type };
        break;
    }

    mockVaultActivities.push({
      id: generateId(),
      vaultId: vault.id,
      memberId: memberId,
      type: activityType,
      timestamp: getRandomDate(new Date(vault.startDate), new Date()).toISOString(),
      description: description,
      details: details,
    });
  }
});


// --- HELPER COMPONENTS ---

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; change?: string; trend?: 'Up' | 'Down' | 'Stable'; changePercentage?: number }> = ({ title, value, icon: Icon, change, trend, changePercentage }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
      <div className={`flex items-center mt-4 text-sm ${trend === 'Up' ? 'text-green-600 dark:text-green-400' : trend === 'Down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {trend === 'Up' && <ArrowUpRight className="h-4 w-4 mr-1" />}
        {trend === 'Down' && <ArrowUpRight className="h-4 w-4 mr-1 rotate-180 text-red-600 dark:text-red-400" />}
        <span>{change} {changePercentage ? `(${changePercentage.toFixed(1)}%)` : ''} in the last 30 days</span>
      </div>
    )}
  </div>
);

const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className }) => (
  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 ${className || ''}`}>
    <div
      className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    ></div>
  </div>
);

const MemberAvatar: React.FC<{ member: Member | undefined; size?: 'sm' | 'md' | 'lg' }> = ({ member, size = 'md' }) => {
    if (!member) return null;
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
    };
    return (
        <img
            src={member.avatarUrl}
            alt={member.name}
            title={member.name}
            className={`${sizeClasses[size]} rounded-full border-2 border-white dark:border-gray-800 -ml-2 first:ml-0 hover:z-10 transition-transform hover:scale-110 object-cover`}
        />
    );
};

const VaultCard: React.FC<{ vault: Vault; allMembers: Member[]; onEditVault: (vault: Vault) => void }> = ({ vault, allMembers, onEditVault }) => {
  const progress = (vault.currentAmount / vault.targetAmount) * 100;
  const vaultMembers = vault.members.map(memberId => allMembers.find(m => m.id === memberId)).filter(Boolean) as Member[];
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700">
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
          <button onClick={() => onEditVault(vault)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        
        <div className="my-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {formatCurrency(vault.currentAmount)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                Goal: {formatCurrency(vault.targetAmount)}
            </span>
          </div>
          <ProgressBar value={progress} />
          <div className="text-right text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{progress.toFixed(1)}%</div>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="flex -space-x-2">
          {vaultMembers.slice(0, 4).map(member => <MemberAvatar key={member.id} member={member} />)}
          {vaultMembers.length > 4 && 
            <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 -ml-2 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
              +{vaultMembers.length - 4}
            </div>
          }
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${vault.type === 'Investment' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : vault.type === 'Savings' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'}`}>
          {vault.type}
        </span>
      </div>
    </div>
  );
};

const AIInsightCard: React.FC<{ insight: AIRecommendation; onAction: (insightId: string, action: string) => void }> = ({ insight, onAction }) => {
  const severityClasses = {
    Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    High: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    Critical: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h4 className="font-semibold text-gray-800 dark:text-white">{insight.title}</h4>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${severityClasses[insight.severity]}`}>
          {insight.severity}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">{insight.description}</p>
      {insight.suggestedAction && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
          <span className="font-medium">Suggested Action:</span> {insight.suggestedAction}
        </p>
      )}
      <div className="flex justify-end space-x-2 mt-auto">
        {insight.actionable && insight.status === 'New' && (
          <button onClick={() => onAction(insight.id, 'implement')} className="text-xs px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Implement
          </button>
        )}
        {insight.status === 'New' && (
          <button onClick={() => onAction(insight.id, 'dismiss')} className="text-xs px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Dismiss
          </button>
        )}
        {insight.status !== 'New' && (
          <span className="text-xs text-gray-500 dark:text-gray-400 italic">Status: {insight.status}</span>
        )}
      </div>
    </div>
  );
};

const TransactionHistory: React.FC<{ transactions: Transaction[]; members: Member[] }> = ({ transactions, members }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Recent Transactions</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Member
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(tx => (
            <tr key={tx.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(tx.date)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  tx.type === 'Deposit' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                  tx.type === 'Withdrawal' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                }`}>
                  {tx.type}
                </span>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.type === 'Withdrawal' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {tx.type === 'Withdrawal' ? '-' : ''}{formatCurrency(tx.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {members.find(m => m.id === tx.memberId)?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{tx.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 text-right">
      <button onClick={() => {}} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
        View All Transactions <ArrowUpRight className="inline-block h-4 w-4 ml-1" />
      </button>
    </div>
  </div>
);

const KPIDisplay: React.FC<{ kpis: KPIData[] }> = ({ kpis }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {kpis.map(kpi => (
      <StatCard
        key={kpi.id}
        title={kpi.name}
        value={`${formatCompactCurrency(kpi.value)}${kpi.unit === '%' ? '%' : ''}`}
        icon={kpi.icon}
        change={`${kpi.trend === 'Up' ? '+' : '-'}${kpi.changePercentage.toFixed(1)}%`}
        trend={kpi.trend}
        changePercentage={kpi.changePercentage}
      />
    ))}
  </div>
);

const VaultActivityFeed: React.FC<{ activities: VaultActivity[]; members: Member[] }> = ({ activities, members }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Recent Vault Activity</h3>
    <ul className="space-y-4">
      {activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 7).map(activity => (
        <li key={activity.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <MemberAvatar member={members.find(m => m.id === activity.memberId)} size="sm" />
          </div>
          <div className="flex-grow">
            <p className="text-sm text-gray-800 dark:text-white">
              <span className="font-medium">{members.find(m => m.id === activity.memberId)?.name || 'System'}</span> {activity.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDateTime(activity.timestamp)}</p>
          </div>
        </li>
      ))}
    </ul>
    <div className="mt-4 text-right">
      <button onClick={() => {}} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
        View All Activity <ArrowUpRight className="inline-block h-4 w-4 ml-1" />
      </button>
    </div>
  </div>
);

const ChatInterface: React.FC<{ thread: ChatThread; currentUserId: string; members: Member[]; onSendMessage: (vaultId: string, content: string) => void }> = ({ thread, currentUserId, members, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [thread.messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(thread.vaultId, message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{thread.name}</h3>
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
        {thread.messages.map(msg => {
          const sender = members.find(m => m.id === msg.senderId);
          const isCurrentUser = msg.senderId === currentUserId;
          const isAI = msg.isAI;
          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} space-x-2 ${isCurrentUser ? 'space-x-reverse' : ''}`}>
                {!isCurrentUser && !isAI && <MemberAvatar member={sender} size="sm" />}
                {isAI && <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full"><TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /></div>}
                <div className={`p-3 rounded-lg ${isCurrentUser ? 'bg-indigo-600 text-white' : isAI ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  {!isCurrentUser && !isAI && <p className="text-xs font-semibold mb-1">{sender?.name}</p>}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : isAI ? 'text-purple-400 dark:text-purple-500' : 'text-gray-500 dark:text-gray-400'}`}>{formatDateTime(msg.timestamp)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button onClick={handleSendMessage} className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <ArrowUpRight className="h-5 w-5 rotate-90" />
        </button>
      </div>
    </div>
  );
};

const MemberProfileCard: React.FC<{ member: Member; onEditMember: (member: Member) => void }> = ({ member, onEditMember }) => (
  <li className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <div className="flex items-center">
      <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full mr-3 object-cover" />
      <div>
        <p className="font-semibold text-gray-800 dark:text-white">{member.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
      </div>
    </div>
    <button onClick={() => onEditMember(member)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
      <MoreHorizontal className="h-5 w-5" />
    </button>
  </li>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <Plus className="h-6 w-6 rotate-45" /> {/* Using Plus icon rotated for close */}
        </button>
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          {children}
        </div>
      </div>
    </div>
  );
};

const VaultSettingsModal: React.FC<{ isOpen: boolean; onClose: () => void; vault: Vault; allMembers: Member[]; onSave: (vault: Vault) => void }> = ({ isOpen, onClose, vault, allMembers, onSave }) => {
  const [editedVault, setEditedVault] = useState<Vault>(vault);

  React.useEffect(() => {
    setEditedVault(vault);
  }, [vault]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setEditedVault(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setEditedVault(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMemberChange = (memberId: string, isChecked: boolean) => {
    setEditedVault(prev => {
      const newMembers = isChecked
        ? [...new Set([...prev.members, memberId])]
        : prev.members.filter(id => id !== memberId);
      return { ...prev, members: newMembers };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedVault);
    onClose();
  };

  if (!vault) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Vault: ${vault.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vault Name</label>
          <input type="text" name="name" id="name" value={editedVault.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        </div>
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
          <input type="text" name="goal" id="goal" value={editedVault.goal} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea name="description" id="description" value={editedVault.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Amount</label>
            <input type="number" name="currentAmount" id="currentAmount" value={editedVault.currentAmount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
          </div>
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount</label>
            <input type="number" name="targetAmount" id="targetAmount" value={editedVault.targetAmount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
          </div>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vault Type</label>
          <select name="type" id="type" value={editedVault.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
            <option value="Savings">Savings</option>
            <option value="Investment">Investment</option>
            <option value="Debt Reduction">Debt Reduction</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vault Members</label>
          <div className="grid grid-cols-2 gap-2">
            {allMembers.map(member => (
              <div key={member.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`member-${member.id}`}
                  checked={editedVault.members.includes(member.id)}
                  onChange={(e) => handleMemberChange(member.id, e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor={`member-${member.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                  <img src={member.avatarUrl} alt={member.name} className="h-6 w-6 rounded-full mr-2" />
                  {member.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

const CreateVaultModal: React.FC<{ isOpen: boolean; onClose: () => void; allMembers: Member[]; onCreate: (newVault: Omit<Vault, 'id' | 'status' | 'riskLevel'>) => void }> = ({ isOpen, onClose, allMembers, onCreate }) => {
  const [newVaultData, setNewVaultData] = useState<Omit<Vault, 'id' | 'status' | 'riskLevel'>>({
    name: '',
    type: 'Savings',
    goal: '',
    description: '',
    currentAmount: 0,
    targetAmount: 0,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    members: [],
    icon: PiggyBank, // Default icon
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setNewVaultData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setNewVaultData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMemberChange = (memberId: string, isChecked: boolean) => {
    setNewVaultData(prev => {
      const newMembers = isChecked
        ? [...new Set([...prev.members, memberId])]
        : prev.members.filter(id => id !== memberId);
      return { ...prev, members: newMembers };
    });
  };

  const handleIconChange = (icon: React.ElementType) => {
    setNewVaultData(prev => ({ ...prev, icon }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(newVaultData);
    onClose();
    setNewVaultData({ // Reset form
      name: '', type: 'Savings', goal: '', description: '', currentAmount: 0, targetAmount: 0,
      startDate: new Date().toISOString(), endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      members: [], icon: PiggyBank,
    });
  };

  const availableIcons = [PiggyBank, Target, Users, Landmark, Home, Car, Gift, GraduationCap];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Vault">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vault Name</label>
          <input type="text" name="name" id="name" value={newVaultData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        </div>
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
          <input type="text" name="goal" id="goal" value={newVaultData.goal} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea name="description" id="description" value={newVaultData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Starting Amount</label>
            <input type="number" name="currentAmount" id="currentAmount" value={newVaultData.currentAmount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
          </div>
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount</label>
            <input type="number" name="targetAmount" id="targetAmount" value={newVaultData.targetAmount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
          </div>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vault Type</label>
          <select name="type" id="type" value={newVaultData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
            <option value="Savings">Savings</option>
            <option value="Investment">Investment</option>
            <option value="Debt Reduction">Debt Reduction</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Icon</label>
          <div className="flex flex-wrap gap-2">
            {availableIcons.map((Icon, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleIconChange(Icon)}
                className={`p-3 rounded-lg border-2 ${newVaultData.icon === Icon ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Initial Members</label>
          <div className="grid grid-cols-2 gap-2">
            {allMembers.map(member => (
              <div key={member.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`new-member-${member.id}`}
                  checked={newVaultData.members.includes(member.id)}
                  onChange={(e) => handleMemberChange(member.id, e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor={`new-member-${member.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                  <img src={member.avatarUrl} alt={member.name} className="h-6 w-6 rounded-full mr-2" />
                  {member.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Create Vault
          </button>
        </div>
      </form>
    </Modal>
  );
};

const InviteMemberModal: React.FC<{ isOpen: boolean; onClose: () => void; onInvite: (email: string, role: 'Admin' | 'Contributor' | 'Viewer', vaultId?: string) => void; vaults: Vault[] }> = ({ isOpen, onClose, onInvite, vaults }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Contributor' | 'Viewer'>('Contributor');
  const [selectedVaultId, setSelectedVaultId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(email, role, selectedVaultId || undefined);
    setEmail('');
    setRole('Contributor');
    setSelectedVaultId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite New Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
          <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value as 'Admin' | 'Contributor' | 'Viewer')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
            <option value="Admin">Admin</option>
            <option value="Contributor">Contributor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
        <div>
          <label htmlFor="vault" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign to Specific Vault (Optional)</label>
          <select name="vault" id="vault" value={selectedVaultId} onChange={(e) => setSelectedVaultId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
            <option value="">No specific vault (Global access based on role)</option>
            {vaults.map(vault => (
              <option key={vault.id} value={vault.id}>{vault.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Send Invitation
          </button>
        </div>
      </form>
    </Modal>
  );
};

const FinancialProjectionChart: React.FC<{ vault: Vault }> = ({ vault }) => {
  // Simulate a simple projection
  const generateProjection = (vault: Vault, months: number = 12): FinancialProjection[] => {
    const data: FinancialProjection[] = [];
    let current = vault.currentAmount;
    const monthlyGrowthRate = vault.type === 'Investment' ? 0.008 : 0.002; // 0.8% for investment, 0.2% for savings
    const monthlyContribution = vault.autoContributionAmount || 0;
    const startDate = new Date();

    for (let i = 0; i <= months; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      current = current * (1 + monthlyGrowthRate) + monthlyContribution;
      data.push({
        date: date.toISOString(),
        projectedAmount: current,
        confidenceInterval: { lower: current * 0.95, upper: current * 1.05 }, // Simple +/- 5%
      });
    }
    return data;
  };

  const projectionData = useMemo(() => generateProjection(vault), [vault]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">AI-Powered Financial Projection for {vault.name}</h3>
      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg relative">
        {/* Simple text-based chart simulation */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(vault.targetAmount)}</span>
          </div>
          <ProgressBar value={(vault.currentAmount / vault.targetAmount) * 100} className="mb-2" />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Start: {formatDate(vault.startDate)}</span>
            <span>Target: {formatDate(vault.endDate)}</span>
          </div>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 z-10">
          <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50"/>
          <p>Detailed projection chart visualization coming soon.</p>
          <p className="text-sm mt-2">
            Projected to reach {formatCurrency(projectionData[projectionData.length - 1].projectedAmount)} by {formatDate(projectionData[projectionData.length - 1].date)}.
          </p>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>AI analysis suggests a {vault.type === 'Investment' ? 'moderate growth' : 'steady savings'} trajectory. Consider AI recommendations for optimization.</p>
      </div>
    </div>
  );
};

const RiskAssessmentPanel: React.FC<{ vault: Vault }> = ({ vault }) => {
  const riskColor = {
    Low: 'text-green-600 dark:text-green-400',
    Medium: 'text-yellow-600 dark:text-yellow-400',
    High: 'text-orange-600 dark:text-orange-400',
  };

  const riskDescription = {
    Low: 'This vault has a low risk profile, primarily focused on capital preservation and steady growth.',
    Medium: 'This vault carries a moderate risk, balancing growth potential with some exposure to market fluctuations.',
    High: 'This vault has a high risk profile, aiming for aggressive growth with significant exposure to market volatility.',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">AI Risk Assessment</h3>
      <div className="flex items-center space-x-3 mb-4">
        <Target className={`h-6 w-6 ${riskColor[vault.riskLevel]}`} />
        <span className={`text-xl font-bold ${riskColor[vault.riskLevel]}`}>{vault.riskLevel} Risk</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{riskDescription[vault.riskLevel]}</p>
      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
        <li><span className="font-medium">Volatility Index:</span> {Math.floor(Math.random() * 5) + 1}/5</li>
        <li><span className="font-medium">Diversification Score:</span> {Math.floor(Math.random() * 100)}%</li>
        <li><span className="font-medium">Liquidity Rating:</span> {vault.type === 'Savings' ? 'High' : 'Medium'}</li>
      </ul>
      <div className="mt-4 text-right">
        <button onClick={() => {}} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
          View Detailed Report <ArrowUpRight className="inline-block h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

const AuditLogViewer: React.FC<{ logs: AuditLogEntry[]; members: Member[] }> = ({ logs, members }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Audit Log & Compliance</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Action
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Target
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5).map(log => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDateTime(log.timestamp)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {members.find(m => m.id === log.actorId)?.name || 'System'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.action}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.targetType} ({log.targetId})</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 text-right">
      <button onClick={() => {}} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
        View Full Audit Trail <ArrowUpRight className="inline-block h-4 w-4 ml-1" />
      </button>
    </div>
  </div>
);


// --- MAIN DASHBOARD COMPONENT ---
export default function SharedVaultDashboard() {
  const [vaults, setVaults] = useState<Vault[]>(mockVaults);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(mockAIRecommendations);
  const [kpis, setKpis] = useState<KPIData[]>(mockKPIData);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(mockChatThreads);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [vaultActivities, setVaultActivities] = useState<VaultActivity[]>(mockVaultActivities);

  const [isCreateVaultModalOpen, setIsCreateVaultModalOpen] = useState(false);
  const [isEditVaultModalOpen, setIsEditVaultModalOpen] = useState(false);
  const [selectedVaultForEdit, setSelectedVaultForEdit] = useState<Vault | null>(null);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  // Current user (for chat simulation)
  const currentUserId = 'u1'; // Alice Johnson is the current logged-in user

  const dashboardStats = useMemo(() => {
    const totalValue = vaults.reduce((sum, vault) => sum + vault.currentAmount, 0);
    const totalGoal = vaults.reduce((sum, vault) => sum + vault.targetAmount, 0);
    const completedVaults = vaults.filter(v => v.status === 'Completed').length;
    const totalContributionsLast30Days = transactions
      .filter(tx => new Date(tx.date) > new Date(new Date().setDate(new Date().getDate() - 30)) && tx.type === 'Deposit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    return {
      totalValue,
      totalGoal,
      numVaults: vaults.length,
      numMembers: members.length,
      completedVaults,
      totalContributionsLast30Days,
    };
  }, [vaults, members, transactions]);

  const handleSaveVault = (updatedVault: Vault) => {
    setVaults(prevVaults => prevVaults.map(v => v.id === updatedVault.id ? updatedVault : v));
    setSelectedVaultForEdit(null);
    setIsEditVaultModalOpen(false);
    // Simulate AI re-evaluation after vault update
    console.log(`AI re-evaluating vault ${updatedVault.name} after update.`);
  };

  const handleCreateVault = (newVaultData: Omit<Vault, 'id' | 'status' | 'riskLevel'>) => {
    const newVault: Vault = {
      ...newVaultData,
      id: generateId(),
      status: 'Active',
      riskLevel: newVaultData.type === 'Investment' ? 'Medium' : 'Low', // AI-assigned default risk
    };
    setVaults(prevVaults => [...prevVaults, newVault]);
    setAuditLogs(prevLogs => [...prevLogs, {
      id: generateId(),
      timestamp: new Date().toISOString(),
      actorId: currentUserId,
      action: 'VaultCreated',
      targetType: 'Vault',
      targetId: newVault.id,
      details: { name: newVault.name, type: newVault.type },
    }]);
    setVaultActivities(prevActivities => [...prevActivities, {
      id: generateId(),
      vaultId: newVault.id,
      memberId: currentUserId,
      type: 'VaultCreated',
      timestamp: new Date().toISOString(),
      description: `${members.find(m => m.id === currentUserId)?.name} created the vault "${newVault.name}".`,
    }]);
    // Simulate AI generating initial recommendations for new vault
    setAiRecommendations(prev => [...prev, {
      id: generateId(),
      vaultId: newVault.id,
      type: 'SavingsOptimization',
      title: `Initial Setup for ${newVault.name}`,
      description: `AI suggests reviewing initial contribution plan for optimal goal attainment.`,
      severity: 'Low',
      actionable: true,
      suggestedAction: 'Set up auto-contributions.',
      timestamp: new Date().toISOString(),
      status: 'New',
    }]);
  };

  const handleInviteMember = (email: string, role: 'Admin' | 'Contributor' | 'Viewer', vaultId?: string) => {
    const newMemberId = generateId();
    const newMember: Member = {
      id: newMemberId,
      name: `New Member (${email.split('@')[0]})`, // Simplified name for mock
      email: email,
      avatarUrl: `https://i.pravatar.cc/150?u=${newMemberId}`,
      role: role,
      permissions: role === 'Admin' ? ['manage_all'] : (role === 'Contributor' ? ['create_vault', 'add_transaction'] : []),
      lastActive: new Date().toISOString(),
      bio: 'Newly invited member.',
      contactInfo: {},
      vaultAccess: vaultId ? [{ vaultId, role }] : [],
    };
    setMembers(prevMembers => [...prevMembers, newMember]);
    setAuditLogs(prevLogs => [...prevLogs, {
      id: generateId(),
      timestamp: new Date().toISOString(),
      actorId: currentUserId,
      action: 'MemberInvited',
      targetType: 'Member',
      targetId: newMember.id,
      details: { email, role, vaultId },
    }]);
    console.log(`AI analyzing new member ${newMember.name} for collaboration opportunities.`);
  };

  const handleAIRecommendationAction = (insightId: string, action: string) => {
    setAiRecommendations(prev => prev.map(rec => 
      rec.id === insightId ? { ...rec, status: action === 'implement' ? 'Implemented' : 'Dismissed', timestamp: new Date().toISOString() } : rec
    ));
    setAuditLogs(prevLogs => [...prevLogs, {
      id: generateId(),
      timestamp: new Date().toISOString(),
      actorId: currentUserId,
      action: `AIRecommendation${action === 'implement' ? 'Implemented' : 'Dismissed'}`,
      targetType: 'System',
      targetId: insightId,
      details: { action, insightId },
    }]);
  };

  const handleSendMessage = (vaultId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: generateId(),
      senderId: currentUserId,
      vaultId: vaultId,
      timestamp: new Date().toISOString(),
      content: content,
    };
    setChatThreads(prevThreads => prevThreads.map(thread =>
      thread.vaultId === vaultId
        ? { ...thread, messages: [...thread.messages, newMessage], lastActivity: new Date().toISOString() }
        : thread
    ));
    setVaultActivities(prevActivities => [...prevActivities, {
      id: generateId(),
      vaultId: vaultId,
      memberId: currentUserId,
      type: 'Transaction', // Re-using Transaction type for chat activity for simplicity
      timestamp: new Date().toISOString(),
      description: `${members.find(m => m.id === currentUserId)?.name} sent a message in chat.`,
      details: { messageContent: content },
    }]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: generateId(),
        senderId: 'AI',
        vaultId: vaultId,
        timestamp: new Date().toISOString(),
        content: `AI Assistant: I've noted your message. Based on this discussion, I suggest reviewing the current goal progress.`,
        isAI: true,
      };
      setChatThreads(prevThreads => prevThreads.map(thread =>
        thread.vaultId === vaultId
          ? { ...thread, messages: [...thread.messages, aiResponse], lastActivity: new Date().toISOString() }
          : thread
      ));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Enterprise Financial Vaults</h1>
            <p className="mt-1 text-md text-gray-600 dark:text-gray-400">AI-powered collaborative finance for strategic business and personal goals.</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button onClick={() => setIsInviteMemberModalOpen(true)} className="flex items-center justify-center bg-white dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Users className="h-4 w-4 mr-2" />
              Invite Member
            </button>
            <button onClick={() => setIsCreateVaultModalOpen(true)} className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Create Vault
            </button>
          </div>
        </header>

        {/* Key Performance Indicators (KPIs) */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Key Performance Indicators</h2>
          <KPIDisplay kpis={kpis} />
        </section>

        {/* AI-Powered Insights & Recommendations */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">AI Insights & Recommendations</h2>
            <button onClick={() => {}} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
              View All Insights <ArrowUpRight className="inline-block h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecommendations.filter(rec => rec.status === 'New').slice(0, 3).map(insight => (
              <AIInsightCard key={insight.id} insight={insight} onAction={handleAIRecommendationAction} />
            ))}
            {aiRecommendations.filter(rec => rec.status === 'New').length === 0 && (
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No new AI recommendations at this time. All systems optimal.</p>
                </div>
            )}
          </div>
        </section>

        {/* Vaults Grid */}
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Collaborative Vaults</h2>
                <button onClick={() => {}} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
                    Manage All Vaults <ArrowUpRight className="inline-block h-4 w-4 ml-1" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaults.map(vault => (
                    <VaultCard key={vault.id} vault={vault} allMembers={members} onEditVault={(v) => { setSelectedVaultForEdit(v); setIsEditVaultModalOpen(true); }} />
                ))}
                <button onClick={() => setIsCreateVaultModalOpen(true)} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 transition-all duration-300 p-6">
                    <Plus className="h-10 w-10 mb-2" />
                    <span className="font-semibold">Create a New Strategic Vault</span>
                    <p className="text-sm text-center mt-1">Leverage AI to define your next financial objective.</p>
                </button>
            </div>
        </section>

        {/* Detailed Vault View (Example for one vault, could be a separate page) */}
        {vaults.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Deep Dive: {vaults[0].name}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialProjectionChart vault={vaults[0]} />
              <RiskAssessmentPanel vault={vaults[0]} />
            </div>
          </section>
        )}

        {/* Collaboration & Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 mb-8">
            <div className="lg:col-span-1">
                <VaultActivityFeed activities={vaultActivities.filter(a => a.vaultId === vaults[0]?.id)} members={members} />
            </div>
            <div className="lg:col-span-2 h-[450px]"> {/* Fixed height for chat */}
                {chatThreads.length > 0 ? (
                    <ChatInterface thread={chatThreads[0]} currentUserId={currentUserId} members={members} onSendMessage={handleSendMessage} />
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No active chat threads. Start a discussion!</p>
                    </div>
                )}
            </div>
        </section>

        {/* Members & Audit Trail */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Team Members</h3>
                <ul className="space-y-2">
                    {members.map(member => (
                        <MemberProfileCard key={member.id} member={member} onEditMember={() => { /* Open member edit modal */ }} />
                    ))}
                </ul>
                <div className="mt-4 text-right">
                    <button onClick={() => setIsInviteMemberModalOpen(true)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
                        Manage Members <ArrowUpRight className="inline-block h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>
            <AuditLogViewer logs={auditLogs} members={members} />
        </section>

        {/* Transaction History */}
        <section className="mt-8">
          <TransactionHistory transactions={transactions} members={members} />
        </section>

        {/* Modals */}
        <CreateVaultModal
          isOpen={isCreateVaultModalOpen}
          onClose={() => setIsCreateVaultModalOpen(false)}
          allMembers={members}
          onCreate={handleCreateVault}
        />
        {selectedVaultForEdit && (
          <VaultSettingsModal
            isOpen={isEditVaultModalOpen}
            onClose={() => setIsEditVaultModalOpen(false)}
            vault={selectedVaultForEdit}
            allMembers={members}
            onSave={handleSaveVault}
          />
        )}
        <InviteMemberModal
          isOpen={isInviteMemberModalOpen}
          onClose={() => setIsInviteMemberModalOpen(false)}
          onInvite={handleInviteMember}
          vaults={vaults}
        />

      </main>
    </div>
  );
}