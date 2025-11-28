```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ProjectionResult = {
    projectedTotalCost: number;
    projectedTotalSavings: number;
    shortfallOrSurplus: number;
    requiredMonthlyContribution: number;
    chartData: Array<{ year: number; savings: number; cost: number }>;
};

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 text-gray-400">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const CollegeSavingsPlanner529: React.FC = () => {
    // Input state
    const [childsAge, setChildsAge] = useState<number>(5);
    const [collegeStartAge, setCollegeStartAge] = useState<number>(18);
    const [currentAnnualCost, setCurrentAnnualCost] = useState<number>(25000);
    const [costInflationRate, setCostInflationRate] = useState<number>(5);
    const [currentSavings, setCurrentSavings] = useState<number>(10000);
    const [investmentReturnRate, setInvestmentReturnRate] = useState<number>(7);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(300);

    // Results state
    const [results, setResults] = useState<ProjectionResult>({
        projectedTotalCost: 0,
        projectedTotalSavings: 0,
        shortfallOrSurplus: 0,
        requiredMonthlyContribution: 0,
        chartData: [],
    });

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);

    const calculateProjections = useCallback(() => {
        const yearsToCollege = collegeStartAge - childsAge;
        if (yearsToCollege <= 0) {
            setResults({ projectedTotalCost: 0, projectedTotalSavings: currentSavings, shortfallOrSurplus: -currentAnnualCost * 4, requiredMonthlyContribution: 0, chartData: [] });
            return;
        }

        const monthlyReturnRate = investmentReturnRate / 100 / 12;
        const numMonths = yearsToCollege * 12;
        const annualInflationRate = costInflationRate / 100;
        const annualReturnRate = investmentReturnRate / 100;

        // Projected future value of current savings
        const fvLumpSum = currentSavings * Math.pow(1 + monthlyReturnRate, numMonths);

        // Projected future value of monthly contributions
        const fvAnnuity = monthlyContribution * ((Math.pow(1 + monthlyReturnRate, numMonths) - 1) / monthlyReturnRate);

        const projectedTotalSavings = fvLumpSum + fvAnnuity;

        // Projected future cost of college for 4 years
        let projectedTotalCost = 0;
        const collegeCostsPerYear = [];
        for (let i = 0; i < 4; i++) {
            const cost = currentAnnualCost * Math.pow(1 + annualInflationRate, yearsToCollege + i);
            projectedTotalCost += cost;
            collegeCostsPerYear.push(cost);
        }

        const shortfallOrSurplus = projectedTotalSavings - projectedTotalCost;

        // Required monthly contribution to meet the goal
        const fundingGap = projectedTotalCost - fvLumpSum;
        let requiredMonthlyContribution = 0;
        if (fundingGap > 0) {
            const denominator = (Math.pow(1 + monthlyReturnRate, numMonths) - 1) / monthlyReturnRate;
            requiredMonthlyContribution = denominator > 0 ? fundingGap / denominator : 0;
        }

        // Chart data generation
        const chartData = [];
        const currentYear = new Date().getFullYear();
        for (let i = 0; i <= yearsToCollege; i++) {
            const monthsElapsed = i * 12;
            const fvLumpSumYear = currentSavings * Math.pow(1 + monthlyReturnRate, monthsElapsed);
            const fvAnnuityYear = i === 0 ? 0 : monthlyContribution * ((Math.pow(1 + monthlyReturnRate, monthsElapsed) - 1) / monthlyReturnRate);
            const savings = fvLumpSumYear + fvAnnuityYear;
            
            let costForYear = 0;
            if (i === yearsToCollege) {
                costForYear = projectedTotalCost;
            }

            chartData.push({
                year: currentYear + i,
                savings: Math.round(savings),
                cost: Math.round(costForYear),
            });
        }


        setResults({
            projectedTotalCost,
            projectedTotalSavings,
            shortfallOrSurplus,
            requiredMonthlyContribution,
            chartData,
        });

    }, [childsAge, collegeStartAge, currentAnnualCost, costInflationRate, currentSavings, investmentReturnRate, monthlyContribution]);

    useEffect(() => {
        calculateProjections();
    }, [calculateProjections]);

    const InputSlider = ({ label, value, min, max, step, onChange, format, unit, tooltip }: any) => (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {tooltip && <span title={tooltip}><InfoIcon /></span>}
            </label>
            <div className="flex items-center mt-1">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="ml-4 text-lg font-semibold text-blue-700 w-32 text-right">{format(value)}{unit}</span>
            </div>
        </div>
    );
    
    const ResultCard = ({ title, value, color, tooltip }: any) => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 flex items-center">
                {title}
                {tooltip && <span title={tooltip}><InfoIcon /></span>}
            </h3>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
    );

    return (
        <div className="bg-gray-50 p-4 sm:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">529 College Savings Planner</h1>
                    <p className="mt-2 text-lg text-gray-600">Project future college costs and plan your contributions.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Settings</h2>
                        <InputSlider label="Child's Current Age" value={childsAge} min={0} max={18} step={1} onChange={setChildsAge} format={(v: number) => v} unit="" />
                        <InputSlider label="College Start Age" value={collegeStartAge} min={15} max={25} step={1} onChange={setCollegeStartAge} format={(v: number) => v} unit="" />
                        <InputSlider label="Current Annual College Cost" value={currentAnnualCost} min={5000} max={100000} step={1000} onChange={setCurrentAnnualCost} format={formatCurrency} unit="" tooltip="Estimated cost for one year of college today." />
                        <InputSlider label="College Cost Inflation Rate" value={costInflationRate} min={1} max={10} step={0.5} onChange={setCostInflationRate} format={(v: number) => v.toFixed(1)} unit="%" tooltip="The expected average annual increase in college costs." />
                        <InputSlider label="Current Savings" value={currentSavings} min={0} max={250000} step={500} onChange={setCurrentSavings} format={formatCurrency} unit="" />
                        <InputSlider label="Est. Annual Investment Return" value={investmentReturnRate} min={1} max={15} step={0.5} onChange={setInvestmentReturnRate} format={(v: number) => v.toFixed(1)} unit="%" tooltip="Your expected average annual return on savings." />
                        <InputSlider label="Monthly Contribution" value={monthlyContribution} min={0} max={5000} step={25} onChange={setMonthlyContribution} format={formatCurrency} unit="" />
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-3">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <ResultCard title="Projected Total Cost" value={formatCurrency(results.projectedTotalCost)} color="text-red-600" tooltip="The estimated total cost for a 4-year degree when your child enrolls." />
                            <ResultCard title="Projected Total Savings" value={formatCurrency(results.projectedTotalSavings)} color="text-green-600" tooltip="The estimated value of your savings at the time of college enrollment."/>
                            <ResultCard 
                                title={results.shortfallOrSurplus >= 0 ? "Funding Surplus" : "Funding Shortfall"} 
                                value={formatCurrency(Math.abs(results.shortfallOrSurplus))} 
                                color={results.shortfallOrSurplus >= 0 ? "text-green-600" : "text-orange-500"} 
                            />
                             <ResultCard title="Suggested Monthly Contribution" value={formatCurrency(results.requiredMonthlyContribution)} color="text-blue-600" tooltip="The amount you need to save each month to fully fund your goal."/>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg h-[450px]">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Savings Growth Projection</h2>
                            <ResponsiveContainer width="100%" height="90%">
                               {yearsToCollege > 0 ? (
                                <LineChart data={results.chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="year" tick={{ fill: '#666', fontSize: 12 }} />
                                    <YAxis tickFormatter={(value) => `$${(Number(value) / 1000)}k`} tick={{ fill: '#666', fontSize: 12 }} />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        labelStyle={{ fontWeight: 'bold' }}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ccc', borderRadius: '5px' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="savings" name="Projected Savings" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                </LineChart>
                               ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>Chart is not applicable as college start age is in the past or current year.</p>
                                </div>
                               )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeSavingsPlanner529;
```