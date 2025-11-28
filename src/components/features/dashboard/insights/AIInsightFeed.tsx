import React, { useState, useEffect } from 'react';

// Define the shape of an AI Insight
interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'savings' | 'investing' | 'budgeting' | 'spending' | 'debt' | 'general' | 'credit';
  actionLabel: string;
  actionUrl: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

// Dummy data for simulation
const dummyInsights: AIInsight[] = [
  {
    id: '1',
    title: 'High Spending Alert',
    description: 'You\'ve spent 25% more than your average weekly spending in the last 3 days. Consider reviewing your recent transactions to identify potential areas for reduction.',
    category: 'spending',
    actionLabel: 'Review Transactions',
    actionUrl: '/dashboard/transactions',
    severity: 'high',
    timestamp: '2023-10-26T10:00:00Z',
  },
  {
    id: '2',
    title: 'Savings Opportunity Found',
    description: 'Based on your recent income and expenses, you could comfortably save an additional $150 this month without impacting your current lifestyle.',
    category: 'savings',
    actionLabel: 'Adjust Savings Goal',
    actionUrl: '/dashboard/savings',
    severity: 'medium',
    timestamp: '2023-10-25T15:30:00Z',
  },
  {
    id: '3',
    title: 'Diversify Your Investments',
    description: 'Your portfolio shows a high concentration in tech stocks. Explore diversifying into other sectors like healthcare or real estate for better risk management.',
    category: 'investing',
    actionLabel: 'Explore Investment Options',
    actionUrl: '/dashboard/investments',
    severity: 'low',
    timestamp: '2023-10-24T09:00:00Z',
  },
  {
    id: '4',
    title: 'Upcoming Bill Reminder',
    description: 'Your electricity bill of $75 is due in 3 days. Ensure you have sufficient funds available and avoid late fees.',
    category: 'budgeting',
    actionLabel: 'View Bills',
    actionUrl: '/dashboard/bills',
    severity: 'medium',
    timestamp: '2023-10-23T18:00:00Z',
  },
  {
    id: '5',
    title: 'Credit Score Improvement Tip',
    description: 'Paying off your smallest credit card balance could significantly boost your credit score and reduce interest payments over time.',
    category: 'credit',
    actionLabel: 'View Debt Strategy',
    actionUrl: '/dashboard/debt',
    severity: 'low',
    timestamp: '2023-10-22T11:45:00Z',
  },
  {
    id: '6',
    title: 'Subscription Review Needed',
    description: 'We detected duplicate subscriptions for streaming services. Review your subscriptions to save money.',
    category: 'spending',
    actionLabel: 'Manage Subscriptions',
    actionUrl: '/dashboard/subscriptions',
    severity: 'high',
    timestamp: '2023-10-21T08:00:00Z',
  },
];

// Helper to determine border color based on insight severity
const getBorderColorClass = (severity: AIInsight['severity']) => {
  switch (severity) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-yellow-500';
    case 'low':
    default:
      return 'border-l-green-500';
  }
};

const AIInsightFeed: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        // In a real application, you would fetch data from an API here:
        // const response = await fetch('/api/user-insights');
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();
        // setInsights(data);

        // For now, use dummy data and sort by timestamp
        setInsights(dummyInsights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } catch (err) {
        console.error('Failed to fetch AI insights:', err);
        setError('Failed to load insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => ( // Render multiple skeleton loaders for a better user experience
          <div key={i} className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 border-l-4 border-l-gray-300 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/5"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-700 bg-red-50 rounded-lg border border-red-200">
        <p>{error}</p>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-sm">
        <p className="text-lg font-semibold mb-2">No new insights yet!</p>
        <p className="text-sm">Our AI is always working to find personalized financial opportunities for you.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`bg-white rounded-lg shadow-sm p-5 border border-gray-200 border-l-4 ${getBorderColorClass(insight.severity)} hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-800 pr-4">{insight.title}</h3>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800"
            >
              {insight.category}
            </span>
          </div>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{insight.description}</p>
          <div className="flex justify-between items-center">
            <a
              href={insight.actionUrl}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {insight.actionLabel}
              {/* Icon for call to action */}
              <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </a>
            <span className="text-xs text-gray-400">
              {new Date(insight.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIInsightFeed;