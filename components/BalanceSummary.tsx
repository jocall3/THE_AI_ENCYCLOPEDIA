import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { AccountBalanceWallet, ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface BalanceSummaryProps {
  totalBalance: number | null;
  totalInflow: number | null;
  totalOutflow: number | null;
  currency: string;
  isLoading: boolean;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  totalBalance,
  totalInflow,
  totalOutflow,
  currency,
  isLoading,
}) => {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) {
      return <CircularProgress size={20} />;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Box className="balance-summary-container">
      <Grid container spacing={3}>
        {/* Total Balance Card */}
        <Grid item xs={12} md={4}>
          <Card className="summary-card total-balance-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalanceWallet className="card-icon" />
                <Typography variant="h6" component="h2" ml={1}>
                  Total Balance
                </Typography>
              </Box>
              <Typography variant="h4" component="p" className="balance-amount">
                {isLoading ? <CircularProgress /> : formatCurrency(totalBalance)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Across all connected accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Inflow Card */}
        <Grid item xs={12} md={4}>
          <Card className="summary-card inflow-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <ArrowUpward className="card-icon success-icon" />
                <Typography variant="h6" component="h2" ml={1}>
                  Total Inflow
                </Typography>
              </Box>
              <Typography variant="h4" component="p" className="inflow-amount">
                {isLoading ? <CircularProgress /> : formatCurrency(totalInflow)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Outflow Card */}
        <Grid item xs={12} md={4}>
          <Card className="summary-card outflow-card">
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <ArrowDownward className="card-icon error-icon" />
                <Typography variant="h6" component="h2" ml={1}>
                  Total Outflow
                </Typography>
              </Box>
              <Typography variant="h4" component="p" className="outflow-amount">
                {isLoading ? <CircularProgress /> : formatCurrency(totalOutflow)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BalanceSummary;