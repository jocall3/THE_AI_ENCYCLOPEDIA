import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './ApiSettingsPage.css'; // Assuming this CSS file exists in the same directory structure, as suggested by the instructions.

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


const FinancialDemocracyView: React.FC = () => {
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
      // NOTE: Using localhost:4000 as per instruction's backend definition
      const response = await axios.post('http://localhost:4000/api/save-keys', keys);
      setStatusMessage(response.data.message);
    } catch (error) {
      setStatusMessage('Error: Could not save keys. Please check backend server.');
    } finally {
      setIsSaving(false);
    }
  };

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

  // Helper function to render a whole section based on keys provided
  const renderSection = (title: string, keysMap: [keyof ApiKeysState, string][]) => (
    <div className="form-section" key={title}>
      <h2>{title}</h2>
      {keysMap.map(([key, label]) => renderInput(key, label))}
    </div>
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
        {activeTab === 'tech' ? (
          <>
            {renderSection('Core Infrastructure & Cloud', [
              ['STRIPE_SECRET_KEY', 'Stripe Secret Key'],
              ['TWILIO_ACCOUNT_SID', 'Twilio Account SID'],
              ['TWILIO_AUTH_TOKEN', 'Twilio Auth Token'],
              ['SENDGRID_API_KEY', 'SendGrid API Key'],
              ['AWS_ACCESS_KEY_ID', 'AWS Access Key ID'],
              ['AWS_SECRET_ACCESS_KEY', 'AWS Secret Access Key'],
              ['AZURE_CLIENT_ID', 'Azure Client ID'],
              ['AZURE_CLIENT_SECRET', 'Azure Client Secret'],
              ['GOOGLE_CLOUD_API_KEY', 'Google Cloud API Key'],
            ])}

            {renderSection('Deployment & DevOps', [
              ['DOCKER_HUB_USERNAME', 'Docker Hub Username'],
              ['DOCKER_HUB_ACCESS_TOKEN', 'Docker Hub Access Token'],
              ['HEROKU_API_KEY', 'Heroku API Key'],
              ['NETLIFY_PERSONAL_ACCESS_TOKEN', 'Netlify PAT'],
              ['VERCEL_API_TOKEN', 'Vercel API Token'],
              ['CLOUDFLARE_API_TOKEN', 'Cloudflare API Token'],
              ['DIGITALOCEAN_PERSONAL_ACCESS_TOKEN', 'DigitalOcean PAT'],
              ['LINODE_PERSONAL_ACCESS_TOKEN', 'Linode PAT'],
              ['TERRAFORM_API_TOKEN', 'Terraform API Token'],
            ])}
            
            {renderSection('Collaboration & Productivity', [
              ['GITHUB_PERSONAL_ACCESS_TOKEN', 'GitHub PAT'],
              ['SLACK_BOT_TOKEN', 'Slack Bot Token'],
              ['DISCORD_BOT_TOKEN', 'Discord Bot Token'],
              ['TRELLO_API_KEY', 'Trello API Key'],
              ['TRELLO_API_TOKEN', 'Trello API Token'],
              ['JIRA_USERNAME', 'Jira Username'],
              ['JIRA_API_TOKEN', 'Jira API Token'],
              ['ASANA_PERSONAL_ACCESS_TOKEN', 'Asana PAT'],
              ['NOTION_API_KEY', 'Notion API Key'],
              ['AIRTABLE_API_KEY', 'Airtable API Key'],
            ])}
            
            {renderSection('File & Data Storage', [
              ['DROPBOX_ACCESS_TOKEN', 'Dropbox Access Token'],
              ['BOX_DEVELOPER_TOKEN', 'Box Developer Token'],
              ['GOOGLE_DRIVE_API_KEY', 'Google Drive API Key'],
              ['ONEDRIVE_CLIENT_ID', 'OneDrive Client ID'],
            ])}
            
            {renderSection('CRM & Business', [
              ['SALESFORCE_CLIENT_ID', 'Salesforce Client ID'],
              ['SALESFORCE_CLIENT_SECRET', 'Salesforce Client Secret'],
              ['HUBSPOT_API_KEY', 'HubSpot API Key'],
              ['ZENDESK_API_TOKEN', 'Zendesk API Token'],
              ['INTERCOM_ACCESS_TOKEN', 'Intercom Access Token'],
              ['MAILCHIMP_API_KEY', 'Mailchimp API Key'],
            ])}
            
            {renderSection('E-commerce', [
              ['SHOPIFY_API_KEY', 'Shopify API Key'],
              ['SHOPIFY_API_SECRET', 'Shopify API Secret'],
              ['BIGCOMMERCE_ACCESS_TOKEN', 'BigCommerce Access Token'],
              ['MAGENTO_ACCESS_TOKEN', 'Magento Access Token'],
              ['WOOCOMMERCE_CLIENT_KEY', 'WooCommerce Client Key'],
              ['WOOCOMMERCE_CLIENT_SECRET', 'WooCommerce Client Secret'],
            ])}
            
            {renderSection('Authentication & Identity', [
              ['STYTCH_PROJECT_ID', 'Stytch Project ID'],
              ['STYTCH_SECRET', 'Stytch Secret'],
              ['AUTH0_DOMAIN', 'Auth0 Domain'],
              ['AUTH0_CLIENT_ID', 'Auth0 Client ID'],
              ['AUTH0_CLIENT_SECRET', 'Auth0 Client Secret'],
              ['OKTA_DOMAIN', 'Okta Domain'],
              ['OKTA_API_TOKEN', 'Okta API Token'],
            ])}
            
            {renderSection('Backend & Databases', [
              ['FIREBASE_API_KEY', 'Firebase API Key'],
              ['SUPABASE_URL', 'Supabase URL'],
              ['SUPABASE_ANON_KEY', 'Supabase Anon Key'],
            ])}
            
            {renderSection('API Development', [
              ['POSTMAN_API_KEY', 'Postman API Key'],
              ['APOLLO_GRAPH_API_KEY', 'Apollo Graph API Key'],
            ])}
            
            {renderSection('AI & Machine Learning', [
              ['OPENAI_API_KEY', 'OpenAI API Key'],
              ['HUGGING_FACE_API_TOKEN', 'Hugging Face API Token'],
              ['GOOGLE_CLOUD_AI_API_KEY', 'Google Cloud AI API Key'],
              ['AMAZON_REKOGNITION_ACCESS_KEY', 'Amazon Rekognition Access Key'],
              ['MICROSOFT_AZURE_COGNITIVE_KEY', 'Azure Cognitive Key'],
              ['IBM_WATSON_API_KEY', 'IBM Watson API Key'],
            ])}
            
            {renderSection('Search & Real-time', [
              ['ALGOLIA_APP_ID', 'Algolia App ID'],
              ['ALGOLIA_ADMIN_API_KEY', 'Algolia Admin API Key'],
              ['PUSHER_APP_ID', 'Pusher App ID'],
              ['PUSHER_KEY', 'Pusher Key'],
              ['PUSHER_SECRET', 'Pusher Secret'],
              ['ABLY_API_KEY', 'Ably API Key'],
              ['ELASTICSEARCH_API_KEY', 'Elasticsearch API Key'],
            ])}
            
            {renderSection('Identity & Verification', [
              ['STRIPE_IDENTITY_SECRET_KEY', 'Stripe Identity Secret Key'],
              ['ONFIDO_API_TOKEN', 'Onfido API Token'],
              ['CHECKR_API_KEY', 'Checkr API Key'],
            ])}
            
            {renderSection('Logistics & Shipping', [
              ['LOB_API_KEY', 'Lob API Key'],
              ['EASYPOST_API_KEY', 'EasyPost API Key'],
              ['SHIPPO_API_TOKEN', 'Shippo API Token'],
            ])}
            
            {renderSection('Maps & Weather', [
              ['GOOGLE_MAPS_API_KEY', 'Google Maps API Key'],
              ['MAPBOX_ACCESS_TOKEN', 'Mapbox Access Token'],
              ['HERE_API_KEY', 'HERE API Key'],
              ['ACCUWEATHER_API_KEY', 'AccuWeather API Key'],
              ['OPENWEATHERMAP_API_KEY', 'OpenWeatherMap API Key'],
            ])}

            {renderSection('Social & Media', [
              ['YELP_API_KEY', 'Yelp API Key'],
              ['FOURSQUARE_API_KEY', 'Foursquare API Key'],
              ['REDDIT_CLIENT_ID', 'Reddit Client ID'],
              ['REDDIT_CLIENT_SECRET', 'Reddit Client Secret'],
              ['TWITTER_BEARER_TOKEN', 'Twitter Bearer Token'],
              ['FACEBOOK_APP_ID', 'Facebook App ID'],
              ['FACEBOOK_APP_SECRET', 'Facebook App Secret'],
              ['INSTAGRAM_APP_ID', 'Instagram App ID'],
              ['INSTAGRAM_APP_SECRET', 'Instagram App Secret'],
              ['YOUTUBE_DATA_API_KEY', 'YouTube Data API Key'],
              ['SPOTIFY_CLIENT_ID', 'Spotify Client ID'],
              ['SPOTIFY_CLIENT_SECRET', 'Spotify Client Secret'],
              ['SOUNDCLOUD_CLIENT_ID', 'SoundCloud Client ID'],
              ['TWITCH_CLIENT_ID', 'Twitch Client ID'],
              ['TWITCH_CLIENT_SECRET', 'Twitch Client Secret'],
            ])}
            
            {renderSection('Media & Content', [
              ['MUX_TOKEN_ID', 'Mux Token ID'],
              ['MUX_TOKEN_SECRET', 'Mux Token Secret'],
              ['CLOUDINARY_API_KEY', 'Cloudinary API Key'],
              ['CLOUDINARY_API_SECRET', 'Cloudinary API Secret'],
              ['IMGIX_API_KEY', 'Imgix API Key'],
            ])}
            
            {renderSection('Legal & Admin', [
              ['STRIPE_ATLAS_API_KEY', 'Stripe Atlas API Key'],
              ['CLERKY_API_KEY', 'Clerky API Key'],
              ['DOCUSIGN_INTEGRATOR_KEY', 'DocuSign Integrator Key'],
              ['HELLOSIGN_API_KEY', 'HelloSign API Key'],
            ])}
            
            {renderSection('Monitoring & CI/CD', [
              ['LAUNCHDARKLY_SDK_KEY', 'LaunchDarkly SDK Key'],
              ['SENTRY_AUTH_TOKEN', 'Sentry Auth Token'],
              ['DATADOG_API_KEY', 'Datadog API Key'],
              ['NEW_RELIC_API_KEY', 'New Relic API Key'],
              ['CIRCLECI_API_TOKEN', 'CircleCI API Token'],
              ['TRAVIS_CI_API_TOKEN', 'Travis CI API Token'],
              ['BITBUCKET_USERNAME', 'Bitbucket Username'],
              ['BITBUCKET_APP_PASSWORD', 'Bitbucket App Password'],
              ['GITLAB_PERSONAL_ACCESS_TOKEN', 'GitLab PAT'],
              ['PAGERDUTY_API_KEY', 'PagerDuty API Key'],
            ])}
            
            {renderSection('Headless CMS', [
              ['CONTENTFUL_SPACE_ID', 'Contentful Space ID'],
              ['CONTENTFUL_ACCESS_TOKEN', 'Contentful Access Token'],
              ['SANITY_PROJECT_ID', 'Sanity Project ID'],
              ['SANITY_API_TOKEN', 'Sanity API Token'],
              ['STRAPI_API_TOKEN', 'Strapi API Token'],
            ])}
          </>
        ) : (
          <>
            {renderSection('Financial Data Aggregators', [
              ['PLAID_CLIENT_ID', 'Plaid Client ID'],
              ['PLAID_SECRET', 'Plaid Secret'],
              ['YODLEE_CLIENT_ID', 'Yodlee Client ID'],
              ['YODLEE_SECRET', 'Yodlee Secret'],
              ['MX_CLIENT_ID', 'MX Client ID'],
              ['MX_API_KEY', 'MX API Key'],
              ['FINICITY_PARTNER_ID', 'Finicity Partner ID'],
              ['FINICITY_APP_KEY', 'Finicity App Key'],
            ])}

            {renderSection('Payment Processing', [
              ['ADYEN_API_KEY', 'Adyen API Key'],
              ['ADYEN_MERCHANT_ACCOUNT', 'Adyen Merchant Account'],
              ['BRAINTREE_MERCHANT_ID', 'Braintree Merchant ID'],
              ['BRAINTREE_PUBLIC_KEY', 'Braintree Public Key'],
              ['BRAINTREE_PRIVATE_KEY', 'Braintree Private Key'],
              ['SQUARE_APPLICATION_ID', 'Square Application ID'],
              ['SQUARE_ACCESS_TOKEN', 'Square Access Token'],
              ['PAYPAL_CLIENT_ID', 'PayPal Client ID'],
              ['PAYPAL_SECRET', 'PayPal Secret'],
              ['DWOLLA_KEY', 'Dwolla Key'],
              ['DWOLLA_SECRET', 'Dwolla Secret'],
              ['WORLDPAY_API_KEY', 'Worldpay API Key'],
              ['CHECKOUT_SECRET_KEY', 'Checkout Secret Key'],
            ])}

            {renderSection('Banking as a Service (BaaS) & Card Issuing', [
              ['MARQETA_APPLICATION_TOKEN', 'Marqeta Application Token'],
              ['MARQETA_ADMIN_ACCESS_TOKEN', 'Marqeta Admin Access Token'],
              ['GALILEO_API_LOGIN', 'Galileo API Login'],
              ['GALILEO_API_TRANS_KEY', 'Galileo API Transaction Key'],
              ['SOLARISBANK_CLIENT_ID', 'Solarisbank Client ID'],
              ['SOLARISBANK_CLIENT_SECRET', 'Solarisbank Client Secret'],
              ['SYNAPSE_CLIENT_ID', 'Synapse Client ID'],
              ['SYNAPSE_CLIENT_SECRET', 'Synapse Client Secret'],
              ['RAILSBANK_API_KEY', 'Railsbank API Key'],
              ['CLEARBANK_API_KEY', 'ClearBank API Key'],
              ['UNIT_API_TOKEN', 'Unit API Token'],
              ['TREASURY_PRIME_API_KEY', 'Treasury Prime API Key'],
              ['INCREASE_API_KEY', 'Increase API Key'],
              ['MERCURY_API_KEY', 'Mercury API Key'],
              ['BREX_API_KEY', 'Brex API Key'],
              ['BOND_API_KEY', 'Bond API Key'],
            ])}

            {renderSection('International Payments', [
              ['CURRENCYCLOUD_LOGIN_ID', 'Currencycloud Login ID'],
              ['CURRENCYCLOUD_API_KEY', 'Currencycloud API Key'],
              ['OFX_API_KEY', 'OFX API Key'],
              ['WISE_API_TOKEN', 'Wise API Token'],
              ['REMITLY_API_KEY', 'Remitly API Key'],
              ['AZIMO_API_KEY', 'Azimo API Key'],
              ['NIUM_API_KEY', 'Nium API Key'],
            ])}

            {renderSection('Investment & Market Data', [
              ['ALPACA_API_KEY_ID', 'Alpaca API Key ID'],
              ['ALPACA_SECRET_KEY', 'Alpaca Secret Key'],
              ['TRADIER_ACCESS_TOKEN', 'Tradier Access Token'],
              ['IEX_CLOUD_API_TOKEN', 'IEX Cloud API Token'],
              ['POLYGON_API_KEY', 'Polygon.io API Key'],
              ['FINNHUB_API_KEY', 'Finnhub API Key'],
              ['ALPHA_VANTAGE_API_KEY', 'Alpha Vantage API Key'],
              ['MORNINGSTAR_API_KEY', 'Morningstar API Key'],
              ['XIGNITE_API_TOKEN', 'Xignite API Token'],
              ['DRIVEWEALTH_API_KEY', 'DriveWealth API Key'],
            ])}

            {renderSection('Crypto', [
              ['COINBASE_API_KEY', 'Coinbase API Key'],
              ['COINBASE_API_SECRET', 'Coinbase API Secret'],
              ['BINANCE_API_KEY', 'Binance API Key'],
              ['BINANCE_API_SECRET', 'Binance API Secret'],
              ['KRAKEN_API_KEY', 'Kraken API Key'],
              ['KRAKEN_PRIVATE_KEY', 'Kraken Private Key'],
              ['GEMINI_API_KEY', 'Gemini API Key'],
              ['GEMINI_API_SECRET', 'Gemini API Secret'],
              ['COINMARKETCAP_API_KEY', 'CoinMarketCap API Key'],
              ['COINGECKO_API_KEY', 'CoinGecko API Key'],
              ['BLOCKIO_API_KEY', 'Block.io API Key'],
            ])}

            {renderSection('Major Banks (Open Banking)', [
              ['JP_MORGAN_CHASE_CLIENT_ID', 'JPMorgan Chase Client ID'],
              ['CITI_CLIENT_ID', 'Citi Client ID'],
              ['WELLS_FARGO_CLIENT_ID', 'Wells Fargo Client ID'],
              ['CAPITAL_ONE_CLIENT_ID', 'Capital One Client ID'],
            ])}

            {renderSection('European & Global Banks (Open Banking)', [
              ['HSBC_CLIENT_ID', 'HSBC Client ID'],
              ['BARCLAYS_CLIENT_ID', 'Barclays Client ID'],
              ['BBVA_CLIENT_ID', 'BBVA Client ID'],
              ['DEUTSCHE_BANK_API_KEY', 'Deutsche Bank API Key'],
            ])}

            {renderSection('UK & European Aggregators', [
              ['TINK_CLIENT_ID', 'Tink Client ID'],
              ['TRUELAYER_CLIENT_ID', 'TrueLayer Client ID'],
            ])}

            {renderSection('Compliance & Identity (KYC/AML)', [
              ['MIDDESK_API_KEY', 'Middesk API Key'],
              ['ALLOY_API_TOKEN', 'Alloy API Token'],
              ['ALLOY_API_SECRET', 'Alloy API Secret'],
              ['COMPLYADVANTAGE_API_KEY', 'ComplyAdvantage API Key'],
            ])}

            {renderSection('Real Estate', [
              ['ZILLOW_API_KEY', 'Zillow API Key'],
              ['CORELOGIC_CLIENT_ID', 'CoreLogic Client ID'],
            ])}

            {renderSection('Credit Bureaus', [
              ['EXPERIAN_API_KEY', 'Experian API Key'],
              ['EQUIFAX_API_KEY', 'Equifax API Key'],
              ['TRANSUNION_API_KEY', 'TransUnion API Key'],
            ])}

            {renderSection('Global Payments (Emerging Markets)', [
              ['FINCRA_API_KEY', 'Fincra API Key'],
              ['FLUTTERWAVE_SECRET_KEY', 'Flutterwave Secret Key'],
              ['PAYSTACK_SECRET_KEY', 'Paystack Secret Key'],
              ['DLOCAL_API_KEY', 'DLocal API Key'],
              ['RAPYD_ACCESS_KEY', 'Rapyd Access Key'],
            ])}

            {renderSection('Accounting & Tax', [
              ['TAXJAR_API_KEY', 'TaxJar API Key'],
              ['AVALARA_API_KEY', 'Avalara API Key'],
              ['CODAT_API_KEY', 'Codat API Key'],
              ['XERO_CLIENT_ID', 'Xero Client ID'],
              ['XERO_CLIENT_SECRET', 'Xero Client Secret'],
              ['QUICKBOOKS_CLIENT_ID', 'QuickBooks Client ID'],
              ['QUICKBOOKS_CLIENT_SECRET', 'QuickBooks Client Secret'],
              ['FRESHBOOKS_API_KEY', 'Freshbooks API Key'],
            ])}

            {renderSection('Fintech Utilities', [
              ['ANVIL_API_KEY', 'Anvil API Key'],
              ['MOOV_CLIENT_ID', 'Moov Client ID'],
              ['MOOV_SECRET', 'Moov Secret'],
              ['VGS_USERNAME', 'VGS Username'],
              ['VGS_PASSWORD', 'VGS Password'],
              ['SILA_APP_HANDLE', 'Sila App Handle'],
              ['SILA_PRIVATE_KEY', 'Sila Private Key'],
            ])}
          </>
        )}
        
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

export default FinancialDemocracyView;