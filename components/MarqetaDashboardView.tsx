import React, { useContext, useState, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProgram, MarqetaCardholder, MarqetaTransaction, MarqetaCard, MarqetaAccount } from '../types';

// --- AI/ML Integration Simulation Constants ---
const AI_INSIGHT_ENGINE_VERSION = "2.1.4-QuantumLeap";
const PREDICTIVE_MODEL_STATUS = "Operational (99.99% Uptime)";

// --- Mock Data Generation (Expanded for Enterprise Scale) ---

interface MockMarqetaData {
    programs: MarqetaCardProgram[];
    cardholders: MarqetaCardholder[];
    cards: MarqetaCard[];
    transactions: MarqetaTransaction[];
    accounts: MarqetaAccount[];
}

const generateMockMarqetaData = (): MockMarqetaData => {
    const programs: MarqetaCardProgram[] = [
        { token: 'prog_corp_001', name: 'Quantum Corporate T&E Platinum', active: true, fulfillment: { shipping: { method: 'SECURE_COURIER', care_of_line: 'Global Finance Division' } }, created_time: new Date(Date.now() - 86400000 * 30).toISOString() },
        { token: 'prog_dev_002', name: 'Virtual Developer Sandbox Cards', active: true, fulfillment: { shipping: { method: 'STANDARD_MAIL', care_of_line: 'Internal IT Services' } }, created_time: new Date(Date.now() - 86400000 * 15).toISOString() },
        { token: 'prog_mkt_003', name: 'Marketing Campaign Spend Limit', active: false, fulfillment: { shipping: { method: 'STANDARD_MAIL', care_of_line: 'Marketing Operations' } }, created_time: new Date(Date.now() - 86400000 * 5).toISOString() },
        { token: 'prog_ops_004', name: 'Operational Expense Control Tier 1', active: true, fulfillment: { shipping: { method: 'SECURE_COURIER', care_of_line: 'Procurement HQ' } }, created_time: new Date(Date.now() - 86400000 * 60).toISOString() },
    ];

    const cardholders: MarqetaCardholder[] = [
        { token: 'user_alex_r', first_name: 'Alex', last_name: 'Raynor', email: 'alex.raynor@corp.com', active: true, status: 'ACTIVE', created_time: new Date(Date.now() - 86400000 * 20).toISOString() },
        { token: 'user_sam_j', first_name: 'Samantha', last_name: 'Jones', email: 'sam.jones@corp.com', active: true, status: 'ACTIVE', created_time: new Date(Date.now() - 86400000 * 10).toISOString() },
        { token: 'user_mia_k', first_name: 'Mia', last_name: 'Kowalski', email: 'mia.kowalski@corp.com', active: false, status: 'PENDING_VERIFICATION', created_time: new Date(Date.now() - 86400000 * 2).toISOString() },
        { token: 'user_dev_01', first_name: 'Dev', last_name: 'Ops', email: 'devops@corp.com', active: true, status: 'ACTIVE', created_time: new Date(Date.now() - 86400000 * 45).toISOString() },
    ];

    const cards: MarqetaCard[] = [
        { token: 'card_a1', cardholder_token: 'user_alex_r', program_token: 'prog_corp_001', last_four: '1234', state: 'ACTIVATED', created_time: new Date(Date.now() - 86400000 * 19).toISOString() },
        { token: 'card_b2', cardholder_token: 'user_sam_j', program_token: 'prog_corp_001', last_four: '5678', state: 'ACTIVATED', created_time: new Date(Date.now() - 86400000 * 9).toISOString() },
        { token: 'card_v3', cardholder_token: 'user_dev_01', program_token: 'prog_dev_002', last_four: '9012', state: 'SUSPENDED', created_time: new Date(Date.now() - 86400000 * 40).toISOString() },
    ];

    const transactions: MarqetaTransaction[] = [
        { token: 'txn_001', amount: 150.75, merchant: 'Cloud Services Inc.', card_token: 'card_a1', created_time: new Date(Date.now() - 3600000).toISOString(), status: 'SETTLED' },
        { token: 'txn_002', amount: 4500.00, merchant: 'Global Travel Agency', card_token: 'card_a1', created_time: new Date(Date.now() - 7200000).toISOString(), status: 'SETTLED' },
        { token: 'txn_003', amount: 12.99, merchant: 'SaaS Subscription Portal', card_token: 'card_b2', created_time: new Date(Date.now() - 1800000).toISOString(), status: 'PENDING' },
    ];

    const accounts: MarqetaAccount[] = [
        { token: 'acct_main', type: 'CHECKING', created_time: new Date(Date.now() - 86400000 * 100).toISOString(), balance: 500000.00, currency: 'USD' },
    ];

    return { programs, cardholders, cards, transactions, accounts };
};

// --- AI Insight Components ---

interface AICardProps {
    title: string;
    children: React.ReactNode;
    aiInsight?: string;
}

const AICard: React.FC<AICardProps> = ({ title, children, aiInsight }) => (
    <Card title={title}>
        <div className="space-y-4">
            {children}
            {aiInsight && (
                <div className="mt-4 p-3 border-l-4 border-cyan-500 bg-gray-800/70 rounded-r-lg shadow-lg">
                    <p className="text-xs font-bold text-cyan-400 uppercase mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 12a1 1 0 102 0 1 1 0 00-2 0zm1-7a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1z"></path></svg>
                        AI Predictive Insight
                    </p>
                    <p className="text-sm text-gray-300 italic">{aiInsight}</p>
                </div>
            )}
        </div>
    </Card>
);

const AIAnomalyIndicator: React.FC<{ isAnomaly: boolean }> = ({ isAnomaly }) => (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-300 ${
        isAnomaly 
            ? 'bg-red-600/30 text-red-400 animate-pulse' 
            : 'bg-green-600/30 text-green-400'
    }`}>
        {isAnomaly ? 'Anomaly Detected' : 'Normal Baseline'}
    </span>
);

// --- Dashboard Components ---

const KeyMetricCard: React.FC<{ title: string; value: string; trend?: string; aiInsight?: string }> = ({ title, value, trend, aiInsight }) => {
    const isAnomaly = trend?.includes('High Variance');
    return (
        <AICard title={title} aiInsight={aiInsight}>
            <p className="text-6xl font-extrabold text-center text-white my-2 tabular-nums">{value}</p>
            {trend && (
                <div className="flex justify-center items-center space-x-3 pt-2">
                    <span className={`text-lg font-bold ${trend.startsWith('+') ? 'text-green-400' : trend.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>
                        {trend}
                    </span>
                    <AIAnomalyIndicator isAnomaly={!!isAnomaly} />
                </div>
            )}
        </AICard>
    );
};

const ProgramList: React.FC<{ programs: MarqetaCardProgram[] }> = ({ programs }) => {
    const activeCount = programs.filter(p => p.active).length;
    const aiInsight = `The AI Risk Model suggests reviewing Program Token ${programs[0]?.token} due to recent high-velocity issuance patterns.`;

    return (
        <AICard title="Active Card Programs" aiInsight={aiInsight}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
                <p className="text-xl font-semibold text-white">Total Active: <span className="text-cyan-400">{activeCount}</span> / {programs.length}</p>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition">Manage All Programs &rarr;</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {programs.sort((a, b) => b.active.toString().localeCompare(a.active.toString())).map(program => (
                    <div key={program.token} className="p-3 bg-gray-800/50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center transition duration-200 hover:bg-gray-700/60 border border-transparent hover:border-cyan-600/50">
                        <div className="flex-grow mb-1 sm:mb-0">
                            <p className="font-bold text-white truncate">{program.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Token: {program.token.substring(0, 12)}...</p>
                        </div>
                        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${program.active ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>
                                {program.active ? 'LIVE' : 'INACTIVE'}
                            </span>
                            <button className="text-xs text-gray-400 hover:text-white">Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </AICard>
    );
};

const RecentCardholderActivity: React.FC<{ cardholders: MarqetaCardholder[] }> = ({ cardholders }) => {
    const recentHolders = cardholders.slice(0, 4);
    const aiInsight = "The AI Profiler flags Mia Kowalski (PENDING_VERIFICATION) as a potential high-value user based on initial KYC metadata correlation.";

    return (
        <AICard title="Recent Cardholder Onboarding" aiInsight={aiInsight}>
            <div className="space-y-3">
                {recentHolders.map(holder => (
                    <div key={holder.token} className="p-3 bg-gray-800/50 rounded-lg flex justify-between items-center transition duration-200 hover:bg-gray-700/60">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-sm font-bold text-white uppercase">
                                {holder.first_name[0]}{holder.last_name[0]}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{holder.first_name} {holder.last_name}</p>
                                <p className="text-xs text-gray-400">{holder.email}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            holder.status === 'ACTIVE' ? 'bg-green-500/20 text-green-300' : 
                            holder.status === 'PENDING_VERIFICATION' ? 'bg-yellow-500/20 text-yellow-300' : 
                            'bg-red-500/20 text-red-300'
                        }`}>
                            {holder.status}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center">
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition">View Full Cardholder Registry &rarr;</button>
            </div>
        </AICard>
    );
};

const TransactionFeed: React.FC<{ transactions: MarqetaTransaction[] }> = ({ transactions }) => {
    const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
    const aiInsight = `Transaction ${transactions[0]?.token} ($${transactions[0]?.amount.toFixed(2)}) shows a 78% probability of being a legitimate business expense based on merchant category analysis.`;

    return (
        <AICard title="Real-Time Transaction Stream" aiInsight={aiInsight}>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700">
                <p className="text-lg font-medium text-white">Pending Approvals: <span className="text-red-400">{pendingCount}</span></p>
                <p className="text-xs text-gray-500">Engine Version: {AI_INSIGHT_ENGINE_VERSION}</p>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {transactions.sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime()).map(txn => (
                    <div key={txn.token} className="p-3 bg-gray-800/50 rounded-lg flex justify-between items-center hover:bg-gray-700/60 transition">
                        <div className="flex-grow min-w-0">
                            <p className="font-medium text-white truncate">{txn.merchant}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(txn.created_time).toLocaleTimeString()}</p>
                        </div>
                        <div className="text-right ml-4">
                            <p className={`font-bold tabular-nums ${txn.status === 'PENDING' ? 'text-yellow-400' : 'text-green-400'}`}>
                                ${txn.amount.toFixed(2)}
                            </p>
                            <span className={`text-xs font-medium ${txn.status === 'PENDING' ? 'text-yellow-300' : 'text-gray-400'}`}>
                                {txn.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </AICard>
    );
};


// --- Main Dashboard Component ---

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    const [mockData, setMockData] = useState<MockMarqetaData>(generateMockMarqetaData);
    const [isLoading, setIsLoading] = useState(false);

    if (!context) {
        throw new Error("MarqetaDashboardView must be used within a DataProvider");
    }
    const { marqetaApiKey, setActiveView } = context;

    // Simulate data fetching/refresh with AI processing overhead
    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        // Simulate network latency and complex AI model recalculation
        setTimeout(() => {
            setMockData(generateMockMarqetaData());
            setIsLoading(false);
        }, 1500);
    }, []);

    // --- AI-Driven KPI Calculation (Simulated) ---
    const kpis = useMemo(() => {
        const totalCards = mockData.cards.length;
        const activeHolders = mockData.cardholders.filter(h => h.status === 'ACTIVE').length;
        const volume24h = mockData.transactions.reduce((sum, txn) => sum + txn.amount, 0);
        
        // AI Risk Score Calculation (Simulated)
        const riskScore = (totalCards * 0.1 + activeHolders * 0.05 + (volume24h / 1000000) * 0.3) % 100;
        const isHighRisk = riskScore > 75;

        return {
            totalCards,
            activeHolders,
            volume24h,
            riskScore: riskScore.toFixed(1),
            isHighRisk
        };
    }, [mockData]);

    if (!marqetaApiKey) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold text-white tracking-wider mb-8 border-b border-gray-700 pb-4">Marqeta Enterprise Integration Hub</h2>
                <AICard title="API Configuration Required">
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 5.25a1.732 1.732 0 00-3.076 0L4.33 17.75c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <p className="text-xl text-gray-300 mb-6">
                            Secure access to the Marqeta platform requires valid API credentials. Initiate the secure handshake protocol.
                        </p>
                        <button
                            onClick={() => setActiveView(View.APIIntegration)}
                            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                        >
                            Establish Secure Connection
                        </button>
                    </div>
                </AICard>
            </div>
        )
    }

    return (
        <div className="p-6 lg:p-10 space-y-10">
            <header className="flex justify-between items-center border-b border-gray-800 pb-4">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">
                    Marqeta Quantum Operations Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                    <div className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${kpis.isHighRisk ? 'bg-red-700/50 text-red-300' : 'bg-green-700/50 text-green-300'}`}>
                        Risk Score: {kpis.riskScore}% {kpis.isHighRisk ? '(ALERT)' : '(Optimal)'}
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className={`px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition duration-300 flex items-center ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 16a8 8 0 110-16 8 8 0 010 16z"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11.418 9a8.001 8.001 0 01-15.356-2m15.356 2v-5h-.581m0 0H15"></path></svg>
                        )}
                        {isLoading ? 'Processing AI Sync...' : 'Refresh Data'}
                    </button>
                </div>
            </header>

            {/* Section 1: Core Operational KPIs (AI Enhanced) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KeyMetricCard 
                    title="Total Cards Issued" 
                    value={kpis.totalCards.toLocaleString()}
                    trend="+1.2% (MoM)"
                    aiInsight="Issuance velocity is stable. AI suggests pre-provisioning 500 new virtual cards for the Q3 marketing push."
                />
                <KeyMetricCard 
                    title="Active Cardholders" 
                    value={kpis.activeHolders.toLocaleString()}
                    trend="-0.1% (24h)"
                    aiInsight="Slight dip attributed to automated deactivation of 3 dormant developer accounts. No immediate action required."
                />
                <KeyMetricCard 
                    title="Transaction Volume (L7D)" 
                    value={`$${(kpis.volume24h / 1000000).toFixed(2)}M`}
                    trend="+5.8% (WoW)"
                    aiInsight="Volume spike detected Tuesday, correlated with successful deployment of Project Chimera. Baseline adjusted."
                />
                <KeyMetricCard 
                    title="Fraud Rate (Simulated)" 
                    value="0.004%"
                    trend="-0.001%"
                    aiInsight={`The Deep Learning Fraud Model has successfully blocked 14 high-risk attempts this period. Current rate is 99.996% below threshold.`}
                />
            </div>

            {/* Section 2: Detailed Operational Views */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Programs */}
                <div className="lg:col-span-1">
                    <ProgramList programs={mockData.programs} />
                </div>

                {/* Column 2: Cardholder Activity */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RecentCardholderActivity cardholders={mockData.cardholders} />
                    <TransactionFeed transactions={mockData.transactions} />
                </div>
            </div>

            {/* Section 3: Advanced Analytics & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                <AICard title="System Health & Compliance" aiInsight="Compliance monitoring module reports 100% adherence to PCI DSS v4.0 standards for current configuration.">
                    <div className="space-y-3 text-sm">
                        <p className="flex justify-between">API Latency (Avg): <span className="font-mono text-green-400">45ms</span></p>
                        <p className="flex justify-between">Data Sync Status: <span className="font-mono text-green-400">Synchronized</span></p>
                        <p className="flex justify-between">AI Model Status: <span className="font-mono text-green-400">{PREDICTIVE_MODEL_STATUS}</span></p>
                        <p className="flex justify-between">Pending Approvals Queue: <span className="font-mono text-yellow-400">2</span></p>
                        <p className="flex justify-between">Audit Log Integrity: <span className="font-mono text-green-400">Verified</span></p>
                    </div>
                    <button className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition">
                        Access Compliance Audit Trail
                    </button>
                </AICard>

                <AICard title="AI Spend Forecasting (Next 30 Days)" aiInsight="Forecast suggests a 12% increase in T&E spending, primarily driven by projected international travel authorizations.">
                    <div className="space-y-2">
                        <p className="text-3xl font-bold text-cyan-400 tabular-nums">$4.85M</p>
                        <p className="text-sm text-gray-400">Projected Total Spend</p>
                        <div className="h-2 bg-gray-700 rounded-full mt-3">
                            <div className="h-2 bg-cyan-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500">Confidence Level: High (88%)</p>
                    </div>
                    <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition">
                        Run Scenario Simulation
                    </button>
                </AICard>

                <AICard title="Cardholder Risk Profile Summary" aiInsight="The system identified 1 cardholder profile exhibiting high velocity/low merchant diversity, warranting manual review.">
                    <div className="space-y-3">
                        <p className="text-lg font-semibold text-white">High Risk Profiles: <span className="text-red-400">1</span></p>
                        <p className="text-lg font-semibold text-white">Medium Risk Profiles: <span className="text-yellow-400">5</span></p>
                        <p className="text-lg font-semibold text-white">Low Risk Profiles: <span className="text-green-400">{mockData.cardholders.length - 6}</span></p>
                    </div>
                    <button className="mt-4 w-full py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm transition">
                        Review Flagged Users
                    </button>
                </AICard>
            </div>

            {/* Footer/System Info */}
            <div className="text-center pt-8 text-gray-600 text-xs border-t border-gray-800 mt-10">
                Marqeta Enterprise Integration Layer | Operational Status: <span className="text-green-500">NOMINAL</span> | Data Source: Marqeta API v2.0 | Powered by Quantum Insight Engine v{AI_INSIGHT_ENGINE_VERSION.split('-')[0]}
            </div>
        </div>
    );
};

export default MarqetaDashboardView;