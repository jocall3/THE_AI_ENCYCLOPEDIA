import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, StripeBalance, StripeCharge } from '../types';

// Mock data generation within the component for demonstration
const generateMockStripeData = (): { balance: StripeBalance; charges: StripeCharge[] } => {
    const balance: StripeBalance = {
        available: [{ amount: 7854023, currency: 'usd' }],
        pending: [{ amount: 1234567, currency: 'usd' }],
    };
    const charges: StripeCharge[] = Array.from({ length: 5 }, (_, i) => ({
        id: `ch_3Pabcde${i}`,
        amount: Math.floor(Math.random() * 20000) + 100,
        currency: 'usd',
        status: ['succeeded', 'pending', 'failed'][i % 3] as 'succeeded' | 'pending' | 'failed',
        created: Math.floor(Date.now() / 1000) - i * 3600,
        description: `Charge for order #${Math.floor(Math.random() * 1000)}`
    }));
    return { balance, charges };
};

const StripeDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("StripeDashboardView must be used within a DataProvider");
    }
    const { stripeApiKey, setActiveView } = context;

    const mockData = generateMockStripeData();

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
    };

    if (!stripeApiKey) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Stripe Dashboard</h2>
                 <Card title="Configuration Required">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">
                            Please configure your Stripe API Key to view the Stripe dashboard.
                        </p>
                        <button
                            onClick={() => setActiveView(View.APIIntegration)}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                        >
                            Go to API Settings
                        </button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Stripe Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card title="Gross Volume (24h)">
                    <p className="text-4xl font-bold text-center text-white my-4">$1.2M</p>
                </Card>
                 <Card title="Successful Payments">
                    <p className="text-4xl font-bold text-center text-green-400 my-4">99.2%</p>
                </Card>
                 <Card title="New Customers">
                    <p className="text-4xl font-bold text-center text-white my-4">3,450</p>
                </Card>
                 <Card title="Disputes">
                     <p className="text-4xl font-bold text-center text-red-400 my-4">3</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Balance" className="lg:col-span-1">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-400">Available</p>
                            <p className="text-3xl font-bold text-white">{formatCurrency(mockData.balance.available[0].amount, mockData.balance.available[0].currency)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-400">Pending</p>
                            <p className="text-2xl font-semibold text-gray-300">{formatCurrency(mockData.balance.pending[0].amount, mockData.balance.pending[0].currency)}</p>
                        </div>
                    </div>
                </Card>

                <Card title="Recent Charges" className="lg:col-span-2">
                     <div className="space-y-3">
                        {mockData.charges.map(charge => (
                            <div key={charge.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-white">{charge.description}</p>
                                    <p className="text-xs text-gray-400">{new Date(charge.created * 1000).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-white font-semibold">{formatCurrency(charge.amount, charge.currency)}</p>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        charge.status === 'succeeded' ? 'bg-green-500/20 text-green-300' : 
                                        charge.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                                        'bg-red-500/20 text-red-300'}`
                                    }>
                                        {charge.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StripeDashboardView;
