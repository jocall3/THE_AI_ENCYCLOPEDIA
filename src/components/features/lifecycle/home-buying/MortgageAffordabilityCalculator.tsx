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
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12a7 7 0 1114 0 7 7 0 01-14 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l-8 8" />
    </svg>
);


// --- UTILITY FUNCTIONS ---
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/[^0-9.-]+/g,"")) || 0;
};

// --- CORE LOGIC ---
const calculateMortgage = (loanAmount: number, interestRate: number, loanTerm: number): number => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) return 0;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
};


const MortgageAffordabilityCalculator: React.FC = () => {
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
        term2: '30',
        monthlyPayment2: null,
        totalInterest1: null,
        totalInterest2: null,
    });

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    }, []);

    const calculateAffordability = useCallback(() => {
        const annualIncome = parseNumber(inputs.annualIncome);
        const monthlyDebts = parseNumber(inputs.monthlyDebts);
        const downPayment = parseNumber(inputs.downPayment);
        const interestRate = parseNumber(inputs.interestRate);
        const loanTerm = parseInt(inputs.loanTerm, 10);
        const annualPropertyTaxes = parseNumber(inputs.propertyTaxes);
        const annualHomeInsurance = parseNumber(inputs.homeInsurance);

        const monthlyIncome = annualIncome / 12;

        // Using the 28/36 rule
        const maxHousingPaymentByIncome = monthlyIncome * 0.28;
        const maxTotalDebtPayment = monthlyIncome * 0.36;
        const maxHousingPaymentByDebt = maxTotalDebtPayment - monthlyDebts;

        const maxAffordableMonthlyPayment = Math.min(maxHousingPaymentByIncome, maxHousingPaymentByDebt);
        const limitingFactor = maxHousingPaymentByIncome < maxHousingPaymentByDebt ? 'income' : 'debt';

        const tempEstimatedMonthlyTaxes = (annualIncome * 2.5 * (annualPropertyTaxes / 100)) / 12; // Estimate tax on a home ~2.5x income
        const monthlyInsurance = annualHomeInsurance / 12;
        
        const availableForPAndI = maxAffordableMonthlyPayment - tempEstimatedMonthlyTaxes - monthlyInsurance;
        
        if (availableForPAndI <= 0) {
            setResults({
                maxHomePrice: downPayment,
                monthlyPayment: monthlyDebts,
                principalAndInterest: 0,
                monthlyTaxes: 0,
                monthlyInsurance: 0,
                maxLoanAmount: 0,
                limitingFactor,
            });
            return;
        }

        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;
        const maxLoanAmount = availableForPAndI * ((Math.pow(1 + monthlyRate, numberOfPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)));
        
        const maxHomePrice = maxLoanAmount + downPayment;
        const finalMonthlyTaxes = (maxHomePrice * (annualPropertyTaxes / 100)) / 12;
        const principalAndInterest = calculateMortgage(maxLoanAmount, interestRate, loanTerm);

        setResults({
            maxHomePrice,
            monthlyPayment: principalAndInterest + finalMonthlyTaxes + monthlyInsurance,
            principalAndInterest,
            monthlyTaxes: finalMonthlyTaxes,
            monthlyInsurance,
            maxLoanAmount,
            limitingFactor,
        });
        
        // Calculate comparison
        const rate2 = parseNumber(comparison.rate2);
        const term2 = parseInt(comparison.term2, 10);
        const pmt2 = calculateMortgage(maxLoanAmount, rate2, term2);
        setComparison(prev => ({
            ...prev,
            monthlyPayment2: pmt2,
            totalInterest1: (principalAndInterest * numberOfPayments) - maxLoanAmount,
            totalInterest2: (pmt2 * term2 * 12) - maxLoanAmount,
        }));

    }, [inputs, comparison.rate2, comparison.term2]);

    useEffect(() => {
        calculateAffordability();
    }, [calculateAffordability]);

    const breakdownChart = useMemo(() => {
        if (!results || results.monthlyPayment <= 0) {
            return null;
        }
        const { principalAndInterest, monthlyTaxes, monthlyInsurance, monthlyPayment } = results;
        const pAndIPercentage = (principalAndInterest / monthlyPayment) * 100;
        const taxesPercentage = (monthlyTaxes / monthlyPayment) * 100;
        const insurancePercentage = (monthlyInsurance / monthlyPayment) * 100;

        const styles = {
            chartContainer: {
                display: 'flex',
                height: '2rem',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                backgroundColor: '#374151',
                width: '100%',
            },
            chartBar: {
                height: '100%',
                transition: 'width 0.5s ease-in-out',
            }
        };

        return (
            <div style={styles.chartContainer}>
                <div style={{ ...styles.chartBar, width: `${pAndIPercentage}%`, backgroundColor: '#3b82f6' }} title={`Principal & Interest: ${formatCurrency(results.principalAndInterest)}`}></div>
                <div style={{ ...styles.chartBar, width: `${taxesPercentage}%`, backgroundColor: '#60a5fa' }} title={`Taxes: ${formatCurrency(results.monthlyTaxes)}`}></div>
                <div style={{ ...styles.chartBar, width: `${insurancePercentage}%`, backgroundColor: '#93c5fd' }} title={`Insurance: ${formatCurrency(results.monthlyInsurance)}`}></div>
            </div>
        );
    }, [results]);

    const InputField = ({ label, name, value, onChange, type = 'text', icon, unit }: { label: string, name: keyof InputState, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, icon?: React.ReactNode, unit?: string }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <div className="relative">
                {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    className={`block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm ${icon ? 'pl-10' : 'pl-4'} ${unit ? 'pr-12' : 'pr-4'}`}
                />
                {unit && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">{unit}</div>}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800 text-white p-4 sm:p-6 md:p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl border border-gray-700">
            <header className="flex items-center mb-6">
                <HomeIcon />
                <h1 className="text-2xl font-bold tracking-tight">Mortgage Affordability Calculator</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- Left Side: Inputs --- */}
                <div className="space-y-4">
                    <InputField label="Annual Income" name="annualIncome" value={inputs.annualIncome} onChange={handleInputChange} icon={<DollarIcon />} />
                    <InputField label="Monthly Debts" name="monthlyDebts" value={inputs.monthlyDebts} onChange={handleInputChange} icon={<DollarIcon />} />
                    <InputField label="Down Payment" name="downPayment" value={inputs.downPayment} onChange={handleInputChange} icon={<DollarIcon />} />
                    <InputField label="Interest Rate" name="interestRate" value={inputs.interestRate} onChange={handleInputChange} icon={<PercentIcon />} unit="%" />
                    <div>
                        <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-300 mb-1">Loan Term</label>
                        <select
                            id="loanTerm"
                            name="loanTerm"
                            value={inputs.loanTerm}
                            onChange={handleInputChange}
                            className="block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm py-2 pl-3 pr-10 text-white focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        >
                            <option>30</option>
                            <option>20</option>
                            <option>15</option>
                            <option>10</option>
                        </select>
                    </div>
                    <InputField label="Annual Property Taxes" name="propertyTaxes" value={inputs.propertyTaxes} onChange={handleInputChange} icon={<PercentIcon />} unit="%" />
                    <InputField label="Annual Home Insurance" name="homeInsurance" value={inputs.homeInsurance} onChange={handleInputChange} icon={<DollarIcon />} />
                </div>

                {/* --- Right Side: Results & Comparison --- */}
                <div className="space-y-6">
                    {results && (
                        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-center">
                            <h2 className="text-lg font-medium text-gray-400">You Can Afford a Home Up To</h2>
                            <p className="text-5xl font-bold text-cyan-400 my-2">{formatCurrency(results.maxHomePrice)}</p>
                            <p className="text-gray-300">Estimated Monthly Payment: <span className="font-semibold text-white">{formatCurrency(results.monthlyPayment)}</span></p>
                            
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Monthly Payment Breakdown</h3>
                                {breakdownChart}
                                <div className="flex justify-between text-xs mt-1 text-gray-400">
                                    <span>P&I</span>
                                    <span>Taxes</span>
                                    <span>Insurance</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                                Your affordability is currently limited by your {results.limitingFactor === 'income' ? 'income (28% rule)' : 'debt-to-income ratio (36% rule)'}.
                            </p>
                        </div>
                    )}
                    
                    {results && results.maxLoanAmount > 0 && (
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <h3 className="text-lg font-semibold mb-3">Scenario Comparison</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-300">{inputs.interestRate}% for {inputs.loanTerm} years</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(results.monthlyPayment)}/mo</p>
                                    <p className="text-xs text-gray-400">Total Interest: {formatCurrency(comparison.totalInterest1 || 0)}</p>
                                </div>
                                <div>
                                    <div className="flex gap-2 mb-1">
                                         <input type="text" value={comparison.rate2} onChange={e => setComparison(prev => ({...prev, rate2: e.target.value}))} className="w-16 bg-gray-800 text-white p-1 rounded-md text-sm" />
                                         <select value={comparison.term2} onChange={e => setComparison(prev => ({...prev, term2: e.target.value}))} className="w-20 bg-gray-800 text-white p-1 rounded-md text-sm">
                                            <option>30</option>
                                            <option>20</option>
                                            <option>15</option>
                                         </select>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(comparison.monthlyPayment2 || 0)}/mo</p>
                                    <p className="text-xs text-gray-400">Total Interest: {formatCurrency(comparison.totalInterest2 || 0)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MortgageAffordabilityCalculator;