import React, { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Play, Save, History, Code, Settings, TrendingUp, DollarSign, X } from 'lucide-react';

// --- Data Models (Mock) ---
interface Algorithm {
  id: string;
  name: string;
  code: string; // Stored as JSON string representing the visual nodes/blocks
  status: 'draft' | 'backtesting' | 'live' | 'error';
  performanceMetrics?: any;
}

interface BacktestResult {
  runId: string;
  algorithmId: string;
  startDate: string;
  endDate: string;
  equityCurve: { date: string, value: number }[];
  metrics: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    trades: number;
  };
}

// --- Mock Data ---
const initialAlgorithms: Algorithm[] = [
  { id: 'algo-1', name: 'Momentum Scalper v1', code: '{"nodes":[]}', status: 'draft' },
  { id: 'algo-2', name: 'Mean Reversion HFT', code: '{"nodes":[]}', status: 'backtesting', performanceMetrics: { return: 0.15, status: '90%' } },
  { id: 'algo-3', name: 'Arbitrage Hunter', code: '{"nodes":[]}', status: 'live', performanceMetrics: { return: 0.22, aum: 150000 } },
];

const mockBacktestResults: BacktestResult[] = [
  {
    runId: 'bt-101',
    algorithmId: 'algo-2',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    equityCurve: [],
    metrics: {
      totalReturn: 45.2,
      sharpeRatio: 1.8,
      maxDrawdown: -5.1,
      trades: 5120,
    }
  }
];

// --- Utility Components ---

const Button = ({ icon: Icon, children, onClick, variant = 'primary', disabled = false }: { icon: React.ElementType, children: React.ReactNode, onClick: () => void, variant?: 'primary' | 'secondary' | 'danger', disabled?: boolean }) => {
  const baseClasses = "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition duration-150 ease-in-out font-medium";
  let colorClasses = "";

  switch (variant) {
    case 'primary':
      colorClasses = "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400";
      break;
    case 'secondary':
      colorClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100";
      break;
    case 'danger':
      colorClasses = "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400";
      break;
  }

  return (
    <button className={`${baseClasses} ${colorClasses}`} onClick={onClick} disabled={disabled}>
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </button>
  );
};

const Card = ({ title, children, className = '' }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white shadow-lg rounded-xl p-4 border border-gray-100 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{title}</h3>
    {children}
  </div>
);

// --- Core Feature Components ---

/**
 * Visual/No-Code Editor Simulation
 */
const NoCodeEditor = ({ algorithm, onUpdateCode }: { algorithm: Algorithm, onUpdateCode: (code: string) => void }) => {
  const [blocks, setBlocks] = useState(['Input: BTC/USD', 'Condition: RSI < 30', 'Action: Buy 1 unit']);

  const handleAddBlock = (type: string) => {
    setBlocks([...blocks, `${type}: New Block`]);
    // Simulate updating the JSON code structure
    onUpdateCode(JSON.stringify({ nodes: [...blocks, `${type}: New Block`] }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex space-x-2 mb-3">
        <Button icon={Code} onClick={() => handleAddBlock('Indicator')} variant="secondary">Add Indicator</Button>
        <Button icon={TrendingUp} onClick={() => handleAddBlock('Logic')} variant="secondary">Add Logic</Button>
        <Button icon={DollarSign} onClick={() => handleAddBlock('Action')} variant="secondary">Add Action</Button>
      </div>

      <div className="flex-grow bg-gray-50 p-4 rounded-lg overflow-y-auto border border-dashed border-gray-300">
        <p className="text-gray-500 mb-4">Drag and drop blocks here to build your strategy.</p>
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div key={index} className="bg-indigo-50 border border-indigo-200 p-3 rounded-md shadow-sm flex justify-between items-center text-sm">
              <span>{block}</span>
              <X className="w-4 h-4 text-indigo-500 cursor-pointer hover:text-red-500" onClick={() => setBlocks(blocks.filter((_, i) => i !== index))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Algorithm List and Selector
 */
const AlgoList = ({ algorithms, selectedAlgo, onSelectAlgo, onCreateNewAlgo }: { algorithms: Algorithm[], selectedAlgo: Algorithm | null, onSelectAlgo: (algo: Algorithm) => void, onCreateNewAlgo: () => void }) => {
  return (
    <Card title="My Algorithms" className="h-full flex flex-col">
      <Button icon={Plus} onClick={onCreateNewAlgo} variant="primary" className="mb-4 w-full">New Strategy</Button>
      <div className="space-y-2 flex-grow overflow-y-auto">
        {algorithms.map((algo) => (
          <div
            key={algo.id}
            onClick={() => onSelectAlgo(algo)}
            className={`p-3 rounded-lg cursor-pointer transition duration-150 ${selectedAlgo?.id === algo.id ? 'bg-indigo-100 border-indigo-500 border-2' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
          >
            <div className="font-medium text-gray-800">{algo.name}</div>
            <div className={`text-xs mt-1 font-semibold ${algo.status === 'live' ? 'text-green-600' : algo.status === 'backtesting' ? 'text-yellow-600' : 'text-gray-500'}`}>
              Status: {algo.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/**
 * Backtesting Configuration and Results
 */
const Backtester = ({ algorithm }: { algorithm: Algorithm }) => {
  const [results, setResults] = useState<BacktestResult[]>(mockBacktestResults.filter(r => r.algorithmId === algorithm.id));
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2023-01-01', end: '2023-12-31' });

  const handleRunBacktest = useCallback(() => {
    setIsBacktesting(true);
    // Simulate API call delay
    setTimeout(() => {
      const newResult: BacktestResult = {
        runId: `bt-${Date.now()}`,
        algorithmId: algorithm.id,
        startDate: dateRange.start,
        endDate: dateRange.end,
        equityCurve: [],
        metrics: {
          totalReturn: parseFloat((Math.random() * 50).toFixed(2)),
          sharpeRatio: parseFloat((Math.random() * 2.5).toFixed(2)),
          maxDrawdown: parseFloat((-Math.random() * 10).toFixed(2)),
          trades: Math.floor(Math.random() * 10000),
        }
      };
      setResults([newResult, ...results]);
      setIsBacktesting(false);
    }, 2000);
  }, [algorithm.id, dateRange, results]);

  const latestResult = results[0];

  return (
    <Card title="Backtesting & Deployment">
      <div className="space-y-4">
        {/* Configuration */}
        <div className="flex space-x-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1.5" />
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 opacity-0">Run</label>
            <Button icon={Play} onClick={handleRunBacktest} disabled={isBacktesting || algorithm.status === 'live'}>
              {isBacktesting ? 'Running...' : 'Run Backtest'}
            </Button>
          </div>
        </div>

        {/* Deployment */}
        <div className="border-t pt-4">
          <h4 className="text-md font-medium mb-2">Deployment</h4>
          <Button icon={TrendingUp} onClick={() => alert(`Deploying ${algorithm.name} to Live Exchange...`)} variant="danger" disabled={algorithm.status === 'live'}>
            Go Live (Internal Exchange)
          </Button>
          {algorithm.status === 'live' && <p className="text-green-600 mt-2 text-sm">Algorithm is currently live and trading.</p>}
        </div>

        {/* Results Display */}
        {latestResult && (
          <div className="border-t pt-4">
            <h4 className="text-md font-medium mb-3">Latest Backtest Results ({latestResult.runId})</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-gray-500">Total Return</p>
                <p className="text-xl font-bold text-green-700">{latestResult.metrics.totalReturn}%</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-gray-500">Sharpe Ratio</p>
                <p className="text-xl font-bold text-blue-700">{latestResult.metrics.sharpeRatio}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-md">
                <p className="text-gray-500">Max Drawdown</p>
                <p className="text-xl font-bold text-red-700">{latestResult.metrics.maxDrawdown}%</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md">
                <p className="text-gray-500">Total Trades</p>
                <p className="text-xl font-bold text-yellow-700">{latestResult.metrics.trades}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Data simulated. No real funds involved.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

// --- Main Component ---

const Plus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);


const AlgoTradingLab: React.FC = () => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(initialAlgorithms);
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(initialAlgorithms[0].id);
  const [nameInput, setNameInput] = useState(initialAlgorithms[0].name);

  const selectedAlgorithm = useMemo(() => {
    return algorithms.find(a => a.id === selectedAlgoId) || initialAlgorithms[0];
  }, [algorithms, selectedAlgoId]);

  const handleSelectAlgo = useCallback((algo: Algorithm) => {
    setSelectedAlgoId(algo.id);
    setNameInput(algo.name);
  }, []);

  const handleUpdateCode = useCallback((code: string) => {
    setAlgorithms(prev => prev.map(a =>
      a.id === selectedAlgoId ? { ...a, code: code, status: 'draft' } : a
    ));
  }, [selectedAlgoId]);

  const handleSave = useCallback(() => {
    setAlgorithms(prev => prev.map(a =>
      a.id === selectedAlgoId ? { ...a, name: nameInput, status: 'draft' } : a
    ));
    alert(`${nameInput} saved successfully.`);
  }, [selectedAlgoId, nameInput]);

  const handleCreateNewAlgo = useCallback(() => {
    const newId = `algo-${Date.now()}`;
    const newAlgo: Algorithm = {
      id: newId,
      name: `New Strategy ${algorithms.length + 1}`,
      code: '{"nodes":[]}',
      status: 'draft',
    };
    setAlgorithms(prev => [...prev, newAlgo]);
    setSelectedAlgoId(newId);
    setNameInput(newAlgo.name);
  }, [algorithms.length]);

  if (!selectedAlgorithm) return <div>Loading...</div>;

  return (
    <div className="h-full w-full p-6 bg-gray-50 overflow-hidden flex flex-col">
      <header className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center space-x-4">
          <Settings className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Algo Trading Lab</h1>
        </div>
        <div className="flex space-x-3">
          <Button icon={Save} onClick={handleSave} variant="secondary">Save Changes</Button>
          <Button icon={RefreshCw} onClick={() => console.log('Refresh')} variant="secondary">Refresh Data</Button>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-12 gap-6 min-h-0">
        {/* Left Column: Algo List */}
        <div className="col-span-3 min-h-full">
          <AlgoList
            algorithms={algorithms}
            selectedAlgo={selectedAlgorithm}
            onSelectAlgo={handleSelectAlgo}
            onCreateNewAlgo={handleCreateNewAlgo}
          />
        </div>

        {/* Center Column: Editor */}
        <div className="col-span-6 flex flex-col min-h-full">
          <Card title="Algorithm Editor (No-Code Blocks)" className="flex-grow flex flex-col">
            <div className="mb-4">
              <label htmlFor="algo-name" className="sr-only">Algorithm Name</label>
              <input
                id="algo-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-xl font-bold p-2 border-b-2 border-indigo-300 focus:border-indigo-500 transition duration-150 outline-none"
              />
            </div>
            <NoCodeEditor
              algorithm={selectedAlgorithm}
              onUpdateCode={handleUpdateCode}
            />
          </Card>
        </div>

        {/* Right Column: Backtesting/Deployment */}
        <div className="col-span-3 min-h-full">
          <Backtester algorithm={selectedAlgorithm} />
        </div>
      </main>

      <footer className="mt-6 p-3 text-center text-xs text-gray-500 bg-white rounded-xl shadow-inner">
        Balcony of Prosperity Exchange System - Fully Self-Contained, Zero Cost Infrastructure
      </footer>
    </div>
  );
};

export default AlgoTradingLab;
