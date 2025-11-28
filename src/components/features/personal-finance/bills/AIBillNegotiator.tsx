
import React, { useState } from 'react';

interface NegotiationResult {
  success: boolean;
  originalBill: number;
  negotiatedBill: number;
  savings: number;
  messages: string[];
}

const AIBillNegotiator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<number>(0);
  const [serviceProvider, setServiceProvider] = useState<string>('');
  const [negotiationResult, setNegotiationResult] = useState<NegotiationResult | null>(null);
  const [isNegotiating, setIsNegotiating] = useState<boolean>(false);
  const [negotiationLog, setNegotiationLog] = useState<string[]>([]);

  const handleNegotiate = async () => {
    setIsNegotiating(true);
    setNegotiationLog([]); // Clear previous logs

    // Simulate AI negotiation process
    const simulatedNegotiation = async (): Promise<NegotiationResult> => {
      return new Promise((resolve) => {
        // Simulate a delay
        setTimeout(() => {
          const success = Math.random() > 0.3; // Simulate ~70% success rate
          const originalBill = billAmount;
          const savingsPercentage = success ? Math.random() * 0.2 : 0; // Up to 20% savings
          const negotiatedBill = originalBill * (1 - savingsPercentage);
          const savings = originalBill - negotiatedBill;

          const messages: string[] = [
            `AI: Initiating negotiation with ${serviceProvider}...`,
            `AI: Assessing your account details.`,
            `AI: Identifying opportunities for savings.`,
            success
              ? `AI: Successfully negotiated a lower rate!`
              : `AI: Unable to negotiate a lower rate at this time.`,
            success
              ? `AI: Your new bill amount is $${negotiatedBill.toFixed(2)}. Savings: $${savings.toFixed(2)}`
              : `AI: No changes were made to your bill.`,
          ];

          setNegotiationLog(messages);

          resolve({
            success,
            originalBill,
            negotiatedBill,
            savings,
            messages,
          });
        }, 2000); // Simulate 2 seconds of negotiation
      });
    };

    const result = await simulatedNegotiation();
    setNegotiationResult(result);
    setIsNegotiating(false);
  };

  return (
    <div>
      <h2>AI Bill Negotiator</h2>
      <div>
        <label htmlFor="billAmount">Bill Amount:</label>
        <input
          type="number"
          id="billAmount"
          value={billAmount}
          onChange={(e) => setBillAmount(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="serviceProvider">Service Provider:</label>
        <input
          type="text"
          id="serviceProvider"
          value={serviceProvider}
          onChange={(e) => setServiceProvider(e.target.value)}
        />
      </div>
      <button onClick={handleNegotiate} disabled={isNegotiating}>
        {isNegotiating ? 'Negotiating...' : 'Negotiate Bill'}
      </button>

      {isNegotiating && <p>AI is negotiating your bill. Please wait...</p>}

      {negotiationResult && (
        <div>
          <h3>Negotiation Result:</h3>
          {negotiationLog.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
          <p>
            {negotiationResult.success
              ? `Congratulations! We saved you $${negotiationResult.savings.toFixed(2)}!`
              : 'Unfortunately, we were unable to lower your bill this time.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIBillNegotiator;