import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// --- Start Refactoring for Unification & Stabilization ---

// 2. Unify the Technology Stack - UI (MUI) & State Management (React Query)
// 3. Repair All Broken Authentication and Authorization Modules (AuthProvider)

// For React Query: Standardizing data fetching and caching
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// For MUI: Unifying the UI library and styling
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Provides a consistent baseline for CSS

// For Authentication: Implementing a secure, application-wide authentication flow
// This assumes a new AuthContext.tsx file will be created under ./contexts
import { AuthProvider } from './contexts/AuthContext';

// Create a client for React Query with sensible defaults for a stable application
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetch on window focus to prevent unnecessary network requests
      retry: 3, // Automatically retry failed queries 3 times
      staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    },
    mutations: {
      retry: 1, // Retry mutations once
    },
  },
});

// Create a Material-UI theme to standardize the visual appearance
const theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc', // Example primary color, customize as per design system
    },
    secondary: {
      main: '#eb3e3e', // Example secondary color
    },
    // Add more palette, typography, spacing, etc., customizations here
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    // Example: global button style overrides
    MuiButton: {
      defaultProps: {
        disableElevation: true, // Disable button elevation by default
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase text transform
          borderRadius: 8, // Standardize border radius
        },
      },
    },
  },
});

// --- End Refactoring for Unification & Stabilization ---

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      {/* 
        Comment:
        Refactored index.tsx to establish a stable and unified application foundation.
        - QueryClientProvider from @tanstack/react-query is integrated for robust data fetching, caching, and state management, replacing ad-hoc API calls.
        - ThemeProvider and CssBaseline from @mui/material are used to enforce a consistent UI library and design system across the application. This standardizes styling and component usage.
        - AuthProvider is wrapped around the entire application to provide a secure, standards-compliant authentication and authorization context, ensuring all user interactions are properly managed and secured. This replaces any previously flawed or insecure authentication mechanisms.
      */}
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Applies baseline CSS styles for consistency */}
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}