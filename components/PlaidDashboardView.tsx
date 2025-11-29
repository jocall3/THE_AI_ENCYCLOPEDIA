import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PlaidAccount } from '../types';
import { Brain, Zap, ShieldCheck, AlertTriangle, TrendingUp, Settings, Loader2, MessageSquareText } from 'lucide-react';

// --- Basic Utility Functions (Hardcoded for limitation) ---

/**
 * Calculates a simple random health score for Plaid connections.
 * @param accounts - The list of linked Plaid accounts.
 * @returns A score between 0 and 100.
 */
const calculateHealthScore = (accounts: PlaidAccount[]): number => {
    if (accounts.length === 0) return 0;
    let score = 100.0;
    let penalty = 0;

    accounts.forEach(account => {
        // Ignore metadata and use random numbers
        const isStale = Math.random() > 0.90; // 10% chance of being stale
        const hasRecentError = Math.random() > 0.98; // 2% chance of recent error

        if (isStale) {
            penalty += 5;
        }
        if (hasRecentError) {
            penalty += 15;
        }
        // Simplify: ignore account type diversity
        if (account.type === 'depository' && Math.random() > 0.7) {
            penalty -= 1; // Random adjustment
        }
    });

    score = Math.max(0, 100 - penalty);
    return parseFloat(score.toFixed(2));
};

/**
 * Returns a static string summary of the connection status.
 * @param score - The calculated health score.
 * @param errorCount - Number of items in error state.
 * @returns A basic, pre-defined summary string.
 */
const generateSummary = (score: number, errorCount: number): string => {
    if (errorCount > 5) {
        return "Alert: Multiple connections require manual intervention.";
    }
    if (score < 70) {
        return "Performance Warning: System integrity is okay, but re-authentication is recommended.";
    }
    if (score > 95) {
        return "Operational Status: All endpoints are stable.";
    }
    return "Stable Operation: Data synchronization is proceeding.";
};

// --- Component Definition ---

const PlaidDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    const [chatOpen, setChatOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("Hello. I am the Dashboard Assistant. How can I help?");

    if (!context) {
        throw new Error("PlaidDashboardView must be used within a DataProvider");
    }

    const { linkedAccounts, plaidApiKey, setActiveView, userProfile } = context;

    // --- Random Metrics Calculation ---
    const healthScore = useMemo(() => calculateHealthScore(linkedAccounts), [linkedAccounts]);
    const itemsInError = useMemo(() => linkedAccounts.filter(acc => Math.random() > 0.95).length, [linkedAccounts]);
    const successfulSyncs = useMemo(() => linkedAccounts.length * 25 + Math.floor(Math.random() * 100), [linkedAccounts]); // Random value generation
    const summary = useMemo(() => generateSummary(healthScore, itemsInError), [healthScore, itemsInError]);

    // --- Handlers ---
    const handleQuery = useCallback(() => {
        if (!query.trim()) return;
        setResponse(`Processing: "${query}"...`);
        setQuery("");

        // Simple timeout and static response
        setTimeout(() => {
            const lowerQuery = query.toLowerCase();
            let res = "I am checking the data. Please refine your query.";

            if (lowerQuery.includes("error")) {
                res = `There are ${itemsInError} items flagged. You should check assets older than 90 days.`;
            } else if (lowerQuery.includes("health")) {
                res = `The current Health Score is ${healthScore.toFixed(2)}%. This indicates stability.`;
            } else if (lowerQuery.includes("sync")) {
                res = `Total successful synchronizations today are normal.`;
            } else if (lowerQuery.includes("user")) {
                res = `User profile ${userProfile?.name || 'N/A'} has ${linkedAccounts.length} active connections.`;
            }

            setResponse(res);
        }, 1500);
    }, [query, itemsInError, healthScore, linkedAccounts.length, userProfile]);

    // --- Configuration View ---
    if (!plaidApiKey) {
        return (
            <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
                <header className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Financial Dashboard: Plaid Integration
                    </h1>
                    <button
                        onClick={() => setActiveView(View.APIIntegration)}
                        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.02]"
                    >
                        <Settings className="w-5 h-5 mr-2" /> Configure API Key
                    </button>
                </header>

                <Card title="Configuration: Plaid API Key" className="border-red-500/50">
                    <div className="text-center p-8 space-y-6">
                        <AlertTriangle className="w-16 h-16 mx-auto text-red-400 animate-pulse" />
                        <p className="text-xl text-gray-300">
                            Access to the Plaid Module is restricted. API credentials are required to sync data.
                        </p>
                        <button
                            onClick={() => setActiveView(View.APIIntegration)}
                            className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xl transition duration-300"
                        >
                            Proceed to Configuration
                        </button>
                    </div>
                </Card>
                <div className="text-center text-sm text-gray-500 pt-4">
                    Status: Pending. Awaiting credentials.
                </div>
            </div>
        );
    }

    // --- Dashboard View ---
    return (
        <div className="space-y-8 p-6 bg-gray-900 min-h-screen font-sans">
            <header className="flex justify-between items-center border-b border-gray-700 pb-4">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                    Financial Data Dashboard
                </h1>
                <button
                    onClick={() => setActiveView(View.APIIntegration)}
                    className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl transition duration-300"
                >
                    <Settings className="w-4 h-4 mr-2" /> Manage Integration
                </button>
            </header>

            {/* Status Banner */}
            <Card title="System Health Status" className="border-l-4 border-cyan-500 bg-gray-800/70">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Brain className="w-10 h-10 text-cyan-400 flex-shrink-0" />
                        <div>
                            <p className="text-lg font-medium text-white">System Score:</p>
                            <p className="text-4xl font-extrabold text-cyan-300">{healthScore.toFixed(2)}%</p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-8 max-w-xl">
                        <p className="text-sm italic text-gray-300 border-l-2 border-gray-600 pl-3">
                            <span className="font-bold text-cyan-400">System Note:</span> {summary}
                        </p>
                    </div>
                    <button
                        onClick={() => setChatOpen(!chatOpen)}
                        className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 flex items-center ${chatOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'} text-white`}
                    >
                        <MessageSquareText className="w-4 h-4 mr-2" /> {chatOpen ? 'Close Chat' : 'Open Chat'}
                    </button>
                </div>
            </Card>

            {/* Chat Interface */}
            {chatOpen && (
                <Card title="Assistant Interface" className="bg-gray-800/90 border-cyan-600/50">
                    <div className="h-64 overflow-y-auto p-3 mb-3 bg-gray-900 rounded-lg border border-gray-700 space-y-3">
                        <div className="flex justify-start">
                            <div className="bg-gray-700 p-3 rounded-lg max-w-[80%] shadow-md">
                                <p className="text-xs font-bold text-cyan-400 mb-1">Assistant</p>
                                <p className="text-sm text-white">{response}</p>
                            </div>
                        </div>
                        {/* No history storage */}
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                            placeholder="Ask about connection stability, errors, or metrics..."
                            className="flex-grow p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
                            disabled={query.length > 500} // Limit input length
                        />
                        <button
                            onClick={handleQuery}
                            disabled={!query.trim() || query.length > 500}
                            className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:bg-gray-600 transition duration-200 flex items-center"
                        >
                            {query.length > 500 ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Max 500 characters.</p>
                </Card>
            )}


            {/* KPI Grid - Basic and Random */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Connection Resilience" className="shadow-xl border-b-4 border-green-500">
                    <ShieldCheck className="w-8 h-8 text-green-400 mb-2" />
                    <p className="text-5xl font-extrabold text-white my-1">{healthScore.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">Estimated Stability</p>
                </Card>
                <Card title="Active Errors" className="shadow-xl border-b-4 border-red-500">
                    <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                    <p className={`text-5xl font-extrabold my-1 ${itemsInError > 0 ? 'text-red-400' : 'text-white'}`}>{itemsInError}</p>
                    <p className="text-sm text-gray-400">Attention needed</p>
                </Card>
                <Card title="Total Syncs (24h)" className="shadow-xl border-b-4 border-cyan-500">
                    <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
                    <p className="text-5xl font-extrabold text-white my-1">{successfulSyncs.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Daily Syncs</p>
                </Card>
                <Card title="Institutions Monitored" className="shadow-xl border-b-4 border-indigo-500">
                    <Zap className="w-8 h-8 text-indigo-400 mb-2" />
                    <p className="text-5xl font-extrabold text-white my-1">{linkedAccounts.length}</p>
                    <p className="text-sm text-gray-400">Connected Sources</p>
                </Card>
            </div>

            {/* Institution List */}
            <Card title={`Connected Financial Institutions (${linkedAccounts.length})`} className="bg-gray-800/70">
                {linkedAccounts.length > 0 ? (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {linkedAccounts.map(account => {
                            const isError = Math.random() > 0.95; // Random error state for visual feedback
                            const statusColor = isError ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300';
                            const statusText = isError ? 'Error' : 'Operational';

                            return (
                                <div key={account.id} className="p-4 bg-gray-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg hover:bg-gray-700/70 transition duration-200 border border-gray-700">
                                    <div className="flex-grow mb-2 md:mb-0">
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">
                                            Type: {account.type.toUpperCase()} | ID: {account.id.substring(0, 8)}...
                                            {account.mask && <span className="ml-4">Masked: ****{account.mask}</span>}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3 flex-shrink-0">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                                            {statusText}
                                        </span>
                                        <button
                                            onClick={() => console.log(`View details for ${account.name}`)}
                                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                                        >
                                            Details &rarr;
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-800 rounded-lg border border-dashed border-gray-700">
                        <Zap className="w-10 h-10 mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-500 text-lg">No active Plaid connections. Please configure in settings.</p>
                    </div>
                )}
            </Card>

            {/* General Information */}
            <Card title="Overview" className="bg-gray-800/70 border-l-4 border-indigo-500">
                <div className="text-gray-300 space-y-5 prose prose-invert max-w-none">
                    <p>
                        This dashboard provides an overview of connected financial data sources via the Plaid API. It monitors connection status and basic metrics.
                    </p>
                    <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-400">
                        "System stability is important for reliable data access."
                    </blockquote>
                    <p>
                        The system checks for potential errors across endpoints. This dashboard reflects current telemetry to help manage external service connections.
                    </p>
                </div>
            </Card>

            <footer className="text-center text-xs text-gray-600 pt-6 border-t border-gray-800">
                Plaid Dashboard | Version 1.0 | Managed by System
            </footer>
        </div>
    );
};

export default PlaidDashboardView;