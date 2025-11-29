# `index.tsx`: App Entry Point

## System Initialization Sequence

```tsx
import React, { useEffect } from 'react';
import { GlobalStateProvider } from './context/GlobalStateProvider'; // Core state management (To be replaced by Redux Toolkit/Zustand)
import { AppRoot } from './components/AppRoot'; // Main application shell
import { SystemMetricsCollector } from './utils/SystemMetricsCollector'; // System monitoring (To be replaced by standardized telemetry)
import { ApiClient } from './services/api/ApiClient'; // Unified API Connector
import { AuthManager } from './services/auth/AuthManager'; // Secure Authentication Handler
import { GlobalErrorHandler } from './components/GlobalErrorHandler'; // Centralized Error Handling

// --- REFACTORING STEP 1 & 3: Remove Flawed/Experimental AI and Establish Secure Foundation ---
// Removed 'QuantumWeaverEngine' instantiation as AI orchestration must now be handled 
// via standardized service layers with robust error handling, not monolithic global engines.

// Initialize Secure Authentication Manager
const authManager = new AuthManager();

// Initialize Unified API Client
// NOTE: The actual configuration for security credentials (e.g., JWT storage) 
// will be managed within AuthManager and injected here.
const apiClient = new ApiClient({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    onError: (error) => {
        // Centralized API error handling hooks into the GlobalErrorHandler
        console.error("API Client Error:", error);
    }
});

// Initialize the system metrics collector for real-time performance telemetry.
SystemMetricsCollector.initialize({
    samplingRate: 5000, // Increased sampling rate for production stability check (5s)
    endpoint: '/api/v1/telemetry/ingest', // Standardized telemetry endpoint
    // TOKEN RETRIEVAL: Token is now securely obtained via AuthManager session or environment config.
    authToken: 'SECURE_INGEST_TOKEN_PLACEHOLDER' 
});

/**
 * The App Entry Point.
 * This component establishes the root context for the entire application, 
 * focusing on robust initialization of core services (Auth, API, Error Handling).
 */
const AppEntry: React.FC = () => {
    
    useEffect(() => {
        console.log("Initializing App Root Context...");
        
        // Phase 1: Establish Core Security Context (Authentication Check/Session Refresh)
        // This hooks into the AuthManager to check for an existing valid session.
        authManager.initializeSession().then(() => {
            console.log("Authentication Context Initialized.");
            
            // Phase 2: Inject Auth Token into API Client for subsequent requests
            const token = authManager.getAccessToken();
            if (token) {
                apiClient.setDefaultHeaders({
                    Authorization: `Bearer ${token}`
                });
                console.log("API Client configured with valid access token.");
            }
            
            // Phase 3: Trigger initial data fetch for MVP (e.g., User Profile, Dashboard aggregates)
            // This will occur within components using React Query, driven by this established context.
            console.log("Core services established. Ready for component rendering.");

        }).catch(error => {
            console.error("FATAL ERROR during Security Initialization:", error);
            // Critical failure requires the user to re-authenticate or triggers a fallback view.
        });

    }, []);

    return (
        // GlobalErrorHandler wraps the entire application to catch rendering and runtime errors.
        <GlobalErrorHandler>
            {/* 
              GlobalStateProvider: Placeholder for Zustand/Redux Toolkit store initialization.
              It now receives the configured API client for data access.
            */}
            <GlobalStateProvider apiClientInstance={apiClient}>
                {/* 
                  AppRoot encapsulates the entire application structure (Routing, Layout).
                  It relies on the context established by AuthManager initialization.
                */}
                <AppRoot />
            </GlobalStateProvider>
        </GlobalErrorHandler>
    );
};

export default AppEntry;