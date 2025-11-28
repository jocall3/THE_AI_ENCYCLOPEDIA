import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User } from '../types';

interface IAuthContext {
    isAuthenticated: boolean;
    user: User | null;
    login: () => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async () => {
        setIsLoading(true);
        // In a real app, this would involve an OAuth flow with Auth0,
        // exchanging a code for tokens, and fetching user profile.
        // Here, we simulate the process.
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockUser: User = {
            id: 'auth0|123456789',
            name: 'The Visionary',
            email: 'visionary@demobank.com',
            picture: '/path/to/avatar.png' // You can add a placeholder avatar if you want
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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
