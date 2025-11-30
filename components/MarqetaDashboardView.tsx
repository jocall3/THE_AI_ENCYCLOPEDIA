
import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, MarqetaCardProduct } from '../types';
import { Settings, RefreshCw, CreditCard, Zap } from 'lucide-react';

const MarqetaDashboardView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("MarqetaDashboardView must be used within a DataProvider");

    const { 
        marqetaCardProducts, 
        fetchMarqetaProducts, 
        isMarqetaLoading, 
        marqetaApiToken, 
        marqetaApiSecret, 
        setMarqetaCredentials,
        setActiveView 
    } = context;

    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState(marqetaApiToken || '');
    const [secretInput, setSecretInput] = useState(marqetaApiSecret || '');

    useEffect(() => {
        if (marqetaApiToken && marqetaApiSecret && marqetaCardProducts.length === 0) {
            fetchMarqetaProducts();
        }
    }, [marqetaApiToken, marqetaApiSecret]);

    const handleSaveConfig = () => {
        setMarqetaCredentials(tokenInput, secretInput);
        setIsConfigOpen(false);
        fetchMarqetaProducts();
    };

    const handlePersonalize = () => {
        setActiveView(View.CardCustomization);
    };

    if (!marqetaApiToken || !marqetaApiSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-center">
                <div className="mb-8">
                     <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest uppercase">
                        Marqeta Card Command
                    </h1>
                    <p className="text-gray-400 mt-2">Secure connection required to access card product registry.</p>
                </div>
                
                <Card title="API Configuration" className="max-w-md w-full border-red-500/50">
                    <div className="space-y-4 p-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Application Token</label>
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter application token..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 text-left">Admin Access Token</label>
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mt-1"
                                placeholder="Enter admin secret..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Connect to Marqeta Sandbox
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen space-y-8">
            <header className="flex justify-between items-center border-b border-gray-700 pb-6">
                 <div>
                    <h1 className="text-3xl font-bold text-white">Marqeta Card Programs</h1>
                    <p className="text-gray-400 text-sm mt-1">Live sandbox environment via API v3</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={fetchMarqetaProducts} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                        <RefreshCw className={`w-5 h-5 ${isMarqetaLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => setIsConfigOpen(true)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {isConfigOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <Card title="Update API Credentials" className="max-w-md w-full relative">
                        <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <div className="space-y-4 p-4">
                            <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                            />
                            <input 
                                type="password" 
                                value={secretInput} 
                                onChange={e => setSecretInput(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                            />
                            <button onClick={handleSaveConfig} className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold">Save & Reconnect</button>
                        </div>
                    </Card>
                </div>
            )}

            {isMarqetaLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                    <p className="text-gray-400">Syncing card products...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {marqetaCardProducts.map(product => (
                        <Card key={product.token} className="border-l-4 border-cyan-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                {/* Card Visual */}
                                <div className="w-full md:w-1/3">
                                    <div className="aspect-[1.586] bg-gradient-to-br from-gray-800 to-black rounded-xl border border-gray-600 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
                                        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="flex justify-between items-start relative z-10">
                                            <CreditCard className="w-8 h-8 text-white opacity-80" />
                                            <span className="text-xs font-mono text-gray-400">{product.token.substring(0, 8)}</span>
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-lg font-bold text-white tracking-widest mb-1">{product.name}</p>
                                            <div className="flex justify-between text-xs text-gray-400 font-mono">
                                                <span>**** **** **** {product.config.fulfillment.bin_prefix.substring(0,4)}</span>
                                                <span>EXP 12/29</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase">Status</p>
                                            <p className={`font-bold ${product.active ? 'text-green-400' : 'text-red-400'}`}>
                                                {product.active ? 'ACTIVE' : 'INACTIVE'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase">Start Date</p>
                                            <p className="text-white font-mono">{product.start_date}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase">Fulfillment</p>
                                            <p className="text-white">{product.config.fulfillment.fulfillment_provider}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase">Instrument</p>
                                            <p className="text-white">{product.config.fulfillment.payment_instrument}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-800 rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto">
                                        <p>POI: {JSON.stringify(product.config.poi.other)}</p>
                                        <p className="mt-1">JIT Funding: {product.config.jit_funding?.program_funding_source?.enabled ? 'ENABLED' : 'DISABLED'}</p>
                                    </div>

                                    <button 
                                        onClick={handlePersonalize}
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02]"
                                    >
                                        <Zap className="w-4 h-4 text-yellow-300" />
                                        Personalize with AI Designer
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {marqetaCardProducts.length === 0 && (
                         <div className="text-center text-gray-500 py-12">
                            No card products found. Please verify credentials or create a program in the sandbox.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MarqetaDashboardView;
