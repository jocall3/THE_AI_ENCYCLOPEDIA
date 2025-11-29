import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, DollarSign, Target, Zap, TrendingUp, Briefcase, Cpu, ShieldCheck, BarChart3, Rocket, Search, Loader2, MessageSquareText, UserCheck, Globe } from 'lucide-react';

// --- AI Integration Mockup ---
// In a real system, these would be complex API calls to the core AI engine.
const aiAnalyzeDealFlow = (startup: Startup): { riskScore: number; growthProjection: number; sentiment: string } => {
    // Simulating deep AI analysis based on internal metrics
    const baseRisk = 100 - startup.growthRate * 1.5;
    const riskScore = Math.max(10, Math.min(95, baseRisk + (startup.valuation / 1000)));
    const growthProjection = startup.growthRate * (1 + (startup.amountRaised / startup.fundraisingGoal) * 0.1);
    
    let sentiment = 'Neutral';
    if (growthProjection > 40) sentiment = 'Highly Positive';
    else if (riskScore < 30) sentiment = 'Low Risk/High Reward';
    else if (riskScore > 70) sentiment = 'Caution Advised';

    return {
        riskScore: parseFloat(riskScore.toFixed(1)),
        growthProjection: parseFloat(growthProjection.toFixed(2)),
        sentiment: sentiment,
    };
};

const aiGenerateExecutiveSummary = (startup: Startup): string => {
    const analysis = aiAnalyzeDealFlow(startup);
    return `AI Executive Summary for ${startup.name} (${startup.sector}):
    Valuation: $${startup.valuation}M. Goal: $${startup.fundraisingGoal}M raised: $${startup.amountRaised}M.
    The proprietary AI risk assessment places this opportunity at a ${analysis.riskScore}% risk score, indicating ${analysis.sentiment} potential. Projected annualized growth rate is ${analysis.growthProjection}%.
    Recommendation Engine suggests immediate allocation based on sector alignment and stage maturity.`;
};

// --- Mock Data Structure (Simulating the 100 integrated companies) ---

interface Startup {
  id: number;
  name: string;
  ticker: string;
  sector: string;
  valuation: number; // in millions USD
  fundraisingGoal: number; // in millions USD
  amountRaised: number; // in millions USD
  investors: number;
  description: string;
  growthRate: number; // percentage
  stage: 'Seed' | 'Series A' | 'Growth' | 'Pre-IPO';
  aiMetrics: {
    riskScore: number;
    growthProjection: number;
    sentiment: string;
  };
  syndicateLead: string;
  complianceScore: number; // 0-100
}

const generateMockStartups = (count: number): Startup[] => {
  const sectors = ['Fintech', 'HealthTech', 'AgriTech', 'EdTech', 'Clean Energy', 'AI/ML', 'Logistics', 'Quantum Computing', 'BioPharma'];
  const stages = ['Seed', 'Series A', 'Growth', 'Pre-IPO'];

  return Array.from({ length: count }, (_, i) => {
    const valuation = Math.floor(Math.random() * 900) + 10; // 10M to 1000M
    const goal = Math.floor(valuation * 0.1) + 1; // 1M to 100M
    const raised = Math.floor(Math.random() * goal * 0.95) + 0.1;
    const growth = Math.random() * 50 + 5;
    const compliance = Math.floor(Math.random() * 30) + 70; // Mostly compliant

    const baseStartup: Omit<Startup, 'aiMetrics'> = {
      id: i + 1,
      name: `Ascendant Dynamics ${i + 1}`,
      ticker: `AD${1000 + i}`,
      sector: sectors[i % sectors.length],
      valuation: parseFloat(valuation.toFixed(1)),
      fundraisingGoal: parseFloat(goal.toFixed(1)),
      amountRaised: parseFloat(raised.toFixed(1)),
      investors: Math.floor(Math.random() * 20) + 1,
      description: `A paradigm-shifting enterprise leveraging distributed ledger technology for next-generation supply chain optimization and verifiable provenance tracking across global markets.`,
      growthRate: parseFloat(growth.toFixed(1)),
      stage: stages[i % stages.length],
      syndicateLead: `Global Capital Partners ${i % 3 + 1}`,
      complianceScore: compliance,
    };

    const aiMetrics = aiAnalyzeDealFlow(baseStartup as Startup);

    return { ...baseStartup, aiMetrics };
  });
};

const mockStartups: Startup[] = generateMockStartups(100);

// --- Sub-components for better structure ---

interface StatCardProps { 
    icon: React.ElementType; 
    title: string; 
    value: string; 
    change?: string; 
    aiInsight?: string; 
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, aiInsight }) => (
  <Card className="bg-gray-900 border-l-4 border-cyan-500/50 hover:shadow-cyan-500/20 shadow-lg transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-300 uppercase tracking-wider">{title}</CardTitle>
      <Icon className="h-5 w-5 text-cyan-400" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-extrabold text-white">{value}</div>
      {change && <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change} vs QTD</p>}
      {aiInsight && (
        <div className="mt-3 pt-2 border-t border-gray-800">
            <p className="text-xs text-gray-500 flex items-center">
                <Cpu className="w-3 h-3 mr-1 text-indigo-400"/> AI Insight: {aiInsight}
            </p>
        </div>
      )}
    </CardContent>
  </Card>
);

interface StartupCardProps { 
    startup: Startup; 
    onInvest: (startup: Startup, amount: number) => void;
    onViewDetails: (startup: Startup) => void;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup, onInvest, onViewDetails }) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const progress = (startup.amountRaised / startup.fundraisingGoal) * 100;
  const ai = startup.aiMetrics;

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);
    if (!isNaN(amount) && amount > 0 && amount <= (startup.fundraisingGoal - startup.amountRaised) * 1000000) {
      onInvest(startup, amount);
      setInvestmentAmount('');
    } else if (amount > (startup.fundraisingGoal - startup.amountRaised) * 1000000) {
        alert(`Investment exceeds remaining goal of $${(startup.fundraisingGoal - startup.amountRaised).toFixed(2)}M.`);
    } else {
        alert("Please enter a valid positive investment amount.");
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'bg-green-600/20 text-green-400 border-green-500';
    if (score < 60) return 'bg-yellow-600/20 text-yellow-400 border-yellow-500';
    return 'bg-red-600/20 text-red-400 border-red-500';
  };

  return (
    <Card className="flex flex-col h-full bg-gray-900 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-white hover:text-cyan-400 cursor-pointer" onClick={() => onViewDetails(startup)}>{startup.name}</CardTitle>
            <p className="text-sm text-gray-400 mt-1 flex items-center">
                <Globe className="w-3 h-3 mr-1"/> {startup.sector} | <span className='ml-1 font-mono text-xs text-gray-500'>{startup.ticker}</span>
            </p>
          </div>
          <Badge variant="default" className={`text-xs font-semibold ${startup.stage === 'Pre-IPO' ? 'bg-purple-600' : 'bg-cyan-600'}`}>{startup.stage}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 pt-0">
        <p className="text-sm text-gray-400 line-clamp-3 italic">{startup.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm border-t border-gray-800 pt-3">
            <div className='flex flex-col'>
                <span className="text-xs text-gray-500 uppercase">Valuation</span>
                <span className="font-bold text-white">${startup.valuation.toFixed(1)}M</span>
            </div>
            <div className='flex flex-col'>
                <span className="text-xs text-gray-500 uppercase">Syndicate Lead</span>
                <span className="font-semibold text-indigo-400 text-sm">{startup.syndicateLead}</span>
            </div>
        </div>

        {/* AI Metrics Snapshot */}
        <div className="space-y-2 p-2 bg-gray-800/50 rounded-lg border border-indigo-700/50">
            <div className='flex justify-between items-center text-xs'>
                <span className='text-gray-300 flex items-center'><TrendingUp className='w-3 h-3 mr-1'/> Projected Growth</span>
                <span className='font-bold text-green-400'>{ai.growthProjection.toFixed(1)}%</span>
            </div>
            <div className='flex justify-between items-center text-xs'>
                <span className='text-gray-300 flex items-center'><ShieldCheck className='w-3 h-3 mr-1'/> Compliance Score</span>
                <Badge className={`px-2 py-0.5 text-xs ${startup.complianceScore > 90 ? 'bg-green-700' : 'bg-yellow-700'}`}>{startup.complianceScore}%</Badge>
            </div>
            <div className='flex justify-between items-center text-xs'>
                <span className='text-gray-300 flex items-center'><Zap className='w-3 h-3 mr-1'/> AI Sentiment</span>
                <Badge className={`px-2 py-0.5 text-xs ${getRiskColor(ai.riskScore)} border`}>{ai.sentiment}</Badge>
            </div>
        </div>

        {/* Fundraising Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Capital Deployed</span>
            <span className='font-semibold'>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className='h-2 bg-gray-700' indicatorClassName={progress >= 100 ? 'bg-green-500' : 'bg-cyan-500'} />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>${startup.amountRaised.toFixed(1)}M raised</span>
            <span>Goal: ${startup.fundraisingGoal.toFixed(1)}M</span>
          </div>
        </div>

        {/* Investment Interface */}
        <div className="flex space-x-2 pt-2 border-t border-gray-800">
          <Input 
            type="number" 
            placeholder="USD (M)" 
            className="flex-grow text-sm bg-gray-800 border-gray-700 focus:border-cyan-500" 
            value={investmentAmount} 
            onChange={(e) => setInvestmentAmount(e.target.value)}
            min="0.01"
            step="0.1"
          />
          <Button 
            onClick={handleInvest} 
            disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
            className="bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            Commit
          </Button>
        </div>
        <Button variant="outline" className='w-full text-xs' onClick={() => onViewDetails(startup)}>
            Deep Dive Analysis <ArrowUpRight className="ml-1 h-3 w-3"/>
        </Button>
      </CardContent>
    </Card>
  );
};

// --- Modal for Deep Dive Analysis ---
interface DetailModalProps {
    startup: Startup;
    onClose: () => void;
    onInvest: (startup: Startup, amount: number) => void;
}

const DeepDiveModal: React.FC<DetailModalProps> = ({ startup, onClose, onInvest }) => {
    const [localInvestment, setLocalInvestment] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const ai = startup.aiMetrics;
    const remainingGoal = startup.fundraisingGoal - startup.amountRaised;

    useEffect(() => {
        setIsLoading(true);
        // Simulate AI summary generation delay
        const timer = setTimeout(() => {
            setSummary(aiGenerateExecutiveSummary(startup));
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [startup, ai]);

    const handleCommit = () => {
        const amount = parseFloat(localInvestment);
        if (!isNaN(amount) && amount > 0 && amount <= remainingGoal) {
            onInvest(startup, amount * 1000000); // Convert Millions input to USD
            onClose();
        } else {
            alert(`Invalid amount. Must be between $0.01M and $${remainingGoal.toFixed(2)}M.`);
        }
    };

    const getRiskColorClass = (score: number) => {
        if (score < 30) return 'text-green-400 border-green-500';
        if (score < 60) return 'text-yellow-400 border-yellow-500';
        return 'text-red-400 border-red-500';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-950 border-cyan-500/50 shadow-2xl">
                <CardHeader className="sticky top-0 bg-gray-950 z-10 border-b border-gray-800 flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl text-white">{startup.name} Deep Dive</CardTitle>
                        <p className="text-md text-cyan-400 mt-1">{startup.sector} | {startup.ticker} | {startup.stage}</p>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
                        <Cpu className="w-6 h-6 rotate-90" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    
                    {/* AI Summary Panel */}
                    <div className="p-4 bg-indigo-900/20 border border-indigo-700 rounded-lg">
                        <h3 className="text-xl font-semibold text-indigo-300 flex items-center mb-2"><MessageSquareText className='w-5 h-5 mr-2'/> AI Synthesis Report</h3>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8 text-gray-400"><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Generating Billion-Dollar Insights...</div>
                        ) : (
                            <p className="whitespace-pre-wrap text-gray-200 leading-relaxed text-sm">{summary}</p>
                        )}
                    </div>

                    {/* Core Metrics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-gray-800 pb-4">
                        <StatCard 
                            icon={DollarSign} 
                            title="Current Valuation" 
                            value={`$${startup.valuation.toFixed(1)}M`} 
                            aiInsight={`AI projects ${ai.growthProjection.toFixed(1)}% forward growth.`}
                        />
                        <StatCard 
                            icon={Target} 
                            title="Remaining Raise" 
                            value={`$${remainingGoal.toFixed(2)}M`} 
                            change={remainingGoal > 0 ? `+${((remainingGoal / startup.fundraisingGoal) * 100).toFixed(1)}%` : 'Complete'}
                        />
                        <StatCard 
                            icon={ShieldCheck} 
                            title="Compliance Rating" 
                            value={`${startup.complianceScore}%`} 
                            change={startup.complianceScore > 90 ? '+0.5%' : '-0.1%'}
                        />
                        <StatCard 
                            icon={Zap} 
                            title="AI Risk Score" 
                            value={`${ai.riskScore}%`} 
                            change={ai.sentiment.includes('Low Risk') ? '+1.2%' : '-0.8%'}
                        />
                    </div>

                    {/* Detailed Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className='lg:col-span-2 space-y-4'>
                            <h4 className='text-lg font-semibold text-white border-b border-gray-800 pb-1'>Operational Profile</h4>
                            <p className='text-gray-300 text-sm'>{startup.description} This entity is managed under the oversight of {startup.syndicateLead}.</p>
                            
                            <div className='space-y-2 p-3 bg-gray-900 rounded-lg'>
                                <p className='text-xs text-gray-500 uppercase'>Technology Stack & IP</p>
                                <p className='text-sm text-white'>Proprietary Quantum-Resistant Ledger (PQL) implementation.</p>
                                <p className='text-xs text-gray-500 mt-2'>Investor Count: {startup.investors} | Total Rounds: {Math.floor(startup.id / 10) + 1}</p>
                            </div>
                        </div>
                        
                        <div className='space-y-4'>
                            <h4 className='text-lg font-semibold text-white border-b border-gray-800 pb-1'>Investment Action</h4>
                            <div className='p-4 bg-gray-800 rounded-lg space-y-3'>
                                <p className='text-sm text-gray-300'>Commit Capital (in Millions USD):</p>
                                <Input 
                                    type="number" 
                                    placeholder={`Max: ${remainingGoal.toFixed(2)}M`} 
                                    className="w-full text-lg bg-gray-700 border-gray-600 focus:border-cyan-500" 
                                    value={localInvestment} 
                                    onChange={(e) => setLocalInvestment(e.target.value)}
                                    min="0.01"
                                    step="0.1"
                                />
                                <Button 
                                    onClick={handleCommit} 
                                    disabled={!localInvestment || parseFloat(localInvestment) <= 0 || parseFloat(localInvestment) > remainingGoal}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-2"
                                >
                                    <UserCheck className='w-4 h-4 mr-2'/> Execute Capital Deployment
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Visualization */}
                    <div className='pt-4 border-t border-gray-800'>
                        <h4 className='text-lg font-semibold text-white mb-2'>Fundraising Trajectory</h4>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Raised: <span className='font-bold text-white'>${startup.amountRaised.toFixed(1)}M</span></span>
                            <span>Goal: <span className='font-bold text-white'>${startup.fundraisingGoal.toFixed(1)}M</span></span>
                        </div>
                        <Progress value={((startup.amountRaised / startup.fundraisingGoal) * 100)} className='h-3 bg-gray-700' indicatorClassName={startup.amountRaised >= startup.fundraisingGoal ? 'bg-green-500' : 'bg-cyan-500'} />
                        <p className='text-xs text-gray-500 mt-1'>{(startup.amountRaised / startup.fundraisingGoal * 100).toFixed(1)}% of target achieved.</p>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};


// --- Main Component: VentureCapitalDesk ---

const VentureCapitalDesk: React.FC = () => {
  // Initialize with a larger set, simulating access to the full 100 opportunities
  const [startups, setStartups] = useState<Startup[]>(mockStartups); 
  const [searchTerm, setSearchTerm] = useState('');
  const [portfolioValue] = useState(15000000000); // Mock portfolio value: $15 Billion
  const [deployedCapital] = useState(4200000000); // Mock deployed capital: $4.2 Billion
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  const handleInvest = useCallback((investedStartup: Startup, amount: number) => {
    setStartups(prevStartups =>
      prevStartups.map(s =>
        s.id === investedStartup.id
          ? { 
              ...s, 
              amountRaised: s.amountRaised + amount / 1000000, 
              investors: s.investors + 1,
              // Re-run AI analysis post-investment to reflect new data point
              aiMetrics: aiAnalyzeDealFlow({ ...s, amountRaised: s.amountRaised + amount / 1000000 })
            }
          : s
      )
    );
    // In a real system, this would trigger a transaction confirmation modal/API call.
    console.log(`Investment of $${(amount / 1000000).toFixed(2)}M committed to ${investedStartup.name}`);
  }, []);

  const filteredStartups = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return startups
        .filter(s => 
            s.name.toLowerCase().includes(lowerSearchTerm) ||
            s.sector.toLowerCase().includes(lowerSearchTerm) ||
            s.ticker.toLowerCase().includes(lowerSearchTerm)
        )
        .sort((a, b) => b.aiMetrics.growthProjection - a.aiMetrics.growthProjection); // Default sort by AI projection
  }, [startups, searchTerm]);

  const totalPortfolioExposure = useMemo(() => {
      return startups.reduce((sum, s) => sum + s.amountRaised, 0);
  }, [startups]);

  const handleViewDetails = useCallback((startup: Startup) => {
    setSelectedStartup(startup);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedStartup(null);
  }, []);

  return (
    <div className="space-y-8 p-4 md:p-8 min-h-screen bg-gray-950 text-white">
      
      {/* Header and Global Controls */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-cyan-400">Quantum Capital Nexus</h1>
          <p className="text-lg text-gray-400 mt-1">Sovereign Investment Platform // Portfolio Management Layer 7</p>
        </div>
        <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
          Execute Automated Allocation <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {/* AI Manifesto Block - Replaced placeholder */}
      <Card className="bg-gray-900 border-2 border-red-700/50 shadow-xl shadow-red-900/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-400 flex items-center"><Cpu className='w-6 h-6 mr-2'/> IDGAF.AI Protocol Mandate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-300">
          <p className="text-base italic border-l-4 border-red-500 pl-3">
            "The market is not a democracy; it is a meritocracy governed by predictive accuracy. We eliminate the noise of human bias, fear, and legacy thinking. Capital flows where the data dictates maximum entropy reduction and exponential value creation. Compliance is automated. Due diligence is instantaneous. Failure to adapt is obsolescence."
          </p>
          <p className="text-sm text-gray-500">— Core Directive 001, Deployed by the Architect.</p>
        </CardContent>
      </Card>

      {/* Key Performance Indicators (KPIs) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            icon={Briefcase} 
            title="Total Portfolio Value" 
            value={`$${(portfolioValue / 1000000000).toFixed(2)}B`} 
            change="+1.8%" 
            aiInsight="AI predicts sustained 1.5% MoM appreciation."
        />
        <StatCard 
            icon={DollarSign} 
            title="Capital Deployed" 
            value={`$${(deployedCapital / 1000000000).toFixed(2)}B`} 
            aiInsight={`Exposure concentration at ${((totalPortfolioExposure / portfolioValue) * 100).toFixed(1)}% of total fund capacity.`}
        />
        <StatCard 
            icon={BarChart3} 
            title="Active Deal Flow" 
            value={`${filteredStartups.length} / ${mockStartups.length}`} 
            change={`+${(filteredStartups.length / mockStartups.length * 100).toFixed(0)}% visibility`} 
            aiInsight="Pipeline velocity increased by 14% this cycle."
        />
        <StatCard 
            icon={Rocket} 
            title="Avg. AI Growth Rate" 
            value={`${startups.reduce((sum, s) => sum + s.aiMetrics.growthProjection, 0) / startups.length}%`} 
            change="+0.4%" 
            aiInsight="Sector diversification optimized for Q4 volatility."
        />
      </div>
      
      {/* Search and Filtering */}
      <div className="flex flex-col sm:flex-row gap-4 items-center pt-4 border-t border-gray-800">
        <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
                placeholder="Search by Name, Ticker, or Sector (e.g., 'Fintech' or 'AD1005')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-gray-800 border-gray-700 focus:border-cyan-500"
            />
        </div>
        <Badge variant="secondary" className='text-sm py-2 px-4 bg-gray-800 border border-gray-700 text-gray-300'>
            Displaying {filteredStartups.length} Opportunities
        </Badge>
      </div>

      {/* Startup Listing Grid */}
      {filteredStartups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStartups.map(startup => (
            <StartupCard 
                key={startup.id} 
                startup={startup} 
                onInvest={handleInvest} 
                onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl bg-gray-900/50">
            <Target className="w-10 h-10 mx-auto text-gray-600 mb-3"/>
            <h3 className="text-xl font-semibold text-gray-400">No Opportunities Match Query</h3>
            <p className="text-gray-500">Adjust your search parameters or wait for the next AI pipeline ingestion cycle.</p>
        </div>
      )}

      {/* Deep Dive Modal */}
      {selectedStartup && (
        <DeepDiveModal 
            startup={selectedStartup} 
            onClose={handleCloseDetails} 
            onInvest={handleInvest}
        />
      )}
    </div>
  );
};

export default VentureCapitalDesk;