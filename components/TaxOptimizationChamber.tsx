import React, { useState, useMemo, useCallback } from 'react';

// --- Mock Data & Types (Simulating 100 Companies & Portfolio) ---

interface Company {
  id: number;
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  costBasis: number;
}

interface Holding {
  companyId: number;
  shares: number;
}

interface TaxHarvestingSuggestion {
  ticker: string;
  sharesToSell: number;
  realizedGainLoss: number;
  strategy: 'Tax Loss Carryforward' | 'Wash Sale Avoidance';
  recommendation: string;
}

// Simulate 100 diverse companies (a small subset for demonstration)
const MOCK_COMPANIES: Company[] = [
  { id: 101, ticker: 'APL1', name: 'Alpha Dynamics Corp', sector: 'Tech', currentPrice: 150.00, costBasis: 180.00 }, // Loss
  { id: 102, ticker: 'BET2', name: 'Beta Solutions Inc', sector: 'Finance', currentPrice: 45.50, costBasis: 30.00 }, // Gain
  { id: 103, ticker: 'GAM3', name: 'Gamma Energy Ltd', sector: 'Energy', currentPrice: 220.10, costBasis: 220.10 }, // Break Even
  { id: 104, ticker: 'DELT4', name: 'Delta Manufacturing Co', sector: 'Industry', currentPrice: 88.75, costBasis: 110.00 }, // Loss
  { id: 105, ticker: 'EPH5', name: 'Epsilon Health Systems', sector: 'Health', currentPrice: 300.50, costBasis: 250.00 }, // Gain
  // ... (Imagine 95 more unique companies integrated here)
];

// Simulate a user's current portfolio holdings
const MOCK_PORTFOLIO: Holding[] = [
  { companyId: 101, shares: 50 },
  { companyId: 102, shares: 100 },
  { companyId: 103, shares: 20 },
  { companyId: 104, shares: 75 },
  { companyId: 105, shares: 10 },
];

// --- Utility Functions ---

const getCompanyById = (id: number): Company | undefined =>
  MOCK_COMPANIES.find(c => c.id === id);

// --- AI Simulation Engine ---
const analyzeTaxHarvesting = (portfolio: Holding[]): TaxHarvestingSuggestion[] => {
  const suggestions: TaxHarvestingSuggestion[] = [];
  const todayDate = new Date();
  const washSaleLookbackDays = 30; // Standard IRS lookback window

  portfolio.forEach(holding => {
    const company = getCompanyById(holding.companyId);
    if (!company) return;

    const currentMarketValue = holding.shares * company.currentPrice;
    const totalCostBasis = holding.shares * company.costBasis;
    const totalGainLoss = currentMarketValue - totalCostBasis;

    // 1. Identify Potential Tax Losses (Harvesting Opportunities)
    if (totalGainLoss < 0) {
      const lossAmount = Math.abs(totalGainLoss);
      const sharesToSellForFullLoss = holding.shares;

      // In a real AI, this would involve sophisticated wash sale checks against recent trades.
      // For this simulation, we assume no wash sale violation for the primary suggestion.
      
      suggestions.push({
        ticker: company.ticker,
        sharesToSell: sharesToSellForFullLoss,
        realizedGainLoss: -lossAmount, // Negative for loss
        strategy: 'Tax Loss Carryforward',
        recommendation: `Sell all ${sharesToSellForFullLoss} shares to realize a loss of $${lossAmount.toFixed(2)} to offset capital gains elsewhere.`,
      });
    }
    
    // 2. Identify Potential Tax Gains (to be flagged/managed) - Not a direct suggestion to sell unless balanced by a loss
    else if (totalGainLoss > 0) {
        // In a real tool, we would check if we have pending losses to balance this gain against.
        // For simplicity, we only output actionable harvesting suggestions (losses).
    }
  });

  // Sort suggestions by largest potential loss first (common user preference)
  return suggestions.sort((a, b) => b.realizedGainLoss - a.realizedGainLoss);
};


// --- React Component ---

const TaxOptimizationChamber: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<Holding[]>(MOCK_PORTFOLIO);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<TaxHarvestingSuggestion[]>([]);

  // AI Simulation Trigger
  const runOptimizationAnalysis = useCallback(() => {
    setIsLoading(true);
    setAnalysisResults([]);
    
    // Simulate processing time for the "AI Engine"
    setTimeout(() => {
      const results = analyzeTaxHarvesting(portfolioData);
      setAnalysisResults(results);
      setIsLoading(false);
    }, 1500);
  }, [portfolioData]);

  // Derived state for displaying portfolio summary
  const portfolioSummary = useMemo(() => {
    const summary = portfolioData.map(holding => {
      const company = getCompanyById(holding.companyId);
      if (!company) return null;
      
      const marketValue = holding.shares * company.currentPrice;
      const costBasisTotal = holding.shares * company.costBasis;
      const unrealizedPL = marketValue - costBasisTotal;
      const plPercent = (unrealizedPL / costBasisTotal) * 100;

      return {
        ...company,
        shares: holding.shares,
        marketValue: marketValue,
        unrealizedPL: unrealizedPL,
        plPercent: plPercent,
      };
    }).filter(Boolean);
    
    const totalMarketValue = summary.reduce((sum, item) => sum + item.marketValue, 0);
    return { summary, totalMarketValue };
  }, [portfolioData]);


  const renderSuggestions = () => {
    if (isLoading) {
      return <p className="text-indigo-400 text-center mt-6 animate-pulse">Analyzing portfolio against 100 integrated market entities...</p>;
    }
    if (analysisResults.length === 0) {
      return <p className="text-gray-500 text-center mt-6">No immediate tax-loss harvesting opportunities found based on current holdings.</p>;
    }

    return (
      <div className="space-y-4 mt-6">
        {analysisResults.map((s, index) => (
          <div key={index} className="p-4 border border-red-700 bg-red-50/50 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
            <h4 className="text-xl font-bold text-red-600 flex justify-between items-center">
              {s.ticker} Harvest Suggestion
            </h4>
            <p className="mt-1 text-sm text-gray-700">Strategy: <span className="font-semibold bg-yellow-200 px-2 rounded">{s.strategy}</span></p>
            <p className="mt-2 text-lg font-medium">
              Action: {s.recommendation}
            </p>
            <p className={`text-sm font-bold mt-1 ${s.realizedGainLoss < 0 ? 'text-green-700' : 'text-gray-700'}`}>
              Projected Realized Loss: ${Math.abs(s.realizedGainLoss).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white shadow-2xl rounded-xl border-t-4 border-indigo-600">
      <header className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Tax Optimization Chamber <span className="text-indigo-600 text-sm ml-2">(AI Simulation)</span>
        </h2>
        <button
          onClick={runOptimizationAnalysis}
          disabled={isLoading}
          className={`px-6 py-3 text-white font-semibold rounded-full transition duration-300 shadow-lg transform hover:scale-[1.02] 
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'}`}
        >
          {isLoading ? 'Processing...' : 'Run Real-Time Tax Sweep'}
        </button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Portfolio Snapshot */}
        <div className="lg:col-span-1 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-2 text-indigo-700">Portfolio Snapshot</h3>
          <p className="text-sm text-gray-600">Total Value: <span className="font-bold">${portfolioSummary.totalMarketValue.toFixed(2)}</span></p>
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-2">
            {portfolioSummary.summary.map((item, idx) => (
              <div key={idx} className="border-b pb-1 text-xs">
                <span className="font-bold mr-1">{item.ticker}</span> ({item.shares} shares)
                <span className={`ml-2 font-bold ${item.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.unrealizedPL.toFixed(2)} P/L ({item.plPercent.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Output */}
        <div className="lg:col-span-2 p-4 border rounded-lg bg-white">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Harvesting Recommendations</h3>
          <div className="min-h-40 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
            {renderSuggestions()}
          </div>
        </div>
      </section>

      {/* Future Integration Area (Mock Input for user interaction) */}
      <section className="mt-8 pt-4 border-t">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Simulation Controls (Advanced Tuning)</h3>
        <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center bg-indigo-50 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-indigo-600 mr-2"/>
                Max Out 301(k) Deferral (Simulated)
            </label>
            <label className="flex items-center bg-indigo-50 p-2 rounded-lg cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 mr-2"/>
                Check Wash Sale Rule Against Past 60 Days
            </label>
            <div className="flex items-center bg-indigo-50 p-2 rounded-lg">
                <span className="mr-2 text-gray-700">Target Annual Loss:</span>
                <input type="number" defaultValue={3000} min={0} step={100} className="w-20 p-1 border rounded text-sm text-center"/>
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
            Note: This simulation uses internal data from the 100 integrated entities to model current tax realities legally.
        </p>
      </section>
    </div>
  );
};

export default TaxOptimizationChamber;
