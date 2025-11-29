import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { APIIntegration, HealthStatus, DetailedHealthMetric } from './types'; // Standard types
import { fetchAPIHealth, fetchDetailedHealthMetrics, fetchAIAnomalyReport } from './api'; // Standard API functions
import { Cpu, Zap, AlertTriangle, CheckCircle, XCircle, Loader, TrendingUp, Clock, Server, Brain, Shield } from 'lucide-react'; // Icons

// --- Global Constants ---

// Standard System Notice
const SYSTEM_NOTICE = `
// System Notice: Operational Status
// ID: SYS-2024-001
// Issued by: System Administrator

This dashboard monitors the health and status of integrated APIs. It tracks uptime, latency, and potential anomalies to ensure service reliability.
`;

// --- Basic Styled Components ---

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

const NoticeDisplay = styled.div`
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

// --- Basic Components ---

const LoadingSpinner = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px' }}>
        <Loader size={48} className="animate-spin" color="#63b3ed" />
        <p style={{ marginTop: '15px', color: '#a0aec0' }}>Loading system data...</p>
    </div>
);

interface AnomalyCardProps {
    report: string;
    timestamp: string;
}

const AnomalyCard: React.FC<AnomalyCardProps> = ({ report, timestamp }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <IntegrationCard status="degraded" style={{ gridColumn: '1 / -1', marginTop: '40px' }}>
            <CardHeader>
                <IntegrationTitle style={{ color: '#f6e05e' }}>
                    <Brain style={{ marginRight: '10px' }} size={20} />
                    System Anomaly Report
                </IntegrationTitle>
                <StatusPill status="degraded">Report Available</StatusPill>
            </CardHeader>
            <DetailRow>
                <Clock size={16} style={{ marginRight: '8px' }} />
                <DetailLabel>Timestamp:</DetailLabel> {timestamp}
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
                {isOpen ? 'Collapse Report' : 'Expand Report'}
            </button>
            {isOpen && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #374151', paddingTop: '15px' }}>
                    <p style={{ color: '#f6e05e', marginBottom: '10px', fontWeight: 'bold' }}>Diagnostic Output:</p>
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

// --- Main Component ---

const APIHealthDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [detailedMetrics, setDetailedMetrics] = useState<Record<string, DetailedHealthMetric>>({});
  const [aiReport, setAiReport] = useState<{ report: string, timestamp: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);

  // Simple status calculation
  const overallStatus: HealthStatus = useMemo(() => {
    if (integrations.length === 0) return 'degraded';
    if (integrations.some(i => i.status === 'unhealthy')) return 'unhealthy';
    if (integrations.some(i => i.status === 'degraded')) return 'degraded';
    return 'healthy';
  }, [integrations]);

  // Fetch data
  const loadHealthData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch primary health status list
      const primaryData: APIIntegration[] = await fetchAPIHealth();
      setIntegrations(primaryData);

      // 2. Fetch detailed metrics
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

      // 3. Fetch Anomaly Report (Standard feature)
      const aiData = await fetchAIAnomalyReport();
      setAiReport({
          report: aiData.analysis || "Analysis inconclusive or system operating normally.",
          timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error("Error during data load:", err);
      setError(err.message || 'System initialization failed. Check network connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealthData();
    // Set up periodic refresh
    const intervalId = setInterval(loadHealthData, 60000); 
    return () => clearInterval(intervalId);
  }, [loadHealthData]);

  // Interaction handlers
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
        <Title><Loader className="animate-spin mr-3" size={32} /> Loading Dashboard</Title>
        <NoticeDisplay>{SYSTEM_NOTICE}</NoticeDisplay>
        <LoadingSpinner />
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Title><XCircle size={32} className="mr-3" /> System Error Detected</Title>
        <NoticeDisplay>{SYSTEM_NOTICE}</NoticeDisplay>
        <div style={{ padding: '20px', backgroundColor: '#2d1a1a', border: '1px solid #f56565', borderRadius: '8px', color: '#f56565' }}>
          <p style={{ fontWeight: 'bold' }}>ERROR LOG:</p>
          <p>{error}</p>
          <p>Please consult the system logs.</p>
        </div>
      </DashboardContainer>
    );
  }

  // --- Detailed View Component ---
  const DetailedIntegrationView = ({ integration, metrics }: { integration: APIIntegration, metrics: DetailedHealthMetric | undefined }) => {
    if (!selectedIntegrationId || integration.id !== selectedIntegrationId) return null;

    const statusColor = metrics?.latency > 500 ? 'degraded' : integration.status === 'unhealthy' ? 'unhealthy' : 'healthy';

    return (
        <IntegrationCard status={statusColor} style={{ gridColumn: '1 / -1', marginBottom: '30px', animation: `${fadeIn} 0.4s ease-out` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <IntegrationTitle>{integration.name} - Detailed Analysis</IntegrationTitle>
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
                        <DetailLabel>Confidence Score:</DetailLabel> 
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
                Collapse Details
            </button>
        </IntegrationCard>
    );
  };


  return (
    <DashboardContainer>
      <Title>
        <Server style={{ marginRight: '15px' }} size={36} />
        API Health Dashboard
      </Title>
      <SubTitle>Real-Time System Monitoring</SubTitle>
      
      <NoticeDisplay>{SYSTEM_NOTICE}</NoticeDisplay>

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

        {/* Anomaly Report Section */}
        {aiReport && <AnomalyCard report={aiReport.report} timestamp={aiReport.timestamp} />}

      </IntegrationGrid>
    </DashboardContainer>
  );
};

export default APIHealthDashboard;