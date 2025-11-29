import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Metric, Text, Title, AreaChart, BarChart, Subtitle, Flex, CategoryBar } from '@tremor/react';

// Placeholder for authentication context or hook
const useAuth = () => {
  return { isAuthenticated: true, token: 'fake-token' };
};

const CustomerSupportView: React.FC = () => {
  const { isAuthenticated, token } = useAuth();
  const [ticketVolume, setTicketVolume] = useState<Array<{ date: string; tickets: number }>>([]);
  const [resolutionTime, setResolutionTime] = useState<Array<{ date: string; time: number }>>([]);
  const [satisfactionScores, setSatisfactionScores] = useState<Array<{ date: string; score: number }>>([]);
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock API endpoints - replace with actual API calls
  const ZENDESK_API_URL = '/api/zendesk'; // Example endpoint
  const INTERCOM_API_URL = '/api/intercom'; // Example endpoint

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError('Authentication required.');
        return;
      }

      setLoading(true);
      try {
        // Fetch data from Zendesk
        const zendeskResponse = await axios.get(ZENDESK_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTicketVolume(zendeskResponse.data.ticketVolume || []);
        setResolutionTime(zendeskResponse.data.resolutionTime || []);
        setSatisfactionScores(zendeskResponse.data.satisfactionScores || []);

        // Fetch data from Intercom
        const intercomResponse = await axios.get(INTERCOM_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentConversations(intercomResponse.data.recentConversations || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching customer support data:', err);
        setError('Failed to load customer support data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  if (loading) {
    return <div className="p-4">Loading customer support data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <Title className="text-3xl font-bold mb-6 text-gray-800">Customer Support Dashboard</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <Flex justifyContent="between" alignItems="start">
            <div>
              <Text>Total Tickets</Text>
              <Metric>{ticketVolume.reduce((sum, item) => sum + item.tickets, 0)}</Metric>
            </div>
          </Flex>
          <AreaChart
            className="mt-4 h-28"
            data={ticketVolume}
            index="date"
            valueFormatter={(number: number) => `${Intl.NumberFormat('us').format(number).toString()}`}
            categories={['tickets']}
            colors={['blue']}
            showXAxis={false}
            showYAxis={false}
          />
        </Card>

        <Card>
          <Flex justifyContent="between" alignItems="start">
            <div>
              <Text>Avg. Resolution Time (hours)</Text>
              <Metric>{(resolutionTime.reduce((sum, item) => sum + item.time, 0) / resolutionTime.length).toFixed(2) || 'N/A'}</Metric>
            </div>
          </Flex>
          <AreaChart
            className="mt-4 h-28"
            data={resolutionTime}
            index="date"
            valueFormatter={(number: number) => `${number.toFixed(2)}h`}
            categories={['time']}
            colors={['emerald']}
            showXAxis={false}
            showYAxis={false}
          />
        </Card>

        <Card>
          <Flex justifyContent="between" alignItems="start">
            <div>
              <Text>Avg. CSAT Score</Text>
              <Metric>{(satisfactionScores.reduce((sum, item) => sum + item.score, 0) / satisfactionScores.length).toFixed(1) || 'N/A'}</Metric>
            </div>
          </Flex>
          <CategoryBar
            className="mt-4"
            values={[satisfactionScores.reduce((sum, item) => sum + item.score, 0) / satisfactionScores.length]}
            maxValue={5}
            colors={['red', 'amber', 'green']}
            markerValue={3}
            showLabels={true}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Title>Ticket Volume Over Time</Title>
          <AreaChart
            className="mt-4"
            data={ticketVolume}
            index="date"
            valueFormatter={(number: number) => `${Intl.NumberFormat('us').format(number).toString()}`}
            categories={['tickets']}
            colors={['blue']}
            yAxisWidth={60}
          />
        </Card>

        <Card>
          <Title>Resolution Time Over Time</Title>
          <AreaChart
            className="mt-4"
            data={resolutionTime}
            index="date"
            valueFormatter={(number: number) => `${number.toFixed(2)}h`}
            categories={['time']}
            colors={['emerald']}
            yAxisWidth={60}
          />
        </Card>
      </div>

      <Card className="mt-6">
        <Title>Recent Conversations (Intercom)</Title>
        <Subtitle>Displaying the latest customer interactions.</Subtitle>
        <div className="mt-4 space-y-4">
          {recentConversations.length > 0 ? (
            recentConversations.map((conv, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <Flex justifyContent="between" alignItems="center">
                  <Text className="font-medium text-gray-700">{conv.subject || `Conversation with ${conv.user.name}`}</Text>
                  <Text className="text-sm text-gray-500">{new Date(conv.createdAt * 1000).toLocaleString()}</Text>
                </Flex>
                <Text className="mt-1 text-gray-600">{conv.snippet || 'No snippet available.'}</Text>
                <Flex justifyContent="start" alignItems="center" className="mt-2 space-x-2">
                  <Text className="text-xs font-semibold uppercase text-gray-500">Status:</Text>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    conv.status === 'open' ? 'bg-green-100 text-green-800' :
                    conv.status === 'closed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {conv.status}
                  </span>
                </Flex>
              </div>
            ))
          ) : (
            <Text>No recent conversations found.</Text>
          )}
        </div>
      </Card>
    </main>
  );
};

export default CustomerSupportView;