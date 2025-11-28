```tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, Users, Percent, ClipboardCheck, Loader2, PartyPopper, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface EmployeePayroll {
    id: number;
    name: string;
    rate: number;
    rateType: 'hourly' | 'salary';
    regularHours: number;
    overtimeHours: number;
    bonus: number;
    deductions: {
        healthInsurance: number;
        dental: number;
        '401k': number;
    };
}

interface PayrollData {
    periodStart: string;
    periodEnd: string;
    payDate: string;
    employees: EmployeePayroll[];
}

interface PayrollTotals {
    grossPay: number;
    totalDeductions: number;
    employeeTaxes: number;
    netPay: number;
    employerTaxes: number;
    totalCost: number;
}

// --- MOCK DATA ---
const getInitialMockData = (): PayrollData => ({
    periodStart: '2023-11-01',
    periodEnd: '2023-11-15',
    payDate: '2023-11-20',
    employees: [
        { id: 1, name: 'Alice Johnson', rate: 45, rateType: 'hourly', regularHours: 80, overtimeHours: 5, bonus: 200, deductions: { healthInsurance: 150, dental: 25, '401k': 210 } },
        { id: 2, name: 'Bob Williams', rate: 50000 / 24, rateType: 'salary', regularHours: 80, overtimeHours: 0, bonus: 0, deductions: { healthInsurance: 150, dental: 25, '401k': 250 } },
        { id: 3, name: 'Charlie Brown', rate: 25, rateType: 'hourly', regularHours: 75, overtimeHours: 10, bonus: 50, deductions: { healthInsurance: 100, dental: 20, '401k': 150 } },
        { id: 4, name: 'Diana Prince', rate: 120000 / 24, rateType: 'salary', regularHours: 80, overtimeHours: 0, bonus: 1000, deductions: { healthInsurance: 200, dental: 40, '401k': 600 } },
    ],
});

// --- HELPER FUNCTIONS & CONSTANTS ---
const WIZARD_STEPS = [
    { name: 'Pay Period', icon: Calendar },
    { name: 'Review Employees', icon: Users },
    { name: 'Deductions & Taxes', icon: Percent },
    { name: 'Confirm & Submit', icon: ClipboardCheck },
];

const calculateGrossPay = (employee: EmployeePayroll): number => {
    let gross = 0;
    if (employee.rateType === 'hourly') {
        const regularPay = employee.regularHours * employee.rate;
        const overtimePay = employee.overtimeHours * employee.rate * 1.5;
        gross = regularPay + overtimePay;
    } else {
        gross = employee.rate; // Salaried employees paid a fixed amount per period
    }
    return gross + employee.bonus;
};

// --- SUB-COMPONENTS (for each step) ---
const Step1_PayPeriod: React.FC<{ data: PayrollData; setData: React.Dispatch<React.SetStateAction<PayrollData>> }> = ({ data, setData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Select Payroll Period</h2>
            <p className="text-gray-600 dark:text-gray-400">Define the dates for this payroll run.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="periodStart" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Period Start Date</label>
                    <input type="date" name="periodStart" id="periodStart" value={data.periodStart} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                </div>
                <div>
                    <label htmlFor="periodEnd" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Period End Date</label>
                    <input type="date" name="periodEnd" id="periodEnd" value={data.periodEnd} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                </div>
                <div>
                    <label htmlFor="payDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pay Date</label>
                    <input type="date" name="payDate" id="payDate" value={data.payDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                </div>
            </div>
        </div>
    );
};

const Step2_ReviewEmployees: React.FC<{ data: PayrollData; setData: React.Dispatch<React.SetStateAction<PayrollData>> }> = ({ data, setData }) => {
    const handleEmployeeChange = (id: number, field: keyof EmployeePayroll, value: number) => {
        setData(prev => ({
            ...prev,
            employees: prev.employees.map(emp => emp.id === id ? { ...emp, [field]: value } : emp)
        }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Review Employee Hours & Earnings</h2>
            <p className="text-gray-600 dark:text-gray-400">Verify and adjust hours, bonuses, and other earnings for each employee.</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Employee</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Reg. Hours</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">OT Hours</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Bonus</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Gross Pay</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {data.employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{emp.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <input type="number" value={emp.regularHours} disabled={emp.rateType === 'salary'} onChange={e => handleEmployeeChange(emp.id, 'regularHours', Number(e.target.value))} className="w-20 rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-600" />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <input type="number" value={emp.overtimeHours} disabled={emp.rateType === 'salary'} onChange={e => handleEmployeeChange(emp.id, 'overtimeHours', Number(e.target.value))} className="w-20 rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-600" />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <input type="number" value={emp.bonus} onChange={e => handleEmployeeChange(emp.id, 'bonus', Number(e.target.value))} className="w-24 rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${calculateGrossPay(emp).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Step_Summary: React.FC<{ totals: PayrollTotals; title: string; description: string; children?: React.ReactNode }> = ({ totals, title, description, children }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <SummaryRow label="Total Gross Pay" value={totals.grossPay} />
                <SummaryRow label="Employee Taxes (Est.)" value={totals.employeeTaxes} />
                <SummaryRow label="Total Deductions" value={totals.totalDeductions} />
                <SummaryRow label="Total Net Pay" value={totals.netPay} isBold={true} />
                <SummaryRow label="Employer Taxes (Est.)" value={totals.employerTaxes} />
                <SummaryRow label="Total Payroll Cost" value={totals.totalCost} isBold={true} />
            </dl>
        </div>
        {children}
    </div>
);

const SummaryRow: React.FC<{ label: string; value: number; isBold?: boolean }> = ({ label, value, isBold }) => (
    <div className={`flex justify-between items-center py-2 ${isBold ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
        <dt>{label}</dt>
        <dd className={isBold ? 'text-lg' : ''}>${value.toFixed(2)}</dd>
    </div>
);


// --- MAIN WIZARD COMPONENT ---
export const PayrollProcessingWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [payrollData, setPayrollData] = useState<PayrollData>(getInitialMockData());
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const totals: PayrollTotals = useMemo(() => {
        const grossPay = payrollData.employees.reduce((acc, emp) => acc + calculateGrossPay(emp), 0);
        const totalDeductions = payrollData.employees.reduce((acc, emp) => acc + emp.deductions.healthInsurance + emp.deductions.dental + emp.deductions['401k'], 0);
        
        // Simplified tax estimation
        const employeeTaxes = grossPay * 0.18; // Federal, State, FICA
        const employerTaxes = grossPay * 0.09; // FICA match, FUTA, SUTA
        
        const netPay = grossPay - totalDeductions - employeeTaxes;
        const totalCost = grossPay + employerTaxes;

        return { grossPay, totalDeductions, employeeTaxes, netPay, employerTaxes, totalCost };
    }, [payrollData.employees]);

    const handleNext = () => {
        if (currentStep < WIZARD_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleConfirmPayroll = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsComplete(true);
        }, 2000); // Simulate API call
    };

    const handleReset = () => {
        setPayrollData(getInitialMockData());
        setCurrentStep(0);
        setIsComplete(false);
        setIsProcessing(false);
    };

    const renderStepContent = useCallback(() => {
        switch (currentStep) {
            case 0:
                return <Step1_PayPeriod data={payrollData} setData={setPayrollData} />;
            case 1:
                return <Step2_ReviewEmployees data={payrollData} setData={setPayrollData} />;
            case 2:
                return <Step_Summary 
                            totals={totals}
                            title="Deductions & Taxes Summary"
                            description="This is an estimated summary of all deductions and taxes for this payroll run."
                        />;
            case 3:
                return <Step_Summary 
                            totals={totals}
                            title="Final Confirmation"
                            description="Please review the final payroll summary below. Once confirmed, this action cannot be undone."
                        />;
            default:
                return null;
        }
    }, [currentStep, payrollData, totals]);

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center min-h-[500px]">
                <PartyPopper className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Payroll Processed Successfully!</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Pay stubs have been generated and payments are scheduled for {payrollData.payDate}.
                </p>
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleReset}
                        className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Run Another Payroll
                    </button>
                    <button
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                        Download Reports
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg w-full max-w-5xl mx-auto">
            <div className="mb-8">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center">
                        {WIZARD_STEPS.map((step, stepIdx) => (
                            <li key={step.name} className={`relative ${stepIdx !== WIZARD_STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
                                {currentStep > stepIdx ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-indigo-600" />
                                        </div>
                                        <div className="relative flex h-8 w-8 items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-900">
                                            <step.icon className="h-5 w-5 text-white" aria-hidden="true" />
                                        </div>
                                    </>
                                ) : currentStep === stepIdx ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                                        </div>
                                        <div className="relative flex h-8 w-8 items-center justify-center bg-white dark:bg-gray-800 border-2 border-indigo-600 rounded-full" aria-current="step">
                                            <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" aria-hidden="true" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                                        </div>
                                        <div className="relative flex h-8 w-8 items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full">
                                            <step.icon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                                        </div>
                                    </>
                                )}
                                <span className="absolute top-10 text-center w-full -ml-4 sm:-ml-10 text-xs font-medium text-gray-600 dark:text-gray-400">{step.name}</span>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md min-h-[400px]">
                {renderStepContent()}
            </div>

            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0 || isProcessing}
                    className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    <ChevronLeft className="mr-2 h-4 w-4"/>
                    Back
                </button>
                {currentStep < WIZARD_STEPS.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4"/>
                    </button>
                ) : (
                    <button
                        onClick={handleConfirmPayroll}
                        disabled={isProcessing}
                        className="flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                           "Confirm & Run Payroll"
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PayrollProcessingWizard;
```