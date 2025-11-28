
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from './Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';

// --- Real-time Trading Types ---
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
}

interface OrderBookItem {
    price: number;
    size: number;
    total: number;
    type: 'bid' | 'ask';
}

interface TradeHistoryItem {
    id: string;
    price: number;
    amount: number;
    time: string;
    type: 'buy' | 'sell';
}

// --- Mock Data Generator for Live Feed ---
const generateStockData = (): StockTicker[] => [
    { symbol: 'BTC-USD', name: 'Bitcoin', price: 64230.50, change: 1200.25, changePercent: 1.89, volume: 450000000, high: 65000.00, low: 63000.00, marketCap: '1.2T', sector: 'Crypto' },
    { symbol: 'ETH-USD', name: 'Ethereum', price: 3450.00, change: -25.10, changePercent: -0.72, volume: 220000000, high: 3500.50, low: 3400.90, marketCap: '400B', sector: 'Crypto' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, change: 1.25, changePercent: 0.72, volume: 45000000, high: 174.10, low: 172.00, marketCap: '2.7T', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 330.00, change: -2.10, changePercent: -0.63, volume: 22000000, high: 333.50, low: 328.90, marketCap: '2.5T', sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.60, change: -5.20, changePercent: -2.07, volume: 98000000, high: 252.00, low: 242.10, marketCap: '780B', sector: 'Consumer Cyclical' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 460.10, change: 10.50, changePercent: 2.34, volume: 55000000, high: 465.00, low: 455.00, marketCap: '1.1T', sector: 'Technology' },
];

const generateOrderBook = (basePrice: number): OrderBookItem[] => {
    const spread = basePrice * 0.0005;
    const asks = Array.from({ length: 12 }, (_, i) => ({
        price: basePrice + spread + (i * basePrice * 0.0002),
        size: Math.random() * 2,
        total: 0,
        type: 'ask' as const
    })).reverse();
    
    const bids = Array.from({ length: 12 }, (_, i) => ({
        price: basePrice - spread - (i * basePrice * 0.0002),
        size: Math.random() * 2,
        total: 0,
        type: 'bid' as const
    }));
    return [...asks, ...bids];
};

const generateLiveChartData = (basePrice: number, points: number) => {
    let currentPrice = basePrice;
    return Array.from({ length: points }, (_, i) => {
        const time = new Date(Date.now() - (points - i) * 60000);
        currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.005);
        return {
            time: time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0'),
            price: currentPrice,
            volume: Math.floor(Math.random() * 1000)
        };
    });
};

const InvestmentsView: React.FC = () => {
    const [stocks, setStocks] = useState<StockTicker[]>(generateStockData());
    const [selectedStock, setSelectedStock] = useState<StockTicker>(stocks[0]);
    const [chartData, setChartData] = useState(generateLiveChartData(selectedStock.price, 60));
    const [orderBook, setOrderBook] = useState<OrderBookItem[]>(generateOrderBook(selectedStock.price));
    const [trades, setTrades] = useState<TradeHistoryItem[]>([]);
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');

    // Simulate live feed updates
    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Tick Price
            const priceChange = (Math.random() - 0.5) * (selectedStock.price * 0.001);
            const newPrice = selectedStock.price + priceChange;
            
            setSelectedStock(prev => ({
                ...prev,
                price: newPrice,
                change: prev.change + priceChange,
                changePercent: ((prev.change + priceChange) / (prev.price - prev.change)) * 100
            }));

            // 2. Update Chart
            setChartData(prev => {
                const lastPoint = prev[prev.length - 1];
                const now = new Date();
                const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
                
                if (lastPoint.time === timeStr) {
                    // Update last candle
                    const updatedLast = { ...lastPoint, price: newPrice, volume: lastPoint.volume + Math.random() * 10 };
                    return [...prev.slice(0, -1), updatedLast];
                } else {
                    // New candle
                    return [...prev.slice(1), { time: timeStr, price: newPrice, volume: Math.random() * 10 }];
                }
            });

            // 3. Update Order Book
            setOrderBook(generateOrderBook(newPrice));

            // 4. Simulate Trade
            if (Math.random() > 0.5) {
                const newTrade: TradeHistoryItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    price: newPrice,
                    amount: Math.random() * 0.5,
                    time: new Date().toLocaleTimeString([], { hour12: false }),
                    type: Math.random() > 0.5 ? 'buy' : 'sell'
                };
                setTrades(prev => [newTrade, ...prev].slice(0, 20));
            }

        }, 1000); // 1 second tick

        return () => clearInterval(interval);
    }, [selectedStock.symbol]); // Re-bind when symbol changes

    const handleStockSelect = (stock: StockTicker) => {
        setSelectedStock(stock);
        setChartData(generateLiveChartData(stock.price, 60));
        setOrderBook(generateOrderBook(stock.price));
        setTrades([]);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 border border-gray-700 p-2 rounded shadow-xl text-xs">
                    <p className="text-gray-400">{label}</p>
                    <p className="text-white font-mono">Price: <span className="text-cyan-400">${payload[0].value.toFixed(2)}</span></p>
                    <p className="text-white font-mono">Vol: <span className="text-gray-400">{Math.floor(payload[0].payload.volume)}</span></p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full flex flex-col gap-4 text-xs md:text-sm bg-[#0b0e11] text-gray-300 p-2 -m-6 overflow-hidden">
            {/* Header: Ticker Info */}
            <div className="flex items-center justify-between bg-[#15191e] p-3 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-2xl font-bold text-white">{selectedStock.symbol}</h1>
                        <span className="text-gray-500">{selectedStock.name}</span>
                    </div>
                    <div className={`flex items-baseline gap-2 ${selectedStock.change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                        <span className="text-2xl font-mono font-medium">${selectedStock.price.toFixed(2)}</span>
                        <span className="text-sm font-mono">{selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)</span>
                    </div>
                </div>
                <div className="hidden md:flex gap-6 text-xs">
                    <div>
                        <p className="text-gray-500">24h High</p>
                        <p className="text-white font-mono">{selectedStock.high.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">24h Low</p>
                        <p className="text-white font-mono">{selectedStock.low.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">24h Vol</p>
                        <p className="text-white font-mono">{(selectedStock.volume / 1000000).toFixed(2)}M</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 gap-1 min-h-0">
                {/* Left: Watchlist & Trades */}
                <div className="w-64 hidden xl:flex flex-col gap-1">
                    <div className="flex-1 bg-[#15191e] flex flex-col">
                        <div className="p-2 border-b border-gray-800 font-bold text-gray-400">Market</div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                             <table className="w-full text-left">
                                <thead className="text-gray-500 sticky top-0 bg-[#15191e]">
                                    <tr>
                                        <th className="p-2 font-normal">Pair</th>
                                        <th className="p-2 text-right font-normal">Price</th>
                                        <th className="p-2 text-right font-normal">Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map(stock => (
                                        <tr 
                                            key={stock.symbol} 
                                            onClick={() => handleStockSelect(stock)}
                                            className={`cursor-pointer hover:bg-[#2b3139] ${selectedStock.symbol === stock.symbol ? 'bg-[#2b3139]' : ''}`}
                                        >
                                            <td className="p-2 text-white">{stock.symbol}</td>
                                            <td className="p-2 text-right font-mono text-white">{stock.price.toFixed(2)}</td>
                                            <td className={`p-2 text-right font-mono ${stock.changePercent >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                                                {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="h-1/3 bg-[#15191e] flex flex-col border-t border-gray-800">
                        <div className="p-2 border-b border-gray-800 font-bold text-gray-400">Recent Trades</div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-gray-500">
                                        <th className="p-1 pl-2 font-normal">Price</th>
                                        <th className="p-1 text-right font-normal">Amount</th>
                                        <th className="p-1 text-right font-normal pr-2">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trades.map((trade, i) => (
                                        <tr key={i} className="hover:bg-[#2b3139]">
                                            <td className={`p-1 pl-2 font-mono ${trade.type === 'buy' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{trade.price.toFixed(2)}</td>
                                            <td className="p-1 text-right text-gray-300 font-mono">{trade.amount.toFixed(4)}</td>
                                            <td className="p-1 text-right text-gray-500 font-mono pr-2">{trade.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Middle: Chart */}
                <div className="flex-1 bg-[#15191e] flex flex-col min-w-0">
                    <div className="h-10 border-b border-gray-800 flex items-center px-4 gap-4 text-gray-400">
                        <button className="text-white font-bold">Time</button>
                        <button className="hover:text-white">1m</button>
                        <button className="text-white hover:text-white">15m</button>
                        <button className="hover:text-white">1H</button>
                        <button className="hover:text-white">4H</button>
                        <button className="hover:text-white">1D</button>
                        <div className="flex-1"></div>
                        <button className="hover:text-white">Indicators</button>
                    </div>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ecb81" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0ecb81" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" vertical={false} />
                                <XAxis dataKey="time" stroke="#5e6673" tick={{fontSize: 10}} minTickGap={30} />
                                <YAxis 
                                    domain={['dataMin', 'dataMax']} 
                                    orientation="right" 
                                    stroke="#5e6673" 
                                    tick={{fontSize: 10}} 
                                    tickFormatter={(val) => val.toFixed(2)}
                                    width={60}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#5e6673', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#0ecb81" 
                                    fillOpacity={1} 
                                    fill="url(#colorPrice)" 
                                    strokeWidth={2}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Order Book & Trade Form */}
                <div className="w-72 bg-[#15191e] flex flex-col gap-1 border-l border-gray-800">
                    {/* Order Book */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-2 font-bold text-gray-400 border-b border-gray-800">Order Book</div>
                        <div className="flex-1 flex flex-col text-xs overflow-hidden relative">
                             <div className="flex text-gray-500 p-1 pr-3">
                                <span className="flex-1">Price</span>
                                <span className="flex-1 text-right">Amount</span>
                                <span className="flex-1 text-right">Total</span>
                            </div>
                            <div className="flex-1 overflow-hidden flex flex-col">
                                {/* Asks */}
                                <div className="flex-1 overflow-hidden flex flex-col-reverse">
                                    {orderBook.filter(o => o.type === 'ask').slice(0, 14).map((order, i) => (
                                        <div key={`ask-${i}`} className="flex p-0.5 pr-3 hover:bg-[#2b3139] relative">
                                            <div className="absolute inset-0 bg-[#f6465d]/10" style={{width: `${Math.random() * 100}%`, right: 0}}></div>
                                            <span className="flex-1 text-[#f6465d] font-mono z-10">{order.price.toFixed(2)}</span>
                                            <span className="flex-1 text-right text-gray-300 font-mono z-10">{order.size.toFixed(4)}</span>
                                            <span className="flex-1 text-right text-gray-300 font-mono z-10">{(order.price * order.size).toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Spread */}
                                <div className="h-8 flex items-center justify-center border-y border-gray-800 my-1">
                                    <span className={`text-lg font-mono font-bold ${selectedStock.change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                                        {selectedStock.price.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                        ${selectedStock.price.toFixed(2)}
                                    </span>
                                </div>
                                {/* Bids */}
                                <div className="flex-1 overflow-hidden">
                                    {orderBook.filter(o => o.type === 'bid').slice(0, 14).map((order, i) => (
                                        <div key={`bid-${i}`} className="flex p-0.5 pr-3 hover:bg-[#2b3139] relative">
                                             <div className="absolute inset-0 bg-[#0ecb81]/10" style={{width: `${Math.random() * 100}%`, right: 0}}></div>
                                            <span className="flex-1 text-[#0ecb81] font-mono z-10">{order.price.toFixed(2)}</span>
                                            <span className="flex-1 text-right text-gray-300 font-mono z-10">{order.size.toFixed(4)}</span>
                                            <span className="flex-1 text-right text-gray-300 font-mono z-10">{(order.price * order.size).toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trade Form */}
                    <div className="h-auto p-3 border-t border-gray-800">
                        <div className="flex bg-[#0b0e11] rounded p-0.5 mb-4">
                            <button 
                                onClick={() => setTradeType('buy')}
                                className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${tradeType === 'buy' ? 'bg-[#0ecb81] text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Buy
                            </button>
                            <button 
                                onClick={() => setTradeType('sell')}
                                className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${tradeType === 'sell' ? 'bg-[#f6465d] text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Sell
                            </button>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <button onClick={() => setOrderType('limit')} className={orderType === 'limit' ? 'text-[#f0b90b]' : ''}>Limit</button>
                            <button onClick={() => setOrderType('market')} className={orderType === 'market' ? 'text-[#f0b90b]' : ''}>Market</button>
                            <button>Stop-Limit</button>
                        </div>

                        <div className="space-y-3">
                             {orderType === 'limit' && (
                                <div className="bg-[#2b3139] rounded flex items-center px-3 py-2 border border-transparent focus-within:border-[#f0b90b]">
                                    <span className="text-gray-500 w-12">Price</span>
                                    <input className="bg-transparent text-right w-full text-white outline-none font-mono" defaultValue={selectedStock.price.toFixed(2)} />
                                    <span className="text-gray-500 ml-2">USD</span>
                                </div>
                             )}
                            <div className="bg-[#2b3139] rounded flex items-center px-3 py-2 border border-transparent focus-within:border-[#f0b90b]">
                                <span className="text-gray-500 w-12">Amount</span>
                                <input className="bg-transparent text-right w-full text-white outline-none font-mono" placeholder="0.00" />
                                <span className="text-gray-500 ml-2">{selectedStock.symbol.split('-')[0]}</span>
                            </div>
                            
                            <div className="flex justify-between text-xs text-gray-500 px-1">
                                <span>Avail: 0.00 USD</span>
                            </div>

                            <button className={`w-full py-3 rounded font-bold text-white text-sm ${tradeType === 'buy' ? 'bg-[#0ecb81] hover:bg-[#0ecb81]/90' : 'bg-[#f6465d] hover:bg-[#f6465d]/90'}`}>
                                {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedStock.symbol.split('-')[0]}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentsView;
