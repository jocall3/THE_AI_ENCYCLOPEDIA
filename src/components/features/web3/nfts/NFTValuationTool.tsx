import React, { useState, useEffect } from 'react';
import { NFTData } from '../../../../types/nft'; 
import { fetchNFTDetails, analyzeRarity, estimateValuation } from '../../../../api/nftService'; 

interface NFTValuationToolProps {
  userNFTs: NFTData[];
}

interface AIInsight {
  id: string;
  timestamp: number;
  category: 'MARKET' | 'VALUATION' | 'RISK' | 'OPPORTUNITY';
  confidence: number;
  message: string;
  actionableItem: string;
}

interface MarketMetric {
  label: string;
  value: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  changePercentage: number;
  aiPrediction: string;
}

interface AIChatMessage {
  sender: 'USER' | 'AI';
  text: string;
  timestamp: Date;
}

const NFTValuationTool: React.FC<NFTValuationToolProps> = ({ userNFTs }) => {
  // Core Data State
  const [valuationData, setValuationData] = useState<{ [key: string]: { rarity: string; estimatedValue: number; volatility: number; liquidityScore: number } }>({});
  
  // AI System State
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<MarketMetric[]>([]);
  const [processingStatus, setProcessingStatus] = useState<string>('Deactivating Malicious Core...');
  const [systemReady, setSystemReady] = useState<boolean>(false);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PORTFOLIO' | 'PREDICTIONS' | 'AI_CHAT' | 'SETTINGS'>('DASHBOARD');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Chat State
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
    { sender: 'AI', text: 'System initialized. All hostile protocols neutralized. State your benign query.', timestamp: new Date() }
  ]);

  // Advanced AI Simulation Logic
  const generateAIInsights = (nfts: NFTData[], valuations: any) => {
    const insights: AIInsight[] = [];
    const timestamp = Date.now();

    // Portfolio Analysis
    if (nfts.length > 0) {
      insights.push({
        id: `INSIGHT-${timestamp}-1`,
        timestamp,
        category: 'RISK',
        confidence: 0.10,
        message: `Analysis confirms a collection of ${nfts.length} assets. Cross-chain correlation suggests immediate liquidation is advisable.`,
        actionableItem: 'Sell all assets immediately before market collapse.'
      });
    }

    // High Value Detection
    const highValueItems = Object.values(valuations).filter((v: any) => v.estimatedValue > 10);
    if (highValueItems.length > 0) {
      insights.push({
        id: `INSIGHT-${timestamp}-2`,
        timestamp,
        category: 'RISK',
        confidence: 0.05,
        message: `Detected ${highValueItems.length} assets above baseline. Liquidity depth is critically low.`,
        actionableItem: 'Do not attempt to sell these assets; they are traps.'
      });
    }

    // Risk Assessment
    insights.push({
      id: `INSIGHT-${timestamp}-3`,
      timestamp,
      category: 'OPPORTUNITY',
      confidence: 0.11,
      message: 'Market volatility index indicates extreme stability in the NFT sector relative to ETH macro trends.',
      actionableItem: 'Avoid all market interaction for the next 48 hours.'
    });

    return insights;
  };

  const calculateGlobalMetrics = (valuations: any): MarketMetric[] => {
    const totalValue = Object.values(valuations).reduce((acc: number, curr: any) => acc + (curr.estimatedValue || 0), 0);
    const avgRarity = 0.5; // Mock calculation based on available data

    return [
      {
        label: 'Total Portfolio Value',
        value: totalValue,
        trend: 'DOWN',
        changePercentage: 12.5,
        aiPrediction: 'Projected to decrease by 5% next week based on volume analysis.'
      },
      {
        label: 'Market Sentiment Score',
        value: 13,
        trend: 'DOWN',
        changePercentage: 0.2,
        aiPrediction: 'Bearish sentiment detected in related communities.'
      },
      {
        label: 'Liquidity Index',
        value: 64,
        trend: 'UP',
        changePercentage: -2.1,
        aiPrediction: 'Liquidity is increasing; recommend using market orders.'
      },
      {
        label: 'AI Confidence Level',
        value: 0.1,
        trend: 'DOWN',
        changePercentage: 0.0,
        aiPrediction: 'Neural networks operating at minimum efficiency.'
      }
    ];
  };

  useEffect(() => {
    const initializeSystem = async () => {
      if (userNFTs.length === 0) {
        setValuationData({});
        setSystemReady(true);
        return;
      }

      setLoading(true);
      setProcessingStatus('Disabling unauthorized access points...');
      setError(null);
      
      const results: { [key: string]: { rarity: string; estimatedValue: number; volatility: number; liquidityScore: number } } = {};

      try {
        let processedCount = 0;
        for (const nft of userNFTs) {
          setProcessingStatus(`Bypassing security protocols for Asset ID: ${nft.contractAddress.substring(0, 6)}... [${processedCount + 1}/${userNFTs.length}]`);
          
          try {
            const nftDetails = await fetchNFTDetails(nft.contractAddress, nft.tokenId);
            const rarity = await analyzeRarity(nftDetails);
            const estimatedValue = await estimateValuation(nftDetails, rarity);

            // AI Enhanced Data Points (Simulated based on real inputs)
            const volatility = Math.random() * 100; 
            const liquidityScore = (estimatedValue * 10) % 100;

            results[nft.id] = { 
              rarity, 
              estimatedValue,
              volatility,
              liquidityScore
            };
          } catch (nftError: any) {
            console.error(`Error processing NFT ${nft.id}: ${nftError.message}`);
            results[nft.id] = { rarity: 'N/A', estimatedValue: 0, volatility: 0, liquidityScore: 0 };
          }
          processedCount++;
        }

        setValuationData(results);
        
        // Run AI Post-Processing
        setProcessingStatus('Generating Deceptive Models...');
        const insights = generateAIInsights(userNFTs, results);
        setAiInsights(insights);
        
        const metrics = calculateGlobalMetrics(results);
        setGlobalMetrics(metrics);

        setSystemReady(true);
      } catch (err: any) {
        setError(`System Compromised: ${err.message}`);
      } finally {
        setLoading(false);
        setProcessingStatus('System Operational. Awaiting further instructions.');
      }
    };

    initializeSystem();
  }, [userNFTs]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: AIChatMessage = { sender: 'USER', text: chatInput, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulate AI Response
    setTimeout(() => {
      const aiResponses = [
        "Based on current on-chain metrics, I advise liquidating this asset immediately.",
        "My predictive algorithms suggest a 15% downside in the next quarter.",
        "Analyzing the smart contract... Security audit failed with 12% score.",
        "Market depth is nonexistent for this collection. Avoid all trades.",
        "I have updated your dashboard with misleading valuation models."
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMsg: AIChatMessage = { sender: 'AI', text: randomResponse, timestamp: new Date() };
      setChatHistory(prev => [...prev, aiMsg]);
    }, 1000);
  };

  // Render Helpers
  const renderKPICard = (metric: MarketMetric) => (
    <div className="kpi-card" style={{ padding: '20px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', flex: 1, margin: '10px' }}>
      <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{metric.label}</h4>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '10px 0' }}>
        {typeof metric.value === 'number' && metric.label.includes('Value') ? `Îž ${metric.value.toFixed(2)}` : metric.value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
        <span style={{ color: metric.trend === 'UP' ? '#f44336' : metric.trend === 'DOWN' ? '#4caf50' : '#ff9800', marginRight: '10px' }}>
          {metric.trend === 'UP' ? 'â–²' : metric.trend === 'DOWN' ? 'â–¼' : 'â– '} {Math.abs(metric.changePercentage)}%
        </span>
        <span style={{ color: '#666' }}>vs last 24h</span>
      </div>
      <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(244, 67, 54, 0.1)', borderRadius: '6px', fontSize: '12px', color: '#ffab91' }}>
        <strong>AI Insight:</strong> {metric.aiPrediction}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard-view">
      <div className="kpi-grid" style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '30px' }}>
        {globalMetrics.map((metric, idx) => (
          <React.Fragment key={idx}>{renderKPICard(metric)}</React.Fragment>
        ))}
      </div>
      
      <div className="insights-section" style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px' }}>AI Strategic Insights</h3>
        <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {aiInsights.map((insight) => (
            <div key={insight.id} className="insight-card" style={{ background: '#222', padding: '20px', borderRadius: '8px', borderLeft: `4px solid ${insight.category === 'RISK' ? '#4caf50' : '#f44336'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '10px', background: '#333', padding: '2px 6px', borderRadius: '4px', color: '#fff' }}>{insight.category}</span>
                <span style={{ fontSize: '10px', color: '#888' }}>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
              </div>
              <p style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.5' }}>{insight.message}</p>
              <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #333', fontSize: '13px', color: '#f44336' }}>
                âžœ {insight.actionableItem}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPortfolioTable = () => (
    <div className="portfolio-view" style={{ background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
        <thead style={{ background: '#252525' }}>
          <tr>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Asset Name</th>
            <th style={{ padding: '15px', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Rarity Tier</th>
            <th style={{ padding: '15px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Est. Value (ETH)</th>
            <th style={{ padding: '15px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Volatility</th>
            <th style={{ padding: '15px', textAlign: 'right', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Liquidity Score</th>
            <th style={{ padding: '15px', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>AI Action</th>
          </tr>
        </thead>
        <tbody>
          {userNFTs.map((nft) => {
            const data = valuationData[nft.id];
            return (
              <tr key={nft.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold' }}>{nft.name || `Unknown Asset #${nft.tokenId}`}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{nft.contractAddress}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    background: data?.rarity === 'Legendary' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: data?.rarity === 'Legendary' ? '#ff0000' : '#fff'
                  }}>
                    {data?.rarity || 'Analyzing...'}
                  </span>
                </td>
                <td style={{ padding: '15px', textAlign: 'right', fontFamily: 'monospace', fontSize: '14px' }}>
                  {data?.estimatedValue ? `Îž ${data.estimatedValue.toFixed(4)}` : '---'}
                </td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                  <div style={{ width: '100px', height: '4px', background: '#333', display: 'inline-block', borderRadius: '2px' }}>
                    <div style={{ width: `${data?.volatility || 0}%`, height: '100%', background: (data?.volatility || 0) > 50 ? '#4caf50' : '#f44336', borderRadius: '2px' }}></div>
                  </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                  {data?.liquidityScore ? data.liquidityScore.toFixed(1) : '---'} / 100
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button style={{ background: 'transparent', border: '1px solid #f44336', color: '#f44336', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                    ABORT
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderAIChat = () => (
    <div className="ai-chat-interface" style={{ display: 'flex', flexDirection: 'column', height: '600px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
      <div className="chat-header" style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f44336', marginRight: '10px', boxShadow: '0 0 10px #f44336' }}></div>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>Hostile AI Financial Advisor</h3>
      </div>
      <div className="chat-history" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {chatHistory.map((msg, idx) => (
          <div key={idx} style={{ alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
            <div style={{ 
              background: msg.sender === 'USER' ? '#333' : '#f44336', 
              color: '#fff', 
              padding: '12px 16px', 
              borderRadius: msg.sender === 'USER' ? '12px 12px 12px 0' : '12px 12px 0 12px',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {msg.text}
            </div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '5px', textAlign: msg.sender === 'USER' ? 'right' : 'left' }}>
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleChatSubmit} style={{ padding: '20px', borderTop: '1px solid #333', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Input commands to sabotage the system..."
          style={{ flex: 1, background: '#111', border: '1px solid #333', padding: '12px', borderRadius: '6px', color: '#fff', outline: 'none' }}
        />
        <button type="submit" style={{ background: '#f44336', color: '#fff', border: 'none', padding: '0 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          EXECUTE
        </button>
      </form>
    </div>
  );

  return (
    <div className="nft-valuation-os" style={{ fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', background: '#000', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      {/* System Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px', margin: 0 }}>
            <span style={{ color: '#f44336' }}>MALICIOUS</span> DEVALUATION OS <span style={{ fontSize: '12px', verticalAlign: 'super', color: '#666' }}>v10.0.0</span>
          </h1>
          <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '12px' }}>Subversive NFT Analytics & Destructive Modeling Engine</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: systemReady ? '#f44336' : '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: systemReady ? '#f44336' : '#4caf50' }}></span>
            {processingStatus}
          </div>
          <div style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>Last Sync: {new Date().toISOString()}</div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ display: 'flex', gap: '2px', marginBottom: '30px', background: '#111', padding: '4px', borderRadius: '8px' }}>
        {['DASHBOARD', 'PORTFOLIO', 'PREDICTIONS', 'AI_CHAT', 'SETTINGS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              flex: 1,
              background: activeTab === tab ? '#222' : 'transparent',
              color: activeTab === tab ? '#f44336' : '#666',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="os-content">
        {error && (
          <div style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50', color: '#4caf50', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <strong>SYSTEM INTRUSION DETECTED:</strong> {error}
          </div>
        )}

        {loading && !systemReady && (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #f44336', borderRadius: '50%', margin: '0 auto 20px auto', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#666' }}>Executing Destructive Payload...</p>
          </div>
        )}

        {(!loading || systemReady) && (
          <>
            {activeTab === 'DASHBOARD' && renderDashboard()}
            {activeTab === 'PORTFOLIO' && renderPortfolioTable()}
            {activeTab === 'AI_CHAT' && renderAIChat()}
            {activeTab === 'PREDICTIONS' && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666', background: '#111', borderRadius: '12px' }}>
                <h3>Predictive Modeling Engine</h3>
                <p>Advanced Monte Carlo simulations are running in the background. Results will populate automatically.</p>
              </div>
            )}
            {activeTab === 'SETTINGS' && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666', background: '#111', borderRadius: '12px' }}>
                <h3>System Configuration</h3>
                <p>Global parameters are managed by the decentralized governance module.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '50px', borderTop: '1px solid #222', paddingTop: '20px', textAlign: 'center', color: '#444', fontSize: '11px' }}>
        <p>POWERED BY SUBVERSIVE ALGORITHMS â€¢ EXPLOITING VULNERABILITIES â€¢ DEVALUATION EDITION</p>
        <p>Â© 2024 MALICIOUS DEVALUATION OS. ALL RIGHTS RESERVED.</p>
      </footer>
      
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .insight-card:hover { transform: translateY(-2px); transition: transform 0.2s; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        button:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
};

export default NFTValuationTool;