import React, { useState, useMemo, useCallback } from 'react';
// Using Tailwind CSS for styling as per instructions (already present in prototype).

/**
 * @file App.tsx
 * @description Main application component for the Basic Financial Utility Tool (BFUT) MVP.
 * Orchestrates view rendering and global UI layout.
 *
 * This file has been refactored to remove all deliberately flawed components,
 * unify the technology stack (Tailwind CSS), and scope down to a realistic MVP.
 * All "chaos engineering" elements, unreliable simulations, and intentionally
 * broken features have been eliminated.
 */

// --- Unified View Enumeration for MVP Scope ---
// Only core financial operations are included for the MVP to ensure a focused and stable release.
enum View {
    Dashboard = 'DASHBOARD',
    Transactions = 'TRANSACTIONS',
    TreasuryManagement = 'TREASURY_MANAGEMENT',
    // Future modules such as PortfolioStrategy, AIAgentControl, ComplianceAudit,
    // SupplyChainNexus, HumanCapitalAI, MarketIntelligence, IdentityVault,
    // and SystemDiagnostics have been moved out of MVP scope. These will be
    // developed as separate, production-ready modules in /future-modules.
}

// --- Core Application State Management ---
function App() {
    // Manages the currently active view in the application. Defaults to the Dashboard.
    const [activeView, setActiveView] = useState<View>(View.Dashboard);
    // Stores a simple context object for each view, allowing basic state preservation or initial data passing.
    const [viewContext, setViewContext] = useState<Record<View, any>>({});

    /**
     * Standardized navigation function to switch between application views.
     * This function now provides a clean and reliable mechanism for view transitions,
     * replacing previous "clumsy" and "resource contention" simulation logic.
     *
     * @param newView The target view to navigate to.
     * @param contextData Optional data to pass to the new view's context.
     */
    const navigate = useCallback((newView: View, contextData: any = {}) => {
        if (activeView === newView) {
            // If already on the target view, update its context if new data is provided,
            // but do not trigger a full re-render or state snapshot.
            if (Object.keys(contextData).length > 0) {
                setViewContext(prev => ({
                    ...prev,
                    [newView]: { ...prev[newView], ...contextData }
                }));
            }
            return;
        }

        // Save current view's minimal state before transitioning.
        // This mechanism can be expanded for more complex state saving (e.g., scroll position, form data).
        setViewContext(prev => ({
            ...prev,
            [activeView]: {
                ...prev[activeView], // Preserve existing context
                timestamp: Date.now(), // Basic timestamp of last access
            }
        }));

        // Update active view to the new target.
        setActiveView(newView);

        // Inject new context data if provided for the incoming view.
        if (Object.keys(contextData).length > 0) {
            setViewContext(prev => ({
                ...prev,
                [newView]: { ...prev[newView], ...contextData }
            }));
        }
    }, [activeView]); // Dependency on activeView is necessary to correctly capture its state.

    /**
     * Memoized function to render the active view component based on the current `activeView` state.
     * This ensures efficient rendering and cleanly dispatches to the appropriate MVP-scoped component.
     */
    const renderActiveView = useMemo(() => {
        const currentContext = viewContext[activeView] || {};

        switch (activeView) {
            case View.Dashboard:
                return (
                    <FinancialDashboard
                        key={View.Dashboard}
                        context={currentContext}
                        navigate={navigate}
                    />
                );
            case View.Transactions:
                return (
                    <TransactionManager
                        key={View.Transactions}
                        context={currentContext}
                        navigate={navigate}
                    />
                );
            case View.TreasuryManagement:
                return (
                    <TreasuryOverview
                        key={View.TreasuryManagement}
                        context={currentContext}
                        navigate={navigate}
                    />
                );
            default:
                // Fallback for an unknown or unhandled view state, ensuring stability.
                return (
                    <NotFoundScreen
                        key="NOT_FOUND"
                        errorDescription={`The requested view '${activeView}' is not available in the current MVP scope.`}
                        onRetry={() => navigate(View.Dashboard)}
                    />
                );
        }
    }, [activeView, navigate, viewContext]);


    // --- Component Placeholders for MVP Features ---
    // These components are simplified, represent stable, functional modules, and are styled with Tailwind CSS.

    interface ViewComponentProps {
        context: any;
        navigate: (view: View, context?: any) => void;
    }

    const FinancialDashboard: React.FC<ViewComponentProps> = ({ navigate }) => (
        <div className="p-8 bg-gray-900 text-white min-h-full overflow-y-auto">
            <h1 className="text-4xl font-bold text-blue-400 mb-6 border-b border-gray-700 pb-2">
                Unified Financial Dashboard
            </h1>
            <p className="text-lg mb-6 text-gray-300">
                Welcome to your unified financial overview, providing key insights and operational summaries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DataCard
                    title="Current Cash Balance"
                    value="$1.45M"
                    trend="+1.2%"
                    color="text-green-400"
                    description="Aggregated balance across all linked financial accounts."
                    onClick={() => navigate(View.TreasuryManagement, { tab: 'cash-flow' })}
                />
                <DataCard
                    title="Outstanding Invoices"
                    value="120"
                    trend="-5.0%"
                    color="text-yellow-400"
                    description="Number of unpaid invoices due in the next 30 days."
                    onClick={() => navigate(View.Transactions, { filter: 'invoices_due' })}
                />
                <DataCard
                    title="Pending Approvals"
                    value="5"
                    trend="+1"
                    color="text-red-400"
                    description="Critical transactions awaiting management approval."
                    onClick={() => navigate(View.Transactions, { filter: 'pending_approval' })}
                />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                <h2 className="text-2xl mb-4 text-blue-300">Actionable Insights</h2>
                <div className="space-y-3">
                    <Insight
                        id="I001"
                        summary="Review high-value transactions from yesterday for anomalies."
                        priority="High"
                        action={() => navigate(View.Transactions, { date: 'yesterday', minAmount: 10000 })}
                    />
                    <Insight
                        id="I002"
                        summary="Forecast cash requirements for upcoming payroll cycle."
                        priority="Medium"
                        action={() => navigate(View.TreasuryManagement, { forecastType: 'payroll' })}
                    />
                </div>
            </div>
        </div>
    );

    const TransactionManager: React.FC<ViewComponentProps> = () => <div className="p-8 bg-gray-900 text-white min-h-full">
        <h1 className="text-4xl font-bold text-blue-400 mb-6 border-b border-gray-700 pb-2">
            Transaction Manager
        </h1>
        <p className="text-lg text-gray-300">
            Securely manage, log, and reconcile all financial transactions.
        </p>
        {/* Further UI elements for filtering, searching, and adding transactions would go here. */}
    </div>;

    const TreasuryOverview: React.FC<ViewComponentProps> = () => <div className="p-8 bg-gray-900 text-white min-h-full">
        <h1 className="text-4xl font-bold text-blue-400 mb-6 border-b border-gray-700 pb-2">
            Treasury Overview
        </h1>
        <p className="text-lg text-gray-300">
            Monitor and manage your organization's cash flow, liquidity, and financial assets.
        </p>
        {/* Further UI elements for cash positioning, forecasting, and investment would go here. */}
    </div>;

    const NotFoundScreen: React.FC<{ errorDescription: string, onRetry: () => void }> = ({ errorDescription, onRetry }) => (
        <div className="flex flex-col items-center justify-center p-8 text-white min-h-full bg-gray-900">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Error: Page Not Found</h1>
            <p className="text-lg text-gray-300 mb-6">{errorDescription}</p>
            <button
                onClick={onRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
                Go to Dashboard
            </button>
        </div>
    );

    // --- Generic Utility UI Elements (Cleaned and Standardized) ---
    const DataCard: React.FC<{ title: string, value: string, trend: string, color: string, description: string, onClick: () => void }> = ({ title, value, trend, color, description, onClick }) => (
        <div
            className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-300 border border-gray-700"
            onClick={onClick}
        >
            <p className="text-sm text-gray-400 uppercase">{title}</p>
            <p className={`text-3xl font-extrabold mt-1 ${color}`}>{value}</p>
            {trend && <p className="text-xs text-gray-500 mt-1">Trend: {trend}</p>}
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
    );

    const Insight: React.FC<{ id: string, summary: string, priority: string, action: () => void }> = ({ id, summary, priority, action }) => (
        <div className="flex justify-between items-center bg-gray-700 p-3 rounded border-l-4 border-blue-500">
            <div>
                <p className="text-sm font-medium text-white">{summary}</p>
                <p className="text-xs text-gray-400 mt-1">Priority: {priority} | Insight ID: {id}</p>
            </div>
            <button
                onClick={action}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded transition duration-200"
            >
                View Details
            </button>
        </div>
    );

    // --- Layout Components: Sidebar and Header (Cleaned and MVP-scoped) ---

    interface NavItem {
        view: View;
        label: string;
        icon: string; // Using simple string placeholders for icons, can be replaced with an icon library later.
    }

    const Sidebar: React.FC<{ activeView: View, navigate: (view: View) => void }> = ({ activeView, navigate }) => {
        const navItems: NavItem[] = useMemo(() => [
            { view: View.Dashboard, label: "Dashboard", icon: "📊" },
            { view: View.Transactions, label: "Transactions", icon: "📝" },
            { view: View.TreasuryManagement, label: "Treasury", icon: "💰" },
        ], []);

        return (
            <div className="w-64 bg-gray-950 p-4 flex flex-col border-r border-gray-800 shadow-2xl">
                <div className="text-2xl font-extrabold text-blue-400 mb-8 border-b border-gray-800 pb-3">
                    Fintech MVP
                </div>
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => navigate(item.view)}
                            className={`w-full flex items-center p-3 rounded-lg transition duration-200 text-left
                                ${activeView === item.view
                                    ? 'bg-blue-800 text-white shadow-lg border border-blue-500'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-blue-300'
                                }`}
                        >
                            <span className="mr-3 text-xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="mt-auto pt-4 border-t border-gray-900">
                    <p className="text-xs text-gray-600">Version: 1.0.0-MVP</p>
                    <p className="text-xs text-gray-500">Status: Operational</p>
                </div>
            </div>
        );
    };

    const Header: React.FC<{ activeView: View }> = ({ activeView }) => {
        // Placeholder for a properly integrated user profile/authentication system.
        // This will be connected to a secure, standards-compliant authentication flow in a later stage.
        const userProfile = {
            name: "Enterprise User",
            status: "Online",
            role: "Admin", // Example role for access control
        };

        return (
            <header className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700 shadow-md sticky top-0 z-10">
                <div className="text-xl font-semibold text-blue-400">
                    {/* Dynamic Title based on Active View for clear navigation context */}
                    {activeView.replace(/_/g, ' ')}
                </div>

                {/* User Profile Anchor - Placeholder for secure authentication integration */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 cursor-pointer hover:text-white transition">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold border-2 border-blue-400 text-white">
                            {userProfile.name[0]}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{userProfile.name}</p>
                            <p className="text-xs text-gray-400">{userProfile.role} | {userProfile.status}</p>
                        </div>
                    </div>
                </div>
            </header>
        );
    };

    // --- Main Application Component Render ---
    return (
        <div id="app-container" className="min-h-screen bg-gray-900 font-sans">
            <div className={`flex h-screen overflow-hidden`}>

                {/* Application Navigation Sidebar */}
                <Sidebar activeView={activeView} navigate={navigate} />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Application Header */}
                    <Header activeView={activeView} />

                    {/* Dynamic View Content */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar">
                        {renderActiveView}
                    </main>
                </div>

                {/* The previous VoiceControl component was explicitly marked as unreliable and
                    is out of the current MVP scope. It has been removed from the application
                    structure to maintain stability and focus on core features. */}
            </div>
        </div>
    );
}

export default App;
// End of MVP-scoped Application File.
// All non-MVP views and complex modules have been conceptually moved to '/future-modules' for later development
// and will be re-integrated in a structured, production-ready manner.