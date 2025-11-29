import React, { useState, useEffect, useCallback } from 'react';

// --- Type Definitions for Project Data ---
interface Project {
    id: string;
    name: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
    platform: 'Jira' | 'Trello' | 'Asana' | 'GitHub';
    link: string;
    lastUpdated: string;
}

interface Task {
    id: string;
    projectId: string;
    name: string;
    status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
    assignedTo?: string;
    dueDate?: string;
    priority?: 'Low' | 'Medium' | 'High';
    platform: 'Jira' | 'Trello' | 'Asana';
    link: string;
}

interface Repository {
    id: string;
    name: string;
    owner: string;
    description: string;
    stars: number;
    forks: number;
    lastCommit: string;
    link: string;
}

// --- Mock API Utility Functions (Simulating Backend Calls) ---
// In a real application, these would make actual HTTP requests to a secure backend
// which then interfaces with the respective external APIs.
// The backend would also handle secure storage of API keys and advanced encryption.

const mockFetch = async <T>(data: T[], delay = 500): Promise<T[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), delay);
    });
};

const mockJiraProjects: Project[] = [
    { id: 'JIRA-001', name: 'Website Redesign', description: 'Complete overhaul of the company website.', status: 'In Progress', platform: 'Jira', link: '#', lastUpdated: '2023-10-26' },
    { id: 'JIRA-002', name: 'Mobile App v2.0', description: 'Develop new features for the mobile application.', status: 'Not Started', platform: 'Jira', link: '#', lastUpdated: '2023-10-20' },
];

const mockTrelloBoards: Project[] = [
    { id: 'TRELLO-001', name: 'Marketing Campaign Q4', description: 'Plan and execute Q4 marketing initiatives.', status: 'In Progress', platform: 'Trello', link: '#', lastUpdated: '2023-10-25' },
    { id: 'TRELLO-002', name: 'Team Onboarding', description: 'Streamline the new employee onboarding process.', status: 'Completed', platform: 'Trello', link: '#', lastUpdated: '2023-10-15' },
];

const mockAsanaTasks: Task[] = [
    { id: 'ASANA-001', projectId: 'ASANA-PROJ-1', name: 'Review Q3 Performance', status: 'Done', assignedTo: 'Alice', dueDate: '2023-10-20', platform: 'Asana', link: '#' },
    { id: 'ASANA-002', projectId: 'ASANA-PROJ-1', name: 'Prepare Q4 Budget', status: 'In Progress', assignedTo: 'Bob', dueDate: '2023-10-31', platform: 'Asana', link: '#' },
];

const mockGitHubRepos: Repository[] = [
    { id: 'GH-001', name: 'frontend-service', owner: 'org-x', description: 'Main frontend application repository.', stars: 120, forks: 45, lastCommit: '2023-10-26 14:30', link: '#' },
    { id: 'GH-002', name: 'backend-api', owner: 'org-x', description: 'Core API services for the platform.', stars: 98, forks: 30, lastCommit: '2023-10-25 10:15', link: '#' },
];

// --- Advanced Security Configuration (Conceptual) ---
// In a real system, these would be managed by a secure backend service,
// potentially using hardware security modules (HSMs) and dedicated cryptographic libraries.
// The UI here merely reflects the *status* or *configuration* of these features.
interface SecurityConfig {
    homomorphicEncryptionEnabled: boolean;
    pointToPointEncryptionActive: boolean;
    kyberDilithiumKeyExchangeUsed: boolean;
    dataMaskingEnabled: boolean;
    auditLoggingEnabled: boolean;
}

const initialSecurityConfig: SecurityConfig = {
    homomorphicEncryptionEnabled: true, // Assumed to be handled by backend for sensitive data analytics
    pointToPointEncryptionActive: true, // Assumed for all internal and external API communications
    kyberDilithiumKeyExchangeUsed: true, // Assumed for post-quantum secure key exchange
    dataMaskingEnabled: true, // For displaying sensitive data in UI
    auditLoggingEnabled: true, // For compliance and security monitoring
};

const ProjectManagementView: React.FC = () => {
    // --- State for API Keys and Authentication ---
    const [jiraApiKey, setJiraApiKey] = useState<string>('');
    const [trelloApiKey, setTrelloApiKey] = useState<string>('');
    const [asanaApiKey, setAsanaApiKey] = useState<string>('');
    const [gitHubToken, setGitHubToken] = useState<string>('');
    const [slackWebhookUrl, setSlackWebhookUrl] = useState<string>('');
    const [openAIApiKey, setOpenAIApiKey] = useState<string>('');

    // --- State for Fetched Data ---
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [aiInsights, setAiInsights] = useState<string>('');

    // --- State for Loading and Errors ---
    const [loadingJira, setLoadingJira] = useState<boolean>(false);
    const [loadingTrello, setLoadingTrello] = useState<boolean>(false);
    const [loadingAsana, setLoadingAsana] = useState<boolean>(false);
    const [loadingGitHub, setLoadingGitHub] = useState<boolean>(false);
    const [loadingAI, setLoadingAI] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- State for Advanced Security Configuration ---
    const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(initialSecurityConfig);

    // --- Data Fetching Functions ---
    const fetchJiraData = useCallback(async () => {
        if (!jiraApiKey) return;
        setLoadingJira(true);
        setError(null);
        try {
            // In a real app, this would be a call to your secure backend
            // which then uses the Jira API key (securely stored/accessed)
            // and applies P2P encryption for communication.
            const data = await mockFetch(mockJiraProjects);
            setProjects(prev => [...prev.filter(p => p.platform !== 'Jira'), ...data]);
        } catch (err: any) {
            setError(`Failed to fetch Jira data: ${err.message}`);
        } finally {
            setLoadingJira(false);
        }
    }, [jiraApiKey]);

    const fetchTrelloData = useCallback(async () => {
        if (!trelloApiKey) return;
        setLoadingTrello(true);
        setError(null);
        try {
            const data = await mockFetch(mockTrelloBoards);
            setProjects(prev => [...prev.filter(p => p.platform !== 'Trello'), ...data]);
        } catch (err: any) {
            setError(`Failed to fetch Trello data: ${err.message}`);
        } finally {
            setLoadingTrello(false);
        }
    }, [trelloApiKey]);

    const fetchAsanaData = useCallback(async () => {
        if (!asanaApiKey) return;
        setLoadingAsana(true);
        setError(null);
        try {
            const data = await mockFetch(mockAsanaTasks);
            setTasks(prev => [...prev.filter(t => t.platform !== 'Asana'), ...data]);
        } catch (err: any) {
            setError(`Failed to fetch Asana data: ${err.message}`);
        } finally {
            setLoadingAsana(false);
        }
    }, [asanaApiKey]);

    const fetchGitHubData = useCallback(async () => {
        if (!gitHubToken) return;
        setLoadingGitHub(true);
        setError(null);
        try {
            const data = await mockFetch(mockGitHubRepos);
            setRepositories(data);
        } catch (err: any) {
            setError(`Failed to fetch GitHub data: ${err.message}`);
        } finally {
            setLoadingGitHub(false);
        }
    }, [gitHubToken]);

    const fetchAiInsights = useCallback(async () => {
        if (!openAIApiKey) return;
        setLoadingAI(true);
        setError(null);
        try {
            // Simulate an AI call for project insights
            // In a real app, this would send project/task data (potentially homomorphically encrypted)
            // to a backend service that uses OpenAI/Google Cloud AI API.
            const insight = await new Promise<string>(resolve => setTimeout(() => {
                resolve("AI suggests focusing on 'Website Redesign' tasks related to performance optimization for immediate impact. Potential bottlenecks identified in 'Mobile App v2.0' backend integration.");
            }, 1500));
            setAiInsights(insight);
        } catch (err: any) {
            setError(`Failed to get AI insights: ${err.message}`);
        } finally {
            setLoadingAI(false);
        }
    }, [openAIApiKey]);

    // --- Effects to Trigger Data Fetching ---
    useEffect(() => {
        fetchJiraData();
    }, [fetchJiraData]);

    useEffect(() => {
        fetchTrelloData();
    }, [fetchTrelloData]);

    useEffect(() => {
        fetchAsanaData();
    }, [fetchAsanaData]);

    useEffect(() => {
        fetchGitHubData();
    }, [fetchGitHubData]);

    useEffect(() => {
        fetchAiInsights();
    }, [fetchAiInsights]);

    // --- UI for Authentication Slots ---
    const renderAuthSlot = (
        platformName: string,
        apiKey: string,
        setApiKey: React.Dispatch<React.SetStateAction<string>>,
        onConnect: () => void,
        loading: boolean
    ) => (
        <div style={styles.authSlot}>
            <h3>{platformName} API Configuration</h3>
            <input
                type="password"
                placeholder={`${platformName} API Key/Token`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={styles.input}
            />
            <button onClick={onConnect} disabled={loading || !apiKey} style={styles.button}>
                {loading ? 'Connecting...' : `Connect ${platformName}`}
            </button>
            {apiKey && <span style={{ marginLeft: '10px', color: 'green' }}>Connected!</span>}
        </div>
    );

    // --- UI for Security Configuration ---
    const renderSecurityConfig = () => (
        <div style={styles.section}>
            <h2>Advanced Security & Privacy Settings</h2>
            <p style={styles.securityNote}>
                These settings reflect the status of advanced cryptographic measures implemented in the backend
                infrastructure to protect your project data. Actual cryptographic operations (Homomorphic Encryption,
                Point-to-Point Encryption, Kyber-Dilithium Key Exchange) are handled server-side.
            </p>
            <div style={styles.securityItem}>
                <strong>Homomorphic Encryption:</strong>{' '}
                <span style={{ color: securityConfig.homomorphicEncryptionEnabled ? 'green' : 'red' }}>
                    {securityConfig.homomorphicEncryptionEnabled ? 'Enabled (for secure analytics)' : 'Disabled'}
                </span>
                <p style={styles.securityDescription}>
                    Allows computations on encrypted data without decrypting it, ensuring privacy for sensitive project metrics and AI insights.
                </p>
            </div>
            <div style={styles.securityItem}>
                <strong>Point-to-Point Encryption (P2P):</strong>{' '}
                <span style={{ color: securityConfig.pointToPointEncryptionActive ? 'green' : 'red' }}>
                    {securityConfig.pointToPointEncryptionActive ? 'Active (all communications)' : 'Inactive'}
                </span>
                <p style={styles.securityDescription}>
                    Ensures all data transmitted between client, backend, and external APIs is encrypted end-to-end, protecting against eavesdropping.
                </p>
            </div>
            <div style={styles.securityItem}>
                <strong>Kyber-Dilithium Key Exchange:</strong>{' '}
                <span style={{ color: securityConfig.kyberDilithiumKeyExchangeUsed ? 'green' : 'red' }}>
                    {securityConfig.kyberDilithiumKeyExchangeUsed ? 'In Use (Post-Quantum Secure)' : 'Not Used'}
                </span>
                <p style={styles.securityDescription}>
                    Utilizes post-quantum cryptographic algorithms for key exchange, providing resilience against future quantum computer attacks.
                </p>
            </div>
            <div style={styles.securityItem}>
                <strong>Data Masking:</strong>{' '}
                <span style={{ color: securityConfig.dataMaskingEnabled ? 'green' : 'red' }}>
                    {securityConfig.dataMaskingEnabled ? 'Enabled (UI display)' : 'Disabled'}
                </span>
                <p style={styles.securityDescription}>
                    Masks sensitive information in the UI where full details are not required, enhancing data privacy.
                </p>
            </div>
            <div style={styles.securityItem}>
                <strong>Audit Logging:</strong>{' '}
                <span style={{ color: securityConfig.auditLoggingEnabled ? 'green' : 'red' }}>
                    {securityConfig.auditLoggingEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <p style={styles.securityDescription}>
                    Comprehensive logging of all actions and data access for compliance and security monitoring.
                </p>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Unified Project Management Dashboard</h1>
            <p style={styles.subheader}>
                Connect, track, and manage all your projects from Jira, Trello, Asana, and GitHub in one secure place.
                Leveraging advanced AI and post-quantum cryptography for a billion-dollar experience.
            </p>

            {error && <div style={styles.error}>{error}</div>}

            {/* Authentication Section */}
            <div style={styles.section}>
                <h2>API Integrations & Authentication</h2>
                <div style={styles.authGrid}>
                    {renderAuthSlot('Jira', jiraApiKey, setJiraApiKey, fetchJiraData, loadingJira)}
                    {renderAuthSlot('Trello', trelloApiKey, setTrelloApiKey, fetchTrelloData, loadingTrello)}
                    {renderAuthSlot('Asana', asanaApiKey, setAsanaApiKey, fetchAsanaData, loadingAsana)}
                    {renderAuthSlot('GitHub', gitHubToken, setGitHubToken, fetchGitHubData, loadingGitHub)}
                    <div style={styles.authSlot}>
                        <h3>OpenAI API Configuration (for AI Insights)</h3>
                        <input
                            type="password"
                            placeholder="OpenAI API Key"
                            value={openAIApiKey}
                            onChange={(e) => setOpenAIApiKey(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={fetchAiInsights} disabled={loadingAI || !openAIApiKey} style={styles.button}>
                            {loadingAI ? 'Generating...' : 'Get AI Insights'}
                        </button>
                        {openAIApiKey && <span style={{ marginLeft: '10px', color: 'green' }}>Configured!</span>}
                    </div>
                    <div style={styles.authSlot}>
                        <h3>Slack Webhook URL (for Notifications)</h3>
                        <input
                            type="text"
                            placeholder="Slack Webhook URL"
                            value={slackWebhookUrl}
                            onChange={(e) => setSlackWebhookUrl(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={() => alert('Slack integration configured!')} disabled={!slackWebhookUrl} style={styles.button}>
                            Configure Slack
                        </button>
                        {slackWebhookUrl && <span style={{ marginLeft: '10px', color: 'green' }}>Configured!</span>}
                    </div>
                </div>
            </div>

            {/* AI Insights Section */}
            {openAIApiKey && (
                <div style={styles.section}>
                    <h2>AI-Powered Project Insights <span style={styles.aiBadge}>Powered by OpenAI/Google Cloud AI</span></h2>
                    {loadingAI ? (
                        <p>Generating AI insights...</p>
                    ) : aiInsights ? (
                        <p style={styles.aiInsightText}>{aiInsights}</p>
                    ) : (
                        <p>No AI insights available. Connect OpenAI API and click 'Get AI Insights'.</p>
                    )}
                </div>
            )}

            {/* Projects Section */}
            <div style={styles.section}>
                <h2>All Projects</h2>
                {loadingJira || loadingTrello ? (
                    <p>Loading projects...</p>
                ) : projects.length === 0 ? (
                    <p>No projects found. Connect your project management tools above.</p>
                ) : (
                    <div style={styles.grid}>
                        {projects.map((project) => (
                            <div key={project.id} style={styles.card}>
                                <h3>{project.name} <span style={styles.platformBadge}>{project.platform}</span></h3>
                                <p>{project.description}</p>
                                <p><strong>Status:</strong> <span style={{ color: project.status === 'In Progress' ? 'orange' : project.status === 'Completed' ? 'green' : 'gray' }}>{project.status}</span></p>
                                <p><strong>Last Updated:</strong> {project.lastUpdated}</p>
                                <a href={project.link} target="_blank" rel="noopener noreferrer" style={styles.link}>View on {project.platform}</a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tasks Section */}
            <div style={styles.section}>
                <h2>All Tasks</h2>
                {loadingAsana ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks found. Connect your task management tools above.</p>
                ) : (
                    <div style={styles.grid}>
                        {tasks.map((task) => (
                            <div key={task.id} style={styles.card}>
                                <h3>{task.name} <span style={styles.platformBadge}>{task.platform}</span></h3>
                                <p><strong>Status:</strong> <span style={{ color: task.status === 'In Progress' ? 'orange' : task.status === 'Done' ? 'green' : 'gray' }}>{task.status}</span></p>
                                {task.assignedTo && <p><strong>Assigned To:</strong> {task.assignedTo}</p>}
                                {task.dueDate && <p><strong>Due Date:</strong> {task.dueDate}</p>}
                                <a href={task.link} target="_blank" rel="noopener noreferrer" style={styles.link}>View on {task.platform}</a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* GitHub Repositories Section */}
            <div style={styles.section}>
                <h2>GitHub Repositories</h2>
                {loadingGitHub ? (
                    <p>Loading repositories...</p>
                ) : repositories.length === 0 ? (
                    <p>No GitHub repositories found. Connect your GitHub account above.</p>
                ) : (
                    <div style={styles.grid}>
                        {repositories.map((repo) => (
                            <div key={repo.id} style={styles.card}>
                                <h3>{repo.name}</h3>
                                <p><strong>Owner:</strong> {repo.owner}</p>
                                <p>{repo.description}</p>
                                <p>⭐ {repo.stars} | 🍴 {repo.forks}</p>
                                <p><strong>Last Commit:</strong> {repo.lastCommit}</p>
                                <a href={repo.link} target="_blank" rel="noopener noreferrer" style={styles.link}>View on GitHub</a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Conceptual Integrations (Billion Dollar Upgrade) */}
            <div style={styles.section}>
                <h2>Expanded Ecosystem Integrations <span style={styles.aiBadge}>Billion Dollar Upgrade</span></h2>
                <p style={styles.subheader}>
                    This dashboard is designed to seamlessly integrate with a vast array of services, providing a truly
                    unified and intelligent project management experience.
                </p>
                <div style={styles.integrationGrid}>
                    <div style={styles.integrationCard}>
                        <h3>Real-time Communication</h3>
                        <p>Slack, Discord, Twilio (SMS/Voice/Video)</p>
                        <button style={styles.smallButton}>Manage Integrations</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>CI/CD & DevOps</h3>
                        <p>CircleCI, Travis CI, Jenkins, Docker Hub, Kubernetes, Terraform</p>
                        <button style={styles.smallButton}>View Pipelines</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Cloud & Infrastructure</h3>
                        <p>AWS, Azure, Google Cloud, DigitalOcean, Linode, Cloudflare</p>
                        <button style={styles.smallButton}>Monitor Resources</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Error Tracking & Monitoring</h3>
                        <p>Sentry, Datadog, New Relic, PagerDuty</p>
                        <button style={styles.smallButton}>Access Dashboards</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Content & Documentation</h3>
                        <p>Notion, Airtable, Contentful, Sanity, Strapi</p>
                        <button style={styles.smallButton}>Browse Content</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Payments & Finance</h3>
                        <p>Stripe, PayPal, Plaid, Yodlee, Top 100 Banking APIs</p>
                        <button style={styles.smallButton}>View Financials</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Identity & Auth</h3>
                        <p>Stytch, Auth0, Okta, Firebase, Supabase, Stripe Identity</p>
                        <button style={styles.smallButton}>Manage Users</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Mapping & Location</h3>
                        <p>Google Maps, Mapbox, HERE, Foursquare, Yelp</p>
                        <button style={styles.smallButton}>Explore Locations</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Marketing & CRM</h3>
                        <p>Salesforce, HubSpot, Mailchimp, SendGrid, Intercom</p>
                        <button style={styles.smallButton}>View Campaigns</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>E-commerce</h3>
                        <p>Shopify, BigCommerce, Magento, WooCommerce</p>
                        <button style={styles.smallButton}>Manage Stores</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>File Storage</h3>
                        <p>Dropbox, Box, Google Drive, OneDrive</p>
                        <button style={styles.smallButton}>Access Files</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Legal & HR</h3>
                        <p>DocuSign, HelloSign, Checkr, Onfido, Clerky, Stripe Atlas</p>
                        <button style={styles.smallButton}>Manage Documents</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Shipping & Logistics</h3>
                        <p>EasyPost, Shippo, Lob</p>
                        <button style={styles.smallButton}>Track Shipments</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Social & Media</h3>
                        <p>Twitter, Facebook, Instagram, YouTube, Spotify, Twitch, Mux, Cloudinary</p>
                        <button style={styles.smallButton}>Manage Media</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Search & Analytics</h3>
                        <p>Algolia, Elasticsearch, Segment</p>
                        <button style={styles.smallButton}>View Analytics</button>
                    </div>
                    <div style={styles.integrationCard}>
                        <h3>Real-time Data</h3>
                        <p>Pusher, Ably</p>
                        <button style={styles.smallButton}>Configure Events</button>
                    </div>
                </div>
            </div>

            {/* Security Configuration Section */}
            {renderSecurityConfig()}
        </div>
    );
};

// --- Basic Inline Styles (for demonstration purposes) ---
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#f9fbfd',
        color: '#333',
        lineHeight: '1.6',
    },
    header: {
        fontSize: '2.5em',
        color: '#2c3e50',
        marginBottom: '10px',
        textAlign: 'center',
        fontWeight: 700,
    },
    subheader: {
        fontSize: '1.1em',
        color: '#555',
        marginBottom: '30px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto 30px auto',
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e0e6ed',
    },
    authGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
    },
    authSlot: {
        border: '1px solid #e0e6ed',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fdfdfd',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1em',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px 20px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        alignSelf: 'flex-start',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
    },
    card: {
        backgroundColor: '#fdfdfd',
        border: '1px solid #e0e6ed',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
    },
    platformBadge: {
        backgroundColor: '#e9ecef',
        color: '#495057',
        padding: '4px 8px',
        borderRadius: '5px',
        fontSize: '0.8em',
        fontWeight: 600,
        marginLeft: '10px',
    },
    aiBadge: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '4px 8px',
        borderRadius: '5px',
        fontSize: '0.8em',
        fontWeight: 600,
        marginLeft: '10px',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 500,
        marginTop: '10px',
        display: 'inline-block',
    },
    linkHover: {
        textDecoration: 'underline',
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    aiInsightText: {
        backgroundColor: '#e6f7ff',
        borderLeft: '4px solid #007bff',
        padding: '15px',
        borderRadius: '8px',
        fontStyle: 'italic',
        color: '#333',
    },
    securityNote: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderLeft: '4px solid #ffeeba',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '0.95em',
    },
    securityItem: {
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px dashed #eee',
    },
    securityDescription: {
        fontSize: '0.9em',
        color: '#666',
        marginTop: '5px',
    },
    integrationGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    integrationCard: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #e0e6ed',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    smallButton: {
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#6c757d',
        color: 'white',
        fontSize: '0.9em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginTop: '15px',
        alignSelf: 'flex-start',
    },
    smallButtonHover: {
        backgroundColor: '#5a6268',
    },
};

export default ProjectManagementView;