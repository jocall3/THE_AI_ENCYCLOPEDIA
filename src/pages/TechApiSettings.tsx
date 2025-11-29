// src/pages/TechApiSettings.tsx

import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { ApiKeys } from '../../types';

const TechApiSettings: React.FC = () => {
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
            <h2>Core Infrastructure & Cloud</h2>
            {renderInput('STRIPE_SECRET_KEY', 'Stripe Secret Key')}
            {renderInput('TWILIO_ACCOUNT_SID', 'Twilio Account SID')}
            {renderInput('TWILIO_AUTH_TOKEN', 'Twilio Auth Token')}
            {renderInput('SENDGRID_API_KEY', 'SendGrid API Key')}
            {renderInput('AWS_ACCESS_KEY_ID', 'AWS Access Key ID')}
            {renderInput('AWS_SECRET_ACCESS_KEY', 'AWS Secret Access Key')}
            {renderInput('AZURE_CLIENT_ID', 'Azure Client ID')}
            {renderInput('AZURE_CLIENT_SECRET', 'Azure Client Secret')}
            {renderInput('GOOGLE_CLOUD_API_KEY', 'Google Cloud API Key')}
        </div>
        <div className="form-section">
            <h2>Deployment & DevOps</h2>
            {renderInput('DOCKER_HUB_USERNAME', 'Docker Hub Username')}
            {renderInput('DOCKER_HUB_ACCESS_TOKEN', 'Docker Hub Access Token')}
            {renderInput('HEROKU_API_KEY', 'Heroku API Key')}
            {renderInput('NETLIFY_PERSONAL_ACCESS_TOKEN', 'Netlify Personal Access Token')}
            {renderInput('VERCEL_API_TOKEN', 'Vercel API Token')}
            {renderInput('CLOUDFLARE_API_TOKEN', 'Cloudflare API Token')}
            {renderInput('DIGITALOCEAN_PERSONAL_ACCESS_TOKEN', 'DigitalOcean Personal Access Token')}
            {renderInput('LINODE_PERSONAL_ACCESS_TOKEN', 'Linode Personal Access Token')}
            {renderInput('TERRAFORM_API_TOKEN', 'Terraform API Token')}
        </div>
        <div className="form-section">
            <h2>Collaboration & Productivity</h2>
            {renderInput('GITHUB_PERSONAL_ACCESS_TOKEN', 'GitHub Personal Access Token')}
            {renderInput('SLACK_BOT_TOKEN', 'Slack Bot Token')}
            {renderInput('DISCORD_BOT_TOKEN', 'Discord Bot Token')}
            {renderInput('TRELLO_API_KEY', 'Trello API Key')}
            {renderInput('TRELLO_API_TOKEN', 'Trello API Token')}
            {renderInput('JIRA_USERNAME', 'Jira Username')}
            {renderInput('JIRA_API_TOKEN', 'Jira API Token')}
            {renderInput('ASANA_PERSONAL_ACCESS_TOKEN', 'Asana Personal Access Token')}
            {renderInput('NOTION_API_KEY', 'Notion API Key')}
            {renderInput('AIRTABLE_API_KEY', 'Airtable API Key')}
        </div>
        <div className="form-section">
            <h2>File & Data Storage</h2>
            {renderInput('DROPBOX_ACCESS_TOKEN', 'Dropbox Access Token')}
            {renderInput('BOX_DEVELOPER_TOKEN', 'Box Developer Token')}
            {renderInput('GOOGLE_DRIVE_API_KEY', 'Google Drive API Key')}
            {renderInput('ONEDRIVE_CLIENT_ID', 'OneDrive Client ID')}
        </div>
        <div className="form-section">
            <h2>CRM & Business</h2>
            {renderInput('SALESFORCE_CLIENT_ID', 'Salesforce Client ID')}
            {renderInput('SALESFORCE_CLIENT_SECRET', 'Salesforce Client Secret')}
            {renderInput('HUBSPOT_API_KEY', 'HubSpot API Key')}
            {renderInput('ZENDESK_API_TOKEN', 'Zendesk API Token')}
            {renderInput('INTERCOM_ACCESS_TOKEN', 'Intercom Access Token')}
            {renderInput('MAILCHIMP_API_KEY', 'Mailchimp API Key')}
        </div>
        <div className="form-section">
            <h2>E-commerce</h2>
            {renderInput('SHOPIFY_API_KEY', 'Shopify API Key')}
            {renderInput('SHOPIFY_API_SECRET', 'Shopify API Secret')}
            {renderInput('BIGCOMMERCE_ACCESS_TOKEN', 'BigCommerce Access Token')}
            {renderInput('MAGENTO_ACCESS_TOKEN', 'Magento Access Token')}
            {renderInput('WOOCOMMERCE_CLIENT_KEY', 'WooCommerce Client Key')}
            {renderInput('WOOCOMMERCE_CLIENT_SECRET', 'WooCommerce Client Secret')}
        </div>
        <div className="form-section">
            <h2>Authentication & Identity</h2>
            {renderInput('STYTCH_PROJECT_ID', 'Stytch Project ID')}
            {renderInput('STYTCH_SECRET', 'Stytch Secret')}
            {renderInput('AUTH0_DOMAIN', 'Auth0 Domain')}
            {renderInput('AUTH0_CLIENT_ID', 'Auth0 Client ID')}
            {renderInput('AUTH0_CLIENT_SECRET', 'Auth0 Client Secret')}
            {renderInput('OKTA_DOMAIN', 'Okta Domain')}
            {renderInput('OKTA_API_TOKEN', 'Okta API Token')}
        </div>
        <div className="form-section">
            <h2>Backend & Databases</h2>
            {renderInput('FIREBASE_API_KEY', 'Firebase API Key')}
            {renderInput('SUPABASE_URL', 'Supabase URL')}
            {renderInput('SUPABASE_ANON_KEY', 'Supabase Anon Key')}
        </div>
        <div className="form-section">
            <h2>API Development</h2>
            {renderInput('POSTMAN_API_KEY', 'Postman API Key')}
            {renderInput('APOLLO_GRAPH_API_KEY', 'Apollo Graph API Key')}
        </div>
        <div className="form-section">
            <h2>AI & Machine Learning</h2>
            {renderInput('OPENAI_API_KEY', 'OpenAI API Key')}
            {renderInput('HUGGING_FACE_API_TOKEN', 'Hugging Face API Token')}
            {renderInput('GOOGLE_CLOUD_AI_API_KEY', 'Google Cloud AI API Key')}
            {renderInput('AMAZON_REKOGNITION_ACCESS_KEY', 'Amazon Rekognition Access Key')}
            {renderInput('MICROSOFT_AZURE_COGNITIVE_KEY', 'Microsoft Azure Cognitive Key')}
            {renderInput('IBM_WATSON_API_KEY', 'IBM Watson API Key')}
        </div>
        <div className="form-section">
            <h2>Search & Real-time</h2>
            {renderInput('ALGOLIA_APP_ID', 'Algolia App ID')}
            {renderInput('ALGOLIA_ADMIN_API_KEY', 'Algolia Admin API Key')}
            {renderInput('PUSHER_APP_ID', 'Pusher App ID')}
            {renderInput('PUSHER_KEY', 'Pusher Key')}
            {renderInput('PUSHER_SECRET', 'Pusher Secret')}
            {renderInput('ABLY_API_KEY', 'Ably API Key')}
            {renderInput('ELASTICSEARCH_API_KEY', 'Elasticsearch API Key')}
        </div>
        <div className="form-section">
            <h2>Identity & Verification</h2>
            {renderInput('STRIPE_IDENTITY_SECRET_KEY', 'Stripe Identity Secret Key')}
            {renderInput('ONFIDO_API_TOKEN', 'Onfido API Token')}
            {renderInput('CHECKR_API_KEY', 'Checkr API Key')}
        </div>
        <div className="form-section">
            <h2>Logistics & Shipping</h2>
            {renderInput('LOB_API_KEY', 'Lob API Key')}
            {renderInput('EASYPOST_API_KEY', 'EasyPost API Key')}
            {renderInput('SHIPPO_API_TOKEN', 'Shippo API Token')}
        </div>
        <div className="form-section">
            <h2>Maps & Weather</h2>
            {renderInput('GOOGLE_MAPS_API_KEY', 'Google Maps API Key')}
            {renderInput('MAPBOX_ACCESS_TOKEN', 'Mapbox Access Token')}
            {renderInput('HERE_API_KEY', 'Here API Key')}
            {renderInput('ACCUWEATHER_API_KEY', 'AccuWeather API Key')}
            {renderInput('OPENWEATHERMAP_API_KEY', 'OpenWeatherMap API Key')}
        </div>
        <div className="form-section">
            <h2>Social & Media</h2>
            {renderInput('YELP_API_KEY', 'Yelp API Key')}
            {renderInput('FOURSQUARE_API_KEY', 'Foursquare API Key')}
            {renderInput('REDDIT_CLIENT_ID', 'Reddit Client ID')}
            {renderInput('REDDIT_CLIENT_SECRET', 'Reddit Client Secret')}
            {renderInput('TWITTER_BEARER_TOKEN', 'Twitter Bearer Token')}
            {renderInput('FACEBOOK_APP_ID', 'Facebook App ID')}
            {renderInput('FACEBOOK_APP_SECRET', 'Facebook App Secret')}
            {renderInput('INSTAGRAM_APP_ID', 'Instagram App ID')}
            {renderInput('INSTAGRAM_APP_SECRET', 'Instagram App Secret')}
            {renderInput('YOUTUBE_DATA_API_KEY', 'YouTube Data API Key')}
            {renderInput('SPOTIFY_CLIENT_ID', 'Spotify Client ID')}
            {renderInput('SPOTIFY_CLIENT_SECRET', 'Spotify Client Secret')}
            {renderInput('SOUNDCLOUD_CLIENT_ID', 'SoundCloud Client ID')}
            {renderInput('TWITCH_CLIENT_ID', 'Twitch Client ID')}
            {renderInput('TWITCH_CLIENT_SECRET', 'Twitch Client Secret')}
        </div>
        <div className="form-section">
            <h2>Media & Content</h2>
            {renderInput('MUX_TOKEN_ID', 'Mux Token ID')}
            {renderInput('MUX_TOKEN_SECRET', 'Mux Token Secret')}
            {renderInput('CLOUDINARY_API_KEY', 'Cloudinary API Key')}
            {renderInput('CLOUDINARY_API_SECRET', 'Cloudinary API Secret')}
            {renderInput('IMGIX_API_KEY', 'Imgix API Key')}
        </div>
        <div className="form-section">
            <h2>Legal & Admin</h2>
            {renderInput('STRIPE_ATLAS_API_KEY', 'Stripe Atlas API Key')}
            {renderInput('CLERKY_API_KEY', 'Clerky API Key')}
            {renderInput('DOCUSIGN_INTEGRATOR_KEY', 'DocuSign Integrator Key')}
            {renderInput('HELLOSIGN_API_KEY', 'HelloSign API Key')}
        </div>
        <div className="form-section">
            <h2>Monitoring & CI/CD</h2>
            {renderInput('LAUNCHDARKLY_SDK_KEY', 'LaunchDarkly SDK Key')}
            {renderInput('SENTRY_AUTH_TOKEN', 'Sentry Auth Token')}
            {renderInput('DATADOG_API_KEY', 'Datadog API Key')}
            {renderInput('NEW_RELIC_API_KEY', 'New Relic API Key')}
            {renderInput('CIRCLECI_API_TOKEN', 'CircleCI API Token')}
            {renderInput('TRAVIS_CI_API_TOKEN', 'Travis CI API Token')}
            {renderInput('BITBUCKET_USERNAME', 'Bitbucket Username')}
            {renderInput('BITBUCKET_APP_PASSWORD', 'Bitbucket App Password')}
            {renderInput('GITLAB_PERSONAL_ACCESS_TOKEN', 'GitLab Personal Access Token')}
            {renderInput('PAGERDUTY_API_KEY', 'PagerDuty API Key')}
        </div>
        <div className="form-section">
            <h2>Headless CMS</h2>
            {renderInput('CONTENTFUL_SPACE_ID', 'Contentful Space ID')}
            {renderInput('CONTENTFUL_ACCESS_TOKEN', 'Contentful Access Token')}
            {renderInput('SANITY_PROJECT_ID', 'Sanity Project ID')}
            {renderInput('SANITY_API_TOKEN', 'Sanity API Token')}
            {renderInput('STRAPI_API_TOKEN', 'Strapi API Token')}
        </div>

        <div className="form-footer">
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Tech API Keys'}
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
    </form>
  );
};

export default TechApiSettings;