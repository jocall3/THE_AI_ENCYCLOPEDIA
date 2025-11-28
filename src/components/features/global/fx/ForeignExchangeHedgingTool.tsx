```typescript
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Type definitions for clarity
type HedgingStrategy = 'none' | 'forward' | 'option' | 'moneyMarket';

interface StrategyParams {
  forwardRate?: number;
  optionType?: 'put' | 'call';
  strikePrice?: number;
  premium?: number;
  homeInterestRate?: number;
  foreignInterestRate?: number;
}

interface AnalysisResult {
  futureSpotRate: number;
  unhedgedOutcome: number;
  hedgedOutcome: number;
  savings: number;
}

const currencyPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'];
const today = new Date().toISOString().split('T')[0];

const ForeignExchangeHedgingTool: React.FC = () => {
  // State for user inputs
  const [currencyPair, setCurrencyPair] = useState<string>('EUR/USD');
  const [exposureAmount, setExposureAmount] = useState<number>(1000000);
  const [exposureDate, setExposureDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
  );
  const [spotRate, setSpotRate] = useState<number>(1.08);
  const [hedgingStrategy, setHedgingStrategy] = useState<HedgingStrategy>('none');
  const [strategyParams, setStrategyParams] = useState<StrategyParams>({
    forwardRate: 1.075,
    optionType: 'put',
    strikePrice: 1.07,
    premium: 0.015,
    homeInterestRate: 5.0,
    foreignInterestRate: 3.5,
  });

  // State for results
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  const handleStrategyParamChange = (param: keyof StrategyParams, value: string | number) => {
    setStrategyParams(prev => ({ ...prev, [param]: Number(value) || value }));
  };

  const calculateHedge = () => {
    const results: AnalysisResult[] = [];
    const baseRate = spotRate;
    const volatility = 0.10; // 10% volatility range

    for (let i = -10; i <= 10; i++) {
      const futureSpotRate = baseRate * (1 + (i * volatility) / 10);
      const unhedgedOutcome = exposureAmount * futureSpotRate;
      let hedgedOutcome = unhedgedOutcome; // Default to unhedged

      switch (hedgingStrategy) {
        case 'forward':
          hedgedOutcome = exposureAmount * (strategyParams.forwardRate || 0);
          break;
        case 'option':
          // Assuming a receivable hedge (selling foreign currency), so we buy a Put option.
          const premiumCost = exposureAmount * (strategyParams.premium || 0);
          if (strategyParams.optionType === 'put') {
            const strike = strategyParams.strikePrice || 0;
            // If spot is below strike, we exercise the option. Otherwise, we sell at spot.
            const grossProceeds = futureSpotRate < strike 
              ? exposureAmount * strike 
              : exposureAmount * futureSpotRate;
            hedgedOutcome = grossProceeds - premiumCost;
          } else { // Call option (for a payable)
            // Logic for call option would be different, simplified here for Put
             hedgedOutcome = unhedgedOutcome - premiumCost;
          }
          break;
        case 'moneyMarket':
            // Simplified Money Market Hedge for a foreign currency receivable
            const daysToMaturity = (new Date(exposureDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
            const term = daysToMaturity / 365;

            const foreignRate = (strategyParams.foreignInterestRate || 0) / 100;
            const homeRate = (strategyParams.homeInterestRate || 0) / 100;

            // 1. Borrow foreign currency today
            const amountToBorrowForeign = exposureAmount / (1 + foreignRate * term);
            // 2. Convert to home currency at spot
            const homeCurrencyNow = amountToBorrowForeign * spotRate;
            // 3. Invest home currency
            const homeCurrencyAtMaturity = homeCurrencyNow * (1 + homeRate * term);
            
            hedgedOutcome = homeCurrencyAtMaturity; // This outcome is fixed regardless of future spot rate
            break;
        case 'none':
        default:
          hedgedOutcome = unhedgedOutcome;
          break;
      }
      
      const savings = hedgedOutcome - unhedgedOutcome;
      results.push({ futureSpotRate: parseFloat(futureSpotRate.toFixed(4)), unhedgedOutcome, hedgedOutcome, savings });
    }

    setAnalysisResults(results);
  };
  
  const renderStrategyInputs = () => {
    switch (hedgingStrategy) {
      case 'forward':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="forwardRate" className="block text-sm font-medium text-gray-300">Forward Rate</label>
              <input
                type="number"
                id="forwardRate"
                value={strategyParams.forwardRate || ''}
                onChange={(e) => handleStrategyParamChange('forwardRate', e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
                step="0.0001"
              />
            </div>
          </div>
        );
      case 'option':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="optionType" className="block text-sm font-medium text-gray-300">Option Type</label>
              <select
                id="optionType"
                value={strategyParams.optionType || 'put'}
                onChange={(e) => handleStrategyParamChange('optionType', e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
              >
                <option value="put">Put (Sell Foreign Currency)</option>
                <option value="call">Call (Buy Foreign Currency)</option>
              </select>
            </div>
            <div>
              <label htmlFor="strikePrice" className="block text-sm font-medium text-gray-300">Strike Price</label>
              <input
                type="number"
                id="strikePrice"
                value={strategyParams.strikePrice || ''}
                onChange={(e) => handleStrategyParamChange('strikePrice', e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
                step="0.0001"
              />
            </div>
            <div>
              <label htmlFor="premium" className="block text-sm font-medium text-gray-300">Premium (per unit)</label>
              <input
                type="number"
                id="premium"
                value={strategyParams.premium || ''}
                onChange={(e) => handleStrategyParamChange('premium', e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
                step="0.0001"
              />
            </div>
          </div>
        );
        case 'moneyMarket':
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="foreignInterestRate" className="block text-sm font-medium text-gray-300">Foreign Currency Interest Rate (%)</label>
                  <input
                    type="number"
                    id="foreignInterestRate"
                    value={strategyParams.foreignInterestRate || ''}
                    onChange={(e) => handleStrategyParamChange('foreignInterestRate', e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
                  />
                </div>
                <div>
                  <label htmlFor="homeInterestRate" className="block text-sm font-medium text-gray-300">Home Currency Interest Rate (%)</label>
                  <input
                    type="number"
                    id="homeInterestRate"
                    value={strategyParams.homeInterestRate || ''}
                    onChange={(e) => handleStrategyParamChange('homeInterestRate', e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
                  />
                </div>
              </div>
            );
      default:
        return null;
    }
  };

  const summary = useMemo(() => {
    if (analysisResults.length === 0 || hedgingStrategy === 'none') return null;

    const hedgedOutcome = analysisResults[0].hedgedOutcome; // Hedged outcome is fixed for Forward and MM
    const effectiveRate = hedgedOutcome / exposureAmount;
    const breakevenPoint = analysisResults.find(r => r.savings >= 0)?.futureSpotRate;
    
    let summaryText = `The effective exchange rate is locked in at approximately ${effectiveRate.toFixed(4)}.`;

    if(hedgingStrategy === 'option') {
        const maxLoss = (strategyParams.premium || 0) * exposureAmount;
        const breakevenRate = (strategyParams.strikePrice || 0) - (strategyParams.premium || 0);
        summaryText = `This strategy provides downside protection below the strike price of ${strategyParams.strikePrice}. The maximum loss is limited to the premium paid (${maxLoss.toLocaleString()}). The breakeven exchange rate is ${breakevenRate.toFixed(4)}.`;
    }

    if(hedgingStrategy === 'forward') {
        summaryText = `This strategy locks in a guaranteed exchange rate of ${strategyParams.forwardRate}, resulting in a fixed outcome of ${(exposureAmount * (strategyParams.forwardRate || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
    }


    return (
        <div className="p-4 bg-gray-800 rounded-lg text-gray-300">
            <h4 className="font-bold text-lg mb-2">Strategy Summary</h4>
            <p>{summaryText}</p>
            {breakevenPoint && hedgingStrategy !== 'option' && <p className="mt-2">The hedge becomes profitable compared to not hedging if the future spot rate is below <span className="font-bold text-green-400">{breakevenPoint.toFixed(4)}</span>.</p>}
        </div>
    )

  }, [analysisResults, hedgingStrategy, exposureAmount, strategyParams]);

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl w-full max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-400 border-b border-gray-700 pb-4">Foreign Exchange Hedging Tool</h2>
      
      {/* Inputs Section */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">1. Define Your Exposure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="currencyPair" className="block text-sm font-medium text-gray-300">Currency Pair</label>
            <select
              id="currencyPair"
              value={currencyPair}
              onChange={(e) => setCurrencyPair(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
            >
              {currencyPairs.map(pair => <option key={pair}>{pair}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="exposureAmount" className="block text-sm font-medium text-gray-300">Exposure Amount (Foreign)</label>
            <input
              type="number"
              id="exposureAmount"
              value={exposureAmount}
              onChange={(e) => setExposureAmount(Number(e.target.value))}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
            />
          </div>
          <div>
            <label htmlFor="exposureDate" className="block text-sm font-medium text-gray-300">Exposure Date</label>
            <input
              type="date"
              id="exposureDate"
              min={today}
              value={exposureDate}
              onChange={(e) => setExposureDate(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
            />
          </div>
          <div>
            <label htmlFor="spotRate" className="block text-sm font-medium text-gray-300">Current Spot Rate</label>
            <input
              type="number"
              id="spotRate"
              value={spotRate}
              onChange={(e) => setSpotRate(Number(e.target.value))}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
              step="0.0001"
            />
          </div>
        </div>
      </div>

      {/* Strategy Section */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">2. Select Hedging Strategy</h3>
        <div>
          <label htmlFor="hedgingStrategy" className="block text-sm font-medium text-gray-300">Strategy</label>
          <select
            id="hedgingStrategy"
            value={hedgingStrategy}
            onChange={(e) => setHedgingStrategy(e.target.value as HedgingStrategy)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
          >
            <option value="none">No Hedge</option>
            <option value="forward">Forward Contract</option>
            <option value="option">Currency Option</option>
            <option value="moneyMarket">Money Market Hedge</option>
          </select>
        </div>
        {hedgingStrategy !== 'none' && renderStrategyInputs()}
      </div>

      <div className="flex justify-center my-6">
        <button
          onClick={calculateHedge}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
        >
          Calculate & Analyze
        </button>
      </div>

      {/* Results Section */}
      {analysisResults.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">3. Analysis & Results</h3>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <h4 className="font-bold mb-2 text-center text-gray-300">Payoff Profile Visualization</h4>
              <div className="w-full h-80 bg-gray-900 p-2 rounded-md">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisResults} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis 
                        dataKey="futureSpotRate" 
                        name="Future Spot Rate" 
                        tick={{ fill: '#A0AEC0' }}
                        tickFormatter={(tick) => tick.toFixed(3)}
                        label={{ value: 'Future Spot Rate', position: 'insideBottom', offset: -10, fill: '#A0AEC0' }}
                    />
                    <YAxis 
                        tick={{ fill: '#A0AEC0' }}
                        tickFormatter={(tick) => `${(tick / 1000).toFixed(0)}k`}
                        label={{ value: 'Outcome (Home Currency)', angle: -90, position: 'insideLeft', fill: '#A0AEC0', dx: -25 }}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                        formatter={(value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    />
                    <Legend wrapperStyle={{ color: '#A0AEC0' }} />
                    <Line type="monotone" dataKey="unhedgedOutcome" name="Unhedged Outcome" stroke="#F56565" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="hedgedOutcome" name="Hedged Outcome" stroke="#48BB78" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-2">
              {summary}
            </div>
          </div>
          
          <div className="mt-8 overflow-x-auto">
            <h4 className="font-bold mb-2 text-center text-gray-300">Scenario Analysis Data</h4>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Future Spot Rate</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Unhedged Outcome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hedged Outcome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gain / (Loss)</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {analysisResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{result.futureSpotRate.toFixed(4)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.unhedgedOutcome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.hedgedOutcome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${result.savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForeignExchangeHedgingTool;
```