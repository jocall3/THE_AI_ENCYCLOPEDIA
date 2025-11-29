import React, { useState, useMemo, FC } from 'react';

// --- TYPE DEFINITIONS ---

type AssetCategory = 
  | 'Real Estate' 
  | 'Collectibles' 
  | 'Fine Art' 
  | 'Private Equity' 
  | 'Cryptocurrency' 
  | 'Commodities' 
  | 'Derivatives' 
  | 'Venture Capital' 
  | 'Intellectual Property'
  | 'Hedge Funds'
  | 'Precious Metals';

type RiskLevel = 'Conservative' | 'Moderate' | 'Aggressive' | 'Speculative';
type MarketSentiment = 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
type AIRecommendation = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';

interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  predictedValueOneYear: number;
  lastAppraisalDate: string;
  riskScore: number; // 0-100
  liquidityScore: number; // 0-100
  aiConfidenceScore: number; // 0-100
  sentiment: MarketSentiment;
  recommendation: AIRecommendation;
  notes?: string;
  historicalPerformance: number[]; // Array of values for sparklines
  tags: string[];
  region: string;
  currency: string;
}

interface KPI {
  id: string;
  label: string;
  value: number;
  change: number;
  isCurrency: boolean;
  aiInsight: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// --- MOCK DATA GENERATOR ---

const generateHistoricalData = (baseValue: number, points: number): number[] => {
  let current = baseValue;
  const data = [];
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * (baseValue * 0.05);
    current += change;
    data.push(current);
  }
  return data;
};

const initialAssets: Asset[] = [
  {
    id: 're-001',
    name: 'Global Enterprise Tower',
    category: 'Real Estate',
    purchaseDate: '2015-03-12',
    purchasePrice: 12500000,
    currentValue: 18750000,
    predictedValueOneYear: 19500000,
    lastAppraisalDate: '2023-12-01',
    riskScore: 12,
    liquidityScore: 45,
    aiConfidenceScore: 94,
    sentiment: 'Bullish',
    recommendation: 'Hold',
    historicalPerformance: generateHistoricalData(12500000, 24),
    tags: ['Commercial', 'Class A', 'Urban'],
    region: 'North America',
    currency: 'USD'
  },
  {
    id: 'vc-042',
    name: 'NeuralLink Systems Series B',
    category: 'Venture Capital',
    purchaseDate: '2021-06-15',
    purchasePrice: 500000,
    currentValue: 2100000,
    predictedValueOneYear: 4500000,
    lastAppraisalDate: '2024-02-28',
    riskScore: 85,
    liquidityScore: 5,
    aiConfidenceScore: 88,
    sentiment: 'Bullish',
    recommendation: 'Strong Buy',
    historicalPerformance: generateHistoricalData(500000, 12),
    tags: ['Tech', 'AI', 'High Growth'],
    region: 'Global',
    currency: 'USD'
  },
  {
    id: 'art-105',
    name: 'The Void Stares Back (1982)',
    category: 'Fine Art',
    purchaseDate: '2019-11-02',
    purchasePrice: 120000,
    currentValue: 145000,
    predictedValueOneYear: 152000,
    lastAppraisalDate: '2023-10-15',
    riskScore: 30,
    liquidityScore: 20,
    aiConfidenceScore: 76,
    sentiment: 'Neutral',
    recommendation: 'Hold',
    historicalPerformance: generateHistoricalData(120000, 36),
    tags: ['Modernism', 'Oil', 'Auction'],
    region: 'Europe',
    currency: 'EUR'
  },
  {
    id: 'cry-888',
    name: 'Quantum Ledger Token',
    category: 'Cryptocurrency',
    purchaseDate: '2020-01-01',
    purchasePrice: 50000,
    currentValue: 320000,
    predictedValueOneYear: 280000,
    lastAppraisalDate: new Date().toISOString().split('T')[0],
    riskScore: 92,
    liquidityScore: 98,
    aiConfidenceScore: 65,
    sentiment: 'Volatile',
    recommendation: 'Sell',
    historicalPerformance: generateHistoricalData(50000, 48),
    tags: ['L1', 'DeFi', 'Staking'],
    region: 'Decentralized',
    currency: 'USD'
  },
  {
    id: 'pe-202',
    name: 'Green Energy Infrastructure Fund',
    category: 'Private Equity',
    purchaseDate: '2018-08-20',
    purchasePrice: 2000000,
    currentValue: 2800000,
    predictedValueOneYear: 3100000,
    lastAppraisalDate: '2024-01-10',
    riskScore: 25,
    liquidityScore: 15,
    aiConfidenceScore: 91,
    sentiment: 'Bullish',
    recommendation: 'Buy',
    historicalPerformance: generateHistoricalData(2000000, 24),
    tags: ['ESG', 'Infrastructure', 'Long Term'],
    region: 'Asia Pacific',
    currency: 'USD'
  },
  {
    id: 'com-555',
    name: 'Industrial Lithium Reserves',
    category: 'Commodities',
    purchaseDate: '2022-03-10',
    purchasePrice: 750000,
    currentValue: 680000,
    predictedValueOneYear: 850000,
    lastAppraisalDate: new Date().toISOString().split('T')[0],
    riskScore: 60,
    liquidityScore: 80,
    aiConfidenceScore: 82,
    sentiment: 'Bearish',
    recommendation: 'Buy',
    historicalPerformance: generateHistoricalData(750000, 18),
    tags: ['Raw Materials', 'EV Supply Chain'],
    region: 'South America',
    currency: 'USD'
  }
];

// --- UTILITIES ---

const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const calculateCAGR = (startValue: number, endValue: number, years: number) => {
    if (years <= 0) return 0;
    return ((Math.pow(endValue / startValue, 1 / years) - 1) * 100).toFixed(2);
};

// --- ICONS (SVG) ---
const Icons = {
  Dashboard: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Portfolio: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>,
  AI: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12 2.1 12a10 10 0 0 1 17.8-6"></path><path d="M12 12 2.1 12a10 10 0 0 0 9.9 10"></path></svg>,
  Settings: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Search: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Bell: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Plus: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  TrendingUp: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
  TrendingDown: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>,
  Brain: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>,
  Zap: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Shield: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  Globe: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  MessageSquare: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
  Send: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  X: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  ChevronRight: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>,
  Target: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
  Layers: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
};

// --- SUB-COMPONENTS ---

const Sparkline: FC<{ data: number[]; color?: string }> = ({ data, color = '#4F46E5' }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const height = 40;
  const width = 120;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * height} r="3" fill={color} />
    </svg>
  );
};

const Badge: FC<{ children: React.ReactNode; type?: 'success' | 'warning' | 'danger' | 'neutral' | 'info' }> = ({ children, type = 'neutral' }) => {
  const styles = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
      {children}
    </span>
  );
};

const ProgressBar: FC<{ value: number; max?: number; color?: string }> = ({ value, max = 100, color = 'bg-indigo-600' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const AIChatWidget: FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Welcome to the Enterprise Wealth OS Neural Assistant. I am analyzing your portfolio in real-time. How can I optimize your asset allocation today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate AI processing
    setTimeout(() => {
      const responses = [
        "Based on current market volatility, I recommend hedging your crypto exposure with commodities.",
        "I've detected a 12% arbitrage opportunity in your private equity sector.",
        "Your real estate portfolio is outperforming the regional index by 4.5%.",
        "Risk analysis complete. Suggest rebalancing to reduce exposure to speculative tech assets.",
        "Processing... I've updated the predictive models for Q4 based on your input."
      ];
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: responses[Math.floor(Math.random() * responses.length)], 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 z-50 overflow-hidden font-sans">
      <div className="bg-indigo-600 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white">
          <Icons.Brain className="w-6 h-6" />
          <span className="font-bold">Neural Assistant</span>
        </div>
        <button onClick={onClose} className="text-white hover:bg-indigo-700 p-1 rounded"><Icons.X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm'}`}>
              {msg.text}
              <div className="text-[10px] opacity-70 mt-1 text-right">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Ask the AI..." 
          className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"><Icons.Send className="w-5 h-5" /></button>
      </form>
    </div>
  );
};

// --- MAIN COMPONENT ---

const AlternativeAssetTracker: FC = () => {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio' | 'intelligence' | 'settings'>('dashboard');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

    // --- COMPUTED DATA ---
    const portfolioStats = useMemo(() => {
        const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
        const totalCost = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
        const totalGain = totalValue - totalCost;
        const totalGainPercent = (totalGain / totalCost) * 100;
        const projectedValue = assets.reduce((sum, a) => sum + a.predictedValueOneYear, 0);
        const avgRisk = assets.reduce((sum, a) => sum + a.riskScore, 0) / assets.length;
        const avgAIConfidence = assets.reduce((sum, a) => sum + a.aiConfidenceScore, 0) / assets.length;
        
        return { totalValue, totalCost, totalGain, totalGainPercent, projectedValue, avgRisk, avgAIConfidence };
    }, [assets]);

    const filteredAssets = useMemo(() => {
        return assets.filter(a => 
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [assets, searchQuery]);

    const categoryDistribution = useMemo(() => {
        const dist: Record<string, number> = {};
        assets.forEach(a => {
            dist[a.category] = (dist[a.category] || 0) + a.currentValue;
        });
        return Object.entries(dist).sort((a, b) => b[1] - a[1]);
    }, [assets]);

    // --- RENDER HELPERS ---

    const renderDashboard = () => (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Icons.Zap className="w-16 h-16 text-indigo-600" /></div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Portfolio Value</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatNumber(portfolioStats.totalValue)}</span>
                        <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">+{portfolioStats.totalGainPercent.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">AI Projection: {formatNumber(portfolioStats.projectedValue)} (+{(portfolioStats.projectedValue/portfolioStats.totalValue * 100 - 100).toFixed(1)}%)</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Icons.Shield className="w-16 h-16 text-blue-600" /></div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Exposure Index</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{portfolioStats.avgRisk.toFixed(0)}/100</span>
                        <Badge type={portfolioStats.avgRisk > 70 ? 'danger' : portfolioStats.avgRisk > 40 ? 'warning' : 'success'}>
                            {portfolioStats.avgRisk > 70 ? 'High' : portfolioStats.avgRisk > 40 ? 'Moderate' : 'Low'}
                        </Badge>
                    </div>
                    <div className="mt-3">
                        <ProgressBar value={portfolioStats.avgRisk} max={100} color={portfolioStats.avgRisk > 70 ? 'bg-red-500' : 'bg-blue-500'} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Icons.Brain className="w-16 h-16 text-purple-600" /></div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Confidence Score</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{portfolioStats.avgAIConfidence.toFixed(0)}%</span>
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Optimized</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">System is actively monitoring 14,000+ global signals.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Icons.Target className="w-16 h-16 text-emerald-600" /></div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Opportunities</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">12</span>
                        <Badge type="success">3 Critical</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">AI suggests immediate rebalancing for 2 assets.</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Asset Allocation Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Global Asset Allocation</h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View Full Report</button>
                    </div>
                    <div className="space-y-4">
                        {categoryDistribution.map(([cat, val]) => (
                            <div key={cat} className="group">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                                    <span className="text-gray-500">{formatCurrency(val)} ({((val/portfolioStats.totalValue)*100).toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-600 group-hover:bg-indigo-500 transition-all duration-500 relative" 
                                        style={{ width: `${(val/portfolioStats.totalValue)*100}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insights Feed */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Icons.Brain className="w-5 h-5 text-indigo-600" />
                        Live Intelligence Feed
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[400px]">
                        {[
                            { title: 'Market Anomaly Detected', desc: 'Unusual volume in rare earth commodities suggests a supply chain disruption.', time: '2m ago', type: 'warning' },
                            { title: 'Portfolio Optimization', desc: 'Rebalancing Real Estate holdings could yield +2.4% annual alpha.', time: '15m ago', type: 'success' },
                            { title: 'Regulatory Update', desc: 'New tax implications for cross-border crypto assets in EU region.', time: '1h ago', type: 'info' },
                            { title: 'Sentiment Shift', desc: 'Global sentiment shifting to "Risk-Off". Suggest increasing liquidity.', time: '3h ago', type: 'danger' },
                        ].map((item, i) => (
                            <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                        item.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                        item.type === 'success' ? 'bg-green-100 text-green-800' :
                                        item.type === 'danger' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>{item.title}</span>
                                    <span className="text-[10px] text-gray-400">{item.time}</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                        Generate Deep Dive Report
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPortfolio = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative w-full sm:w-96">
                    <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search assets, tags, or regions..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <Icons.Layers className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
                        <Icons.Plus className="w-4 h-4" /> Add Asset
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Asset Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Value / Trend</th>
                                <th className="px-6 py-4">AI Prediction (1Y)</th>
                                <th className="px-6 py-4">Risk / Liquidity</th>
                                <th className="px-6 py-4">AI Sentiment</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredAssets.map(asset => (
                                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 dark:text-white">{asset.name}</span>
                                            <div className="flex gap-1 mt-1">
                                                {asset.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                            {asset.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(asset.currentValue, asset.currency)}</span>
                                            <div className="mt-1">
                                                <Sparkline data={asset.historicalPerformance} color={asset.currentValue > asset.purchasePrice ? '#10B981' : '#EF4444'} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(asset.predictedValueOneYear, asset.currency)}</span>
                                            {asset.predictedValueOneYear > asset.currentValue ? (
                                                <Icons.TrendingUp className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Icons.TrendingDown className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">Confidence: {asset.aiConfidenceScore}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2 w-24">
                                            <div className="flex justify-between text-[10px] text-gray-500">
                                                <span>Risk</span>
                                                <span>{asset.riskScore}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                                <div className={`h-1.5 rounded-full ${asset.riskScore > 70 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${asset.riskScore}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-gray-500">
                                                <span>Liq.</span>
                                                <span>{asset.liquidityScore}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                                <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${asset.liquidityScore}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge type={
                                            asset.recommendation === 'Strong Buy' ? 'success' :
                                            asset.recommendation === 'Buy' ? 'success' :
                                            asset.recommendation === 'Sell' ? 'danger' :
                                            asset.recommendation === 'Strong Sell' ? 'danger' : 'neutral'
                                        }>
                                            {asset.recommendation}
                                        </Badge>
                                        <div className="text-xs text-gray-400 mt-1">{asset.sentiment}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                            <Icons.ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderIntelligence = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900 rounded-full animate-pulse"></div>
                    <Icons.Brain className="w-16 h-16 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Deep Portfolio Analysis</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                        Our neural engine is processing 4.2 million data points to optimize your holdings against global macro-economic shifts.
                    </p>
                </div>
                <div className="w-full max-w-md space-y-4">
                    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span>Processing Market Signals</span>
                        <span>100%</span>
                    </div>
                    <ProgressBar value={100} color="bg-green-500" />
                    
                    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span>Correlating Asset Classes</span>
                        <span>84%</span>
                    </div>
                    <ProgressBar value={84} color="bg-indigo-500" />

                    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span>Predictive Modeling (5Y)</span>
                        <span>42%</span>
                    </div>
                    <ProgressBar value={42} color="bg-purple-500" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <h3 className="text-lg font-bold mb-2">Alpha Opportunity Detected</h3>
                    <p className="text-indigo-100 text-sm mb-4">
                        Based on your liquidity profile and risk tolerance, we've identified a high-probability entry point in Emerging Market Green Bonds.
                    </p>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">14.2%</div>
                            <div className="text-xs text-indigo-200">Proj. IRR</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">Low</div>
                            <div className="text-xs text-indigo-200">Correlation</div>
                        </div>
                    </div>
                    <button className="mt-6 w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                        View Deal Room
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">System Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="mt-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>
                            <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Compliance Alert</p>
                                <p className="text-xs text-gray-500">KYC refresh required for Entity #4421 within 3 days.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="mt-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div></div>
                            <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">Dividend Received</p>
                                <p className="text-xs text-gray-500">$45,200 deposited from Private Equity Fund IV.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
            {/* Top Navigation Bar */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                            <span className="text-xl font-bold tracking-tight">Wealth<span className="text-indigo-600">OS</span></span>
                        </div>
                        <nav className="hidden md:flex gap-1">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
                                { id: 'portfolio', label: 'Portfolio', icon: Icons.Portfolio },
                                { id: 'intelligence', label: 'Intelligence', icon: Icons.Brain },
                                { id: 'settings', label: 'Settings', icon: Icons.Settings },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        activeTab === item.id 
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300' 
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 relative">
                            <Icons.Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-white dark:border-gray-700 shadow-sm cursor-pointer"></div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeTab === 'dashboard' && 'Executive Overview'}
                        {activeTab === 'portfolio' && 'Asset Management'}
                        {activeTab === 'intelligence' && 'AI Strategic Insights'}
                        {activeTab === 'settings' && 'System Configuration'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {activeTab === 'dashboard' && `Welcome back. System is operating at 99.9% efficiency. ${new Date().toLocaleDateString()}`}
                        {activeTab === 'portfolio' && 'Manage, track, and optimize your alternative investment holdings.'}
                        {activeTab === 'intelligence' && 'Real-time predictive modeling and market sentiment analysis.'}
                    </p>
                </div>

                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'portfolio' && renderPortfolio()}
                {activeTab === 'intelligence' && renderIntelligence()}
                {activeTab === 'settings' && (
                    <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
                        <Icons.Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Configuration</h3>
                        <p className="text-gray-500 mt-2">Advanced API integrations and user permissions are managed here.</p>
                    </div>
                )}
            </main>

            {/* Floating AI Chat Button */}
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl z-40 transition-transform hover:scale-105 flex items-center gap-2 group"
            >
                <Icons.MessageSquare className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">AI Assistant</span>
            </button>

            {/* AI Chat Widget */}
            <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
};

export default AlternativeAssetTracker;