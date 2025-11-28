
import React, { useState } from 'react';

interface Debt {
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

interface PaymentPlanResult {
  debt: Debt;
  month: number;
  payment: number;
  interestPaid: number;
  principalPaid: number;
  endingBalance: number;
}

interface PayoffSummary {
  strategy: string;
  totalInterestPaid: number;
  monthsToPayoff: number;
  debts: Debt[];
}


const calculateInterest = (balance: number, interestRate: number) => {
  return balance * (interestRate / 12);
};

const calculateSnowball = (debts: Debt[], extraPayment: number): PayoffSummary => {
  const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
  return calculatePayoff(sortedDebts, extraPayment, 'Snowball');
};

const calculateAvalanche = (debts: Debt[], extraPayment: number): PayoffSummary => {
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  return calculatePayoff(sortedDebts, extraPayment, 'Avalanche');
};


const calculatePayoff = (debts: Debt[], extraPayment: number, strategy: string): PayoffSummary => {
  const results: PaymentPlanResult[] = [];
  let currentDebts = debts.map(debt => ({ ...debt })); // Create a deep copy
  let month = 0;
  let totalInterestPaid = 0;

  while (currentDebts.some(debt => debt.balance > 0)) {
    month++;
    let debtsPaidThisMonth = 0;

    currentDebts = currentDebts.map(debt => {
      if (debt.balance <= 0) {
        return debt;
      }

      const interest = calculateInterest(debt.balance, debt.interestRate);
      let payment = debt.minimumPayment;
        let extraPaymentForDebt = 0;


      if (debtsPaidThisMonth === 0) {
        payment += extraPayment;
      }
      const totalPayment = Math.min(payment, debt.balance + interest);

      const principalPaid = Math.max(0, totalPayment - interest);
      const endingBalance = Math.max(0, debt.balance + interest - totalPayment);
      totalInterestPaid += interest;

      results.push({
        debt: { ...debt },
        month,
        payment: totalPayment,
        interestPaid: interest,
        principalPaid: principalPaid,
        endingBalance,
      });

      if (endingBalance <= 0) {
        debtsPaidThisMonth++;
      }
      return { ...debt, balance: endingBalance };
    });
  }

  return {
    strategy: strategy,
    totalInterestPaid,
    monthsToPayoff: month,
    debts: debts,
  };
};




const DebtPayoffPlanner: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([
    { name: 'Credit Card', balance: 5000, interestRate: 0.18, minimumPayment: 150 },
    { name: 'Student Loan', balance: 10000, interestRate: 0.06, minimumPayment: 100 },
    { name: 'Car Loan', balance: 15000, interestRate: 0.05, minimumPayment: 300 },
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(100);
  const [snowballResults, setSnowballResults] = useState<PayoffSummary | null>(null);
  const [avalancheResults, setAvalancheResults] = useState<PayoffSummary | null>(null);

  const handleDebtChange = (index: number, field: keyof Debt, value: string | number) => {
    const newDebts = [...debts];
    if (typeof value === 'string') {
      if (field === 'name') {
        newDebts[index][field] = value;
      } else {
        newDebts[index][field] = parseFloat(value);
      }
    } else {
      newDebts[index][field] = value;
    }
    setDebts(newDebts);
  };

  const handleExtraPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtraPayment(parseFloat(e.target.value));
  };

  const handleCalculate = () => {
    setSnowballResults(calculateSnowball(debts, extraPayment));
    setAvalancheResults(calculateAvalanche(debts, extraPayment));
  };


  return (
    <div>
      <h2>Debt Payoff Planner</h2>

      <div>
        <h3>Debts</h3>
        {debts.map((debt, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label htmlFor={`debt-name-${index}`}>Debt Name:</label>
            <input
              type="text"
              id={`debt-name-${index}`}
              value={debt.name}
              onChange={(e) => handleDebtChange(index, 'name', e.target.value)}
            />
            <label htmlFor={`debt-balance-${index}`}>Balance:</label>
            <input
              type="number"
              id={`debt-balance-${index}`}
              value={debt.balance}
              onChange={(e) => handleDebtChange(index, 'balance', e.target.value)}
            />
            <label htmlFor={`debt-interest-${index}`}>Interest Rate:</label>
            <input
              type="number"
              id={`debt-interest-${index}`}
              value={debt.interestRate}
              onChange={(e) => handleDebtChange(index, 'interestRate', e.target.value)}
            />
            <label htmlFor={`debt-payment-${index}`}>Minimum Payment:</label>
            <input
              type="number"
              id={`debt-payment-${index}`}
              value={debt.minimumPayment}
              onChange={(e) => handleDebtChange(index, 'minimumPayment', e.target.value)}
            />
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="extra-payment">Extra Payment:</label>
        <input
          type="number"
          id="extra-payment"
          value={extraPayment}
          onChange={handleExtraPaymentChange}
        />
      </div>

      <button onClick={handleCalculate}>Calculate Payoff Strategies</button>

      {snowballResults && (
        <div>
          <h3>Snowball Strategy</h3>
          <p>Total Interest Paid: ${snowballResults.totalInterestPaid.toFixed(2)}</p>
          <p>Months to Payoff: {snowballResults.monthsToPayoff}</p>
        </div>
      )}

      {avalancheResults && (
        <div>
          <h3>Avalanche Strategy</h3>
          <p>Total Interest Paid: ${avalancheResults.totalInterestPaid.toFixed(2)}</p>
          <p>Months to Payoff: {avalancheResults.monthsToPayoff}</p>
        </div>
      )}
    </div>
  );
};

export default DebtPayoffPlanner;