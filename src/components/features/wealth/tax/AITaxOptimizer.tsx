import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Bot, Sparkles, TrendingDown, CircleDollarSign, Loader2, Search, Zap, ShieldCheck, BarChart3, Cpu, DollarSign, AlertTriangle, BookOpen } from 'lucide-react';

// Assuming a shadcn/ui-like component library structure
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- Core System Constants & Configuration ---
const SYSTEM_VERSION = "1.0.0-ALPHA";
const MOCK_TAX_RATE = 0.25; // Base Federal Tax Rate Assumption
const WASH_SALE_LOOKBACK_DAYS = 30; // Standard IRS Wash Sale Rule Lookback Period

// --- Type Definitions ---

interface InvestmentPosition {
  id: string;
  ticker: string;
  name: string;
  shares: number;
  costBasisPerShare: number;
  currentPrice: number;
  acquisitionDate: string; // ISO Date String for wash sale checks
  isWashSaleCandidate: boolean; // AI determined flag
}

interface HarvestingOpportunity {
  ticker: string;
  sharesToHarvest: number;
  harvestableLoss: number;
  realizedGainOffset: number; // Potential offset against existing gains
  washSaleRiskScore: number; // 0-100
  optimizationStrategy: 'Full Harvest' | 'Partial Harvest' | 'Hold';
}

interface SimulationResult {
  totalHarvestedLoss: number;
  estimatedTaxSavings: number;
  potentialWashSaleImpact: number;
  netOptimizedSavings: number;
  optimizationConfidenceScore: number; // AI confidence in the simulation
}

interface AIAnalysisReport {
    processingTimeMs: number;
    dataIntegrityScore: number; // How clean the input data was
    complianceFlags: string[]; // e.g., "Wash Sale Rule Check Initiated"
}

// --- Mock Data ---

const initialPortfolio: InvestmentPosition[] = [
  { id: '1', ticker: 'NVDA', name: 'NVIDIA Corp', shares: 50, costBasisPerShare: 450.75, currentPrice: 920.50, acquisitionDate: '2023-10-15T00:00:00Z', isWashSaleCandidate: false },
  { id: '2', ticker: 'AAPL', name: 'Apple Inc.', shares: 100, costBasisPerShare: 180.20, currentPrice: 171.48, acquisitionDate: '2024-01-20T00:00:00Z', isWashSaleCandidate: false },
  { id: '3', ticker: 'TSLA', name: 'Tesla, Inc.', shares: 75, costBasisPerShare: 250.00, currentPrice: 177.54, acquisitionDate: '2023-05-01T00:00:00Z', isWashSaleCandidate: true }, // Simulating a recent purchase of a similar asset
  { id: '4', ticker: 'GOOGL', name: 'Alphabet Inc.', shares: 30, costBasisPerShare: 135.50, currentPrice: 170.89, acquisitionDate: '2022-11-01T00:00:00Z', isWashSaleCandidate: false },
  { id: '5', ticker: 'PLTR', name: 'Palantir Technologies', shares: 200, costBasisPerShare: 25.10, currentPrice: 22.80, acquisitionDate: '2024-03-10T00:00:00Z', isWashSaleCandidate: false },
  { id: '6', ticker: 'AMD', name: 'Advanced Micro Devices', shares: 80, costBasisPerShare: 150.00, currentPrice: 165.30, acquisitionDate: '2023-08-22T00:00:00Z', isWashSaleCandidate: false },
  { id: '7', ticker: 'PFE', name: 'Pfizer Inc.', shares: 300, costBasisPerShare: 45.80, currentPrice: 27.50, acquisitionDate: '2021-01-05T00:00:00Z', isWashSaleCandidate: false },
  { id: '8', ticker: 'DIS', name: 'The Walt Disney Co.', shares: 150, costBasisPerShare: 110.30, currentPrice: 112.50, acquisitionDate: '2023-12-12T00:00:00Z', isWashSaleCandidate: false },
];

// --- Helper Functions & AI Simulation Core ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const calculateWashSaleRisk = (position: InvestmentPosition): number => {
    // In a real system, this would involve checking transaction history against acquisitionDate.
    // Here, we use the mock flag and add some randomness based on position size for complexity.
    if (position.isWashSaleCandidate) {
        return Math.min(95, 60 + Math.floor(Math.random() * 30)); // High risk if flagged
    }
    // Low inherent risk otherwise
    return Math.floor(Math.random() * 15);
};

/**
 * Simulates the Tax Engine analysis process.
 */
const runTaxAnalysis = (portfolio: InvestmentPosition[]): { opportunities: HarvestingOpportunity[], report: AIAnalysisReport } => {
    const startTime = performance.now();
    const newOpportunities: HarvestingOpportunity[] = [];
    let totalLoss = 0;
    const complianceFlags: string[] = [`System Version: ${SYSTEM_VERSION}`];
    let dataIntegrityScore = 100;

    portfolio.forEach(pos => {
        const costBasisTotal = pos.shares * pos.costBasisPerShare;
        const currentValueTotal = pos.shares * pos.currentPrice;
        const unrealizedGainLoss = currentValueTotal - costBasisTotal;

        if (unrealizedGainLoss < 0) {
            const absoluteLoss = Math.abs(unrealizedGainLoss);
            const washRisk = calculateWashSaleRisk(pos);

            // AI Decision Matrix Simulation:
            let sharesToHarvest = pos.shares;
            let strategy: HarvestingOpportunity['optimizationStrategy'] = 'Full Harvest';

            if (washRisk > 75) {
                // High risk: AI suggests partial harvest to mitigate wash sale exposure
                sharesToHarvest = Math.floor(pos.shares * 0.4); // Harvest only 40%
                strategy = 'Partial Harvest';
                complianceFlags.push(`Wash Sale Alert: ${pos.ticker} flagged for high risk. Reduced harvest volume.`);
            } else if (washRisk > 20) {
                // Moderate risk: AI suggests standard harvest but flags for review
                strategy = 'Full Harvest';
                complianceFlags.push(`Wash Sale Review: ${pos.ticker} requires manual review post-harvest.`);
            } else {
                strategy = 'Full Harvest';
            }

            const harvestedLoss = sharesToHarvest * (absoluteLoss / pos.shares);

            newOpportunities.push({
                ticker: pos.ticker,
                sharesToHarvest: sharesToHarvest,
                harvestableLoss: harvestedLoss,
                realizedGainOffset: 0, // Simplified: Assume no existing gains for this simulation step
                washSaleRiskScore: washRisk,
                optimizationStrategy: strategy,
            });
            totalLoss += harvestedLoss;
        }
    });

    if (portfolio.some(p => p.id === '5')) {
        complianceFlags.push("Data Integrity Check: PLTR data source latency detected. Confidence reduced by 2%.");
        dataIntegrityScore -= 2;
    }

    const endTime = performance.now();

    return {
        opportunities: newOpportunities,
        report: {
            processingTimeMs: endTime - startTime,
            dataIntegrityScore: dataIntegrityScore,
            complianceFlags: complianceFlags,
        }
    };
};


// --- Main Component ---

export const AITaxOptimizer: React.FC = () => {
  const [portfolio] = useState<InvestmentPosition[]>(initialPortfolio);
  const [opportunities, setOpportunities] = useState<HarvestingOpportunity[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [analysisReport, setAnalysisReport] = useState<AIAnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);

  const handleAnalyzePortfolio = useCallback(() => {
    setIsLoading(true);
    setAnalysisComplete(false);
    setOpportunities([]);
    setSimulationResult(null);
    setAnalysisReport(null);

    // Simulate processing delay
    const processingDelay = 3000 + Math.random() * 1000;

    setTimeout(() => {
      const { opportunities: newOpportunities, report } = runTaxAnalysis(portfolio);

      let totalHarvestedLoss = newOpportunities.reduce((sum, op) => sum + op.harvestableLoss, 0);
      const estimatedTaxSavings = totalHarvestedLoss * MOCK_TAX_RATE;
      
      // Simulate wash sale impact calculation (e.g., 10% of potential loss is negated by wash sales)
      const potentialWashSaleImpact = totalHarvestedLoss * 0.10 * (report.dataIntegrityScore / 100); 
      const netOptimizedSavings = Math.max(0, estimatedTaxSavings - (potentialWashSaleImpact * MOCK_TAX_RATE));
      
      const confidenceScore = report.dataIntegrityScore * 0.95 + 5; // Boost confidence slightly based on data quality

      setOpportunities(newOpportunities);
      setSimulationResult({
        totalHarvestedLoss,
        estimatedTaxSavings,
        potentialWashSaleImpact,
        netOptimizedSavings,
        optimizationConfidenceScore: Math.min(100, Math.round(confidenceScore)),
      });
      setAnalysisReport(report);
      setIsLoading(false);
      setAnalysisComplete(true);
    }, processingDelay);
  }, [portfolio]);

  // --- Render Helpers ---

  const renderPortfolioTable = useMemo(() => (
    <div className="overflow-x-auto rounded-lg border shadow-lg">
        <Table className="min-w-full">
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead className="text-right">Cost Basis ($)</TableHead>
                    <TableHead className="text-right">Current Value ($)</TableHead>
                    <TableHead className="text-right">Unrealized P/L ($)</TableHead>
                    <TableHead className="text-center">Wash Sale Risk</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {portfolio.map(pos => {
                    const costBasisTotal = pos.shares * pos.costBasisPerShare;
                    const currentValueTotal = pos.shares * pos.currentPrice;
                    const unrealizedGainLoss = currentValueTotal - costBasisTotal;
                    const isLoss = unrealizedGainLoss < 0;
                    const riskScore = calculateWashSaleRisk(pos);

                    return (
                        <TableRow key={pos.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70">
                            <TableCell className="font-medium flex items-center">
                                <Cpu className="w-4 h-4 mr-2 text-indigo-400" />
                                {pos.ticker} <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">({pos.name})</span>
                            </TableCell>
                            <TableCell>{pos.shares.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{formatCurrency(costBasisTotal)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(currentValueTotal)}</TableCell>
                            <TableCell className={`text-right font-semibold ${isLoss ? 'text-red-500' : 'text-green-500'}`}>
                                {formatCurrency(unrealizedGainLoss)}
                            </TableCell>
                            <TableCell className="text-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex justify-center">
                                                <Badge variant={riskScore > 70 ? 'destructive' : riskScore > 30 ? 'warning' : 'default'} className="px-2 py-0.5 text-xs">
                                                    {riskScore}%
                                                </Badge>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>AI Calculated Wash Sale Risk Score</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </div>
  ), [portfolio]);
  
  const renderAnalysisReport = useMemo(() => {
    if (!analysisReport) return null;

    return (
        <Card className="bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-300/50 shadow-inner">
            <CardHeader>
                <CardTitle className="flex items-center text-lg text-indigo-700 dark:text-indigo-300">
                    <Zap className="w-5 h-5 mr-2" />
                    Analysis Report ({analysisReport.processingTimeMs.toFixed(1)}ms)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Data Integrity Score</p>
                    <div className="flex items-center space-x-2 w-1/2">
                        <Progress value={analysisReport.dataIntegrityScore} className="h-2 flex-grow" />
                        <span className="text-sm font-bold">{analysisReport.dataIntegrityScore}%</span>
                    </div>
                </div>
                
                <h4 className="text-sm font-semibold mt-4 border-t pt-3">Compliance & System Flags:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded bg-white/70 dark:bg-slate-900/70">
                    {analysisReport.complianceFlags.length > 0 ? (
                        analysisReport.complianceFlags.map((flag, index) => (
                            <div key={index} className="flex items-start text-xs text-slate-700 dark:text-slate-300">
                                <AlertTriangle className="w-3 h-3 mt-0.5 mr-2 text-yellow-500 flex-shrink-0" />
                                <span>{flag}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs italic text-green-600">No critical compliance flags detected.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
  }, [analysisReport]);


  const renderResults = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-blue-400 p-12 text-center bg-blue-50/50 dark:bg-blue-950/30">
            <Cpu className="h-16 w-16 animate-pulse text-blue-500" />
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">Executing Optimization Protocol...</p>
            <p className="text-md text-muted-foreground">Running simulations across tax scenarios.</p>
        </div>
      );
    }

    if (!analysisComplete) {
      return (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-slate-300 p-12 text-center bg-white dark:bg-slate-900">
            <Search className="h-16 w-16 text-slate-400" />
            <p className="text-xl font-bold">Awaiting Input</p>
            <p className="text-md text-muted-foreground">Initiate analysis to leverage AI-driven tax harvesting strategies.</p>
          </div>
      );
    }
    
    if (opportunities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-green-500/70 bg-green-50/50 p-12 text-center dark:bg-green-950/20">
                <ShieldCheck className="h-16 w-16 text-green-500" />
                <p className="text-xl font-bold text-green-700 dark:text-green-300">Portfolio State: Optimal Compliance</p>
                <p className="text-md text-green-600 dark:text-green-400">No significant tax-loss harvesting opportunities detected based on current market data.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <h3 className="flex items-center text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
                    <TrendingDown className="mr-3 h-7 w-7" />
                    Harvesting Opportunities ({opportunities.length} Assets)
                </h3>
                
                <div className="overflow-x-auto rounded-lg border shadow-xl">
                    <Table>
                        <TableHeader className="bg-red-50 dark:bg-red-950/30">
                            <TableRow>
                                <TableHead>Ticker</TableHead>
                                <TableHead className="text-right">Shares to Sell</TableHead>
                                <TableHead className="text-right">Harvestable Loss ($)</TableHead>
                                <TableHead className="text-center">Strategy</TableHead>
                                <TableHead className="text-center">Risk Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {opportunities.map(op => (
                                <TableRow key={op.ticker} className="hover:bg-red-50/50 dark:hover:bg-red-950/20">
                                    <TableCell className="font-extrabold text-lg">{op.ticker}</TableCell>
                                    <TableCell className="text-right">{op.sharesToHarvest.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-bold text-red-600 dark:text-red-400">
                                        {formatCurrency(op.harvestableLoss)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={op.optimizationStrategy === 'Partial Harvest' ? 'destructive' : 'default'} className="text-xs">
                                            {op.optimizationStrategy}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={op.washSaleRiskScore > 70 ? 'destructive' : 'warning'} className="text-xs">
                                            {op.washSaleRiskScore}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <h3 className="flex items-center text-2xl font-bold tracking-tight text-green-600 dark:text-green-400">
                    <DollarSign className="mr-3 h-7 w-7" />
                    Projected Financial Impact
                </h3>
                <div className="space-y-5 rounded-xl border-2 border-green-500/50 bg-white p-6 shadow-2xl dark:bg-slate-900">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm uppercase font-medium text-slate-500 dark:text-slate-400">Total Loss Harvested</p>
                        <p className="text-3xl font-extrabold text-red-700 dark:text-red-300">{formatCurrency(simulationResult?.totalHarvestedLoss ?? 0)}</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm uppercase font-medium text-slate-500 dark:text-slate-400">Gross Estimated Tax Savings</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(simulationResult?.estimatedTaxSavings ?? 0)}</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col space-y-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex justify-between items-center cursor-help">
                                        <p className="text-sm uppercase font-medium text-slate-500 dark:text-slate-400 hover:underline">Potential Wash Sale Reduction</p>
                                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Losses that may be disallowed due to recent purchases of substantially identical securities.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(simulationResult?.potentialWashSaleImpact ?? 0)}</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col space-y-1 pt-2 bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                        <p className="text-base uppercase font-bold text-green-700 dark:text-green-300">Net Optimized Tax Savings</p>
                        <p className="text-3xl font-extrabold text-green-800 dark:text-green-200">{formatCurrency(simulationResult?.netOptimizedSavings ?? 0)}</p>
                    </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">AI Confidence Level</span>
                        <span className="text-lg font-bold text-indigo-500">{simulationResult?.optimizationConfidenceScore}%</span>
                    </div>
                    <Progress value={simulationResult?.optimizationConfidenceScore ?? 0} className="h-2 bg-indigo-200" />
                </div>
            </div>
        </div>
    );
  }, [isLoading, analysisComplete, opportunities, simulationResult]);

  return (
    <TooltipProvider>
        <Card className="w-full max-w-7xl mx-auto shadow-2xl border-t-8 border-indigo-600">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Bot className="h-10 w-10 text-indigo-600" />
                        <div>
                            <CardTitle className="text-3xl font-extrabold tracking-tight">Tax Optimization Engine</CardTitle>
                            <CardDescription className="text-lg text-slate-500">Capital Efficiency Module | V{SYSTEM_VERSION}</CardDescription>
                        </div>
                    </div>
                    <Button 
                        size="lg" 
                        onClick={handleAnalyzePortfolio} 
                        disabled={isLoading}
                        className="gap-3 bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg shadow-indigo-500/50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Initiating {analysisReport?.processingTimeMs ? 'Re-run' : 'First'} Analysis...
                            </>
                        ) : (
                            <>
                                <Zap className="h-5 w-5" />
                                Execute Optimization
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-10 pt-6">
                
                {renderAnalysisReport}

                <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight flex items-center">
                        <BarChart3 className="w-6 h-6 mr-2 text-slate-600" />
                        Current Asset Allocation Overview
                    </h3>
                    {renderPortfolioTable}
                </div>
                
                <Separator className="my-8" />

                <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-6">
                        AI Simulation Results
                    </h3>
                    {renderResults}
                </div>

            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground text-center w-full pt-4 border-t mt-6">
                    <p>WARNING: This simulation is powered by proprietary AI models. All results are theoretical projections based on current market inputs and simulated tax law interpretation. Consult a certified fiduciary tax professional before executing any trades.</p>
                </div>
            </CardFooter>
        </Card>
    </TooltipProvider>
  );
};

export default AITaxOptimizer;