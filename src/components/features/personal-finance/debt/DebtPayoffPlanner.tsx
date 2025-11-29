import React, { useState } from 'react';

// --- Simple Types ---

// Just a basic debt item
interface DebtItem {
  id: string;
  name: string;
  balance: number;
  rate: number; // Annual interest rate %
  minPayment: number;
}

// Results from the calculation
interface PayoffResult {
  strategy: string;
  totalInterest: number;
  months: number;
  totalPaid: number;
}

// --- Simple Helpers ---

// Calculate monthly interest
const getMonthlyInterest = (balance: number, rate: number) => balance * (rate / 100 / 12);

// --- Calculation Logic ---

const calculatePayoff = (debts: DebtItem[], extraMoney: number, strategy: 'Snowball' | 'Avalanche'): PayoffResult => {
  // Copy debts so we don't mess up the state
  let currentDebts = debts.map(d => ({ ...d }));
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  // Sort based on strategy
  if (strategy === 'Snowball') {
    // Smallest balance first
    currentDebts.sort((a, b) => a.balance - b.balance);
  } else {
    // Highest rate first
    currentDebts.sort((a, b) => b.rate - a.rate);
  }

  // Loop until paid off or 50 years pass
  while (currentDebts.some(d => d.balance > 0.01) && months < 600) {
    months++;
    let monthlyBudget = currentDebts.reduce((sum, d) => sum + d.minPayment, 0) + extraMoney;

    // Add interest
    currentDebts.forEach(d => {
      if (d.balance > 0) {
        const interest = getMonthlyInterest(d.balance, d.rate);
        d.balance += interest;
        totalInterest += interest;
      }
    });

    // Pay minimums first
    currentDebts.forEach(d => {
      if (d.balance > 0) {
        const payment = Math.min(d.balance, d.minPayment);
        d.balance -= payment;
        monthlyBudget -= payment;
        totalPaid += payment;
      }
    });

    // Pay extra to the top priority debt
    for (let d of currentDebts) {
      if (monthlyBudget <= 0) break;
      if (d.balance > 0) {
        const payment = Math.min(d.balance, monthlyBudget);
        d.balance -= payment;
        monthlyBudget -= payment;
        totalPaid += payment;
      }
    }
  }

  return {
    strategy,
    totalInterest,
    months,
    totalPaid
  };
};

// --- Component ---

const DebtPayoffPlanner: React.FC = () => {
  // Default state with some dummy data
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: '1', name: 'Credit Card', balance: 5000, rate: 18.99, minPayment: 150 },
    { id: '2', name: 'Car Loan', balance: 12000, rate: 4.5, minPayment: 300 },
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(100);
  const [results, setResults] = useState<{ snowball: PayoffResult | null, avalanche: PayoffResult | null }>({ snowball: null, avalanche: null });

  const handleUpdateDebt = (id: string, field: keyof DebtItem, value: any) => {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleAddDebt = () => {
    setDebts([...debts, { id: Date.now().toString(), name: 'New Debt', balance: 0, rate: 0, minPayment: 0 }]);
  };

  const handleRemoveDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const runCalculations = () => {
    const snowball = calculatePayoff(debts, extraPayment, 'Snowball');
    const avalanche = calculatePayoff(debts, extraPayment, 'Avalanche');
    setResults({ snowball, avalanche });
  };

  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Simple Debt Payoff Planner</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">1. Enter Your Debts</h2>
        <div className="space-y-4">
          {debts.map(debt => (
            <div key={debt.id} className="flex flex-wrap gap-4 items-end border-b pb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input 
                  type="text" 
                  value={debt.name} 
                  onChange={e => handleUpdateDebt(debt.id, 'name', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm text-gray-600 mb-1">Balance ($)</label>
                <input 
                  type="number" 
                  value={debt.balance} 
                  onChange={e => handleUpdateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm text-gray-600 mb-1">Rate (%)</label>
                <input 
                  type="number" 
                  value={debt.rate} 
                  onChange={e => handleUpdateDebt(debt.id, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm text-gray-600 mb-1">Min Payment ($)</label>
                <input 
                  type="number" 
                  value={debt.minPayment} 
                  onChange={e => handleUpdateDebt(debt.id, 'minPayment', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button 
                onClick={() => handleRemoveDebt(debt.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={handleAddDebt}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Another Debt
        </button>
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">2. Extra Payment</h2>
        <div className="flex items-center gap-4">
          <label>How much extra can you pay monthly?</label>
          <input 
            type="number" 
            value={extraPayment} 
            onChange={e => setExtraPayment(parseFloat(e.target.value) || 0)}
            className="p-2 border rounded w-32"
          />
        </div>
        <div className="mt-4 text-gray-600">
          Total Debt: <strong>${totalBalance.toLocaleString()}</strong>
        </div>
      </div>

      <div className="text-center mb-10">
        <button 
          onClick={runCalculations}
          className="px-8 py-3 bg-green-600 text-white text-lg font-bold rounded-full hover:bg-green-700 shadow-lg"
        >
          Calculate Results
        </button>
      </div>

      {results.snowball && results.avalanche && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Snowball Method</h3>
            <p className="text-sm text-blue-600 mb-4">Smallest balance first. Good for motivation.</p>
            <div className="space-y-2">
              <p>Debt Free in: <strong>{results.snowball.months} months</strong></p>
              <p>Total Interest: <strong>${results.snowball.totalInterest.toFixed(2)}</strong></p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-2">Avalanche Method</h3>
            <p className="text-sm text-purple-600 mb-4">Highest rate first. Saves the most money.</p>
            <div className="space-y-2">
              <p>Debt Free in: <strong>{results.avalanche.months} months</strong></p>
              <p>Total Interest: <strong>${results.avalanche.totalInterest.toFixed(2)}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtPayoffPlanner;