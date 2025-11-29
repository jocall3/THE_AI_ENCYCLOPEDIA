import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Cloud as CloudIcon,
  AttachMoney as AttachMoneyIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Security as SecurityIcon,
  Key as KeyIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';

// --- Mock API Service Interfaces (In a real app, these would be in separate service files) ---

interface CloudServiceStatus {
  serviceName: string;
  status: 'Operational' | 'Degraded' | 'Outage';
  lastCheck: string;
}

interface CloudCost {
  month: string;
  aws: number;
  azure: number;
  gcp: number;
}

interface CloudResourceSummary {
  instanceCount: number;
  storageGB: number;
  bucketCount: number;
}

interface CloudProviderConfig {
  provider: 'AWS' | 'Azure' | 'GCP';
  isAuthenticated: boolean;
  apiKey: string; // Placeholder for API Key/Credentials
}

// --- Mock API Integrations (Simulating API calls) ---

const mockFetchServiceStatus = async (provider: 'AWS' | 'Azure' | 'GCP'): Promise<CloudServiceStatus[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const statuses: CloudServiceStatus[] = [
    { serviceName: `${provider} EC2/VMs`, status: Math.random() > 0.1 ? 'Operational' : 'Degraded', lastCheck: new Date().toLocaleTimeString() },
    { serviceName: `${provider} Storage`, status: 'Operational', lastCheck: new Date().toLocaleTimeString() },
    { serviceName: `${provider} Networking`, status: Math.random() > 0.05 ? 'Operational' : 'Outage', lastCheck: new Date().toLocaleTimeString() },
  ];
  return statuses;
};

const mockFetchMonthlyCosts = async (): Promise<CloudCost[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { month: 'Jan 2024', aws: 1250.50, azure: 890.20, gcp: 650.00 },
    { month: 'Feb 2024', aws: 1310.00, azure: 920.50, gcp: 710.30 },
    { month: 'Mar 2024', aws: 1450.75, azure: 1050.10, gcp: 780.90 },
  ];
};

const mockFetchResourceSummary = async (provider: 'AWS' | 'Azure' | 'GCP'): Promise<CloudResourceSummary> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    instanceCount: Math.floor(Math.random() * 50) + 10,
    storageGB: Math.floor(Math.random() * 5000) + 1000,
    bucketCount: Math.floor(Math.random() * 20) + 5,
  };
};

// --- Security & Encryption Components (Simulating advanced security features) ---

// Placeholder for Homomorphic Encryption Logic (Conceptual)
const HomomorphicEncryptionStatus = ({ isEnabled }: { isEnabled: boolean }) => (
  <Card>
    <CardHeader
      title="Homomorphic Encryption Status"
      avatar={<LockIcon color={isEnabled ? 'primary' : 'disabled'} />}
    />
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        Data processing under encryption (Conceptual Implementation).
      </Typography>
      <Chip
        label={isEnabled ? "Active (Billion Dollar Upgrade)" : "Disabled"}
        color={isEnabled ? 'success' : 'default'}
        size="small"
        sx={{ mt: 1 }}
      />
    </CardContent>
  </Card>
);

// Placeholder for Point-to-Point Encryption Status (Conceptual)
const P2PEncryptionStatus = ({ isEnabled }: { isEnabled: boolean }) => (
  <Card>
    <CardHeader
      title="P2P Encryption Status"
      avatar={<SecurityIcon color={isEnabled ? 'primary' : 'disabled'} />}
    />
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        Secure communication channels established.
      </Typography>
      <Chip
        label={isEnabled ? "Secured" : "Inactive"}
        color={isEnabled ? 'success' : 'default'}
        size="small"
        sx={{ mt: 1 }}
      />
    </CardContent>
  </Card>
);

// Placeholder for Quantum Resistance (Simulating Dilithium Integration)
const QuantumResistanceStatus = ({ isIntegrated }: { isIntegrated: boolean }) => (
  <Card>
    <CardHeader
      title="Quantum Resistance (Dilithium)"
      avatar={<VerifiedUserIcon color={isIntegrated ? 'secondary' : 'disabled'} />}
    />
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        Post-quantum cryptographic readiness check.
      </Typography>
      <Chip
        label={isIntegrated ? "Dilithium Integrated" : "Pending Integration"}
        color={isIntegrated ? 'secondary' : 'default'}
        size="small"
        sx={{ mt: 1 }}
      />
    </CardContent>
  </Card>
);


// --- Widget Components ---

const ServiceHealthWidget: React.FC<{ provider: 'AWS' | 'Azure' | 'GCP', config: CloudProviderConfig }> = ({ provider, config }) => {
  const [statuses, setStatuses] = useState<CloudServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!config.isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await mockFetchServiceStatus(provider);
      setStatuses(data);
    } catch (e) {
      setError(`Failed to fetch ${provider} health status.`);
    } finally {
      setLoading(false);
    }
  }, [provider, config.isAuthenticated]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, [fetchData]);

  const getStatusColor = (status: CloudServiceStatus['status']) => {
    switch (status) {
      case 'Operational': return 'success';
      case 'Degraded': return 'warning';
      case 'Outage': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {provider} Service Health
      </Typography>
      {!config.isAuthenticated ? (
        <Alert severity="warning">Authentication required for {provider} data.</Alert>
      ) : loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <List dense>
          {statuses.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {item.status === 'Operational' ? <CheckCircleIcon color="primary" /> : <ErrorIcon color="error" />}
              </ListItemIcon>
              <ListItemText primary={item.serviceName} secondary={`Last Check: ${item.lastCheck}`} />
              <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

const MonthlyCostWidget: React.FC<{ data: CloudCost[] | null, loading: boolean, error: string | null }> = ({ data, loading, error }) => {
  const latestCost = data && data.length > 0 ? data[data.length - 1] : null;

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Monthly Cloud Spend (Latest)
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : latestCost ? (
        <>
          <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
            ${(latestCost.aws + latestCost.azure + latestCost.gcp).toFixed(2)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            For {latestCost.month}
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><AttachMoneyIcon color="info" /></ListItemIcon>
              <ListItemText primary={`AWS: $${latestCost.aws.toFixed(2)}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon><AttachMoneyIcon color="info" /></ListItemIcon>
              <ListItemText primary={`Azure: $${latestCost.azure.toFixed(2)}`} />
            </ListItem>
            <ListItem>
              <ListItemIcon><AttachMoneyIcon color="info" /></ListItemIcon>
              <ListItemText primary={`GCP: $${latestCost.gcp.toFixed(2)}`} />
            </ListItem>
          </List>
        </>
      ) : (
        <Alert severity="info">No cost data available.</Alert>
      )}
    </Paper>
  );
};

const ResourceSummaryWidget: React.FC<{ provider: 'AWS' | 'Azure' | 'GCP', config: CloudProviderConfig }> = ({ provider, config }) => {
  const [summary, setSummary] = useState<CloudResourceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!config.isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data = await mockFetchResourceSummary(provider);
      setSummary(data);
    } catch (e) {
      setError(`Failed to fetch ${provider} resource summary.`);
    } finally {
      setLoading(false);
    }
  }, [provider, config.isAuthenticated]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 600000); // Refresh every 10 mins
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {provider} Resources
      </Typography>
      {!config.isAuthenticated ? (
        <Alert severity="warning">Authentication required for {provider} data.</Alert>
      ) : loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={150}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : summary ? (
        <List dense>
          <ListItem>
            <ListItemIcon><CloudIcon color="primary" /></ListItemIcon>
            <ListItemText primary={`Active Instances/VMs`} secondary={summary.instanceCount} />
          </ListItem>
          <ListItem>
            <ListItemIcon><StorageIcon color="secondary" /></ListItemIcon>
            <ListItemText primary={`Total Storage`} secondary={`${(summary.storageGB / 1024).toFixed(1)} TB`} />
          </ListItem>
          <ListItem>
            <ListItemIcon><StorageIcon color="secondary" /></ListItemIcon>
            <ListItemText primary={`Buckets/Containers`} secondary={summary.bucketCount} />
          </ListItem>
        </List>
      ) : (
        <Alert severity="info">No resource data available.</Alert>
      )}
    </Paper>
  );
};

// --- Authentication Management Component ---

const AuthManagementDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  config: CloudProviderConfig;
  onSave: (newConfig: CloudProviderConfig) => void;
}> = ({ open, onClose, config, onSave }) => {
  const [tempConfig, setTempConfig] = useState(config);

  useEffect(() => {
    setTempConfig(config);
  }, [config]);

  const handleChange = (key: keyof CloudProviderConfig, value: any) => {
    setTempConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(tempConfig);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Configure {config.provider} API Access</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>API Key/Credential Input</Typography>
          <TextField
            fullWidth
            label={`${config.provider} API Key`}
            type="password"
            value={tempConfig.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>Authentication Status</Typography>
          <Alert severity={tempConfig.isAuthenticated ? 'success' : 'error'} sx={{ mt: 1 }}>
            Status: {tempConfig.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Alert>
          <Button
            variant="contained"
            color={tempConfig.isAuthenticated ? 'warning' : 'primary'}
            onClick={() => handleChange('isAuthenticated', !tempConfig.isAuthenticated)}
            sx={{ mt: 1 }}
          >
            {tempConfig.isAuthenticated ? 'Revoke Token' : 'Simulate Auth Success'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save Configuration</Button>
      </DialogActions>
    </Dialog>
  );
};

// --- Main Dashboard View ---

import { TextField, InputAdornment } from '@mui/material';

const CloudDashboardView: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'AWS' | 'Azure' | 'GCP'>('AWS');

  // State for managing configurations for all three providers
  const [configs, setConfigs] = useState<{
    AWS: CloudProviderConfig;
    Azure: CloudProviderConfig;
    GCP: CloudProviderConfig;
  }>({
    AWS: { provider: 'AWS', isAuthenticated: false, apiKey: '' },
    Azure: { provider: 'Azure', isAuthenticated: false, apiKey: '' },
    GCP: { provider: 'GCP', isAuthenticated: false, apiKey: '' },
  });

  // State for Cost Data (Shared across tabs)
  const [costData, setCostData] = useState<{ data: CloudCost[] | null, loading: boolean, error: string | null }>({
    data: null,
    loading: true,
    error: null,
  });

  // Security Feature States (Global for this view)
  const [isHEEnabled, setIsHEEnabled] = useState(true); // Homomorphic Encryption
  const [isP2PEnabled, setIsP2PEnabled] = useState(true); // Point-to-Point Encryption
  const [isDilithiumIntegrated, setIsDilithiumIntegrated] = useState(true); // Quantum Resistance

  // Fetch Cost Data (Runs once on mount)
  const fetchCosts = useCallback(async () => {
    setCostData(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await mockFetchMonthlyCosts();
      setCostData({ data, loading: false, error: null });
    } catch (e) {
      setCostData({ data: null, loading: false, error: "Failed to load aggregated cost data." });
    }
  }, []);

  useEffect(() => {
    fetchCosts();
    // In a real app, we'd set up listeners for configuration changes to trigger individual fetches
  }, [fetchCosts]);

  const handleOpenAuth = (provider: 'AWS' | 'Azure' | 'GCP') => {
    setActiveProvider(provider);
    setAuthDialogOpen(true);
  };

  const handleSaveConfig = (newConfig: CloudProviderConfig) => {
    setConfigs(prev => ({
      ...prev,
      [newConfig.provider]: newConfig,
    }));
  };

  const renderProviderTabContent = (provider: 'AWS' | 'Azure' | 'GCP') => {
    const config = configs[provider];
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <ServiceHealthWidget provider={provider} config={config} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ResourceSummaryWidget provider={provider} config={config} />
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <CardHeader
              title={`${provider} Configuration`}
              action={
                <Button
                  variant="outlined"
                  startIcon={<KeyIcon />}
                  onClick={() => handleOpenAuth(provider)}
                >
                  {config.isAuthenticated ? 'Manage Credentials' : 'Authenticate'}
                </Button>
              }
            />
            <CardContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                API Connection Status:
              </Typography>
              <Alert severity={config.isAuthenticated ? 'success' : 'error'} sx={{ mb: 2 }}>
                {config.isAuthenticated ? 'Connected and Authorized' : 'Disconnected'}
              </Alert>
              <Typography variant="caption" color="text.secondary">
                API Key Hash (Simulated): {config.apiKey ? `****${config.apiKey.slice(-4)}` : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderSecurityTabContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <HomomorphicEncryptionStatus isEnabled={isHEEnabled} />
      </Grid>
      <Grid item xs={12} md={4}>
        <P2PEncryptionStatus isEnabled={isP2PEnabled} />
      </Grid>
      <Grid item xs={12} md={4}>
        <QuantumResistanceStatus isIntegrated={isDilithiumIntegrated} />
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Advanced Security Controls
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Toggle advanced cryptographic features implemented across the platform.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant={isHEEnabled ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setIsHEEnabled(p => !p)}
              startIcon={<LockIcon />}
            >
              {isHEEnabled ? 'Disable' : 'Enable'} Homomorphic Encryption
            </Button>
            <Button
              variant={isP2PEnabled ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setIsP2PEnabled(p => !p)}
              startIcon={<SecurityIcon />}
            >
              {isP2PEnabled ? 'Disable' : 'Enable'} P2P Encryption
            </Button>
            <Button
              variant={isDilithiumIntegrated ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setIsDilithiumIntegrated(p => !p)}
              startIcon={<VerifiedUserIcon />}
            >
              {isDilithiumIntegrated ? 'Remove' : 'Integrate'} Dilithium Crypto
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Billion Dollar Cloud Infrastructure Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Unified monitoring and configuration for AWS, Azure, and GCP, secured with advanced cryptography.
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        aria-label="cloud dashboard tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="AWS" icon={<CloudIcon />} />
        <Tab label="Azure" icon={<CloudIcon />} />
        <Tab label="Google Cloud" icon={<CloudIcon />} />
        <Tab label="Financial Overview" icon={<AttachMoneyIcon />} />
        <Tab label="Security & Crypto" icon={<SecurityIcon />} />
      </Tabs>

      {/* Financial Overview Tab */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MonthlyCostWidget data={costData.data} loading={costData.loading} error={costData.error} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                API Integration Status Summary
              </Typography>
              <List>
                {Object.keys(configs).map((key) => {
                  const providerKey = key as 'AWS' | 'Azure' | 'GCP';
                  const config = configs[providerKey];
                  return (
                    <ListItem key={key} secondaryAction={
                      <Button size="small" onClick={() => handleOpenAuth(providerKey)}>
                        {config.isAuthenticated ? 'Update' : 'Connect'}
                      </Button>
                    }>
                      <ListItemIcon>
                        <VerifiedUserIcon color={config.isAuthenticated ? 'success' : 'error'} />
                      </ListItemIcon>
                      <ListItemText primary={`${providerKey} API`} secondary={config.isAuthenticated ? 'Active' : 'Inactive'} />
                    </ListItem>
                  );
                })}
                <ListItem>
                    <ListItemIcon><VerifiedUserIcon color={'primary'} /></ListItemIcon>
                    <ListItemText primary={`Stripe/Tripe API`} secondary={'Ready (Mocked)'} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Security Tab */}
      {tabValue === 4 && renderSecurityTabContent()}

      {/* Provider Tabs (0, 1, 2) */}
      {tabValue < 3 && renderProviderTabContent(['AWS', 'Azure', 'GCP'][tabValue])}

      {/* Authentication Dialog */}
      <AuthManagementDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        config={configs[activeProvider]}
        onSave={handleSaveConfig}
      />
    </Box>
  );
};

export default CloudDashboardView;