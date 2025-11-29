import React, { useState, useEffect, useRef, useCallback } from 'react';

// -----------------------------------------------------------------------------
// TYPES & INTERFACES
// -----------------------------------------------------------------------------

type ModuleType = 'DASHBOARD' | 'FOREX' | 'AI_CHAT' | 'KPIS' | 'PROFILE' | 'SYSTEM';

interface ExchangeRate {
    bid: number;
    ask: number;
}

interface Exchange {
    id: string;
    name: string;
}

interface CurrencyPair {
    symbol: string;
    base: string;
    quote: string;
}

interface ArbitrageOpportunity {
    pair: string;
    buyExchange: string;
    sellExchange: string;
    buyPrice: number;
    sellPrice: number;
    profitMargin: number;
    timestamp: number;
}

interface UserProfile {
    id: string;
    name: string;
    role: string;
    clearanceLevel: number;
    avatar: string;
    efficiencyScore: number;
}

interface ChatMessage {
    id: string;
    sender: 'USER' | 'AI';
    text: string;
    timestamp: number;
    intent?: string;
}

interface KPI {
    id: string;
    label: string;
    value: number;
    unit: string;
    trend: 'UP' | 'DOWN' | 'STABLE';
    change: number;
    aiPrediction: string;
}

interface SystemLog {
    id: string;
    timestamp: number;
    level: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
    message: string;
    source: string;
}

// -----------------------------------------------------------------------------
// CONFIGURATION & MOCK DATA
// -----------------------------------------------------------------------------

const SIMULATED_EXCHANGES: Exchange[] = [
    { id: 'ex1', name: 'GlobalMarket Prime' },
    { id: 'ex2', name: 'FXPro Quantum' },
    { id: 'ex3', name: 'TradePulse AI' },
    { id: 'ex4', name: 'Nexus Liquidity' },
    { id: 'ex5', name: 'Stellar Flow' },
    { id: 'ex6', name: 'OmniExchange' },
];

const CURRENCY_PAIRS: CurrencyPair[] = [
    { symbol: 'EUR/USD', base: 'EUR', quote: 'USD' },
    { symbol: 'GBP/JPY', base: 'GBP', quote: 'JPY' },
    { symbol: 'USD/CAD', base: 'USD', quote: 'CAD' },
    { symbol: 'AUD/NZD', base: 'AUD', quote: 'NZD' },
    { symbol: 'CHF/JPY', base: 'CHF', quote: 'JPY' },
    { symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP' },
    { symbol: 'USD/CNH', base: 'USD', quote: 'CNH' },
    { symbol: 'XAU/USD', base: 'XAU', quote: 'USD' },
];

const INITIAL_KPIS: KPI[] = [
    { id: 'k1', label: 'Global Revenue', value: 42500000, unit: 'USD', trend: 'UP', change: 2.4, aiPrediction: 'Projected +5% via AI optimization' },
    { id: 'k2', label: 'OpEx Efficiency', value: 94.2, unit: '%', trend: 'UP', change: 0.8, aiPrediction: 'Optimal range reached' },
    { id: 'k3', label: 'Risk Exposure', value: 12.5, unit: 'M', trend: 'DOWN', change: -1.2, aiPrediction: 'Decreasing due to hedging algorithms' },
    { id: 'k4', label: 'AI Compute Load', value: 88, unit: '%', trend: 'STABLE', change: 0.0, aiPrediction: 'Scale required in 48h' },
];

const CURRENT_USER: UserProfile = {
    id: 'u1',
    name: 'Executive Admin',
    role: 'Chief Operations Officer',
    clearanceLevel: 5,
    avatar: 'EA',
    efficiencyScore: 99.8,
};

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const generateInitialRates = (pair: CurrencyPair) => {
    let baseRate = 1.0;
    switch (pair.symbol) {
        case 'EUR/USD': baseRate = 1.0850; break;
        case 'GBP/JPY': baseRate = 190.500; break;
        case 'USD/CAD': baseRate = 1.3620; break;
        case 'AUD/NZD': baseRate = 1.0910; break;
        case 'CHF/JPY': baseRate = 170.250; break;
        case 'EUR/GBP': baseRate = 0.8530; break;
        case 'USD/CNH': baseRate = 7.2300; break;
        case 'XAU/USD': baseRate = 2350.00; break;
        default: baseRate = 1.0;
    }

    const rates: { [exchangeId: string]: ExchangeRate } = {};
    SIMULATED_EXCHANGES.forEach(exchange => {
        const variance = (Math.random() - 0.5) * 0.002 * baseRate;
        const bid = baseRate + variance - (Math.random() * 0.0001);
        const ask = bid + (Math.random() * 0.0002 + 0.0001);
        rates[exchange.id] = {
            bid: parseFloat(bid.toFixed(5)),
            ask: parseFloat(ask.toFixed(5)),
        };
    });
    return rates;
};

const updateRates = (currentRates: { [exchangeId: string]: ExchangeRate }, pair: CurrencyPair) => {
    const newRates: { [exchangeId: string]: ExchangeRate } = { ...currentRates };
    SIMULATED_EXCHANGES.forEach(exchange => {
        let { bid, ask } = newRates[exchange.id];
        const initialSpread = ask - bid;
        const fluctuationMagnitude = pair.base.includes('JPY') || pair.quote.includes('JPY') || pair.base === 'XAU' ? 0.005 : 0.00005;
        const change = (Math.random() - 0.5) * fluctuationMagnitude;
        bid = bid + change;
        ask = ask + change;

        if (bid >= ask) {
            ask = bid + (initialSpread > 0.0001 ? initialSpread : 0.0001);
        }
        const spreadNoise = (Math.random() - 0.5) * fluctuationMagnitude * 2;
        ask = bid + Math.max(0.0001, initialSpread + spreadNoise);

        newRates[exchange.id] = { bid: parseFloat(bid.toFixed(5)), ask: parseFloat(ask.toFixed(5)) };
    });
    return newRates;
};

const detectArbitrage = (pairSymbol: string, rates: { [exchangeId: string]: ExchangeRate }): ArbitrageOpportunity[] => {
    const opportunities: ArbitrageOpportunity[] = [];
    for (let i = 0; i < SIMULATED_EXCHANGES.length; i++) {
        for (let j = 0; j < SIMULATED_EXCHANGES.length; j++) {
            if (i === j) continue;
            const buyExchange = SIMULATED_EXCHANGES[i];
            const sellExchange = SIMULATED_EXCHANGES[j];
            const buyPrice = rates[buyExchange.id].ask;
            const sellPrice = rates[sellExchange.id].bid;
            const potentialProfit = sellPrice - buyPrice;
            
            if (potentialProfit > 0) {
                const profitPercentage = (potentialProfit / buyPrice) * 100;
                if (profitPercentage * 100 >= 5) { // 5 bps threshold
                    opportunities.push({
                        pair: pairSymbol,
                        buyExchange: buyExchange.name,
                        sellExchange: sellExchange.name,
                        buyPrice: parseFloat(buyPrice.toFixed(5)),
                        sellPrice: parseFloat(sellPrice.toFixed(5)),
                        profitMargin: parseFloat(profitPercentage.toFixed(4)),
                        timestamp: Date.now(),
                    });
                }
            }
        }
    }
    return opportunities;
};

// -----------------------------------------------------------------------------
// UI COMPONENTS
// -----------------------------------------------------------------------------

const Card: React.FC<{ children: React.ReactNode; title?: string; className?: string; style?: React.CSSProperties }> = ({ children, title, className, style }) => (
    <div className={`glass-panel ${className || ''}`} style={{
        padding: '1.5rem',
        borderRadius: '12px',
        background: 'rgba(20, 20, 35, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        ...style
    }}>
        {title && <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#64ffda', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>}
        {children}
    </div>
);

const Button: React.FC<{ onClick?: () => void; children: React.ReactNode; variant?: 'primary' | 'danger' | 'neutral'; style?: React.CSSProperties }> = ({ onClick, children, variant = 'primary', style }) => {
    const baseStyle: React.CSSProperties = {
        padding: '0.6rem 1.2rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        ...style
    };

    const variants = {
        primary: { background: 'linear-gradient(135deg, #00b09b, #96c93d)', color: '#000' },
        danger: { background: 'linear-gradient(135deg, #cb2d3e, #ef473a)', color: '#fff' },
        neutral: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' },
    };

    return (
        <button 
            onClick={onClick} 
            style={{ ...baseStyle, ...variants[variant] }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {children}
        </button>
    );
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

const ForexArena: React.FC = () => {
    // --- STATE ---
    const [activeModule, setActiveModule] = useState<ModuleType>('DASHBOARD');
    const [systemTime, setSystemTime] = useState(new Date());
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [kpis, setKpis] = useState<KPI[]>(INITIAL_KPIS);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: 'msg1', sender: 'AI', text: 'Welcome to the Enterprise Operating System. I am your dedicated AI Architect. All systems are nominal. How may I assist with your billion-dollar objectives today?', timestamp: Date.now() }
    ]);
    const [chatInput, setChatInput] = useState('');
    
    // Forex State
    const [allRates, setAllRates] = useState<{ [pair: string]: { [ex: string]: ExchangeRate } }>(() => {
        const initial: any = {};
        CURRENCY_PAIRS.forEach(p => initial[p.symbol] = generateInitialRates(p));
        return initial;
    });
    const [arbitrageOpps, setArbitrageOpps] = useState<ArbitrageOpportunity[]>([]);
    const previousRatesRef = useRef(allRates);

    // --- EFFECTS ---

    // Clock & System Pulse
    useEffect(() => {
        const timer = setInterval(() => setSystemTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Forex Engine
    useEffect(() => {
        const interval = setInterval(() => {
            setAllRates(prev => {
                previousRatesRef.current = prev;
                const next = { ...prev };
                const newOpps: ArbitrageOpportunity[] = [];

                CURRENCY_PAIRS.forEach(pair => {
                    next[pair.symbol] = updateRates(prev[pair.symbol], pair);
                    newOpps.push(...detectArbitrage(pair.symbol, next[pair.symbol]));
                });

                if (newOpps.length > 0) {
                    setArbitrageOpps(current => [...newOpps, ...current].slice(0, 50)); // Keep last 50
                    addLog('SUCCESS', `AI Detected ${newOpps.length} arbitrage vectors. Auto-execution pending.`);
                }
                return next;
            });
        }, 500); // 2Hz updates
        return () => clearInterval(interval);
    }, []);

    // Random AI Events
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const events = [
                    'Optimizing neural pathways...',
                    'Rebalancing global liquidity pools...',
                    'Encrypting quantum ledgers...',
                    'Analyzing competitor sentiment...',
                    'Predicting market volatility...',
                ];
                addLog('INFO', events[Math.floor(Math.random() * events.length)]);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // --- ACTIONS ---

    const addLog = (level: SystemLog['level'], message: string) => {
        setLogs(prev => [{ id: generateId(), timestamp: Date.now(), level, message, source: 'SYSTEM' }, ...prev].slice(0, 100));
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const userMsg: ChatMessage = { id: generateId(), sender: 'USER', text: chatInput, timestamp: Date.now() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');

        // Simulate AI processing
        setTimeout(() => {
            let responseText = "I've processed that request. My algorithms suggest a 98.4% probability of success if we proceed immediately.";
            if (chatInput.toLowerCase().includes('profit')) responseText = "Analyzing profit vectors. Current market conditions allow for a 12% yield increase via high-frequency arbitrage.";
            if (chatInput.toLowerCase().includes('risk')) responseText = "Risk mitigation protocols are active. Exposure is currently limited to 0.04% of total AUM.";
            if (chatInput.toLowerCase().includes('status')) responseText = "All systems operational. Neural net efficiency at 99.9%. No anomalies detected.";

            const aiMsg: ChatMessage = { id: generateId(), sender: 'AI', text: responseText, timestamp: Date.now() };
            setChatHistory(prev => [...prev, aiMsg]);
        }, 800);
    };

    // --- RENDER HELPERS ---

    const renderSidebar = () => (
        <div style={{
            width: '260px',
            background: 'rgba(10, 10, 20, 0.95)',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            gap: '2rem',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #00b09b, #96c93d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>AI</div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>Enterprise OS</div>
                    <div style={{ fontSize: '0.7rem', color: '#64ffda', letterSpacing: '1px' }}>V.10.0.4 QUANTUM</div>
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                    { id: 'DASHBOARD', label: 'Command Center', icon: '⚡' },
                    { id: 'FOREX', label: 'Forex Arena', icon: '📈' },
                    { id: 'AI_CHAT', label: 'Neural Chat', icon: '🧠' },
                    { id: 'KPIS', label: 'Global KPIs', icon: '📊' },
                    { id: 'PROFILE', label: 'Executive Profile', icon: '👤' },
                    { id: 'SYSTEM', label: 'System Health', icon: '⚙️' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveModule(item.id as ModuleType)}
                        style={{
                            background: activeModule === item.id ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                            border: 'none',
                            borderLeft: activeModule === item.id ? '3px solid #64ffda' : '3px solid transparent',
                            padding: '1rem',
                            textAlign: 'left',
                            color: activeModule === item.id ? '#64ffda' : '#8892b0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{item.icon}</span> {item.label}
                    </button>
                ))}
            </nav>

            <div style={{ marginTop: 'auto' }}>
                <Card title="AI Status" style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff00', boxShadow: '0 0 10px #00ff00' }}></div>
                        <span style={{ fontSize: '0.8rem', color: '#fff' }}>Online & Learning</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#8892b0' }}>
                        Processing {(Math.random() * 1000).toFixed(0)} TB/s
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {kpis.map(kpi => (
                <Card key={kpi.id} title={kpi.label}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>
                        {kpi.unit === 'USD' ? formatCurrency(kpi.value) : kpi.value + kpi.unit}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                            color: kpi.trend === 'UP' ? '#64ffda' : kpi.trend === 'DOWN' ? '#ef473a' : '#fdbb2d',
                            display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                            {kpi.trend === 'UP' ? '▲' : kpi.trend === 'DOWN' ? '▼' : '■'} {Math.abs(kpi.change)}%
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#8892b0' }}>Last 24h</span>
                    </div>
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(100, 255, 218, 0.1)', borderRadius: '4px', fontSize: '0.8rem', color: '#64ffda' }}>
                        🤖 AI: {kpi.aiPrediction}
                    </div>
                </Card>
            ))}
            
            <Card title="Recent System Activity" style={{ gridColumn: '1 / -1' }}>
                <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {logs.map(log => (
                        <div key={log.id} style={{ 
                            display: 'flex', alignItems: 'center', gap: '1rem', 
                            padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                            fontSize: '0.9rem'
                        }}>
                            <span style={{ color: '#8892b0', fontFamily: 'monospace' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span style={{ 
                                padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold',
                                background: log.level === 'SUCCESS' ? 'rgba(0,255,0,0.2)' : log.level === 'CRITICAL' ? 'rgba(255,0,0,0.2)' : 'rgba(0,0,255,0.2)',
                                color: log.level === 'SUCCESS' ? '#00ff00' : log.level === 'CRITICAL' ? '#ff0000' : '#aaaaff'
                            }}>{log.level}</span>
                            <span style={{ color: '#e6f1ff' }}>{log.message}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    const renderForex = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {CURRENCY_PAIRS.map(pair => (
                    <Card key={pair.symbol} title={pair.symbol}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {SIMULATED_EXCHANGES.map(ex => {
                                const rates = allRates[pair.symbol]?.[ex.id];
                                const prev = previousRatesRef.current[pair.symbol]?.[ex.id];
                                const bidColor = rates?.bid > prev?.bid ? '#64ffda' : rates?.bid < prev?.bid ? '#ef473a' : '#8892b0';
                                const askColor = rates?.ask > prev?.ask ? '#64ffda' : rates?.ask < prev?.ask ? '#ef473a' : '#8892b0';

                                return (
                                    <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.2rem 0' }}>
                                        <span style={{ color: '#ccd6f6' }}>{ex.name}</span>
                                        <div style={{ display: 'flex', gap: '1rem', fontFamily: 'monospace' }}>
                                            <span style={{ color: bidColor }}>{rates?.bid.toFixed(5)}</span>
                                            <span style={{ color: askColor }}>{rates?.ask.toFixed(5)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))}
            </div>
            
            <Card title="High-Frequency Arbitrage Opportunities" style={{ border: '1px solid #fdbb2d' }}>
                {arbitrageOpps.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#8892b0' }}>Scanning global markets for inefficiencies...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {arbitrageOpps.slice(0, 12).map((opp, idx) => (
                            <div key={idx} style={{ 
                                background: 'rgba(253, 187, 45, 0.05)', border: '1px solid rgba(253, 187, 45, 0.3)', 
                                padding: '1rem', borderRadius: '8px', position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#fdbb2d' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold', color: '#fdbb2d' }}>{opp.pair}</span>
                                    <span style={{ color: '#64ffda', fontWeight: 'bold' }}>+{opp.profitMargin.toFixed(4)}%</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#ccd6f6', marginBottom: '0.2rem' }}>
                                    Buy: <span style={{ color: '#fff' }}>{opp.buyExchange}</span> @ {opp.buyPrice}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#ccd6f6', marginBottom: '0.8rem' }}>
                                    Sell: <span style={{ color: '#fff' }}>{opp.sellExchange}</span> @ {opp.sellPrice}
                                </div>
                                <Button variant="primary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem' }} onClick={() => addLog('SUCCESS', `Executed arbitrage on ${opp.pair} for ${opp.profitMargin}% profit.`)}>
                                    Auto-Execute
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );

    const renderChat = () => (
        <Card title="Neural Interface Chat" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '1rem', marginBottom: '1rem' }}>
                {chatHistory.map(msg => (
                    <div key={msg.id} style={{ 
                        alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        background: msg.sender === 'USER' ? '#112240' : 'rgba(100, 255, 218, 0.1)',
                        color: msg.sender === 'USER' ? '#fff' : '#e6f1ff',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: msg.sender === 'AI' ? '1px solid rgba(100, 255, 218, 0.3)' : 'none'
                    }}>
                        <div style={{ fontSize: '0.7rem', color: '#8892b0', marginBottom: '0.3rem' }}>{msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}</div>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask the AI Architect..."
                    style={{ 
                        flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                        background: '#0a192f', color: '#fff', outline: 'none'
                    }}
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </div>
        </Card>
    );

    const renderProfile = () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <Card>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#ccd6f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#0a192f', marginBottom: '1rem' }}>
                        {CURRENT_USER.avatar}
                    </div>
                    <h2 style={{ margin: 0, color: '#fff' }}>{CURRENT_USER.name}</h2>
                    <p style={{ color: '#64ffda', margin: '0.5rem 0' }}>{CURRENT_USER.role}</p>
                    <div style={{ marginTop: '1rem', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#8892b0', marginBottom: '0.3rem' }}>
                            <span>Efficiency Score</span>
                            <span>{CURRENT_USER.efficiencyScore}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#112240', borderRadius: '3px' }}>
                            <div style={{ width: `${CURRENT_USER.efficiencyScore}%`, height: '100%', background: '#64ffda', borderRadius: '3px' }}></div>
                        </div>
                    </div>
                </div>
            </Card>
            <Card title="Executive Controls">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Button variant="neutral">Download Global Ledger</Button>
                    <Button variant="neutral">Reset AI Parameters</Button>
                    <Button variant="neutral">Audit Security Logs</Button>
                    <Button variant="neutral">Manage API Keys</Button>
                    <Button variant="danger" style={{ gridColumn: '1 / -1' }}>Initiate Emergency Lockdown</Button>
                </div>
            </Card>
        </div>
    );

    // --- MAIN RENDER ---

    return (
        <div style={{
            fontFamily: '"SF Mono", "Fira Code", "Roboto Mono", monospace',
            background: '#0a192f',
            color: '#e6f1ff',
            minHeight: '100vh',
            display: 'flex',
            overflow: 'hidden'
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #0a192f; }
                ::-webkit-scrollbar-thumb { background: #233554; borderRadius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #64ffda; }
                .glass-panel { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .glass-panel:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
            `}</style>

            {renderSidebar()}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
                {/* Top Bar */}
                <header style={{ 
                    height: '70px', borderBottom: '1px solid rgba(255,255,255,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem',
                    background: 'rgba(10, 25, 47, 0.8)', backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>
                            {activeModule === 'DASHBOARD' && 'Command Center'}
                            {activeModule === 'FOREX' && 'Global Forex Arena'}
                            {activeModule === 'AI_CHAT' && 'Neural Network Interface'}
                            {activeModule === 'KPIS' && 'Key Performance Indicators'}
                            {activeModule === 'PROFILE' && 'Executive Profile'}
                            {activeModule === 'SYSTEM' && 'System Diagnostics'}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8rem', color: '#8892b0' }}>System Time</div>
                            <div style={{ fontWeight: 'bold', color: '#64ffda' }}>{systemTime.toLocaleTimeString()}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#233554', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#233554', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙️</div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    {activeModule === 'DASHBOARD' && renderDashboard()}
                    {activeModule === 'FOREX' && renderForex()}
                    {activeModule === 'AI_CHAT' && renderChat()}
                    {activeModule === 'KPIS' && renderDashboard()} {/* Reusing dashboard for KPIs for now */}
                    {activeModule === 'PROFILE' && renderProfile()}
                    {activeModule === 'SYSTEM' && (
                        <Card title="System Diagnostics">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', color: '#64ffda' }}>99.99%</div>
                                    <div style={{ fontSize: '0.8rem', color: '#8892b0' }}>Uptime</div>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', color: '#64ffda' }}>12ms</div>
                                    <div style={{ fontSize: '0.8rem', color: '#8892b0' }}>Latency</div>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', color: '#64ffda' }}>Secure</div>
                                    <div style={{ fontSize: '0.8rem', color: '#8892b0' }}>Encryption</div>
                                </div>
                            </div>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ForexArena;