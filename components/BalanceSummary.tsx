import React, { useContext, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card';
import { DataContext } from '../context/DataContext';

const BalanceSummary: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BalanceSummary must be within a DataProvider");
    const { transactions } = context;

    const { chartData, totalBalance, change30d, projectedBalance, volatilityIndex, aiInsight } = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return { chartData: [], totalBalance: 0, change30d: 0, projectedBalance: 0, volatilityIndex: 0, aiInsight: "Insufficient data for AI analysis." };
        }

        const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let runningBalance = 0;
        const balanceHistory: { date: Date, balance: number }[] = [];
        let volatilitySum = 0;

        for (const tx of sortedTx) {
            const prevBalance = runningBalance;
            if (tx.type === 'income') {
                runningBalance += tx.amount;
            } else {
                runningBalance -= tx.amount;
            }
            balanceHistory.push({ date: new Date(tx.date), balance: runningBalance });
            
            if (prevBalance !== 0) {
                const change = Math.abs(runningBalance - prevBalance) / prevBalance;
                volatilitySum += change;
            }
        }
        
        const currentTotalBalance = runningBalance;
        const volatilityIndex = balanceHistory.length > 0 ? (volatilitySum / balanceHistory.length) * 100 : 0;

        // AI Projection Logic (Linear Regression based on last 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const recentHistory = balanceHistory.filter(h => h.date >= ninetyDaysAgo);
        
        let projectedBalance = currentTotalBalance;
        if (recentHistory.length > 1) {
            const n = recentHistory.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            const startTimestamp = recentHistory[0].date.getTime();

            for (const point of recentHistory) {
                const x = (point.date.getTime() - startTimestamp) / (1000 * 60 * 60 * 24); // Days since start
                const y = point.balance;
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumXX += x * x;
            }

            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            const daysInFuture = 30;
            const lastDayX = (recentHistory[recentHistory.length - 1].date.getTime() - startTimestamp) / (1000 * 60 * 60 * 24);
            projectedBalance = slope * (lastDayX + daysInFuture) + intercept;
        }

        // For chart, group by month, taking the last balance of each month
        const monthlyData: { [key: string]: { date: Date, balance: number} } = {};
        for (const record of balanceHistory) {
            const monthKey = record.date.toISOString().substring(0, 7); // YYYY-MM
            monthlyData[monthKey] = record; 
        }
        
        const chartData = Object.values(monthlyData)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map(record => ({ 
                name: record.date.toLocaleString('default', { month: 'short' }), 
                balance: record.balance 
            }));

        // 30 day change calculation
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const lastKnownBalanceBefore30d = [...balanceHistory]
          .reverse()
          .find(h => h.date < thirtyDaysAgo)?.balance;

        const balance30dAgo = lastKnownBalanceBefore30d || 0;
        const change30d = currentTotalBalance - balance30dAgo;

        // AI Insight Generation
        let aiInsight = "Stable financial trajectory detected.";
        if (change30d < 0 && Math.abs(change30d) > currentTotalBalance * 0.1) {
            aiInsight = "AI Alert: Significant capital outflow detected in the last 30 days. Review expense categories immediately.";
        } else if (change30d > 0 && change30d > currentTotalBalance * 0.2) {
            aiInsight = "AI Analysis: Strong growth momentum. Consider reinvestment strategies for surplus capital.";
        } else if (volatilityIndex > 5) {
            aiInsight = "AI Warning: High balance volatility detected. Cash flow stabilization recommended.";
        }

        return { chartData, totalBalance: currentTotalBalance, change30d, projectedBalance, volatilityIndex, aiInsight };
    }, [transactions]);
    
    const balance30dAgo = totalBalance - change30d;
    const changePercentage = balance30dAgo !== 0 ? (change30d / balance30dAgo) * 100 : 0;

    return (
        <Card title="Enterprise Balance Intelligence">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider">Current Liquidity</p>
                        <p className="text-5xl font-extrabold text-white tracking-tight mt-1">
                            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className={`text-sm font-medium px-2 py-0.5 rounded ${change30d >= 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                {change30d >= 0 ? '▲' : '▼'} {Math.abs(changePercentage).toFixed(2)}%
                            </span>
                            <span className="text-gray-500 text-xs">vs last 30 days</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-sm uppercase tracking-wider">AI Projected (30d)</p>
                        <p className="text-2xl font-bold text-blue-400 mt-1">
                            ${projectedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Based on linear regression model</p>
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <p className="text-purple-400 text-xs font-bold uppercase">AI Strategic Insight</p>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {aiInsight}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/30 p-3 rounded border border-gray-800">
                        <p className="text-gray-500 text-xs uppercase">Volatility Index</p>
                        <p className={`text-lg font-semibold ${volatilityIndex > 5 ? 'text-orange-400' : 'text-blue-300'}`}>
                            {volatilityIndex.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gray-900/30 p-3 rounded border border-gray-800">
                        <p className="text-gray-500 text-xs uppercase">Net Change (30d)</p>
                        <p className={`text-lg font-semibold ${change30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {change30d >= 0 ? '+' : ''}${change30d.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                    </div>
                </div>

                <div className="h-72 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorStroke" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="name" 
                                stroke="#6b7280" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#6b7280" 
                                fontSize={10} 
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${(Number(value)/1000).toFixed(0)}k`} 
                            />
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#111827',
                                    borderColor: '#374151',
                                    color: '#f3f4f6',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: '#22d3ee' }}
                                formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Balance']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="balance" 
                                stroke="url(#colorStroke)" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorBalance)" 
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default BalanceSummary;