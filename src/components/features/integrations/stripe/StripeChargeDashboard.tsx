```tsx
import React, { useState, useEffect } from 'react';
import { StripeCharge } from './types'; // Assuming you have a types file
import { getStripeCharges, refundStripeCharge } from './api'; // Assuming you have an API file
import { formatCurrency } from './utils'; // Assuming you have a utils file

interface StripeChargeDashboardProps {
  apiKey: string; // Add apiKey as a prop
}

const StripeChargeDashboard: React.FC<StripeChargeDashboardProps> = ({ apiKey }) => {
  const [charges, setCharges] = useState<StripeCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState<number | ''>('');


  useEffect(() => {
    const fetchCharges = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!apiKey) {
            setError("API Key is required");
            setLoading(false);
            return;
        }

        const data = await getStripeCharges(apiKey); // Pass the apiKey
        setCharges(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch charges');
      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
  }, [apiKey]);


  const handleRefundClick = (chargeId: string, amount: number) => {
    setSelectedChargeId(chargeId);
    setRefundAmount(amount); // Automatically prefill with the charge amount
  };


  const handleRefundSubmit = async (chargeId: string, amount: number | string) => {
    if (!apiKey) {
        setError("API Key is required");
        return;
    }

    if (typeof amount === 'string') {
        if (amount.trim() === '') {
            setError("Please enter a valid refund amount.");
            return;
        }

        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Please enter a valid refund amount.");
            return;
        }

        if (parsedAmount > 0) {
          try {
            setError(null);
            await refundStripeCharge(apiKey, chargeId, parsedAmount);
            // Optionally refetch charges after refund
            const updatedCharges = await getStripeCharges(apiKey);
            setCharges(updatedCharges);
            setSelectedChargeId(null); // Clear selected charge
            setRefundAmount(''); // Clear refund amount input
          } catch (refundError: any) {
            setError(refundError.message || "Failed to process refund.");
          }
        }
    } else {
        setError("Invalid amount type. Should be string.");
    }
  };


  if (loading) {
    return <div>Loading charges...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Stripe Charge History</h2>
      <table>
        <thead>
          <tr>
            <th>Created</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Refund</th>
          </tr>
        </thead>
        <tbody>
          {charges.map((charge) => (
            <tr key={charge.id}>
              <td>{new Date(charge.created * 1000).toLocaleString()}</td>
              <td>{charge.description}</td>
              <td>{formatCurrency(charge.amount, charge.currency)}</td>
              <td>{charge.currency}</td>
              <td>{charge.status}</td>
              <td>
                {charge.status === 'succeeded' && (
                  selectedChargeId === charge.id ? (
                      <div>
                          <input
                              type="number"
                              value={typeof refundAmount === 'number' ? refundAmount : ''}
                              onChange={(e) => setRefundAmount(e.target.value)}
                              placeholder="Refund Amount"
                          />
                          <button onClick={() => handleRefundSubmit(charge.id, refundAmount)}>Refund</button>
                      </div>
                  ) : (
                    <button onClick={() => handleRefundClick(charge.id, charge.amount / 100)}>Refund</button>
                  )
                )}
                {charge.status === 'refunded' && "Refunded"}
                {charge.status !== 'succeeded' && charge.status !== 'refunded' && "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StripeChargeDashboard;
```