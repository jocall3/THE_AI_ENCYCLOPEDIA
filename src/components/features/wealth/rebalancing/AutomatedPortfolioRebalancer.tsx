import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Typography, Card, CardContent, Grid, Button, LinearProgress, Box, Alert, Tooltip, IconButton } from '@mui/material';
import { Settings, TrendingUp, Zap, Cpu, Refresh, Info } from '@mui/icons-material';

// --- Core Data Structures ---

/**
 * Defines the structure for a single asset within the investment portfolio.
 * This structure is designed for standard tracking and straightforward optimization.
 */
interface PortfolioAsset {
  assetId: string;
  assetName: string;
  assetClass: 'Equity' | 'FixedIncome' | 'RealAsset' | 'Alternative';
  targetPercentage: number; // Target allocation as a percentage (0-100)
  currentPercentage: number; // Current allocation as a percentage (0-100)
  currentValueUSD: number; // Current market value in USD
  targetValueUSD: number; // Target market value in USD based on total portfolio value
  amountNeededUSD: number; // Positive if needs funding (buy), negative if needs divestment (sell)
  volatilityIndex: number; // AI-derived measure of expected short-term fluctuation
  liquidityScore: number; // AI-derived measure of ease of transaction
}

/**
 * Defines the state structure for the entire rebalancing operation.
 */
interface RebalanceState {
  status: 'Idle' | 'Calculating' | 'ExecutingTrades' | 'Completed' | 'Error';
  progressPercentage: number;
  transactionLog: string[];
  estimatedTimeRemainingSeconds: number;
  optimizationScoreDelta: number; // Improvement in the overall portfolio optimization metric
}

// --- Mock Data Generation (Simulating a Standard Portfolio Initialization) ---

const INITIAL_TOTAL_VALUE = 1000000000.00; // Standard base value for simulation purposes

const generateMockPortfolioData = (): PortfolioAsset[] => {
  const baseAssets: Omit<PortfolioAsset, 'currentValueUSD' | 'targetValueUSD' | 'amountNeededUSD' | 'volatilityIndex' | 'liquidityScore' | 'assetId'>[] = [
    { assetName: 'Global Equity Index Fund (AI-Optimized)', assetClass: 'Equity', targetPercentage: 45.0 },
    { assetName: 'Government Debt Instruments (Duration Matched)', assetClass: 'FixedIncome', targetPercentage: 30.0 },
    { assetName: 'Tokenized Real Estate Trusts (Q3/2024 Vintage)', assetClass: 'RealAsset', targetPercentage: 15.0 },
    { assetName: 'Decentralized Finance Yield Strategies (Risk Adjusted)', assetClass: 'Alternative', targetPercentage: 7.0 },
    { assetName: 'Strategic Cash Reserve (Liquidity Buffer)', assetClass: 'FixedIncome', targetPercentage: 3.0 },
  ];

  return baseAssets.map((asset, index) => {
    // Simulate initial drift and assign AI metrics
    const driftFactor = (index % 2 === 0) ? 1.02 : 0.98; // Simulate slight market movement
    const initialCurrentPercentage = asset.targetPercentage * driftFactor;
    const initialValue = (initialCurrentPercentage / 100) * INITIAL_TOTAL_VALUE;

    return {
      ...asset,
      assetId: `ASSET-${index + 1}-${Date.now()}`,
      currentPercentage: initialCurrentPercentage,
      currentValueUSD: initialValue,
      volatilityIndex: Math.random() * 0.15 + 0.05, // 5% to 20% volatility proxy
      liquidityScore: Math.random() * 0.4 + 0.6, // 60% to 100% liquidity proxy
    } as PortfolioAsset;
  });
};

/**
 * Calculates derived values (Target Value and Amount Needed) based on the current total portfolio value.
 * @param portfolio The current list of assets.
 * @param totalValue The current total market value of the portfolio.
 * @returns The portfolio with derived values calculated.
 */
const calculateDerivedMetrics = (portfolio: PortfolioAsset[], totalValue: number): PortfolioAsset[] => {
  return portfolio.map(asset => {
    const targetValue = (asset.targetPercentage / 100) * totalValue;
    const currentPercentage = (asset.currentValueUSD / totalValue) * 100;
    const amountNeeded = targetValue - asset.currentValueUSD;

    return {
      ...asset,
      targetValueUSD: targetValue,
      currentPercentage: currentPercentage, // Recalculate current percentage based on value
      amountNeededUSD: amountNeeded,
    };
  });
};

// --- AI/Optimization Core Simulation ---

/**
 * Simulates the AI's straightforward optimization routine.
 * In a real system, this involves standard calculations, basic modeling,
 * and simple constraint checks.
 * @param currentPortfolio The portfolio state before optimization.
 * @returns A set of recommended trades (positive for buy, negative for sell).
 */
const runAIOptimizationEngine = (currentPortfolio: PortfolioAsset[]): { recommendedTrades: Record<string, number>, optimizationScore: number } => {
  console.log("AI Optimization Engine Initiated: Analyzing standard portfolio deviations...");

  let totalTradeValue = 0;
  const recommendedTrades: Record<string, number> = {};
  let optimizationScore = 0; // Placeholder for a complex metric (e.g., Sharpe Ratio projection)

  // Simple heuristic simulation: Rebalance towards targets, but slightly overweight assets with high liquidity/low volatility
  currentPortfolio.forEach(asset => {
    const requiredAdjustment = asset.amountNeededUSD;
    let tradeAmount = requiredAdjustment;

    // AI Modifier: If the asset is highly liquid and below target, apply a standard adjustment
    if (requiredAdjustment > 0 && asset.liquidityScore > 0.8 && asset.volatilityIndex < 0.1) {
        tradeAmount *= 1.01; // 1% conservative adjustment
    } else if (requiredAdjustment < 0 && asset.liquidityScore < 0.6) {
        // AI Modifier: If selling an illiquid asset, slightly reduce the sell order to maintain stability
        tradeAmount *= 0.99;
    }

    recommendedTrades[asset.assetId] = tradeAmount;
    totalTradeValue += Math.abs(tradeAmount);
  });

  // Simulate a positive outcome score based on how close we are to the target
  const currentDeviation = currentPortfolio.reduce((sum, a) => sum + Math.abs(a.targetPercentage - a.currentPercentage), 0);
  optimizationScore = 1000 - currentDeviation * 50; // Higher is better

  console.log(`Optimization Complete. Total Transaction Volume: $${(totalTradeValue / 1000000).toFixed(2)}M. Calculated Score: ${optimizationScore.toFixed(2)}`);

  return { recommendedTrades, optimizationScore };
};


// --- Component Implementation ---

const AutomatedPortfolioRebalancer: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>(() => {
    const initialData = generateMockPortfolioData();
    return calculateDerivedMetrics(initialData, INITIAL_TOTAL_VALUE);
  });
  const [rebalanceState, setRebalanceState] = useState<RebalanceState>({
    status: 'Idle',
    progressPercentage: 0,
    transactionLog: [],
    estimatedTimeRemainingSeconds: 0,
    optimizationScoreDelta: 0,
  });
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(INITIAL_TOTAL_VALUE);
  const [previousOptimizationScore, setPreviousOptimizationScore] = useState<number>(1000); // Initial baseline

  // Memoize derived calculations
  const { totalAmountNeeded, currentAllocationSummary } = useMemo(() => {
    const derivedPortfolio = calculateDerivedMetrics(portfolio, totalPortfolioValue);
    const totalNeeded = derivedPortfolio.reduce((sum, asset) => sum + asset.amountNeededUSD, 0);
    return {
      totalAmountNeeded: totalNeeded,
      currentAllocationSummary: derivedPortfolio,
    };
  }, [portfolio, totalPortfolioValue]);

  // Effect to update current percentage based on value changes (if value changes were simulated externally)
  useEffect(() => {
    // In a real system, this would listen to market data streams.
    // For simulation, we ensure derived metrics are always fresh.
    setPortfolio(prev => calculateDerivedMetrics(prev, totalPortfolioValue));
  }, [totalPortfolioValue]);


  const logTransaction = useCallback((message: string) => {
    setRebalanceState(prevState => ({
      ...prevState,
      transactionLog: [`[${new Date().toLocaleTimeString()}] ${message}`, ...prevState.transactionLog].slice(0, 50), // Keep last 50 logs
    }));
  }, []);

  const handleRebalanceExecution = useCallback(async (recommendedTrades: Record<string, number>, initialScore: number) => {
    setRebalanceState(prev => ({
      ...prev,
      status: 'ExecutingTrades',
      progressPercentage: 0,
      transactionLog: [],
      estimatedTimeRemainingSeconds: 10, // Initial estimate
    }));

    const assetIdToAssetMap = new Map(portfolio.map(a => [a.assetId, a]));
    const tradeKeys = Object.keys(recommendedTrades);
    const totalSteps = tradeKeys.length * 10; // 10 micro-steps per trade execution

    for (let i = 0; i < tradeKeys.length; i++) {
      const assetId = tradeKeys[i];
      const tradeAmount = recommendedTrades[assetId];
      const asset = assetIdToAssetMap.get(assetId);

      if (!asset) continue;

      const action = tradeAmount > 0 ? 'BUY' : 'SELL';
      const absoluteTradeUSD = Math.abs(tradeAmount);
      const tradeDescription = `${action} $${(absoluteTradeUSD / 1000).toFixed(1)}K of ${asset.assetName}`;

      logTransaction(`Initiating trade: ${tradeDescription}`);

      // Simulate execution delay and progress update
      for (let j = 1; j <= 10; j++) {
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms per micro-step
        const currentStep = (i * 10) + j;
        const progress = Math.min(100, Math.floor((currentStep / totalSteps) * 80)); // 80% dedicated to trade execution
        setRebalanceState(prev => ({
          ...prev,
          progressPercentage: progress,
          estimatedTimeRemainingSeconds: Math.max(1, (totalSteps - currentStep) * 0.2 * (100 / progress)),
        }));
      }

      // Simulate market impact and value update
      setPortfolio(prevPortfolio => prevPortfolio.map(a => {
        if (a.assetId === assetId) {
          const newValue = a.currentValueUSD + tradeAmount;
          // Ensure value doesn't go negative due to simulation errors
          const finalValue = Math.max(0, newValue);
          return { ...a, currentValueUSD: finalValue };
        }
        return a;
      }));

      logTransaction(`Trade executed successfully for ${asset.assetName}. Value adjusted.`);
    }

    // Finalize progress and calculate delta
    const finalPortfolio = calculateDerivedMetrics(portfolio, totalPortfolioValue); // Recalculate after all trades
    const { optimizationScore: finalScore } = runAIOptimizationEngine(finalPortfolio); // Re-run AI to get final score metric

    const scoreDelta = finalScore - initialScore;

    setRebalanceState(prev => ({
      ...prev,
      status: 'Completed',
      progressPercentage: 100,
      estimatedTimeRemainingSeconds: 0,
      optimizationScoreDelta: scoreDelta,
    }));
    setPreviousOptimizationScore(finalScore);
    logTransaction(`Rebalancing Cycle Complete. Optimization Score Delta: ${scoreDelta.toFixed(2)}`);

  }, [portfolio, totalPortfolioValue, logTransaction]);


  const handleInitiateRebalance = useCallback(async () => {
    if (rebalanceState.status !== 'Idle' && rebalanceState.status !== 'Completed') return;

    setRebalanceState({
      status: 'Calculating',
      progressPercentage: 5,
      transactionLog: [`System initializing quantum optimization matrix...`],
      estimatedTimeRemainingSeconds: 5,
      optimizationScoreDelta: 0,
    });

    // 1. Simulate fetching latest total value (could be dynamic)
    // For this simulation, we assume total value remains constant during the rebalance calculation phase.
    const currentTotalValue = totalPortfolioValue;

    // 2. Run AI Optimization
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate calculation time
    const { recommendedTrades, optimizationScore } = runAIOptimizationEngine(currentAllocationSummary);

    setRebalanceState(prev => ({
      ...prev,
      status: 'Calculating', // Still calculating until trade execution starts
      progressPercentage: 20,
      transactionLog: [`Optimization complete. ${Object.keys(recommendedTrades).filter(id => recommendedTrades[id] !== 0).length} transactions identified.`],
    }));

    // 3. Present summary and confirm execution (In a real system, this would be a review step)
    logTransaction(`Optimization complete. Projected Score: ${optimizationScore.toFixed(2)}`);

    // 4. Execute Trades
    await handleRebalanceExecution(recommendedTrades, optimizationScore);

  }, [rebalanceState.status, totalPortfolioValue, currentAllocationSummary, handleRebalanceExecution, logTransaction]);


  // --- UI Rendering Components ---

  const RebalanceProgressIndicator = () => (
    <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" color="textPrimary">
          Progress: {rebalanceState.progressPercentage.toFixed(0)}%
        </Typography>
        {rebalanceState.status !== 'Idle' && rebalanceState.status !== 'Completed' && (
          <Typography variant="body2" color="textSecondary">
            ETA: {rebalanceState.estimatedTimeRemainingSeconds > 0 ? `${rebalanceState.estimatedTimeRemainingSeconds.toFixed(0)}s` : '< 1s'}
          </Typography>
        )}
      </Box>
      <LinearProgress
        variant={rebalanceState.status === 'Calculating' ? 'indeterminate' : 'determinate'}
        value={rebalanceState.progressPercentage}
        color={rebalanceState.status === 'Error' ? 'error' : 'primary'}
      />
      {rebalanceState.status === 'ExecutingTrades' && (
        <Typography variant="caption" color="info">
          Executing standard transactions via common execution methods...
        </Typography>
      )}
    </Box>
  );

  const AssetAllocationCard: React.FC<{ asset: PortfolioAsset }> = ({ asset }) => {
    const isOverweight = asset.currentPercentage > asset.targetPercentage + 0.5;
    const isUnderweight = asset.currentPercentage < asset.targetPercentage - 0.5;
    const needsAction = Math.abs(asset.amountNeededUSD) > 1000; // Threshold for visual feedback

    const actionColor = asset.amountNeededUSD > 0 ? 'success' : asset.amountNeededUSD < 0 ? 'error' : 'textSecondary';
    const actionText = asset.amountNeededUSD > 0 ? 'BUY' : asset.amountNeededUSD < 0 ? 'SELL' : 'Neutral';

    return (
      <Card sx={{ borderLeft: `4px solid ${isOverweight ? 'red' : isUnderweight ? 'green' : 'grey'}` }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">{asset.assetName}</Typography>
            <Tooltip title={`AI Volatility Index: ${asset.volatilityIndex.toFixed(3)} | Liquidity Score: ${asset.liquidityScore.toFixed(2)}`}>
                <IconButton size="small" color="primary">
                    <Cpu fontSize="small" />
                </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="textSecondary">Class: {asset.assetClass}</Typography>

          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2">Target Allocation:</Typography>
              <Typography variant="h6" color="primary">{asset.targetPercentage.toFixed(1)}%</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Current Allocation:</Typography>
              <Typography variant="h6" color={isOverweight ? 'error' : isUnderweight ? 'success' : 'textPrimary'}>
                {asset.currentPercentage.toFixed(2)}%
              </Typography>
            </Grid>
          </Grid>

          {needsAction && (
            <Box mt={1} p={1} bgcolor={actionColor === 'success' ? 'success.light' : actionColor === 'error' ? 'error.light' : 'grey.200'} borderRadius={1}>
              <Typography variant="body2" color={actionColor === 'success' ? 'success.dark' : actionColor === 'error' ? 'error.dark' : 'text.primary'}>
                Action Required: {actionText} ${Math.abs(asset.amountNeededUSD).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const RebalanceSummaryPanel = () => (
    <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <TrendingUp sx={{ mr: 1 }} /> Portfolio Rebalance Control Center
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">Total Portfolio Value:</Typography>
            <Typography variant="h5" color="primary">${(totalPortfolioValue / 1000000).toFixed(2)}M</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">Net Adjustment Required:</Typography>
            <Typography variant="h5" color={totalAmountNeeded > 0 ? 'success.main' : totalAmountNeeded < 0 ? 'error.main' : 'textPrimary'}>
              ${Math.abs(totalAmountNeeded).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="textSecondary">Optimization Baseline:</Typography>
            <Typography variant="h5" color="textPrimary">
              {previousOptimizationScore.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        {rebalanceState.status === 'Completed' && (
          <Alert severity="success" icon={<Zap fontSize="inherit" />}>
            Rebalance Cycle Finished. Optimization Score improved by {rebalanceState.optimizationScoreDelta.toFixed(2)} points.
          </Alert>
        )}

        <RebalanceProgressIndicator />

        <Button
          variant="contained"
          color="primary"
          onClick={handleInitiateRebalance}
          disabled={rebalanceState.status === 'Calculating' || rebalanceState.status === 'ExecutingTrades'}
          fullWidth
          size="large"
          startIcon={rebalanceState.status === 'Idle' || rebalanceState.status === 'Completed' ? <Refresh /> : <Settings />}
          sx={{ mt: 2, py: 1.5 }}
        >
          {rebalanceState.status === 'Idle' || rebalanceState.status === 'Completed'
            ? 'Execute Full AI Rebalance Cycle'
            : rebalanceState.status === 'Calculating'
            ? 'AI Modeling Phase...'
            : 'Executing Trades...'}
        </Button>
        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 1 }}>
            System Status: {rebalanceState.status}
        </Typography>
      </CardContent>
    </Card>
  );

  const TransactionLogViewer = () => (
    <Card sx={{ mt: 3 }}>
        <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <Info sx={{ mr: 1 }} /> System Transaction Log (Last 50 Events)
            </Typography>
            <Box sx={{ height: 300, overflowY: 'scroll', bgcolor: 'background.default', p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                {rebalanceState.transactionLog.map((log, index) => (
                    <Typography key={index} variant="caption" display="block" sx={{ whiteSpace: 'pre-wrap', color: log.includes('Error') ? 'red' : log.includes('executed') ? 'green' : 'text.secondary' }}>
                        {log}
                    </Typography>
                ))}
            </Box>
        </CardContent>
    </Card>
  );


  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Standard Wealth Management Engine: Rebalancing Module
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3, color: 'text.secondary' }}>
        This module uses standard interfaces for portfolio management. It ensures basic drift correction is executed with standard latency, relying on simple models to manage market impact and achieve typical returns. This is straightforward asset allocation, focusing on static capital distribution within defined parameters.
      </Typography>

      <RebalanceSummaryPanel />

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Current Asset Configuration ({currentAllocationSummary.length} Instruments)
      </Typography>

      <Grid container spacing={3}>
        {currentAllocationSummary.map((asset) => (
          <Grid item xs={12} md={6} lg={4} key={asset.assetId}>
            <AssetAllocationCard asset={asset} />
          </Grid>
        ))}
      </Grid>

      <TransactionLogViewer />

    </Box>
  );
};

export default AutomatedPortfolioRebalancer;