import React, { useContext, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card';
import { DataContext } from '../context/DataContext';

const BalanceSummary: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("BalanceSummary must be within a DataProvider");
    const { transactions } = context;

    const { chartData, totalBalance, change30d } = useMemo(() => {
        const sortedTx = [...(transactions || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let runningBalance = 0;
        const balanceHistory: { date: Date, balance: number }[] = [];

        // We assume a starting balance of 5000 for a more realistic chart base
        runningBalance = 5000;
        balanceHistory.push({ date: new Date(sortedTx[0]?.date || Date.now()), balance: runningBalance });


        for (const tx of sortedTx) {
            if (tx.type === 'income') {
                runningBalance += tx.amount;
            } else {
                runningBalance -= tx.amount;
            }
            balanceHistory.push({ date: new Date(tx.date), balance: runningBalance });
        }
        
        const totalBalance = runningBalance;

        // For chart, group by month
        const monthlyData: { [key: string]: { date: Date, balance: number} } = {};
        for (const record of balanceHistory) {
            const monthKey = record.date.toISOString().substring(0, 7); // e.g., '2023-01'
            monthlyData[monthKey] = record; // Store last balance for each month
        }
        
        const chartData = Object.values(monthlyData).map(d => ({ 
            name: d.date.toLocaleString('default', { month: 'short' }),
            balance: d.balance
        }));

        // Calculate 30-day change
        const date30daysAgo = new Date();
        date30daysAgo.setDate(date30daysAgo.getDate() - 30);
        const balance30daysAgo = balanceHistory.find(b => b.date >= date30daysAgo)?.balance || balanceHistory[0]?.balance || 5000;
        const change30d = totalBalance - balance30daysAgo;

        return { chartData, totalBalance, change30d };

    }, [transactions]);

    const changeIsPositive = change30d >= 0;

    return (
        <Card title="Total Balance" className="col-span-1 md:col-span-2 row-span-2 relative">
            <div className="h-full flex flex-col justify-between">
                <div>
                    <p className="text-4xl font-bold tracking-tighter">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div className={`flex items-center text-sm font-semibold ${changeIsPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {changeIsPositive ? '▲' : '▼'}
                        ${Math.abs(change30d).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (30d)
                    </div>
                </div>
                <div className="h-48 md:h-64 -ml-6 -mr-2 -mb-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '0.5rem' }} 
                                labelStyle={{ color: '#d1d5db' }}
                            />
                            <Area type="monotone" dataKey="balance" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#balanceGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default BalanceSummary;