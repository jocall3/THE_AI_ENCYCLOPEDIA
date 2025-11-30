import React, { useState, FormEvent, ChangeEvent } from 'react';
// NOTE: Retaining legacy CSS import, assuming it provides necessary structure styling.

// =================================================================================
// REFACTORING RATIONALE: SECURITY AND MVP SCOPING (Goals 3 & 6)
// The previous implementation listed over 200 sensitive API keys, designed to be 
// input by users on the frontend and POSTed to the backend. This pattern is a severe 
// security vulnerability (high surface area for leakage) and violates production standards 
// which mandate using secure vault solutions (like AWS Secrets Manager/Vault) for credentials.
// 
// This view has been dramatically simplified to ONLY configure the essential 
// third-party integration credentials required for the core MVP 
// (Multi-bank aggregation via Plaid/Stripe, AI transaction intelligence via OpenAI). 
// All other previously listed keys must be managed securely on the backend via environment 
// variables and dedicated secrets management systems.
// =================================================================================

interface MvpApiKeysState {
  // === Financial Aggregation & Payments (Core MVP) ===
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  STRIPE_SECRET_KEY: string;
  
  // === AI Intelligence (Core MVP) ===
  OPENAI_API_KEY: string;

  [key: string]: string; // Index signature for dynamic access
}


const FinancialDemocracyView: React.FC = () => {
  // Initialize state with only the required MVP keys
  const [keys, setKeys] = useState<MvpApiKeysState>({
    PLAID_CLIENT_ID: '',
    PLAID_SECRET: '',
    STRIPE_SECRET_KEY: '',
    OPENAI_API_KEY: '',
  });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Removed activeTab state as the view is now unified and scoped.

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys(prevKeys => ({ ...prevKeys, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setStatusMessage('Saving essential MVP configuration keys securely via main process...');
    
    // Basic validation before sending
    const requiredKeys = Object.keys(keys) as (keyof MvpApiKeysState)[];
    const missingKeys = requiredKeys.filter(k => !keys[k]);
    
    if (missingKeys.length > 0) {
        setStatusMessage(`Error: Missing required keys: ${missingKeys.join(', ')}.`);
        setIsSaving(false);
        return;
    }

    try {
      // Use Electron's IPC to securely save keys via the main process.
      // This assumes a preload script has exposed ipcRenderer on window.electron.
      const result = await (window as any).electron.ipcRenderer.invoke('save-mvp-integrations', keys);
      
      if (result.success) {
        setStatusMessage(`Success: ${result.message}`);
      } else {
        // If the main process returns a failure, treat it as an error.
        throw new Error(result.message || 'An unknown error occurred in the main process.');
      }
    } catch (error) {
      console.error('API Key Save Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Check main process logs.';
      setStatusMessage(`Error: Could not save keys. ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (keyName: keyof MvpApiKeysState, label: string) => (
    <div key={keyName} className="input-group">
      <label htmlFor={keyName}>{label}</label>
      <input
        // Must use type="password" for sensitive credentials.
        type="password"
        id={keyName}
        name={keyName}
        value={keys[keyName] || ''}
        onChange={handleInputChange}
        placeholder={`Enter ${label}`}
        required
      />
    </div>
  );

  return (
    <div className="settings-container">
      <h1>MVP Integration Configuration Console</h1>
      <p className="subtitle">
        Securely configure the essential integrations required for the financial dashboard MVP. 
        (Note: All other legacy API keys must be managed via backend vault systems.)
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-section">
          <h2>Financial Aggregation & Payments</h2>
          <p>These keys enable core transaction fetching and payment connectivity.</p>
          {renderInput('PLAID_CLIENT_ID', 'Plaid Client ID')}
          {renderInput('PLAID_SECRET', 'Plaid Secret')}
          {renderInput('STRIPE_SECRET_KEY', 'Stripe Secret Key (Development/Test)')}
        </div>

        <div className="form-section">
          <h2>AI & Transaction Intelligence</h2>
          <p>This key powers categorization, anomaly detection, and smart alerts using large language models.</p>
          {renderInput('OPENAI_API_KEY', 'OpenAI API Key')}
        </div>
        
        <div className="form-footer">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving Configuration...' : 'Save Essential Configuration'}
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default FinancialDemocracyView;