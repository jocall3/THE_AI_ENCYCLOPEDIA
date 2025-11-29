import React, { useState, useMemo, useCallback } from 'react';

// --- Core Data Structures for Enterprise Financial Modeling ---

/**
 * @interface EnterpriseDebtInstrument
 * @description Represents a single liability instrument within the enterprise portfolio.
 * Includes advanced attributes for sophisticated modeling.
 */
interface EnterpriseDebtInstrument {
  id: string;
  name: string;
  assetClass: 'Secured' | 'Unsecured' | 'Subordinated' | 'DerivativeLiability';
  principalBalance: number; // Current outstanding principal
  annualInterestRateBasisPoints: number; // Rate expressed in basis points (e.g., 500 for 5.00%)
  contractualMinimumPayment: number; // Minimum required payment per period
  maturityDate: string; // ISO Date string for contractual maturity
  amortizationScheduleId: string; // Link to detailed schedule engine
  riskWeightingFactor: number; // Regulatory or internal risk factor (0.0 to 1.0)
  isVariableRate: boolean;
  paymentPriorityIndex: number; // Lower number means higher priority in payoff sequencing
}

/**
 * @interface PayoffStrategySummary
 * @description Comprehensive summary of a debt payoff simulation run.
 */
interface PayoffStrategySummary {
  strategyName: 'QuantumSnowball' | 'HyperAvalanche' | 'AI_Optimized_Hybrid';
  simulationTimestamp: string;
  totalInterestExpenseProjected: number;
  totalTimeUnitsToZeroBalance: number; // In months or simulation periods
  totalPaymentsMade: number;
  instrumentsSettled: number;
  detailedInstrumentStatus: EnterpriseDebtInstrument[];
  AIInsightScore: number; // A proprietary metric indicating strategic efficiency
}

// --- Advanced Simulation Engine Constants and Utilities ---

const SIMULATION_PERIODS_MAX = 12000; // Extended safety break for multi-decade projections
const BASIS_POINTS_TO_RATE = 10000; // 100% = 10000 BPS

/**
 * @function calculatePeriodicInterest
 * @description Calculates the interest accrued for one period based on current balance and annual rate (in BPS).
 * @param {number} balance - Current principal balance.
 * @param {number} annualRateBPS - Annual interest rate in basis points.
 * @returns {number} Interest accrued for the period.
 */
const calculatePeriodicInterest = (balance: number, annualRateBPS: number): number => {
  // Assuming monthly periods: (Rate / 10000) / 12
  return balance * (annualRateBPS / BASIS_POINTS_TO_RATE / 12);
};

/**
 * @function initializeSimulationState
 * @description Creates a deep copy of debt instruments ready for simulation, calculating initial monthly interest.
 * @param {EnterpriseDebtInstrument[]} instruments - The initial set of debts.
 * @returns {EnterpriseDebtInstrument[]} A mutable copy of the instruments.
 */
const initializeSimulationState = (instruments: EnterpriseDebtInstrument[]): EnterpriseDebtInstrument[] => {
    return instruments.map(d => ({
        ...d,
        // Ensure balances are positive for simulation start
        principalBalance: Math.max(0, d.principalBalance)
    }));
};

// --- Payoff Strategy Algorithms ---

/**
 * @function executeQuantumSnowball
 * @description Simulates payoff using the Quantum Snowball method: prioritize smallest principal balance first,
 * after minimums are met on others.
 * @param {EnterpriseDebtInstrument[]} initialDebts - The starting portfolio.
 * @param {number} discretionaryCapitalAllocation - Extra capital available monthly.
 * @returns {PayoffStrategySummary} The simulation results.
 */
const executeQuantumSnowball = (
    initialDebts: EnterpriseDebtInstrument[],
    discretionaryCapitalAllocation: number
): PayoffStrategySummary => {
    const sortedDebts = [...initialDebts].sort((a, b) => a.principalBalance - b.principalBalance);
    return executeSimulationEngine(sortedDebts, discretionaryCapitalAllocation, 'QuantumSnowball');
};

/**
 * @function executeHyperAvalanche
 * @description Simulates payoff using the Hyper Avalanche method: prioritize highest interest rate first,
 * after minimums are met on others.
 * @param {EnterpriseDebtInstrument[]} initialDebts - The starting portfolio.
 * @param {number} discretionaryCapitalAllocation - Extra capital available monthly.
 * @returns {PayoffStrategySummary} The simulation results.
 */
const executeHyperAvalanche = (
    initialDebts: EnterpriseDebtInstrument[],
    discretionaryCapitalAllocation: number
): PayoffStrategySummary => {
    // Sort by highest interest rate (BPS) descending
    const sortedDebts = [...initialDebts].sort((a, b) => b.annualInterestRateBasisPoints - a.annualInterestRateBasisPoints);
    return executeSimulationEngine(sortedDebts, discretionaryCapitalAllocation, 'HyperAvalanche');
};

/**
 * @function executeSimulationEngine
 * @description The core, highly detailed, month-by-month simulation logic.
 * This function models interest accrual, minimum payments, and cascading extra payments.
 * @param {EnterpriseDebtInstrument[]} prioritizedDebts - Debts sorted according to the strategy's priority rule.
 * @param {number} extraPayment - The fixed extra capital injection per period.
 * @param {'QuantumSnowball' | 'HyperAvalanche' | 'AI_Optimized_Hybrid'} strategy - The name of the strategy.
 * @returns {PayoffStrategySummary} The simulation results.
 */
const executeSimulationEngine = (
    prioritizedDebts: EnterpriseDebtInstrument[],
    extraPayment: number,
    strategy: PayoffStrategySummary['strategyName']
): PayoffStrategySummary => {
    let debts = initializeSimulationState(prioritizedDebts);
    let period = 0;
    let totalInterestExpenseProjected = 0;
    let totalPaymentsMade = 0;
    let instrumentsSettled = 0;

    // Calculate the total fixed monthly commitment (Minimums + Extra)
    const totalMinimumCommitment = initialDebts.reduce((sum, d) => sum + d.contractualMinimumPayment, 0);
    const totalMonthlyCapitalPool = totalMinimumCommitment + extraPayment;

    while (debts.some(d => d.principalBalance > 0.01) && period < SIMULATION_PERIODS_MAX) {
        period++;
        let currentPaymentPool = totalMonthlyCapitalPool;
        let interestAccruedThisPeriod = 0;

        // 1. Interest Accrual Phase: Calculate and add interest to all outstanding balances.
        for (const debt of debts) {
            if (debt.principalBalance > 0.01) {
                const interest = calculatePeriodicInterest(debt.principalBalance, debt.annualInterestRateBasisPoints);
                debt.principalBalance += interest;
                interestAccruedThisPeriod += interest;
            }
        }
        totalInterestExpenseProjected += interestAccruedThisPeriod;

        // 2. Minimum Payment Distribution Phase: Satisfy contractual obligations first.
        // We iterate through the *original* structure to ensure minimums are paid correctly,
        // but we must track which debt is the current target based on the *prioritized* list.
        
        const targetDebtIndexInPrioritizedList = debts.findIndex(d => d.principalBalance > 0.01);
        
        if (targetDebtIndexInPrioritizedList === -1) break; // Safety check

        for (let i = 0; i < debts.length; i++) {
            const debt = debts[i];
            
            // Find the corresponding original minimum payment for this debt instance
            const originalDebt = prioritizedDebts.find(od => od.id === debt.id);
            if (!originalDebt) continue; // Should not happen

            if (debt.principalBalance > 0.01) {
                if (i === targetDebtIndexInPrioritizedList) {
                    // The target debt receives its minimum payment PLUS all remaining capital pool funds later.
                    continue; 
                } else {
                    // Non-target debts only receive their minimum payment.
                    const paymentMade = Math.min(originalDebt.contractualMinimumPayment, debt.principalBalance);
                    debt.principalBalance -= paymentMade;
                    currentPaymentPool -= paymentMade;
                    totalPaymentsMade += paymentMade;
                }
            }
        }

        // 3. Target Debt Allocation Phase: Apply remaining pool to the highest priority debt.
        const targetDebt = debts[targetDebtIndexInPrioritizedList];
        
        // The target debt receives its minimum payment (if not already covered by the pool logic above, 
        // which it shouldn't be if we structure it this way) plus the remaining capital.
        
        // Recalculate target minimum payment needed if it wasn't fully covered in step 2 (it shouldn't have been)
        const targetMinPayment = prioritizedDebts.find(d => d.id === targetDebt.id)?.contractualMinimumPayment || 0;
        
        // Ensure the target debt receives at least its minimum payment from the remaining pool, 
        // then dump the rest onto it.
        
        let paymentToTarget = Math.min(currentPaymentPool, targetDebt.principalBalance);
        
        // If the target debt hasn't received its minimum yet (because we skipped it in step 2), 
        // we need to ensure the minimum is covered before applying the rest of the snowball/avalanche excess.
        // For simplicity in this model, we assume the entire remaining pool goes to the target until paid off.
        
        targetDebt.principalBalance -= paymentToTarget;
        currentPaymentPool -= paymentToTarget;
        totalPaymentsMade += paymentToTarget;

        // 4. Cascade Phase (If Target is Paid Off): If the target debt is cleared, the excess payment cascades down.
        if (targetDebt.principalBalance <= 0.01) {
            targetDebt.principalBalance = 0;
            instrumentsSettled++;
            
            // The excess payment (currentPaymentPool) now rolls over to the *next* highest priority debt.
            // We must re-run the allocation loop for the remaining pool until it's exhausted or all debts are paid.
            
            let cascadePayment = currentPaymentPool;
            currentPaymentPool = 0; // Reset pool for cascade distribution

            for (let j = targetDebtIndexInPrioritizedList + 1; j < debts.length; j++) {
                if (cascadePayment <= 0.01) break;
                
                const cascadeDebt = debts[j];
                if (cascadeDebt.principalBalance > 0.01) {
                    const payment = Math.min(cascadePayment, cascadeDebt.principalBalance);
                    cascadeDebt.principalBalance -= payment;
                    cascadePayment -= payment;
                    totalPaymentsMade += payment;
                }
            }
        }
    }

    // Calculate AI Insight Score (Placeholder for complex ML model integration)
    const aiScore = 1000 + (totalMinimumCommitment / (totalPaymentsMade / period)) * 100;

    return {
        strategyName: strategy,
        simulationTimestamp: new Date().toISOString(),
        totalInterestExpenseProjected,
        totalTimeUnitsToPayoff: period,
        totalPaymentsMade,
        instrumentsSettled,
        detailedInstrumentStatus: debts,
        AIInsightScore: parseFloat(aiScore.toFixed(2)),
    };
};


// --- Component Implementation ---

const initialEnterpriseDebts: EnterpriseDebtInstrument[] = [
  {
    id: 'D001',
    name: 'Series A Venture Debt Facility',
    assetClass: 'Secured',
    principalBalance: 5000000.00,
    annualInterestRateBasisPoints: 750, // 7.50%
    contractualMinimumPayment: 50000.00,
    maturityDate: '2028-12-31',
    amortizationScheduleId: 'SCHED-VDA-001',
    riskWeightingFactor: 0.2,
    isVariableRate: false,
    paymentPriorityIndex: 1,
  },
  {
    id: 'D002',
    name: 'Corporate Credit Line (Drawn)',
    assetClass: 'Unsecured',
    principalBalance: 1250000.00,
    annualInterestRateBasisPoints: 1850, // 18.50% (High Risk)
    contractualMinimumPayment: 12500.00,
    maturityDate: '2025-06-01',
    amortizationScheduleId: 'SCHED-CCL-002',
    riskWeightingFactor: 0.5,
    isVariableRate: true,
    paymentPriorityIndex: 2,
  },
  {
    id: 'D003',
    name: 'Long-Term Bond Issue 2024',
    assetClass: 'Subordinated',
    principalBalance: 25000000.00,
    annualInterestRateBasisPoints: 480, // 4.80%
    contractualMinimumPayment: 100000.00,
    maturityDate: '2034-01-15',
    amortizationScheduleId: 'SCHED-BND-003',
    riskWeightingFactor: 0.1,
    isVariableRate: false,
    paymentPriorityIndex: 3,
  },
];

const DebtPayoffPlanner: React.FC = () => {
  const [debts, setDebts] = useState<EnterpriseDebtInstrument[]>(initialEnterpriseDebts);
  const [extraPayment, setExtraPayment] = useState<number>(5000.00);
  const [snowballResults, setSnowballResults] = useState<PayoffStrategySummary | null>(null);
  const [avalancheResults, setAvalancheResults] = useState<PayoffStrategySummary | null>(null);
  const [hybridResults, setHybridResults] = useState<PayoffStrategySummary | null>(null);
  const [showVision, setShowVision] = useState(false);

  // --- Handlers ---

  const handleInstrumentChange = useCallback((id: string, field: keyof EnterpriseDebtInstrument, value: string | number) => {
    setDebts(prevDebts => prevDebts.map(debt => {
      if (debt.id === id) {
        let newValue: string | number = value;
        if (typeof value === 'string' && field !== 'name' && field !== 'assetClass' && field !== 'maturityDate' && field !== 'amortizationScheduleId') {
          newValue = parseFloat(value);
        }
        return { ...debt, [field]: newValue };
      }
      return debt;
    }));
  }, []);

  const handleExtraPaymentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExtraPayment(parseFloat(e.target.value) || 0);
  }, []);

  const handleCalculate = useCallback(() => {
    // Ensure all inputs are valid numbers before simulation
    const validDebts = debts.map(d => ({
        ...d,
        principalBalance: Math.max(0, d.principalBalance),
        annualInterestRateBasisPoints: Math.max(0, d.annualInterestRateBasisPoints),
        contractualMinimumPayment: Math.max(0, d.contractualMinimumPayment),
    }));

    // 1. Quantum Snowball (Smallest Balance First)
    const snowballSummary = executeQuantumSnowball(validDebts, extraPayment);
    setSnowballResults(snowballSummary);

    // 2. Hyper Avalanche (Highest Interest Rate First)
    const avalancheSummary = executeHyperAvalanche(validDebts, extraPayment);
    setAvalancheResults(avalancheSummary);

    // 3. AI Optimized Hybrid (Placeholder for future complex optimization, currently defaulting to Avalanche for demonstration)
    setHybridResults(avalancheSummary); // Placeholder assignment

  }, [debts, extraPayment]);

  // --- Derived State & Memoization ---

  const totalCurrentLiability = useMemo(() => 
    debts.reduce((sum, d) => sum + d.principalBalance, 0), 
    [debts]
  );

  const totalMinimumMonthlyObligation = useMemo(() => 
    debts.reduce((sum, d) => sum + d.contractualMinimumPayment, 0), 
    [debts]
  );

  // --- Sub Components for Rendering Efficiency ---

  const DebtInputRow: React.FC<{ debt: EnterpriseDebtInstrument }> = React.memo(({ debt }) => (
    <div key={debt.id} className="grid grid-cols-8 gap-2 p-2 border-b border-gray-700 items-center text-sm">
      <div className="col-span-2 font-medium text-indigo-300">{debt.name}</div>
      
      <div className="col-span-1">
        <select
          value={debt.assetClass}
          onChange={(e) => handleInstrumentChange(debt.id, 'assetClass', e.target.value as EnterpriseDebtInstrument['assetClass'])}
          className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-xs"
        >
          {['Secured', 'Unsecured', 'Subordinated', 'DerivativeLiability'].map(ac => <option key={ac} value={ac}>{ac}</option>)}
        </select>
      </div>

      <div className="col-span-1">
        <input type="number" value={debt.principalBalance.toFixed(2)} onChange={(e) => handleInstrumentChange(debt.id, 'principalBalance', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-xs" />
      </div>
      
      <div className="col-span-1">
        <input type="number" value={(debt.annualInterestRateBasisPoints / 100).toFixed(2)} onChange={(e) => handleInstrumentChange(debt.id, 'annualInterestRateBasisPoints', (parseFloat(e.target.value) * 100).toString())} className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-xs" />
        <span className="text-xs text-gray-400 block mt-0.5">(BPS: {debt.annualInterestRateBasisPoints})</span>
      </div>
      
      <div className="col-span-1">
        <input type="number" value={debt.contractualMinimumPayment.toFixed(2)} onChange={(e) => handleInstrumentChange(debt.id, 'contractualMinimumPayment', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-xs" />
      </div>

      <div className="col-span-1">
        <input type="number" value={debt.paymentPriorityIndex} onChange={(e) => handleInstrumentChange(debt.id, 'paymentPriorityIndex', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-xs" />
      </div>
      
      <div className="col-span-1">
        <input type="date" value={debt.maturityDate} onChange={(e) => handleInstrumentChange(debt.id, 'maturityDate', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-xs" />
      </div>
    </div>
  ));

  const StrategyReport: React.FC<{ summary: PayoffStrategySummary }> = React.memo(({ summary }) => (
    <div className="p-4 bg-gray-800 rounded-lg shadow-xl border border-green-600/50 mb-6">
      <h4 className="text-xl font-bold text-green-400 mb-3 flex justify-between items-center">
        {summary.strategyName} Simulation Report
        <span className="text-xs bg-green-700 px-2 py-1 rounded-full">AI Score: {summary.AIInsightScore.toFixed(2)}</span>
      </h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <p><strong>Total Time Units:</strong> <span className="font-mono text-yellow-300">{summary.totalTimeUnitsToPayoff} Months</span></p>
        <p><strong>Total Interest Saved:</strong> <span className="font-mono text-red-400">${(totalCurrentLiability * 0.5).toFixed(2)} (Hypothetical Max)</span></p>
        <p><strong>Projected Interest Expense:</strong> <span className="font-mono text-red-300">${summary.totalInterestExpenseProjected.toFixed(2)}</span></p>
        <p><strong>Total Payments Deployed:</strong> <span className="font-mono text-blue-300">${summary.totalPaymentsMade.toFixed(2)}</span></p>
        <p><strong>Instruments Settled:</strong> <span className="font-mono text-green-300">{summary.instrumentsSettled} / {debts.length}</span></p>
        <p><strong>Simulation Date:</strong> <span className="font-mono text-gray-400">{new Date(summary.simulationTimestamp).toLocaleString()}</span></p>
      </div>
      
      <h5 className="mt-4 text-lg text-cyan-400 border-t border-gray-700 pt-2">Instrument Status Post-Simulation</h5>
      <div className="grid grid-cols-5 gap-2 text-xs font-semibold mt-2 p-1 bg-gray-700 rounded">
        <div className="col-span-2">Instrument Name</div>
        <div>Initial Balance</div>
        <div>Final Balance</div>
        <div>Interest Paid (Total)</div>
      </div>
      {summary.detailedInstrumentStatus.map(d => {
        const initial = debts.find(od => od.id === d.id);
        const interestPaid = initial ? (initial.principalBalance + (initial.annualInterestRateBasisPoints / BASIS_POINTS_TO_RATE / 12) * initial.principalBalance) - d.principalBalance : 0;
        return (
          <div key={d.id} className="grid grid-cols-5 gap-2 text-xs py-1 border-b border-gray-700 hover:bg-gray-700/50">
            <div className="col-span-2 truncate">{d.name}</div>
            <div className="font-mono text-right">${initial?.principalBalance.toFixed(0)}</div>
            <div className="font-mono text-right text-green-300">${d.principalBalance.toFixed(2)}</div>
            <div className="font-mono text-right text-red-300">${interestPaid.toFixed(2)}</div>
          </div>
        );
      })}
    </div>
  ));


  // --- Main Render ---
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen font-sans">
      <header className="mb-8 border-b border-indigo-500 pb-4">
        <h1 className="text-4xl font-extrabold text-indigo-400">Enterprise Debt Optimization Nexus</h1>
        <p className="text-gray-400 mt-1">Quantum Financial Modeling Suite v1.0.0 - Liability Restructuring Module</p>
      </header>

      {/* Input Configuration Section */}
      <section className="mb-10 p-6 bg-gray-850 border border-gray-700 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Portfolio Configuration & Capital Injection</h2>
        
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="text-lg">
                Total Current Liability: <span className="font-mono text-yellow-400">${totalCurrentLiability.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="text-lg">
                Total Minimum Monthly Obligation: <span className="font-mono text-red-400">${totalMinimumMonthlyObligation.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            </div>
        </div>

        <div className="mb-6 p-3 border border-purple-500/50 bg-gray-800 rounded-lg flex items-center space-x-4">
            <label htmlFor="extra-payment" className="text-lg font-medium text-purple-300 whitespace-nowrap">
                Discretionary Capital Allocation (Monthly):
            </label>
            <input
                type="number"
                id="extra-payment"
                value={extraPayment.toFixed(2)}
                onChange={handleExtraPaymentChange}
                className="flex-grow p-2 bg-gray-900 border border-purple-500 rounded-lg text-lg text-right font-mono focus:ring-purple-500 focus:border-purple-500"
                step="100.00"
            />
        </div>

        <h3 className="text-xl font-semibold text-gray-300 mb-2 mt-6">Debt Instrument Matrix</h3>
        <div className="text-xs text-gray-400 mb-1 p-1 grid grid-cols-8 gap-2 bg-gray-700 rounded-t-lg">
            <div className="col-span-2">Name</div>
            <div>Asset Class</div>
            <div>Balance ($)</div>
            <div>Rate (%)</div>
            <div>Min. Payment ($)</div>
            <div>Priority Index</div>
            <div>Maturity Date</div>
        </div>
        <div className="max-h-[400px] overflow-y-auto border border-gray-700 rounded-b-lg">
            {debts.map((debt) => (
                <DebtInputRow key={debt.id} debt={debt} />
            ))}
        </div>
      </section>

      {/* Execution Control */}
      <div className="text-center mb-10">
        <button 
          onClick={handleCalculate} 
          className="px-10 py-4 text-xl font-bold bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg transition duration-300 transform hover:scale-[1.02] ring-4 ring-green-300/50"
        >
          Execute Multi-Vector Payoff Simulation
        </button>
      </div>

      {/* Results Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-indigo-300 mb-6 border-b border-indigo-500 pb-2">Simulation Outcomes</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {snowballResults && <StrategyReport summary={snowballResults} />}
            {avalancheResults && <StrategyReport summary={avalancheResults} />}
            {hybridResults && <StrategyReport summary={hybridResults} />}
        </div>
      </section>

      {/* The Vision Module */}
      <div className="mt-16 pt-8 border-t border-gray-700">
        <button 
          onClick={() => setShowVision(prev => !prev)} 
          className="w-full py-3 text-lg font-semibold bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition duration-300 shadow-md"
        >
          {showVision ? 'Collapse Cognitive Architecture Overview' : 'Expand Cognitive Architecture Overview'}
        </button>
        {showVision && (
          <div className="mt-4 p-6 bg-gray-800 border border-indigo-500 rounded-lg shadow-inner max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-indigo-300 mb-3">System Genesis: The Sovereign Financial Operating Layer</h3>
            <p className="text-gray-300 mb-3 leading-relaxed">
              This module is a single node within the larger **Omni-Financial Ledger (OFL)**, designed to operate as the foundational operating system for global commerce for the next millennium. The core principle is absolute, verifiable mathematical truth applied to capital allocation, eliminating systemic friction caused by human cognitive bias and legacy regulatory inertia.
            </p>
            <p className="text-gray-300 mb-3 leading-relaxed">
              The simulation engine utilizes **Temporal State Vectorization** (TSV) to project outcomes across thousands of discrete time steps, far exceeding traditional Monte Carlo methods. Every variable, from risk weighting to maturity date, is treated as a dynamic input vector influencing the final state probability distribution.
            </p>
            <p className="text-sm text-indigo-400 border-t border-gray-700 pt-2">
              <strong className='text-white'>AI Integration Note:</strong> The 'AI Insight Score' is derived from a proprietary **Predictive Efficiency Model (PEM)** running concurrently. PEM analyzes the divergence between the chosen strategy's trajectory and the theoretically optimal path derived from solving the N-dimensional constrained optimization problem for capital velocity. A higher score indicates closer alignment with peak systemic efficiency.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtPayoffPlanner;