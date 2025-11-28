import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, DollarSign, Target, Zap, TrendingUp, Briefcase } from 'lucide-react';

// --- Mock Data Structure (Simulating the 100 integrated companies) ---

interface Startup {
  id: number;
  name: string;
  sector: string;
  valuation: number; // in millions USD
  fundraisingGoal: number; // in millions USD
  amountRaised: number; // in millions USD
  investors: number;
  description: string;
  growthRate: number; // percentage
  stage: 'Seed' | 'Series A' | 'Growth';
}

const generateMockStartups = (count: number): Startup[] => {
  const sectors = ['Fintech', 'HealthTech', 'AgriTech', 'EdTech', 'Clean Energy', 'AI/ML', 'Logistics'];
  const stages = ['Seed', 'Series A', 'Growth'];

  return Array.from({ length: count }, (_, i) => {
    const valuation = Math.floor(Math.random() * 900) + 10; // 10M to 1000M
    const goal = Math.floor(valuation * 0.1) + 1; // 1M to 100M
    const raised = Math.floor(Math.random() * goal * 0.95) + 0.1;

    return {
      id: i + 1,
      name: `Prosperity Corp ${i + 1}`,
      sector: sectors[i % sectors.length],
      valuation: parseFloat(valuation.toFixed(2)),
      fundraisingGoal: parseFloat(goal.toFixed(2)),
      amountRaised: parseFloat(raised.toFixed(2)),
      investors: Math.floor(Math.random() * 500) + 10,
      description: `Disrupting the ${sectors[i % sectors.length]} market with proprietary, cost-free technology leveraging the Balcony of Prosperity ecosystem.`,
      growthRate: parseFloat((Math.random() * 50 + 10).toFixed(1)),
      stage: stages[i % stages.length] as 'Seed' | 'Series A' | 'Growth',
    };
  });
};

const MOCK_STARTUPS = generateMockStartups(100);

// --- Component Definitions ---

const InvestmentCard: React.FC<{ startup: Startup; onInvest: (id: number) => void }> = ({ startup, onInvest }) => {
  const progressValue = useMemo(() => (startup.amountRaised / startup.fundraisingGoal) * 100, [startup]);
  const formattedValuation = `$${startup.valuation.toLocaleString(undefined, { maximumFractionDigits: 0 })}M`;
  const formattedGoal = `$${startup.fundraisingGoal.toFixed(1)}M`;

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-emerald-500">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary" />
            {startup.name}
          </CardTitle>
          <Badge variant="secondary" className={`capitalize text-xs font-medium ${
            startup.stage === 'Seed' ? 'bg-blue-100 text-blue-800' :
            startup.stage === 'Series A' ? 'bg-yellow-100 text-yellow-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {startup.stage}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{startup.description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
          <div className="flex items-center text-gray-600">
            <Zap className="w-4 h-4 mr-2 text-orange-500" />
            <span className="font-semibold">{startup.sector}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
            Growth Rate: <span className="font-semibold ml-1">{startup.growthRate}%</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
            Valuation: <span className="font-semibold ml-1">{formattedValuation}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Target className="w-4 h-4 mr-2 text-red-500" />
            Goal: <span className="font-semibold ml-1">{formattedGoal}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Raised: <span className="font-bold text-emerald-600">${startup.amountRaised.toFixed(1)}M</span></span>
            <span>{Math.round(progressValue)}% Funded</span>
          </div>
          <Progress value={progressValue} className="h-2 bg-gray-200" indicatorClassName="bg-emerald-500" />
        </div>

        <Button
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
          onClick={() => onInvest(startup.id)}
        >
          Invest Now
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

const VentureCapitalDesk: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  const sectors = useMemo(() => ['All', ...Array.from(new Set(MOCK_STARTUPS.map(s => s.sector)))], []);
  const stages = useMemo(() => ['All', 'Seed', 'Series A', 'Growth'], []);

  const filteredStartups = useMemo(() => {
    return MOCK_STARTUPS.filter(startup => {
      const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            startup.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'All' || startup.sector === selectedSector;
      const matchesStage = selectedStage === 'All' || startup.stage === selectedStage;

      return matchesSearch && matchesSector && matchesStage;
    }).sort((a, b) => b.valuation - a.valuation); // Sort by valuation descending
  }, [searchTerm, selectedSector, selectedStage]);

  const handleInvest = useCallback((id: number) => {
    // In a real application, this would open a modal for investment details and transaction
    const startup = MOCK_STARTUPS.find(s => s.id === id);
    if (startup) {
      alert(`Initiating investment process for ${startup.name}. Welcome to the Balcony of Prosperity!`);
    }
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="mb-6 shadow-md border-t-4 border-blue-600">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-gray-800 flex items-center">
            <DollarSign className="w-7 h-7 mr-3 text-blue-600" />
            Venture Capital Desk (Prosperity Fund)
          </CardTitle>
          <p className="text-md text-gray-600 mt-1">
            Browse and invest in curated, high-growth startups within the 
            100 integrated, cost-free companies ecosystem.
          </p>
        </CardHeader>
      </Card>

      {/* Filtering and Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="col-span-1 md:col-span-2">
          <Input
            placeholder="Search by company name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="col-span-1">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector === 'All' ? 'All Sectors' : sector}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          >
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage === 'All' ? 'All Stages' : stage}</option>
            ))}
          </select>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Startup Listing */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Opportunities ({filteredStartups.length})
      </h2>

      {filteredStartups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStartups.map(startup => (
            <InvestmentCard key={startup.id} startup={startup} onInvest={handleInvest} />
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center border-dashed">
          <p className="text-xl text-gray-500">No startups match your current criteria.</p>
          <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedSector('All'); setSelectedStage('All'); }} className="mt-2">
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default VentureCapitalDesk;