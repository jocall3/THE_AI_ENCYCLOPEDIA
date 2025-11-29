import React, { useMemo, useCallback } from 'react';
import { View, NavItem, NavItemGroup } from '../types';
import { NAV_ITEMS } from '../constants';

// --- Standard Navigation Component: Handles routing and state management ---

/**
 * Standard system logo component.
 * Displays basic visual feedback based on system connectivity status.
 */
const EnterpriseSystemLogo: React.FC<{ className?: string; isSystemOnline: boolean }> = React.memo(({ className, isSystemOnline }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Core Structure */}
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" className="transition-colors duration-500" />
        
        {/* Dynamic AI Core Indicator - Pulsing based on system status */}
        <circle 
            cx="50" 
            cy="50" 
            r="15" 
            fill="currentColor" 
            className={`text-cyan-400 transition-opacity duration-500 ${isSystemOnline ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}
        />
        
        {/* Data Flow Lines (Stylized) */}
        <path d="M30 70V30H55C65 30 65 40 55 40H30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500/80"/>
        <path d="M55 70V30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500/80"/>
        
        {/* Subtle AI Brainwave Effect (Placeholder for complex SVG animation if context allowed) */}
        <path d="M40 50 Q 50 40, 60 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/50"/>
    </svg>
));

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    // Hypothetical props for advanced features (assuming context exists elsewhere)
    userProfile?: { name: string; role: string; aiConfidenceScore: number };
    systemStatus?: { isOnline: boolean; latencyMs: number };
}

/**
 * Primary navigation component for the Enterprise Operating System.
 * Manages view state and displays telemetry-driven contextual alerts.
 */
const Sidebar: React.FC<SidebarProps> = ({ 
    activeView, 
    setActiveView, 
    isOpen, 
    setIsOpen,
    userProfile,
    systemStatus
}) => {
    
    // Default values for initialization
    const defaultProfile = useMemo(() => ({ name: "System Administrator", role: "Core Operator", aiConfidenceScore: 99.9 }), []);
    const profile = userProfile || defaultProfile;
    
    const defaultStatus = useMemo(() => ({ isOnline: true, latencyMs: 12 }), []);
    const status = systemStatus || defaultStatus;

    // --- Contextual Alert Logic ---
    
    /**
     * Determines if a navigation item requires special attention based on analysis 
     * of current system state or user context.
     */
    const getContextualHighlight = useCallback((view: View): 'critical' | 'suggested' | 'none' => {
        if (view === 'Dashboard' && profile.aiConfidenceScore < 95) {
            return 'critical';
        }
        if (view === 'SecurityAudit' && !status.isOnline) {
            return 'critical';
        }
        if (view === 'DataIngestion' && status.latencyMs > 50) {
            return 'suggested';
        }
        return 'none';
    }, [profile.aiConfidenceScore, status.isOnline, status.latencyMs]);

    const handleNavClick = useCallback((view: View) => {
        setActiveView(view);
        // Standard mobile optimization: Close sidebar on navigation click if screen is small
        if (window.innerWidth < 1024) { 
            setIsOpen(false); 
        }
        // TODO: Implement event logging for usage analysis
    }, [setActiveView, setIsOpen]);

    // --- Render Components ---

    const NavItemRenderer: React.FC<{ subItem: NavItem }> = React.memo(({ subItem }) => {
        const isActive = activeView === subItem.view;
        const context = getContextualHighlight(subItem.view);
        
        let baseClasses = "flex items-center w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out group relative overflow-hidden";
        let textClasses = "ml-3 whitespace-nowrap";
        let iconClasses = "w-5 h-5 flex-shrink-0";

        let indicatorClasses = "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ease-out";

        if (isActive) {
            baseClasses += " bg-cyan-600/30 text-cyan-200 shadow-lg shadow-cyan-900/50";
            indicatorClasses += " bg-cyan-400 scale-y-100";
        } else {
            baseClasses += " text-gray-300 hover:bg-gray-700/70 hover:text-white";
            indicatorClasses += " bg-transparent group-hover:bg-gray-600/50 scale-y-50 group-hover:scale-y-100";
        }

        // Contextual Overrides
        if (context === 'critical') {
            baseClasses = baseClasses.replace(/text-gray-300|text-cyan-200/, 'text-red-400');
            baseClasses = baseClasses.replace(/hover:bg-gray-700\/70/, 'hover:bg-red-900/50');
            indicatorClasses = indicatorClasses.replace(/bg-cyan-400|bg-gray-600\/50/, 'bg-red-500');
        } else if (context === 'suggested') {
            baseClasses = baseClasses.replace(/text-gray-300|text-cyan-200/, 'text-yellow-400');
            baseClasses = baseClasses.replace(/hover:bg-gray-700\/70/, 'hover:bg-yellow-900/50');
            indicatorClasses += " bg-yellow-500/50";
        }

        return (
            <button
                key={subItem.view}
                onClick={() => handleNavClick(subItem.view)}
                className={baseClasses}
                aria-current={isActive ? 'page' : undefined}
            >
                <span className={indicatorClasses}></span>
                {subItem.icon ? (
                    <subItem.icon className={iconClasses} />
                ) : (
                    <div className={iconClasses}>?</div> // Fallback icon
                )}
                <span className={textClasses}>{subItem.title}</span>
                
                {/* Contextual Alert Badge */}
                {context !== 'none' && (
                    <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                        context === 'critical' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-gray-900'
                    }`}>
                        AI Alert
                    </span>
                )}
            </button>
        );
    });

    const NavGroupRenderer: React.FC<{ groupItem: NavItemGroup }> = React.memo(({ groupItem }) => (
        <div className="mt-4 pt-4 border-t border-gray-800/50">
            {/* Standard Group Title */}
            <h3 className="px-2 pb-2 text-xs font-extrabold text-gray-400 uppercase tracking-widest shadow-text">
                {groupItem.group}
                <span className="ml-2 text-cyan-500 text-[10px] font-mono">(System Group)</span>
            </h3>
            <div className="space-y-1">
                {groupItem.items.map(subItem => (
                    <NavItemRenderer key={subItem.view} subItem={subItem} />
                ))}
            </div>
        </div>
    ));

    // --- Main Layout ---
    return (
        <>
            {/* Overlay for Mobile/Tablet */}
             <div 
                className={`fixed inset-0 bg-black/70 z-30 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
             ></div>

            {/* Sidebar Container */}
            <div className={`flex flex-col w-72 bg-gray-900/80 backdrop-blur-xl border-r border-gray-700/60 fixed lg:sticky inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} lg:translate-x-0 lg:h-screen lg:flex-shrink-0`}>
                
                {/* Header Section */}
                <div className="flex items-center justify-between h-20 px-4 border-b border-gray-700/70 shadow-md">
                    <div className="flex items-center">
                        <EnterpriseSystemLogo className="h-10 w-10 text-cyan-400" isSystemOnline={status.isOnline} />
                        <span className="ml-3 text-2xl font-extrabold text-white tracking-tight">Enterprise OS</span>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="lg:hidden p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Close Menu"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* User Context Panel */}
                <div className="p-4 border-b border-gray-800/50 bg-gray-800/30">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {/* Avatar and Status Indicator */}
                            <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg border-2 border-green-400">
                                {profile.name[0]}
                            </div>
                            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 ${status.isOnline ? 'bg-green-500' : 'bg-red-500'}`} title={status.isOnline ? "System Operational" : "System Degraded"}></div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                            <p className="text-xs text-gray-400">{profile.role}</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>AI Trust Score:</span>
                            <span className={profile.aiConfidenceScore > 98 ? 'text-green-400' : 'text-yellow-400'}>{profile.aiConfidenceScore.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                            <div 
                                className={`h-1.5 rounded-full transition-all duration-500 ${profile.aiConfidenceScore > 98 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                                style={{ width: `${profile.aiConfidenceScore}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {NAV_ITEMS.map((groupItem, index) => (
                        <NavGroupRenderer key={index} groupItem={groupItem} />
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="p-3 border-t border-gray-800/70 bg-gray-900/90">
                    <div className="text-xs text-gray-500 flex justify-between items-center">
                        <span className="font-mono">Latency: {status.latencyMs}ms</span>
                        <span className={`font-bold ${status.isOnline ? 'text-green-400' : 'text-red-400'}`}>
                            {status.isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1 text-center">Enterprise System v10.0.1 - Secure Core</p>
                </div>
            </div>
        </>
    );
};

export default Sidebar;