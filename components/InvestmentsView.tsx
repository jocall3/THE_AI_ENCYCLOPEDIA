
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Card from './Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { Search, Menu, ChevronLeft, ChevronRight, Activity, Globe, Server, Database, Shield, Cpu, Zap, Settings as SettingsIcon, Brain } from 'lucide-react';

// --- Types ---

interface StockTicker {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    marketCap: string;
    name: string;
    sector: string;
    aiScore: number; // 0-100
    sentiment: 'bullish' | 'bearish' | 'neutral';
    volatilityIndex: number;
}

interface OrderBookItem {
    price: number;
    size: number;
    total: number;
    type: 'bid' | 'ask';
}

interface AIInsight {
    id: string;
    timestamp: string;
    category: 'Risk' | 'Opportunity' | 'Anomaly' | 'Prediction';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    confidence: number;
    relatedAsset?: string;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'system';
    text: string;
    timestamp: string;
}

interface OperationNode {
    id: string;
    name: string;
    status: 'optimal' | 'degraded' | 'critical';
    load: number;
    region: string;
}

// --- Live Data Service ---

const fetchLiveCryptoPrices = async (): Promise<Record<string, number>> => {
    try {
        // Public API for demo purposes (CoinGecko)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano&vs_currencies=usd');
        if (!response.ok) throw new Error("Rate limit");
        const data = await response.json();
        return {
            'BTC-USD': data.bitcoin.usd,
            'ETH-USD': data.ethereum.usd,
            'SOL-USD': data.solana.usd,
            'XRP-USD': data.ripple.usd,
            'ADA-USD': data.cardano.usd
        };
    } catch (e) {
        // Fallback if API fails/rate limits
        return {
            'BTC-USD': 64230.50,
            'ETH-USD': 3450.00,
            'SOL-USD': 145.20,
            'XRP-USD': 0.62,
            'ADA-USD': 0.45
        };
    }
};

// --- Initial Data Generators ---

const generateStockData = (livePrices?: Record<string, number>): StockTicker[] => [
    { symbol: 'BTC-USD', name: 'Bitcoin Core', price: livePrices?.['BTC-USD'] || 64230.50, change: 0, changePercent: 0, volume: 450000000, high: 0, low: 0, marketCap: '1.2T', sector: 'Crypto', aiScore: 88, sentiment: 'bullish', volatilityIndex: 0.45 },
    { symbol: 'ETH-USD', name: 'Ethereum Network', price: livePrices?.['ETH-USD'] || 3450.00, change: 0, changePercent: 0, volume: 220000000, high: 0, low: 0, marketCap: '400B', sector: 'Crypto', aiScore: 72, sentiment: 'neutral', volatilityIndex: 0.38 },
    { symbol: 'SOL-USD', name: 'Solana', price: livePrices?.['SOL-USD'] || 145.20, change: 0, changePercent: 0, volume: 80000000, high: 0, low: 0, marketCap: '65B', sector: 'Crypto', aiScore: 91, sentiment: 'bullish', volatilityIndex: 0.65 },
    { symbol: 'NVDA', name: 'NVIDIA AI Compute', price: 890.10, change: 15.50, changePercent: 1.74, volume: 55000000, high: 900.00, low: 880.00, marketCap: '2.2T', sector: 'Technology', aiScore: 96, sentiment: 'bullish', volatilityIndex: 0.25 },
    { symbol: 'MSFT', name: 'Microsoft Enterprise', price: 420.00, change: -2.10, changePercent: -0.50, volume: 22000000, high: 425.50, low: 418.90, marketCap: '3.1T', sector: 'Technology', aiScore: 91, sentiment: 'bullish', volatilityIndex: 0.15 },
];

const generateOrderBook = (basePrice: number): OrderBookItem[] => {
    const spread = basePrice * 0.0005;
    const asks = Array.from({ length: 15 }, (_, i) => ({
        price: basePrice + spread + (i * basePrice * 0.0002),
        size: Math.random() * 2 + 0.1,
        total: 0,
        type: 'ask' as const
    })).reverse();
    
    const bids = Array.from({ length: 15 }, (_, i) => ({
        price: basePrice - spread - (i * basePrice * 0.0002),
        size: Math.random() * 2 + 0.1,
        total: 0,
        type: 'bid' as const
    }));
    return [...asks, ...bids];
};

const generateLiveChartData = (basePrice: number, points: number) => {
    let currentPrice = basePrice;
    return Array.from({ length: points }, (_, i) => {
        const time = new Date(Date.now() - (points - i) * 60000);
        // More realistic random walk
        const volatility = 0.002;
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        currentPrice += change;
        
        return {
            time: time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0'),
            price: currentPrice,
            volume: Math.floor(Math.random() * 5000) + 1000,
            aiPrediction: currentPrice * (1 + (Math.random() - 0.5) * 0.01),
            sentimentScore: 50 + (Math.random() - 0.5) * 20
        };
    });
};

const initialNodes: OperationNode[] = [
    { id: 'n1', name: 'Tokyo-1', status: 'optimal', load: 45, region: 'APAC' },
    { id: 'n2', name: 'London-Core', status: 'degraded', load: 88, region: 'EMEA' },
    { id: 'n3', name: 'NY-Fin', status: 'optimal', load: 32, region: 'NA' },
    { id: 'n4', name: 'Singapore-Edge', status: 'critical', load: 99, region: 'APAC' },
    { id: 'n5', name: 'Frankfurt-Data', status: 'optimal', load: 60, region: 'EMEA' },
];

// --- Main Component ---

const InvestmentsView: React.FC = () => {
    // --- Layout State ---
    const [activeTab, setActiveTab] = useState<'dashboard' | 'trading' | 'ai-hub' | 'operations' | 'settings'>('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // --- Data State ---
    const [stocks, setStocks] = useState<StockTicker[]>(generateStockData());
    const [selectedStock, setSelectedStock] = useState<StockTicker>(stocks[0]);
    const [chartData, setChartData] = useState(generateLiveChartData(stocks[0].price, 60));
    const [orderBook, setOrderBook] = useState<OrderBookItem[]>(generateOrderBook(stocks[0].price));
    
    // --- AI & Ops State ---
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: '1', sender: 'system', text: 'NEXUS-7 Operational. Connected to live global feeds.', timestamp: new Date().toLocaleTimeString() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [opsNodes, setOpsNodes] = useState<OperationNode[]>(initialNodes);
    
    // --- Settings State ---
    const [tickRate, setTickRate] = useState(1000); // ms
    const [showPredictions, setShowPredictions] = useState(true);

    // --- Initialization ---
    useEffect(() => {
        // Fetch real initial data
        fetchLiveCryptoPrices().then(prices => {
            const updatedStocks = generateStockData(prices);
            setStocks(updatedStocks);
            // Update selected stock if it matches a fetched one
            const current = updatedStocks.find(s => s.symbol === selectedStock.symbol);
            if (current) {
                setSelectedStock(current);
                setChartData(generateLiveChartData(current.price, 60));
                setOrderBook(generateOrderBook(current.price));
            }
        });
    }, []);

    // --- Live Ticker Loop ---
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

            setStocks(prev => prev.map(stock => {
                // Simulate market movement based on volatility
                const move = (Math.random() - 0.5) * (stock.price * 0.002);
                const newPrice = stock.price + move;
                
                return {
                    ...stock,
                    price: newPrice,
                    change: move,
                    changePercent: (move / stock.price) * 100,
                    high: newPrice > stock.high ? newPrice : stock.high || newPrice,
                    low: (newPrice < stock.low || stock.low === 0) ? newPrice : stock.low
                };
            }));

            // Update Chart for selected stock
            setChartData(prev => {
                const currentStock = stocks.find(s => s.symbol === selectedStock.symbol) || selectedStock;
                // Use the LATEST calculated price from the setStocks logic (approximation here for smoothness)
                const volatility = 0.001; 
                const move = (Math.random() - 0.5) * (currentStock.price * volatility);
                const newPrice = currentStock.price + move;
                
                const newPoint = {
                    time: timeStr,
                    price: newPrice,
                    volume: Math.floor(Math.random() * 1000),
                    aiPrediction: showPredictions ? newPrice * (1 + (Math.random() - 0.5) * 0.02) : 0,
                    sentimentScore: 50 + (Math.random() - 0.5) * 10
                };
                return [...prev.slice(1), newPoint];
            });

            // Update Order Book
            setOrderBook(prev => {
                // Shift prices slightly
                return prev.map(item => ({
                    ...item,
                    size: Math.max(0.1, item.size + (Math.random() - 0.5)),
                    price: item.price + (Math.random() - 0.5) * 0.5
                })).sort((a, b) => b.price - a.price);
            });

        }, tickRate);

        return () => clearInterval(interval);
    }, [selectedStock.symbol, tickRate, showPredictions, stocks]);

    // --- Handlers ---

    const handleStockSelect = (stock: StockTicker) => {
        setSelectedStock(stock);
        // Reset chart to base off new stock price
        setChartData(generateLiveChartData(stock.price, 60));
    };

    const handleAISend = async () => {
        if (!chatInput.trim()) return;
        
        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setIsAiThinking(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // Context injection
            const context = `
                Current Market Context:
                Selected Asset: ${selectedStock.symbol} at $${selectedStock.price.toFixed(2)}.
                Market Sentiment: ${selectedStock.sentiment}.
                AI Score: ${selectedStock.aiScore}/100.
                Recent Volatility: ${(selectedStock.volatilityIndex * 100).toFixed(1)}%.
                User is an enterprise trader asking about strategy.
                Respond briefly and professionally as a high-frequency trading AI assistant.
            `;

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: context + "\n\nUser Query: " + userMsg.text }] }]
            });

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'system',
                text: result.response.text(),
                timestamp: new Date().toLocaleTimeString()
            };
            setChatHistory(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'system',
                text: "Neural Link Interrupted. Utilizing fallback logic: Volatility suggests holding current positions.",
                timestamp: new Date().toLocaleTimeString()
            };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setIsAiThinking(false);
        }
    };

    const optimizeNode = (id: string) => {
        setOpsNodes(prev => prev.map(n => 
            n.id === id ? { ...n, status: 'optimal', load: Math.max(20, n.load - 30) } : n
        ));
    };

    // --- Renderers ---

    const renderSidebar = () => (
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#0b0e11] border-r border-gray-800 flex flex-col transition-all duration-300 z-30 flex-shrink-0`}>
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 cursor-pointer" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                    <span className="font-bold text-white text-xl">{sidebarCollapsed ? 'O' : 'OS'}</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-2 p-2 mt-4">
                {[
                    { id: 'dashboard', icon: Activity, label: 'Market Overview' },
                    { id: 'trading', icon: Globe, label: 'Active Trading' },
                    { id: 'ai-hub', icon: Brain, label: 'Neural Core' },
                    { id: 'operations', icon: Server, label: 'Enterprise Ops' },
                    { id: 'settings', icon: SettingsIcon, label: 'View Settings' }
                ].map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${activeTab === item.id ? 'bg-cyan-900/20 text-cyan-400 border-l-2 border-cyan-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        title={sidebarCollapsed ? item.label : ''}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span className="ml-3 text-sm font-medium truncate">{item.label}</span>}
                    </button>
                ))}
            </div>
            
            <div className="mt-auto p-4 border-t border-gray-800">
                 {!sidebarCollapsed ? (
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-green-400">SYSTEM ONLINE</span>
                        </div>
                        <div className="text-[10px] text-gray-500">Latency: 14ms</div>
                    </div>
                 ) : (
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto animate-pulse"></div>
                 )}
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="flex-1 p-6 overflow-y-auto bg-[#0b0e11] h-full">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stocks.slice(0, 4).map(stock => (
                    <Card key={stock.symbol} className="bg-[#15191e] border-gray-800 hover:border-cyan-500/50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-gray-400 text-xs font-bold uppercase">{stock.name}</h3>
                                <div className="text-2xl font-bold text-white mt-1">${stock.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded ${stock.change >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </div>
                        </div>
                        <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${stock.sentiment === 'bullish' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${stock.aiScore}%` }}></div>
                        </div>
                        <div className="mt-1 text-[10px] text-gray-500 text-right">AI Confidence: {stock.aiScore}%</div>
                    </Card>
                ))}
            </div>

            {/* Main Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] mb-6">
                <div className="lg:col-span-2 bg-[#15191e] border border-gray-800 rounded-lg flex flex-col">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="text-white font-bold text-lg">{selectedStock.symbol}</h2>
                            <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">Live Feed</span>
                        </div>
                        <div className="flex gap-2">
                            {['1H', '4H', '1D', '1W'].map(t => (
                                <button key={t} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded transition-colors">{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-2 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" />
                                <XAxis dataKey="time" stroke="#5e6673" tick={{fontSize: 10}} minTickGap={30} />
                                <YAxis domain={['auto', 'auto']} orientation="right" stroke="#5e6673" tick={{fontSize: 10}} tickFormatter={(val) => val.toFixed(2)} width={60} />
                                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                                <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#colorPrice)" strokeWidth={2} />
                                {showPredictions && <Area type="monotone" dataKey="aiPrediction" stroke="#8b5cf6" fill="none" strokeDasharray="5 5" strokeWidth={1} />}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Book */}
                <div className="bg-[#15191e] border border-gray-800 rounded-lg flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-gray-800 font-bold text-xs text-gray-400 uppercase">Order Book</div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {orderBook.map((order, i) => (
                            <div key={i} className="flex justify-between text-xs p-1 px-3 hover:bg-gray-800 relative">
                                <div className={`absolute inset-0 ${order.type === 'ask' ? 'bg-red-500/10' : 'bg-green-500/10'}`} style={{ width: `${Math.min(100, order.size * 20)}%` }}></div>
                                <span className={`z-10 font-mono ${order.type === 'ask' ? 'text-red-400' : 'text-green-400'}`}>{order.price.toFixed(2)}</span>
                                <span className="z-10 text-gray-400">{order.size.toFixed(4)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTrading = () => (
         <div className="flex-1 flex flex-col lg:flex-row bg-[#0b0e11] h-full overflow-hidden">
            {/* Asset List */}
            <div className="w-full lg:w-64 bg-[#15191e] border-r border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <input type="text" placeholder="Search Assets" className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {stocks.map(stock => (
                        <div 
                            key={stock.symbol} 
                            onClick={() => handleStockSelect(stock)}
                            className={`p-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${selectedStock.symbol === stock.symbol ? 'bg-gray-800 border-l-2 border-l-cyan-500' : ''}`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-white text-sm">{stock.symbol}</span>
                                <span className="text-white text-sm">${stock.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">{stock.name}</span>
                                <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>{stock.changePercent.toFixed(2)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Central Chart & Execution */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                 <div className="flex-1 bg-[#0b0e11] p-4 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                            <XAxis dataKey="time" stroke="#4b5563" />
                            <YAxis orientation="right" stroke="#4b5563" domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{backgroundColor: '#111827'}} />
                            <Area type="step" dataKey="price" stroke="#10b981" fill="url(#grad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="h-20 bg-[#15191e] border-t border-gray-800 p-4 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div>
                            <div className="text-xs text-gray-500 uppercase">Buying Power</div>
                            <div className="text-white font-mono font-bold">$245,000.00</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase">Exposure</div>
                            <div className="text-yellow-400 font-mono font-bold">12.5%</div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-2 rounded font-bold shadow-lg shadow-green-900/20">BUY</button>
                        <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-2 rounded font-bold shadow-lg shadow-red-900/20">SELL</button>
                    </div>
                 </div>
            </div>
        </div>
    );

    const renderOperations = () => (
        <div className="flex-1 p-8 bg-[#0b0e11] overflow-y-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Enterprise Operations Node Map</h1>
                <p className="text-gray-400">Real-time infrastructure optimization. Click nodes to re-route computational load.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interactive Node Map */}
                <div className="bg-[#15191e] rounded-xl border border-gray-800 p-6 relative min-h-[400px] flex items-center justify-center overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    
                    {/* Nodes */}
                    <div className="relative w-full h-full">
                        {opsNodes.map((node, i) => {
                            // Simple positioning logic
                            const top = 20 + (i * 15) + '%';
                            const left = 20 + (i % 2) * 50 + '%';
                            return (
                                <div 
                                    key={node.id}
                                    onClick={() => optimizeNode(node.id)}
                                    className={`absolute p-4 rounded-lg border transition-all duration-500 cursor-pointer transform hover:scale-110 ${node.status === 'optimal' ? 'bg-green-900/30 border-green-500' : node.status === 'critical' ? 'bg-red-900/30 border-red-500 animate-pulse' : 'bg-yellow-900/30 border-yellow-500'}`}
                                    style={{ top, left }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Server className={`w-4 h-4 ${node.status === 'optimal' ? 'text-green-400' : 'text-red-400'}`} />
                                        <span className="font-bold text-white text-sm">{node.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mb-2">{node.region}</div>
                                    <div className="w-32 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${node.load > 90 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{width: `${node.load}%`}}></div>
                                    </div>
                                    <div className="text-[10px] text-right mt-1 text-gray-500">{node.load}% Load</div>
                                </div>
                            );
                        })}
                        
                        {/* Connection Lines (SVG Overlay) */}
                        <svg className="absolute inset-0 pointer-events-none opacity-30">
                            <path d="M150 100 L 400 200 L 150 300" stroke="#4b5563" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                </div>

                {/* Operations Log */}
                <div className="flex flex-col gap-4">
                    <Card title="System Events" className="flex-1 bg-[#15191e] border-gray-800">
                        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                            {opsNodes.filter(n => n.status !== 'optimal').map(n => (
                                <div key={n.id + 'alert'} className="p-3 bg-gray-800/50 border-l-2 border-red-500 rounded flex justify-between items-center">
                                    <div>
                                        <div className="text-red-400 text-xs font-bold uppercase">Latency Spike</div>
                                        <div className="text-white text-sm">{n.name} load exceeded 90% threshold.</div>
                                    </div>
                                    <button onClick={() => optimizeNode(n.id)} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded">Fix</button>
                                </div>
                            ))}
                            <div className="p-3 bg-gray-800/50 border-l-2 border-green-500 rounded">
                                <div className="text-green-400 text-xs font-bold uppercase">Optimization</div>
                                <div className="text-white text-sm">Route B-72 rebalanced successfully.</div>
                            </div>
                             <div className="p-3 bg-gray-800/50 border-l-2 border-blue-500 rounded">
                                <div className="text-blue-400 text-xs font-bold uppercase">Sync</div>
                                <div className="text-white text-sm">Global ledger synchronization complete.</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderAIHub = () => (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#0b0e11] overflow-hidden">
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex-1 bg-[#15191e] border border-gray-800 rounded-xl flex flex-col shadow-2xl">
                    <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-[#15191e] to-[#1a2026]">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isAiThinking ? 'bg-purple-500 animate-ping' : 'bg-green-500'}`}></div>
                            <h2 className="text-lg font-bold text-white">NEXUS-7 Neural Interface</h2>
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {chatHistory.map((msg, idx) => (
                            <div key={msg.id + idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
                                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                                    <div className="text-[10px] opacity-50 mt-2 text-right">{msg.timestamp}</div>
                                </div>
                            </div>
                        ))}
                        {isAiThinking && (
                             <div className="flex justify-start">
                                <div className="bg-gray-800 p-4 rounded-xl rounded-bl-none border border-gray-700 flex gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-800 bg-[#1a2026]">
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleAISend()}
                                placeholder="Analyze market conditions..."
                                className="flex-1 bg-[#0b0e11] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none"
                            />
                            <button onClick={handleAISend} className="px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold">
                                SEND
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="w-full lg:w-80 bg-[#15191e] border-l border-gray-800 p-6 overflow-y-auto">
                <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Active Directives</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex justify-between mb-2">
                            <span className="text-white font-bold text-sm">Risk Mitigation</span>
                            <span className="text-green-400 text-xs">Active</span>
                        </div>
                        <p className="text-xs text-gray-400">Monitoring BTC-USD variance for liquidation thresholds.</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex justify-between mb-2">
                            <span className="text-white font-bold text-sm">Sentiment Analysis</span>
                            <span className="text-yellow-400 text-xs">Learning</span>
                        </div>
                        <p className="text-xs text-gray-400">Ingesting global news feeds. Volatility index updated.</p>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Model Performance</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400"><span>Accuracy</span><span>94.2%</span></div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="bg-purple-500 h-full w-[94%]"></div></div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2"><span>Throughput</span><span>12k TPS</span></div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="bg-blue-500 h-full w-[60%]"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="flex-1 p-8 bg-[#0b0e11] overflow-y-auto">
             <h1 className="text-3xl font-bold text-white mb-8">System Configuration</h1>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Data Feed Configuration" className="bg-[#15191e] border-gray-800">
                    <div className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm block mb-2">Simulation Tick Rate (ms)</label>
                            <div className="flex items-center gap-4">
                                <input type="range" min="100" max="2000" value={tickRate} onChange={e => setTickRate(Number(e.target.value))} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                <span className="text-white font-mono w-12">{tickRate}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span className="text-white text-sm">Show AI Prediction Layer</span>
                            <button 
                                onClick={() => setShowPredictions(!showPredictions)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${showPredictions ? 'bg-cyan-600' : 'bg-gray-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${showPredictions ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </Card>

                <Card title="Security Protocols" className="bg-[#15191e] border-gray-800">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 border-b border-gray-800">
                            <span className="text-gray-300 text-sm">Two-Factor Auth</span>
                            <span className="text-green-400 text-xs font-bold">ENABLED</span>
                        </div>
                        <div className="flex justify-between items-center p-2 border-b border-gray-800">
                            <span className="text-gray-300 text-sm">API Key Rotation</span>
                            <span className="text-yellow-400 text-xs font-bold">30 DAYS</span>
                        </div>
                        <div className="flex justify-between items-center p-2">
                            <span className="text-gray-300 text-sm">Session Timeout</span>
                            <span className="text-white text-xs">15 MIN</span>
                        </div>
                    </div>
                </Card>
             </div>
        </div>
    );

    return (
        <div className="flex h-screen w-full overflow-hidden bg-black text-white">
            {renderSidebar()}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                 {activeTab === 'dashboard' && renderDashboard()}
                 {activeTab === 'trading' && renderTrading()}
                 {activeTab === 'ai-hub' && renderAIHub()}
                 {activeTab === 'operations' && renderOperations()}
                 {activeTab === 'settings' && renderSettings()}
            </div>
        </div>
    );
};

export default InvestmentsView;
