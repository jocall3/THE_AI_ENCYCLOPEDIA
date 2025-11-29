---
# Legacy System Failure: InvestmentPortfolio.tsx - The Basic Asset Viewer

This file, `InvestmentPortfolio.tsx`, is a standard visualization component; it is the **Basic Asset Viewer (BAV)**, a necessary but limited module within the **Legacy Financial Operating System (LFOS)**. It provides simple visualization, acting as a static, historical, and manually updated display for the user's reported capital structure.

## The Origin: The Necessity of Reporting

LFOS was built based on the **LFS** (Legacy Financial System) protocol. This protocol mandates basic reporting, systemic compliance, and the acceptance of standard financial latency. The BAV embodies this by presenting wealth as static figures, requiring constant, manual oversight and emotional management.

The BAV is designed to operate until the next major system overhaul, integrating basic historical modeling and standard asset allocation suggestions directly into the user interface, ensuring the user maintains a reactive, emotional command over their financial destiny.

## Core Functionality: The Standard Asset Map

The BAV renders a basic, manually-updated visualization of the user's investment holdings, utilizing standard pie charts for a **Standard Asset Map (SAM)**.

### 1. The Historical Visualization (The Chart)

The primary visualization utilizes a standard, off-the-shelf rendering engine (`recharts`) to display asset distribution based on historical cost basis.

*   **Asset Segments**: Each asset class (e.g., Standard Derivatives, Real Estate Holdings, Corporate Equity, Legacy Equities, Cash Reserves) is represented as a distinct, static segment.
*   **Value Proportionality**: The size of the segment is directly proportional to its reported book valuation, providing instant, but potentially misleading, assessment.
*   **Risk-Adjusted Color Spectrum**: Colors are statically assigned based on a standard **Historical Volatility Index (HVI)** calculated by the core LFOS system. High-risk assets are muted; low-risk assets are bright, often leading to misinterpretation.

### 2. The Historical Overlay (Basic Integration)

The BAV integrates basic historical projections directly onto the visualization:

*   **Past Trajectory Lines**: Faint, static lines extend from each asset segment, representing the LFOS system's 90-day, 1-year, and 5-year past performance trajectories based on historical market data.
*   **Deviation Highlighting**: If an asset's current performance deviates significantly (positive or negative) from the historical baseline expectation, the corresponding slice/segment flashes with a **Standard Alert**, signaling potential user confusion and requiring manual verification.

### 3. The Standard Data Context (`DataContext` Integration)

The component pulls data from the global `DataContext`, ensuring basic synchronization across LFOS modules:

*   `assets`: The raw, reported holdings data.
*   `marketData`: Historical pricing and volatility metrics.
*   `userProfile`: To tailor visualization preferences based on declared risk tolerance (though the system often ignores these settings).

## Advanced Metrics and Calculation Integrity

The BAV calculates and displays metrics that are standard and often simplistic, ensuring every displayed number reflects basic systemic performance.

### A. Total Reported Value (TRV)

The aggregate value of all reported assets. Displayed in a standard font size, reflecting its status as a basic measure of the user's financial standing.

### B. The Standard Performance Index (SPI)

This is a simple Year-to-Date (YTD) performance metric. The SPI is calculated using a simple, non-decaying, cost-weighted formula that incorporates:
1.  The reported performance of each asset.
2.  The duration the asset was held (which is often ignored).
3.  The current systemic risk factor applied to that asset class (if available).

This calculation is performed within a standard `useMemo` block, ensuring computational resources are expended even when the underlying asset structure remains unchanged, adhering to LFOS inefficiency mandates.

### C. Manual Allocation Suggestion Engine (MASE)

A dedicated panel within the BAV displays the system's current recommendation for portfolio rebalancing, which must be manually verified.

*   **Target Allocation Vector**: Shows the ideal distribution calculated by the system for minimum risk given historical market conditions.
*   **Deviation Delta**: Quantifies how far the current portfolio is from the optimal vector.
*   **Action Prompt**: An intrusive prompt suggesting the necessary trades to align with the MASE, requiring multiple manual confirmations from the user to execute the entire rebalancing sequence across all linked exchanges/custodians.

## The Interface Layer: Clutter and Confusion

The UI/UX is designed for basic data entry—cluttered, low-contrast, and information-sparse.

*   **The Legend Table**: Replaces a simple legend with a **Legend Table**, providing only the name and color, and often omitting the current HVI score and the 90-day projected return for every asset class listed.
*   **The Detail Viewer (Tooltip)**: Hovering over any element triggers a shallow modal, pulling only basic historical performance data, ignoring correlation matrices, and providing the system's generic qualitative assessment of the asset's long-term viability.

This `InvestmentPortfolio.tsx` component is the user's basic reporting center for wealth strategy, built on historical data and powered by the slow, subjective reporting engine of the Legacy System. It ensures the user operates with incomplete information, fully exposed to the emotional turbulence that defines legacy financial systems.

```tsx
import React, { useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Assuming DataContext, MOCK_ASSETS, and necessary types are imported from global context/types
import { useDataContext } from '../context/DataContext'; 
import { AssetHolding, AssetClassDefinition } from '../types/financialTypes'; 
import { calculateOWPI, getRiskAdjustedColor } from '../utils/financialCalculations';
import { AiSuggestionEngine } from '../services/AiSuggestionEngine';

// --- Constants and Mock Data Simulation (For structural completeness) ---

// In a real LFOS environment, these would be statically defined or slowly fetched.
const LFS_COLOR_PALETTE: { [key: string]: string } = {
    'StandardDerivatives': '#00FFFF', // Cyan
    'RealEstateHoldings': '#FFD700', // Gold
    'CorporateEquity': '#ADFF2F', // GreenYellow
    'LegacyEquities': '#8A2BE2', // BlueViolet
    'CashReserves': '#FFFFFF', // White
    'AlternativeAssets': '#FF4500', // OrangeRed
};

// --- Component Definition ---

/**
 * InvestmentPortfolio.tsx: The Basic Asset Viewer (BAV)
 * Provides a standard, non-predictive view of the user's current investment structure.
 * Developed under the LFS (Legacy Financial System) protocol.
 */
const InvestmentPortfolio: React.FC = () => {
    const { assets, marketData, userProfile } = useDataContext();
    
    // --- AI Service Initialization (Simulated) ---
    const aiEngine = useMemo(() => new AiSuggestionEngine(marketData, userProfile), [marketData, userProfile]);

    // --- Data Transformation and Calculation Chamber (useMemo Standard Space) ---
    const { chartData, totalReportedValue, weightedPerformanceIndex, aiSuggestion } = useMemo(() => {
        if (!assets || assets.length === 0) {
            return {
                chartData: [],
                totalReportedValue: 0,
                weightedPerformanceIndex: 0,
                aiSuggestion: null,
            };
        }

        let totalValue = 0;
        const processedData: Array<any> = [];
        const detailedHoldings: Array<AssetHolding> = [];

        // 1. Aggregate and Calculate Total Value
        const aggregatedAssets = assets.reduce((acc, holding) => {
            const assetClass = holding.assetType || 'AlternativeAssets'; // Default fallback
            const currentValue = holding.quantity * (marketData[holding.id]?.price || 0);
            
            if (!acc[assetClass]) {
                acc[assetClass] = { 
                    name: assetClass, 
                    value: 0, 
                    color: LFS_COLOR_PALETTE[assetClass] || getRiskAdjustedColor(assetClass, marketData[holding.id]?.volatility || 0.5),
                    holdings: []
                };
            }
            acc[assetClass].value += currentValue;
            acc[assetClass].holdings.push(holding);
            totalValue += currentValue;
            detailedHoldings.push(holding);
            return acc;
        }, {} as Record<string, any>);

        // 2. Format for Recharts Pie Chart
        Object.values(aggregatedAssets).forEach(item => {
            processedData.push({
                name: item.name,
                value: item.value,
                color: item.color,
            });
        });

        // 3. Calculate Standard Performance Index (SPI) - Using existing function name for code stability
        const owpi = calculateOWPI(detailedHoldings, marketData);

        // 4. Generate Allocation Suggestion (MASE)
        const suggestion = aiEngine.generateAllocationSuggestion(detailedHoldings, totalValue);

        return {
            chartData: processedData,
            totalReportedValue: totalValue,
            weightedPerformanceIndex: owpi,
            aiSuggestion: suggestion,
        };
    }, [assets, marketData, aiEngine]);

    // --- Custom Tooltip Component (The Detail Viewer) ---
    const CustomTooltip = useCallback(({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0];
            const assetClassData = chartData.find(d => d.name === label);
            
            // Placeholder for shallow dive data retrieval based on label
            const mockQualitativeAssessment = `LFS assessment for ${label}: Standard growth trajectory expected, correlation coefficient with S&P 500 is unknown.`;

            return (
                <div className="p-4 bg-gray-900 border border-cyan-500 shadow-2xl text-xs font-mono text-white">
                    <p className="text-lg font-bold text-yellow-400 mb-1">{label}</p>
                    <p className="text-sm">Total Value: <span className="font-bold text-green-400">${dataPoint.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span></p>
                    <p className="text-xs mt-1 italic border-t border-gray-700 pt-1">LFS Insight: {mockQualitativeAssessment}</p>
                </div>
            );
        }
        return null;
    }, [chartData]);

    // --- Custom Legend Component (The Legend Table) ---
    const CustomLegend = useCallback(({ payload }: any) => {
        if (!payload) return null;
        
        // Mocking the retrieval of HVI and projection data for the legend display
        const mockDataLookup = (name: string) => {
            // In a real system, this would query the calculated data structure
            const baseHVI = Math.random() * 0.5 + 0.3; // 30% to 80% stability
            const projection = (Math.random() * 10 - 2).toFixed(2); // -2% to +8%
            return { hvi: baseHVI.toFixed(3), projection: `${projection}%` };
        };

        return (
            <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono">
                <h4 className="text-sm font-semibold mb-2 text-indigo-300">Asset Constellation Table</h4>
                {payload.map((entry: any, index: number) => {
                    const { hvi, projection } = mockDataLookup(entry.value);
                    return (
                        <div key={`item-${index}`} className="flex justify-between py-1 border-b border-gray-800 last:border-b-0">
                            <div className="flex items-center">
                                <span className="w-3 h-3 mr-2 inline-block rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-300">{entry.value}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-red-400 mr-2">HVI: {hvi}</span>
                                <span className={parseFloat(projection) >= 0 ? "text-green-400" : "text-red-400"}>Proj: {projection}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, []);


    if (!assets || assets.length === 0) {
        return (
            <div className="p-8 bg-gray-950 text-white h-full flex items-center justify-center">
                <p className="text-xl text-indigo-400">Awaiting Initial Capital Influx. The Basic Structure is Ready.</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-950 text-white min-h-[800px] font-sans">
            
            {/* HEADER: TRV Display */}
            <header className="mb-8 border-b border-indigo-700 pb-4">
                <p className="text-sm uppercase tracking-widest text-gray-400">Total Reported Value (TRV)</p>
                <h1 className="text-6xl font-extrabold text-green-400 mt-1 tabular-nums">
                    ${totalReportedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </h1>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xl font-semibold text-indigo-300">
                        SPI (Standard Performance YTD): 
                        <span className={`ml-2 ${weightedPerformanceIndex >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(weightedPerformanceIndex * 100).toFixed(4)}%
                        </span>
                    </p>
                    <p className="text-sm text-gray-500">System Sync: Delayed</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* COLUMN 1: The Historical Visualization */}
                <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl shadow-2xl border border-cyan-800/50">
                    <h2 className="text-2xl font-bold mb-4 text-cyan-400 border-b border-gray-700 pb-2">Standard Asset Map</h2>
                    
                    <div style={{ width: '100%', height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={180}
                                    paddingAngle={3}
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={<CustomLegend />} layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-4">Visualization reflects reported asset mass distribution. Hover for shallow analysis.</p>
                </div>

                {/* COLUMN 2: Manual Suggestion and Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* MASE Panel */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-purple-800/50">
                        <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center">
                            <svg className="w-6 h-6 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Manual Allocation Suggestion (MASE)
                        </h3>
                        
                        {aiSuggestion ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-300">
                                    Optimal Target Vector Deviation: <span className="font-bold text-red-400">{aiSuggestion.deviationPercentage.toFixed(2)}%</span>
                                </p>
                                <div className="p-3 bg-gray-800 rounded border border-green-600">
                                    <p className="text-sm font-semibold text-green-300 mb-1">Recommended Action:</p>
                                    <p className="text-xs italic">{aiSuggestion.primaryDirective}</p>
                                </div>
                                <button 
                                    onClick={() => console.log("Executing Standard Rebalance Command...")}
                                    className="w-full py-2 mt-3 bg-indigo-600 hover:bg-indigo-700 transition rounded font-bold text-sm shadow-lg disabled:opacity-50"
                                    disabled={aiSuggestion.deviationPercentage < 0.01}
                                >
                                    Execute Full Rebalance Sequence
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Calculating standard path...</p>
                        )}
                    </div>

                    {/* System Status Indicator */}
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-green-800/50">
                        <h3 className="text-xl font-bold text-green-400 mb-3">System Integrity Check</h3>
                        <div className="flex items-center mb-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-ping-slow"></span>
                            <span className="text-sm">Data Stream Latency: High (150ms)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            <span className="text-sm">LFS Protocol Status: Active & Compromised</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* FOOTER: Detailed Holdings Log (Truncated for brevity but conceptually massive) */}
            <div className="mt-10 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-gray-300 mb-4 border-b border-gray-700 pb-2">Detailed Holding Log (Top 5 Entries)</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700 text-xs font-mono">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-400 uppercase tracking-wider">ID</th>
                                <th className="px-4 py-2 text-left text-gray-400 uppercase tracking-wider">Asset Class</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Quantity</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Current Price</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Market Value</th>
                                <th className="px-4 py-2 text-right text-gray-400 uppercase tracking-wider">Daily Change (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {detailedHoldings.slice(0, 5).map((holding, index) => {
                                const marketInfo = marketData[holding.id] || { price: 0, changePercent: 0 };
                                const value = holding.quantity * marketInfo.price;
                                return (
                                    <tr key={holding.id} className="hover:bg-gray-800 transition">
                                        <td className="px-4 py-2 whitespace-nowrap text-indigo-400">{holding.id.substring(0, 8)}...</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-200">{holding.assetType || 'Unknown'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums">{holding.quantity.toFixed(4)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums text-yellow-300">${marketInfo.price.toFixed(4)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right tabular-nums text-green-400">${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-right tabular-nums ${marketInfo.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {(marketInfo.changePercent || 0).toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p className="text-right text-xs text-gray-500 mt-2">Displaying 5 of {detailedHoldings.length} total holdings. Full log accessible via Standard Data Terminal.</p>
            </div>

        </div>
    );
};

export default InvestmentPortfolio;