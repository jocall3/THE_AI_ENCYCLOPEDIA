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
    const [isLoading, setIsLoading] = useState(true); // Start loading to check for existing session

    const handleCredentialResponse = useCallback((response: any) => {
        setIsLoading(true);
        const idToken = response.credential;
        const userObject = jwtDecode(idToken);
        
        if (userObject) {
            const newUser: User = {
                id: userObject.sub,
                name: userObject.name,
                email: userObject.email,
                picture: userObject.picture,
            };
            setUser(newUser);
            setIsAuthenticated(true);
        } else {
            // Handle decode error
            setIsAuthenticated(false);
            setUser(null);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const initializeGsi = () => {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
            });
            
            // Attempt to sign in user silently on load (One Tap)
            window.google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // This means One Tap is not shown, so the user is not automatically signed in.
                    // We can stop the loading indicator.
                    setIsLoading(false);
                }
            });
        };

        // Poll for the Google Identity Services library to be loaded.
        const checkGoogle = () => {
            if (window.google && window.google.accounts) {
                initializeGsi();
            } else {
                setTimeout(checkGoogle, 150);
            }
        };

        checkGoogle();

    }, [handleCredentialResponse]);

    const login = useCallback(() => {
        if (window.google && window.google.accounts) {
            // This will trigger the One Tap or sign-in pop-up
            window.google.accounts.id.prompt();
        } else {
            console.error("Google Identity Services not ready.");
            // Optionally, show a message to the user to try again.
        }
    }, []);

    const logout = useCallback(() => {
        if (window.google && window.google.accounts) {
            // Disables automatic sign-in for the next page load.
            window.google.accounts.id.disableAutoSelect();
        }
        setIsAuthenticated(false);
        setUser(null);
        // In a real app, you would also want to revoke the token.
    }, []);

    const value = { isAuthenticated, user, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};