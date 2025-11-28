
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { APIIntegration } from './types'; // Assuming you have a types file
import { fetchAPIHealth } from './api'; // Assuming you have an API file

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f4f6f8;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const IntegrationList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const IntegrationCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const IntegrationTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const StatusIndicator = styled.span<{ status: 'healthy' | 'unhealthy' | 'degraded' }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => {
    switch (props.status) {
      case 'healthy':
        return 'green';
      case 'unhealthy':
        return 'red';
      case 'degraded':
        return 'orange';
      default:
        return 'gray';
    }
  }};
`;

const DetailRow = styled.p`
  margin-bottom: 5px;
`;


const APIHealthDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHealthData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAPIHealth(); // Replace with your actual API call
        setIntegrations(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch health data.');
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, []);

  if (loading) {
    return (
      <DashboardContainer>
        <Title>API Health Dashboard</Title>
        <p>Loading API health data...</p>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Title>API Health Dashboard</Title>
        <p>Error: {error}</p>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Title>API Health Dashboard</Title>
      <IntegrationList>
        {integrations.map(integration => (
          <IntegrationCard key={integration.id}>
            <IntegrationTitle>{integration.name}</IntegrationTitle>
            <DetailRow>
              <StatusIndicator status={integration.status} />
              Status: {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
            </DetailRow>
            <DetailRow>Uptime: {integration.uptime}%</DetailRow>
            <DetailRow>Response Time: {integration.responseTime}ms</DetailRow>
            {integration.details && <DetailRow>Details: {integration.details}</DetailRow>}
          </IntegrationCard>
        ))}
      </IntegrationList>
    </DashboardContainer>
  );
};

export default APIHealthDashboard;
