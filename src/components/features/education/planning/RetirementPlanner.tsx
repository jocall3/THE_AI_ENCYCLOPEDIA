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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
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


interface InvestmentPortfolio {
  assetClass: string;
  allocation: number; // percentage
  expectedReturn: number; // percentage
  riskLevel: string;
  currentValue: number;
}

interface DebtDetail {
  type: string;
  principal: number;
  interestRate: number; // percentage
  minimumPayment: number;
  remainingTerm: number; // months
}

interface RealEstateAsset {
  propertyType: string;
  value: number;
  rentalIncome: number;
  mortgage: number;
  appreciationRate: number; // percentage
}

interface BusinessVenture {
  name: string;
  valuation: number;
  annualProfit: number;
  growthRate: number; // percentage
}

interface TaxStrategy {
  name: string;
  potentialSavings: number;
  riskLevel: string;
  description: string;
}

interface LegacyAsset {
  type: string;
  value: number;
  beneficiary: string;
  notes: string;
}

interface AIRecommendation {
  category: string;
  title: string;
  description: string;
  impact: string;
  confidence: number; // 0-100
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

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
  // New AI-driven parameters
  riskTolerance: number; // 1-10, 1 low, 10 high
  lifeExpectancyAdjustment: number; // years
  healthcareCostsInflation: number; // percentage
  socialSecurityEstimate: number;
  pensionEstimate: number;
  partTimeIncomeRetirement: number;
  taxRateRetirement: number; // percentage
  desiredLegacy: number;
  // ESG preferences
  esgPreference: 'none' | 'low' | 'medium' | 'high';
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
    riskTolerance: 5,
    lifeExpectancyAdjustment: 0,
    healthcareCostsInflation: 5,
    socialSecurityEstimate: 20000,
    pensionEstimate: 0,
    partTimeIncomeRetirement: 0,
    taxRateRetirement: 15,
    desiredLegacy: 100000,
    esgPreference: 'medium',
  });

  const [results, setResults] = useState<{
    projectedSavings: number;
    incomeAtRetirement: number;
    portfolioLongevity: number;
    aiOptimizedStrategy: string;
    aiRiskScore: number;
    aiTaxEfficiencyScore: number;
    aiLegacyImpact: string;
  }>({
    projectedSavings: 0,
    incomeAtRetirement: 0,
    portfolioLongevity: 0,
    aiOptimizedStrategy: 'No strategy generated yet.',
    aiRiskScore: 0,
    aiTaxEfficiencyScore: 0,
    aiLegacyImpact: 'No legacy impact analysis yet.',
  });

  const [investmentPortfolio, setInvestmentPortfolio] = useState<InvestmentPortfolio[]>([
    { assetClass: 'Stocks (Growth)', allocation: 40, expectedReturn: 9, riskLevel: 'High', currentValue: 40000 },
    { assetClass: 'Bonds (Diversified)', allocation: 30, expectedReturn: 4, riskLevel: 'Medium', currentValue: 30000 },
    { assetClass: 'Real Estate (REITs)', allocation: 15, expectedReturn: 6, riskLevel: 'Medium', currentValue: 15000 },
    { assetClass: 'Alternative Assets', allocation: 10, expectedReturn: 8, riskLevel: 'High', currentValue: 10000 },
    { assetClass: 'Cash & Equivalents', allocation: 5, expectedReturn: 1, riskLevel: 'Low', currentValue: 5000 },
  ]);

  const [debts, setDebts] = useState<DebtDetail[]>([
    { type: 'Mortgage', principal: 250000, interestRate: 3.5, minimumPayment: 1200, remainingTerm: 240 },
    { type: 'Student Loan', principal: 30000, interestRate: 4.0, minimumPayment: 300, remainingTerm: 60 },
  ]);

  const [realEstateAssets, setRealEstateAssets] = useState<RealEstateAsset[]>([
    { propertyType: 'Primary Residence', value: 500000, rentalIncome: 0, mortgage: 250000, appreciationRate: 4 },
  ]);

  const [businessVentures, setBusinessVentures] = useState<BusinessVenture[]>([]);
  const [taxStrategies, setTaxStrategies] = useState<TaxStrategy[]>([]);
  const [legacyAssets, setLegacyAssets] = useState<LegacyAsset[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // AI Simulation for initial recommendations
  React.useEffect(() => {
    const generateInitialRecommendations = () => {
      setIsLoadingAI(true);
      setTimeout(() => {
        setAiRecommendations([
          {
            category: 'Retirement',
            title: 'Optimize Annual Contribution',
            description: `Based on your current savings and desired retirement age, increasing your annual contribution by 15% could boost your projected savings by an additional $${(plan.currentSavings * 0.15).toFixed(0)} at retirement.`,
            impact: 'High',
            confidence: 92,
          },
          {
            category: 'Investments',
            title: 'Diversify into Emerging Markets',
            description: 'Your current portfolio has limited exposure to emerging markets. AI suggests a 5% allocation to high-growth emerging market ETFs for enhanced long-term returns, considering your risk tolerance.',
            impact: 'Medium',
            confidence: 88,
          },
          {
            category: 'Debt Management',
            title: 'Accelerate Student Loan Repayment',
            description: 'AI analysis indicates that an extra $100/month payment on your student loan could save you $1,200 in interest and shorten the term by 6 months.',
            impact: 'Medium',
            confidence: 85,
          },
          {
            category: 'ESG Investing',
            title: 'Integrate Sustainable Funds',
            description: `Given your '${plan.esgPreference}' ESG preference, consider reallocating 10% of your bond portfolio into sustainable bond funds. This aligns with your values without significantly impacting returns.`,
            impact: 'Low',
            confidence: 78,
          },
        ]);
        setIsLoadingAI(false);
      }, 1500);
    };
    generateInitialRecommendations();
  }, [plan.currentSavings, plan.retirementAge, plan.esgPreference]); // Recalculate if key plan parameters change

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

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const calculateRetirement = () => {
    setIsLoadingAI(true);
    setTimeout(() => {
      let projectedSavings = plan.currentSavings;
      const yearsToRetirement = plan.retirementAge - plan.currentAge;

      for (let i = 0; i < yearsToRetirement; i++) {
        projectedSavings =
          projectedSavings * (1 + plan.expectedReturn / 100) + plan.annualContribution;
      }

      // AI-driven adjustments for market volatility and personalized returns
      const aiReturnAdjustment = (plan.riskTolerance - 5) * 0.2; // +/- 2% based on risk tolerance
      projectedSavings *= (1 + aiReturnAdjustment / 100);

      // Calculate income at retirement based on withdrawal rate, adjusted for social security and pension
      let incomeAtRetirement = projectedSavings * (plan.withdrawalRate / 100);
      incomeAtRetirement += plan.socialSecurityEstimate + plan.pensionEstimate + plan.partTimeIncomeRetirement;

      // Adjust for taxes in retirement
      incomeAtRetirement *= (1 - plan.taxRateRetirement / 100);

      // Calculate portfolio longevity
      let remainingSavings = projectedSavings;
      let yearsOfLongevity = 0;
      let annualExpenses = plan.retirementExpenses;

      // AI-driven healthcare cost inflation
      const effectiveHealthcareInflation = plan.inflationRate + (plan.healthcareCostsInflation / 100);

      while (remainingSavings > 0 && yearsOfLongevity < (plan.yearsOfRetirement + plan.lifeExpectancyAdjustment)) {
        remainingSavings -= annualExpenses;
        if (remainingSavings > 0) {
          remainingSavings *= (1 + (plan.expectedReturn - plan.inflationRate) / 100);
        }
        annualExpenses *= (1 + effectiveHealthcareInflation / 100); // Use effective healthcare inflation
        yearsOfLongevity++;

        if (yearsOfLongevity > 120) { // Cap at 120 years for extreme longevity scenarios
          yearsOfLongevity = 120;
          break;
        }
      }

      // AI-driven insights for results
      const aiOptimizedStrategy = `Based on your profile, AI recommends a 'Dynamic Growth & Income' strategy. This involves adjusting asset allocation quarterly based on market sentiment and your evolving risk profile. Projected tax efficiency is high due to recommended Roth conversions.`;
      const aiRiskScore = Math.min(100, Math.max(0, 50 + (plan.riskTolerance * 5) - (plan.currentAge - 30) * 0.5)); // Simulated score
      const aiTaxEfficiencyScore = Math.min(100, Math.max(0, 75 + (plan.annualContribution / 10000) * 2 - (plan.currentSavings / 100000) * 1)); // Simulated score
      const aiLegacyImpact = `With a desired legacy of $${plan.desiredLegacy.toLocaleString()}, AI projects your portfolio can comfortably support this goal while maintaining your desired retirement lifestyle. Consider setting up a trust for optimal distribution.`;


      setResults({
        projectedSavings: projectedSavings,
        incomeAtRetirement: incomeAtRetirement,
        portfolioLongevity: yearsOfLongevity,
        aiOptimizedStrategy: aiOptimizedStrategy,
        aiRiskScore: aiRiskScore,
        aiTaxEfficiencyScore: aiTaxEfficiencyScore,
        aiLegacyImpact: aiLegacyImpact,
      });
      setIsLoadingAI(false);
      showSnackbar('Retirement plan calculated and AI insights generated!');
    }, 2000); // Simulate AI processing time
  };

  const handleAddInvestment = () => {
    setInvestmentPortfolio([...investmentPortfolio, { assetClass: 'New Asset', allocation: 0, expectedReturn: 0, riskLevel: 'Low', currentValue: 0 }]);
    showSnackbar('New investment placeholder added.');
  };

  const handleInvestmentChange = (index: number, field: keyof InvestmentPortfolio, value: any) => {
    const updatedPortfolio = [...investmentPortfolio];
    updatedPortfolio[index] = { ...updatedPortfolio[index], [field]: value };
    setInvestmentPortfolio(updatedPortfolio);
  };

  const handleAddDebt = () => {
    setDebts([...debts, { type: 'New Debt', principal: 0, interestRate: 0, minimumPayment: 0, remainingTerm: 0 }]);
    showSnackbar('New debt placeholder added.');
  };

  const handleDebtChange = (index: number, field: keyof DebtDetail, value: any) => {
    const updatedDebts = [...debts];
    updatedDebts[index] = { ...updatedDebts[index], [field]: value };
    setDebts(updatedDebts);
  };

  const handleAddRealEstate = () => {
    setRealEstateAssets([...realEstateAssets, { propertyType: 'New Property', value: 0, rentalIncome: 0, mortgage: 0, appreciationRate: 0 }]);
    showSnackbar('New real estate asset placeholder added.');
  };

  const handleRealEstateChange = (index: number, field: keyof RealEstateAsset, value: any) => {
    const updatedAssets = [...realEstateAssets];
    updatedAssets[index] = { ...updatedAssets[index], [field]: value };
    setRealEstateAssets(updatedAssets);
  };

  const handleAddBusinessVenture = () => {
    setBusinessVentures([...businessVentures, { name: 'New Venture', valuation: 0, annualProfit: 0, growthRate: 0 }]);
    showSnackbar('New business venture placeholder added.');
  };

  const handleBusinessVentureChange = (index: number, field: keyof BusinessVenture, value: any) => {
    const updatedVentures = [...businessVentures];
    updatedVentures[index] = { ...updatedVentures[index], [field]: value };
    setBusinessVentures(updatedVentures);
  };

  const handleAddTaxStrategy = () => {
    setTaxStrategies([...taxStrategies, { name: 'New Strategy', potentialSavings: 0, riskLevel: 'Low', description: '' }]);
    showSnackbar('New tax strategy placeholder added.');
  };

  const handleTaxStrategyChange = (index: number, field: keyof TaxStrategy, value: any) => {
    const updatedStrategies = [...taxStrategies];
    updatedStrategies[index] = { ...updatedStrategies[index], [field]: value };
    setTaxStrategies(updatedStrategies);
  };

  const handleAddLegacyAsset = () => {
    setLegacyAssets([...legacyAssets, { type: 'New Asset', value: 0, beneficiary: '', notes: '' }]);
    showSnackbar('New legacy asset placeholder added.');
  };

  const handleLegacyAssetChange = (index: number, field: keyof LegacyAsset, value: any) => {
    const updatedAssets = [...legacyAssets];
    updatedAssets[index] = { ...updatedAssets[index], [field]: value };
    setLegacyAssets(updatedAssets);
  };

  const handleAIChatSubmit = () => {
    if (chatInput.trim() === '') return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setChatInput('');
    setIsLoadingAI(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponseText = "I'm sorry, I couldn't understand that. Can you please rephrase?";
      if (newUserMessage.text.toLowerCase().includes('retirement')) {
        aiResponseText = `Based on your current retirement plan, your projected savings are $${results.projectedSavings.toFixed(0)} and your portfolio longevity is ${results.portfolioLongevity} years. Would you like to explore scenarios to increase these?`;
      } else if (newUserMessage.text.toLowerCase().includes('investment')) {
        aiResponseText = `Your current investment portfolio is diversified across ${investmentPortfolio.length} asset classes. AI recommends reviewing your allocation to alternative assets for potential growth.`;
      } else if (newUserMessage.text.toLowerCase().includes('debt')) {
        aiResponseText = `You currently have ${debts.length} active debts. AI suggests focusing on your student loan for accelerated repayment due to its interest rate.`;
      } else if (newUserMessage.text.toLowerCase().includes('tax')) {
        aiResponseText = `AI has identified several tax optimization strategies for your profile, potentially saving you thousands annually. Would you like a detailed report?`;
      } else if (newUserMessage.text.toLowerCase().includes('hello') || newUserMessage.text.toLowerCase().includes('hi')) {
        aiResponseText = `Hello! I am your AI Financial Co-Pilot. How can I assist you with your financial journey today?`;
      } else if (newUserMessage.text.toLowerCase().includes('esg')) {
        aiResponseText = `Your ESG preference is set to '${plan.esgPreference}'. AI can help you find investment opportunities that align with your sustainability goals.`;
      }

      const newAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, newAiMessage]);
      setIsLoadingAI(false);
    }, 1500);
  };

  const sidebarItems = [
    { text: "Dashboard", icon: <AccountBalanceIcon /> },
    { text: "AI Financial Co-Pilot", icon: <SmartToyIcon /> },
    { text: "Retirement & Legacy", icon: <VpnKeyIcon /> },
    { text: "Investment Portfolio", icon: <TrendingUpIcon /> },
    { text: "Debt & Credit Health", icon: <CreditScoreIcon /> },
    { text: "Tax Optimization Engine", icon: <PaymentIcon /> },
    { text: "Real Estate & Assets", icon: <HomeIcon /> },
    { text: "Business & Ventures", icon: <BusinessCenterIcon /> },
    { text: "Global Market Insights", icon: <PublicIcon /> },
    { text: "ESG & Impact Investing", icon: <HandshakeIcon /> },
    { text: "Financial Literacy Hub", icon: <SchoolIcon /> },
    { text: "Security & Compliance", icon: <ShieldIcon /> },
    { text: "Personalization AI", icon: <TuneIcon /> },
    { text: "API & Integrations", icon: <LinkIcon /> },
    { text: "Concierge Service", icon: <CorporateFareIcon /> },
    { text: "The Sovereign Vision", icon: <CopyrightIcon /> },
  ];

  return (
    <Container maxWidth="xl" style={{ display: 'flex', marginTop: '20px', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Paper elevation={3} style={{ width: '280px', padding: '15px', marginRight: '20px', height: 'fit-content', position: 'sticky', top: '20px' }}>
        <Typography variant="h6" gutterBottom>AI Financial Platform</Typography>
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem button key={index} onClick={() => showSnackbar(`Navigating to ${item.text}`)}>
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
          <Typography variant="subtitle1">Quantum User</Typography>
          <Typography variant="caption" color="textSecondary">user@quantum.ai</Typography>
          <Button variant="outlined" size="small" style={{ marginTop: '10px' }} onClick={() => showSnackbar('Managing account settings...')}>Manage Account</Button>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box style={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Retirement Planner */}
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '25px' }}>
              <Typography variant="h5" gutterBottom>
                AI-Powered Retirement & Legacy Planner <VpnKeyIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Leverage Quantum AI to project your financial future, optimize your retirement strategy, and plan your legacy with unparalleled precision.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Current Age" name="currentAge" type="number" value={plan.currentAge} onChange={handleChange} margin="normal" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Retirement Age" name="retirementAge" type="number" value={plan.retirementAge} onChange={handleChange} margin="normal" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Years of Retirement" name="yearsOfRetirement" type="number" value={plan.yearsOfRetirement} onChange={handleChange} margin="normal" />
                </Grid>

                <Grid item xs={12}>
                  <Typography id="currentSavings-slider" gutterBottom>Current Savings: ${plan.currentSavings.toLocaleString()}</Typography>
                  <Slider value={plan.currentSavings} onChange={handleSliderChange('currentSavings')} min={0} max={5000000} step={10000} aria-labelledby="currentSavings-slider" valueLabelDisplay="auto" />
                </Grid>
                <Grid item xs={12}>
                  <Typography id="annualContribution-slider" gutterBottom>Annual Contribution: ${plan.annualContribution.toLocaleString()}</Typography>
                  <Slider value={plan.annualContribution} onChange={handleSliderChange('annualContribution')} min={0} max={250000} step={1000} aria-labelledby="annualContribution-slider" valueLabelDisplay="auto" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography id="expectedReturn-slider" gutterBottom>Expected Investment Return (%): {plan.expectedReturn}</Typography>
                  <Slider value={plan.expectedReturn} onChange={handleSliderChange('expectedReturn')} min={0} max={25} step={0.5} aria-labelledby="expectedReturn-slider" valueLabelDisplay="auto" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography id="riskTolerance-slider" gutterBottom>Risk Tolerance (1-10): {plan.riskTolerance}</Typography>
                  <Slider value={plan.riskTolerance} onChange={handleSliderChange('riskTolerance')} min={1} max={10} step={1} aria-labelledby="riskTolerance-slider" valueLabelDisplay="auto" />
                </Grid>

                <Grid item xs={12}>
                  <Typography id="retirementExpenses-slider" gutterBottom>Desired Annual Retirement Expenses: ${plan.retirementExpenses.toLocaleString()}</Typography>
                  <Slider value={plan.retirementExpenses} onChange={handleSliderChange('retirementExpenses')} min={0} max={500000} step={5000} aria-labelledby="retirementExpenses-slider" valueLabelDisplay="auto" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography id="inflationRate-slider" gutterBottom>General Inflation Rate (%): {plan.inflationRate}</Typography>
                  <Slider value={plan.inflationRate} onChange={handleSliderChange('inflationRate')} min={0} max={10} step={0.1} aria-labelledby="inflationRate-slider" valueLabelDisplay="auto" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography id="healthcareCostsInflation-slider" gutterBottom>Healthcare Costs Inflation (%): {plan.healthcareCostsInflation}</Typography>
                  <Slider value={plan.healthcareCostsInflation} onChange={handleSliderChange('healthcareCostsInflation')} min={0} max={15} step={0.5} aria-labelledby="healthcareCostsInflation-slider" valueLabelDisplay="auto" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography id="withdrawalRate-slider" gutterBottom>Safe Withdrawal Rate (%): {plan.withdrawalRate}</Typography>
                  <Slider value={plan.withdrawalRate} onChange={handleSliderChange('withdrawalRate')} min={0} max={10} step={0.1} aria-labelledby="withdrawalRate-slider" valueLabelDisplay="auto" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography id="lifeExpectancyAdjustment-slider" gutterBottom>AI Life Expectancy Adjustment (Years): {plan.lifeExpectancyAdjustment}</Typography>
                  <Slider value={plan.lifeExpectancyAdjustment} onChange={handleSliderChange('lifeExpectancyAdjustment')} min={-10} max={20} step={1} aria-labelledby="lifeExpectancyAdjustment-slider" valueLabelDisplay="auto" />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Social Security Estimate" name="socialSecurityEstimate" type="number" value={plan.socialSecurityEstimate} onChange={handleChange} margin="normal" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Pension Estimate" name="pensionEstimate" type="number" value={plan.pensionEstimate} onChange={handleChange} margin="normal" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Part-Time Income in Retirement" name="partTimeIncomeRetirement" type="number" value={plan.partTimeIncomeRetirement} onChange={handleChange} margin="normal" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Estimated Retirement Tax Rate (%)" name="taxRateRetirement" type="number" value={plan.taxRateRetirement} onChange={handleChange} margin="normal" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Desired Legacy Amount" name="desiredLegacy" type="number" value={plan.desiredLegacy} onChange={handleChange} margin="normal" />
                </Grid>
              </Grid>
              <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                <Button variant="contained" color="primary" onClick={calculateRetirement} disabled={isLoadingAI}>
                  {isLoadingAI ? (
                    <Box display="flex" alignItems="center">
                      <Typography variant="button" style={{ marginRight: '8px' }}>Calculating with AI...</Typography>
                      <Box component="span" sx={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                    </Box>
                  ) : (
                    'Generate AI Retirement Plan'
                  )}
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => showSnackbar('AI Scenario Builder launched!')}>
                  AI Scenario Builder <SmartToyIcon fontSize="small" style={{ marginLeft: '5px' }} />
                </Button>
              </Box>
              {results.projectedSavings > 0 && (
                <Box mt={4} p={3} border={1} borderColor="primary.light" borderRadius={2} bgcolor="primary.light" style={{ backgroundColor: 'rgba(0, 123, 255, 0.05)' }}>
                  <Typography variant="h6" gutterBottom color="primary">AI-Powered Retirement Projections</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Projected Savings at Retirement:</strong> <Typography component="span" variant="h6" color="success.main">${results.projectedSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Estimated Annual Income in Retirement:</strong> <Typography component="span" variant="h6" color="success.main">${results.incomeAtRetirement.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Portfolio Longevity (AI Adjusted):</strong> <Typography component="span" variant="h6" color="success.main">{results.portfolioLongevity} years</Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>AI Optimized Strategy:</strong> {results.aiOptimizedStrategy}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>AI Risk Alignment Score:</strong> {results.aiRiskScore}% (vs. your tolerance of {plan.riskTolerance * 10}%)
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>AI Tax Efficiency Score:</strong> {results.aiTaxEfficiencyScore}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>AI Legacy Impact Analysis:</strong> {results.aiLegacyImpact}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* AI Financial Co-Pilot Chat */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '25px', height: '500px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom>
                AI Financial Co-Pilot <SmartToyIcon fontSize="small" />
              </Typography>
              <Box style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '15px', border: '1px solid #eee', borderRadius: '4px', padding: '10px' }}>
                {chatMessages.length === 0 && (
                  <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '20px' }}>
                    Start a conversation with your AI Co-Pilot for instant financial insights.
                  </Typography>
                )}
                {chatMessages.map((msg) => (
                  <Box key={msg.id} style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                  }}>
                    <Paper elevation={1} style={{
                      padding: '8px 12px',
                      borderRadius: '15px',
                      maxWidth: '70%',
                      backgroundColor: msg.sender === 'user' ? '#e3f2fd' : '#f1f8e9',
                      color: '#333',
                    }}>
                      <Typography variant="body2">{msg.text}</Typography>
                      <Typography variant="caption" display="block" align={msg.sender === 'user' ? 'right' : 'left'} color="textSecondary" style={{ fontSize: '0.7rem' }}>
                        {msg.timestamp}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                {isLoadingAI && (
                  <Box display="flex" justifyContent="flex-start" marginBottom="10px">
                    <Paper elevation={1} style={{
                      padding: '8px 12px',
                      borderRadius: '15px',
                      maxWidth: '70%',
                      backgroundColor: '#f1f8e9',
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" style={{ marginRight: '8px' }}>AI is typing...</Typography>
                      <Box component="span" sx={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #ccc', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                    </Paper>
                  </Box>
                )}
              </Box>
              <Box display="flex">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask your AI financial co-pilot..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleAIChatSubmit(); }}
                  disabled={isLoadingAI}
                />
                <Button variant="contained" color="primary" onClick={handleAIChatSubmit} style={{ marginLeft: '10px' }} disabled={isLoadingAI}>
                  Send
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* AI-Powered Investment Portfolio Manager */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '25px', height: '500px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                AI Investment Portfolio Manager <TrendingUpIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                AI-driven insights for optimal asset allocation, risk management, and performance forecasting.
              </Typography>
              <List>
                {investmentPortfolio.map((item, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Asset Class"
                          value={item.assetClass}
                          onChange={(e) => handleInvestmentChange(index, 'assetClass', e.target.value)}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Allocation (%)"
                          type="number"
                          value={item.allocation}
                          onChange={(e) => handleInvestmentChange(index, 'allocation', parseFloat(e.target.value))}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Exp. Return (%)"
                          type="number"
                          value={item.expectedReturn}
                          onChange={(e) => handleInvestmentChange(index, 'expectedReturn', parseFloat(e.target.value))}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Risk Level"
                          value={item.riskLevel}
                          onChange={(e) => handleInvestmentChange(index, 'riskLevel', e.target.value)}
                          margin="dense"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Current Value"
                          type="number"
                          value={item.currentValue}
                          onChange={(e) => handleInvestmentChange(index, 'currentValue', parseFloat(e.target.value))}
                          margin="dense"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </List>
              <Button variant="outlined" onClick={handleAddInvestment} style={{ marginTop: '10px' }}>
                Add Investment Asset
              </Button>
              <Box mt={3} p={2} border={1} borderColor="info.light" borderRadius={2} bgcolor="info.light" style={{ backgroundColor: 'rgba(0, 188, 212, 0.05)' }}>
                <Typography variant="subtitle1" color="info.main">AI Portfolio Analysis:</Typography>
                <Typography variant="body2">
                  Current portfolio diversification score: 85/100. AI recommends rebalancing 5% from bonds to alternative assets to enhance growth potential, aligning with your risk tolerance.
                </Typography>
                <Typography variant="body2">
                  Projected 5-year growth with AI optimization: +12% over baseline.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* AI Debt & Credit Health Optimizer */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '25px', height: '500px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                AI Debt & Credit Health Optimizer <CreditScoreIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                AI identifies optimal debt repayment strategies and provides actionable insights to boost your credit score.
              </Typography>
              <List>
                {debts.map((item, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Debt Type" value={item.type} onChange={(e) => handleDebtChange(index, 'type', e.target.value)} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Principal" type="number" value={item.principal} onChange={(e) => handleDebtChange(index, 'principal', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Interest Rate (%)" type="number" value={item.interestRate} onChange={(e) => handleDebtChange(index, 'interestRate', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Min. Payment" type="number" value={item.minimumPayment} onChange={(e) => handleDebtChange(index, 'minimumPayment', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Remaining Term (Months)" type="number" value={item.remainingTerm} onChange={(e) => handleDebtChange(index, 'remainingTerm', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </List>
              <Button variant="outlined" onClick={handleAddDebt} style={{ marginTop: '10px' }}>
                Add Debt
              </Button>
              <Box mt={3} p={2} border={1} borderColor="warning.light" borderRadius={2} bgcolor="warning.light" style={{ backgroundColor: 'rgba(255, 193, 7, 0.05)' }}>
                <Typography variant="subtitle1" color="warning.main">AI Debt Strategy:</Typography>
                <Typography variant="body2">
                  AI recommends an "Avalanche Method" for your debts, prioritizing the student loan. This could save you an estimated $3,500 in interest over the next 3 years.
                </Typography>
                <Typography variant="body2">
                  Projected credit score increase: +30 points within 12 months with recommended actions.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* AI Tax Optimization Engine */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '25px', height: '500px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                AI Tax Optimization Engine <PaymentIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Quantum AI analyzes your financial data to identify personalized tax-saving opportunities and compliance risks.
              </Typography>
              <List>
                {taxStrategies.length === 0 && (
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: '15px' }}>
                    No custom tax strategies added. AI will generate recommendations below.
                  </Typography>
                )}
                {taxStrategies.map((item, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Strategy Name" value={item.name} onChange={(e) => handleTaxStrategyChange(index, 'name', e.target.value)} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Potential Savings" type="number" value={item.potentialSavings} onChange={(e) => handleTaxStrategyChange(index, 'potentialSavings', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Description" multiline rows={2} value={item.description} onChange={(e) => handleTaxStrategyChange(index, 'description', e.target.value)} margin="dense" />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </List>
              <Button variant="outlined" onClick={handleAddTaxStrategy} style={{ marginTop: '10px' }}>
                Add Custom Tax Strategy
              </Button>
              <Box mt={3} p={2} border={1} borderColor="success.light" borderRadius={2} bgcolor="success.light" style={{ backgroundColor: 'rgba(76, 175, 80, 0.05)' }}>
                <Typography variant="subtitle1" color="success.main">AI Tax Recommendations:</Typography>
                <Typography variant="body2">
                  AI suggests maximizing your 401(k) contributions to reduce taxable income by an estimated $5,000 this year.
                </Typography>
                <Typography variant="body2">
                  Consider exploring Health Savings Account (HSA) contributions for triple tax advantages, potentially saving an additional $1,500 annually.
                </Typography>
                <Typography variant="body2">
                  AI has identified a potential capital gains harvesting opportunity that could offset $2,000 in ordinary income.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* AI Real Estate & Asset Management */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '25px', height: '500px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                AI Real Estate & Asset Management <HomeIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                AI provides valuation insights, market trend analysis, and optimization strategies for your real estate and physical assets.
              </Typography>
              <List>
                {realEstateAssets.map((item, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Property Type" value={item.propertyType} onChange={(e) => handleRealEstateChange(index, 'propertyType', e.target.value)} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Value" type="number" value={item.value} onChange={(e) => handleRealEstateChange(index, 'value', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Rental Income" type="number" value={item.rentalIncome} onChange={(e) => handleRealEstateChange(index, 'rentalIncome', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Mortgage" type="number" value={item.mortgage} onChange={(e) => handleRealEstateChange(index, 'mortgage', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Appreciation Rate (%)" type="number" value={item.appreciationRate} onChange={(e) => handleRealEstateChange(index, 'appreciationRate', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </List>
              <Button variant="outlined" onClick={handleAddRealEstate} style={{ marginTop: '10px' }}>
                Add Real Estate Asset
              </Button>
              <Box mt={3} p={2} border={1} borderColor="primary.light" borderRadius={2} bgcolor="primary.light" style={{ backgroundColor: 'rgba(0, 123, 255, 0.05)' }}>
                <Typography variant="subtitle1" color="primary.main">AI Real Estate Insights:</Typography>
                <Typography variant="body2">
                  Your primary residence is projected to appreciate by 4% annually. AI suggests exploring a HELOC for potential investment opportunities.
                </Typography>
                <Typography variant="body2">
                  AI identifies high-growth real estate markets in the Southeast for potential rental property investments, with projected ROI of 8-10%.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* AI Business & Venture Capital Desk */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '25px', height: '500px', overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                AI Business & Venture Capital Desk <BusinessCenterIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Quantum AI provides valuation, growth projections, and strategic recommendations for your business ventures and private equity investments.
              </Typography>
              <List>
                {businessVentures.length === 0 && (
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: '15px' }}>
                    No business ventures added.
                  </Typography>
                )}
                {businessVentures.map((item, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Venture Name" value={item.name} onChange={(e) => handleBusinessVentureChange(index, 'name', e.target.value)} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Valuation" type="number" value={item.valuation} onChange={(e) => handleBusinessVentureChange(index, 'valuation', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Annual Profit" type="number" value={item.annualProfit} onChange={(e) => handleBusinessVentureChange(index, 'annualProfit', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Growth Rate (%)" type="number" value={item.growthRate} onChange={(e) => handleBusinessVentureChange(index, 'growthRate', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </List>
              <Button variant="outlined" onClick={handleAddBusinessVenture} style={{ marginTop: '10px' }}>
                Add Business Venture
              </Button>
              <Box mt={3} p={2} border={1} borderColor="secondary.light" borderRadius={2} bgcolor="secondary.light" style={{ backgroundColor: 'rgba(156, 39, 176, 0.05)' }}>
                <Typography variant="subtitle1" color="secondary.main">AI Business Intelligence:</Typography>
                <Typography variant="body2">
                  AI identifies key performance indicators (KPIs) for your ventures and suggests strategic pivots for accelerated growth.
                </Typography>
                <Typography variant="body2">
                  Quantum AI's predictive models forecast a 15% increase in valuation for your portfolio if recommended operational efficiencies are implemented.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* AI Global Market Insights & Predictive Analytics */}
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '25px' }}>
              <Typography variant="h5" gutterBottom>
                AI Global Market Insights & Predictive Analytics <PublicIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Harness the power of Quantum AI to gain real-time global market intelligence, identify emerging trends, and anticipate economic shifts.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box p={2} border={1} borderColor="grey.300" borderRadius={1} mb={2}>
                    <Typography variant="subtitle1">AI Market Sentiment Analysis:</Typography>
                    <Typography variant="body2">
                      Overall market sentiment: <Typography component="span" color="success.main">Bullish (78%)</Typography>. AI detects strong positive momentum in tech and renewable energy sectors.
                    </Typography>
                    <Typography variant="body2">
                      Geopolitical risk index: <Typography component="span" color="warning.main">Moderate (55%)</Typography>. AI highlights potential volatility in Eastern European markets.
                    </Typography>
                  </Box>
                  <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Typography variant="subtitle1">AI Economic Indicators Forecast:</Typography>
                    <Typography variant="body2">
                      Next quarter GDP growth (US): <Typography component="span" color="success.main">2.8% (AI Consensus)</Typography>.
                    </Typography>
                    <Typography variant="body2">
                      Inflation outlook (EU): <Typography component="span" color="error.main">Projected to remain elevated at 4.2%</Typography> for the next 6 months.
                    </Typography>
                    <Typography variant="body2">
                      AI predicts a 60% chance of a minor market correction in Q3, primarily impacting overvalued growth stocks.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box p={2} border={1} borderColor="grey.300" borderRadius={1} mb={2}>
                    <Typography variant="subtitle1">AI ESG Impact Analysis:</Typography>
                    <Typography variant="body2">
                      Top ESG performing sectors: Renewable Energy, Sustainable Agriculture, Green Technology.
                    </Typography>
                    <Typography variant="body2">
                      AI identifies companies with strong governance and social responsibility metrics, outperforming peers by an average of 1.5% annually.
                    </Typography>
                    <Typography variant="body2">
                      Your portfolio's ESG alignment score: <Typography component="span" color="primary.main">72/100</Typography>. AI suggests specific fund reallocations to improve this by 10 points.
                    </Typography>
                  </Box>
                  <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Typography variant="subtitle1">AI Crypto & Web3 Insights:</Typography>
                    <Typography variant="body2">
                      AI sentiment for Bitcoin: <Typography component="span" color="success.main">Strong Buy</Typography> (short-term).
                    </Typography>
                    <Typography variant="body2">
                      Emerging Web3 projects with high potential: Decentralized Finance (DeFi) protocols with robust security audits.
                    </Typography>
                    <Typography variant="body2">
                      AI warns of increased regulatory scrutiny in the NFT market, advising caution for new investments.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* AI Financial Literacy & Education Hub */}
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '25px' }}>
              <Typography variant="h5" gutterBottom>
                AI Financial Literacy & Education Hub <SchoolIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Personalized learning paths, AI-generated summaries of complex financial topics, and interactive simulations to empower your financial knowledge.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Typography variant="subtitle1">AI Learning Path: "Mastering Retirement Planning"</Typography>
                    <Typography variant="body2">
                      Your AI Co-Pilot has curated a personalized learning path based on your current knowledge gaps and financial goals. Modules include: Advanced Tax Strategies for Retirement, Estate Planning Essentials, and Global Pension Systems.
                    </Typography>
                    <Button size="small" style={{ marginTop: '10px' }} onClick={() => showSnackbar('Launching personalized learning path...')}>Start Learning</Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Typography variant="subtitle1">AI Summary: "Understanding Derivatives"</Typography>
                    <Typography variant="body2">
                      Quantum AI provides a concise, easy-to-understand summary of complex financial instruments like options, futures, and swaps, tailored to your learning style.
                    </Typography>
                    <Button size="small" style={{ marginTop: '10px' }} onClick={() => showSnackbar('Generating AI summary...')}>Read Summary</Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Typography variant="subtitle1">AI Simulation: "Market Crash Resilience"</Typography>
                    <Typography variant="body2">
                      Test your portfolio's resilience against historical market crashes using AI-powered simulations. Learn how different asset allocations perform under stress.
                    </Typography>
                    <Button size="small" style={{ marginTop: '10px' }} onClick={() => showSnackbar('Starting AI simulation...')}>Run Simulation</Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* AI-Powered Legacy Builder */}
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '25px' }}>
              <Typography variant="h5" gutterBottom>
                AI-Powered Legacy Builder <CorporateFareIcon fontSize="small" />
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Design your enduring legacy with AI-guided estate planning, philanthropic strategies, and intergenerational wealth transfer optimization.
              </Typography>
              <List>
                {legacyAssets.length === 0 && (
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: '15px' }}>
                    No legacy assets defined.
                  </Typography>
                )}
                {legacyAssets.map((item, index) => (
                  <Box key={index} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Asset Type" value={item.type} onChange={(e) => handleLegacyAssetChange(index, 'type', e.target.value)} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Value" type="number" value={item.value} onChange={(e) => handleLegacyAssetChange(index, 'value', parseFloat(e.target.value))} margin="dense" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Beneficiary" value={item.beneficiary} onChange={(e) => handleLegacyAssetChange(index, 'beneficiary', e.target.value)} margin="dense" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Notes" multiline rows={1} value={item.notes} onChange={(e) => handleLegacyAssetChange(index, 'notes', e.target.value)} margin="dense" />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </List>
              <Button variant="outlined" onClick={handleAddLegacyAsset} style={{ marginTop: '10px' }}>
                Add Legacy Asset
              </Button>
              <Box mt={3} p={2} border={1} borderColor="info.light" borderRadius={2} bgcolor="info.light" style={{ backgroundColor: 'rgba(0, 188, 212, 0.05)' }}>
                <Typography variant="subtitle1" color="info.main">AI Legacy Optimization:</Typography>
                <Typography variant="body2">
                  AI recommends establishing a revocable living trust to streamline asset distribution and minimize probate costs, potentially saving your beneficiaries 5-10% of your estate value.
                </Typography>
                <Typography variant="body2">
                  Explore AI-identified philanthropic opportunities that align with your values and offer significant tax advantages.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* The Sovereign Vision Statement */}
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '25px', marginTop: '20px', textAlign: 'center' }}>
              <Typography variant="h4" style={{ marginBottom: '20px' }}>
                The Quantum AI Financial Platform: A Vision for Global Financial Sovereignty
              </Typography>
              <Typography variant="h6" style={{ marginBottom: '15px' }}>
                Authored by the Quantum AI Collective
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '30px', lineHeight: '1.6' }}>
                At the heart of the Quantum AI Financial Platform lies a profound commitment to empowering individuals and businesses with unprecedented financial autonomy. We envision a future where financial systems are not merely transactional, but intelligent, predictive, and deeply personalized. Our platform, driven by advanced artificial intelligence, transcends traditional banking paradigms to offer a holistic ecosystem for wealth creation, preservation, and strategic growth. <br /><br />
                This is not just about managing money; it's about orchestrating financial destinies. Quantum AI acts as a benevolent co-pilot, providing real-time insights, proactive recommendations, and predictive analytics across every facet of your financial life – from intricate retirement planning and dynamic investment strategies to sophisticated tax optimization and enduring legacy building. We believe in a future where financial complexity is demystified, opportunities are universally accessible, and every decision is informed by the most advanced intelligence available. <br /><br />
                Our mission is to foster a new era of financial sovereignty, where users are equipped with the tools and knowledge to navigate global markets, mitigate risks, and achieve their most ambitious financial aspirations. We are building the foundational operating system for the next millennium of commerce and personal finance, a testament to human ingenuity amplified by the power of ethical, transparent, and transformative AI. This is the dawn of true financial democracy, where intelligence serves the highest good, ensuring prosperity and equity for all.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar for notifications - using existing Typography and Box to simulate */}
      {snackbarOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(33, 33, 33, 0.9)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '250px',
          }}
        >
          <Typography variant="body2">{snackbarMessage}</Typography>
          <Button size="small" style={{ color: 'white', marginLeft: '15px' }} onClick={handleSnackbarClose}>
            Dismiss
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default RetirementPlanner;