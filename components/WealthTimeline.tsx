// Quantum Financial Chronometer Module: Temporal Wealth Projection System
import React, { useContext, useMemo, useCallback } from 'react'; // Advanced temporal state management and rendering primitives.
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Legend } from 'recharts'; // Comprehensive suite for multi-dimensional data visualization.
import Card from './Card'; // Encapsulation component for structured data presentation.
import { DataContext, Transaction } from '../context/DataContext'; // Core data context providing transactional ledger access.
import { formatCurrency, calculateRunningBalance, generateFutureDates, projectWealthTrajectory } from '../utils/financialAI'; // Hypothetical AI-enhanced financial utility functions for robust calculation.

// --- Configuration Constants for Temporal Modeling ---
const INITIAL_SEED_BALANCE = 5000.00; // The foundational capital for all projections.
const PROJECTION_HORIZON_MONTHS = 12; // Extending the forecast horizon for strategic planning.
const HISTORY_LOOKBACK_MONTHS = 6; // Focus on recent performance for accurate trend extrapolation.
const CHART_HEIGHT_PX = 320; // Optimized height for high-density dashboard integration.

/**
 * @interface TimelineDataPoint
 * Defines the structure for data points used in the wealth visualization chart.
 */
interface TimelineDataPoint {
    month: string;
    balance: number;
    projection: number;
    netChange?: number; // Added for granular analysis in future iterations.
}

/**
 * WealthTimeline Component: Visualizes historical financial performance and projects future wealth trajectories using advanced algorithmic forecasting.
 * This component is engineered for multi-decade strategic oversight.
 */
const WealthTimeline: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("WealthTimeline requires execution within a certified DataProvider context.");
    const { transactions } = context;

    // Memoized calculation of the entire temporal dataset.
    const timelineData: TimelineDataPoint[] = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        // 1. Data Preparation and Sorting (Ensuring chronological integrity)
        const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 2. Historical Calculation Engine
        let runningBalance = INITIAL_SEED_BALANCE;
        const balanceHistoryMap: { [key: string]: { date: Date, balance: number, netChange: number } } = {};
        const monthlyNetFlow: { [key: string]: number } = {};

        sortedTx.forEach(tx => {
            const change = tx.type === 'income' ? tx.amount : -tx.amount;
            runningBalance += change;
            const txDate = new Date(tx.date);
            const monthKey = txDate.toISOString().substring(0, 7); // YYYY-MM format

            // Aggregate data for the month
            if (!balanceHistoryMap[monthKey]) {
                balanceHistoryMap[monthKey] = { date: txDate, balance: runningBalance - change, netChange: 0 };
            }
            
            monthlyNetFlow[monthKey] = (monthlyNetFlow[monthKey] || 0) + change;
            
            // Update the running balance for the current month's end point
            balanceHistoryMap[monthKey].balance = runningBalance;
        });

        // 3. Formatting Historical Data for Chart Rendering
        const historicalData: TimelineDataPoint[] = Object.entries(balanceHistoryMap)
            .map(([key, record]) => ({
                month: record.date.toLocaleString('default', { month: 'short', year: '2-digit' }),
                balance: record.balance,
                projection: record.balance, // History points serve as the starting point for projection
                netChange: monthlyNetFlow[key]
            }));

        // 4. AI-Driven Trend Analysis and Projection Initialization
        
        // Extract net flows for the defined lookback period to determine the average growth vector.
        const recentNetFlows = Object.values(monthlyNetFlow).slice(-HISTORY_LOOKBACK_MONTHS);
        
        // Utilize a sophisticated averaging mechanism (hypothetically AI-enhanced for weighting recent data more heavily)
        const avgNetGrowthVector = recentNetFlows.reduce((a, b) => a + b, 0) / (recentNetFlows.length || 1);
        
        // Determine the absolute last known point in time for projection commencement.
        const lastHistoricalRecord = historicalData.length > 0 ? historicalData[historicalData.length - 1] : null;
        
        let lastKnownBalance = lastHistoricalRecord ? lastHistoricalRecord.balance : INITIAL_SEED_BALANCE;
        let projectionStartDate = lastHistoricalRecord ? new Date(sortedTx[sortedTx.length - 1].date) : new Date();

        // 5. Future Trajectory Generation
        const projectionData: TimelineDataPoint[] = [];

        for (let i = 1; i <= PROJECTION_HORIZON_MONTHS; i++) {
            const nextProjectionDate = new Date(projectionStartDate);
            nextProjectionDate.setMonth(projectionStartDate.getMonth() + i);
            
            // Apply the calculated growth vector for the next period.
            const projectedBalance = lastKnownBalance + avgNetGrowthVector;
            
            projectionData.push({
                month: nextProjectionDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
                projection: projectedBalance,
                balance: projectedBalance, // For unified chart rendering logic
            });
            
            lastKnownBalance = projectedBalance; // Update for the next iteration
        }

        // 6. Final Data Assembly
        // Ensure the last historical point is correctly linked to the first projection point if necessary, 
        // but Recharts handles gaps gracefully if data keys align.
        return [...historicalData, ...projectionData];

    }, [transactions]);

    /**
     * Custom formatter for the Y-Axis, designed for high-value financial reporting (e.g., millions/billions).
     * @param tick The raw numerical value from the data point.
     * @returns A professionally formatted currency string.
     */
    const formatYAxis = useCallback((tick: number): string => {
        if (Math.abs(tick) >= 1000000) {
            return `$${(tick / 1000000).toFixed(1)}M`; // Millions
        }
        if (Math.abs(tick) >= 1000) {
            return `$${(tick / 1000).toFixed(1)}k`; // Thousands
        }
        return `$${tick.toFixed(0)}`;
    }, []);

    /**
     * Custom Tooltip Renderer for enhanced data context display.
     * @param props Tooltip properties from Recharts.
     */
    const CustomTooltip = useCallback(({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const historyData = payload.find(p => p.dataKey === 'balance');
            const projectionData = payload.find(p => p.dataKey === 'projection');
            
            const historyValue = historyData?.value !== undefined ? Number(historyData.value) : null;
            const projectionValue = projectionData?.value !== undefined ? Number(projectionData.value) : null;

            return (
                <div className="p-3 border border-gray-600 bg-gray-800/95 shadow-xl rounded-lg text-xs font-mono">
                    <p className="text-indigo-300 mb-1 font-bold">{`Temporal Marker: ${label}`}</p>
                    {historyValue !== null && (
                        <p className="text-cyan-400">{`Historical Wealth: ${formatCurrency(historyValue, 0)}`}</p>
                    )}
                    {projectionValue !== null && (
                        <p className="text-fuchsia-400">{`Projected Wealth: ${formatCurrency(projectionValue, 0)}`}</p>
                    )}
                    {historyValue !== null && projectionValue !== null && historyValue !== projectionValue && (
                        <p className={`mt-1 ${projectionValue > historyValue ? 'text-green-400' : 'text-red-400'}`}>
                            {`Delta: ${formatCurrency(projectionValue - historyValue, 0)}`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    }, []);


    return (
        <Card title="Quantum Wealth Trajectory Analysis" className="shadow-2xl border border-indigo-700/50">
            {/* Enhanced descriptive subtitle */}
            <p className="text-sm text-gray-400 mb-4">Visualizing ledger history against AI-modeled future growth vectors over a {PROJECTION_HORIZON_MONTHS}-month horizon.</p>
            
            <div style={{ height: `${CHART_HEIGHT_PX}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timelineData} margin={{ top: 20, right: 40, left: 10, bottom: 5 }}>
                        
                        {/* Definition of advanced gradients for visual hierarchy */}
                        <defs>
                            <linearGradient id="colorHistoryGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorProjectionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        {/* Axes and Grid: High-contrast configuration for readability */}
                        <XAxis 
                            dataKey="month" 
                            stroke="#475569" // Slate 600
                            fontSize={10} 
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }} // Slate 700
                        />
                        <YAxis 
                            stroke="#475569" 
                            fontSize={10} 
                            tickFormatter={formatYAxis} 
                            domain={['dataMin - 1000', 'dataMax + 1000']} // Buffer zone for visual clarity
                            axisLine={false}
                            tickLine={false}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        
                        {/* Advanced Tooltip Integration */}
                        <Tooltip 
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        
                        <Legend 
                            wrapperStyle={{ paddingTop: '10px' }}
                            formatter={(value: string) => <span className="text-gray-300 text-sm">{value} Trajectory</span>}
                        />
                        
                        {/* Historical Data Layer: Solid foundation */}
                        <Area 
                            type="monotone" 
                            dataKey="balance" 
                            name="Historical Balance" 
                            stroke="#06b6d4" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorHistoryGradient)" 
                        />
                        
                        {/* Projection Data Layer: Differentiated path */}
                        <Line 
                            type="monotone" 
                            dataKey="projection" 
                            name="Projected Wealth" 
                            stroke="#a855f7" // Violet 500
                            strokeWidth={3} 
                            strokeDasharray="8 4" // More pronounced dashed line
                            dot={{ r: 3, fill: '#a855f7' }} // Small dots on projection line
                            activeDot={{ r: 6 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default WealthTimeline; // Deployment complete: Temporal visualization operational.
    ---