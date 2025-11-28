import React, { useState, useCallback, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
type InputState = {
    annualIncome: string;
    monthlyDebts: string;
    downPayment: string;
    interestRate: string;
    loanTerm: string;
    propertyTaxes: string;
    homeInsurance: string;
};

type ResultState = {
    maxHomePrice: number;
    monthlyPayment: number;
    principalAndInterest: number;
    monthlyTaxes: number;
    monthlyInsurance: number;
    maxLoanAmount: number;
    limitingFactor: 'income' | 'debt' | null;
};

type ComparisonState = {
    rate2: string;
    term2: string;
    monthlyPayment2: number | null;
    totalInterest1: number | null;
    totalInterest2: number | null;
};

// --- SVG ICONS (as React Components) ---
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const DollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
    </svg>
);

const PercentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l-2.828 2.828a4 4 0 105.656 5.656L12 19" />
        <path d="M14.121 9.879l-5.657 5.657" />
    </svg>
);

// --- UTILITY FUNCTIONS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
};

// --- STYLES (as JS objects) ---
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: 'sans-serif',
        color: '#e5e7eb',
        backgroundColor: '#1f2937',
        padding: '24px',
        borderRadius: '8px',
        maxWidth: '1200px',
        margin: 'auto',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
    },
    card: {
        backgroundColor: '#374151',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #4b5563',
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
    },
    inputGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.875rem',
        color: '#d1d5db',
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        width: '100%',
        padding: '10px 12px 10px 36px',
        backgroundColor: '#1f2937',
        border: '1px solid #4b5563',
        borderRadius: '4px',
        color: '#e5e7eb',
    },
    inputIcon: {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '8px',
    },
    resultCard: {
        textAlign: 'center',
    },
    resultValue: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#34d399',
        margin: '8px 0',
    },
    resultLabel: {
        color: '#9ca3af',
    },
    breakdownList: {
        listStyle: 'none',
        padding: 0,
        marginTop: '24px',
    },
    breakdownItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #4b5563',
    },
    chartContainer: {
        display: 'flex',
        height: '24px',
        borderRadius: '6px',
        overflow: 'hidden',
        marginTop: '16px',
    },
    chartBar: {
        height: '100%',
        transition: 'width 0.5s ease-in-out',
    },
    legendContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '12px',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.75rem',
    },
    legendColorBox: {
        width: '12px',
        height: '12px',
        marginRight: '6px',
        borderRadius: '2px',
    },
    separator: {
        height: '1px',
        backgroundColor: '#4b5563',
        margin: '24px 0',
    }
};

// --- CORE COMPONENT ---
const MortgageAffordabilityCalculator: React.FC = () => {
    // State declarations
    const [inputs, setInputs] = useState<InputState>({
        annualIncome: '120000',
        monthlyDebts: '500',
        downPayment: '50000',
        interestRate: '6.5',
        loanTerm: '30',
        propertyTaxes: '1.2',
        homeInsurance: '1500',
    });
    const [results, setResults] = useState<ResultState | null>(null);
    const [comparison, setComparison] = useState<ComparisonState>({
        rate2: '7.0',
        term2: '15',
        monthlyPayment2: null,
        totalInterest1: null,
        totalInterest2: null,
    });

    // --- Calculation Logic ---
    const calculateMortgage = useCallback(() => {
        // Parse inputs
        const annualIncome = parseNumber(inputs.annualIncome);
        const monthlyDebts = parseNumber(inputs.monthlyDebts);
        const downPayment = parseNumber(inputs.downPayment);
        const interestRate = parseNumber(inputs.interestRate) / 100;
        const loanTerm = parseInt(inputs.loanTerm, 10);
        const propertyTaxes = parseNumber(inputs.propertyTaxes) / 100;
        const homeInsurance = parseNumber(inputs.homeInsurance);

        if (annualIncome === 0 || interestRate === 0 || loanTerm === 0) {
            setResults(null);
            return;
        }

        const monthlyIncome = annualIncome / 12;
        const monthlyInterestRate = interestRate / 12;
        const numberOfPayments = loanTerm * 12;

        // DTI Ratio Calculation (28/36 rule)
        const maxTotalDebt = monthlyIncome * 0.36;
        const availableForHousing = maxTotalDebt - monthlyDebts;
        const maxFrontEndDebt = monthlyIncome * 0.28;
        const maxMonthlyPaymentByDebt = Math.min(availableForHousing, maxFrontEndDebt);
        
        // Calculate max loan amount based on what can be afforded
        // This requires working backwards from the PITI payment
        // Estimate P+I portion
        const estimatedMonthlyTaxes = (maxMonthlyPaymentByDebt * 0.2); // Rough estimate
        const estimatedMonthlyInsurance = homeInsurance / 12;
        const maxPrincipalAndInterest = maxMonthlyPaymentByDebt - estimatedMonthlyTaxes - estimatedMonthlyInsurance;

        let maxLoanAmount = 0;
        if (monthlyInterestRate > 0 && numberOfPayments > 0) {
            maxLoanAmount = (maxPrincipalAndInterest * (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments));
        }
        
        const maxHomePrice = maxLoanAmount + downPayment;

        // Calculate actual PITI for this home price
        const monthlyTaxes = (maxHomePrice * propertyTaxes) / 12;
        const monthlyInsurance = homeInsurance / 12;

        let principalAndInterest = 0;
        if (monthlyInterestRate > 0) {
            principalAndInterest = (maxLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        }
        
        const monthlyPayment = principalAndInterest + monthlyTaxes + monthlyInsurance;

        setResults({
            maxHomePrice,
            monthlyPayment,
            principalAndInterest,
            monthlyTaxes,
            monthlyInsurance,
            maxLoanAmount,
            limitingFactor: 'income',
        });

        // For comparison
        const rate2 = parseNumber(comparison.rate2) / 100;
        const term2 = parseInt(comparison.term2, 10);
        const monthlyRate2 = rate2 / 12;
        const payments2 = term2 * 12;
        let monthlyPayment2 = 0;
        if (monthlyRate2 > 0) {
            monthlyPayment2 = (maxLoanAmount * monthlyRate2 * Math.pow(1 + monthlyRate2, payments2)) / (Math.pow(1 + monthlyRate2, payments2) - 1);
        }

        const totalInterest1 = (principalAndInterest * numberOfPayments) - maxLoanAmount;
        const totalInterest2 = (monthlyPayment2 * payments2) - maxLoanAmount;

        setComparison(prev => ({ ...prev, monthlyPayment2, totalInterest1, totalInterest2 }));
    }, [inputs, comparison.rate2, comparison.term2]);

    // --- Effects ---
    useEffect(() => {
        calculateMortgage();
    }, [calculateMortgage]);

    // --- Event Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleComparisonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setComparison(prev => ({ ...prev, [name]: value }));
    };

    // --- Sub-components & Memoized Renders ---
    const renderPaymentBreakdownChart = (results: ResultState) => {
        if (!results || results.monthlyPayment === 0) return null;

        const pAndIPercentage = (results.principalAndInterest / results.monthlyPayment) * 100;
        const taxesPercentage = (results.monthlyTaxes / results.monthlyPayment) * 100;
        const insurancePercentage = (results.monthlyInsurance / results.monthlyPayment) * 100;

        return (
            <div style={styles.chartContainer}>
                <div style={{ ...styles.chartBar, width: `${pAndIPercentage}%`, backgroundColor: '#3b82f6' }} title={`Principal & Interest: ${formatCurrency(results.principalAndInterest)}`}></div>
                <div style={{ ...styles.chartBar, width: `${taxesPercentage}%`, backgroundColor: '#60a5fa' }} title={`Taxes: ${formatCurrency(results.monthlyTaxes)}`}></div>
                <div style={{ ...styles.chartBar, width: `${insurancePercentage}%`, backgroundColor: '#93c5fd' }} title={`Insurance: ${formatCurrency(results.monthlyInsurance)}`}></div>
            </div>
        );
    };

    const renderPaymentBreakdownLegend = () => (
        <div style={styles.legendContainer}>
            <div style={styles.legendItem}><span style={{...styles.legendColorBox, backgroundColor: '#3b82f6'}}></span>P&I</div>
            <div style={styles.legendItem}><span style={{...styles.legendColorBox, backgroundColor: '#60a5fa'}}></span>Taxes</div>
            <div style={styles.legendItem}><span style={{...styles.legendColorBox, backgroundColor: '#93c5fd'}}></span>Insurance</div>
        </div>
    );

    const inputFields = useMemo(() => [
        { name: 'annualIncome', label: 'Annual Income', icon: <DollarIcon /> },
        { name: 'monthlyDebts', label: 'Monthly Debts', icon: <DollarIcon /> },
        { name: 'downPayment', label: 'Down Payment', icon: <DollarIcon /> },
        { name: 'interestRate', label: 'Interest Rate (%)', icon: <PercentIcon /> },
        { name: 'loanTerm', label: 'Loan Term (Years)', icon: <PercentIcon /> },
        { name: 'propertyTaxes', label: 'Property Tax Rate (%)', icon: <PercentIcon /> },
        { name: 'homeInsurance', label: 'Home Insurance (Annual)', icon: <DollarIcon /> },
    ], []);

    return (
        <div style={styles.container}>
            <div style={styles.grid}>
                {/* Inputs Column */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}><HomeIcon /> Mortgage Affordability</h2>
                    {inputFields.map(field => (
                        <div key={field.name} style={styles.inputGroup}>
                            <label htmlFor={field.name} style={styles.label}>{field.label}</label>
                            <div style={styles.inputContainer}>
                                <div style={styles.inputIcon}>{field.icon}</div>
                                <input
                                    type="text"
                                    id={field.name}
                                    name={field.name}
                                    value={inputs[field.name as keyof InputState]}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Results Column */}
                <div className="space-y-6">
                    <div style={{ ...styles.card, ...styles.resultCard }}>
                        <h2 style={styles.cardTitle}>Your Maximum Home Price</h2>
                        <p style={styles.resultValue}>{results ? formatCurrency(results.maxHomePrice) : '$0'}</p>
                        <p style={styles.resultLabel}>Based on your financial profile</p>
                        <div style={styles.separator}></div>
                        <h3 className="text-lg font-semibold mb-2">Estimated Monthly Payment</h3>
                        <p className="text-2xl font-bold">{results ? formatCurrency(results.monthlyPayment) : '$0'}</p>
                        {results && renderPaymentBreakdownChart(results)}
                        {renderPaymentBreakdownLegend()}
                        {results && (
                             <ul style={styles.breakdownList}>
                                <li style={styles.breakdownItem}><span>Principal & Interest</span><span>{formatCurrency(results.principalAndInterest)}</span></li>
                                <li style={styles.breakdownItem}><span>Property Taxes</span><span>{formatCurrency(results.monthlyTaxes)}</span></li>
                                <li style={styles.breakdownItem}><span>Home Insurance</span><span>{formatCurrency(results.monthlyInsurance)}</span></li>
                            </ul>
                        )}
                    </div>

                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Loan Comparison</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold">{inputs.loanTerm} Years @ {inputs.interestRate}%</h4>
                                <p>Monthly P&I: {results ? formatCurrency(results.principalAndInterest) : '$0'}</p>
                                <p>Total Interest: {comparison.totalInterest1 ? formatCurrency(comparison.totalInterest1) : '$0'}</p>
                            </div>
                            <div>
                                <h4 className="font-bold">{comparison.term2} Years @ {comparison.rate2}%</h4>
                                <p>Monthly P&I: {comparison.monthlyPayment2 ? formatCurrency(comparison.monthlyPayment2) : '$0'}</p>
                                <p>Total Interest: {comparison.totalInterest2 ? formatCurrency(comparison.totalInterest2) : '$0'}</p>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4 mt-4">
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Rate 2 (%)</label>
                                <input type="text" name="rate2" value={comparison.rate2} onChange={handleComparisonChange} style={{...styles.input, paddingLeft: '12px'}} />
                            </div>
                             <div style={styles.inputGroup}>
                                <label style={styles.label}>Term 2 (Yrs)</label>
                                <input type="text" name="term2" value={comparison.term2} onChange={handleComparisonChange} style={{...styles.input, paddingLeft: '12px'}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MortgageAffordabilityCalculator;