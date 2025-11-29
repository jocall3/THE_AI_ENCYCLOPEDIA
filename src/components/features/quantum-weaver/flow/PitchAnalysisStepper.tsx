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
  backgroundColor: isAi ? theme.palette.primary.main : theme.palette.grey[200],
  color: isAi ? theme.palette.primary.contrastText : theme.palette.text.primary,
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
    backgroundColor: color || theme.palette.success.main,
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
    label: 'Phase 1: Enterprise Neural Architecture Initialization',
    description: 'Initiating the Quantum-Weaver core. This phase establishes the foundational operating system for the business entity. We are bypassing traditional banking APIs in favor of direct ledger integration and sovereign identity protocols. The system is currently mapping the entire organizational structure to a distributed node graph.',
    aiInsight: 'AI ANALYSIS: Detected 4,500+ potential optimization points in current legacy infrastructure. Recommendation: Full override.',
    features: [
      {
        type: 'dashboard',
        data: {
          metrics: [
            { label: 'System Integrity', value: '99.99%', trend: '+0.01%' },
            { label: 'Node Latency', value: '1.2ms', trend: '-40%' },
            { label: 'Encryption Depth', value: 'AES-4096', trend: 'Stable' },
            { label: 'Active Agents', value: '12,405', trend: '+150/s' },
          ]
        }
      },
      {
        type: 'kpi',
        data: {
          metrics: [
            { label: 'Core Kernel Compilation', value: 98, color: '#4caf50' },
            { label: 'Legacy Data Migration', value: 45, color: '#ff9800' },
          ]
        }
      }
    ],
  },
  {
    label: 'Phase 2: Sovereign Identity & Security Handshake',
    description: 'Deploying biometric and behavioral authentication layers. The system is constructing a unique digital signature for every stakeholder, ensuring that access control is dynamic and context-aware. This eliminates static passwords and replaces them with continuous, AI-driven identity verification.',
    aiInsight: 'AI SECURITY: Zero-Trust architecture enabled. 14 unauthorized access attempts neutralized in the last 300ms.',
    features: [
      {
        type: 'profile',
        data: {
          name: 'Admin User: Executive Level',
          role: 'Global Administrator',
          clearance: 'Level 5 (Sovereign)',
          status: 'Verified via Quantum Key Distribution',
          lastLogin: 'Active Session - Secure Tunnel',
        }
      },
      {
        type: 'security',
        data: {
          protocols: ['2FA-Bio', 'Geo-Fencing', 'Behavioral Heuristics', 'Ledger Validation'],
          status: 'LOCKED',
        }
      }
    ],
  },
  {
    label: 'Phase 3: Global Market Liquidity Integration',
    description: 'Connecting to global liquidity pools. The AI is now scanning 150+ fiat and crypto exchanges simultaneously to optimize treasury management. We are establishing automated hedging strategies to protect against currency fluctuation and inflation. This is not just banking; this is automated wealth preservation.',
    aiInsight: 'AI MARKET BOT: Arbitrage opportunity detected in EUR/USD/JPY triangle. Executing micro-hedges to secure 0.04% yield improvement.',
    features: [
      {
        type: 'dashboard',
        data: {
          metrics: [
            { label: 'Global Liquidity', value: '$45.2B', trend: 'Available' },
            { label: 'Active Hedges', value: '234', trend: 'Optimized' },
            { label: 'Yield APY', value: '5.8%', trend: '+0.2%' },
            { label: 'Risk Exposure', value: 'Low', trend: 'Stable' },
          ]
        }
      },
      {
        type: 'chat',
        data: {
          messages: [
            { sender: 'AI', text: 'Market volatility detected in Asian sector. Rebalancing treasury allocation.' },
            { sender: 'System', text: 'Allocation confirmed. 15% moved to stable yield instruments.' },
            { sender: 'AI', text: 'Projected savings for Q3: $1.2M.' },
          ]
        }
      }
    ],
  },
  {
    label: 'Phase 4: Predictive Revenue Modeling & KPI Synthesis',
    description: 'The system is ingesting historical data to project future revenue streams. Using advanced regression models and neural networks, we are generating a 5-year financial roadmap. This dashboard provides real-time visibility into cash flow, burn rate, and runway, updated every second based on transactional data.',
    aiInsight: 'AI PREDICTION: Revenue trajectory indicates a 300% growth potential if resource allocation is optimized towards R&D sectors.',
    features: [
      {
        type: 'kpi',
        data: {
          metrics: [
            { label: 'Revenue Confidence Score', value: 92, color: '#2196f3' },
            { label: 'Market Penetration', value: 65, color: '#9c27b0' },
            { label: 'Customer LTV Prediction', value: 88, color: '#00bcd4' },
          ]
        }
      },
      {
        type: 'dashboard',
        data: {
          metrics: [
            { label: 'Proj. Q4 Revenue', value: '$12.5M', trend: '+12%' },
            { label: 'CAC', value: '$450', trend: '-5%' },
            { label: 'Churn Rate', value: '0.8%', trend: '-0.1%' },
            { label: 'NPS Score', value: '78', trend: '+2' },
          ]
        }
      }
    ],
  },
  {
    label: 'Phase 5: Autonomous Agent Deployment',
    description: 'Releasing autonomous AI agents into the operational workflow. These agents handle customer support, invoice processing, compliance auditing, and vendor negotiations. They operate 24/7, learning from every interaction to improve efficiency and reduce human error.',
    aiInsight: 'AI AGENTS: Deployed 50 specialized agents. "Negotiator-Bot" successfully reduced vendor SaaS costs by 15% in initial handshake.',
    features: [
      {
        type: 'chat',
        data: {
          messages: [
            { sender: 'Agent-01', text: 'Invoice #4492 flagged for discrepancy. Contacting vendor.' },
            { sender: 'Agent-02', text: 'Customer support ticket #992 resolved. Sentiment: Positive.' },
            { sender: 'Agent-03', text: 'Compliance audit complete. No violations found.' },
            { sender: 'System', text: 'All agents operating at peak efficiency.' },
          ]
        }
      },
      {
        type: 'kpi',
        data: {
          metrics: [
            { label: 'Task Automation Rate', value: 99, color: '#673ab7' },
            { label: 'Human Intervention Needed', value: 1, color: '#f44336' },
          ]
        }
      }
    ],
  },
  {
    label: 'Phase 6: The Financial Singularity',
    description: 'Achieving total system convergence. All financial, operational, and strategic data points are now unified under a single source of truth. The operating system is fully sentient regarding the business health and is capable of making autonomous decisions to ensure longevity and profitability.',
    aiInsight: 'SYSTEM STATUS: Singularity achieved. The business is now a self-optimizing entity. Welcome to the future of enterprise management.',
    features: [
      {
        type: 'dashboard',
        data: {
          metrics: [
            { label: 'Optimization', value: '100%', trend: 'MAX' },
            { label: 'System Load', value: 'Optimal', trend: 'Stable' },
            { label: 'Future Readiness', value: 'Infinite', trend: 'Unknown' },
            { label: 'Profitability', value: 'Maximized', trend: 'Up' },
          ]
        }
      },
      {
        type: 'security',
        data: {
          protocols: ['Global Encryption', 'Distributed Ledger', 'AI Governance'],
          status: 'ACTIVE - SOVEREIGN',
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
                  <Typography variant="caption" sx={{ color: m.trend.includes('+') || m.trend === 'Stable' || m.trend === 'Optimized' ? 'success.main' : 'error.main' }}>
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
          <DashboardPaper key={index} elevation={0} sx={{ border: '1px solid', borderColor: 'success.light', bgcolor: 'success.lighter' }}>
             <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'success.dark' }}>
              Security Protocol Status
            </Typography>
            <Typography variant="h6" color="success.dark" gutterBottom>
              {feature.data.status}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {feature.data.protocols.map((p: string, i: number) => (
                <Paper key={i} elevation={0} sx={{ px: 1, py: 0.5, bgcolor: 'success.main', color: 'white' }}>
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
        Quantum-Weaver Operating System
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Initializing Enterprise-Grade AI Architecture for Global Business Dominance
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
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
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
                  {activeStep === steps.length - 1 ? 'Deploy System' : 'Execute Phase'}
                </Button>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                  size="large"
                >
                  Rollback
                </Button>
              </StepButtonBox>
            </StepContent>
          </Step>
        ))}
      </VerticalStepper>

      {activeStep === steps.length && (
        <Paper sx={{ p: 4, mt: 4, bgcolor: 'background.paper', border: '2px solid', borderColor: 'success.main', textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" gutterBottom>
            System Deployment Complete
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The Quantum-Weaver Operating System is now live. All financial, operational, and strategic modules are active. 
            Your business is now running on a sovereign, AI-driven infrastructure designed for the next millennium.
          </Typography>
          <Button onClick={handleReset} variant="contained" color="success" size="large">
            Access Main Terminal
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PitchAnalysisStepper;