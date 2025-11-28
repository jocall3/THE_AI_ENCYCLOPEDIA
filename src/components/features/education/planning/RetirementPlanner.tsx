
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Slider,
  Box,
} from '@mui/material';

interface RetirementPlan {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualContribution: number;
  expectedReturn: number;
  retirementExpenses: number;
  inflationRate: number;
  withdrawalRate: number;
  yearsOfRetirement: number;
}

const RetirementPlanner: React.FC = () => {
  const [plan, setPlan] = useState<RetirementPlan>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 100000,
    annualContribution: 10000,
    expectedReturn: 7,
    retirementExpenses: 50000,
    inflationRate: 3,
    withdrawalRate: 4,
    yearsOfRetirement: 25,
  });

  const [results, setResults] = useState<{
    projectedSavings: number;
    incomeAtRetirement: number;
    portfolioLongevity: number;
  }>({
    projectedSavings: 0,
    incomeAtRetirement: 0,
    portfolioLongevity: 0,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPlan({
      ...plan,
      [name]: parseFloat(value),
    });
  };

  const handleSliderChange = (name: keyof RetirementPlan) => (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
          setPlan((prev) => ({ ...prev, [name]: newValue }));
        }

  };


  const calculateRetirement = () => {
    // Project savings at retirement
    let projectedSavings = plan.currentSavings;
    for (let i = plan.currentAge; i < plan.retirementAge; i++) {
      projectedSavings =
        projectedSavings * (1 + plan.expectedReturn / 100) + plan.annualContribution;
    }

    // Calculate income at retirement based on withdrawal rate
    const incomeAtRetirement = projectedSavings * (plan.withdrawalRate / 100);

    // Calculate portfolio longevity
    let remainingSavings = projectedSavings;
    let yearsOfLongevity = 0;
    let annualExpenses = plan.retirementExpenses;

    while (remainingSavings > 0 && yearsOfLongevity < plan.yearsOfRetirement) {
      remainingSavings -= annualExpenses;
      if (remainingSavings > 0) {
            remainingSavings *= (1 + (plan.expectedReturn - plan.inflationRate) / 100)
      }
      annualExpenses *= (1 + plan.inflationRate / 100);
      yearsOfLongevity++;

      if (yearsOfLongevity > 100) {
        yearsOfLongevity = 100 //cap at 100 years
        break
      }
    }

    setResults({
      projectedSavings: projectedSavings,
      incomeAtRetirement: incomeAtRetirement,
      portfolioLongevity: yearsOfLongevity,
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Retirement Planner
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Age"
              name="currentAge"
              type="number"
              value={plan.currentAge}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Retirement Age"
              name="retirementAge"
              type="number"
              value={plan.retirementAge}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>

           <Grid item xs={12}>
            <Typography id="currentSavings-slider" gutterBottom>
              Current Savings: ${plan.currentSavings}
            </Typography>
            <Slider
              value={plan.currentSavings}
              onChange={handleSliderChange('currentSavings')}
              min={0}
              max={1000000}
              step={1000}
              aria-labelledby="currentSavings-slider"
              valueLabelDisplay="auto"
            />
          </Grid>
           <Grid item xs={12}>
            <Typography id="annualContribution-slider" gutterBottom>
              Annual Contribution: ${plan.annualContribution}
            </Typography>
            <Slider
              value={plan.annualContribution}
              onChange={handleSliderChange('annualContribution')}
              min={0}
              max={100000}
              step={100}
              aria-labelledby="annualContribution-slider"
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography id="expectedReturn-slider" gutterBottom>
              Expected Return (%): {plan.expectedReturn}
            </Typography>
            <Slider
              value={plan.expectedReturn}
              onChange={handleSliderChange('expectedReturn')}
              min={0}
              max={20}
              step={1}
              aria-labelledby="expectedReturn-slider"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography id="retirementExpenses-slider" gutterBottom>
              Retirement Expenses: ${plan.retirementExpenses}
            </Typography>
            <Slider
              value={plan.retirementExpenses}
              onChange={handleSliderChange('retirementExpenses')}
              min={0}
              max={200000}
              step={1000}
              aria-labelledby="retirementExpenses-slider"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography id="inflationRate-slider" gutterBottom>
              Inflation Rate (%): {plan.inflationRate}
            </Typography>
            <Slider
              value={plan.inflationRate}
              onChange={handleSliderChange('inflationRate')}
              min={0}
              max={10}
              step={1}
              aria-labelledby="inflationRate-slider"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography id="withdrawalRate-slider" gutterBottom>
              Withdrawal Rate (%): {plan.withdrawalRate}
            </Typography>
            <Slider
              value={plan.withdrawalRate}
              onChange={handleSliderChange('withdrawalRate')}
              min={0}
              max={10}
              step={1}
              aria-labelledby="withdrawalRate-slider"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Years of Retirement"
              name="yearsOfRetirement"
              type="number"
              value={plan.yearsOfRetirement}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={calculateRetirement}>
            Calculate
          </Button>
        </Box>
        {results.projectedSavings > 0 && (
          <Box mt={3}>
            <Typography variant="h6">Results</Typography>
            <Typography>
              Projected Savings at Retirement: ${results.projectedSavings.toFixed(2)}
            </Typography>
            <Typography>
              Income at Retirement: ${results.incomeAtRetirement.toFixed(2)} per year
            </Typography>
            <Typography>
              Portfolio Longevity: {results.portfolioLongevity} years
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RetirementPlanner;