// src/pages/ApiSettingsPage.tsx (Main container)

import React, { useState, Suspense, lazy } from 'react';
import './ApiSettingsPage.css';

const TechApiSettings = lazy(() => import('./TechApiSettings'));
const BankingApiSettings = lazy(() => import('./BankingApiSettings'));

const ApiSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tech' | 'banking'>('tech');

  return (
    <div className="settings-container">
      <h1>API Credentials Console</h1>
      <p className="subtitle">Securely manage credentials for all integrated services. These are sent to and stored on your backend.</p>
      
      <div className="tabs">
        <button onClick={() => setActiveTab('tech')} className={activeTab === 'tech' ? 'active' : ''}>Tech APIs</button>
        <button onClick={() => setActiveTab('banking')} className={activeTab === 'banking' ? 'active' : ''}>Banking & Finance APIs</button>
      </div>
      
      <Suspense fallback={<div className="loading-suspense">Loading settings...</div>}>
        {activeTab === 'tech' ? <TechApiSettings /> : <BankingApiSettings />}
      </Suspense>
    </div>
  );
};

export default ApiSettingsPage;