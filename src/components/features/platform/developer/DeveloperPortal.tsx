
import React from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const DeveloperPortal = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Developer Portal
      </Typography>

      <Grid container spacing={3}>
        {/* API Documentation */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              API Documentation
            </Typography>
            <Typography variant="body1">
              Explore our comprehensive API documentation to understand how to integrate with our platform.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/developer/api-docs" // Replace with the actual route
              sx={{ mt: 2 }}
            >
              View API Docs
            </Button>
          </Paper>
        </Grid>

        {/* SDKs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              SDKs (Software Development Kits)
            </Typography>
            <Typography variant="body1">
              Download SDKs for various programming languages to streamline your development process.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/developer/sdks" // Replace with the actual route
              sx={{ mt: 2 }}
            >
              Download SDKs
            </Button>
          </Paper>
        </Grid>

        {/* Sandbox Environment */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Sandbox Environment
            </Typography>
            <Typography variant="body1">
              Test your integrations in a safe and isolated sandbox environment before deploying to production.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/developer/sandbox" // Replace with the actual route
              sx={{ mt: 2 }}
            >
              Access Sandbox
            </Button>
          </Paper>
        </Grid>

        {/* Support Resources */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Support Resources
            </Typography>
            <Typography variant="body1">
              Find helpful resources, tutorials, and community forums to assist you with your development efforts.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/developer/support" // Replace with the actual route
              sx={{ mt: 2 }}
            >
              Get Support
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeveloperPortal;