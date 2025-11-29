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

  // Helper function to render multiple inputs efficiently
  const renderInputs = (categoryKeys: (keyof ApiKeysState)[], categoryLabels: string[]) => {
    return categoryKeys.map((keyName, index) => renderInput(keyName, categoryLabels[index]));
  };

  // ================================================================================================
  // HUGE RENDERING BLOCK: All 200+ APIs defined here
  // ================================================================================================

  const renderTechApis = () => (
    <>
      {/* 1. Core Infrastructure & Cloud */}
      <div className="form-section">
        <h2>1. Core Infrastructure & Cloud</h2>
        {renderInputs(
            ['STRIPE_SECRET_KEY', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'SENDGRID_API_KEY', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET', 'GOOGLE_CLOUD_API_KEY'],
            ['Stripe Secret Key', 'Twilio Account SID', 'Twilio Auth Token', 'SendGrid API Key', 'AWS Access Key ID', 'AWS Secret Access Key', 'Azure Client ID', 'Azure Client Secret', 'Google Cloud API Key']
        )}
      </div>

      {/* 2. Deployment & DevOps */}
      <div className="form-section">
        <h2>2. Deployment & DevOps</h2>
        {renderInputs(
            ['DOCKER_HUB_USERNAME', 'DOCKER_HUB_ACCESS_TOKEN', 'HEROKU_API_KEY', 'NETLIFY_PERSONAL_ACCESS_TOKEN', 'VERCEL_API_TOKEN', 'CLOUDFLARE_API_TOKEN', 'DIGITALOCEAN_PERSONAL_ACCESS_TOKEN', 'LINODE_PERSONAL_ACCESS_TOKEN', 'TERRAFORM_API_TOKEN'],
            ['Docker Hub Username', 'Docker Hub Access Token', 'Heroku API Key', 'Netlify Personal Access Token', 'Vercel API Token', 'Cloudflare API Token', 'DigitalOcean PAT', 'Linode PAT', 'Terraform API Token']
        )}
      </div>

      {/* 3. Collaboration & Productivity */}
      <div className="form-section">
        <h2>3. Collaboration & Productivity</h2>
        {renderInputs(
            ['GITHUB_PERSONAL_ACCESS_TOKEN', 'SLACK_BOT_TOKEN', 'DISCORD_BOT_TOKEN', 'TRELLO_API_KEY', 'TRELLO_API_TOKEN', 'JIRA_USERNAME', 'JIRA_API_TOKEN', 'ASANA_PERSONAL_ACCESS_TOKEN', 'NOTION_API_KEY', 'AIRTABLE_API_KEY'],
            ['GitHub PAT', 'Slack Bot Token', 'Discord Bot Token', 'Trello API Key', 'Trello API Token', 'JIRA Username', 'JIRA API Token', 'Asana PAT', 'Notion API Key', 'Airtable API Key']
        )}
      </div>
      
      {/* 4. File & Data Storage */}
      <div className="form-section">
        <h2>4. File & Data Storage</h2>
        {renderInputs(
            ['DROPBOX_ACCESS_TOKEN', 'BOX_DEVELOPER_TOKEN', 'GOOGLE_DRIVE_API_KEY', 'ONEDRIVE_CLIENT_ID'],
            ['Dropbox Access Token', 'Box Developer Token', 'Google Drive API Key', 'OneDrive Client ID']
        )}
      </div>

      {/* 5. CRM & Business */}
      <div className="form-section">
        <h2>5. CRM & Business</h2>
        {renderInputs(
            ['SALESFORCE_CLIENT_ID', 'SALESFORCE_CLIENT_SECRET', 'HUBSPOT_API_KEY', 'ZENDESK_API_TOKEN', 'INTERCOM_ACCESS_TOKEN', 'MAILCHIMP_API_KEY'],
            ['Salesforce Client ID', 'Salesforce Client Secret', 'Hubspot API Key', 'Zendesk API Token', 'Intercom Access Token', 'Mailchimp API Key']
        )}
      </div>

      {/* 6. E-commerce */}
      <div className="form-section">
        <h2>6. E-commerce</h2>
        {renderInputs(
            ['SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET', 'BIGCOMMERCE_ACCESS_TOKEN', 'MAGENTO_ACCESS_TOKEN', 'WOOCOMMERCE_CLIENT_KEY', 'WOOCOMMERCE_CLIENT_SECRET'],
            ['Shopify API Key', 'Shopify API Secret', 'BigCommerce Access Token', 'Magento Access Token', 'WooCommerce Client Key', 'WooCommerce Client Secret']
        )}
      </div>
      
      {/* 7. Authentication & Identity */}
      <div className="form-section">
        <h2>7. Authentication & Identity</h2>
        {renderInputs(
            ['STYTCH_PROJECT_ID', 'STYTCH_SECRET', 'AUTH0_DOMAIN', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'OKTA_DOMAIN', 'OKTA_API_TOKEN'],
            ['Stytch Project ID', 'Stytch Secret', 'Auth0 Domain', 'Auth0 Client ID', 'Auth0 Client Secret', 'Okta Domain', 'Okta API Token']
        )}
      </div>

      {/* 8. Backend & Databases */}
      <div className="form-section">
        <h2>8. Backend & Databases</h2>
        {renderInputs(
            ['FIREBASE_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'],
            ['Firebase API Key', 'Supabase URL', 'Supabase Anon Key']
        )}
      </div>

      {/* 9. API Development */}
      <div className="form-section">
        <h2>9. API Development</h2>
        {renderInputs(
            ['POSTMAN_API_KEY', 'APOLLO_GRAPH_API_KEY'],
            ['Postman API Key', 'Apollo Graph API Key']
        )}
      </div>

      {/* 10. AI & Machine Learning */}
      <div className="form-section">
        <h2>10. AI & Machine Learning</h2>
        {renderInputs(
            ['OPENAI_API_KEY', 'HUGGING_FACE_API_TOKEN', 'GOOGLE_CLOUD_AI_API_KEY', 'AMAZON_REKOGNITION_ACCESS_KEY', 'MICROSOFT_AZURE_COGNITIVE_KEY', 'IBM_WATSON_API_KEY'],
            ['OpenAI API Key', 'Hugging Face API Token', 'Google Cloud AI API Key', 'Amazon Rekognition Access Key', 'Microsoft Azure Cognitive Key', 'IBM Watson API Key']
        )}
      </div>

      {/* 11. Search & Real-time */}
      <div className="form-section">
        <h2>11. Search & Real-time</h2>
        {renderInputs(
            ['ALGOLIA_APP_ID', 'ALGOLIA_ADMIN_API_KEY', 'PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_SECRET', 'ABLY_API_KEY', 'ELASTICSEARCH_API_KEY'],
            ['Algolia App ID', 'Algolia Admin API Key', 'Pusher App ID', 'Pusher Key', 'Pusher Secret', 'Ably API Key', 'Elasticsearch API Key']
        )}
      </div>

      {/* 12. Identity & Verification */}
      <div className="form-section">
        <h2>12. Identity & Verification</h2>
        {renderInputs(
            ['STRIPE_IDENTITY_SECRET_KEY', 'ONFIDO_API_TOKEN', 'CHECKR_API_KEY'],
            ['Stripe Identity Secret Key', 'Onfido API Token', 'Checkr API Key']
        )}
      </div>
      
      {/* 13. Logistics & Shipping */}
      <div className="form-section">
        <h2>13. Logistics & Shipping</h2>
        {renderInputs(
            ['LOB_API_KEY', 'EASYPOST_API_KEY', 'SHIPPO_API_TOKEN'],
            ['Lob API Key', 'EasyPost API Key', 'Shippo API Token']
        )}
      </div>
      
      {/* 14. Maps & Weather */}
      <div className="form-section">
        <h2>14. Maps & Weather</h2>
        {renderInputs(
            ['GOOGLE_MAPS_API_KEY', 'MAPBOX_ACCESS_TOKEN', 'HERE_API_KEY', 'ACCUWEATHER_API_KEY', 'OPENWEATHERMAP_API_KEY'],
            ['Google Maps API Key', 'Mapbox Access Token', 'HERE API Key', 'Accuweather API Key', 'OpenWeatherMap API Key']
        )}
      </div>

      {/* 15. Social & Media */}
      <div className="form-section">
        <h2>15. Social & Media</h2>
        {renderInputs(
            ['YELP_API_KEY', 'FOURSQUARE_API_KEY', 'REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'TWITTER_BEARER_TOKEN', 'FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET', 'INSTAGRAM_APP_ID', 'INSTAGRAM_APP_SECRET', 'YOUTUBE_DATA_API_KEY', 'SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SOUNDCLOUD_CLIENT_ID', 'TWITCH_CLIENT_ID', 'TWITCH_CLIENT_SECRET'],
            ['Yelp API Key', 'Foursquare API Key', 'Reddit Client ID', 'Reddit Client Secret', 'Twitter Bearer Token', 'Facebook App ID', 'Facebook App Secret', 'Instagram App ID', 'Instagram App Secret', 'YouTube Data API Key', 'Spotify Client ID', 'Spotify Client Secret', 'Soundcloud Client ID', 'Twitch Client ID', 'Twitch Client Secret']
        )}
      </div>

      {/* 16. Media & Content */}
      <div className="form-section">
        <h2>16. Media & Content</h2>
        {renderInputs(
            ['MUX_TOKEN_ID', 'MUX_TOKEN_SECRET', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'IMGIX_API_KEY'],
            ['Mux Token ID', 'Mux Token Secret', 'Cloudinary API Key', 'Cloudinary API Secret', 'Imgix API Key']
        )}
      </div>

      {/* 17. Legal & Admin */}
      <div className="form-section">
        <h2>17. Legal & Admin</h2>
        {renderInputs(
            ['STRIPE_ATLAS_API_KEY', 'CLERKY_API_KEY', 'DOCUSIGN_INTEGRATOR_KEY', 'HELLOSIGN_API_KEY'],
            ['Stripe Atlas API Key', 'Clerky API Key', 'Docusign Integrator Key', 'HelloSign API Key']
        )}
      </div>
      
      {/* 18. Monitoring & CI/CD */}
      <div className="form-section">
        <h2>18. Monitoring & CI/CD</h2>
        {renderInputs(
            ['LAUNCHDARKLY_SDK_KEY', 'SENTRY_AUTH_TOKEN', 'DATADOG_API_KEY', 'NEW_RELIC_API_KEY', 'CIRCLECI_API_TOKEN', 'TRAVIS_CI_API_TOKEN', 'BITBUCKET_USERNAME', 'BITBUCKET_APP_PASSWORD', 'GITLAB_PERSONAL_ACCESS_TOKEN', 'PAGERDUTY_API_KEY'],
            ['LaunchDarkly SDK Key', 'Sentry Auth Token', 'Datadog API Key', 'New Relic API Key', 'CircleCI API Token', 'Travis CI API Token', 'Bitbucket Username', 'Bitbucket App Password', 'GitLab PAT', 'PagerDuty API Key']
        )}
      </div>
      
      {/* 19. Headless CMS */}
      <div className="form-section">
        <h2>19. Headless CMS</h2>
        {renderInputs(
            ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN', 'SANITY_PROJECT_ID', 'SANITY_API_TOKEN', 'STRAPI_API_TOKEN'],
            ['Contentful Space ID', 'Contentful Access Token', 'Sanity Project ID', 'Sanity API Token', 'Strapi API Token']
        )}
      </div>
    </>
  );

  const renderBankingApis = () => (
    <>
      {/* 1. Data Aggregators */}
      <div className="form-section">
        <h2>1. Financial Data Aggregators</h2>
        {renderInputs(
            ['PLAID_CLIENT_ID', 'PLAID_SECRET', 'YODLEE_CLIENT_ID', 'YODLEE_SECRET', 'MX_CLIENT_ID', 'MX_API_KEY', 'FINICITY_PARTNER_ID', 'FINICITY_APP_KEY'],
            ['Plaid Client ID', 'Plaid Secret', 'Yodlee Client ID', 'Yodlee Secret', 'MX Client ID', 'MX API Key', 'Finicity Partner ID', 'Finicity App Key']
        )}
      </div>

      {/* 2. Payment Processing */}
      <div className="form-section">
        <h2>2. Payment Processing</h2>
        {renderInputs(
            ['ADYEN_API_KEY', 'ADYEN_MERCHANT_ACCOUNT', 'BRAINTREE_MERCHANT_ID', 'BRAINTREE_PUBLIC_KEY', 'BRAINTREE_PRIVATE_KEY', 'SQUARE_APPLICATION_ID', 'SQUARE_ACCESS_TOKEN', 'PAYPAL_CLIENT_ID', 'PAYPAL_SECRET', 'DWOLLA_KEY', 'DWOLLA_SECRET', 'WORLDPAY_API_KEY', 'CHECKOUT_SECRET_KEY'],
            ['Adyen API Key', 'Adyen Merchant Account', 'Braintree Merchant ID', 'Braintree Public Key', 'Braintree Private Key', 'Square Application ID', 'Square Access Token', 'PayPal Client ID', 'PayPal Secret', 'Dwolla Key', 'Dwolla Secret', 'Worldpay API Key', 'Checkout.com Secret Key']
        )}
      </div>
      
      {/* 3. Banking as a Service (BaaS) & Card Issuing */}
      <div className="form-section">
        <h2>3. Banking as a Service (BaaS) & Card Issuing</h2>
        {renderInputs(
            ['MARQETA_APPLICATION_TOKEN', 'MARQETA_ADMIN_ACCESS_TOKEN', 'GALILEO_API_LOGIN', 'GALILEO_API_TRANS_KEY', 'SOLARISBANK_CLIENT_ID', 'SOLARISBANK_CLIENT_SECRET', 'SYNAPSE_CLIENT_ID', 'SYNAPSE_CLIENT_SECRET', 'RAILSBANK_API_KEY', 'CLEARBANK_API_KEY', 'UNIT_API_TOKEN', 'TREASURY_PRIME_API_KEY', 'INCREASE_API_KEY', 'MERCURY_API_KEY', 'BREX_API_KEY', 'BOND_API_KEY'],
            ['Marqeta Application Token', 'Marqeta Admin Access Token', 'Galileo API Login', 'Galileo API Trans Key', 'Solarisbank Client ID', 'Solarisbank Client Secret', 'Synapse Client ID', 'Synapse Client Secret', 'Railsbank API Key', 'Clearbank API Key', 'Unit API Token', 'Treasury Prime API Key', 'Increase API Key', 'Mercury API Key', 'Brex API Key', 'Bond API Key']
        )}
      </div>
      
      {/* 4. International Payments */}
      <div className="form-section">
        <h2>4. International Payments</h2>
        {renderInputs(
            ['CURRENCYCLOUD_LOGIN_ID', 'CURRENCYCLOUD_API_KEY', 'OFX_API_KEY', 'WISE_API_TOKEN', 'REMITLY_API_KEY', 'AZIMO_API_KEY', 'NIUM_API_KEY'],
            ['Currencycloud Login ID', 'Currencycloud API Key', 'OFX API Key', 'Wise API Token', 'Remitly API Key', 'Azimo API Key', 'NIUM API Key']
        )}
      </div>

      {/* 5. Investment & Market Data */}
      <div className="form-section">
        <h2>5. Investment & Market Data</h2>
        {renderInputs(
            ['ALPACA_API_KEY_ID', 'ALPACA_SECRET_KEY', 'TRADIER_ACCESS_TOKEN', 'IEX_CLOUD_API_TOKEN', 'POLYGON_API_KEY', 'FINNHUB_API_KEY', 'ALPHA_VANTAGE_API_KEY', 'MORNINGSTAR_API_KEY', 'XIGNITE_API_TOKEN', 'DRIVEWEALTH_API_KEY'],
            ['Alpaca API Key ID', 'Alpaca Secret Key', 'Tradier Access Token', 'IEX Cloud API Token', 'Polygon API Key', 'Finnhub API Key', 'Alpha Vantage API Key', 'Morningstar API Key', 'Xignite API Token', 'DriveWealth API Key']
        )}
      </div>

      {/* 6. Crypto */}
      <div className="form-section">
        <h2>6. Crypto</h2>
        {renderInputs(
            ['COINBASE_API_KEY', 'COINBASE_API_SECRET', 'BINANCE_API_KEY', 'BINANCE_API_SECRET', 'KRAKEN_API_KEY', 'KRAKEN_PRIVATE_KEY', 'GEMINI_API_KEY', 'GEMINI_API_SECRET', 'COINMARKETCAP_API_KEY', 'COINGECKO_API_KEY', 'BLOCKIO_API_KEY'],
            ['Coinbase API Key', 'Coinbase API Secret', 'Binance API Key', 'Binance API Secret', 'Kraken API Key', 'Kraken Private Key', 'Gemini API Key', 'Gemini API Secret', 'CoinMarketCap API Key', 'CoinGecko API Key', 'Block.io API Key']
        )}
      </div>
      
      {/* 7. Major Banks (Open Banking) */}
      <div className="form-section">
        <h2>7. Major Banks (Open Banking)</h2>
        {renderInputs(
            ['JP_MORGAN_CHASE_CLIENT_ID', 'CITI_CLIENT_ID', 'WELLS_FARGO_CLIENT_ID', 'CAPITAL_ONE_CLIENT_ID'],
            ['JP Morgan Chase Client ID', 'Citi Client ID', 'Wells Fargo Client ID', 'Capital One Client ID']
        )}
      </div>

      {/* 8. European & Global Banks (Open Banking) */}
      <div className="form-section">
        <h2>8. European & Global Banks (Open Banking)</h2>
        {renderInputs(
            ['HSBC_CLIENT_ID', 'BARCLAYS_CLIENT_ID', 'BBVA_CLIENT_ID', 'DEUTSCHE_BANK_API_KEY'],
            ['HSBC Client ID', 'Barclays Client ID', 'BBVA Client ID', 'Deutsche Bank API Key']
        )}
      </div>
      
      {/* 9. UK & European Aggregators */}
      <div className="form-section">
        <h2>9. UK & European Aggregators</h2>
        {renderInputs(
            ['TINK_CLIENT_ID', 'TRUELAYER_CLIENT_ID'],
            ['Tink Client ID', 'TrueLayer Client ID']
        )}
      </div>

      {/* 10. Compliance & Identity (KYC/AML) */}
      <div className="form-section">
        <h2>10. Compliance & Identity (KYC/AML)</h2>
        {renderInputs(
            ['MIDDESK_API_KEY', 'ALLOY_API_TOKEN', 'ALLOY_API_SECRET', 'COMPLYADVANTAGE_API_KEY'],
            ['Middesk API Key', 'Alloy API Token', 'Alloy API Secret', 'ComplyAdvantage API Key']
        )}
      </div>

      {/* 11. Real Estate */}
      <div className="form-section">
        <h2>11. Real Estate</h2>
        {renderInputs(
            ['ZILLOW_API_KEY', 'CORELOGIC_CLIENT_ID'],
            ['Zillow API Key', 'CoreLogic Client ID']
        )}
      </div>
      
      {/* 12. Credit Bureaus */}
      <div className="form-section">
        <h2>12. Credit Bureaus</h2>
        {renderInputs(
            ['EXPERIAN_API_KEY', 'EQUIFAX_API_KEY', 'TRANSUNION_API_KEY'],
            ['Experian API Key', 'Equifax API Key', 'TransUnion API Key']
        )}
      </div>

      {/* 13. Global Payments (Emerging Markets) */}
      <div className="form-section">
        <h2>13. Global Payments (Emerging Markets)</h2>
        {renderInputs(
            ['FINCRA_API_KEY', 'FLUTTERWAVE_SECRET_KEY', 'PAYSTACK_SECRET_KEY', 'DLOCAL_API_KEY', 'RAPYD_ACCESS_KEY'],
            ['Fincra API Key', 'Flutterwave Secret Key', 'Paystack Secret Key', 'Dlocal API Key', 'Rapyd Access Key']
        )}
      </div>

      {/* 14. Accounting & Tax */}
      <div className="form-section">
        <h2>14. Accounting & Tax</h2>
        {renderInputs(
            ['TAXJAR_API_KEY', 'AVALARA_API_KEY', 'CODAT_API_KEY', 'XERO_CLIENT_ID', 'XERO_CLIENT_SECRET', 'QUICKBOOKS_CLIENT_ID', 'QUICKBOOKS_CLIENT_SECRET', 'FRESHBOOKS_API_KEY'],
            ['TaxJar API Key', 'Avalara API Key', 'Codat API Key', 'Xero Client ID', 'Xero Client Secret', 'QuickBooks Client ID', 'QuickBooks Client Secret', 'Freshbooks API Key']
        )}
      </div>

      {/* 15. Fintech Utilities */}
      <div className="form-section">
        <h2>15. Fintech Utilities</h2>
        {renderInputs(
            ['ANVIL_API_KEY', 'MOOV_CLIENT_ID', 'MOOV_SECRET', 'VGS_USERNAME', 'VGS_PASSWORD', 'SILA_APP_HANDLE', 'SILA_PRIVATE_KEY'],
            ['Anvil API Key', 'Moov Client ID', 'Moov Secret', 'VGS Username', 'VGS Password', 'SILA App Handle', 'SILA Private Key']
        )}
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