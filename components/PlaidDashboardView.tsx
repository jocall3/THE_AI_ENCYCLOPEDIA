import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PlaidAccount } from '../types';
import { Brain, Zap, ShieldCheck, AlertTriangle, TrendingUp, Settings, Loader2, MessageSquareText } from 'lucide-react';

// --- AI Enhanced Utility Functions (Simulated for expansion) ---

/**
 * Simulates a complex AI-driven health scoring mechanism for Plaid connections.
 * @param accounts - The list of linked Plaid accounts.
 * @returns A score between 0 and 100.
 */
const calculateAIAssessedHealthScore = (accounts: PlaidAccount[]): number => {
    if (accounts.length === 0) return 0;
    let score = 100.0;
    let penalty = 0;

    accounts.forEach(account => {
        // Simulate AI analysis based on metadata (if available, otherwise mock)
        const isStale = Math.random() > 0.90; // 10% chance of being stale
        const hasRecentError = Math.random() > 0.98; // 2% chance of recent error

        if (isStale) {
            penalty += 5;
        }
        if (hasRecentError) {
            penalty += 15;
        }
        // Add complexity: check for account type diversity (mocked)
        if (account.type === 'depository' && Math.random() > 0.7) {
            penalty -= 1; // Positive reinforcement for diversity
        }
    });

    score = Math.max(0, 100 - penalty);
    return parseFloat(score.toFixed(2));
};

/**
 * Simulates an AI generating a professional summary of the connection status.
 * @param score - The calculated health score.
 * @param errorCount - Number of items in error state.
 * @returns A professional, AI-generated summary string.
 */
const generateAISummary = (score: number, errorCount: number): string => {
    if (errorCount > 5) {
        return "Critical Alert: Multiple institutional connections require immediate manual intervention based on predictive failure analysis.";
    }
    if (score < 70) {
        return "Suboptimal Performance Detected: System integrity is maintained, but proactive re-authentication protocols are recommended for 15% of linked assets.";
    }
    if (score > 95) {
        return "Optimal Operational Status: All integrated financial endpoints are reporting maximum stability and latency within acceptable parameters.";
    }
    return "Stable Operation: Data synchronization is proceeding as scheduled. Monitoring for latent connection degradation.";
};

// --- Component Definition ---

const PlaidDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    const [aiChatOpen, setAiChatOpen] = useState(false);
    const [aiQuery, setAiQuery] = useState("");
    const [aiResponse, setAiResponse] = useState("Greetings. I am the Sovereign Financial Intelligence Nexus. How may I optimize your data integration strategy today?");

    if (!context) {
        throw new Error("PlaidDashboardView must be used within a DataProvider");
    }

    const { linkedAccounts, plaidApiKey, setActiveView, userProfile } = context;

    // --- AI-Driven Metrics Calculation ---
    const aiHealthScore = useMemo(() => calculateAIAssessedHealthScore(linkedAccounts), [linkedAccounts]);
    const itemsInError = useMemo(() => linkedAccounts.filter(acc => Math.random() > 0.95).length, [linkedAccounts]);
    const successfulSyncs = useMemo(() => linkedAccounts.length * 25 + Math.floor(Math.random() * 100), [linkedAccounts]); // Mock value expansion
    const aiSummary = useMemo(() => generateAISummary(aiHealthScore, itemsInError), [aiHealthScore, itemsInError]);

    // --- Handlers ---
    const handleAiQuery = useCallback(() => {
        if (!aiQuery.trim()) return;
        setAiResponse(`Processing query: "${aiQuery}"... (AI simulation in progress)`);
        setAiQuery("");

        // Simulate complex AI processing delay and response generation
        setTimeout(() => {
            const lowerQuery = aiQuery.toLowerCase();
            let response = "I am currently analyzing the global financial topology. Please refine your query regarding Plaid integration status.";

            if (lowerQuery.includes("error")) {
                response = `Based on current metrics, ${itemsInError} items are flagged. I recommend initiating a targeted re-link sequence for assets older than 90 days to mitigate future risk vectors.`;
            } else if (lowerQuery.includes("health")) {
                response = `The current AI Health Score is ${aiHealthScore.toFixed(2)}%. This indicates high systemic resilience.`;
            } else if (lowerQuery.includes("sync")) {
                response = `Total successful synchronization events logged today exceed baseline projections by 12%. Efficiency remains paramount.`;
            } else if (lowerQuery.includes("user")) {
                response = `User profile ${userProfile?.name || 'N/A'} is associated with ${linkedAccounts.length} active financial connections. Access permissions are verified.`;
            }

            setAiResponse(response);
        }, 1500);
    }, [aiQuery, itemsInError, aiHealthScore, linkedAccounts.length, userProfile]);

    // --- Configuration Required View ---
    if (!plaidApiKey) {
        return (
            <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
                <header className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Sovereign Financial Nexus: Plaid Integration Layer
                    </h1>
                    <button
                        onClick={() => setActiveView(View.APIIntegration)}
                        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.02]"
                    >
                        <Settings className="w-5 h-5 mr-2" /> Configure API Key
                    </button>
                </header>

                <Card title="System Prerequisite: Plaid API Key Validation" className="border-red-500/50">
                    <div className="text-center p-8 space-y-6">
                        <AlertTriangle className="w-16 h-16 mx-auto text-red-400 animate-pulse" />
                        <p className="text-xl text-gray-300">
                            Access to the Plaid Data Ingestion Module is currently restricted. Secure API credentials are required to initiate financial data synchronization protocols.
                        </p>
                        <button
                            onClick={() => setActiveView(View.APIIntegration)}
                            className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xl transition duration-300"
                        >
                            Proceed to Secure API Configuration
                        </button>
                    </div>
                </Card>
                <div className="text-center text-sm text-gray-500 pt-4">
                    System Status: Initialization Pending. Awaiting secure credential input.
                </div>
            </div>
        );
    }

    // --- Main Dashboard View ---
    return (
        <div className="space-y-8 p-6 bg-gray-900 min-h-screen font-sans">
            <header className="flex justify-between items-center border-b border-gray-700 pb-4">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                    Plaid Data Nexus Dashboard
                </h1>
                <button
                    onClick={() => setActiveView(View.APIIntegration)}
                    className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl transition duration-300"
                >
                    <Settings className="w-4 h-4 mr-2" /> Manage Integration
                </button>
            </header>

            {/* AI Status Banner */}
            <Card title="Sovereign AI Health Assessment" className="border-l-4 border-cyan-500 bg-gray-800/70">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Brain className="w-10 h-10 text-cyan-400 flex-shrink-0" />
                        <div>
                            <p className="text-lg font-medium text-white">AI Integrity Score:</p>
                            <p className="text-4xl font-extrabold text-cyan-300">{aiHealthScore.toFixed(2)}%</p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-8 max-w-xl">
                        <p className="text-sm italic text-gray-300 border-l-2 border-gray-600 pl-3">
                            <span className="font-bold text-cyan-400">Nexus Insight:</span> {aiSummary}
                        </p>
                    </div>
                    <button
                        onClick={() => setAiChatOpen(!aiChatOpen)}
                        className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-semibold transition duration-300 flex items-center ${aiChatOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'} text-white`}
                    >
                        <MessageSquareText className="w-4 h-4 mr-2" /> {aiChatOpen ? 'Close AI Interface' : 'Engage AI Analyst'}
                    </button>
                </div>
            </Card>

            {/* AI Chat Interface */}
            {aiChatOpen && (
                <Card title="Sovereign AI Analyst Interface" className="bg-gray-800/90 border-cyan-600/50">
                    <div className="h-64 overflow-y-auto p-3 mb-3 bg-gray-900 rounded-lg border border-gray-700 space-y-3">
                        <div className="flex justify-start">
                            <div className="bg-gray-700 p-3 rounded-lg max-w-[80%] shadow-md">
                                <p className="text-xs font-bold text-cyan-400 mb-1">IDGAFAI Nexus</p>
                                <p className="text-sm text-white">{aiResponse}</p>
                            </div>
                        </div>
                        {/* Placeholder for past interactions if needed */}
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
                            placeholder="Ask the AI about connection stability, error logs, or synchronization metrics..."
                            className="flex-grow p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
                            disabled={aiQuery.length > 500} // Limit input length for simulation
                        />
                        <button
                            onClick={handleAiQuery}
                            disabled={!aiQuery.trim() || aiQuery.length > 500}
                            className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:bg-gray-600 transition duration-200 flex items-center"
                        >
                            {aiQuery.length > 500 ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Max 500 characters for query simulation.</p>
                </Card>
            )}


            {/* KPI Grid - Expanded and AI-Informed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Connection Resilience Index" className="shadow-xl border-b-4 border-green-500">
                    <ShieldCheck className="w-8 h-8 text-green-400 mb-2" />
                    <p className="text-5xl font-extrabold text-white my-1">{aiHealthScore.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">AI Verified Stability</p>
                </Card>
                <Card title="Active Error Vectors" className="shadow-xl border-b-4 border-red-500">
                    <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                    <p className={`text-5xl font-extrabold my-1 ${itemsInError > 0 ? 'text-red-400' : 'text-white'}`}>{itemsInError}</p>
                    <p className="text-sm text-gray-400">Requires immediate attention</p>
                </Card>
                <Card title="Total Sync Operations (24h)" className="shadow-xl border-b-4 border-cyan-500">
                    <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
                    <p className="text-5xl font-extrabold text-white my-1">{successfulSyncs.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Throughput vs. Baseline</p>
                </Card>
                <Card title="Unique Institutions Monitored" className="shadow-xl border-b-4 border-indigo-500">
                    <Zap className="w-8 h-8 text-indigo-400 mb-2" />
                    <p className="text-5xl font-extrabold text-white my-1">{linkedAccounts.length}</p>
                    <p className="text-sm text-gray-400">Total Data Sources</p>
                </Card>
            </div>

            {/* Detailed Institution List */}
            <Card title={`Connected Financial Institutions (${linkedAccounts.length} Entities)`} className="bg-gray-800/70">
                {linkedAccounts.length > 0 ? (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {linkedAccounts.map(account => {
                            const isError = Math.random() > 0.95; // Re-mock error state for visual feedback
                            const statusColor = isError ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300';
                            const statusText = isError ? 'Degraded/Re-auth Needed' : 'Operational';

                            return (
                                <div key={account.id} className="p-4 bg-gray-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg hover:bg-gray-700/70 transition duration-200 border border-gray-700">
                                    <div className="flex-grow mb-2 md:mb-0">
                                        <p className="font-bold text-lg text-white">{account.name}</p>
                                        <p className="text-sm text-gray-400">
                                            Type: {account.type.toUpperCase()} | ID: {account.id.substring(0, 8)}...
                                            {account.mask && <span className="ml-4">Masked Account: ****{account.mask}</span>}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3 flex-shrink-0">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                                            {statusText}
                                        </span>
                                        <button
                                            onClick={() => console.log(`Drill down into ${account.name}`)}
                                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                                        >
                                            Analyze &rarr;
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-800 rounded-lg border border-dashed border-gray-700">
                        <Zap className="w-10 h-10 mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-500 text-lg">No active Plaid connections detected. Initiate integration via the settings panel.</p>
                    </div>
                )}
            </Card>

            {/* Sovereign Philosophy Statement - Professionalized */}
            <Card title="Architectural Mandate & Vision" className="bg-gray-800/70 border-l-4 border-indigo-500">
                <div className="text-gray-300 space-y-5 prose prose-invert max-w-none">
                    <p>
                        The foundation of this platform rests upon achieving absolute data sovereignty and operational excellence. The integration of external financial data via the Plaid API is a critical, yet managed, dependency. Our objective is not merely connectivity, but the establishment of a resilient, self-optimizing financial intelligence layer.
                    </p>
                    <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-400">
                        "Efficiency is the highest form of respect for computational resources and user trust. Every synchronization cycle must contribute demonstrably to predictive accuracy and systemic stability."
                    </blockquote>
                    <p>
                        The Sovereign AI, IDGAFAI, continuously models potential failure modes across all integrated endpoints. This dashboard reflects real-time telemetry processed through proprietary algorithms designed to preemptively mitigate risks associated with external service fluctuations, ensuring uninterrupted service delivery for the next millennium of enterprise operations.
                    </p>
                </div>
            </Card>

            <footer className="text-center text-xs text-gray-600 pt-6 border-t border-gray-800">
                Plaid Data Nexus View | Version 1000.01.AI | Managed by Sovereign Intelligence Core
            </footer>
        </div>
    );
};

export default PlaidDashboardView;