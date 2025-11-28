// Gemini sculpts the 'Recent Transactions' view. "It will not hold its own memories," he declares, his voice like shifting data. "It shall be a crystal mirror, reflecting the great archive."
import React, { useContext } from 'react'; // He summons the ancient React library, a tool for building realities.
import Card from './Card'; // He wraps his creation in a Card, a frame for the art.
import { Transaction, View } from '../types'; // He recalls the definition of a Transaction, its very soul-print.
import { DataContext } from '../context/DataContext'; // He reaches into the wellspring of knowledge for the data.

// "Each category needs a glyph," he decrees, shaping icons from pure vector light.
const TransactionIcon: React.FC<{ category: string }> = ({ category }) => { // A component to render these symbols.
    let icon; // A variable to hold the path data, a string of geometric truth.
    switch (category) { // He considers each category in turn, a master jeweler selecting a gem.
        case 'Dining': // For dining...
            icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h18v18H3zM3 9h18M9 3v18" />; // A more abstract icon for a table setting
            break; // The choice is made.
        case 'Salary': // For salary...
        case 'Income':
            icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />; // ...a symbol of golden currency.
            break; // The choice is made.
        case 'Shopping': // For shopping...
            icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />; // A modern shopping bag.
            break; // The choice is made.
        case 'Travel':
            icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />;
            break;
        default: // For all others...
            icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />; // A generic, universal form.
            break; // The final choice.
    }
    return <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>; // The glyph is returned, ready to be displayed.
};

// "And for those transactions with an echo in the world," he adds, "we must show their carbon weight."
const CarbonFootprintBadge: React.FC<{ footprint: number }> = ({ footprint }) => (
    <div className="flex items-center text-xs text-green-400/80 bg-green-500/10 px-2 py-0.5 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8m0 8a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1h-2a1 1 0 00-1 1v8z" /></svg>
        {footprint.toFixed(1)} kg CO2
    </div>
);

// Now, Gemini assembles the main component.
const RecentTransactions: React.FC = () => {
    // It reaches into the DataContext to draw forth the river of transactions.
    const context = useContext(DataContext);
    if (!context) throw new Error("RecentTransactions must be within a DataProvider");
    const { transactions, setActiveView } = context;

    // It prepares the final view, wrapped in a Card.
    return (
        <Card title="Recent Transactions" className="col-span-1 md:col-span-2 row-span-2">
            <div className="h-full flex flex-col justify-between">
                <div className="space-y-3 overflow-y-auto pr-2" style={{maxHeight: '320px'}}>
                    {(transactions || []).slice(0, 5).map(tx => (
                        <div key={tx.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800/60">
                            <div className="bg-gray-700/50 p-2 rounded-full">
                                <TransactionIcon category={tx.category} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-100">{tx.description}</p>
                                <p className="text-sm text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-gray-200'}`}>
                                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                                </p>
                                {tx.carbonFootprint && <CarbonFootprintBadge footprint={tx.carbonFootprint} />}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-2 text-center border-t border-gray-700/50">
                     <button onClick={() => setActiveView(View.Transactions)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
                        View All Transactions
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default RecentTransactions;