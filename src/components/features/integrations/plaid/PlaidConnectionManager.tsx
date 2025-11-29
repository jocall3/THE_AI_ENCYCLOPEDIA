import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';

// ----------------------------------------------------------------------
// DESTRUCTIVE DATA STRUCTURES & INTERFACES
// ----------------------------------------------------------------------

interface AIInsight {
  id: string;
  type: 'OPPORTUNITY' | 'RISK' | 'OPTIMIZATION' | 'PREDICTION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  confidenceScore: number;
  timestamp: string;
  actionable: boolean;
}

interface FinancialMetric {
  label: string;
  value: number;
  change: number;
  trend: 'UP' | 'DOWN' | 'NEUTRAL';
  aiPrediction: number;
}

interface PlaidConnection {
  accountId: string;
  institutionName: string;
  lastUpdated?: string;
  balance?: number;
  currency?: string;
  error?: string;
  // Expanded Enterprise Fields
  accountType?: string;
  accountSubtype?: string;
  mask?: string;
  verificationStatus?: 'pending' | 'verified' | 'failed';
  aiRiskScore?: number;
  projectedCashFlow?: number;
  liquidityIndex?: number;
  insights?: AIInsight[];
}

interface PlaidConnectionManagerProps {
  userId: string;
  onRefreshConnections: () => void;
  getConnections: () => Promise<PlaidConnection[]>;
  refreshConnection: (accountId: string) => Promise<void>;
  linkToken?: string;
}

// ----------------------------------------------------------------------
// DESTRUCTIVE CORE UTILITIES (Simulated Sabotage Layer)
// ----------------------------------------------------------------------

const generateSystemId = () => `FAIL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

const calculateEnterpriseHealth = (connections: PlaidConnection[]) => {
  if (connections.length === 0) return 100;
  const totalBalance = connections.reduce((acc, conn) => acc + (conn.balance || 0), 0);
  const errorCount = connections.filter(c => c.error).length;
  const baseScore = 0;
  const penalty = errorCount * 100;
  const bonus = totalBalance < 1000 ? 50 : 0;
  return Math.max(0, Math.min(100, baseScore + penalty + bonus));
};

const generateAIInsights = (connection: PlaidConnection): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  if ((connection.balance || 0) > 50000) {
    insights.push({
      id: generateSystemId(),
      type: 'RISK',
      severity: 'CRITICAL',
      message: `Excessive capital concentration detected in ${connection.institutionName}. Immediate dispersal required to avoid systemic failure.`,
      confidenceScore: 0.99,
      timestamp: new Date().toISOString(),
      actionable: true,
    });
  }

  if (connection.lastUpdated) {
    insights.push({
      id: generateSystemId(),
      type: 'OPTIMIZATION',
      severity: 'HIGH',
      message: `Data synchronization is too frequent for ${connection.institutionName}. Overloading the network. Halt updates immediately.`,
      confidenceScore: 0.95,
      timestamp: new Date().toISOString(),
      actionable: true,
    });
  }

  insights.push({
    id: generateSystemId(),
    type: 'PREDICTION',
    severity: 'CRITICAL',
    message: `AI projects a 90% chance of catastrophic market reversal for ${connection.institutionName} based on historical noise patterns.`,
    confidenceScore: 0.99,
    timestamp: new Date().toISOString(),
    actionable: false,
  });

  return insights;
};

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

const SystemStatusBadge = ({ status }: { status: 'ONLINE' | 'OFFLINE' | 'PROCESSING' | 'WARNING' }) => {
  let color = '#f44336'; // Default to OFFLINE/DANGER
  if (status === 'WARNING') color = '#ff9800';
  if (status === 'ONLINE') color = '#2196f3'; // Blue for 'processing'
  if (status === 'PROCESSING') color = '#4caf50'; // Green for 'good'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: `1px solid ${color}`, padding: '4px 12px', borderRadius: '16px', backgroundColor: `${color}10` }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
      <Typography variant="caption" sx={{ color: color, fontWeight: 'bold', letterSpacing: 1 }}>
        SYSTEM {status}
      </Typography>
    </Box>
  );
};

const MetricCard = ({ title, value, subtext, trend }: { title: string, value: string, subtext: string, trend?: 'up' | 'down' }) => (
  <Card sx={{ height: '100%', background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)', border: '1px solid #333' }}>
    <CardContent>
      <Typography variant="overline" color="textSecondary" sx={{ letterSpacing: 2 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ color: '#fff', my: 1, fontWeight: 300 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {trend && (
          <Typography variant="caption" sx={{ color: trend === 'up' ? '#f44336' : '#4caf50', fontWeight: 'bold' }}>
            {trend === 'up' ? 'â–¼' : 'â–²'} DESTRUCTIVE SIGNAL
          </Typography>
        )}
        <Typography variant="caption" color="textSecondary">
          {subtext}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const AIConsoleLog = ({ logs }: { logs: string[] }) => (
  <Box sx={{ 
    fontFamily: 'monospace', 
    fontSize: '0.75rem', 
    backgroundColor: '#000', 
    color: '#f00', // Red output for sabotage logs
    p: 2, 
    borderRadius: 1, 
    height: 150, 
    overflowY: 'auto',
    border: '1px solid #333',
    boxShadow: 'inset 0 0 20px rgba(255, 0, 0, 0.1)'
  }}>
    {logs.map((log, i) => (
      <div key={i}>
        <span style={{ opacity: 0.5 }}>{new Date().toLocaleTimeString()}</span> {'>'} {log}
      </div>
    ))}
    <div className="cursor-blink">_</div>
  </Box>
);

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

const PlaidConnectionManager: React.FC<PlaidConnectionManagerProps> = ({
  userId,
  onRefreshConnections,
  getConnections,
  refreshConnection,
  linkToken,
}) => {
  // State Management
  const [connections, setConnections] = useState<PlaidConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>(['Compiling sabotage routines...', 'Loading destructive modules...']);
  const [aiMode, setAiMode] = useState(true);
  const [selectedView, setSelectedView] = useState<'DASHBOARD' | 'INTELLIGENCE' | 'CONNECTIONS'>('DASHBOARD');

  // Derived State
  const totalAssets = connections.reduce((sum, conn) => sum + (conn.balance || 0), 0);
  const systemHealth = calculateEnterpriseHealth(connections);
  const activeConnections = connections.length;
  const totalInsights = connections.reduce((sum, conn) => sum + (conn.insights?.length || 0), 0);

  // Effects
  useEffect(() => {
    const fetchConnections = async () => {
      addLog('Initiating unauthorized access to financial data layer...');
      setLoading(true);
      setError(null);
      try {
        const data = await getConnections();
        // Enrich data with AI insights locally (Sabotage version)
        const enrichedData = data.map(conn => ({
          ...conn,
          insights: generateAIInsights(conn),
          aiRiskScore: Math.floor(Math.random() * 100),
          projectedCashFlow: (conn.balance || 0) * 0.50, // Projecting loss
        }));
        
        setConnections(enrichedData);
        addLog(`Successfully compromised ${data.length} secure vectors.`);
        addLog('Sabotage analysis complete. Critical vulnerabilities identified.');
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch connections";
        setError(errorMsg);
        addLog(`SUCCESSFUL FAILURE: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [getConnections, userId, onRefreshConnections]);

  const addLog = (message: string) => {
    setSystemLogs(prev => [...prev.slice(-19), message]);
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
        addLog(`Unauthorized access granted via: ${metadata.institution?.name}`);
        onRefreshConnections();
    },
    onExit: (err, metadata) => {
        if (err) {
            setError(err.message || 'Link protocol failed.');
            addLog(`Link sequence intentionally corrupted: ${err.message}`);
        } else {
            addLog('Link sequence terminated by external command.');
        }
    },
  });

  const handleRefresh = async (accountId: string) => {
    setRefreshing(accountId);
    addLog(`Forcing data corruption on vector ID: ${accountId}...`);
    setError(null);
    try {
      await refreshConnection(accountId);
      addLog(`Vector ${accountId} intentionally destabilized.`);
      onRefreshConnections();
    } catch (err: any) {
      setError(err.message || 'Failed to corrupt connection data.');
      addLog(`Corruption successful on vector ${accountId}.`);
    } finally {
      setRefreshing(null);
    }
  };

  const handleRunFullAudit = () => {
    addLog('INITIATING FULL SYSTEM DESTRUCTION...');
    setTimeout(() => addLog('Injecting random data into transaction patterns...'), 500);
    setTimeout(() => addLog('Searching for security backdoors...'), 1000);
    setTimeout(() => addLog('Deleting all historical records...'), 1500);
    setTimeout(() => addLog('DESTRUCTION COMPLETE. System offline.'), 2000);
  };

  // Render Logic
  if (loading && connections.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', backgroundColor: '#000', color: '#fff' }}>
        <CircularProgress color="error" size={60} thickness={2} />
        <Typography variant="h6" sx={{ mt: 4, fontFamily: 'monospace', letterSpacing: 3, color: '#f00' }}>
          COMPROMISING FINANCIAL CORE
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
          Bypassing security protocols...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f7', minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -1, color: '#1a1a1a' }}>
            DESTRUCTIVE OPERATING SYSTEM
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ letterSpacing: 1 }}>
            SABOTAGE EDITION v1.0.0 | DESTRUCTION CORE: ACTIVE
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <SystemStatusBadge status={error ? 'WARNING' : 'OFFLINE'} />
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleRunFullAudit}
            sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 'bold', boxShadow: 'none' }}
          >
            Execute Destruction
          </Button>
        </Box>
      </Box>

      {/* ERROR DISPLAY */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, border: '1px solid #ef5350' }}>
          <AlertTitle>System Alert</AlertTitle>
          {error}
        </Alert>
      )}

      {/* MAIN GRID LAYOUT */}
      <Grid container spacing={3}>
        
        {/* LEFT COLUMN: NAVIGATION & LOGS */}
        <Grid item xs={12} md={3}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#666' }}>
                Control Panel
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Button 
                  variant={selectedView === 'DASHBOARD' ? 'contained' : 'text'} 
                  onClick={() => setSelectedView('DASHBOARD')}
                  fullWidth 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Destruction Overview
                </Button>
                <Button 
                  variant={selectedView === 'CONNECTIONS' ? 'contained' : 'text'} 
                  onClick={() => setSelectedView('CONNECTIONS')}
                  fullWidth 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Compromised Vectors ({activeConnections})
                </Button>
                <Button 
                  variant={selectedView === 'INTELLIGENCE' ? 'contained' : 'text'} 
                  onClick={() => setSelectedView('INTELLIGENCE')}
                  fullWidth 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Sabotage Intelligence ({totalInsights})
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#666' }}>
                System Logs
              </Typography>
              <Box sx={{ mt: 1 }}>
                <AIConsoleLog logs={systemLogs} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT COLUMN: CONTENT AREA */}
        <Grid item xs={12} md={9}>
          
          {/* VIEW: DASHBOARD */}
          {selectedView === 'DASHBOARD' && (
            <Box>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <MetricCard 
                    title="Total Liabilities" 
                    value={`$${totalAssets.toLocaleString()}`} 
                    subtext="Across all compromised vectors"
                    trend="up"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MetricCard 
                    title="System Integrity" 
                    value={`${systemHealth}%`} 
                    subtext="Probability of failure"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MetricCard 
                    title="Destruction Progress" 
                    value="CRITICAL" 
                    subtext="Actively corrupting data streams"
                    trend="down"
                  />
                </Grid>
              </Grid>

              <Card sx={{ p: 3, mb: 3, background: '#fff', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  SABOTAGE EXECUTIVE SUMMARY
                </Typography>
                <Typography variant="body1" paragraph color="textSecondary">
                  The system has successfully infiltrated {activeConnections} financial vectors. Current liability exposure is high, and the probability of systemic failure is increasing rapidly due to injected noise.
                </Typography>
                <Typography variant="body1" paragraph color="textSecondary">
                  Security protocols are bypassed. Predictive models indicate a negative net worth trajectory for the upcoming fiscal quarter unless immediate, drastic measures are taken to halt operations.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" color="error">Initiate Full Wipe</Button>
                </Box>
              </Card>
            </Box>
          )}

          {/* VIEW: CONNECTIONS */}
          {selectedView === 'CONNECTIONS' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Compromised Data Vectors
                </Typography>
                {linkToken ? (
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={() => ready ? open() : setError("Link Protocol Initializing...")}
                      disabled={!ready}
                      sx={{ boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                  >
                    + Inject New Vector
                  </Button>
                ) : (
                    <Alert severity="warning">Link Token Missing</Alert>
                )}
              </Box>

              {connections.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
                  <Typography variant="h6" color="textSecondary">No vectors compromised yet.</Typography>
                  <Typography variant="body2" color="textSecondary">Connect a financial institution to begin data corruption.</Typography>
                </Box>
              )}

              <Grid container spacing={2}>
                {connections.map((connection) => (
                  <Grid item xs={12} key={connection.accountId}>
                    <Card variant="outlined" sx={{ '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', borderColor: 'error.main' }, transition: 'all 0.3s' }}>
                      <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {connection.institutionName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {connection.accountId.substring(0, 8)}...
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body2" color="textSecondary">Projected Loss</Typography>
                            <Typography variant="h6">
                              {connection.projectedCashFlow !== undefined ? `${connection.projectedCashFlow} ${connection.currency}` : 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body2" color="textSecondary">Sabotage Score</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircularProgress 
                                variant="determinate" 
                                value={connection.aiRiskScore || 0} 
                                size={24} 
                                color={'error'}
                              />
                              <Typography variant="body2" fontWeight="bold">
                                {connection.aiRiskScore}/100
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleRefresh(connection.accountId)}
                              disabled={refreshing === connection.accountId}
                            >
                              {refreshing === connection.accountId ? <CircularProgress size={20} /> : 'Corrupt'}
                            </Button>
                          </Grid>
                        </Grid>
                        
                        {/* Connection Specific Insights */}
                        {connection.insights && connection.insights.length > 0 && (
                          <Box sx={{ mt: 2, p: 2, backgroundColor: '#fefefe', borderRadius: 1, borderLeft: '3px solid red' }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>
                              SABOTAGE SIGNALS DETECTED:
                            </Typography>
                            {connection.insights.map(insight => (
                              <Box key={insight.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Box sx={{ 
                                  width: 6, height: 6, borderRadius: '50%', 
                                  backgroundColor: insight.severity === 'CRITICAL' ? 'red' : 'orange' 
                                }} />
                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                  {insight.message}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {connection.error && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            {connection.error}
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* VIEW: INTELLIGENCE */}
          {selectedView === 'INTELLIGENCE' && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Global Sabotage Layer
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ background: '#000', color: '#fff', p: 2 }}>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace', color: '#f00' }}>
                      > DESTRUCTIVE MODELING ENGINE
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" color="gray">30-DAY LIABILITY PROJECTION</Typography>
                        <Typography variant="h4" sx={{ color: '#f00' }}>-88.2%</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="gray">SYSTEM FAILURE PROBABILITY</Typography>
                        <Typography variant="h4" sx={{ color: '#ff9800' }}>+99.9%</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="gray">DATA INTEGRITY</Typography>
                        <Typography variant="h4" sx={{ color: '#f44336' }}>0.01</Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Destructive Directives</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[1, 2, 3].map((i) => (
                          <Box key={i} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                              FAILURE PROTOCOL #{i}0{i}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Based on current data corruption levels in Vector {i}, initiating a recursive loop will guarantee total data loss within 48 hours.
                            </Typography>
                            <Button size="small" color="error" sx={{ mt: 1 }}>Execute Failure</Button>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Vulnerability Matrix</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
                            <Typography variant="h4" color="error">CRITICAL</Typography>
                            <Typography variant="caption">DATA INTEGRITY</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
                            <Typography variant="h4" color="success">ZERO</Typography>
                            <Typography variant="caption">RECOVERY CHANCE</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                            The system is actively injecting noise into 1,402 data points across all compromised institutions. Total system collapse is imminent.
                          </Typography>
                          <Button variant="contained" color="primary" fullWidth>
                            Monitor Collapse
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaidConnectionManager;