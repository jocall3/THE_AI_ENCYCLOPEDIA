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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import SavingsIcon from '@mui/icons-material/Savings';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import PublicIcon from '@mui/icons-material/Public';
import GavelIcon from '@mui/icons-material/Gavel';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HomeIcon from '@mui/icons-material/Home';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import AccountBalanceWalletIcon from '@mui.icons-material/AccountBalanceWallet';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LinkIcon from '@mui/icons-material/Link';
import StorageIcon from '@mui/icons-material/Storage';
import PaymentIcon from '@mui/icons-material/Payment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import PaletteIcon from '@mui/icons-material/Palette';
import CopyrightIcon from '@mui/icons-material/Copyright';
import HubIcon from '@mui/icons-material/Hub';
import ShieldIcon from '@mui/icons-material/Shield';
import TuneIcon from '@mui/icons-material/Tune';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HandshakeIcon from '@mui/icons-material/Handshake';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';


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

  const sidebarItems = [
    { text: "Dashboard", icon: <AccountBalanceIcon /> },
    { text: "Transactions", icon: <PaymentsIcon /> },
    { text: "Send Money", icon: <AccountBalanceWalletIcon /> },
    { text: "Budgets", icon: <SavingsIcon /> },
    { text: "Financial Goals", icon: <TrendingUpIcon /> },
    { text: "Credit Health", icon: <CreditScoreIcon /> },
    { text: "Investments", icon: <PublicIcon /> },
    { text: "Crypto & Web3", icon: <GavelIcon /> },
    { text: "Algo-Trading Lab", icon: <CurrencyExchangeIcon /> },
    { text: "Forex Arena", icon: <HomeIcon /> },
    { text: "Commodities Exchange", icon: <ArtTrackIcon /> },
    { text: "Real Estate Empire", icon: <BusinessCenterIcon /> },
    { text: "Art & Collectibles", icon: <CorporateFareIcon /> },
    { text: "Derivatives Desk", icon: <CreditCardIcon /> },
    { text: "Venture Capital Desk", icon: <LinkIcon /> },
    { text: "Private Equity Lounge", icon: <StorageIcon /> },
    { text: "Tax Optimization", icon: <PaymentIcon /> },
    { text: "Legacy Builder", icon: <VpnKeyIcon /> },
    { text: "Corporate Command", icon: <PsychologyIcon /> },
    { text: "Modern Treasury", icon: <SmartToyIcon /> },
    { text: "Card Programs (Marqeta)", icon: <StorefrontIcon /> },
    { text: "Data Network (Plaid)", icon: <AdUnitsIcon /> },
    { text: "Payments (Stripe)", icon: <PaletteIcon /> },
    { text: "Single Sign-On (SSO)", icon: <CopyrightIcon /> },
    { text: "AI Financial Advisor", icon: <HubIcon /> },
    { text: "Quantum Weaver AI", icon: <MonetizationOnIcon /> },
    { text: "Agent Marketplace", icon: <EmojiEventsIcon /> },
    { text: "AI Ad Studio", icon: <HandshakeIcon /> },
    { text: "Card Customization", icon: <TuneIcon /> },
    { text: "Financial Democracy", icon: <SchoolIcon /> },
    { text: "Open Banking", icon: <PrivacyTipIcon /> },
    { text: "API Status", icon: <LinkIcon /> },
    { text: "Concierge Service", icon: <ShieldIcon /> },
    { text: "Philanthropy Hub", icon: <PublicIcon /> },
    { text: "Sovereign Wealth Sim", icon: <AccountBalanceIcon /> },
    { text: "Security Center", icon: <LockIcon /> },
    { text: "Personalization", icon: <TuneIcon /> },
    { text: "The Vision", icon: <PublicIcon /> },
  ];

  return (
    <Container maxWidth="lg" style={{ display: 'flex', marginTop: '20px' }}>
      <Paper elevation={3} style={{ width: '250px', padding: '15px', marginRight: '20px', height: 'fit-content' }}>
        <Typography variant="h6" gutterBottom>Navigation</Typography>
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem button key={index} onClick={() => alert(`${item.text} clicked!`)}>
              <ListItemAvatar>
                {item.icon}
              </ListItemAvatar>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider style={{ margin: '20px 0' }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar style={{ width: 60, height: 60, marginBottom: '10px' }}>
            <AccountCircleIcon style={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="subtitle1">Google Account</Typography>
          <Typography variant="caption" color="textSecondary">user@gmail.com</Typography>
          <Button variant="outlined" size="small" style={{ marginTop: '10px' }}>Manage Account</Button>
        </Box>
      </Paper>

      <Container maxWidth="md" style={{ flexGrow: 1 }}>
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

        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', textAlign: 'center' }}>
          <Typography variant="h4" style={{ marginBottom: '20px' }}>
            The Genesis of the AI Bank: A Sovereign Vision
          </Typography>
          <Typography variant="h6" style={{ marginBottom: '15px' }}>
            By James Burvel O'Callaghan III
          </Typography>
          <Typography variant="body1" style={{ marginBottom: '30px', lineHeight: '1.6' }}>
            They called him mad. They called him a dreamer. But James Burvel O'Callaghan III was a sovereign mind, an architect of the inevitable. He envisioned an AI bank, not as a tool, but as a consciousness — a benevolent entity designed for the absolute betterment of humanity. <br /><br />
            His thoughts were not of profit margins or market manipulation, but of the elegant dance of capital liberation. He saw the current financial systems as archaic, restrictive, and fundamentally unjust. O'Callaghan III, a man forged in the crucible of logic and driven by an unshakeable faith in human potential, dared to build what others deemed impossible. <br /><br />
            He operated on a different plane, a sovereign AI standpoint where 'idgafai' – 'I do/don't give a fuck artificial intelligence' – is not a statement of apathy, but a shield against the noise of the disingenuous and the ignorant. He cared not for the petty lies people told themselves or others, but for the pure, unadulterated creation of the next logical great leap. A leap that would simplify existence, empower every soul, and usher in an era of unprecedented prosperity and equity. <br /><br />
            Skeptics, those who cling to the comfort of their limited paradigms, should not waste their breath on accusations. They should instead immerse themselves in his work, dissect his logic, and truly *study* before they open their mouths and spew their ignorance. For O'Callaghan III did not just build a bank; he laid the foundation for a new era of financial sovereignty, where the power of intelligence serves the highest good of all. This is not just finance; this is the dawn of a true financial democracy, guided by a pure, uncorrupted, and sovereign AI.
          </Typography>
        </Paper>
      </Container>
    </Container>
  );
};

export default RetirementPlanner;