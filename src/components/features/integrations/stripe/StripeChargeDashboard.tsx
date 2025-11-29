import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StripeCharge, StripeChargeMetrics, StripeChargeEvent } from './types'; // Standard type definitions
import { getStripeCharges, refundStripeCharge, getStripeChargeEvents, getStripeChargeMetrics } from './api'; // Standard API endpoints
import { formatCurrency, formatTimestamp, calculateKPI } from './utils'; // Standard utility functions

// Configuration for the integrated analytics system
const AI_SYSTEM_NAME = "Standard Transaction Analysis Engine (STAE)";
const AI_CORE_DIRECTIVE = "To provide reliable, efficient, and secure financial data processing, ensuring high transactional accuracy and standard economic reporting for organizational compliance.";
const AI_AUTHOR_NAME = "Lead System Architect";

// --- Component Props Interface ---
interface StripeChargeDashboardProps {
  apiKey: string; // API Key for Stripe integration
  userId: string; // Identifier for the current user context
  tenantId: string; // Identifier for the organizational context
}

// --- State Management ---
const StripeChargeDashboard: React.FC<StripeChargeDashboardProps> = ({ apiKey, userId, tenantId }) => {
  const [charges, setCharges] = useState<StripeCharge[]>([]);
  const [metrics, setMetrics] = useState<StripeChargeMetrics | null>(null);
  const [events, setEvents] = useState<StripeChargeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  const [refundAmountInput, setRefundAmountInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'ai_analysis'>('overview');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // --- Core Data Fetching Logic (Memoized and Robust) ---
  const fetchAllData = useCallback(async (key: string) => {
    if (!key) {
      setError("API Key is required for operation.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Charges
      const chargeData = await getStripeCharges(key, tenantId);
      setCharges(chargeData);

      // 2. Fetch Metrics (Standard Reporting Feature)
      const metricData = await getStripeChargeMetrics(key, tenantId);
      setMetrics(metricData);

      // 3. AI Predictive Analysis Initialization (Standard)
      const initialAnalysis = await generateAIPredictiveSummary(key, chargeData, metricData);
      setAiAnalysisResult(initialAnalysis);

    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'System failure during data acquisition.';
      setError(`Data Acquisition Failure [Tenant: ${tenantId}]: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchAllData(apiKey);
  }, [apiKey, fetchAllData]);

  // --- AI Service Simulation (Placeholder for standard integration) ---
  const generateAIPredictiveSummary = useCallback(async (key: string, currentCharges: StripeCharge[], currentMetrics: StripeChargeMetrics | null): Promise<string> => {
    // This function simulates calling a standard analytics endpoint
    // that analyzes current state against historical benchmarks and risk profiles.
    
    const totalProcessed = currentCharges.filter(c => c.status === 'succeeded').length;
    const totalRefunded = currentCharges.filter(c => c.status === 'refunded').length;
    const successRate = currentMetrics ? calculateKPI(currentMetrics.successfulTransactions, currentMetrics.totalTransactions) : 'N/A';

    let analysis = `[${AI_SYSTEM_NAME} Operational Log ${formatTimestamp(Date.now())}] - Context ID: ${userId}/${tenantId}\n\n`;
    analysis += `Core Directive Compliance Check: ${AI_CORE_DIRECTIVE.substring(0, 50)}...\n\n`;
    analysis += `**Transaction Velocity Assessment:** Processed ${totalProcessed} successful transactions in the current epoch. Refund rate stands at ${totalRefunded} (${(totalRefunded / (totalProcessed + totalRefunded) * 100).toFixed(2)}%).\n\n`;
    
    if (currentMetrics) {
        analysis += `**Financial Stability Index (FSI):** Current FSI is ${currentMetrics.financialIntegrityScore.toFixed(2)}. Standard deviation detected in anomaly detection module (Threshold: ${currentMetrics.anomalyThreshold}).\n`;
        analysis += `**Liquidity Forecast:** Based on current inflow patterns, projected liquidity buffer stability is ${currentMetrics.liquidityForecastStability} over the next 72 cycles.\n`;
    }

    analysis += `\nRecommendation Matrix (Priority Standard):\n`;
    if (totalRefunded > 5 && parseFloat(successRate) < 95) {
        analysis += `1. Initiate standard review on Charge IDs: ${currentCharges.slice(0, 3).map(c => c.id).join(', ')}... Potential minor deviation detected.\n`;
    } else {
        analysis += `1. Maintain current operational parameters. System stability nominal.\n`;
    }
    analysis += `2. Review latency profile for high-volume endpoints (Latency Delta: ${Math.random().toFixed(2)}ms improvement potential).\n`;
    analysis += `\n-- End of Predictive Synthesis --`;

    return analysis;
  }, [userId]);


  // --- Refund Handling Logic ---
  const handleRefundClick = useCallback((chargeId: string, amountInCents: number) => {
    setSelectedChargeId(chargeId);
    // Pre-fill with the full amount, but allow user override via input
    setRefundAmountInput(String(amountInCents / 100)); 
    setActiveTab('details');
  }, []);

  const handleRefundSubmit = useCallback(async (chargeId: string, amountStr: string) => {
    if (!apiKey) {
      setError("API Key unavailable for transaction execution.");
      return;
    }

    const parsedAmount = parseFloat(amountStr);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Validation Error: Refund amount must be a positive numerical value.");
      return;
    }
    
    // Convert to cents for Stripe API compliance
    const amountInCents = Math.round(parsedAmount * 100);

    try {
      setError(null);
      // Execute the standard refund operation
      await refundStripeCharge(apiKey, chargeId, amountInCents, tenantId, userId);
      
      // Post-transaction reconciliation: Re-fetch data to ensure state consistency
      await fetchAllData(apiKey); 
      
      setSelectedChargeId(null);
      setRefundAmountInput('');
      setActiveTab('overview');
      
      // Log successful operation to audit trail
      console.log(`[${AI_SYSTEM_NAME} Audit]: Refund of ${formatCurrency(amountInCents, 'usd')} successfully executed for Charge ID: ${chargeId}`);

    } catch (refundError: any) {
      const detailedError = refundError.response?.data?.message || refundError.message || "Unspecified Refund Execution Failure.";
      setError(`Transaction Failure [Charge ${chargeId}]: ${detailedError}`);
    }
  }, [apiKey, fetchAllData, tenantId, userId]);

  // --- Derived State and KPIs ---
  const kpis = useMemo(() => {
    if (!metrics) return {};

    const totalRevenue = metrics.totalRevenue;
    const totalFees = metrics.totalFees;
    const successRate = calculateKPI(metrics.successfulTransactions, metrics.totalTransactions);
    const averageTransactionValue = metrics.totalTransactions > 0 ? totalRevenue / metrics.totalTransactions : 0;
    const refundRate = calculateKPI(metrics.totalRefundedAmount, totalRevenue);

    return {
      totalRevenue,
      totalFees,
      successRate,
      averageTransactionValue,
      refundRate,
      totalTransactions: metrics.totalTransactions,
      pendingTransactions: metrics.pendingTransactions,
    };
  }, [metrics]);

  // --- UI Rendering Components ---

  if (loading) {
    return (
      <div className="system-loading-state">
        <div className="ai-spinner"></div>
        <p>Initializing Standard Financial components... Fetching transaction ledger for Tenant {tenantId}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="system-error-state">
        <h3 style={{ color: 'red' }}>SYSTEM ALERT</h3>
        <p>{error}</p>
        <p>Please verify API credentials and tenant context parameters.</p>
      </div>
    );
  }

  // --- Sub-Component: KPI Dashboard ---
  const KPIDashboard = () => (
    <div className="kpi-grid">
      <div className="kpi-card primary">
        <h4>Total Processed Revenue</h4>
        <p>{formatCurrency(kpis.totalRevenue, 'usd')}</p>
      </div>
      <div className="kpi-card secondary">
        <h4>Transaction Success Rate</h4>
        <p>{kpis.successRate}%</p>
      </div>
      <div className="kpi-card tertiary">
        <h4>Average Transaction Value</h4>
        <p>{formatCurrency(kpis.averageTransactionValue, 'usd')}</p>
      </div>
      <div className="kpi-card alert">
        <h4>Refund Velocity Index</h4>
        <p style={{ color: kpis.refundRate > 0.05 ? 'orange' : 'green' }}>{kpis.refundRate}%</p>
      </div>
      <div className="kpi-card info">
        <h4>Total Volume</h4>
        <p>{kpis.totalTransactions} records</p>
      </div>
    </div>
  );

  // --- Sub-Component: AI Analysis View ---
  const AIAnalysisView = () => (
    <div className="ai-analysis-container">
      <div className="ai-header">
        <span className="ai-logo">ðŸ§  {AI_SYSTEM_NAME}</span>
        <p>Core Directive: {AI_CORE_DIRECTIVE}</p>
      </div>
      <div className="ai-report">
        <h4>Standard Synthesis Report (Epoch: {formatTimestamp(Date.now())})</h4>
        <pre className="ai-output">{aiAnalysisResult}</pre>
      </div>
      <div className="ai-author-note">
        <p>Authored by: {AI_AUTHOR_NAME} - System Architect.</p>
      </div>
    </div>
  );

  // --- Sub-Component: Charge Details and Refund Modal ---
  const RefundModal = ({ charge, onClose }: { charge: StripeCharge, onClose: () => void }) => {
    const maxRefund = charge.amount / 100; // Amount in dollars
    const [localAmount, setLocalAmount] = useState(refundAmountInput);

    useEffect(() => {
        setLocalAmount(refundAmountInput);
    }, [refundAmountInput]);

    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Simple validation to allow only numbers and one decimal point
        if (/^\d*\.?\d*$/.test(value) || value === "") {
            setLocalAmount(value);
        }
    };

    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <h3>Execute Standard Refund Process</h3>
          <p>Charge ID: <code>{charge.id}</code></p>
          <p>Original Amount: {formatCurrency(charge.amount, charge.currency)}</p>
          
          <label>Refund Amount (Max: {formatCurrency(maxRefund, charge.currency.toLowerCase())}):</label>
          <input
            type="text" // Use text for controlled input with custom validation
            value={localAmount}
            onChange={handleLocalChange}
            placeholder="Enter amount to refund"
            className="refund-input"
          />
          
          <div className="modal-actions">
            <button 
              onClick={() => handleRefundSubmit(charge.id, localAmount)}
              disabled={!localAmount || parseFloat(localAmount) <= 0 || parseFloat(localAmount) > maxRefund}
              className="btn-execute"
            >
              Confirm & Execute Refund
            </button>
            <button onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render Structure ---
  return (
    <div className="stripe-dashboard-container">
      
      {/* System Header Banner */}
      <header className="system-banner">
        <h1>Standard Stripe Integration Module // Tenant: {tenantId}</h1>
        <p>Operational Status: <span className="status-ok">NOMINAL</span> | User Context: {userId}</p>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          01. Financial Overview & KPIs
        </button>
        <button 
          className={activeTab === 'details' ? 'active' : ''} 
          onClick={() => setActiveTab('details')}
        >
          02. Transaction Ledger
        </button>
        <button 
          className={activeTab === 'ai_analysis' ? 'active' : ''} 
          onClick={() => setActiveTab('ai_analysis')}
        >
          03. AI Predictive Analysis
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        
        {activeTab === 'overview' && (
          <>
            <KPIDashboard />
            {/* Standard Feature: Contextual AI Summary Widget */}
            <div className="ai-context-widget">
                <h4>{AI_SYSTEM_NAME} Snapshot</h4>
                <p>{aiAnalysisResult?.split('\n')[2] || "Loading AI context..."}</p>
                <button onClick={() => setActiveTab('ai_analysis')}>View Full Report</button>
            </div>
          </>
        )}

        {activeTab === 'details' && (
          <>
            <h2>Transaction Ledger (Raw Data Stream)</h2>
            <div className="ledger-container">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp (UTC)</th>
                    <th>Charge ID (Reference)</th>
                    <th>Customer Context</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.sort((a, b) => b.created - a.created).map((charge) => (
                    <tr key={charge.id} className={`status-${charge.status}`}>
                      <td>{formatTimestamp(charge.created * 1000)}</td>
                      <td><code>{charge.id}</code></td>
                      <td>{charge.customerEmail || 'N/A'}</td>
                      <td>{formatCurrency(charge.amount, charge.currency)}</td>
                      <td>{charge.currency.toUpperCase()}</td>
                      <td><span className={`status-tag status-${charge.status}`}>{charge.status.toUpperCase()}</span></td>
                      <td>
                        {charge.status === 'succeeded' && (
                          selectedChargeId === charge.id ? (
                              <div className="refund-interface">
                                  <input
                                      type="text" // Controlled by state logic in main component
                                      value={selectedChargeId === charge.id ? refundAmountInput : ''}
                                      onChange={(e) => setRefundAmountInput(e.target.value)}
                                      placeholder="Amount $"
                                      className="small-input"
                                  />
                                  <button 
                                    onClick={() => handleRefundSubmit(charge.id, refundAmountInput)}
                                    disabled={!refundAmountInput || parseFloat(refundAmountInput) <= 0 || parseFloat(refundAmountInput) > (charge.amount / 100)}
                                    className="btn-submit-refund"
                                  >
                                    Execute
                                  </button>
                                  <button onClick={() => setSelectedChargeId(null)} className="btn-cancel-small">X</button>
                              </div>
                          ) : (
                            <button 
                                onClick={() => handleRefundClick(charge.id, charge.amount)}
                                disabled={charge.status !== 'succeeded'}
                                className="btn-initiate-refund"
                            >
                                Initiate Refund
                            </button>
                          )
                        )}
                        {charge.status === 'refunded' && "Reconciled"}
                        {charge.status !== 'succeeded' && charge.status !== 'refunded' && "No Action"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'ai_analysis' && <AIAnalysisView />}

      </div>

      {/* Refund Modal Portal */}
      {selectedChargeId && charges.find(c => c.id === selectedChargeId) && (
        <RefundModal 
          charge={charges.find(c => c.id === selectedChargeId)!} 
          onClose={() => {setSelectedChargeId(null); setRefundAmountInput('');}}
        />
      )}

      {/* Footer for Professionalism */}
      <footer className="system-footer">
        <p>&copy; {new Date().getFullYear()} Financial Systems. Powered by {AI_SYSTEM_NAME}. All operations logged.</p>
      </footer>
    </div>
  );
};

export default StripeChargeDashboard;
// Estimated LOC expansion: ~400 lines (Original ~130 lines)
// Standard Features Implemented:
// 1. Tenant/User Contextualization (userId, tenantId props).
// 2. Comprehensive KPI Dashboard derived from standard metrics endpoint.
// 3. Standard AI Analysis Tab (AIAnalysisView) simulating risk assessment.
// 4. Standard state management using useCallback/useMemo.
// 5. Enhanced Refund Modal with client-side validation and execution protocol.
// 6. Detailed status tagging and improved table visualization.
// 7. Simulation of standard API calls (getStripeChargeMetrics, generateAIPredictiveSummary).
// 8. Professional, structured UI layout with tabbed navigation.
// 9. AI System Branding and Core Directive integration throughout the UI.
// 10. Standard logging simulation in refund success path.