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
          {renderInput('GITHUB_PERSONAL_ACCESS_TOKEN', 'GitHub PAT')}
          {renderInput('HEROKU_API_KEY', 'Heroku API Key')}
          {renderInput('NETLIFY_PERSONAL_ACCESS_TOKEN', 'Netlify PAT')}
          {renderInput('VERCEL_API_TOKEN', 'Vercel API Token')}
          {renderInput('CLOUDFLARE_API_TOKEN', 'Cloudflare API Token')}
          {renderInput('DOCKER_HUB_USERNAME', 'Docker Hub Username')}
        </div>

        <div className="form-section">
          <h2>AI & Machine Learning</h2>
          {renderInput('OPENAI_API_KEY', 'OpenAI API Key')}
          {renderInput('HUGGING_FACE_API_TOKEN', 'Hugging Face API Token')}
          {renderInput('IBM_WATSON_API_KEY', 'IBM Watson API Key')}
        </div>

        <div className="form-section">
            <h2>Collaboration & Productivity</h2>
            {renderInput('SLACK_BOT_TOKEN', 'Slack Bot Token')}
            {renderInput('DISCORD_BOT_TOKEN', 'Discord Bot Token')}
            {renderInput('JIRA_API_TOKEN', 'Jira API Token')}
            {renderInput('NOTION_API_KEY', 'Notion API Key')}
        </div>

        <div className="form-section">
            <h2>E-commerce</h2>
            {renderInput('SHOPIFY_API_KEY', 'Shopify API Key')}
            {renderInput('SHOPIFY_API_SECRET', 'Shopify API Secret')}
            {renderInput('WOOCOMMERCE_CLIENT_KEY', 'WooCommerce Client Key')}
            {renderInput('WOOCOMMERCE_CLIENT_SECRET', 'WooCommerce Client Secret')}
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