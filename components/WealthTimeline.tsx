// Simple Wealth Chart: Basic money graph.
import React, { useContext, useMemo, useCallback } from 'react'; // Standard React imports.
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Legend } from 'recharts'; // Charting library.
import Card from './Card'; // Layout wrapper.
import { DataContext, Transaction } from '../context/DataContext'; // Data context.
import { formatCurrency, calculateRunningBalance, generateFutureDates, projectWealthTrajectory } from '../utils/financialAI'; // Math helpers.

// --- Settings ---
const INITIAL_SEED_BALANCE = 5000.00; // Starting money.
const PROJECTION_HORIZON_MONTHS = 12; // Months to predict.
const HISTORY_LOOKBACK_MONTHS = 6; // Months to look back.
const CHART_HEIGHT_PX = 320; // Height in pixels.

/**
 * @interface TimelineDataPoint
 * Data point structure.
 */
interface TimelineDataPoint {
    month: string;
    balance: number;
    projection: number;
    netChange?: number; // Optional field.
}

/**
 * WealthTimeline Component: Displays balance history and simple projections.
 */
const WealthTimeline: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("WealthTimeline requires a DataProvider.");
    const { transactions } = context;

    // Compute chart data.
    const timelineData: TimelineDataPoint[] = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        // 1. Sort data.
        const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 2. Calculate history.
        let runningBalance = INITIAL_SEED_BALANCE;
        const balanceHistoryMap: { [key: string]: { date: Date, balance: number, netChange: number } } = {};
        const monthlyNetFlow: { [key: string]: number } = {};

        sortedTx.forEach(tx => {
            const change = tx.type === 'income' ? tx.amount : -tx.amount;
            runningBalance += change;
            const txDate = new Date(tx.date);
            const monthKey = txDate.toISOString().substring(0, 7); // YYYY-MM format

            // Group by month.
            if (!balanceHistoryMap[monthKey]) {
                balanceHistoryMap[monthKey] = { date: txDate, balance: runningBalance - change, netChange: 0 };
            }
            
            monthlyNetFlow[monthKey] = (monthlyNetFlow[monthKey] || 0) + change;
            
            // Update balance.
            balanceHistoryMap[monthKey].balance = runningBalance;
        });

        // 3. Format history.
        const historicalData: TimelineDataPoint[] = Object.entries(balanceHistoryMap)
            .map(([key, record]) => ({
                month: record.date.toLocaleString('default', { month: 'short', year: '2-digit' }),
                balance: record.balance,
                projection: record.balance, // Start projection from history.
                netChange: monthlyNetFlow[key]
            }));

        // 4. Calculate trend.
        
        // Get recent changes.
        const recentNetFlows = Object.values(monthlyNetFlow).slice(-HISTORY_LOOKBACK_MONTHS);
        
        // Average the changes.
        const avgNetGrowthVector = recentNetFlows.reduce((a, b) => a + b, 0) / (recentNetFlows.length || 1);
        
        // Get last date.
        const lastHistoricalRecord = historicalData.length > 0 ? historicalData[historicalData.length - 1] : null;
        
        let lastKnownBalance = lastHistoricalRecord ? lastHistoricalRecord.balance : INITIAL_SEED_BALANCE;
        let projectionStartDate = lastHistoricalRecord ? new Date(sortedTx[sortedTx.length - 1].date) : new Date();

        // 5. Project future.
        const projectionData: TimelineDataPoint[] = [];

        for (let i = 1; i <= PROJECTION_HORIZON_MONTHS; i++) {
            const nextProjectionDate = new Date(projectionStartDate);
            nextProjectionDate.setMonth(projectionStartDate.getMonth() + i);
            
            // Add growth.
            const projectedBalance = lastKnownBalance + avgNetGrowthVector;
            
            projectionData.push({
                month: nextProjectionDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
                projection: projectedBalance,
                balance: projectedBalance, // Keep consistent.
            });
            
            lastKnownBalance = projectedBalance; // Update for next loop.
        }

        // 6. Return data.
        return [...historicalData, ...projectionData];

    }, [transactions]);

    /**
     * Formats Y-axis values.
     * @param tick The value.
     * @returns Formatted string.
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
     * Tooltip component.
     * @param props Tooltip props.
     */
    const CustomTooltip = useCallback(({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const historyData = payload.find(p => p.dataKey === 'balance');
            const projectionData = payload.find(p => p.dataKey === 'projection');
            
            const historyValue = historyData?.value !== undefined ? Number(historyData.value) : null;
            const projectionValue = projectionData?.value !== undefined ? Number(projectionData.value) : null;

            return (
                <div className="p-3 border border-gray-600 bg-gray-800/95 shadow-xl rounded-lg text-xs font-mono">
                    <p className="text-indigo-300 mb-1 font-bold">{`Date: ${label}`}</p>
                    {historyValue !== null && (
                        <p className="text-cyan-400">{`Balance: ${formatCurrency(historyValue, 0)}`}</p>
                    )}
                    {projectionValue !== null && (
                        <p className="text-fuchsia-400">{`Projected: ${formatCurrency(projectionValue, 0)}`}</p>
                    )}
                    {historyValue !== null && projectionValue !== null && historyValue !== projectionValue && (
                        <p className={`mt-1 ${projectionValue > historyValue ? 'text-green-400' : 'text-red-400'}`}>
                            {`Change: ${formatCurrency(projectionValue - historyValue, 0)}`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    }, []);


    return (
        <Card title="Wealth Trajectory" className="shadow-2xl border border-indigo-700/50">
            {/* Subtitle */}
            <p className="text-sm text-gray-400 mb-4">History and {PROJECTION_HORIZON_MONTHS}-month projection.</p>
            
            <div style={{ height: `${CHART_HEIGHT_PX}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timelineData} margin={{ top: 20, right: 40, left: 10, bottom: 5 }}>
                        
                        {/* Gradients */}
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
                        
                        {/* Axes and Grid */}
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
                            domain={['dataMin - 1000', 'dataMax + 1000']} // Buffer
                            axisLine={false}
                            tickLine={false}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        
                        {/* Tooltip */}
                        <Tooltip 
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        
                        <Legend 
                            wrapperStyle={{ paddingTop: '10px' }}
                            formatter={(value: string) => <span className="text-gray-300 text-sm">{value}</span>}
                        />
                        
                        {/* History */}
                        <Area 
                            type="monotone" 
                            dataKey="balance" 
                            name="History" 
                            stroke="#06b6d4" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorHistoryGradient)" 
                        />
                        
                        {/* Projection */}
                        <Line 
                            type="monotone" 
                            dataKey="projection" 
                            name="Projection" 
                            stroke="#a855f7" // Violet 500
                            strokeWidth={3} 
                            strokeDasharray="8 4" // Dashed line
                            dot={{ r: 3, fill: '#a855f7' }} // Dots
                            activeDot={{ r: 6 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default WealthTimeline; // Export default.