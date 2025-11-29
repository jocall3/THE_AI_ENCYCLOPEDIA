import React, { useState, useMemo, useCallback, useEffect } from 'react';

// --- Core Domain Models (Enhanced for Billion Dollar Scale) ---

/**
 * Represents a single, immutable asset within the global portfolio.
 * Expanded fields to support advanced AI valuation, risk modeling, and regulatory compliance.
 */
interface Property {
  id: string; // UUID for global uniqueness
  name: string;
  location: {
    geoHash: string; // Precision location encoding
    jurisdiction: string; // Legal/Tax jurisdiction
    sector: string; // Urban, Rural, Orbital, Digital Plane
  };
  type: 'PhysicalAsset' | 'DigitalConstruct' | 'SyntheticDerivative';
  valuation: {
    currentMarketValue: number; // USD equivalent, dynamically updated
    appraisalDate: number; // Timestamp of last AI appraisal
    riskScore: number; // 0.0 (Safe) to 1.0 (High Volatility)
    appreciationTrajectory: 'Exponential' | 'Linear' | 'Decaying';
  };
  financials: {
    annualizedNetIncome: number; // After operational costs
    capRate: number; // Capitalization Rate
    liquidityIndex: number; // 0 to 100
    taxExposureLevel: 'Low' | 'Medium' | 'High';
  };
  assetClass: string; // e.g., Tier-1 Residential, Hyperscale Data Center, Metaverse Land Parcel
  metadata: {
    creationTimestamp: number;
    lastAuditHash: string;
    aiSentimentScore: number; // Derived from global news/market sentiment analysis
  };
}

/**
 * Data structure for geospatial visualization, now incorporating AI-driven predictive intensity.
 */
interface PredictiveHeatmapDataPoint {
  lat: number;
  lng: number;
  predictiveYieldIndex: number; // AI forecast for next quarter's yield
  volatilityFactor: number; // Localized market volatility prediction
}

// --- AI & Simulation Layer ---

/**
 * Simulates the generation of 1000 high-value, complex assets across diverse classes.
 * This function now incorporates stochastic modeling for realistic financial variance.
 */
const generateHyperScaleProperties = (count: number): Property[] => {
  const properties: Property[] = [];
  const assetClasses = {
    PhysicalAsset: ['Tier-1 Residential', 'Hyperscale Data Center', 'Logistics Hub', 'Renewable Energy Farm'],
    DigitalConstruct: ['Metaverse Land Parcel', 'Decentralized Compute Node', 'AI Training Cluster Lease'],
    SyntheticDerivative: ['Tokenized Equity Basket', 'Yield-Bearing Smart Contract', 'Regulatory Arbitrage Position'],
  };

  for (let i = 1; i <= count; i++) {
    const typeKeys = Object.keys(assetClasses) as Array<keyof typeof assetClasses>;
    const type = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    const classList = assetClasses[type];
    const assetClass = classList[Math.floor(Math.random() * classList.length)];

    // Value simulation based on asset class complexity
    let baseValue = Math.random() * 10000000 + 500000; // $500k to $10.5M base
    if (type === 'DigitalConstruct') baseValue *= (Math.random() * 3 + 1); // Digital assets are often higher value/risk
    
    const value = Math.floor(baseValue);
    const capRate = Math.random() * 0.05 + 0.02; // 2% to 7%
    const annualizedNetIncome = Math.floor(value * capRate);
    
    const riskScore = Math.min(1.0, (Math.random() * 0.1) + (type === 'SyntheticDerivative' ? 0.3 : 0));
    const liquidityIndex = Math.floor(Math.random() * 100);
    
    const trajectoryOptions: Property['valuation']['appreciationTrajectory'][] = ['Exponential', 'Linear', 'Decaying'];
    const appreciationTrajectory = trajectoryOptions[Math.floor(Math.random() * trajectoryOptions.length)];

    properties.push({
      id: `PROP-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`,
      name: `${assetClass} Instance ${i}`,
      location: {
        geoHash: Math.random().toString(36).substring(2, 10).toUpperCase(),
        jurisdiction: ['Cayman', 'Singapore', 'Delaware', 'EU-Regulated'][Math.floor(Math.random() * 4)],
        sector: ['Urban Core', 'Edge Compute', 'Offshore', 'Digital Plane'][Math.floor(Math.random() * 4)],
      },
      type: type as Property['type'],
      valuation: {
        currentMarketValue: value,
        appraisalDate: Date.now() - Math.floor(Math.random() * 86400000), // Within last day
        riskScore: parseFloat(riskScore.toFixed(3)),
        appreciationTrajectory: appreciationTrajectory,
      },
      financials: {
        annualizedNetIncome: annualizedNetIncome,
        capRate: parseFloat(capRate.toFixed(4)),
        liquidityIndex: liquidityIndex,
        taxExposureLevel: riskScore > 0.6 ? 'High' : (liquidityIndex < 30 ? 'Medium' : 'Low'),
      },
      assetClass: assetClass,
      metadata: {
        creationTimestamp: Date.now() - Math.floor(Math.random() * 31536000000), // Last year
        lastAuditHash: `AUDIT-${Math.random().toString(16).substring(2, 12)}`,
        aiSentimentScore: parseFloat((Math.random() * 100).toFixed(2)),
      },
    });
  }
  return properties;
};

const MOCK_PROPERTIES: Property[] = generateHyperScaleProperties(1000); // Expanded to 1000 assets

// --- Utility Components (Enhanced for Enterprise UI/UX) ---

/**
 * Advanced Visualization Component: Simulates a predictive risk/yield heatmap.
 * Utilizes AI-derived intensity metrics.
 */
const PredictiveHeatmapVisualizer: React.FC<{ data: PredictiveHeatmapDataPoint[] }> = React.memo(({ data }) => {
  
  const totalAssets = data.length;
  const maxYield = Math.max(...data.map(d => d.predictiveYieldIndex));
  const maxVolatility = Math.max(...data.map(d => d.volatilityFactor));

  // Memoize the rendering of individual cells to prevent unnecessary DOM updates
  const renderGridCells = useMemo(() => {
    return data.map((point, index) => {
      const normalizedYield = maxYield > 0 ? point.predictiveYieldIndex / maxYield : 0;
      const normalizedVolatility = maxVolatility > 0 ? point.volatilityFactor / maxVolatility : 0;

      // Color mapping: High Yield (Green/Blue) vs High Volatility (Red/Orange)
      // We use a blend: Green for yield, Red for risk. Center point (0.5, 0.5) is neutral gray.
      
      // Intensity calculation: Prioritize yield, but use volatility as a darkening/muting factor.
      const greenComponent = Math.round(255 * normalizedYield);
      const redComponent = Math.round(150 * normalizedVolatility);
      const blueComponent = Math.round(150 * normalizedYield);
      
      // Base color is dark gray/black background
      const baseOpacity = 0.1 + normalizedYield * 0.6;

      return (
        <div
          key={index}
          title={`Yield Forecast: ${(normalizedYield * 100).toFixed(1)}% | Volatility: ${(normalizedVolatility * 100).toFixed(1)}%`}
          style={{
            backgroundColor: `rgb(${redComponent}, ${blueComponent}, ${greenComponent})`,
            opacity: baseOpacity,
            minHeight: '5px',
            transition: 'all 0.5s ease-out',
            border: '0.5px solid rgba(255, 255, 255, 0.05)'
          }}
        />
      );
    });
  }, [data, maxYield, maxVolatility]);

  return (
    <div style={{ 
        height: '450px', 
        border: '1px solid #333', 
        borderRadius: '10px', 
        background: '#0a0a0a', 
        padding: '15px', 
        position: 'relative',
        boxShadow: 'inset 0 0 10px rgba(0, 230, 102, 0.1)'
    }}>
      <div style={{ color: '#00e676', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
        AI Predictive Yield & Risk Map ({totalAssets} Geo-Tiles Analyzed)
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: '1px', height: 'calc(100% - 40px)' }}>
        {renderGridCells}
      </div>
      
      <div style={{ position: 'absolute', bottom: 10, left: 15, fontSize: '11px', color: '#555' }}>
        Color Intensity: Green/Blue = High Forecasted Yield. Red Component = Localized Volatility Risk.
      </div>
    </div>
  );
});

/**
 * Standardized Metric Display Card for Executive Dashboards.
 */
const ExecutiveMetricCard: React.FC<{ title: string; value: string; secondaryValue?: string; trend?: 'up' | 'down' | 'flat' }> = ({ title, value, secondaryValue, trend = 'flat' }) => {
  
  const trendColor = trend === 'up' ? '#4CAF50' : trend === 'down' ? '#F44336' : '#FFEB3B';
  
  return (
    <div style={{ 
        background: '#161616', 
        padding: '25px', 
        borderRadius: '10px', 
        border: '1px solid #282828',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 20px rgba(0, 230, 102, 0.2)'
        }
    }}>
      <p style={{ margin: 0, fontSize: '15px', color: '#999', fontWeight: '500', marginBottom: '8px' }}>{title}</p>
      <h3 style={{ margin: 0, color: '#f0f0f0', fontSize: '2.2em', fontWeight: '700' }}>{value}</h3>
      {secondaryValue && (
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <span style={{ color: trendColor, marginRight: '5px' }}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
          </span>
          <span style={{ color: trendColor }}>{secondaryValue}</span>
        </div>
      )}
    </div>
  );
};

// --- Main Component Logic ---

export const RealEstateEmpire: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [filterType, setFilterType] = useState<'all' | 'PhysicalAsset' | 'DigitalConstruct' | 'SyntheticDerivative'>('all');
  const [sortKey, setSortKey] = useState<keyof Property>('valuation.currentMarketValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Utility for deep property access (for sorting complex objects)
  const getDeepValue = useCallback((obj: Property, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }, []);

  // 1. Portfolio Aggregation and Metrics (Memoized for performance)
  const portfolioMetrics = useMemo(() => {
    const filteredProps = properties.filter(p => 
      filterType === 'all' || p.type === filterType
    );
    
    const totalValue = filteredProps.reduce((sum, p) => sum + p.valuation.currentMarketValue, 0);
    const totalIncome = filteredProps.reduce((sum, p) => sum + p.financials.annualizedNetIncome, 0);
    const totalRiskScore = filteredProps.reduce((sum, p) => sum + p.valuation.riskScore, 0);
    
    const averageYield = totalValue > 0 ? (totalIncome / totalValue) : 0; // As a decimal
    const averageRisk = filteredProps.length > 0 ? (totalRiskScore / filteredProps.length) : 0;

    return {
      count: filteredProps.length,
      totalValue,
      totalIncome,
      averageYield, // Decimal
      averageRisk, // Decimal
    };
  }, [properties, filterType]);

  // 2. Predictive Heatmap Data Generation (AI Simulation)
  const predictiveHeatmapData: PredictiveHeatmapDataPoint[] = useMemo(() => {
    // Simulating 20x20 grid (400 tiles) for high-resolution analysis
    const dataPoints: PredictiveHeatmapDataPoint[] = [];
    const gridSize = 20;
    
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Simple pseudo-random assignment based on tile location, modulated by asset distribution
        const baseYield = (Math.sin(r * 0.5) + Math.cos(c * 0.3) + 2) / 4; // Base yield factor 0.5 to 1.5
        const baseVolatility = (Math.abs(r - gridSize / 2) + Math.abs(c - gridSize / 2)) / (gridSize * 2); // Volatility higher at edges

        // Introduce noise based on actual asset distribution (simplified)
        const noiseFactor = Math.random() * 0.1;
        
        dataPoints.push({
          lat: r,
          lng: c,
          predictiveYieldIndex: (baseYield + noiseFactor) * 0.06, // Target yield range 3% to 9%
          volatilityFactor: baseVolatility + noiseFactor * 0.5, // Target volatility range 0% to 50%
        });
      }
    }
    return dataPoints;
  }, []); // Independent of properties state for this simulation layer

  // 3. Sorting Logic
  const handleSort = (key: keyof Property) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc'); // Default to descending for financial metrics
    }
  };

  const sortedAndFilteredProperties = useMemo(() => {
    let result = properties.filter(p => 
      filterType === 'all' || p.type === filterType
    );

    result.sort((a, b) => {
      const valA = getDeepValue(a, sortKey);
      const valB = getDeepValue(b, sortKey);

      if (valA === undefined || valB === undefined) return 0;

      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      
      // Numeric comparison
      if (sortDirection === 'asc') {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    return result;
  }, [properties, filterType, sortKey, sortDirection, getDeepValue]);
  
  // Formatters
  const formatCurrency = useCallback((amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount), []);
    
  const formatPercentage = useCallback((value: number) => 
    new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value), []);

  // --- Render Section ---
  
  const currentYieldPct = portfolioMetrics.averageYield * 100;
  const riskLevel = portfolioMetrics.averageRisk > 0.4 ? 'CRITICAL' : portfolioMetrics.averageRisk > 0.2 ? 'ELEVATED' : 'OPTIMAL';

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', background: '#050505', color: '#e0e0e0', padding: '30px', minHeight: '100vh' }}>
      
      {/* System Header and AI Context */}
      <header style={{ borderBottom: '3px solid #00e676', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ color: '#00e676', fontSize: '2.5em', margin: 0, letterSpacing: '1px' }}>
          Quantum Asset Nexus: Global Portfolio Command Center
        </h1>
        <p style={{ color: '#777', marginTop: '5px', fontSize: '1.1em' }}>
          Architecture Layer 7.0 | Sovereign AI Oversight: ORACLE-PRIME
        </p>
      </header>

      {/* AI Mandate Section - Replaced placeholder narrative with professional system context */}
      <div style={{ margin: '30px 0', padding: '25px', background: '#111111', border: '1px solid #00e676', borderRadius: '10px', boxShadow: '0 0 15px rgba(0, 230, 102, 0.3)' }}>
        <h2 style={{ color: '#00e676', marginTop: 0, fontSize: '1.5em' }}>System Directive: Absolute Value Optimization</h2>
        <p style={{ color: '#ccc', lineHeight: '1.7', fontSize: '1.05em' }}>
          This interface provides real-time telemetry for the integrated global asset matrix. Every data point is processed through the ORACLE-PRIME engine, which utilizes proprietary temporal causality modeling to predict asset performance across 12 fiscal quarters. Our mandate is not merely capital preservation, but the aggressive, risk-adjusted maximization of net present value (NPV) across all managed entities.
        </p>
        <p style={{ color: '#ccc', lineHeight: '1.7', fontSize: '1.05em' }}>
          Note: Asset classifications (Physical, Digital, Synthetic) are dynamically weighted based on current macroeconomic entropy indicators. All valuation figures reflect the AI's consensus appraisal, which supersedes legacy GAAP/IFRS reporting standards.
        </p>
      </div>

      {/* Key Performance Indicators (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px' }}>
        <ExecutiveMetricCard 
          title="Total Enterprise Valuation (NAV)" 
          value={formatCurrency(portfolioMetrics.totalValue)} 
          secondaryValue={`+${formatPercentage(0.012)} YTD`}
          trend="up"
        />
        <ExecutiveMetricCard 
          title="Net Yield Rate (Weighted Average)" 
          value={formatPercentage(portfolioMetrics.averageYield)} 
          secondaryValue={`Target: ${formatPercentage(0.05)}`}
          trend={currentYieldPct > 5 ? 'up' : currentYieldPct < 3.5 ? 'down' : 'flat'}
        />
        <ExecutiveMetricCard 
          title="Systemic Risk Exposure Index" 
          value={(portfolioMetrics.averageRisk * 100).toFixed(1) + '%'} 
          secondaryValue={`Status: ${riskLevel}`}
          trend={riskLevel === 'CRITICAL' ? 'down' : riskLevel === 'ELEVATED' ? 'flat' : 'up'}
          highlightColor={riskLevel === 'CRITICAL' ? '#F44336' : riskLevel === 'ELEVATED' ? '#FF9800' : '#4CAF50'}
        />
        <ExecutiveMetricCard 
          title="Total Annualized Net Income" 
          value={formatCurrency(portfolioMetrics.totalIncome)} 
          secondaryValue={`${portfolioMetrics.count} Active Units`}
          trend="up"
        />
      </div>

      {/* Control Panel and Visualization */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
        
        {/* Filter Controls */}
        <div style={{ flexShrink: 0, width: '250px', background: '#111111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
          <h3 style={{ color: '#aaa', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Asset Segmentation</h3>
          
          {['all', 'PhysicalAsset', 'DigitalConstruct', 'SyntheticDerivative'].map((type) => {
            const count = type === 'all' 
              ? properties.length 
              : properties.filter(p => p.type === type).length;
            
            const isActive = filterType === type;
            
            return (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 10px',
                  margin: '8px 0',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? '#004d29' : '#222',
                  color: isActive ? '#e0e0e0' : '#aaa',
                  fontWeight: isActive ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <span>{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span style={{ color: isActive ? '#00e676' : '#777' }}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Visualization Area */}
        <div style={{ flexGrow: 1 }}>
          <PredictiveHeatmapVisualizer data={predictiveHeatmapData} />
        </div>
      </div>

      {/* Detailed Asset Ledger */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#aaa', marginBottom: '15px', fontSize: '1.5em' }}>Asset Registry & Audit Log</h2>
        <div style={{ overflowX: 'auto', border: '1px solid #282828', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', borderBottom: '2px solid #00e676' }}>
                {/* Sortable Headers */}
                {[{ key: 'id', label: 'Asset ID' }, { key: 'name', label: 'Designation' }, { key: 'type', label: 'Type' }, { key: 'assetClass', label: 'Class' }, { key: 'valuation.currentMarketValue', label: 'Value' }, { key: 'financials.annualizedNetIncome', label: 'Income' }, { key: 'valuation.riskScore', label: 'Risk Score' }, { key: 'financials.capRate', label: 'Cap Rate' }, { key: 'metadata.aiSentimentScore', label: 'AI Sentiment' }].map(header => (
                  <th 
                    key={header.key} 
                    onClick={() => header.key !== 'id' && handleSort(header.key as keyof Property)}
                    style={{...tableHeaderStyle, cursor: header.key !== 'id' ? 'pointer' : 'default', width: header.key === 'id' ? '15%' : 'auto' }}
                  >
                    {header.label}
                    {header.key === sortKey && (
                      <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredProperties.map((prop) => {
                const yieldPct = prop.valuation.currentMarketValue > 0 ? (prop.financials.annualizedNetIncome / prop.valuation.currentMarketValue) : 0;
                const riskColor = prop.valuation.riskScore > 0.5 ? '#F44336' : prop.valuation.riskScore > 0.2 ? '#FF9800' : '#4CAF50';
                
                return (
                  <tr key={prop.id} style={{ borderBottom: '1px solid #1e1e1e', transition: 'background 0.2s', ':hover': { background: '#141414' } }}>
                    <td style={tableCellStyle}>{prop.id.substring(0, 12)}...</td>
                    <td style={tableCellStyle}>{prop.name}</td>
                    <td style={tableCellStyle}>
                      <span style={{ color: prop.type === 'PhysicalAsset' ? '#4CAF50' : prop.type === 'DigitalConstruct' ? '#2196F3' : '#FFEB3B', fontWeight: 'bold' }}>
                        {prop.type.split(/(?=[A-Z])/).join(' ')}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{prop.assetClass}</td>
                    <td style={{...tableCellStyle, textAlign: 'right', color: '#00e676' }}>{formatCurrency(prop.valuation.currentMarketValue)}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'right', color: '#FFEB3B' }}>{formatCurrency(prop.financials.annualizedNetIncome)}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 'bold', color: riskColor }}>
                      {prop.valuation.riskScore.toFixed(3)}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'right' }}>{formatPercentage(prop.financials.capRate)}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'right', color: prop.metadata.aiSentimentScore > 70 ? '#4CAF50' : prop.metadata.aiSentimentScore < 30 ? '#F44336' : '#FFEB3B' }}>
                      {prop.metadata.aiSentimentScore.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Context */}
      <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #222', textAlign: 'center', fontSize: '12px', color: '#555' }}>
        Real Estate Empire Component v7.1.0 | Powered by ORACLE-PRIME Predictive Analytics Engine. All rights reserved by the Architect.
      </footer>
    </div>
  );
};

// --- Helper Components & Styles (Refined) ---

const tableHeaderStyle: React.CSSProperties = {
  padding: '15px',
  textAlign: 'left',
  color: '#aaa',
  fontWeight: '600',
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px 15px',
  fontSize: '13px',
  color: '#ccc',
};

export default RealEstateEmpire;
---