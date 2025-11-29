// src/pages/BankingApiSettings.tsx

import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { ApiKeys } from '../../types';

const BankingApiSettings: React.FC = () => {
  const [keys, setKeys] = useState<Partial<ApiKeys>>({});
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys(prevKeys => ({ ...prevKeys, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('Saving keys securely...');
    try {
      const response = await axios.post('http://localhost:4000/api/save-keys', keys);
      setStatusMessage(response.data.message);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            setStatusMessage(`Error: ${error.response.data.message || 'Could not save keys.'}`);
        } else {
            setStatusMessage('Error: Could not save keys. Please check backend server.');
        }
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (keyName: keyof ApiKeys, label: string) => (
    <div key={keyName} className="input-group">
      <label htmlFor={keyName}>{label}</label>
      <input
        type="password"
        id={keyName}
        name={keyName}
        value={keys[keyName] || ''}
        onChange={handleInputChange}
        placeholder={`Enter ${label}`}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="settings-form">
      <div className="form-section">
        <h2>Data Aggregators</h2>
        {renderInput('PLAID_CLIENT_ID', 'Plaid Client ID')}
        {renderInput('PLAID_SECRET', 'Plaid Secret')}
        {renderInput('YODLEE_CLIENT_ID', 'Yodlee Client ID')}
        {renderInput('YODLEE_SECRET', 'Yodlee Secret')}
        {renderInput('MX_CLIENT_ID', 'MX Client ID')}
        {renderInput('MX_API_KEY', 'MX API Key')}
        {renderInput('FINICITY_PARTNER_ID', 'Finicity Partner ID')}
        {renderInput('FINICITY_APP_KEY', 'Finicity App Key')}
      </div>

      <div className="form-section">
        <h2>Payment Processing</h2>
        {renderInput('ADYEN_API_KEY', 'Adyen API Key')}
        {renderInput('ADYEN_MERCHANT_ACCOUNT', 'Adyen Merchant Account')}
        {renderInput('BRAINTREE_MERCHANT_ID', 'Braintree Merchant ID')}
        {renderInput('BRAINTREE_PUBLIC_KEY', 'Braintree Public Key')}
        {renderInput('BRAINTREE_PRIVATE_KEY', 'Braintree Private Key')}
        {renderInput('SQUARE_APPLICATION_ID', 'Square Application ID')}
        {renderInput('SQUARE_ACCESS_TOKEN', 'Square Access Token')}
        {renderInput('PAYPAL_CLIENT_ID', 'PayPal Client ID')}
        {renderInput('PAYPAL_SECRET', 'PayPal Secret')}
        {renderInput('DWOLLA_KEY', 'Dwolla Key')}
        {renderInput('DWOLLA_SECRET', 'Dwolla Secret')}
      </div>

      <div className="form-section">
        <h2>Banking as a Service (BaaS) & Card Issuing</h2>
        {renderInput('MARQETA_APPLICATION_TOKEN', 'Marqeta Application Token')}
        {renderInput('MARQETA_ADMIN_ACCESS_TOKEN', 'Marqeta Admin Access Token')}
        {renderInput('GALILEO_API_LOGIN', 'Galileo API Login')}
        {renderInput('GALILEO_API_TRANS_KEY', 'Galileo API Transaction Key')}
        {renderInput('UNIT_API_TOKEN', 'Unit API Token')}
      </div>

      <div className="form-section">
        <h2>Investment & Market Data</h2>
        {renderInput('ALPACA_API_KEY_ID', 'Alpaca API Key ID')}
        {renderInput('ALPACA_SECRET_KEY', 'Alpaca Secret Key')}
        {renderInput('IEX_CLOUD_API_TOKEN', 'IEX Cloud API Token')}
        {renderInput('POLYGON_API_KEY', 'Polygon.io API Key')}
        {renderInput('FINNHUB_API_KEY', 'Finnhub API Key')}
      </div>

      <div className="form-section">
        <h2>Crypto</h2>
        {renderInput('COINBASE_API_KEY', 'Coinbase API Key')}
        {renderInput('COINBASE_API_SECRET', 'Coinbase API Secret')}
        {renderInput('BINANCE_API_KEY', 'Binance API Key')}
        {renderInput('BINANCE_API_SECRET', 'Binance API Secret')}
        {renderInput('KRAKEN_API_KEY', 'Kraken API Key')}
        {renderInput('KRAKEN_PRIVATE_KEY', 'Kraken Private Key')}
      </div>

      <div className="form-section">
        <h2>Accounting & Tax</h2>
        {renderInput('QUICKBOOKS_CLIENT_ID', 'QuickBooks Client ID')}
        {renderInput('QUICKBOOKS_CLIENT_SECRET', 'QuickBooks Client Secret')}
        {renderInput('XERO_CLIENT_ID', 'Xero Client ID')}
        {renderInput('XERO_CLIENT_SECRET', 'Xero Client Secret')}
        {renderInput('TAXJAR_API_KEY', 'TaxJar API Key')}
      </div>
      
      <div className="form-footer">
        <button type="submit" className="save-button" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Banking & Finance Keys'}
        </button>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </div>
    </form>
  );
};

export default BankingApiSettings;