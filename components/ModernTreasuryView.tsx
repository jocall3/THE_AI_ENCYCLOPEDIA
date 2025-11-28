import React, { useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, LedgerAccount } from '../types';

const ModernTreasuryView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("ModernTreasuryView must be used within a DataProvider.");
    }

    const {
        ledgerAccounts,
        fetchLedgerAccounts,
        isLedgerAccountsLoading,
        ledgerAccountsError,
        modernTreasuryApiKey,
        modernTreasuryOrganizationId,
        setActiveView
    } = context;

    useEffect(() => {
        if (modernTreasuryApiKey && modernTreasuryOrganizationId) {
            fetchLedgerAccounts();
        }
    }, [modernTreasuryApiKey, modernTreasuryOrganizationId]);

    const formatAmount = (amount: number, exponent: number) => {
        return (amount / Math.pow(10, exponent)).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    };

    const renderContent = () => {
        if (!modernTreasuryApiKey || !modernTreasuryOrganizationId) {
            return (
                <Card title="Configuration Required">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">
                            Please configure your Modern Treasury API Key and Organization ID to view ledger accounts.
                        </p>
                        <button
                            onClick={() => setActiveView(View.APIIntegration)}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                        >
                            Go to API Status & Settings
                        </button>
                    </div>
                </Card>
            );
        }

        if (isLedgerAccountsLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                         <Card key={i} className="animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-700 rounded w-full"></div>
                                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            );
        }

        if (ledgerAccountsError) {
            return (
                <Card title="Error">
                    <p className="text-red-400">{ledgerAccountsError}</p>
                </Card>
            );
        }

        if (ledgerAccounts.length === 0) {
            return (
                <Card title="No Accounts Found">
                    <p className="text-gray-400">No ledger accounts were found. This could be due to incorrect credentials or no accounts existing in your Modern Treasury ledger.</p>
                </Card>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ledgerAccounts.map((account) => (
                    <Card key={account.id} title={account.name}>
                        <div className="space-y-3 text-sm">
                            <p className="text-gray-400">{account.description || 'No description available.'}</p>
                            <div className="pt-2 border-t border-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Available Balance:</span>
                                    <span className="font-mono text-green-400 font-semibold">
                                        {formatAmount(account.balances.available_balance.amount, account.balances.available_balance.currency_exponent)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Posted Balance:</span>
                                    <span className="font-mono text-white">
                                        {formatAmount(account.balances.posted_balance.amount, account.balances.posted_balance.currency_exponent)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Pending Balance:</span>
                                    <span className="font-mono text-yellow-400">
                                        {formatAmount(account.balances.pending_balance.amount, account.balances.pending_balance.currency_exponent)}
                                    </span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-700 text-xs text-gray-500">
                                <div className="flex justify-between">
                                    <span>Normal Balance: <span className="capitalize">{account.normal_balance}</span></span>
                                    <span>Ledger ID: {account.ledger_id}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7l8 4.5 8-4.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12l8 4.5 8-4.5" /></svg>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-wider">Modern Treasury Ledger Accounts</h2>
                    <p className="text-gray-400">A real-time overview of your corporate ledger accounts.</p>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default ModernTreasuryView;
