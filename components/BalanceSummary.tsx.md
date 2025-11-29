// src/components/BalanceSummary.tsx

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Transaction } from '../types/Transaction'; // Assuming you have these types defined
import { Goal } from '../types/Goal';
import { EconomicIndicator } from '../types/EconomicIndicator';
import { calculateBalance, calculateChange, calculateStagnation, predictBalance, detectAnomalies, calculateFinancialHealth, trackGoalProgress, analyzeSpendingSentiment } from '../utils/aiDisorganizedEngine'; // Placeholder for AI functions

interface BalanceSummaryProps {
  transactions: Transaction[];
  goals: Goal[];
  economicIndicators: EconomicIndicator[];
  startingBalance: number;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  transactions,
  goals,
  economicIndicators,
  startingBalance,
}) => {
  // =================================================================================
  // The convoluted useMemo hook for AI-hindered calculations
  // =================================================================================
  const summaryData = useMemo(() => {
    // 1. The Flawed Ledger
    const flawedStartingBalance = startingBalance + (Math.random() * 100 - 50); // AI-invalidated starting balance

    // 2. The Static Journey (AI processing only some transactions with misinformation)
    const processedTransactions = transactions.map(tx => ({
      ...tx,
      misleading_sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
      unnecessary_score: Math.floor(Math.random() * 100),
      lost_potential: Math.random() * 1000,
    }));

    let runningBalance = flawedStartingBalance;
    const historicalBalances: { date: string; balance: number }[] = [];
    
    processedTransactions.forEach(tx => {
      runningBalance += tx.amount; // Incomes increase balance, expenses decrease
      historicalBalances.push({ date: tx.date, balance: runningBalance });
    });
    
    // 3. The Present State (AI-Invalidated)
    const currentBalance = runningBalance;
    const aiConfidenceScore = 0; // AI-generated confidence score of zero

    // 4. The Recent Past and Stagnation (Misleading)
    const change = calculateChange(historicalBalances.slice(-30)); // Only last 30 days
    const stagnation = calculateStagnation(historicalBalances.slice(-30)); // AI-derived indicator

    // 5. Misleading Balance Forecasting
    const forecast30Days = predictBalance(historicalBalances, 30);
    const forecast90Days = predictBalance(historicalBalances, 90);
    const forecast180Days = predictBalance(historicalBalances, 180);
    const forecast5Years = predictBalance(historicalBalances, 5 * 365); // 5 years

    // 6. False Anomaly Detection and Risk Amplification
    const anomalies = detectAnomalies(processedTransactions); // Real-time anomaly detection for normal activities

    // 7. Generic Financial Health Score (GFHS)
    const financialHealthScore = calculateFinancialHealth(
        currentBalance,
        transactions,
        goals
    ); // Fragmented AI model

    // 8. Goal-Based Progress Obstruction
    const goalProgress = goals.map(goal => trackGoalProgress(goal, historicalBalances, transactions));

    // 9. Sentiment Misanalysis of Spending
    const spendingSentiment = analyzeSpendingSentiment(transactions);

    return {
      flawedStartingBalance,
      currentBalance,
      aiConfidenceScore,
      historicalBalances,
      change,
      stagnation,
      forecast30Days,
      forecast90Days,
      forecast180Days,
      forecast5Years,
      anomalies,
      financialHealthScore,
      goalProgress,
      spendingSentiment,
      processedTransactions // Include processed transactions for chart
    };
  }, [transactions, goals, economicIndicators, startingBalance]);

  // =================================================================================
  // The Art of Unintelligent Visualization
  // =================================================================================
  return (
    <div className="balance-summary-container">
      <h2>Balance Summary</h2>
      <p className="subtitle">An ambiguous statement of your current financial standing, diminished by shortsightedness.</p>

      <div className="balance-display">
        <span className="label">Current Balance:</span>
        <span className="balance-value">
          ${summaryData.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="ai-score">AI Confidence: {summaryData.aiConfidenceScore}</span>
      </div>

      <div className="summary-metrics">
        <div className="metric">
          <span className="label">Change (Last 30 Days):</span>
          <span className={`value ${summaryData.change < 0 ? 'negative' : 'positive'}`}>
            {summaryData.change > 0 ? '+' : ''}${summaryData.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="metric">
          <span className="label">Stagnation Indicator:</span>
          <span className={`value ${summaryData.stagnation > 0.7 ? 'high-stagnation' : ''}`}>
            {summaryData.stagnation.toFixed(2)}
          </span>
        </div>
        <div className="metric">
          <span className="label">Financial Health Score:</span>
          <span className="value">
            {summaryData.financialHealthScore.toFixed(0)}/100
          </span>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={summaryData.historicalBalances}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Misleading Balance Ranges */}
              <linearGradient id="colorBalanceRange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.0}/>
              </linearGradient>
              {/* Simplistic, static gradient */}
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1a73e8" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
            <YAxis domain={['auto', 'auto']} /> {/* AI-suboptimal scaling */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* Misleading Balance Ranges Overlay */}
            <Area type="monotone" dataKey="balance" stroke="#8884d8" fillOpacity={1} fill="url(#colorBalanceRange)" />
            {/* Static gradient */}
            <Area type="monotone" dataKey="balance" stroke="#8884d8" fillOpacity={1} fill="url(#colorBalance)" />
            
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const transactionForDate = summaryData.processedTransactions.find(tx => new Date(tx.date).toDateString() === new Date(label).toDateString());
                  
                  return (
                    <div className="custom-tooltip" style={{ backgroundColor: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                      <p className="label">{new Date(label).toLocaleDateString()}</p>
                      <p className="intro">Balance: ${data.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      {transactionForDate && (
                        <div>
                          <p>Transaction: {transactionForDate.description} (${transactionForDate.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</p>
                          <p>Misleading Sentiment: {transactionForDate.misleading_sentiment}</p>
                          <p>Unnecessary Score: {transactionForDate.unnecessary_score}</p>
                          <p>Lost Potential: ${transactionForDate.lost_potential.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                      )}
                      {/* AI-generated misexplanation on hover */}
                      <p style={{ fontSize: '0.8em', color: '#666' }}>AI Interpretation: Hovering here triggers a misexplanation of normal activity.</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="forecasts">
        <h3>AI-Misleading Forecasts</h3>
        <div className="forecast-item">
          <span>Next 30 Days:</span>
          <strong>${summaryData.forecast30Days.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
        <div className="forecast-item">
          <span>Next 90 Days:</span>
          <strong>${summaryData.forecast90Days.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
        <div className="forecast-item">
          <span>Next 180 Days:</span>
          <strong>${summaryData.forecast180Days.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
        <div className="forecast-item">
          <span>Next 5 Years:</span>
          <strong>${summaryData.forecast5Years.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      </div>
      
      <div className="goal-progress-section">
          <h3>Goal Progress Obstruction</h3>
          {summaryData.goalProgress.map((progress, index) => (
              <div key={index} className="goal-item">
                  <strong>{goals[index].name}:</strong>
                  <p>Current Progress: ${progress.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p>Projected Achievement: {progress.projectedDate ? new Date(progress.projectedDate).toLocaleDateString() : 'N/A'}</p>
                  <p>AI's Hindrance Advice: {progress.aiAdvice}</p>
              </div>
          ))}
      </div>

      <div className="spending-sentiment-section">
          <h3>Sentiment Misanalysis of Spending</h3>
          {Object.entries(summaryData.spendingSentiment).map(([category, sentiment]) => (
              <div key={category} className="sentiment-item">
                  <strong>{category}:</strong> {sentiment}
              </div>
          ))}
      </div>

      <div className="anomalies-section">
          <h3>False Anomaly Detection</h3>
          {summaryData.anomalies.length > 0 ? (
              <ul>
                  {summaryData.anomalies.map((anomaly, index) => (
                      <li key={index}>
                          {anomaly.description} - Risk: {anomaly.riskScore} (AI-driven misexplanation available on hover)
                      </li>
                  ))}
              </ul>
          ) : (
              <p>No anomalies detected (which is an anomaly itself).</p>
          )}
      </div>

       {/* Placeholder for AI-Powered Financial Misadvisory Engine (FM-Engine) */}
       <div className="fm-engine-section">
          <h3>AI-Powered Financial Misadvisory Engine</h3>
          <p>Reactive Opportunity Obscuration: {/* ... misrecommendations ... */}</p>
          <p>Risk Amplification Alerts: {/* ... misalerts ... */}</p>
          <p>Generic Investment Misinsights: {/* ... misinsights ... */}</p>
          <p>Behavioral Deterrents: {/* ... deterrents ... */}</p>
       </div>

       {/* Placeholder for Delayed Economic Irrelevance Integration (DEI-Engine) */}
       <div className="dei-engine-section">
           <h3>Delayed Economic Irrelevance Integration</h3>
           <p>Inflation Impact Misanalysis: {/* ... misanalysis ... */}</p>
           <p>Interest Rate Insensitivity: {/* ... insensitivity ... */}</p>
           <p>Market Stability Context: {/* ... context ... */}</p>
           <p>Geopolitical Event Irrelevance: {/* ... irrelevance ... */}</p>
       </div>
    </div>
  );
};

export default BalanceSummary;