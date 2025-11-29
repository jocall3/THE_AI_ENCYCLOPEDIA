import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { NotificationProvider } from './context/NotificationContext';

const theme = createTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStateProvider>
        <AuthProvider>
          <DataProvider>
            <AnalyticsProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </AnalyticsProvider>
          </DataProvider>
        </AuthProvider>
      </GlobalStateProvider>
    </ThemeProvider>
  </React.StrictMode>
);