import React, { useState, useMemo, useEffect, FC } from 'react';
import { Target, Trophy, Users, TrendingUp, Plus, Star } from 'lucide-react';

// --- TYPE DEFINITIONS ---

type ViewMode = 'dashboard' | 'analytics' | 'collaboration' | 'ai-advisor' | 'settings';

interface Member {
  id: string;
  name: string;
  avatar: string;
  contribution: number;
  role: 'Admin' | 'Contributor' | 'Observer';
  consistencyScore: number; // 0-100 AI calculated
  riskFactor: 'Low' | 'Medium' | 'High';
  lastActive: string;
  projectedContribution: number;
}

interface Milestone {
  id: string;
  amount: number;
  name: string;
  reward: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  aiRecommended: boolean;
}

interface AiInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'prediction' | 'achievement';
  message: string;
  confidence: number;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAi: boolean;
}

interface KpiMetric {
  label: string;
  value: string | number;
  trend: number;
  aiPrediction: string;
}

// --- MOCK DATA & UTILS ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialMembers: Member[] = [
  { id: 'user1', name: 'Alice Chen', avatar: 'https://i.pravatar.cc/150?u=alice', contribution: 2400, role: 'Admin', consistencyScore: 98, riskFactor: 'Low', lastActive: '2 mins ago', projectedContribution: 5000 },
  { id: 'user2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=bob', contribution: 1850, role: 'Contributor', consistencyScore: 85, riskFactor: 'Low', lastActive: '1 hour ago', projectedContribution: 3200 },
  { id: 'user3', name: 'Charlie Davis', avatar: 'https://i.pravatar.cc/150?u=charlie', contribution: 3100, role: 'Contributor', consistencyScore: 92, riskFactor: 'Low', lastActive: '4 hours ago', projectedContribution: 6000 },
  { id: 'user4', name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?u=diana', contribution: 950, role: 'Observer', consistencyScore: 65, riskFactor: 'Medium', lastActive: '2 days ago', projectedContribution: 1500 },
  { id: 'user5', name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', contribution: 2100, role: 'Contributor', consistencyScore: 88, riskFactor: 'Low', lastActive: 'Just now', projectedContribution: 4500 },
];

const initialMilestones: Milestone[] = [
  { id: 'm1', amount: 5000, name: "Seed Capital", reward: "Bronze Status", difficulty: 'Easy', aiRecommended: false },
  { id: 'm2', amount: 10000, name: "Series A Funding", reward: "Silver Status", difficulty: 'Moderate', aiRecommended: true },
  { id: 'm3', amount: 25000, name: "Market Leader", reward: "Gold Status", difficulty: 'Hard', aiRecommended: false },
  { id: 'm4', amount: 50000, name: "Unicorn Status", reward: "Platinum Status", difficulty: 'Expert', aiRecommended: true },
];

const initialChat: ChatMessage[] = [
  { id: 'c1', senderId: 'ai', text: 'Welcome to the Enterprise Savings OS. I have analyzed your current velocity and project a 12% surplus by Q4.', timestamp: new Date(Date.now() - 100000), isAi: true },
  { id: 'c2', senderId: 'user1', text: 'Thanks! Let\'s aim for the Series A milestone next week.', timestamp: new Date(Date.now() - 80000), isAi: false },
];

// --- SUB-COMPONENTS ---

const AiBadge: FC<{ type: 'confidence' | 'risk' | 'growth'; value: string | number }> = ({ type, value }) => {
  const colors = {
    confidence: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    risk: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    growth: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${colors[type]}`}>
      {type}: {value}
    </span>
  );
};

const ProgressBar: FC<{ value: number; colorClass?: string }> = ({ value, colorClass = "from-teal-400 to-blue-500" }) => (
  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 relative overflow-hidden">
    <div
      className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-1000 ease-out`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const MetricCard: FC<{ metric: KpiMetric }> = ({ metric }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{metric.label}</span>
      <TrendingUp className={`w-4 h-4 ${metric.trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
    </div>
    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{metric.value}</div>
    <div className="text-xs text-gray-400 flex items-center gap-1">
      <Star className="w-3 h-3 text-purple-500" />
      AI Forecast: {metric.aiPrediction}
    </div>
  </div>
);

const AiInsightCard: FC<{ insight: AiInsight }> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'opportunity': return <Target className="w-5 h-5 text-green-500" />;
      case 'warning': return <TrendingUp className="w-5 h-5 text-red-500 transform rotate-180" />;
      case 'prediction': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-purple-500">
      <div className="mt-1">{getIcon()}</div>
      <div>
        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{insight.message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{insight.timestamp.toLocaleTimeString()}</span>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
            {insight.confidence}% Confidence
          </span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const GamifiedGroupSavings: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialChat);
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [contributionInput, setContributionInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [goalAmount, setGoalAmount] = useState(50000);
  
  // --- COMPUTED METRICS ---
  const totalSaved = useMemo(() => members.reduce((acc, m) => acc + m.contribution, 0), [members]);
  const progress = useMemo(() => (totalSaved / goalAmount) * 100, [totalSaved, goalAmount]);
  const averageContribution = useMemo(() => totalSaved / members.length, [totalSaved, members.length]);
  const topContributor = useMemo(() => [...members].sort((a, b) => b.contribution - a.contribution)[0], [members]);
  
  // --- AI SIMULATION ENGINE ---
  useEffect(() => {
    // Simulate AI analyzing data every 10 seconds
    const interval = setInterval(() => {
      const types: AiInsight['type'][] = ['opportunity', 'prediction', 'warning'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      let message = '';
      if (randomType === 'opportunity') {
        message = `Based on current velocity, increasing daily contributions by $15 would hit the goal 3 days early.`;
      } else if (randomType === 'prediction') {
        message = `AI Model v4.2 predicts a 98% probability of reaching "Series A" milestone by Friday.`;
      } else {
        message = `Detected a 5% variance in contribution consistency from User 4. Monitoring for risk.`;
      }

      const newInsight: AiInsight = {
        id: generateId(),
        type: randomType,
        message,
        confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
        timestamp: new Date(),
      };

      setInsights(prev => [newInsight, ...prev].slice(0, 5));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleContribution = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(contributionInput);
    if (!amount || amount <= 0) return;

    setMembers(prev => prev.map(m => m.id === 'user5' ? { 
      ...m, 
      contribution: m.contribution + amount,
      lastActive: 'Just now',
      consistencyScore: Math.min(100, m.consistencyScore + 1)
    } : m));
    
    setContributionInput('');
    
    // Trigger AI Response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: generateId(),
        senderId: 'ai',
        text: `Excellent contribution of $${amount}. This increases your personal equity share by 0.4%.`,
        timestamp: new Date(),
        isAi: true
      };
      setChatHistory(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      senderId: 'user5',
      text: chatInput,
      timestamp: new Date(),
      isAi: false
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulate AI processing
    setTimeout(() => {
      const responses = [
        "I've analyzed that request. The data suggests it's a viable strategy.",
        "Processing... My simulations indicate a positive outcome for the group.",
        "Noted. I have updated the group's risk profile accordingly.",
        "Interesting point. I've cross-referenced this with global market trends."
      ];
      const aiMsg: ChatMessage = {
        id: generateId(),
        senderId: 'ai',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isAi: true
      };
      setChatHistory(prev => [...prev, aiMsg]);
    }, 1500);
  };

  // --- RENDER HELPERS ---

  const renderSidebar = () => (
    <div className="w-full lg:w-64 bg-white dark:bg-gray-800 p-4 flex flex-col gap-2 border-r border-gray-200 dark:border-gray-700">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
          Nexus<span className="font-light text-gray-500">OS</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Enterprise Savings Intelligence</p>
      </div>
      
      {[
        { id: 'dashboard', label: 'Mission Control', icon: Target },
        { id: 'analytics', label: 'Deep Analytics', icon: TrendingUp },
        { id: 'collaboration', label: 'Team Dynamics', icon: Users },
        { id: 'ai-advisor', label: 'AI Strategist', icon: Star },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setViewMode(item.id as ViewMode)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            viewMode === item.id 
              ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-semibold shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </button>
      ))}

      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-sm">AI Status: Online</span>
          </div>
          <p className="text-xs opacity-80 mb-3">Processing 4.2M data points for optimization.</p>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div className="bg-white h-1.5 rounded-full w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard metric={{ label: 'Total Capital', value: `$${totalSaved.toLocaleString()}`, trend: 1, aiPrediction: '+12% by EOM' }} />
        <MetricCard metric={{ label: 'Goal Velocity', value: `${(progress / 10).toFixed(1)}% / day`, trend: 1, aiPrediction: 'Optimal' }} />
        <MetricCard metric={{ label: 'Active Members', value: members.length, trend: 0, aiPrediction: 'Stable' }} />
        <MetricCard metric={{ label: 'AI Confidence', value: '98.4%', trend: 1, aiPrediction: 'High Certainty' }} />
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Growth Trajectory
            </h3>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">Daily</span>
              <span className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 rounded text-teal-600 font-bold">Projected</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-2">
            {/* CSS Bar Chart Simulation */}
            {[35, 42, 48, 45, 55, 62, 68, 75, 82, 88, 92, 98].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group relative">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-500 ${i > 8 ? 'bg-purple-400/50 border-t-2 border-dashed border-purple-500' : 'bg-teal-500'}`}
                  style={{ height: `${h}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                    ${(h * 120).toFixed(0)} {i > 8 ? '(AI Forecast)' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-400">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4 (Projected)</span>
          </div>
        </div>

        {/* AI Insights Feed */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" />
            Live Intelligence
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-2 custom-scrollbar">
            {insights.map(insight => (
              <AiInsightCard key={insight.id} insight={insight} />
            ))}
            {insights.length === 0 && <p className="text-gray-400 text-sm text-center mt-10">Initializing AI Neural Net...</p>}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Strategic Milestones</h3>
        <div className="relative pt-6 pb-2">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-4 pointer-events-none">
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 absolute z-0" />
          </div>
          <div className="relative z-10 flex justify-between">
            {milestones.map((ms, idx) => {
              const isAchieved = totalSaved >= ms.amount;
              return (
                <div key={ms.id} className="flex flex-col items-center group cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isAchieved 
                      ? 'bg-teal-500 border-teal-200 dark:border-teal-900 text-white shadow-lg scale-110' 
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="mt-3 text-center">
                    <p className={`text-sm font-bold ${isAchieved ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500'}`}>
                      {ms.name}
                    </p>
                    <p className="text-xs text-gray-400">${ms.amount.toLocaleString()}</p>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs p-2 rounded w-48 text-center pointer-events-none">
                    <p className="font-bold text-purple-400">{ms.reward}</p>
                    <p className="mt-1">Difficulty: {ms.difficulty}</p>
                    {ms.aiRecommended && <p className="mt-1 text-green-400 flex items-center justify-center gap-1"><Star className="w-3 h-3"/> AI Recommended Target</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Predictive Modeling Engine</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Our proprietary AI algorithms analyze thousands of micro-transactions to forecast your group's financial trajectory with 99.8% accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">Contribution Heatmap</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 49 }).map((_, i) => {
              const intensity = Math.random();
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded-sm ${
                    intensity > 0.8 ? 'bg-teal-600' : 
                    intensity > 0.6 ? 'bg-teal-500' : 
                    intensity > 0.4 ? 'bg-teal-400' : 
                    intensity > 0.2 ? 'bg-teal-300' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  title={`Activity Level: ${(intensity * 100).toFixed(0)}%`}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">Risk Analysis</h3>
          <div className="space-y-4">
            {members.map(m => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={m.avatar} className="w-8 h-8 rounded-full" alt={m.name} />
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{m.name}</p>
                    <p className="text-xs text-gray-500">Consistency: {m.consistencyScore}/100</p>
                  </div>
                </div>
                <AiBadge 
                  type="risk" 
                  value={m.riskFactor} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCollaboration = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Member List */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500" />
            Team Roster
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
              <div className="relative">
                <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 dark:text-white">{member.name}</h4>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">{member.role}</span>
                </div>
                <p className="text-sm text-teal-600 font-medium">${member.contribution.toLocaleString()} contributed</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Consistency</span>
                    <span>{member.consistencyScore}%</span>
                  </div>
                  <ProgressBar value={member.consistencyScore} colorClass="from-purple-400 to-indigo-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Invite Stakeholder
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-500" />
            Strategic Comms
          </h3>
          <span className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            AI Assistant Active
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
          {chatHistory.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === 'user5' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.isAi 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg' 
                  : msg.senderId === 'user5'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
              }`}>
                {msg.isAi && (
                  <div className="flex items-center gap-2 mb-2 border-b border-white/20 pb-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-wider">System AI</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-2 text-right ${msg.isAi || msg.senderId === 'user5' ? 'text-white/70' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <form onSubmit={handleChatSubmit} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message or ask AI for analysis..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-none focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <TrendingUp className="w-4 h-4 transform rotate-45" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderAiAdvisor = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in zoom-in duration-300">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-purple-500/30 relative">
        <Star className="w-12 h-12 text-white animate-spin-slow" />
        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Nexus AI Advisor</h2>
      <p className="text-gray-500 max-w-lg mb-8">
        I am currently processing global economic indicators and your group's spending habits to formulate the optimal savings strategy for Q3.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {[
          { title: 'Optimize Portfolio', desc: 'Rebalance contributions based on risk tolerance.' },
          { title: 'Forecast Scenarios', desc: 'Run Monte Carlo simulations on goal completion.' },
          { title: 'Audit Efficiency', desc: 'Identify leakage in savings velocity.' }
        ].map((opt, i) => (
          <button key={i} className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:shadow-lg transition-all group text-left">
            <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-purple-500 transition-colors mb-2">{opt.title}</h3>
            <p className="text-sm text-gray-500">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      {renderSidebar()}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize">
              {viewMode.replace('-', ' ')}
            </h2>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">
              System Healthy
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-xs text-gray-500">Total Assets</span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">${totalSaved.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => setViewMode('dashboard')}
              className="p-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-md transition-transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Deposit</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
              <img src="https://i.pravatar.cc/150?u=you" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          {/* Quick Action Overlay for Deposit (Visible on Dashboard) */}
          {viewMode === 'dashboard' && (
            <div className="mb-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Accelerate Your Goals</h2>
                <p className="opacity-90 max-w-md">
                  AI analysis suggests a $50 deposit today increases your probability of hitting the "Unicorn" milestone by 14%.
                </p>
              </div>
              <form onSubmit={handleContribution} className="flex w-full md:w-auto gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">$</span>
                  <input
                    type="number"
                    value={contributionInput}
                    onChange={(e) => setContributionInput(e.target.value)}
                    placeholder="Amount"
                    className="w-full pl-8 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:bg-white/30 transition-colors"
                  />
                </div>
                <button type="submit" className="bg-white text-teal-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                  Execute
                </button>
              </form>
            </div>
          )}

          {/* View Router */}
          {viewMode === 'dashboard' && renderDashboard()}
          {viewMode === 'analytics' && renderAnalytics()}
          {viewMode === 'collaboration' && renderCollaboration()}
          {viewMode === 'ai-advisor' && renderAiAdvisor()}
          
          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Nexus Enterprise Systems. Powered by Neural Core v9.0.</p>
            <p className="text-xs mt-1">Bank-grade encryption active. All predictions are probabilistic estimates.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GamifiedGroupSavings;