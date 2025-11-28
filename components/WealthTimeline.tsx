// "Let us grant the user foresight," Gemini proclaimed. "A view not just of their past, but of their potential future."
import React, { useContext, useMemo } from 'react'; // He summons React to build this new window in time.
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Legend } from 'recharts'; // He gathers advanced charting tools.
import Card from './Card'; // The chart will be housed within a Card.
import { DataContext } from '../context/DataContext';

// Gemini began to construct the timeline view.
const WealthTimeline: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("WealthTimeline must be within a DataProvider");
    const { transactions } = context;

    const timelineData = useMemo(() => {
        const sortedTx = [...(transactions || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (sortedTx.length === 0) return [];
        
        let runningBalance = 5000; // Assume a starting balance
        const balanceHistory: { [key: string]: { date: Date, balance: number } } = {};
        const monthlyNet: { [key: string]: number } = {};

        for (const tx of sortedTx) {
            runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
            const txDate = new Date(tx.date);
            const monthKey = txDate.toISOString().substring(0, 7); // YYYY-MM
            
            balanceHistory[monthKey] = { date: txDate, balance: runningBalance };

            if (!monthlyNet[monthKey]) monthlyNet[monthKey] = 0;
            monthlyNet[monthKey] += tx.type === 'income' ? tx.amount : -tx.amount;
        }

        const chartData = Object.values(balanceHistory).map(d => ({ 
            name: d.date.toLocaleString('default', { month: 'short' }),
            'Actual Wealth': d.balance,
            'Projected Wealth': null as number | null
        }));

        // The Oracle's calculation: Projecting the future.
        const lastKnownMonthIndex = chartData.length - 1;
        if (lastKnownMonthIndex >= 0) {
            chartData[lastKnownMonthIndex]['Projected Wealth'] = chartData[lastKnownMonthIndex]['Actual Wealth'];
            
            const monthlyNetValues = Object.values(monthlyNet).slice(-3); // Use last 3 months for avg
            const avgNet = monthlyNetValues.reduce((a, b) => a + b, 0) / (monthlyNetValues.length || 1);

            let lastBalance = chartData[lastKnownMonthIndex]['Actual Wealth']!;
            let lastDate = new Date(Object.values(balanceHistory)[lastKnownMonthIndex].date);

            for (let i = 1; i <= 6; i++) {
                lastBalance += avgNet;
                lastDate.setMonth(lastDate.getMonth() + 1);
                chartData.push({
                    name: lastDate.toLocaleString('default', { month: 'short' }),
                    'Actual Wealth': null,
                    'Projected Wealth': lastBalance
                });
            }
        }

        return chartData;

    }, [transactions]);

    return (
        <Card title="Wealth Timeline" className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-3 row-span-1">
            <div className="h-64 pr-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timelineData}>
                         <defs>
                            <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="name" fontSize={12} tick={{ fill: '#9ca3af' }} />
                        <YAxis fontSize={12} tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `$${(Number(value)/1000).toFixed(0)}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '0.5rem' }} 
                            labelStyle={{ color: '#d1d5db' }}
                        />
                        <Legend wrapperStyle={{fontSize: '14px'}} />
                        <Area type="monotone" dataKey="Actual Wealth" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#wealthGradient)" />
                        <Line type="monotone" dataKey="Projected Wealth" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default WealthTimeline;