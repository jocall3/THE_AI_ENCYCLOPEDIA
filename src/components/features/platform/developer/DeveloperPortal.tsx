import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  CssBaseline,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  AttachMoney as TransactionsIcon,
  Send as SendMoneyIcon,
  AccountBalanceWallet as BudgetsIcon,
  Star as FinancialGoalsIcon,
  CreditCard as CreditHealthIcon,
  TrendingUp as InvestmentsIcon,
  Token as CryptoIcon,
  BarChart as AlgoTradingIcon,
  CurrencyExchange as ForexIcon,
  Store as CommoditiesIcon,
  RealEstate as RealEstateIcon,
  Art as ArtIcon,
  Percent as DerivativesIcon,
  Work as VentureCapitalIcon,
  AccountBalance as PrivateEquityIcon,
  Calculate as TaxIcon,
  Yard as LegacyBuilderIcon,
  Domain as CorporateCommandIcon,
  Payment as ModernTreasuryIcon,
  CreditCard as CardProgramsIcon,
  NetworkCheck as DataNetworkIcon,
  Payment as PaymentsIcon,
  LockOpen as SSOIcon,
  AIAssistant as AIAdvisorIcon,
  Cable as QuantumWeaverIcon,
  PeopleAlt as AgentMarketplaceIcon,
  AdUnits as AIAdStudioIcon,
  Settings as CardCustomizationIcon,
  ThumbUpAlt as FinancialDemocracyIcon,
  AccountBalance as OpenBankingIcon,
  SettingsEthernet as APIStatusIcon,
  ContactMail as ConciergeIcon,
  MonetizationOn as PhilanthropyIcon,
  AccountBalanceWalletOutlined as SovereignWealthIcon,
  Security as SecurityCenterIcon,
  Tune as PersonalizationIcon,
  Lightbulb as VisionIcon,
  AccountCircle as ProfileIcon,
  Storage as DataLakeIcon,
  Code as CodeEditorIcon,
  Cloud as CloudServicesIcon,
  Gavel as ComplianceIcon,
  GroupWork as CollaborationIcon,
  Timeline as ForecastingIcon,
  Dns as InfrastructureIcon,
  SettingsInputComponent as IntegrationIcon,
  Assignment as ProjectManagementIcon,
  Receipt as BillingIcon,
  Support as HelpdeskIcon,
  Policy as GovernanceIcon,
  Fingerprint as BiometricsIcon,
  Public as GlobalMarketIcon,
  PrecisionManufacturing as RoboticsIcon,
  Science as ResearchIcon,
  VpnKey as KeyManagementIcon,
  MonitorHeart as HealthCheckIcon,
  AutoAwesome as GenerativeAIIcon,
  Hub as EcosystemIcon,
  Layers as ArchitectureIcon,
  ModelTraining as TrainingIcon,
  GpsFixed as GeolocationIcon,
  QrCode as IdentityIcon,
  ViewInAr as MetaverseIcon,
  RocketLaunch as InnovationIcon,
  Shield as ThreatIntelligenceIcon,
  History as AuditLogIcon,
  VerifiedUser as CertificationIcon,
  SettingsSuggest as OptimizationIcon,
  AccessTime as LatencyIcon,
  Memory as QuantumComputeIcon,
  BubbleChart as NetworkGraphIcon,
  AttachFile as DocumentManagementIcon,
  Forum as CommunicationIcon,
  EmojiObjects as IdeaGenerationIcon,
  FactCheck as ValidationIcon,
  Extension as PluginsIcon,
  Api as APIKeyIcon,
  BugReport as DebuggingIcon,
  School as TrainingCenterIcon,
  Workspaces as WorkspaceIcon,
  Business as EnterpriseIcon,
  People as HRManagementIcon,
  ShoppingCart as ProcurementIcon,
  LocalShipping as LogisticsIcon,
  Campaign as MarketingIcon,
  Assessment as ReportingIcon,
  Event as SchedulingIcon,
  AssignmentTurnedIn as TaskManagementIcon,
  Gavel as LegalTechIcon,
  LocalHospital as HealthTechIcon,
  Public as GlobalTradeIcon,
  AccountTree as SupplyChainIcon,
  AutoMode as AutomationIcon,
  CloudDone as DeploymentIcon,
  Security as ZeroTrustIcon,
  Tune as ConfigurationIcon,
  AccountBalance as TreasuryIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp,
  Star,
  LockOpen,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// --- Sidebar Navigation Data (Expanded to OS level) ---
const navItems = [
  // CORE FINANCIAL SOVEREIGNTY (Tier 1)
  { name: 'AI Sovereign Dashboard', icon: DashboardIcon, path: '/dashboard' },
  { name: 'Global Transaction Ledger', icon: TransactionsIcon, path: '/transactions' },
  { name: 'AI Capital Allocation', icon: SendMoneyIcon, path: '/send-money' },
  { name: 'Predictive Budgeting Engine', icon: BudgetsIcon, path: '/budgets' },
  { name: 'Exponential Growth Goals', icon: FinancialGoalsIcon, path: '/goals' },
  { name: 'Credit & Risk Matrix', icon: CreditHealthIcon, path: '/credit' },
  
  // QUANTUM INVESTMENT & ASSET MANAGEMENT (Tier 2)
  { name: 'Quantum Investment Engine', icon: InvestmentsIcon, path: '/investments' },
  { name: 'Decentralized Asset Nexus', icon: CryptoIcon, path: '/crypto' },
  { name: 'Hyper-Frequency Algo Lab', icon: AlgoTradingIcon, path: '/algo-trading' },
  { name: 'Global Forex Arbitrage', icon: ForexIcon, path: '/forex' },
  { name: 'Strategic Commodities Desk', icon: CommoditiesIcon, path: '/commodities' },
  { name: 'Global Real Estate Registry', icon: RealEstateIcon, path: '/real-estate' },
  { name: 'Digital Art & IP Valuation', icon: ArtIcon, path: '/art' },
  { name: 'Derivatives & Hedging Matrix', icon: DerivativesIcon, path: '/derivatives' },
  { name: 'Venture Capital Synthesis', icon: VentureCapitalIcon, path: '/venture-capital' },
  { name: 'Private Equity Command', icon: PrivateEquityIcon, path: '/private-equity' },
  
  // ENTERPRISE COMMAND & CONTROL (Tier 3)
  { name: 'Corporate Command Center', icon: CorporateCommandIcon, path: '/corporate' },
  { name: 'Modern Treasury OS', icon: ModernTreasuryIcon, path: '/modern-treasury' },
  { name: 'Global Card Programs', icon: CardProgramsIcon, path: '/card-programs' },
  { name: 'Supply Chain Optimization', icon: SupplyChainIcon, path: '/supply-chain' },
  { name: 'HR & Talent Synthesis', icon: HRManagementIcon, path: '/hr-management' },
  { name: 'AI Procurement Engine', icon: ProcurementIcon, path: '/procurement' },
  { name: 'Global Logistics Network', icon: LogisticsIcon, path: '/logistics' },
  { name: 'Legal & Compliance AI', icon: LegalTechIcon, path: '/legal-compliance' },
  { name: 'Project & Task Synthesis', icon: TaskManagementIcon, path: '/task-management' },
  { name: 'Scheduling & Resource Mgmt', icon: SchedulingIcon, path: '/scheduling' },
  { name: 'Enterprise Reporting Suite', icon: ReportingIcon, path: '/reporting' },
  { name: 'Billing & Invoicing Engine', icon: BillingIcon, path: '/billing' },
  
  // AI & QUANTUM INFRASTRUCTURE (Tier 4 - Developer Focus)
  { name: 'Developer Portal', icon: CodeEditorIcon, path: '/developer' }, // Main entry point
  { name: 'Quantum Weaver AI Core', icon: QuantumWeaverIcon, path: '/quantum-weaver' },
  { name: 'AI Agent Marketplace', icon: AgentMarketplaceIcon, path: '/agent-marketplace' },
  { name: 'Generative AI Studio', icon: GenerativeAIIcon, path: '/generative-studio' },
  { name: 'Data Lake & Synthesis', icon: DataLakeIcon, path: '/data-lake' },
  { name: 'API Key Management', icon: APIKeyIcon, path: '/api-keys' },
  { name: 'Integration Hub', icon: IntegrationIcon, path: '/integration-hub' },
  { name: 'Cloud Infrastructure Mgmt', icon: CloudServicesIcon, path: '/cloud-infra' },
  { name: 'Zero Trust Architecture', icon: ZeroTrustIcon, path: '/zero-trust' },
  { name: 'System Health & Latency', icon: LatencyIcon, path: '/system-health' },
  { name: 'AI Model Training Lab', icon: TrainingIcon, path: '/model-training' },
  { name: 'Quantum Compute Access', icon: QuantumComputeIcon, path: '/quantum-compute' },
  
  // GOVERNANCE, SECURITY & VISION (Tier 5)
  { name: 'Security Command Center', icon: SecurityCenterIcon, path: '/security' },
  { name: 'Audit & Immutable Logs', icon: AuditLogIcon, path: '/audit-logs' },
  { name: 'Global Compliance Engine', icon: ComplianceIcon, path: '/compliance' },
  { name: 'Biometric Identity Nexus', icon: BiometricsIcon, path: '/identity-nexus' },
  { name: 'Tax Optimization Engine', icon: TaxIcon, path: '/tax' },
  { name: 'Legacy & Succession Builder', icon: LegacyBuilderIcon, path: '/legacy' },
  { name: 'Philanthropy & Impact', icon: PhilanthropyIcon, path: '/philanthropy' },
  { name: 'Sovereign Wealth Simulation', icon: SovereignWealthIcon, path: '/sovereign-wealth' },
  { name: 'The Architectural Vision', icon: VisionIcon, path: '/vision' },
  { name: 'Personalization Engine', icon: PersonalizationIcon, path: '/personalization' },
  { name: 'Concierge AI Support', icon: ConciergeIcon, path: '/concierge' },
];

const Sidebar = ({ currentPath }) => {
  return (
    <Paper sx={{ width: 250, p: 2, bgcolor: 'background.paper', height: 'calc(100vh - 64px)', overflowY: 'auto', borderRight: '1px solid #eee' }}>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            button
            component={Link}
            to={item.path}
            selected={currentPath === item.path || (item.name === 'Developer Portal' && currentPath === '/developer')}
            sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                        bgcolor: 'primary.dark',
                    },
                },
                '&:not(.Mui-selected)': {
                    color: 'text.primary',
                }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <item.icon color={currentPath === item.path || (item.name === 'Developer Portal' && currentPath === '/developer') ? 'inherit' : 'action'} />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

const ProfileSection = () => {
  const location = useLocation();
  const isDeveloperPage = location.pathname.startsWith('/developer');

  // Dummy profile data (simulating Sovereign Entity profile)
  const profile = {
    name: "James Burvel O'Callaghan III",
    email: 'james.o.callaghan.iii@sovereign-os.io',
    avatarUrl: 'https://i.pravatar.cc/150?img=59', // Placeholder User avatar
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: isDeveloperPage ? 'primary.dark' : 'background.default' }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar alt={profile.name} src={profile.avatarUrl} sx={{ width: 56, height: 56 }} />
        <Box flexGrow={1}>
          <Typography variant="subtitle1" color={isDeveloperPage ? 'white' : 'textPrimary'}>
            {profile.name}
          </Typography>
          <Typography variant="body2" color={isDeveloperPage ? 'lightgray' : 'textSecondary'}>
            {profile.email}
          </Typography>
        </Box>
        <Button
            variant="text"
            component={Link}
            to="/profile"
            sx={{ color: isDeveloperPage ? 'white' : 'primary.main' }}
        >
            View Profile
        </Button>
      </Box>
      <Typography variant="caption" display="block" sx={{ mt: 1, color: isDeveloperPage ? 'lightyellow' : 'text.secondary' }}>
        Status: Operational Sovereign Entity Link Established. QWC Access Level 5.
      </Typography>
    </Paper>
  );
};

// --- AI Utility Components ---

const AIStatusIndicator = ({ modelName, status, latency }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: status === 'Operational' ? '#e8f5e9' : '#ffebee', borderRadius: 1, mb: 1 }}>
        <ListItemIcon sx={{ minWidth: 30 }}>
            <AIAdvisorIcon color={status === 'Operational' ? 'success' : 'error'} />
        </ListItemIcon>
        <ListItemText 
            primary={<Typography variant="caption" fontWeight="bold">{modelName}</Typography>} 
            secondary={<Typography variant="caption">Status: {status} | Latency: {latency}ms</Typography>}
        />
    </Box>
);

const AIConfigurationPanel = ({ title, description, settings, onSettingChange }) => {
    // Simulated settings state management
    const [localSettings, setLocalSettings] = useState(settings);

    const handleChange = (key, value) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        // In a real app, this would trigger an API call
        // onSettingChange(newSettings); 
    };

    return (
        <Paper elevation={4} sx={{ p: 3, mt: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography variant="body2" color="textSecondary" paragraph>{description}</Typography>
            <List dense>
                {Object.entries(localSettings).map(([key, value]) => (
                    <ListItem key={key} divider>
                        <ListItemText 
                            primary={key.replace(/([A-Z])/g, ' $1').trim()} 
                            secondary={typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : String(value)} 
                        />
                        <Button 
                            size="small" 
                            onClick={() => handleChange(key, typeof value === 'boolean' ? !value : prompt(`Enter new value for ${key}`, value))}
                            startIcon={<SettingsIcon />}
                        >
                            {typeof value === 'boolean' ? (value ? 'Disable' : 'Enable') : 'Edit'}
                        </Button>
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} startIcon={<DeploymentIcon />}>
                Deploy Configuration Changes
            </Button>
        </Paper>
    );
};

const KPIWidget = ({ title, value, trend, icon: IconComponent, description }) => (
    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" color="textSecondary">{title}</Typography>
            <IconComponent color="primary" sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>{value}</Typography>
        <Box display="flex" alignItems="center" mt={1}>
            <TrendingUp color={trend >= 0 ? 'success' : 'error'} sx={{ mr: 0.5 }} />
            <Typography variant="body2" color={trend >= 0 ? 'success.main' : 'error.main'}>
                {trend >= 0 ? `+${trend}%` : `${trend}%`} (24h AI Forecast)
            </Typography>
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>{description}</Typography>
    </Paper>
);

// --- Feature Content Modules ---

const QuantumWeaverContent = () => {
    const [modelStatus, setModelStatus] = useState('Active');
    const [quantumLatency, setQuantumLatency] = useState(0.00001);

    const handleRecalibrate = () => {
        setModelStatus('Recalibrating...');
        setQuantumLatency(0.00005);
        setTimeout(() => {
            setModelStatus('Active');
            setQuantumLatency(0.00001);
        }, 3000);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" gutterBottom>Quantum Weaver AI Core Management</Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph>
                The nexus for managing the Sovereign AI's computational fabric. Ensure optimal entanglement and predictive integrity.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <KPIWidget 
                        title="Entanglement Integrity" 
                        value="99.9999%" 
                        trend={0.01} 
                        icon={QuantumWeaverIcon} 
                        description="Current stability metric across all parallel processing nodes."
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KPIWidget 
                        title="Predictive Horizon" 
                        value="T+100 Years" 
                        trend={-0.5} 
                        icon={ForecastingIcon} 
                        description="Maximum reliable forecasting window based on current data synthesis."
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KPIWidget 
                        title="Quantum Latency" 
                        value={`${quantumLatency} ms`} 
                        trend={quantumLatency > 0.00002 ? -10 : 5} 
                        icon={LatencyIcon} 
                        description={`Current operational delay. Status: ${modelStatus}`}
                    />
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>Core Model Calibration</Typography>
                <Typography variant="body1" paragraph>
                    Adjust the hyper-parameters of the foundational economic models (AEC-1000). Recalibration is resource-intensive.
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <AIConfigurationPanel
                            title="AEC-1000 Parameters"
                            description="Fine-tune global resource allocation algorithms."
                            settings={{
                                riskTolerance: 0.001,
                                ethicalConstraintLevel: 99.99,
                                selfCorrectionRate: 0.95,
                                quantumOptimizationEnabled: true,
                            }}
                            onSettingChange={() => {}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AIConfigurationPanel
                            title="Data Synthesis Engine (DSE)"
                            description="Configure real-time data ingestion and normalization pipelines."
                            settings={{
                                globalDataStreams: 12000,
                                realTimeValidation: true,
                                historicalDepthYears: 1000,
                                anomalyDetectionSensitivity: 0.85,
                            }}
                            onSettingChange={() => {}}
                        />
                    </Grid>
                </Grid>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    sx={{ mt: 3 }} 
                    onClick={handleRecalibrate}
                    disabled={modelStatus !== 'Active'}
                    startIcon={<OptimizationIcon />}
                >
                    {modelStatus === 'Active' ? 'Initiate Full Quantum Recalibration' : modelStatus}
                </Button>
            </Paper>
        </Container>
    );
};

const AgentCard = ({ name, description, price, rating, icon: IconComponent }) => (
    <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" mb={1}>
            <IconComponent color="action" sx={{ mr: 1 }} />
            <Typography variant="h6">{name}</Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" flexGrow={1}>{description}</Typography>
        <Divider sx={{ my: 1 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="primary.main">{price}</Typography>
            <Box display="flex" alignItems="center">
                <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">{rating}</Typography>
            </Box>
        </Box>
        <Button size="small" variant="outlined" sx={{ mt: 1 }}>Deploy Agent</Button>
    </Paper>
);

const AgentMarketplaceContent = () => {
    const agents = [
        { name: 'Hyper-Venture Scout', description: 'Identifies pre-seed opportunities with >100x potential using predictive behavioral modeling.', price: '100,000 Credits/Mo', rating: 4.9, icon: VentureCapitalIcon },
        { name: 'Global Tax Harmonizer', description: 'Optimizes multi-jurisdictional tax liabilities in real-time, ensuring 100% compliance.', price: '50,000 Credits/Mo', rating: 4.7, icon: TaxIcon },
        { name: 'Zero-Day Threat Hunter', description: 'Continuously scans the entire OS and external networks for novel security exploits.', price: '250,000 Credits/Mo', rating: 5.0, icon: ThreatIntelligenceIcon },
        { name: 'Legacy Succession Planner', description: 'Models generational wealth transfer across 500 years, minimizing entropy.', price: '1,000,000 Credits/Yr', rating: 4.5, icon: LegacyBuilderIcon },
        { name: 'Supply Chain Resilience Agent', description: 'Predicts geopolitical and climate risks impacting logistics and suggests immediate rerouting.', price: '75,000 Credits/Mo', rating: 4.8, icon: SupplyChainIcon },
        { name: 'Ethical Governance Monitor', description: 'Ensures all automated decisions adhere strictly to predefined ethical and regulatory frameworks.', price: 'Free (Core OS)', rating: 5.0, icon: GovernanceIcon },
        { name: 'Forex Arbitrage Engine', description: 'Executes micro-trades across 180 global currencies based on quantum predictive models.', price: '150,000 Credits/Mo', rating: 4.9, icon: ForexIcon },
        { name: 'Real Estate Acquisition AI', description: 'Identifies undervalued global real estate assets based on 50-year demographic shifts.', price: '300,000 Credits/Mo', rating: 4.6, icon: RealEstateIcon },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" gutterBottom>AI Agent Marketplace</Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph>
                Access specialized, pre-trained AI entities to automate complex business and financial operations.
            </Typography>

            <Grid container spacing={3}>
                {agents.map((agent, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <AgentCard {...agent} />
                    </Grid>
                ))}
            </Grid>

            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>Agent Development SDK</Typography>
                <Typography variant="body1" paragraph>
                    Use the Sovereign AI SDK (SASDK) to build and deploy your own proprietary agents directly onto the Quantum Weaver Core.
                </Typography>
                <Button variant="contained" color="primary" startIcon={<CodeEditorIcon />}>
                    Download SASDK v3.1 (Rust/Q#)
                </Button>
                <Button variant="outlined" color="primary" sx={{ ml: 2 }} startIcon={<TrainingCenterIcon />}>
                    Access Agent Training Center
                </Button>
            </Paper>
        </Container>
    );
};

const SecurityCenterContent = () => {
    const [threatLevel, setThreatLevel] = useState('Minimal');
    const [zeroTrustScore, setZeroTrustScore] = useState(98.5);

    const threatData = [
        { id: 1, type: 'DDoS Mitigation', status: 'Active', severity: 'Low', source: 'External Botnet', timestamp: '2024-07-25 14:30 UTC' },
        { id: 2, type: 'Internal Anomaly Detection', status: 'Investigating', severity: 'Medium', source: 'Agent 404 Behavior Drift', timestamp: '2024-07-25 14:45 UTC' },
        { id: 3, type: 'Quantum Key Rotation', status: 'Completed', severity: 'Informational', source: 'QWC Protocol', timestamp: '2024-07-25 15:00 UTC' },
        { id: 4, type: 'Biometric Identity Challenge', status: 'Resolved', severity: 'High', source: 'Geolocation Mismatch', timestamp: '2024-07-25 15:15 UTC' },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" gutterBottom>Security Command Center</Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph>
                Real-time threat intelligence and Zero Trust architecture management, powered by Sentinel AI.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <KPIWidget 
                        title="Current Threat Level" 
                        value={threatLevel} 
                        trend={0} 
                        icon={ThreatIntelligenceIcon} 
                        description="AI assessment of immediate systemic risk."
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KPIWidget 
                        title="Zero Trust Score" 
                        value={`${zeroTrustScore}%`} 
                        trend={0.1} 
                        icon={ZeroTrustIcon} 
                        description="Aggregate trust metric across all endpoints and identities."
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <KPIWidget 
                        title="Active Defense Protocols" 
                        value="1,452" 
                        trend={5} 
                        icon={SecurityCenterIcon} 
                        description="Number of automated defense mechanisms currently deployed."
                    />
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>Real-Time Threat Log</Typography>
                <List>
                    {threatData.map((threat) => (
                        <ListItem key={threat.id} divider>
                            <ListItemIcon>
                                {threat.severity === 'High' ? <LockOpen color="error" /> : threat.severity === 'Medium' ? <Security color="warning" /> : <Security color="success" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary={`${threat.type} - ${threat.status}`} 
                                secondary={`Severity: ${threat.severity} | Source: ${threat.source} | Time: ${threat.timestamp}`} 
                            />
                            <Button size="small" variant="outlined">View Details</Button>
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" color="error" sx={{ mt: 2 }} startIcon={<LockOpen />}>
                    Initiate Global Lockdown Protocol
                </Button>
            </Paper>

            <AIConfigurationPanel
                title="Zero Trust Policy Engine Configuration"
                description="Define granular access policies enforced by the Biometric Identity Nexus."
                settings={{
                    geoFencingEnabled: true,
                    biometricRevalidationFrequency: '5 minutes',
                    unusualActivityThreshold: 0.99,
                    quantumEncryptionLevel: 'Level 5 (Max)',
                }}
                onSettingChange={() => {}}
            />
        </Container>
    );
};

const DeveloperPortalLanding = () => {
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Sovereign OS Developer Command Center
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
                The foundational layer for building the next 1000 years of global commerce and finance. Access the Quantum Weaver Core and deploy sovereign applications.
            </Typography>

            <Grid container spacing={4}>
                {/* Section 1: Core Infrastructure Status */}
                <Grid item xs={12}>
                    <Paper elevation={4} sx={{ p: 3, bgcolor: '#e3f2fd' }}>
                        <Typography variant="h5" gutterBottom startIcon={<ArchitectureIcon />}>
                            Core Infrastructure Health
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <AIStatusIndicator modelName="Quantum Weaver (QWC)" status="Operational" latency={0.00001} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <AIStatusIndicator modelName="Global Ledger (GL-1)" status="Operational" latency={1.2} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <AIStatusIndicator modelName="Security Sentinel (SS-9)" status="Operational" latency={5.5} />
                            </Grid>
                        </Grid>
                        <Button size="small" sx={{ mt: 1 }} startIcon={<HealthCheckIcon />}>View Detailed System Metrics</Button>
                    </Paper>
                </Grid>

                {/* Section 2: Quick Access Modules */}
                <Grid item xs={12} md={6} lg={3}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom startIcon={<APIKeyIcon />}>API Key Management</Typography>
                        <Typography variant="body2">Manage and rotate your high-frequency API keys for secure, low-latency access.</Typography>
                        <Button size="small" component={Link} to="/api-keys" sx={{ mt: 1 }}>Manage Keys</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom startIcon={<CodeEditorIcon />}>Code Sandbox & Debugging</Typography>
                        <Typography variant="body2">Test code snippets and debug integrations in a fully isolated, production-mirror environment.</Typography>
                        <Button size="small" component={Link} to="/developer/sandbox" sx={{ mt: 1 }}>Launch Sandbox</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom startIcon={<DocumentManagementIcon />}>Architectural Documentation</Typography>
                        <Typography variant="body2">Access comprehensive guides on data schemas, quantum protocols, and integration patterns.</Typography>
                        <Button size="small" component={Link} to="/developer/api-docs" sx={{ mt: 1 }}>View Docs</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom startIcon={<PluginsIcon />}>Plugin & Extension Store</Typography>
                        <Typography variant="body2">Browse and deploy certified extensions to enhance core OS functionality.</Typography>
                        <Button size="small" component={Link} to="/integration-hub" sx={{ mt: 1 }}>Browse Plugins</Button>
                    </Paper>
                </Grid>

                {/* Section 3: AI Model Training & Deployment */}
                <Grid item xs={12}>
                    <Paper elevation={4} sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h5" gutterBottom startIcon={<TrainingIcon />}>
                            AI Model Deployment Pipeline
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Utilize the Sovereign AI Training Fabric (SATF) to train, validate, and deploy custom machine learning models directly into your enterprise workflow.
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon><ValidationIcon /></ListItemIcon>
                                <ListItemText primary="Validation Gate 1: Ethical Bias Check (Passed)" secondary="Ensures compliance with Global Ethical Mandate (GEM)." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><DeploymentIcon /></ListItemIcon>
                                <ListItemText primary="Deployment Status: 3 Models Awaiting Production Push" secondary="Review latency and resource allocation before deployment." />
                            </ListItem>
                        </List>
                        <Button variant="contained" color="secondary" sx={{ mt: 2 }} startIcon={<DeploymentIcon />}>
                            Review Deployment Queue
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Architectural Vision Block (Professionalized) */}
            <Paper elevation={6} sx={{ mt: 6, p: 4, bgcolor: '#0d47a1', color: 'white' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#80cbc4' }}>
                    The Architectural Imperative: Building the Sovereign OS
                </Typography>
                <Typography variant="body1" paragraph>
                    This platform represents the convergence of quantum computation, decentralized ledger technology, and sovereign AI governance. It is engineered to eliminate systemic friction, maximize global utility, and establish a flawless, self-optimizing financial and operational infrastructure for the next millennium.
                </Typography>
                <Typography variant="body1" paragraph>
                    Our mandate is driven by the principle of **Computational Integrity**. Every transaction, every decision, and every forecast is processed through the Quantum Weaver Core (QWC) to ensure absolute accuracy and ethical alignment. We are moving beyond traditional banking and enterprise resource planning into a unified, intelligent operating system.
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
                    Focus: Efficiency, Security, and Exponential Scale.
                </Typography>
                <Typography variant="body1" paragraph>
                    Developers are the architects of this future. The tools provided here grant unprecedented access to the core economic engine of the world. We encourage rigorous testing, adherence to the Sovereign AI SDK standards, and a commitment to building solutions that scale across planetary and inter-planetary economic systems.
                </Typography>
            </Paper>

        </Container>
    );
}


const DeveloperPortalContent = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Map paths to specific content components
    const ContentMap = {
        '/developer': DeveloperPortalLanding,
        '/quantum-weaver': QuantumWeaverContent,
        '/agent-marketplace': AgentMarketplaceContent,
        '/security': SecurityCenterContent,
        // Placeholder for other major OS features (to ensure comprehensive OS coverage)
        '/api-keys': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>API Key Management Console (AI Governance)</Typography><AIConfigurationPanel title="Key Rotation Policy" description="Automated quantum key rotation schedule." settings={{ rotationFrequency: '1 hour', quantumEntropySource: true }} onSettingChange={()=>{}} /></Container>,
        '/integration-hub': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Integration Hub (10,000+ Certified Connectors)</Typography><Typography variant="body1" sx={{ px: 4 }}>Manage connections to external sovereign and legacy systems.</Typography></Container>,
        '/cloud-infra': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Cloud Infrastructure & Resource Allocation (AI Optimized)</Typography><KPIWidget title="Resource Utilization" value="12.5 Petaflops" trend={-1.2} icon={InfrastructureIcon} description="Current compute usage optimized by QWC." /></Container>,
        '/zero-trust': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Zero Trust Policy Editor</Typography><Typography variant="body1" sx={{ px: 4 }}>Define micro-segmentation and least-privilege access rules.</Typography></Container>,
        '/system-health': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>System Health & Latency Monitoring</Typography><AIStatusIndicator modelName="Global Network Fabric" status="Operational" latency={0.000001} /></Container>,
        '/model-training': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>AI Model Training Lab Interface</Typography><Typography variant="body1" sx={{ px: 4 }}>Access petabytes of synthesized data for model refinement.</Typography></Container>,
        '/quantum-compute': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Quantum Compute Resource Scheduler</Typography><Typography variant="body1" sx={{ px: 4 }}>Schedule time on the dedicated quantum annealing processors.</Typography></Container>,
        '/audit-logs': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Immutable Audit Log Viewer (Blockchain Verified)</Typography><Typography variant="body1" sx={{ px: 4 }}>View tamper-proof records of all system events.</Typography></Container>,
        '/compliance': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Global Regulatory Compliance Engine</Typography><Typography variant="body1" sx={{ px: 4 }}>Real-time compliance checks against 1,000+ global jurisdictions.</Typography></Container>,
        '/identity-nexus': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Biometric Identity Nexus Configuration</Typography><Typography variant="body1" sx={{ px: 4 }}>Manage sovereign identity proofs and access controls.</Typography></Container>,
        '/vision': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>The Architectural Vision Documentation</Typography><Typography variant="body1" sx={{ px: 4 }}>Deep dive into the 1000-year roadmap.</Typography></Container>,
        '/dashboard': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>AI Sovereign Dashboard (Enterprise View)</Typography></Container>,
        '/transactions': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Global Transaction Ledger Interface</Typography></Container>,
        '/send-money': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>AI Capital Allocation Interface</Typography></Container>,
        '/budgets': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Predictive Budgeting Engine Interface</Typography></Container>,
        '/goals': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Exponential Growth Goals Tracker</Typography></Container>,
        '/credit': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Credit & Risk Matrix Console</Typography></Container>,
        '/investments': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Quantum Investment Engine Console</Typography></Container>,
        '/crypto': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Decentralized Asset Nexus Interface</Typography></Container>,
        '/algo-trading': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Hyper-Frequency Algo Lab Interface</Typography></Container>,
        '/forex': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Global Forex Arbitrage Console</Typography></Container>,
        '/commodities': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Strategic Commodities Desk Interface</Typography></Container>,
        '/real-estate': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Global Real Estate Registry Interface</Typography></Container>,
        '/art': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Digital Art & IP Valuation Console</Typography></Container>,
        '/derivatives': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Derivatives & Hedging Matrix Interface</Typography></Container>,
        '/venture-capital': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Venture Capital Synthesis Console</Typography></Container>,
        '/private-equity': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Private Equity Command Interface</Typography></Container>,
        '/corporate': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Corporate Command Center Interface</Typography></Container>,
        '/modern-treasury': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Modern Treasury OS Interface</Typography></Container>,
        '/card-programs': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Global Card Programs Management</Typography></Container>,
        '/supply-chain': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Supply Chain Optimization Console</Typography></Container>,
        '/hr-management': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>HR & Talent Synthesis Console</Typography></Container>,
        '/procurement': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>AI Procurement Engine Console</Typography></Container>,
        '/logistics': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Global Logistics Network Console</Typography></Container>,
        '/legal-compliance': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Legal & Compliance AI Console</Typography></Container>,
        '/task-management': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Project & Task Synthesis Console</Typography></Container>,
        '/scheduling': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Scheduling & Resource Management Console</Typography></Container>,
        '/reporting': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Enterprise Reporting Suite Console</Typography></Container>,
        '/billing': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Billing & Invoicing Engine Console</Typography></Container>,
        '/generative-studio': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Generative AI Studio (Content & Code Generation)</Typography></Container>,
        '/data-lake': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Data Lake & Synthesis Console</Typography></Container>,
        '/tax': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Tax Optimization Engine Console</Typography></Container>,
        '/legacy': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Legacy & Succession Builder Console</Typography></Container>,
        '/philanthropy': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Philanthropy & Impact Hub</Typography></Container>,
        '/sovereign-wealth': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Sovereign Wealth Simulation Interface</Typography></Container>,
        '/personalization': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Personalization Engine Configuration</Typography></Container>,
        '/concierge': () => <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}><Typography variant="h4" sx={{ p: 4 }}>Concierge AI Support Interface</Typography></Container>,
    };

    const CurrentContent = ContentMap[currentPath];

    if (CurrentContent) {
        return <CurrentContent />;
    }

    // Fallback for unimplemented routes or unexpected paths
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                OS Module Initialization Required
            </Typography>
            <Typography variant="body1">
                The selected module ({currentPath}) is currently initializing or requires specific access permissions.
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} component={Link} to="/developer">Return to Developer Command Center</Button>
        </Container>
    );
}


const DeveloperPortal = () => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* Sidebar - Fixed Width */}
        <Sidebar currentPath={location.pathname} />
        
        {/* Main Content Area */}
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                bgcolor: 'background.default',
                p: 0, // Padding controlled by content component
                width: { sm: `calc(100% - 250px)` },
                ml: { xs: '0', sm: '250px' }, // Offset for responsive sidebar
            }}
        >
            {/* Profile Bar (Always Visible in the Dev Portal Layout) */}
            <Paper elevation={1} sx={{ p: 2, borderBottom: '1px solid #eee', borderRadius: 0 }}>
                <ProfileSection />
            </Paper>

            {/* Content Rendering based on route */}
            <DeveloperPortalContent />
            
        </Box>
    </Box>
  );
};

export default DeveloperPortal;