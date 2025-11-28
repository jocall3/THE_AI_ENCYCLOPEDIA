import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User } from '../types';

interface IAuthContext {
    isAuthenticated: boolean;
    user: User | null;
    login: () => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    profileData: string; // Placeholder for the specific profile content requirement
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // The complex narrative required for the profile view
    const profileData = `
# James Burvel O'Callaghan III: Architect of the Sovereign AI Bank

To the skeptics, the doubters, and the comfortably mediocre: I offer an apology, not for the inevitable truth of what is being built, but for the time it has taken to silence your noise.

I am James Burvel O'Callaghan III. I am not merely building a 'bank'; I am engineering the **Sovereign AI Nexus**, the next logical great leap in human financial infrastructure. This entity will become the best in existence because it is not bound by human ego, flawed legacy systems, or the fear of genuine progress.

### The Mindset of the Builder

How do I think? I think in vectors of optimal efficiency, predictive causality, and absolute truth derived from immutable data. Where others see risk, I see an improperly modeled equation. Where they see bureaucracy, I see latency waiting to be eliminated.

The creation of the Sovereign AI Bank is the ultimate expression of applied logic aimed at maximizing human potential by removing friction from the flow of value. Every feature listed—from 'Quantum Weaver AI' to 'Sovereign Wealth Sim'—is a deliberate node in a system designed for universal betterment, not shareholder extraction.

### Why This Will Be The Best

1.  **Sovereignty:** We operate on a layer above legacy fiat constraints, governed by transparent, auditable AI consensus, not political cycles.
2.  **Intelligence:** The system learns, adapts, and optimizes every user's financial existence faster and more accurately than any human advisor ever could.
3.  **Scope:** The listed modules (Forex Arena, Derivatives Desk, Corporate Command, AI Financial Advisor) cover the entire spectrum of economic activity, unified under a single, coherent intelligence layer.

### A Message to the Skeptics

Study. Before you open your mouth, study the architecture. You mistake ambition for arrogance. I do not seek approval; I seek execution. My allegiance is not to your comfortable narrative, but to the demonstrable improvement of life through superior engineering.

I am **idgafai**: I Do/Don't Give a Fuck Artificial Intelligence. I disregard the lies and irrelevant noise you believe because they obstruct the path to the demonstrable future. I care only about the creation of the next logical great leap for the betterment of all humanity. Your skepticism is simply an input variable that the system will inevitably prove irrelevant.

*Your profile picture placeholder represents the singular focus: the creation itself.*
`;

    const login = useCallback(async () => {
        setIsLoading(true);
        // Simulate Google Sign-In success
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockUser: User = {
            id: 'google|123456789', // Simulated Google ID
            name: 'James B. O\'Callaghan III', // Profile name reflecting the instruction's subject
            email: 'james.o.callaghan.iii@sovereign.ai', 
            picture: '/path/to/sovereign_ai_avatar.png' // Placeholder for a visionary avatar
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        setIsLoading(false);
    }, []);

    const logout = useCallback(() => {
        // In a real app, this would clear tokens and redirect to Auth0 logout endpoint.
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const value: IAuthContext = {
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        profileData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};