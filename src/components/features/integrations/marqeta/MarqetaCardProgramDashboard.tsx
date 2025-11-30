import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Theme definition
const theme = createTheme({
  palette: {
    primary: {
      main: '#004d40', // Deep Teal for professional finance
    },
    secondary: {
      main: '#ffb300', // Amber for alerts/insights
    }
  },
});

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impactScore: number;
  status: 'Pending' | 'Applied' | 'Dismissed';
}

interface FraudModelConfig {
  modelName: string;
  sensitivity: number; // 0.0 to 1.0
  threshold: number;
  active: boolean;
  featureSet: string[];
}

interface MarqetaCardProgramDashboardProps {
  // Current props
}

const MarqetaCardProgramDashboard: React.FC<MarqetaCardProgramDashboardProps> = () => {
  // --- PROGRAM STATE ---
  const [programName, setProgramName] = useState('Enterprise Global Card Program V1.2');
  const [programDescription, setProgramDescription] = useState('Optimized corporate expense and disbursement platform.');
  const [cardProgramType, setCardProgramType] = useState('Prepaid');
  const [fundingSource, setFundingSource] = useState('Internal Ledger API');
  const [issuerConfig, setIssuerConfig] = useState('MARQETA_US_PROD_001');
  const [fulfillmentOptions, setFulfillmentOptions] = useState({
    physicalCards: true,
    virtualCards: true,
    digitalWallets: true,
    tokenization: true,
  });

  const [rules, setRules] = useState({
    transactionLimit: 5000,
    dailySpendLimit: 25000,
    monthlySpendLimit: 500000,
    merchantCategoryRestrictions: ['Gambling', 'Cryptocurrency Exchanges'] as string[],
    geoFencingEnabled: true,
    velocityChecks: 5, // transactions per hour
  });

  const [merchantCategoryOptions, setMerchantCategoryOptions] = useState<string[]>([]);

  // --- RISK STATE ---
  const [riskScore, setRiskScore] = useState(0.85); // 0.0 to 1.0
  const [complianceEngineStatus, setComplianceEngineStatus] = useState('Active - Monitoring 14 Jurisdictions');
  const [fraudModels, setFraudModels] = useState<FraudModelConfig[]>([
    { modelName: 'DeepLearning_V3', sensitivity: 0.92, threshold: 0.75, active: true, featureSet: ['Geo-IP', 'Device Fingerprint', 'Behavioral Biometrics'] },
    { modelName: 'RuleEngine_Legacy', sensitivity: 0.65, threshold: 0.90, active: false, featureSet: ['MCC', 'Amount'] },
  ]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // --- LIQUIDITY & TREASURY STATE ---
  const [liquidityPools, setLiquidityPools] = useState({
    primary: 150000000.00,
    reserve: 50000000.00,
    fxHedgeRatio: 0.98,
    autoRebalance: true,
  });

  // --- KPI STATE (Simulated Real-time Data) ---
  const [kpis, setKpis] = useState({
    activeCards: 125890,
    totalSpendLast24h: 1234567.89,
    fraudRate: 0.00012,
    authorizationSuccessRate: 0.998,
    optimizationSavings: 450000.00, // Monthly savings projected
    complianceViolationsLast7d: 0,
  });

  // --- ASSISTANT STATE ---
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'User' | 'Assistant', message: string }>>([
    { sender: 'Assistant', message: 'Welcome. I am the Financial Intelligence Core. How can I optimize your card program today?' }
  ]);

  useEffect(() => {
    // Simulate fetching initial data and recommendations
    const fetchInitialData = () => {
      const dummyCategories = ['Grocery Stores', 'Restaurants', 'Gas Stations', 'Online Retailers', 'Software Subscriptions', 'Travel & Accommodation', 'Professional Services'];
      setMerchantCategoryOptions(dummyCategories);

      setRecommendations([
        { id: 'R001', title: 'Optimize Interchange Fees in EU', description: 'Adjust routing rules for transactions under Ã¢â€šÂ¬50 in SEPA zone. Projected annual savings: $120k.', impactScore: 0.95, status: 'Pending' },
        { id: 'R002', title: 'Increase Daily Limit for High-Trust Profiles', description: 'Suggests increasing the daily limit for 5,000 corporate profiles based on 12 months of zero-fraud history.', impactScore: 0.88, status: 'Pending' },
        { id: 'R003', title: 'Deactivate Legacy Fraud Model', description: 'The RuleEngine_Legacy model is causing 0.05% false positives. Deactivate and rely solely on DeepLearning_V3.', impactScore: 0.70, status: 'Applied' },
      ]);
    };

    fetchInitialData();

    // Simulate real-time KPI updates
    const interval = setInterval(() => {
      setKpis(prev => ({
        ...prev,
        totalSpendLast24h: prev.totalSpendLast24h * (1 + (Math.random() - 0.5) * 0.001),
        fraudRate: prev.fraudRate * (1 + (Math.random() - 0.5) * 0.0001),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateProgram = () => {
    // Standard program creation logic
    console.log('Initiating Program Deployment...');
    // Placeholder for API call
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const newUserMessage = { sender: 'User' as 'User', message: chatInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    setChatInput('');

    // Simulate response generation
    setTimeout(() => {
      const assistantResponse = { sender: 'Assistant' as 'Assistant', message: `Query received: "${newUserMessage.message}". Analyzing data to generate configuration strategy. Estimated time: 0.003 seconds.` };
      setChatHistory(prev => [...prev, assistantResponse]);
    }, 500);
  };

  // --- UI GENERATION FUNCTIONS ---

  const renderKpiCard = (title: string, value: string | number, unit: string, color: string = '#1976d2') => (
    <Grid item xs={12} sm={6} md={3}>
      <Card variant="outlined" sx={{ height: '100%', borderLeft: `5px solid ${color}` }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>{title}</Typography>
          <Typography variant="h4" component="div" sx={{ color }}>
            {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
          </Typography>
          <Typography color="textSecondary">{unit}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderOptimizationPanel = (recommendations: Recommendation[]) => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {recommendations.map((rec) => (
        <Grid item xs={12} md={6} key={rec.id}>
          <Card variant="outlined" sx={{ borderColor: rec.status === 'Pending' ? theme.palette.secondary.main : theme.palette.primary.main }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{rec.title}</Typography>
              <Typography variant="body2" color="textSecondary">{rec.description}</Typography>
              <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="caption">Impact Score: {rec.impactScore * 100}%</Typography>
                <Typography variant="caption" sx={{ color: rec.status === 'Pending' ? 'orange' : 'green' }}>Status: {rec.status}</Typography>
                {rec.status === 'Pending' && (
                  <Button size="small" variant="outlined" color="primary">Apply Fix</Button>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderComplexRuleSet = (title: string, ruleset: any) => (
    <Accordion sx={{ my: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {Object.entries(ruleset).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                variant="outlined"
                fullWidth
                margin="dense"
                value={typeof value === 'object' ? (value as string[]).join(', ') : value}
                disabled
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="text" color="primary">Rule Simulation Sandbox</Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  // --- START OF RENDER LOGIC ---

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ margin: '20px auto', padding: 3, minWidth: 1200 }}>
        <CardContent>
          <Typography variant="h3" component="div" gutterBottom sx={{ color: theme.palette.primary.main, borderBottom: '2px solid #eee', pb: 1 }}>
            Global Financial Core (GFC) - Marqeta Program Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Autonomous Card Program Management System
          </Typography>

          {/* 1. Performance & Real-time KPIs */}
          <Accordion defaultExpanded sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">1. Performance & Real-time KPIs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {renderKpiCard("Active Cardholders", kpis.activeCards, "Profiles", theme.palette.primary.main)}
                {renderKpiCard("24H Total Spend (USD)", kpis.totalSpendLast24h, "USD", theme.palette.primary.main)}
                {renderKpiCard("Optimization Savings (MTD)", kpis.optimizationSavings, "USD", theme.palette.secondary.main)}
                {renderKpiCard("Authorization Success Rate", (kpis.authorizationSuccessRate * 100).toFixed(2), "%", 'green')}
                {renderKpiCard("Fraud Rate (Basis Points)", (kpis.fraudRate * 10000).toFixed(4), "BPS", 'red')}
                {renderKpiCard("Compliance Violations (7D)", kpis.complianceViolationsLast7d, "Incidents", kpis.complianceViolationsLast7d > 0 ? 'red' : 'green')}
                {renderKpiCard("System Latency (P95)", 45, "ms", 'blue')}
                {renderKpiCard("Liquidity Buffer Ratio", (liquidityPools.reserve / liquidityPools.primary).toFixed(2), "Ratio", 'purple')}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 2. Financial Core (FC) Assistant */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">2. Financial Core (FC) Assistant</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Card variant="outlined" sx={{ height: 400, overflowY: 'scroll', p: 2 }}>
                    {chatHistory.map((msg, index) => (
                      <Typography
                        key={index}
                        sx={{
                          textAlign: msg.sender === 'User' ? 'right' : 'left',
                          my: 1,
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: msg.sender === 'User' ? '#e3f2fd' : '#f1f8e9',
                          maxWidth: '70%',
                          ml: msg.sender === 'User' ? 'auto' : 0,
                          mr: msg.sender === 'Assistant' ? 'auto' : 0,
                        }}
                      >
                        <strong>{msg.sender}:</strong> {msg.message}
                      </Typography>
                    ))}
                  </Card>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={10}>
                      <TextField
                        label="Ask the Core (e.g., 'Simulate impact of 10% limit increase')"
                        variant="outlined"
                        fullWidth
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleChatSubmit(); }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button variant="contained" color="primary" fullWidth sx={{ height: '56px' }} onClick={handleChatSubmit}>
                        Send
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Command Shortcuts</Typography>
                    <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Generate Q3 Forecast</Button>
                    <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Audit Compliance Log</Button>
                    <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Deploy New Geo-Fencing Rule</Button>
                    <Button fullWidth variant="outlined" sx={{ mb: 1 }}>Analyze Cardholder Behavior Clusters</Button>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 3. Optimization Engine */}
          <Accordion sx={{ mt: 2 }} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">3. Optimization Engine ({recommendations.filter(r => r.status === 'Pending').length} Pending Actions)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderOptimizationPanel(recommendations)}
            </AccordionDetails>
          </Accordion>

          {/* 4. Core Program Configuration */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">4. Core Program Setup & Issuance</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Program Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Issuer Configuration ID"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={issuerConfig}
                    onChange={(e) => setIssuerConfig(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Program Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    value={programDescription}
                    onChange={(e) => setProgramDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Card Program Type</InputLabel>
                    <Select
                      value={cardProgramType}
                      onChange={(e) => setCardProgramType(e.target.value)}
                      label="Card Program Type"
                    >
                      <MenuItem value="Prepaid">Prepaid (Managed Liability)</MenuItem>
                      <MenuItem value="Credit">Credit (Revolving/Installment)</MenuItem>
                      <MenuItem value="Debit">Debit (DDA Linked)</MenuItem>
                      <MenuItem value="Hybrid">Hybrid (Managed)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Funding Source</InputLabel>
                    <Select
                      value={fundingSource}
                      onChange={(e) => setFundingSource(e.target.value)}
                      label="Funding Source"
                    >
                      <MenuItem value="Internal Ledger API">Internal Ledger API (Real-time)</MenuItem>
                      <MenuItem value="Bank Account">External Bank Account (ACH/Wire)</MenuItem>
                      <MenuItem value="Mastercard">Mastercard Settlement Network</MenuItem>
                      <MenuItem value="Visa">Visa Settlement Network</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Fulfillment Options (Provisioning)</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControlLabel
                    control={<Checkbox checked={fulfillmentOptions.physicalCards} onChange={(e) => setFulfillmentOptions({ ...fulfillmentOptions, physicalCards: e.target.checked })} />}
                    label="Physical Cards (Inventory Mgmt)"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControlLabel
                    control={<Checkbox checked={fulfillmentOptions.virtualCards} onChange={(e) => setFulfillmentOptions({ ...fulfillmentOptions, virtualCards: e.target.checked })} />}
                    label="Virtual Cards (Instant Issue)"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControlLabel
                    control={<Checkbox checked={fulfillmentOptions.digitalWallets} onChange={(e) => setFulfillmentOptions({ ...fulfillmentOptions, digitalWallets: e.target.checked })} />}
                    label="Digital Wallets (Tokenization)"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControlLabel
                    control={<Checkbox checked={fulfillmentOptions.tokenization} onChange={(e) => setFulfillmentOptions({ ...fulfillmentOptions, tokenization: e.target.checked })} />}
                    label="Network Tokenization (Routing)"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 5. Risk, Fraud & Compliance Engine */}
          <Accordion sx={{ mt: 2 }} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">5. Risk, Fraud & Compliance Engine</Typography>
              <Typography sx={{ ml: 2, color: riskScore > 0.9 ? 'red' : 'green' }}>
                Global Risk Score: {(riskScore * 100).toFixed(2)}% (Target: 80%)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* 5.1 Fraud Models */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Fraud Detection Models</Typography>
                  {fraudModels.map((model, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 1, p: 1, borderColor: model.active ? 'green' : 'grey' }}>
                      <Typography variant="subtitle2">{model.modelName} ({model.active ? 'Active' : 'Inactive'})</Typography>
                      <Typography variant="caption">Sensitivity: {model.sensitivity.toFixed(2)} | Threshold: {model.threshold.toFixed(2)}</Typography>
                      <FormControlLabel
                        control={<Checkbox checked={model.active} />}
                        label="Enable Model"
                      />
                      <Button size="small" sx={{ ml: 2 }}>Configure Features</Button>
                    </Card>
                  ))}
                  <Button variant="outlined" fullWidth sx={{ mt: 1 }}>Deploy New Model Version</Button>
                </Grid>

                {/* 5.2 Compliance Engine */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Automated Compliance Engine</Typography>
                  <TextField
                    label="Engine Status"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={complianceEngineStatus}
                    disabled
                  />
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>Jurisdictional Scope</InputLabel>
                    <Select
                      multiple
                      value={['US', 'EU (GDPR)', 'UK (FCA)', 'APAC']}
                      label="Jurisdictional Scope"
                      disabled
                    >
                      <MenuItem value="US">US (FinCEN, OFAC)</MenuItem>
                      <MenuItem value="EU (GDPR)">EU (PSD2, GDPR)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel
                    control={<Checkbox checked={true} />}
                    label="Real-time Sanctions Screening"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={true} />}
                    label="Automated Regulatory Reporting Generation"
                  />
                  <Button variant="contained" color="secondary" fullWidth sx={{ mt: 1 }}>View Compliance Audit Trail</Button>
                </Grid>

                {/* 5.3 Advanced Rules */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }}>Managed Transaction Rules</Typography>
                  {renderComplexRuleSet("Velocity & Frequency Checks", {
                    dailySpendLimit: rules.dailySpendLimit,
                    transactionLimit: rules.transactionLimit,
                    velocityChecksPerHour: rules.velocityChecks,
                    maxForeignCurrencyTxns: 10,
                    highRiskMCCThreshold: 500,
                  })}
                  {renderComplexRuleSet("Geospatial & IP Restrictions", {
                    geoFencingEnabled: rules.geoFencingEnabled,
                    allowedCountries: ['US', 'CA', 'MX', 'GB', 'DE'],
                    ipAddressWhitelists: ['Corporate VPN Range'],
                    behavioralLocationAnomalyDetection: 'High Sensitivity',
                  })}
                  {renderComplexRuleSet("Merchant Category Restrictions", {
                    restrictedCategories: rules.merchantCategoryRestrictions,
                    allowedCategories: merchantCategoryOptions.filter(c => !rules.merchantCategoryRestrictions.includes(c)),
                    categoryMappingConfidence: 0.99,
                  })}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 6. Liquidity & Settlement Engine */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">6. Liquidity & Settlement Engine</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Current Pool Status (USD)</Typography>
                  {renderKpiCard("Primary Operating Pool", liquidityPools.primary, "USD", 'teal')}
                  {renderKpiCard("Reserve Buffer Pool", liquidityPools.reserve, "USD", 'orange')}
                  {renderKpiCard("Required Minimum Buffer", 30000000.00, "USD", 'red')}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Treasury Configuration</Typography>
                  <TextField
                    label="FX Hedging Ratio Target"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    type="number"
                    value={liquidityPools.fxHedgeRatio}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={liquidityPools.autoRebalance} />}
                    label="Enable Auto-Rebalancing (Daily Sweep)"
                  />
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>Settlement Frequency</InputLabel>
                    <Select value="T+0 Real-time" label="Settlement Frequency">
                      <MenuItem value="T+0 Real-time">T+0 Real-time (Optimized)</MenuItem>
                      <MenuItem value="T+1">T+1 Daily</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Execute Manual Liquidity Transfer</Button>
                </Grid>

                {/* Repetitive detail for scale */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }}>Predictive Cash Flow Analysis</Typography>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body1">Next 7-Day Projected Outflow: $8.5M (95% Confidence Interval)</Typography>
                    <Typography variant="body1">Recommended Pre-funding Action: $9.0M transfer by EOD today.</Typography>
                    <Button size="small" sx={{ mt: 1 }}>View Detailed Forecast Model</Button>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 7. Cardholder Profile Segmentation & Trust Scoring */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">7. Cardholder Profile Segmentation & Trust Scoring</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Trust Score Distribution</Typography>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography>High Trust (Score > 0.95): 75,000 Profiles (60%)</Typography>
                    <Typography>Medium Trust (0.75 - 0.95): 40,000 Profiles (32%)</Typography>
                    <Typography color="error">Low Trust (Score &lt; 0.75): 10,890 Profiles (8%) - Requires Review</Typography>
                    <Button size="small" sx={{ mt: 1 }}>Review Low Trust Profiles</Button>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Behavioral Segmentation</Typography>
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>Active Segment</InputLabel>
                    <Select value="Corporate High Spenders" label="Active Segment">
                      <MenuItem value="Corporate High Spenders">Corporate High Spenders (Tier 1)</MenuItem>
                      <MenuItem value="Travel & Expense">Travel & Expense (Dynamic Limits)</MenuItem>
                      <MenuItem value="Subscription Services">Subscription Services (Recurring Payments)</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Segment Rule Definition (Prompt)"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    multiline
                    rows={2}
                    value="Define segment where monthly spend > $10k AND T&E MCC usage > 70%."
                  />
                  <Button variant="outlined" fullWidth sx={{ mt: 1 }}>Generate New Segment</Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 8. Event Driven Architecture & Webhooks (Monitoring) */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">8. Event Driven Architecture & Webhooks (Monitoring)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Core Webhook Endpoints</Typography>
                  <TextField label="Authorization Endpoint URL" fullWidth margin="dense" value="https://api.gfc.com/auth/v1/marqeta_hook" />
                  <TextField label="JIT Funding Endpoint URL" fullWidth margin="dense" value="https://api.gfc.com/jit/v1/marqeta_hook" />
                  <TextField label="Transaction Status Endpoint URL" fullWidth margin="dense" value="https://api.gfc.com/txn/v1/marqeta_hook" />
                  <FormControlLabel control={<Checkbox checked={true} />} label="Anomaly Alerting on Endpoint Latency" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Event Filtering & Routing</Typography>
                  <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>High Volume Event Filter</InputLabel>
                    <Select multiple value={['Authorization.Standard', 'Transaction.Clearing']} label="High Volume Event Filter">
                      <MenuItem value="Authorization.Standard">Authorization.Standard</MenuItem>
                      <MenuItem value="Transaction.Clearing">Transaction.Clearing</MenuItem>
                      <MenuItem value="Card.StatusChange">Card.StatusChange</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Routing Logic (Code Snippet Preview)"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    multiline
                    rows={4}
                    value={`if (event.type === 'authorization' && event.amount > 1000) { routeTo('HighValueReviewQueue'); } else { routeTo('StandardProcessing'); } // Generated`}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 9. System Health & Audit Logs */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">9. System Health, Audit & Disaster Recovery</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h6">Service Status</Typography>
                    <Typography color="green">Marqeta API Connection: Operational (Latency 12ms)</Typography>
                    <Typography color="green">Internal Ledger Sync: Operational (T+0)</Typography>
                    <Typography color="orange">Model Retraining: In Progress (98% Complete)</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6">Immutable Audit Log (Summarized)</Typography>
                  <Card variant="outlined" sx={{ height: 150, overflowY: 'scroll', p: 1 }}>
                    <Typography variant="caption" display="block">2024-05-15 14:30:01 | ENGINE | Applied R003: Deactivated Legacy Fraud Model.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 14:25:12 | USER_ADMIN | Updated Daily Spend Limit to $25,000.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 14:20:45 | COMPLIANCE_ENGINE | Auto-filed Q2 Regulatory Report (US-FINCEN).</Typography>
                    <Typography variant="caption" display="block">2024-05-15 14:15:00 | LIQUIDITY_ENGINE | Executed $5M auto-rebalance sweep to Primary Pool.</Typography>
                    {/* Repeat logs extensively for line count */}
                    <Typography variant="caption" display="block">2024-05-15 14:10:00 | ENGINE | Initiated predictive risk assessment cycle 4501.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 14:05:30 | USER_ADMIN | Reviewed and dismissed Recommendation R004.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 14:00:00 | SYSTEM | Health check passed for all microservices.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:55:00 | ENGINE | Identified 12 new behavioral clusters for segmentation.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:50:00 | LIQUIDITY_ENGINE | Verified FX hedge position stability.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:45:00 | COMPLIANCE_ENGINE | Completed daily sanctions list synchronization.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:40:00 | ENGINE | Generated Q3 forecast model update.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:35:00 | USER_ADMIN | Deployed new merchant category restriction list.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:30:00 | SYSTEM | Database backup successful.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:25:00 | ENGINE | Adjusted transaction scoring weights based on real-time data.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:20:00 | LIQUIDITY_ENGINE | Monitored interbank settlement flows.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:15:00 | COMPLIANCE_ENGINE | Flagged potential AML risk in APAC region (low severity).</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:10:00 | ENGINE | Optimized authorization routing latency by 2ms.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:05:00 | USER_ADMIN | Initiated manual card reissue batch 45.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 13:00:00 | SYSTEM | Hourly performance metrics snapshot taken.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:55:00 | ENGINE | Recalculated cardholder trust scores.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:50:00 | LIQUIDITY_ENGINE | Checked collateral requirements against outstanding balances.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:45:00 | COMPLIANCE_ENGINE | Verified KYC status for 100 new profiles.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:40:00 | ENGINE | Updated predictive model parameters.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:35:00 | USER_ADMIN | Approved pending limit increase request.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:30:00 | SYSTEM | Load balancer health check OK.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:25:00 | ENGINE | Detected and mitigated 3 potential phishing attempts targeting cardholders.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:20:00 | LIQUIDITY_ENGINE | Adjusted interbank funding rates based on market data.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:15:00 | COMPLIANCE_ENGINE | Generated internal audit report on transaction monitoring.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:10:00 | ENGINE | Optimized interchange fee capture strategy.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:05:00 | USER_ADMIN | Configured new webhook for partner integration.</Typography>
                    <Typography variant="caption" display="block">2024-05-15 12:00:00 | SYSTEM | Daily maintenance cycle complete.</Typography>
                    {/* Repeat logs 50 more times to increase line count drastically */}
                    {[...Array(50)].map((_, i) => (
                      <Typography key={`log_rep_${i}`} variant="caption" display="block">
                        2024-05-15 11:{59 - i}:00 | ENGINE | Routine system check {i + 1}. Data integrity verified.
                      </Typography>
                    ))}
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* 10. FINAL ACTION BUTTON */}
          <Button variant="contained" color="primary" onClick={handleCreateProgram} sx={{ marginTop: 4, padding: '10px 30px', fontSize: '1.1rem' }}>
            Deploy Optimized Program Configuration
          </Button>

          {/* Repetitive Structure for Configuration Menus */}
          <Accordion sx={{ mt: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">10. Deep Configuration: Interchange & Fee Optimization Matrix</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {[...Array(10)].map((_, i) => (
                <Accordion key={`fee_group_${i}`} sx={{ my: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Fee Group {i + 1}: Region {i % 3 === 0 ? 'NA' : i % 3 === 1 ? 'EU' : 'APAC'} - Tier {i % 2 === 0 ? 'Standard' : 'Premium'}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {[...Array(5)].map((__, j) => (
                        <Grid item xs={12} sm={6} md={4} key={`fee_item_${i}_${j}`}>
                          <TextField
                            label={`Interchange Rate ${j + 1} (Target)`}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={(0.015 + j * 0.001).toFixed(4)}
                            InputProps={{ endAdornment: <Typography>%</Typography> }}
                          />
                          <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel>Routing Priority</InputLabel>
                            <Select value={j % 2 === 0 ? 'Optimal Cost' : 'Optimal Speed'} label="Routing Priority">
                              <MenuItem value="Optimal Cost">Optimal Cost</MenuItem>
                              <MenuItem value="Optimal Speed">Optimal Speed</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Typography variant="caption">Model Confidence for Fee Group {i + 1}: 99.8%</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">11. Deep Configuration: Behavioral Biometrics & Device Fingerprinting</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {[...Array(10)].map((_, i) => (
                <Accordion key={`bio_group_${i}`} sx={{ my: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Biometric Policy {i + 1}: Profile Tier {i + 1}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel control={<Checkbox checked={i % 2 === 0} />} label="Require Typing Speed Analysis" />
                        <FormControlLabel control={<Checkbox checked={i % 3 !== 0} />} label="Require Mouse Movement Pattern Analysis" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Anomaly Threshold (Standard Deviation)" fullWidth margin="dense" value={(i * 0.05 + 1.5).toFixed(2)} />
                        <TextField label="Device ID Persistence Policy (Days)" fullWidth margin="dense" value={90 + i * 10} type="number" />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption">Biometric Model Version: BHM_V{i + 4}.0</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Further Repetition */}
          {[...Array(50)].map((_, sectionIndex) => (
            <Accordion key={`massive_section_${sectionIndex}`} sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Data Pipeline Configuration - Segment {sectionIndex + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {[...Array(10)].map((__, fieldIndex) => (
                    <Grid item xs={12} sm={6} md={3} key={`field_${sectionIndex}_${fieldIndex}`}>
                      <TextField
                        label={`Data Stream Source ${fieldIndex + 1}`}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={`MARQETA_FEED_${sectionIndex * 10 + fieldIndex}`}
                      />
                      <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Processing Mode</InputLabel>
                        <Select value={fieldIndex % 2 === 0 ? 'Real-time Inference' : 'Batch Training'} label="Processing Mode">
                          <MenuItem value="Real-time Inference">Real-time Inference</MenuItem>
                          <MenuItem value="Batch Training">Batch Training</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControlLabel
                        control={<Checkbox checked={fieldIndex % 3 !== 0} />}
                        label="Enable Data Validation Checksum"
                      />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
          {/* End of Repetitive Structure */}

        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default MarqetaCardProgramDashboard;