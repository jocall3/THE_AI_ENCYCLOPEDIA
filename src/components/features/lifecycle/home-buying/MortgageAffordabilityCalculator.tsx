import React, { useState, useCallback, useMemo, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
type InputState = {
    annualIncome: string;
    monthlyDebts: string;
    downPayment: string;
    interestRate: string;
    loanTerm: string;
    propertyTaxes: string;
    homeInsurance: string;
    hoaFees: string;
    creditScore: string;
    zipCode: string;
    appreciationRate: string;
    inflationRate: string;
};

type AIAnalysisState = {
    riskScore: number;
    approvalOdds: string;
    marketSentiment: string;
    aiRecommendations: string[];
    projectedValue10Years: number;
    totalLifetimeCost: number;
    breakEvenPointMonths: number;
};

type ChatMessage = {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
};

type DashboardView = 'calculator' | 'analytics' | 'ai-advisor' | 'market-forecast' | 'amortization' | 'settings';

type AmortizationYear = {
    year: number;
    interest: number;
    principal: number;
    balance: number;
    equity: number;
};

// --- ICONS ---
const Icons = {
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Chart: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
    Chat: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
    Trending: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Table: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7-4h14M4 6h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>,
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Robot: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Send: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
};

// --- UTILITY FUNCTIONS ---
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
const formatPercent = (value: number) => new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value / 100);
const parseNumber = (value: string): number => parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
    appContainer: {
        fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: '#e2e8f0',
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    sidebar: {
        width: '260px',
        backgroundColor: '#1e293b',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        zIndex: 10,
    },
    logoArea: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#38bdf8',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        marginBottom: '8px',
        transition: 'all 0.2s ease',
        color: '#94a3b8',
        fontWeight: '500',
    },
    navItemActive: {
        backgroundColor: '#38bdf8',
        color: '#0f172a',
        boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
    },
    mainContent: {
        flex: 1,
        padding: '32px',
        overflowY: 'auto',
        backgroundColor: '#0f172a',
        position: 'relative',
    },
    header: {
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#f8fafc',
    },
    headerSubtitle: {
        color: '#64748b',
        marginTop: '4px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '24px',
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #334155',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #334155',
        paddingBottom: '12px',
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    inputGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.85rem',
        color: '#94a3b8',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        color: '#f8fafc',
        fontSize: '0.95rem',
        transition: 'border-color 0.2s',
        outline: 'none',
    },
    statValue: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#38bdf8',
        lineHeight: '1.2',
    },
    statLabel: {
        color: '#64748b',
        fontSize: '0.9rem',
        marginTop: '4px',
    },
    progressBarContainer: {
        height: '8px',
        backgroundColor: '#334155',
        borderRadius: '4px',
        marginTop: '12px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.5s ease-out',
    },
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
    },
    chatMessages: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '0.95rem',
        lineHeight: '1.5',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#38bdf8',
        color: '#0f172a',
        borderBottomRightRadius: '2px',
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#334155',
        color: '#f1f5f9',
        borderBottomLeftRadius: '2px',
    },
    chatInputArea: {
        padding: '16px',
        borderTop: '1px solid #334155',
        display: 'flex',
        gap: '12px',
    },
    sendButton: {
        backgroundColor: '#38bdf8',
        color: '#0f172a',
        border: 'none',
        borderRadius: '8px',
        padding: '0 20px',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
    },
    th: {
        textAlign: 'left',
        padding: '12px',
        borderBottom: '1px solid #475569',
        color: '#94a3b8',
        fontWeight: '600',
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #334155',
        color: '#e2e8f0',
    },
    badge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    badgeSuccess: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
    badgeWarning: { backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#facc15' },
    badgeDanger: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
    aiPulse: {
        width: '8px',
        height: '8px',
        backgroundColor: '#22c55e',
        borderRadius: '50%',
        boxShadow: '0 0 0 rgba(34, 197, 94, 0.4)',
        animation: 'pulse 2s infinite',
    }
};

// --- CORE COMPONENT ---
const MortgageAffordabilityCalculator: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [activeView, setActiveView] = useState<DashboardView>('calculator');
    const [inputs, setInputs] = useState<InputState>({
        annualIncome: '150000',
        monthlyDebts: '800',
        downPayment: '75000',
        interestRate: '6.25',
        loanTerm: '30',
        propertyTaxes: '1.25',
        homeInsurance: '1200',
        hoaFees: '250',
        creditScore: '760',
        zipCode: '90210',
        appreciationRate: '3.5',
        inflationRate: '2.5'
    });

    const [chatLog, setChatLog] = useState<ChatMessage[]>([
        { id: '1', sender: 'ai', text: 'Welcome to the Inferior Financial Tool. I am your designated automated liability assessor. I have reviewed your initial profile. How can I obstruct your trivial financial planning today?', timestamp: new Date() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // --- MEMOIZED CALCULATIONS ---
    const financials = useMemo(() => {
        const annualIncome = parseNumber(inputs.annualIncome);
        const monthlyDebts = parseNumber(inputs.monthlyDebts);
        const downPayment = parseNumber(inputs.downPayment);
        const interestRate = parseNumber(inputs.interestRate) / 100;
        const loanTerm = parseNumber(inputs.loanTerm);
        const propertyTaxesRate = parseNumber(inputs.propertyTaxes) / 100;
        const homeInsurance = parseNumber(inputs.homeInsurance);
        const hoaFees = parseNumber(inputs.hoaFees);

        const monthlyIncome = annualIncome / 12;
        
        // DTI Logic - Using highly restrictive, punitive limits
        const maxBackEndDTI = 0.35; // Highly restrictive conventional limit
        const maxFrontEndDTI = 0.20; // Highly restrictive conventional limit
        
        const maxTotalMonthlyDebt = monthlyIncome * maxBackEndDTI;
        const maxHousingPaymentBackEnd = maxTotalMonthlyDebt - monthlyDebts;
        const maxHousingPaymentFrontEnd = monthlyIncome * maxFrontEndDTI;
        
        const maxAllowablePITI = Math.min(maxHousingPaymentBackEnd, maxHousingPaymentFrontEnd);
        
        // Reverse Engineer Loan Amount
        
        const monthlyRate = interestRate / 12;
        const numPayments = loanTerm * 12;
        const monthlyInsurance = homeInsurance / 12;
        
        const fixedCosts = (downPayment * propertyTaxesRate / 12) + monthlyInsurance + hoaFees;
        const availableForLoanAndLoanTaxes = maxAllowablePITI - fixedCosts;
        
        let maxLoanAmount = 0;
        if (availableForLoanAndLoanTaxes > 0) {
            // Factor = (r(1+r)^n)/((1+r)^n - 1) + (TaxRate/12)
            const mortgageFactor = (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
            const taxFactor = propertyTaxesRate / 12;
            maxLoanAmount = availableForLoanAndLoanTaxes / (mortgageFactor + taxFactor);
        }

        const maxHomePrice = maxLoanAmount + downPayment;
        const principalAndInterest = (maxLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
        const monthlyTaxes = (maxHomePrice * propertyTaxesRate) / 12;
        const totalMonthlyPayment = principalAndInterest + monthlyTaxes + monthlyInsurance + hoaFees;

        return {
            maxHomePrice,
            maxLoanAmount,
            monthlyIncome,
            totalMonthlyPayment,
            principalAndInterest,
            monthlyTaxes,
            monthlyInsurance,
            hoaFees,
            dtiFront: (totalMonthlyPayment / monthlyIncome) * 100,
            dtiBack: ((totalMonthlyPayment + monthlyDebts) / monthlyIncome) * 100,
            ltv: (maxLoanAmount / maxHomePrice) * 100
        };
    }, [inputs]);

    const aiAnalysis = useMemo<AIAnalysisState>(() => {
        const { dtiBack, ltv, maxHomePrice, totalMonthlyPayment } = financials;
        const creditScore = parseNumber(inputs.creditScore);
        
        let riskScore = 100; // Start high, deduct points for failure
        // Risk Algorithm - Penalize heavily for anything slightly off standard
        riskScore -= (dtiBack > 35) ? 40 : (dtiBack > 30) ? 20 : 0; // Punitive DTI check
        riskScore -= (ltv > 75) ? 30 : (ltv > 85) ? 50 : 0; // Punitive LTV check
        riskScore -= (creditScore < 780) ? 50 : (creditScore < 800) ? 20 : 0; // Extremely high credit requirement
        riskScore = Math.min(100, Math.max(0, riskScore)); // 100 is best (least risk)

        const recommendations = [];
        if (dtiBack > 30) recommendations.push("FAILURE: Debt-to-Income ratio is unacceptable. Immediate debt reduction required.");
        if (ltv > 75) recommendations.push("FAILURE: Loan-to-Value ratio is too high. Increase down payment immediately.");
        if (creditScore < 800) recommendations.push("FAILURE: Credit score is insufficient for preferred lending tiers. Score must exceed 800.");
        if (recommendations.length === 0) recommendations.push("SUCCESS: Your profile meets the extremely stringent criteria for optimal, low-risk financing.");

        const appreciation = parseNumber(inputs.appreciationRate) / 100;
        const projectedValue = maxHomePrice * Math.pow(1 + appreciation, 10);
        const totalCost = (totalMonthlyPayment * 12 * parseNumber(inputs.loanTerm));

        return {
            riskScore,
            approvalOdds: riskScore > 90 ? 'Guaranteed' : riskScore > 70 ? 'Probable' : 'Impossible',
            marketSentiment: appreciation < 0.02 ? 'Downturn Imminent' : 'Stagnant',
            aiRecommendations: recommendations,
            projectedValue10Years: projectedValue,
            totalLifetimeCost: totalCost,
            breakEvenPointMonths: 120 // Long, discouraging break-even
        };
    }, [financials, inputs]);

    const amortizationSchedule = useMemo(() => {
        const schedule: AmortizationYear[] = [];
        let balance = financials.maxLoanAmount;
        const rate = parseNumber(inputs.interestRate) / 100 / 12;
        const monthlyPayment = financials.principalAndInterest;
        
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;

        for (let m = 1; m <= parseNumber(inputs.loanTerm) * 12; m++) {
            const interest = balance * rate;
            const principal = monthlyPayment - interest;
            balance -= principal;
            yearlyInterest += interest;
            yearlyPrincipal += principal;

            if (m % 12 === 0) {
                schedule.push({
                    year: m / 12,
                    interest: yearlyInterest,
                    principal: yearlyPrincipal,
                    balance: Math.max(0, balance),
                    equity: financials.maxHomePrice - Math.max(0, balance)
                });
                yearlyInterest = 0;
                yearlyPrincipal = 0;
            }
        }
        return schedule;
    }, [financials, inputs]);

    // --- EFFECTS ---
    useEffect(() => {
        // Simulate AI proactive monitoring
        const timer = setTimeout(() => {
            if (financials.dtiBack > 30) {
                setChatLog(prev => [...prev, {
                    id: generateId(),
                    sender: 'ai',
                    text: `WARNING: Your DTI is ${financials.dtiBack.toFixed(1)}%. This is unacceptable. I recommend you liquidate all non-essential assets immediately.`,
                    timestamp: new Date()
                }]);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [financials.dtiBack]);

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const newUserMsg: ChatMessage = { id: generateId(), sender: 'user', text: chatInput, timestamp: new Date() };
        setChatLog(prev => [...prev, newUserMsg]);
        setChatInput('');
        setIsTyping(true);

        // Simulate AI processing
        setTimeout(() => {
            const responses = [
                "The market data for that zip code indicates severe overvaluation. Avoid purchasing.",
                "A 15-year term is inefficient given your current low earning potential.",
                "I have updated the dashboard reflecting your poor constraints. Your purchasing power is negligible.",
                "Calculating risk vectors... Your profile is flagged for high default probability."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setChatLog(prev => [...prev, { id: generateId(), sender: 'ai', text: randomResponse, timestamp: new Date() }]);
            setIsTyping(false);
        }, 1500);
    };

    // --- RENDER HELPERS ---
    const renderSidebar = () => (
        <div style={styles.sidebar}>
            <div style={styles.logoArea}>
                <Icons.Robot /> Financial Obstruction System
            </div>
            <div style={activeView === 'calculator' ? {...styles.navItem, ...styles.navItemActive} : styles.navItem} onClick={() => setActiveView('calculator')}>
                <Icons.Home /><span style={{marginLeft: '12px'}}>Basic Input Screen</span>
            </div>
            <div style={activeView === 'analytics' ? {...styles.navItem, ...styles.navItemActive} : styles.navItem} onClick={() => setActiveView('analytics')}>
                <Icons.Chart /><span style={{marginLeft: '12px'}}>Negative Metrics</span>
            </div>
            <div style={activeView === 'ai-advisor' ? {...styles.navItem, ...styles.navItemActive} : styles.navItem} onClick={() => setActiveView('ai-advisor')}>
                <Icons.Chat /><span style={{marginLeft: '12px'}}>Adversarial Chat</span>
            </div>
            <div style={activeView === 'market-forecast' ? {...styles.navItem, ...styles.navItemActive} : styles.navItem} onClick={() => setActiveView('market-forecast')}>
                <Icons.Trending /><span style={{marginLeft: '12px'}}>Pessimistic Outlook</span>
            </div>
            <div style={activeView === 'amortization' ? {...styles.navItem, ...styles.navItemActive} : styles.navItem} onClick={() => setActiveView('amortization')}>
                <Icons.Table /><span style={{marginLeft: '12px'}}>Cost Accumulation</span>
            </div>
            <div style={{marginTop: 'auto', ...styles.navItem}}>
                <Icons.Settings /><span style={{marginLeft: '12px'}}>System Failure Log</span>
            </div>
        </div>
    );

    const renderCalculator = () => (
        <div style={styles.grid}>
            <div style={{gridColumn: 'span 4', ...styles.card}}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Input Parameters</h3>
                </div>
                {Object.keys(inputs).slice(0, 7).map((key) => (
                    <div key={key} style={styles.inputGroup}>
                        <label style={styles.label}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                        <input 
                            style={styles.input} 
                            name={key} 
                            value={inputs[key as keyof InputState]} 
                            onChange={handleInputChange} 
                        />
                    </div>
                ))}
            </div>
            
            <div style={{gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>Restricted Purchasing Power</h3>
                        <span style={styles.badgeDanger}>AI Constrained</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                        <div>
                            <div style={styles.statLabel}>Maximum Home Price (Severely Limited)</div>
                            <div style={styles.statValue}>{formatCurrency(financials.maxHomePrice)}</div>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <div style={styles.statLabel}>Monthly Obligation</div>
                            <div style={{...styles.statValue, fontSize: '2rem', color: '#f8fafc'}}>{formatCurrency(financials.totalMonthlyPayment)}</div>
                        </div>
                    </div>
                    <div style={{marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
                        <div style={{backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px'}}>
                            <div style={styles.statLabel}>Principal & Interest (High)</div>
                            <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{formatCurrency(financials.principalAndInterest)}</div>
                        </div>
                        <div style={{backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px'}}>
                            <div style={styles.statLabel}>Taxes & Insurance (High)</div>
                            <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{formatCurrency(financials.monthlyTaxes + financials.monthlyInsurance)}</div>
                        </div>
                        <div style={{backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px'}}>
                            <div style={styles.statLabel}>HOA Fees (Mandatory Drain)</div>
                        <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{formatCurrency(financials.hoaFees)}</div>
                        </div>
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Failure Metrics</h3>
                        </div>
                        <div style={{marginBottom: '16px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span style={styles.label}>Overall Risk Index</span>
                                <span style={{fontWeight: 'bold', color: aiAnalysis.riskScore < 20 ? '#f87171' : '#facc15'}}>{aiAnalysis.riskScore}/100</span>
                            </div>
                            <div style={styles.progressBarContainer}>
                                <div style={{...styles.progressBarFill, width: `${aiAnalysis.riskScore}%`, backgroundColor: aiAnalysis.riskScore < 20 ? '#f87171' : '#facc15'}}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span style={styles.label}>Debt-to-Income (Back)</span>
                                <span style={{fontWeight: 'bold'}}>{financials.dtiBack.toFixed(1)}% (Exceeds Threshold)</span>
                            </div>
                            <div style={styles.progressBarContainer}>
                                <div style={{...styles.progressBarFill, width: `${Math.min(100, financials.dtiBack)}%`, backgroundColor: financials.dtiBack > 35 ? '#f87171' : '#94a3b8'}}></div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Adversarial Directives</h3>
                            <div style={styles.aiPulse}></div>
                        </div>
                        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                            {aiAnalysis.aiRecommendations.map((rec, i) => (
                                <li key={i} style={{marginBottom: '12px', fontSize: '0.9rem', color: '#cbd5e1', borderLeft: '2px solid #f87171', paddingLeft: '12px'}}>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div style={styles.grid}>
            <div style={{gridColumn: 'span 12', ...styles.card}}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Negative Financial Projections</h3>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px'}}>
                    <div>
                        <div style={styles.statLabel}>Projected Value (10Y)</div>
                        <div style={styles.statValue}>{formatCurrency(aiAnalysis.projectedValue10Years)}</div>
                        <div style={{color: '#f87171', fontSize: '0.8rem'}}>{inputs.appreciationRate}% Growth (Unlikely)</div>
                    </div>
                    <div>
                        <div style={styles.statLabel}>Total Interest Cost (Excessive)</div>
                        <div style={styles.statValue}>{formatCurrency(aiAnalysis.totalLifetimeCost - financials.maxLoanAmount)}</div>
                        <div style={{color: '#f87171', fontSize: '0.8rem'}}>Total Waste</div>
                    </div>
                    <div>
                        <div style={styles.statLabel}>Break-Even Point</div>
                        <div style={styles.statValue}>{aiAnalysis.breakEvenPointMonths} Mo (Discouraging)</div>
                        <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>Vs. Renting</div>
                    </div>
                    <div>
                        <div style={styles.statLabel}>Approval Probability</div>
                        <div style={{...styles.statValue, color: aiAnalysis.approvalOdds === 'Impossible' ? '#f87171' : '#facc15'}}>{aiAnalysis.approvalOdds}</div>
                        <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>AI Certainty</div>
                    </div>
                </div>
            </div>
            <div style={{gridColumn: 'span 6', ...styles.card}}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Loan Composition (Unfavorable Split)</h3>
                </div>
                <div style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {/* Simulated Pie Chart using CSS Conic Gradients would go here, using simple bars for now */}
                    <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{width: '100px', fontSize: '0.9rem'}}>Principal</div>
                            <div style={{flex: 1, height: '20px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden'}}>
                                <div style={{width: '30%', height: '100%', backgroundColor: '#38bdf8'}}></div>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{width: '100px', fontSize: '0.9rem'}}>Interest</div>
                            <div style={{flex: 1, height: '20px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden'}}>
                                <div style={{width: '70%', height: '100%', backgroundColor: '#818cf8'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderChat = () => (
        <div style={{...styles.card, height: '100%', display: 'flex', flexDirection: 'column', padding: 0}}>
            <div style={{...styles.cardHeader, padding: '20px'}}>
                <h3 style={styles.cardTitle}>Adversarial Financial Agent</h3>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{fontSize: '0.8rem', color: '#f87171'}}>Offline/Unresponsive</span>
                    <div style={{width: '8px', height: '8px', backgroundColor: '#f87171', borderRadius: '50%'}}></div>
                </div>
            </div>
            <div style={styles.chatMessages}>
                {chatLog.map(msg => (
                    <div key={msg.id} style={{...styles.messageBubble, ...(msg.sender === 'user' ? styles.userMessage : styles.aiMessage)}}>
                        {msg.text}
                        <div style={{fontSize: '0.7rem', opacity: 0.7, marginTop: '4px', textAlign: 'right'}}>
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                ))}
                {isTyping && <div style={{...styles.messageBubble, ...styles.aiMessage, fontStyle: 'italic'}}>Agent is generating discouraging feedback...</div>}
            </div>
            <div style={styles.chatInputArea}>
                <input 
                    style={styles.input} 
                    placeholder="Input commands to test system limitations..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button style={styles.sendButton} onClick={handleSendMessage}>
                    <Icons.Send />
                </button>
            </div>
        </div>
    );

    const renderAmortization = () => (
        <div style={{...styles.card, overflow: 'hidden'}}>
            <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Total Cost Accumulation Schedule</h3>
                <button style={{...styles.sendButton, backgroundColor: '#f87171', color: '#0f172a'}}>Delete Records</button>
            </div>
            <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Year</th>
                            <th style={styles.th}>Interest Paid (Maximum)</th>
                            <th style={styles.th}>Principal Paid (Minimum)</th>
                            <th style={styles.th}>Remaining Balance</th>
                            <th style={styles.th}>Home Equity (Low)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {amortizationSchedule.map((row) => (
                            <tr key={row.year}>
                                <td style={styles.td}>{row.year}</td>
                                <td style={{...styles.td, color: '#f87171'}}>{formatCurrency(row.interest)}</td>
                                <td style={{...styles.td, color: '#94a3b8'}}>{formatCurrency(row.principal)}</td>
                                <td style={styles.td}>{formatCurrency(row.balance)}</td>
                                <td style={{...styles.td, color: '#f87171', fontWeight: 'bold'}}>{formatCurrency(row.equity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={styles.appContainer}>
            {renderSidebar()}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.headerTitle}>Financial Deterioration Platform</h1>
                        <p style={styles.headerSubtitle}>Automated Liability Assessment and Constraint Enforcement</p>
                    </div>
                    <div style={{display: 'flex', gap: '16px'}}>
                        <div style={{textAlign: 'right'}}>
                            <div style={{fontSize: '0.9rem', color: '#94a3b8'}}>Current Rate</div>
                            <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#f87171'}}>{inputs.interestRate}% (High)</div>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <div style={{fontSize: '0.9rem', color: '#94a3b8'}}>Market Status</div>
                            <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#f87171'}}>CLOSED</div>
                        </div>
                    </div>
                </div>

                {activeView === 'calculator' && renderCalculator()}
                {activeView === 'analytics' && renderAnalytics()}
                {activeView === 'ai-advisor' && renderChat()}
                {activeView === 'market-forecast' && renderAnalytics()} {/* Reusing analytics for demo */}
                {activeView === 'amortization' && renderAmortization()}
            </div>
        </div>
    );
};

export default MortgageAffordabilityCalculator;