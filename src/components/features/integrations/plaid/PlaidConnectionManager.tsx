
import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';

interface PlaidConnection {
  accountId: string;
  institutionName: string;
  lastUpdated?: string;
  balance?: number;
  currency?: string;
  error?: string;
}

interface PlaidConnectionManagerProps {
  userId: string; // Assuming we have a userId for the connected user.
  onRefreshConnections: () => void; // Function to trigger a refresh of the connection data.
  getConnections: () => Promise<PlaidConnection[]>; // Function to fetch the Plaid connections.
  refreshConnection: (accountId: string) => Promise<void>; // Function to refresh a specific connection
  linkToken?: string;
}

const PlaidConnectionManager: React.FC<PlaidConnectionManagerProps> = ({
  userId,
  onRefreshConnections,
  getConnections,
  refreshConnection,
  linkToken,
}) => {
  const [connections, setConnections] = useState<PlaidConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<string | null>(null); // accountId being refreshed
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getConnections();
        setConnections(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch connections");
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [getConnections, userId, onRefreshConnections]);

  const { open, ready } = usePlaidLink({
    token: linkToken, // Use the linkToken passed as a prop
    onSuccess: async (publicToken, metadata) => {
        // Handle successful connection - refresh connections after
        onRefreshConnections();
    },
    onExit: (err, metadata) => {
        // Handle Plaid Link exit
        if (err) {
            setError(err.message || 'Plaid Link exited with an error.');
        }
    },
  });

  const handleRefresh = async (accountId: string) => {
    setRefreshing(accountId);
    setError(null);
    try {
      await refreshConnection(accountId);
      // Optional: Refresh the connection list after the refresh
      await onRefreshConnections();
    } catch (err: any) {
      setError(err.message || 'Failed to refresh connection.');
    } finally {
      setRefreshing(null);
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Linked Accounts
      </Typography>
      {linkToken ? (
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                if (ready) {
                    open();
                } else {
                    setError("Plaid Link is not ready yet.");
                }
            }}
            disabled={!ready}
        >
          Link New Account
        </Button>
      ) : (
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
              Plaid Link Token Missing. Please ensure the linkToken is properly fetched and passed to this component.
          </Alert>
      )}

      {connections.length === 0 && !loading && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No accounts linked yet.
        </Typography>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {connections.map((connection) => (
          <Grid item xs={12} sm={6} md={4} key={connection.accountId}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {connection.institutionName}
                </Typography>
                {connection.error && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    <AlertTitle>Error</AlertTitle>
                    {connection.error}
                  </Alert>
                )}
                {connection.lastUpdated && (
                  <Typography variant="body2">
                    Last Updated: {new Date(connection.lastUpdated).toLocaleString()}
                  </Typography>
                )}
                {connection.balance !== undefined && (
                  <Typography variant="body2">
                    Balance: {connection.balance} {connection.currency}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleRefresh(connection.accountId)}
                  disabled={refreshing === connection.accountId}
                  sx={{ mt: 1 }}
                >
                  {refreshing === connection.accountId ? <CircularProgress size={20} /> : 'Refresh'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlaidConnectionManager;
