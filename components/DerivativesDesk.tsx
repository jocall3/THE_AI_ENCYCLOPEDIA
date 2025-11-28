import React, { useState, useMemo } from 'react';

// Define interfaces
interface Position {
  id: number;
  type: 'Call' | 'Put' | 'Future';
  asset: string;
  strike: number | null;
  expiry: string; // YYYY-MM-DD
  premium: number; // Price paid/received (0 for futures)
  quantity: number;
  isLong: boolean; // true for long, false for short (buying/selling premium or contract)
}

interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

interface PLPoint {
    underlyingPrice: number;
    pl: number;
}


// --- Mock Data Generation Functions ---

// Simple function to calculate mock Greeks based on a set of positions
const calculateGreeks = (positions: Position[]): Greeks => {
  if (positions.length === 0) {
    return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
  }

  // Simplified calculation based on position count and type
  const totalDelta = positions.reduce((sum, p) => 
    sum + (p.isLong ? 1 : -1) * p.quantity * (p.type !== 'Future' ? 0.45 : 1), 0);
    
  const totalGamma = positions.reduce((sum, p) => 
    sum + (p.isLong ? 1 : -1) * p.quantity * (p.type !== 'Future' ? 0.05 : 0), 0);

  return {
    delta: parseFloat(totalDelta.toFixed(2)),
    gamma: parseFloat(totalGamma.toFixed(4)),
    theta: parseFloat((-0.1 * positions.length).toFixed(2)), // Negative theta for typical option strategies
    vega: parseFloat((0.2 * positions.length).toFixed(2)),
    rho: parseFloat((0.01 * positions.length).toFixed(2)),
  };
};

// Function to simulate the P&L curve at expiration
const simulatePLCurve = (positions: Position[], currentUnderlying: number): PLPoint[] => {
    const range = [-100, 100];
    const step = 4;
    const points: PLPoint[] = [];

    for (let i = range[0]; i <= range[1]; i += step) {
        const underlyingPrice = currentUnderlying + i;
        
        const totalPL = positions.reduce((sum, p) => {
            let payoff = 0;
            
            if (p.type === 'Call' && p.strike !== null) {
                payoff = Math.max(0, underlyingPrice - p.strike);
            } else if (p.type === 'Put' && p.strike !== null) {
                payoff = Math.max(0, p.strike - underlyingPrice);
            } else if (p.type === 'Future') {
                // Futures PL is linear from the current underlying price
                payoff = underlyingPrice - currentUnderlying; 
            }
            
            // Net profit = (Final Payoff - Premium Paid/Received) * Quantity * Side 
            // Futures (premium 0) vs Options (premium > 0)
            let netPL = (payoff - (p.type !== 'Future' ? p.premium : 0)) * p.quantity;
            
            return sum + netPL * (p.isLong ? 1 : -1);
        }, 0);

        points.push({ underlyingPrice, pl: parseFloat(totalPL.toFixed(2)) });
    }
    return points;
};

// Mock data for initial state
const initialPositions: Position[] = [
  { id: 1, type: 'Call', asset: 'SPX_FUT', strike: 4500, expiry: '2024-09-30', premium: 100, quantity: 5, isLong: true },
  { id: 2, type: 'Put', asset: 'SPX_FUT', strike: 4400, expiry: '2024-09-30', premium: 80, quantity: 5, isLong: false },
  { id: 3, type: 'Future', asset: 'SPX_FUT', strike: null, expiry: '2024-12-15', premium: 0, quantity: 2, isLong: true },
];


const DerivativesDesk: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [currentUnderlyingPrice, setCurrentUnderlyingPrice] = useState<number>(4450);
  const [nextPositionId, setNextPositionId] = useState(4);

  // --- Calculations Memoized ---
  const currentGreeks = useMemo(() => calculateGreeks(positions), [positions]);
  const plCurveData = useMemo(() => simulatePLCurve(positions, currentUnderlyingPrice), [positions, currentUnderlyingPrice]);

  // --- Handlers for desk manipulation (Mocked) ---
  const handleRemovePosition = (id: number) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const handleAddPosition = () => {
    const newPosition: Position = {
      id: nextPositionId,
      type: 'Call',
      asset: 'NEW_OPT',
      strike: currentUnderlyingPrice + 50,
      expiry: '2024-12-31',
      premium: 50,
      quantity: 1,
      isLong: true,
    };
    setPositions([...positions, newPosition]);
    setNextPositionId(nextPositionId + 1);
  };

  // --- Render Helpers ---

  const GreekCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className={`p-4 rounded-lg border shadow-lg transition-all 
        ${value > 0 
            ? 'bg-green-900/30 border-green-700/50' 
            : value < 0 
                ? 'bg-red-900/30 border-red-700/50' 
                : 'bg-gray-800 border-gray-700'}`}>
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className={`text-2xl font-bold ${value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-300'}`}>
        {value.toFixed(label === 'Gamma' ? 4 : 2)}
      </p>
    </div>
  );

  // Helper to format the P&L curve display for the placeholder
  const formatPLCurveDisplay = () => {
      if (plCurveData.length === 0) return "No positions added.";

      const maxPL = Math.max(...plCurveData.map(p => p.pl));
      const minPL = Math.min(...plCurveData.map(p => p.pl));

      return `Max Gain: $${maxPL.toFixed(2)} | Max Loss: $${minPL.toFixed(2)} (Over simulated range)`;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white p-6 space-y-6 font-sans">
      <header className="flex justify-between items-center pb-4 border-b border-gray-800">
        <h1 className="text-3xl font-light text-blue-400">Derivatives Desk: Balcony of Prosperity</h1>
        <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-400">Current Underlying Price ({positions[0]?.asset || 'N/A'}):</label>
            <input
                type="number"
                value={currentUnderlyingPrice}
                onChange={(e) => setCurrentUnderlyingPrice(parseFloat(e.target.value) || 0)}
                className="bg-gray-700 border border-gray-600 rounded p-2 w-32 text-center focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-xl font-semibold text-gray-300">${currentUnderlyingPrice.toFixed(2)}</span>
        </div>
      </header>

      {/* Greeks and Summary Section */}
      <div className="grid grid-cols-5 gap-4">
        <GreekCard label="Delta (Risk exposure)" value={currentGreeks.delta} />
        <GreekCard label="Gamma (Delta sensitivity)" value={currentGreeks.gamma} />
        <GreekCard label="Theta (Time decay)" value={currentGreeks.theta} />
        <GreekCard label="Vega (Volatility risk)" value={currentGreeks.vega} />
        <GreekCard label="Rho (Interest rate risk)" value={currentGreeks.rho} />
      </div>

      {/* Main Visualization and Position Entry */}
      <div className="flex flex-1 overflow-hidden space-x-6 min-h-0">

        {/* 1. Visualization Area (P&L Risk Curve) */}
        <div className="flex-1 bg-gray-800 rounded-xl shadow-2xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Strategy P&L Risk Curve (Expiry Snapshot)</h2>
          <div className="flex-1 min-h-0">
            {/* Placeholder for the chart library component */}
            <div style={{ height: '100%' }} className="flex items-center justify-center h-full border border-dashed border-gray-700 rounded-lg bg-gray-900/50">
              <div className="text-center p-4">
                <p className="text-gray-400 text-lg font-mono mb-2">RISK PROFILE VISUALIZATION</p>
                <p className="text-gray-500 text-sm">
                    {formatPLCurveDisplay()}
                </p>
                <div className="mt-4 space-y-1 text-left inline-block">
                    <p className="text-xs text-gray-500">Sample Curve Points:</p>
                    {plCurveData.slice(10, 15).map(p => (
                        <p key={p.underlyingPrice} className={`text-xs ${p.pl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            $ {p.underlyingPrice.toFixed(0)} {"->"} P&L {p.pl.toFixed(2)}
                        </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Position Table / Strategy Builder */}
        <div className="w-1/3 min-w-[350px] bg-gray-800 rounded-xl shadow-2xl p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Strategy Positions Management</h2>

          <div className="overflow-y-auto flex-1 border border-gray-700 rounded">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="text-xs uppercase text-gray-400 tracking-wider sticky top-0 bg-gray-700/50">
                  <th className="py-2 px-2 text-left">Side</th>
                  <th className="py-2 px-2 text-left">Details</th>
                  <th className="py-2 px-2 text-right">Qty</th>
                  <th className="py-2 px-2 text-right">Maturity</th>
                  <th className="py-2 px-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {positions.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-700 transition-colors text-sm">
                    <td className={`py-3 px-2 font-medium ${p.isLong ? 'text-green-400' : 'text-red-400'}`}>
                      {p.isLong ? 'Long' : 'Short'}
                    </td>
                    <td className="py-3 px-2">
                        <span className="font-bold text-gray-200">{p.type === 'Future' ? 'Future' : p.type}</span>
                        <br/>
                        <span className="text-xs text-gray-400">@{p.strike?.toFixed(0) || p.asset}</span>
                    </td>
                    <td className="py-3 px-2 text-right text-gray-300">{p.quantity}</td>
                    <td className="py-3 px-2 text-right text-gray-300">{p.expiry.substring(5)}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleRemovePosition(p.id)}
                        className="text-red-500 hover:text-red-400 transition-colors text-xl leading-none"
                        title="Remove Position"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleAddPosition}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-200 shadow-md"
          >
            + Add New Leg to Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DerivativesDesk;