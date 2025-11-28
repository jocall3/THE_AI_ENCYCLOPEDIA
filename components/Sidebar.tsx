import React from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';

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
                <div className="flex items-center justify-center h-20 border-b border-gray-700/50 px-4">
                    <DemoBankLogo className="w-10 h-10 text-cyan-400" />
                    <h1 className="text-xl font-bold ml-2 text-white">DEMO BANK</h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.map(section => (
                        <div key={section.title}>
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.title}</h3>
                            <div className="mt-2 space-y-1">
                                {section.items.map(item => (
                                    <a
                                        key={item.id}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(item.id);
                                        }}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${ 
                                            activeView === item.id 
                                            ? 'text-white bg-cyan-500/20' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                        }`}
                                    >
                                        <div className={`mr-3 h-5 w-5 ${activeView === item.id ? 'text-cyan-300' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                            {item.icon}
                                        </div>
                                        <span>{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;