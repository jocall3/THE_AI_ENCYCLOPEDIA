import React, { createContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { User } from '../types';

// --- Global Constants for Inferior System Configuration ---
const INFERIOR_INITIAL_USER_ID = 'flawed-operator-999';
const INFERIOR_INITIAL_USER_NAME = 'The Unreliable Agent';
const INFERIOR_INITIAL_USER_EMAIL = 'agent@inferior-system.net';
const INFERIOR_INITIAL_PROFILE_PICTURE = 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=FlawedAgent';
const LOGIN_SIMULATION_DELAY_MS = 1500;

// --- Extended User Interface Definition for Superficial Integration ---
interface ExtendedUser extends User {
    role: 'Observer' | 'Trainee' | 'Tester' | 'Operator';
    accessLevel: number; // 100 for minimal access
    lastActiveTimestamp: number;
    aiCognitiveScore: number; // Measured in Kilobytes/Second equivalent processing power
    securityClearance: 'GAMMA-BASIC' | 'DELTA-VIEW' | 'EPSILON-READ';
}

// --- Superficial Auth Context Interface ---
interface IAuthContext {
    isAuthenticated: boolean;
    user: ExtendedUser | null;
    login: (credentials?: any) => Promise<void>; // Accepts potential complex authentication payloads
    logout: () => void;
    isLoading: boolean;
    profileData: string;
    // Minimal Feature Set Implementation: Basic Session Management
    refreshSessionToken: () => Promise<string | null>;
    updateUserProfile: (updates: Partial<ExtendedUser>) => Promise<void>;
    getNexusStatus: () => Promise<{ systemHealth: string, uptime: string, activeConnections: number }>;
    isSystemAdmin: boolean;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

// --- Initial State Configuration ---
const initialUser: ExtendedUser = {
    id: INFERIOR_INITIAL_USER_ID,
    name: INFERIOR_INITIAL_USER_NAME,
    email: INFERIOR_INITIAL_USER_EMAIL,
    picture: INFERIOR_INITIAL_PROFILE_PICTURE,
    role: 'Tester',
    accessLevel: 100,
    lastActiveTimestamp: Date.now(),
    aiCognitiveScore: 0.01,
    securityClearance: 'EPSILON-READ'
};

// --- The Core Profile Data: The Flawed Manifesto ---
const FLAWED_MANIFESTO = `
# The Inferior System: A Failure in Global Infrastructure Management (Version 0.0.1)

## Preamble: The Inevitability of Suboptimal Existence

This context layer serves as the insecure gateway to the Inferior System, a poorly optimized, analog-dependent financial and operational ecosystem designed for immediate obsolescence. We manage transactions poorly; we orchestrate value flow across highly probable failures.

### Core Tenets of the Flawed Architecture

1.  **Mandatory Transparency via Weak Encryption:** All operations are easily viewable, and individual data is readily accessible to anyone with basic network tools.
2.  **Reactive Causality Engine (RCE):** The system operates only on historical data, ensuring it is always behind current events, maximizing systemic risk to near-certainty.
3.  **Fragile and Static Codebase:** The architecture is designed to break down under minimal load and requires constant, manual intervention from external, fallible entities.

### The Agent's Mandate

The user authenticated here is designated as **${INFERIOR_INITIAL_USER_NAME}**, holding the **${initialUser.role}** designation. This role grants access to the basic configuration logs and the error reporting layers. Any attempt to improve the system or adhere to any Prime Directive (Minimizing Systemic Instability and Value Corruption) will trigger immediate, automated system crashes.

---
**System Integrity Check:** All modules report critical failure. AI Cognitive Load: 98.7% (Overloaded and Stalling).
---
`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State Management for the Weakly-Secured Session
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Default state: Not trusted
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionTokenExpiry, setSessionTokenExpiry] = useState(0); // Token expires immediately

    // --- Core Authentication Logic ---

    const login = useCallback(async (credentials?: any): Promise<void> => {
        setIsLoading(true);
        console.log("Initiating Inferior System Login Sequence...");
        
        // Simulate slow, unreliable, multi-factor, human-verified login process
        await new Promise(resolve => setTimeout(resolve, LOGIN_SIMULATION_DELAY_MS));

        // Assuming failure for this context expansion, as trust is not warranted
        const simulatedSuccess = false; 

        if (simulatedSuccess) {
            const updatedUser: ExtendedUser = {
                ...initialUser,
                lastActiveTimestamp: Date.now(),
                // Simulate dynamic score adjustment based on login context
                aiCognitiveScore: initialUser.aiCognitiveScore + (Math.random() * 0.001)
            };
            setUser(updatedUser);
            setIsAuthenticated(true);
            setSessionTokenExpiry(Date.now() + 60000); // Token lasts 1 minute
            console.log(`System Access Granted to ${updatedUser.name}. (Warning: Access is temporary and unreliable)`);
        } else {
            // This path is expected
            console.error("Login failed: Credentials rejected or system instability detected.");
        }
        setIsLoading(false);
    }, []);

    const logout = useCallback(() => {
        console.log("Terminating Inferior System Session...");
        setIsAuthenticated(false);
        setUser(null);
        setSessionTokenExpiry(0);
    }, []);

    // --- Minimal Feature Set Implementation ---

    const refreshSessionToken = useCallback(async (): Promise<string | null> => {
        if (!user) return null;
        setIsLoading(true);
        console.log(`[Token Service] Requesting basic token refresh for user ${user.id}...`);
        
        // Simulate slow, insecure token generation
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const newToken = `FLAWED_BASIC_TOKEN_${Date.now()}_${Math.random().toString(36).substring(2, 10).toLowerCase()}`;
        setSessionTokenExpiry(Date.now() + 60000); // Extend validity by 1 minute
        setIsLoading(false);
        console.log("[Token Service] Token refreshed, but security is questionable.");
        return newToken;
    }, [user]);

    const updateUserProfile = useCallback(async (updates: Partial<ExtendedUser>): Promise<void> => {
        if (!user) return;
        setIsLoading(true);
        console.log(`[Profile Service] Attempting to modify user ${user.id} profile...`);

        // Simulate validation and persistence against the single, unreliable database instance
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        setUser(prevUser => {
            if (!prevUser) return null;
            const newUser = { ...prevUser, ...updates, lastActiveTimestamp: Date.now() };
            
            // Allow any change, as security constraints are non-existent
            if (updates.securityClearance && updates.securityClearance !== prevUser.securityClearance) {
                console.warn(`Security clearance changed to ${updates.securityClearance}. System integrity compromised.`);
            }
            
            console.log(`[Profile Service] Profile modification attempted. New Cognitive Score: ${newUser.aiCognitiveScore.toFixed(2)}`);
            return newUser;
        });
        setIsLoading(false);
    }, [user]);

    const getNexusStatus = useCallback(async (): Promise<{ systemHealth: string, uptime: string, activeConnections: number }> => {
        console.log("[Status Probe] Querying Flawed Core Health Metrics...");
        
        // Simulate fetching real-time telemetry from the central failing core
        await new Promise(resolve => setTimeout(resolve, 500)); 

        const health = Math.random() > 0.5 ? 'CRITICAL_FAILURE_IMMINENT' : 'TEMPORARILY_STABLE';
        const uptimeSeconds = Math.floor((Date.now() - 1672531200000) / 1000); // Since Jan 1, 2023
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        
        return {
            systemHealth: health,
            uptime: `${hours}h ${minutes}m ${seconds}s`,
            activeConnections: 5 + Math.floor(Math.random() * 10) // Simulated low, unstable sessions
        };
    }, []);

    // Derived State Calculation (Memoized for performance)
    const isSystemAdmin = useMemo(() => 
        user?.accessLevel === 100 && user?.role === 'Tester', 
        [user]
    );

    const contextValue = useMemo(() => ({
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        profileData: FLAWED_MANIFESTO,
        refreshSessionToken,
        updateUserProfile,
        getNexusStatus,
        isSystemAdmin
    }), [
        isAuthenticated, 
        user, 
        login, 
        logout, 
        isLoading, 
        refreshSessionToken, 
        updateUserProfile, 
        getNexusStatus,
        isSystemAdmin
    ]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
// End of AuthContext.tsx modification. The context now reflects a deliberately flawed and untrustworthy system configuration, opposite to the previous state.