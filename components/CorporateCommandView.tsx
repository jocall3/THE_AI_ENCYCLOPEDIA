import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View, PaymentOrder, Invoice, ComplianceCase, CorporateTransaction } from '../types'; // Expanded types from existing import
import { GoogleGenAI } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';


// --- Start of New Exported Types and Data Generation Functions ---

export type DailyVolumeData = {
    date: string;
    volume: number;
    amount: number;
};

export type MonthlySpendData = {
    month: string;
    [category: string]: string | number; // e.g., { month: 'Jan', 'T_E': 1000, 'Software': 500 }
};

export type InvoiceAgingData = {
    bucket: string;
    count: number;
    amount: number;
};

export type VendorSpendData = {
    vendor: string;
    amount: number;
};

export type DepartmentalBudgetVarianceData = {
    department: string;
    actualSpend: number;
    budget: number;
    variance: number;
    variancePct: number;
};

export type PaymentMethodUsageData = {
    method: string;
    count: number;
    totalAmount: number;
};

export type CashFlowTrendData = {
    period: string;
    inflow: number;
    outflow: number;
    netCashFlow: number;
};

export type FixedVariableCostData = {
    type: 'Fixed' | 'Variable';
    amount: number;
};

export type GeographicSpendData = {
    region: string;
    amount: number;
};

// NEW: Tax Liability Data
export type TaxLiabilityData = {
    vatEstimate: number;
    payrollTaxEstimate: number;
    corporateTaxEstimate: number;
};

// NEW: Budget Allocation Summary Data
export type BudgetAllocationSummaryData = {
    department: string;
    budget: number;
    actualSpend: number;
    variance: number;
};

// NEW: Audit Trail Metrics Data
export type AuditTrailData = {
    date: string;
    failedLogins: number;
    suspiciousActivities: number;
    dataAccessViolations: number;
};

// NEW: Employee Expense Types
export type EmployeeExpenseCategoryData = {
    category: string;
    amount: number;
};

export type EmployeeExpenseMetrics = {
    totalExpenses: number;
    averageExpense: number;
    topCategories: EmployeeExpenseCategoryData[];
    monthlyTrend: { month: string; amount: number }[];
};

// NEW: Contract Compliance Types
export type ContractStatusData = {
    totalContracts: number;
    expiringSoon: number; // e.g., next 90 days
    nonCompliant: number;
    autoRenewals: number;
};

// Exported Data Generation Functions

export const generateDailyTransactionVolumes = (transactions: CorporateTransaction[]): DailyVolumeData[] => {
    const dailyData: { [key: string]: { volume: number; amount: number } } = {};
    transactions.forEach(tx => {
        const date = new Date(tx.date).toISOString().split('T')[0]; // YYYY-MM-DD
        if (!dailyData[date]) {
            dailyData[date] = { volume: 0, amount: 0 };
        }
        dailyData[date].volume += 1;
        dailyData[date].amount += tx.amount;
    });
    return Object.entries(dailyData)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const generateMonthlySpendByCategory = (transactions: CorporateTransaction[]): MonthlySpendData[] => {
    const monthlyData: { [key: string]: { [category: string]: number } } = {};
    transactions.forEach(tx => {
        const month = new Date(tx.date).toISOString().substring(0, 7); // YYYY-MM
        const category = tx.merchant.includes('Steakhouse') || tx.merchant.includes('Lunch') || tx.description.includes('Travel') ? 'T_E' :
                         tx.merchant.includes('Cloud') || tx.merchant.includes('Software') || tx.description.includes('Software License') ? 'Software' :
                         tx.merchant.includes('Marketing') || tx.description.includes('Ad') ? 'Marketing' :
                         tx.merchant.includes('Rent') || tx.merchant.includes('Utilities') ? 'Facilities' :
                         tx.description.includes('Payroll') || tx.description.includes('Salaries') ? 'Salaries' :
                         'Other';
        if (!monthlyData[month]) {
            monthlyData[month] = { T_E: 0, Software: 0, Marketing: 0, Facilities: 0, Salaries: 0, Other: 0 };
        }
        monthlyData[month][category] = (monthlyData[month][category] || 0) + tx.amount;
    });

    return Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month));
};

export const generateInvoiceAgingBuckets = (invoices: Invoice[]): InvoiceAgingData[] => {
    const now = new Date();
    const buckets = {
        '0-30 Days': { count: 0, amount: 0 },
        '31-60 Days': { count: 0, amount: 0 },
        '61-90 Days': { count: 0, amount: 0 },
        '90+ Days': { count: 0, amount: 0 },
    };

    invoices.filter(i => i.status === 'overdue' || i.status === 'pending').forEach(inv => {
        const dueDate = new Date(inv.dueDate);
        const diffTime = now.getTime() - dueDate.getTime(); // Positive if overdue
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30) {
            buckets['0-30 Days'].count++;
            buckets['0-30 Days'].amount += inv.amount;
        } else if (diffDays <= 60) {
            buckets['31-60 Days'].count++;
            buckets['31-60 Days'].amount += inv.amount;
        } else if (diffDays <= 90) {
            buckets['61-90 Days'].count++;
            buckets['61-90 Days'].amount += inv.amount;
        } else {
            buckets['90+ Days'].count++;
            buckets['90+ Days'].amount += inv.amount;
        }
    });

    return Object.entries(buckets).map(([bucket, data]) => ({ bucket, ...data }));
};

export const generatePaymentApprovalMetrics = (paymentOrders: PaymentOrder[]): { avgTimeHours: number; overThresholdCount: number; throughputLast30Days: number } => {
    let totalApprovalTime = 0; // in hours
    let approvedCount = 0;
    let overThresholdCount = 0;
    const approvalThresholdHours = 48; // 2 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    let throughputCount = 0;

    paymentOrders.forEach(po => {
        if (po.status === 'approved') {
            if (po.requestDate && po.approvalDate) {
                const request = new Date(po.requestDate).getTime();
                const approval = new Date(po.approvalDate).getTime();
                const diffHours = (approval - request) / (1000 * 60 * 60);
                totalApprovalTime += diffHours;
                approvedCount++;
                if (diffHours > approvalThresholdHours) {
                    overThresholdCount++;
                }
            }
        }
        if (po.requestDate && new Date(po.requestDate) >= thirtyDaysAgo) { // Use requestDate for throughput
             throughputCount++;
        }
    });
    return {
        avgTimeHours: approvedCount > 0 ? totalApprovalTime / approvedCount : 0,
        overThresholdCount: overThresholdCount,
        throughputLast30Days: throughputCount,
    };
};

export const generateComplianceCaseResolutionMetrics = (cases: ComplianceCase[]): { avgTimeDays: number; overThresholdCount: number; criticalCases: number } => {
    let totalResolutionTime = 0; // in days
    let resolvedCount = 0;
    let overThresholdCount = 0;
    let criticalCases = 0;
    const resolutionThresholdDays = 30; // 30 days

    cases.forEach(c => {
        if (c.status === 'closed') {
            if (c.openDate && c.closeDate) {
                const open = new Date(c.openDate).getTime();
                const close = new Date(c.closeDate).getTime();
                const diffDays = (close - open) / (1000 * 60 * 60 * 24);
                totalResolutionTime += diffDays;
                resolvedCount++;
                if (diffDays > resolutionThresholdDays) {
                    overThresholdCount++;
                }
            }
        }
        if (c.priority === 'high' && c.status === 'open') {
            criticalCases++;
        }
    });
    return {
        avgTimeDays: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0,
        overThresholdCount: overThresholdCount,
        criticalCases: criticalCases,
    };
};

export const generateVendorSpendDistribution = (transactions: CorporateTransaction[]): VendorSpendData[] => {
    const vendorSpend: { [vendor: string]: number } = {};
    transactions.forEach(tx => {
        const vendor = tx.merchant; // Using merchant as vendor for simplicity
        vendorSpend[vendor] = (vendorSpend[vendor] || 0) + tx.amount;
    });
    return Object.entries(vendorSpend)
        .map(([vendor, amount]) => ({ vendor, amount }))
        .sort((a, b) => b.amount - a.amount);
};

export const generateDepartmentalBudgetVariance = (transactions: CorporateTransaction[]): DepartmentalBudgetVarianceData[] => {
    const budgets = {
        'IT': 150000, 'Marketing': 100000, 'Operations': 200000, 'HR': 75000, 'Finance': 50000, 'R&D': 120000, 'Facilities': 80000, 'Salaries': 300000, 'Legal': 20000, 'Other': 50000
    };
    const departmentalSpend: { [department: string]: number } = {};

    transactions.forEach(tx => {
        let department = 'Other';
        if (tx.merchant.includes('Cloud') || tx.merchant.includes('Software') || tx.merchant.includes('Hardware')) department = 'IT';
        else if (tx.merchant.includes('Marketing') || tx.description.includes('Ad Campaign')) department = 'Marketing';
        else if (tx.merchant.includes('Logistics') || tx.description.includes('Supplies') || tx.description.includes('Office Equipment')) department = 'Operations';
        else if (tx.merchant.includes('Recruitment') || tx.description.includes('Training') || tx.description.includes('Payroll')) department = 'HR';
        else if (tx.description.includes('Audit') || tx.description.includes('Accounting')) department = 'Finance';
        else if (tx.description.includes('Research') || tx.description.includes('Development')) department = 'R&D';
        else if (tx.merchant.includes('Rent') || tx.merchant.includes('Utilities') || tx.merchant.includes('Maintenance')) department = 'Facilities';
        else if (tx.description.includes('Legal Fees') || tx.merchant.includes('Law Firm')) department = 'Legal';
        else if (tx.description.includes('Salaries')) department = 'Salaries';

        departmentalSpend[department] = (departmentalSpend[department] || 0) + tx.amount;
    });

    // Ensure all budget categories are present, even if spend is 0
    return Object.entries(budgets).map(([department, budget]) => {
        const actualSpend = departmentalSpend[department] || 0;
        const variance = actualSpend - budget;
        const variancePct = budget > 0 ? (variance / budget) * 100 : 0;
        return { department, actualSpend, budget, variance, variancePct };
    });
};

export const generatePaymentMethodUsage = (paymentOrders: PaymentOrder[]): PaymentMethodUsageData[] => {
    const methodUsage: { [method: string]: { count: number; totalAmount: number } } = {};
    paymentOrders.forEach(po => {
        const method = po.paymentMethod || 'Bank Transfer'; // Defaulting to Bank Transfer
        if (!methodUsage[method]) {
            methodUsage[method] = { count: 0, totalAmount: 0 };
        }
        methodUsage[method].count++;
        methodUsage[method].totalAmount += po.amount;
    });
    return Object.entries(methodUsage).map(([method, data]) => ({ method, ...data }));
};

export const generateTopExpenses = (transactions: CorporateTransaction[], count: number = 5): VendorSpendData[] => {
    const expenseAgg: { [item: string]: number } = {};
    transactions.forEach(tx => {
        expenseAgg[tx.description] = (expenseAgg[tx.description] || 0) + tx.amount;
    });
    return Object.entries(expenseAgg)
        .map(([item, amount]) => ({ vendor: item, amount })) // Reusing VendorSpendData type for consistency
        .sort((a, b) => b.amount - a.amount)
        .slice(0, count);
};

export const generateOperatingCashFlowTrend = (transactions: CorporateTransaction[], invoices: Invoice[]): CashFlowTrendData[] => {
    const cashFlowByMonth: { [month: string]: { inflow: number; outflow: number } } = {};

    transactions.forEach(tx => {
        const month = new Date(tx.date).toISOString().substring(0, 7);
        if (!cashFlowByMonth[month]) cashFlowByMonth[month] = { inflow: 0, outflow: 0 };
        cashFlowByMonth[month].outflow += tx.amount;
    });

    invoices.filter(inv => inv.status === 'paid').forEach(inv => {
        const paymentDate = inv.paymentDate ? new Date(inv.paymentDate) : new Date(inv.issueDate); // Use paymentDate if available
        const month = paymentDate.toISOString().substring(0, 7);
        if (!cashFlowByMonth[month]) cashFlowByMonth[month] = { inflow: 0, outflow: 0 };
        cashFlowByMonth[month].inflow += inv.amount;
    });

    return Object.entries(cashFlowByMonth)
        .map(([month, data]) => ({
            period: month,
            inflow: data.inflow,
            outflow: data.outflow,
            netCashFlow: data.inflow - data.outflow,
        }))
        .sort((a, b) => a.period.localeCompare(b.period));
};

export const generateFixedVsVariableCosts = (transactions: CorporateTransaction[]): FixedVariableCostData[] => {
    let fixedCost = 0;
    let variableCost = 0;

    transactions.forEach(tx => {
        if (tx.merchant.includes('Rent') || tx.description.includes('Subscription Fee') || tx.description.includes('Insurance Premium')) {
            fixedCost += tx.amount;
        } else if (tx.merchant.includes('Supplies') || tx.merchant.includes('Travel') || tx.description.includes('Consulting Fees') || tx.description.includes('Marketing Campaign')) {
            variableCost += tx.amount;
        } else {
            // Default to variable if not explicitly fixed
            variableCost += tx.amount;
        }
    });

    return [{ type: 'Fixed', amount: fixedCost }, { type: 'Variable', amount: variableCost }];
};

export const generateGeographicSpendDistribution = (transactions: CorporateTransaction[]): GeographicSpendData[] => {
    const geoSpend: { [region: string]: number } = {};
    const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];

    transactions.forEach(tx => {
        const region = regions[Math.floor(Math.random() * regions.length)]; // Simulate region
        geoSpend[region] = (geoSpend[region] || 0) + tx.amount;
    });
    return Object.entries(geoSpend).map(([region, amount]) => ({ region, amount }));
};

export const calculateDSO = (invoices: Invoice[]): number => {
    const paidInvoices = invoices.filter(i => i.status === 'paid' && i.paymentDate && i.issueDate);
    if (paidInvoices.length === 0) return 0;

    let totalDays = 0;
    let totalAmount = 0;
    paidInvoices.forEach(inv => {
        const issueDate = new Date(inv.issueDate).getTime();
        const paymentDate = new Date(inv.paymentDate!).getTime();
        const days = (paymentDate - issueDate) / (1000 * 60 * 60 * 24);
        totalDays += days * inv.amount;
        totalAmount += inv.amount;
    });

    return totalAmount > 0 ? totalDays / totalAmount : 0;
};

export const calculateDPO = (paymentOrders: PaymentOrder[]): number => {
    const paidOrders = paymentOrders.filter(po => po.status === 'paid' && po.paymentDate && po.requestDate);
    if (paidOrders.length === 0) return 0;

    let totalDays = 0;
    let totalAmount = 0;
    paidOrders.forEach(po => {
        const requestDate = new Date(po.requestDate).getTime();
        const paymentDate = new Date(po.paymentDate!).getTime();
        const days = (paymentDate - requestDate) / (1000 * 60 * 60 * 24);
        totalDays += days * po.amount;
        totalAmount += po.amount;
    });

    return totalAmount > 0 ? totalDays / totalAmount : 0;
};

export const calculateCurrentRatio = (invoices: Invoice[], paymentOrders: PaymentOrder[]): number => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((acc, inv) => acc + inv.amount, 0); // Accounts Receivable
    const currentLiabilities = paymentOrders.filter(po => po.status === 'needs_approval' || po.status === 'pending').reduce((acc, po) => acc + po.amount, 0); // Accounts Payable
    if (currentLiabilities === 0) return Infinity;
    return currentAssets / currentLiabilities;
};

export const calculateQuickRatio = (invoices: Invoice[], paymentOrders: PaymentOrder[]): number => {
    const currentAssets = invoices.filter(i => i.status !== 'paid').reduce((acc, inv) => acc + inv.amount, 0); // Accounts Receivable
    // Assuming no inventory data, quick assets = current assets
    const quickAssets = currentAssets;
    const currentLiabilities = paymentOrders.filter(po => po.status === 'needs_approval' || po.status === 'pending').reduce((acc, po) => acc + po.amount, 0); // Accounts Payable
    if (currentLiabilities === 0) return Infinity;
    return quickAssets / currentLiabilities;
};

export const simulateFraudDetectionMetrics = (transactions: CorporateTransaction[], complianceCases: ComplianceCase[]): { highRiskTxnCount: number; flaggedVendors: number; totalFlags: number; foreignCurrencySpend: number; foreignCurrencyTxns: number } => {
    let highRiskTxnCount = 0;
    const flaggedVendors = new Set<string>();
    let totalFlags = 0;
    let foreignCurrencySpend = 0;
    let foreignCurrencyTxns = 0;

    transactions.forEach(tx => {
        // Simple heuristic: large amounts, unusual merchants, or frequent small transactions
        if (tx.amount > 15000 || tx.merchant.includes('DarkWeb') || (tx.amount < 50 && Math.random() < 0.1)) {
            highRiskTxnCount++;
            flaggedVendors.add(tx.merchant);
            totalFlags++;
        }
        // Simulate foreign currency
        if (Math.random() < 0.05) { // 5% of transactions are foreign currency
            foreignCurrencyTxns++;
            foreignCurrencySpend += tx.amount;
        }
    });

    // Also consider compliance cases as flags
    complianceCases.forEach(c => {
        if (c.severity === 'high' || c.description.includes('fraud')) {
            totalFlags++;
            if (c.relatedEntity) flaggedVendors.add(c.relatedEntity);
        }
    });

    return { highRiskTxnCount, flaggedVendors: flaggedVendors.size, totalFlags, foreignCurrencySpend, foreignCurrencyTxns };
};

export const simulateFinancialRatios = (invoices: Invoice[], transactions: CorporateTransaction[]): { grossProfitMargin: number; netProfitMargin: number; roi: number; cashConversionCycle: number; equityRatio: number; debtToEquityRatio: number } => {
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, inv) => acc + inv.amount, 0);
    const totalExpenses = transactions.reduce((acc, tx) => acc + tx.amount, 0);

    // Simulate Cost of Goods Sold (COGS) as a percentage of revenue
    const cogs = totalRevenue * (0.4 + Math.random() * 0.1); // 40-50%
    const grossProfit = totalRevenue - cogs;
    const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Simulate Operating Expenses as a percentage of revenue
    const operatingExpenses = totalRevenue * (0.2 + Math.random() * 0.05); // 20-25%
    const netProfit = grossProfit - operatingExpenses; // Simplified net profit
    const netProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const roi = Math.random() * 20 + 5; // Simulate 5-25% ROI
    const cashConversionCycle = Math.random() * 60 + 30; // Simulate 30-90 days

    // Simulate balance sheet items
    const totalAssets = 5000000 + Math.random() * 1000000;
    const totalEquity = totalAssets * (0.6 + Math.random() * 0.1); // 60-70% equity
    const totalDebt = totalAssets - totalEquity;

    const equityRatio = totalAssets > 0 ? (totalEquity / totalAssets) * 100 : 0;
    const debtToEquityRatio = totalEquity > 0 ? totalDebt / totalEquity : Infinity;

    return { grossProfitMargin, netProfitMargin, roi, cashConversionCycle, equityRatio, debtToEquityRatio };
};

export const simulateBudgetSummary = (transactions: CorporateTransaction[]): { totalBudgetAllocated: number; budgetVarianceTotal: number } => {
    const budgets = generateDepartmentalBudgetVariance(transactions); // Reuse department budgets
    const totalBudgetAllocated = budgets.reduce((acc, b) => acc + b.budget, 0);
    const budgetVarianceTotal = budgets.reduce((acc, b) => acc + b.variance, 0);
    return { totalBudgetAllocated, budgetVarianceTotal };
};

export const simulateDetailedSpendBreakdown = (transactions: CorporateTransaction[]): { saasSpend: number; utilitiesSpend: number; marketingSpend: number; rdSpend: number; employeeReimbursementSpend: number; itInfrastructureSpend: number; legalFees: number; consultingFees: number; officeSuppliesSpend: number; travelSpend: number; entertainmentSpend: number } => {
    let saasSpend = 0;
    let utilitiesSpend = 0;
    let marketingSpend = 0;
    let rdSpend = 0;
    let employeeReimbursementSpend = 0;
    let itInfrastructureSpend = 0;
    let legalFees = 0;
    let consultingFees = 0;
    let officeSuppliesSpend = 0;
    let travelSpend = 0;
    let entertainmentSpend = 0;

    transactions.forEach(tx => {
        if (tx.merchant.includes('Software') || tx.merchant.includes('Cloud')) saasSpend += tx.amount;
        else if (tx.merchant.includes('Power') || tx.merchant.includes('Water') || tx.merchant.includes('Gas') || tx.description.includes('Utility')) utilitiesSpend += tx.amount;
        else if (tx.merchant.includes('Marketing') || tx.description.includes('Ad Campaign')) marketingSpend += tx.amount;
        else if (tx.description.includes('Research') || tx.description.includes('Development')) rdSpend += tx.amount;
        else if (tx.description.includes('Reimbursement') || tx.description.includes('Employee Expense')) employeeReimbursementSpend += tx.amount;
        else if (tx.description.includes('Server') || tx.description.includes('Network') || tx.merchant.includes('Hardware')) itInfrastructureSpend += tx.amount;
        else if (tx.description.includes('Legal Fees') || tx.merchant.includes('Law Firm')) legalFees += tx.amount;
        else if (tx.description.includes('Consulting')) consultingFees += tx.amount;
        else if (tx.description.includes('Office Supplies') || tx.merchant.includes('Staples')) officeSuppliesSpend += tx.amount;
        else if (tx.description.includes('Flight') || tx.description.includes('Hotel') || tx.description.includes('Business Trip')) travelSpend += tx.amount;
        else if (tx.description.includes('Dinner') || tx.description.includes('Event')) entertainmentSpend += tx.amount;
    });

    return { saasSpend, utilitiesSpend, marketingSpend, rdSpend, employeeReimbursementSpend, itInfrastructureSpend, legalFees, consultingFees, officeSuppliesSpend, travelSpend, entertainmentSpend };
};

export const simulateTransactionAnalysis = (transactions: CorporateTransaction[]): { totalRefunds: number; totalDiscounts: number; largeTransactions: number; smallTransactions: number; cardTxns: number; bankTransferTxns: number; avgTxnAmount: number } => {
    let totalRefunds = 0;
    let totalDiscounts = 0;
    let largeTransactions = 0; // > $5000
    let smallTransactions = 0; // < $100
    let cardTxns = 0;
    let bankTransferTxns = 0;
    let totalAmount = 0;

    transactions.forEach(tx => {
        // Simulate refunds/discounts
        if (Math.random() < 0.02) totalRefunds += tx.amount * (0.1 + Math.random() * 0.5); // 2% chance of refund
        if (Math.random() < 0.05) totalDiscounts += tx.amount * (0.01 + Math.random() * 0.1); // 5% chance of discount

        if (tx.amount > 5000) largeTransactions++;
        if (tx.amount < 100) smallTransactions++;

        // Simulate payment method
        if (Math.random() < 0.6) cardTxns++; else bankTransferTxns++; // Simple split
        totalAmount += tx.amount;
    });

    const avgTxnAmount = transactions.length > 0 ? totalAmount / transactions.length : 0;

    return { totalRefunds, totalDiscounts, largeTransactions, smallTransactions, cardTxns, bankTransferTxns, avgTxnAmount };
};

export const simulateComplianceRisks = (complianceCases: ComplianceCase[]): string[] => {
    const riskCategories = new Set<string>();
    complianceCases.forEach(c => riskCategories.add(c.type));
    // Also add some simulated common risks if not present
    if (!riskCategories.has('AML')) riskCategories.add('AML');
    if (!riskCategories.has('GDPR')) riskCategories.add('GDPR');
    if (!riskCategories.has('Sanctions')) riskCategories.add('Sanctions');
    if (!riskCategories.has('Data Privacy')) riskCategories.add('Data Privacy');
    if (!riskCategories.has('Financial Reporting')) riskCategories.add('Financial Reporting');
    return Array.from(riskCategories).slice(0, 3); // Top 3 risks
};

export const simulateAutomatedApprovals = (paymentOrders: PaymentOrder[]): number => {
    const totalApproved = paymentOrders.filter(po => po.status === 'approved').length;
    // Simulate that a percentage were automated
    const automatedPct = 0.6 + Math.random() * 0.2; // 60-80% automated
    return totalApproved > 0 ? (totalApproved * automatedPct) : 0;
};

// NEW: Simulate Estimated Tax Liabilities
export const simulateEstimatedTaxLiabilities = (invoices: Invoice[], transactions: CorporateTransaction[]): TaxLiabilityData => {
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, inv) => acc + inv.amount, 0);
    const totalExpenses = transactions.reduce((acc, tx) => acc + tx.amount, 0);

    const vatRate = 0.20; // 20% VAT
    const payrollTaxRate = 0.08; // 8% payroll tax for a portion of expenses
    const corporateTaxRate = 0.25; // 25% corporate tax

    // Simplified VAT calculation: assuming all revenue has VAT, and some expenses have input VAT
    const estimatedOutputVAT = totalRevenue * vatRate;
    const estimatedInputVAT = totalExpenses * vatRate * 0.7; // Assume 70% of expenses are VAT-able
    const vatEstimate = estimatedOutputVAT - estimatedInputVAT;

    // Simulate payroll expenses as a portion of total expenses
    const payrollExpenses = totalExpenses * (0.3 + Math.random() * 0.1); // 30-40% of expenses are payroll
    const payrollTaxEstimate = payrollExpenses * payrollTaxRate;

    // Corporate tax based on simplified net profit (before tax)
    const netProfitBeforeTax = totalRevenue - totalExpenses - payrollExpenses; // Very simplified
    const corporateTaxEstimate = netProfitBeforeTax > 0 ? netProfitBeforeTax * corporateTaxRate : 0;

    return { vatEstimate: Math.max(0, vatEstimate), payrollTaxEstimate, corporateTaxEstimate };
};

// NEW: Generate Budget Allocation Summary
export const generateBudgetAllocationSummary = (transactions: CorporateTransaction[]): BudgetAllocationSummaryData[] => {
    const departmentalVariance = generateDepartmentalBudgetVariance(transactions);
    return departmentalVariance.map(item => ({
        department: item.department,
        budget: item.budget,
        actualSpend: item.actualSpend,
        variance: item.variance,
    }));
};

// NEW: Simulate Audit Trail Metrics
export const simulateAuditTrailMetrics = (): AuditTrailData[] => {
    const data: AuditTrailData[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) { // Last 7 days
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            failedLogins: Math.floor(Math.random() * 10) + 1,
            suspiciousActivities: Math.floor(Math.random() * 5),
            dataAccessViolations: Math.floor(Math.random() * 3),
        });
    }
    return data;
};

// NEW: Generate Employee Expense Metrics
export const generateEmployeeExpenseMetrics = (transactions: CorporateTransaction[]): EmployeeExpenseMetrics => {
    const expenseCategories: { [key: string]: number } = {};
    const monthlyTrend: { [month: string]: number } = {};
    let totalExpenses = 0;
    let expenseCount = 0;

    transactions.forEach(tx => {
        // Simulate employee expense categories
        let category = 'Other';
        if (tx.description.includes('Travel') || tx.merchant.includes('Airline') || tx.merchant.includes('Hotel')) category = 'Travel';
        else if (tx.description.includes('Meal') || tx.merchant.includes('Restaurant') || tx.description.includes('Entertainment')) category = 'Meals & Entertainment';
        else if (tx.description.includes('Office Supply') || tx.merchant.includes('Staples') || tx.merchant.includes('Amazon')) category = 'Office Supplies';
        else if (tx.description.includes('Software License') || tx.merchant.includes('Subscription') || tx.merchant.includes('Cloud')) category = 'Software & Subscriptions';
        else if (tx.description.includes('Training') || tx.merchant.includes('Course') || tx.description.includes('Certification')) category = 'Professional Development';
        else if (tx.description.includes('Home Office')) category = 'Home Office Setup';
        else if (tx.description.includes('Commute') || tx.merchant.includes('Transit')) category = 'Commuting';

        // Only count employee-like expenses, not all corporate transactions
        if (['Travel', 'Meals & Entertainment', 'Office Supplies', 'Software & Subscriptions', 'Professional Development', 'Home Office Setup', 'Commuting'].includes(category)) {
            expenseCategories[category] = (expenseCategories[category] || 0) + tx.amount;
            totalExpenses += tx.amount;
            expenseCount++;

            const month = new Date(tx.date).toISOString().substring(0, 7);
            monthlyTrend[month] = (monthlyTrend[month] || 0) + tx.amount;
        }
    });

    const topCategories = Object.entries(expenseCategories)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    const sortedMonthlyTrend = Object.entries(monthlyTrend)
        .map(([month, amount]) => ({ month, amount }))
        .sort((a, b) => a.month.localeCompare(b.month));

    return {
        totalExpenses,
        averageExpense: expenseCount > 0 ? totalExpenses / expenseCount : 0,
        topCategories,
        monthlyTrend: sortedMonthlyTrend,
    };
};

// NEW: Simulate Contract Compliance Metrics
export const simulateContractComplianceMetrics = (): ContractStatusData => {
    const totalContracts = 500 + Math.floor(Math.random() * 200);
    const expiringSoon = Math.floor(totalContracts * (0.05 + Math.random() * 0.05)); // 5-10% expiring in next 90 days
    const nonCompliant = Math.floor(totalContracts * (0.01 + Math.random() * 0.03)); // 1-3% non-compliant
    const autoRenewals = Math.floor(totalContracts * (0.3 + Math.random() * 0.1)); // 30-40% auto-renewing
    return { totalContracts, expiringSoon, nonCompliant, autoRenewals };
};


// --- End of New Exported Types and Data Generation Functions ---


interface CorporateDashboardProps {
    setActiveView: (view: View) => void;
}

const CorporateCommandView: React.FC<CorporateDashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [aiInsight, setAiInsight] = useState('');
    const [isInsightLoading, setIsInsightLoading] = useState(false);

    if (!context) throw new Error("CorporateCommandView must be within a DataProvider.");
    
    const { paymentOrders, invoices, complianceCases, corporateTransactions } = context;

    // --- Original Summary Stats (unchanged) ---
    const summaryStats = {
        pendingApprovals: paymentOrders.filter(p => p.status === 'needs_approval').length,
        overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
        openCases: complianceCases.filter(c => c.status === 'open').length,
        totalOutflow: corporateTransactions.reduce((acc, tx) => acc + tx.amount, 0)
    };
    
    // --- Original Spending by Category (unchanged, but can be generated by new function too for consistency) ---
    const spendingByCategoryLegacy = corporateTransactions.reduce((acc, tx) => {
        const category = tx.merchant.includes('Steakhouse') || tx.merchant.includes('Lunch') ? 'T&E' :
                         tx.merchant.includes('Cloud') || tx.merchant.includes('Software') ? 'Software' :
                         'Other';
        if (!acc[category]) acc[category] = 0;
        acc[category] += tx.amount;
        return acc;
    }, {} as { [key: string]: number });
    
    const chartDataLegacy = Object.entries(spendingByCategoryLegacy).map(([name, value]) => ({ name, value })); // Kept for original chart

    // --- NEW KPI & Chart Data Calculations ---

    // Finance & Liquidity
    const totalInflow = invoices.filter(i => i.status === 'paid').reduce((acc, inv) => acc + inv.amount, 0);
    const avgInvoiceValue = invoices.length > 0 ? invoices.reduce((acc, inv) => acc + inv.amount, 0) / invoices.length : 0;
    const { grossProfitMargin, netProfitMargin, roi, cashConversionCycle, equityRatio, debtToEquityRatio } = simulateFinancialRatios(invoices, corporateTransactions);
    const dso = calculateDSO(invoices);
    const dpo = calculateDPO(paymentOrders);
    const currentRatio = calculateCurrentRatio(invoices, paymentOrders);
    const quickRatio = calculateQuickRatio(invoices, paymentOrders);
    const { vatEstimate, payrollTaxEstimate, corporateTaxEstimate } = simulateEstimatedTaxLiabilities(invoices, corporateTransactions);
    const totalPaymentsProcessed = paymentOrders.length;
    const totalInvoicesIssued = invoices.length;
    const totalValueOfOverdueInvoices = invoices.filter(i => i.status === 'overdue').reduce((acc, inv) => acc + inv.amount, 0);
    const totalValueOfOpenCases = complianceCases.filter(c => c.status === 'open').reduce((acc, c) => acc + (c.potentialFine || 0), 0); // Assuming potentialFine exists or is 0
    const { totalBudgetAllocated, budgetVarianceTotal } = simulateBudgetSummary(corporateTransactions);

    // Operational Efficiency
    const { avgTimeHours: avgApprovalTimeHours, overThresholdCount: paymentApprovalOverdue, throughputLast30Days } = generatePaymentApprovalMetrics(paymentOrders);
    const highValuePaymentOrders = paymentOrders.filter(po => po.amount > 10000).length;
    const paidPayments = paymentOrders.filter(po => po.status === 'paid');
    const onTimePaymentsPct = paidPayments.length > 0 ? paidPayments.filter(po => po.dueDate && po.paymentDate && new Date(po.paymentDate) <= new Date(po.dueDate)).length / paidPayments.length * 100 : 0;
    const { saasSpend, utilitiesSpend, marketingSpend, rdSpend, employeeReimbursementSpend, itInfrastructureSpend, legalFees, consultingFees, officeSuppliesSpend, travelSpend, entertainmentSpend } = simulateDetailedSpendBreakdown(corporateTransactions);
    const { totalRefunds, totalDiscounts, largeTransactions, smallTransactions, cardTxns, bankTransferTxns, avgTxnAmount } = simulateTransactionAnalysis(corporateTransactions);
    const numUniquePaymentMethods = new Set(paymentOrders.map(po => po.paymentMethod)).size;
    const numUniqueVendors = new Set(corporateTransactions.map(tx => tx.merchant)).size;
    const employeeExpenseMetrics = generateEmployeeExpenseMetrics(corporateTransactions);

    // Compliance & Risk
    const totalComplianceFinesSimulated = complianceCases.reduce((acc, c) => acc + (c.potentialFine || 0), 0);
    const { avgTimeDays: avgCaseResolutionTimeDays, overThresholdCount: caseResolutionOverdue, criticalCases } = generateComplianceCaseResolutionMetrics(complianceCases);
    const { highRiskTxnCount, flaggedVendors, foreignCurrencySpend, foreignCurrencyTxns, totalFlags } = simulateFraudDetectionMetrics(corporateTransactions, complianceCases);
    const top3ComplianceRisks = simulateComplianceRisks(complianceCases);
    const totalApprovedPaymentsForAutomation = paymentOrders.filter(po => po.status === 'approved').length;
    const automatedApprovalsPct = totalApprovedPaymentsForAutomation > 0 ? (simulateAutomatedApprovals(paymentOrders) / totalApprovedPaymentsForAutomation) * 100 : 0;
    const auditTrailData = simulateAuditTrailMetrics();
    const contractComplianceMetrics = simulateContractComplianceMetrics();

    // Summing up audit trail metrics for overview
    const auditFailedLoginsTotal = auditTrailData.reduce((acc, d) => acc + d.failedLogins, 0);
    const auditSuspiciousActivitiesTotal = auditTrailData.reduce((acc, d) => acc + d.suspiciousActivities, 0);
    const auditDataAccessViolationsTotal = auditTrailData.reduce((acc, d) => acc + d.dataAccessViolations, 0);


    // Chart Data
    const dailyTransactionVolumesData = generateDailyTransactionVolumes(corporateTransactions);
    const monthlySpendByCategoryData = generateMonthlySpendByCategory(corporateTransactions);
    const invoiceAgingData = generateInvoiceAgingBuckets(invoices);
    const vendorSpendData = generateVendorSpendDistribution(corporateTransactions).slice(0, 7); // Top 7 vendors
    const departmentalBudgetVarianceData = generateDepartmentalBudgetVariance(corporateTransactions);
    const paymentMethodUsageData = generatePaymentMethodUsage(paymentOrders);
    const topExpensesData = generateTopExpenses(corporateTransactions, 7); // Top 7 expenses by description
    const operatingCashFlowTrendData = generateOperatingCashFlowTrend(corporateTransactions, invoices);
    const fixedVsVariableCostsData = generateFixedVsVariableCosts(corporateTransactions);
    const geographicSpendData = generateGeographicSpendDistribution(corporateTransactions);
    const budgetAllocationSummaryData = generateBudgetAllocationSummary(corporateTransactions);
    const employeeExpenseCategoriesChartData = employeeExpenseMetrics.topCategories;


    // --- AI Insight Enhancement ---
    useEffect(() => {
        const generateInsight = async () => {
            setIsInsightLoading(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const dataSummary = `
                    Pending Approvals: ${summaryStats.pendingApprovals}, Overdue Invoices: ${summaryStats.overdueInvoices}, Open Compliance Cases: ${summaryStats.openCases}.
                    Total Outflow: $${summaryStats.totalOutflow.toFixed(2)}, Total Inflow: $${totalInflow.toFixed(2)}.
                    Avg. Invoice Value: $${avgInvoiceValue.toFixed(2)}, DSO: ${dso.toFixed(1)} days, DPO: ${dpo.toFixed(1)} days.
                    Current Ratio: ${currentRatio.toFixed(2)}, Quick Ratio: ${quickRatio.toFixed(2)}.
                    Avg. Approval Time: ${avgApprovalTimeHours.toFixed(1)} hrs, Avg. Case Resolution: ${avgCaseResolutionTimeDays.toFixed(1)} days.
                    High Risk Transactions: ${highRiskTxnCount}, Flagged Vendors: ${flaggedVendors}.
                    Recent spending is focused on: ${chartDataLegacy.map(d=>d.name).join(', ')}.
                    Top expenses include: ${topExpensesData.map(e => e.vendor).join(', ')}.
                    Departments with significant variance: ${departmentalBudgetVarianceData.filter(d => Math.abs(d.variancePct) > 10).map(d => `${d.department} (${d.variancePct.toFixed(0)}%)`).join(', ')}.
                    Compliance risks: ${top3ComplianceRisks.join(', ')}.
                    Audit Failed Logins (7d): ${auditFailedLoginsTotal}, Suspicious Activities (7d): ${auditSuspiciousActivitiesTotal}.
                    Expiring Contracts: ${contractComplianceMetrics.expiringSoon}, Non-Compliant Contracts: ${contractComplianceMetrics.nonCompliant}.
                    Automated Approvals: ${automatedApprovalsPct.toFixed(1)}%.
                `;
                const prompt = `You are a corporate finance AI controller. Based on the following summary, provide a single, concise (1-2 sentences) strategic recommendation or observation for the finance manager. Focus on key actionable insights. Summary:\n${dataSummary}`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setAiInsight(response.text);
            } catch (error) {
                console.error("Failed to generate corporate insight:", error);
                setAiInsight("An error occurred while analyzing corporate data. Please check API key or network.");
            } finally {
                setIsInsightLoading(false);
            }
        };
        generateInsight();
    }, [
        summaryStats.pendingApprovals, summaryStats.overdueInvoices, summaryStats.openCases, summaryStats.totalOutflow,
        totalInflow, avgInvoiceValue, dso, dpo, currentRatio, quickRatio, avgApprovalTimeHours, avgCaseResolutionTimeDays,
        highRiskTxnCount, flaggedVendors, chartDataLegacy, topExpensesData, departmentalBudgetVarianceData, top3ComplianceRisks,
        auditFailedLoginsTotal, auditSuspiciousActivitiesTotal, contractComplianceMetrics.expiringSoon, contractComplianceMetrics.nonCompliant,
        automatedApprovalsPct
    ]);

    const StatCard: React.FC<{ title: string; value: string | number; view?: View; formatter?: (val: number | string) => string; className?: string }> = ({ title, value, view, formatter, className }) => (
        <Card variant={view ? "interactive" : "default"} onClick={view ? () => setActiveView(view) : undefined} className={`text-center ${className || ''}`}>
            <p className="text-3xl font-bold text-white">{formatter ? formatter(value) : value}</p>
            <p className="text-sm text-gray-400 mt-1">{title}</p>
        </Card>
    );

    const ChartWrapperCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
        <Card title={title} className={`p-4 ${className || ''}`}>
            <div className="h-56 w-full"> {/* Increased height for better visualization */}
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </Card>
    );

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000', '#00FFFF'];

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-extrabold text-white tracking-wider">Corporate Command Center</h2>

            {/* AI Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="AI Strategic Insight" className="lg:col-span-1 bg-gray-800 border border-gray-700">
                     {isInsightLoading ? <p className="text-gray-400 text-sm animate-pulse">Analyzing real-time data for strategic insights...</p> : 
                         <p className="text-gray-200 text-base italic leading-relaxed">"{aiInsight}"</p>
                     }
                </Card>
                <ChartWrapperCard title="Spending by Major Category" className="lg:col-span-2">
                    <BarChart data={Object.entries(monthlySpendByCategoryData.reduce((acc, curr) => {
                        Object.entries(curr).forEach(([key, val]) => {
                            if (key !== 'month') acc[key] = (acc[key] || 0) + (val as number);
                        });
                        return acc;
                    }, {} as { [key: string]: number })).map(([name, value]) => ({ name, value }))} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={90} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={25} />
                    </BarChart>
                </ChartWrapperCard>
            </div>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Financial Health & Liquidity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <StatCard title="Pending Approvals" value={summaryStats.pendingApprovals} view={View.PaymentOrders} />
                <StatCard title="Overdue Invoices" value={summaryStats.overdueInvoices} view={View.Invoices} />
                <StatCard title="Total Outflow (7d)" value={summaryStats.totalOutflow} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Total Inflow (Paid)" value={totalInflow} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Avg. Invoice Value" value={avgInvoiceValue} formatter={(v: number) => `$${v.toFixed(2)}`} />
                <StatCard title="Days Sales Outstanding" value={dso} formatter={(v: number) => `${v.toFixed(1)} days`} />
                <StatCard title="Days Payable Outstanding" value={dpo} formatter={(v: number) => `${v.toFixed(1)} days`} />
                <StatCard title="Current Ratio" value={currentRatio} formatter={(v: number) => v.toFixed(2)} />
                <StatCard title="Quick Ratio" value={quickRatio} formatter={(v: number) => v.toFixed(2)} />
                <StatCard title="Gross Profit Margin" value={grossProfitMargin} formatter={(v: number) => `${v.toFixed(1)}%`} />
                <StatCard title="Net Profit Margin" value={netProfitMargin} formatter={(v: number) => `${v.toFixed(1)}%`} />
                <StatCard title="Estimated VAT Liability" value={vatEstimate} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Estimated Payroll Tax" value={payrollTaxEstimate} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Estimated Corporate Tax" value={corporateTaxEstimate} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Budget Variance (Total)" value={budgetVarianceTotal} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} className={budgetVarianceTotal > 0 ? "bg-red-700/30 border-red-600" : "bg-green-700/30 border-green-600"} />
                <StatCard title="Total Budget Allocated" value={totalBudgetAllocated} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Cash Conversion Cycle" value={cashConversionCycle} formatter={(v: number) => `${v.toFixed(1)} days`} />
                <StatCard title="Equity Ratio" value={equityRatio} formatter={(v: number) => `${v.toFixed(1)}%`} />
                <StatCard title="Debt To Equity Ratio" value={debtToEquityRatio} formatter={(v: number) => v.toFixed(2)} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <ChartWrapperCard title="Operating Cash Flow Trend">
                    <BarChart data={operatingCashFlowTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="period" stroke="#9ca3af" fontSize={12} />
                        {/* FIX: Changed `formatter` to `tickFormatter` */}
                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                        <Bar dataKey="inflow" fill="#059669" name="Cash Inflow" />
                        <Bar dataKey="outflow" fill="#ef4444" name="Cash Outflow" />
                        <Bar dataKey="netCashFlow" fill="#10b981" name="Net Cash Flow" />
                    </BarChart>
                </ChartWrapperCard>
                <ChartWrapperCard title="Invoice Aging Buckets (Amount)">
                    <BarChart data={invoiceAgingData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="bucket" stroke="#9ca3af" fontSize={12} width={90} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ChartWrapperCard>
                 <ChartWrapperCard title="Fixed vs Variable Costs">
                    <BarChart data={fixedVsVariableCostsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="type" stroke="#9ca3af" fontSize={12} />
                        {/* FIX: Changed `formatter` to `tickFormatter` */}
                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#3b82f6" />
                    </BarChart>
                </ChartWrapperCard>
            </div>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Operational Efficiency & Spend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <StatCard title="Payment Orders Processed" value={totalPaymentsProcessed} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Invoices Issued" value={totalInvoicesIssued} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Avg. Approval Time" value={avgApprovalTimeHours} formatter={(v: number) => `${v.toFixed(1)} hrs`} className={avgApprovalTimeHours > 48 ? "bg-red-700/30 border-red-600" : ""} />
                <StatCard title="Approval Throughput (30d)" value={throughputLast30Days} formatter={(v: number) => `${v} orders`} />
                <StatCard title="High-Value POs (>$10k)" value={highValuePaymentOrders} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="On-Time Payments %" value={onTimePaymentsPct} formatter={(v: number) => `${v.toFixed(1)}%`} className={onTimePaymentsPct < 90 ? "bg-yellow-700/30 border-yellow-600" : ""} />
                <StatCard title="Avg. Transaction Amount" value={avgTxnAmount} formatter={(v: number) => `$${v.toFixed(2)}`} />
                <StatCard title="Large Transactions (>$5k)" value={largeTransactions} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Small Transactions (<$100)" value={smallTransactions} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Transactions by Card" value={cardTxns} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Transactions by Bank Transfer" value={bankTransferTxns} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Unique Payment Methods" value={numUniquePaymentMethods} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Unique Vendors" value={numUniqueVendors} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Total Employee Expenses" value={employeeExpenseMetrics.totalExpenses} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Avg. Employee Expense" value={employeeExpenseMetrics.averageExpense} formatter={(v: number) => `$${v.toFixed(2)}`} />
                <StatCard title="SAAS Spend" value={saasSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Utilities Spend" value={utilitiesSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Marketing Spend" value={marketingSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="R&D Spend" value={rdSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Employee Reimbursement" value={employeeReimbursementSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="IT Infrastructure Spend" value={itInfrastructureSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Legal Fees" value={legalFees} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Consulting Fees" value={consultingFees} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Office Supplies Spend" value={officeSuppliesSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Travel Spend" value={travelSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Entertainment Spend" value={entertainmentSpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Total Refunds" value={totalRefunds} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Total Discounts" value={totalDiscounts} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <ChartWrapperCard title="Daily Transaction Volume (Amount)">
                    <BarChart data={dailyTransactionVolumesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        {/* FIX: Changed `formatter` to `tickFormatter` */}
                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#fcd34d" />
                    </BarChart>
                </ChartWrapperCard>
                <ChartWrapperCard title="Top 7 Vendors by Spend">
                    <BarChart data={vendorSpendData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="vendor" stroke="#9ca3af" fontSize={12} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#60a5fa" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ChartWrapperCard>
                <ChartWrapperCard title="Departmental Budget Variance">
                    <BarChart data={departmentalBudgetVarianceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="department" stroke="#9ca3af" fontSize={12} />
                        {/* FIX: Changed `formatter` to `tickFormatter` */}
                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                        <Bar dataKey="actualSpend" fill="#059669" name="Actual Spend" />
                        <Bar dataKey="budget" fill="#ef4444" name="Budget" />
                    </BarChart>
                </ChartWrapperCard>
                 <ChartWrapperCard title="Payment Method Usage (Amount)">
                    <BarChart data={paymentMethodUsageData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="method" stroke="#9ca3af" fontSize={12} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Bar dataKey="totalAmount" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ChartWrapperCard>
                <ChartWrapperCard title="Top 7 Expenses by Description">
                    <BarChart data={topExpensesData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="vendor" stroke="#9ca3af" fontSize={12} width={100} /> {/* Reusing vendor key */}
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#d946ef" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ChartWrapperCard>
                <ChartWrapperCard title="Geographic Spend Distribution">
                    <BarChart data={geographicSpendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="region" stroke="#9ca3af" fontSize={12} />
                        {/* FIX: Changed `formatter` to `tickFormatter` */}
                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#ec4899" />
                    </BarChart>
                </ChartWrapperCard>
            </div>


            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Compliance & Risk Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <StatCard title="Open Compliance Cases" value={summaryStats.openCases} view={View.Compliance} />
                <StatCard title="Critical Cases (Open)" value={criticalCases} formatter={(v: number) => v.toLocaleString()} className={criticalCases > 0 ? "bg-red-700/30 border-red-600" : ""} />
                <StatCard title="Avg. Case Resolution Time" value={avgCaseResolutionTimeDays} formatter={(v: number) => `${v.toFixed(1)} days`} className={avgCaseResolutionTimeDays > 30 ? "bg-yellow-700/30 border-yellow-600" : ""} />
                <StatCard title="Total Compliance Fines (Est.)" value={totalComplianceFinesSimulated} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="High-Risk Transactions" value={highRiskTxnCount} formatter={(v: number) => v.toLocaleString()} className={highRiskTxnCount > 0 ? "bg-red-700/30 border-red-600" : ""} />
                <StatCard title="Flagged Vendors" value={flaggedVendors} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Foreign Currency Spend" value={foreignCurrencySpend} formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <StatCard title="Foreign Currency Transactions" value={foreignCurrencyTxns} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Automated Approvals %" value={automatedApprovalsPct} formatter={(v: number) => `${v.toFixed(1)}%`} />
                <StatCard title="Total Contracts" value={contractComplianceMetrics.totalContracts} formatter={(v: number) => v.toLocaleString()} />
                <StatCard title="Expiring Contracts (90d)" value={contractComplianceMetrics.expiringSoon} formatter={(v: number) => v.toLocaleString()} className={contractComplianceMetrics.expiringSoon > 0 ? "bg-yellow-700/30 border-yellow-600" : ""} />
                <StatCard title="Non-Compliant Contracts" value={contractComplianceMetrics.nonCompliant} formatter={(v: number) => v.toLocaleString()} className={contractComplianceMetrics.nonCompliant > 0 ? "bg-red-700/30 border-red-600" : ""} />
                <StatCard title="Audit Failed Logins (7d)" value={auditFailedLoginsTotal} formatter={(v: number) => v.toLocaleString()} className={auditFailedLoginsTotal > 5 ? "bg-yellow-700/30 border-yellow-600" : ""} />
                <StatCard title="Audit Suspicious Activity (7d)" value={auditSuspiciousActivitiesTotal} formatter={(v: number) => v.toLocaleString()} className={auditSuspiciousActivitiesTotal > 0 ? "bg-red-700/30 border-red-600" : ""} />
                <StatCard title="Audit Data Access Violations (7d)" value={auditDataAccessViolationsTotal} formatter={(v: number) => v.toLocaleString()} className={auditDataAccessViolationsTotal > 0 ? "bg-red-700/30 border-red-600" : ""} />
                <Card title="Top 3 Compliance Risks">
                     <ul className="list-disc pl-5 text-gray-300 text-sm">
                        {top3ComplianceRisks.map((risk, idx) => <li key={idx}>{risk}</li>)}
                     </ul>
                </Card>
            </div>
            {/* Added more charts for visual diversity using BarChart and PieChart */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapperCard title="Budget vs. Actual Spend by Department">
                    <BarChart data={budgetAllocationSummaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="department" stroke="#9ca3af" fontSize={12} />
                        {/* FIX: Changed `formatter` to `tickFormatter` */}
                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                        <Bar dataKey="budget" fill="#fde047" name="Allocated Budget" />
                        <Bar dataKey="actualSpend" fill="#22d3ee" name="Actual Spend" />
                    </BarChart>
                </ChartWrapperCard>
                <ChartWrapperCard title="Monthly Spend Trend by Category (Last 6 Months)">
                    <BarChart data={monthlySpendByCategoryData.slice(-6)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                        {/* FIX: Changed `formatter` to `tickFormatter` */}
                        <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                        {/* Stacked bars for category breakdown */}
                        <Bar dataKey="T_E" stackId="a" fill="#0ea5e9" name="T&E" />
                        <Bar dataKey="Software" stackId="a" fill="#8b5cf6" name="Software" />
                        <Bar dataKey="Marketing" stackId="a" fill="#ec4899" name="Marketing" />
                        <Bar dataKey="Facilities" stackId="a" fill="#f59e0b" name="Facilities" />
                        <Bar dataKey="Salaries" stackId="a" fill="#10b981" name="Salaries" />
                        <Bar dataKey="Other" stackId="a" fill="#9ca3af" name="Other" />
                    </BarChart>
                </ChartWrapperCard>
                <ChartWrapperCard title="Employee Expense Breakdown by Category">
                    <PieChart>
                        <Pie
                            data={employeeExpenseCategoriesChartData}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            // FIX: Use `entry.name` and `entry.value` for label properties
                            label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                        >
                            {employeeExpenseCategoriesChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(v: number) => `$${v.toFixed(2)}`} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                    </PieChart>
                </ChartWrapperCard>
                <ChartWrapperCard title="Audit Trail - Daily Events (Last 7 Days)">
                    <BarChart data={auditTrailData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                        <Bar dataKey="failedLogins" fill="#f43f5e" name="Failed Logins" />
                        <Bar dataKey="suspiciousActivities" fill="#facc15" name="Suspicious Activities" />
                        <Bar dataKey="dataAccessViolations" fill="#ef4444" name="Data Access Violations" />
                    </BarChart>
                </ChartWrapperCard>
            </div>
        </div>
    );
};

export default CorporateCommandView;
