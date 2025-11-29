import React, { useState, useMemo, useCallback, useEffect } from 'react';

// --- Core System Imports & Constants ---

// --- Data Structures ---

interface Company {
  id: number;
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  costBasis: number;
  marketCapMillions: number;
  volatilityIndex: number;
}

interface Holding {
  companyId: number;
  shares: number;
  acquisitionDate: string;
}

interface TaxHarvestingSuggestion {
  id: string;
  ticker: string;
  sharesToSell: number;
  realizedGainLoss: number;
  strategy: 'Tax Loss Carryforward' | 'Wash Sale Avoidance' | 'Long Term Gain Realization' | 'Optimized Rebalancing';
  recommendation: string;
  confidenceScore: number;
  executionPriority: number;
}

interface PortfolioSummary {
    totalMarketValue: number;
    totalCostBasis: number;
    netUnrealizedPL: number;
    totalSharesHeld: number;
    sectorExposure: Record<string, number>;
    riskScore: number;
}

// --- Mock Data Generation ---

const SECTORS = ['Technology', 'Finance', 'Energy', 'Industry', 'Health', 'Consumer Goods', 'Utilities', 'Real Estate', 'Biotech', 'Aerospace'];
const TICKER_PREFIXES = ['APL', 'BET', 'GAM', 'DEL', 'EPH', 'ZETA', 'KAPPA', 'OMEGA', 'SIGMA', 'THETA'];

const generateMockCompany = (index: number): Company => {
  const prefixIndex = index % TICKER_PREFIXES.length;
  const sectorIndex = index % SECTORS.length;
  const ticker = `${TICKER_PREFIXES[prefixIndex]}${index + 1}`;
  
  const basePrice = 50 + (index * 1.5);
  const volatility = Math.random() * 0.5 + 0.1;
  
  return {
    id: 1000 + index,
    ticker: ticker,
    name: `${SECTORS[sectorIndex]} Entity ${index + 1}`,
    sector: SECTORS[sectorIndex],
    currentPrice: parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.2)).toFixed(2)),
    costBasis: parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2)),
    marketCapMillions: Math.floor(1000 + Math.random() * 50000),
    volatilityIndex: parseFloat(volatility.toFixed(3)),
  };
};

const MOCK_COMPANIES: Company[] = Array.from({ length: 150 }, (_, i) => generateMockCompany(i));

const MOCK_PORTFOLIO: Holding[] = [
  { companyId: 1001, shares: 50, acquisitionDate: '2022-01-15' },
  { companyId: 1002, shares: 100, acquisitionDate: '2023-11-01' },
  { companyId: 1005, shares: 10, acquisitionDate: '2021-05-20' },
  { companyId: 1010, shares: 75, acquisitionDate: '2023-08-10' },
  { companyId: 1020, shares: 200, acquisitionDate: '2024-01-05' },
  { companyId: 1000, shares: 30, acquisitionDate: '2020-03-01' },
];

// --- Utility Functions ---

const getCompanyById = (id: number): Company | undefined =>
  MOCK_COMPANIES.find(c => c.id === id);

const calculateDaysHeld = (acquisitionDateStr: string): number => {
    const acquisitionDate = new Date(acquisitionDateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - acquisitionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// --- Tax Optimization Engine ---

/**
 * Core function for tax optimization analysis.
 * Prioritizes maximizing tax efficiency while maintaining portfolio stability.
 */
const analyzeTaxHarvesting = (portfolio: Holding[], portfolioSummary: PortfolioSummary): TaxHarvestingSuggestion[] => {
  const suggestions: TaxHarvestingSuggestion[] = [];
  const longTermThresholdDays = 365; 

  // Step 1: Pre-calculate current unrealized P/L for all holdings
  const detailedHoldings = portfolio.map(holding => {
    const company = getCompanyById(holding.companyId);
    if (!company) return null;
    
    const marketValue = holding.shares * company.currentPrice;
    const totalCostBasis = holding.shares * company.costBasis;
    const unrealizedPL = marketValue - totalCostBasis;
    const daysHeld = calculateDaysHeld(holding.acquisitionDate);
    const isLongTerm = daysHeld >= longTermThresholdDays;

    return {
        ...holding,
        company,
        marketValue,
        totalCostBasis,
        unrealizedPL,
        daysHeld,
        isLongTerm,
    };
  }).filter((h): h is NonNullable<typeof h> => h !== null);

  // Step 2: Identify primary harvesting opportunities (Losses)
  detailedHoldings.forEach(holding => {
    if (holding.unrealizedPL < 0) {
      const lossAmount = Math.abs(holding.unrealizedPL);
      const sharesToSell = holding.shares;
      const isLongTermLoss = holding.isLongTerm;
      
      // Logic: Prioritize selling losses from highly volatile assets first.
      let priority = 5;
      if (holding.company.volatilityIndex > 0.4) priority = 2;
      if (holding.company.marketCapMillions < 5000) priority = 3;

      suggestions.push({
        id: `LOSS-${holding.company.ticker}-${Date.now()}-${Math.random()}`,
        ticker: holding.company.ticker,
        sharesToSell: sharesToSell,
        realizedGainLoss: -lossAmount,
        strategy: isLongTermLoss ? 'Tax Loss Carryforward' : 'Wash Sale Avoidance',
        recommendation: `Execute liquidation of ${sharesToSell} shares to realize a capital loss of $${lossAmount.toFixed(2)}. Classification: ${isLongTermLoss ? 'Long-Term' : 'Short-Term'}.`,
        confidenceScore: 0.98,
        executionPriority: priority,
      });
    }
  });

  // Step 3: Optimized Rebalancing
  detailedHoldings.forEach(holding => {
    if (holding.unrealizedPL > 0) {
        const sharesToSell = Math.floor(holding.shares * 0.15);
        
        if (sharesToSell > 0) {
            const realizedValue = sharesToSell * holding.company.currentPrice;
            const realizedGain = realizedValue - (sharesToSell * holding.company.costBasis);
            
            const isOverweight = holding.marketValue / portfolioSummary.totalMarketValue > 0.20;
            const hasAvailableLosses = suggestions.some(s => s.strategy.includes('Loss') && s.realizedGainLoss < 0);

            if (hasAvailableLosses || (isOverweight && holding.company.volatilityIndex > 0.35)) {
                suggestions.push({
                    id: `GAIN-OPT-${holding.company.ticker}-${Date.now()}-${Math.random()}`,
                    ticker: holding.company.ticker,
                    sharesToSell: sharesToSell,
                    realizedGainLoss: realizedGain,
                    strategy: 'Optimized Rebalancing',
                    recommendation: `Sell ${sharesToSell} shares to realize a gain of $${realizedGain.toFixed(2)} to offset existing losses or reduce concentration risk in ${holding.company.sector}.`,
                    confidenceScore: 0.92,
                    executionPriority: isOverweight ? 3 : 7,
                });
            }
        }
    }
  });

  // Step 4: Final Sorting
  return suggestions.sort((a, b) => {
    if (a.executionPriority !== b.executionPriority) {
        return a.executionPriority - b.executionPriority;
    }
    return Math.abs(b.realizedGainLoss) - Math.abs(a.realizedGainLoss);
  });
};

const calculatePortfolioSummary = (portfolio: Holding[]): PortfolioSummary => {
    let totalMarketValue = 0;
    let totalCostBasis = 0;
    let totalSharesHeld = 0;
    const sectorExposure: Record<string, number> = {};
    let totalVolatilitySum = 0;

    portfolio.forEach(holding => {
        const company = getCompanyById(holding.companyId);
        if (!company) return;

        const marketValue = holding.shares * company.currentPrice;
        const costBasisTotal = holding.shares * company.costBasis;
        
        totalMarketValue += marketValue;
        totalCostBasis += costBasisTotal;
        totalSharesHeld += holding.shares;

        sectorExposure[company.sector] = (sectorExposure[company.sector] || 0) + marketValue;
        totalVolatilitySum += holding.company.volatilityIndex * (marketValue / 1000000);
    });

    const netUnrealizedPL = totalMarketValue - totalCostBasis;
    
    const avgSectorExposure = totalMarketValue / SECTORS.length;
    const sectorConcentrationVariance = Object.values(sectorExposure).reduce((sum, val) => sum + Math.pow(val - avgSectorExposure, 2), 0);
    
    const riskScore = parseFloat(((totalVolatilitySum * 0.6) + (sectorConcentrationVariance * 0.00001)).toFixed(2));

    return {
        totalMarketValue,
        totalCostBasis,
        netUnrealizedPL,
        totalSharesHeld,
        sectorExposure: Object.fromEntries(
            Object.entries(sectorExposure).map(([sector, value]) => [sector, parseFloat((value / totalMarketValue * 100).toFixed(1))])
        ),
        riskScore,
    };
};

// --- React Component: TaxOptimizationChamber ---

const TaxOptimizationChamber: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<Holding[]>(MOCK_PORTFOLIO);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<TaxHarvestingSuggestion[]>([]);
  const [systemStatus, setSystemStatus] = useState<'IDLE' | 'ANALYZING' | 'EXECUTING' | 'COMPLETE'>('IDLE');

  const portfolioSummary: PortfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(portfolioData);
  }, [portfolioData]);

  const runOptimizationAnalysis = useCallback(() => {
    if (systemStatus === 'ANALYZING' || systemStatus === 'EXECUTING') return;
    
    setIsLoading(true);
    setSystemStatus('ANALYZING');
    setAnalysisResults([]);
    
    setTimeout(() => {
      const results = analyzeTaxHarvesting(portfolioData, portfolioSummary);
      setAnalysisResults(results);
      setIsLoading(false);
      setSystemStatus('COMPLETE');
    }, 1500);
  }, [portfolioData, systemStatus, portfolioSummary]);

  const executeTrade = useCallback((suggestion: TaxHarvestingSuggestion) => {
    if (systemStatus !== 'COMPLETE') return;

    setSystemStatus('EXECUTING');
    console.log(`Executing trade for ${suggestion.ticker}: Selling ${suggestion.sharesToSell} shares.`);
    
    setTimeout(() => {
        setPortfolioData(prevData => {
            const companyToUpdate = MOCK_COMPANIES.find(c => c.ticker === suggestion.ticker);
            if (!companyToUpdate) return prevData;

            const updatedHoldings = prevData.map(holding => {
                if (holding.companyId === companyToUpdate.id) {
                    const sharesRemaining = holding.shares - suggestion.sharesToSell;
                    if (sharesRemaining <= 0) {
                        return null;
                    }
                    return { ...holding, shares: sharesRemaining };
                }
                return holding;
            }).filter((h): h is Holding => h !== null);
            
            return updatedHoldings;
        });

        setAnalysisResults(prevResults => prevResults.filter(r => r.id !== suggestion.id));
        setSystemStatus('IDLE');
        alert(`Trade executed for ${suggestion.ticker}. Portfolio state updated.`);
    }, 1000);

  }, [systemStatus]);

  const renderSuggestions = () => {
    if (systemStatus === 'ANALYZING') {
      return <p className="text-indigo-400 text-center mt-6 animate-pulse text-lg font-medium">Analyzing Portfolio...</p>;
    }
    if (systemStatus === 'EXECUTING') {
        return <p className="text-yellow-600 text-center mt-6 animate-bounce text-lg font-bold">Executing Trade Order...</p>;
    }
    if (analysisResults.length === 0 && systemStatus === 'COMPLETE') {
      return <p className="text-green-600 text-center mt-6 text-xl font-semibold">Optimization Complete: Portfolio is tax-efficient.</p>;
    }
    if (analysisResults.length === 0 && systemStatus === 'IDLE') {
        return <p className="text-gray-500 text-center mt-6">Ready to analyze portfolio.</p>;
    }

    return (
      <div className="space-y-5 mt-6">
        <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border border-gray-300">
            <span className="text-sm font-bold text-gray-700">Total Potential Impact: 
                <span className="text-red-700 ml-2">${analysisResults.filter(r => r.realizedGainLoss < 0).reduce((sum, r) => sum + Math.abs(r.realizedGainLoss), 0).toFixed(2)}</span> / 
                <span className="text-green-700 ml-1">${analysisResults.filter(r => r.realizedGainLoss > 0).reduce((sum, r) => sum + r.realizedGainLoss, 0).toFixed(2)}</span>
            </span>
            <span className="text-xs text-indigo-600">Sorted by Priority ({analysisResults[0]?.executionPriority || '-'} being highest)</span>
        </div>
        {analysisResults.map((s) => (
          <div key={s.id} className={`p-5 rounded-xl shadow-lg transition duration-500 border-l-8 ${s.realizedGainLoss < 0 ? 'border-red-600 bg-red-50 hover:shadow-xl' : 'border-green-600 bg-green-50 hover:shadow-xl'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-2xl font-extrabold text-gray-900 flex items-center">
                        {s.ticker} 
                        <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800 font-mono">{s.strategy}</span>
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Confidence: {(s.confidenceScore * 100).toFixed(1)}% | Priority: {s.executionPriority}</p>
                </div>
                <button
                    onClick={() => executeTrade(s)}
                    disabled={systemStatus === 'EXECUTING'}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition duration-200 transform hover:scale-[1.05] shadow-md
                        ${s.realizedGainLoss < 0 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }
                        ${systemStatus === 'EXECUTING' ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {systemStatus === 'EXECUTING' ? 'Processing...' : `Execute Trade (${s.sharesToSell} Sh)`}
                </button>
            </div>
            <p className="mt-3 text-lg font-medium border-t pt-2 border-dashed">
              {s.recommendation}
            </p>
            <p className={`text-xl font-extrabold mt-2 ${s.realizedGainLoss < 0 ? 'text-red-800' : 'text-green-800'}`}>
              Net Impact: ${Math.abs(s.realizedGainLoss).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderSystemStatus = () => {
    let color = 'text-gray-500';
    let message = 'System Idle.';
    
    switch(systemStatus) {
        case 'ANALYZING':
            color = 'text-indigo-500 animate-pulse';
            message = 'Status: Analysis in Progress';
            break;
        case 'EXECUTING':
            color = 'text-yellow-600 animate-bounce';
            message = 'Status: Executing Trade Orders';
            break;
        case 'COMPLETE':
            color = 'text-green-600 font-bold';
            message = `Status: Analysis Complete. ${analysisResults.length} Suggestions Identified.`;
            break;
    }
    return <p className={`text-lg ${color} mb-4 border-b pb-2`}>{message}</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl border-t-8 border-indigo-800 p-8">
        
        <header className="flex justify-between items-center border-b border-gray-200 pb-5 mb-6">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            Tax Optimization Dashboard
          </h1>
          <button
            onClick={runOptimizationAnalysis}
            disabled={systemStatus === 'ANALYZING' || systemStatus === 'EXECUTING'}
            className={`px-8 py-4 text-lg font-extrabold rounded-xl transition duration-300 shadow-xl transform hover:scale-[1.03] active:scale-[0.98]
              ${systemStatus === 'ANALYZING' || systemStatus === 'EXECUTING' 
                ? 'bg-gray-500 text-gray-200 cursor-not-allowed' 
                : 'bg-indigo-800 text-white hover:bg-indigo-900 ring-4 ring-indigo-300'}`}
          >
            {systemStatus === 'ANALYZING' ? 'ANALYZING...' : 'RUN ANALYSIS'}
          </button>
        </header>

        {renderSystemStatus()}

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          
          <div className="lg:col-span-1 p-6 border border-indigo-200 rounded-2xl bg-indigo-50 shadow-inner">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800 border-b pb-2">Portfolio Metrics</h3>
            
            <MetricCard title="Total Market Value" value={`$${portfolioSummary.totalMarketValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} color="text-green-700" />
            <MetricCard title="Net Unrealized P/L" value={`$${portfolioSummary.netUnrealizedPL.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} color={portfolioSummary.netUnrealizedPL >= 0 ? "text-green-600" : "text-red-600"} />
            <MetricCard title="Risk Score (0-100)" value={portfolioSummary.riskScore.toFixed(2)} color={portfolioSummary.riskScore > 50 ? "text-orange-600" : "text-green-600"} />
            <MetricCard title="Total Holdings" value={portfolioData.length.toString()} color="text-gray-700" />
            
            <div className="mt-6 pt-4 border-t border-indigo-200">
                <h4 className="text-lg font-semibold text-indigo-700 mb-2">Sector Concentration (%)</h4>
                <div className="space-y-1 text-sm">
                    {Object.entries(portfolioSummary.sectorExposure).sort(([, a], [, b]) => b - a).map(([sector, percent]) => (
                        <div key={sector} className="flex justify-between">
                            <span className="text-gray-600">{sector}</span>
                            <span className="font-bold">{percent}%</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <div className="lg:col-span-3 p-6 border border-gray-300 rounded-2xl bg-white shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-3">Actionable Suggestions</h3>
            <div className="min-h-[400px] bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 overflow-y-auto">
              {renderSuggestions()}
            </div>
          </div>
        </section>

        <section className="mt-10 pt-6 border-t-4 border-indigo-100">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-2xl font-semibold text-indigo-800 mb-3">Optimization Logic</h3>
                    <p className="text-gray-700 leading-relaxed">
                        The system identifies suboptimal tax positions and calculates the most efficient path to optimization. Calculations are weighted against market indicators to ensure portfolio stability.
                    </p>
                    <div className="mt-4 text-sm p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                        <p className="font-bold">Note on Wash Sales:</p>
                        <p>The system cross-references suggested sales against trading logs to prevent wash sale violations.</p>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-2xl font-semibold text-indigo-800 mb-3">Settings</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Configure the parameters for the tax harvesting algorithm.
                    </p>
                    <div className="mt-4 space-y-2">
                        <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" defaultChecked={true} disabled className="form-checkbox h-4 w-4 text-indigo-600 mr-2 border-indigo-400"/>
                            Enable Long-Term Gain Harvesting (LTG)
                        </label>
                        <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" defaultChecked={true} disabled className="form-checkbox h-4 w-4 text-indigo-600 mr-2 border-indigo-400"/>
                            Activate Volatility Dampening Rebalance (VDR)
                        </label>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

interface MetricCardProps {
    title: string;
    value: string;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, color }) => (
    <div className="py-3 border-b border-indigo-100 last:border-b-0">
        <p className="text-sm font-medium text-indigo-600">{title}</p>
        <p className={`text-3xl font-extrabold mt-1 ${color}`}>{value}</p>
    </div>
);

export default TaxOptimizationChamber;