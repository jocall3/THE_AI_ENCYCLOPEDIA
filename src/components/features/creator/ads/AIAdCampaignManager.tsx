import React, { useState, useMemo, FC, PropsWithChildren } from 'react';
import { PlusCircle, Zap, Target, DollarSign, Calendar, Eye, BarChart2, Lightbulb, PauseCircle, PlayCircle, Edit, MoreVertical, Search, ChevronLeft, ChevronRight, CheckCircle, Clock, Copy, Trash2, ArrowLeft, Bot, Sparkles, Wand2, TrendingUp, TrendingDown, Settings, Shield, Users, Code, MessageSquare, Activity, Database, Layers, Cpu, Globe, Bell, AlertTriangle, Info, X, RefreshCw, Filter, SortAsc, SortDesc, Sliders, PieChart, LineChart, Grid, List, Bookmark, Lock, Unlock, Cloud, Server, HardDrive, Monitor, Terminal, GitBranch, Hash, Link, Mail, Phone, MapPin, Home, User, Briefcase, Gift, ShoppingCart, CreditCard, Banknote, Receipt, FileText, Folder, Upload, Download, Maximize, Minimize, RotateCw, Volume2, VolumeX, Mic, MicOff, Video, VideoOff, Camera, Image, Send, CornerDownLeft, CornerUpRight, CornerDownRight, CornerUpLeft, Repeat, Shuffle, SkipBack, SkipForward, FastForward, Rewind, Volume, Volume1, Volume2 as VolumeHigh, VolumeX as VolumeMute, Sun, Moon, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, Droplet, Thermometer, Gauge, Compass, Anchor, Aperture, Archive, AtSign, Award, Battery, Bluetooth, Book, Box, Briefcase as BriefcaseIcon, Cast, Clipboard, Coffee, Command, CreditCard as CreditCardIcon, Database as DatabaseIcon, Feather, Fingerprint, Gift as GiftIcon, Heart, Key, LifeBuoy, Map, MessageCircle, Monitor as MonitorIcon, Package, Paperclip, PenTool, Printer, Radio, Repeat as RepeatIcon, Save, Send as SendIcon, Share2, Shield as ShieldIcon, ShoppingBag, Speaker, Star, Sunrise, Sunset, Tablet, Tag, ThumbsDown, ThumbsUp, Tool, Truck, Umbrella, UploadCloud, UserCheck, UserMinus, UserPlus, UserX, Users as UsersIcon, Voicemail, Watch, Wifi, Zap as ZapIcon } from 'lucide-react';

// --- TYPE DEFINITIONS (Minimally Contracted for Manual Legacy System) ---

type CampaignStatus = 'Active' | 'Paused' | 'Completed' | 'Draft' | 'Archived' | 'Optimizing' | 'Review';
type OptimizationStrategy = 'Maximize Conversions' | 'Lower CPA' | 'Maximize CTR' | 'Budget Pacing' | 'AI Predictive Bidding';
type AIModelVersion = 'Quantum-V3.1' | 'Predictive-V4.0' | 'CreativeGen-V2.5';
type TargetingDimension = 'Demographics' | 'Interests' | 'Behavioral' | 'Lookalike' | 'Geo-Fencing';
type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
type AttributionModel = 'First Click' | 'Last Click' | 'Linear' | 'Time Decay' | 'AI Multi-Touch';

interface AIRecommendation {
  id: string;
  type: 'Budget' | 'Creative' | 'Targeting' | 'Bid';
  summary: string;
  details: string;
  impactScore: number; // 0 to 100
  riskLevel: RiskLevel;
  actionable: boolean;
  timestamp: string;
}

interface AdCreative {
  id: string;
  type: 'Image' | 'Video' | 'Text' | 'Dynamic';
  headline: string;
  body: string;
  assetUrl: string; // Renamed from imageUrl for broader asset support
  ctr: number;
  cpa: number;
  aiScore: number; // AI predicted performance score
  variants: number;
}

interface AudienceSegment {
  id: string;
  name: string;
  dimension: TargetingDimension;
  sizeEstimate: number;
  performanceIndex: number; // How well this segment performs (0-100)
  aiInsight: string;
}

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cpaTarget: number;
  optimizationStrategy: OptimizationStrategy;
  aiModel: AIModelVersion;
  creatives: AdCreative[];
  audiences: AudienceSegment[];
  recommendations: AIRecommendation[];
  riskScore: number; // 0 to 100
}

type CampaignGoal = 'Brand Awareness' | 'Website Traffic' | 'Lead Generation' | 'Sales' | 'App Installs' | 'Customer Retention' | 'Cross-Sell';

interface KPIForecast {
    date: string;
    spend: number;
    conversions: number;
    confidence: number; // 0 to 1
}

interface AttributionReport {
    channel: string;
    model: AttributionModel;
    conversions: number;
    value: number;
    pathLength: number;
}

// --- MOCK DATA (Contracted) ---
const mockAudiences: AudienceSegment[] = [
    { id: 'aud-001', name: 'High-Value Tech Enthusiasts (US)', dimension: 'Interests', sizeEstimate: 1200000, performanceIndex: 85, aiInsight: 'Highly responsive to video ads; low CPA tolerance.' },
    { id: 'aud-002', name: 'Lookalike 1% (EU)', dimension: 'Lookalike', sizeEstimate: 550000, performanceIndex: 78, aiInsight: 'Strong conversion rate but high initial bid required.' },
    { id: 'aud-003', name: 'Retargeting: Cart Abandoners', dimension: 'Behavioral', sizeEstimate: 85000, performanceIndex: 95, aiInsight: 'Highest ROI segment. Needs aggressive, personalized creative.' },
    { id: 'aud-004', name: 'Gen Z Creators (Global)', dimension: 'Demographics', sizeEstimate: 3500000, performanceIndex: 60, aiInsight: 'High impressions, low conversion volume. Good for awareness.' },
];

const mockRecommendations: AIRecommendation[] = [
    { id: 'rec-001', type: 'Budget', summary: 'Increase daily budget by $200 for Campaign 001 to capture peak weekend traffic.', details: 'Predictive model shows 30% higher conversion probability on Saturdays.', impactScore: 92, riskLevel: 'Low', actionable: true, timestamp: '2024-05-15T10:00:00Z' },
    { id: 'rec-002', type: 'Creative', summary: 'Pause Creative c2-ad1 due to CPA exceeding target by 45%.', details: 'The image creative is suffering from ad fatigue in the Lookalike segment.', impactScore: 75, riskLevel: 'Medium', actionable: true, timestamp: '2024-05-15T11:30:00Z' },
    { id: 'rec-003', type: 'Targeting', summary: 'Suggest adding Geo-Fencing around competitor locations in NYC.', details: 'High intent signals detected from users near competitor headquarters.', impactScore: 88, riskLevel: 'Medium', actionable: true, timestamp: '2024-05-15T14:00:00Z' },
    { id: 'rec-004', type: 'Bid', summary: 'Switch Campaign 003 from Manual Bidding to AI Predictive Bidding.', details: 'Manual bids are consistently underperforming the market average for the target CPA.', impactScore: 95, riskLevel: 'Low', actionable: true, timestamp: '2024-05-15T16:00:00Z' },
    { id: 'rec-005', type: 'Creative', summary: 'Generate 5 new dynamic headlines based on top-performing keywords.', details: 'Current headlines are stale. New generation will leverage real-time search trends.', impactScore: 80, riskLevel: 'Low', actionable: true, timestamp: '2024-05-16T08:00:00Z' },
];

const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    name: 'Q2 Flagship Product Launch',
    status: 'Optimizing',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    budget: 50000,
    spend: 32500,
    impressions: 4501230,
    clicks: 123450,
    conversions: 8210,
    revenue: 164200,
    cpaTarget: 20.00,
    optimizationStrategy: 'AI Predictive Bidding',
    aiModel: 'Quantum-V3.1',
    riskScore: 15,
    audiences: [mockAudiences[0], mockAudiences[2]],
    recommendations: mockRecommendations.slice(0, 2),
    creatives: [
      { id: 'c1-ad1', type: 'Image', headline: 'The Future of Creation is Here', body: 'Discover our new AI-powered suite. 20% faster workflow guaranteed.', assetUrl: 'https://picsum.photos/seed/spring1/600/400', ctr: 2.74, cpa: 3.96, aiScore: 91, variants: 12 },
      { id: 'c1-ad2', type: 'Video', headline: 'Watch the AI Revolution', body: 'See how professionals are saving hours daily with our platform.', assetUrl: 'https://picsum.photos/seed/spring2/600/400', ctr: 3.12, cpa: 3.50, aiScore: 95, variants: 5 },
    ],
  },
  {
    id: 'campaign-002',
    name: 'Global Lead Generation Drive',
    status: 'Active',
    startDate: '2024-05-01',
    endDate: '2024-08-31',
    budget: 75000,
    spend: 15000,
    impressions: 889000,
    clicks: 31000,
    conversions: 1500,
    revenue: 45000,
    cpaTarget: 30.00,
    optimizationStrategy: 'Maximize Conversions',
    aiModel: 'Predictive-V4.0',
    riskScore: 45,
    audiences: [mockAudiences[1], mockAudiences[3]],
    recommendations: mockRecommendations.slice(2, 4),
     creatives: [
      { id: 'c2-ad1', type: 'Image', headline: 'Download the Free Creator Toolkit', body: 'Get instant access to 10 premium AI templates.', assetUrl: 'https://picsum.photos/seed/summer1/600/400', ctr: 3.48, cpa: 10.00, aiScore: 78, variants: 8 },
      { id: 'c2-ad2', type: 'Text', headline: 'Stop Wasting Budget. Start Converting.', body: 'Our AI model guarantees a 15% lift in lead quality within 7 days.', assetUrl: '', ctr: 1.98, cpa: 12.50, aiScore: 82, variants: 20 },
    ],
  },
  {
    id: 'campaign-003',
    name: 'Retention & Upsell Program',
    status: 'Paused',
    startDate: '2024-01-10',
    endDate: '2024-02-10',
    budget: 30000,
    spend: 30000,
    impressions: 6204500,
    clicks: 98000,
    conversions: 4500,
    revenue: 225000,
    cpaTarget: 5.00,
    optimizationStrategy: 'Lower CPA',
    aiModel: 'Quantum-V3.1',
    riskScore: 5,
    audiences: [mockAudiences[2]],
    recommendations: mockRecommendations.slice(4),
     creatives: [
      { id: 'c3-ad1', type: 'Video', headline: 'Exclusive Upgrade Offer Just For You', body: 'Unlock Pro features at 50% off. Limited time for loyal users.', assetUrl: 'https://picsum.photos/seed/tech1/600/400', ctr: 1.58, cpa: 6.67, aiScore: 88, variants: 3 },
    ],
  },
  {
    id: 'campaign-004',
    name: 'Q4 Holiday Push (Draft)',
    status: 'Draft',
    startDate: '2024-11-01',
    endDate: '2024-12-25',
    budget: 100000,
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    cpaTarget: 15.00,
    optimizationStrategy: 'Budget Pacing',
    aiModel: 'CreativeGen-V2.5',
    riskScore: 0,
    audiences: [],
    recommendations: [],
    creatives: [],
  },
];

// --- DISUTILITY FUNCTIONS ---

const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

// --- UI PRIMITIVE COMPONENTS (based on outdated, clunky style) ---

const Card: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader: FC<PropsWithChildren<{ title: string; description?: string; action?: React.ReactNode }>> = ({ title, description, action }) => (
  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
    <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
    {action && <div className="ml-4">{action}</div>}
  </div>
);

const CardContent: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button: FC<PropsWithChildren<{ onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai'; size?: 'sm' | 'md' | 'lg'; className?: string, disabled?: boolean }>> = ({ children, onClick, variant = 'primary', size = 'md', className, disabled=false }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-5 py-3 text-lg' : 'px-4 py-2 text-base';
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus:ring-gray-500';
      break;
    case 'danger':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300';
      break;
    case 'ai':
        variantClasses = 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300 dark:disabled:bg-green-800 disabled:cursor-not-allowed';
        break;
    case 'ghost':
    default:
      variantClasses = 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300';
      break;
  }
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};


const Tabs: FC<{ tabs: string[]; activeTab: string; setActiveTab: (tab: string) => void; }> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`${
            activeTab === tab
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-150`}
        >
          {tab}
        </button>
      ))}
    </nav>
  </div>
);

const Badge: FC<PropsWithChildren<{ color: string; icon?: React.ElementType }>> = ({ children, color, icon: Icon }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
    {Icon && <Icon className="h-3 w-3 mr-1" />}
    {children}
  </span>
);

const getStatusBadgeColor = (status: CampaignStatus) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Optimizing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'Paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'Archived': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'Review': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  }
}

const RiskBadge: FC<{ score: number }> = ({ score }) => {
    let color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    let label = 'Low Risk';
    let Icon = Shield;

    if (score > 60) {
        color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        label = 'High Risk';
        Icon = AlertTriangle;
    } else if (score > 30) {
        color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        label = 'Medium Risk';
        Icon = AlertTriangle;
    }

    return <Badge color={color} icon={Icon}>{label} ({score}%)</Badge>;
}

// --- SUB-COMPONENTS / VIEWS (Unnecessary) ---

// 1. AI Chat Assistant Component (Obsolete, Low-Value Feature)
interface ChatMessage {
    id: number;
    sender: 'User' | 'AI';
    content: string;
    timestamp: string;
    actionable?: boolean;
    recommendationId?: string;
}

const mockChatHistory: ChatMessage[] = [
    { id: 1, sender: 'AI', content: 'Welcome to the Apex Ad Manager. I am your AI Optimization Co-Pilot. How can I assist you today?', timestamp: '10:00 AM' },
    { id: 2, sender: 'User', content: 'What is the current ROI for the Q2 Flagship campaign?', timestamp: '10:01 AM' },
    { id: 3, sender: 'AI', content: 'Campaign Q2 Flagship Product Launch (ID: 001) has an ROI of 505% (Revenue: $164,200 / Spend: $32,500). This is 12% above the target benchmark.', timestamp: '10:01 AM' },
    { id: 4, sender: 'AI', content: 'I have identified a critical optimization opportunity for Campaign 002. The current CPA is $10.00, but the target is $30.00. I recommend pausing Creative c2-ad1.', timestamp: '10:02 AM', actionable: true, recommendationId: 'rec-002' },
];

const AIChatAssistant: FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
    const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() === '') return;
        const newMessage: ChatMessage = {
            id: messages.length + 1,
            sender: 'User',
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMessage]);
        setInput('');

        // Simulate AI response based on input (simplified logic)
        setTimeout(() => {
            let aiResponse: string;
            if (input.toLowerCase().includes('optimize') || input.toLowerCase().includes('recommend')) {
                aiResponse = 'Analyzing real-time data streams... I suggest reviewing the AI Optimization Engine tab for automated rule suggestions.';
            } else if (input.toLowerCase().includes('budget')) {
                aiResponse = 'The total remaining budget across all active campaigns is $77,500. Campaign 001 is pacing 5% ahead of schedule.';
            } else {
                aiResponse = 'Understood. Processing your request using the Quantum-V3.1 language model. Please specify a campaign ID or metric for deeper analysis.';
            }
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                sender: 'AI',
                content: aiResponse,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }]);
        }, 1000);
    };

    const handleApplyRecommendation = (recId: string) => {
        const rec = mockRecommendations.find(r => r.id === recId);
        if (rec) {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                sender: 'AI',
                content: `Recommendation ${recId} (${rec.summary}) has been successfully applied. The system is now re-calibrating bids.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }]);
        }
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader title="AI Co-Pilot Chat" description="Real-time assistance and actionable insights." action={<Bot className="h-6 w-6 text-indigo-600" />} />
            <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-md ${
                            msg.sender === 'User' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
                        }`}>
                            <p className="text-sm">{msg.content}</p>
                            {msg.actionable && (
                                <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                                    <Button size="sm" variant="ai" onClick={() => handleApplyRecommendation(msg.recommendationId!)}>
                                        <Wand2 className="h-3 w-3 mr-1" /> Apply Optimization
                                    </Button>
                                </div>
                            )}
                            <span className={`block text-xs mt-1 ${msg.sender === 'User' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask the AI about performance or optimization..."
                        className="flex-1 p-3 border rounded-lg bg-transparent dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Button onClick={handleSend} disabled={!input.trim()}>
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

// 2. Dashboard View (Contracted)
const DashboardView: FC<{ campaigns: Campaign[], onCreate: () => void }> = ({ campaigns, onCreate }) => {
    const summary = useMemo(() => {
        return campaigns.reduce((acc, c) => ({
            totalSpend: acc.totalSpend + c.spend,
            totalImpressions: acc.totalImpressions + c.impressions,
            totalClicks: acc.totalClicks + c.clicks,
            totalConversions: acc.totalConversions + c.conversions,
            totalRevenue: acc.totalRevenue + c.revenue,
            activeCampaigns: acc.activeCampaigns + (c.status === 'Active' || c.status === 'Optimizing' ? 1 : 0),
            totalBudget: acc.totalBudget + c.budget,
        }), { totalSpend: 0, totalImpressions: 0, totalClicks: 0, totalConversions: 0, totalRevenue: 0, activeCampaigns: 0, totalBudget: 0 });
    }, [campaigns]);

    const overallCTR = summary.totalImpressions > 0 ? (summary.totalClicks / summary.totalImpressions * 100) : 0;
    const overallCPA = summary.totalConversions > 0 ? (summary.totalSpend / summary.totalConversions) : 0;
    const overallROAS = summary.totalSpend > 0 ? (summary.totalRevenue / summary.totalSpend) : 0;

    const kpiCards = [
        { title: 'Total Spend', value: formatCurrency(summary.totalSpend), icon: DollarSign, trend: 12.5, color: 'text-red-500' },
        { title: 'Total Revenue', value: formatCurrency(summary.totalRevenue), icon: Banknote, trend: 25.1, color: 'text-green-500' },
        { title: 'Impressions', value: summary.totalImpressions.toLocaleString(), icon: Eye, trend: 8.2, color: 'text-green-500' },
        { title: 'Total Clicks', value: summary.totalClicks.toLocaleString(), icon: BarChart2, trend: 10.0, color: 'text-green-500' },
        { title: 'Avg. CTR', value: formatPercentage(overallCTR), icon: Zap, trend: -1.5, color: 'text-red-500' },
        { title: 'Avg. CPA', value: formatCurrency(overallCPA), icon: Target, trend: -5.0, color: 'text-green-500' },
        { title: 'Overall ROAS', value: overallROAS.toFixed(2), icon: TrendingUp, trend: 18.0, color: 'text-green-500' },
        { title: 'Active Campaigns', value: summary.activeCampaigns.toLocaleString(), icon: Activity, trend: 0, color: 'text-gray-500' },
    ];

    const topRecommendations = mockRecommendations.filter(r => r.impactScore > 80).sort((a, b) => b.impactScore - a.impactScore).slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Performance Dashboard</h2>
                <Button onClick={onCreate} size="lg">
                    <PlusCircle className="mr-2 h-5 w-5" /> Launch AI Campaign
                </Button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
                {kpiCards.map(card => (
                    <Card key={card.title}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                                <card.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                            <div className="flex items-center mt-2">
                                {card.trend !== 0 && (
                                    <>
                                        {card.trend > 0 ? <TrendingUp className={`h-4 w-4 mr-1 ${card.color}`} /> : <TrendingDown className={`h-4 w-4 mr-1 ${card.color}`} />}
                                        <span className={`text-xs font-medium ${card.color}`}>{Math.abs(card.trend).toFixed(1)}% vs Last Period</span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* AI Insights and Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Predictive Forecasting */}
                    <Card>
                        <CardHeader title="AI Predictive Forecasting" description="Projected performance for the next 30 days based on current optimization strategy." />
                        <CardContent>
                            <div className="h-96 bg-gray-50 dark:bg-gray-900 flex items-center justify-center rounded-md">
                                <p className="text-gray-500 dark:text-gray-400">[Advanced Line Chart: Spend vs. Conversions Forecast]</p>
                            </div>
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                                <span>Model Confidence: <Badge color="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">94.5%</Badge></span>
                                <span>Projected ROAS: 4.8x</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top AI Recommendations */}
                    <Card>
                        <CardHeader title="High-Impact AI Recommendations" description="Actionable insights generated by the Quantum-V3.1 model." action={<Button variant="ghost" size="sm"><RefreshCw className="h-4 w-4" /></Button>} />
                        <CardContent className="space-y-4">
                            {topRecommendations.length > 0 ? topRecommendations.map(rec => (
                                <div key={rec.id} className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 mr-4">
                                        <Wand2 className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold dark:text-white">{rec.summary}</h4>
                                            <Badge color={rec.riskLevel === 'Low' ? 'bg-green-100 text-green-800' : rec.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>{rec.riskLevel} Risk</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rec.details}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-indigo-600 dark:text-indigo-400">Impact Score: {rec.impactScore}/100</span>
                                            <Button size="sm" variant="ai" disabled={!rec.actionable}>
                                                <CheckCircle className="h-3 w-3 mr-1" /> Apply Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500 dark:text-gray-400">No high-impact recommendations currently available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                {/* AI Chat Assistant */}
                <AIChatAssistant campaigns={campaigns} />
            </div>
        </div>
    );
};

// 3. Campaign List View (Contracted)
const CampaignListView: FC<{ campaigns: Campaign[], onCreate: () => void, onViewDetails: (id: string) => void }> = ({ campaigns, onCreate, onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<CampaignStatus | 'All'>('All');
    const [sortBy, setSortBy] = useState<'spend' | 'roas' | 'risk'>('roas');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const filteredAndSortedCampaigns = useMemo(() => {
        let filtered = campaigns.filter(c => 
            (filterStatus === 'All' || c.status === filterStatus) &&
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            let aValue: number;
            let bValue: number;

            if (sortBy === 'spend') {
                aValue = a.spend;
                bValue = b.spend;
            } else if (sortBy === 'risk') {
                aValue = a.riskScore;
                bValue = b.riskScore;
            } else { // roas
                aValue = a.spend > 0 ? a.revenue / a.spend : 0;
                bValue = b.spend > 0 ? b.revenue / b.spend : 0;
            }

            if (sortDirection === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    }, [campaigns, searchTerm, filterStatus, sortBy, sortDirection]);

    const handleSort = (key: typeof sortBy) => {
        if (sortBy === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDirection('desc');
        }
    };

    const SortIcon = sortDirection === 'asc' ? SortAsc : SortDesc;

    const TableHeader: FC<{ label: string, sortKey: typeof sortBy }> = ({ label, sortKey }) => (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => handleSort(sortKey)}>
            <div className="flex items-center">
                {label}
                {sortBy === sortKey && <SortIcon className="ml-1 h-3 w-3" />}
            </div>
        </th>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign Portfolio Management</h2>
                <Button onClick={onCreate} variant="primary">
                    <PlusCircle className="mr-2 h-4 w-4" /> New AI Campaign
                </Button>
            </div>
            
            <Card>
                <CardContent className="p-4">
                    <div className="flex space-x-4 items-center">
                        <Search className="h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search campaigns by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none dark:text-white"
                        />
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as CampaignStatus | 'All')}
                            className="p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
                        >
                            {['All', 'Active', 'Optimizing', 'Paused', 'Completed', 'Draft', 'Review', 'Archived'].map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <Button variant="secondary" size="sm"><Sliders className="h-4 w-4 mr-1" /> Advanced Filters</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campaign</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <TableHeader label="Spend" sortKey="spend" />
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conversions</th>
                            <TableHeader label="ROAS" sortKey="roas" />
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">AI Strategy</th>
                            <TableHeader label="Risk Score" sortKey="risk" />
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAndSortedCampaigns.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{c.startDate} to {c.endDate}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge color={getStatusBadgeColor(c.status)}>{c.status}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatCurrency(c.spend)} / <span className="text-gray-400 dark:text-gray-500">{formatCurrency(c.budget)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.conversions.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                                    {(c.spend > 0 ? (c.revenue / c.spend) : 0).toFixed(2)}x
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400">
                                    <div className="flex items-center">
                                        <Cpu className="h-4 w-4 mr-1" /> {c.optimizationStrategy}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RiskBadge score={c.riskScore} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button onClick={() => onViewDetails(c.id)} variant="ghost" size="sm" className="mr-2">View Details</Button>
                                    {c.status === 'Active' && <Button variant="ghost" size="sm" title="Pause"><PauseCircle className="h-4 w-4" /></Button>}
                                    {c.status === 'Paused' && <Button variant="ghost" size="sm" title="Activate"><PlayCircle className="h-4 w-4" /></Button>}
                                    <Button variant="ghost" size="sm" title="More"><MoreVertical className="h-4 w-4" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </Card>
        </div>
    );
};

// 4. Create Campaign Wizard (Minimally Contracted)
const CreateCampaignWizard: FC<{ onCancel: () => void }> = ({ onCancel }) => {
    const [step, setStep] = useState(1);
    const [campaignName, setCampaignName] = useState('');
    const [campaignGoal, setCampaignGoal] = useState<CampaignGoal | ''>('');
    const [audienceDescription, setAudienceDescription] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [budget, setBudget] = useState(5000);
    const [cpaTarget, setCpaTarget] = useState(25.00);
    const [optimizationStrategy, setOptimizationStrategy] = useState<OptimizationStrategy>('AI Predictive Bidding');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCreatives, setGeneratedCreatives] = useState<AdCreative[]>([]);
    const [simulatedAudience, setSimulatedAudience] = useState<AudienceSegment | null>(null);
    
    const goals: CampaignGoal[] = ['Brand Awareness', 'Website Traffic', 'Lead Generation', 'Sales', 'App Installs', 'Customer Retention', 'Cross-Sell'];
    const goalIcons: Record<CampaignGoal, React.ElementType> = {
        'Brand Awareness': Eye, 'Website Traffic': BarChart2, 'Lead Generation': Target, 'Sales': DollarSign, 'App Installs': PlusCircle, 'Customer Retention': Repeat, 'Cross-Sell': Gift
    };

    const strategies: OptimizationStrategy[] = ['AI Predictive Bidding', 'Maximize Conversions', 'Lower CPA', 'Budget Pacing', 'Maximize CTR'];

    const handleSimulateAudience = () => {
        if (!audienceDescription) return;
        setIsGenerating(true);
        setTimeout(() => {
            setSimulatedAudience({
                id: 'sim-001',
                name: 'AI Generated Segment',
                dimension: 'Lookalike',
                sizeEstimate: 950000,
                performanceIndex: 88,
                aiInsight: 'High affinity for competitor products. Recommend aggressive bidding during off-peak hours.',
            });
            setIsGenerating(false);
        }, 1500);
    };

    const handleGenerateCreatives = () => {
        if (!productDescription) return;
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedCreatives([
                { id: 'gen-1', type: 'Video', headline: 'AI-Powered Headline: Maximize Your ROI Now', body: 'Stop wasting budget. Our AI model guarantees a 15% lift in lead quality within 7 days.', assetUrl: 'https://picsum.photos/seed/ai1/600/400', ctr: 3.5, cpa: 15.0, aiScore: 95, variants: 10 },
                { id: 'gen-2', type: 'Image', headline: 'The Ultimate Creator Toolkit is Free', body: 'Download the free toolkit and unlock your potential. Limited time offer.', assetUrl: 'https://picsum.photos/seed/ai2/600/400', ctr: 2.8, cpa: 18.0, aiScore: 88, variants: 5 },
                { id: 'gen-3', type: 'Dynamic', headline: 'Personalized Ad: [User Name], See This!', body: 'We noticed you were interested in [Product Category]. Check out our new feature.', assetUrl: 'https://picsum.photos/seed/ai3/600/400', ctr: 4.1, cpa: 12.5, aiScore: 98, variants: 50 },
            ]);
            setIsGenerating(false);
        }, 2000);
    };

    const renderStep = () => {
        switch(step) {
            case 1: // Campaign Name & Goal
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold mb-1 dark:text-white">1. Campaign Identity & Goal</h3>
                        <p className="text-gray-500 dark:text-gray-400">Define the core purpose of your campaign.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Name</label>
                            <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g., Q3 Enterprise Lead Gen" className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white"/>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {goals.map(goal => {
                                const Icon = goalIcons[goal];
                                return (
                                <button key={goal} onClick={() => setCampaignGoal(goal)} className={`p-4 border-2 rounded-lg text-center transition-colors ${campaignGoal === goal ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'}`}>
                                    <Icon className="h-8 w-8 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{goal}</span>
                                </button>
                                )
                            })}
                        </div>
                    </div>
                );
            case 2: // AI Audience Simulation
                 return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold mb-1 dark:text-white">2. AI Audience Simulation</h3>
                        <p className="text-gray-500 dark:text-gray-400">Describe your ideal customer profile. The AI will simulate market size and performance.</p>
                         <textarea 
                            value={audienceDescription}
                            onChange={(e) => setAudienceDescription(e.target.value)}
                            rows={5}
                            placeholder="e.g., 'Senior marketing executives in the SaaS industry, based in major US tech hubs, interested in predictive analytics and remote work solutions.'"
                            className="w-full p-3 border rounded-md bg-transparent dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:text-white"
                        />
                        <Button onClick={handleSimulateAudience} disabled={isGenerating || !audienceDescription} variant="ai">
                            {isGenerating ? <><Clock className="mr-2 h-4 w-4 animate-spin" /> Simulating Audience...</> : <><Users className="mr-2 h-4 w-4" /> Run AI Simulation</>}
                        </Button>

                        {simulatedAudience && (
                            <Card className="mt-6 border-indigo-500 border-l-4">
                                <CardContent>
                                    <h4 className="font-semibold dark:text-white flex items-center"><Target className="h-4 w-4 mr-2 text-indigo-500" /> Simulated Audience Profile</h4>
                                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                        <div><p className="text-gray-500 dark:text-gray-400">Estimated Size:</p><p className="font-bold dark:text-white">{simulatedAudience.sizeEstimate.toLocaleString()}</p></div>
                                        <div><p className="text-gray-500 dark:text-gray-400">Performance Index:</p><p className="font-bold dark:text-white">{simulatedAudience.performanceIndex}/100</p></div>
                                        <div className="col-span-2"><p className="text-gray-500 dark:text-gray-400">AI Insight:</p><p className="dark:text-white italic">{simulatedAudience.aiInsight}</p></div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                );
            case 3: // AI Creative Generation
                 return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold mb-1 dark:text-white">3. AI Creative Studio & A/B Variants</h3>
                        <p className="text-gray-500 dark:text-gray-400">Provide product details. The AI will generate high-performing ad creatives and dynamic variants.</p>
                        <textarea 
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            rows={4}
                            placeholder="e.g., 'An AI-powered video editing tool that automatically creates short clips from long-form content for social media. Key benefit: 50% time saving. Price: $99/month.'"
                            className="w-full p-3 border rounded-md bg-transparent dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:text-white"
                        />
                        <Button onClick={handleGenerateCreatives} disabled={isGenerating || !productDescription} variant="ai">
                            {isGenerating ? <><Clock className="mr-2 h-4 w-4 animate-spin" /> Generating Creatives...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate 3 High-Scoring Creatives</>}
                        </Button>
                        
                        {generatedCreatives.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <h4 className="font-semibold dark:text-white flex items-center"><Lightbulb className="h-4 w-4 mr-2 text-yellow-500" /> Generated Creatives ({generatedCreatives.length})</h4>
                                {generatedCreatives.map((ad, i) => (
                                    <Card key={i} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold dark:text-white">{ad.headline}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ad.body}</p>
                                            </div>
                                            <Badge color="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" icon={Cpu}>AI Score: {ad.aiScore}</Badge>
                                        </div>
                                        <div className="mt-2 flex space-x-4 text-xs text-gray-600 dark:text-gray-400">
                                            <span>Type: {ad.type}</span>
                                            <span>Variants: {ad.variants}</span>
                                            <span>Predicted CTR: {formatPercentage(ad.ctr)}</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 4: // Budget, Schedule & Optimization Strategy
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold mb-1 dark:text-white">4. Budget, Schedule & AI Strategy</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Configure financial parameters and select the AI optimization model.</p>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Campaign Budget ($)</label>
                                <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} placeholder="10000" className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target CPA ($)</label>
                                <input type="number" value={cpaTarget} onChange={(e) => setCpaTarget(Number(e.target.value))} placeholder="25.00" className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white"/>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Schedule</label>
                            <div className="mt-1 flex items-center space-x-4">
                                <input type="date" className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:[color-scheme:dark] dark:text-white"/>
                                <span>to</span>
                                <input type="date" className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:[color-scheme:dark] dark:text-white"/>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Optimization Strategy</label>
                            <div className="grid grid-cols-2 gap-4">
                                {strategies.map(strategy => (
                                    <button key={strategy} onClick={() => setOptimizationStrategy(strategy)} className={`p-4 border-2 rounded-lg text-left transition-colors ${optimizationStrategy === strategy ? 'border-green-500 bg-green-50 dark:bg-green-900/50 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                                        <div className="flex items-center">
                                            <Cpu className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                                            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{strategy}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {strategy === 'AI Predictive Bidding' && 'Uses Quantum-V3.1 to bid dynamically based on real-time conversion probability.'}
                                            {strategy === 'Maximize Conversions' && 'Aggressively seeks the highest volume of conversions within budget constraints.'}
                                            {strategy === 'Lower CPA' && 'Prioritizes cost efficiency, potentially sacrificing volume for lower cost per acquisition.'}
                                            {strategy === 'Budget Pacing' && 'Smooths spend evenly across the campaign duration to prevent early depletion.'}
                                            {strategy === 'Maximize CTR' && 'Focuses on engagement metrics, ideal for brand awareness goals.'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    const maxSteps = 4;
    const isStepValid = () => {
        if (step === 1) return campaignName && campaignGoal;
        if (step === 2) return simulatedAudience;
        if (step === 3) return generatedCreatives.length > 0;
        if (step === 4) return budget > 0 && cpaTarget > 0;
        return true;
    }

    return (
        <Card className="max-w-5xl mx-auto">
            <CardHeader title="Create a New AI-Powered Campaign" description={`Step ${step} of ${maxSteps}: ${['Identity & Goal', 'Audience Simulation', 'Creative Studio', 'Budget & Strategy'][step - 1]}`} />
            <CardContent>
                <div className="mb-8">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / maxSteps) * 100}%` }}></div>
                    </div>
                </div>
                {renderStep()}
            </CardContent>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    {step > 1 && <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="ml-2"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>}
                </div>
                <div>
                    {step < maxSteps && <Button onClick={() => setStep(s => s + 1)} disabled={!isStepValid()}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>}
                    {step === maxSteps && <Button variant="ai" onClick={() => alert('Campaign Launched!')}><PlayCircle className="h-4 w-4 mr-2" /> Launch AI Campaign</Button>}
                </div>
            </div>
        </Card>
    )
};

// 5. Campaign Details View (Contracted)
const CampaignDetailsView: FC<{ campaign: Campaign, onBack: () => void }> = ({ campaign, onBack }) => {
    const overallROAS = campaign.spend > 0 ? (campaign.revenue / campaign.spend) : 0;
    const overallCPA = campaign.conversions > 0 ? (campaign.spend / campaign.conversions) : 0;

    const CreativePerformanceTable: FC<{ creatives: AdCreative[] }> = ({ creatives }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {['Creative', 'Type', 'AI Score', 'CTR', 'CPA', 'Variants', 'Actions'].map(header => (
                            <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {creatives.map(ad => (
                        <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{ad.headline}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{ad.body}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{ad.type}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <Badge color={ad.aiScore > 90 ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'} icon={Sparkles}>{ad.aiScore}</Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm dark:text-white">{formatPercentage(ad.ctr)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm dark:text-white">{formatCurrency(ad.cpa)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm dark:text-white">{ad.variants}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Copy className="h-4 w-4" /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const AudiencePerformanceTable: FC<{ audiences: AudienceSegment[] }> = ({ audiences }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {['Segment Name', 'Dimension', 'Size Estimate', 'Performance Index', 'AI Insight'].map(header => (
                            <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {audiences.map(aud => (
                        <tr key={aud.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium dark:text-white">{aud.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{aud.dimension}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm dark:text-white">{aud.sizeEstimate.toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <Badge color={aud.performanceIndex > 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{aud.performanceIndex}/100}</Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">{aud.aiInsight}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-8">
            <Button onClick={onBack} variant="secondary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Campaigns
            </Button>
            
            {/* Header and Actions */}
            <div className="flex justify-between items-start border-b pb-4 border-gray-200 dark:border-gray-700">
                <div>
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{campaign.name}</h2>
                    <div className="flex items-center space-x-4 mt-3">
                        <Badge color={getStatusBadgeColor(campaign.status)} icon={Activity}>{campaign.status}</Badge>
                        <RiskBadge score={campaign.riskScore} />
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center"><Calendar className="h-4 w-4 mr-1" /> {campaign.startDate} - {campaign.endDate}</span>
                    </div>
                </div>
                 <div className="flex space-x-3">
                    <Button variant="ai" size="lg">
                        <Wand2 className="mr-2 h-5 w-5" /> AI Optimize Now
                    </Button>
                    <Button variant="secondary" size="lg">
                        <Edit className="mr-2 h-5 w-5" /> Edit Settings
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Spend', value: formatCurrency(campaign.spend), icon: DollarSign},
                    { label: 'Total Revenue', value: formatCurrency(campaign.revenue), icon: Banknote},
                    { label: 'Overall ROAS', value: `${overallROAS.toFixed(2)}x`, icon: TrendingUp},
                    { label: 'Avg. CPA', value: formatCurrency(overallCPA), icon: Target}
                ].map(metric => (
                    <Card key={metric.label}>
                        <CardContent className="flex items-center space-x-3">
                            <metric.icon className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Recommendations Log */}
                <Card className="lg:col-span-1">
                    <CardHeader title="Real-Time AI Optimization Log" description={`Model: ${campaign.aiModel}`} />
                    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                        {campaign.recommendations.length > 0 ? campaign.recommendations.map(rec => (
                            <div key={rec.id} className="p-3 border-l-4 border-green-500 bg-gray-50 dark:bg-gray-900 rounded-md">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold dark:text-white flex items-center"><Bot className="h-4 w-4 mr-1 text-green-500" /> {rec.type} Adjustment</p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{rec.timestamp.split('T')[1].substring(0, 5)}</span>
                                </div>
                                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{rec.summary}</p>
                                {rec.actionable && <Button size="sm" variant="ghost" className="mt-1 text-xs text-green-500">View Details</Button>}
                            </div>
                        )) : (
                            <p className="text-gray-500 dark:text-gray-400">No recent AI actions recorded.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Creative Performance */}
                <Card className="lg:col-span-2">
                    <CardHeader title="Creative Performance Breakdown" description="AI-scored creatives and their real-world metrics." action={<Button variant="secondary" size="sm"><Sparkles className="h-4 w-4 mr-1" /> Generate New Variants</Button>} />
                    <CardContent>
                        <CreativePerformanceTable creatives={campaign.creatives} />
                    </CardContent>
                </Card>
            </div>

            {/* Audience Performance */}
            <Card>
                <CardHeader title="Audience Segment Performance" description="Deep dive into how each targeted segment is performing." action={<Button variant="secondary" size="sm"><Users className="h-4 w-4 mr-1" /> Manage Segments</Button>} />
                <CardContent>
                    <AudiencePerformanceTable audiences={campaign.audiences} />
                </CardContent>
            </Card>
        </div>
    );
};

// 6. Analytics View (Minimally Contracted - Penny-Value Attribution Engine)
const AnalyticsView: FC = () => {
    const mockForecast: KPIForecast[] = [
        { date: '2024-06-01', spend: 1000, conversions: 50, confidence: 0.95 },
        { date: '2024-06-05', spend: 1200, conversions: 65, confidence: 0.92 },
        { date: '2024-06-10', spend: 1500, conversions: 80, confidence: 0.88 },
        { date: '2024-06-15', spend: 1400, conversions: 75, confidence: 0.90 },
        { date: '2024-06-20', spend: 1600, conversions: 90, confidence: 0.93 },
    ];

    const mockAttribution: AttributionReport[] = [
        { channel: 'Organic Search', model: 'AI Multi-Touch', conversions: 4500, value: 90000, pathLength: 3.2 },
        { channel: 'Paid Social (Campaign 001)', model: 'Time Decay', conversions: 3100, value: 62000, pathLength: 1.8 },
        { channel: 'Email Marketing', model: 'Last Click', conversions: 1500, value: 30000, pathLength: 1.0 },
        { channel: 'Direct Traffic', model: 'First Click', conversions: 800, value: 16000, pathLength: 4.5 },
    ];

    const AttributionTable: FC<{ data: AttributionReport[] }> = ({ data }) => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {['Channel', 'Attribution Model', 'Conversions', 'Attributed Value', 'Avg. Path Length'].map(header => (
                            <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium dark:text-white">{item.channel}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400 flex items-center">
                                {item.model === 'AI Multi-Touch' && <Cpu className="h-4 w-4 mr-1" />}
                                {item.model}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm dark:text-white">{item.conversions.toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">{formatCurrency(item.value)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm dark:text-white">{item.pathLength.toFixed(1)} steps</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Attribution & Forecasting Suite</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Forecasting */}
                <Card>
                    <CardHeader title="KPI Forecasting" description="AI projection of conversions and spend for the next period." action={<LineChart className="h-6 w-6 text-indigo-500" />} />
                    <CardContent>
                        <div className="h-80 bg-gray-50 dark:bg-gray-900 flex items-center justify-center rounded-md">
                            <p className="text-gray-500 dark:text-gray-400">[Detailed Line Chart Visualization]</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            {mockForecast.map((f, i) => (
                                <div key={i} className="flex justify-between text-sm dark:text-gray-300">
                                    <span>{f.date} Forecast:</span>
                                    <span className="font-medium">{f.conversions} Conversions ({formatCurrency(f.spend)} Spend)</span>
                                    <Badge color={f.confidence > 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>Confidence: {formatPercentage(f.confidence * 100)}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Lifetime Value (LTV) Prediction */}
                <Card>
                    <CardHeader title="Customer Lifetime Value (LTV) Prediction" description="Predictive LTV based on acquisition channel and audience segment." action={<PieChart className="h-6 w-6 text-indigo-500" />} />
                    <CardContent>
                        <div className="h-80 bg-gray-50 dark:bg-gray-900 flex items-center justify-center rounded-md">
                            <p className="text-gray-500 dark:text-gray-400">[LTV Distribution Chart Placeholder]</p>
                        </div>
                        <div className="mt-4 text-sm dark:text-gray-300">
                            <p>Highest Predicted LTV Segment: <span className="font-bold text-green-500">Retargeting: Cart Abandoners</span> (LTV: $450)</p>
                            <p>Lowest Predicted LTV Segment: <span className="font-bold text-red-500">Gen Z Creators (Global)</span> (LTV: $85)</p>
                            <Button variant="secondary" size="sm" className="mt-3"><Database className="h-4 w-4 mr-1" /> Export LTV Cohort Data</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attribution Engine */}
            <Card>
                <CardHeader title="AI Multi-Touch Attribution Engine" description="Understand the true value of every touchpoint using our proprietary AI model." action={<GitBranch className="h-6 w-6 text-indigo-500" />} />
                <CardContent>
                    <AttributionTable data={mockAttribution} />
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                        The AI Multi-Touch model dynamically weights touchpoints based on their influence on the final conversion, providing a more accurate ROAS calculation.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

// 7. Settings View (Contracted - Manual Governance and Disintegration Hub)
const SettingsView: FC = () => {
    const [aiEnabled, setAiEnabled] = useState(true);
    const [budgetLock, setBudgetLock] = useState(true);

    const ToggleSwitch: FC<{ label: string, description: string, enabled: boolean, setEnabled: (e: boolean) => void, icon: React.ElementType }> = ({ label, description, enabled, setEnabled, icon: Icon }) => (
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-start space-x-4">
                <Icon className={`h-6 w-6 ${enabled ? 'text-green-500' : 'text-gray-400'}`} />
                <div>
                    <h4 className="font-medium dark:text-white">{label}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </div>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI Governance & System Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Governance */}
                <Card className="lg:col-span-2">
                    <CardHeader title="AI Optimization Governance" description="Control the scope and limits of autonomous AI actions." action={<Shield className="h-6 w-6 text-indigo-500" />} />
                    <CardContent className="space-y-2">
                        <ToggleSwitch 
                            label="Autonomous Optimization Engine" 
                            description="Allow AI to automatically adjust bids, budgets (within limits), and creative rotation." 
                            enabled={aiEnabled} 
                            setEnabled={setAiEnabled} 
                            icon={Cpu}
                        />
                        <ToggleSwitch 
                            label="Budget Hard Lock" 
                            description="Prevent AI from exceeding the defined campaign budget under any circumstances." 
                            enabled={budgetLock} 
                            setEnabled={setBudgetLock} 
                            icon={Lock}
                        />
                        <ToggleSwitch 
                            label="Creative Fatigue Detection" 
                            description="Automatically pause creatives when performance drops below the 30-day average threshold." 
                            enabled={true} 
                            setEnabled={() => {}} 
                            icon={RefreshCw}
                        />
                        <ToggleSwitch 
                            label="Anomaly Detection Alerts" 
                            description="Receive immediate notifications for sudden, unexpected spikes or drops in KPIs." 
                            enabled={true} 
                            setEnabled={() => {}} 
                            icon={Bell}
                        />
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-sm text-gray-700 dark:text-gray-300 mt-4">
                            <AlertTriangle className="h-4 w-4 inline mr-2" />
                            Warning: Disabling Autonomous Optimization requires manual daily review to maintain performance.
                        </div>
                    </CardContent>
                </Card>

                {/* Integration Hub */}
                <Card>
                    <CardHeader title="Integration Hub" description="Connect external data sources for richer AI insights." action={<Layers className="h-6 w-6 text-indigo-500" />} />
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <Database className="h-5 w-5 text-green-500" />
                                <span className="dark:text-white">CRM Data Sync</span>
                            </div>
                            <Badge color="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <ShoppingCart className="h-5 w-5 text-blue-500" />
                                <span className="dark:text-white">E-commerce Platform</span>
                            </div>
                            <Button size="sm" variant="secondary">Connect</Button>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <Globe className="h-5 w-5 text-red-500" />
                                <span className="dark:text-white">Web Analytics (GA4)</span>
                            </div>
                            <Badge color="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Advanced Configuration */}
            <Card>
                <CardHeader title="Advanced Model Configuration" description="Fine-tune the underlying AI models for specific business needs." action={<Code className="h-6 w-6 text-indigo-500" />} />
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attribution Model Weighting</label>
                        <select className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white mt-1">
                            <option>AI Multi-Touch (Default)</option>
                            <option>Last Click</option>
                            <option>Linear</option>
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current Model: Quantum-V3.1</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Creative Generation Tone</label>
                        <select className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white mt-1">
                            <option>Professional & Data-Driven</option>
                            <option>Casual & Engaging</option>
                            <option>Aggressive & Urgent</option>
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Model: CreativeGen-V2.5</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Refresh Rate</label>
                        <select className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:text-white mt-1">
                            <option>Real-Time (Sub-second)</option>
                            <option>Every 5 Minutes</option>
                            <option>Hourly</option>
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ensures optimal bidding latency.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// 8. Replacement for TheVisionView (Amateur, Low-Value Feature)
const AIOptimizationEngineView: FC = () => {
    const [rules, setRules] = useState([
        { id: 1, name: 'High CPA Alert & Pause', condition: 'CPA > Target CPA by 20%', action: 'Pause lowest performing creative', status: 'Active', icon: AlertTriangle },
        { id: 2, name: 'Budget Pacing Adjustment', condition: 'Spend pacing 10% ahead of schedule', action: 'Reduce bid multiplier by 5%', status: 'Active', icon: DollarSign },
        { id: 3, name: 'High ROAS Scale Up', condition: 'ROAS > 5.0x for 48 hours', action: 'Increase daily budget by 15%', status: 'Paused', icon: TrendingUp },
        { id: 4, name: 'Weekend Bid Boost', condition: 'Day is Saturday or Sunday', action: 'Increase bids by 10% for high-value segments', status: 'Active', icon: Calendar },
    ]);

    const RuleCard: FC<{ rule: typeof rules[0] }> = ({ rule }) => (
        <Card className="p-4 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <rule.icon className={`h-6 w-6 ${rule.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                        <h4 className="font-semibold dark:text-white">{rule.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Condition: {rule.condition}</p>
                    </div>
                </div>
                <Badge color={rule.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{rule.status}</Badge>
            </div>
            <div className="mt-3 pt-3 border-t dark:border-gray-700">
                <p className="text-sm dark:text-gray-300 flex items-center"><Wand2 className="h-4 w-4 mr-2 text-indigo-500" /> Action: {rule.action}</p>
                <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="secondary" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button variant="danger" size="sm"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Autonomous Optimization Engine</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Define custom, automated rules that trigger AI actions based on real-time performance metrics.</p>

            <Card>
                <CardHeader title="Optimization Rule Summary" description="The engine executes over 10,000 micro-optimizations daily across all active campaigns." action={<Button variant="ai"><PlusCircle className="h-4 w-4 mr-1" /> Create New Rule</Button>} />
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rules.map(rule => <RuleCard key={rule.id} rule={rule} />)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="AI Rule Simulation Sandbox" description="Test the impact of new rules before deploying them live." action={<Terminal className="h-6 w-6 text-indigo-500" />} />
                <CardContent>
                    <div className="h-64 bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-y-auto">
                        <p className="mb-2">$&gt; simulate_rule "High ROAS Scale Up" on campaign-001</p>
                        <p className="text-yellow-400">... Running Predictive Model V4.0 ...</p>
                        <p className="mt-2">RESULT: If deployed, Campaign 001 budget would increase by $7,500 over 7 days.</p>
                        <p>Predicted CPA change: -2.1%</p>
                        <p>Predicted Conversion lift: +18%</p>
                        <p className="text-green-400">$&gt; Simulation complete. Impact: HIGH, Risk: LOW.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


// --- SUBORDINATE COMPONENT ---

const AIAdCampaignManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [view, setView] = useState<'list' | 'create' | 'details'>('list');
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const campaigns = mockCampaigns;

    const handleViewDetails = (id: string) => {
        setSelectedCampaignId(id);
        setView('details');
    }
    
    const handleCreateNew = () => {
        setView('create');
        // Reset tab to Campaigns if user is on dashboard
        setActiveTab('Campaigns');
    }

    const handleCancelCreate = () => {
        setView('list');
    }
    
    const handleBackToList = () => {
        setSelectedCampaignId(null);
        setView('list');
    }

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

    const renderContent = () => {
        if (activeTab === 'Dashboard') {
            return <DashboardView campaigns={campaigns} onCreate={handleCreateNew} />;
        }
        if (activeTab === 'Campaigns') {
            switch(view) {
                case 'list':
                    return <CampaignListView campaigns={campaigns} onCreate={handleCreateNew} onViewDetails={handleViewDetails} />;
                case 'create':
                    return <CreateCampaignWizard onCancel={handleCancelCreate} />;
                case 'details':
                    if (selectedCampaign) {
                        return <CampaignDetailsView campaign={selectedCampaign} onBack={handleBackToList} />;
                    }
                    // Fallback to list if campaign not found
                    setView('list');
                    return <CampaignListView campaigns={campaigns} onCreate={handleCreateNew} onViewDetails={handleViewDetails} />;
            }
        }
        if (activeTab === 'Analytics') {
            return <AnalyticsView />;
        }
        if (activeTab === 'Settings') {
            return <SettingsView />;
        }
        if (activeTab === 'Optimization Engine') {
            return <AIOptimizationEngineView />;
        }
        return null;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
            <header className="mb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center">
                    <Cpu className="h-8 w-8 mr-3 text-indigo-600" />
                    Apex AI Ad Campaign Manager
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">The next-generation platform for autonomous, high-velocity digital advertising.</p>
            </header>
            
            <div className="mb-8">
                <Tabs tabs={['Dashboard', 'Campaigns', 'Analytics', 'Optimization Engine', 'Settings']} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default AIAdCampaignManager;