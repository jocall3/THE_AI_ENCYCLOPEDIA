// src/pages/ApiSettingsPage.tsx

import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './ApiSettingsPage.css'; // This CSS will be provided in Part 2

// =================================================================================
// The complete interface for all 200+ API credentials
// =================================================================================
interface ApiKeysState {
  // === Tech APIs ===
  // Core Infrastructure & Cloud
  STRIPE_SECRET_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  SENDGRID_API_KEY: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AZURE_CLIENT_ID: string;
  AZURE_CLIENT_SECRET: string;
  GOOGLE_CLOUD_API_KEY: string;

  // Deployment & DevOps
  DOCKER_HUB_USERNAME: string;
  DOCKER_HUB_ACCESS_TOKEN: string;
  HEROKU_API_KEY: string;
  NETLIFY_PERSONAL_ACCESS_TOKEN: string;
  VERCEL_API_TOKEN: string;
  CLOUDFLARE_API_TOKEN: string;
  DIGITALOCEAN_PERSONAL_ACCESS_TOKEN: string;
  LINODE_PERSONAL_ACCESS_TOKEN: string;
  TERRAFORM_API_TOKEN: string;

  // Collaboration & Productivity
  GITHUB_PERSONAL_ACCESS_TOKEN: string;
  SLACK_BOT_TOKEN: string;
  DISCORD_BOT_TOKEN: string;
  TRELLO_API_KEY: string;
  TRELLO_API_TOKEN: string;
  JIRA_USERNAME: string;
  JIRA_API_TOKEN: string;
  ASANA_PERSONAL_ACCESS_TOKEN: string;
  NOTION_API_KEY: string;
  AIRTABLE_API_KEY: string;

  // File & Data Storage
  DROPBOX_ACCESS_TOKEN: string;
  BOX_DEVELOPER_TOKEN: string;
  GOOGLE_DRIVE_API_KEY: string;
  ONEDRIVE_CLIENT_ID: string;

  // CRM & Business
  SALESFORCE_CLIENT_ID: string;
  SALESFORCE_CLIENT_SECRET: string;
  HUBSPOT_API_KEY: string;
  ZENDESK_API_TOKEN: string;
  INTERCOM_ACCESS_TOKEN: string;
  MAILCHIMP_API_KEY: string;

  // E-commerce
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  BIGCOMMERCE_ACCESS_TOKEN: string;
  MAGENTO_ACCESS_TOKEN: string;
  WOOCOMMERCE_CLIENT_KEY: string;
  WOOCOMMERCE_CLIENT_SECRET: string;
  
  // Authentication & Identity
  STYTCH_PROJECT_ID: string;
  STYTCH_SECRET: string;
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  OKTA_DOMAIN: string;
  OKTA_API_TOKEN: string;

  // Backend & Databases
  FIREBASE_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;

  // API Development
  POSTMAN_API_KEY: string;
  APOLLO_GRAPH_API_KEY: string;

  // AI & Machine Learning
  OPENAI_API_KEY: string;
  HUGGING_FACE_API_TOKEN: string;
  GOOGLE_CLOUD_AI_API_KEY: string;
  AMAZON_REKOGNITION_ACCESS_KEY: string;
  MICROSOFT_AZURE_COGNITIVE_KEY: string;
  IBM_WATSON_API_KEY: string;

  // Search & Real-time
  ALGOLIA_APP_ID: string;
  ALGOLIA_ADMIN_API_KEY: string;
  PUSHER_APP_ID: string;
  PUSHER_KEY: string;
  PUSHER_SECRET: string;
  ABLY_API_KEY: string;
  ELASTICSEARCH_API_KEY: string;
  
  // Identity & Verification
  STRIPE_IDENTITY_SECRET_KEY: string;
  ONFIDO_API_TOKEN: string;
  CHECKR_API_KEY: string;
  
  // Logistics & Shipping
  LOB_API_KEY: string;
  EASYPOST_API_KEY: string;
  SHIPPO_API_TOKEN: string;

  // Maps & Weather
  GOOGLE_MAPS_API_KEY: string;
  MAPBOX_ACCESS_TOKEN: string;
  HERE_API_KEY: string;
  ACCUWEATHER_API_KEY: string;
  OPENWEATHERMAP_API_KEY: string;

  // Social & Media
  YELP_API_KEY: string;
  FOURSQUARE_API_KEY: string;
  REDDIT_CLIENT_ID: string;
  REDDIT_CLIENT_SECRET: string;
  TWITTER_BEARER_TOKEN: string;
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  INSTAGRAM_APP_ID: string;
  INSTAGRAM_APP_SECRET: string;
  YOUTUBE_DATA_API_KEY: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SOUNDCLOUD_CLIENT_ID: string;
  TWITCH_CLIENT_ID: string;
  TWITCH_CLIENT_SECRET: string;

  // Media & Content
  MUX_TOKEN_ID: string;
  MUX_TOKEN_SECRET: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  IMGIX_API_KEY: string;
  
  // Legal & Admin
  STRIPE_ATLAS_API_KEY: string;
  CLERKY_API_KEY: string;
  DOCUSIGN_INTEGRATOR_KEY: string;
  HELLOSIGN_API_KEY: string;
  
  // Monitoring & CI/CD
  LAUNCHDARKLY_SDK_KEY: string;
  SENTRY_AUTH_TOKEN: string;
  DATADOG_API_KEY: string;
  NEW_RELIC_API_KEY: string;
  CIRCLECI_API_TOKEN: string;
  TRAVIS_CI_API_TOKEN: string;
  BITBUCKET_USERNAME: string;
  BITBUCKET_APP_PASSWORD: string;
  GITLAB_PERSONAL_ACCESS_TOKEN: string;
  PAGERDUTY_API_KEY: string;
  
  // Headless CMS
  CONTENTFUL_SPACE_ID: string;
  CONTENTFUL_ACCESS_TOKEN: string;
  SANITY_PROJECT_ID: string;
  SANITY_API_TOKEN: string;
  STRAPI_API_TOKEN: string;

  // === Banking & Finance APIs ===
  // Data Aggregators
  PLAID_CLIENT_ID: string;
  PLAID_SECRET: string;
  YODLEE_CLIENT_ID: string;
  YODLEE_SECRET: string;
  MX_CLIENT_ID: string;
  MX_API_KEY: string;
  FINICITY_PARTNER_ID: string;
  FINICITY_APP_KEY: string;

  // Payment Processing
  ADYEN_API_KEY: string;
  ADYEN_MERCHANT_ACCOUNT: string;
  BRAINTREE_MERCHANT_ID: string;
  BRAINTREE_PUBLIC_KEY: string;
  BRAINTREE_PRIVATE_KEY: string;
  SQUARE_APPLICATION_ID: string;
  SQUARE_ACCESS_TOKEN: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_SECRET: string;
  DWOLLA_KEY: string;
  DWOLLA_SECRET: string;
  WORLDPAY_API_KEY: string;
  CHECKOUT_SECRET_KEY: string;
  
  // Banking as a Service (BaaS) & Card Issuing
  MARQETA_APPLICATION_TOKEN: string;
  MARQETA_ADMIN_ACCESS_TOKEN: string;
  GALILEO_API_LOGIN: string;
  GALILEO_API_TRANS_KEY: string;
  SOLARISBANK_CLIENT_ID: string;
  SOLARISBANK_CLIENT_SECRET: string;
  SYNAPSE_CLIENT_ID: string;
  SYNAPSE_CLIENT_SECRET: string;
  RAILSBANK_API_KEY: string;
  CLEARBANK_API_KEY: string;
  UNIT_API_TOKEN: string;
  TREASURY_PRIME_API_KEY: string;
  INCREASE_API_KEY: string;
  MERCURY_API_KEY: string;
  BREX_API_KEY: string;
  BOND_API_KEY: string;
  
  // International Payments
  CURRENCYCLOUD_LOGIN_ID: string;
  CURRENCYCLOUD_API_KEY: string;
  OFX_API_KEY: string;
  WISE_API_TOKEN: string;
  REMITLY_API_KEY: string;
  AZIMO_API_KEY: string;
  NIUM_API_KEY: string;
  
  // Investment & Market Data
  ALPACA_API_KEY_ID: string;
  ALPACA_SECRET_KEY: string;
  TRADIER_ACCESS_TOKEN: string;
  IEX_CLOUD_API_TOKEN: string;
  POLYGON_API_KEY: string;
  FINNHUB_API_KEY: string;
  ALPHA_VANTAGE_API_KEY: string;
  MORNINGSTAR_API_KEY: string;
  XIGNITE_API_TOKEN: string;
  DRIVEWEALTH_API_KEY: string;

  // Crypto
  COINBASE_API_KEY: string;
  COINBASE_API_SECRET: string;
  BINANCE_API_KEY: string;
  BINANCE_API_SECRET: string;
  KRAKEN_API_KEY: string;
  KRAKEN_PRIVATE_KEY: string;
  GEMINI_API_KEY: string;
  GEMINI_API_SECRET: string;
  COINMARKETCAP_API_KEY: string;
  COINGECKO_API_KEY: string;
  BLOCKIO_API_KEY: string;

  // Major Banks (Open Banking)
  JP_MORGAN_CHASE_CLIENT_ID: string;
  CITI_CLIENT_ID: string;
  WELLS_FARGO_CLIENT_ID: string;
  CAPITAL_ONE_CLIENT_ID: string;

  // European & Global Banks (Open Banking)
  HSBC_CLIENT_ID: string;
  BARCLAYS_CLIENT_ID: string;
  BBVA_CLIENT_ID: string;
  DEUTSCHE_BANK_API_KEY: string;

  // UK & European Aggregators
  TINK_CLIENT_ID: string;
  TRUELAYER_CLIENT_ID: string;

  // Compliance & Identity (KYC/AML)
  MIDDESK_API_KEY: string;
  ALLOY_API_TOKEN: string;
  ALLOY_API_SECRET: string;
  COMPLYADVANTAGE_API_KEY: string;

  // Real Estate
  ZILLOW_API_KEY: string;
  CORELOGIC_CLIENT_ID: string;

  // Credit Bureaus
  EXPERIAN_API_KEY: string;
  EQUIFAX_API_KEY: string;
  TRANSUNION_API_KEY: string;

  // Global Payments (Emerging Markets)
  FINCRA_API_KEY: string;
  FLUTTERWAVE_SECRET_KEY: string;
  PAYSTACK_SECRET_KEY: string;
  DLOCAL_API_KEY: string;
  RAPYD_ACCESS_KEY: string;
  
  // Accounting & Tax
  TAXJAR_API_KEY: string;
  AVALARA_API_KEY: string;
  CODAT_API_KEY: string;
  XERO_CLIENT_ID: string;
  XERO_CLIENT_SECRET: string;
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  FRESHBOOKS_API_KEY: string;
  
  // Fintech Utilities
  ANVIL_API_KEY: string;
  MOOV_CLIENT_ID: string;
  MOOV_SECRET: string;
  VGS_USERNAME: string;
  VGS_PASSWORD: string;
  SILA_APP_HANDLE: string;
  SILA_PRIVATE_KEY: string;
  
  [key: string]: string; // Index signature for dynamic access
}


const ApiSettingsPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeysState>({} as ApiKeysState);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tech' | 'banking'>('tech');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeys(prevKeys => ({ ...prevKeys, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('Saving keys securely to backend...');
    try {
      // NOTE: Using a hardcoded URL for demonstration. Replace with actual API endpoint.
      const response = await axios.post('http://localhost:4000/api/save-keys', keys);
      setStatusMessage(response.data.message);
    } catch (error) {
      setStatusMessage('Error: Could not save keys. Please check backend server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to render a single input field
  const renderInput = (keyName: keyof ApiKeysState, label: string) => (
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

  // Helper function to render a section of inputs based on keys
  const renderSection = (title: string, keysToRender: (keyof ApiKeysState)[]) => (
    <div className="form-section">
      <h2>{title}</h2>
      {keysToRender.map(keyName => {
        // Look up a friendly label based on the key name (or manually define if necessary)
        // Simple transformation: STRIPE_SECRET_KEY -> Stripe Secret Key
        const label = keyName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return renderInput(keyName, label);
      })}
    </div>
  );


  // =================================================================================
  // RENDER SECTIONS - Populating the UI with all 200+ fields
  // =================================================================================

  const renderTechApis = () => (
    <>
      {renderSection('Core Infrastructure & Cloud', [
        'STRIPE_SECRET_KEY', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'SENDGRID_API_KEY',
        'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET',
        'GOOGLE_CLOUD_API_KEY',
      ])}
      
      {renderSection('Deployment & DevOps', [
        'DOCKER_HUB_USERNAME', 'DOCKER_HUB_ACCESS_TOKEN', 'HEROKU_API_KEY', 'NETLIFY_PERSONAL_ACCESS_TOKEN',
        'VERCEL_API_TOKEN', 'CLOUDFLARE_API_TOKEN', 'DIGITALOCEAN_PERSONAL_ACCESS_TOKEN', 
        'LINODE_PERSONAL_ACCESS_TOKEN', 'TERRAFORM_API_TOKEN',
      ])}

      {renderSection('Collaboration & Productivity', [
        'GITHUB_PERSONAL_ACCESS_TOKEN', 'SLACK_BOT_TOKEN', 'DISCORD_BOT_TOKEN', 'TRELLO_API_KEY', 
        'TRELLO_API_TOKEN', 'JIRA_USERNAME', 'JIRA_API_TOKEN', 'ASANA_PERSONAL_ACCESS_TOKEN', 
        'NOTION_API_KEY', 'AIRTABLE_API_KEY',
      ])}

      {renderSection('File & Data Storage', [
        'DROPBOX_ACCESS_TOKEN', 'BOX_DEVELOPER_TOKEN', 'GOOGLE_DRIVE_API_KEY', 'ONEDRIVE_CLIENT_ID',
      ])}

      {renderSection('CRM & Business', [
        'SALESFORCE_CLIENT_ID', 'SALESFORCE_CLIENT_SECRET', 'HUBSPOT_API_KEY', 'ZENDESK_API_TOKEN', 
        'INTERCOM_ACCESS_TOKEN', 'MAILCHIMP_API_KEY',
      ])}

      {renderSection('E-commerce', [
        'SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET', 'BIGCOMMERCE_ACCESS_TOKEN', 'MAGENTO_ACCESS_TOKEN',
        'WOOCOMMERCE_CLIENT_KEY', 'WOOCOMMERCE_CLIENT_SECRET',
      ])}

      {renderSection('Authentication & Identity', [
        'STYTCH_PROJECT_ID', 'STYTCH_SECRET', 'AUTH0_DOMAIN', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET',
        'OKTA_DOMAIN', 'OKTA_API_TOKEN',
      ])}

      {renderSection('Backend & Databases', [
        'FIREBASE_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY',
      ])}
      
      {renderSection('API Development', [
        'POSTMAN_API_KEY', 'APOLLO_GRAPH_API_KEY',
      ])}
      
      {renderSection('AI & Machine Learning', [
        'OPENAI_API_KEY', 'HUGGING_FACE_API_TOKEN', 'GOOGLE_CLOUD_AI_API_KEY', 
        'AMAZON_REKOGNITION_ACCESS_KEY', 'MICROSOFT_AZURE_COGNITIVE_KEY', 'IBM_WATSON_API_KEY',
      ])}

      {renderSection('Search & Real-time', [
        'ALGOLIA_APP_ID', 'ALGOLIA_ADMIN_API_KEY', 'PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_SECRET',
        'ABLY_API_KEY', 'ELASTICSEARCH_API_KEY',
      ])}
      
      {renderSection('Identity & Verification', [
        'STRIPE_IDENTITY_SECRET_KEY', 'ONFIDO_API_TOKEN', 'CHECKR_API_KEY',
      ])}
      
      {renderSection('Logistics & Shipping', [
        'LOB_API_KEY', 'EASYPOST_API_KEY', 'SHIPPO_API_TOKEN',
      ])}

      {renderSection('Maps & Weather', [
        'GOOGLE_MAPS_API_KEY', 'MAPBOX_ACCESS_TOKEN', 'HERE_API_KEY', 'ACCUWEATHER_API_KEY', 'OPENWEATHERMAP_API_KEY',
      ])}

      {renderSection('Social & Media (Auth/Data)', [
        'YELP_API_KEY', 'FOURSQUARE_API_KEY', 'REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 
        'TWITTER_BEARER_TOKEN', 'FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET', 'INSTAGRAM_APP_ID',
        'INSTAGRAM_APP_SECRET', 'YOUTUBE_DATA_API_KEY', 'SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 
        'SOUNDCLOUD_CLIENT_ID', 'TWITCH_CLIENT_ID', 'TWITCH_CLIENT_SECRET',
      ])}

      {renderSection('Media & Content Delivery', [
        'MUX_TOKEN_ID', 'MUX_TOKEN_SECRET', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'IMGIX_API_KEY',
      ])}

      {renderSection('Legal & Admin', [
        'STRIPE_ATLAS_API_KEY', 'CLERKY_API_KEY', 'DOCUSIGN_INTEGRATOR_KEY', 'HELLOSIGN_API_KEY',
      ])}
      
      {renderSection('Monitoring & CI/CD', [
        'LAUNCHDARKLY_SDK_KEY', 'SENTRY_AUTH_TOKEN', 'DATADOG_API_KEY', 'NEW_RELIC_API_KEY',
        'CIRCLECI_API_TOKEN', 'TRAVIS_CI_API_TOKEN', 'BITBUCKET_USERNAME', 'BITBUCKET_APP_PASSWORD',
        'GITLAB_PERSONAL_ACCESS_TOKEN', 'PAGERDUTY_API_KEY',
      ])}

      {renderSection('Headless CMS', [
        'CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN', 'SANITY_PROJECT_ID', 'SANITY_API_TOKEN', 'STRAPI_API_TOKEN',
      ])}
    </>
  );

  const renderBankingApis = () => (
    <>
      {renderSection('Financial Data Aggregators', [
        'PLAID_CLIENT_ID', 'PLAID_SECRET', 'YODLEE_CLIENT_ID', 'YODLEE_SECRET', 
        'MX_CLIENT_ID', 'MX_API_KEY', 'FINICITY_PARTNER_ID', 'FINICITY_APP_KEY',
      ])}

      {renderSection('Payment Processing', [
        'ADYEN_API_KEY', 'ADYEN_MERCHANT_ACCOUNT', 'BRAINTREE_MERCHANT_ID', 'BRAINTREE_PUBLIC_KEY', 
        'BRAINTREE_PRIVATE_KEY', 'SQUARE_APPLICATION_ID', 'SQUARE_ACCESS_TOKEN', 'PAYPAL_CLIENT_ID', 
        'PAYPAL_SECRET', 'DWOLLA_KEY', 'DWOLLA_SECRET', 'WORLDPAY_API_KEY', 'CHECKOUT_SECRET_KEY',
      ])}

      {renderSection('Banking as a Service (BaaS) & Card Issuing', [
        'MARQETA_APPLICATION_TOKEN', 'MARQETA_ADMIN_ACCESS_TOKEN', 'GALILEO_API_LOGIN', 'GALILEO_API_TRANS_KEY', 
        'SOLARISBANK_CLIENT_ID', 'SOLARISBANK_CLIENT_SECRET', 'SYNAPSE_CLIENT_ID', 'SYNAPSE_CLIENT_SECRET', 
        'RAILSBANK_API_KEY', 'CLEARBANK_API_KEY', 'UNIT_API_TOKEN', 'TREASURY_PRIME_API_KEY', 
        'INCREASE_API_KEY', 'MERCURY_API_KEY', 'BREX_API_KEY', 'BOND_API_KEY',
      ])}
      
      {renderSection('International Payments', [
        'CURRENCYCLOUD_LOGIN_ID', 'CURRENCYCLOUD_API_KEY', 'OFX_API_KEY', 'WISE_API_TOKEN',
        'REMITLY_API_KEY', 'AZIMO_API_KEY', 'NIUM_API_KEY',
      ])}
      
      {renderSection('Investment & Market Data', [
        'ALPACA_API_KEY_ID', 'ALPACA_SECRET_KEY', 'TRADIER_ACCESS_TOKEN', 'IEX_CLOUD_API_TOKEN',
        'POLYGON_API_KEY', 'FINNHUB_API_KEY', 'ALPHA_VANTAGE_API_KEY', 'MORNINGSTAR_API_KEY', 
        'XIGNITE_API_TOKEN', 'DRIVEWEALTH_API_KEY',
      ])}

      {renderSection('Crypto Exchanges & Data', [
        'COINBASE_API_KEY', 'COINBASE_API_SECRET', 'BINANCE_API_KEY', 'BINANCE_API_SECRET', 
        'KRAKEN_API_KEY', 'KRAKEN_PRIVATE_KEY', 'GEMINI_API_KEY', 'GEMINI_API_SECRET', 
        'COINMARKETCAP_API_KEY', 'COINGECKO_API_KEY', 'BLOCKIO_API_KEY',
      ])}
      
      {renderSection('Major Banks (Open Banking)', [
        'JP_MORGAN_CHASE_CLIENT_ID', 'CITI_CLIENT_ID', 'WELLS_FARGO_CLIENT_ID', 'CAPITAL_ONE_CLIENT_ID',
      ])}

      {renderSection('European & Global Banks (Open Banking)', [
        'HSBC_CLIENT_ID', 'BARCLAYS_CLIENT_ID', 'BBVA_CLIENT_ID', 'DEUTSCHE_BANK_API_KEY',
      ])}

      {renderSection('UK & European Aggregators', [
        'TINK_CLIENT_ID', 'TRUELAYER_CLIENT_ID',
      ])}

      {renderSection('Compliance & Identity (KYC/AML)', [
        'MIDDESK_API_KEY', 'ALLOY_API_TOKEN', 'ALLOY_API_SECRET', 'COMPLYADVANTAGE_API_KEY',
      ])}

      {renderSection('Credit Bureaus', [
        'EXPERIAN_API_KEY', 'EQUIFAX_API_KEY', 'TRANSUNION_API_KEY',
      ])}
      
      {renderSection('Real Estate Data', [
        'ZILLOW_API_KEY', 'CORELOGIC_CLIENT_ID',
      ])}

      {renderSection('Global Payments (Emerging Markets)', [
        'FINCRA_API_KEY', 'FLUTTERWAVE_SECRET_KEY', 'PAYSTACK_SECRET_KEY', 'DLOCAL_API_KEY', 'RAPYD_ACCESS_KEY',
      ])}
      
      {renderSection('Accounting & Tax', [
        'TAXJAR_API_KEY', 'AVALARA_API_KEY', 'CODAT_API_KEY', 'XERO_CLIENT_ID', 'XERO_CLIENT_SECRET',
        'QUICKBOOKS_CLIENT_ID', 'QUICKBOOKS_CLIENT_SECRET', 'FRESHBOOKS_API_KEY',
      ])}
      
      {renderSection('Fintech Utilities', [
        'ANVIL_API_KEY', 'MOOV_CLIENT_ID', 'MOOV_SECRET', 'VGS_USERNAME', 'VGS_PASSWORD',
        'SILA_APP_HANDLE', 'SILA_PRIVATE_KEY',
      ])}
    </>
  );

  return (
    <div className="settings-container">
      <h1>API Credentials Console</h1>
      <p className="subtitle">Securely manage credentials for all integrated services. These are sent to and stored on your backend.</p>

      <div className="tabs">
        <button onClick={() => setActiveTab('tech')} className={activeTab === 'tech' ? 'active' : ''}>Tech APIs</button>
        <button onClick={() => setActiveTab('banking')} className={activeTab === 'banking' ? 'active' : ''}>Banking & Finance APIs</button>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {activeTab === 'tech' ? renderTechApis() : renderBankingApis()}
        
        <div className="form-footer">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save All Keys to Server'}
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default ApiSettingsPage;