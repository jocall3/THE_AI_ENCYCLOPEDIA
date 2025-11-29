import React, { useState, useCallback, useMemo } from 'react';
import Card from './Card';
import { Cpu, Zap, ShieldCheck, AlertTriangle, UploadCloud, Link, Settings, UserCheck, Database, Globe, Terminal, Code, Aperture, Brain, Infinity, Rocket } from 'lucide-react';

// --- Component: AI Enhanced Input Field ---
interface AIInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    icon: React.ReactNode;
    aiSuggestion?: string;
    onAIGenerate?: () => void;
    isGenerating?: boolean;
}

const AIControlledInput: React.FC<AIInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    icon,
    aiSuggestion,
    onAIGenerate,
    isGenerating = false
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-400">
                {icon}
                <span className="ml-2">{label}</span>
            </label>
            <div className={`flex items-center rounded-lg transition-all duration-300 ${isFocused ? 'ring-2 ring-cyan-500 border border-cyan-500' : 'border border-gray-700 bg-gray-900/50'}`}>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-grow p-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm font-mono"
                />
                {aiSuggestion && onAIGenerate && (
                    <button
                        onClick={onAIGenerate}
                        disabled={isGenerating}
                        title={`AI Suggestion: ${aiSuggestion}`}
                        className={`p-2 m-1 rounded-md transition-colors flex items-center text-xs ${isGenerating ? 'bg-indigo-700 text-indigo-300 cursor-not-allowed' : 'bg-indigo-600/30 text-indigo-400 hover:bg-indigo-600/50'}`}
                    >
                        {isGenerating ? (
                            <Cpu className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                            <Brain className="w-4 h-4 mr-1" />
                        )}
                        AI Assist
                    </button>
                )}
            </div>
            {aiSuggestion && !isGenerating && (
                <p className="text-xs text-indigo-400 mt-1 flex items-center">
                    <Zap className="w-3 h-3 mr-1" /> AI Suggestion Available: {aiSuggestion.substring(0, 50)}...
                </p>
            )}
        </div>
    );
};

// --- Component: Metadata Uploader with AI Validation ---
interface MetadataUploaderProps {
    onUrlSubmit: (url: string) => void;
    onFileUpload: (file: File) => void;
    isProcessing: boolean;
}

const MetadataUploader: React.FC<MetadataUploaderProps> = ({ onUrlSubmit, onFileUpload, isProcessing }) => {
    const [metadataUrl, setMetadataUrl] = useState('');
    const [aiUrlSuggestion, setAiUrlSuggestion] = useState<string | null>(null);

    // Simulated AI suggestion generation
    const generateAiSuggestion = useCallback(() => {
        if (!metadataUrl) {
            setAiUrlSuggestion("Enter a URL to get a validation suggestion.");
            return;
        }
        setAiUrlSuggestion("Analyzing URL structure for SAML compliance...");
        setTimeout(() => {
            setAiUrlSuggestion(`Validated against ${metadataUrl.length % 100} known IdP schemas. Looks plausible.`);
        }, 1500);
    }, [metadataUrl]);

    const handleUrlSubmit = () => {
        if (metadataUrl) {
            onUrlSubmit(metadataUrl);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileUpload(event.target.files[0]);
        }
    };

    return (
        <Card title="Service Provider (SP) Metadata & Identity Provider (IdP) Ingestion">
            <div className="space-y-6">
                {/* URL Ingestion Module */}
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl shadow-cyan-900/20">
                    <h4 className="font-bold text-lg text-cyan-300 flex items-center mb-3"><Link className="w-5 h-5 mr-2" /> IdP Metadata URL Ingestion</h4>
                    <p className="text-sm text-gray-400 mb-4">
                        Provide the publicly accessible metadata URL from your Identity Provider. The system will perform real-time schema validation and attribute mapping inference using proprietary AI models.
                    </p>
                    <AIControlledInput
                        label="IdP Metadata URL Endpoint"
                        placeholder="https://idp.corp.com/saml/metadata.xml"
                        value={metadataUrl}
                        onChange={setMetadataUrl}
                        icon={<Link className="w-4 h-4" />}
                        aiSuggestion={aiUrlSuggestion}
                        onAIGenerate={generateAiSuggestion}
                        isGenerating={isProcessing}
                    />
                    <button
                        onClick={handleUrlSubmit}
                        disabled={isProcessing || !metadataUrl}
                        className="w-full mt-4 p-3 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center 
                                   bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
                    >
                        {isProcessing ? (
                            <>
                                <Cpu className="w-5 h-5 mr-2 animate-pulse" /> Ingesting & Validating...
                            </>
                        ) : (
                            <>
                                <Globe className="w-5 h-5 mr-2" /> Initiate AI-Driven Metadata Sync
                            </>
                        )}
                    </button>
                </div>

                {/* OR Separator with AI Context */}
                <div className="flex items-center justify-center my-4">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="mx-4 text-xs font-medium uppercase text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">OR</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                {/* File Upload Module */}
                <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl shadow-indigo-900/20">
                    <h4 className="font-bold text-lg text-indigo-300 flex items-center mb-3"><UploadCloud className="w-5 h-5 mr-2" /> Manual Metadata Upload (.xml)</h4>
                    <p className="text-sm text-gray-400 mb-4">
                        Upload your IdP's raw XML metadata file directly. The system will use advanced NLP and XML parsing to extract configuration parameters and flag potential security vulnerabilities.
                    </p>
                    <label htmlFor="metadata-file-upload" className="block w-full cursor-pointer">
                        <div className="w-full p-6 border-2 border-dashed border-indigo-600 rounded-lg text-center hover:border-indigo-400 transition-colors bg-gray-900/50 hover:bg-gray-800/70">
                            <UploadCloud className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                            <p className="text-sm font-semibold text-white">Drag & Drop XML here or Click to Browse</p>
                            <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supported format: SAML Metadata XML.</p>
                        </div>
                        <input
                            id="metadata-file-upload"
                            type="file"
                            accept=".xml"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isProcessing}
                        />
                    </label>
                    {isProcessing && (
                        <p className="text-center mt-3 text-sm text-indigo-400 flex items-center justify-center">
                            <Code className="w-4 h-4 mr-2 animate-pulse" /> Parsing file structure...
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};

// --- Component: IdP Details Display ---
interface IdPDetailsProps {
    acsUrl: string;
    entityId: string;
}

const IdPDetailsDisplay: React.FC<IdPDetailsProps> = ({ acsUrl, entityId }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    const DetailItem: React.FC<{ label: string, value: string, icon: React.ReactNode }> = ({ label, value, icon }) => (
        <div className="p-4 bg-gray-800/70 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all duration-200">
            <div className="flex items-center mb-1">
                {icon}
                <h4 className="text-xs font-medium text-gray-400 ml-2 uppercase tracking-wider">{label}</h4>
            </div>
            <div className="flex justify-between items-center">
                <p className="font-mono text-sm text-cyan-300 break-all pr-4">{value}</p>
                <button
                    onClick={() => handleCopy(value)}
                    title={`Copy ${label}`}
                    className="text-gray-500 hover:text-white p-1 rounded transition-colors flex-shrink-0"
                >
                    {copied ? <ShieldCheck className="w-4 h-4 text-green-400" /> : <Zap className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );

    return (
        <Card title="SAML Protocol Endpoints & Identifiers">
            <div className="space-y-4">
                <p className="text-gray-400 border-b border-gray-700 pb-3">
                    These are the critical endpoints your Identity Provider (IdP) must be configured with to successfully establish a secure, authenticated session with the Quantum Ledger System (QLS).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                        label="Assertion Consumer Service (ACS) URL"
                        value={acsUrl}
                        icon={<Terminal className="w-4 h-4 text-cyan-400" />}
                    />
                    <DetailItem
                        label="Entity ID / Audience URI"
                        value={entityId}
                        icon={<Database className="w-4 h-4 text-cyan-400" />}
                    />
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg flex items-start mt-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-300 ml-3">
                        **Security Advisory:** Ensure the signing certificate provided by your IdP is valid for at least 365 days. The system automatically monitors certificate expiry and alerts administrators 90 days prior to expiration via the Quantum Alert Matrix.
                    </p>
                </div>
            </div>
        </Card>
    );
};

// --- Component: Connection Status Dashboard ---
interface ConnectionStatusProps {
    isConnected: boolean;
    providerName: string;
    lastSync: string;
    adminEmail: string;
}

const ConnectionStatusDashboard: React.FC<ConnectionStatusProps> = ({ isConnected, providerName, lastSync, adminEmail }) => {
    const statusColor = isConnected ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700';
    const iconColor = isConnected ? 'text-green-300' : 'text-red-300';
    const iconBg = isConnected ? 'bg-green-500/20' : 'bg-red-500/20';
    const titleColor = isConnected ? 'text-white' : 'text-red-300';

    return (
        <Card title="Federated Identity Connection Status">
            <div className={`flex items-center p-5 rounded-xl transition-all duration-500 shadow-xl ${statusColor}`}>
                <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center mr-5 flex-shrink-0`}>
                    {isConnected ? (
                        <ShieldCheck className={`w-8 h-8 ${iconColor}`} />
                    ) : (
                        <AlertTriangle className={`w-8 h-8 ${iconColor}`} />
                    )}
                </div>
                <div className="flex-grow min-w-0">
                    <h4 className={`text-xl font-extrabold tracking-wide ${titleColor}`}>{providerName} Connection: {isConnected ? 'ACTIVE' : 'INACTIVE'}</h4>
                    <p className="text-sm text-cyan-400 mt-1 truncate">Primary Administrator: {adminEmail}</p>
                    <p className="text-xs text-gray-400 mt-1">Last Synchronization Event: {lastSync}</p>
                </div>
                <div className="ml-6 flex-shrink-0 space-y-2">
                    <button
                        className={`w-full px-4 py-2 font-bold rounded-lg text-sm transition-transform transform hover:scale-[1.02] shadow-md ${isConnected ? 'bg-red-700/70 hover:bg-red-600 text-white' : 'bg-green-700/70 hover:bg-green-600 text-white'}`}
                        onClick={() => console.log(isConnected ? "Disconnecting..." : "Reconnecting...")}
                    >
                        {isConnected ? 'Terminate Session' : 'Initiate Re-Auth'}
                    </button>
                    <button
                        className="w-full px-4 py-2 font-medium rounded-lg text-xs bg-gray-700/50 hover:bg-gray-600 text-gray-300 transition-colors"
                        onClick={() => console.log("Opening detailed audit log...")}
                    >
                        View Audit Log
                    </button>
                </div>
            </div>
        </Card>
    );
};

// --- Component: AI Configuration Assistant Panel ---
const AIConfigurationAssistant: React.FC = () => {
    const [isThinking, setIsThinking] = useState(false);
    const [recommendation, setRecommendation] = useState<string | null>(null);

    const runAIAnalysis = useCallback(() => {
        setIsThinking(true);
        setRecommendation(null);
        // Simulate complex, billion-dollar AI processing
        setTimeout(() => {
            const suggestions = [
                "Recommendation 1: Implement Attribute Mapping for 'Role' field using Regex pattern matching on IdP groups.",
                "Recommendation 2: Enable Just-In-Time (JIT) provisioning for new users, setting default access level to 'Tier 1 Analyst'.",
                "Recommendation 3: Configure certificate rotation policy to auto-fetch metadata every 180 days via secure webhook.",
                "Recommendation 4: Deploy a secondary failover IdP endpoint (e.g., Azure AD fallback) for 99.999% uptime guarantee."
            ];
            const selectedRec = suggestions[Math.floor(Math.random() * suggestions.length)];
            setRecommendation(selectedRec);
            setIsThinking(false);
        }, 3000);
    }, []);

    return (
        <Card title="Quantum AI Configuration Co-Pilot">
            <div className="p-5 bg-indigo-900/20 border border-indigo-700 rounded-xl shadow-2xl shadow-indigo-900/50 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-indigo-300 flex items-center">
                        <Brain className="w-6 h-6 mr-2" /> Predictive SSO Optimization
                    </h3>
                    <button
                        onClick={runAIAnalysis}
                        disabled={isThinking}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all disabled:bg-gray-600 flex items-center"
                    >
                        {isThinking ? (
                            <>
                                <Infinity className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            <>
                                <Rocket className="w-4 h-4 mr-2" /> Run Deep Configuration Scan
                            </>
                        )}
                    </button>
                </div>
                
                {recommendation && !isThinking && (
                    <div className="p-4 bg-indigo-800/50 border border-indigo-500 rounded-lg">
                        <p className="text-sm font-semibold text-white mb-1">AI Insight:</p>
                        <p className="text-sm text-indigo-200">{recommendation}</p>
                        <button className="mt-2 text-xs text-cyan-300 hover:text-cyan-100 underline">Apply Suggestion Automatically</button>
                    </div>
                )}

                {!recommendation && !isThinking && (
                    <p className="text-sm text-gray-400 italic">
                        Click 'Run Deep Configuration Scan' to leverage our proprietary AI to audit your current SAML setup against global security best practices and performance benchmarks.
                    </p>
                )}
            </div>
        </Card>
    );
};


// --- Main Component: SSOView ---
const SSOView: React.FC = () => {
    // State for configuration data (simulated persistence)
    const [acsUrl, setAcsUrl] = useState("https://auth.quantumledger.com/sso/v3/acs/corp-alpha-001");
    const [entityId, setEntityId] = useState("urn:quantumledger:corp:alpha:sp:2024");
    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: true,
        providerName: "Global Enterprise Identity Federation (GEIF)",
        lastSync: "2024-07-25T14:30:00Z (Real-time)",
        adminEmail: "security.ops@globalcorp.net"
    });
    const [isProcessing, setIsProcessing] = useState(false);

    // Simulated AI processing handlers
    const handleUrlIngestion = useCallback((url: string) => {
        console.log(`Attempting URL ingestion: ${url}`);
        setIsProcessing(true);
        setTimeout(() => {
            // Simulate successful parsing and update
            setAcsUrl(`https://auth.quantumledger.com/sso/v3/acs/ingested-${Date.now() % 1000}`);
            setEntityId(`urn:quantumledger:ingested:${Date.now() % 1000}`);
            setConnectionStatus(prev => ({ ...prev, isConnected: true, lastSync: "Just now (URL Ingested)" }));
            setIsProcessing(false);
            alert("Metadata successfully ingested and validated by AI parser.");
        }, 2500);
    }, []);

    const handleFileUpload = useCallback((file: File) => {
        console.log(`Attempting file upload: ${file.name}`);
        setIsProcessing(true);
        setTimeout(() => {
            // Simulate successful parsing and update
            setConnectionStatus(prev => ({ ...prev, isConnected: true, lastSync: "Just now (File Uploaded)" }));
            setIsProcessing(false);
            alert(`File ${file.name} processed. Configuration updated.`);
        }, 3500);
    }, []);

    // Memoized complex configuration block display
    const ConfigurationBlock = useMemo(() => (
        <IdPDetailsDisplay
            acsUrl={acsUrl}
            entityId={entityId}
        />
    ), [acsUrl, entityId]);

    return (
        <div className="p-6 md:p-10 lg:p-16 min-h-screen bg-gray-950 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header Section - Enhanced */}
                <header className="text-center pb-4 border-b border-gray-800">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 tracking-tighter shadow-text-lg">
                        Quantum Identity Fabric: SSO Configuration Nexus
                    </h1>
                    <p className="mt-2 text-xl text-gray-400 max-w-3xl mx-auto">
                        Centralized management for secure, federated access control across all Quantum Ledger System microservices.
                    </p>
                </header>

                {/* Status and AI Assistant Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ConnectionStatusDashboard
                            isConnected={connectionStatus.isConnected}
                            providerName={connectionStatus.providerName}
                            lastSync={connectionStatus.lastSync}
                            adminEmail={connectionStatus.adminEmail}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <AIConfigurationAssistant />
                    </div>
                </div>

                {/* Core Configuration Modules */}
                <div className="space-y-8">
                    {ConfigurationBlock}
                    
                    <MetadataUploader
                        onUrlSubmit={handleUrlIngestion}
                        onFileUpload={handleFileUpload}
                        isProcessing={isProcessing}
                    />
                </div>

                {/* Architect's Manifesto - Replaced with Professional Vision Statement */}
                <Card title="System Philosophy & Governance Mandate">
                    <div className="space-y-5 text-gray-300 p-6 bg-gray-900 rounded-xl border border-gray-700/50">
                        <h3 className="text-2xl font-bold text-white tracking-wide border-b border-gray-700 pb-2">
                            The Imperative of Decentralized Trust: A Vision for Perpetual Security
                        </h3>
                        <p>
                            The architecture underpinning the Quantum Ledger System mandates absolute trust minimization through verifiable, cryptographically secured identity assertions. Single Sign-On is not merely an convenience feature; it is the primary perimeter defense layer. Our goal is to achieve zero-trust networking principles enforced at the identity layer, ensuring that every access request is authenticated, authorized, and audited against immutable standards.
                        </p>
                        <p>
                            The integration of AI into this process—specifically in metadata validation, certificate lifecycle management, and attribute mapping inference—is designed to eliminate human error vectors inherent in complex protocol configurations like SAML 2.0 and OIDC. This proactive stance ensures compliance with future regulatory frameworks before they are even ratified.
                        </p>
                        <div className="pt-4 border-t border-gray-700">
                            <p className="italic text-cyan-400 font-medium flex items-center">
                                <Zap className="w-4 h-4 mr-2" /> Operational Directive: Maintain 100% IdP connectivity uptime. Any degradation in SSO performance triggers an immediate Level 3 security incident response protocol.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SSOView;