import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginView: React.FC = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("LoginView must be used within an AuthProvider");
    }
    const { login, isLoading } = authContext;

    // Local state management using React.useState (accessed via default import to preserve import lines)
    const [email, setEmail] = React.useState("enterprise@sovereign.ai");
    const [password, setPassword] = React.useState("secure_access_token");
    const [activeTab, setActiveTab] = React.useState<'login' | 'sso' | 'recovery'>('login');
    const [aiStatus, setAiStatus] = React.useState<string[]>([]);
    const [showAiPanel, setShowAiPanel] = React.useState(true);

    // Simulate AI System Initialization
    React.useEffect(() => {
        const messages = [
            "Initializing Sovereign Neural Core...",
            "Establishing secure handshake with Quantum Ledger...",
            "Verifying biometric encryption protocols...",
            "Loading predictive market analytics modules...",
            "Syncing global liquidity pools...",
            "AI Sentinel active: Monitoring threat vectors...",
            "System Ready. Awaiting User Authentication."
        ];
        
        let delay = 0;
        messages.forEach((msg, index) => {
            delay += 800;
            setTimeout(() => {
                setAiStatus(prev => [...prev, msg]);
            }, delay);
        });
    }, []);

    const renderAiTerminal = () => (
        <div className="hidden lg:flex flex-col w-1/2 bg-gray-900 p-12 justify-between relative overflow-hidden border-r border-gray-800">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>
            
            <div className="z-10 space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Sovereign AI <span className="text-cyan-400">OS</span></h2>
                    <p className="text-gray-400">The world's most advanced financial operating system.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 backdrop-blur-sm">
                        <div className="text-cyan-400 text-sm font-mono mb-1">GLOBAL LIQUIDITY</div>
                        <div className="text-2xl font-bold text-white">$42.8T</div>
                        <div className="text-xs text-green-400 mt-1">▲ 2.4% Real-time</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 backdrop-blur-sm">
                        <div className="text-purple-400 text-sm font-mono mb-1">PREDICTIVE ACCURACY</div>
                        <div className="text-2xl font-bold text-white">99.99%</div>
                        <div className="text-xs text-gray-400 mt-1">Neural Net v9.0</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 backdrop-blur-sm">
                        <div className="text-blue-400 text-sm font-mono mb-1">ACTIVE NODES</div>
                        <div className="text-2xl font-bold text-white">8,402</div>
                        <div className="text-xs text-green-400 mt-1">Globally Distributed</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 backdrop-blur-sm">
                        <div className="text-pink-400 text-sm font-mono mb-1">THREATS BLOCKED</div>
                        <div className="text-2xl font-bold text-white">1.2M+</div>
                        <div className="text-xs text-gray-400 mt-1">Last 24 Hours</div>
                    </div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto border border-gray-800 shadow-inner">
                    <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">/// SYSTEM LOG ///</div>
                    {aiStatus.map((msg, i) => (
                        <div key={i} className="mb-1">
                            <span className="text-cyan-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            <span className="text-cyan-100">{msg}</span>
                        </div>
                    ))}
                    <div className="animate-pulse text-cyan-500">_</div>
                </div>
            </div>

            <div className="z-10 mt-8">
                <div className="flex items-center space-x-3 text-gray-500 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>System Operational</span>
                    <span className="mx-2">|</span>
                    <span>v10.4.2 Enterprise</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-screen bg-gray-950 flex overflow-hidden font-sans text-gray-100">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-20">
                <div className="w-full max-w-md space-y-8">
                    
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center justify-center lg:justify-start mb-6">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h1 className="ml-3 text-2xl font-bold tracking-tight text-white">Sovereign Bank</h1>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Authenticate to access the Enterprise Financial OS.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl border border-gray-800">
                        <button 
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'login' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Secure Login
                        </button>
                        <button 
                            onClick={() => setActiveTab('sso')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'sso' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            SSO Access
                        </button>
                    </div>

                    {/* Form Container */}
                    <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 relative overflow-hidden">
                        {/* Decorative gradient blob */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

                        {activeTab === 'login' && (
                            <form className="space-y-6 relative z-10" onSubmit={(e) => { e.preventDefault(); login(); }}>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enterprise ID / Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 sm:text-sm"
                                            placeholder="user@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Secure Token / Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 sm:text-sm"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-700 rounded bg-gray-800"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                            Remember device
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-cyan-500 hover:text-cyan-400 transition-colors">
                                            Forgot token?
                                        </a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            <span>Authenticating...</span>
                                        </div>
                                    ) : (
                                        "Access Dashboard"
                                    )}
                                </button>
                            </form>
                        )}

                        {activeTab === 'sso' && (
                            <div className="space-y-6 py-4">
                                <p className="text-sm text-gray-400 text-center">Authenticate using your organization's identity provider.</p>
                                <button
                                    onClick={login}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-200 group"
                                >
                                    <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white transition-colors" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.83 2.17-5.5 2.17-4.2 0-7.6-3.36-7.6-7.44s3.4-7.44 7.6-7.44c2.4 0 3.82.96 4.7 1.84l2.44-2.44C19.4 3.22 16.4.8 12.48.8 5.8 0 .8 5.6.8 12.24s5 12.24 11.68 12.24c6.8 0 11.4-4.52 11.4-11.52 0-.76-.08-1.52-.2-2.24h-11.4z"></path></svg>
                                    Continue with Google Workspace
                                </button>
                                <button
                                    disabled={true}
                                    className="w-full flex items-center justify-center py-3 px-4 border border-gray-700 rounded-lg text-gray-500 bg-gray-800/50 cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7H7v6h6V7z" /><path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1v-2H2a1 1 0 110-2h1V7a2 2 0 012-2h2V2zM5 7v6h2V7H5zm4 0v6h2V7H9zm4 0v6h2V7h-2z" clipRule="evenodd" /></svg>
                                    Microsoft Azure AD (Coming Soon)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center space-y-4">
                        <p className="text-xs text-gray-500">
                            Protected by Sovereign AI Sentinel™ • 256-bit Quantum Encryption
                        </p>
                        <div className="flex justify-center space-x-4 text-xs text-gray-600">
                            <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-cyan-500 transition-colors">Terms of Service</a>
                            <span>•</span>
                            <a href="#" className="hover:text-cyan-500 transition-colors">System Status</a>
                        </div>
                        <p className="text-[10px] text-gray-700 mt-4">
                            © {new Date().getFullYear()} Sovereign Financial Systems. All rights reserved. Unauthorized access is a federal offense.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - AI Dashboard Simulation */}
            {renderAiTerminal()}
        </div>
    );
};

export default LoginView;