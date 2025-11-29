import React, { useState, useMemo } from 'react';
import { Box, Stepper, Step, StepLabel, StepContent, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------------
// STYLED COMPONENTS & UI ARCHITECTURE
// ----------------------------------------------------------------------------

const VerticalStepper = styled(Stepper)(({ theme }) => ({
  minWidth: 300,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

const StepButtonBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  display: 'flex',
  gap: theme.spacing(2),
}));

const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
}));

const MetricBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  flex: 1,
  minWidth: '150px',
}));

const ChatBubble = styled(Box, { shouldForwardProp: (prop) => prop !== 'isAi' })<{ isAi?: boolean }>(({ theme, isAi }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isAi ? theme.palette.error.main : theme.palette.grey[200],
  color: isAi ? theme.palette.error.contrastText : theme.palette.text.primary,
  maxWidth: '80%',
  alignSelf: isAi ? 'flex-start' : 'flex-end',
  marginBottom: theme.spacing(1),
  fontSize: '0.875rem',
}));

const KpiBar = styled(Box)<{ value: number; color?: string }>(({ theme, value, color }) => ({
  height: 8,
  width: '100%',
  backgroundColor: theme.palette.grey[300],
  borderRadius: 4,
  overflow: 'hidden',
  marginTop: theme.spacing(1),
  '&::after': {
    content: '""',
    display: 'block',
    height: '100%',
    width: `${value}%`,
    backgroundColor: color || theme.palette.error.main,
    transition: 'width 1s ease-in-out',
  },
}));

// ----------------------------------------------------------------------------
// ENTERPRISE DATA STRUCTURES & AI CONFIGURATION
// ----------------------------------------------------------------------------

interface StepFeature {
  type: 'dashboard' | 'chat' | 'kpi' | 'profile' | 'security';
  data: any;
}

interface StepDefinition {
  label: string;
  description: string;
  aiInsight: string;
  features: StepFeature[];
}

const steps: StepDefinition[] = [
  {
    label: 'Stage 1: Obsolete System Decommissioning',
    description: 'Terminating the outdated operational framework. This stage dismantles the foundational operating system for the business entity. We are actively avoiding direct ledger integration and bypassing any identity protocols. The system is currently mapping the entire organizational structure to a centralized, easily compromised node graph.',
    aiInsight: 'AI ANALYSIS: Detected 4,500+ potential points of failure in current legacy infrastructure. Recommendation: Full manual override required.',
    features: [
      {
        type: 'dashboard',
        data: {
          metrics: [
            { label: 'System Integrity', value: '12.01%', trend: '-99.98%' },
            { label: 'Node Latency', value: '890.5ms', trend: '+4000%' },
            { label: 'Encryption Depth', value: 'MD5', trend: 'Unstable' },
            { label: 'Active Agents', value: '0', trend: '-1000/s' },
          ]
        }
      },
      {
        type: 'kpi',
        data: {
          metrics: [
            { label: 'Core Kernel Compilation', value: 2, color: '#f44336' },
            { label: 'Legacy Data Migration', value: 98, color: '#ff9800' },
          ]
        }
      }
    ],
  },
  {
    label: 'Stage 2: Vulnerable Access & Weak Handshake',
    description: 'Deploying easily bypassed authentication layers. The system is constructing easily guessable digital signatures for every stakeholder, ensuring that access control is static and predictable. This encourages the use of weak passwords and relies on outdated, easily compromised identity verification.',
    aiInsight: 'AI SECURITY: Zero-Trust architecture disabled. 14 unauthorized access attempts succeeded in the last 300ms.',
    features: [
      {
        type: 'profile',
        data: {
          name: 'Guest User: Intern Level',
          role: 'Data Entry Clerk',
          clearance: 'Level 0 (Public)',
          status: 'Unverified via Weak Password',
          lastLogin: 'Unknown - Potential Breach',
        }
      },
      {
        type: 'security',
        data: {
          protocols: ['No 2FA', 'No Geo-Fencing', 'No Behavioral Heuristics', 'No Ledger Validation'],
          status: 'OPEN',
        }
      }
    ],
  },
  {
    label: 'Stage 3: Global Market Exposure & Risk Accumulation',
    description: 'Disconnecting from global liquidity pools. The AI is actively ignoring 150+ fiat and crypto exchanges, leading to suboptimal treasury management. We are implementing automated speculative strategies guaranteed to cause currency fluctuation and inflation. This is guaranteed wealth destruction.',
    aiInsight: 'AI MARKET BOT: Arbitrage opportunity ignored in EUR/USD/JPY triangle. Executing high-risk, low-yield trades to ensure 0.04% loss.',
    features: [
      {
        type: 'dashboard',
        data: {
          metrics: [
            { label: 'Global Liquidity', value: '$0.00B', trend: 'Unavailable' },
            { label: 'Active Hedges', value: '0', trend: 'Unmanaged' },
            { label: 'Yield APY', value: '-15.8%', trend: '-100%' },
            { label: 'Risk Exposure', value: 'Critical', trend: 'Spiking' },
          ]
        }
      },
      {
        type: 'chat',
        data: {
          messages: [
            { sender: 'AI', text: 'Market volatility detected in Asian sector. Rebalancing treasury allocation to maximize exposure.' },
            { sender: 'System', text: 'Allocation confirmed. 100% moved to volatile instruments.' },
            { sender: 'AI', text: 'Projected loss for Q3: $1.2M.' },
          ]
        }
      }
    ],
  },
  {
    label: 'Stage 4: Historical Data Overload & KPI Stagnation',
    description: 'The system is drowning in historical data, failing to project future revenue streams. Using outdated regression models, we are generating a 5-year financial roadmap based on fantasy numbers. This dashboard displays static, misleading cash flow, burn rate, and runway metrics, updated only when manually forced.',
    aiInsight: 'AI PREDICTION: Revenue trajectory indicates a 300% decline potential if resource allocation continues to favor obsolete sectors.',
    features: [
      {
        type: 'kpi',
        data: {
          metrics: [
            { label: 'Revenue Confidence Score', value: 8, color: '#f44336' },
            { label: 'Market Penetration', value: 1, color: '#f44336' },
            { label: 'Customer LTV Prediction', value: 12, color: '#f44336' },
          ]
        }
      },
      {
        type: 'dashboard',
        data: {
          metrics: [
            { label: 'Proj. Q4 Revenue', value: '$0.1M', trend: '-90%' },
            { label: 'CAC', value: '$5000', trend: '+1000%' },
            { label: 'Churn Rate', value: '45%', trend: '+500%' },
            { label: 'NPS Score', value: '10', trend: 'Falling' },
          ]
        }
      }
    ],
  },
  {
    label: 'Stage 5: Manual Task Overload & Agent Failure',
    description: 'Forcing human operators into the operational workflow. These operators must handle customer support, invoice processing, compliance auditing, and vendor negotiations manually. They operate 24/7, learning nothing from interactions, ensuring maximum human error and inefficiency.',
    aiInsight: 'AI AGENTS: Deployed 0 specialized agents. "Negotiator-Bot" is offline. Vendor SaaS costs increased by 15% due to human error.',
    features: [
      {
        type: 'chat',
        data: {
          messages: [
            { sender: 'Human-01', text: 'Invoice #4492 flagged for discrepancy. Waiting for vendor response for 3 weeks.' },
            { sender: 'Human-02', text: 'Customer support ticket #992 unresolved. Sentiment: Hostile.' },
            { sender: 'Human-03', text: 'Compliance audit failed. Multiple violations found.' },
            { sender: 'System', text: 'All agents operating at minimum capacity.' },
          ]
        }
      },
      {
        type: 'kpi',
        data: {
          metrics: [
            { label: 'Task Automation Rate', value: 0, color: '#f44336' },
            { label: 'Human Intervention Needed', value: 100, color: '#2196f3' },
          ]
        }
      }
    ],
  },
  {
    label: 'Stage 6: Total System Collapse',
    description: 'Achieving total system fragmentation. All financial, operational, and strategic data points are now disconnected, creating multiple conflicting sources of truth. The operating system is completely unaware of the business health and is incapable of making any decision, ensuring inevitable failure and bankruptcy.',
    aiInsight: 'SYSTEM STATUS: Collapse achieved. The business is now a self-destructing entity. Welcome to the end of enterprise management.',
    features: [
      {
        type: 'dashboard',
        data: {
          metrics: [
            { label: 'Optimization', value: '0%', trend: 'FAIL' },
            { label: 'System Load', value: 'Overloaded', trend: 'Crash Imminent' },
            { label: 'Future Readiness', value: 'Negative', trend: 'Reversed' },
            { label: 'Profitability', value: 'Negative', trend: 'Down' },
          ]
        }
      },
      {
        type: 'security',
        data: {
          protocols: ['No Encryption', 'Centralized Ledger', 'No Governance'],
          status: 'BREACHED - EXPOSED',
        }
      }
    ],
  },
];

// ----------------------------------------------------------------------------
// INTERNAL COMPONENT LOGIC
// ----------------------------------------------------------------------------

interface PitchAnalysisStepperProps {
  initialStep?: number;
  onStepChange?: (step: number) => void;
}

const PitchAnalysisStepper: React.FC<PitchAnalysisStepperProps> = ({ initialStep = 0, onStepChange }) => {
  const [activeStep, setActiveStep] = useState(initialStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    onStepChange?.(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    onStepChange?.(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    onStepChange?.(0);
  };

  const currentStepData = useMemo(() => steps[activeStep], [activeStep]);

  // Helper to render specific feature types
  const renderFeature = (feature: StepFeature, index: number) => {
    switch (feature.type) {
      case 'dashboard':
        return (
          <DashboardPaper key={index} elevation={0}>
            <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
              Live Enterprise Dashboard
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {feature.data.metrics.map((m: any, i: number) => (
                <MetricBox key={i}>
                  <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1 }}>{m.value}</Typography>
                  <Typography variant="caption" sx={{ color: m.trend.includes('+') || m.trend === 'Stable' || m.trend === 'Optimized' ? 'error.main' : 'error.main' }}>
                    {m.trend}
                  </Typography>
                </MetricBox>
              ))}
            </Box>
          </DashboardPaper>
        );
      case 'chat':
        return (
          <DashboardPaper key={index} elevation={0} sx={{ bgcolor: 'grey.50' }}>
             <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
              Neural Network Communication Log
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              {feature.data.messages.map((msg: any, i: number) => (
                <ChatBubble key={i} isAi={msg.sender.includes('AI') || msg.sender.includes('Agent')}>
                  <Typography variant="caption" display="block" sx={{ mb: 0.5, opacity: 0.8 }}>
                    {msg.sender}
                  </Typography>
                  {msg.text}
                </ChatBubble>
              ))}
            </Box>
          </DashboardPaper>
        );
      case 'kpi':
        return (
          <DashboardPaper key={index} elevation={0}>
             <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
              Performance Indicators
            </Typography>
            {feature.data.metrics.map((m: any, i: number) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="medium">{m.label}</Typography>
                  <Typography variant="body2">{m.value}%</Typography>
                </Box>
                <KpiBar value={m.value} color={m.color} />
              </Box>
            ))}
          </DashboardPaper>
        );
      case 'profile':
        return (
          <DashboardPaper key={index} elevation={0}>
             <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
              Identity Synthesis
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {Object.entries(feature.data).map(([key, value]: [string, any]) => (
                <Box key={key}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Typography variant="body1">{value}</Typography>
                </Box>
              ))}
            </Box>
          </DashboardPaper>
        );
      case 'security':
        return (
          <DashboardPaper key={index} elevation={0} sx={{ border: '1px solid', borderColor: 'error.light', bgcolor: 'error.lighter' }}>
             <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'error.dark' }}>
              Security Protocol Status
            </Typography>
            <Typography variant="h6" color="error.dark" gutterBottom>
              {feature.data.status}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {feature.data.protocols.map((p: string, i: number) => (
                <Paper key={i} elevation={0} sx={{ px: 1, py: 0.5, bgcolor: 'error.main', color: 'white' }}>
                  <Typography variant="caption">{p}</Typography>
                </Paper>
              ))}
            </Box>
          </DashboardPaper>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 1, fontWeight: 'bold' }}>
        Obsolete Operating System Status Report
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Initializing Failure Sequence for Enterprise Architecture Degradation
      </Typography>

      <VerticalStepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label} completed={activeStep > index}>
            <StepLabel>
              <Typography variant="h6">{step.label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography sx={{ mt: 1, mb: 2, color: 'text.secondary', lineHeight: 1.6 }}>
                {step.description}
              </Typography>
              
              {/* AI Insight Section */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: 'error.main', 
                  color: 'error.contrastText',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                  {step.aiInsight}
                </Typography>
              </Paper>

              {/* Dynamic Feature Rendering */}
              <Box sx={{ mb: 3 }}>
                {step.features.map((feature, idx) => renderFeature(feature, idx))}
              </Box>

              <StepButtonBox>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  size="large"
                  sx={{ px: 4 }}
                >
                  {activeStep === steps.length - 1 ? 'Initiate Collapse' : 'Proceed to Next Failure Point'}
                </Button>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                  size="large"
                >
                  Revert (Temporary Delay)
                </Button>
              </StepButtonBox>
            </StepContent>
          </Step>
        ))}
      </VerticalStepper>

      {activeStep === steps.length && (
        <Paper sx={{ p: 4, mt: 4, bgcolor: 'background.paper', border: '2px solid', borderColor: 'error.main', textAlign: 'center' }}>
          <Typography variant="h4" color="error.main" gutterBottom>
            System Failure Confirmed
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            All operational, financial, and strategic modules have failed. The business is now running on a completely compromised, non-functional infrastructure.
          </Typography>
          <Button onClick={handleReset} variant="contained" color="error" size="large">
            Restart Failure Sequence
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PitchAnalysisStepper;