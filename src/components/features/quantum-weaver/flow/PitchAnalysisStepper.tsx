import React, { useState, useMemo } from 'react';
import { Box, Stepper, Step, StepLabel, StepContent, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define the steps for the Pitch Analysis Flow
const steps = [
  {
    label: 'Phase 1: Concept Definition & Market Sizing',
    description: 'Clearly articulate the core quantum concept and estimate the Total Addressable Market (TAM).',
  },
  {
    label: 'Phase 2: Quantum Advantage Validation',
    description: 'Detail the specific computational advantage and the classical bottleneck it overcomes.',
  },
  {
    label: 'Phase 3: IP & Moat Assessment',
    description: 'Analyze current intellectual property landscape and define the sustainable competitive moat.',
  },
  {
    label: 'Phase 4: Team & Advisory Structure',
    description: 'Review core team expertise in quantum computing, physics, and business scaling.',
  },
  {
    label: 'Phase 5: Financial Projections & Funding Needs',
    description: 'Present realistic 5-year financial models and define the required seed/Series A funding amount.',
  },
  {
    label: 'Phase 6: Go-to-Market Strategy (Pilot to Scale)',
    description: 'Outline the initial pilot project targets and the strategy for scaling enterprise adoption.',
  },
  {
    label: 'Phase 7: Risk Mitigation & Exit Strategy',
    description: 'Identify major technical and market risks and propose plausible exit scenarios (Acquisition/IPO).',
  },
];

// Styled component for better visual separation of steps
const VerticalStepper = styled(Stepper)(({ theme }) => ({
  minWidth: 300,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const StepButtonBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

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

  // Use useMemo to ensure step details are stable
  const currentStepData = useMemo(() => steps[activeStep], [activeStep]);

  return (
    <Box sx={{ width: '100%', maxWidth: 700 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quantum Weaver Pitch Analysis Workflow
      </Typography>
      <VerticalStepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label} completed={activeStep > index}>
            <StepLabel>
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography sx={{ mt: 1, mb: 2 }}>{step.description}</Typography>
              
              {/* Content Area Placeholder - In a real app, this would dynamically load the specific analysis form/view for the stage */}
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.neutral' }}>
                  <Typography variant="body2" color="text.secondary">
                      {index === activeStep ? `Current Focus: Input form/data visualization for '${step.label}' goes here.` : `Stage ${index + 1} content preview.`}
                  </Typography>
              </Paper>


              <StepButtonBox>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1}
                    sx={{ mr: 1 }}
                  >
                    {activeStep === steps.length - 1 ? 'Review Complete' : 'Mark as Reviewed & Continue'}
                  </Button>
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </StepButtonBox>
            </StepContent>
          </Step>
        ))}
      </VerticalStepper>

      {activeStep === steps.length && (
        <Paper sx={{ p: 3, mt: 3, bgcolor: 'success.light', border: '1px solid', borderColor: 'success.main' }}>
          <Typography variant="h6" color="success.dark">
            All {steps.length} Stages of the Pitch Analysis are Reviewed.
          </Typography>
          <Typography color="success.dark" sx={{ mt: 1 }}>
            The Quantum Weaver plan is now ready for executive presentation.
          </Typography>
          <Button onClick={handleReset} variant="outlined" sx={{ mt: 2 }}>
            Restart Analysis Flow
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PitchAnalysisStepper;