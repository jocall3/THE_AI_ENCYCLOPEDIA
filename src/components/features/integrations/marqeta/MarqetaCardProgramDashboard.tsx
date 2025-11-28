
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Define the theme (optional, for custom styling)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color
    },
  },
});

interface MarqetaCardProgramDashboardProps {
  // Define any props needed for the component
  // For example:
  // onProgramCreated: (programData: any) => void;
}

const MarqetaCardProgramDashboard: React.FC<MarqetaCardProgramDashboardProps> = ({
  // onProgramCreated,
}) => {
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [cardProgramType, setCardProgramType] = useState(''); // e.g., "Prepaid", "Credit", "Debit"
  const [fundingSource, setFundingSource] = useState(''); // e.g., "Bank Account", "Visa", "Mastercard"
  const [issuerConfig, setIssuerConfig] = useState('');
  const [fulfillmentOptions, setFulfillmentOptions] = useState({
    physicalCards: false,
    virtualCards: true,
    digitalWallets: true,
  });

  const [rules, setRules] = useState({
    transactionLimit: 0,
    dailySpendLimit: 0,
    merchantCategoryRestrictions: [],
    // Add other rules as needed
  });

  const [merchantCategoryOptions, setMerchantCategoryOptions] = useState<string[]>([]); //  Fetch these dynamically from an API or predefined list

  useEffect(() => {
    //  Fetch merchant category options on component mount.  Replace with actual API call.
    const fetchMerchantCategories = async () => {
      // Simulate API call
      const dummyCategories = ['Grocery Stores', 'Restaurants', 'Gas Stations', 'Online Retailers'];
      setMerchantCategoryOptions(dummyCategories);
    };

    fetchMerchantCategories();
  }, []);

  const handleCreateProgram = () => {
    // Implement program creation logic here
    const programData = {
      name: programName,
      description: programDescription,
      type: cardProgramType,
      fundingSource,
      issuerConfig,
      fulfillment: fulfillmentOptions,
      rules,
    };

    console.log('Creating program:', programData);

    //  Optionally, call the onProgramCreated prop if provided
    //  onProgramCreated?.(programData);

    // Reset form after submission (optional)
    setProgramName('');
    setProgramDescription('');
    setCardProgramType('');
    setFundingSource('');
    setIssuerConfig('');
    setFulfillmentOptions({ physicalCards: false, virtualCards: true, digitalWallets: true });
    setRules({ transactionLimit: 0, dailySpendLimit: 0, merchantCategoryRestrictions: [] });

    // Display a success message (consider using a snackbar)
  };


  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: '20px auto' }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Marqeta Card Program Configuration
          </Typography>

          <TextField
            label="Program Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
          />

          <TextField
            label="Program Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={programDescription}
            onChange={(e) => setProgramDescription(e.target.value)}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Card Program Type</InputLabel>
                <Select
                  value={cardProgramType}
                  onChange={(e) => setCardProgramType(e.target.value)}
                  label="Card Program Type"
                >
                  <MenuItem value="Prepaid">Prepaid</MenuItem>
                  <MenuItem value="Credit">Credit</MenuItem>
                  <MenuItem value="Debit">Debit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Funding Source</InputLabel>
                <Select
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value)}
                  label="Funding Source"
                >
                  <MenuItem value="Bank Account">Bank Account</MenuItem>
                  <MenuItem value="Visa">Visa</MenuItem>
                  <MenuItem value="Mastercard">Mastercard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            label="Issuer Configuration"
            variant="outlined"
            fullWidth
            margin="normal"
            value={issuerConfig}
            onChange={(e) => setIssuerConfig(e.target.value)}
          />

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="fulfillment-content" id="fulfillment-header">
              <Typography variant="h6">Fulfillment Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fulfillmentOptions.physicalCards}
                    onChange={(e) =>
                      setFulfillmentOptions({
                        ...fulfillmentOptions,
                        physicalCards: e.target.checked,
                      })
                    }
                  />
                }
                label="Physical Cards"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fulfillmentOptions.virtualCards}
                    onChange={(e) =>
                      setFulfillmentOptions({
                        ...fulfillmentOptions,
                        virtualCards: e.target.checked,
                      })
                    }
                  />
                }
                label="Virtual Cards"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fulfillmentOptions.digitalWallets}
                    onChange={(e) =>
                      setFulfillmentOptions({
                        ...fulfillmentOptions,
                        digitalWallets: e.target.checked,
                      })
                    }
                  />
                }
                label="Digital Wallets (e.g., Apple Pay, Google Pay)"
              />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="rules-content" id="rules-header">
              <Typography variant="h6">Program Rules</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Transaction Limit"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={rules.transactionLimit}
                onChange={(e) => setRules({ ...rules, transactionLimit: parseFloat(e.target.value) || 0 })}
              />

              <TextField
                label="Daily Spend Limit"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={rules.dailySpendLimit}
                onChange={(e) => setRules({ ...rules, dailySpendLimit: parseFloat(e.target.value) || 0 })}
              />

              {/* Merchant Category Restrictions  (Example - implement as needed) */}
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Merchant Category Restrictions</InputLabel>
                <Select
                  multiple
                  value={rules.merchantCategoryRestrictions}
                  onChange={(e) => setRules({ ...rules, merchantCategoryRestrictions: e.target.value as string[] })}
                  label="Merchant Category Restrictions"
                >
                  {merchantCategoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <Button variant="contained" color="primary" onClick={handleCreateProgram} sx={{ marginTop: 2 }}>
            Create Program
          </Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default MarqetaCardProgramDashboard;