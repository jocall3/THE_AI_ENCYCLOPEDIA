import React, { useState, useMemo, useEffect } from 'react';
import { 
    LayoutDashboard, FileText, Users, Settings, DollarSign, CreditCard, BarChart2, Filter, PlusCircle, ChevronDown, CheckCircle, Clock, XCircle,
    ArrowLeftRight, Send, Wallet, Target, HeartPulse, TrendingUp, Bitcoin, BrainCircuit, Landmark, Warehouse, Home, Paintbrush, CandlestickChart, Rocket, Briefcase, Shield, Building, Archive, Network, Key, Bot, Sparkles, ShoppingBag, Clapperboard, Palette, Globe, Building2, Server, ConciergeBell, Castle, ShieldCheck, UserCog, Eye
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
type InvoiceStatus = 'Pending' | 'Approved' | 'Rejected' | 'Funded' | 'Audited' | 'AI_Flagged';
type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type ViewMode = 'Dashboard' | 'Invoices' | 'Suppliers' | 'Analytics' | 'AI_Nexus' | 'Settings' | 'Treasury';

interface Invoice {
  id: string;
  supplier: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  riskScore: number;
  aiAnalysis: string;
  probabilityOfDefault: number;
}

interface Supplier {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  region: string;
  earlyPaymentEligible: boolean;
  discountRate: number;
  sustainabilityScore: number;
  reliabilityIndex: number;
  activeContracts: number;
}

interface AIInsight {
  id: string;
  type: 'Opportunity' | 'Risk' | 'Optimization';
  message: string;
  impact: number; // Dollar value
  confidence: number;
  timestamp: string;
}

interface KPI {
  label: string;
  value: string;
  trend: number;
  icon: React.ElementType;
  color: string;
}

// --- MOCK DATA GENERATORS ---
const generateMockInvoices = (count: number): Invoice[] => {
  const statuses: InvoiceStatus[] = ['Pending', 'Approved', 'Rejected', 'Funded', 'AI_Flagged'];
  const suppliers = ['Global Parts Inc.', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems', 'Massive Dynamic', 'Acme Corp', 'Umbrella Corp'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `INV-${2024000 + i}`,
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    amount: Math.floor(Math.random() * 500000) + 10000,
    currency: 'USD',
    issueDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    dueDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    riskScore: Math.floor(Math.random() * 100),
    aiAnalysis: 'AI detects standard procurement pattern with slight deviation in shipping logistics.',
    probabilityOfDefault: Math.random() * 5
  }));
};

const generateMockSuppliers = (): Supplier[] => [
  { id: 'SUP-01', name: 'Global Parts Inc.', tier: 'Tier 1', region: 'North America', earlyPaymentEligible: true, discountRate: 2.5, sustainabilityScore: 92, reliabilityIndex: 98, activeContracts: 12 },
  { id: 'SUP-02', name: 'Stark Industries', tier: 'Tier 1', region: 'North America', earlyPaymentEligible: true, discountRate: 2.0, sustainabilityScore: 88, reliabilityIndex: 99, activeContracts: 45 },
  { id: 'SUP-03', name: 'Wayne Enterprises', tier: 'Tier 2', region: 'Europe', earlyPaymentEligible: false, discountRate: 0, sustainabilityScore: 95, reliabilityIndex: 96, activeContracts: 8 },
  { id: 'SUP-04', name: 'Cyberdyne Systems', tier: 'Tier 3', region: 'Asia Pacific', earlyPaymentEligible: true, discountRate: 3.0, sustainabilityScore: 65, reliabilityIndex: 82, activeContracts: 3 },
  { id: 'SUP-05', name: 'Massive Dynamic', tier: 'Tier 1', region: 'Global', earlyPaymentEligible: true, discountRate: 1.8, sustainabilityScore: 78, reliabilityIndex: 91, activeContracts: 22 },
];

const generateAIInsights = (): AIInsight[] => [
  { id: 'AI-01', type: 'Opportunity', message: 'Consolidating payments to Stark Industries could save $45k in transaction fees.', impact: 45000, confidence: 0.98, timestamp: '2 mins ago' },
  { id: 'AI-02', type: 'Risk', message: 'Supply chain disruption detected in APAC region affecting Cyberdyne Systems shipments.', impact: -120000, confidence: 0.85, timestamp: '15 mins ago' },
  { id: 'AI-03', type: 'Optimization', message: 'Dynamic discounting algorithm suggests increasing rate for Tier 2 suppliers.', impact: 85000, confidence: 0.92, timestamp: '1 hour ago' },
];

// --- UI COMPONENTS ---

const SidebarItem: React.FC<{ icon: React.ElementType, label: string, active: boolean, onClick: () => void, badge?: number }> = ({ icon: Icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 mb-2 rounded-xl transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
  >
    <div className="flex items-center">
      <Icon size={20} className={`mr-3 ${active ? 'animate-pulse' : ''}`} />
      <span className="font-medium tracking-wide">{label}</span>
    </div>
    {badge && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </button>
);

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, change?: string, trend?: 'up' | 'down' | 'neutral', color?: string }> = ({ icon: Icon, title, value, change, trend, color = 'blue' }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
        <Icon size={24} />
      </div>
      {change && (
        <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
          {trend === 'up' ? <TrendingUp size={16} className="mr-1" /> : <TrendingUp size={16} className="mr-1 rotate-180" />}
          {change}
        </div>
      )}
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

const AIBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score > 80 ? 'green' : score > 50 ? 'yellow' : 'red';
  return (
    <div className={`flex items-center space-x-1 px-2 py-1 rounded-md bg-${color}-100 dark:bg-${color}-900/30 border border-${color}-200 dark:border-${color}-800`}>
      <BrainCircuit size={14} className={`text-${color}-600 dark:text-${color}-400`} />
      <span className={`text-xs font-bold text-${color}-700 dark:text-${color}-300`}>{score}/100</span>
    </div>
  );
};

const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Approved: 'bg-blue-100 text-blue-800 border-blue-200',
    Funded: 'bg-green-100 text-green-800 border-green-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
    Audited: 'bg-purple-100 text-purple-800 border-purple-200',
    AI_Flagged: 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse',
  };
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const Button: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; icon?: React.ElementType; onClick?: () => void; className?: string }> = ({ children, variant = 'primary', icon: Icon, onClick, className = '' }) => {
  const base = "px-4 py-2 rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-200 transform active:scale-95";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30",
    outline: "border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
  };
  
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={16} className="mr-2" />}
      {children}
    </button>
  );
};

// --- MAIN COMPONENT ---

const SupplyChainFinancePortal: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('Dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>(generateMockInvoices(50));
  const [suppliers, setSuppliers] = useState<Supplier[]>(generateMockSuppliers());
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(generateAIInsights());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // --- COMPUTED STATS ---
  const stats = useMemo(() => {
    const totalExposure = invoices.reduce((acc, i) => acc + i.amount, 0);
    const fundedVolume = invoices.filter(i => i.status === 'Funded').reduce((acc, i) => acc + i.amount, 0);
    const riskExposure = invoices.filter(i => i.riskScore > 70).reduce((acc, i) => acc + i.amount, 0);
    const aiSavings = aiInsights.filter(i => i.type === 'Opportunity').reduce((acc, i) => acc + i.impact, 0);
    
    return { totalExposure, fundedVolume, riskExposure, aiSavings };
  }, [invoices, aiInsights]);

  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* AI HERO SECTION */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <BrainCircuit size={400} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-4 space-x-2">
            <Sparkles className="text-yellow-400 animate-pulse" />
            <span className="text-sm font-bold tracking-widest uppercase text-blue-200">Enterprise AI Core Online</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Good Morning, Executive.</h1>
          <p className="text-blue-100 max-w-2xl text-lg mb-8">
            System analysis complete. Supply chain liquidity is optimal. AI has identified <span className="font-bold text-white">${stats.aiSavings.toLocaleString()}</span> in potential optimization opportunities across 3 regions.
          </p>
          <div className="flex space-x-4">
            <Button variant="primary" icon={Bot} onClick={() => setIsAiChatOpen(true)}>Review AI Insights</Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white hover:border-white">Generate Report</Button>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Wallet} title="Total Liquidity" value={`$${(stats.totalExposure / 1000000).toFixed(2)}M`} change="+12.5%" trend="up" color="blue" />
        <StatCard icon={ShieldCheck} title="Risk Exposure" value={`$${(stats.riskExposure / 1000000).toFixed(2)}M`} change="-2.4%" trend="down" color="red" />
        <StatCard icon={Bitcoin} title="Digital Assets" value="$4.2M" change="+8.1%" trend="up" color="orange" />
        <StatCard icon={Rocket} title="Efficiency Score" value="94.2" change="+1.2" trend="up" color="purple" />
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COL: RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <ArrowLeftRight className="mr-2 text-blue-500" /> Transaction Flow
            </h2>
            <Button variant="ghost" icon={Filter}>Filter View</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Entity</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">AI Risk</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {invoices.slice(0, 6).map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs mr-3">
                        {inv.supplier.substring(0, 2).toUpperCase()}
                      </div>
                      {inv.supplier}
                    </td>
                    <td className="px-4 py-4 text-gray-500">{inv.issueDate}</td>
                    <td className="px-4 py-4 font-mono font-medium">${inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-4"><AIBadge score={100 - inv.riskScore} /></td>
                    <td className="px-4 py-4"><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COL: AI INSIGHTS FEED */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Bot className="mr-2 text-purple-500" /> Neural Feed
            </h2>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          </div>
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-purple-500 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    insight.type === 'Opportunity' ? 'bg-green-100 text-green-700' : 
                    insight.type === 'Risk' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>{insight.type}</span>
                  <span className="text-xs text-gray-400 flex items-center"><Clock size={10} className="mr-1"/> {insight.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2 group-hover:text-purple-500 transition-colors">{insight.message}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold ${insight.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {insight.impact > 0 ? '+' : ''}${Math.abs(insight.impact).toLocaleString()} Impact
                  </span>
                  <div className="flex items-center text-xs text-gray-400">
                    <BrainCircuit size={12} className="mr-1" /> {Math.floor(insight.confidence * 100)}% Conf.
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6" icon={Eye}>View All Predictions</Button>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Global Invoice Ledger</h2>
          <p className="text-gray-500 text-sm mt-1">AI-Powered auditing active across {invoices.length} documents</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Archive}>Export</Button>
          <Button variant="primary" icon={PlusCircle}>New Invoice</Button>
        </div>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-900/30 flex space-x-4 overflow-x-auto">
        {['All', 'Pending', 'Approved', 'Funded', 'AI_Flagged'].map(filter => (
          <button key={filter} className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-blue-500 transition-colors whitespace-nowrap">
            {filter.replace('_', ' ')} <span className="ml-2 text-gray-400 text-xs">({invoices.filter(i => filter === 'All' || i.status === filter).length})</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">AI Probability</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group">
                <td className="px-6 py-4 font-mono text-gray-500">{invoice.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{invoice.supplier}</td>
                <td className="px-6 py-4 font-bold">${invoice.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500">{invoice.dueDate}</td>
                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-1">
                    <div className={`h-1.5 rounded-full ${invoice.probabilityOfDefault < 2 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${(5 - invoice.probabilityOfDefault) * 20}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-400">{(5 - invoice.probabilityOfDefault).toFixed(1)}/5.0 Score</span>
                </td>
                <td className="px-6 py-4"><StatusBadge status={invoice.status} /></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors"><Settings size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map(supplier => (
        <div key={supplier.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 mr-4">
                {supplier.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{supplier.name}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Globe size={12} className="mr-1" /> {supplier.region}
                </div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold ${supplier.tier === 'Tier 1' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
              {supplier.tier}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Sustainability</div>
              <div className="text-lg font-bold text-green-600">{supplier.sustainabilityScore}/100</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Reliability</div>
              <div className="text-lg font-bold text-blue-600">{supplier.reliabilityIndex}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Active Contracts</span>
              <span className="font-medium">{supplier.activeContracts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Early Payment</span>
              <span className={`font-medium ${supplier.earlyPaymentEligible ? 'text-green-500' : 'text-red-500'}`}>
                {supplier.earlyPaymentEligible ? `${supplier.discountRate}% APR` : 'Ineligible'}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex space-x-2">
            <Button variant="outline" className="flex-1" icon={FileText}>Contracts</Button>
            <Button variant="primary" className="flex-1" icon={Send}>Pay</Button>
          </div>
        </div>
      ))}
      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-6 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer">
        <PlusCircle size={48} className="mb-4 opacity-50" />
        <span className="font-medium">Onboard New Supplier</span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-72 bg-gray-900 text-gray-300 flex flex-col border-r border-gray-800 shadow-2xl z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-gray-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Nexus<span className="text-blue-500">Fin</span></h1>
            <p className="text-xs text-gray-500">Enterprise OS v4.0</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 px-3">Main Operations</p>
            <SidebarItem icon={LayoutDashboard} label="Command Center" active={activeView === 'Dashboard'} onClick={() => setActiveView('Dashboard')} />
            <SidebarItem icon={FileText} label="Invoice Ledger" active={activeView === 'Invoices'} onClick={() => setActiveView('Invoices')} badge={12} />
            <SidebarItem icon={Users} label="Supplier Network" active={activeView === 'Suppliers'} onClick={() => setActiveView('Suppliers')} />
            <SidebarItem icon={Warehouse} label="Inventory Assets" active={false} onClick={() => {}} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 px-3">Financial Intelligence</p>
            <SidebarItem icon={BarChart2} label="Analytics Engine" active={activeView === 'Analytics'} onClick={() => setActiveView('Analytics')} />
            <SidebarItem icon={BrainCircuit} label="AI Nexus" active={activeView === 'AI_Nexus'} onClick={() => setActiveView('AI_Nexus')} badge={3} />
            <SidebarItem icon={Landmark} label="Treasury" active={activeView === 'Treasury'} onClick={() => setActiveView('Treasury')} />
          </div>

          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 px-3">System</p>
            <SidebarItem icon={Shield} label="Security Protocols" active={false} onClick={() => {}} />
            <SidebarItem icon={Settings} label="Configuration" active={activeView === 'Settings'} onClick={() => setActiveView('Settings')} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center p-3 rounded-xl bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-500">CFO Access Level</p>
            </div>
            <UserCog size={16} className="ml-auto text-gray-500" />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOP HEADER */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center px-8 z-10">
          <div className="flex items-center w-96 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 focus-within:ring-2 ring-blue-500 transition-all">
            <Eye className="text-gray-400 mr-3" size={18} />
            <input 
              type="text" 
              placeholder="Search invoices, suppliers, or ask AI..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="text-xs text-gray-400 border border-gray-300 dark:border-gray-600 rounded px-1.5">⌘K</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors relative">
              <ConciergeBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
              <Globe size={20} />
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <Button variant="primary" icon={PlusCircle}>Quick Action</Button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {activeView === 'Dashboard' && renderDashboard()}
          {activeView === 'Invoices' && renderInvoices()}
          {activeView === 'Suppliers' && renderSuppliers()}
          {activeView === 'AI_Nexus' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <BrainCircuit size={120} className="text-blue-200 mb-8 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Neural Engine Processing</h2>
              <p className="text-gray-500 max-w-md mb-8">The AI is currently analyzing 4.2TB of supply chain data to optimize your cash flow. Please check back in the Dashboard for real-time alerts.</p>
              <Button variant="primary" onClick={() => setActiveView('Dashboard')}>Return to Dashboard</Button>
            </div>
          )}
          {/* Placeholder for other views to keep code concise but functional */}
          {['Analytics', 'Settings', 'Treasury'].includes(activeView) && (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
              <ConstructionIcon size={64} className="mb-4" />
              <h3 className="text-xl font-bold">Module Loading...</h3>
            </div>
          )}
        </main>

        {/* AI CHAT OVERLAY */}
        {isAiChatOpen && (
          <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-blue-600 text-white">
              <div className="flex items-center">
                <Bot className="mr-2" />
                <span className="font-bold">Nexus AI Assistant</span>
              </div>
              <button onClick={() => setIsAiChatOpen(false)} className="hover:bg-blue-700 p-1 rounded"><XCircle size={20} /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0"><Bot size={16} className="text-blue-600"/></div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-r-xl rounded-bl-xl shadow-sm text-sm border border-gray-100 dark:border-gray-700">
                  Hello! I've analyzed your current cash flow. You have $4.2M in pending invoices that are eligible for early payment. Would you like to see a simulation?
                </div>
              </div>
              <div className="flex items-start justify-end">
                <div className="bg-blue-600 text-white p-3 rounded-l-xl rounded-br-xl shadow-sm text-sm">
                  Yes, show me the risk analysis for Stark Industries first.
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0"><UserCog size={16} className="text-gray-600"/></div>
              </div>
               <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0"><Bot size={16} className="text-blue-600"/></div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-r-xl rounded-bl-xl shadow-sm text-sm border border-gray-100 dark:border-gray-700">
                  Stark Industries shows a 99% reliability index. However, recent geopolitical events in their region have slightly increased shipping latency risks. I recommend proceeding with early payment to secure priority shipping.
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <input type="text" placeholder="Ask anything..." className="flex-1 bg-transparent outline-none text-sm" />
                <button className="text-blue-600 hover:text-blue-700"><Send size={18} /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for the placeholder view
const ConstructionIcon: React.FC<{ size?: number, className?: string }> = ({ size, className }) => (
  <div className={className}>
    <Paintbrush size={size} className="text-gray-300" />
  </div>
);

export default SupplyChainFinancePortal;