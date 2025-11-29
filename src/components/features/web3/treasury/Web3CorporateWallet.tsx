import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpRight, ArrowDownLeft, Wallet, Users, CheckCircle, Clock, QrCode, Copy,
  LayoutDashboard, DollarSign, TrendingUp, ShieldCheck, Settings, MessageSquare,
  FileText, BarChart, Bell, Lock, Plus, Minus, Search, Filter, Calendar, Info,
  AlertTriangle, Lightbulb, Bot, Code, Gavel, Handshake, Repeat, Eye, EyeOff
} from 'lucide-react';

// --- CORE TYPES AND MOCK DATA ---

type Asset = 'USDC' | 'USDT' | 'DAI' | 'ETH' | 'WBTC' | 'LINK' | 'AAVE' | 'UNI' | 'CRV' | 'MKR';
type TransactionStatus = 'Pending' | 'Completed' | 'Failed' | 'Cancelled' | 'Executing';
type TransactionType = 'Incoming' | 'Outgoing' | 'Internal Transfer' | 'Staking Reward' | 'Liquidity Provision' | 'Governance Vote';
type PolicyType = 'SpendingLimit' | 'SignatoryThreshold' | 'WhitelistedAddress' | 'BlacklistedAddress' | 'AssetAllocation';
type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Review Required';
type AIInsightCategory = 'Liquidity' | 'Risk' | 'Performance' | 'Compliance' | 'Optimization';

interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  asset: Asset;
  amount: number;
  usdValue: number;
  from?: string;
  to?: string;
  status: TransactionStatus;
  requiredSignatures: number;
  approvals: string[];
  initiator: string;
  description?: string;
  gasFeeUsd?: number;
  blockchainTxHash?: string;
  relatedPolicyIds?: string[];
  riskScore?: number;
  aiRecommendation?: string;
}

interface Signatory {
  address: string;
  name: string;
  role: 'Admin' | 'Treasurer' | 'Auditor' | 'Contributor';
  email: string;
  lastActivity: string;
  isActive: boolean;
  permissions: string[]; // e.g., ['initiate_tx', 'approve_tx', 'manage_policies']
}

interface WalletPolicy {
  id: string;
  name: string;
  type: PolicyType;
  description: string;
  status: 'Active' | 'Inactive' | 'Draft';
  parameters: Record<string, any>; // e.g., { limit: 100000, asset: 'USDC' }
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  approvalsRequired: number;
  currentApprovals: string[];
  aiImpactAnalysis?: string;
}

interface AIInsight {
  id: string;
  category: AIInsightCategory;
  title: string;
  summary: string;
  details: string;
  severity: RiskLevel;
  timestamp: string;
  actionableRecommendations?: string[];
}

interface KPI {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  aiPrediction?: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'AI';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

const mockSignatories: Signatory[] = [
  { address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', name: 'Alice Johnson', role: 'Admin', email: 'alice@corp.com', lastActivity: '2023-10-27T10:30:00Z', isActive: true, permissions: ['initiate_tx', 'approve_tx', 'manage_policies', 'view_reports'] },
  { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', name: 'Bob Smith', role: 'Treasurer', email: 'bob@corp.com', lastActivity: '2023-10-27T11:15:00Z', isActive: true, permissions: ['initiate_tx', 'approve_tx', 'view_reports'] },
  { address: '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6', name: 'Charlie Brown', role: 'Auditor', email: 'charlie@corp.com', lastActivity: '2023-10-26T16:00:00Z', isActive: true, permissions: ['view_reports', 'audit_logs'] },
  { address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', name: 'Diana Prince', role: 'Contributor', email: 'diana@corp.com', lastActivity: '2023-10-25T09:00:00Z', isActive: false, permissions: ['initiate_tx'] },
  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Eve Adams', role: 'Admin', email: 'eve@corp.com', lastActivity: '2023-10-27T12:00:00Z', isActive: true, permissions: ['initiate_tx', 'approve_tx', 'manage_policies', 'view_reports', 'manage_signatories'] },
];

const requiredSignatures = 2;
const currentUser = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // We are Bob Smith
const walletAddress = "0x4e5b2e1e2e3f4g5h6i7j8k9l0m1n2o3p4q5r";
const walletName = "Corporate Treasury Main";

const mockBalances = {
  USDC: 1250678.55,
  USDT: 875432.10,
  DAI: 543210.98,
  ETH: 123.45, // ~$200,000
  WBTC: 5.67, // ~$200,000
  LINK: 15000.00, // ~$100,000
  AAVE: 2000.00, // ~$200,000
  UNI: 10000.00, // ~$50,000
  CRV: 25000.00, // ~$15,000
  MKR: 50.00, // ~$75,000
};

const mockAssetPrices = {
  USDC: 1.00, USDT: 1.00, DAI: 1.00,
  ETH: 1650.00, WBTC: 35000.00, LINK: 7.50,
  AAVE: 100.00, UNI: 5.00, CRV: 0.60, MKR: 1500.00
};

const calculateTotalBalance = (balances: Record<Asset, number>, prices: Record<Asset, number>) => {
  return Object.entries(balances).reduce((acc, [asset, amount]) => acc + amount * (prices[asset as Asset] || 0), 0);
};

const totalBalance = calculateTotalBalance(mockBalances, mockAssetPrices);

const initialTransactions: Transaction[] = [
  {
    id: 'tx1234', date: '2023-10-27', type: 'Outgoing', asset: 'USDC', amount: 50000, usdValue: 50000, to: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', status: 'Pending', requiredSignatures: 2, approvals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'], initiator: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', description: 'Payment for Q3 vendor services.', gasFeeUsd: 5.23, riskScore: 0.7, aiRecommendation: 'Review recipient history.'
  },
  {
    id: 'tx5678', date: '2023-10-26', type: 'Incoming', asset: 'USDT', amount: 120000, usdValue: 120000, from: '0x9876543210987654321098765432109876543210', status: 'Completed', requiredSignatures: 2, approvals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'], initiator: 'N/A', description: 'Incoming payment from partner.', gasFeeUsd: 0, riskScore: 0.1
  },
  {
    id: 'tx9012', date: '2023-10-25', type: 'Outgoing', asset: 'DAI', amount: 25000, usdValue: 25000, to: '0x0987654321098765432109876543210987654321', status: 'Completed', requiredSignatures: 2, approvals: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6'], initiator: '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6', description: 'Payroll distribution.', gasFeeUsd: 4.89, riskScore: 0.2
  },
  {
    id: 'tx3456', date: '2023-10-24', type: 'Outgoing', asset: 'USDC', amount: 10000, usdValue: 10000, to: '0xFedcba9876543210Fedcba9876543210Fedcba98', status: 'Failed', requiredSignatures: 2, approvals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'], initiator: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', description: 'Failed payment due to insufficient gas.', gasFeeUsd: 12.00, riskScore: 0.9, aiRecommendation: 'Increase gas limit for future transactions to this address.'
  },
  {
    id: 'tx7890', date: '2023-10-23', type: 'Staking Reward', asset: 'ETH', amount: 0.5, usdValue: 825, from: '0xStakingPoolAddress', status: 'Completed', requiredSignatures: 1, approvals: [], initiator: 'System', description: 'ETH staking rewards from Lido.', gasFeeUsd: 0, riskScore: 0.0
  },
  {
    id: 'tx1122', date: '2023-10-22', type: 'Liquidity Provision', asset: 'UNI', amount: 500, usdValue: 2500, to: '0xUniswapLP', status: 'Executing', requiredSignatures: 3, approvals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6'], initiator: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', description: 'Adding liquidity to UNI/ETH pool.', gasFeeUsd: 25.50, riskScore: 0.6, aiRecommendation: 'Monitor impermanent loss risk.'
  },
  {
    id: 'tx3344', date: '2023-10-21', type: 'Outgoing', asset: 'WBTC', amount: 0.1, usdValue: 3500, to: '0xAnotherVendor', status: 'Pending', requiredSignatures: 2, approvals: [], initiator: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', description: 'Payment for cloud services.', gasFeeUsd: 15.00, riskScore: 0.8, aiRecommendation: 'Verify recipient address with external database.'
  },
  {
    id: 'tx5566', date: '2023-10-20', type: 'Internal Transfer', asset: 'USDC', amount: 100000, usdValue: 100000, from: walletAddress, to: '0xAnotherInternalWallet', status: 'Completed', requiredSignatures: 1, approvals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'], initiator: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', description: 'Transfer to operational budget wallet.', gasFeeUsd: 3.10, riskScore: 0.0
  },
];

const initialPolicies: WalletPolicy[] = [
  {
    id: 'pol001', name: 'Daily Spending Limit (USDC)', type: 'SpendingLimit', description: 'Limits daily USDC outgoing transactions to $100,000.', status: 'Active', parameters: { limit: 100000, asset: 'USDC', period: 'daily' }, createdBy: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', createdAt: '2023-09-01', lastUpdated: '2023-09-01', approvalsRequired: 3, currentApprovals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6'], aiImpactAnalysis: 'High impact on operational flexibility, low risk reduction.'
  },
  {
    id: 'pol002', name: 'Critical Transaction Threshold', type: 'SignatoryThreshold', description: 'Transactions over $500,000 require all Admin signatories.', status: 'Active', parameters: { threshold: 500000, role: 'Admin', allSignatories: true }, createdBy: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', createdAt: '2023-09-15', lastUpdated: '2023-09-15', approvalsRequired: 3, currentApprovals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6'], aiImpactAnalysis: 'Significant risk reduction for large transactions, minimal operational overhead.'
  },
  {
    id: 'pol003', name: 'Whitelisted DeFi Protocols', type: 'WhitelistedAddress', description: 'Only allows interaction with approved DeFi protocols.', status: 'Active', parameters: { addresses: ['0xUniswapRouter', '0xAaveLendingPool', '0xCurvePool'] }, createdBy: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', createdAt: '2023-10-01', lastUpdated: '2023-10-01', approvalsRequired: 3, currentApprovals: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6'], aiImpactAnalysis: 'Enhances security for DeFi interactions, potential for missed yield opportunities.'
  },
];

const initialAIInsights: AIInsight[] = [
  {
    id: 'ai001', category: 'Liquidity', title: 'Projected USDC Liquidity Surplus', summary: 'AI predicts a 15% surplus in USDC liquidity over the next 30 days, suggesting opportunities for yield generation.', details: 'Based on historical transaction patterns, incoming revenue forecasts, and market volatility analysis, our AI model projects a significant surplus in USDC. This could be strategically deployed into low-risk DeFi protocols to generate additional yield.', severity: 'Low', timestamp: '2023-10-27T08:00:00Z', actionableRecommendations: ['Explore USDC lending protocols (e.g., Aave, Compound).', 'Consider short-term bond tokenization.']
  },
  {
    id: 'ai002', category: 'Risk', title: 'High-Risk Transaction Flagged', summary: 'Transaction tx3344 to 0xAnotherVendor flagged for unusual recipient history and potential phishing risk.', details: 'The AI risk engine has identified transaction tx3344 as high-risk. The recipient address 0xAnotherVendor has a limited transaction history, no known association with reputable entities, and exhibits patterns similar to previously identified phishing attempts. Manual review and external verification are strongly recommended before approval.', severity: 'Critical', timestamp: '2023-10-27T09:30:00Z', actionableRecommendations: ['Verify recipient identity via out-of-band communication.', 'Initiate a small test transaction first.', 'Consider blacklisting the address if unverified.']
  },
  {
    id: 'ai003', category: 'Performance', title: 'ETH Staking Yield Optimization', summary: 'AI suggests re-evaluating ETH staking provider for potentially higher APY.', details: 'Our analysis indicates that current ETH staking yields could be optimized. While the current provider offers stability, other audited and reputable platforms are offering a 0.5% higher APY. The AI has simulated the potential additional revenue over a 6-month period, showing a significant increase.', severity: 'Medium', timestamp: '2023-10-26T14:00:00Z', actionableRecommendations: ['Research alternative ETH staking platforms.', 'Compare security audits and decentralization metrics.', 'Propose a governance vote for switching providers.']
  },
  {
    id: 'ai004', category: 'Compliance', title: 'Potential Policy Violation Alert', summary: 'Outgoing transaction of 120,000 USDC exceeds "Daily Spending Limit (USDC)" policy threshold.', details: 'An initiated transaction (ID: tx_new_outgoing_usdc) for 120,000 USDC has been detected. This amount exceeds the active "Daily Spending Limit (USDC)" policy (pol001) which caps daily USDC outflows at $100,000. The transaction will be automatically paused and requires an override or policy adjustment.', severity: 'High', timestamp: '2023-10-27T11:00:00Z', actionableRecommendations: ['Review policy pol001 for potential adjustment.', 'Obtain additional approvals for policy override.', 'Split the transaction into multiple smaller ones.']
  },
];

const initialKPIs: KPI[] = [
  { id: 'kpi001', name: 'Total AUM', value: totalBalance, unit: 'USD', trend: 'up', description: 'Total Assets Under Management in USD equivalent.', aiPrediction: 'Projected 5% growth next quarter.' },
  { id: 'kpi002', name: 'Liquidity Ratio', value: '0.75', unit: '', trend: 'stable', description: 'Ratio of liquid assets to short-term liabilities.', aiPrediction: 'Stable at 0.75, within optimal range.' },
  { id: 'kpi003', name: 'Pending Approvals', value: 2, unit: 'transactions', trend: 'down', description: 'Number of transactions awaiting signatory approval.', aiPrediction: 'Expected to decrease to 0 by end of day.' },
  { id: 'kpi004', name: 'Transaction Volume (24h)', value: 250000, unit: 'USD', trend: 'up', description: 'Total value of transactions processed in the last 24 hours.', aiPrediction: 'Anticipated increase to $300,000 due to scheduled payments.' },
  { id: 'kpi005', name: 'Risk Score (Overall)', value: 'Medium', unit: '', trend: 'stable', description: 'AI-calculated aggregate risk score for the treasury.', aiPrediction: 'Expected to remain Medium, with specific high-risk alerts managed proactively.' },
];

const initialAuditLogs: AuditLogEntry[] = [
  { id: 'log001', timestamp: '2023-10-27T11:15:30Z', actor: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', action: 'Approved Transaction', target: 'tx1234', details: 'Approved outgoing USDC transaction to vendor.', ipAddress: '192.168.1.10' },
  { id: 'log002', timestamp: '2023-10-27T10:30:15Z', actor: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', action: 'Initiated Transaction', target: 'tx1234', details: 'Initiated outgoing USDC transaction for Q3 services.', ipAddress: '192.168.1.5' },
  { id: 'log003', timestamp: '2023-10-26T14:00:00Z', actor: 'System', action: 'Policy Evaluation', target: 'pol001', details: 'Daily spending limit policy evaluated for compliance.', ipAddress: 'N/A' },
  { id: 'log004', timestamp: '2023-10-26T10:00:00Z', actor: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', action: 'Updated Policy', target: 'pol003', details: 'Updated whitelisted DeFi protocols policy.', ipAddress: '192.168.1.5' },
];

const initialChatMessages: ChatMessage[] = [
  { id: 'chat001', sender: 'AI', content: 'Hello Bob! How can I assist you with your corporate treasury today?', timestamp: '2023-10-27T13:00:00Z', suggestedActions: [{ label: 'Show pending transactions', action: 'show_pending_tx' }, { label: 'What is our current liquidity?', action: 'get_liquidity' }] },
  { id: 'chat002', sender: 'user', content: 'Show me the latest AI insights.', timestamp: '2023-10-27T13:01:00Z' },
  { id: 'chat003', sender: 'AI', content: 'Certainly. Here are the latest AI insights:\n\n- **Projected USDC Liquidity Surplus:** AI predicts a 15% surplus in USDC liquidity over the next 30 days.\n- **High-Risk Transaction Flagged:** Transaction tx3344 flagged for unusual recipient history.\n- **ETH Staking Yield Optimization:** AI suggests re-evaluating ETH staking provider.\n\nWould you like more details on any of these?', timestamp: '2023-10-27T13:01:30Z', suggestedActions: [{ label: 'Details on USDC surplus', action: 'details_usdc_surplus' }, { label: 'Details on high-risk transaction', action: 'details_high_risk_tx' }] },
];

// --- HELPER COMPONENTS & FUNCTIONS ---

const AssetIcon = ({ asset }: { asset: Asset }) => {
  const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs";
  const assetColors: Record<Asset, string> = {
    USDC: 'bg-blue-500', USDT: 'bg-green-500', DAI: 'bg-yellow-500 text-slate-800',
    ETH: 'bg-purple-600', WBTC: 'bg-orange-500', LINK: 'bg-indigo-600',
    AAVE: 'bg-blue-700', UNI: 'bg-pink-500', CRV: 'bg-gray-700', MKR: 'bg-red-700'
  };
  return <div className={`${baseClasses} ${assetColors[asset]}`}>{asset}</div>;
};

const getStatusBadgeVariant = (status: TransactionStatus): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
  switch (status) {
    case 'Completed': return 'success'; // Custom variant for success
    case 'Pending': return 'warning'; // Custom variant for warning
    case 'Executing': return 'info'; // Custom variant for info
    case 'Failed': return 'destructive';
    case 'Cancelled': return 'secondary';
    default: return 'outline';
  }
};

const getRiskBadgeVariant = (risk: RiskLevel): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
  switch (risk) {
    case 'Low': return 'success';
    case 'Medium': return 'warning';
    case 'High': return 'destructive';
    case 'Critical': return 'destructive';
    default: return 'outline';
  }
};

const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
};

const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const getSignatoryName = (address: string) => {
  const signatory = mockSignatories.find(s => s.address === address);
  return signatory ? signatory.name : truncateAddress(address);
};

// Custom Badge variants (simulated, as actual variants are limited)
const CustomBadge = ({ variant, children }: { variant: "success" | "warning" | "info" | "default" | "secondary" | "destructive" | "outline", children: React.ReactNode }) => {
  let classes = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  switch (variant) {
    case 'success': classes += " border-transparent bg-green-500 text-green-50-foreground hover:bg-green-500/80"; break;
    case 'warning': classes += " border-transparent bg-yellow-500 text-yellow-50-foreground hover:bg-yellow-500/80"; break;
    case 'info': classes += " border-transparent bg-blue-500 text-blue-50-foreground hover:bg-blue-500/80"; break;
    case 'default': classes += " border-transparent bg-primary text-primary-foreground hover:bg-primary/80"; break;
    case 'secondary': classes += " border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"; break;
    case 'destructive': classes += " border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"; break;
    case 'outline': classes += " text-foreground"; break;
  }
  return <span className={classes}>{children}</span>;
};

// --- SUB-COMPONENTS FOR MODULARITY AND LINE EXPANSION ---

const AIChatAssistant = ({ messages, onSendMessage, onSuggestedAction }: { messages: ChatMessage[]; onSendMessage: (content: string) => void; onSuggestedAction: (action: string) => void }) => {
  const [input, setInput] = useState('');
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleActionClick = (action: string) => {
    onSuggestedAction(action);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5 text-blue-500" /> AI Assistant
        </CardTitle>
        <CardDescription>Intelligent Treasury Support</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50'}`}>
              <p className="text-sm">{msg.content}</p>
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.suggestedActions.map((action, idx) => (
                    <Button key={idx} variant="outline" size="sm" onClick={() => handleActionClick(action.action)}>
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              <p className="text-xs mt-1 opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-4 border-t flex items-center gap-2">
        <Input
          placeholder="Ask the AI assistant..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Card>
  );
};

const AIInsightsDashboard = ({ insights }: { insights: AIInsight[] }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
      <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> AI-Powered Insights
    </h3>
    <p className="text-sm text-muted-foreground">Leverage artificial intelligence to gain deeper understanding and proactive recommendations for your treasury operations.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map((insight) => (
        <Card key={insight.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{insight.title}</CardTitle>
              <CustomBadge variant={getRiskBadgeVariant(insight.severity)}>{insight.severity}</CustomBadge>
            </div>
            <CardDescription className="text-xs">{insight.category} Insight - {new Date(insight.timestamp).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">{insight.summary}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">View Details</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{insight.title}</DialogTitle>
                  <DialogDescription>{insight.category} Insight - {new Date(insight.timestamp).toLocaleString()}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm">{insight.details}</p>
                  {insight.actionableRecommendations && insight.actionableRecommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Actionable Recommendations</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {insight.actionableRecommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const KPIDashboard = ({ kpis }: { kpis: KPI[] }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
      <BarChart className="mr-2 h-5 w-5 text-purple-500" /> Key Performance Indicators
    </h3>
    <p className="text-sm text-muted-foreground">Monitor the health and performance of your treasury with real-time and AI-predicted metrics.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
            {kpi.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
            {kpi.trend === 'down' && <ArrowDownLeft className="h-4 w-4 text-red-500" />}
            {kpi.trend === 'stable' && <Info className="h-4 w-4 text-blue-500" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeof kpi.value === 'number' ? formatCurrency(kpi.value, kpi.unit === 'USD' ? 'USD' : undefined) : kpi.value} {kpi.unit !== 'USD' ? kpi.unit : ''}</div>
            <p className="text-xs text-muted-foreground">{kpi.description}</p>
            {kpi.aiPrediction && (
              <p className="text-xs text-blue-500 mt-1 flex items-center">
                <Lightbulb className="h-3 w-3 mr-1" /> AI Prediction: {kpi.aiPrediction}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const SignatoryManagement = ({ signatories, onUpdateSignatory, onAddSignatory }: { signatories: Signatory[]; onUpdateSignatory: (s: Signatory) => void; onAddSignatory: (s: Signatory) => void }) => {
  const [isAddSignatoryModalOpen, setIsAddSignatoryModalOpen] = useState(false);
  const [newSignatory, setNewSignatory] = useState<Partial<Signatory>>({
    address: '', name: '', role: 'Contributor', email: '', isActive: true, permissions: ['view_reports']
  });

  const handleNewSignatorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSignatory.address && newSignatory.name && newSignatory.email && newSignatory.role) {
      onAddSignatory({
        ...newSignatory as Signatory,
        id: `sig${Math.random().toString(36).substr(2, 9)}`,
        lastActivity: new Date().toISOString(),
      });
      setIsAddSignatoryModalOpen(false);
      setNewSignatory({ address: '', name: '', role: 'Contributor', email: '', isActive: true, permissions: ['view_reports'] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
          <Users className="mr-2 h-5 w-5 text-indigo-500" /> Signatory Management
        </h3>
        <Dialog open={isAddSignatoryModalOpen} onOpenChange={setIsAddSignatoryModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Signatory</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Signatory</DialogTitle>
              <DialogDescription>Onboard a new member to your corporate treasury multi-signature wallet.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewSignatorySubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-address" className="text-right">Address</Label>
                  <Input id="new-address" value={newSignatory.address} onChange={(e) => setNewSignatory({ ...newSignatory, address: e.target.value })} placeholder="0x..." className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-name" className="text-right">Name</Label>
                  <Input id="new-name" value={newSignatory.name} onChange={(e) => setNewSignatory({ ...newSignatory, name: e.target.value })} placeholder="John Doe" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-email" className="text-right">Email</Label>
                  <Input id="new-email" type="email" value={newSignatory.email} onChange={(e) => setNewSignatory({ ...newSignatory, email: e.target.value })} placeholder="john@example.com" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-role" className="text-right">Role</Label>
                  <Select value={newSignatory.role} onValueChange={(value) => setNewSignatory({ ...newSignatory, role: value as Signatory['role'] })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Treasurer">Treasurer</SelectItem>
                      <SelectItem value="Auditor">Auditor</SelectItem>
                      <SelectItem value="Contributor">Contributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-active" className="text-right">Active</Label>
                  <Checkbox id="new-active" checked={newSignatory.isActive} onCheckedChange={(checked) => setNewSignatory({ ...newSignatory, isActive: checked as boolean })} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Signatory</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Signatory</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Last Activity</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signatories.map((signer) => (
            <TableRow key={signer.address}>
              <TableCell>
                <div className="font-medium">{signer.name}</div>
                <div className="text-sm text-muted-foreground font-mono">{truncateAddress(signer.address)}</div>
              </TableCell>
              <TableCell>{signer.role}</TableCell>
              <TableCell>
                <CustomBadge variant={signer.isActive ? 'success' : 'secondary'}>{signer.isActive ? 'Active' : 'Inactive'}</CustomBadge>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">{new Date(signer.lastActivity).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Signatory: {signer.name}</DialogTitle>
                      <DialogDescription>Update roles, permissions, or status for {signer.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Address</Label>
                        <Input value={signer.address} readOnly className="col-span-3 font-mono" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`edit-name-${signer.address}`} className="text-right">Name</Label>
                        <Input id={`edit-name-${signer.address}`} value={signer.name} onChange={(e) => onUpdateSignatory({ ...signer, name: e.target.value })} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`edit-role-${signer.address}`} className="text-right">Role</Label>
                        <Select value={signer.role} onValueChange={(value) => onUpdateSignatory({ ...signer, role: value as Signatory['role'] })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Treasurer">Treasurer</SelectItem>
                            <SelectItem value="Auditor">Auditor</SelectItem>
                            <SelectItem value="Contributor">Contributor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`edit-active-${signer.address}`} className="text-right">Active</Label>
                        <Checkbox id={`edit-active-${signer.address}`} checked={signer.isActive} onCheckedChange={(checked) => onUpdateSignatory({ ...signer, isActive: checked as boolean })} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Permissions</Label>
                        <div className="col-span-3 space-y-2">
                          {['initiate_tx', 'approve_tx', 'manage_policies', 'view_reports', 'audit_logs', 'manage_signatories'].map(perm => (
                            <div key={perm} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${signer.address}-${perm}`}
                                checked={signer.permissions.includes(perm)}
                                onCheckedChange={(checked) => {
                                  const newPermissions = checked
                                    ? [...signer.permissions, perm]
                                    : signer.permissions.filter(p => p !== perm);
                                  onUpdateSignatory({ ...signer, permissions: newPermissions });
                                }}
                              />
                              <label htmlFor={`${signer.address}-${perm}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => onUpdateSignatory(signer)}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> AI Role Optimization</CardTitle>
          <CardDescription>AI-driven suggestions for optimizing signatory roles and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Our AI has analyzed transaction patterns and policy adherence to suggest potential improvements in signatory role assignments.
            This aims to enhance security, streamline approvals, and reduce operational bottlenecks.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><strong>Suggestion 1:</strong> Consider promoting 'Diana Prince' to 'Contributor' role with 'initiate_tx' permission, as her activity suggests readiness for more responsibility.</li>
            <li><strong>Suggestion 2:</strong> Review 'Charlie Brown's' permissions; if only auditing, 'approve_tx' might be redundant.</li>
            <li><strong>Suggestion 3:</strong> Implement a time-based access review for inactive signatories to ensure least privilege.</li>
          </ul>
          <Button variant="outline" size="sm" className="mt-4">Generate Detailed Report</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const PolicyManagement = ({ policies, onUpdatePolicy, onAddPolicy, onApprovePolicy }: { policies: WalletPolicy[]; onUpdatePolicy: (p: WalletPolicy) => void; onAddPolicy: (p: WalletPolicy) => void; onApprovePolicy: (policyId: string, approver: string) => void }) => {
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState<Partial<WalletPolicy>>({
    name: '', type: 'SpendingLimit', description: '', status: 'Draft', parameters: {}, approvalsRequired: 1, currentApprovals: []
  });

  const handleNewPolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPolicy.name && newPolicy.type && newPolicy.description) {
      onAddPolicy({
        ...newPolicy as WalletPolicy,
        id: `pol${Math.random().toString(36).substr(2, 9)}`,
        createdBy: currentUser,
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        currentApprovals: [currentUser], // Initiator automatically approves
      });
      setIsAddPolicyModalOpen(false);
      setNewPolicy({ name: '', type: 'SpendingLimit', description: '', status: 'Draft', parameters: {}, approvalsRequired: 1, currentApprovals: [] });
    }
  };

  const getPolicyStatusBadge = (status: WalletPolicy['status']) => {
    switch (status) {
      case 'Active': return <CustomBadge variant="success">Active</CustomBadge>;
      case 'Inactive': return <CustomBadge variant="secondary">Inactive</CustomBadge>;
      case 'Draft': return <CustomBadge variant="info">Draft</CustomBadge>;
      default: return <CustomBadge variant="outline">{status}</CustomBadge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
          <Gavel className="mr-2 h-5 w-5 text-orange-500" /> Policy Management
        </h3>
        <Dialog open={isAddPolicyModalOpen} onOpenChange={setIsAddPolicyModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create New Policy</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Treasury Policy</DialogTitle>
              <DialogDescription>Define rules and conditions for treasury operations to ensure compliance and security.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewPolicySubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="policy-name" className="text-right">Policy Name</Label>
                  <Input id="policy-name" value={newPolicy.name} onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="policy-type" className="text-right">Policy Type</Label>
                  <Select value={newPolicy.type} onValueChange={(value) => setNewPolicy({ ...newPolicy, type: value as PolicyType })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select policy type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SpendingLimit">Spending Limit</SelectItem>
                      <SelectItem value="SignatoryThreshold">Signatory Threshold</SelectItem>
                      <SelectItem value="WhitelistedAddress">Whitelisted Address</SelectItem>
                      <SelectItem value="BlacklistedAddress">Blacklisted Address</SelectItem>
                      <SelectItem value="AssetAllocation">Asset Allocation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="policy-description" className="text-right">Description</Label>
                  <Textarea id="policy-description" value={newPolicy.description} onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })} placeholder="Briefly describe the policy's purpose..." className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="policy-approvals" className="text-right">Approvals Required</Label>
                  <Input id="policy-approvals" type="number" value={newPolicy.approvalsRequired} onChange={(e) => setNewPolicy({ ...newPolicy, approvalsRequired: Number(e.target.value) })} className="col-span-3" min={1} />
                </div>
                {/* Dynamic parameters based on policy type could be added here for more complexity */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">AI Impact Analysis</Label>
                  <div className="col-span-3 text-sm text-muted-foreground flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                    <p>AI will analyze this policy's potential impact on security, efficiency, and compliance upon creation.</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Policy</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approvals</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell>
                <div className="font-medium">{policy.name}</div>
                <div className="text-sm text-muted-foreground">{policy.description}</div>
              </TableCell>
              <TableCell>{policy.type}</TableCell>
              <TableCell>{getPolicyStatusBadge(policy.status)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="mr-1">{policy.currentApprovals.length}/{policy.approvalsRequired}</span>
                  {policy.currentApprovals.includes(currentUser) && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {!policy.currentApprovals.includes(currentUser) && policy.status === 'Draft' && (
                    <Button variant="ghost" size="sm" onClick={() => onApprovePolicy(policy.id, currentUser)} className="ml-2">Approve</Button>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">{policy.lastUpdated}</TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View/Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Policy Details: {policy.name}</DialogTitle>
                      <DialogDescription>ID: {policy.id}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm"><strong>Description:</strong> {policy.description}</p>
                      <p className="text-sm"><strong>Type:</strong> {policy.type}</p>
                      <p className="text-sm"><strong>Status:</strong> {getPolicyStatusBadge(policy.status)}</p>
                      <p className="text-sm"><strong>Created By:</strong> {getSignatoryName(policy.createdBy)} on {policy.createdAt}</p>
                      <p className="text-sm"><strong>Last Updated:</strong> {policy.lastUpdated}</p>
                      <p className="text-sm"><strong>Approvals:</strong> {policy.currentApprovals.length}/{policy.approvalsRequired} ({policy.currentApprovals.map(getSignatoryName).join(', ')})</p>
                      {policy.aiImpactAnalysis && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center"><Lightbulb className="h-4 w-4 mr-2 text-yellow-500" /> AI Impact Analysis</h4>
                          <p className="text-sm text-muted-foreground">{policy.aiImpactAnalysis}</p>
                        </div>
                      )}
                      {policy.status === 'Draft' && !policy.currentApprovals.includes(currentUser) && (
                        <Button onClick={() => onApprovePolicy(policy.id, currentUser)}>Approve Policy</Button>
                      )}
                      {policy.status !== 'Active' && policy.currentApprovals.includes(currentUser) && policy.currentApprovals.length >= policy.approvalsRequired && (
                        <Button onClick={() => onUpdatePolicy({ ...policy, status: 'Active' })}>Activate Policy</Button>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-green-500" /> AI Compliance Monitoring</CardTitle>
          <CardDescription>Real-time AI monitoring for policy adherence and potential violations.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Our AI continuously scans all initiated and executed transactions against your defined treasury policies.
            Any potential violations are immediately flagged, and alerts are generated for review.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><strong>Active Monitoring:</strong> 3 policies currently under AI surveillance.</li>
            <li><strong>Last Scan:</strong> Real-time.</li>
            <li><strong>Recent Alerts:</strong> 1 potential violation detected (see AI Insights for details on tx_new_outgoing_usdc).</li>
          </ul>
          <Button variant="outline" size="sm" className="mt-4">View Compliance Report</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const AuditLogViewer = ({ logs }: { logs: AuditLogEntry[] }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
      <FileText className="mr-2 h-5 w-5 text-gray-500" /> Comprehensive Audit Log
    </h3>
    <p className="text-sm text-muted-foreground">Detailed record of all system and user activities for transparency and accountability.</p>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
            <TableCell className="text-sm">{getSignatoryName(log.actor)}</TableCell>
            <TableCell className="text-sm">{log.action}</TableCell>
            <TableCell className="text-sm font-mono">{truncateAddress(log.target)}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center"><Eye className="mr-2 h-5 w-5 text-blue-500" /> AI Anomaly Detection in Audit Logs</CardTitle>
        <CardDescription>AI-driven analysis of audit trails to identify suspicious activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Our AI continuously monitors audit logs for unusual access patterns, unauthorized actions, or deviations from normal behavior.
          This proactive approach helps in detecting and mitigating potential security threats.
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><strong>Last Anomaly Scan:</strong> 2023-10-27T12:00:00Z</li>
          <li><strong>Detected Anomalies:</strong> None in the last 24 hours.</li>
          <li><strong>Risk Score:</strong> Low.</li>
        </ul>
        <Button variant="outline" size="sm" className="mt-4">Configure Anomaly Alerts</Button>
      </CardContent>
    </Card>
  </div>
);

const SmartContractAuditor = () => {
  const [contractCode, setContractCode] = useState('');
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = () => {
    if (!contractCode.trim()) {
      setAuditResult('Please provide contract code to audit.');
      return;
    }
    setIsAuditing(true);
    setAuditResult(null);

    // Simulate AI audit process
    setTimeout(() => {
      const randomRisk = Math.random();
      let result = '';
      if (randomRisk < 0.2) {
        result = 'AI Audit Complete: No critical vulnerabilities found. Minor optimizations suggested.';
      } else if (randomRisk < 0.6) {
        result = 'AI Audit Complete: Medium severity issues detected. Potential reentrancy vulnerability identified. Review recommended.';
      } else {
        result = 'AI Audit Complete: High severity vulnerabilities found. Critical access control flaw detected. DO NOT DEPLOY.';
      }
      setAuditResult(result);
      setIsAuditing(false);
    }, 3000);
  };

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle className="flex items-center"><Code className="mr-2 h-5 w-5 text-cyan-500" /> AI Smart Contract Auditor</CardTitle>
        <CardDescription>Leverage AI to automatically scan and identify vulnerabilities in your smart contract code before deployment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="contract-code" className="mb-2 block">Smart Contract Code (Solidity, Vyper, etc.)</Label>
          <Textarea
            id="contract-code"
            placeholder="Paste your smart contract code here..."
            value={contractCode}
            onChange={(e) => setContractCode(e.target.value)}
            rows={15}
            className="font-mono"
          />
        </div>
        <Button onClick={handleAudit} disabled={isAuditing}>
          {isAuditing ? 'Auditing...' : 'Run AI Audit'}
        </Button>
        {auditResult && (
          <div className={`p-4 rounded-md ${auditResult.includes('Critical') || auditResult.includes('High severity') ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : auditResult.includes('Medium severity') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
            <h4 className="font-semibold mb-2 flex items-center">
              {auditResult.includes('Critical') || auditResult.includes('High severity') ? <AlertTriangle className="h-5 w-5 mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
              Audit Result
            </h4>
            <p className="text-sm whitespace-pre-wrap">{auditResult}</p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          <Info className="h-3 w-3 inline-block mr-1" />
          AI audits provide an initial layer of security analysis. It is highly recommended to also conduct manual audits by security experts for critical contracts.
        </p>
      </CardContent>
    </Card>
  );
};

// --- MAIN COMPONENT ---

export default function Web3CorporateWallet() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [policies, setPolicies] = useState<WalletPolicy[]>(initialPolicies);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(initialAIInsights);
  const [kpis, setKpis] = useState<KPI[]>(initialKPIs);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [signatories, setSignatories] = useState<Signatory[]>(mockSignatories);

  const currentUserSignatory = useMemo(() => signatories.find(s => s.address === currentUser), [signatories]);
  const canApproveTx = currentUserSignatory?.permissions.includes('approve_tx');
  const canManagePolicies = currentUserSignatory?.permissions.includes('manage_policies');
  const canManageSignatories = currentUserSignatory?.permissions.includes('manage_signatories');

  const handleApproveTransaction = useCallback((txId: string) => {
    setTransactions(prevTxs =>
      prevTxs.map(tx => {
        if (tx.id === txId && tx.status === 'Pending' && !tx.approvals.includes(currentUser)) {
          const newApprovals = [...tx.approvals, currentUser];
          const newStatus: TransactionStatus = newApprovals.length >= tx.requiredSignatures ? 'Completed' : 'Pending';
          
          // Simulate adding to audit log
          setAuditLogs(prevLogs => [...prevLogs, {
            id: `log${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            actor: currentUser,
            action: 'Approved Transaction',
            target: txId,
            details: `Approved transaction ${txId}. New status: ${newStatus}.`,
            ipAddress: 'Simulated IP'
          }]);

          return { ...tx, approvals: newApprovals, status: newStatus };
        }
        return tx;
      })
    );

    setSelectedTx(prevTx => {
      if (!prevTx || prevTx.id !== txId) return prevTx;
      const newApprovals = [...prevTx.approvals, currentUser];
      const newStatus: TransactionStatus = newApprovals.length >= prevTx.requiredSignatures ? 'Completed' : 'Pending';
      return { ...prevTx, approvals: newApprovals, status: newStatus };
    });
  }, []);
  
  const handleSendSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount'));
    const asset = formData.get('asset') as Asset;
    const recipient = formData.get('recipient') as string;
    const description = formData.get('description') as string;

    // Simulate AI risk assessment for new transaction
    const simulatedRiskScore = Math.random() * 100 > 70 ? 0.8 : 0.2; // 30% chance of higher risk
    const aiRecommendation = simulatedRiskScore > 0.5 ? 'High risk recipient. Verify identity.' : 'Transaction appears standard.';

    const newTx: Transaction = {
        id: `tx${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Outgoing',
        asset: asset,
        amount: amount,
        usdValue: amount * (mockAssetPrices[asset] || 1), // Assuming 1:1 for stablecoins, use mock prices for others
        to: recipient,
        status: 'Pending',
        requiredSignatures,
        approvals: [currentUser], // Initiator automatically approves
        initiator: currentUser,
        description: description,
        gasFeeUsd: Math.random() * 20 + 5, // Simulated gas fee
        riskScore: simulatedRiskScore,
        aiRecommendation: aiRecommendation,
    };

    // Simulate policy check
    const spendingLimitPolicy = policies.find(p => p.type === 'SpendingLimit' && p.status === 'Active' && p.parameters.asset === asset);
    if (spendingLimitPolicy && amount > spendingLimitPolicy.parameters.limit) {
      setAiInsights(prev => [...prev, {
        id: `ai${Math.random().toString(36).substr(2, 9)}`,
        category: 'Compliance',
        title: 'Potential Policy Violation: Spending Limit Exceeded',
        summary: `Outgoing transaction of ${amount} ${asset} exceeds the '${spendingLimitPolicy.name}' policy limit of ${spendingLimitPolicy.parameters.limit} ${asset}.`,
        details: `The initiated transaction (ID: ${newTx.id}) for ${amount} ${asset} has been detected. This amount exceeds the active "${spendingLimitPolicy.name}" policy (${spendingLimitPolicy.id}) which caps daily outflows at ${spendingLimitPolicy.parameters.limit} ${asset}. The transaction will be automatically paused and requires an override or policy adjustment.`,
        severity: 'High',
        timestamp: new Date().toISOString(),
        actionableRecommendations: ['Review policy for potential adjustment.', 'Obtain additional approvals for policy override.', 'Split the transaction into multiple smaller ones.']
      }]);
      alert(`Transaction paused: Exceeds ${spendingLimitPolicy.name} policy limit.`);
      newTx.status = 'Pending'; // Keep it pending, or add a 'Policy Review' status
    }

    setTransactions(prev => [newTx, ...prev]);
    setIsSendModalOpen(false);

    // Simulate adding to audit log
    setAuditLogs(prevLogs => [...prevLogs, {
      id: `log${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser,
      action: 'Initiated Transaction',
      target: newTx.id,
      details: `Initiated outgoing ${newTx.amount} ${newTx.asset} to ${truncateAddress(newTx.to || '')}.`,
      ipAddress: 'Simulated IP'
    }]);
  }, [policies]);
  
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  const handleUpdateSignatory = useCallback((updatedSignatory: Signatory) => {
    setSignatories(prev => prev.map(s => s.address === updatedSignatory.address ? updatedSignatory : s));
    setAuditLogs(prevLogs => [...prevLogs, {
      id: `log${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser,
      action: 'Updated Signatory',
      target: updatedSignatory.address,
      details: `Updated signatory ${updatedSignatory.name} (${truncateAddress(updatedSignatory.address)}) role to ${updatedSignatory.role}.`,
      ipAddress: 'Simulated IP'
    }]);
  }, []);

  const handleAddSignatory = useCallback((newSignatory: Signatory) => {
    setSignatories(prev => [...prev, newSignatory]);
    setAuditLogs(prevLogs => [...prevLogs, {
      id: `log${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser,
      action: 'Added Signatory',
      target: newSignatory.address,
      details: `Added new signatory ${newSignatory.name} (${truncateAddress(newSignatory.address)}) with role ${newSignatory.role}.`,
      ipAddress: 'Simulated IP'
    }]);
  }, []);

  const handleUpdatePolicy = useCallback((updatedPolicy: WalletPolicy) => {
    setPolicies(prev => prev.map(p => p.id === updatedPolicy.id ? updatedPolicy : p));
    setAuditLogs(prevLogs => [...prevLogs, {
      id: `log${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser,
      action: 'Updated Policy',
      target: updatedPolicy.id,
      details: `Updated policy ${updatedPolicy.name}. Status: ${updatedPolicy.status}.`,
      ipAddress: 'Simulated IP'
    }]);
  }, []);

  const handleAddPolicy = useCallback((newPolicy: WalletPolicy) => {
    // Simulate AI impact analysis for new policy
    const aiImpactAnalysis = `AI analysis suggests this policy will have a ${Math.random() > 0.5 ? 'high' : 'medium'} impact on treasury operations, with a ${Math.random() > 0.5 ? 'significant' : 'moderate'} improvement in security.`;
    const policyWithAI = { ...newPolicy, aiImpactAnalysis };

    setPolicies(prev => [...prev, policyWithAI]);
    setAuditLogs(prevLogs => [...prevLogs, {
      id: `log${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser,
      action: 'Created Policy',
      target: newPolicy.id,
      details: `Created new policy ${newPolicy.name}.`,
      ipAddress: 'Simulated IP'
    }]);
  }, []);

  const handleApprovePolicy = useCallback((policyId: string, approver: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId && !p.currentApprovals.includes(approver)) {
        const newApprovals = [...p.currentApprovals, approver];
        const newStatus = newApprovals.length >= p.approvalsRequired ? 'Active' : 'Draft';
        return { ...p, currentApprovals: newApprovals, status: newStatus };
      }
      return p;
    }));
    setAuditLogs(prevLogs => [...prevLogs, {
      id: `log${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actor: approver,
      action: 'Approved Policy',
      target: policyId,
      details: `Approved policy ${policyId}.`,
      ipAddress: 'Simulated IP'
    }]);
  }, []);

  const handleChatSendMessage = useCallback((content: string) => {
    const newUserMessage: ChatMessage = {
      id: `chat${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      content: content,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, newUserMessage]);

    // Simulate AI response
    setTimeout(() => {
      let aiResponseContent = "I'm sorry, I didn't understand that. Can you please rephrase?";
      let suggestedActions: { label: string; action: string }[] = [];

      if (content.toLowerCase().includes('pending transactions')) {
        const pendingTxCount = transactions.filter(tx => tx.status === 'Pending').length;
        aiResponseContent = `You currently have ${pendingTxCount} pending transactions. Would you like to review them?`;
        suggestedActions = [{ label: 'Review pending transactions', action: 'show_pending_tx' }];
      } else if (content.toLowerCase().includes('liquidity')) {
        aiResponseContent = `Your current total liquid balance is ${formatCurrency(totalBalance)}. USDC: ${formatCurrency(mockBalances.USDC)}, USDT: ${formatCurrency(mockBalances.USDT)}, DAI: ${formatCurrency(mockBalances.DAI)}.`;
        suggestedActions = [{ label: 'Show asset distribution', action: 'show_asset_distribution' }];
      } else if (content.toLowerCase().includes('send funds')) {
        aiResponseContent = `I can help you initiate a new transaction. Please specify the asset, amount, and recipient address.`;
        suggestedActions = [{ label: 'Open Send Funds modal', action: 'open_send_modal' }];
      } else if (content.toLowerCase().includes('ai insights')) {
        aiResponseContent = `Here are the latest AI insights:\n\n${aiInsights.map(i => `- **${i.title}:** ${i.summary}`).join('\n')}\n\nWould you like more details on any specific insight?`;
        suggestedActions = aiInsights.map(i => ({ label: `Details on ${i.title}`, action: `details_${i.id}` }));
      } else if (content.toLowerCase().includes('high-risk transaction')) {
        const highRiskInsight = aiInsights.find(i => i.title.includes('High-Risk Transaction'));
        if (highRiskInsight) {
          aiResponseContent = highRiskInsight.details + '\n\n' + (highRiskInsight.actionableRecommendations?.map(r => `Recommendation: ${r}`).join('\n') || '');
        }
      }

      setChatMessages(prev => [...prev, {
        id: `chat${Math.random().toString(36).substr(2, 9)}`,
        sender: 'AI',
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
        suggestedActions: suggestedActions.length > 0 ? suggestedActions : undefined,
      }]);
    }, 1500);
  }, [transactions, totalBalance, aiInsights, mockBalances]);

  const handleChatSuggestedAction = useCallback((action: string) => {
    if (action === 'show_pending_tx') {
      setActiveTab('transactions');
      // Further logic to filter transactions to show only pending
    } else if (action === 'get_liquidity' || action === 'show_asset_distribution') {
      setActiveTab('overview');
      // Scroll to asset distribution section
    } else if (action === 'open_send_modal') {
      setIsSendModalOpen(true);
    } else if (action.startsWith('details_')) {
      const insightId = action.replace('details_', '');
      const insight = aiInsights.find(i => i.id === insightId);
      if (insight) {
        setChatMessages(prev => [...prev, {
          id: `chat${Math.random().toString(36).substr(2, 9)}`,
          sender: 'AI',
          content: `Here are the full details for "${insight.title}":\n\n${insight.details}\n\nActionable Recommendations:\n${insight.actionableRecommendations?.map(r => `- ${r}`).join('\n') || 'None provided.'}`,
          timestamp: new Date().toISOString(),
        }]);
      }
    }
    // Add user message for the action
    setChatMessages(prev => [...prev, {
      id: `chat${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      content: `Executed suggested action: ${action}`,
      timestamp: new Date().toISOString(),
    }]);
  }, [aiInsights]);

  return (
    <div className="w-full max-w-7xl mx-auto my-8">
      <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                  <CardTitle className="text-3xl font-bold flex items-center text-slate-800 dark:text-slate-100">
                      <Wallet className="mr-3 h-8 w-8 text-blue-500" />
                      {walletName}
                  </CardTitle>
                  <CardDescription className="mt-1 font-mono text-lg">{truncateAddress(walletAddress)}</CardDescription>
              </div>
              <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Treasury Value</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-slate-50">{formatCurrency(totalBalance)}</p>
              </div>
          </div>
          <Separator className="my-4" />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview"><LayoutDashboard className="mr-2 h-4 w-4" /> Overview</TabsTrigger>
              <TabsTrigger value="transactions"><DollarSign className="mr-2 h-4 w-4" /> Transactions</TabsTrigger>
              <TabsTrigger value="assets"><TrendingUp className="mr-2 h-4 w-4" /> Assets</TabsTrigger>
              <TabsTrigger value="policies"><Gavel className="mr-2 h-4 w-4" /> Policies</TabsTrigger>
              <TabsTrigger value="signatories"><Users className="mr-2 h-4 w-4" /> Signatories</TabsTrigger>
              <TabsTrigger value="ai"><Lightbulb className="mr-2 h-4 w-4" /> AI & Analytics</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="space-y-8">
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col gap-4">
                    <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="w-full">
                                <ArrowUpRight className="mr-2 h-5 w-5" /> Send Funds
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Initiate New Transaction</DialogTitle>
                                <DialogDescription>
                                    This transaction will require {requiredSignatures} of {signatories.filter(s => s.isActive).length} active signatures to be executed.
                                    AI will perform a real-time risk assessment.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSendSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="recipient" className="text-right">Recipient Address</Label>
                                    <Input id="recipient" name="recipient" placeholder="0x..." className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="asset" className="text-right">Asset</Label>
                                    <Select name="asset" defaultValue='USDC'>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select an asset" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(mockBalances).map(asset => (
                                              <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="amount" className="text-right">Amount</Label>
                                    <Input id="amount" name="amount" type="number" placeholder="0.00" className="col-span-3" required step="0.01" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">Description</Label>
                                    <Input id="description" name="description" placeholder="Payment for services..." className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4 text-sm text-muted-foreground">
                                  <Label className="text-right">Estimated Gas Fee</Label>
                                  <span className="col-span-3 flex items-center"><Info className="h-4 w-4 mr-2" /> ~{formatCurrency(Math.random() * 10 + 2)} (dynamic)</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4 text-sm text-blue-500">
                                  <Label className="text-right">AI Risk Assessment</Label>
                                  <span className="col-span-3 flex items-center"><Lightbulb className="h-4 w-4 mr-2" /> Real-time analysis will be performed.</span>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Initiate Transaction</Button>
                            </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" variant="outline" className="w-full">
                                <ArrowDownLeft className="mr-2 h-5 w-5" /> Receive Funds
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Wallet Address</DialogTitle>
                            <DialogDescription>
                                Send funds to this address. Use the QR code or copy the address below.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center p-4 space-y-4">
                                <div className="p-4 bg-white rounded-lg">
                                    <QrCode size={160} />
                                </div>
                                <div className="flex items-center space-x-2 p-2 border rounded-md bg-slate-100 dark:bg-slate-800 w-full">
                                    <span className="text-sm font-mono truncate">{walletAddress}</span>
                                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                        <Copy className="h-4 w-4" />
                                        <span className="ml-2">{isCopied ? "Copied!" : "Copy"}</span>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                  <Info className="h-3 w-3 mr-1" />
                                  This address supports all ERC-20 tokens and native ETH.
                                </p>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(mockBalances).map(([asset, balance]) => (
                        <Card key={asset}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{asset}</CardTitle>
                                <AssetIcon asset={asset as Asset} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(balance).replace('$', '')}</div>
                                <p className="text-xs text-muted-foreground">{formatCurrency(balance * (mockAssetPrices[asset as Asset] || 1))} USD</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <KPIDashboard kpis={kpis} />

            <AIInsightsDashboard insights={aiInsights.filter(i => i.category === 'Liquidity' || i.category === 'Risk' || i.category === 'Performance')} />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Recent Transaction Activity</h3>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                        <Users className="h-5 w-5" />
                        <span><strong>{requiredSignatures} of {signatories.filter(s => s.isActive).length}</strong> signatures required</span>
                    </div>
                </div>
                
                <Dialog>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Risk</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.slice(0, 5).map((tx) => ( // Show only 5 recent transactions
                            <DialogTrigger asChild key={tx.id} onClick={() => setSelectedTx(tx)}>
                                <TableRow className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className={`mr-3 rounded-full p-2 ${tx.type === 'Outgoing' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                                                {tx.type === 'Outgoing' ? <ArrowUpRight className="h-4 w-4 text-red-500" /> : <ArrowDownLeft className="h-4 w-4 text-green-500" />}
                                            </div>
                                            <div>
                                                <div className="font-medium">{tx.asset} {tx.type}</div>
                                                <div className="text-sm text-muted-foreground">{tx.description || tx.date}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`text-right font-medium ${tx.type === 'Outgoing' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {tx.type === 'Outgoing' ? '-' : '+'} {formatCurrency(tx.amount)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <CustomBadge variant={getStatusBadgeVariant(tx.status)}>{tx.status}</CustomBadge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {tx.riskScore !== undefined && <CustomBadge variant={getRiskBadgeVariant(tx.riskScore > 0.7 ? 'High' : tx.riskScore > 0.4 ? 'Medium' : 'Low')}>{tx.riskScore > 0.7 ? 'High' : tx.riskScore > 0.4 ? 'Medium' : 'Low'}</CustomBadge>}
                                    </TableCell>
                                </TableRow>
                            </DialogTrigger>
                            ))}
                        </TableBody>
                    </Table>
                    <Button variant="link" className="mt-4" onClick={() => setActiveTab('transactions')}>View All Transactions</Button>

                    {selectedTx && (
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>ID: {selectedTx.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                 <div>
                                    <h4 className="font-semibold mb-2">Summary</h4>
                                    <div className="text-sm space-y-1 rounded-md border p-3 bg-slate-50 dark:bg-slate-800">
                                        <p><strong>Type:</strong> {selectedTx.type}</p>
                                        <p><strong>Amount:</strong> {selectedTx.amount} {selectedTx.asset} ({formatCurrency(selectedTx.usdValue)})</p>
                                        <p><strong>Date:</strong> {selectedTx.date}</p>
                                        {selectedTx.from && <p><strong>From:</strong> <span className="font-mono">{truncateAddress(selectedTx.from)}</span></p>}
                                        {selectedTx.to && <p><strong>To:</strong> <span className="font-mono">{truncateAddress(selectedTx.to)}</span></p>}
                                        {selectedTx.description && <p><strong>Description:</strong> {selectedTx.description}</p>}
                                        {selectedTx.gasFeeUsd !== undefined && <p><strong>Gas Fee:</strong> {formatCurrency(selectedTx.gasFeeUsd)}</p>}
                                        {selectedTx.blockchainTxHash && <p><strong>Tx Hash:</strong> <span className="font-mono">{truncateAddress(selectedTx.blockchainTxHash)}</span></p>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Signature Status ({selectedTx.approvals.length}/{selectedTx.requiredSignatures})</h4>
                                    <ul className="space-y-2">
                                        {signatories.filter(s => s.isActive).map(signer => {
                                            const hasSigned = selectedTx.approvals.includes(signer.address);
                                            return (
                                                <li key={signer.address} className="flex items-center text-sm">
                                                    {hasSigned ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <Clock className="h-4 w-4 mr-2 text-yellow-500" />}
                                                    <span className="font-mono">{getSignatoryName(signer.address)}</span>
                                                    {signer.address === currentUser && <Badge variant="outline" className="ml-2">You</Badge>}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                {selectedTx.riskScore !== undefined && (
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-2 text-red-500" /> AI Risk Assessment</h4>
                                    <div className="text-sm space-y-1 rounded-md border p-3 bg-red-50 dark:bg-red-900/30">
                                      <p><strong>Risk Score:</strong> <CustomBadge variant={getRiskBadgeVariant(selectedTx.riskScore > 0.7 ? 'High' : selectedTx.riskScore > 0.4 ? 'Medium' : 'Low')}>{selectedTx.riskScore.toFixed(2)} ({selectedTx.riskScore > 0.7 ? 'High' : selectedTx.riskScore > 0.4 ? 'Medium' : 'Low'})</CustomBadge></p>
                                      <p><strong>AI Recommendation:</strong> {selectedTx.aiRecommendation || 'No specific recommendation.'}</p>
                                    </div>
                                  </div>
                                )}
                            </div>
                             <DialogFooter>
                                {selectedTx.status === 'Pending' && canApproveTx && !selectedTx.approvals.includes(currentUser) && (
                                    <Button onClick={() => handleApproveTransaction(selectedTx.id)}>
                                        <CheckCircle className="mr-2 h-4 w-4"/> Approve Transaction
                                    </Button>
                                )}
                                <Button variant="outline" onClick={() => setSelectedTx(null)}>Close</Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-8">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-500" /> All Transactions
            </h3>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search transactions..." className="max-w-sm" />
              <Select>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Executing">Executing</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Asset" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  {Object.keys(mockBalances).map(asset => (
                    <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Apply Filters</Button>
            </div>
            <Dialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Risk</TableHead>
                            <TableHead className="text-center">Approvals</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                        <DialogTrigger asChild key={tx.id} onClick={() => setSelectedTx(tx)}>
                            <TableRow className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                                <TableCell className="font-mono text-xs">{truncateAddress(tx.id)}</TableCell>
                                <TableCell className="text-sm">{tx.date}</TableCell>
                                <TableCell className="text-sm">{tx.type}</TableCell>
                                <TableCell className="text-sm">{tx.asset}</TableCell>
                                <TableCell className={`text-right font-medium ${tx.type === 'Outgoing' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                    {tx.type === 'Outgoing' ? '-' : '+'} {formatCurrency(tx.amount)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <CustomBadge variant={getStatusBadgeVariant(tx.status)}>{tx.status}</CustomBadge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {tx.riskScore !== undefined && <CustomBadge variant={getRiskBadgeVariant(tx.riskScore > 0.7 ? 'High' : tx.riskScore > 0.4 ? 'Medium' : 'Low')}>{tx.riskScore > 0.7 ? 'High' : tx.riskScore > 0.4 ? 'Medium' : 'Low'}</CustomBadge>}
                                </TableCell>
                                <TableCell className="text-center text-sm">{tx.approvals.length}/{tx.requiredSignatures}</TableCell>
                            </TableRow>
                        </DialogTrigger>
                        ))}
                    </TableBody>
                </Table>
                {selectedTx && (
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                            <DialogDescription>ID: {selectedTx.id}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                             <div>
                                <h4 className="font-semibold mb-2">Summary</h4>
                                <div className="text-sm space-y-1 rounded-md border p-3 bg-slate-50 dark:bg-slate-800">
                                    <p><strong>Type:</strong> {selectedTx.type}</p>
                                    <p><strong>Amount:</strong> {selectedTx.amount} {selectedTx.asset} ({formatCurrency(selectedTx.usdValue)})</p>
                                    <p><strong>Date:</strong> {selectedTx.date}</p>
                                    {selectedTx.from && <p><strong>From:</strong> <span className="font-mono">{truncateAddress(selectedTx.from)}</span></p>}
                                    {selectedTx.to && <p><strong>To:</strong> <span className="font-mono">{truncateAddress(selectedTx.to)}</span></p>}
                                    {selectedTx.description && <p><strong>Description:</strong> {selectedTx.description}</p>}
                                    {selectedTx.gasFeeUsd !== undefined && <p><strong>Gas Fee:</strong> {formatCurrency(selectedTx.gasFeeUsd)}</p>}
                                    {selectedTx.blockchainTxHash && <p><strong>Tx Hash:</strong> <span className="font-mono">{truncateAddress(selectedTx.blockchainTxHash)}</span></p>}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Signature Status ({selectedTx.approvals.length}/{selectedTx.requiredSignatures})</h4>
                                <ul className="space-y-2">
                                    {signatories.filter(s => s.isActive).map(signer => {
                                        const hasSigned = selectedTx.approvals.includes(signer.address);
                                        return (
                                            <li key={signer.address} className="flex items-center text-sm">
                                                {hasSigned ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <Clock className="h-4 w-4 mr-2 text-yellow-500" />}
                                                <span className="font-mono">{getSignatoryName(signer.address)}</span>
                                                {signer.address === currentUser && <Badge variant="outline" className="ml-2">You</Badge>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            {selectedTx.riskScore !== undefined && (
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-2 text-red-500" /> AI Risk Assessment</h4>
                                    <div className="text-sm space-y-1 rounded-md border p-3 bg-red-50 dark:bg-red-900/30">
                                      <p><strong>Risk Score:</strong> <CustomBadge variant={getRiskBadgeVariant(selectedTx.riskScore > 0.7 ? 'High' : selectedTx.riskScore > 0.4 ? 'Medium' : 'Low')}>{selectedTx.riskScore.toFixed(2)} ({selectedTx.riskScore > 0.7 ? 'High' : selectedTx.riskScore > 0.4 ? 'Medium' : 'Low'})</CustomBadge></p>
                                      <p><strong>AI Recommendation:</strong> {selectedTx.aiRecommendation || 'No specific recommendation.'}</p>
                                    </div>
                                  </div>
                                )}
                        </div>
                         <DialogFooter>
                            {selectedTx.status === 'Pending' && canApproveTx && !selectedTx.approvals.includes(currentUser) && (
                                <Button onClick={() => handleApproveTransaction(selectedTx.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4"/> Approve Transaction
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setSelectedTx(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center"><Repeat className="mr-2 h-5 w-5 text-blue-500" /> AI Recurring Transactions</CardTitle>
                <CardDescription>Automate routine payments and transfers with AI-driven scheduling.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Our AI can identify recurring payment patterns and suggest automation, reducing manual effort and ensuring timely execution.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>Identified Patterns:</strong> Monthly payroll, quarterly vendor payments, weekly liquidity rebalancing.</li>
                  <li><strong>Automation Rate:</strong> 65% of routine transactions are currently automated.</li>
                  <li><strong>Savings:</strong> Estimated 10 hours/month in manual processing.</li>
                </ul>
                <Button variant="outline" size="sm" className="mt-4">Configure Recurring Transactions</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-8">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-500" /> Asset Portfolio
            </h3>
            <p className="text-sm text-muted-foreground">Detailed overview of all digital assets held in the corporate treasury, including their current value and distribution.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(mockBalances).map(([asset, balance]) => (
                <Card key={asset}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <AssetIcon asset={asset as Asset} className="mr-2" /> {asset}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Price: {formatCurrency(mockAssetPrices[asset as Asset] || 0)}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{balance.toFixed(4)}</div>
                    <p className="text-sm text-muted-foreground">{formatCurrency(balance * (mockAssetPrices[asset as Asset] || 1))} USD</p>
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                      <span>Allocation: {((balance * (mockAssetPrices[asset as Asset] || 1)) / totalBalance * 100).toFixed(2)}%</span>
                      <span>24h Change: {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> AI Yield Optimization</CardTitle>
                <CardDescription>AI-driven strategies to maximize returns on idle treasury assets.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Our AI continuously analyzes market conditions, DeFi protocols, and risk profiles to suggest optimal strategies for deploying idle capital, such as lending, staking, or liquidity provision.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>Opportunity 1:</strong> Deploy 200,000 USDC to Aave for an estimated 4.5% APY. (Low Risk)</li>
                  <li><strong>Opportunity 2:</strong> Stake 50 ETH in a liquid staking protocol for 3.8% APY. (Medium Risk)</li>
                  <li><strong>Opportunity 3:</strong> Provide liquidity to UNI/USDC pool on Uniswap for estimated 8% APY. (High Risk)</li>
                </ul>
                <Button variant="outline" size="sm" className="mt-4">Explore Yield Opportunities</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-8">
            <PolicyManagement policies={policies} onUpdatePolicy={handleUpdatePolicy} onAddPolicy={handleAddPolicy} onApprovePolicy={handleApprovePolicy} />
          </TabsContent>

          <TabsContent value="signatories" className="space-y-8">
            <SignatoryManagement signatories={signatories} onUpdateSignatory={handleUpdateSignatory} onAddSignatory={handleAddSignatory} />
          </TabsContent>

          <TabsContent value="ai" className="space-y-8">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <Bot className="mr-2 h-5 w-5 text-blue-500" /> AI & Advanced Analytics Hub
            </h3>
            <p className="text-sm text-muted-foreground">Centralized hub for all AI-powered features, predictive analytics, and comprehensive reporting.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIInsightsDashboard insights={aiInsights} />
              <AIChatAssistant messages={chatMessages} onSendMessage={handleChatSendMessage} onSuggestedAction={handleChatSuggestedAction} />
            </div>
            <Separator className="my-8" />
            <SmartContractAuditor />
            <Separator className="my-8" />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><BarChart className="mr-2 h-5 w-5 text-green-500" /> Predictive Cash Flow Analysis</CardTitle>
                <CardDescription>AI-driven forecasts for future liquidity and capital requirements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our advanced AI models analyze historical cash flows, projected revenues, and scheduled expenditures to provide accurate forecasts of your treasury's liquidity position.
                  This enables proactive decision-making and optimal capital allocation.
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>30-Day Forecast:</strong> Projected liquidity surplus of {formatCurrency(500000)} USD.</li>
                  <li><strong>90-Day Forecast:</strong> Stable liquidity with potential for {formatCurrency(100000)} USD deficit in week 8 due to large payment.</li>
                  <li><strong>Recommendations:</strong> Consider short-term lending for surplus, or pre-fund deficit with stablecoin swap.</li>
                </ul>
                <Button variant="outline" size="sm">View Detailed Forecast Report</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-500" /> Treasury Settings & Configuration
            </h3>
            <p className="text-sm text-muted-foreground">Manage global settings, security preferences, notifications, and integrations for your corporate treasury.</p>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-red-500" /> Security Settings</CardTitle>
                <CardDescription>Configure advanced security features for your treasury wallet.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="2fa">Two-Factor Authentication (2FA)</Label>
                  <Checkbox id="2fa" checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="geo-lock">Geo-Location Lock</Label>
                  <Checkbox id="geo-lock" checked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="spending-alerts">High-Value Transaction Alerts</Label>
                  <Checkbox id="spending-alerts" checked={true} />
                </div>
                <Button variant="outline" size="sm">Manage API Keys</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-orange-500" /> Notification Preferences</CardTitle>
                <CardDescription>Customize how and when you receive alerts and updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifs">Email Notifications</Label>
                  <Checkbox id="email-notifs" checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifs">Push Notifications (Mobile App)</Label>
                  <Checkbox id="push-notifs" checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="slack-notifs">Slack Integration</Label>
                  <Checkbox id="slack-notifs" checked={false} />
                </div>
                <Select defaultValue="critical">
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Minimum Alert Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <AuditLogViewer logs={auditLogs} />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
}