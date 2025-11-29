import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './ApiSettingsPage.css'; // This CSS file must be provided separately

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
      const response = await axios.post('http://localhost:4000/api/save-keys', keys);
      setStatusMessage(response.data.message);
    } catch (error) {
      setStatusMessage('Error: Could not save keys. Please check backend server.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to create user-friendly labels from CONSTANT names (e.g., STRIPE_SECRET_KEY -> Stripe Secret Key)
  const createLabel = (keyName: keyof ApiKeysState): string => {
    return keyName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace('Api', 'API')
      .replace('Id', 'ID')
      .replace('Sid', 'SID')
      .replace('Pat', 'PAT')
      .replace('Kyc', 'KYC')
      .replace('Aml', 'AML')
      .replace('Ci/cd', 'CI/CD')
      .replace('Us', 'US')
      .replace('Uk', 'UK');
  };

  const renderInput = (keyName: keyof ApiKeysState, label?: string) => (
    <div key={keyName} className="input-group">
      <label htmlFor={keyName}>{label || createLabel(keyName)}</label>
      <input
        type="password"
        id={keyName}
        name={keyName}
        value={keys[keyName] || ''}
        onChange={handleInputChange}
        placeholder={`Enter ${label || createLabel(keyName)}`}
      />
    </div>
  );

  const renderTechApis = () => (
    <>
      <div className="form-section">
        <h2>Core Infrastructure & Cloud</h2>
        {renderInput('STRIPE_SECRET_KEY')}
        {renderInput('TWILIO_ACCOUNT_SID')}
        {renderInput('TWILIO_AUTH_TOKEN')}
        {renderInput('SENDGRID_API_KEY')}
        {renderInput('AWS_ACCESS_KEY_ID')}
        {renderInput('AWS_SECRET_ACCESS_KEY')}
        {renderInput('AZURE_CLIENT_ID')}
        {renderInput('AZURE_CLIENT_SECRET')}
        {renderInput('GOOGLE_CLOUD_API_KEY')}
      </div>

      <div className="form-section">
        <h2>Deployment & DevOps</h2>
        {renderInput('DOCKER_HUB_USERNAME')}
        {renderInput('DOCKER_HUB_ACCESS_TOKEN')}
        {renderInput('HEROKU_API_KEY')}
        {renderInput('NETLIFY_PERSONAL_ACCESS_TOKEN')}
        {renderInput('VERCEL_API_TOKEN')}
        {renderInput('CLOUDFLARE_API_TOKEN')}
        {renderInput('DIGITALOCEAN_PERSONAL_ACCESS_TOKEN')}
        {renderInput('LINODE_PERSONAL_ACCESS_TOKEN')}
        {renderInput('TERRAFORM_API_TOKEN')}
      </div>

      <div className="form-section">
        <h2>Collaboration & Productivity</h2>
        {renderInput('GITHUB_PERSONAL_ACCESS_TOKEN')}
        {renderInput('SLACK_BOT_TOKEN')}
        {renderInput('DISCORD_BOT_TOKEN')}
        {renderInput('TRELLO_API_KEY')}
        {renderInput('TRELLO_API_TOKEN')}
        {renderInput('JIRA_USERNAME')}
        {renderInput('JIRA_API_TOKEN')}
        {renderInput('ASANA_PERSONAL_ACCESS_TOKEN')}
        {renderInput('NOTION_API_KEY')}
        {renderInput('AIRTABLE_API_KEY')}
      </div>

      <div className="form-section">
        <h2>File & Data Storage</h2>
        {renderInput('DROPBOX_ACCESS_TOKEN')}
        {renderInput('BOX_DEVELOPER_TOKEN')}
        {renderInput('GOOGLE_DRIVE_API_KEY')}
        {renderInput('ONEDRIVE_CLIENT_ID')}
      </div>

      <div className="form-section">
        <h2>CRM & Business</h2>
        {renderInput('SALESFORCE_CLIENT_ID')}
        {renderInput('SALESFORCE_CLIENT_SECRET')}
        {renderInput('HUBSPOT_API_KEY')}
        {renderInput('ZENDESK_API_TOKEN')}
        {renderInput('INTERCOM_ACCESS_TOKEN')}
        {renderInput('MAILCHIMP_API_KEY')}
      </div>

      <div className="form-section">
        <h2>E-commerce</h2>
        {renderInput('SHOPIFY_API_KEY')}
        {renderInput('SHOPIFY_API_SECRET')}
        {renderInput('BIGCOMMERCE_ACCESS_TOKEN')}
        {renderInput('MAGENTO_ACCESS_TOKEN')}
        {renderInput('WOOCOMMERCE_CLIENT_KEY')}
        {renderInput('WOOCOMMERCE_CLIENT_SECRET')}
      </div>
      
      <div className="form-section">
        <h2>Authentication & Identity</h2>
        {renderInput('STYTCH_PROJECT_ID')}
        {renderInput('STYTCH_SECRET')}
        {renderInput('AUTH0_DOMAIN')}
        {renderInput('AUTH0_CLIENT_ID')}
        {renderInput('AUTH0_CLIENT_SECRET')}
        {renderInput('OKTA_DOMAIN')}
        {renderInput('OKTA_API_TOKEN')}
      </div>

      <div className="form-section">
        <h2>Backend & Databases</h2>
        {renderInput('FIREBASE_API_KEY')}
        {renderInput('SUPABASE_URL')}
        {renderInput('SUPABASE_ANON_KEY')}
      </div>

      <div className="form-section">
        <h2>API Development Tools</h2>
        {renderInput('POSTMAN_API_KEY')}
        {renderInput('APOLLO_GRAPH_API_KEY')}
      </div>

      <div className="form-section">
        <h2>AI & Machine Learning</h2>
        {renderInput('OPENAI_API_KEY')}
        {renderInput('HUGGING_FACE_API_TOKEN')}
        {renderInput('GOOGLE_CLOUD_AI_API_KEY')}
        {renderInput('AMAZON_REKOGNITION_ACCESS_KEY')}
        {renderInput('MICROSOFT_AZURE_COGNITIVE_KEY')}
        {renderInput('IBM_WATSON_API_KEY')}
      </div>

      <div className="form-section">
        <h2>Search & Real-time</h2>
        {renderInput('ALGOLIA_APP_ID')}
        {renderInput('ALGOLIA_ADMIN_API_KEY')}
        {renderInput('PUSHER_APP_ID')}
        {renderInput('PUSHER_KEY')}
        {renderInput('PUSHER_SECRET')}
        {renderInput('ABLY_API_KEY')}
        {renderInput('ELASTICSEARCH_API_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Identity & Verification (Tech)</h2>
        {renderInput('STRIPE_IDENTITY_SECRET_KEY')}
        {renderInput('ONFIDO_API_TOKEN')}
        {renderInput('CHECKR_API_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Logistics & Shipping</h2>
        {renderInput('LOB_API_KEY')}
        {renderInput('EASYPOST_API_KEY')}
        {renderInput('SHIPPO_API_TOKEN')}
      </div>

      <div className="form-section">
        <h2>Maps & Weather</h2>
        {renderInput('GOOGLE_MAPS_API_KEY')}
        {renderInput('MAPBOX_ACCESS_TOKEN')}
        {renderInput('HERE_API_KEY')}
        {renderInput('ACCUWEATHER_API_KEY')}
        {renderInput('OPENWEATHERMAP_API_KEY')}
      </div>

      <div className="form-section">
        <h2>Social & Media Integrations</h2>
        {renderInput('YELP_API_KEY')}
        {renderInput('FOURSQUARE_API_KEY')}
        {renderInput('REDDIT_CLIENT_ID')}
        {renderInput('REDDIT_CLIENT_SECRET')}
        {renderInput('TWITTER_BEARER_TOKEN')}
        {renderInput('FACEBOOK_APP_ID')}
        {renderInput('FACEBOOK_APP_SECRET')}
        {renderInput('INSTAGRAM_APP_ID')}
        {renderInput('INSTAGRAM_APP_SECRET')}
        {renderInput('YOUTUBE_DATA_API_KEY')}
        {renderInput('SPOTIFY_CLIENT_ID')}
        {renderInput('SPOTIFY_CLIENT_SECRET')}
        {renderInput('SOUNDCLOUD_CLIENT_ID')}
        {renderInput('TWITCH_CLIENT_ID')}
        {renderInput('TWITCH_CLIENT_SECRET')}
      </div>

      <div className="form-section">
        <h2>Media & Content Delivery</h2>
        {renderInput('MUX_TOKEN_ID')}
        {renderInput('MUX_TOKEN_SECRET')}
        {renderInput('CLOUDINARY_API_KEY')}
        {renderInput('CLOUDINARY_API_SECRET')}
        {renderInput('IMGIX_API_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Legal & Admin Services</h2>
        {renderInput('STRIPE_ATLAS_API_KEY')}
        {renderInput('CLERKY_API_KEY')}
        {renderInput('DOCUSIGN_INTEGRATOR_KEY')}
        {renderInput('HELLOSIGN_API_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Monitoring & CI/CD</h2>
        {renderInput('LAUNCHDARKLY_SDK_KEY')}
        {renderInput('SENTRY_AUTH_TOKEN')}
        {renderInput('DATADOG_API_KEY')}
        {renderInput('NEW_RELIC_API_KEY')}
        {renderInput('CIRCLECI_API_TOKEN')}
        {renderInput('TRAVIS_CI_API_TOKEN')}
        {renderInput('BITBUCKET_USERNAME')}
        {renderInput('BITBUCKET_APP_PASSWORD')}
        {renderInput('GITLAB_PERSONAL_ACCESS_TOKEN')}
        {renderInput('PAGERDUTY_API_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Headless CMS</h2>
        {renderInput('CONTENTFUL_SPACE_ID')}
        {renderInput('CONTENTFUL_ACCESS_TOKEN')}
        {renderInput('SANITY_PROJECT_ID')}
        {renderInput('SANITY_API_TOKEN')}
        {renderInput('STRAPI_API_TOKEN')}
      </div>
    </>
  );

  const renderBankingApis = () => (
    <>
      <div className="form-section">
        <h2>Financial Data Aggregators</h2>
        {renderInput('PLAID_CLIENT_ID')}
        {renderInput('PLAID_SECRET')}
        {renderInput('YODLEE_CLIENT_ID')}
        {renderInput('YODLEE_SECRET')}
        {renderInput('MX_CLIENT_ID')}
        {renderInput('MX_API_KEY')}
        {renderInput('FINICITY_PARTNER_ID')}
        {renderInput('FINICITY_APP_KEY')}
      </div>

      <div className="form-section">
        <h2>Payment Processing & Gateways</h2>
        {renderInput('ADYEN_API_KEY')}
        {renderInput('ADYEN_MERCHANT_ACCOUNT')}
        {renderInput('BRAINTREE_MERCHANT_ID')}
        {renderInput('BRAINTREE_PUBLIC_KEY')}
        {renderInput('BRAINTREE_PRIVATE_KEY')}
        {renderInput('SQUARE_APPLICATION_ID')}
        {renderInput('SQUARE_ACCESS_TOKEN')}
        {renderInput('PAYPAL_CLIENT_ID')}
        {renderInput('PAYPAL_SECRET')}
        {renderInput('DWOLLA_KEY')}
        {renderInput('DWOLLA_SECRET')}
        {renderInput('WORLDPAY_API_KEY')}
        {renderInput('CHECKOUT_SECRET_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Banking as a Service (BaaS) & Issuing</h2>
        {renderInput('MARQETA_APPLICATION_TOKEN')}
        {renderInput('MARQETA_ADMIN_ACCESS_TOKEN')}
        {renderInput('GALILEO_API_LOGIN')}
        {renderInput('GALILEO_API_TRANS_KEY')}
        {renderInput('SOLARISBANK_CLIENT_ID')}
        {renderInput('SOLARISBANK_CLIENT_SECRET')}
        {renderInput('SYNAPSE_CLIENT_ID')}
        {renderInput('SYNAPSE_CLIENT_SECRET')}
        {renderInput('RAILSBANK_API_KEY')}
        {renderInput('CLEARBANK_API_KEY')}
        {renderInput('UNIT_API_TOKEN')}
        {renderInput('TREASURY_PRIME_API_KEY')}
        {renderInput('INCREASE_API_KEY')}
        {renderInput('MERCURY_API_KEY')}
        {renderInput('BREX_API_KEY')}
        {renderInput('BOND_API_KEY')}
      </div>
      
      <div className="form-section">
        <h2>International Payments & FX</h2>
        {renderInput('CURRENCYCLOUD_LOGIN_ID')}
        {renderInput('CURRENCYCLOUD_API_KEY')}
        {renderInput('OFX_API_KEY')}
        {renderInput('WISE_API_TOKEN')}
        {renderInput('REMITLY_API_KEY')}
        {renderInput('AZIMO_API_KEY')}
        {renderInput('NIUM_API_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Investment & Market Data</h2>
        {renderInput('ALPACA_API_KEY_ID')}
        {renderInput('ALPACA_SECRET_KEY')}
        {renderInput('TRADIER_ACCESS_TOKEN')}
        {renderInput('IEX_CLOUD_API_TOKEN')}
        {renderInput('POLYGON_API_KEY')}
        {renderInput('FINNHUB_API_KEY')}
        {renderInput('ALPHA_VANTAGE_API_KEY')}
        {renderInput('MORNINGSTAR_API_KEY')}
        {renderInput('XIGNITE_API_TOKEN')}
        {renderInput('DRIVEWEALTH_API_KEY')}
      </div>

      <div className="form-section">
        <h2>Crypto Exchanges & Data</h2>
        {renderInput('COINBASE_API_KEY')}
        {renderInput('COINBASE_API_SECRET')}
        {renderInput('BINANCE_API_KEY')}
        {renderInput('BINANCE_API_SECRET')}
        {renderInput('KRAKEN_API_KEY')}
        {renderInput('KRAKEN_PRIVATE_KEY')}
        {renderInput('GEMINI_API_KEY')}
        {renderInput('GEMINI_API_SECRET')}
        {renderInput('COINMARKETCAP_API_KEY')}
        {renderInput('COINGECKO_API_KEY')}
        {renderInput('BLOCKIO_API_KEY')}
      </div>

      <div className="form-section">
        <h2>Major US Banks (Open Banking)</h2>
        {renderInput('JP_MORGAN_CHASE_CLIENT_ID')}
        {renderInput('CITI_CLIENT_ID')}
        {renderInput('WELLS_FARGO_CLIENT_ID')}
        {renderInput('CAPITAL_ONE_CLIENT_ID')}
      </div>

      <div className="form-section">
        <h2>European & Global Banks (Open Banking)</h2>
        {renderInput('HSBC_CLIENT_ID')}
        {renderInput('BARCLAYS_CLIENT_ID')}
        {renderInput('BBVA_CLIENT_ID')}
        {renderInput('DEUTSCHE_BANK_API_KEY')}
      </div>

      <div className="form-section">
        <h2>UK & European Aggregators</h2>
        {renderInput('TINK_CLIENT_ID')}
        {renderInput('TRUELAYER_CLIENT_ID')}
      </div>

      <div className="form-section">
        <h2>Compliance, KYC/AML</h2>
        {renderInput('MIDDESK_API_KEY')}
        {renderInput('ALLOY_API_TOKEN')}
        {renderInput('ALLOY_API_SECRET')}
        {renderInput('COMPLYADVANTAGE_API_KEY')}
      </div>

      <div className="form-section">
        <h2>Real Estate Data</h2>
        {renderInput('ZILLOW_API_KEY')}
        {renderInput('CORELOGIC_CLIENT_ID')}
      </div>

      <div className="form-section">
        <h2>Credit Bureaus (US)</h2>
        {renderInput('EXPERIAN_API_KEY')}
        {renderInput('EQUIFAX_API_KEY')}
        {renderInput('TRANSUNION_API_KEY')}
      </div>

      <div className="form-section">
        <h2>Global Payments (Emerging Markets)</h2>
        {renderInput('FINCRA_API_KEY')}
        {renderInput('FLUTTERWAVE_SECRET_KEY')}
        {renderInput('PAYSTACK_SECRET_KEY')}
        {renderInput('DLOCAL_API_KEY')}
        {renderInput('RAPYD_ACCESS_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Accounting & Tax</h2>
        {renderInput('TAXJAR_API_KEY')}
        {renderInput('AVALARA_API_KEY')}
        {renderInput('CODAT_API_KEY')}
        {renderInput('XERO_CLIENT_ID')}
        {renderInput('XERO_CLIENT_SECRET')}
        {renderInput('QUICKBOOKS_CLIENT_ID')}
        {renderInput('QUICKBOOKS_CLIENT_SECRET')}
        {renderInput('FRESHBOOKS_API_KEY')}
      </div>
      
      <div className="form-section">
        <h2>Fintech Utilities (Tokenization/Compliance)</h2>
        {renderInput('ANVIL_API_KEY')}
        {renderInput('MOOV_CLIENT_ID')}
        {renderInput('MOOV_SECRET')}
        {renderInput('VGS_USERNAME')}
        {renderInput('VGS_PASSWORD')}
        {renderInput('SILA_APP_HANDLE')}
        {renderInput('SILA_PRIVATE_KEY')}
      </div>
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