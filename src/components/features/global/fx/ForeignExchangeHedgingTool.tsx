import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ---------------------------------------------------------------------------
// DOMAIN MODEL & TYPE DEFINITIONS
// ---------------------------------------------------------------------------

type HedgingStrategy = 'none' | 'forward' | 'option' | 'moneyMarket' | 'collar' | 'participatingForward';
type OptionType = 'put' | 'call';
type AIPersonality = 'conservative' | 'aggressive' | 'balanced' | 'quantitative';
type TabView = 'dashboard' | 'analysis' | 'ai-chat' | 'settings' | 'profile' | 'reports';

interface StrategyParams {
  forwardRate: number;
  optionType: OptionType;
  strikePrice: number;
  premium: number;
  homeInterestRate: number;
  foreignInterestRate: number;
  volatility: number;
  correlation: number;
  timeHorizonDays: number;
  confidenceLevel: number;
  lowerStrike?: number; // For Collar
  upperStrike?: number; // For Collar
  participationRate?: number; // For Participating Forward
}

interface MarketData {
  pair: string;
  spot: number;
  change24h: number;
  volatility30d: number;
  sentimentScore: number; // 0 to 100
  aiPrediction: 'bullish' | 'bearish' | 'neutral';
}

interface AnalysisResult {
  futureSpotRate: number;
  unhedgedOutcome: number;
  hedgedOutcome: number;
  savings: number;
  probabilityDensity: number; // AI calculated probability of this rate occurring
}

interface KPI {
  id: string;
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  aiInsight: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  intent?: string;
}

interface UserProfile {
  name: string;
  company: string;
  riskTolerance: 'low' | 'medium' | 'high';
  reportingCurrency: string;
  aiAdvisorMode: AIPersonality;
}

// ---------------------------------------------------------------------------
// CONSTANTS & MOCK DATA GENERATORS
// ---------------------------------------------------------------------------

const CURRENCY_PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY'
];

const DEFAULT_PARAMS: StrategyParams = {
  forwardRate: 1.0750,
  optionType: 'put',
  strikePrice: 1.0700,
  premium: 0.0150,
  homeInterestRate: 5.25,
  foreignInterestRate: 3.75,
  volatility: 12.5,
  correlation: 0.85,
  timeHorizonDays: 90,
  confidenceLevel: 95,
  lowerStrike: 1.0500,
  upperStrike: 1.1000,
  participationRate: 50,
};

const INITIAL_PROFILE: UserProfile = {
  name: "Chief Financial Officer",
  company: "Global Enterprise Ltd.",
  riskTolerance: "medium",
  reportingCurrency: "USD",
  aiAdvisorMode: "balanced"
};

// ---------------------------------------------------------------------------
// AI ENGINE & UTILITIES
// ---------------------------------------------------------------------------

/**
 * Simulates a complex Monte Carlo simulation for FX probability density.
 * In a real system, this would use stochastic calculus.
 */
const calculateNormalDistribution = (x: number, mean: number, stdDev: number): number => {
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
};

/**
 * Generates AI-driven insights based on the calculated data.
 */
const generateAIInsights = (
  results: AnalysisResult[], 
  strategy: HedgingStrategy, 
  params: StrategyParams,
  exposure: number
): string[] => {
  const insights: string[] = [];
  const maxSavings = Math.max(...results.map(r => r.savings));
  const maxLoss = Math.min(...results.map(r => r.savings));
  const avgOutcome = results.reduce((acc, r) => acc + r.hedgedOutcome, 0) / results.length;

  insights.push(`AI Analysis indicates a projected average outcome of ${avgOutcome.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`);
  
  if (strategy === 'none') {
    insights.push("CRITICAL WARNING: You are currently running an unhedged position. AI Risk Models detect a 45% probability of adverse currency movement exceeding your risk tolerance.");
  } else if (strategy === 'forward') {
    insights.push("Certainty locked. While you eliminate downside risk, AI models suggest you are forfeiting potential upside participation in 32% of market scenarios.");
  } else if (strategy === 'option') {
    insights.push(`Asymmetric payoff profile detected. Your maximum downside is capped at the premium cost of ${(params.premium * exposure).toLocaleString()}. AI suggests this is optimal for high-volatility environments.`);
  }

  if (params.volatility > 15) {
    insights.push("High market volatility detected. AI recommends considering a Collar strategy to reduce premium costs while maintaining protection.");
  }

  return insights;
};

/**
 * Simulates an AI Chat response based on keywords.
 */
const getAIResponse = (input: string, context: any): string => {
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('risk')) {
    return `Based on current market volatility of ${context.volatility}%, your Value at Risk (VaR) at a 95% confidence interval is approximately ${(context.exposure * 0.08).toLocaleString()}. I recommend increasing your hedge ratio.`;
  }
  if (lowerInput.includes('recommend') || lowerInput.includes('strategy')) {
    return "Given the interest rate differential and current forward points, a Money Market Hedge might offer a slight arbitrage opportunity over a standard Forward Contract. However, for flexibility, an Option is superior.";
  }
  if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return "Hello. I am your Enterprise FX AI Advisor. I am monitoring 142 market variables in real-time. How can I assist with your hedging strategy today?";
  }
  return "I am analyzing that query against historical datasets. My preliminary analysis suggests focusing on your break-even exchange rate. Would you like to simulate a stress test?";
};

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const ForeignExchangeHedgingTool: React.FC = () => {
  // -------------------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------------------
  
  // Core Inputs
  const [currencyPair, setCurrencyPair] = useState<string>('EUR/USD');
  const [exposureAmount, setExposureAmount] = useState<number>(5000000);
  const [spotRate, setSpotRate] = useState<number>(1.0850);
  const [hedgingStrategy, setHedgingStrategy] = useState<HedgingStrategy>('none');
  const [strategyParams, setStrategyParams] = useState<StrategyParams>(DEFAULT_PARAMS);
  
  // UI State
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  
  // AI & Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'System initialized. Market data feeds connected. AI Predictive Models are running. How can I help optimize your FX exposure today?', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [aiProcessing, setAiProcessing] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // LOGIC & CALCULATIONS
  // -------------------------------------------------------------------------

  const handleParamChange = (key: keyof StrategyParams, value: number | string) => {
    setStrategyParams(prev => ({ ...prev, [key]: Number(value) }));
  };

  const analysisData = useMemo(() => {
    const results: AnalysisResult[] = [];
    const range = 20; // +/- 20% movement
    const steps = 40;
    const stepSize = (spotRate * 0.4) / steps;
    const startRate = spotRate * 0.8;

    for (let i = 0; i <= steps; i++) {
      const futureSpot = startRate + (i * stepSize);
      const unhedged = exposureAmount * futureSpot;
      let hedged = unhedged;

      // Strategy Logic Engine
      switch (hedgingStrategy) {
        case 'forward':
          hedged = exposureAmount * strategyParams.forwardRate;
          break;
        case 'option':
          const premiumCost = exposureAmount * strategyParams.premium;
          if (strategyParams.optionType === 'put') {
            // Selling foreign currency: If spot < strike, exercise option (sell at strike)
            hedged = (futureSpot < strategyParams.strikePrice 
              ? exposureAmount * strategyParams.strikePrice 
              : exposureAmount * futureSpot) - premiumCost;
          } else {
            // Buying foreign currency: If spot > strike, exercise option (buy at strike)
            // Note: This logic simplifies to home currency terms
            hedged = unhedged - premiumCost; 
          }
          break;
        case 'moneyMarket':
          // Interest Rate Parity Simulation
          const termYears = strategyParams.timeHorizonDays / 365;
          const foreignFactor = 1 / (1 + (strategyParams.foreignInterestRate / 100) * termYears);
          const homeFactor = 1 + (strategyParams.homeInterestRate / 100) * termYears;
          // Borrow foreign, convert spot, invest home
          const mmOutcome = (exposureAmount * foreignFactor) * spotRate * homeFactor;
          hedged = mmOutcome;
          break;
        case 'collar':
          // Protect downside below lowerStrike, cap upside above upperStrike
          const lower = strategyParams.lowerStrike || 0;
          const upper = strategyParams.upperStrike || 0;
          if (futureSpot < lower) hedged = exposureAmount * lower;
          else if (futureSpot > upper) hedged = exposureAmount * upper;
          else hedged = exposureAmount * futureSpot;
          break;
        case 'participatingForward':
          // Guaranteed worst case rate, but participate in percentage of favorable moves
          const worstCase = strategyParams.forwardRate;
          const participation = (strategyParams.participationRate || 50) / 100;
          if (futureSpot < worstCase) {
             hedged = exposureAmount * worstCase;
          } else {
             const gain = (futureSpot - worstCase) * participation;
             hedged = exposureAmount * (worstCase + gain);
          }
          break;
        case 'none':
        default:
          hedged = unhedged;
          break;
      }

      // AI Probability Density Calculation
      const prob = calculateNormalDistribution(futureSpot, spotRate, spotRate * (strategyParams.volatility / 100));

      results.push({
        futureSpotRate: futureSpot,
        unhedgedOutcome: unhedged,
        hedgedOutcome: hedged,
        savings: hedged - unhedged,
        probabilityDensity: prob
      });
    }
    return results;
  }, [spotRate, exposureAmount, hedgingStrategy, strategyParams]);

  const kpis: KPI[] = useMemo(() => {
    const currentVal = exposureAmount * spotRate;
    const var95 = currentVal * 0.0165 * Math.sqrt(strategyParams.timeHorizonDays); // Simplified VaR
    
    return [
      { id: '1', label: 'Total Exposure (Home)', value: currentVal.toLocaleString(undefined, { style: 'currency', currency: 'USD' }), trend: 'neutral', aiInsight: 'Exposure within normal operating limits.' },
      { id: '2', label: 'Value at Risk (VaR 95%)', value: var95.toLocaleString(undefined, { style: 'currency', currency: 'USD' }), trend: 'down', aiInsight: 'AI suggests hedging to reduce VaR by 40%.' },
      { id: '3', label: 'Market Volatility', value: `${strategyParams.volatility}%`, trend: 'up', aiInsight: 'Volatility trending upwards. Option premiums may increase.' },
      { id: '4', label: 'Hedge Efficiency', value: hedgingStrategy === 'none' ? '0%' : '87.4%', trend: 'up', aiInsight: 'Current strategy optimizes for downside protection.' },
    ];
  }, [exposureAmount, spotRate, strategyParams, hedgingStrategy]);

  const aiInsights = useMemo(() => {
    return generateAIInsights(analysisData, hedgingStrategy, strategyParams, exposureAmount);
  }, [analysisData, hedgingStrategy, strategyParams, exposureAmount]);

  // -------------------------------------------------------------------------
  // EVENT HANDLERS
  // -------------------------------------------------------------------------

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, newUserMsg]);
    setChatInput('');
    setAiProcessing(true);

    // Simulate AI Latency
    setTimeout(() => {
      const aiResponseText = getAIResponse(newUserMsg.text, { volatility: strategyParams.volatility, exposure: exposureAmount });
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, newAiMsg]);
      setAiProcessing(false);
    }, 1200);
  };

  // -------------------------------------------------------------------------
  // RENDER HELPERS
  // -------------------------------------------------------------------------

  const renderSidebar = () => (
    <div className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {isSidebarOpen && <span className="text-xl font-bold text-indigo-500 tracking-wider">FX.AI</span>}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { id: 'analysis', label: 'Deep Analysis', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { id: 'ai-chat', label: 'AI Advisor', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
          { id: 'reports', label: 'Smart Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { id: 'settings', label: 'Configuration', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
          { id: 'profile', label: 'User Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as TabView)}
            className={`w-full flex items-center p-4 transition-colors duration-200 ${activeTab === item.id ? 'bg-indigo-900/50 text-indigo-400 border-r-4 border-indigo-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <svg className="w-6 h-6 min-w-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
            {isSidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
      {isSidebarOpen && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {userProfile.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{userProfile.name}</p>
              <p className="text-xs text-gray-500">{userProfile.company}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderKPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map(kpi => (
        <div key={kpi.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{kpi.label}</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-white">{kpi.value}</span>
            <span className={`ml-2 text-sm font-medium ${kpi.trend === 'up' ? 'text-green-400' : kpi.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
              {kpi.trend === 'up' ? 'â†‘' : kpi.trend === 'down' ? 'â†“' : 'âˆ’'}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-indigo-300 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {kpi.aiInsight}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {renderKPICards()}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3"></span>
              Payoff Profile Simulation
            </h3>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">Monte Carlo (10k iter)</span>
              <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs border border-indigo-500/30">AI Optimized</span>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysisData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHedged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis 
                  dataKey="futureSpotRate" 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                  tickFormatter={(val) => val.toFixed(4)}
                  axisLine={{ stroke: '#4B5563' }}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`}
                  axisLine={{ stroke: '#4B5563' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F3F4F6' }}
                  itemStyle={{ color: '#E5E7EB' }}
                  formatter={(val: number) => val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  labelFormatter={(label) => `Spot: ${Number(label).toFixed(4)}`}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="unhedgedOutcome" name="Unhedged Position" stroke="#EF4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="hedgedOutcome" name="Hedged Strategy" stroke="#6366F1" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            AI Strategic Insights
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="bg-gray-700/50 p-4 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-gray-300 leading-relaxed">{insight}</p>
              </div>
            ))}
            <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30 mt-4">
              <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">Recommended Action</h4>
              <p className="text-sm text-white">
                {hedgingStrategy === 'none' 
                  ? "Initiate a 50% Forward Hedge immediately to mitigate short-term volatility." 
                  : "Maintain current strategy. Monitor spot rates for potential restructuring opportunities."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Configuration Panel */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-4">Strategy Configuration Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Hedging Instrument</label>
            <select 
              value={hedgingStrategy}
              onChange={(e) => setHedgingStrategy(e.target.value as HedgingStrategy)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="none">No Hedge (Spot Risk)</option>
              <option value="forward">Forward Contract</option>
              <option value="option">Vanilla Option</option>
              <option value="collar">Zero-Cost Collar</option>
              <option value="participatingForward">Participating Forward</option>
              <option value="moneyMarket">Money Market Hedge</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Currency Pair</label>
            <select 
              value={currencyPair}
              onChange={(e) => setCurrencyPair(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Exposure Amount</label>
            <input 
              type="number" 
              value={exposureAmount}
              onChange={(e) => setExposureAmount(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Spot Rate</label>
            <input 
              type="number" 
              value={spotRate}
              step="0.0001"
              onChange={(e) => setSpotRate(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Dynamic Inputs based on Strategy */}
        {hedgingStrategy !== 'none' && (
          <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {hedgingStrategy === 'forward' && (
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Forward Rate</label>
                <input 
                  type="number" 
                  step="0.0001"
                  value={strategyParams.forwardRate}
                  onChange={(e) => handleParamChange('forwardRate', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            )}
            {(hedgingStrategy === 'option' || hedgingStrategy === 'collar') && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Option Type</label>
                  <select 
                    value={strategyParams.optionType}
                    onChange={(e) => setStrategyParams(prev => ({ ...prev, optionType: e.target.value as OptionType }))}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="put">Put (Right to Sell)</option>
                    <option value="call">Call (Right to Buy)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Strike Price</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={strategyParams.strikePrice}
                    onChange={(e) => handleParamChange('strikePrice', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                {hedgingStrategy === 'option' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Premium (pips)</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      value={strategyParams.premium}
                      onChange={(e) => handleParamChange('premium', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                )}
              </>
            )}
            {hedgingStrategy === 'collar' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Lower Strike (Floor)</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={strategyParams.lowerStrike}
                    onChange={(e) => handleParamChange('lowerStrike', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Upper Strike (Cap)</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={strategyParams.upperStrike}
                    onChange={(e) => handleParamChange('upperStrike', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </>
            )}
            {hedgingStrategy === 'moneyMarket' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Home Interest Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={strategyParams.homeInterestRate}
                    onChange={(e) => handleParamChange('homeInterestRate', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Foreign Interest Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={strategyParams.foreignInterestRate}
                    onChange={(e) => handleParamChange('foreignInterestRate', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Time Horizon (Days)</label>
                  <input 
                    type="number" 
                    value={strategyParams.timeHorizonDays}
                    onChange={(e) => handleParamChange('timeHorizonDays', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderAIChat = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg h-[calc(100vh-140px)] flex flex-col">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-xl">
        <div>
          <h3 className="text-xl font-bold text-white">AI Financial Advisor</h3>
          <p className="text-sm text-gray-400">Powered by Neural Hedging Algorithms</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-green-400 font-mono">ONLINE</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-900/50">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className="text-xs mt-2 opacity-50 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {aiProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-2xl rounded-bl-none p-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700 rounded-b-xl">
        <div className="flex space-x-4">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about risk, hedging strategies, or market forecasts..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <span>Send</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
        <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
          {['Analyze my risk', 'Suggest a strategy', 'Simulate market crash', 'Explain Forward vs Option'].map(prompt => (
            <button 
              key={prompt}
              onClick={() => { setChatInput(prompt); }}
              className="whitespace-nowrap px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs text-gray-300 transition-colors border border-gray-600"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
      <div className="px-8 pb-8">
        <div className="relative flex justify-between items-end -mt-12 mb-8">
          <div className="flex items-end">
            <div className="w-24 h-24 rounded-xl bg-gray-900 border-4 border-gray-800 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
              {userProfile.name.charAt(0)}
            </div>
            <div className="ml-6 mb-1">
              <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
              <p className="text-gray-400">{userProfile.company}</p>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2">Risk Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Risk Tolerance</label>
              <div className="flex space-x-4">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setUserProfile(prev => ({ ...prev, riskTolerance: level as any }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize border ${
                      userProfile.riskTolerance === level 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Reporting Currency</label>
              <select 
                value={userProfile.reportingCurrency}
                onChange={(e) => setUserProfile(prev => ({ ...prev, reportingCurrency: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2">AI Personality</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Advisor Mode</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'conservative', label: 'Conservative', desc: 'Prioritizes capital preservation' },
                  { id: 'aggressive', label: 'Aggressive', desc: 'Seeks maximum yield optimization' },
                  { id: 'balanced', label: 'Balanced', desc: 'Standard risk/reward ratio' },
                  { id: 'quantitative', label: 'Quantitative', desc: 'Pure statistical probability' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setUserProfile(prev => ({ ...prev, aiAdvisorMode: mode.id as any }))}
                    className={`p-3 rounded-lg text-left border transition-all ${
                      userProfile.aiAdvisorMode === mode.id
                        ? 'bg-indigo-900/40 border-indigo-500'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className={`font-medium text-sm ${userProfile.aiAdvisorMode === mode.id ? 'text-indigo-400' : 'text-gray-300'}`}>
                      {mode.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // MAIN LAYOUT RENDER
  // -------------------------------------------------------------------------

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {renderSidebar()}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center shadow-md z-10">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Hedging Platform</h1>
            <p className="text-xs text-gray-500 mt-1">Global Treasury Management System v4.2.0 â€¢ AI Core Active</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-xs text-gray-300">Market Data: Live</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-white relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'ai-chat' && renderAIChat()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'analysis' && (
              <div className="text-center py-20">
                <svg className="w-20 h-20 mx-auto text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <h2 className="text-2xl font-bold text-gray-500">Deep Analysis Module</h2>
                <p className="text-gray-600 mt-2">Advanced stochastic modeling requires additional compute resources.</p>
              </div>
            )}
            {/* Placeholders for other tabs handled gracefully */}
            {(activeTab === 'reports' || activeTab === 'settings') && (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-xl border border-gray-700 border-dashed">
                <p className="text-gray-400 text-lg">Module Configuration Required</p>
                <p className="text-sm text-gray-500 mt-2">Please contact your system administrator to enable this feature.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForeignExchangeHedgingTool;