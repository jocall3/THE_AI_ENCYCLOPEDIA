import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Leaf, Zap, Globe, DollarSign, Target } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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


// --- Main Component ---

export const CarbonFootprintOptimizer: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [loading, setLoading] = useState(true);
  const [offsetTons, setOffsetTons] = useState(0);
  const [offsetCost, setOffsetCost] = useState(0);

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

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <Zap className="w-6 h-6 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Calculating carbon footprint...</p>
      </Card>
    );
  }

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
                <Zap className="w-5 h-5 mr-2 text-blue-500" />
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
};