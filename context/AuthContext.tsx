import React, { createContext, useState, ReactNode } from 'react';
import { User } from '../types';

// NOTE: The entire Google Sign-In simulation has been removed based on user feedback.
// The application now defaults to an authenticated state with a mock user.

interface IAuthContext {
    isAuthenticated: boolean;
    user: User | null;
    login: () => void; // Kept for API compatibility, but will be a no-op.
    logout: () => void; // Kept for API compatibility, but will be a no-op.
    isLoading: boolean;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

// A default mock user to represent the authenticated state.
const mockUser: User = {
    id: '100000000000000000001',
    name: 'The Visionary',
    email: 'visionary@demobank.com',
    picture: 'https://i.pravatar.cc/150?u=visionary',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // The user is now always authenticated with the mock user.
    const [user] = useState<User | null>(mockUser);
    
    // isLoading is false as authentication is immediate.
    const [isLoading] = useState(false);

    // isAuthenticated is always true.
    const isAuthenticated = true;

    // Login and logout functions are now no-ops as the auth state is static.
    const login = () => {
        console.log("Login function is disabled. User is permanently authenticated.");
    };

    const logout = () => {
        console.log("Logout function is disabled. User is permanently authenticated.");
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};