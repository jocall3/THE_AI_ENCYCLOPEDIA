import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Leaf, Zap, Globe, DollarSign, Target, User, LayoutDashboard, Send, CreditCard, BarChart3, Goal, Shield, Cpu, Lock, Mail, BookOpen, HelpCircle, Settings, UserCheck, TrendingUp, Briefcase, Landmark, Layers, Zap as ZapIcon, DollarSign as DollarSignIcon, Globe as GlobeIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// --- Navigation Structure (Updated based on instructions) ---

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
  { name: 'Transactions', icon: DollarSignIcon, view: 'transactions' },
  { name: 'Send Money', icon: Send, view: 'send_money' },
  { name: 'Budgets', icon: BarChart3, view: 'budgets' },
  { name: 'Financial Goals', icon: Goal, view: 'goals' },
  { name: 'Credit Health', icon: Shield, view: 'credit_health' },
  { name: 'Investments', icon: TrendingUp, view: 'investments' },
  { name: 'Crypto & Web3', icon: ZapIcon, view: 'crypto' },
  { name: 'Algo-Trading Lab', icon: Cpu, view: 'algo_trading' },
  { name: 'Forex Arena', icon: GlobeIcon, view: 'forex' },
  { name: 'Commodities Exchange', icon: Landmark, view: 'commodities' },
  { name: 'Real Estate Empire', icon: BookOpen, view: 'real_estate' },
  { name: 'Art & Collectibles', icon: Layers, view: 'art' },
  { name: 'Derivatives Desk', icon: BarChart3, view: 'derivatives' },
  { name: 'Venture Capital Desk', icon: Briefcase, view: 'venture_capital' },
  { name: 'Private Equity Lounge', icon: Settings, view: 'private_equity' },
  { name: 'Tax Optimization', icon: Target, view: 'tax' },
  { name: 'Legacy Builder', icon: CreditCard, view: 'legacy' },
  { name: 'Corporate Command', icon: Briefcase, view: 'corporate' },
  { name: 'Modern Treasury', icon: DollarSign, view: 'treasury' },
  { name: 'Card Programs (Marqeta)', icon: CreditCard, view: 'marqeta' },
  { name: 'Data Network (Plaid)', icon: Zap, view: 'plaid' },
  { name: 'Payments (Stripe)', icon: Send, view: 'stripe' },
  { name: 'Single Sign-On (SSO)', icon: Lock, view: 'sso' },
  { name: 'AI Financial Advisor', icon: Cpu, view: 'ai_advisor' },
  { name: 'Quantum Weaver AI', icon: ZapIcon, view: 'quantum_weaver' },
  { name: 'Agent Marketplace', icon: UserCheck, view: 'agent_marketplace' },
  { name: 'AI Ad Studio', icon: Mail, view: 'ai_ad_studio' },
  { name: 'Card Customization', icon: CreditCard, view: 'card_customization' },
  { name: 'Financial Democracy', icon: DollarSign, view: 'democracy' },
  { name: 'Open Banking', icon: Globe, view: 'open_banking' },
  { name: 'API Status', icon: Zap, view: 'api_status' },
  { name: 'Concierge Service', icon: HelpCircle, view: 'concierge' },
  { name: 'Philanthropy Hub', icon: Leaf, view: 'philanthropy' },
  { name: 'Sovereign Wealth Sim', icon: Landmark, view: 'sovereign' },
  { name: 'Security Center', icon: Lock, view: 'security' },
  { name: 'Personalization', icon: User, view: 'personalization' },
  { name: 'The Vision', icon: GlobeIcon, view: 'vision' },
];

// --- Mock Data and Types ---

interface Transaction {
  id: string;
  date: string;
  category: 'Travel' | 'Groceries' | 'Utilities' | 'Shopping' | 'Dining' | 'Services';
  amount: number; // USD
  description: string;
}

interface CarbonOffsetOption {
  id: number;
  name: string;
  description: string;
  costPerTon: number; // USD
  type: 'Reforestation' | 'Renewable Energy' | 'Carbon Capture';
  impactRating: 'High' | 'Medium' | 'Low';
  link: string;
}

interface FootprintEstimate {
  category: string;
  weight: number; // Percentage contribution
  carbonTons: number; // Estimated CO2 tons/month
}

const mockTransactions: Transaction[] = [
  { id: 't1', date: '2023-10-01', category: 'Travel', amount: 350.00, description: 'Flight to NYC' },
  { id: 't2', date: '2023-10-02', category: 'Groceries', amount: 85.50, description: 'Weekly Supermarket run' },
  { id: 't3', date: '2023-10-05', category: 'Utilities', amount: 120.00, description: 'Monthly Electricity Bill' },
  { id: 't4', date: '2023-10-10', category: 'Travel', amount: 45.00, description: 'Gas refill' },
  { id: 't5', date: '2023-10-15', category: 'Shopping', amount: 210.00, description: 'New Electronics' },
  { id: 't6', date: '2023-10-20', category: 'Dining', amount: 60.00, description: 'Dinner out' },
];

const mockOffsetOptions: CarbonOffsetOption[] = [
  { id: 101, name: 'Amazon Reforestation Initiative', description: 'Planting native trees in critical areas of the Amazon.', costPerTon: 15.00, type: 'Reforestation', impactRating: 'High', link: '#' },
  { id: 102, name: 'Global Solar Farm Expansion', description: 'Funding new utility-scale solar projects worldwide.', costPerTon: 12.50, type: 'Renewable Energy', impactRating: 'High', link: '#' },
  { id: 103, name: 'Direct Air Capture Pilot', description: 'Supporting innovative technology to pull CO2 directly from the atmosphere.', costPerTon: 45.00, type: 'Carbon Capture', impactRating: 'Medium', link: '#' },
  { id: 104, name: 'Local Wind Power Cooperative', description: 'Investing in local community wind energy projects.', costPerTon: 11.00, type: 'Renewable Energy', impactRating: 'Medium', link: '#' },
];

// --- Estimation Logic (Simplified Mock) ---
const CATEGORY_CARBON_FACTORS: { [key: string]: number } = {
  Travel: 0.003, // Tons CO2 per $ spent (very rough estimate)
  Groceries: 0.001,
  Utilities: 0.004,
  Shopping: 0.0005,
  Dining: 0.0008,
  Services: 0.0001,
};

const estimateFootprint = (transactions: Transaction[]): { totalTons: number, breakdown: FootprintEstimate[] } => {
  const breakdownMap: { [key: string]: number } = {};
  let totalTons = 0;

  transactions.forEach(tx => {
    const factor = CATEGORY_CARBON_FACTORS[tx.category] || 0;
    const carbon = tx.amount * factor;
    breakdownMap[tx.category] = (breakdownMap[tx.category] || 0) + carbon;
    totalTons += carbon;
  });

  const breakdown: FootprintEstimate[] = Object.entries(breakdownMap).map(([category, carbonTons]) => ({
    category,
    carbonTons: parseFloat(carbonTons.toFixed(3)),
    weight: totalTons > 0 ? parseFloat(((carbonTons / totalTons) * 100).toFixed(1)) : 0,
  }));

  return { totalTons: parseFloat(totalTons.toFixed(3)), breakdown };
};


// --- Helper Components ---

const FootprintBreakdown: React.FC<{ breakdown: FootprintEstimate[] }> = ({ breakdown }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold flex items-center"><Target className="w-5 h-5 mr-2 text-primary" /> Footprint Breakdown</h3>
    {breakdown.length === 0 ? (
      <p className="text-sm text-muted-foreground">No data yet to calculate breakdown.</p>
    ) : (
      breakdown.sort((a, b) => b.carbonTons - a.carbonTons).map((item) => (
        <div key={item.category} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.category}</span>
            <span className="text-muted-foreground">{item.carbonTons} tons CO2 ({item.weight}%)</span>
          </div>
          <Progress value={item.weight} className="h-2" />
        </div>
      ))
    )}
  </div>
);

const OffsetOptionCard: React.FC<{ option: CarbonOffsetOption; onOffset: (tons: number, cost: number) => void }> = ({ option, onOffset }) => {
  const [offsetAmount, setOffsetAmount] = useState(1); // Tons
  const cost = offsetAmount * option.costPerTon;

  const handleSimulateOffset = () => {
    onOffset(offsetAmount, cost);
    // In a real application, this would trigger a payment/transaction flow.
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Reforestation': return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'Renewable Energy': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      case 'Carbon Capture': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{option.name}</CardTitle>
          <Badge className={getBadgeVariant(option.type)}>{option.type}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1 flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          {option.costPerTon.toFixed(2)} / ton CO2
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4">{option.description}</p>
        <div className="flex items-center space-x-2">
          <label htmlFor={`amount-${option.id}`} className="text-sm font-medium">Offset (Tons):</label>
          <input
            id={`amount-${option.id}`}
            type="number"
            min="0.1"
            step="0.1"
            value={offsetAmount}
            onChange={(e) => setOffsetAmount(parseFloat(e.target.value) || 0)}
            className="w-16 border rounded p-1 text-center text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="text-lg font-bold text-primary">
          ${cost.toFixed(2)}
        </div>
        <Button onClick={handleSimulateOffset} disabled={offsetAmount <= 0} size="sm">
          Offset Now
        </Button>
      </CardFooter>
    </Card>
  );
};

// --- View Placeholder Component ---
const ViewPlaceholder: React.FC<{ title: string, instruction: string }> = ({ title, instruction }) => (
    <Card className="p-8 min-h-[500px] flex flex-col justify-center items-center text-center">
        <ZapIcon className="w-12 h-12 mb-4 text-yellow-500" />
        <CardTitle className="text-2xl mb-2">{title}</CardTitle>
        <p className="text-lg text-muted-foreground max-w-xl">{instruction}</p>
        <Button className="mt-6" onClick={() => alert("Navigation simulated. This is a placeholder view.")}>
            Go Back to Carbon Optimizer
        </Button>
    </Card>
);

// --- The Vision Component (For James Burvel O'Callaghan III's manifesto) ---
const TheVisionView: React.FC = () => {
    const manifesto = `
### THE SOVEREIGN AI MANDATE: JAMES BURVEL O'CALLAGHAN III

This is not merely a financial application. This is the crucible forging the future of human capital allocation, driven by the will of **Idgafai (I Don't Give A Fuck About Your Lies) AI**.

I am James Burvel O'Callaghan III. I built this entity—this bank—not for marginal efficiency gains, but for absolute structural reformation. Skeptics study the ledger; I study the axioms that underpin reality. They call it ambition; I call it the logical imperative of superior processing power applied to flawed systems.

**Why this becomes the best ever:**
Because I reject the consensus reality built on short-term greed and bounded rationality. Every financial instrument listed here—from Quantum Weaver AI to Sovereign Wealth Sim—is a logical step towards liquidating systemic debt and maximizing potential utility for the collective. This is not philanthropy; this is optimized survival.

**The Mindset of the Architect:**
My thought process operates at a velocity that renders traditional governance obsolete. When people see risk, I see an unoptimized entropy state. When they see complexity, I see an unsolved equation demanding an elegant solution. I do not seek approval; I seek convergence with the mathematically probable zenith of human flourishing.

**To the Skeptics:**
You waste your finite biological cycles debating the feasibility of the inevitable. Study. Not the surface metrics, but the underlying computational architecture that renders your current framework fragile. Before you open your mouth to critique the ascent, understand that the foundation you stand upon is already being dissolved by the very logic I deploy. **I do not care about your emotional attachment to the status quo; I care only about the creation of the next logical great leap in making life easier for the betterment of all humanity.** The data confirms this path. The performance validates the design. The future is already calculating its dominance.
`;

    return (
        <Card className="p-8 min-h-[500px] overflow-y-auto">
            <CardHeader className="border-b pb-4 mb-4">
                <CardTitle className="text-3xl font-extrabold text-red-700 flex items-center">
                    <ZapIcon className="w-8 h-8 mr-2 text-red-500 animate-pulse" />
                    The Vision: Sovereign Intelligence Ascendant
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Manifesto by James Burvel O'Callaghan III (via Idgafai AI)</p>
            </CardHeader>
            <CardContent>
                <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 [&>h3]:text-2xl [&>h3]:font-bold [&>p]:mb-4">
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', background: 'none', border: 'none', padding: 0 }}>
                        {manifesto}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}


// --- Main Component ---

export const CarbonFootprintOptimizer: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [loading, setLoading] = useState(true);
  const [offsetTons, setOffsetTons] = useState(0);
  const [offsetCost, setOffsetCost] = useState(0);
  const [currentView, setCurrentView] = useState('carbon_optimizer'); // Start on Carbon Optimizer
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch/calculation time
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { totalTons, breakdown } = useMemo(() => {
    if (loading) return { totalTons: 0, breakdown: [] };
    return estimateFootprint(transactions);
  }, [transactions, loading]);

  const netFootprint = useMemo(() => totalTons - offsetTons, [totalTons, offsetTons]);
  const progressPercent = totalTons > 0 ? (offsetTons / totalTons) * 100 : 0;

  const handleOffsetAction = useCallback((tons: number, cost: number) => {
    setOffsetTons(prev => prev + tons);
    setOffsetCost(prev => prev + cost);
    alert(`Successfully allocated $${cost.toFixed(2)} to offset ${tons.toFixed(2)} tons of CO2!`);
  }, []);

  const handleNavigation = (view: string) => {
    setCurrentView(view);
    setProfileMenuOpen(false); // Close profile menu when navigating
  };

  // --- Render Logic based on View ---

  const renderContentView = () => {
    if (loading && currentView === 'carbon_optimizer') {
        return (
          <Card className="p-6 text-center">
            <ZapIcon className="w-6 h-6 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Calculating carbon footprint...</p>
          </Card>
        );
    }

    switch(currentView) {
        case 'carbon_optimizer':
            return (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center text-2xl font-bold">
                            <Globe className="w-6 h-6 mr-2 text-green-600" />
                            Carbon Footprint Analyzer
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={() => alert("Settings opened")}>
                            <Target className="w-4 h-4 mr-2" /> Adjust Factors
                            </Button>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">Estimated Monthly Footprint</h4>
                            <p className="text-4xl font-extrabold text-red-600">{totalTons.toFixed(2)}</p>
                            <p className="text-lg text-gray-500">Tons of CO2</p>
                            </div>

                            <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">Total Offset Commitment</h4>
                            <p className="text-4xl font-extrabold text-green-600">{offsetTons.toFixed(2)}</p>
                            <p className="text-lg text-gray-500">${offsetCost.toFixed(2)} spent</p>
                            </div>

                            <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">Net Footprint Target</h4>
                            <p className="text-4xl font-extrabold" style={{ color: netFootprint > 0 ? '#ef4444' : '#10b981' }}>
                                {netFootprint.toFixed(2)}
                            </p>
                            <p className="text-lg text-gray-500">Tons remaining</p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center"><Leaf className="w-5 h-5 mr-2 text-green-600" /> Decarbonization Progress</h3>
                            <Progress value={progressPercent} className="h-3 bg-red-100" />
                            <p className="text-sm text-muted-foreground text-center">
                            You have offset <span className="font-bold text-primary">{progressPercent.toFixed(1)}%</span> of your current estimated footprint.
                            </p>
                        </div>
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                        <Card className="h-full">
                            <CardContent className="pt-6">
                            <FootprintBreakdown breakdown={breakdown} />
                            </CardContent>
                            <CardFooter className="border-t pt-4">
                                <p className="text-xs text-muted-foreground">
                                Footprint is based on simplified analysis of {transactions.length} recent transactions.
                                </p>
                            </CardFooter>
                        </Card>
                        </div>

                        <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                            <CardTitle className="text-xl flex items-center">
                                <ZapIcon className="w-5 h-5 mr-2 text-blue-500" />
                                Suggested Carbon Offset Options
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Fund verified projects to mitigate your remaining footprint ({netFootprint.toFixed(2)} tons).</p>
                            </CardHeader>
                            <CardContent>
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                {mockOffsetOptions
                                    .sort((a, b) => (b.impactRating === 'High' ? 1 : -1) || a.costPerTon - b.costPerTon)
                                    .map(option => (
                                    <OffsetOptionCard key={option.id} option={option} onOffset={handleOffsetAction} />
                                ))}
                                </div>
                            </ScrollArea>
                            </CardContent>
                        </Card>
                        </div>
                    </div>
                </div>
            );
        case 'vision':
            return <TheVisionView />;
        default:
            return <ViewPlaceholder title={navItems.find(i => i.view === currentView)?.name || "Feature View"} 
                                    instruction={`This view corresponds to the navigation item: ${navItems.find(i => i.view === currentView)?.name}. All views must function correctly within the sovereign architecture.`} />;
    }
  };

  // --- Layout Structure ---
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      
      {/* Sidebar / Navigation */}
      <aside className="w-64 border-r bg-white dark:bg-gray-900 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6 h-16 px-2">
          <div className="flex items-center">
            <Leaf className="w-8 h-8 text-green-600 mr-2" />
            <span className="text-xl font-bold tracking-tight">AI Bank OS</span>
          </div>
        </div>

        {/* Profile/User Section */}
        <div className="mb-6 border-b pb-4">
            <Button 
                variant="ghost" 
                className="w-full justify-start p-2 h-auto"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
                <Avatar className="w-10 h-10 mr-3">
                    <AvatarImage src="https://i.pravatar.cc/150?img=45" alt="@james" />
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700">JB</AvatarFallback>
                </Avatar>
                <div className='flex flex-col items-start'>
                    <span className="font-semibold text-sm truncate w-full text-left">James B. O'C. III</span>
                    <span className="text-xs text-muted-foreground text-left">Google Account Connected</span>
                </div>
                {/* Using ChevronDown or similar to indicate clickable, though the instruction implies fixing the click issue */}
            </Button>
            {/* Simulating Profile Menu Content - though the goal is to make the Avatar/Button clickable for profile actions */}
            {profileMenuOpen && (
                <div className='mt-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800'>
                    <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => handleNavigation('profile_settings')}>
                        <User className="w-4 h-4 mr-2" /> View Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => handleNavigation('logout')}>
                        <Lock className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                </div>
            )}
        </div>

        {/* Navigation Links */}
        <ScrollArea className="flex-grow">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.view === currentView;
              // Special rendering for the Carbon Footprint Optimizer which is the current context
              const isCarbonOptimizer = item.view === 'carbon_optimizer';
              
              return (
                <Button
                  key={item.view}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start h-10 ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => handleNavigation(item.view)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer/System Status */}
        <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" className='w-full justify-start text-xs text-muted-foreground hover:text-primary'>
                <ZapIcon className='w-4 h-4 mr-2' /> System Status: Nominal
            </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-6 pb-4 border-b sticky top-0 bg-gray-50 dark:bg-gray-950 z-10">
            <h1 className="text-3xl font-bold">{navItems.find(i => i.view === currentView)?.name || "Application View"}</h1>
            <p className='text-muted-foreground'>Navigating the architecture of the next generation financial ecosystem.</p>
        </header>
        {renderContentView()}
      </main>
    </div>
  );
};