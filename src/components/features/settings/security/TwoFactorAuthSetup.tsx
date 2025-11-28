
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from '@mui/material';

interface TwoFactorAuthSetupProps {
  onComplete: () => void;
}

const TwoFactorAuthSetup = ({ onComplete }: TwoFactorAuthSetupProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: 'Step 1: Choose Your Method',
      content: (
        <>
          <Typography variant="body1">
            Select how you want to receive your verification codes.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>
            Authenticator App
          </Button>
          <Button variant="outlined" sx={{ mt: 2, ml: 2 }}>
            SMS
          </Button>
        </>
      ),
    },
    {
      label: 'Step 2: Install or Verify Your App',
      content: (
        <>
          <Typography variant="body1">
            Follow the instructions to install an authenticator app (like Google
            Authenticator or Authy) or verify your phone number.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            QR Code: [Placeholder for QR Code Display]
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Secret Key: [Placeholder for Secret Key Display]
          </Typography>
        </>
      ),
    },
    {
      label: 'Step 3: Enter Your Verification Code',
      content: (
        <>
          <Typography variant="body1">
            Enter the verification code from your authenticator app or the SMS
            message.
          </Typography>
          <input type="text" style={{ marginTop: '16px' }} />
        </>
      ),
    },
    {
      label: 'Step 4: Confirmation',
      content: (
        <>
          <Typography variant="body1">
            Two-factor authentication is now enabled!
          </Typography>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Heading variant="h5" sx={{ mb: 2 }}>
        Set Up Two-Factor Authentication
      </Heading>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              {step.content}
              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button onClick={onComplete} variant="contained">
                    Finish
                  </Button>
                ) : (
                  <Button onClick={handleNext} variant="contained">
                    Next
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Box sx={{ mt: 2 }}>
          <Text>
            Two-factor authentication setup completed.
          </Text>
          <Button onClick={onComplete}>
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TwoFactorAuthSetup;
