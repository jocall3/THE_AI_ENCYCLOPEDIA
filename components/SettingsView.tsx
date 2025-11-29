import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import Card from './Card';
import { User, Shield, Lock, Mail, Link as LinkIcon, Zap, Cpu, Globe, Settings, Database, TrendingUp, Bot, Key, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Search, Filter, SlidersHorizontal } from 'lucide-react';

// =================================================================================
// The complete interface for all 200+ API credentials
// =================================================================================
interface ApiKeysState {
  // === Tech APIs ===
  // Core Infrastructure & Cloud
  STRIPE_SECRET_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  SENDGRID_API_KEY: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AZURE_CLIENT_ID: string;
  AZURE_CLIENT_SECRET: string;
  GOOGLE_CLOUD_API_KEY: string;

  // Deployment & DevOps
  DOCKER_HUB_USERNAME: string;
  DOCKER_HUB_ACCESS_TOKEN: string;
  HEROKU_API_KEY: string;
  NETLIFY_PERSONAL_ACCESS_TOKEN: string;
  VERCEL_API_TOKEN: string;
  CLOUDFLARE_API_TOKEN: string;
  DIGITALOCEAN_PERSONAL_ACCESS_TOKEN: string;
  LINODE_PERSONAL_ACCESS_TOKEN: string;
  TERRAFORM_API_TOKEN: string;

  // Collaboration & Productivity
  GITHUB_PERSONAL_ACCESS_TOKEN: string;
  SLACK_BOT_TOKEN: string;
  DISCORD_BOT_TOKEN: string;
  TRELLO_API_KEY: string;
  TRELLO_API_TOKEN: string;
  JIRA_USERNAME: string;
  JIRA_API_TOKEN: string;
  ASANA_PERSONAL_ACCESS_TOKEN: string;
  NOTION_API_KEY: string;
  AIRTABLE_API_KEY: string;

  // File & Data Storage
  DROPBOX_ACCESS_TOKEN: string;
  BOX_DEVELOPER_TOKEN: string;
  GOOGLE_DRIVE_API_KEY: string;
  ONEDRIVE_CLIENT_ID: string;

  // CRM & Business
  SALESFORCE_CLIENT_ID: string;
  SALESFORCE_CLIENT_SECRET: string;
  HUBSPOT_API_KEY: string;
  ZENDESK_API_TOKEN: string;
  INTERCOM_ACCESS_TOKEN: string;
  MAILCHIMP_API_KEY: string;

  // E-commerce
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  BIGCOMMERCE_ACCESS_TOKEN: string;
  MAGENTO_ACCESS_TOKEN: string;
  WOOCOMMERCE_CLIENT_KEY: string;
  WOOCOMMERCE_CLIENT_SECRET: string;
  
  // Authentication & Identity
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  OKTA_DOMAIN: string;
  OKTA_API_TOKEN: string;

  // Backend & Databases
  FIREBASE_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;

  // API Development
  POSTMAN_API_KEY: string;
  APOLLO_GRAPH_API_KEY: string;

  // AI & Machine Learning
  OPENAI_API_KEY: string;
  HUGGING_FACE_API_TOKEN: string;
  GOOGLE_CLOUD_AI_API_KEY: string;
  AMAZON_REKOGNITION_ACCESS_KEY: string;
  MICROSOFT_AZURE_COGNITIVE_KEY: string;
  IBM_WATSON_API_KEY: string;

  // Search & Real-time
  ALGOLIA_APP_ID: string;
  ALGOLIA_ADMIN_API_KEY: string;
  PUSHER_APP_ID: string;
  PUSHER_KEY: string;
  PUSHER_SECRET: string;
  ABLY_API_KEY: string;
  ELASTICSEARCH_API_KEY: string;
  
  // Identity & Verification
  STRIPE_IDENTITY_SECRET_KEY: string;
  ONFIDO_API_TOKEN: string;
  CHECKR_API_KEY: string;
  
  // Logistics & Shipping
  LOB_API_KEY: string;
  EASYPOST_API_KEY: string;
  SHIPPO_API_TOKEN: string;

  // Maps & Weather
  GOOGLE_MAPS_API_KEY: string;
  MAPBOX_ACCESS_TOKEN: string;
  HERE_API_KEY: string;
  ACCUWEATHER_API_KEY: string;
  OPENWEATHERMAP_API_KEY: string;

  // Social & Media
  YELP_API_KEY: string;
  FOURSQUARE_API_KEY: string;
  REDDIT_CLIENT_ID: string;
  REDDIT_CLIENT_SECRET: string;
  TWITTER_BEARER_TOKEN: string;
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  INSTAGRAM_APP_ID: string;
  INSTAGRAM_APP_SECRET: string;
  YOUTUBE_DATA_API_KEY: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SOUNDCLOUD_CLIENT_ID: string;
  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET: string;

  // Media & Content
  MUX_TOKEN_ID: string;
  MUX_TOKEN_SECRET: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  IMGIX_API_KEY: string;
  
  // Legal & Admin
  STRIPE_ATLAS_API_KEY: string;
  CLERKY_API_KEY: string;
  DOCUSIGN_INTEGRATOR_KEY: string;
  HELLOSIGN_API_KEY: string;
  
  // Monitoring & CI/CD
  LAUNCHDARKLY_SDK_KEY: string;
  SENTRY_AUTH_TOKEN: string;
  DATADOG_API_KEY: string;
  NEW_RELIC_API_KEY: string;
  CIRCLECI_API_TOKEN: string;
  TRAVIS_CI_API_TOKEN: string;
  BITBUCKET_USERNAME: string;
  BITBUCKET_APP_PASSWORD: string;
  GITLAB_PERSONAL_ACCESS_TOKEN: string;
  PAGERDUTY_API_KEY: string;
  
  // Headless CMS
  CONTENTFUL_SPACE_ID: string;
  CONTENTFUL_ACCESS_TOKEN: string;
  SANITY_PROJECT_ID: string;
  SANITY_API_TOKEN: string;
  STRAPI_API_TOKEN: string;

  // === Banking & Finance APIs ===
  // Data Aggregators
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  YODLEE_CLIENT_ID: string;
  YODLEE_SECRET: string;
  MX_CLIENT_ID: string;
  MX_API_KEY: string;
  FINICITY_PARTNER_ID: string;
  FINICITY_APP_KEY: string;

  // Payment Processing
  ADYEN_API_KEY: string;
  ADYEN_MERCHANT_ACCOUNT: string;
  BRAINTREE_MERCHANT_ID: string;
  BRAINTREE_PUBLIC_KEY: string;
  BRAINTREE_PRIVATE_KEY: string;
  SQUARE_APPLICATION_ID: string;
  SQUARE_ACCESS_TOKEN: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET: string;
  DWOLLA_KEY: string;
  DWOLLA_SECRET: string;
  WORLDPAY_API_KEY: string;
  CHECKOUT_SECRET_KEY: string;
  
  // Banking as a Service (BaaS) & Card Issuing
  MARQETA_APPLICATION_TOKEN: string;
  MARQETA_ADMIN_ACCESS_TOKEN: string;
  GALILEO_API_LOGIN: string;
  GALILEO_API_TRANS_KEY: string;
  SOLARISBANK_CLIENT_ID: string;
  SOLARISBANK_CLIENT_SECRET: string;
  SYNAPSE_CLIENT_ID: string;
  SYNAPSE_CLIENT_SECRET: string;
  RAILSBANK_API_KEY: string;
  CLEARBANK_API_KEY: string;
  UNIT_API_TOKEN: string;
  TREASURY_PRIME_API_KEY: string;
  INCREASE_API_KEY: string;
  MERCURY_API_KEY: string;
  BREX_API_KEY: string;
  BOND_API_KEY: string;
  
  // International Payments
  CURRENCYCLOUD_LOGIN_ID: string;
  CURRENCYCLOUD_API_KEY: string;
  OFX_API_KEY: string;
  WISE_API_TOKEN: string;
  REMITLY_API_KEY: string;
  AZIMO_API_KEY: string;
  NIUM_API_KEY: string;
  
  // Investment & Market Data
  ALPACA_API_KEY_ID: string;
  ALPACA_SECRET_KEY: string;
  TRADIER_ACCESS_TOKEN: string;
  IEX_CLOUD_API_TOKEN: string;
  POLYGON_API_KEY: string;
  FINNHUB_API_KEY: string;
  ALPHA_VANTAGE_API_KEY: string;
  MORNINGSTAR_API_KEY: string;
  XIGNITE_API_TOKEN: string;
  DRIVEWEALTH_API_KEY: string;

  // Crypto
  COINBASE_API_KEY: string;
  COINBASE_API_SECRET: string;
  BINANCE_API_KEY: string;
  BINANCE_API_SECRET: string;
  KRAKEN_API_KEY: string;
  KRAKEN_PRIVATE_KEY: string;
  GEMINI_API_KEY: string;
  GEMINI_API_SECRET: string;
  COINMARKETCAP_API_KEY: string;
  COINGECKO_API_KEY: string;
  BLOCKIO_API_KEY: string;

  // Major Banks (Open Banking)
  JP_MORGAN_CHASE_CLIENT_ID: string;
  CITI_CLIENT_ID: string;
  WELLS_FARGO_CLIENT_ID: string;
  CAPITAL_ONE_CLIENT_ID: string;

  // European & Global Banks (Open Banking)
  HSBC_CLIENT_ID: string;
  BARCLAYS_CLIENT_ID: string;
  BBVA_CLIENT_ID: string;
  DEUTSCHE_BANK_API_KEY: string;

  // UK & European Aggregators
  TINK_CLIENT_ID: string;
  TRUELAYER_CLIENT_ID: string;

  // Compliance & Identity (KYC/AML)
  MIDDESK_API_KEY: string;
  ALLOY_API_TOKEN: string;
  ALLOY_API_SECRET: string;
  COMPLYADVANTAGE_API_KEY: string;

  // Real Estate
  ZILLOW_API_KEY: string;
  CORELOGIC_CLIENT_ID: string;

  // Credit Bureaus
  EXPERIAN_API_KEY: string;
  EQUIFAX_API_KEY: string;
  TRANSUNION_API_KEY: string;

  // Global Payments (Emerging Markets)
  FINCRA_API_KEY: string;
  FLUTTERWAVE_SECRET_KEY: string;
  PAYSTACK_SECRET_KEY: string;
  DLOCAL_API_KEY: string;
  RAPYD_ACCESS_KEY: string;
  
  // Accounting & Tax
  TAXJAR_API_KEY: string;
  AVALARA_API_KEY: string;
  CODAT_API_KEY: string;
  XERO_CLIENT_ID: string;
  XERO_CLIENT_SECRET: string;
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  FRESHBOOKS_API_KEY: string;
  
  // Fintech Utilities
  ANVIL_API_KEY: string;
  MOOV_CLIENT_ID: string;
  MOOV_SECRET: string;
  VGS_USERNAME: string;
  VGS_PASSWORD: string;
  SILA_APP_HANDLE: string;
  SILA_PRIVATE_KEY: string;
  
  [key: string]: string; // Index signature for dynamic access
}


// --- Data Structures for System Features (Kept for context but not directly modified) ---

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

// --- Utility Components (System Infrastructure) (Kept for context but not directly modified) ---

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
  const [keys, setKeys] = useState<ApiKeysState>({} as ApiKeysState);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system' | 'ai_governance' | 'api_keys'>('api_keys');
  
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);
  const [isSecurityExpanded, setIsSecurityExpanded] = useState(false);
  const [isSystemExpanded, setIsSystemExpanded] = useState(false);
  const [isAIGovernanceExpanded, setIsAIGovernanceExpanded] = useState(false);
  const [isApiKeysExpanded, setIsApiKeysExpanded] = useState(true);


  // API Key Management Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys(prevKeys => ({ ...prevKeys, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('Saving keys securely to backend...');
    try {
      // Assuming axios is imported or available globally, as per the instructions reference
      const response = await axios.post('http://localhost:4000/api/save-keys', keys);
      setStatusMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setStatusMessage('Error: Could not save keys. Please check backend server.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderApiKeyInput = useCallback((keyName: keyof ApiKeysState, label: string) => (
    <div key={keyName} className="input-group">
      <label htmlFor={keyName}>{label}</label>
      <input
        type="password"
        id={keyName}
        name={keyName}
        value={keys[keyName] || ''}
        onChange={handleInputChange}
        placeholder={`Enter ${label}`}
      />
    </div>
  ), [keys]);


  // System Data Initialization (Kept for context)
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
    { moduleId: 'PREDICT_01', name: 'Market Foresight Engine', version: '4.2.1-beta', status: 'ONLINE', latencyMs: 45, aiModel: 'GPT-Core-X', governanceLevel: 'L3_AUTONOMOUS' },
    { moduleId: 'COMPLIANCE_03', name: 'Regulatory Adherence Matrix', version: '1.1.0', status: 'MAINTENANCE', latencyMs: 1200, aiModel: 'BERT-Regulator', governanceLevel: 'L2_VERIFIED' },
    { moduleId: 'SECURITY_05', name: 'Threat Vector Neutralizer', version: '5.0.0', status: 'ONLINE', latencyMs: 12, aiModel: 'DeepMind-Shield', governanceLevel: 'L1_TRUSTED' },
  ], []);

  // --- Tab Content Renderers ---

  const renderProfileSettings = () => (
    <div className="space-y-8">
      <Card title="User Profile" icon={User}>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 p-6 bg-gray-900/50 rounded-xl border border-cyan-700/30">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl shadow-cyan-500/40 ring-4 ring-cyan-500/50">
            UP
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold text-white tracking-tight">User</h3>
            <p className="text-xl text-gray-400 mt-1">user@system.ai</p>
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
                value="relay.system.ai:443/secure"
                icon={Mail}
                status="ACTIVE"
                statusColor="text-green-400"
            />
        </div>
      </Card>

      <Card title="User Directives" isExpandable={true} isExpanded={isProfileExpanded} onToggle={() => setIsProfileExpanded(!isProfileExpanded)}>
        {isProfileExpanded && (
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <p>
                    <span className="text-cyan-400 font-bold text-lg block mb-2">System Configuration.</span>
                    This configuration reflects the current operational state. Any modifications require adherence to established protocols.
                </p>
                <button className="mt-3 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg transition duration-200 shadow-lg shadow-purple-500/30 flex items-center">
                    <Key size={18} className="mr-2"/> Initiate Protocol Re-Verification
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

  const renderApiKeysSettings = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card title="API Credential Management (200+ Services)" icon={Key}>
        <p className="text-gray-400 mb-6 border-b border-gray-800 pb-3">
            Securely input all necessary integration secrets. These are encrypted and stored server-side. Only provide values for services you are actively using.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          
          {/* === TECH APIS SECTION === */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 mt-4 border-l-4 border-cyan-500 pl-3">Tech APIs</h3>
          </div>
          
          {/* Core Infrastructure & Cloud */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Core Infrastructure & Cloud</h4>
            {renderApiKeyInput('STRIPE_SECRET_KEY', 'Stripe Secret Key')}
            {renderApiKeyInput('TWILIO_ACCOUNT_SID', 'Twilio Account SID')}
            {renderApiKeyInput('TWILIO_AUTH_TOKEN', 'Twilio Auth Token')}
            {renderApiKeyInput('SENDGRID_API_KEY', 'SendGrid API Key')}
            {renderApiKeyInput('AWS_ACCESS_KEY_ID', 'AWS Access Key ID')}
            {renderApiKeyInput('AWS_SECRET_ACCESS_KEY', 'AWS Secret Access Key')}
            {renderApiKeyInput('AZURE_CLIENT_ID', 'Azure Client ID')}
            {renderApiKeyInput('AZURE_CLIENT_SECRET', 'Azure Client Secret')}
            {renderApiKeyInput('GOOGLE_CLOUD_API_KEY', 'Google Cloud API Key')}
          </div>

          {/* Deployment & DevOps */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Deployment & DevOps</h4>
            {renderApiKeyInput('DOCKER_HUB_USERNAME', 'Docker Hub Username')}
            {renderApiKeyInput('DOCKER_HUB_ACCESS_TOKEN', 'Docker Hub Access Token')}
            {renderApiKeyInput('HEROKU_API_KEY', 'Heroku API Key')}
            {renderApiKeyInput('NETLIFY_PERSONAL_ACCESS_TOKEN', 'Netlify PAT')}
            {renderApiKeyInput('VERCEL_API_TOKEN', 'Vercel API Token')}
            {renderApiKeyInput('CLOUDFLARE_API_TOKEN', 'Cloudflare API Token')}
            {renderApiKeyInput('DIGITALOCEAN_PERSONAL_ACCESS_TOKEN', 'DigitalOcean PAT')}
            {renderApiKeyInput('LINODE_PERSONAL_ACCESS_TOKEN', 'Linode PAT')}
            {renderApiKeyInput('TERRAFORM_API_TOKEN', 'Terraform API Token')}
          </div>

          {/* Collaboration & Productivity */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Collaboration & Productivity</h4>
            {renderApiKeyInput('GITHUB_PERSONAL_ACCESS_TOKEN', 'GitHub PAT')}
            {renderApiKeyInput('SLACK_BOT_TOKEN', 'Slack Bot Token')}
            {renderApiKeyInput('DISCORD_BOT_TOKEN', 'Discord Bot Token')}
            {renderApiKeyInput('TRELLO_API_KEY', 'Trello API Key')}
            {renderApiKeyInput('TRELLO_API_TOKEN', 'Trello API Token')}
            {renderApiKeyInput('JIRA_USERNAME', 'Jira Username')}
            {renderApiKeyInput('JIRA_API_TOKEN', 'Jira API Token')}
            {renderApiKeyInput('ASANA_PERSONAL_ACCESS_TOKEN', 'Asana PAT')}
            {renderApiKeyInput('NOTION_API_KEY', 'Notion API Key')}
            {renderApiKeyInput('AIRTABLE_API_KEY', 'Airtable API Key')}
          </div>

          {/* File & Data Storage */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">File & Data Storage</h4>
            {renderApiKeyInput('DROPBOX_ACCESS_TOKEN', 'Dropbox Access Token')}
            {renderApiKeyInput('BOX_DEVELOPER_TOKEN', 'Box Developer Token')}
            {renderApiKeyInput('GOOGLE_DRIVE_API_KEY', 'Google Drive API Key')}
            {renderApiKeyInput('ONEDRIVE_CLIENT_ID', 'OneDrive Client ID')}
          </div>

          {/* CRM & Business */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">CRM & Business</h4>
            {renderApiKeyInput('SALESFORCE_CLIENT_ID', 'Salesforce Client ID')}
            {renderApiKeyInput('SALESFORCE_CLIENT_SECRET', 'Salesforce Client Secret')}
            {renderApiKeyInput('HUBSPOT_API_KEY', 'HubSpot API Key')}
            {renderApiKeyInput('ZENDESK_API_TOKEN', 'Zendesk API Token')}
            {renderApiKeyInput('INTERCOM_ACCESS_TOKEN', 'Intercom Access Token')}
            {renderApiKeyInput('MAILCHIMP_API_KEY', 'Mailchimp API Key')}
          </div>

          {/* E-commerce */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">E-commerce</h4>
            {renderApiKeyInput('SHOPIFY_API_KEY', 'Shopify API Key')}
            {renderApiKeyInput('SHOPIFY_API_SECRET', 'Shopify API Secret')}
            {renderApiKeyInput('BIGCOMMERCE_ACCESS_TOKEN', 'BigCommerce Access Token')}
            {renderApiKeyInput('MAGENTO_ACCESS_TOKEN', 'Magento Access Token')}
            {renderApiKeyInput('WOOCOMMERCE_CLIENT_KEY', 'WooCommerce Client Key')}
            {renderApiKeyInput('WOOCOMMERCE_CLIENT_SECRET', 'WooCommerce Client Secret')}
          </div>

          {/* Authentication & Identity */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Authentication & Identity</h4>
            {renderApiKeyInput('STYTCH_PROJECT_ID', 'Stytch Project ID')}
            {renderApiKeyInput('STYTCH_SECRET', 'Stytch Secret')}
            {renderApiKeyInput('AUTH0_DOMAIN', 'Auth0 Domain')}
            {renderApiKeyInput('AUTH0_CLIENT_ID', 'Auth0 Client ID')}
            {renderApiKeyInput('AUTH0_CLIENT_SECRET', 'Auth0 Client Secret')}
            {renderApiKeyInput('OKTA_DOMAIN', 'Okta Domain')}
            {renderApiKeyInput('OKTA_API_TOKEN', 'Okta API Token')}
          </div>

          {/* Backend & Databases */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Backend & Databases</h4>
            {renderApiKeyInput('FIREBASE_API_KEY', 'Firebase API Key')}
            {renderApiKeyInput('SUPABASE_URL', 'Supabase URL')}
            {renderApiKeyInput('SUPABASE_ANON_KEY', 'Supabase Anon Key')}
          </div>

          {/* API Development */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">API Development</h4>
            {renderApiKeyInput('POSTMAN_API_KEY', 'Postman API Key')}
            {renderApiKeyInput('APOLLO_GRAPH_API_KEY', 'Apollo Graph API Key')}
          </div>

          {/* AI & Machine Learning */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">AI & Machine Learning</h4>
            {renderApiKeyInput('OPENAI_API_KEY', 'OpenAI API Key')}
            {renderApiKeyInput('HUGGING_FACE_API_TOKEN', 'Hugging Face API Token')}
            {renderApiKeyInput('GOOGLE_CLOUD_AI_API_KEY', 'Google Cloud AI API Key')}
            {renderApiKeyInput('AMAZON_REKOGNITION_ACCESS_KEY', 'Amazon Rekognition Access Key')}
            {renderApiKeyInput('MICROSOFT_AZURE_COGNITIVE_KEY', 'Microsoft Azure Cognitive Key')}
            {renderApiKeyInput('IBM_WATSON_API_KEY', 'IBM Watson API Key')}
          </div>

          {/* Search & Real-time */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Search & Real-time</h4>
            {renderApiKeyInput('ALGOLIA_APP_ID', 'Algolia App ID')}
            {renderApiKeyInput('ALGOLIA_ADMIN_API_KEY', 'Algolia Admin API Key')}
            {renderApiKeyInput('PUSHER_APP_ID', 'Pusher App ID')}
            {renderApiKeyInput('PUSHER_KEY', 'Pusher Key')}
            {renderApiKeyInput('PUSHER_SECRET', 'Pusher Secret')}
            {renderApiKeyInput('ABLY_API_KEY', 'Ably API Key')}
            {renderApiKeyInput('ELASTICSEARCH_API_KEY', 'Elasticsearch API Key')}
          </div>
          
          {/* Identity & Verification */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Identity & Verification</h4>
            {renderApiKeyInput('STRIPE_IDENTITY_SECRET_KEY', 'Stripe Identity Secret Key')}
            {renderApiKeyInput('ONFIDO_API_TOKEN', 'Onfido API Token')}
            {renderApiKeyInput('CHECKR_API_KEY', 'Checkr API Key')}
          </div>

          {/* Logistics & Shipping */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Logistics & Shipping</h4>
            {renderApiKeyInput('LOB_API_KEY', 'Lob API Key')}
            {renderApiKeyInput('EASYPOST_API_KEY', 'EasyPost API Key')}
            {renderApiKeyInput('SHIPPO_API_TOKEN', 'Shippo API Token')}
          </div>
          
          {/* Maps & Weather */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Maps & Weather</h4>
            {renderApiKeyInput('GOOGLE_MAPS_API_KEY', 'Google Maps API Key')}
            {renderApiKeyInput('MAPBOX_ACCESS_TOKEN', 'Mapbox Access Token')}
            {renderApiKeyInput('HERE_API_KEY', 'HERE API Key')}
            {renderApiKeyInput('ACCUWEATHER_API_KEY', 'AccuWeather API Key')}
            {renderApiKeyInput('OPENWEATHERMAP_API_KEY', 'OpenWeatherMap API Key')}
          </div>

          {/* Social & Media */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Social & Media</h4>
            {renderApiKeyInput('YELP_API_KEY', 'Yelp API Key')}
            {renderApiKeyInput('FOURSQUARE_API_KEY', 'Foursquare API Key')}
            {renderApiKeyInput('REDDIT_CLIENT_ID', 'Reddit Client ID')}
            {renderApiKeyInput('REDDIT_CLIENT_SECRET', 'Reddit Client Secret')}
            {renderApiKeyInput('TWITTER_BEARER_TOKEN', 'Twitter Bearer Token')}
            {renderApiKeyInput('FACEBOOK_APP_ID', 'Facebook App ID')}
            {renderApiKeyInput('FACEBOOK_APP_SECRET', 'Facebook App Secret')}
            {renderApiKeyInput('INSTAGRAM_APP_ID', 'Instagram App ID')}
            {renderApiKeyInput('INSTAGRAM_APP_SECRET', 'Instagram App Secret')}
            {renderApiKeyInput('YOUTUBE_DATA_API_KEY', 'YouTube Data API Key')}
            {renderApiKeyInput('SPOTIFY_CLIENT_ID', 'Spotify Client ID')}
            {renderApiKeyInput('SPOTIFY_CLIENT_SECRET', 'Spotify Client Secret')}
            {renderApiKeyInput('SOUNDCLOUD_CLIENT_ID', 'SoundCloud Client ID')}
            {renderApiKeyInput('TWITCH_CLIENT_ID', 'Twitch Client ID')}
            {renderApiKeyInput('TWITCH_CLIENT_SECRET', 'Twitch Client Secret')}
          </div>
          
          {/* Media & Content */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Media & Content</h4>
            {renderApiKeyInput('MUX_TOKEN_ID', 'Mux Token ID')}
            {renderApiKeyInput('MUX_TOKEN_SECRET', 'Mux Token Secret')}
            {renderApiKeyInput('CLOUDINARY_API_KEY', 'Cloudinary API Key')}
            {renderApiKeyInput('CLOUDINARY_API_SECRET', 'Cloudinary API Secret')}
            {renderApiKeyInput('IMGIX_API_KEY', 'Imgix API Key')}
          </div>

          {/* Legal & Admin */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Legal & Admin</h4>
            {renderApiKeyInput('STRIPE_ATLAS_API_KEY', 'Stripe Atlas API Key')}
            {renderApiKeyInput('CLERKY_API_KEY', 'Clerky API Key')}
            {renderApiKeyInput('DOCUSIGN_INTEGRATOR_KEY', 'DocuSign Integrator Key')}
            {renderApiKeyInput('HELLOSIGN_API_KEY', 'HelloSign API Key')}
          </div>

          {/* Monitoring & CI/CD */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Monitoring & CI/CD</h4>
            {renderApiKeyInput('LAUNCHDARKLY_SDK_KEY', 'LaunchDarkly SDK Key')}
            {renderApiKeyInput('SENTRY_AUTH_TOKEN', 'Sentry Auth Token')}
            {renderApiKeyInput('DATADOG_API_KEY', 'Datadog API Key')}
            {renderApiKeyInput('NEW_RELIC_API_KEY', 'New Relic API Key')}
            {renderApiKeyInput('CIRCLECI_API_TOKEN', 'CircleCI API Token')}
            {renderApiKeyInput('TRAVIS_CI_API_TOKEN', 'Travis CI API Token')}
            {renderApiKeyInput('BITBUCKET_USERNAME', 'Bitbucket Username')}
            {renderApiKeyInput('BITBUCKET_APP_PASSWORD', 'Bitbucket App Password')}
            {renderApiKeyInput('GITLAB_PERSONAL_ACCESS_TOKEN', 'GitLab PAT')}
            {renderApiKeyInput('PAGERDUTY_API_KEY', 'PagerDuty API Key')}
          </div>
          
          {/* Headless CMS */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-cyan-300">Headless CMS</h4>
            {renderApiKeyInput('CONTENTFUL_SPACE_ID', 'Contentful Space ID')}
            {renderApiKeyInput('CONTENTFUL_ACCESS_TOKEN', 'Contentful Access Token')}
            {renderApiKeyInput('SANITY_PROJECT_ID', 'Sanity Project ID')}
            {renderApiKeyInput('SANITY_API_TOKEN', 'Sanity API Token')}
            {renderApiKeyInput('STRAPI_API_TOKEN', 'Strapi API Token')}
          </div>

          {/* === BANKING & FINANCE APIS SECTION === */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 mt-4 border-l-4 border-orange-500 pl-3">Banking & Finance APIs</h3>
          </div>

          {/* Data Aggregators */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Data Aggregators</h4>
            {renderApiKeyInput('PLAID_CLIENT_ID', 'Plaid Client ID')}
            {renderApiKeyInput('PLAID_SECRET', 'Plaid Secret')}
            {renderApiKeyInput('YODLEE_CLIENT_ID', 'Yodlee Client ID')}
            {renderApiKeyInput('YODLEE_SECRET', 'Yodlee Secret')}
            {renderApiKeyInput('MX_CLIENT_ID', 'MX Client ID')}
            {renderApiKeyInput('MX_API_KEY', 'MX API Key')}
            {renderApiKeyInput('FINICITY_PARTNER_ID', 'Finicity Partner ID')}
            {renderApiKeyInput('FINICITY_APP_KEY', 'Finicity App Key')}
          </div>

          {/* Payment Processing */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Payment Processing</h4>
            {renderApiKeyInput('ADYEN_API_KEY', 'Adyen API Key')}
            {renderApiKeyInput('ADYEN_MERCHANT_ACCOUNT', 'Adyen Merchant Account')}
            {renderApiKeyInput('BRAINTREE_MERCHANT_ID', 'Braintree Merchant ID')}
            {renderApiKeyInput('BRAINTREE_PUBLIC_KEY', 'Braintree Public Key')}
            {renderApiKeyInput('BRAINTREE_PRIVATE_KEY', 'Braintree Private Key')}
            {renderApiKeyInput('SQUARE_APPLICATION_ID', 'Square Application ID')}
            {renderApiKeyInput('SQUARE_ACCESS_TOKEN', 'Square Access Token')}
            {renderApiKeyInput('PAYPAL_CLIENT_ID', 'PayPal Client ID')}
            {renderApiKeyInput('PAYPAL_SECRET', 'PayPal Secret')}
            {renderApiKeyInput('DWOLLA_KEY', 'Dwolla Key')}
            {renderApiKeyInput('DWOLLA_SECRET', 'Dwolla Secret')}
            {renderApiKeyInput('WORLDPAY_API_KEY', 'Worldpay API Key')}
            {renderApiKeyInput('CHECKOUT_SECRET_KEY', 'Checkout.com Secret Key')}
          </div>
          
          {/* BaaS & Card Issuing */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">BaaS & Card Issuing</h4>
            {renderApiKeyInput('MARQETA_APPLICATION_TOKEN', 'Marqeta Application Token')}
            {renderApiKeyInput('MARQETA_ADMIN_ACCESS_TOKEN', 'Marqeta Admin Access Token')}
            {renderApiKeyInput('GALILEO_API_LOGIN', 'Galileo API Login')}
            {renderApiKeyInput('GALILEO_API_TRANS_KEY', 'Galileo Trans Key')}
            {renderApiKeyInput('SOLARISBANK_CLIENT_ID', 'SolarisBank Client ID')}
            {renderApiKeyInput('SOLARISBANK_CLIENT_SECRET', 'SolarisBank Client Secret')}
            {renderApiKeyInput('SYNAPSE_CLIENT_ID', 'Synapse Client ID')}
            {renderApiKeyInput('SYNAPSE_CLIENT_SECRET', 'Synapse Client Secret')}
            {renderApiKeyInput('RAILSBANK_API_KEY', 'Railsbank API Key')}
            {renderApiKeyInput('CLEARBANK_API_KEY', 'ClearBank API Key')}
            {renderApiKeyInput('UNIT_API_TOKEN', 'Unit API Token')}
            {renderApiKeyInput('TREASURY_PRIME_API_KEY', 'Treasury Prime API Key')}
            {renderApiKeyInput('INCREASE_API_KEY', 'Increase API Key')}
            {renderApiKeyInput('MERCURY_API_KEY', 'Mercury API Key')}
            {renderApiKeyInput('BREX_API_KEY', 'Brex API Key')}
            {renderApiKeyInput('BOND_API_KEY', 'Bond API Key')}
          </div>

          {/* International Payments */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">International Payments</h4>
            {renderApiKeyInput('CURRENCYCLOUD_LOGIN_ID', 'CurrencyCloud Login ID')}
            {renderApiKeyInput('CURRENCYCLOUD_API_KEY', 'CurrencyCloud API Key')}
            {renderApiKeyInput('OFX_API_KEY', 'OFX API Key')}
            {renderApiKeyInput('WISE_API_TOKEN', 'Wise API Token')}
            {renderApiKeyInput('REMITLY_API_KEY', 'Remitly API Key')}
            {renderApiKeyInput('AZIMO_API_KEY', 'Azimo API Key')}
            {renderApiKeyInput('NIUM_API_KEY', 'Nium API Key')}
          </div>

          {/* Investment & Market Data */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Investment & Market Data</h4>
            {renderApiKeyInput('ALPACA_API_KEY_ID', 'Alpaca API Key ID')}
            {renderApiKeyInput('ALPACA_SECRET_KEY', 'Alpaca Secret Key')}
            {renderApiKeyInput('TRADIER_ACCESS_TOKEN', 'Tradier Access Token')}
            {renderApiKeyInput('IEX_CLOUD_API_TOKEN', 'IEX Cloud API Token')}
            {renderApiKeyInput('POLYGON_API_KEY', 'Polygon.io API Key')}
            {renderApiKeyInput('FINNHUB_API_KEY', 'Finnhub API Key')}
            {renderApiKeyInput('ALPHA_VANTAGE_API_KEY', 'Alpha Vantage API Key')}
            {renderApiKeyInput('MORNINGSTAR_API_KEY', 'Morningstar API Key')}
            {renderApiKeyInput('XIGNITE_API_TOKEN', 'Xignite API Token')}
            {renderApiKeyInput('DRIVEWEALTH_API_KEY', 'Drivewealth API Key')}
          </div>

          {/* Crypto */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Crypto</h4>
            {renderApiKeyInput('COINBASE_API_KEY', 'Coinbase API Key')}
            {renderApiKeyInput('COINBASE_API_SECRET', 'Coinbase API Secret')}
            {renderApiKeyInput('BINANCE_API_KEY', 'Binance API Key')}
            {renderApiKeyInput('BINANCE_API_SECRET', 'Binance API Secret')}
            {renderApiKeyInput('KRAKEN_API_KEY', 'Kraken API Key')}
            {renderApiKeyInput('KRAKEN_PRIVATE_KEY', 'Kraken Private Key')}
            {renderApiKeyInput('GEMINI_API_KEY', 'Gemini API Key')}
            {renderApiKeyInput('GEMINI_API_SECRET', 'Gemini API Secret')}
            {renderApiKeyInput('COINMARKETCAP_API_KEY', 'CoinMarketCap API Key')}
            {renderApiKeyInput('COINGECKO_API_KEY', 'CoinGecko API Key')}
            {renderApiKeyInput('BLOCKIO_API_KEY', 'Block.io API Key')}
          </div>

          {/* Major Banks (Open Banking) */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Major Banks (Open Banking)</h4>
            {renderApiKeyInput('JP_MORGAN_CHASE_CLIENT_ID', 'JP Morgan Chase Client ID')}
            {renderApiKeyInput('CITI_CLIENT_ID', 'Citi Client ID')}
            {renderApiKeyInput('WELLS_FARGO_CLIENT_ID', 'Wells Fargo Client ID')}
            {renderApiKeyInput('CAPITAL_ONE_CLIENT_ID', 'Capital One Client ID')}
          </div>

          {/* European & Global Banks (Open Banking) */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">European & Global Banks</h4>
            {renderApiKeyInput('HSBC_CLIENT_ID', 'HSBC Client ID')}
            {renderApiKeyInput('BARCLAYS_CLIENT_ID', 'Barclays Client ID')}
            {renderApiKeyInput('BBVA_CLIENT_ID', 'BBVA Client ID')}
            {renderApiKeyInput('DEUTSCHE_BANK_API_KEY', 'Deutsche Bank API Key')}
          </div>

          {/* UK & European Aggregators */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">UK & European Aggregators</h4>
            {renderApiKeyInput('TINK_CLIENT_ID', 'Tink Client ID')}
            {renderApiKeyInput('TRUELAYER_CLIENT_ID', 'TrueLayer Client ID')}
          </div>

          {/* Compliance & Identity (KYC/AML) */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Compliance & Identity (KYC/AML)</h4>
            {renderApiKeyInput('MIDDESK_API_KEY', 'Midddesk API Key')}
            {renderApiKeyInput('ALLOY_API_TOKEN', 'Alloy API Token')}
            {renderApiKeyInput('ALLOY_API_SECRET', 'Alloy API Secret')}
            {renderApiKeyInput('COMPLYADVANTAGE_API_KEY', 'ComplyAdvantage API Key')}
          </div>

          {/* Real Estate */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Real Estate</h4>
            {renderApiKeyInput('ZILLOW_API_KEY', 'Zillow API Key')}
            {renderApiKeyInput('CORELOGIC_CLIENT_ID', 'CoreLogic Client ID')}
          </div>

          {/* Credit Bureaus */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Credit Bureaus</h4>
            {renderApiKeyInput('EXPERIAN_API_KEY', 'Experian API Key')}
            {renderApiKeyInput('EQUIFAX_API_KEY', 'Equifax API Key')}
            {renderApiKeyInput('TRANSUNION_API_KEY', 'TransUnion API Key')}
          </div>

          {/* Global Payments (Emerging Markets) */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Global Payments (Emerging Markets)</h4>
            {renderApiKeyInput('FINCRA_API_KEY', 'Fincra API Key')}
            {renderApiKeyInput('FLUTTERWAVE_SECRET_KEY', 'Flutterwave Secret Key')}
            {renderApiKeyInput('PAYSTACK_SECRET_KEY', 'Paystack Secret Key')}
            {renderApiKeyInput('DLOCAL_API_KEY', 'DLocal API Key')}
            {renderApiKeyInput('RAPYD_ACCESS_KEY', 'Rapyd Access Key')}
          </div>
          
          {/* Accounting & Tax */}
          <div className="md:col-span-2 space-y-4 border-b border-gray-700 pb-4 mb-4">
            <h4 className="text-xl font-semibold text-orange-300">Accounting & Tax</h4>
            {renderApiKeyInput('TAXJAR_API_KEY', 'TaxJar API Key')}
            {renderApiKeyInput('AVALARA_API_KEY', 'Avalara API Key')}
            {renderApiKeyInput('CODAT_API_KEY', 'Codat API Key')}
            {renderApiKeyInput('XERO_CLIENT_ID', 'Xero Client ID')}
            {renderApiKeyInput('XERO_CLIENT_SECRET', 'Xero Client Secret')}
            {renderApiKeyInput('QUICKBOOKS_CLIENT_ID', 'QuickBooks Client ID')}
            {renderApiKeyInput('QUICKBOOKS_CLIENT_SECRET', 'QuickBooks Client Secret')}
            {renderApiKeyInput('FRESHBOOKS_API_KEY', 'FreshBooks API Key')}
          </div>
          
          {/* Fintech Utilities */}
          <div className="md:col-span-2 space-y-4 pb-4">
            <h4 className="text-xl font-semibold text-orange-300">Fintech Utilities</h4>
            {renderApiKeyInput('ANVIL_API_KEY', 'Anvil API Key')}
            {renderApiKeyInput('MOOV_CLIENT_ID', 'Moov Client ID')}
            {renderApiKeyInput('MOOV_SECRET', 'Moov Secret')}
            {renderApiKeyInput('VGS_USERNAME', 'VGS Username')}
            {renderApiKeyInput('VGS_PASSWORD', 'VGS Password')}
            {renderApiKeyInput('SILA_APP_HANDLE', 'Sila App Handle')}
            {renderApiKeyInput('SILA_PRIVATE_KEY', 'Sila Private Key')}
          </div>

        </div>
        
        <div className="form-footer pt-6 border-t border-gray-700">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save All Keys to Server'}
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
      </Card>
    </form>
  );


  // --- Helper Components for Expansion (Kept for context) ---

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
  
  const SystemToggleItem: React.FC<{ label: string, description: string, enabled: boolean }> = ({ label, description, enabled }) => (
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
              System Configuration Interface
            </h1>
            <span className="px-3 py-1 rounded-full bg-cyan-900/50 border border-cyan-500/30 text-cyan-400 text-sm font-mono shadow-md">
              SYSTEM_STATUS_NORMAL
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
          <TabButton id="api_keys" label="API Keys" icon={Key} />
        </div>

        {/* Content Area */}
        <div className="pt-6">
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'ai_governance' && renderAIGovernance()}
          {activeTab === 'api_keys' && renderApiKeysSettings()}
        </div>

        {/* Footer Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-cyan-700/50 p-2 text-center text-xs text-gray-500 shadow-2xl shadow-cyan-900/50">
            System Status: <CheckCircle size={12} className="inline text-green-400 mr-1"/> All systems operational. Last update: {new Date().toLocaleTimeString()}.
        </div>
      </div>
    </div>
  );
};

export default SettingsView;