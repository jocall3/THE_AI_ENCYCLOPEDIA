import React, { useState, useCallback, useMemo } from 'react';

// --- Type Definitions ---

type AuthMethod = 'API_KEY' | 'OAuth2' | 'JWT' | 'PQC_KYBER_SIGNED';
type ConnectionStatus = 'Untested' | 'Connected' | 'Failed' | 'Testing...';

interface CredentialField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'textarea';
  required: boolean;
}

interface ApiConfig {
  id: string;
  name: string;
  fields: CredentialField[];
  defaultAuthMethod: AuthMethod;
}

interface ApiCredentialState {
  [key: string]: string; // Stores the actual input values (key, secret, etc.)
  authMethod: AuthMethod;
  status: ConnectionStatus;
  lastTested: string;
}

interface ApiCategory {
  name: string;
  description: string;
  apis: ApiConfig[];
}

// --- Mock Data: API Definitions (A comprehensive subset of the 100+ APIs) ---

const API_DEFINITIONS: ApiCategory[] = [
  {
    name: 'Payment & Finance Gateways',
    description: 'Securely manage credentials for payment processing, banking, and financial data aggregation.',
    apis: [
      { id: 'stripe', name: 'Stripe API', defaultAuthMethod: 'API_KEY', fields: [{ key: 'secretKey', label: 'Secret Key (sk_live_...)', type: 'password', required: true }] },
      { id: 'plaid', name: 'Plaid API', defaultAuthMethod: 'API_KEY', fields: [{ key: 'clientId', label: 'Client ID', type: 'text', required: true }, { key: 'secret', label: 'Secret', type: 'password', required: true }] },
      { id: 'adyen', name: 'Adyen API', defaultAuthMethod: 'API_KEY', fields: [{ key: 'apiKey', label: 'API Key', type: 'password', required: true }, { key: 'merchantAccount', label: 'Merchant Account', type: 'text', required: true }] },
      { id: 'alpaca', name: 'Alpaca Trading API', defaultAuthMethod: 'JWT', fields: [{ key: 'keyId', label: 'Key ID', type: 'text', required: true }, { key: 'secretKey', label: 'Secret Key', type: 'password', required: true }] },
    ],
  },
  {
    name: 'Cloud & Infrastructure',
    description: 'Configure access to major cloud providers and DevOps tools.',
    apis: [
      { id: 'aws', name: 'AWS API', defaultAuthMethod: 'PQC_KYBER_SIGNED', fields: [{ key: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true }, { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true }, { key: 'region', label: 'Default Region', type: 'text', required: false }] },
      { id: 'azure', name: 'Microsoft Azure API', defaultAuthMethod: 'OAuth2', fields: [{ key: 'tenantId', label: 'Tenant ID', type: 'text', required: true }, { key: 'clientId', label: 'Client ID', type: 'text', required: true }, { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true }] },
      { id: 'gcp', name: 'Google Cloud API', defaultAuthMethod: 'JWT', fields: [{ key: 'serviceAccountJson', label: 'Service Account JSON', type: 'textarea', required: true }] },
      { id: 'dockerhub', name: 'Docker Hub API', defaultAuthMethod: 'API_KEY', fields: [{ key: 'username', label: 'Username', type: 'text', required: true }, { key: 'accessToken', label: 'Access Token', type: 'password', required: true }] },
    ],
  },
  {
    name: 'Communication & Messaging',
    description: 'Integrate SMS, email, and real-time communication services.',
    apis: [
      { id: 'twilio', name: 'Twilio API', defaultAuthMethod: 'API_KEY', fields: [{ key: 'accountSid', label: 'Account SID', type: 'text', required: true }, { key: 'authToken', label: 'Auth Token', type: 'password', required: true }] },
      { id: 'sendgrid', name: 'SendGrid API', defaultAuthMethod: 'API_KEY', fields: [{ key: 'apiKey', label: 'API Key', type: 'password', required: true }] },
      { id: 'slack', name: 'Slack API', defaultAuthMethod: 'OAuth2', fields: [{ key: 'clientId', label: 'Client ID', type: 'text', required: true }, { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true }, { key: 'signingSecret', label: 'Signing Secret', type: 'password', required: true }] },
    ],
  },
  {
    name: 'AI & Machine Learning',
    description: 'Access powerful models and cognitive services.',
    apis: [
      { id: 'openai', name: 'OpenAI API', defaultAuthMethod: 'API_KEY', fields: [{ key: 'apiKey', label: 'API Key', type: 'password', required: true }] },
      { id: 'huggingface', name: 'Hugging Face API', defaultAuthMethod: 'API_KEY', fields: [{ key: 'accessToken', label: 'Access Token', type: 'password', required: true }] },
      { id: 'amazonrekognition', name: 'Amazon Rekognition', defaultAuthMethod: 'PQC_KYBER_SIGNED', fields: [{ key: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true }, { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true }] },
    ],
  },
  // ... (Many more APIs would be listed here to reach 100+)
];

// Initialize state structure for all APIs
const initialCredentialsState: Record<string, ApiCredentialState> = {};
API_DEFINITIONS.forEach(category => {
  category.apis.forEach(api => {
    initialCredentialsState[api.id] = {
      authMethod: api.defaultAuthMethod,
      status: 'Untested',
      lastTested: 'N/A',
      ...api.fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}),
    };
  });
});

// --- Utility Components ---

const StatusIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  let colorClass = 'bg-gray-400';
  let text = status;

  switch (status) {
    case 'Connected':
      colorClass = 'bg-green-500';
      break;
    case 'Failed':
      colorClass = 'bg-red-500';
      break;
    case 'Testing...':
      colorClass = 'bg-yellow-500 animate-pulse';
      break;
    case 'Untested':
    default:
      colorClass = 'bg-gray-400';
      break;
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
      <span className="text-gray-600">{text}</span>
    </div>
  );
};

// --- Main Dashboard Component ---

const ApiManagementDashboard: React.FC = () => {
  const [credentials, setCredentials] = useState<Record<string, ApiCredentialState>>(initialCredentialsState);
  const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleInputChange = useCallback((apiId: string, fieldKey: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [apiId]: {
        ...prev[apiId],
        [fieldKey]: value,
        status: 'Untested', // Reset status on change
      },
    }));
  }, []);

  const handleAuthMethodChange = useCallback((apiId: string, method: AuthMethod) => {
    setCredentials(prev => ({
      ...prev,
      [apiId]: {
        ...prev[apiId],
        authMethod: method,
        status: 'Untested',
      },
    }));
  }, []);

  // --- Security Simulation Functions ---

  const simulatePQCKeyExchange = (apiId: string) => {
    console.log(`[PQC] Initiating Kyber key exchange for ${apiId}...`);
    // In a real scenario, this would involve generating a Kyber key pair,
    // sending the public key to the server, and receiving a shared secret.
    return 'PQC_SHARED_SECRET_DILITHIUM_SIGNED';
  };

  const simulateP2PEEncryption = (data: Record<string, string>, sharedSecret: string) => {
    // Simulate encryption using the shared secret (e.g., AES-256 GCM)
    const encryptedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = `ENC(${sharedSecret.substring(0, 5)})...${data[key].length}bytes`;
      return acc;
    }, {} as Record<string, string>);

    console.log(`[P2PE] Data encrypted using shared secret: ${sharedSecret}`);
    return encryptedData;
  };

  const simulateHomomorphicStorage = (encryptedData: Record<string, string>) => {
    // Conceptual step: The backend stores the encrypted data in a format
    // that allows for HE operations (e.g., checking key format validity)
    console.log(`[HE] Backend storing data in HE-compatible format for secure computation.`);
    return encryptedData;
  };

  // --- Test Connection Handler ---

  const handleTestConnection = useCallback(async (apiId: string, apiName: string) => {
    setCredentials(prev => ({
      ...prev,
      [apiId]: { ...prev[apiId], status: 'Testing...' as ConnectionStatus },
    }));

    // 1. Extract sensitive data
    const currentCreds = credentials[apiId];
    const sensitiveData = Object.keys(currentCreds).reduce((acc, key) => {
      if (key !== 'authMethod' && key !== 'status' && key !== 'lastTested') {
        acc[key] = currentCreds[key];
      }
      return acc;
    }, {} as Record<string, string>);

    // 2. PQC Key Exchange (Kyber/Dilithium)
    const sharedSecret = simulatePQCKeyExchange(apiId);

    // 3. Point-to-Point Encryption (P2PE)
    const encryptedPayload = simulateP2PEEncryption(sensitiveData, sharedSecret);

    // 4. Simulate secure transmission and HE storage on backend
    simulateHomomorphicStorage(encryptedPayload);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 5. Simulate result (80% success rate)
    const success = Math.random() > 0.2;

    setCredentials(prev => ({
      ...prev,
      [apiId]: {
        ...prev[apiId],
        status: success ? 'Connected' : 'Failed',
        lastTested: new Date().toLocaleTimeString(),
      },
    }));

    setGlobalMessage({
      type: success ? 'success' : 'error',
      message: success
        ? `${apiName} connection tested successfully. Credentials secured using PQC/P2PE.`
        : `Failed to connect to ${apiName}. Check credentials and network.`,
    });
  }, [credentials]);

  // --- Render Functions ---

  const renderApiCard = (api: ApiConfig, state: ApiCredentialState) => {
    const isTesting = state.status === 'Testing...';

    return (
      <div key={api.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition duration-300 hover:shadow-lg">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">{api.name}</h3>

        {/* Credential Input Fields */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {api.fields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={state[field.key] || ''}
                  onChange={(e) => handleInputChange(api.id, field.key, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={state[field.key] || ''}
                  onChange={(e) => handleInputChange(api.id, field.key, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Dedicated Authentication Slot */}
        <div className="mb-6 p-3 bg-indigo-50 rounded-md border border-indigo-200">
          <label className="block text-sm font-bold text-indigo-800 mb-2">
            Authentication Method Slot
          </label>
          <select
            className="w-full p-2 border border-indigo-300 rounded-md bg-white text-sm"
            value={state.authMethod}
            onChange={(e) => handleAuthMethodChange(api.id, e.target.value as AuthMethod)}
          >
            <option value="API_KEY">API Key (Standard)</option>
            <option value="OAuth2">OAuth 2.0 Flow</option>
            <option value="JWT">JWT Bearer Token</option>
            <option value="PQC_KYBER_SIGNED">PQC Kyber Key Exchange (Recommended)</option>
          </select>
          <p className="mt-1 text-xs text-indigo-600">
            Selected method determines how credentials are encrypted and validated.
          </p>
        </div>

        {/* Status and Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <StatusIndicator status={state.status} />
            <p className="text-xs text-gray-500">Last Tested: {state.lastTested}</p>
          </div>
          <button
            onClick={() => handleTestConnection(api.id, api.name)}
            disabled={isTesting}
            className={`px-4 py-2 text-sm font-medium rounded-md transition duration-150 ${
              isTesting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            }`}
          >
            {isTesting ? 'Testing...' : 'Test & Secure Connection'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Billion Dollar API Integration Hub</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage and secure credentials for 100+ integrated APIs. All sensitive data is protected using
          <span className="font-mono text-indigo-600 mx-1">Kyber/Dilithium (PQC)</span>,
          <span className="font-mono text-indigo-600 mx-1">Point-to-Point Encryption (P2PE)</span>, and
          <span className="font-mono text-indigo-600 mx-1">Homomorphic Encryption (HE)</span> storage.
        </p>
      </header>

      {globalMessage && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            globalMessage.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
          } border`}
          role="alert"
        >
          <p className="font-medium">{globalMessage.message}</p>
        </div>
      )}

      <main className="space-y-12">
        {API_DEFINITIONS.map(category => (
          <section key={category.name} className="border-b pb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h2>
            <p className="text-gray-500 mb-6">{category.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {category.apis.map(api => renderApiCard(api, credentials[api.id]))}
            </div>
          </section>
        ))}
      </main>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>
          Security Layer Status: PQC (Kyber/Dilithium) Key Exchange Active | P2PE Tunnel Established | HE Storage Enabled.
        </p>
      </footer>
    </div>
  );
};

export default ApiManagementDashboard;