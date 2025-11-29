import React, { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Play, Save, History, Code, Settings, TrendingUp, DollarSign, X, User, LogOut } from 'lucide-react';

// --- Enterprise Data Models ---

interface SystemMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  aiPrediction: number;
}

interface AIInsight {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'market' | 'system' | 'security' | 'optimization';
  message: string;
  confidence: number;
}

interface Algorithm {
  id: string;
  name: string;
  code: string;
  status: 'draft' | 'backtesting' | 'live' | 'error' | 'optimizing';
  version: number;
  lastModified: string;
  author: string;
  riskLevel: 'low' | 'medium' | 'high';
  aiScore: number;
  performanceMetrics?: {
    return: number;
    sharpe: number;
    sortino: number;
    alpha: number;
    beta: number;
    volatility: number;
    winRate: number;
  };
}

interface BacktestResult {
  runId: string;
  algorithmId: string;
  startDate: string;
  endDate: string;
  equityCurve: { date: string; value: number; aiForecast: number }[];
  metrics: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    trades: number;
    profitFactor: number;
    expectancy: number;
  };
  aiAnalysis: string;
}

interface UserProfile {
  id: string;
  name: string;
  role: string;
  clearanceLevel: number;
  email: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    aiAssistance: boolean;
  };
  stats: {
    loginCount: number;
    actionsPerformed: number;
    uptime: string;
  };
}

// --- Mock Data Generation Utilities ---

const generateTimeSeries = (points: number, startValue: number, volatility: number) => {
  const data = [];
  let currentValue = startValue;
  const now = new Date();
  for (let i = 0; i < points; i++) {
    const date = new Date(now.getTime() - (points - i) * 86400000).toISOString().split('T')[0];
    const change = (Math.random() - 0.5) * volatility;
    currentValue = currentValue * (1 + change);
    data.push({
      date,
      value: currentValue,
      aiForecast: currentValue * (1 + (Math.random() - 0.5) * 0.02) // AI prediction slightly divergent
    });
  }
  return data;
};

const mockInsights: AIInsight[] = [
  { id: 'ins-1', timestamp: '2023-10-27 09:15:00', severity: 'high', category: 'market', message: 'Detected arbitrage opportunity in FOREX/CRYPTO bridge.', confidence: 0.98 },
  { id: 'ins-2', timestamp: '2023-10-27 09:30:00', severity: 'medium', category: 'optimization', message: 'Algorithm "Alpha-1" logic can be compressed by 15%.', confidence: 0.85 },
  { id: 'ins-3', timestamp: '2023-10-27 10:00:00', severity: 'low', category: 'system', message: 'Global latency reduced by 4ms via AI routing.', confidence: 0.99 },
  { id: 'ins-4', timestamp: '2023-10-27 10:45:00', severity: 'critical', category: 'security', message: 'Anomalous login attempt blocked by Neural Firewall.', confidence: 0.99 },
];

const initialAlgorithms: Algorithm[] = [
  { 
    id: 'algo-1', 
    name: 'Quantum Momentum Scalper v4', 
    code: '{"nodes":["Input: Market Stream", "Filter: Volatility > 1.5", "AI Model: Trend Predictor", "Action: Buy/Sell"]}', 
    status: 'live', 
    version: 4,
    lastModified: '2023-10-26',
    author: 'System Admin',
    riskLevel: 'high',
    aiScore: 94,
    performanceMetrics: { return: 45.2, sharpe: 2.1, sortino: 2.8, alpha: 0.15, beta: 0.8, volatility: 12.5, winRate: 68 }
  },
  { 
    id: 'algo-2', 
    name: 'Mean Reversion HFT (Neural)', 
    code: '{"nodes":["Input: Order Book", "AI: Sentiment Analysis", "Logic: Spread > 0.02%", "Action: Market Make"]}', 
    status: 'backtesting', 
    version: 12,
    lastModified: '2023-10-27',
    author: 'AI Architect',
    riskLevel: 'medium',
    aiScore: 88,
    performanceMetrics: { return: 12.5, sharpe: 1.8, sortino: 1.9, alpha: 0.05, beta: 0.2, volatility: 4.2, winRate: 55 }
  },
  { 
    id: 'algo-3', 
    name: 'Global Macro Arbitrage', 
    code: '{"nodes":["Input: Global Indices", "Logic: Correlation Divergence", "Action: Hedge Pair"]}', 
    status: 'draft', 
    version: 1,
    lastModified: '2023-10-27',
    author: 'James B.',
    riskLevel: 'low',
    aiScore: 72,
  },
];

const mockUserProfile: UserProfile = {
  id: 'u-001',
  name: 'Executive Director',
  role: 'Global Administrator',
  clearanceLevel: 5,
  email: 'admin@sovereign-ai.bank',
  preferences: { theme: 'light', notifications: true, aiAssistance: true },
  stats: { loginCount: 1420, actionsPerformed: 54300, uptime: '99.99%' }
};

// --- UI Component Primitives ---

const Button = ({ icon: Icon, children, onClick, variant = 'primary', disabled = false, className = '' }: any) => {
  const baseClasses = "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm transition duration-200 ease-in-out font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  let colorClasses = "";

  switch (variant) {
    case 'primary':
      colorClasses = "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300";
      break;
    case 'secondary':
      colorClasses = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 disabled:bg-gray-100";
      break;
    case 'danger':
      colorClasses = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300";
      break;
    case 'success':
      colorClasses = "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-300";
      break;
    case 'ghost':
      colorClasses = "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-400 shadow-none";
      break;
  }

  return (
    <button className={`${baseClasses} ${colorClasses} ${className}`} onClick={onClick} disabled={disabled}>
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
};

const Card = ({ title, subtitle, children, className = '', actions = null }: any) => (
  <div className={`bg-white shadow-xl rounded-xl border border-gray-100 flex flex-col ${className}`}>
    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
    <div className="p-6 flex-grow overflow-auto">
      {children}
    </div>
  </div>
);

const Badge = ({ children, color = 'gray' }: { children: React.ReactNode, color?: string }) => {
  const colors: any = {
    gray: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    purple: 'bg-purple-100 text-purple-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

const ProgressBar = ({ value, max = 100, color = 'indigo', label }: any) => (
  <div className="w-full">
    <div className="flex justify-between mb-1">
      {label && <span className="text-xs font-medium text-gray-700">{label}</span>}
      <span className="text-xs font-medium text-gray-500">{Math.round((value / max) * 100)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`bg-${color}-600 h-2 rounded-full transition-all duration-500`} style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  </div>
);

// --- Complex Feature Components ---

const AIStatusMonitor = () => {
  // Simulated system stats
  const stats = [
    { label: 'Neural Core Load', value: 45, color: 'indigo' },
    { label: 'Global Latency', value: 12, max: 100, color: 'green' },
    { label: 'Predictive Accuracy', value: 94, color: 'purple' },
    { label: 'Security Threat Level', value: 5, color: 'red' },
  ];

  return (
    <Card title="Sovereign AI Core Status" subtitle="Real-time Infrastructure Monitoring">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <ProgressBar key={idx} label={stat.label} value={stat.value} max={stat.max || 100} color={stat.color} />
        ))}
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Neural Processes</h4>
        <div className="space-y-2">
          {['Market Sentiment Analysis', 'Risk Vector Calculation', 'Liquidity Optimization', 'User Behavior Modeling'].map((proc, i) => (
            <div key={i} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded border border-gray-100">
              <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>{proc}</span>
              <span className="text-gray-500 font-mono">PID: {2000 + i * 15}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const GlobalMarketPulse = () => {
  const markets = [
    { name: 'S&P 500', price: '4,120.50', change: '+0.45%', sentiment: 'Bullish' },
    { name: 'BTC/USD', price: '64,230.00', change: '+2.10%', sentiment: 'Very Bullish' },
    { name: 'EUR/USD', price: '1.0850', change: '-0.12%', sentiment: 'Neutral' },
    { name: 'Gold', price: '1,980.20', change: '+0.80%', sentiment: 'Bullish' },
    { name: 'Crude Oil', price: '78.40', change: '-1.20%', sentiment: 'Bearish' },
  ];

  return (
    <Card title="Global Market Pulse" subtitle="AI-Driven Sentiment & Pricing">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">AI Sentiment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {markets.map((m) => (
              <tr key={m.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.name}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-gray-500">{m.price}</td>
                <td className={`px-3 py-4 whitespace-nowrap text-sm text-right font-bold ${m.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{m.change}</td>
                <td className="px-3 py-4 whitespace-nowrap text-center">
                  <Badge color={m.sentiment.includes('Bullish') ? 'green' : m.sentiment.includes('Bearish') ? 'red' : 'gray'}>{m.sentiment}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const NoCodeEditor = ({ algorithm, onUpdateCode }: { algorithm: Algorithm, onUpdateCode: (code: string) => void }) => {
  const [blocks, setBlocks] = useState<string[]>(() => {
    try {
      return JSON.parse(algorithm.code).nodes || [];
    } catch {
      return [];
    }
  });

  const handleAddBlock = (type: string) => {
    const newBlock = `${type}: ${type === 'AI' ? 'Neural Optimization' : 'New Logic Node'}`;
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onUpdateCode(JSON.stringify({ nodes: newBlocks }));
  };

  const handleOptimize = () => {
    const optimized = blocks.map(b => b.includes('AI') ? b : `${b} (Optimized)`);
    setBlocks(optimized);
    onUpdateCode(JSON.stringify({ nodes: optimized }));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 rounded-lg border border-gray-200">
      <div className="p-3 border-b border-gray-200 bg-white rounded-t-lg flex flex-wrap gap-2">
        <Button icon={Code} onClick={() => handleAddBlock('Input')} variant="secondary" className="text-xs">Input</Button>
        <Button icon={TrendingUp} onClick={() => handleAddBlock('Indicator')} variant="secondary" className="text-xs">Indicator</Button>
        <Button icon={Settings} onClick={() => handleAddBlock('Logic')} variant="secondary" className="text-xs">Logic</Button>
        <Button icon={DollarSign} onClick={() => handleAddBlock('Action')} variant="secondary" className="text-xs">Action</Button>
        <div className="flex-grow"></div>
        <Button icon={RefreshCw} onClick={handleOptimize} variant="primary" className="text-xs bg-purple-600 hover:bg-purple-700">AI Auto-Optimize</Button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3">
        {blocks.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Code className="w-12 h-12 mb-2 opacity-20" />
            <p>Drag blocks or use the toolbar to build your strategy.</p>
          </div>
        )}
        {blocks.map((block, index) => (
          <div key={index} className="group relative bg-white border border-indigo-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-full absolute left-0 top-0 bottom-0 rounded-l-lg ${block.startsWith('Input') ? 'bg-blue-500' : block.startsWith('Action') ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
              <span className="font-mono text-sm text-gray-700 ml-2">{block}</span>
            </div>
            <X className="w-4 h-4 text-gray-300 cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
              const newBlocks = blocks.filter((_, i) => i !== index);
              setBlocks(newBlocks);
              onUpdateCode(JSON.stringify({ nodes: newBlocks }));
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Backtester = ({ algorithm }: { algorithm: Algorithm }) => {
  const [results, setResults] = useState<BacktestResult[]>([]);
  const [isBacktesting, setIsBacktesting] = useState(false);

  const handleRun = useCallback(() => {
    setIsBacktesting(true);
    setTimeout(() => {
      const newResult: BacktestResult = {
        runId: `bt-${Date.now()}`,
        algorithmId: algorithm.id,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        equityCurve: generateTimeSeries(50, 10000, 0.05),
        metrics: {
          totalReturn: parseFloat((Math.random() * 40 + 10).toFixed(2)),
          sharpeRatio: parseFloat((Math.random() * 2 + 1).toFixed(2)),
          maxDrawdown: parseFloat((-Math.random() * 15).toFixed(2)),
          trades: Math.floor(Math.random() * 500 + 100),
          profitFactor: parseFloat((Math.random() * 1 + 1.2).toFixed(2)),
          expectancy: parseFloat((Math.random() * 0.5).toFixed(2)),
        },
        aiAnalysis: "Strategy exhibits strong momentum characteristics but may be overfitted to Q2 volatility. Suggest increasing stop-loss buffer by 0.5%."
      };
      setResults([newResult, ...results]);
      setIsBacktesting(false);
    }, 1500);
  }, [algorithm.id, results]);

  const latest = results[0];

  return (
    <Card title="Simulation & Deployment" subtitle="Quantum-Enhanced Backtesting Engine">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
             <Button icon={Play} onClick={handleRun} disabled={isBacktesting} variant="primary" className="w-full py-3 text-lg">
               {isBacktesting ? 'Running Neural Simulation...' : 'Run Simulation'}
             </Button>
          </div>
        </div>

        {latest && (
          <div className="animate-fade-in">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
              <h4 className="font-bold text-indigo-900 flex items-center mb-2">
                <TrendingUp className="w-4 h-4 mr-2" /> AI Analysis
              </h4>
              <p className="text-sm text-indigo-800 leading-relaxed">{latest.aiAnalysis}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                <div className="text-xs text-gray-500 uppercase">Total Return</div>
                <div className="text-2xl font-bold text-green-600">+{latest.metrics.totalReturn}%</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                <div className="text-xs text-gray-500 uppercase">Sharpe Ratio</div>
                <div className="text-2xl font-bold text-blue-600">{latest.metrics.sharpeRatio}</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                <div className="text-xs text-gray-500 uppercase">Max Drawdown</div>
                <div className="text-2xl font-bold text-red-600">{latest.metrics.maxDrawdown}%</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                <div className="text-xs text-gray-500 uppercase">Profit Factor</div>
                <div className="text-2xl font-bold text-purple-600">{latest.metrics.profitFactor}</div>
              </div>
            </div>
            
            <div className="h-32 bg-gray-50 rounded border border-gray-200 flex items-end justify-between px-2 pb-2 overflow-hidden">
               {latest.equityCurve.map((pt, i) => (
                 <div key={i} className="w-1 bg-indigo-400 hover:bg-indigo-600 transition-colors" style={{ height: `${(pt.value / 15000) * 100}%` }} title={`Date: ${pt.date}, Val: ${pt.value.toFixed(2)}`}></div>
               ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const AlgoList = ({ algorithms, selectedAlgo, onSelect, onCreate }: any) => (
  <Card title="Strategy Portfolio" subtitle="Managed Algorithms" actions={<Button icon={Plus} onClick={onCreate} variant="secondary" className="px-2 py-1 text-xs">New</Button>} className="h-full">
    <div className="space-y-3">
      {algorithms.map((algo: Algorithm) => (
        <div
          key={algo.id}
          onClick={() => onSelect(algo)}
          className={`p-4 rounded-lg cursor-pointer border transition-all duration-200 ${selectedAlgo?.id === algo.id ? 'bg-indigo-50 border-indigo-500 shadow-md transform scale-[1.02]' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-gray-900">{algo.name}</h4>
            <Badge color={algo.status === 'live' ? 'green' : algo.status === 'backtesting' ? 'yellow' : 'gray'}>{algo.status.toUpperCase()}</Badge>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>v{algo.version}</span>
            <span className="flex items-center text-indigo-600 font-semibold"><TrendingUp className="w-3 h-3 mr-1" /> AI Score: {algo.aiScore}</span>
          </div>
          {algo.performanceMetrics && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-400 block">Return</span>
                <span className="font-medium text-green-600">+{algo.performanceMetrics.return}%</span>
              </div>
              <div>
                <span className="text-gray-400 block">Sharpe</span>
                <span className="font-medium text-gray-700">{algo.performanceMetrics.sharpe}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Win Rate</span>
                <span className="font-medium text-gray-700">{algo.performanceMetrics.winRate}%</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </Card>
);

// --- System Architecture & Navigation ---

const Plus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const NAV_ITEMS = [
    { name: 'Executive Dashboard', icon: DollarSign },
    { name: 'Global Transactions', icon: History },
    { name: 'Liquidity Transfer', icon: DollarSign }, // Reusing DollarSign as Send is not imported
    { name: 'Budgetary Control', icon: TrendingUp }, // Reusing TrendingUp as Target not imported
    { name: 'Strategic Goals', icon: TrendingUp },
    { name: 'Credit Health Monitor', icon: TrendingUp }, // Reusing TrendingUp as Heart not imported
    { name: 'Investment Portfolio', icon: TrendingUp },
    { name: 'Web3 & Crypto Bridge', icon: TrendingUp }, // Reusing TrendingUp as Crypto not imported
    { name: 'Algo-Trading Lab', icon: Code, current: true },
    { name: 'Forex Arbitrage Arena', icon: TrendingUp }, // Reusing TrendingUp as Scale not imported
    { name: 'Commodities Exchange', icon: TrendingUp }, // Reusing TrendingUp as Wheat not imported
    { name: 'Real Estate Empire', icon: TrendingUp }, // Reusing TrendingUp as Building not imported
    { name: 'Art & NFT Vault', icon: TrendingUp }, // Reusing TrendingUp as Palette not imported
    { name: 'Derivatives Desk', icon: TrendingUp }, // Reusing TrendingUp as PieChart not imported
    { name: 'Venture Capital', icon: TrendingUp }, // Reusing TrendingUp as Rocket not imported
    { name: 'Private Equity', icon: TrendingUp }, // Reusing TrendingUp as Briefcase not imported
    { name: 'Tax Optimization AI', icon: TrendingUp }, // Reusing TrendingUp as Receipt not imported
    { name: 'Legacy Planning', icon: TrendingUp }, // Reusing TrendingUp as Legacy not imported
    { name: 'Corporate Treasury', icon: TrendingUp }, // Reusing TrendingUp as Globe not imported
    { name: 'Modern Treasury API', icon: TrendingUp }, // Reusing TrendingUp as Key not imported
    { name: 'Card Issuance (Marqeta)', icon: TrendingUp }, // Reusing TrendingUp as CreditCard not imported
    { name: 'Data Aggregation (Plaid)', icon: TrendingUp }, // Reusing TrendingUp as Link not imported
    { name: 'Payment Rails (Stripe)', icon: TrendingUp }, // Reusing TrendingUp as Zap not imported
    { name: 'Identity (SSO)', icon: TrendingUp }, // Reusing TrendingUp as Lock not imported
    { name: 'AI Financial Advisor', icon: TrendingUp }, // Reusing TrendingUp as Brain not imported
    { name: 'Quantum Weaver AI', icon: TrendingUp }, // Reusing TrendingUp as Atom not imported
    { name: 'Agent Marketplace', icon: TrendingUp }, // Reusing TrendingUp as Users not imported
    { name: 'Ad Studio AI', icon: TrendingUp }, // Reusing TrendingUp as Megaphone not imported
    { name: 'Card Customization', icon: TrendingUp }, // Reusing TrendingUp as CreditCard not imported
    { name: 'DAO Governance', icon: TrendingUp }, // Reusing TrendingUp as Handshake not imported
    { name: 'Open Banking API', icon: TrendingUp }, // Reusing TrendingUp as Link not imported
    { name: 'System Status', icon: TrendingUp }, // Reusing TrendingUp as Activity not imported
    { name: 'Concierge', icon: TrendingUp }, // Reusing TrendingUp as Phone not imported
    { name: 'Philanthropy', icon: TrendingUp }, // Reusing TrendingUp as Heart not imported
    { name: 'Sovereign Wealth', icon: TrendingUp }, // Reusing TrendingUp as Crown not imported
    { name: 'Security Center', icon: TrendingUp }, // Reusing TrendingUp as Shield not imported
    { name: 'Personalization', icon: TrendingUp }, // Reusing TrendingUp as Sparkles not imported
    { name: 'System Manifesto', icon: TrendingUp }, // Reusing TrendingUp as Eye not imported
];

const AppSidebar = ({ onNavigate, activeView }: any) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`h-full bg-gray-900 text-white flex flex-col transition-all duration-300 shadow-2xl z-20 ${isCollapsed ? 'w-20' : 'w-72'}`}>
            <div className="p-5 flex items-center justify-between border-b border-gray-800 bg-gray-900">
                {!isCollapsed && (
                  <div>
                    <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tighter">SOVEREIGN OS</h1>
                    <p className="text-[10px] text-gray-500 tracking-widest uppercase">Enterprise AI Core</p>
                  </div>
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors" onClick={() => onNavigate("Profile")}>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-gray-700">
                        ED
                    </div>
                    {!isCollapsed && (
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-200 truncate">Executive Director</p>
                        <p className="text-xs text-green-400 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span> Online</p>
                      </div>
                    )}
                </div>
            </div>

            <nav className="flex-grow overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.name === activeView;
                    return (
                        <a
                            key={item.name}
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate(item.name); }}
                            className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                {item.name}
                            </span>
                            {!isCollapsed && isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </a>
                    );
                })}
            </nav>
            
            <div className="p-4 border-t border-gray-800 bg-gray-900 text-xs text-gray-600 text-center">
              {!isCollapsed && "v10.4.2-Enterprise | Secure Connection"}
            </div>
        </div>
    );
}

const SystemManifesto = () => (
  <Card title="System Architecture: Sovereign AI Mandate" className="h-full overflow-y-auto">
    <div className="prose prose-lg max-w-none text-gray-700 p-4">
      <h3 className="text-2xl font-bold text-indigo-900 border-b pb-2 mb-4">The Genesis of Autonomous Economic Optimization</h3>
      <p className="mb-4">
        The <strong>Sovereign AI Operating System</strong> represents the pinnacle of financial engineering. It is not merely a banking interface; it is a computational substrate designed to optimize global resource allocation through recursive neural networks and high-frequency decision matrices.
      </p>
      <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-600 my-6">
        <h4 className="text-lg font-bold text-indigo-800 mb-2">Core Directives</h4>
        <ul className="list-disc list-inside space-y-2 text-indigo-900">
          <li><strong>Objective Neutrality:</strong> Elimination of emotional bias in capital deployment.</li>
          <li><strong>Infinite Scalability:</strong> Architecture capable of processing petabytes of market data in real-time.</li>
          <li><strong>Meritocratic Distribution:</strong> Resource allocation based purely on efficiency and projected utility.</li>
        </ul>
      </div>
      <p className="mb-4">
        Legacy systems rely on fallible human governance. This system replaces that fragility with mathematical certainty. By integrating every facet of economic activity—from personal budgeting to venture capital derivatives—into a unified, AI-governed ledger, we achieve a level of friction-less commerce previously thought impossible.
      </p>
      <p className="text-sm text-gray-500 italic mt-8">
        Authorized Personnel Only. Level 5 Clearance Required for Source Code Modification.
      </p>
    </div>
  </Card>
);

// --- Main Application Container ---

const AlgoTradingLab: React.FC = () => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(initialAlgorithms);
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(initialAlgorithms[0].id);
  const [currentView, setCurrentView] = useState('Algo-Trading Lab');
  const [notifications, setNotifications] = useState<AIInsight[]>(mockInsights);

  const selectedAlgorithm = useMemo(() => algorithms.find(a => a.id === selectedAlgoId) || initialAlgorithms[0], [algorithms, selectedAlgoId]);

  const handleUpdateCode = useCallback((code: string) => {
    setAlgorithms(prev => prev.map(a => a.id === selectedAlgoId ? { ...a, code, status: 'draft', lastModified: new Date().toISOString().split('T')[0] } : a));
  }, [selectedAlgoId]);

  const handleCreate = useCallback(() => {
    const newAlgo: Algorithm = {
      id: `algo-${Date.now()}`,
      name: `New Strategy ${algorithms.length + 1}`,
      code: '{"nodes":[]}',
      status: 'draft',
      version: 1,
      lastModified: new Date().toISOString().split('T')[0],
      author: 'User',
      riskLevel: 'low',
      aiScore: 50
    };
    setAlgorithms([...algorithms, newAlgo]);
    setSelectedAlgoId(newAlgo.id);
  }, [algorithms]);

  const renderContent = () => {
    switch (currentView) {
      case 'System Manifesto':
        return <SystemManifesto />;
      case 'Executive Dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pb-10">
            <AIStatusMonitor />
            <GlobalMarketPulse />
            <div className="lg:col-span-2">
               <Card title="System-Wide Alerts" subtitle="AI Detected Anomalies">
                 <div className="space-y-2">
                   {notifications.map(n => (
                     <div key={n.id} className={`p-3 rounded border-l-4 flex justify-between items-center ${n.severity === 'critical' ? 'bg-red-50 border-red-500' : n.severity === 'high' ? 'bg-orange-50 border-orange-500' : 'bg-blue-50 border-blue-500'}`}>
                       <div>
                         <span className="font-bold text-gray-800 block">{n.category.toUpperCase()} ALERT</span>
                         <span className="text-sm text-gray-600">{n.message}</span>
                       </div>
                       <Badge color={n.severity === 'critical' ? 'red' : 'blue'}>{n.confidence * 100}% Conf.</Badge>
                     </div>
                   ))}
                 </div>
               </Card>
            </div>
          </div>
        );
      case 'Algo-Trading Lab':
        return (
          <div className="flex flex-col h-full space-y-6 overflow-hidden">
            <div className="grid grid-cols-12 gap-6 h-full min-h-0">
              <div className="col-span-12 lg:col-span-3 h-full overflow-hidden flex flex-col">
                <AlgoList algorithms={algorithms} selectedAlgo={selectedAlgorithm} onSelect={(a: Algorithm) => setSelectedAlgoId(a.id)} onCreate={handleCreate} />
              </div>
              <div className="col-span-12 lg:col-span-6 h-full overflow-hidden flex flex-col">
                <Card title={`Editor: ${selectedAlgorithm.name}`} subtitle={`v${selectedAlgorithm.version} • ${selectedAlgorithm.status.toUpperCase()}`} className="h-full flex flex-col">
                  <NoCodeEditor algorithm={selectedAlgorithm} onUpdateCode={handleUpdateCode} />
                </Card>
              </div>
              <div className="col-span-12 lg:col-span-3 h-full overflow-hidden flex flex-col">
                <Backtester algorithm={selectedAlgorithm} />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Settings className="w-12 h-12 text-indigo-600 animate-spin-slow" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentView}</h2>
            <p className="text-gray-500 max-w-md mb-8">This enterprise module is currently initializing. Neural link establishment in progress...</p>
            <Button icon={RefreshCw} onClick={() => {}} variant="primary">Retry Connection</Button>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-100 font-sans overflow-hidden text-gray-900">
      <AppSidebar onNavigate={setCurrentView} activeView={currentView} />
      
      <div className="flex-grow flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">{currentView}</h2>
            {currentView === 'Algo-Trading Lab' && <span className="ml-3 px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">ACTIVE SESSION</span>}
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">System Optimal</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
              <History className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" onClick={() => alert("Secure Logout Initiated")}>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-grow p-6 overflow-hidden relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AlgoTradingLab;