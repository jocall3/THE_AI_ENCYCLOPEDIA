import React, { useContext } from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const DemoBankLogo: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4"/>
        <path d="M30 70V30H55C65 30 65 40 55 40H30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M55 70V30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
    const authContext = useContext(AuthContext);
    
    const handleNavClick = (view: View) => {
        setActiveView(view);
        setIsOpen(false); // Close sidebar on navigation
    };

    return (
        <>
            {/* Overlay */}
             <div 
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
             ></div>

            {/* Sidebar */}
            <div className={`flex flex-col w-64 bg-gray-900/50 backdrop-blur-lg border-r border-gray-700/50 fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center justify-center h-20 border-b border-gray-700/50 px-4 flex-shrink-0">
                     <DemoBankLogo className="h-10 w-10 text-cyan-400" />
                    <h1 className="text-xl font-bold text-white ml-3">DEMO BANK</h1>
                </div>
                <nav className="flex-grow px-2 py-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex items-center w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                                activeView === item.id 
                                    ? 'bg-cyan-500/20 text-cyan-200' 
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                        >
                            <div className="w-6 h-6 mr-3 text-cyan-300">{item.icon}</div>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                 <div className="flex-shrink-0 p-4 border-t border-gray-700/50">
                    <button
                        onClick={() => authContext?.logout()}
                        className="flex items-center w-full text-left px-3 py-2.5 text-sm font-medium rounded-md text-gray-400 hover:text-white hover:bg-red-600/50 transition-colors duration-150"
                    >
                         <LogOut className="w-5 h-5 mr-3"/>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;