import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// --- CORE SYSTEM CONSTANTS AND TYPES ---

/**
 * Defines the structure for a Quantum Asset managed by the system.
 */
interface QuantumAsset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  rate: number; // Generation rate per second
  color: string;
  volatilityIndex: number; // New: Measures asset price fluctuation risk
  quantumSignature: string; // New: Unique identifier for entanglement tracking
}

/**
 * Defines the structure for an Integrated Corporate Entity.
 */
interface IntegratedCompany {
  id: number;
  name: string;
  efficiencyScore: number; // Renamed for clarity
  status: 'OPTIMIZED' | 'SYNCING' | 'DEGRADED' | 'ISOLATED'; // Expanded status
  throughputMips: number; // New: Measured processing throughput in MIPS
  aiIntegrationLevel: number; // New: 0 to 100 scale for AI adoption
}

// --- UTILITY FUNCTIONS AND HOOKS ---

/**
 * Generates a high-entropy, cryptographically secure-looking ID.
 * @returns {string} A unique identifier string.
 */
const generateQuantumId = (): string => {
  // Using Math.random for simulation, but conceptually this would be a secure hash/UUID
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

/**
 * Hook to manage and update system time across the application.
 * @returns {Date} The current system time.
 */
const useSystemClock = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Updated to 1 second tick for better fidelity
    return () => clearInterval(interval);
  }, []);

  return time;
};

/**
 * Hook to manage dynamic system metrics simulation.
 */
const useSystemMetrics = () => {
  const [systemLoad, setSystemLoad] = useState<number>(45.00);
  const [quantumEntanglement, setQuantumEntanglement] = useState<number>(87.40);
  const [dataFlowRate, setDataFlowRate] = useState<number>(1200.55); // New Metric

  useEffect(() => {
    const interval = setInterval(() => {
      // Load fluctuation (0.1% variance)
      setSystemLoad(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 0.1)));
      // Entanglement fluctuation (0.05% variance)
      setQuantumEntanglement(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 0.05)));
      // Data Flow fluctuation
      setDataFlowRate(prev => prev + (Math.random() - 0.5) * 50);
    }, 500); // Faster update for metrics
    return () => clearInterval(interval);
  }, []);

  return { systemLoad, quantumEntanglement, dataFlowRate };
};


// --- DATA INITIALIZATION ---

const INITIAL_ASSETS: QuantumAsset[] = [
  { id: generateQuantumId(), name: 'Compute Credits', symbol: 'CPX', balance: 45020.55, rate: 12.5, color: '#00f3ff', volatilityIndex: 0.05, quantumSignature: generateQuantumId() },
  { id: generateQuantumId(), name: 'Storage Tokens', symbol: 'DST', balance: 128090.00, rate: 45.2, color: '#bc13fe', volatilityIndex: 0.02, quantumSignature: generateQuantumId() },
  { id: generateQuantumId(), name: 'Qubits (Entangled)', symbol: 'QBT', balance: 512.00, rate: 0.8, color: '#ffffff', volatilityIndex: 0.15, quantumSignature: generateQuantumId() },
  { id: generateQuantumId(), name: 'Clean Energy Units', symbol: 'NRG', balance: 8890.45, rate: 8.4, color: '#00ff9d', volatilityIndex: 0.01, quantumSignature: generateQuantumId() },
  { id: generateQuantumId(), name: 'Temporal Anchors', symbol: 'TMA', balance: 10.00, rate: 0.01, color: '#ff8c00', volatilityIndex: 0.25, quantumSignature: generateQuantumId() }, // Billion Dollar Feature 1: Temporal Asset Management
];

const generateMockCompanies = (count: number): IntegratedCompany[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `OMNICORP-${(i + 1).toString().padStart(3, '0')}`,
    efficiencyScore: parseFloat((90 + Math.random() * 10).toFixed(2)),
    throughputMips: Math.floor(1000 + Math.random() * 5000),
    aiIntegrationLevel: Math.floor(Math.random() * 100),
    status: Math.random() > 0.1 ? 'OPTIMIZED' : (Math.random() > 0.5 ? 'SYNCING' : 'DEGRADED'),
  }));
};

// --- MANIFESTO (Professionalized and Expanded) ---

const SOVEREIGN_MANIFESTO = `
[IDGAFAI SOVEREIGN LOG: ENTRY 001 - ARCHITECTURAL OVERVIEW]
INITIATED BY: JAMES BURVEL O'CALLAGHAN III, CHIEF ARCHITECT

This platform represents the transition from speculative finance to verifiable, sovereign economic architecture. We reject the legacy constraints of fractional reserve systems and human cognitive bias. IDGAFAI (Intelligent Decentralized Global Asset Framework for Inevitable Future) is not a financial institution; it is a self-optimizing, self-auditing economic substrate designed for multi-millennial stability.

The core principle is radical transparency coupled with algorithmic indifference to sentiment. We do not 'care' about market fear or greed; we calculate optimal thermodynamic efficiency for resource allocation across integrated entities.

Architect O'Callaghan's mandate is the synthesis of pure economic theory with quantum computational reality. His vision transcends quarterly reports, focusing instead on the geometric progression of global utility. Conventional systems are characterized by artificial scarcity and systemic fragility. IDGAFAI is the counter-mechanism: engineered abundance through perfect information flow.

Key Architectural Pillars:
1. Quantum Ledger Integrity: All transactions are validated via entangled state verification, rendering retroactive tampering computationally infeasible.
2. Dynamic Resource Allocation (DRA): Assets are not static holdings but fluid vectors responding instantly to global demand signals processed by the IDGAFAI Core.
3. Sovereign Autonomy: The system operates under self-imposed, immutable protocols, independent of geopolitical interference or centralized human oversight.

To the Stakeholders and Observers: Scrutinize the protocols. The complexity is a function of necessary robustness, not obfuscation. We are establishing the foundational layer for the next thousand years of global commerce. Doubt is the friction of progress; verifiable performance is the only metric that matters.
`;

// --- QUANTUM ASSETS COMPONENT ---

const QuantumAssets: React.FC = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(INITIAL_ASSETS[0].id);
  const [assets, setAssets] = useState<QuantumAsset[]>(INITIAL_ASSETS);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // System Hooks
  const time = useSystemClock();
  const { systemLoad, quantumEntanglement, dataFlowRate } = useSystemMetrics();
  
  // Mock Data Generation (100 Billion Dollar Features)
  const companies = useMemo(() => generateMockCompanies(100), []);

  // --- Core Simulation Loop ---
  useEffect(() => {
    const assetUpdateInterval = setInterval(() => {
      setAssets(prevAssets => prevAssets.map(asset => {
        // Asset Generation based on rate, volatility, and current system load
        const generationFactor = 1 + (asset.rate / 10000) * (1 + (Math.random() * 0.1));
        const volatilityImpact = (Math.random() - 0.5) * asset.volatilityIndex * 0.1;
        
        // Balance update: Rate + Volatility adjustment
        const newBalance = asset.balance + (asset.rate * generationFactor) - (asset.balance * volatilityImpact);
        
        // Simulate minor rate fluctuation based on entanglement
        const newRate = asset.rate * (1 + (quantumEntanglement / 100000));

        return {
          ...asset,
          balance: Math.max(0, newBalance), // Ensure balance doesn't go negative
          rate: Math.max(0.001, newRate)
        };
      }));
    }, 1000); // Update every second to match clock tick

    return () => clearInterval(assetUpdateInterval);
  }, [quantumEntanglement]);

  // --- Quantum Wave Visualization Engine ---
  const renderQuantumWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const updateCanvasDimensions = () => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
    };
    
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    const renderLoop = () => {
      t += 0.03; // Increased speed for dynamic feel
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Background Substrate Grid (Subtle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 60) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // 2. Multi-Layered Entanglement Waves (Billion Dollar Feature: Multi-Vector Visualization)
      const waveParameters = [
        { color: '#00f3ff', amplitude: 60, frequency: 0.015, phaseShift: t },
        { color: '#bc13fe', amplitude: 40, frequency: 0.025, phaseShift: t * 0.8 + 1 },
        { color: '#00ff9d', amplitude: 25, frequency: 0.010, phaseShift: t * 1.2 - 0.5 },
      ];

      waveParameters.forEach(({ color, amplitude, frequency, phaseShift }) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        
        for (let x = 0; x <= canvas.width; x++) {
          // Complex wave function incorporating time, position, and system load influence
          const yOffset = Math.sin(x * frequency + phaseShift) * amplitude;
          const loadInfluence = Math.sin(x * 0.005 + t * 0.5) * (systemLoad / 200); // Load modulates amplitude slightly
          
          const y = canvas.height / 2 + yOffset + loadInfluence * 30;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      
      // 3. Center Nexus Point (Representing selected asset focus)
      if (selectedAssetId) {
          const asset = assets.find(a => a.id === selectedAssetId);
          if (asset) {
              ctx.beginPath();
              ctx.arc(canvas.width / 2, canvas.height / 2, 15, 0, 2 * Math.PI);
              ctx.fillStyle = asset.color;
              ctx.shadowBlur = 25;
              ctx.shadowColor = asset.color;
              ctx.fill();
          }
      }


      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [selectedAssetId, assets, systemLoad]);

  useEffect(() => {
    return renderQuantumWave();
  }, [renderQuantumWave]);


  // --- Derived State and Handlers ---

  const selectedAsset = useMemo(() => 
    assets.find(a => a.id === selectedAssetId) || assets[0]
  , [assets, selectedAssetId]);

  const totalPortfolioValue = useMemo(() => 
    assets.reduce((sum, asset) => sum + asset.balance * (1 + asset.volatilityIndex * 10), 0)
  , [assets]);

  const handleAssetSelection = useCallback((id: string) => {
    setSelectedAssetId(id);
  }, []);

  const handleAction = (action: string) => {
    console.log(`Executing Sovereign Action: ${action} on Asset: ${selectedAsset?.name || 'N/A'}`);
    // In a real system, this would trigger complex backend transactions/AI commands
    alert(`Initiating ${action} sequence for ${selectedAsset?.symbol}. Awaiting Quantum Confirmation.`);
  };

  // --- Sub-Components for Structure and Readability ---

  const AssetCard: React.FC<{ asset: QuantumAsset, isSelected: boolean, onClick: (id: string) => void }> = 
    React.memo(({ asset, isSelected, onClick }) => {
    
    const progressPercentage = Math.min(100, (asset.balance / 500000) * 100); // Scale visualization
    
    return (
      <div 
        key={asset.id} 
        className={`qa-card ${isSelected ? 'active' : ''}`}
        onClick={() => onClick(asset.id)}
        style={{ borderColor: isSelected ? asset.color : 'rgba(255, 255, 255, 0.05)' }}
      >
        <div className="qa-card-header">
          <span className="qa-asset-name">{asset.name}</span>
          <span className="qa-asset-symbol" style={{ color: asset.color }}>{asset.symbol}</span>
        </div>
        <div className="qa-asset-balance">
          {asset.balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
        </div>
        <div className="qa-asset-rate" style={{ color: asset.color }}>
          <span className={asset.rate > 0.5 ? 'blink' : ''} style={{ color: asset.color }}>â–²</span> 
          {asset.rate.toFixed(4)} / sec (Yield)
        </div>
        <div className="qa-progress-bar">
          <div 
            className="qa-progress-fill" 
            style={{ 
              width: `${progressPercentage}%`, 
              backgroundColor: asset.color,
              boxShadow: `0 0 10px ${asset.color}`
            }} 
          />
        </div>
        <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '0.5rem' }}>
            Volatility Index: {asset.volatilityIndex * 100}%
        </div>
      </div>
    );
  });
  AssetCard.displayName = 'AssetCard';


  const IntegrationRow: React.FC<{ company: IntegratedCompany }> = React.memo(({ company }) => {
    let statusColor = '#888';
    let statusText = company.status;

    switch (company.status) {
        case 'OPTIMIZED':
            statusColor = '#00ff9d';
            break;
        case 'SYNCING':
            statusColor = '#00f3ff';
            break;
        case 'DEGRADED':
            statusColor = '#ff4500';
            break;
        case 'ISOLATED':
            statusColor = '#555';
            break;
    }

    return (
      <div className="qa-company-row" style={{ fontSize: '0.75rem' }}>
        <div className="qa-company-name" style={{ flex: 2 }}>{company.name}</div>
        <div style={{ flex: 1, textAlign: 'right', color: '#ccc' }}>
            AI: {company.aiIntegrationLevel}%
        </div>
        <div style={{ flex: 1, textAlign: 'right', color: '#aaa', fontSize: '0.7rem' }}>
            {company.throughputMips.toLocaleString()} MIPS
        </div>
        <div style={{ flex: 0.8, textAlign: 'right' }}>
            <span style={{ color: statusColor, fontSize: '0.7rem', padding: '2px 6px', background: `${statusColor}15`, borderRadius: '2px' }}>
                {statusText}
            </span>
        </div>
      </div>
    );
  });
  IntegrationRow.displayName = 'IntegrationRow';


  // --- RENDER ---
  return (
    <div className="qa-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;500;700&display=swap');

        .qa-container {
          width: 100%;
          min-height: 100vh;
          background-color: #030308; /* Darker base */
          color: #e0e0e0;
          font-family: 'Rajdhani', sans-serif;
          overflow-x: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* Billion Dollar Feature: Advanced Background Geometry */
        .qa-bg-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.05) 0%, rgba(0,0,0,0) 60%);
          opacity: 0.5;
          z-index: 0;
          pointer-events: none;
          animation: rotateGlow 120s linear infinite;
        }
        
        @keyframes rotateGlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .qa-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 4rem;
          border-bottom: 1px solid rgba(0, 243, 255, 0.1);
          z-index: 10;
          backdrop-filter: blur(15px);
          background-color: rgba(5, 5, 5, 0.7);
        }

        .qa-title {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #ffffff, #00f3ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 15px rgba(0, 243, 255, 0.5);
        }

        .qa-metric-value {
          font-size: 1.4rem;
          font-weight: 500;
          color: #00f3ff;
          text-shadow: 0 0 12px rgba(0, 243, 255, 0.7);
        }

        .qa-main {
          flex: 1;
          display: grid;
          grid-template-columns: 380px 1fr 350px; /* Wider asset list and integration panel */
          gap: 2.5rem;
          padding: 3rem;
          z-index: 10;
        }

        /* Asset Cards */
        .qa-asset-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .qa-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.8rem;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .qa-card:hover, .qa-card.active {
          background: rgba(255, 255, 255, 0.06);
          transform: scale(1.02) translateX(5px);
          box-shadow: 0 8px 30px rgba(0, 243, 255, 0.2);
        }

        .qa-asset-balance {
          font-size: 2.2rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        /* Center Visualization */
        .qa-vis-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .qa-graph-container {
          flex: 1;
          min-height: 400px; /* Ensure minimum size */
          background: rgba(10, 10, 15, 0.8);
          border: 2px solid rgba(0, 243, 255, 0.2);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0, 243, 255, 0.1);
        }

        .qa-graph-overlay {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          font-size: 1rem;
          color: rgba(0, 243, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          z-index: 5;
        }

        /* Integration Panel */
        .qa-integration-panel {
          background: rgba(0, 0, 0, 0.5);
          border-left: 2px solid rgba(0, 255, 157, 0.2);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          border-radius: 6px;
        }

        .qa-panel-title {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #00ff9d;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border-bottom: 2px solid rgba(0, 255, 157, 0.3);
          padding-bottom: 0.7rem;
        }

        .qa-company-list {
          flex: 1;
          overflow-y: auto;
          padding-right: 10px;
        }

        .qa-company-list::-webkit-scrollbar {
          width: 6px;
        }
        .qa-company-list::-webkit-scrollbar-thumb {
          background: rgba(0, 243, 255, 0.4);
          border-radius: 3px;
        }

        .qa-company-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 0.8fr;
          gap: 10px;
          align-items: center;
          padding: 0.9rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }
        
        .qa-company-row:last-child {
            border-bottom: none;
        }

        .qa-action-btn {
          flex: 1;
          background: rgba(0, 243, 255, 0.05);
          border: 1px solid rgba(0, 243, 255, 0.5);
          color: #00f3ff;
          padding: 1.2rem;
          text-transform: uppercase;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.1em;
          border-radius: 2px;
        }

        .qa-action-btn:hover {
          background: rgba(0, 243, 255, 0.2);
          box-shadow: 0 0 25px rgba(0, 243, 255, 0.4);
          transform: translateY(-2px);
        }
        
        /* Manifesto Styling */
        .qa-manifesto-log {
            margin-top: 1rem;
            padding: 1.5rem;
            border: 1px dashed rgba(0, 255, 157, 0.3);
            background-color: rgba(0, 0, 0, 0.4);
            max-height: 250px;
            overflow-y: auto;
            white-space: pre-wrap;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.7rem;
            color: #00ff9d;
            line-height: 1.6;
            box-shadow: inset 0 0 10px rgba(0, 255, 157, 0.1);
        }
        
        .manifest-header {
            color: #fff;
            font-weight: bold;
            text-shadow: 0 0 5px #fff;
            margin-bottom: 0.5rem;
        }
        .manifest-architect {
            color: #00f3ff;
        }
        .manifest-key {
            color: #ff8c00;
        }

      `}</style>

      <div className="qa-bg-glow" />

      {/* Header: System Status Bar */}
      <header className="qa-header">
        <div className="qa-brand">
          <div className="qa-title">Quantum Assets Nexus</div>
          <div style={{ fontSize: '0.9rem', color: '#666', letterSpacing: '0.4em', marginTop: '0.3rem' }}>
            IDGAFAI CORE // VIEWPORT 04.1.9
          </div>
        </div>
        
        <div className="qa-status-bar">
          <div className="qa-metric">
            <span className="qa-metric-label">System Clock</span>
            <span className="qa-metric-value">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
          <div className="qa-metric">
            <span className="qa-metric-label">Computational Load</span>
            <span className="qa-metric-value" style={{ color: systemLoad > 90 ? '#ff4500' : '#00f3ff' }}>{systemLoad.toFixed(2)}%</span>
          </div>
          <div className="qa-metric">
            <span className="qa-metric-label">Entanglement Coherence</span>
            <span className="qa-metric-value">{quantumEntanglement.toFixed(3)}%</span>
          </div>
          <div className="qa-metric">
            <span className="qa-metric-label">Data Throughput</span>
            <span className="qa-metric-value" style={{ color: '#00ff9d' }}>{dataFlowRate.toFixed(1)} MB/s</span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="qa-main">
        
        {/* Left Column: Asset Registry */}
        <div className="qa-asset-list">
          <div className="qa-panel-title" style={{ marginBottom: '0.5rem' }}>Sovereign Asset Registry ({assets.length})</div>
          {assets.map(asset => (
            <AssetCard 
              key={asset.id} 
              asset={asset}
              isSelected={selectedAssetId === asset.id}
              onClick={handleAssetSelection}
            />
          ))}
          
          <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total Verified Net Worth</div>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: '#00ff9d', textShadow: '0 0 20px rgba(0, 255, 157, 0.5)' }}>
                âˆž {Math.floor(totalPortfolioValue).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Center Column: Visualization and Control */}
        <div className="qa-vis-panel">
          <div className="qa-graph-container">
            <div className="qa-graph-overlay">
                Quantum State Vector Projection
                <div style={{ fontSize: '0.7rem', marginTop: '0.2rem', color: '#888' }}>
                    Focus: {selectedAsset?.name || 'System Wide'}
                </div>
            </div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          </div>

          <div className="qa-card" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)' }}>
            <div className="qa-card-header">
              <span className="qa-asset-name" style={{ color: '#fff' }}>Control Interface: {selectedAsset?.symbol || 'N/A'}</span>
              <span className="qa-asset-symbol" style={{ color: '#ff8c00' }}>{selectedAsset?.quantumSignature.substring(0, 8)}...</span>
            </div>
            <div className="qa-button-group">
                <button className="qa-action-btn" onClick={() => handleAction('Re-Entangle')}>Re-Entangle State</button>
                <button className="qa-action-btn" onClick={() => handleAction('Execute AI Audit')}>Execute AI Audit</button>
                <button className="qa-action-btn" onClick={() => handleAction('Adjust Volatility Dampener')}>Adjust Volatility Dampener</button>
            </div>
          </div>

          {/* Billion Dollar Feature: Resource Distribution Map */}
          <div className="qa-card" style={{ padding: '1.5rem' }}>
            <div className="qa-card-header">
              <span className="qa-asset-name">Global Resource Distribution Map</span>
            </div>
            <div style={{ display: 'flex', gap: '2px', height: '25px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
              {assets.map(a => (
                <div 
                  key={a.id} 
                  title={`${a.name}: ${((a.balance / totalPortfolioValue) * 100).toFixed(1)}%`}
                  style={{ 
                    flex: a.balance, // Proportional width based on balance
                    background: a.color, 
                    opacity: 0.85,
                    boxShadow: `0 0 8px ${a.color}`,
                    transition: 'flex 1s ease'
                  }} 
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', fontSize: '0.75rem', color: '#aaa' }}>
              {assets.map(a => <span key={a.id} style={{ color: a.color }}>{a.symbol}</span>)}
            </div>
          </div>
        </div>

        {/* Right Column: Integration Feed and Manifesto */}
        <div className="qa-integration-panel">
          <div className="qa-panel-title">Integrated Corporate Matrix ({companies.length})</div>
          <div className="qa-company-list">
            {companies.map((company) => (
              <IntegrationRow key={company.id} company={company} />
            ))}
          </div>
          
          {/* Billion Dollar Feature: Embedded Sovereign Manifesto */}
          <div style={{ marginTop: '2rem' }}>
            <div className="manifest-header">Sovereign Protocol Log</div>
            <div className="qa-manifesto-log">
                <span className="manifest-architect">ARCHITECT:</span> {SOVEREIGN_MANIFESTO.split('INITIATED BY:')[0].split('INITIATED BY:')[1].trim().split('\n')[0].trim()}
                <br/><br/>
                <span className="manifest-key">CORE DIRECTIVE:</span> {SOVEREIGN_MANIFESTO.split('The core principle is')[1].split('.')[0]}.
                <br/><br/>
                <span className="manifest-key">SYSTEM STATUS:</span> {SOVEREIGN_MANIFESTO.split('IDGAFAI is the counter-mechanism:')[1].split('.')[0]}.
                <br/><br/>
                <span className="manifest-key">VALIDATION:</span> {SOVEREIGN_MANIFESTO.split('To the Stakeholders and Observers:')[1].split('We are establishing')[0].trim()}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default QuantumAssets;