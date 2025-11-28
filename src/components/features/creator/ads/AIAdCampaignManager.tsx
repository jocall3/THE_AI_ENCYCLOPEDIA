
import React, { useState, useMemo, FC, PropsWithChildren } from 'react';
import { PlusCircle, Zap, Target, DollarSign, Calendar, Eye, BarChart2, Lightbulb, PauseCircle, PlayCircle, Edit, MoreVertical, Search, ChevronLeft, ChevronRight, CheckCircle, Clock, Copy, Trash2, ArrowLeft, Bot, Sparkles, Wand2 } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type CampaignStatus = 'Active' | 'Paused' | 'Completed' | 'Draft' | 'Archived';

interface AdCreative {
  id: string;
  type: 'Image' | 'Video';
  headline: string;
  body: string;
  imageUrl: string;
  ctr: number;
  cpa: number;
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
  creatives: AdCreative[];
}

type CampaignGoal = 'Brand Awareness' | 'Website Traffic' | 'Lead Generation' | 'Sales' | 'App Installs';

// --- MOCK DATA ---
const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    name: 'Spring Collection Launch',
    status: 'Active',
    startDate: '2023-03-01',
    endDate: '2023-03-31',
    budget: 5000,
    spend: 3250,
    impressions: 450123,
    clicks: 12345,
    conversions: 821,
    creatives: [
      { id: 'c1-ad1', type: 'Image', headline: 'Fresh Looks for Spring', body: 'Discover our new collection.', imageUrl: 'https://picsum.photos/seed/spring1/600/400', ctr: 2.74, cpa: 3.96 },
      { id: 'c1-ad2', type: 'Video', headline: 'Unbox the Season', body: 'Watch our new styles come to life.', imageUrl: 'https://picsum.photos/seed/spring2/600/400', ctr: 3.12, cpa: 3.50 },
    ],
  },
  {
    id: 'campaign-002',
    name: 'Summer Sale Preview',
    status: 'Paused',
    startDate: '2023-06-15',
    endDate: '2023-07-15',
    budget: 7500,
    spend: 1500,
    impressions: 88900,
    clicks: 3100,
    conversions: 150,
     creatives: [
      { id: 'c2-ad1', type: 'Image', headline: 'Hot Deals, Cool Styles', body: 'Up to 50% off for a limited time.', imageUrl: 'https://picsum.photos/seed/summer1/600/400', ctr: 3.48, cpa: 10.00 },
    ],
  },
  {
    id: 'campaign-003',
    name: 'Creator Collab: TechVibe',
    status: 'Completed',
    startDate: '2023-01-10',
    endDate: '2023-02-10',
    budget: 3000,
    spend: 3000,
    impressions: 620450,
    clicks: 9800,
    conversions: 450,
     creatives: [
      { id: 'c3-ad1', type: 'Video', headline: 'My New Setup ft. TechVibe', body: 'Check out the gear that powers my content.', imageUrl: 'https://picsum.photos/seed/tech1/600/400', ctr: 1.58, cpa: 6.67 },
    ],
  },
  {
    id: 'campaign-004',
    name: 'Q4 Holiday Push',
    status: 'Draft',
    startDate: '2023-11-01',
    endDate: '2023-12-25',
    budget: 10000,
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    creatives: [],
  },
];

// --- UI PRIMITIVE COMPONENTS (based on shadcn/ui style) ---

const Card: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: FC<PropsWithChildren<{ title: string; description?: string }>> = ({ title, description }) => (
  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
  </div>
);

const CardContent: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button: FC<PropsWithChildren<{ onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; className?: string, disabled?: boolean }>> = ({ children, onClick, variant = 'primary', size = 'md', className, disabled=false }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-indigo-500";
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-5 py-3 text-lg' : 'px-4 py-2 text-base';
  const variantClasses =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed'
      : variant === 'secondary'
      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700';
  
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
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          {tab}
        </button>
      ))}
    </nav>
  </div>
);

const Badge: FC<PropsWithChildren<{ color: string }>> = ({ children, color }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
    {children}
  </span>
);

const getStatusBadgeColor = (status: CampaignStatus) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'Archived': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
}

// --- SUB-COMPONENTS / VIEWS ---

const DashboardView: FC<{ campaigns: Campaign[], onCreate: () => void }> = ({ campaigns, onCreate }) => {
    const summary = useMemo(() => {
        return campaigns.reduce((acc, c) => ({
            totalSpend: acc.totalSpend + c.spend,
            totalImpressions: acc.totalImpressions + c.impressions,
            totalClicks: acc.totalClicks + c.clicks,
            totalConversions: acc.totalConversions + c.conversions,
            activeCampaigns: acc.activeCampaigns + (c.status === 'Active' ? 1 : 0),
        }), { totalSpend: 0, totalImpressions: 0, totalClicks: 0, totalConversions: 0, activeCampaigns: 0 });
    }, [campaigns]);

    const overallCTR = summary.totalImpressions > 0 ? (summary.totalClicks / summary.totalImpressions * 100).toFixed(2) : '0.00';
    const overallCPA = summary.totalConversions > 0 ? (summary.totalSpend / summary.totalConversions).toFixed(2) : '0.00';

    const kpiCards = [
        { title: 'Total Spend', value: `$${summary.totalSpend.toLocaleString()}`, icon: DollarSign },
        { title: 'Impressions', value: summary.totalImpressions.toLocaleString(), icon: Eye },
        { title: 'Total Clicks', value: summary.totalClicks.toLocaleString(), icon: BarChart2 },
        { title: 'Avg. CTR', value: `${overallCTR}%`, icon: Zap },
        { title: 'Conversions', value: summary.totalConversions.toLocaleString(), icon: CheckCircle },
        { title: 'Avg. CPA', value: `$${overallCPA}`, icon: Target },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <Button onClick={onCreate}>
                    <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {kpiCards.map(card => (
                    <Card key={card.title}>
                        <CardContent className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-4">
                                <card.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader title="Campaign Performance Overview" description="Spend vs. Conversions over the last 30 days" />
                <CardContent>
                    <div className="h-80 bg-gray-50 dark:bg-gray-900 flex items-center justify-center rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">[Chart Placeholder]</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const CampaignListView: FC<{ campaigns: Campaign[], onCreate: () => void, onViewDetails: (id: string) => void }> = ({ campaigns, onCreate, onViewDetails }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Campaigns</h2>
            <Button onClick={onCreate}>
                <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
            </Button>
        </div>
        <Card>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {['Campaign', 'Status', 'Spend / Budget', 'Impressions', 'Clicks', 'CTR', 'Actions'].map(header => (
                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {campaigns.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{c.startDate} to {c.endDate}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge color={getStatusBadgeColor(c.status)}>{c.status}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                ${c.spend.toLocaleString()} / <span className="text-gray-400 dark:text-gray-500">${c.budget.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.impressions.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{c.clicks.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {c.impressions > 0 ? `${(c.clicks / c.impressions * 100).toFixed(2)}%` : '0.00%'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button onClick={() => onViewDetails(c.id)} variant="ghost" size="sm" className="mr-2">View</Button>
                                {c.status === 'Active' && <Button variant="ghost" size="sm"><PauseCircle className="h-4 w-4" /></Button>}
                                {c.status === 'Paused' && <Button variant="ghost" size="sm"><PlayCircle className="h-4 w-4" /></Button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </Card>
    </div>
);

const CreateCampaignWizard: FC<{ onCancel: () => void }> = ({ onCancel }) => {
    const [step, setStep] = useState(1);
    const [campaignGoal, setCampaignGoal] = useState<CampaignGoal | ''>('');
    const [audienceDescription, setAudienceDescription] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCreatives, setGeneratedCreatives] = useState<{ headlines: string[], bodies: string[], images: string[] }>({ headlines: [], bodies: [], images: [] });
    
    const goals: CampaignGoal[] = ['Brand Awareness', 'Website Traffic', 'Lead Generation', 'Sales', 'App Installs'];
    const goalIcons: Record<CampaignGoal, React.ElementType> = {
        'Brand Awareness': Eye, 'Website Traffic': BarChart2, 'Lead Generation': Target, 'Sales': DollarSign, 'App Installs': PlusCircle
    };

    const handleGenerateCreatives = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedCreatives({
                headlines: [
                    "Unlock Your Creative Potential",
                    "The Ultimate Tool for Creators",
                    "Effortless Content Creation is Here",
                ],
                bodies: [
                    "Stop wrestling with complicated software. Our new product helps you focus on what you do best: creating.",
                    "Join thousands of creators who have supercharged their workflow. Get started for free today!",
                    "From idea to published content in minutes. Experience the magic of AI-powered creation tools."
                ],
                images: [
                    "A vibrant, abstract image representing creativity and technology.",
                    "A clean, minimalist workspace with a laptop showing the product's UI.",
                    "A diverse group of happy creators collaborating on a project."
                ]
            });
            setIsGenerating(false);
        }, 1500);
    };

    const renderStep = () => {
        switch(step) {
            case 1: // Goal
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1 dark:text-white">What's your main goal?</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">The AI will optimize your campaign for this objective.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {goals.map(goal => {
                                const Icon = goalIcons[goal];
                                return (
                                <button key={goal} onClick={() => setCampaignGoal(goal)} className={`p-4 border-2 rounded-lg text-center transition-colors ${campaignGoal === goal ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                                    <Icon className="h-8 w-8 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{goal}</span>
                                </button>
                                )
                            })}
                        </div>
                    </div>
                );
            case 2: // Audience
                 return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1 dark:text-white">Who do you want to reach?</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Describe your ideal audience, and our AI will build a targeting profile.</p>
                         <textarea 
                            value={audienceDescription}
                            onChange={(e) => setAudienceDescription(e.target.value)}
                            rows={5}
                            placeholder="e.g., 'Young tech enthusiasts in North America who follow gaming creators and are interested in productivity software.'"
                            className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                        />
                    </div>
                );
            case 3: // AI Creative Studio
                 return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1 dark:text-white">AI Creative Studio</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Describe your product or service, and let the AI generate ad creatives.</p>
                        <textarea 
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            rows={4}
                            placeholder="e.g., 'An AI-powered video editing tool that automatically creates short clips from long-form content for social media.'"
                            className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                        />
                        <Button onClick={handleGenerateCreatives} disabled={isGenerating || !productDescription} className="mt-4">
                            {isGenerating ? <><Clock className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Creatives</>}
                        </Button>
                        {generatedCreatives.headlines.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <div>
                                    <h4 className="font-semibold dark:text-white">Headlines</h4>
                                    {generatedCreatives.headlines.map((h, i) => <div key={i} className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">{h}</div>)}
                                </div>
                                <div>
                                    <h4 className="font-semibold dark:text-white">Body Text</h4>
                                    {generatedCreatives.bodies.map((b, i) => <div key={i} className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">{b}</div>)}
                                </div>
                                <div>
                                    <h4 className="font-semibold dark:text-white">Image Concepts</h4>
                                    {generatedCreatives.images.map((img, i) => <div key={i} className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">{img}</div>)}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 4: // Budget & Schedule
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-1 dark:text-white">Set your Budget & Schedule</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Control your spending and run dates.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Daily Budget</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input type="number" placeholder="50.00" className="w-full pl-7 pr-12 p-2 border rounded-md bg-transparent dark:border-gray-600"/>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Schedule</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    <input type="date" className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:[color-scheme:dark]"/>
                                    <span>to</span>
                                    <input type="date" className="w-full p-2 border rounded-md bg-transparent dark:border-gray-600 dark:[color-scheme:dark]"/>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    const maxSteps = 4;
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader title="Create a New AI-Powered Campaign" description={`Step ${step} of ${maxSteps}`} />
            <CardContent>
                <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(step / maxSteps) * 100}%` }}></div>
                    </div>
                </div>
                {renderStep()}
            </CardContent>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div>
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    {step > 1 && <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="ml-2">Back</Button>}
                </div>
                <div>
                    {step < maxSteps && <Button onClick={() => setStep(s => s + 1)}>Next</Button>}
                    {step === maxSteps && <Button>Launch Campaign</Button>}
                </div>
            </div>
        </Card>
    )
};

const CampaignDetailsView: FC<{ campaign: Campaign, onBack: () => void }> = ({ campaign, onBack }) => {
    return (
        <div className="space-y-6">
            <Button onClick={onBack} variant="secondary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Campaigns
            </Button>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{campaign.name}</h2>
                    <div className="flex items-center space-x-4 mt-2">
                        <Badge color={getStatusBadgeColor(campaign.status)}>{campaign.status}</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{campaign.startDate} to {campaign.endDate}</span>
                    </div>
                </div>
                 <Button variant="secondary">
                    <Edit className="mr-2 h-4 w-4" /> Edit Campaign
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Spend / Budget', value: `$${campaign.spend.toLocaleString()} / $${campaign.budget.toLocaleString()}`},
                    { label: 'Impressions', value: campaign.impressions.toLocaleString()},
                    { label: 'Clicks', value: campaign.clicks.toLocaleString()},
                    { label: 'Conversions', value: campaign.conversions.toLocaleString()}
                ].map(metric => (
                    <Card key={metric.label}>
                        <CardContent>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader title="Performance Creatives" />
                    <CardContent>
                        <div className="space-y-4">
                        {campaign.creatives.map(ad => (
                            <div key={ad.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                                <img src={ad.imageUrl} alt={ad.headline} className="w-24 h-24 object-cover rounded-md"/>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">{ad.headline}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ad.body}</p>
                                    <div className="flex space-x-4 mt-2 text-sm">
                                        <span>CTR: <strong>{ad.ctr}%</strong></span>
                                        <span>CPA: <strong>${ad.cpa.toFixed(2)}</strong></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="AI Recommendations" />
                    <CardContent className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <Bot className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Budget Allocation:</strong> Your video creative has a 15% higher CTR. Consider allocating more budget towards it.
                            </p>
                        </div>
                         <div className="flex items-start space-x-3">
                            <Bot className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Audience Insight:</strong> Engagement is highest on weekends. Try increasing bids on Saturday and Sunday.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

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
        return null;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">AI Ad Campaign Manager</h1>
                <p className="mt-1 text-md text-gray-600 dark:text-gray-400">Leverage AI to create, manage, and optimize your ad campaigns effortlessly.</p>
            </header>
            
            <div className="mb-6">
                <Tabs tabs={['Dashboard', 'Campaigns', 'Analytics', 'Settings']} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default AIAdCampaignManager;