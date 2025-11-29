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
      setStatusMessage('Error: Could not save keys. Please check backend server.');
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
            {renderInput('WORLDPAY_API_KEY', 'Worldpay API Key')}
            {renderInput('CHECKOUT_SECRET_KEY', 'Checkout.com Secret Key')}
        </div>
        <div className="form-section">
            <h2>Banking as a Service (BaaS) & Card Issuing</h2>
            {renderInput('MARQETA_APPLICATION_TOKEN', 'Marqeta Application Token')}
            {renderInput('MARQETA_ADMIN_ACCESS_TOKEN', 'Marqeta Admin Access Token')}
            {renderInput('GALILEO_API_LOGIN', 'Galileo API Login')}
            {renderInput('GALILEO_API_TRANS_KEY', 'Galileo API Trans Key')}
            {renderInput('SOLARISBANK_CLIENT_ID', 'Solarisbank Client ID')}
            {renderInput('SOLARISBANK_CLIENT_SECRET', 'Solarisbank Client Secret')}
            {renderInput('SYNAPSE_CLIENT_ID', 'Synapse Client ID')}
            {renderInput('SYNAPSE_CLIENT_SECRET', 'Synapse Client Secret')}
            {renderInput('RAILSBANK_API_KEY', 'Railsbank API Key')}
            {renderInput('CLEARBANK_API_KEY', 'ClearBank API Key')}
            {renderInput('UNIT_API_TOKEN', 'Unit API Token')}
            {renderInput('TREASURY_PRIME_API_KEY', 'Treasury Prime API Key')}
            {renderInput('INCREASE_API_KEY', 'Increase API Key')}
            {renderInput('MERCURY_API_KEY', 'Mercury API Key')}
            {renderInput('BREX_API_KEY', 'Brex API Key')}
            {renderInput('BOND_API_KEY', 'Bond API Key')}
        </div>
        <div className="form-section">
            <h2>International Payments</h2>
            {renderInput('CURRENCYCLOUD_LOGIN_ID', 'Currencycloud Login ID')}
            {renderInput('CURRENCYCLOUD_API_KEY', 'Currencycloud API Key')}
            {renderInput('OFX_API_KEY', 'OFX API Key')}
            {renderInput('WISE_API_TOKEN', 'Wise API Token')}
            {renderInput('REMITLY_API_KEY', 'Remitly API Key')}
            {renderInput('AZIMO_API_KEY', 'Azimo API Key')}
            {renderInput('NIUM_API_KEY', 'Nium API Key')}
        </div>
        <div className="form-section">
            <h2>Investment & Market Data</h2>
            {renderInput('ALPACA_API_KEY_ID', 'Alpaca API Key ID')}
            {renderInput('ALPACA_SECRET_KEY', 'Alpaca Secret Key')}
            {renderInput('TRADIER_ACCESS_TOKEN', 'Tradier Access Token')}
            {renderInput('IEX_CLOUD_API_TOKEN', 'IEX Cloud API Token')}
            {renderInput('POLYGON_API_KEY', 'Polygon API Key')}
            {renderInput('FINNHUB_API_KEY', 'Finnhub API Key')}
            {renderInput('ALPHA_VANTAGE_API_KEY', 'Alpha Vantage API Key')}
            {renderInput('MORNINGSTAR_API_KEY', 'Morningstar API Key')}
            {renderInput('XIGNITE_API_TOKEN', 'Xignite API Token')}
            {renderInput('DRIVEWEALTH_API_KEY', 'DriveWealth API Key')}
        </div>
        <div className="form-section">
            <h2>Crypto</h2>
            {renderInput('COINBASE_API_KEY', 'Coinbase API Key')}
            {renderInput('COINBASE_API_SECRET', 'Coinbase API Secret')}
            {renderInput('BINANCE_API_KEY', 'Binance API Key')}
            {renderInput('BINANCE_API_SECRET', 'Binance API Secret')}
            {renderInput('KRAKEN_API_KEY', 'Kraken API Key')}
            {renderInput('KRAKEN_PRIVATE_KEY', 'Kraken Private Key')}
            {renderInput('GEMINI_API_KEY', 'Gemini API Key')}
            {renderInput('GEMINI_API_SECRET', 'Gemini API Secret')}
            {renderInput('COINMARKETCAP_API_KEY', 'CoinMarketCap API Key')}
            {renderInput('COINGECKO_API_KEY', 'CoinGecko API Key')}
            {renderInput('BLOCKIO_API_KEY', 'Block.io API Key')}
        </div>
        <div className="form-section">
            <h2>Major Banks (Open Banking)</h2>
            {renderInput('JP_MORGAN_CHASE_CLIENT_ID', 'JP Morgan Chase Client ID')}
            {renderInput('CITI_CLIENT_ID', 'Citi Client ID')}
            {renderInput('WELLS_FARGO_CLIENT_ID', 'Wells Fargo Client ID')}
            {renderInput('CAPITAL_ONE_CLIENT_ID', 'Capital One Client ID')}
        </div>
        <div className="form-section">
            <h2>European & Global Banks (Open Banking)</h2>
            {renderInput('HSBC_CLIENT_ID', 'HSBC Client ID')}
            {renderInput('BARCLAYS_CLIENT_ID', 'Barclays Client ID')}
            {renderInput('BBVA_CLIENT_ID', 'BBVA Client ID')}
            {renderInput('DEUTSCHE_BANK_API_KEY', 'Deutsche Bank API Key')}
        </div>
        <div className="form-section">
            <h2>UK & European Aggregators</h2>
            {renderInput('TINK_CLIENT_ID', 'Tink Client ID')}
            {renderInput('TRUELAYER_CLIENT_ID', 'TrueLayer Client ID')}
        </div>
        <div className="form-section">
            <h2>Compliance & Identity (KYC/AML)</h2>
            {renderInput('MIDDESK_API_KEY', 'Middesk API Key')}
            {renderInput('ALLOY_API_TOKEN', 'Alloy API Token')}
            {renderInput('ALLOY_API_SECRET', 'Alloy API Secret')}
            {renderInput('COMPLYADVANTAGE_API_KEY', 'ComplyAdvantage API Key')}
        </div>
        <div className="form-section">
            <h2>Real Estate</h2>
            {renderInput('ZILLOW_API_KEY', 'Zillow API Key')}
            {renderInput('CORELOGIC_CLIENT_ID', 'CoreLogic Client ID')}
        </div>
        <div className="form-section">
            <h2>Credit Bureaus</h2>
            {renderInput('EXPERIAN_API_KEY', 'Experian API Key')}
            {renderInput('EQUIFAX_API_KEY', 'Equifax API Key')}
            {renderInput('TRANSUNION_API_KEY', 'TransUnion API Key')}
        </div>
        <div className="form-section">
            <h2>Global Payments (Emerging Markets)</h2>
            {renderInput('FINCRA_API_KEY', 'Fincra API Key')}
            {renderInput('FLUTTERWAVE_SECRET_KEY', 'Flutterwave Secret Key')}
            {renderInput('PAYSTACK_SECRET_KEY', 'Paystack Secret Key')}
            {renderInput('DLOCAL_API_KEY', 'dLocal API Key')}
            {renderInput('RAPYD_ACCESS_KEY', 'Rapyd Access Key')}
        </div>
        <div className="form-section">
            <h2>Accounting & Tax</h2>
            {renderInput('TAXJAR_API_KEY', 'TaxJar API Key')}
            {renderInput('AVALARA_API_KEY', 'Avalara API Key')}
            {renderInput('CODAT_API_KEY', 'Codat API Key')}
            {renderInput('XERO_CLIENT_ID', 'Xero Client ID')}
            {renderInput('XERO_CLIENT_SECRET', 'Xero Client Secret')}
            {renderInput('QUICKBOOKS_CLIENT_ID', 'QuickBooks Client ID')}
            {renderInput('QUICKBOOKS_CLIENT_SECRET', 'QuickBooks Client Secret')}
            {renderInput('FRESHBOOKS_API_KEY', 'FreshBooks API Key')}
        </div>
        <div className="form-section">
            <h2>Fintech Utilities</h2>
            {renderInput('ANVIL_API_KEY', 'Anvil API Key')}
            {renderInput('MOOV_CLIENT_ID', 'Moov Client ID')}
            {renderInput('MOOV_SECRET', 'Moov Secret')}
            {renderInput('VGS_USERNAME', 'VGS Username')}
            {renderInput('VGS_PASSWORD', 'VGS Password')}
            {renderInput('SILA_APP_HANDLE', 'Sila App Handle')}
            {renderInput('SILA_PRIVATE_KEY', 'Sila Private Key')}
        </div>

        <div className="form-footer">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Banking & Finance API Keys'}
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
    </form>
  );
};

export default BankingApiSettings;