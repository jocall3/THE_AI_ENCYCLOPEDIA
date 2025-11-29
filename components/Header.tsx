import React from 'react';
import { View } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mr-4 text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h1 className="text-xl font-bold text-white">THE AI ENCYCLOPEDIA</h1>
      </div>
    </header>
  );
};

export default Header;