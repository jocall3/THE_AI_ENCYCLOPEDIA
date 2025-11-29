import React, { useState, useMemo, useCallback } from 'react';
import Card from './Card';
import { User, Shield, Lock, Mail, Link as LinkIcon, Zap, Cpu, Globe, Settings, Database, TrendingUp, Bot, Key, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Search, Filter, SlidersHorizontal } from 'lucide-react';

// --- Mock Data Structures for Billion Dollar Features ---

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SecurityAuditLog {
  timestamp: string;
  actor: string;
  action: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  details: string;
}

interface AIModuleConfig {
  moduleId: string;
  name: string;
  version: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  latencyMs: number;
  aiModel: string;
  governanceLevel: 'L1_TRUSTED' | 'L2_VERIFIED' | 'L3_AUTONOMOUS';
}

// --- Utility Components (Simulating Billion Dollar Infrastructure) ---

const MetricDisplay: React.FC<{ metric: SystemMetric }> = ({ metric }) => {
  const trendColor = useMemo(() => {
    switch (metric.trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  }, [metric.trend]);

  const TrendIcon = useMemo(() => {
    switch (metric.trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingUp; // Reusing for simplicity, but in reality, would be a down arrow
      default: return Zap;
    }
  }, [metric.trend]);

  return (
    <div className="p-4 bg-gray-900/70 rounded-xl border border-cyan-700/30 shadow-xl transition duration-300 hover:shadow-cyan-500/20">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider">{metric.name}</h4>
        <TrendIcon size={18} className={trendColor} />
      </div>
      <p className="mt-1 text-4xl font-extrabold text-white">
        {metric.value}
        <span className="text-lg font-semibold text-cyan-400 ml-1">{metric.unit}</span>
      </p>
      <p className="text-xs text-gray-500 mt-2 truncate">{metric.description}</p>
    </div>
  );
};

const AuditLogEntry: React.FC<{ log: SecurityAuditLog }> = ({ log }) => {
  const statusClasses = useMemo(() => {
    switch (log.status) {
      case 'SUCCESS': return 'text-green-400 bg-green-900/20 border-green-700/30';
      case 'FAILURE': return 'text-red-400 bg-red-900/20 border-red-700/30';
      case 'PENDING': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30';
    }
  }, [log.status]);

  return (
    <div className="flex items-start p-3 border-b border-gray-800 hover:bg-gray-800/50 transition duration-150">
      <div className={`w-2 h-2 rounded-full mr-3 mt-1.5 ${statusClasses.split(' ')[0].replace('text', 'bg')}`} />
      <div className="flex-grow">
        <p className="text-sm text-gray-200 font-mono">{log.timestamp}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          <span className="font-semibold text-cyan-300">{log.actor}:</span> {log.action}
        </p>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${statusClasses}`}>{log.status}</span>
    </div>
  );
};

const AIModuleStatus: React.FC<{ config: AIModuleConfig }> = ({ config }) => {
  const statusColor = useMemo(() => {
    switch (config.status) {
      case 'ONLINE': return 'text-green-400';
      case 'OFFLINE': return 'text-red-400';
      case 'MAINTENANCE': return 'text-yellow-400';
    }
  }, [config.status]);

  return (
    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700/50 shadow-inner">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold text-white flex items-center">
          <Bot size={20} className="mr-2 text-cyan-400" />
          {config.name} <span className="text-xs ml-2 text-gray-500">({config.moduleId})</span>
        </h4>
        <span className={`text-sm font-mono ${statusColor}`}>{config.status}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p className="text-gray-400"><Cpu size={14} className="inline mr-1 text-gray-500" />Model: <span className="text-white font-medium">{config.aiModel} v{config.version}</span></p>
        <p className="text-gray-400"><Zap size={14} className="inline mr-1 text-gray-500" />Latency: <span className="text-white font-medium">{config.latencyMs}ms</span></p>
        <p className="text-gray-400 col-span-2"><Shield size={14} className="inline mr-1 text-gray-500" />Governance: <span className="text-purple-400 font-bold">{config.governanceLevel}</span></p>
      </div>
    </div>
  );
};

// --- Main Settings View Component ---

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system' | 'ai_governance'>('profile');
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);
  const [isSecurityExpanded, setIsSecurityExpanded] = useState(false);
  const [isSystemExpanded, setIsSystemExpanded] = useState(false);
  const [isAIGovernanceExpanded, setIsAIGovernanceExpanded] = useState(false);

  // Billion Dollar Mock Data Initialization
  const systemMetrics: SystemMetric[] = useMemo(() => [
    { id: 'latency', name: 'Global Transaction Latency', value: '1.2', unit: 'ms', trend: 'up', description: 'Average time for cross-ledger atomic settlement.' },
    { id: 'throughput', name: 'Quantum Throughput Capacity', value: '99.999', unit: '%', trend: 'stable', description: 'Utilization rate of the distributed consensus fabric.' },
    { id: 'ai_ops', name: 'Autonomous Decision Rate', value: '4,102', unit: 'Ops/s', trend: 'up', description: 'Decisions executed by L3 Autonomous AI modules.' },
    { id: 'data_integrity', name: 'Data Integrity Score', value: '1.0000', unit: '', trend: 'stable', description: 'Verification score against the immutable ledger hash.' },
  ], []);

  const securityLogs: SecurityAuditLog[] = useMemo(() => [
    { timestamp: '2024-10-27T14:30:01Z', actor: 'Sentinel_AI_001', action: 'Validated configuration hash for Ledger_Alpha', status: 'SUCCESS', details: 'Hash match confirmed.' },
    { timestamp: '2024-10-27T14:29:55Z', actor: 'User_JOCIII', action: 'Attempted to elevate access level to ROOT_ADMIN', status: 'FAILURE', details: 'Insufficient biometric signature match.' },
    { timestamp: '2024-10-27T14:28:10Z', actor: 'System_Monitor', action: 'Initiated self-diagnostic on Quantum Entanglement Link 3', status: 'PENDING', details: 'Awaiting response from remote node 7.' },
  ], []);

  const aiModules: AIModuleConfig[] = useMemo(() => [
    { moduleId: 'PREDICT_01', name: 'Market Foresight Engine', version: '4.2.1-beta', status: 'ONLINE', latencyMs: 45, aiModel: 'GPT-Sovereign-X', governanceLevel: 'L3_AUTONOMOUS' },
    { moduleId: 'COMPLIANCE_03', name: 'Regulatory Adherence Matrix', version: '1.1.0', status: 'MAINTENANCE', latencyMs: 1200, aiModel: 'BERT-Regulator', governanceLevel: 'L2_VERIFIED' },
    { moduleId: 'SECURITY_05', name: 'Threat Vector Neutralizer', version: '5.0.0', status: 'ONLINE', latencyMs: 12, aiModel: 'DeepMind-Shield', governanceLevel: 'L1_TRUSTED' },
  ], []);

  // --- Tab Content Renderers ---

  const renderProfileSettings = () => (
    <div className="space-y-8">
      <Card title="The Visionary Nexus" icon={User}>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 p-6 bg-gray-900/50 rounded-xl border border-cyan-700/30">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl shadow-cyan-500/40 ring-4 ring-cyan-500/50">
            TV
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-white tracking-tight">The Visionary</h3>
            <p className="text-xl text-gray-400 mt-1">visionary@sovereign.ai</p>
            <p className="text-sm text-purple-300 mt-2 flex items-center justify-center md:justify-start">
                <Shield size={16} className="mr-1"/> Governance Level: ARCHITECT
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
            <h4 className="text-xl font-semibold text-cyan-400 border-b border-gray-700 pb-2">Immutable Identity Vectors</h4>
            <SettingItem
                label="Primary Wallet Address (Immutable)"
                value="0x7A9B...C3D4E5F6"
                icon={LinkIcon}
                status="VERIFIED"
                statusColor="text-green-400"
            />
            <SettingItem
                label="Biometric Signature Hash"
                value="SHA-512/256-A9B8C7D6..."
                icon={Lock}
                status="LOCKED"
                statusColor="text-red-400"
            />
            <SettingItem
                label="Communication Relay Endpoint"
                value="relay.sovereign.ai:443/secure"
                icon={Mail}
                status="ACTIVE"
                statusColor="text-green-400"
            />
        </div>
      </Card>

      <Card title="The Architect's Decree Manifestation" isExpandable={true} isExpanded={isProfileExpanded} onToggle={() => setIsProfileExpanded(!isProfileExpanded)}>
        {isProfileExpanded && (
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <p>
                    <span className="text-cyan-400 font-bold text-lg block mb-2">The Prime Directive: Optimization of Reality.</span>
                    The configuration presented here is not merely preference; it is the current state vector of your operational sovereignty. Any modification must pass the Tri-Lateral Consensus Protocol (TLCP) enforced by the core AI governance layer.
                </p>
                <p className="text-sm italic border-l-4 border-purple-500 pl-3 text-gray-400">
                    "We do not manage complexity; we transcend it. Your role is to maintain the integrity of the input vectors, allowing the AI to execute the optimal path through the probabilistic future." - J.B.O'C III.
                </p>
                <button className="mt-3 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg transition duration-200 shadow-lg shadow-purple-500/30 flex items-center">
                    <Key size={18} className="mr-2"/> Initiate TLCP Re-Verification
                </button>
            </div>
        )}
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      <Card title="Quantum Security Matrix" icon={Shield}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {systemMetrics.map(metric => (
            <MetricDisplay key={metric.id} metric={metric} />
          ))}
        </div>
      </Card>

      <Card title="Access Control & Biometric Thresholds" isExpandable={true} isExpanded={isSecurityExpanded} onToggle={() => setIsSecurityExpanded(!isSecurityExpanded)}>
        {isSecurityExpanded && (
            <div className="space-y-4">
                <SecurityControlItem
                    label="Multi-Factor Quantum Key Requirement"
                    description="Enforces a minimum of three independent verification factors for high-value operations."
                    enabled={true}
                />
                <SecurityControlItem
                    label="AI Anomaly Detection Sensitivity"
                    description="Adjusts the threshold for triggering automated security lockdowns based on behavioral deviation."
                    enabled={false} // Defaulting to a safer, lower sensitivity for this example expansion
                />
                <div className="p-4 bg-red-900/20 border border-red-600/50 rounded-lg flex items-center space-x-3">
                    <AlertTriangle size={24} className="text-red-400 flex-shrink-0"/>
                    <p className="text-sm text-red-300">
                        Warning: Modifying the Anomaly Detection Sensitivity below Level 5 requires explicit authorization from the Sentinel AI Core.
                    </p>
                </div>
            </div>
        )}
      </Card>

      <Card title="Real-Time Security Audit Log" icon={Database}>
        <div className="max-h-96 overflow-y-auto border border-gray-700 rounded-lg bg-gray-900/50">
          {securityLogs.map((log, index) => (
            <AuditLogEntry key={index} log={log} />
          ))}
          <div className="p-3 text-center bg-gray-800/70 border-t border-gray-700">
            <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center mx-auto">
                Load Historical Vectors <ChevronDown size={16} className="ml-1"/>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-8">
      <Card title="Core Infrastructure Telemetry" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SystemInfoBlock title="Consensus Fabric Status" value="Distributed Mesh v7.1" status="OPTIMAL" />
            <SystemInfoBlock title="Data Replication Factor" value="99.9999%" status="NOMINAL" />
            <SystemInfoBlock title="Energy Consumption Index" value="1.4 PetaJoules/Cycle" status="MONITORED" />
            <SystemInfoBlock title="Geographic Node Distribution" value="7 Continents, 42 Zones" status="EXPANDING" />
        </div>
      </Card>

      <Card title="System Configuration Overrides" isExpandable={true} isExpanded={isSystemExpanded} onToggle={() => setIsSystemExpanded(!isSystemExpanded)}>
        {isSystemExpanded && (
            <div className="space-y-4">
                <SystemToggleItem
                    label="Enable Predictive Resource Allocation"
                    description="Allows AI to preemptively allocate computational resources based on forecasted market activity."
                    enabled={true}
                />
                <SystemToggleItem
                    label="Data Pruning Protocol Activation"
                    description="Defines the schedule for purging non-essential, non-immutable historical data to maintain efficiency."
                    enabled={false}
                />
                <div className="p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                    <p className="text-sm text-yellow-300 flex items-center"><AlertTriangle size={16} className="mr-2"/> Caution: Data Pruning requires a 72-hour consensus window.</p>
                </div>
            </div>
        )}
      </Card>
    </div>
  );

  const renderAIGovernance = () => (
    <div className="space-y-8">
      <Card title="Autonomous Intelligence Modules" icon={Bot}>
        <div className="space-y-4">
          {aiModules.map(module => (
            <AIModuleStatus key={module.moduleId} config={module} />
          ))}
        </div>
      </Card>

      <Card title="AI Governance Layer Configuration" isExpandable={true} isExpanded={isAIGovernanceExpanded} onToggle={() => setIsAIGovernanceExpanded(!isAIGovernanceExpanded)}>
        {isAIGovernanceExpanded && (
            <div className="space-y-4">
                <GovernanceSlider
                    label="L3 Autonomy Threshold"
                    description="Sets the confidence level required for an AI module to execute transactions without human oversight."
                    value={95} // 0 to 100
                    unit="%"
                    color="cyan"
                />
                <GovernanceSlider
                    label="Ethical Constraint Weighting"
                    description="Adjusts the priority given to ethical parameters versus pure optimization metrics."
                    value={80}
                    unit="Weight"
                    color="purple"
                />
                <div className="p-4 bg-cyan-900/20 border border-cyan-600/50 rounded-lg">
                    <p className="text-sm text-cyan-300 flex items-center"><Settings size={16} className="mr-2"/> Governance changes are logged immutably and require dual-signature approval.</p>
                </div>
            </div>
        )}
      </Card>
    </div>
  );

  // --- Helper Components for Expansion ---

  const SettingItem: React.FC<{ label: string, value: string, icon: React.ElementType, status: string, statusColor: string }> = ({ label, value, icon: Icon, status, statusColor }) => (
    <div className="flex justify-between items-center p-3 bg-gray-800/70 rounded-lg border border-gray-700/50">
        <div className="flex items-center space-x-3">
            <Icon size={18} className="text-cyan-400"/>
            <span className="text-gray-300">{label}</span>
        </div>
        <div className="text-right">
            <p className="text-sm font-mono text-white truncate max-w-[200px]">{value}</p>
            <span className={`text-xs font-bold ${statusColor}`}>{status}</span>
        </div>
    </div>
  );

  const SecurityControlItem: React.FC<{ label: string, description: string, enabled: boolean }> = ({ label, description, enabled }) => (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div>
            <p className="text-white font-medium">{label}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <button className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${enabled ? 'bg-green-600' : 'bg-gray-600'}`}>
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    </div>
  );

  const SystemInfoBlock: React.FC<{ title: string, value: string, status: string }> = ({ title, value, status }) => {
    const statusClasses = useMemo(() => {
        if (status === 'OPTIMAL' || status === 'NOMINAL') return 'text-green-400 bg-green-900/20 border-green-700/30';
        if (status === 'MONITORED' || status === 'EXPANDING') return 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30';
        return 'text-gray-400 bg-gray-700/20 border-gray-600/30';
    }, [status]);

    return (
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-700 shadow-lg">
            <p className="text-sm text-gray-400 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-extrabold text-white mt-1">{value}</p>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border mt-2 inline-block ${statusClasses}`}>{status}</span>
        </div>
    );
  };

  const GovernanceSlider: React.FC<{ label: string, description: string, value: number, unit: string, color: 'cyan' | 'purple' }> = ({ label, description, value, unit, color }) => {
    const baseColor = color === 'cyan' ? 'bg-cyan-500' : 'bg-purple-500';
    const trackColor = color === 'cyan' ? 'border-cyan-600' : 'border-purple-600';

    return (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-white font-medium">{label}</p>
            <p className="text-xs text-gray-500 mt-1 mb-3">{description}</p>
            <div className="flex items-center space-x-4">
                <div className={`text-2xl font-bold text-${color}-400 w-16 text-right`}>{value}{unit}</div>
                <div className={`flex-grow h-2 rounded-full bg-gray-700 relative border ${trackColor}`}>
                    <div
                        className={`absolute top-0 left-0 h-full rounded-full ${baseColor}`}
                        style={{ width: `${value}%` }}
                    ></div>
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg ring-2 ring-${color}-400`}
                        style={{ left: `${value}%`, transform: `translate(-50%, -50%)` }}
                    />
                </div>
            </div>
        </div>
    );
  };


  // --- Main Render Structure ---

  const TabButton: React.FC<{ id: typeof activeTab, label: string, icon: React.ElementType }> = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-6 py-3 text-lg font-semibold transition-all duration-300 rounded-t-lg border-b-4 ${
        activeTab === id
          ? 'text-white border-cyan-500 bg-gray-800/50'
          : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600'
      }`}
    >
      <Icon size={20} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Settings size={36} className="text-cyan-400"/>
            <h1 className="text-4xl font-extrabold text-white tracking-tighter">
              Sovereign Configuration Nexus
            </h1>
            <span className="px-3 py-1 rounded-full bg-cyan-900/50 border border-cyan-500/30 text-cyan-400 text-sm font-mono shadow-md">
              ADMIN_OVERRIDE_ACTIVE
            </span>
          </div>
          <div className="flex space-x-2 p-1 bg-gray-900 rounded-xl border border-gray-700 shadow-inner">
            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition"><Search size={18}/></button>
            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition"><Filter size={18}/></button>
            <button className="p-2 rounded-lg text-cyan-400 bg-gray-800/70 transition"><SlidersHorizontal size={18}/></button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 overflow-x-auto">
          <TabButton id="profile" label="Identity & Profile" icon={User} />
          <TabButton id="security" label="Security & Audits" icon={Lock} />
          <TabButton id="system" label="System Telemetry" icon={Globe} />
          <TabButton id="ai_governance" label="AI Governance" icon={Cpu} />
        </div>

        {/* Content Area */}
        <div className="pt-6">
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'ai_governance' && renderAIGovernance()}
        </div>

        {/* Footer Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-cyan-700/50 p-2 text-center text-xs text-gray-500 shadow-2xl shadow-cyan-900/50">
            System Integrity Check: <CheckCircle size={12} className="inline text-green-400 mr-1"/> All core vectors nominal. Last heartbeat: {new Date().toLocaleTimeString()}.
        </div>
      </div>
    </div>
  );
};

export default SettingsView;