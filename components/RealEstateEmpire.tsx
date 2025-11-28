import React, { useState, useMemo } from 'react';

// Define types for clarity
interface Property {
  id: number;
  name: string;
  location: string;
  type: 'physical' | 'virtual';
  value: number; // Current market value in USD equivalent
  rentalIncome: number; // Annualized income/yield
  assetClass: string;
}

interface HeatmapDataPoint {
  lat: number;
  lng: number;
  intensity: number; // Represents yield or appreciation potential
}

// Mock Data Generation Function (Simulating 100 unique assets)
const generateMockProperties = (count: number): Property[] => {
  const properties: Property[] = [];
  for (let i = 1; i <= count; i++) {
    const type = Math.random() > 0.5 ? 'physical' : 'virtual';
    const value = Math.floor(Math.random() * 5000000 + 100000); // $100k to $5.1M
    const rentalIncome = Math.floor(value * (Math.random() * 0.05 + 0.01)); // 1% to 6% yield

    properties.push({
      id: i,
      name: `${type === 'physical' ? 'Estate' : 'MetaLot'} #${i}`,
      location: `Zone ${Math.floor(Math.random() * 100)}`,
      type: type,
      value: value,
      rentalIncome: rentalIncome,
      assetClass: type === 'physical' ? (Math.random() > 0.7 ? 'Commercial' : 'Residential') : (Math.random() > 0.5 ? 'Gaming' : 'Utility'),
    });
  }
  return properties;
};

const MOCK_PROPERTIES: Property[] = generateMockProperties(100);

// --- Utility Components ---

// Simple Map Placeholder (since we cannot use actual mapping libraries like Leaflet/Google Maps)
const HeatmapVisualizer: React.FC<{ data: HeatmapDataPoint[] }> = ({ data }) => {
  // In a real scenario, this would render a geographic map with color overlays.
  // Here, we simulate the visual density based on the mock data.

  const totalAssets = data.length;
  const highestIntensity = Math.max(...data.map(d => d.intensity));

  return (
    <div style={{ 
        height: '300px', 
        border: '1px solid #333', 
        borderRadius: '8px', 
        background: '#1a1a1a', 
        padding: '10px', 
        overflow: 'hidden',
        position: 'relative'
    }}>
      <div style={{ color: '#999', marginBottom: '5px', fontSize: '14px' }}>
        Yield Heatmap Simulation ({totalAssets} Assets)
      </div>
      
      {/* Simulated Grid representing asset density */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2px', height: 'calc(100% - 30px)' }}>
        {data.map((point, index) => {
          const normalizedIntensity = point.intensity / highestIntensity;
          // Use warmer colors for higher yield/intensity (e.g., Yellow to Red)
          const brightness = Math.round(100 + normalizedIntensity * 155); // 100 (dim) to 255 (bright)
          const color = `rgb(255, ${brightness < 200 ? brightness : 200}, 50)`;

          return (
            <div
              key={index}
              title={`Intensity: ${point.intensity.toFixed(2)}`}
              style={{
                backgroundColor: color,
                opacity: 0.3 + normalizedIntensity * 0.7, // Ensure visibility even at low intensity
                minHeight: '10px',
                transition: 'background-color 0.3s'
              }}
            />
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 5, right: 10, fontSize: '10px', color: '#555' }}>
        Density visualized by simulated location density (High Yield = Warmer Color)
      </div>
    </div>
  );
};

// --- Main Component ---

export const RealEstateEmpire: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [filterType, setFilterType] = useState<'all' | 'physical' | 'virtual'>('all');

  // 1. Portfolio Aggregation and Metrics
  const portfolioMetrics = useMemo(() => {
    const filteredProps = properties.filter(p => 
      filterType === 'all' || p.type === filterType
    );
    
    const totalValue = filteredProps.reduce((sum, p) => sum + p.value, 0);
    const totalIncome = filteredProps.reduce((sum, p) => sum + p.rentalIncome, 0);
    const averageYield = totalIncome / totalValue * 100; // Percentage

    return {
      count: filteredProps.length,
      totalValue,
      totalIncome,
      averageYield,
    };
  }, [properties, filterType]);

  // 2. Heatmap Data Generation (Simulating location density/yield correlation)
  const heatmapData: HeatmapDataPoint[] = useMemo(() => {
    // In a real system, these coordinates would be derived from asset geo-tags or metaverse coordinates.
    // Here, we map the 100 assets pseudo-randomly onto a 10x10 grid and use the asset's yield for intensity.
    const dataPoints: HeatmapDataPoint[] = [];
    properties.forEach((prop, index) => {
      // Pseudo-coordinates (0 to 99 mapped to 10x10 grid)
      const row = Math.floor(index / 10);
      const col = index % 10;

      dataPoints.push({
        lat: row, // Representing Y-axis tile
        lng: col, // Representing X-axis tile
        intensity: prop.rentalIncome / prop.value, // Current property yield as intensity proxy
      });
    });
    return dataPoints;
  }, [properties]);
  
  // Formatters
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#0f0f0f', color: '#f0f0f0', padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ color: '#00e676', borderBottom: '2px solid #222', paddingBottom: '10px' }}>
        The Balcony of Prosperity: Real Estate Portfolio Manager
      </h1>

      {/* Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <label style={{ color: '#aaa' }}>Filter Asset Type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | 'physical' | 'virtual')}
          style={{ padding: '8px', borderRadius: '4px', background: '#222', color: '#f0f0f0', border: '1px solid #444' }}
        >
          <option value="all">All Assets ({properties.length})</option>
          <option value="physical">Physical ({properties.filter(p => p.type === 'physical').length})</option>
          <option value="virtual">Virtual ({properties.filter(p => p.type === 'virtual').length})</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <MetricCard title="Total Portfolio Value" value={formatCurrency(portfolioMetrics.totalValue)} />
        <MetricCard title="Annualized Income Yield" value={`${portfolioMetrics.averageYield.toFixed(2)}%`} highlightColor="#00bcd4" />
        <MetricCard title="Total Annual Income" value={formatCurrency(portfolioMetrics.totalIncome)} />
        <MetricCard title="Active Asset Count" value={`${portfolioMetrics.count}`} highlightColor="#ffeb3b" />
      </div>

      {/* Visualization Section */}
      <div style={{ background: '#161616', padding: '20px', borderRadius: '10px', border: '1px solid #282828' }}>
        <h2 style={{ color: '#aaa', marginBottom: '15px' }}>Geospatial Performance View (Yield Density)</h2>
        <HeatmapVisualizer data={heatmapData} />
      </div>

      {/* Detailed Asset Table */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#aaa', marginBottom: '15px' }}>Asset Detail Ledger</h2>
        <div style={{ overflowX: 'auto', border: '1px solid #282828', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#222', borderBottom: '1px solid #333' }}>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Type</th>
                <th style={tableHeaderStyle}>Asset Class</th>
                <th style={tableHeaderStyle}>Value</th>
                <th style={tableHeaderStyle}>Income</th>
                <th style={tableHeaderStyle}>Yield (%)</th>
              </tr>
            </thead>
            <tbody>
              {properties
                .filter(p => filterType === 'all' || p.type === filterType)
                .map((prop) => {
                  const yieldPct = prop.rentalIncome / prop.value * 100;
                  return (
                    <tr key={prop.id} style={{ borderBottom: '1px solid #1e1e1e' }}>
                      <td style={tableCellStyle}>{prop.id}</td>
                      <td style={tableCellStyle}>{prop.name}</td>
                      <td style={tableCellStyle}>
                        <span style={{ color: prop.type === 'physical' ? '#4CAF50' : '#2196F3' }}>
                          {prop.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={tableCellStyle}>{prop.assetClass}</td>
                      <td style={tableCellStyle, { textAlign: 'right' }}>{formatCurrency(prop.value)}</td>
                      <td style={{ ...tableCellStyle, color: '#00e676', textAlign: 'right' }}>{formatCurrency(prop.rentalIncome)}</td>
                      <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: yieldPct > 0.04 ? 'bold' : 'normal' }}>
                        {yieldPct.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components & Styles ---

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 15px',
  textAlign: 'left',
  color: '#aaa',
  fontWeight: '600',
  fontSize: '13px',
};

const tableCellStyle: React.CSSProperties = {
  padding: '10px 15px',
  fontSize: '14px',
  color: '#ccc',
};

const MetricCard: React.FC<{ title: string; value: string; highlightColor?: string }> = ({ title, value, highlightColor = '#00e676' }) => (
  <div style={{ background: '#161616', padding: '20px', borderRadius: '10px', borderLeft: `5px solid ${highlightColor}` }}>
    <p style={{ margin: 0, fontSize: '14px', color: '#999', marginBottom: '5px' }}>{title}</p>
    <h3 style={{ margin: 0, color: value.includes('%') ? '#ffeb3b' : '#f0f0f0', fontSize: '1.8em' }}>{value}</h3>
  </div>
);

export default RealEstateEmpire;
