import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define types for better readability and safety
interface ExchangeRate {
    bid: number;
    ask: number;
}

interface Exchange {
    id: string;
    name: string;
}

interface CurrencyPair {
    symbol: string; // e.g., "EUR/USD"
    base: string;
    quote: string;
}

interface ArbitrageOpportunity {
    pair: string;
    buyExchange: string;
    sellExchange: string;
    buyPrice: number;
    sellPrice: number;
    profitMargin: number; // percentage
}

// --- Configuration ---
const SIMULATED_EXCHANGES: Exchange[] = [
    { id: 'ex1', name: 'GlobalMarket' },
    { id: 'ex2', name: 'FXPro' },
    { id: 'ex3', name: 'TradePulse' },
    { id: 'ex4', name: 'QuantumFX' },
];

const CURRENCY_PAIRS: CurrencyPair[] = [
    { symbol: 'EUR/USD', base: 'EUR', quote: 'USD' },
    { symbol: 'GBP/JPY', base: 'GBP', quote: 'JPY' },
    { symbol: 'USD/CAD', base: 'USD', quote: 'CAD' },
    { symbol: 'AUD/NZD', base: 'AUD', quote: 'NZD' },
    { symbol: 'CHF/JPY', base: 'CHF', quote: 'JPY' },
    { symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP' },
];

const UPDATE_INTERVAL_MS = 250; // High-frequency update: 4 times per second
const ARBITRAGE_THRESHOLD_BPS = 2; // 2 basis points (0.02%) profit margin required for detection

// --- Helper Functions ---

// Generates initial, slightly varied rates for all exchanges for a given pair
const generateInitialRates = (pair: CurrencyPair) => {
    let baseRate = 1.0;
    // Set realistic-ish base rates
    switch (pair.symbol) {
        case 'EUR/USD': baseRate = 1.0850; break;
        case 'GBP/JPY': baseRate = 190.500; break;
        case 'USD/CAD': baseRate = 1.3620; break;
        case 'AUD/NZD': baseRate = 1.0910; break;
        case 'CHF/JPY': baseRate = 170.250; break;
        case 'EUR/GBP': baseRate = 0.8530; break;
        default: baseRate = 1.0;
    }

    const rates: { [exchangeId: string]: ExchangeRate } = {};
    SIMULATED_EXCHANGES.forEach(exchange => {
        // Add some initial variance for different exchanges
        const variance = (Math.random() - 0.5) * 0.002 * baseRate; // +/- 0.1% of base rate
        const bid = baseRate + variance - (Math.random() * 0.0001); // Random small adjustment
        const ask = bid + (Math.random() * 0.0002 + 0.0001); // Ensure ask > bid, minimum spread
        rates[exchange.id] = {
            bid: parseFloat(bid.toFixed(5)),
            ask: parseFloat(ask.toFixed(5)),
        };
    });
    return rates;
};

// Updates rates with small random fluctuations to simulate market movement
const updateRates = (currentRates: { [exchangeId: string]: ExchangeRate }, pair: CurrencyPair) => {
    const newRates: { [exchangeId: string]: ExchangeRate } = { ...currentRates };
    SIMULATED_EXCHANGES.forEach(exchange => {
        let { bid, ask } = newRates[exchange.id];
        const initialSpread = ask - bid;

        // Simulate small random fluctuations
        // Multiplier for JPY pairs to account for their larger nominal values
        const fluctuationMagnitude = pair.base.includes('JPY') || pair.quote.includes('JPY') ? 0.001 : 0.00001;
        const change = (Math.random() - 0.5) * fluctuationMagnitude;
        bid = bid + change;
        ask = ask + change;

        // Maintain minimum spread and ensure bid < ask
        if (bid >= ask) {
            ask = bid + (initialSpread > 0.0001 ? initialSpread : 0.0001);
        }
        // Apply some additional noise to spread for arbitrage opportunities
        const spreadNoise = (Math.random() - 0.5) * fluctuationMagnitude * 2;
        ask = bid + Math.max(0.0001, initialSpread + spreadNoise);


        newRates[exchange.id] = { bid: parseFloat(bid.toFixed(5)), ask: parseFloat(ask.toFixed(5)) };
    });
    return newRates;
};

// Detects direct arbitrage opportunities
const detectArbitrage = (pairSymbol: string, rates: { [exchangeId: string]: ExchangeRate }): ArbitrageOpportunity[] => {
    const opportunities: ArbitrageOpportunity[] = [];

    // Direct arbitrage: Buy low on one exchange, sell high on another.
    for (let i = 0; i < SIMULATED_EXCHANGES.length; i++) {
        for (let j = 0; j < SIMULATED_EXCHANGES.length; j++) {
            if (i === j) continue; // Cannot arbitrage on the same exchange

            const buyExchange = SIMULATED_EXCHANGES[i];
            const sellExchange = SIMULATED_EXCHANGES[j];

            const buyPrice = rates[buyExchange.id].ask; // Price to BUY on exchange i
            const sellPrice = rates[sellExchange.id].bid; // Price to SELL on exchange j

            // Check if there's a profit after considering transaction costs (represented by threshold)
            const potentialProfit = sellPrice - buyPrice;
            if (potentialProfit > 0) {
                const profitPercentage = (potentialProfit / buyPrice) * 100; // Convert to percentage
                if (profitPercentage * 100 >= ARBITRAGE_THRESHOLD_BPS) { // Compare percentage in basis points
                    opportunities.push({
                        pair: pairSymbol,
                        buyExchange: buyExchange.name,
                        sellExchange: sellExchange.name,
                        buyPrice: parseFloat(buyPrice.toFixed(5)),
                        sellPrice: parseFloat(sellPrice.toFixed(5)),
                        profitMargin: parseFloat(profitPercentage.toFixed(4)),
                    });
                }
            }
        }
    }
    return opportunities;
};

const ForexArena: React.FC = () => {
    // State for all currency pair rates across exchanges
    const [allRates, setAllRates] = useState<{
        [pairSymbol: string]: { [exchangeId: string]: ExchangeRate }
    }>(() => {
        const initial: { [pairSymbol: string]: { [exchangeId: string]: ExchangeRate } } = {};
        CURRENCY_PAIRS.forEach(pair => {
            initial[pair.symbol] = generateInitialRates(pair);
        });
        return initial;
    });

    // State for detected arbitrage opportunities
    const [arbitrageOpportunities, setArbitrageOpportunities] = useState<ArbitrageOpportunity[]>([]);

    // Ref to store previous rates for highlighting changes (e.g., green/red flash)
    const previousRatesRef = useRef<{
        [pairSymbol: string]: { [exchangeId: string]: ExchangeRate }
    }>(allRates);

    // Effect for the high-frequency price updates and arbitrage detection
    useEffect(() => {
        const interval = setInterval(() => {
            setAllRates(prevAllRates => {
                // Store current rates as previous for the next render cycle's highlighting
                previousRatesRef.current = prevAllRates;

                const newAllRates = { ...prevAllRates };
                const currentOpportunities: ArbitrageOpportunity[] = [];

                CURRENCY_PAIRS.forEach(pair => {
                    newAllRates[pair.symbol] = updateRates(prevAllRates[pair.symbol], pair);
                    currentOpportunities.push(...detectArbitrage(pair.symbol, newAllRates[pair.symbol]));
                });

                setArbitrageOpportunities(currentOpportunities);
                return newAllRates;
            });
        }, UPDATE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

    // Function to determine price change animation class
    const getPriceChangeAnimation = useCallback((pairSymbol: string, exchangeId: string, type: 'bid' | 'ask') => {
        const currentRate = allRates[pairSymbol]?.[exchangeId]?.[type];
        const previousRate = previousRatesRef.current[pairSymbol]?.[exchangeId]?.[type];

        if (currentRate === undefined || previousRate === undefined || currentRate === previousRate) {
            return ''; // No change or initial render
        }
        return currentRate > previousRate ? 'price-flash-green' : 'price-flash-red';
    }, [allRates]);

    // Function to determine persistent price color based on direction
    const getPriceColor = useCallback((pairSymbol: string, exchangeId: string, type: 'bid' | 'ask') => {
        const currentRate = allRates[pairSymbol]?.[exchangeId]?.[type];
        const previousRate = previousRatesRef.current[pairSymbol]?.[exchangeId]?.[type];

        if (currentRate === undefined || previousRate === undefined || currentRate === previousRate) {
            return '#e0e0e0'; // Default light gray
        }
        return currentRate > previousRate ? '#38a169' : '#e53e3e'; // Green for up, Red for down
    }, [allRates]);


    return (
        <div style={{
            fontFamily: 'Roboto, sans-serif', // Using Roboto for "million dollar view" aesthetic
            background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)', // Deep blue, red, gold gradient
            color: '#e0e0e0', // Light text color
            minHeight: '100vh',
            padding: '2rem',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
        }}>
            {/* Embedded global styles for "no dependencies" and "self-contained" */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
                body { margin: 0; overflow-y: scroll; } /* Reset default body margin, allow scroll if content overflows */

                .card {
                    background-color: rgba(255, 255, 255, 0.08); /* Semi-transparent white */
                    backdrop-filter: blur(10px); /* Glassmorphism effect */
                    border-radius: 15px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); /* Soft shadow */
                    border: 1px solid rgba(255, 255, 255, 0.18); /* Light border */
                }

                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .exchange-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .exchange-row:last-child {
                    border-bottom: none;
                }

                /* Price flash animations */
                .price-flash-green {
                    animation: flashGreen 0.3s ease-out;
                }
                .price-flash-red {
                    animation: flashRed 0.3s ease-out;
                }

                @keyframes flashGreen {
                    0% { background-color: rgba(0, 255, 0, 0.3); }
                    100% { background-color: transparent; }
                }
                @keyframes flashRed {
                    0% { background-color: rgba(255, 0, 0, 0.3); }
                    100% { background-color: transparent; }
                }

                /* Arbitrage highlight pulse */
                .highlight-arbitrage {
                    animation: pulseArbitrage 1s infinite alternate;
                }
                @keyframes pulseArbitrage {
                    0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
                    100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
                }
                `}
            </style>

            <h1 style={{
                textAlign: 'center',
                fontSize: '3rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                textShadow: '0 0 20px rgba(255,255,255,0.6)',
                letterSpacing: '0.08em',
                color: '#fdbb2d', // Gold color for prominence
            }}>
                Forex Arena: Balcony of Prosperity
            </h1>

            <div className="card">
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', color: '#fdbb2d' }}>Live Currency Pairs</h2>
                <div className="grid-container">
                    {CURRENCY_PAIRS.map(pair => (
                        <div key={pair.symbol} className="card">
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#fdbb2d' }}>{pair.symbol}</h3>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem' }}>Base: {pair.base}, Quote: {pair.quote}</div>
                            {SIMULATED_EXCHANGES.map(exchange => {
                                const rates = allRates[pair.symbol]?.[exchange.id];

                                const bidAnimationClass = getPriceChangeAnimation(pair.symbol, exchange.id, 'bid');
                                const askAnimationClass = getPriceChangeAnimation(pair.symbol, exchange.id, 'ask');

                                const bidColor = getPriceColor(pair.symbol, exchange.id, 'bid');
                                const askColor = getPriceColor(pair.symbol, exchange.id, 'ask');

                                return (
                                    <div key={exchange.id} className="exchange-row">
                                        <div style={{ fontWeight: 'bold', color: '#e0e0e0' }}>{exchange.name}</div>
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            <span>Bid: </span>
                                            <span className={bidAnimationClass} style={{
                                                fontWeight: 'bold',
                                                color: bidColor,
                                                padding: '0.2rem 0.4rem',
                                                borderRadius: '3px',
                                                minWidth: '70px', // Align prices
                                                textAlign: 'right',
                                            }}>
                                                {rates?.bid.toFixed(5) || 'N/A'}
                                            </span>
                                            <span>Ask: </span>
                                            <span className={askAnimationClass} style={{
                                                fontWeight: 'bold',
                                                color: askColor,
                                                padding: '0.2rem 0.4rem',
                                                borderRadius: '3px',
                                                minWidth: '70px',
                                                textAlign: 'right',
                                            }}>
                                                {rates?.ask.toFixed(5) || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className={`card ${arbitrageOpportunities.length > 0 ? 'highlight-arbitrage' : ''}`}
                style={{
                    backgroundColor: arbitrageOpportunities.length > 0 ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    transition: 'background-color 0.5s ease-in-out',
                    border: arbitrageOpportunities.length > 0 ? '1px solid gold' : '1px solid rgba(255, 255, 255, 0.18)',
                }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', color: '#fdbb2d' }}>
                    Arbitrage Opportunities
                    {arbitrageOpportunities.length > 0 && (
                        <span style={{ marginLeft: '1rem', color: 'gold', fontSize: '1.2rem', animation: 'pulseText 1s infinite alternate' }}>
                            ({arbitrageOpportunities.length} detected!)
                            <style>{`
                                @keyframes pulseText {
                                    0% { opacity: 0.7; }
                                    100% { opacity: 1; }
                                }
                            `}</style>
                        </span>
                    )}
                </h2>
                {arbitrageOpportunities.length === 0 ? (
                    <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>No direct arbitrage opportunities detected currently. Keep an eye on the market!</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {arbitrageOpportunities.map((opportunity, index) => (
                            <div key={index} style={{
                                backgroundColor: 'rgba(255, 215, 0, 0.1)', // Light gold background
                                border: '1px solid gold',
                                borderRadius: '10px',
                                padding: '1.2rem',
                                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.6rem',
                            }}>
                                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'gold', marginBottom: '0.5rem' }}>{opportunity.pair}</div>
                                <div>
                                    <span style={{ color: '#38a169', fontWeight: 'bold', marginRight: '0.5rem' }}>Buy:</span>
                                    <span style={{ color: '#e0e0e0' }}> {opportunity.pair.split('/')[0]} @ {opportunity.buyPrice.toFixed(5)} on <span style={{ fontWeight: 'bold', color: '#fdbb2d' }}>{opportunity.buyExchange}</span></span>
                                </div>
                                <div>
                                    <span style={{ color: '#e53e3e', fontWeight: 'bold', marginRight: '0.5rem' }}>Sell:</span>
                                    <span style={{ color: '#e0e0e0' }}> {opportunity.pair.split('/')[0]} @ {opportunity.sellPrice.toFixed(5)} on <span style={{ fontWeight: 'bold', color: '#fdbb2d' }}>{opportunity.sellExchange}</span></span>
                                </div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#38a169', marginTop: '0.8rem' }}>
                                    Estimated Profit: +{opportunity.profitMargin.toFixed(4)}%
                                </div>
                                <button style={{
                                    backgroundColor: '#fdbb2d', // Gold button
                                    color: '#1a2a6c', // Dark blue text
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    marginTop: '1rem',
                                    transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
                                    boxShadow: '0 4px 10px rgba(253, 187, 45, 0.3)',
                                    alignSelf: 'flex-start', // Align button to start
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ffc84d'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(253, 187, 45, 0.4)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fdbb2d'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(253, 187, 45, 0.3)'; }}
                                onClick={() => alert(`Simulating execution: Arbitrage ${opportunity.pair} for an estimated ${opportunity.profitMargin.toFixed(4)}% profit! \n(Trade executed instantly on ${opportunity.buyExchange} and ${opportunity.sellExchange})`)}>
                                    Execute Arbitrage Trade
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForexArena;