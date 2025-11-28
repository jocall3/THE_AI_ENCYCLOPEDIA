import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { User } from '../types';

// Extend the Window interface to include the google object from the GSI script
declare global {
    interface Window {
        google: any;
    }
}

// Helper to decode JWT
// NOTE: This is a simplified version for demonstration and does not validate the token signature.
// In a production application, the ID token should always be sent to a backend server
// for secure validation and to establish a user session.
const jwtDecode = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};

interface IAuthContext {
    isAuthenticated: boolean;
    user: User | null;
    login: () => void;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

// The Client ID provided by the user.
const GOOGLE_CLIENT_ID = "555179712981-36hlicm802genhfo9iq1ufnp1n8cikt9.apps.googleusercontent.com";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleCredentialResponse = useCallback((response: any) => {
        setIsLoading(true);
        const idToken = response.credential;
        // In a real app, send this to your backend for validation and session creation.
        // For this demo, we'll decode it on the client (INSECURE for production).
        const decodedToken = jwtDecode(idToken);

        if (decodedToken) {
            const user: User = {
                id: decodedToken.sub,
                name: decodedToken.name,
                email: decodedToken.email,
                picture: decodedToken.picture,
            };
            setUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            console.error("Failed to decode token or token is invalid.");
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            // Programmatically trigger the Google One Tap prompt
            window.google.accounts.id.prompt();
        } else {
            console.error("Google GSI is not initialized or available.");
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        if (window.google && window.google.accounts) {
            window.google.accounts.id.disableAutoSelect();
        }
    }, []);

    useEffect(() => {
        if (typeof window.google === 'undefined' || !window.google.accounts) {
            console.log("Google GSI script not loaded yet.");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            // Don't auto-select an account on logout, wait for user interaction.
            auto_select: false
        });

    }, [handleCredentialResponse]);


    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};