```typescript
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

// --- MAIN COMPONENT ---
const MortgageAffordabilityCalculator: React.FC = () => {
    const initialInputs: InputState = {
        annualIncome: '80000',
        monthlyDebts: '500',
        downPayment: '20000',
        interestRate: '6.5',
        loanTerm: '30',
        propertyTaxes: '4000',
        homeInsurance: '1500',
    };

    const [inputs, setInputs] = useState<InputState>(initialInputs);
    const [results, setResults] = useState<ResultState | null>(null);
    const [comparison, setComparison] = useState<ComparisonState>({ rate2: '6.25', term2: '30', monthlyPayment2: null, totalInterest1: null, totalInterest2: null });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const calculateMortgage = useCallback((loanAmount: number, annualRate: number, termYears: number): { monthlyPayment: number; totalInterest: number } => {
        if (loanAmount <= 0 || annualRate <= 0 || termYears <= 0) return { monthlyPayment: 0, totalInterest: 0 };
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = termYears * 12;
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalPaid = monthlyPayment * numberOfPayments;
        const totalInterest = totalPaid - loanAmount;
        return { monthlyPayment, totalInterest };
    }, []);

    const handleCalculate = useCallback(() => {
        const annualIncome = parseFloat(inputs.annualIncome) || 0;
        const monthlyDebts = parseFloat(inputs.monthlyDebts) || 0;
        const downPayment = parseFloat(inputs.downPayment) || 0;
        const interestRate = parseFloat(inputs.interestRate) || 0;
        const loanTerm = parseInt(inputs.loanTerm, 10) || 0;
        const propertyTaxes = parseFloat(inputs.propertyTaxes) || 0;
        const homeInsurance = parseFloat(inputs.homeInsurance) || 0;

        if (annualIncome <= 0 || interestRate <= 0 || loanTerm <= 0) {
            setResults(null);
            return;
        }

        const grossMonthlyIncome = annualIncome / 12;
        const monthlyTaxes = propertyTaxes / 12;
        const monthlyInsurance = homeInsurance / 12;

        // Using 28/36 DTI rule
        const maxHousingPaymentByIncome = grossMonthlyIncome * 0.28;
        const maxTotalDebtPayment = grossMonthlyIncome * 0.36;
        const maxHousingPaymentByDebt = maxTotalDebtPayment - monthlyDebts;

        const affordablePITI = Math.max(0, Math.min(maxHousingPaymentByIncome, maxHousingPaymentByDebt));
        const limitingFactor = maxHousingPaymentByIncome < maxHousingPaymentByDebt ? 'income' : 'debt';

        const affordablePrincipalAndInterest = affordablePITI - monthlyTaxes - monthlyInsurance;

        if (affordablePrincipalAndInterest <= 0) {
            setResults({
                maxHomePrice: downPayment,
                monthlyPayment: monthlyTaxes + monthlyInsurance,
                principalAndInterest: 0,
                monthlyTaxes,
                monthlyInsurance,
                maxLoanAmount: 0,
                limitingFactor
            });
            return;
        }

        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;
        const denominator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
        const numerator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
        const maxLoanAmount = affordablePrincipalAndInterest * (numerator / denominator);
        
        const maxHomePrice = maxLoanAmount + downPayment;

        setResults({
            maxHomePrice,
            monthlyPayment: affordablePITI,
            principalAndInterest: affordablePrincipalAndInterest,
            monthlyTaxes,
            monthlyInsurance,
            maxLoanAmount,
            limitingFactor
        });

        // Pre-fill comparison with primary scenario
        const { totalInterest: totalInterest1 } = calculateMortgage(maxLoanAmount, interestRate, loanTerm);
        setComparison(prev => ({ ...prev, totalInterest1 }));

    }, [inputs, calculateMortgage]);
    
    const handleComparisonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setComparison(prev => ({ ...prev, [name]: value }));
    };

    const handleCompare = useCallback(() => {
        if (!results) return;
        
        const rate2 = parseFloat(comparison.rate2) || 0;
        const term2 = parseInt(comparison.term2, 10) || 0;
        
        const { monthlyPayment: monthlyPayment2, totalInterest: totalInterest2 } = calculateMortgage(results.maxLoanAmount, rate2, term2);

        setComparison(prev => ({ ...prev, monthlyPayment2, totalInterest2 }));

    }, [results, comparison.rate2, comparison.term2, calculateMortgage]);


    const handleReset = () => {
        setInputs(initialInputs);
        setResults(null);
        setComparison({ rate2: '6.25', term2: '30', monthlyPayment2: null, totalInterest1: null, totalInterest2: null });
    };
    
    const aiSuggestion = useMemo(() => {
        if (!results) return "Enter your financial details to get AI-powered insights.";
        if (results.maxHomePrice <= results.downPayment) {
            return "Based on your current financials, your debt or low income prevents qualifying for a loan. Consider reducing monthly debts or increasing your income.";
        }
        if (results.limitingFactor === 'debt') {
            return `Your monthly debts are the primary factor limiting your budget. Paying down debts like car loans or credit cards could significantly increase your affordability.`;
        }
        if (results.limitingFactor === 'income') {
            return `Your income is the main factor determining your budget. A larger down payment can help bridge the gap to a more expensive home without increasing your monthly payment.`;
        }
        return `With a strong financial profile, you have flexibility. Use the Loan Offer Simulator below to see how different interest rates can impact your long-term costs.`;
    }, [results]);


    const paymentBreakdownChart = useMemo(() => {
        if (!results || results.monthlyPayment <= 0) return null;
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
    }, [results]);


    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>AI-Powered Mortgage Affordability Simulator</h1>
                <p style={styles.subtitle}>Calculate your home-buying budget and compare loan offers to make a smarter decision.</p>
            </header>

            <div style={styles.mainContent}>
                <div style={styles.inputSection}>
                    <h2 style={styles.sectionTitle}>Your Financial Profile</h2>
                    <InputGroup label="Annual Gross Income">
                        <DollarIcon />
                        <input type="number" name="annualIncome" value={inputs.annualIncome} onChange={handleInputChange} style={styles.input} />
                    </InputGroup>
                    <InputGroup label="Total Monthly Debts">
                        <DollarIcon />
                        <input type="number" name="monthlyDebts" value={inputs.monthlyDebts} onChange={handleInputChange} style={styles.input} placeholder="Car, student loans, credit cards" />
                    </InputGroup>
                     <InputGroup label="Down Payment">
                        <DollarIcon />
                        <input type="number" name="downPayment" value={inputs.downPayment} onChange={handleInputChange} style={styles.input} />
                    </InputGroup>

                    <h2 style={{...styles.sectionTitle, marginTop: '2rem'}}>Loan Assumptions</h2>
                    <div style={styles.grid}>
                        <InputGroup label="Interest Rate (%)">
                           <input type="number" name="interestRate" step="0.01" value={inputs.interestRate} onChange={handleInputChange} style={styles.input} />
                        </InputGroup>
                        <InputGroup label="Loan Term (Years)">
                           <input type="number" name="loanTerm" value={inputs.loanTerm} onChange={handleInputChange} style={styles.input} />
                        </InputGroup>
                        <InputGroup label="Annual Property Taxes">
                           <DollarIcon />
                           <input type="number" name="propertyTaxes" value={inputs.propertyTaxes} onChange={handleInputChange} style={styles.input} />
                        </InputGroup>
                         <InputGroup label="Annual Home Insurance">
                           <DollarIcon />
                           <input type="number" name="homeInsurance" value={inputs.homeInsurance} onChange={handleInputChange} style={styles.input} />
                        </InputGroup>
                    </div>

                    <div style={styles.buttonGroup}>
                        <button onClick={handleCalculate} style={styles.primaryButton}>Calculate Affordability</button>
                        <button onClick={handleReset} style={styles.secondaryButton}>Reset</button>
                    </div>
                </div>

                <div style={styles.resultsSection}>
                    {results ? (
                        <>
                            <div style={styles.resultsCard}>
                                <p style={styles.resultsLabel}>You can afford a home up to</p>
                                <p style={styles.resultsValue}>{formatCurrency(results.maxHomePrice)}</p>
                                <div style={styles.monthlyPaymentContainer}>
                                    <p style={styles.monthlyPaymentLabel}>Estimated Monthly Payment</p>
                                    <p style={styles.monthlyPaymentValue}>{formatCurrency(results.monthlyPayment)}</p>
                                </div>
                                {paymentBreakdownChart}
                                <div style={styles.legend}>
                                    <div style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#3b82f6'}}></span> P&I: {formatCurrency(results.principalAndInterest)}</div>
                                    <div style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#60a5fa'}}></span> Taxes: {formatCurrency(results.monthlyTaxes)}</div>
                                    <div style={styles.legendItem}><span style={{...styles.legendDot, backgroundColor: '#93c5fd'}}></span> Insurance: {formatCurrency(results.monthlyInsurance)}</div>
                                </div>
                            </div>

                            <div style={styles.aiInsightCard}>
                                <h3 style={styles.cardTitle}>AI-Powered Insight</h3>
                                <p style={styles.aiText}>{aiSuggestion}</p>
                            </div>

                            <div style={styles.comparisonCard}>
                                <h3 style={styles.cardTitle}>Loan Offer Simulator</h3>
                                <p style={styles.cardSubtitle}>Compare your primary scenario against another offer.</p>
                                <table style={styles.comparisonTable}>
                                    <thead>
                                        <tr>
                                            <th>Scenario</th>
                                            <th>Interest Rate</th>
                                            <th>Term (Years)</th>
                                            <th>Monthly P&I</th>
                                            <th>Total Interest Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Your Calculation</strong></td>
                                            <td>{inputs.interestRate}%</td>
                                            <td>{inputs.loanTerm}</td>
                                            <td>{formatCurrency(results.principalAndInterest)}</td>
                                            <td>{comparison.totalInterest1 ? formatCurrency(comparison.totalInterest1) : '-'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Offer 2</strong></td>
                                            <td><input type="number" name="rate2" value={comparison.rate2} onChange={handleComparisonChange} style={styles.tableInput} step="0.01" /></td>
                                            <td><input type="number" name="term2" value={comparison.term2} onChange={handleComparisonChange} style={styles.tableInput} /></td>
                                            <td>{comparison.monthlyPayment2 ? formatCurrency(calculateMortgage(results.maxLoanAmount, parseFloat(comparison.rate2), parseInt(comparison.term2)).monthlyPayment) : '-'}</td>
                                            <td>{comparison.totalInterest2 ? formatCurrency(comparison.totalInterest2) : '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button onClick={handleCompare} style={{...styles.primaryButton, width: '100%', marginTop: '1rem'}}>Compare Offers</button>
                            </div>

                        </>
                    ) : (
                        <div style={styles.placeholder}>
                            <HomeIcon />
                            <h3 style={styles.placeholderTitle}>Your affordability report will appear here.</h3>
                            <p style={styles.placeholderText}>Fill in your details and click "Calculate Affordability" to begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div style={styles.inputGroup}>
        <label style={styles.label}>{label}</label>
        <div style={styles.inputWrapper}>{children}</div>
    </div>
);

// --- STYLES ---

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        backgroundColor: '#f8fafc',
        color: '#1e293b',
        padding: '2rem',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2.25rem',
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: '1.125rem',
        color: '#475569',
        maxWidth: '600px',
        margin: '0.5rem auto 0',
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    inputSection: {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.75rem',
    },
    inputGroup: {
        marginBottom: '1.25rem',
    },
    label: {
        display: 'block',
        fontWeight: '500',
        marginBottom: '0.5rem',
        color: '#334155',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #cbd5e1',
        borderRadius: '0.375rem',
        paddingLeft: '0.75rem',
    },
    input: {
        border: 'none',
        outline: 'none',
        padding: '0.75rem',
        width: '100%',
        backgroundColor: 'transparent',
        fontSize: '1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    buttonGroup: {
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    secondaryButton: {
        backgroundColor: '#e2e8f0',
        color: '#1e293b',
        border: '1px solid #cbd5e1',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    resultsSection: {
        backgroundColor: 'transparent',
    },
    placeholder: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        padding: '2rem',
        textAlign: 'center',
        border: '2px dashed #e2e8f0',
        color: '#64748b',
    },
    placeholderTitle: {
        marginTop: '1rem',
        fontSize: '1.25rem',
        fontWeight: '600',
    },
    placeholderText: {
        marginTop: '0.5rem',
        maxWidth: '300px',
    },
    resultsCard: {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        textAlign: 'center',
    },
    resultsLabel: {
        fontSize: '1.125rem',
        color: '#475569',
    },
    resultsValue: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#3b82f6',
        margin: '0.5rem 0',
    },
    monthlyPaymentContainer: {
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e2e8f0',
    },
    monthlyPaymentLabel: {
        fontSize: '1rem',
        color: '#475569',
    },
    monthlyPaymentValue: {
        fontSize: '1.75rem',
        fontWeight: '600',
        color: '#1e293b',
    },
    chartContainer: {
        display: 'flex',
        height: '1.25rem',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        margin: '1.5rem 0 0.75rem',
        backgroundColor: '#e2e8f0',
    },
    chartBar: {
        height: '100%',
    },
    legend: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
        fontSize: '0.875rem',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
    },
    legendDot: {
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: '50%',
        marginRight: '0.5rem',
    },
    aiInsightCard: {
        backgroundColor: '#eef2ff',
        borderLeft: '4px solid #4f46e5',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        marginTop: '2rem',
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '0.5rem',
    },
    cardSubtitle: {
        fontSize: '0.9rem',
        color: '#475569',
        marginBottom: '1rem',
    },
    aiText: {
        color: '#374151',
        lineHeight: '1.6',
    },
    comparisonCard: {
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        marginTop: '2rem',
    },
    comparisonTable: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    },
    tableInput: {
        width: '80px',
        padding: '0.25rem 0.5rem',
        border: '1px solid #cbd5e1',
        borderRadius: '0.25rem',
    }
};

// Add responsive styles (pseudo-code, as React styles don't support media queries directly)
// In a real app, you'd use a CSS-in-JS library or CSS modules.
// For this single file, let's assume a desktop-first approach.
// @media (max-width: 1024px) { mainContent: { gridTemplateColumns: '1fr' } }

export default MortgageAffordabilityCalculator;
```