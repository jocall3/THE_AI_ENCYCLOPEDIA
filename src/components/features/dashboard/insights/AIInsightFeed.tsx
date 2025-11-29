import React, { useState, useEffect } from 'react';

// -----------------------------------------------------------------------------
// Data Models & Interfaces
// -----------------------------------------------------------------------------

type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
type InsightCategory = 'savings' | 'investing' | 'budgeting' | 'spending' | 'debt' | 'general' | 'credit' | 'tax' | 'retirement';
type TabView = 'feed' | 'analytics' | 'chat' | 'profile' | 'settings';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  detailedAnalysis: string;
  category: InsightCategory;
  actionLabel: string;
  actionUrl: string;
  severity: SeverityLevel;
  timestamp: string;
  impactScore: number; // 0-100
  aiConfidence: number; // 0-100
  tags: string[];
}

interface KPI {
  id: string;
  label: string;
  value: number;
  currency: boolean;
  trend: number; // percentage change
  trendDirection: 'up' | 'down' | 'neutral';
  aiPrediction: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  relatedInsightId?: string;
}

interface UserProfileAnalysis {
  financialHealthScore: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  savingsRate: number;
  projectedRetirementAge: number;
  aiRecommendations: string[];
}

// -----------------------------------------------------------------------------
// Mock Data Generation (Simulating a complex backend)
// -----------------------------------------------------------------------------

const generateUUID = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const MOCK_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    title: 'Minimal Spending Deviation Found',
    description: 'Slight dip in "Leisure" category noted over the past 48 hours.',
    detailedAnalysis: 'Our algorithms detected a 5% deviation below your historical spending baseline in the Leisure sector. This is well within acceptable variance and requires no immediate attention.',
    category: 'spending',
    actionLabel: 'Review Transactions',
    actionUrl: '/dashboard/transactions?filter=anomaly',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    impactScore: 15,
    aiConfidence: 98,
    tags: ['stability', 'spending', 'note'],
  },
  {
    id: '2',
    title: 'Tax-Loss Harvesting Inefficiency',
    description: 'Holdings are not fully optimized for current tax implications.',
    detailedAnalysis: 'Market analysis shows that your holdings in Sector Y are currently flat. Liquidating these assets now would not provide any significant tax benefit based on your current bracket.',
    category: 'tax',
    actionLabel: 'Review Portfolio',
    actionUrl: '/dashboard/investments/tax',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    impactScore: 10,
    aiConfidence: 92,
    tags: ['tax', 'investing', 'status-quo'],
  },
  {
    id: '3',
    title: 'Standard Savings Rate Maintained',
    description: 'Your emergency fund is yielding expected, standard interest rates.',
    detailedAnalysis: 'You are currently holding $15,000 in a standard savings account yielding 0.5%. This is consistent with your stated risk profile and requires no immediate action.',
    category: 'savings',
    actionLabel: 'Confirm Settings',
    actionUrl: '/dashboard/savings/optimize',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    impactScore: 5,
    aiConfidence: 99,
    tags: ['interest', 'stability'],
  },
  {
    id: '4',
    title: 'Subscription Consistency Confirmed',
    description: 'No duplicate streaming services identified across cards.',
    detailedAnalysis: 'Cross-referencing your credit card statements confirmed that all streaming services are unique and consolidated where possible. No waste detected.',
    category: 'budgeting',
    actionLabel: 'Review Subscriptions',
    actionUrl: '/dashboard/subscriptions',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    impactScore: 0,
    aiConfidence: 95,
    tags: ['subscriptions', 'consistent'],
  },
  {
    id: '5',
    title: 'Credit Utilization Stable',
    description: 'Credit utilization remains comfortably below 20% on Primary Visa card.',
    detailedAnalysis: 'Your current balance is $1,800 on a $10,000 limit. This is well within the optimal range for credit scoring. No action is necessary.',
    category: 'credit',
    actionLabel: 'Monitor Status',
    actionUrl: '/dashboard/credit',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    impactScore: 10,
    aiConfidence: 90,
    tags: ['credit-score', 'stable'],
  },
  {
    id: '6',
    title: 'Retirement Contribution On Target',
    description: 'You are on track to meet the annual 401(k) contribution limit.',
    detailedAnalysis: 'Based on your current contribution rate of $500/paycheck, you will meet the federal maximum by year-end. This maximizes your tax-advantaged growth.',
    category: 'retirement',
    actionLabel: 'Maintain Contributions',
    actionUrl: '/dashboard/retirement',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    impactScore: 20,
    aiConfidence: 96,
    tags: ['401k', 'long-term', 'on-track'],
  },
  {
    id: '7',
    title: 'Debt Repayment Strategy Consistent',
    description: 'AI simulation confirms current debt payoff route is adequate.',
    detailedAnalysis: 'Your current payment method aligns with the Avalanche strategy (highest interest first), saving you $400 in interest over the next 12 months and clearing your debt on schedule.',
    category: 'debt',
    actionLabel: 'Confirm Strategy',
    actionUrl: '/dashboard/debt/strategy',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    impactScore: 15,
    aiConfidence: 94,
    tags: ['debt', 'consistent'],
  },
];

const MOCK_KPIS: KPI[] = [
  {
    id: 'kpi-1',
    label: 'Net Worth',
    value: 142500,
    currency: true,
    trend: 0.1,
    trendDirection: 'up',
    aiPrediction: 'Stable growth trajectory confirmed',
  },
  {
    id: 'kpi-2',
    label: 'Monthly Burn Rate',
    value: 3200,
    currency: true,
    trend: 0.0,
    trendDirection: 'neutral', // Good thing
    aiPrediction: 'Spending perfectly aligned with budget expectations',
  },
  {
    id: 'kpi-3',
    label: 'AI Savings Identified',
    value: 50,
    currency: true,
    trend: 0.0,
    trendDirection: 'neutral',
    aiPrediction: 'No new optimization opportunities detected currently',
  },
  {
    id: 'kpi-4',
    label: 'Financial Health',
    value: 82,
    currency: false,
    trend: 0.0,
    trendDirection: 'neutral',
    aiPrediction: 'Maintaining strong standing within peer group',
  },
];

const MOCK_PROFILE: UserProfileAnalysis = {
  financialHealthScore: 82,
  riskTolerance: 'moderate',
  savingsRate: 22,
  projectedRetirementAge: 58,
  aiRecommendations: [
    'Maintain current insurance levels based on asset valuation.',
    'Portfolio allocation is balanced and requires no immediate rebalancing.',
    'Estate planning documents are current and sufficient.',
  ],
};

// -----------------------------------------------------------------------------
// Utility Components (Icons & UI Elements)
// -----------------------------------------------------------------------------

const Icons = {
  Chart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  ),
  Lightning: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  ),
  Chat: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
  ),
  Robot: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  )
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

// -----------------------------------------------------------------------------
// Sub-Components
// -----------------------------------------------------------------------------

const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icons.Chart />
    </div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{kpi.label}</p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-2xl font-bold text-gray-900">
        {kpi.currency ? formatCurrency(kpi.value) : kpi.value}
      </span>
      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${kpi.trendDirection === 'up' ? 'bg-green-100 text-green-700' : kpi.trendDirection === 'down' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
        {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
      </span>
    </div>
    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
      <p className="text-xs text-indigo-600 font-medium truncate">{kpi.aiPrediction}</p>
    </div>
  </div>
);

const InsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  const [expanded, setExpanded] = useState(false);

  const severityColors = {
    low: 'border-l-green-500 bg-green-50/30',
    medium: 'border-l-yellow-500 bg-yellow-50/30',
    high: 'border-l-orange-500 bg-orange-50/30',
    critical: 'border-l-red-600 bg-red-50/30',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${severityColors[insight.severity]} transition-all duration-300 hover:shadow-lg`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
              insight.severity === 'critical' ? 'bg-red-100 text-red-800' : 
              insight.severity === 'high' ? 'bg-orange-100 text-orange-800' : 
              'bg-gray-100 text-gray-600'
            }`}>
              {insight.category}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Icons.Robot /> {insight.aiConfidence}% AI Confidence
            </span>
          </div>
          <span className="text-xs text-gray-400">{new Date(insight.timestamp).toLocaleDateString()}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">{insight.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{insight.description}</p>
        
        {expanded && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-fadeIn">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">AI Detailed Analysis</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{insight.detailedAnalysis}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {insight.tags.map(tag => (
                <span key={tag} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-500">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            {expanded ? 'Show Less' : 'View Analysis'}
          </button>
          <a
            href={insight.actionUrl}
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            {insight.actionLabel}
            <span className="ml-2"><Icons.ArrowRight /></span>
          </a>
        </div>
      </div>
    </div>
  );
};

const AIChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your dedicated Financial AI Architect. I have analyzed your entire financial footprint. How can I assist you in optimizing your wealth today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: generateUUID(), sender: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      let responseText = "I've analyzed that request against your current portfolio.";
      const lowerInput = userMsg.text.toLowerCase();
      
      if (lowerInput.includes('spend') || lowerInput.includes('budget')) {
        responseText = "Based on your last 30 days of transactions, your spending in 'Dining Out' is 15% higher than your peer group. I recommend setting a hard cap of $400 for next month to stay on track with your savings goals.";
      } else if (lowerInput.includes('invest') || lowerInput.includes('stock')) {
        responseText = "Your portfolio is currently weighted 70% in equities. Given the current market volatility index (VIX), my algorithms suggest a 5% reallocation to fixed-income assets to hedge against short-term downside risk.";
      } else if (lowerInput.includes('save') || lowerInput.includes('money')) {
        responseText = "I found 3 unused subscriptions totaling $45/month. Canceling these and redirecting the funds to your HYSA would compound to an extra $560 over the next year.";
      } else {
        responseText = "I've updated your financial model with that information. Is there a specific KPI you'd like me to forecast based on this new data?";
      }

      const aiMsg: ChatMessage = { id: generateUUID(), sender: 'ai', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Icons.Robot /></div>
          <div>
            <h3 className="font-bold text-gray-900">Financial Architect AI</h3>
            <p className="text-xs text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online & Analyzing</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your spending, investments, or financial strategy..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icons.ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileAnalysis: React.FC<{ profile: UserProfileAnalysis }> = ({ profile }) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">AI Financial Health Score</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="#f3f4f6" strokeWidth="8" fill="none" />
            <circle cx="64" cy="64" r="60" stroke="#4f46e5" strokeWidth="8" fill="none" strokeDasharray={377} strokeDashoffset={377 - (377 * profile.financialHealthScore) / 100} className="transition-all duration-1000 ease-out" />
          </svg>
          <span className="absolute text-3xl font-bold text-gray-900">{profile.financialHealthScore}</span>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Savings Rate</span>
              <span className="font-medium text-gray-900">{profile.savingsRate}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${profile.savingsRate}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Retirement Readiness</span>
              <span className="font-medium text-gray-900">On Track (Age {profile.projectedRetirementAge})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
      <h3 className="text-md font-bold text-indigo-900 mb-3 flex items-center gap-2">
        <Icons.Lightning /> Strategic Recommendations
      </h3>
      <ul className="space-y-3">
        {profile.aiRecommendations.map((rec, idx) => (
          <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
            <div className="mt-0.5 text-green-500"><Icons.Check /></div>
            <span className="text-sm text-gray-700">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

const AIInsightFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('feed');
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    // Simulate complex data fetching and AI processing
    const initializeDashboard = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network/processing
      setInsights(MOCK_INSIGHTS.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setLoading(false);
    };

    initializeDashboard();
  }, []);

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          insight.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || insight.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-6 p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Command Center</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              AI Engine v4.2 Active â€¢ Real-time Analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Last updated: Just now</span>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_KPIS.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <nav className="flex -mb-px px-6 overflow-x-auto" aria-label="Tabs">
              {[
                { id: 'feed', label: 'Insight Feed', icon: Icons.Lightning },
                { id: 'chat', label: 'AI Architect', icon: Icons.Chat },
                { id: 'profile', label: 'Health Profile', icon: Icons.User },
                { id: 'analytics', label: 'Predictive Analytics', icon: Icons.Chart },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabView)}
                  className={`
                    group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  <span className={`mr-2 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    <tab.icon />
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 bg-gray-50/30 min-h-[600px]">
            
            {/* FEED TAB */}
            {activeTab === 'feed' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Icons.Search />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                      placeholder="Search insights by keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Filter by:</span>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                    >
                      <option value="all">All Categories</option>
                      <option value="spending">Spending</option>
                      <option value="savings">Savings</option>
                      <option value="investing">Investing</option>
                      <option value="debt">Debt</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredInsights.length > 0 ? (
                    filteredInsights.map(insight => (
                      <InsightCard key={insight.id} insight={insight} />
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                      <div className="mx-auto h-12 w-12 text-gray-400"><Icons.Search /></div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No insights found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="max-w-4xl mx-auto">
                <AIChatInterface />
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="max-w-4xl mx-auto">
                <ProfileAnalysis profile={MOCK_PROFILE} />
              </div>
            )}

            {/* ANALYTICS TAB (Placeholder for visual complexity) */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Projected Net Worth (AI Forecast)</h3>
                  <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-gray-200 pb-2">
                    {[35, 42, 45, 40, 55, 60, 65, 58, 72, 80, 85, 95].map((h, i) => (
                      <div key={i} className="w-full bg-indigo-50 rounded-t-sm relative group">
                        <div 
                          className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-500 hover:bg-indigo-600"
                          style={{ height: `${h}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                            ${(h * 1500).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Jan</span><span>Dec</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-md font-bold text-gray-900 mb-4">Spending by Category</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Housing', val: 40, color: 'bg-blue-500' },
                        { label: 'Food', val: 25, color: 'bg-green-500' },
                        { label: 'Transport', val: 15, color: 'bg-yellow-500' },
                        { label: 'Entertainment', val: 20, color: 'bg-purple-500' },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-medium">{item.val}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.val}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-md font-bold text-gray-900 mb-4">AI Risk Assessment</h3>
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-green-500 mb-2">Low</div>
                        <p className="text-gray-500 text-sm">Portfolio Volatility Index</p>
                        <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">Your diversified holdings have buffered against recent market downturns effectively.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightFeed;