
import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Button, LinearProgress } from '@mui/material';

interface PortfolioAsset {
  assetName: string;
  targetPercentage: number;
  currentPercentage: number;
  amountNeeded: number;
}

const mockPortfolioData: PortfolioAsset[] = [
  { assetName: 'US Stocks', targetPercentage: 50, currentPercentage: 45, amountNeeded: 500 },
  { assetName: 'International Stocks', targetPercentage: 30, currentPercentage: 35, amountNeeded: -500 },
  { assetName: 'Bonds', targetPercentage: 20, currentPercentage: 20, amountNeeded: 0 },
];

const AutomatedPortfolioRebalancer = () => {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>(mockPortfolioData);
  const [rebalancing, setRebalancing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // In a real application, this would fetch the user's actual portfolio data.
    // You would likely use an API call to retrieve this data from a backend server.
    // For this example, we're using mock data.
  }, []);

  const handleRebalance = async () => {
    setRebalancing(true);
    setProgress(0);

    // Simulate a rebalancing process with delays.
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(i);

      // Simulate adjustments to the portfolio.
      setPortfolio(prevPortfolio => {
        return prevPortfolio.map(asset => {
          // Simulate buying US Stocks
          if (asset.assetName === 'US Stocks' && i > 0 && i <= 50) {
            return { ...asset, currentPercentage: asset.currentPercentage + 0.1 * (asset.targetPercentage - asset.currentPercentage) };
          }
          // Simulate selling International Stocks
          else if (asset.assetName === 'International Stocks' && i > 50) {
             return { ...asset, currentPercentage: asset.currentPercentage + 0.1 * (asset.targetPercentage - asset.currentPercentage) };
          }

          return asset;
        });
      });
    }

    setRebalancing(false);
    setProgress(100);
  };

  const calculateTotalAmountNeeded = (): number => {
    return portfolio.reduce((sum, asset) => sum + asset.amountNeeded, 0);
  };

  const totalAmountNeeded = calculateTotalAmountNeeded();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Automated Portfolio Rebalancer
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          This tool automatically rebalances your portfolio to maintain your target asset allocation.
        </Typography>

        <Grid container spacing={2}>
          {portfolio.map((asset) => (
            <Grid item xs={12} sm={6} key={asset.assetName}>
              <Typography variant="subtitle1">{asset.assetName}</Typography>
              <Typography variant="body2">Target: {asset.targetPercentage}%</Typography>
              <Typography variant="body2">Current: {asset.currentPercentage.toFixed(2)}%</Typography>
              {asset.amountNeeded !== 0 && (
                  <Typography variant="body2">Amount Needed: ${asset.amountNeeded}</Typography>
              )}

            </Grid>
          ))}
        </Grid>

        {rebalancing && (
          <>
            <Typography variant="body2">Rebalancing in progress...</Typography>
            <LinearProgress variant="determinate" value={progress} />
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleRebalance}
          disabled={rebalancing}
        >
          {rebalancing ? 'Rebalancing...' : 'Rebalance Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AutomatedPortfolioRebalancer;