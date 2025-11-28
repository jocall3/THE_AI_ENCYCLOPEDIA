import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { APIStatus } from '../types';
import Card from './Card';
import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip } from 'recharts';


function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

const APIIntegrationView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("APIIntegrationView must be within a DataProvider.");
    const { 
        apiStatus, 
        geminiApiKey, setGeminiApiKey,
        modernTreasuryApiKey, setModernTreasuryApiKey,
        modernTreasuryOrganizationId, setModernTreasuryOrganizationId
    } = context;

    const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
    const [geminiApiKeyInput, setGeminiApiKeyInput] = useState(geminiApiKey || '');

    const [isMtModalOpen, setIsMtModalOpen] = useState(false);
    const [mtApiKeyInput, setMtApiKeyInput] = useState(modernTreasuryApiKey || '');
    const [mtOrgIdInput, setMtOrgIdInput] = useState(modernTreasuryOrganizationId || '');

    const handleSaveGeminiKey = () => {
        setGeminiApiKey(geminiApiKeyInput);
        setIsGeminiModalOpen(false);
    };

    const handleSaveMtKey = () => {
        setModernTreasuryApiKey(mtApiKeyInput);
        setModernTreasuryOrganizationId(mtOrgIdInput);
        setIsMtModalOpen(false);
    };

    const StatusIndicator: React.FC<{ status: APIStatus['status'] }> = ({ status }) => {
        const colors = {
            'Operational': { bg: 'bg-green-500/20', text: 'text-green-300', dot: 'bg-green-400' },
            'Degraded Performance': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', dot: 'bg-yellow-400' },
            'Partial Outage': { bg: 'bg-orange-500/20', text: 'text-orange-300', dot: 'bg-orange-400' },
            'Major Outage': { bg: 'bg-red-500/20', text: 'text-red-300', dot: 'bg-red-400' },
        };
        const style = colors[status];
        return (
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                {status}
            </div>
        );
    };

    return (
        <>
            {isGeminiModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setIsGeminiModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">Configure Google Gemini API Key</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-400">Enter your API key to enable all AI features. Your key is stored locally in your browser and is not sent to our servers.</p>
                            <input
                                type="password"
                                value={geminiApiKeyInput}
                                onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                                placeholder="Enter your Gemini API Key"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <button onClick={handleSaveGeminiKey} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Save Key</button>
                        </div>
                    </div>
                </div>
            )}
             {isMtModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setIsMtModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">Configure Modern Treasury API</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-400">Enter your API key and Organization ID to enable payment operations. Your credentials are stored locally.</p>
                            <input
                                type="password"
                                value={mtApiKeyInput}
                                onChange={(e) => setMtApiKeyInput(e.target.value)}
                                placeholder="Enter your Modern Treasury API Key"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                             <input
                                type="text"
                                value={mtOrgIdInput}
                                onChange={(e) => setMtOrgIdInput(e.target.value)}
                                placeholder="Enter your Organization ID"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                            <button onClick={handleSaveMtKey} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Save Credentials</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-wider">System & API Status</h2>
                <Card>
                    <div className="space-y-3">
                        {apiStatus.map(api => (
                            <div key={api.provider} className="flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                                <h4 className="font-semibold text-lg text-white mb-2 sm:mb-0">{api.provider}</h4>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-400 font-mono">{api.responseTime}ms</p>
                                    <StatusIndicator status={api.status} />
                                    {api.provider === 'Google Gemini' && (
                                        <button onClick={() => { setGeminiApiKeyInput(geminiApiKey || ''); setIsGeminiModalOpen(true); }} className="text-gray-400 hover:text-white">
                                            <SettingsIcon className="h-5 w-5"/>
                                        </button>
                                    )}
                                    {api.provider === 'Modern Treasury' && (
                                        <button onClick={() => { setMtApiKeyInput(modernTreasuryApiKey || ''); setMtOrgIdInput(modernTreasuryOrganizationId || ''); setIsMtModalOpen(true); }} className="text-gray-400 hover:text-white">
                                            <SettingsIcon className="h-5 w-5"/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Simulated Live API Traffic">
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={Array.from({length: 20}, (_, i) => ({name: i, calls: 50 + Math.random() * 50}))}>
                                <defs><linearGradient id="apiColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                <Area type="monotone" dataKey="calls" stroke="#06b6d4" fill="url(#apiColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default APIIntegrationView;