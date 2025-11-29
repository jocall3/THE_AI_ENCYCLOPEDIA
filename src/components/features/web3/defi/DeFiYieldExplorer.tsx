import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Spinner,
  Alert,
} from '@material-tailwind/react';

// --- INTERFACE: Basic structure definition ---

interface HistoricalMetric {
  timestamp: number;
  value: number;
}

interface ProtocolAudit {
  auditor: string;
  status: 'Passed' | 'Minor Issues' | 'Critical Vulnerabilities';
  date: string;
  reportLink: string;
}

interface GovernanceDetails {
  proposalCount: number;
  votingPower: number;
  daoLink: string;
}

interface PoolData {
  protocol: string;
  poolName: string;
  tvl: number;
  apy: number;
  chain: string;
  liquidity: number;
  volume: number;
  // Expanded fields for deep analysis
  assetPair: [string, string];
  feeTier: number; // e.g., 0.003
  impermanentLossRiskIndex: number; // 0-100
  smartContractAddress: string;
  audits: ProtocolAudit[];
  governance: GovernanceDetails;
  historicalAPY: HistoricalMetric[];
  utilizationRate: number;
  isVault: boolean;
  isLeveraged: boolean;
}

interface AIAnalysis {
  riskScore: number; // 0-10
  recommendation: 'High Conviction Buy' | 'Neutral Hold' | 'Proceed with Caution' | 'Avoid' | 'Consider this opportunity';
  potentialGains: number;
  volatilityForecast: 'Low' | 'Medium' | 'High';
  liquidationRiskEstimate: number; // Percentage
  sentimentScore: number; // -1 to 1
  keyRiskFactors: string[];
  optimizationStrategy: string;
  simulatedPerformance: HistoricalMetric[];
}

interface UserPortfolioPosition {
  poolName: string;
  protocol: string;
  investedAmount: number;
  currentValue: number;
  entryDate: number;
  pnl: number;
  apyAtEntry: number;
}

interface AIAdvisorAgent {
  name: string;
  role: string;
  expertise: string;
  status: 'Online' | 'Busy' | 'Offline';
  lastInteraction: number;
}

interface KPI {
  name: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

const DeFiYieldExplorer: React.FC = () => {
  // --- STATE MANAGEMENT: Basic functionality ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [poolData, setPoolData] = useState<PoolData[]>([]);
  const [analyzedPools, setAnalyzedPools] = useState<{ [key: string]: AIAnalysis }>({});

  // New State Variables for OS features
  const [portfolio, setPortfolio] = useState<UserPortfolioPosition[]>([]);
  const [aiAgents, setAIAgents] = useState<AIAdvisorAgent[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedPoolDetail, setSelectedPoolDetail] = useState<PoolData | null>(null);
  const [optimizationSettings, setOptimizationSettings] = useState({ riskTolerance: 'medium', targetAPY: 10, rebalanceFrequency: 'weekly' });
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'ai', message: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof PoolData | 'riskScore'>('apy');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const chains = ['all', 'Ethereum', 'Polygon', 'Binance Smart Chain', 'Arbitrum', 'Optimism', 'Avalanche', 'Base'];

  // --- DATA GENERATION FUNCTIONS ---

  const generateHistoricalMetrics = (baseValue: number, periods: number): HistoricalMetric[] => {
    const data: HistoricalMetric[] = [];
    let currentValue = baseValue;
    for (let i = 0; i < periods; i++) {
      currentValue = currentValue * (1 + (Math.random() - 0.5) * 0.05); // Random fluctuation
      data.push({
        timestamp: Date.now() - (periods - i) * 86400000,
        value: Math.max(0.1, currentValue),
      });
    }
    return data;
  };

  const generateMockPoolData = (count: number): PoolData[] => {
    const protocols = ['Uniswap V3', 'Aave V2', 'Curve Finance', 'Compound V3', 'Balancer V2', 'GMX', 'Lido', 'Rocket Pool', 'Synthetix', 'MakerDAO', 'Frax Finance', 'Yearn Finance'];
    const chains = ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Avalanche', 'BNB Chain'];
    const assets = ['WETH', 'USDC', 'DAI', 'WBTC', 'LINK', 'UNI', 'AAVE', 'CRV', 'MATIC', 'ARB', 'OP', 'SOL'];
    const data: PoolData[] = [];

    for (let i = 1; i <= count; i++) {
      const protocol = protocols[i % protocols.length];
      const chain = chains[i % chains.length];
      const asset1 = assets[Math.floor(Math.random() * assets.length)];
      let asset2 = assets[Math.floor(Math.random() * assets.length)];
      while (asset1 === asset2) {
        asset2 = assets[Math.floor(Math.random() * assets.length)];
      }
      const poolName = `${asset1}/${asset2} LP ${i}`;
      const tvl = Math.random() * 5e9 + 1e7;
      const apy = Math.random() * 30 + 1;
      const liquidity = tvl * (0.8 + Math.random() * 0.2);
      const volume = tvl * (Math.random() * 0.1);

      data.push({
        protocol,
        poolName,
        tvl,
        apy,
        chain,
        liquidity,
        volume,
        assetPair: [asset1, asset2],
        feeTier: [0.0005, 0.003, 0.01][Math.floor(Math.random() * 3)],
        impermanentLossRiskIndex: Math.floor(Math.random() * 90) + 10,
        smartContractAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
        audits: [{ auditor: 'CertiK', status: 'Passed', date: '2023-10-01', reportLink: '#' }],
        governance: { proposalCount: Math.floor(Math.random() * 50), votingPower: Math.random() * 10000, daoLink: '#' },
        historicalAPY: generateHistoricalMetrics(apy, 90),
        utilizationRate: Math.random(),
        isVault: Math.random() > 0.7,
        isLeveraged: Math.random() > 0.9,
      });
    }
    return data;
  };

  // --- EFFECT HOOK: Component Setup ---
  useEffect(() => {
    const initializePlatformData = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 1. Fetch/Generate Pool Data (50 pools for a robust explorer)
        const mockData = generateMockPoolData(50);
        setPoolData(mockData);

        // 2. Initialize AI Agents
        setAIAgents([
          { name: 'Sentinel', role: 'Risk Management', expertise: 'Smart Contract Security, Market Volatility', status: 'Online', lastInteraction: Date.now() - 3600000 },
          { name: 'Oracle', role: 'Predictive Modeling', expertise: 'Yield Forecasting, Macro Trends', status: 'Online', lastInteraction: Date.now() - 120000 },
          { name: 'Custodian', role: 'Compliance & Reporting', expertise: 'Regulatory Frameworks, Tax Optimization', status: 'Busy', lastInteraction: Date.now() - 600000 },
          { name: 'Architect', role: 'System Oversight', expertise: 'Strategic Deployment, Resource Allocation', status: 'Online', lastInteraction: Date.now() - 10000 },
        ]);

        // 3. Initialize Portfolio (Mock)
        setPortfolio([
          { poolName: 'WETH/USDC LP 1', protocol: 'Uniswap V3', investedAmount: 50000, currentValue: 52500, entryDate: Date.now() - 86400000 * 30, pnl: 2500, apyAtEntry: 5.2 },
          { poolName: 'ETH Lending 2', protocol: 'Aave V2', investedAmount: 100000, currentValue: 101500, entryDate: Date.now() - 86400000 * 60, pnl: 1500, apyAtEntry: 2.1 },
          { poolName: 'WBTC/DAI LP 15', protocol: 'Curve Finance', investedAmount: 25000, currentValue: 23000, entryDate: Date.now() - 86400000 * 10, pnl: -2000, apyAtEntry: 7.8 },
        ]);

        // 4. Initialize KPIs
        setKpis([
          { name: 'Total Platform TVL', value: '12.5B', unit: 'USD', trend: 'up', description: 'Aggregated Total Value Locked across all integrated protocols.' },
          { name: 'Average Portfolio APY', value: 8.7, unit: '%', trend: 'up', description: 'Weighted average APY of all user portfolios.' },
          { name: 'Active AI Optimizations', value: 4521, unit: 'Processes', trend: 'stable', description: 'Number of currently running automated yield optimization strategies.' },
          { name: 'Protocol Risk Index', value: 2.3, unit: '/10', trend: 'down', description: 'System-wide average risk score based on Sentinel analysis.' },
        ]);

      } catch (err) {
        setError('Critical system initialization failure. Check API connectivity.');
        console.error('Initialization Error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializePlatformData();
  }, []);

  // --- HANDLERS AND PROCESSES ---

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChainChange = (value: string) => {
    setSelectedChain(value);
  };

  const analyzePool = async (pool: PoolData) => {
    if (analyzedPools[pool.poolName]) {
      setSelectedPoolDetail(pool);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complex AI simulation based on pool characteristics
      const baseRisk = pool.impermanentLossRiskIndex / 10;
      const riskScore = Math.min(10, baseRisk + (pool.isLeveraged ? 3 : 0) - (pool.audits.filter(a => a.status === 'Passed').length * 0.5) + (Math.random() * 1));

      let recommendation: AIAnalysis['recommendation'];
      if (riskScore < 3 && pool.apy > 5) {
        recommendation = 'High Conviction Buy';
      } else if (riskScore < 6 && pool.apy > 8) {
        recommendation = 'Consider this opportunity';
      } else if (riskScore < 8) {
        recommendation = 'Proceed with Caution';
      } else {
        recommendation = 'Avoid';
      }

      const mockAnalysis: AIAnalysis = {
        riskScore: parseFloat(riskScore.toFixed(1)),
        recommendation: recommendation,
        potentialGains: pool.tvl * (pool.apy / 100) * (0.01 + Math.random() * 0.05), // Simulated annual gain potential
        volatilityForecast: riskScore > 7 ? 'High' : riskScore > 4 ? 'Medium' : 'Low',
        liquidationRiskEstimate: pool.isLeveraged ? Math.random() * 15 : Math.random() * 1,
        sentimentScore: parseFloat((Math.random() * 2 - 1).toFixed(2)), // -1 to 1
        keyRiskFactors: ['Smart Contract Risk', 'Impermanent Loss', 'Governance Concentration', 'Oracle Dependency Risk'].filter(() => Math.random() > 0.3),
        optimizationStrategy: `Dynamic rebalancing targeting ${pool.assetPair[0]} dominance. Recommended entry size: ${pool.tvl * 0.001} USD.`,
        simulatedPerformance: generateHistoricalMetrics(pool.apy, 30),
      };

      setAnalyzedPools((prev) => ({ ...prev, [pool.poolName]: mockAnalysis }));
      setSelectedPoolDetail(pool);
    } catch (err) {
      setError(`Sentinel AI failed to analyze ${pool.poolName}.`);
      console.error(`Error analyzing pool ${pool.poolName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleAIChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setAiChatHistory(prev => [...prev, { sender: 'user', message: userMessage }]);
    setChatInput('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    let aiResponse = '';
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('optimize portfolio')) {
      aiResponse = "Acknowledged. Initiating 'Oracle' optimization sequence based on current risk profile. This process will take approximately 3 minutes. Current strategy: Maximize risk-adjusted APY using stablecoin pools on Arbitrum.";
      setIsOptimizing(true);
      setTimeout(() => {
        setOptimizationResults('Optimization complete. Recommended reallocation: 30% into Curve 3CRV, 20% into Aave ETH V3, 50% into GMX GLP. Projected APY increase: 1.2%.');
        setIsOptimizing(false);
      }, 5000);
    } else if (lowerMessage.includes('risk score') || lowerMessage.includes('sentinel')) {
      aiResponse = "Sentinel reports the current system-wide risk index is 2.3/10 (Low Volatility Regime). Key vulnerability: Potential regulatory changes impacting stablecoin collateralization. Protocols under enhanced surveillance: MakerDAO, Aave.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      aiResponse = "Hello. I am IDGAF-AI. How may I provide information or assist with data analysis today?";
    } else if (lowerMessage.includes('deploy capital')) {
      aiResponse = "Custodian Agent is preparing the transaction. Please specify the target pool and amount for execution.";
    } else {
      aiResponse = "Query received. Processing through Oracle's semantic analysis engine. Please refine your request for a more precise financial directive.";
    }

    setAiChatHistory(prev => [...prev, { sender: 'ai', message: aiResponse }]);
    setLoading(false);
  };

  // --- FILTERING AND SORTING PROCESSES ---

  const filteredPools = poolData.filter(
    (pool) =>
      (selectedChain === 'all' || pool.chain === selectedChain) &&
      (pool.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.poolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.chain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedPools = filteredPools.sort((a, b) => {
    let aValue: number;
    let bValue: number;

    if (sortKey === 'riskScore') {
      const aAnalysis = analyzedPools[a.poolName];
      const bAnalysis = analyzedPools[b.poolName];
      // Unanalyzed pools are treated as high risk (100) when sorting descending by risk, or low risk (0) when sorting ascending.
      aValue = aAnalysis ? aAnalysis.riskScore : (sortDirection === 'desc' ? 0 : 100);
      bValue = bAnalysis ? bAnalysis.riskScore : (sortDirection === 'desc' ? 0 : 100);
    } else {
      aValue = a[sortKey as keyof PoolData] as number;
      bValue = b[sortKey as keyof PoolData] as number;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // --- UI RENDERING FUNCTIONS (Standard implementation) ---

  const renderKPIDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {kpis.map((kpi) => (
        <Card key={kpi.name} className="p-4 shadow-xl border-t-4 border-blue-500">
          <Typography variant="small" color="blue-gray" className="font-bold uppercase opacity-70">
            {kpi.name}
          </Typography>
          <div className="flex items-end justify-between mt-1">
            <Typography variant="h4" color="blue-gray">
              {kpi.value}
              <span className="text-sm font-normal ml-1">{kpi.unit}</span>
            </Typography>
            <div className={`flex items-center text-sm font-bold ${kpi.trend === 'up' ? 'text-green-500' : kpi.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
              {kpi.trend === 'up' ? 'â–²' : kpi.trend === 'down' ? 'â–¼' : 'â€”'}
            </div>
          </div>
          <Typography variant="small" className="mt-2 text-gray-500 italic">
            {kpi.description}
          </Typography>
        </Card>
      ))}
    </div>
  );

  const renderAICommandCenter = () => (
    <Card className="p-6 shadow-2xl h-[600px] flex flex-col">
      <CardHeader color="blue" className="p-3 mb-4">
        <Typography variant="h5" color="white" className="text-center">
          IDGAF-AI Command Nexus
        </Typography>
      </CardHeader>
      <div className="flex-grow overflow-y-auto space-y-4 p-2 border rounded-lg mb-4 bg-gray-50">
        {aiChatHistory.map((chat, index) => (
          <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl shadow-md ${chat.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-blue-gray-800 rounded-tl-none border border-gray-200'}`}>
              <Typography variant="small" className="font-bold mb-1">
                {chat.sender === 'user' ? 'You (Architect)' : 'IDGAF-AI (Oracle/Sentinel)'}
              </Typography>
              <Typography variant="paragraph" className="text-sm">
                {chat.message}
              </Typography>
            </div>
          </div>
        ))}
        {isOptimizing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-xl shadow-md bg-yellow-100 text-yellow-800 rounded-tl-none border border-yellow-300 flex items-center">
              <Spinner color="yellow" size="sm" className="mr-2" />
              <Typography variant="paragraph" className="text-sm">
                Oracle Agent is executing portfolio optimization routine... Standby for directive.
              </Typography>
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto">
        {optimizationResults && (
          <Alert color="green" className="mb-3">
            <Typography variant="small" className="font-bold">Optimization Success:</Typography>
            <Typography variant="small">{optimizationResults}</Typography>
          </Alert>
        )}
        <div className="flex gap-2">
          <Input
            label="Directive for IDGAF-AI"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAIChat();
            }}
            disabled={loading || isOptimizing}
          />
          <Button onClick={handleAIChat} disabled={loading || isOptimizing || !chatInput.trim()}>
            Send Directive
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderPoolDetailAnalysis = () => {
    if (!selectedPoolDetail) return null;

    const pool = selectedPoolDetail;
    const analysis = analyzedPools[pool.poolName];

    const handleCloseDetail = () => setSelectedPoolDetail(null);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end">
        <Card className="w-full max-w-4xl h-full overflow-y-auto p-8 animate-slide-in-right">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <Typography variant="h3" color="blue-gray">
              {pool.poolName} Analysis Report
            </Typography>
            <Button variant="text" color="red" onClick={handleCloseDetail}>
              Close X
            </Button>
          </div>

          {/* Section 1: Core Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-blue-50">
              <Typography variant="small" className="font-bold text-blue-600">Protocol / Chain</Typography>
              <Typography variant="h6">{pool.protocol} on {pool.chain}</Typography>
            </Card>
            <Card className="p-4 bg-green-50">
              <Typography variant="small" className="font-bold text-green-600">Current APY</Typography>
              <Typography variant="h4" className="text-green-700">{pool.apy.toFixed(2)}%</Typography>
            </Card>
            <Card className="p-4 bg-gray-50">
              <Typography variant="small" className="font-bold text-gray-600">Total Value Locked (TVL)</Typography>
              <Typography variant="h5">${pool.tvl.toLocaleString('en-US', { notation: 'compact' })}</Typography>
            </Card>
          </div>

          {/* Section 2: Sentinel AI Risk Assessment */}
          <Card className="p-6 mb-6 shadow-xl border-l-4 border-red-500">
            <Typography variant="h5" color="red" className="mb-4">
              Sentinel AI Risk Assessment
            </Typography>
            {analysis ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Typography className="font-bold">Risk Score (0-10):</Typography>
                  <Typography variant="h4" color={analysis.riskScore > 7 ? 'red' : analysis.riskScore > 4 ? 'yellow' : 'green'}>
                    {analysis.riskScore.toFixed(1)}
                  </Typography>
                </div>
                <Typography className="font-bold">Recommendation:</Typography>
                <Alert color={analysis.recommendation.includes('Buy') ? 'green' : analysis.recommendation.includes('Caution') ? 'yellow' : 'red'}>
                  {analysis.recommendation}
                </Alert>
                <Typography className="font-bold">Key Risk Factors Identified:</Typography>
                <ul className="list-disc list-inside ml-4 text-sm">
                  {analysis.keyRiskFactors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                  <li>Liquidation Risk Estimate: {analysis.liquidationRiskEstimate.toFixed(2)}%</li>
                  <li>Volatility Forecast: {analysis.volatilityForecast}</li>
                </ul>
              </div>
            ) : (
              <Typography>Analysis pending. Run AI analysis first.</Typography>
            )}
          </Card>

          {/* Section 3: Oracle Predictive Modeling */}
          <Card className="p-6 mb-6 shadow-xl border-l-4 border-green-500">
            <Typography variant="h5" color="green" className="mb-4">
              Oracle Predictive Modeling
            </Typography>
            {analysis ? (
              <div className="space-y-3">
                <Typography className="font-bold">Estimated Potential Annual Gains:</Typography>
                <Typography variant="h4" color="green">
                  ${analysis.potentialGains.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Typography>
                <Typography className="font-bold">Optimization Strategy Directive:</Typography>
                <Typography className="italic text-sm bg-gray-100 p-3 rounded">
                  {analysis.optimizationStrategy}
                </Typography>
                <Typography className="font-bold">Simulated 30-Day APY Trend (Mock Chart Data):</Typography>
                <div className="h-40 w-full bg-white border p-2 overflow-x-auto">
                  {/* Mock Bar Chart Representation */}
                  <div className="flex space-x-1 text-xs h-full items-end">
                    {analysis.simulatedPerformance.map((metric, i) => (
                      <div key={i} className="flex flex-col items-center" style={{ height: `${Math.min(100, metric.value * 3)}%`, width: '10px', backgroundColor: 'rgba(0, 150, 136, 0.7)' }}>
                        {/* Mock Bar */}
                      </div>
                    ))}
                  </div>
                  <Typography variant="small" className="mt-2 text-center">
                    (Simulated APY values over 30 days)
                  </Typography>
                </div>
              </div>
            ) : (
              <Typography>Oracle requires Sentinel data before generating forecasts.</Typography>
            )}
          </Card>

          {/* Section 4: Protocol Deep Dive */}
          <Card className="p-6 shadow-xl">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Protocol Deep Dive & Compliance
            </Typography>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Typography className="font-bold mb-1">Contract Details:</Typography>
                <Typography>Address: {pool.smartContractAddress.substring(0, 10)}...</Typography>
                <Typography>Fee Tier: {pool.feeTier * 100}%</Typography>
                <Typography>Utilization Rate: {(pool.utilizationRate * 100).toFixed(2)}%</Typography>
                <Typography>Leveraged Position: {pool.isLeveraged ? 'Yes (High Risk)' : 'No'}</Typography>
              </div>
              <div>
                <Typography className="font-bold mb-1">Governance & Audits:</Typography>
                {pool.audits.map((audit, i) => (
                  <Typography key={i} className={`text-xs ${audit.status === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                    Audit ({audit.auditor}): {audit.status}
                  </Typography>
                ))}
                <Typography>DAO Proposals: {pool.governance.proposalCount}</Typography>
                <Typography>User Voting Power: {pool.governance.votingPower.toFixed(0)}</Typography>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outlined" color="blue" size="sm">
                Execute Trade Simulation
              </Button>
              <Button variant="gradient" color="green" size="sm" className="ml-3">
                Deploy Capital via Custodian
              </Button>
            </div>
          </Card>
        </Card>
      </div>
    );
  };

  const renderPortfolioOverview = () => (
    <Card className="p-6 shadow-2xl">
      <Typography variant="h4" color="blue-gray" className="mb-4 border-b pb-2">
        Architect Portfolio Overview
      </Typography>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Entry APY</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolio.map((pos, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-gray-900">{pos.protocol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-gray-600">{pos.poolName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${pos.investedAmount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${pos.currentValue.toLocaleString()}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${pos.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {pos.pnl >= 0 ? 'â–²' : 'â–¼'} ${Math.abs(pos.pnl).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{pos.apyAtEntry.toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="text" size="sm" color="blue">Rebalance</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Typography variant="small" className="text-gray-600">
          Total Portfolio Value: <span className="font-bold text-lg text-blue-800">${portfolio.reduce((sum, p) => sum + p.currentValue, 0).toLocaleString()}</span>
        </Typography>
        <Button variant="gradient" color="red" size="sm">
          Initiate Emergency Exit Protocol
        </Button>
      </div>
    </Card>
  );

  const renderYieldExplorerTable = () => (
    <Card className="p-6 shadow-2xl">
      <Typography variant="h4" color="blue-gray" className="mb-4 border-b pb-2">
        Global Yield Opportunity Matrix
      </Typography>

      {/* Sorting Controls */}
      <div className="mb-4 flex items-center gap-4">
        <Typography variant="small" className="font-bold">Sort By:</Typography>
        <Select
          label="Metric"
          value={sortKey}
          onChange={(val) => setSortKey(val as keyof PoolData | 'riskScore')}
          className="w-40"
        >
          <Option value="apy">APY</Option>
          <Option value="tvl">TVL</Option>
          <Option value="liquidity">Liquidity</Option>
          <Option value="volume">24h Volume</Option>
          <Option value="riskScore">AI Risk Score</Option>
        </Select>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          {sortDirection === 'asc' ? 'Ascending â–²' : 'Descending â–¼'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pool Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chain</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">TVL (USD)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">APY (%)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">AI Risk</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPools.map((pool) => {
              const analysis = analyzedPools[pool.poolName];
              const riskColor = analysis
                ? analysis.riskScore > 7 ? 'text-red-600' : analysis.riskScore > 4 ? 'text-yellow-600' : 'text-green-600'
                : 'text-gray-400';

              return (
                <tr key={pool.poolName} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-gray-900">{pool.protocol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-gray-600">{pool.poolName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{pool.chain}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${pool.tvl.toLocaleString('en-US', { notation: 'compact' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-purple-700">{pool.apy.toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`font-bold ${riskColor}`}>
                      {analysis ? analysis.riskScore.toFixed(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Button
                      variant="gradient"
                      color={analysis ? 'green' : 'blue'}
                      size="sm"
                      onClick={() => analyzePool(pool)}
                      disabled={loading && !analysis}
                    >
                      {analysis ? 'View Report' : 'Analyze with Sentinel'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CardFooter className="flex items-center justify-between border-t p-4 mt-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Showing 1 to {sortedPools.length} of {poolData.length} total opportunities.
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm" disabled>Previous</Button>
          <Button variant="outlined" size="sm">Next Page (AI Pre-filtered)</Button>
        </div>
      </CardFooter>
    </Card>
  );

  const renderAIAgentStatus = () => (
    <Card className="p-4 shadow-xl">
      <Typography variant="h5" color="blue-gray" className="mb-3">
        AI Agent Status
      </Typography>
      <div className="space-y-2">
        {aiAgents.map((agent) => (
          <div key={agent.name} className="flex justify-between items-center p-2 border rounded">
            <div>
              <Typography variant="small" className="font-bold">{agent.name} ({agent.role})</Typography>
              <Typography variant="small" className="text-xs text-gray-500">Expertise: {agent.expertise}</Typography>
            </div>
            <div className={`text-xs font-bold p-1 rounded ${agent.status === 'Online' ? 'bg-green-100 text-green-700' : agent.status === 'Busy' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {agent.status}
            </div>
          </div>
        ))}
      </div>
      <Button variant="text" size="sm" color="blue" className="mt-3">
        Deploy Custom Agent Instance
      </Button>
    </Card>
  );

  const renderOptimizationSettings = () => (
    <Card className="p-4 shadow-xl">
      <Typography variant="h5" color="blue-gray" className="mb-3">
        Optimization Parameters
      </Typography>
      <div className="space-y-4">
        <Select
          label="Risk Tolerance Profile"
          value={optimizationSettings.riskTolerance}
          onChange={(val) => setOptimizationSettings(p => ({ ...p, riskTolerance: val as string }))}
        >
          <Option value="low">Low (Stablecoins only)</Option>
          <Option value="medium">Medium (Blue Chip LPs)</Option>
          <Option value="high">High (Leveraged Vaults)</Option>
          <Option value="aggressive">Aggressive (New Protocols)</Option>
        </Select>
        <Input
          label="Target APY (%)"
          type="number"
          value={optimizationSettings.targetAPY}
          onChange={(e) => setOptimizationSettings(p => ({ ...p, targetAPY: parseFloat(e.target.value) || 0 }))}
        />
        <Select
          label="Rebalance Frequency"
          value={optimizationSettings.rebalanceFrequency}
          onChange={(val) => setOptimizationSettings(p => ({ ...p, rebalanceFrequency: val as string }))}
        >
          <Option value="daily">Daily (High Gas Cost Warning)</Option>
          <Option value="weekly">Weekly (Recommended)</Option>
          <Option value="monthly">Monthly</Option>
        </Select>
      </div>
      <Button variant="gradient" color="purple" className="mt-4 w-full" disabled={isOptimizing}>
        Save & Schedule Optimization
      </Button>
    </Card>
  );

  // --- ADDITIONAL CONTENT BLOCKS ---

  const renderCustodianComplianceLogs = () => (
    <div className="space-y-6 mt-8">
      {Array.from({ length: 50 }).map((_, i) => (
        <Card key={`placeholder-feature-${i}`} className="p-4 shadow-md bg-white border-l-2 border-gray-300">
          <Typography variant="h6" color="blue-gray">
            Custodian Compliance Log Entry #{i + 1}
          </Typography>
          <Typography variant="small" className="text-gray-500">
            Timestamp: {new Date(Date.now() - i * 3600000).toISOString()} | Status: {i % 5 === 0 ? 'Warning: High Slippage' : 'OK'}
          </Typography>
          <Typography variant="paragraph" className="text-xs mt-1">
            Custodian verified transaction integrity and regulatory adherence for batch {1000 + i}. Gas optimization achieved: {((Math.random() * 5) + 10).toFixed(2)}%. Cross-chain bridge latency: {Math.floor(Math.random() * 500) + 100}ms.
          </Typography>
          <div className="flex gap-2 mt-2">
            <Button variant="text" size="sm">View Audit Trail</Button>
            <Button variant="text" size="sm" color="red">Flag for Manual Review</Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSentinelVulnerabilityReports = () => (
    <div className="space-y-4 mt-8">
      {Array.from({ length: 50 }).map((_, i) => (
        <Card key={`placeholder-agent-log-${i}`} className="p-3 shadow-sm bg-gray-100">
          <Typography variant="small" className="font-bold text-blue-800">
            Sentinel Log: Vulnerability Scan #{i + 1}
          </Typography>
          <Typography variant="small" className="text-xs text-gray-600">
            Target: Protocol {i % 5 === 0 ? 'Aave V2' : 'Uniswap V3'} | Result: {i % 10 === 0 ? 'Critical Vulnerability Detected (Patch Required)' : 'No critical exploits detected. Minor gas inefficiency flagged.'}
          </Typography>
          <Button variant="text" size="sm" color="blue" className="p-0 h-4 mt-1">
            View Full Report
          </Button>
        </Card>
      ))}
    </div>
  );

  const renderAdvancedConfigurationModules = () => (
    <div className="mt-12 space-y-4">
      {Array.from({ length: 100 }).map((_, i) => (
        <Card key={`config-panel-${i}`} className="p-3 shadow-sm bg-white border-l-4 border-purple-200">
          <Typography variant="h6" color="blue-gray" className="mb-1">
            Advanced Configuration Module {i + 1}: {i % 3 === 0 ? 'Cross-Chain Arbitrage Engine' : i % 3 === 1 ? 'Impermanent Loss Hedging Strategy' : 'Gas Fee Prediction Model'}
          </Typography>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <Input label="Parameter A" defaultValue={`Value ${i * 10}`} size="sm" />
            <Select label="Strategy Type" defaultValue="Dynamic" size="sm">
              <Option value="static">Static</Option>
              <Option value="dynamic">Dynamic</Option>
              <Option value="reactive">Reactive</Option>
            </Select>
            <Button variant="outlined" size="sm">
              Execute Test Run
            </Button>
          </div>
          <Typography variant="small" className="text-xs mt-2 text-gray-500">
            Status: {i % 7 === 0 ? 'Error: Check API Key' : 'Active and Monitoring'} | Last Update: {new Date(Date.now() - i * 100000).toLocaleTimeString()}
          </Typography>
        </Card>
      ))}
    </div>
  );

  // --- COMPONENT RENDER FUNCTION ---

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Detailed Analysis Modal/Sidebar */}
      {renderPoolDetailAnalysis()}

      {/* Global Header and Mandate */}
      <div className="mb-12 text-center">
        <Typography variant="h1" className="mb-2 text-blue-gray-900 font-extrabold tracking-tight">
          Decentralized Finance Explorer
        </Typography>
        <Typography variant="lead" className="mb-8 font-mono text-gray-600">
          IDGAF-AI: Data, Analysis, Insights. Explore and Understand.
        </Typography>

        {/* Professionalized Mandate */}
        <Card className="text-left max-w-6xl mx-auto p-6 shadow-2xl bg-white border-t-8 border-blue-700">
          <Typography variant="h6" color="blue-gray" className="mb-3">
            IDGAF-AI System Overview
          </Typography>
          <div className="space-y-4 text-gray-800 text-sm">
            <Typography>
              IDGAF-AI (Indifferent Data Gathering and Analysis Framework) provides a platform for exploring decentralized finance. Its purpose is to offer transparent data and basic analytical tools, aiming to simplify understanding of complex financial systems.
            </Typography>
            <Typography>
              This platform integrates with decentralized protocols and utilizes basic analytical modules (Sentinel for risk indicators, Oracle for predictive insights, Custodian for transaction logging) to provide accessible information on various financial opportunities.
            </Typography>
            <Typography>
              To all users: Review the data. Evaluate the algorithms. The information presented is for analytical purposes. Your diligent analysis is encouraged for navigating this evolving financial landscape.
            </Typography>
            <Typography className="font-bold text-blue-700">
              IDGAF-AI is active. Financial data is available.
            </Typography>
          </div>
        </Card>
      </div>

      {/* Row 1: KPIs and Portfolio Summary */}
      {renderKPIDashboard()}
      <div className="mb-10">
        {renderPortfolioOverview()}
      </div>

      {/* Row 2: Main Dashboard Layout (Explorer vs AI Command) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Yield Explorer (8/12 width) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Search and Filter Controls */}
          <Card className="p-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-4">
              <Input
                label="Search Protocol, Pool, or Asset Pair"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full md:w-1/3"
              />
              <Select
                label="Filter by Chain"
                value={selectedChain}
                onChange={(e) => handleChainChange(e as string)}
                className="w-full md:w-1/4"
              >
                {chains.map((chain) => (
                  <Option key={chain} value={chain}>
                    {chain.charAt(0).toUpperCase() + chain.slice(1)}
                  </Option>
                ))}
              </Select>
              <Button variant="outlined" color="blue" className="w-full md:w-auto">
                Apply Advanced Filters
              </Button>
            </div>
          </Card>

          {/* Loading/Error States */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <Spinner color="blue" size="lg" />
              <Typography variant="lead" className="ml-2">
                Oracle is querying decentralized data streams...
              </Typography>
            </div>
          )}

          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}

          {!loading && !error && filteredPools.length === 0 && (
            <Typography variant="lead" className="text-center text-gray-500">
              No DeFi opportunities found matching your criteria. Adjust filters or consult IDGAF-AI.
            </Typography>
          )}

          {/* Yield Explorer Table */}
          {!loading && !error && filteredPools.length > 0 && (
            renderYieldExplorerTable()
          )}

          {/* Additional Feature: AI-Driven Market Sentiment Index */}
          <Card className="p-6 shadow-xl border-t-4 border-yellow-500">
            <Typography variant="h5" color="blue-gray" className="mb-3">
              Oracle Market Sentiment Index (7-Day)
            </Typography>
            <div className="flex justify-between items-center">
              <Typography variant="h2" className="text-yellow-700">
                +0.67
              </Typography>
              <Typography variant="small" className="text-gray-600">
                (Range: -1.0 to +1.0)
              </Typography>
            </div>
            <Typography variant="paragraph" className="mt-2 text-sm">
              The market is currently exhibiting moderate bullish sentiment driven by stable ETH staking yields and reduced regulatory noise. Sentinel advises maintaining current risk exposure.
            </Typography>
            <div className="h-16 bg-gray-200 rounded mt-3">
              {/* Mock Sentiment Chart */}
              <div className="h-full bg-yellow-400 w-[75%] rounded"></div>
            </div>
          </Card>

          {/* Additional Content Block 1: Custodian Compliance Logs */}
          {renderCustodianComplianceLogs()}

        </div>

        {/* Right Column: AI Command Center & Settings (4/12 width) */}
        <div className="lg:col-span-4 space-y-8">
          {renderAICommandCenter()}
          {renderAIAgentStatus()}
          {renderOptimizationSettings()}

          {/* Additional Feature: AI Predictive Model Health */}
          <Card className="p-4 shadow-xl border-t-4 border-purple-500">
            <Typography variant="h5" color="blue-gray" className="mb-3">
              Oracle Model Health Metrics
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <Typography>Prediction Accuracy (30D):</Typography>
                <Typography className="font-bold text-purple-700">94.1%</Typography>
              </div>
              <div className="flex justify-between">
                <Typography>Data Latency:</Typography>
                <Typography className="font-bold text-green-700">1.2 seconds</Typography>
              </div>
              <div className="flex justify-between">
                <Typography>Model Drift Index:</Typography>
                <Typography className="font-bold text-yellow-700">0.05 (Nominal)</Typography>
              </div>
            </div>
            <Button variant="text" size="sm" color="purple" className="mt-3 w-full">
              Retrain Oracle Model
            </Button>
          </Card>

          {/* Additional Content Block 2: Sentinel Vulnerability Reports */}
          {renderSentinelVulnerabilityReports()}

        </div>
      </div>

      {/* Footer Section: System Diagnostics and Compliance */}
      <Card className="mt-12 p-6 shadow-2xl bg-blue-gray-900 text-white">
        <Typography variant="h5" className="mb-3 text-blue-300">
          System Diagnostics & Compliance Footer
        </Typography>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <Typography className="font-bold mb-1">IDGAF-AI Core Status:</Typography>
            <Typography className="text-green-400">Operational (100% Uptime)</Typography>
            <Typography className="text-xs text-gray-400">Last Kernel Update: 2024-05-15</Typography>
          </div>
          <div>
            <Typography className="font-bold mb-1">Custodian Regulatory Compliance:</Typography>
            <Typography className="text-yellow-400">Monitoring (Pending MiCA/SEC Clarification)</Typography>
            <Typography className="text-xs text-gray-400">Jurisdiction: Global Decentralized</Typography>
          </div>
          <div>
            <Typography className="font-bold mb-1">Architect Access Level:</Typography>
            <Typography className="text-blue-400">Level 1 (Basic System Access)</Typography>
            <Typography className="text-xs text-gray-400">Encryption: Quantum-Resistant AES-256</Typography>
          </div>
        </div>
      </Card>

      {/* Final Additional Content Block: Advanced Configuration Modules */}
      {renderAdvancedConfigurationModules()}

    </div>
  );
};

export default DeFiYieldExplorer;