import React, { useState, useMemo } from 'react';
import { DollarSign, Zap, Target, BarChart2, TrendingUp, Briefcase } from 'lucide-react';

// --- Types ---
interface ImpactMetric {
  id: number;
  name: string;
  value: number;
  unit: string;
  change: number; // percentage compared to prior period
}

interface DAFSummary {
  fundName: string;
  balance: number;
  grantsIssued: number;
  sroiEstimate: number; // Social Return on Investment multiplier
}

// --- Mock Data ---
const mockMetrics: ImpactMetric[] = [
  { id: 1, name: 'Total Grants Distributed', value: 12500000, unit: '$', change: 14.5 },
  { id: 2, name: 'Beneficiaries Reached', value: 345000, unit: '', change: 8.2 },
  { id: 3, name: 'Average SROI Multiplier', value: 3.7, unit: 'x', change: 0.5 },
  { id: 4, name: 'Active Donor-Advised Funds', value: 45, unit: '', change: 2.3 },
];

const mockDAFs: DAFSummary[] = [
  { fundName: 'Future Education Initiative', balance: 500000, grantsIssued: 150000, sroiEstimate: 4.1 },
  { fundName: 'Global Health Fund 2024', balance: 1200000, grantsIssued: 350000, sroiEstimate: 3.2 },
  { fundName: 'Sustainable Infrastructure Trust', balance: 80000, grantsIssued: 12000, sroiEstimate: 5.5 },
  { fundName: 'Community Resilience Fund', balance: 210000, grantsIssued: 75000, sroiEstimate: 2.8 },
];

// --- Helper Components ---

interface StatCardProps extends ImpactMetric {
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, name, value, unit, change }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{name}</h3>
        <Icon className="h-6 w-6 text-indigo-500" />
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-4xl font-extrabold text-gray-900">
          {unit === '$' ? '$' : ''}
          {value.toLocaleString(undefined, { maximumFractionDigits: unit === 'x' ? 1 : 0 })}
          {unit !== '$' ? unit : ''}
        </p>
        <div className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded-full' : 'text-red-600 bg-red-50 px-2 py-0.5 rounded-full'}`}>
          <TrendingUp className={`w-3 h-3 mr-1 transform ${isPositive ? '' : 'rotate-180'}`} />
          {change > 0 ? '+' : ''}{change.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

const DAFTable: React.FC<{ data: DAFSummary[] }> = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
    <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center">
      <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
      Donor Advised Funds Overview
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fund Name</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Balance</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Grants YTD</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated SROI</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((fund, index) => (
            <tr key={index} className="hover:bg-indigo-50/50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-700">{fund.fundName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">${fund.balance.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${fund.grantsIssued.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                {fund.sroiEstimate.toFixed(2)}x
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">View &rarr;</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-6 text-center border-t pt-4">
      <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 transition">
        Create New DAF
      </button>
    </div>
  </div>
);

const ImpactVisualizationPlaceholder: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg h-full min-h-[400px] flex flex-col">
    <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <BarChart2 className="w-5 h-5 mr-2 text-indigo-500" />
        Social Return on Investment (SROI) Trends
    </h2>
    <p className="text-sm text-gray-500 mb-4">Tracking aggregated SROI multiplier across all philanthropic investments by quarter.</p>
    <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 p-8">
      <div className="text-center text-gray-400">
        <BarChart2 className="w-12 h-12 mx-auto mb-3 text-indigo-300" />
        <p className="font-semibold">SROI Modeling & Analytics Engine</p>
        <p className="text-xs mt-1">Data rendered here is dynamic and calculated based on real-time impact metrics and expenditure.</p>
      </div>
    </div>
  </div>
);


// --- Main Component ---
const PhilanthropyHub: React.FC = () => {

  const metricCards = useMemo(() => [
    { ...mockMetrics[0], icon: DollarSign },
    { ...mockMetrics[1], icon: Target },
    { ...mockMetrics[2], icon: Zap },
    { ...mockMetrics[3], icon: Briefcase },
  ], []);


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Philanthropy & Impact Hub</h1>
        <p className="mt-1 text-lg text-gray-500">Visualize your charitable capital, manage funds, and optimize social return.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {metricCards.map((metric) => (
          <StatCard key={metric.id} {...metric} />
        ))}
      </div>

      {/* Main Content: Visualization and DAF Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visualization Panel (2/3 width) */}
        <div className="lg:col-span-2">
            <ImpactVisualizationPlaceholder />
        </div>

        {/* Action Panel (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Next Steps & Recommendations</h2>
            <ul className="space-y-4">
              <li className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                <p className="text-sm font-semibold text-indigo-800">Optimize Allocation</p>
                <p className="text-xs text-indigo-600 mt-1">Fund "Future Education Initiative" is ready for a Q3 grant distribution based on high potential SROI (4.1x).</p>
                <button className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800">
                    Review Grants &rarr;
                </button>
              </li>
              <li className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm font-semibold text-yellow-800">Pending Approvals</p>
                <p className="text-xs text-yellow-600 mt-1">3 grant requests pending review (Total $75,000).</p>
              </li>
              <li className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-semibold text-green-800">Impact Report Generated</p>
                <p className="text-xs text-green-600 mt-1">Q2 Impact Report is complete and ready for download.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* DAF Summary Table */}
      <div className="mt-8">
        <DAFTable data={mockDAFs} />
      </div>
    </div>
  );
};

export default PhilanthropyHub;