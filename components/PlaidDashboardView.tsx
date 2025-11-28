import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';

const PlaidDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("PlaidDashboardView must be used within a DataProvider");
    }

    const { linkedAccounts, plaidApiKey, setActiveView } = context;

    if (!plaidApiKey) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">Plaid Dashboard</h2>
                 <Card title="Configuration Required">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">
                            Please configure your Plaid API Key to view the Plaid dashboard.
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

    // Mock data for dashboard widgets
    const connectionHealth = linkedAccounts.length > 0 ? 98.5 : 0;
    const itemsInError = linkedAccounts.filter(acc => Math.random() > 0.95).length;
    const successfulSyncs = linkedAccounts.length * 25; // mock value

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Plaid Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Connection Health">
                    <p className="text-5xl font-bold text-center text-green-400 my-4">{connectionHealth.toFixed(1)}%</p>
                </Card>
                <Card title="Items in Error State">
                    <p className={`text-5xl font-bold text-center my-4 ${itemsInError > 0 ? 'text-red-400' : 'text-white'}`}>{itemsInError}</p>
                </Card>
                <Card title="Successful Syncs (24h)">
                    <p className="text-5xl font-bold text-center text-white my-4">{successfulSyncs.toLocaleString()}</p>
                </Card>
            </div>

            <Card title="Connected Institutions">
                {linkedAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {linkedAccounts.map(account => (
                            <div key={account.id} className="p-3 bg-gray-800/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">{account.name}</p>
                                    <p className="text-xs text-gray-400">Accounts: {account.mask ? `Ending in ${account.mask}` : 'N/A'}</p>
                                </div>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300">
                                    Healthy
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No institutions linked via Plaid.</p>
                )}
            </Card>
        </div>
    );
};

export default PlaidDashboardView;
