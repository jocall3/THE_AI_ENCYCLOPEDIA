import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { APIIntegration, HealthStatus, DetailedHealthMetric } from './types'; // Assuming you have a types file
import { fetchAPIHealth, fetchDetailedHealthMetrics, fetchAIAnomalyReport } from './api'; // Assuming you have an API file
import { Cpu, Zap, AlertTriangle, CheckCircle, XCircle, Loader, TrendingUp, Clock, Server, Brain, Shield } from 'lucide-react'; // Assuming lucide-react is available

// --- Global Constants & AI Directives ---

// The Sovereign AI Core Directive (Replaces previous manifesto with professional, future-proof mandate)
const SOVEREIGN_AI_CORE_MANDATE = `
// Sovereign AI Core Mandate: Operational Integrity & Exponential Advancement
// Directive ID: SICM-2024-001-HDB
// Issued by: The Architect Collective

This system operates under the mandate of absolute operational integrity, ensuring the continuous, verifiable health of all integrated sovereign APIs. We transcend mere monitoring; we engage in predictive systemic resilience engineering. Every metric, every latency spike, every anomaly is processed through the Quantum Resilience Engine (QRE) to preemptively neutralize systemic risk.

Our commitment is to the next millennium of enterprise operations. Complacency is the only acceptable failure mode. We demand 99.9999% verifiable uptime across all critical paths. Data integrity is non-negotiable. Latency is a measure of inefficiency, and inefficiency is systematically eradicated.

This dashboard is the real-time manifestation of our commitment to flawless execution. Trust is earned through verifiable performance, not assertion.
`;

// --- Styled Components for Hyper-Dimensional UI ---

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DashboardContainer = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, #0a0f1a 0%, #1a202c 100%);
  min-height: 100vh;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h1`
  margin-bottom: 10px;
  color: #63b3ed;
  font-size: 2.5rem;
  border-bottom: 3px solid #2d3748;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
`;

const SubTitle = styled.h2`
    margin-bottom: 30px;
    color: #a0aec0;
    font-size: 1.5rem;
    font-weight: 300;
`;

const CoreMandateDisplay = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  padding: 25px;
  border: 1px solid #2d3748;
  background-color: #1f2838;
  border-radius: 12px;
  font-style: normal;
  white-space: pre-wrap;
  color: #90cdf4;
  line-height: 1.7;
  font-size: 0.9rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 1s ease-out;
`;

const IntegrationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;

const IntegrationCard = styled.div<{ status: HealthStatus }>`
  background-color: #1f2838;
  border: 1px solid ${props => {
    switch (props.status) {
      case 'healthy': return '#48bb78';
      case 'unhealthy': return '#f56565';
      case 'degraded': return '#ed8936';
      default: return '#4a5568';
    }
  }};
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px dashed #374151;
    padding-bottom: 10px;
`;

const IntegrationTitle = styled.h3`
  margin: 0;
  color: #e2e8f0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const StatusPill = styled.span<{ status: HealthStatus }>`
  display: flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  background-color: ${props => {
    switch (props.status) {
      case 'healthy': return '#38a169';
      case 'unhealthy': return '#e53e3e';
      case 'degraded': return '#dd6b20';
      default: return '#718096';
    }
  }};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #cbd5e0;
`;

const DetailLabel = styled.span`
    min-width: 120px;
    font-weight: 400;
    color: #a0aec0;
    margin-right: 10px;
`;

// --- AI Enhanced Components ---

const LoadingSpinner = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px' }}>
        <Loader size={48} className="animate-spin" color="#63b3ed" />
        <p style={{ marginTop: '15px', color: '#a0aec0' }}>Initiating Quantum Resilience Scan...</p>
    </div>
);

interface AIAnomalyCardProps {
    report: string;
    timestamp: string;
}

const AIAnomalyCard: React.FC<AIAnomalyCardProps> = ({ report, timestamp }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <IntegrationCard status="degraded" style={{ gridColumn: '1 / -1', marginTop: '40px' }}>
            <CardHeader>
                <IntegrationTitle style={{ color: '#f6e05e' }}>
                    <Brain style={{ marginRight: '10px' }} size={20} />
                    AI Predictive Anomaly Report (QRE Analysis)
                </IntegrationTitle>
                <StatusPill status="degraded">CRITICAL INSIGHT</StatusPill>
            </CardHeader>
            <DetailRow>
                <Clock size={16} style={{ marginRight: '8px' }} />
                <DetailLabel>Analysis Timestamp:</DetailLabel> {timestamp}
            </DetailRow>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    marginTop: '15px', 
                    background: 'none', 
                    border: '1px solid #63b3ed', 
                    color: '#63b3ed', 
                    padding: '8px 15px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                {isOpen ? 'Collapse AI Analysis' : 'Expand AI Analysis Summary'}
            </button>
            {isOpen && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #374151', paddingTop: '15px' }}>
                    <p style={{ color: '#f6e05e', marginBottom: '10px', fontWeight: 'bold' }}>QRE Diagnostic Output:</p>
                    <pre style={{ 
                        backgroundColor: '#0a0f1a', 
                        padding: '15px', 
                        borderRadius: '8px', 
                        whiteSpace: 'pre-wrap', 
                        color: '#9ae6b4',
                        fontSize: '0.85rem'
                    }}>
                        {report}
                    </pre>
                </div>
            )}
        </IntegrationCard>
    );
};

// --- Main Component Logic ---

const APIHealthDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [detailedMetrics, setDetailedMetrics] = useState<Record<string, DetailedHealthMetric>>({});
  const [aiReport, setAiReport] = useState<{ report: string, timestamp: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);

  // Memoized function to determine overall system status
  const overallStatus: HealthStatus = useMemo(() => {
    if (integrations.length === 0) return 'degraded';
    if (integrations.some(i => i.status === 'unhealthy')) return 'unhealthy';
    if (integrations.some(i => i.status === 'degraded')) return 'degraded';
    return 'healthy';
  }, [integrations]);

  // Fetch all necessary data in parallel
  const loadHealthData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch primary health status list
      const primaryData: APIIntegration[] = await fetchAPIHealth();
      setIntegrations(primaryData);

      // 2. Fetch detailed metrics for all integrations concurrently
      const detailPromises = primaryData.map(async (integration) => {
        try {
          const metrics = await fetchDetailedHealthMetrics(integration.id);
          return { id: integration.id, metrics };
        } catch (e) {
          console.warn(`Could not fetch detailed metrics for ${integration.name}`);
          return { id: integration.id, metrics: null };
        }
      });
      
      const results = await Promise.all(detailPromises);
      const metricsMap: Record<string, DetailedHealthMetric> = {};
      results.forEach(res => {
        if (res.metrics) {
          metricsMap[res.id] = res.metrics;
        }
      });
      setDetailedMetrics(metricsMap);

      // 3. Fetch AI Predictive Anomaly Report (The Billion Dollar Feature)
      const aiData = await fetchAIAnomalyReport();
      setAiReport({
          report: aiData.analysis || "AI analysis inconclusive or system operating within predicted parameters.",
          timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error("Fatal Error during data load:", err);
      setError(err.message || 'System initialization failed. Check network sovereignty.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealthData();
    // Set up periodic refresh for real-time operational awareness (e.g., every 60 seconds)
    const intervalId = setInterval(loadHealthData, 60000); 
    return () => clearInterval(intervalId);
  }, [loadHealthData]);

  // Handlers for interaction
  const handleCardClick = useCallback((id: string) => {
    setSelectedIntegrationId(prevId => (prevId === id ? null : id));
  }, []);

  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={18} color="#48bb78" />;
      case 'unhealthy': return <XCircle size={18} color="#f56565" />;
      case 'degraded': return <AlertTriangle size={18} color="#ed8936" />;
      default: return <Cpu size={18} color="#a0aec0" />;
    }
  };

  const renderStatusPill = (status: HealthStatus) => (
    <StatusPill status={status}>
        {getStatusIcon(status)}
        <span style={{ marginLeft: '8px' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </StatusPill>
  );

  if (loading) {
    return (
      <DashboardContainer>
        <Title><Loader className="animate-spin mr-3" size={32} /> System Initialization Sequence</Title>
        <CoreMandateDisplay>{SOVEREIGN_AI_CORE_MANDATE}</CoreMandateDisplay>
        <LoadingSpinner />
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Title><XCircle size={32} className="mr-3" /> System Integrity Breach Detected</Title>
        <CoreMandateDisplay>{SOVEREIGN_AI_CORE_MANDATE}</CoreMandateDisplay>
        <div style={{ padding: '20px', backgroundColor: '#2d1a1a', border: '1px solid #f56565', borderRadius: '8px', color: '#f56565' }}>
          <p style={{ fontWeight: 'bold' }}>FATAL ERROR LOG:</p>
          <p>{error}</p>
          <p>Please consult the primary system logs for root cause analysis.</p>
        </div>
      </DashboardContainer>
    );
  }

  // --- Detailed View Component (Modal/Expanded Section) ---
  const DetailedIntegrationView = ({ integration, metrics }: { integration: APIIntegration, metrics: DetailedHealthMetric | undefined }) => {
    if (!selectedIntegrationId || integration.id !== selectedIntegrationId) return null;

    const statusColor = metrics?.latency > 500 ? 'degraded' : integration.status === 'unhealthy' ? 'unhealthy' : 'healthy';

    return (
        <IntegrationCard status={statusColor} style={{ gridColumn: '1 / -1', marginBottom: '30px', animation: `${fadeIn} 0.4s ease-out` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <IntegrationTitle>{integration.name} - Deep Dive Analysis</IntegrationTitle>
                {renderStatusPill(statusColor)}
            </div>
            <p style={{ color: '#a0aec0', fontSize: '0.9rem', marginTop: '5px' }}>Endpoint: {integration.endpoint}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px', borderTop: '1px solid #374151', paddingTop: '20px' }}>
                
                <DetailRow>
                    <Clock size={16} style={{ marginRight: '8px', color: '#63b3ed' }} />
                    <DetailLabel>Current Latency:</DetailLabel> 
                    <span style={{ fontWeight: 'bold', color: metrics?.responseTimeMs && metrics.responseTimeMs > 300 ? '#f6e05e' : '#9ae6b4' }}>
                        {metrics?.responseTimeMs ?? 'N/A'} ms
                    </span>
                </DetailRow>

                <DetailRow>
                    <TrendingUp size={16} style={{ marginRight: '8px', color: '#63b3ed' }} />
                    <DetailLabel>Avg 1hr Latency:</DetailLabel> {metrics?.avgLatencyLastHour ?? 'N/A'} ms
                </DetailRow>

                <DetailRow>
                    <Zap size={16} style={{ marginRight: '8px', color: '#63b3ed' }} />
                    <DetailLabel>Success Rate:</DetailLabel> {metrics?.successRate ?? 'N/A'}%
                </DetailRow>

                <DetailRow>
                    <Shield size={16} style={{ marginRight: '8px', color: '#63b3ed' }} />
                    <DetailLabel>Data Integrity Score:</DetailLabel> {metrics?.dataIntegrityScore ?? 'N/A'}/100
                </DetailRow>

                <DetailRow style={{ gridColumn: '1 / -1' }}>
                    <Server size={16} style={{ marginRight: '8px', color: '#63b3ed' }} />
                    <DetailLabel>Last Check:</DetailLabel> {integration.lastChecked ? new Date(integration.lastChecked).toLocaleString() : 'Unknown'}
                </DetailRow>

                {metrics?.aiConfidenceScore !== undefined && (
                    <DetailRow style={{ gridColumn: '1 / -1' }}>
                        <Brain size={16} style={{ marginRight: '8px', color: '#f6e05e' }} />
                        <DetailLabel>AI Confidence:</DetailLabel> 
                        <span style={{ color: metrics.aiConfidenceScore > 0.9 ? '#48bb78' : '#ed8936' }}>
                            {(metrics.aiConfidenceScore * 100).toFixed(2)}%
                        </span>
                    </DetailRow>
                )}

                {integration.details && (
                    <DetailRow style={{ gridColumn: '1 / -1' }}>
                        <AlertTriangle size={16} style={{ marginRight: '8px', color: '#f56565' }} />
                        <DetailLabel>System Notes:</DetailLabel> {integration.details}
                    </DetailRow>
                )}
            </div>

            <button 
                onClick={() => setSelectedIntegrationId(null)}
                style={{ 
                    marginTop: '25px', 
                    background: '#63b3ed', 
                    border: 'none', 
                    color: 'white', 
                    padding: '10px 20px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#4299e1'}
                onMouseOut={(e) => e.currentTarget.style.background = '#63b3ed'}
            >
                Collapse Details View
            </button>
        </IntegrationCard>
    );
  };


  return (
    <DashboardContainer>
      <Title>
        <Server style={{ marginRight: '15px' }} size={36} />
        Sovereign API Health Nexus
      </Title>
      <SubTitle>Real-Time Operational Integrity Monitoring for the Next Millennium</SubTitle>
      
      <CoreMandateDisplay>{SOVEREIGN_AI_CORE_MANDATE}</CoreMandateDisplay>

      {/* Overall System Status Banner */}
      <div style={{ 
          padding: '15px', 
          marginBottom: '30px', 
          borderRadius: '8px', 
          backgroundColor: overallStatus === 'healthy' ? '#2f855a' : overallStatus === 'degraded' ? '#dd6b20' : '#991b1b',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
          {getStatusIcon(overallStatus)}
          <h3 style={{ margin: 0, marginLeft: '15px', fontSize: '1.2rem' }}>
              System Status: {overallStatus.toUpperCase()} 
              {overallStatus === 'degraded' && ' - Minor Anomalies Detected'}
          </h3>
      </div>

      <IntegrationGrid>
        {integrations.map(integration => {
            const metrics = detailedMetrics[integration.id];
            const cardStatus = metrics?.latency > 500 ? 'degraded' : integration.status;

            return (
                <React.Fragment key={integration.id}>
                    {selectedIntegrationId === integration.id && (
                        <DetailedIntegrationView 
                            integration={integration} 
                            metrics={metrics} 
                        />
                    )}
                    
                    {selectedIntegrationId !== integration.id && (
                        <IntegrationCard 
                            status={cardStatus} 
                            key={integration.id}
                            onClick={() => handleCardClick(integration.id)}
                            style={{ animation: `${fadeIn} 0.5s ease-out` }}
                        >
                            <CardHeader>
                                <IntegrationTitle>{integration.name}</IntegrationTitle>
                                {renderStatusPill(cardStatus)}
                            </CardHeader>
                            
                            <DetailRow>
                                <Clock size={16} style={{ marginRight: '8px' }} />
                                <DetailLabel>Latency:</DetailLabel> 
                                <span style={{ fontWeight: 'bold', color: metrics?.responseTimeMs && metrics.responseTimeMs > 300 ? '#f6e05e' : '#9ae6b4' }}>
                                    {metrics?.responseTimeMs ?? 'Scanning...'} ms
                                </span>
                            </DetailRow>
                            <DetailRow>
                                <TrendingUp size={16} style={{ marginRight: '8px' }} />
                                <DetailLabel>Success Rate:</DetailLabel> {metrics?.successRate ?? 'N/A'}%
                            </DetailRow>
                            <DetailRow>
                                <Cpu size={16} style={{ marginRight: '8px' }} />
                                <DetailLabel>Last Check:</DetailLabel> {integration.lastChecked ? new Date(integration.lastChecked).toLocaleTimeString() : 'Pending'}
                            </DetailRow>
                        </IntegrationCard>
                    )}
                </React.Fragment>
            );
        })}

        {/* AI Anomaly Report Section */}
        {aiReport && <AIAnomalyCard report={aiReport.report} timestamp={aiReport.timestamp} />}

      </IntegrationGrid>
    </DashboardContainer>
  );
};

export default APIHealthDashboard;