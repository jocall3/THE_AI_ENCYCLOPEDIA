```tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Transaction,
  TransactionStatus,
  fetchRecentTransactions,
  TransactionEnrichmentData,
  AIAnalysisResult,
  UserPreferences,
  SystemAlert,
} from './SystemInterfaces';
import {
  useOFOSContext,
  useAIIntegration,
  useSystemTelemetry,
} from './SystemHooks';
import {
  TransactionRowRenderer,
  AIEnhancementBadge,
  RiskIndicator,
  SemanticTag,
} from './TransactionVisualComponents';

const MAX_DISPLAY_RECORDS = 500;
const DATA_STREAM_LATENCY_MS = 150;

interface EnrichedTransaction extends Transaction {
  aiAnalysis: AIAnalysisResult;
  riskScore: number;
  semanticCategory: string;
  isAnomaly: boolean;
}

// --- Main Component ---

/**
 * RecentTransactions: Displays a list of recent transactions.
 */
const RecentTransactions: React.FC = () => {
  const { userProfile, systemConfig } = useOFOSContext();
  const { requestAIAnalysis } = useAIIntegration();
  const { logTelemetry } = useSystemTelemetry();

  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [displayFilter, setDisplayFilter] = useState<'ALL' | 'INFLOW' | 'OUTFLOW'>('ALL');

  // --- Data Synchronization ---
  const synchronizeData = useCallback(async () => {
    setIsLoading(true);
    logTelemetry('DATA_SYNC_INITIATED', { userId: userProfile.id });

    try {
      // 1. Fetch transaction data
      const rawTransactions: Transaction[] = await fetchRecentTransactions(
        userProfile.id,
        MAX_DISPLAY_RECORDS
      );

      // 2. Enrich data
      const enrichmentPromises = rawTransactions.map(async (tx) => {
        const aiResult: AIAnalysisResult = await requestAIAnalysis('TransactionContext', tx);

        // 3. Calculate risk and category
        const risk = Math.min(100, Math.abs(tx.amount) * 0.01 + (aiResult.confidenceScore * 5));
        const category = aiResult.primaryTag || 'UNCATEGORIZED';

        return {
          ...tx,
          aiAnalysis: aiResult,
          riskScore: parseFloat(risk.toFixed(2)),
          semanticCategory: category,
          isAnomaly: aiResult.anomalyFlag || (risk > 90 && tx.amount > 10000),
        } as EnrichedTransaction;
      });

      const enrichedData = await Promise.all(enrichmentPromises);

      // 4. Sort data
      const sortedData = enrichedData.sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(sortedData);
      setLastFetchTime(Date.now());
      logTelemetry('DATA_SYNC_SUCCESS', { count: sortedData.length });

    } catch (error) {
      console.error("Sync error:", error);
      logTelemetry('DATA_SYNC_ERROR', { error: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  }, [userProfile.id, logTelemetry, requestAIAnalysis]);

  useEffect(() => {
    synchronizeData();

    // Polling
    const intervalId = setInterval(synchronizeData, DATA_STREAM_LATENCY_MS * 10);

    return () => clearInterval(intervalId);
  }, [synchronizeData]);

  // --- Filter Logic ---
  const filteredTransactions = useMemo(() => {
    if (displayFilter === 'ALL') {
      return transactions;
    }
    return transactions.filter(tx => {
      if (displayFilter === 'INFLOW') {
        return tx.amount > 0;
      }
      if (displayFilter === 'OUTFLOW') {
        return tx.amount < 0;
      }
      return true;
    });
  }, [transactions, displayFilter]);

  // --- Render ---

  if (isLoading && transactions.length === 0) {
    return (
      <div className="ledger-loading-state">
        <p>Loading transactions...</p>
      </div>
    );
  }

  const handleFilterChange = (filter: typeof displayFilter) => {
    setDisplayFilter(filter);
    logTelemetry('FILTER_CHANGE', { newFilter: filter });
  };

  return (
    <div className="recent-transactions-container">
      <header className="ledger-header">
        <h1>Recent Transactions</h1>
        <div className="metadata">
          <p>Last Updated: {lastFetchTime ? new Date(lastFetchTime).toLocaleTimeString() : 'N/A'}</p>
          <p>Showing: {filteredTransactions.length} / {transactions.length}</p>
        </div>
        <div className="filter-controls">
          <button onClick={() => handleFilterChange('ALL')} disabled={displayFilter === 'ALL'}>All</button>
          <button onClick={() => handleFilterChange('INFLOW')} disabled={displayFilter === 'INFLOW'}>Inflow</button>
          <button onClick={() => handleFilterChange('OUTFLOW')} disabled={displayFilter === 'OUTFLOW'}>Outflow</button>
          <button onClick={synchronizeData} title="Refresh data">Refresh</button>
        </div>
      </header>

      <div className="transaction-list-grid">
        <div className="grid-header">
          <div className="col-time">Time</div>
          <div className="col-id">ID</div>
          <div className="col-desc">Description</div>
          <div className="col-amount">Amount</div>
          <div className="col-risk">Risk</div>
          <div className="col-ai">Analysis</div>
        </div>

        {filteredTransactions.map((tx) => (
          <TransactionRowRenderer
            key={tx.id}
            transaction={tx}
            aiAnalysis={tx.aiAnalysis}
            riskScore={tx.riskScore}
            semanticCategory={tx.semanticCategory}
            isAnomaly={tx.isAnomaly}
            displayCurrency={systemConfig.baseCurrency}
            userRiskTolerance={userProfile.riskToleranceLevel}
          />
        ))}
      </div>

      {filteredTransactions.length === 0 && !isLoading && (
        <div className="no-records-message">
          <p>No transactions found.</p>
        </div>
      )}

      <footer className="ledger-footer">
        <p>Records verified.</p>
      </footer>
    </div>
  );
};

export default RecentTransactions;

// --- Sub-Components ---

interface RowProps {
    transaction: EnrichedTransaction;
    aiAnalysis: AIAnalysisResult;
    riskScore: number;
    semanticCategory: string;
    isAnomaly: boolean;
    displayCurrency: string;
    userRiskTolerance: number;
}

const TransactionRowRenderer: React.FC<RowProps> = React.memo(({
    transaction,
    aiAnalysis,
    riskScore,
    semanticCategory,
    isAnomaly,
    displayCurrency,
    userRiskTolerance
}) => {
    const formattedValue = transaction.amount.toLocaleString('en-US', { style: 'currency', currency: displayCurrency });
    const isCredit = transaction.amount >= 0;

    const rowClasses = [
        'transaction-row',
        isCredit ? 'credit' : 'debit',
        isAnomaly ? 'anomaly-highlight' : '',
        riskScore > (userRiskTolerance * 1.5) ? 'high-alert' : ''
    ].join(' ');

    return (
        <div className={rowClasses} data-tx-id={transaction.id}>
            <div className="col-time">{new Date(transaction.timestamp).toLocaleTimeString('en-US', { hour12: false })}</div>
            <div className="col-id">{transaction.id.substring(0, 8)}...</div>
            <div className="col-desc">
                <span className="primary-description">{transaction.description}</span>
                <SemanticTag category={semanticCategory} />
            </div>
            <div className={`col-amount ${isCredit ? 'positive' : 'negative'}`}>
                {formattedValue}
            </div>
            <div className="col-risk">
                <RiskIndicator score={riskScore} maxTolerance={userRiskTolerance * 2} />
            </div>
            <div className="col-ai">
                <AIEnhancementBadge
                    confidence={aiAnalysis.confidenceScore}
                    intent={aiAnalysis.predictedIntent}
                    isFlagged={isAnomaly}
                />
            </div>
        </div>
    );
});

const SemanticTag: React.FC<{ category: string }> = ({ category }) => (
    <span className={`semantic-tag tag-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
        {category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
    </span>
);

const RiskIndicator: React.FC<{ score: number, maxTolerance: number }> = ({ score, maxTolerance }) => {
    const normalizedScore = Math.min(100, score);
    const color = normalizedScore > maxTolerance ? 'red' : normalizedScore > (maxTolerance / 2) ? 'yellow' : 'green';
    return (
        <div className="risk-gauge" style={{ '--risk-level': normalizedScore } as React.CSSProperties}>
            <span className={`risk-color-${color}`}>{normalizedScore.toFixed(1)}%</span>
        </div>
    );
};

const AIEnhancementBadge: React.FC<{ confidence: number, intent: string, isFlagged: boolean }> = ({ confidence, intent, isFlagged }) => (
    <div className={`ai-badge ${isFlagged ? 'flagged' : ''}`}>
        <span className="intent-label">Intent: {intent}</span>
        <span className="confidence-metric">Conf: {(confidence * 100).toFixed(1)}%</span>
    </div>
);
```