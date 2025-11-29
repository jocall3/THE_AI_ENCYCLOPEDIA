import React, { useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';

// Technical note: react-grid-layout requires its own CSS to be imported.
// If using a global CSS import, ensure you have:
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';
// in your main app entry point (e.g., App.tsx or index.tsx) or a global stylesheet.
// For this standalone component, these styles are assumed to be globally available.

// --- Core Configuration Types ---

/**
 * Defines the structure for a model configuration.
 */
interface AIModelConfig {
  modelId: string;
  version: string;
  endpoint: string;
  latencyThresholdMs: number;
  trainingDataCutoff: string;
  features: {
    predictiveAnalytics: boolean;
    naturalLanguageQuery: boolean;
    anomalyDetection: boolean;
    sentimentAnalysis: boolean;
    resourceOptimization: boolean;
    riskAssessment: boolean;
    forecasting: boolean;
    deepLearningEnabled: boolean;
  };
  hyperparameters: Record<string, number | string>;
}

/**
 * Defines a data source structure.
 */
interface DataSource {
  sourceId: string;
  name: string;
  type: 'SQL' | 'NoSQL' | 'API' | 'InternalCache' | 'AI_Generated' | 'External_Market_Feed';
  lastSync: string;
  status: 'Active' | 'Inactive' | 'Error' | 'Syncing';
  schema: Record<string, 'string' | 'number' | 'date' | 'boolean' | 'array'>;
  securityPolicy: 'Encrypted' | 'Tokenized' | 'Public';
}

/**
 * Defines a user profile structure.
 */
interface UserProfile {
  userId: string;
  role: 'Admin' | 'Executive' | 'Analyst' | 'Sales' | 'Operations' | 'Finance';
  preferredLayoutId: string;
  aiAssistantEnabled: boolean;
  dataAccessLevel: number; // 1 (low) to 5 (high)
  aiInteractionHistory: { timestamp: string; query: string; responseType: string }[];
}

/**
 * Defines a Key Performance Indicator (KPI) structure.
 */
interface KPI {
  kpiId: string;
  name: string;
  target: number;
  unit: string;
  calculationMethod: 'Sum' | 'Average' | 'Weighted' | 'AI_Predicted' | 'RealTime_Stream';
  dataSources: string[]; // Source IDs
  criticalityLevel: 1 | 2 | 3; // 1: Low, 3: Critical
}

// --- Widget Registry Type Definitions ---

export interface WidgetDefinition {
  id: string; // Unique ID for this instance of the widget (must match Layout.i)
  type: string; // Key to look up the actual React component in a registry
  props?: Record<string, any>; // Props specific to this widget instance
  config: {
    kpiId?: string;
    dataSourceId?: string;
    aiModel?: AIModelConfig;
    refreshIntervalSeconds: number;
    visualizationType: 'Chart' | 'Table' | 'Gauge' | 'Text' | 'Interactive' | '3D_Simulation';
    securityContext: 'Public' | 'Private' | 'RoleBased' | 'OwnerOnly';
    alertThreshold: number; // Value that triggers an alert
  };
}

interface WidgetRegistryItem {
  component: React.FC<any>;
  name: string; // User-friendly name for adding to the dashboard
  description: string;
  initialProps?: Record<string, any>; // Default props when adding a new instance
  defaultConfig: Omit<WidgetDefinition['config'], 'aiModel'>;
}

export type WidgetRegistry = {
  [key: string]: WidgetRegistryItem;
};

// --- Data Utility Functions ---

/**
 * Simulates fetching data based on configuration. Returns structured mock data.
 */
const useSimulatedAIData = (config: WidgetDefinition['config'], kpi?: KPI): Record<string, any> => {
  const [data, setData] = useState<Record<string, any>>({});

  useEffect(() => {
    // Simulate data processing based on config and KPI
    const generateData = () => {
      const baseValue = Math.floor(Math.random() * 100000) + 50000;
      const predictionFactor = config.aiModel?.features.predictiveAnalytics ? 1.2 : 1.0;
      const anomaly = config.aiModel?.features.anomalyDetection && Math.random() < 0.05 ? baseValue * 1.5 : baseValue;
      const riskScore = Math.floor(Math.random() * 10) + (kpi?.criticalityLevel || 1);

      return {
        currentValue: anomaly,
        target: kpi?.target || 150000,
        predictedNextMonth: anomaly * predictionFactor * (1 + Math.random() * 0.1),
        sentimentScore: Math.floor(Math.random() * 100),
        riskScore: riskScore,
        lastUpdated: new Date().toISOString(),
        dataPoints: Array.from({ length: 10 }, (_, i) => ({
          x: i,
          y: Math.floor(Math.random() * 100) * (kpi ? 1 : 0.5),
        })),
        optimizationSuggestion: riskScore > 8 ? 'Immediate intervention required.' : 'Stable performance.',
      };
    };

    // Simulate refresh interval
    const interval = setInterval(() => {
      setData(generateData());
    }, config.refreshIntervalSeconds * 1000 || 60000);

    setData(generateData()); // Initial load

    return () => clearInterval(interval);
  }, [config, kpi]);

  return data;
};

// --- Widget Components ---

// 1. Revenue Forecast Widget
interface PredictiveRevenueForecastProps {
  kpiDefinition: KPI;
  config: WidgetDefinition['config'];
}
const PredictiveRevenueForecast: React.FC<PredictiveRevenueForecastProps> = ({ kpiDefinition, config }) => {
  const data = useSimulatedAIData(config, kpiDefinition);
  const status = data.currentValue > data.target * 0.9 ? 'On Track' : 'Needs Attention';

  return (
    <div className="p-4 h-full flex flex-col bg-white shadow-inner">
      <h4 className="text-xl font-bold text-indigo-700 mb-2">Revenue Forecast: {kpiDefinition?.name || 'Global Revenue'}</h4>
      <p className="text-sm text-gray-500">Model: {config.aiModel?.modelId} | Version: {config.aiModel?.version}</p>
      <div className="flex-grow flex items-center justify-around my-4 border-t pt-4">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-indigo-900">${Math.round(data.currentValue).toLocaleString()}</p>
          <p className="text-sm text-gray-600">Current YTD Value</p>
        </div>
        <div className="text-center border-l pl-4">
          <p className="text-2xl font-semibold text-purple-600">${Math.round(data.predictedNextMonth).toLocaleString()}</p>
          <p className="text-xs text-gray-500">Predicted Next Period</p>
        </div>
      </div>
      <div className={`p-2 rounded text-center font-semibold ${status === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        Status: {status} (Risk Score: {data.riskScore})
      </div>
      <div className="mt-auto text-xs text-right text-gray-400">
        Last Update: {new Date(data.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

// 2. Customer Sentiment Dashboard
interface SentimentDashboardProps {
  dataSourceId: string;
  config: WidgetDefinition['config'];
}
const RealtimeSentimentDashboard: React.FC<SentimentDashboardProps> = ({ dataSourceId, config }) => {
  const data = useSimulatedAIData(config);
  const sentiment = data.sentimentScore;
  const sentimentText = sentiment > 80 ? 'Highly Positive' : sentiment > 60 ? 'Neutral/Positive' : sentiment > 40 ? 'Neutral' : 'Negative Trend';

  const breakdown = [
    { category: 'Product Quality', score: Math.floor(Math.random() * 30) + 60 },
    { category: 'Customer Service', score: Math.floor(Math.random() * 40) + 50 },
    { category: 'Pricing', score: Math.floor(Math.random() * 50) + 30 },
    { category: 'Delivery Speed', score: Math.floor(Math.random() * 20) + 70 },
    { category: 'Feature Request', score: Math.floor(Math.random() * 50) + 40 },
  ];

  return (
    <div className="p-4 h-full flex flex-col bg-white overflow-auto">
      <h4 className="text-xl font-bold text-pink-700 mb-2">Sentiment Analysis</h4>
      <p className="text-sm text-gray-500">Source: {dataSourceId} | Anomaly Detection: {config.aiModel?.features.anomalyDetection ? 'ON' : 'OFF'}</p>
      <div className="my-3 text-center">
        <div className={`text-5xl font-extrabold ${sentiment > 80 ? 'text-green-500' : sentiment > 60 ? 'text-yellow-500' : 'text-red-500'}`}>
          {sentiment}%
        </div>
        <p className="text-lg font-semibold">{sentimentText}</p>
      </div>
      <div className="flex-grow mt-2 space-y-1 border-t pt-2">
        <p className="font-semibold text-sm">Topic Breakdown:</p>
        {breakdown.map(item => (
          <div key={item.category} className="flex justify-between text-sm">
            <span>{item.category}</span>
            <span className={`font-medium ${item.score > 70 ? 'text-green-600' : 'text-orange-600'}`}>{item.score}%</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs p-2 bg-pink-50 rounded">
        Insight: Pricing sentiment is trending down (-5% WoW). Recommend reviewing competitor pricing data.
      </div>
    </div>
  );
};

// 3. Anomaly Detection Log
interface AnomalyDetectionLogProps {
  config: WidgetDefinition['config'];
}
const AIAnomalyDetectionLog: React.FC<AnomalyDetectionLogProps> = ({ config }) => {
  const [anomalies, setAnomalies] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        const severity = Math.random() > 0.8 ? 'Critical' : Math.random() > 0.5 ? 'High' : 'Medium';
        const description = severity === 'Critical' ? 'Unauthorized access attempt detected in DB-01 (High Latency).' :
                            severity === 'High' ? 'Unusual spike in transaction volume (150% above baseline) - potential DDoS.' :
                            'Minor deviation in server load pattern (10% increase).';
        setAnomalies(prev => [
          { id: Date.now(), time: new Date().toLocaleTimeString(), severity, description, model: config.aiModel?.modelId },
          ...prev.slice(0, 19) // Keep last 20
        ]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [config.aiModel?.modelId]);

  return (
    <div className="p-4 h-full flex flex-col bg-gray-900 text-white overflow-auto">
      <h4 className="text-xl font-bold text-red-400 mb-3 border-b border-red-700 pb-2">Anomaly Detection Stream</h4>
      <p className="text-xs text-gray-500 mb-2">Monitoring {config.aiModel?.endpoint} for deviations.</p>
      <div className="flex-grow space-y-2 text-xs">
        {anomalies.length === 0 && <p className="text-gray-500">No recent anomalies detected. System stable.</p>}
        {anomalies.map(a => (
          <div key={a.id} className={`p-2 rounded border-l-4 ${a.severity === 'Critical' ? 'bg-red-800 border-red-400' : a.severity === 'High' ? 'bg-orange-800 border-orange-400' : 'bg-yellow-800 border-yellow-400'}`}>
            <span className="font-mono mr-2">[{a.time}]</span>
            <span className="font-semibold">{a.severity}:</span> {a.description}
            <p className="text-right text-xs italic text-gray-400">Model: {a.model}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Natural Language Query (NLQ) Interface Widget
interface NLQInterfaceProps {
  config: WidgetDefinition['config'];
  userProfile: UserProfile;
}
const NLQInterface: React.FC<NLQInterfaceProps> = ({ config, userProfile }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = useCallback(() => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    const newInteraction = { timestamp: new Date().toISOString(), query: query, responseType: 'Data Synthesis' };
    userProfile.aiInteractionHistory.push(newInteraction); // Simulate updating profile history

    setTimeout(() => {
      let response = '';
      if (query.toLowerCase().includes('revenue') && userProfile.role === 'Executive') {
        response = 'The Q3 projected revenue is $12.4M, which is 5% above the baseline prediction due to strong APAC sales. Confidence Interval: 92%.';
      } else if (query.toLowerCase().includes('customer churn')) {
        response = 'Current churn rate is 1.2%. The system suggests focusing on users who logged in less than 3 times last month. Actionable Insight Score: 8.5/10.';
      } else if (query.toLowerCase().includes('optimize')) {
        response = 'Optimization analysis initiated. The system recommends adjusting the refresh rate of the "Inventory Optimizer" widget to 60 seconds for real-time stock management.';
      } else {
        response = `Assistant: I processed your query ("${query}"). Based on your role (${userProfile.role}), the optimal response is a synthesized summary of key performance indicators related to operational efficiency.`
      }
      setResult(response);
      setLoading(false);
    }, 1500);
  }, [query, userProfile]);

  return (
    <div className="p-4 h-full flex flex-col bg-gray-100">
      <h4 className="text-xl font-bold text-teal-700 mb-3">Natural Language Query (NLQ)</h4>
      <p className="text-xs text-gray-500 mb-2">Query enterprise data.</p>
      <textarea
        className="w-full p-2 border rounded-md resize-none flex-grow"
        placeholder="Ask a business question (e.g., 'What is the predicted revenue for Q4?')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={3}
      />
      <button
        onClick={handleQuery}
        disabled={loading || !config.aiModel?.features.naturalLanguageQuery}
        className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Ask Assistant'}
      </button>
      {result && (
        <div className="mt-3 p-3 bg-teal-50 border-l-4 border-teal-500 text-sm overflow-auto max-h-40">
          <p className="font-semibold">Assistant Response:</p>
          <p>{result}</p>
        </div>
      )}
      <div className="mt-2 text-xs text-right text-gray-400">
        NLQ Model: {config.aiModel?.modelId}
      </div>
    </div>
  );
};

// 5. Task Prioritization Matrix
interface TaskPrioritizationProps {
  config: WidgetDefinition['config'];
}
const AITaskPrioritizationMatrix: React.FC<TaskPrioritizationProps> = ({ config }) => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Refactor Auth Module (Security)', priority: 'High', aiScore: 95, deadline: '2024-10-01', impact: 'Critical' },
    { id: 2, name: 'Update Marketing Landing Page (Sales)', priority: 'Medium', aiScore: 78, deadline: '2024-09-15', impact: 'High' },
    { id: 3, name: 'Investigate DB Latency Spike (Ops)', priority: 'Critical', aiScore: 99, deadline: '2024-08-20', impact: 'Immediate' },
    { id: 4, name: 'Review Q3 Budget Proposal (Finance)', priority: 'Low', aiScore: 55, deadline: '2024-11-01', impact: 'Medium' },
    { id: 5, name: 'Deploy new Model V4 (Tech)', priority: 'High', aiScore: 92, deadline: '2024-09-01', impact: 'Critical' },
    { id: 6, name: 'Customer Onboarding Flow Fix (Support)', priority: 'Medium', aiScore: 65, deadline: '2024-09-10', impact: 'Low' },
    { id: 7, name: 'Legal Compliance Audit (Admin)', priority: 'Critical', aiScore: 98, deadline: '2024-08-25', impact: 'Immediate' },
    { id: 8, name: 'Sales Team Training (HR)', priority: 'Low', aiScore: 45, deadline: '2024-10-15', impact: 'Medium' },
  ]);

  const getPriorityColor = (score: number) => {
    if (score > 90) return 'bg-red-100 text-red-800 border-red-500';
    if (score > 70) return 'bg-orange-100 text-orange-800 border-orange-500';
    return 'bg-green-100 text-green-800 border-green-500';
  };

  return (
    <div className="p-4 h-full flex flex-col bg-white overflow-auto">
      <h4 className="text-xl font-bold text-red-700 mb-3">Task Prioritization Matrix</h4>
      <p className="text-sm text-gray-500 mb-2">Model {config.aiModel?.modelId} determines urgency.</p>
      <div className="space-y-2 flex-grow overflow-y-auto">
        {tasks.sort((a, b) => b.aiScore - a.aiScore).map(task => (
          <div key={task.id} className={`p-3 border-l-4 ${getPriorityColor(task.aiScore)} flex justify-between items-center transition duration-150 hover:shadow-md`}>
            <div>
              <p className="font-semibold text-sm">{task.name}</p>
              <p className="text-xs text-gray-600">Impact: {task.impact} | Deadline: {task.deadline}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">{task.aiScore}</span>
              <p className="text-xs">Score</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-600 border-t pt-2">
        Highest Priority Task: {tasks.sort((a, b) => b.aiScore - a.aiScore)[0].name}
      </div>
    </div>
  );
};

// 6. Resource Allocation Optimizer
interface ResourceOptimizerProps {
  config: WidgetDefinition['config'];
}
const AIResourceAllocationOptimizer: React.FC<ResourceOptimizerProps> = ({ config }) => {
  const [resources, setResources] = useState([
    { name: 'Engineering Team A', utilization: 85, optimal: 75, recommendation: 'Reduce scope on Project X. Utilization is 10% above sustainable threshold.' },
    { name: 'Sales Team West', utilization: 98, optimal: 80, recommendation: 'Critical: Hire 2 more reps immediately. High risk of burnout.' },
    { name: 'Cloud Compute Cluster', utilization: 62, optimal: 70, recommendation: 'Increase load balancing threshold. 8% underutilized capacity.' },
    { name: 'Marketing Budget Q4', utilization: 40, optimal: 90, recommendation: 'Increase spend on high-performing channels (MKT_CAMPAIGN_OPTIMIZER).' },
  ]);

  return (
    <div className="p-4 h-full flex flex-col bg-blue-900 text-white overflow-auto">
      <h4 className="text-xl font-bold text-blue-300 mb-3 border-b border-blue-700 pb-2">Resource Allocation Optimizer</h4>
      <p className="text-sm text-blue-200 mb-4">Optimization based on predicted demand and utilization thresholds.</p>
      <div className="space-y-3 flex-grow overflow-y-auto">
        {resources.map((res, index) => (
          <div key={index} className="bg-blue-800 p-3 rounded shadow-lg border-l-4 border-blue-400">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{res.name}</p>
              <span className={`text-lg font-bold ${res.utilization > res.optimal + 10 ? 'text-red-400' : res.utilization < res.optimal - 10 ? 'text-yellow-400' : 'text-green-400'}`}>{res.utilization}% Util</span>
            </div>
            <p className="text-xs mt-1 italic text-blue-300">Recommendation: {res.recommendation}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-blue-400 border-t border-blue-700 pt-2">
        Model Latency: {config.aiModel?.latencyThresholdMs}ms target.
      </div>
    </div>
  );
};

// 7. Profile Customization Panel
interface AIProfileCustomizationProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}
const AIProfileCustomizationPanel: React.FC<AIProfileCustomizationProps> = ({ userProfile, onProfileUpdate }) => {
  const [tempProfile, setTempProfile] = useState(userProfile);

  const handleToggleAssistant = useCallback(() => {
    const newProfile = { ...tempProfile, aiAssistantEnabled: !tempProfile.aiAssistantEnabled };
    setTempProfile(newProfile);
    onProfileUpdate(newProfile);
  }, [tempProfile, onProfileUpdate]);

  const handleRoleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProfile = { ...tempProfile, role: e.target.value as UserProfile['role'] };
    setTempProfile(newProfile);
    onProfileUpdate(newProfile);
  }, [tempProfile, onProfileUpdate]);

  return (
    <div className="p-4 h-full flex flex-col bg-purple-100 overflow-auto">
      <h4 className="text-xl font-bold text-purple-800 mb-3 border-b border-purple-300 pb-2">Profile & Personalization</h4>
      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-center p-2 bg-purple-50 rounded shadow-sm">
          <label className="font-medium">Assistant Enabled</label>
          <button
            onClick={handleToggleAssistant}
            className={`px-3 py-1 rounded text-white text-sm font-bold ${tempProfile.aiAssistantEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-500'}`}
          >
            {tempProfile.aiAssistantEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <label className="block">
          <span className="text-gray-700 font-medium">Current Role:</span>
          <select value={tempProfile.role} onChange={handleRoleChange} className="mt-1 block w-full p-2 border rounded-md">
            <option value="Admin">Admin</option>
            <option value="Executive">Executive</option>
            <option value="Analyst">Analyst</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
          </select>
        </label>

        <p className="text-sm">Preferred Layout ID: <span className="font-semibold text-purple-700">{tempProfile.preferredLayoutId}</span></p>
        <p className="text-sm">Data Access Level: <span className="font-semibold text-purple-700">{tempProfile.dataAccessLevel}/5</span></p>

        <div className="pt-3 border-t border-purple-300">
          <p className="text-xs text-purple-700 font-semibold mb-1">Insight Summary:</p>
          <p className="text-xs italic bg-purple-50 p-2 rounded">
            Based on your role ({tempProfile.role}), recommendations are provided for widget prioritization. Your current layout matches 85% of the optimal configuration for this role.
          </p>
        </div>
        
        <div className="pt-3 border-t border-purple-300">
          <p className="text-xs text-purple-700 font-semibold mb-1">Recent Interactions:</p>
          <div className="max-h-20 overflow-y-auto text-xs space-y-1">
            {tempProfile.aiInteractionHistory.slice(-3).map((interaction, index) => (
              <p key={index} className="truncate bg-gray-50 p-1 rounded">
                [{new Date(interaction.timestamp).toLocaleTimeString()}] {interaction.query}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. Data Quality Monitor
interface DataQualityMonitorProps {
  dataSourceId: string;
  config: WidgetDefinition['config'];
}
const AIDataQualityMonitor: React.FC<DataQualityMonitorProps> = ({ dataSourceId, config }) => {
  const [qualityMetrics, setQualityMetrics] = useState({
    completeness: 98.5,
    consistency: 99.1,
    timeliness: 95.0,
    errorRate: 0.05,
    schemaDrift: 0.1,
    securityCompliance: 100,
  });

  const getStatusColor = (value: number) => {
    if (value > 97) return 'text-green-600';
    if (value > 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-4 h-full flex flex-col bg-gray-50 overflow-auto">
      <h4 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">Data Quality Monitor: {dataSourceId}</h4>
      <p className="text-sm text-gray-500 mb-3">Model: {config.aiModel?.modelId} | Alert Threshold: {config.alertThreshold}%</p>
      <div className="grid grid-cols-3 gap-4 flex-grow">
        {Object.entries(qualityMetrics).map(([key, value]) => (
          <div key={key} className="p-3 border rounded shadow-sm bg-white text-center">
            <p className="text-xs capitalize text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className={`text-2xl font-bold ${getStatusColor(value)}`}>{value}{key === 'errorRate' || key === 'schemaDrift' ? '' : '%'}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs p-2 bg-gray-200 rounded border-l-4 border-gray-500">
        Recommendation: Timeliness (95.0%) suggests optimizing ETL pipeline latency. Schema drift is minimal, but monitor closely during next deployment.
      </div>
    </div>
  );
};

// Base Widgets
const AI_WIDGETS_MAP: Record<string, WidgetRegistryItem> = {
  'AI_PREDICTIVE_REVENUE': { component: PredictiveRevenueForecast, name: "Revenue Forecast", description: "Predicts future revenue based on historical trends and external market factors.", initialProps: {}, defaultConfig: { refreshIntervalSeconds: 300, visualizationType: 'Chart', securityContext: 'Executive', alertThreshold: 1000000 } },
  'AI_SENTIMENT_DASHBOARD': { component: RealtimeSentimentDashboard, name: "Real-time Sentiment", description: "Monitors customer sentiment across all channels.", initialProps: {}, defaultConfig: { refreshIntervalSeconds: 60, visualizationType: 'Gauge', securityContext: 'Public', alertThreshold: 40 } },
  'AI_ANOMALY_LOG': { component: AIAnomalyDetectionLog, name: "Anomaly Detection Log", description: "Logs critical deviations from baseline operational metrics.", initialProps: {}, defaultConfig: { refreshIntervalSeconds: 10, visualizationType: 'Table', securityContext: 'Private', alertThreshold: 5 } },
  'AI_NLQ_INTERFACE': { component: NLQInterface, name: "Natural Language Query", description: "Allows users to query business data using plain English.", initialProps: {}, defaultConfig: { refreshIntervalSeconds: 0, visualizationType: 'Interactive', securityContext: 'RoleBased', alertThreshold: 0 } },
  'AI_TASK_PRIORITIZER': { component: AITaskPrioritizationMatrix, name: "Task Prioritizer", description: "Ranks tasks by predicted business impact and urgency.", initialProps: {}, defaultConfig: { refreshIntervalSeconds: 1800, visualizationType: 'Table', securityContext: 'RoleBased', alertThreshold: 90 } },
  'AI_RESOURCE_OPTIMIZER': { component: AIResourceAllocationOptimizer, name: "Resource Optimizer", description: "Optimizes team and infrastructure resource allocation.", initialProps: {}, defaultConfig: { refreshIntervalSeconds: 600, visualizationType: 'Chart', securityContext: 'Operations', alertThreshold: 95 } },
  'AI_PROFILE_CUSTOMIZER': { component: AIProfileCustomizationPanel, name: "Profile Customizer", description: "Personalizes dashboard experience based on user role and insights.", initialProps: {}, defaultConfig: { refreshIntervalSeconds: 3600, visualizationType: 'Text', securityContext: 'OwnerOnly', alertThreshold: 0 } },
  'AI_DATA_QUALITY': { component: AIDataQualityMonitor, name: "Data Quality Monitor", description: "Monitors data integrity and suggests ETL improvements.", initialProps: {}, defaultConfig: { refreshIntervalSeconds: 300, visualizationType: 'Gauge', securityContext: 'Admin', alertThreshold: 90 } },
};

// Combine all widgets into the final registry
const WIDGET_REGISTRY: WidgetRegistry = {
  ...AI_WIDGETS_MAP,
};

// --- Widget Wrapper Component ---
interface WidgetWrapperProps {
  id: string;
  title: string;
  onRemove: (id: string) => void;
  children: React.ReactNode;
  isConfigurable: boolean;
  onConfigure: (id: string) => void;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ id, title, onRemove, children, isConfigurable, onConfigure }) => (
  <div className="relative border border-gray-300 rounded-xl shadow-2xl h-full flex flex-col bg-white transition-shadow duration-300 hover:shadow-3xl overflow-hidden">
    <div className="absolute top-1 right-1 flex space-x-1 z-10">
      {isConfigurable && (
        <button
          onClick={() => onConfigure(id)}
          className="p-1 bg-blue-500 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Configure ${title}`}
          title={`Configure ${title}`}
        >
          âš™
        </button>
      )}
      <button
        onClick={() => onRemove(id)}
        className="p-1 bg-red-500 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label={`Remove ${title}`}
        title={`Remove ${title}`}
      >
        &times;
      </button>
    </div>
    <div className="flex-grow p-2 overflow-auto">
      {children}
    </div>
  </div>
);

// --- Configuration Panel Component ---
interface AIConfigurationPanelProps {
  widget: WidgetDefinition;
  registryItem: WidgetRegistryItem;
  onClose: () => void;
  onSave: (updatedWidget: WidgetDefinition) => void;
  allKpis: KPI[];
  allDataSources: DataSource[];
}

const AIConfigurationPanel: React.FC<AIConfigurationPanelProps> = ({ widget, registryItem, onClose, onSave, allKpis, allDataSources }) => {
  const [tempConfig, setTempConfig] = useState(widget.config);
  const [tempProps, setTempProps] = useState(widget.props || {});

  const handleConfigChange = useCallback((key: keyof WidgetDefinition['config'], value: any) => {
    setTempConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePropChange = useCallback((key: string, value: any) => {
    setTempProps(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    const updatedWidget: WidgetDefinition = {
      ...widget,
      config: tempConfig,
      props: tempProps,
    };
    onSave(updatedWidget);
  }, [widget, tempConfig, tempProps, onSave]);

  const renderModelSettings = () => {
    const modelConfig = tempConfig.aiModel || { modelId: 'DEFAULT_V1', version: '1.0', endpoint: '/api/ai', latencyThresholdMs: 500, trainingDataCutoff: '2024-01-01', features: { predictiveAnalytics: true, naturalLanguageQuery: false, anomalyDetection: true, sentimentAnalysis: false, resourceOptimization: false, riskAssessment: false, forecasting: false, deepLearningEnabled: false }, hyperparameters: {} };

    const featureToggles = Object.entries(modelConfig.features).map(([key, enabled]) => (
      <div key={key} className="flex items-center justify-between text-xs py-1 border-b border-purple-200">
        <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => handleConfigChange('aiModel', { ...modelConfig, features: { ...modelConfig.features, [key]: e.target.checked } })}
          className="h-4 w-4 text-purple-600 border-gray-300 rounded"
        />
      </div>
    ));

    return (
      <div className="space-y-4 p-4 border border-purple-300 rounded-lg bg-purple-50">
        <h5 className="font-bold text-purple-800 text-lg">Model Parameters</h5>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="block">
            <span className="text-gray-700">Model ID:</span>
            <input type="text" value={modelConfig.modelId} readOnly className="mt-1 block w-full p-2 border rounded-md bg-white" />
          </label>
          <label className="block">
            <span className="text-gray-700">Latency Threshold (ms):</span>
            <input
              type="number"
              value={modelConfig.latencyThresholdMs}
              onChange={(e) => handleConfigChange('aiModel', { ...modelConfig, latencyThresholdMs: parseInt(e.target.value, 10) })}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </label>
        </div>
        <div className="p-3 bg-white rounded shadow-inner">
          <p className="font-medium text-gray-700 mb-2">Enabled Features:</p>
          <div className="grid grid-cols-2 gap-2">
            {featureToggles}
          </div>
        </div>
        <div className="mt-4 border-t pt-3">
          <p className="font-semibold text-sm text-purple-700">Data Source Mapping:</p>
          <select
            value={tempConfig.dataSourceId || ''}
            onChange={(e) => handleConfigChange('dataSourceId', e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            <option value="">Select Data Source</option>
            {allDataSources.map(ds => (
              <option key={ds.sourceId} value={ds.sourceId}>{ds.name} ({ds.type})</option>
            ))}
          </select>
          <p className="text-xs mt-1 text-gray-500">
            Current Status: {allDataSources.find(ds => ds.sourceId === tempConfig.dataSourceId)?.status || 'N/A'}
          </p>
        </div>
      </div>
    );
  };

  const renderWidgetSpecificProps = () => {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <h5 className="font-bold text-lg mb-2 text-blue-800">Widget Specific Properties</h5>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          <div className="flex justify-between items-center py-1 border-b text-sm">
            <span>Widget Prop 1 ({registryItem.name.substring(0, 5)}):</span>
            <input type="text" defaultValue={`Value_1`} onChange={(e) => handlePropChange(`prop1`, e.target.value)} className="w-32 p-1 border rounded text-right text-xs" />
          </div>
        </div>
      </div>
    );
  };

  const renderSecurityAndAlerts = () => {
    return (
      <div className="p-4 border rounded-lg bg-red-50">
        <h5 className="font-bold text-lg mb-2 text-red-800">Security & Alerting</h5>
        <label className="block mb-3">
          <span className="text-gray-700">Critical Alert Threshold:</span>
          <input
            type="number"
            value={tempConfig.alertThreshold}
            onChange={(e) => handleConfigChange('alertThreshold', parseInt(e.target.value, 10))}
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </label>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          <div className="flex justify-between items-center py-1 border-b text-sm">
            <span>Security Policy Check 1:</span>
            <select className="p-1 border rounded text-xs">
              <option>Enforced</option>
              <option>Audit</option>
              <option>Disabled</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto">
        <div className="p-6">
          <h3 className="text-3xl font-extrabold text-gray-900 border-b pb-3">Configure Widget: {registryItem.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{registryItem.description}</p>

          <div className="mt-6 space-y-6">
            {/* General Configuration */}
            <div className="p-4 border rounded-lg shadow-md">
              <h5 className="font-bold text-lg mb-2">General Settings</h5>
              <label className="block mb-3">
                <span className="text-gray-700">Refresh Interval (seconds):</span>
                <input
                  type="number"
                  value={tempConfig.refreshIntervalSeconds}
                  onChange={(e) => handleConfigChange('refreshIntervalSeconds', parseInt(e.target.value, 10))}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Security Context:</span>
                <select
                  value={tempConfig.securityContext}
                  onChange={(e) => handleConfigChange('securityContext', e.target.value as any)}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  <option>Public</option>
                  <option>Private</option>
                  <option>RoleBased</option>
                  <option>OwnerOnly</option>
                </select>
              </label>
            </div>

            {/* Model Configuration */}
            {renderModelSettings()}

            {/* KPI Mapping */}
            <div className="p-4 border rounded-lg bg-yellow-50 shadow-md">
              <h5 className="font-bold text-lg mb-2 text-yellow-800">KPI Mapping</h5>
              <select
                value={tempConfig.kpiId || ''}
                onChange={(e) => handleConfigChange('kpiId', e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="">Select KPI (Optional)</option>
                {allKpis.map(kpi => (
                  <option key={kpi.kpiId} value={kpi.kpiId}>{kpi.name} ({kpi.unit})</option>
                ))}
              </select>
              <p className="text-xs mt-2 text-yellow-700">
                Selected KPI Target: {allKpis.find(k => k.kpiId === tempConfig.kpiId)?.target.toLocaleString() || 'N/A'}
              </p>
            </div>

            {/* Widget Specific Props */}
            {renderWidgetSpecificProps()}

            {/* Security and Alerts */}
            {renderSecurityAndAlerts()}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Assistant Chat Interface ---
interface AIAssistantChatProps {
  userProfile: UserProfile;
  onLayoutSuggestion: (layout: Layout[], widgets: WidgetDefinition[]) => void;
}

const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ userProfile, onLayoutSuggestion }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([
    { sender: 'ai', text: `Welcome, ${userProfile.role}. I am your Assistant. How can I help with your dashboard today? Try asking for a 'Sales Executive Layout'.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate processing and response
    setTimeout(() => {
      let aiResponse = '';
      let suggestedLayout: Layout[] | null = null;
      let suggestedWidgets: WidgetDefinition[] | null = null;

      if (userMessage.toLowerCase().includes('sales executive layout')) {
        aiResponse = 'Understood. Applying the optimized Sales Executive Dashboard layout, prioritizing Revenue and Churn Risk widgets.';
        suggestedLayout = [
          { i: 'widget-100', x: 0, y: 0, w: 6, h: 6, minW: 4, minH: 4 }, // AI_PREDICTIVE_REVENUE
          { i: 'widget-101', x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 2 }, // AI_SALES_MARKETING_FEATURE_31 (Simulated ID from registry)
          { i: 'widget-102', x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 }, // AI_SALES_MARKETING_FEATURE_32 (Simulated ID from registry)
          { i: 'widget-103', x: 0, y: 6, w: 12, h: 4, minW: 4, minH: 2 }, // AI_NLQ_INTERFACE
        ];
        suggestedWidgets = [
          { id: 'widget-100', type: 'AI_PREDICTIVE_REVENUE', config: WIDGET_REGISTRY['AI_PREDICTIVE_REVENUE'].defaultConfig },
          { id: 'widget-101', type: 'AI_SENTIMENT_DASHBOARD', config: WIDGET_REGISTRY['AI_SENTIMENT_DASHBOARD'].defaultConfig }, // Using existing for simplicity
          { id: 'widget-102', type: 'AI_ANOMALY_LOG', config: WIDGET_REGISTRY['AI_ANOMALY_LOG'].defaultConfig }, // Using existing for simplicity
          { id: 'widget-103', type: 'AI_NLQ_INTERFACE', config: WIDGET_REGISTRY['AI_NLQ_INTERFACE'].defaultConfig },
        ];
        onLayoutSuggestion(suggestedLayout, suggestedWidgets);
      } else if (userMessage.toLowerCase().includes('optimize layout')) {
        aiResponse = 'Analyzing current widget usage and role permissions... I recommend compacting the grid vertically and highlighting the top 3 KPIs.';
      } else if (userMessage.toLowerCase().includes('what is my risk score')) {
        aiResponse = 'Your current operational risk score is 7.2/10. The primary driver is the high utilization of the Sales Team West resource (98%).';
      } else {
        aiResponse = `I am processing your request: "${userMessage}". My model suggests this query relates to ${userProfile.role} performance metrics.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 2000);
  }, [input, userProfile.role, onLayoutSuggestion]);

  const renderChatHistory = () => {
    const historyLines: JSX.Element[] = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isAI = msg.sender === 'ai';
      historyLines.push(
        <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-3`}>
          <div className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-md ${isAI ? 'bg-indigo-100 text-indigo-900' : 'bg-blue-600 text-white'}`}>
            <p className="font-semibold text-xs mb-1">{isAI ? 'Assistant' : 'You'}</p>
            <p className="text-sm">{msg.text}</p>
          </div>
        </div>
      );
      if (isAI) {
        historyLines.push(
          <div key={`analysis-${i}`} className="text-xs text-gray-500 italic border-l-2 border-indigo-300 pl-2 mb-3">
            Context Analysis: Query complexity index 0.{Math.floor(Math.random() * 99)}. Latency: 1.8s. Confidence: 98.5%.
          </div>
        );
      }
    }
    return historyLines;
  };

  return (
    <div className="fixed bottom-0 right-0 w-80 h-96 bg-white border-t-4 border-indigo-600 shadow-2xl flex flex-col z-40">
      <div className="p-3 bg-indigo-600 text-white font-bold flex justify-between items-center">
        Assistant
        <span className="text-xs bg-indigo-800 px-2 py-0.5 rounded">V4.2</span>
      </div>
      <div className="flex-grow p-3 overflow-y-auto space-y-2">
        {renderChatHistory()}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="p-2 bg-gray-200 rounded-lg text-sm italic">Assistant is typing...</div>
          </div>
        )}
      </div>
      <div className="p-3 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Chat with Assistant..."
          className="flex-grow p-2 border rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:opacity-50"
          disabled={isTyping}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// --- Main CustomizableWidgetGrid Component ---

interface CustomizableWidgetGridProps {
  initialWidgets?: WidgetDefinition[];
  initialLayout?: Layout[];
  onLayoutChange?: (layout: Layout[]) => void;
  onWidgetsChange?: (widgets: WidgetDefinition[]) => void;
  widgetRegistry?: WidgetRegistry;
  userProfile: UserProfile;
  kpiDefinitions: KPI[];
  dataSources: DataSource[];
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const CustomizableWidgetGrid: React.FC<CustomizableWidgetGridProps> = ({
  initialWidgets = [],
  initialLayout = [],
  onLayoutChange,
  onWidgetsChange,
  widgetRegistry = WIDGET_REGISTRY,
  userProfile,
  kpiDefinitions,
  dataSources,
}) => {
  const [widgets, setWidgets] = useState<WidgetDefinition[]>(initialWidgets);
  const [layout, setLayout] = useState<Layout[]>(initialLayout);
  const [nextWidgetId, setNextWidgetId] = useState(
    initialWidgets.length > 0
      ? Math.max(...initialWidgets.map(w => parseInt(w.id.replace('widget-', '') || '0', 10))) + 1
      : 0
  );
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [currentConfigWidget, setCurrentConfigWidget] = useState<WidgetDefinition | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(userProfile.aiAssistantEnabled);

  // --- Initialization and Sync ---
  useEffect(() => {
    setWidgets(initialWidgets);
    setLayout(initialLayout);
    setNextWidgetId(
      initialWidgets.length > 0
        ? Math.max(...initialWidgets.map(w => parseInt(w.id.replace('widget-', '') || '0', 10))) + 1
        : 0
    );
    setIsAIAssistantOpen(userProfile.aiAssistantEnabled);
  }, [initialWidgets, initialLayout, userProfile.aiAssistantEnabled]);

  // --- Layout Handlers ---
  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
  }, [onLayoutChange]);

  const handleAILayoutSuggestion = useCallback((suggestedLayout: Layout[], suggestedWidgets: WidgetDefinition[]) => {
    // Merge suggested widgets with existing ones, prioritizing suggestions
    const existingIds = new Set(widgets.map(w => w.id));
    const updatedWidgets = [...widgets.filter(w => !suggestedWidgets.some(sw => sw.id === w.id)), ...suggestedWidgets];

    setWidgets(updatedWidgets);
    onWidgetsChange?.(updatedWidgets);

    // Apply the new layout
    setLayout(suggestedLayout);
    onLayoutChange?.(suggestedLayout);

    // Ensure nextWidgetId is updated if new IDs were introduced
    const maxId = Math.max(...updatedWidgets.map(w => parseInt(w.id.replace('widget-', '') || '0', 10)));
    setNextWidgetId(maxId + 1);
  }, [widgets, onWidgetsChange, onLayoutChange]);

  // --- Widget Management ---
  const addWidget = useCallback((widgetType: string) => {
    const registryItem = widgetRegistry[widgetType];
    if (!registryItem) {
      console.warn(`Widget type "${widgetType}" not found in registry.`);
      return;
    }

    const newId = `widget-${nextWidgetId}`;
    setNextWidgetId(prev => prev + 1);

    // Apply default model config
    const defaultAIModel: AIModelConfig = {
      modelId: 'CORE_V3',
      version: '3.1.2',
      endpoint: '/api/core',
      latencyThresholdMs: 300,
      trainingDataCutoff: '2024-07-01',
      features: { predictiveAnalytics: true, naturalLanguageQuery: true, anomalyDetection: true, sentimentAnalysis: true, resourceOptimization: true, riskAssessment: true, forecasting: true, deepLearningEnabled: true },
      hyperparameters: { learningRate: 0.01, epochs: 100 },
    };

    const newWidget: WidgetDefinition = {
      id: newId,
      type: widgetType,
      props: registryItem.initialProps,
      config: {
        ...registryItem.defaultConfig,
        aiModel: defaultAIModel,
        kpiId: kpiDefinitions.length > 0 ? kpiDefinitions[Math.floor(Math.random() * kpiDefinitions.length)].kpiId : undefined,
        dataSourceId: dataSources.length > 0 ? dataSources[Math.floor(Math.random() * dataSources.length)].sourceId : undefined,
      }
    };

    const updatedWidgets = [...widgets, newWidget];
    setWidgets(updatedWidgets);
    onWidgetsChange?.(updatedWidgets);

    const newLayoutItem: Layout = {
      i: newId,
      x: (layout.length * 4) % 12,
      y: Infinity,
      w: 4,
      h: 5,
      minW: 3,
      minH: 4,
    };

    const updatedLayout = [...layout, newLayoutItem];
    setLayout(updatedLayout);
    onLayoutChange?.(updatedLayout);
  }, [widgets, layout, nextWidgetId, onWidgetsChange, onLayoutChange, widgetRegistry, kpiDefinitions, dataSources]);

  const removeWidget = useCallback((widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    setWidgets(updatedWidgets);
    onWidgetsChange?.(updatedWidgets);

    const updatedLayout = layout.filter(item => item.i !== widgetId);
    setLayout(updatedLayout);
    onLayoutChange?.(updatedLayout);
  }, [widgets, layout, onWidgetsChange, onLayoutChange]);

  // --- Configuration Panel Handlers ---
  const openConfigPanel = useCallback((widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      setCurrentConfigWidget(widget);
      setIsConfigPanelOpen(true);
    }
  }, [widgets]);

  const closeConfigPanel = useCallback(() => {
    setIsConfigPanelOpen(false);
    setCurrentConfigWidget(null);
  }, []);

  const saveWidgetConfig = useCallback((updatedWidget: WidgetDefinition) => {
    setWidgets(prev => prev.map(w => (w.id === updatedWidget.id ? updatedWidget : w)));
    onWidgetsChange?.(widgets.map(w => (w.id === updatedWidget.id ? updatedWidget : w)));
    closeConfigPanel();
  }, [widgets, onWidgetsChange, closeConfigPanel]);

  // --- Optimization Feature ---
  const runAIOptimization = useCallback(() => {
    // Simulate analyzing current layout and suggesting improvements
    const optimizedLayout: Layout[] = layout.map(item => ({
      ...item,
      w: Math.max(3, item.w - 1),
      h: Math.max(3, item.h - 1),
    }));

    const prioritizedWidgets = widgets.sort((a, b) => {
      // Prioritizes widgets based on user role and KPI criticality
      const kpiA = kpiDefinitions.find(k => k.kpiId === a.config.kpiId)?.criticalityLevel || 1;
      const kpiB = kpiDefinitions.find(k => k.kpiId === b.config.kpiId)?.criticalityLevel || 1;
      return kpiB - kpiA;
    });

    setLayout(optimizedLayout);
    setWidgets(prioritizedWidgets);
    onLayoutChange?.(optimizedLayout);
    onWidgetsChange?.(prioritizedWidgets);

    alert('Layout Optimization Complete: Layout compacted and widgets prioritized based on KPI criticality and user role.');
  }, [layout, widgets, kpiDefinitions, onLayoutChange, onWidgetsChange]);

  const availableWidgetTypes = Object.keys(widgetRegistry);

  const renderControlPanel = () => {
    const widgetButtons = availableWidgetTypes.map(type => (
      <button
        key={type}
        onClick={() => addWidget(type)}
        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs whitespace-nowrap transition duration-150"
        title={widgetRegistry[type].description}
      >
        Add {widgetRegistry[type].name}
      </button>
    ));

    return (
      <div className="p-4 bg-white border-b shadow-lg sticky top-0 z-30">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Dashboard Management</h2>
        
        <div className="flex flex-wrap gap-3 mb-4 items-center border-b pb-3">
          <button
            onClick={runAIOptimization}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-150"
          >
            Run Layout Optimization
          </button>
          <button
            onClick={() => setIsAIAssistantOpen(prev => !prev)}
            className={`px-6 py-2 font-semibold rounded-lg shadow-md transition duration-150 ${isAIAssistantOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
          >
            {isAIAssistantOpen ? 'Close Assistant' : 'Open Assistant'}
          </button>
          <span className="text-sm text-gray-500 ml-4 p-2 bg-gray-100 rounded">Current Role: <span className="font-bold text-gray-800">{userProfile.role}</span> | Active Widgets: {widgets.length}</span>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Critical KPI Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {kpiDefinitions.slice(0, 5).map((kpi, i) => (
              <div key={kpi.kpiId} className={`p-2 rounded text-xs border ${kpi.criticalityLevel === 3 ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'}`}>
                <p className="font-semibold truncate">{kpi.name}</p>
                <p className="text-gray-600">Target: {kpi.target.toLocaleString()}</p>
                <p className="text-gray-800">Status: {i % 2 === 0 ? 'Exceeding' : 'Monitoring'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Widgets ({availableWidgetTypes.length} Available)</h3>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50">
            {widgetButtons}
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Advanced Filtering & Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" id={`filter-1`} className="h-4 w-4 text-indigo-600 rounded" defaultChecked={true} />
              <label htmlFor={`filter-1`} className="text-gray-700">Filter Option 1</label>
              <select className="p-1 border rounded text-xs">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderControlPanel()}

      <div className="p-4">
        {widgets.length === 0 && (
          <div className="text-center p-20 bg-white rounded-lg shadow-xl border-4 border-dashed border-indigo-200">
            <h3 className="text-2xl font-bold text-indigo-800">Your Dashboard is Empty</h3>
            <p className="mt-2 text-gray-600">Use the controls above or chat with the Assistant to add widgets.</p>
          </div>
        )}

        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          measureBeforeMount={false}
          compactType="vertical"
          preventCollision={false}
          margin={[10, 10]}
          containerPadding={[10, 10]}
          isDraggable={userProfile.role !== 'Analyst'}
          isResizable={true}
        >
          {widgets.map(widget => {
            const registryItem = widgetRegistry[widget.type];
            const WidgetComponent = registryItem?.component;
            const widgetName = registryItem?.name || widget.type;

            if (!WidgetComponent) {
              return (
                <div key={widget.id}>
                  <WidgetWrapper id={widget.id} onRemove={removeWidget} title={`Unknown Widget: ${widget.type}`} isConfigurable={false} onConfigure={openConfigPanel}>
                    <div className="p-4 bg-red-100 text-red-800 rounded-lg h-full flex items-center justify-center">
                      Error: Component not found for {widget.type}
                    </div>
                  </WidgetWrapper>
                </div>
              );
            }

            const componentProps = {
              ...widget.props,
              config: widget.config,
              kpiDefinition: kpiDefinitions.find(k => k.kpiId === widget.config.kpiId),
              userProfile: userProfile,
              dataSourceId: widget.config.dataSourceId,
              onProfileUpdate: () => {},
            };

            return (
              <div key={widget.id}>
                <WidgetWrapper
                  id={widget.id}
                  onRemove={removeWidget}
                  title={widgetName}
                  isConfigurable={true}
                  onConfigure={openConfigPanel}
                >
                  <WidgetComponent {...componentProps} />
                </WidgetWrapper>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>

      {/* Assistant Chat Interface */}
      {isAIAssistantOpen && (
        <AIAssistantChat
          userProfile={userProfile}
          onLayoutSuggestion={handleAILayoutSuggestion}
        />
      )}

      {/* Configuration Panel Modal */}
      {isConfigPanelOpen && currentConfigWidget && widgetRegistry[currentConfigWidget.type] && (
        <AIConfigurationPanel
          widget={currentConfigWidget}
          registryItem={widgetRegistry[currentConfigWidget.type]}
          onClose={closeConfigPanel}
          onSave={saveWidgetConfig}
          allKpis={kpiDefinitions}
          allDataSources={dataSources}
        />
      )}
    </div>
  );
};

export default CustomizableWidgetGrid;