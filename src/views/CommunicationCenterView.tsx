import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Sms as SmsIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  History as HistoryIcon,
  VpnKey as VpnKeyIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { FaSlack, FaDiscord } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// --- MOCK DATA & TYPES ---

interface ApiCredentials {
  twilioSid: string;
  twilioToken: string;
  sendgridKey: string;
  slackToken: string;
  discordToken: string;
}

interface CommunicationLog {
  id: string;
  type: 'SMS' | 'Email' | 'Slack' | 'Discord';
  recipient: string;
  content: string;
  timestamp: string;
  status: 'Sent' | 'Failed' | 'Delivered';
}

interface CampaignMetric {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
}

// Mock analytics data
const analyticsData = [
  { name: 'Day 1', sent: 4000, delivered: 3800 },
  { name: 'Day 2', sent: 3000, delivered: 2850 },
  { name: 'Day 3', sent: 2000, delivered: 1900 },
  { name: 'Day 4', sent: 2780, delivered: 2600 },
  { name: 'Day 5', sent: 1890, delivered: 1800 },
  { name: 'Day 6', sent: 2390, delivered: 2250 },
  { name: 'Day 7', sent: 3490, delivered: 3300 },
];

// --- MOCK CRYPTOGRAPHY & API SERVICES ---

/**
 * Placeholder for advanced post-quantum cryptography.
 * In a real application, this would be a WASM module or a call to a secure backend service.
 */
const mockCrypto = {
  kyberDilithiumEncrypt: async (payload: object, publicKey: string): Promise<string> => {
    console.log('Encrypting with Kyber/Dilithium (simulation)...', { payload, publicKey });
    // This is a mock. Real encryption is a complex binary operation.
    return `encrypted_pqc_${btoa(JSON.stringify(payload))}`;
  },
  homomorphicEncrypt: async (data: number): Promise<string> => {
    console.log('Performing homomorphic encryption (simulation)...', { data });
    // Simulate encrypting a number.
    return `encrypted_he_${data}`;
  },
};

/**
 * Mock API service to simulate backend interactions.
 */
const apiService = {
  sendSms: async (to: string, from: string, body: string, encrypted: boolean, creds: Partial<ApiCredentials>) => {
    console.log('SIMULATING SMS SEND:', { to, from, body, encrypted, creds });
    await new Promise(res => setTimeout(res, 1000));
    if (!to || !body || !creds.twilioSid) throw new Error('Missing recipient, body, or Twilio SID.');
    return { sid: `SM${Math.random().toString(36).substring(2)}`, status: 'Sent' };
  },
  sendEmail: async (to: string, from: string, subject: string, html: string, encrypted: boolean, creds: Partial<ApiCredentials>) => {
    console.log('SIMULATING EMAIL SEND:', { to, from, subject, html, encrypted, creds });
    await new Promise(res => setTimeout(res, 1200));
    if (!to || !subject || !creds.sendgridKey) throw new Error('Missing recipient, subject, or SendGrid Key.');
    return { messageId: `<${Math.random().toString(36).substring(2)}@example.com>`, status: 'Sent' };
  },
  postToSlack: async (channel: string, text: string, encrypted: boolean, creds: Partial<ApiCredentials>) => {
    console.log('SIMULATING SLACK POST:', { channel, text, encrypted, creds });
    await new Promise(res => setTimeout(res, 800));
    if (!channel || !text || !creds.slackToken) throw new Error('Missing channel, text, or Slack Token.');
    return { ok: true, ts: new Date().getTime() / 1000, status: 'Sent' };
  },
  postToDiscord: async (channelId: string, content: string, encrypted: boolean, creds: Partial<ApiCredentials>) => {
    console.log('SIMULATING DISCORD POST:', { channelId, content, encrypted, creds });
    await new Promise(res => setTimeout(res, 900));
    if (!channelId || !content || !creds.discordToken) throw new Error('Missing channel ID, content, or Discord Token.');
    return { id: Math.random().toString(36).substring(2), status: 'Sent' };
  },
  fetchLogs: async (): Promise<CommunicationLog[]> => {
    await new Promise(res => setTimeout(res, 1500));
    return [
      { id: '1', type: 'Email', recipient: 'ceo@example.com', content: 'Q4 Financial Report...', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'Delivered' },
      { id: '2', type: 'SMS', recipient: '+15551234567', content: 'Server alert: High CPU usage on db-01.', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'Delivered' },
      { id: '3', type: 'Slack', recipient: '#engineering', content: 'New PR ready for review: feat/new-api-integration', timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'Sent' },
      { id: '4', type: 'Discord', recipient: '#announcements', content: 'Product Hunt launch is scheduled for tomorrow!', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'Sent' },
      { id: '5', type: 'Email', recipient: 'marketing@example.com', content: 'Weekly newsletter draft', timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'Failed' },
    ];
  },
};

// --- SUB-COMPONENTS ---

const ApiConfigPanel: React.FC<{
  apiKeys: ApiCredentials;
  onKeyChange: (keys: ApiCredentials) => void;
}> = ({ apiKeys, onKeyChange }) => {
  const [localKeys, setLocalKeys] = useState(apiKeys);

  useEffect(() => {
    setLocalKeys(apiKeys);
  }, [apiKeys]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalKeys({ ...localKeys, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // In a real app, this would be an API call to a secure vault.
    console.log("Saving API keys (simulation)...");
    onKeyChange(localKeys);
    alert("API keys saved to local state. In a real app, this would be securely stored on the backend.");
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <VpnKeyIcon sx={{ mr: 1 }} /> API Authentication
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Twilio Account SID" name="twilioSid" value={localKeys.twilioSid} onChange={handleChange} type="password" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Twilio Auth Token" name="twilioToken" value={localKeys.twilioToken} onChange={handleChange} type="password" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="SendGrid API Key" name="sendgridKey" value={localKeys.sendgridKey} onChange={handleChange} type="password" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Slack Bot Token" name="slackToken" value={localKeys.slackToken} onChange={handleChange} type="password" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Discord Bot Token" name="discordToken" value={localKeys.discordToken} onChange={handleChange} type="password" />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSave} startIcon={<SecurityIcon />}>
          Save Credentials
        </Button>
      </Box>
    </Paper>
  );
};

const Composer: React.FC<{
  type: 'SMS' | 'Email' | 'Slack' | 'Discord';
  onSend: (payload: any) => Promise<void>;
  loading: boolean;
}> = ({ type, onSend, loading }) => {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [usePQC, setUsePQC] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let payload: any = {};
    switch (type) {
      case 'SMS': payload = { to, from, body }; break;
      case 'Email': payload = { to, from, subject, html: body }; break;
      case 'Slack': payload = { channel: to, text: body }; break;
      case 'Discord': payload = { channelId: to, content: body }; break;
    }
    
    if (usePQC) {
        const encryptedPayload = await mockCrypto.kyberDilithiumEncrypt(payload, "mock_public_key");
        await onSend({ encryptedPayload, usePQC: true });
    } else {
        await onSend({ ...payload, usePQC: false });
    }

    // Reset form
    setTo(''); setFrom(''); setSubject(''); setBody('');
  };

  const getRecipientLabel = () => {
    switch (type) {
      case 'SMS': return 'Recipient Phone Number';
      case 'Email': return 'Recipient Email';
      case 'Slack': return 'Slack Channel (e.g., #general)';
      case 'Discord': return 'Discord Channel ID';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Compose {type}</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label={getRecipientLabel()} value={to} onChange={e => setTo(e.target.value)} required />
          </Grid>
          {(type === 'SMS' || type === 'Email') && (
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label={type === 'SMS' ? 'From (Twilio Number)' : 'From Email'} value={from} onChange={e => setFrom(e.target.value)} required />
            </Grid>
          )}
          {type === 'Email' && (
            <Grid item xs={12}>
              <TextField fullWidth label="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField fullWidth label="Message Body" multiline rows={5} value={body} onChange={e => setBody(e.target.value)} required />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title="Uses a simulation of Kyber/Dilithium post-quantum encryption for the message payload. This would typically be handled by a secure backend.">
              <FormControlLabel
                control={<Switch checked={usePQC} onChange={e => setUsePQC(e.target.checked)} />}
                label="Use Point-to-Point PQC Encryption"
              />
            </Tooltip>
            <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : `Send ${type}`}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

// --- MAIN VIEW COMPONENT ---

export default function CommunicationCenterView() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiKeys, setApiKeys] = useState<ApiCredentials>({
    twilioSid: '',
    twilioToken: '',
    sendgridKey: '',
    slackToken: '',
    discordToken: '',
  });
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const fetchedLogs = await apiService.fetchLogs();
        setLogs(fetchedLogs);
      } catch (err) {
        setError('Failed to fetch communication logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSend = useCallback(async (type: 'SMS' | 'Email' | 'Slack' | 'Discord', payload: any) => {
    setSendLoading(true);
    setError(null);
    try {
      let result;
      switch (type) {
        case 'SMS':
          result = await apiService.sendSms(payload.to, payload.from, payload.body, payload.usePQC, apiKeys);
          break;
        case 'Email':
          result = await apiService.sendEmail(payload.to, payload.from, payload.subject, payload.html, payload.usePQC, apiKeys);
          break;
        case 'Slack':
          result = await apiService.postToSlack(payload.channel, payload.text, payload.usePQC, apiKeys);
          break;
        case 'Discord':
          result = await apiService.postToDiscord(payload.channelId, payload.content, payload.usePQC, apiKeys);
          break;
      }
      // Add to logs
      const newLog: CommunicationLog = {
        id: Math.random().toString(),
        type,
        recipient: payload.to || payload.channel || payload.channelId,
        content: payload.body || payload.html || payload.text || payload.content,
        timestamp: new Date().toISOString(),
        status: result.status,
      };
      setLogs(prev => [newLog, ...prev]);
    } catch (err: any) {
      setError(err.message || `Failed to send ${type}.`);
    } finally {
      setSendLoading(false);
    }
  }, [apiKeys]);

  const renderIcon = (type: CommunicationLog['type']) => {
    switch (type) {
      case 'SMS': return <SmsIcon />;
      case 'Email': return <EmailIcon />;
      case 'Slack': return <FaSlack size={20} />;
      case 'Discord': return <FaDiscord size={20} />;
      default: return <PublicIcon />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Dashboard
        return (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <BarChartIcon sx={{ mr: 1 }} /> Communication Analytics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="delivered" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <HistoryIcon sx={{ mr: 1 }} /> Recent Activity
                </Typography>
                {loading ? <CircularProgress /> : (
                  <List>
                    {logs.slice(0, 5).map(log => (
                      <ListItem key={log.id}>
                        <ListItemIcon><Avatar>{renderIcon(log.type)}</Avatar></ListItemIcon>
                        <ListItemText 
                          primary={`${log.type} to ${log.recipient}`} 
                          secondary={log.content.substring(0, 50) + '...'} 
                        />
                        <Chip label={log.status} color={log.status === 'Delivered' || log.status === 'Sent' ? 'success' : 'error'} size="small" />
                        <Typography variant="caption" sx={{ ml: 2 }}>{new Date(log.timestamp).toLocaleString()}</Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        );
      case 1: // SMS
        return <Composer type="SMS" onSend={(p) => handleSend('SMS', p)} loading={sendLoading} />;
      case 2: // Email
        return <Composer type="Email" onSend={(p) => handleSend('Email', p)} loading={sendLoading} />;
      case 3: // Slack
        return <Composer type="Slack" onSend={(p) => handleSend('Slack', p)} loading={sendLoading} />;
      case 4: // Discord
        return <Composer type="Discord" onSend={(p) => handleSend('Discord', p)} loading={sendLoading} />;
      case 5: // Settings
        return <ApiConfigPanel apiKeys={apiKeys} onKeyChange={setApiKeys} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Unified Communication Center
          </Typography>
          <Tooltip title="This hub integrates multiple communication APIs. Configure your credentials in the Settings tab and use the composer tabs to send messages. The dashboard provides an overview of all activities.">
            <IconButton>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Integrate Twilio, SendGrid, Slack, and Discord for a seamless communication workflow with advanced security options.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="communication channels" variant="scrollable" scrollButtons="auto">
            <Tab label="Dashboard" icon={<BarChartIcon />} iconPosition="start" />
            <Tab label="SMS (Twilio)" icon={<SmsIcon />} iconPosition="start" />
            <Tab label="Email (SendGrid)" icon={<EmailIcon />} iconPosition="start" />
            <Tab label="Slack" icon={<FaSlack />} iconPosition="start" />
            <Tab label="Discord" icon={<FaDiscord />} iconPosition="start" />
            <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {renderTabContent()}
        </Box>
      </Paper>
    </Container>
  );
}