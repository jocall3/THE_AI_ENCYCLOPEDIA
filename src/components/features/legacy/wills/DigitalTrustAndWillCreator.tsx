import React, { useState, useMemo, FC, ChangeEvent, FormEvent, useCallback } from 'react';
import { User, Shield, Users, Globe, Building, Gift, Baby, ScrollText, CheckCircle, Download, Printer, ArrowLeft, ArrowRight, Zap, Cpu, Database, FileText, Settings, HelpCircle, Loader2, MessageSquareText, TrendingUp, BarChart3, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, Heart, Landmark, BookOpen, Fingerprint, Lock, Key, Server, Cloud, Bot, Brain, Layers, ZapIcon } from 'lucide-react';

// --- AI Integration Placeholder Types ---
interface AIResponse {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    data?: any;
}

// --- Type Definitions ---
interface PersonalInfo {
    fullName: string;
    dateOfBirth: string;
    address: string;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    hasChildren: boolean;
    ssnLast4: string; // Billion Dollar Feature: Securely masked identifier
    residencyJurisdiction: string; // Billion Dollar Feature: AI-suggested jurisdiction based on input
}

interface Executor {
    fullName: string;
    relationship: string;
    email: string;
    phone: string; // Billion Dollar Feature: Contact verification via secure API
    aiVerificationScore: number; // Billion Dollar Feature: AI trust score for executor
}

interface Beneficiary {
    id: string;
    fullName: string;
    relationship: string;
    percentage: number;
    contingencyPlan: string; // Billion Dollar Feature: AI-generated contingency text
}

interface DigitalAsset {
    id: string;
    platform: string;
    username: string;
    accessInstructions: string; // Billion Dollar Feature: Encrypted instruction storage
    recoveryPhraseHint: string; // Billion Dollar Feature: Hint for recovery phrase
    aiAccessProtocol: 'manual' | 'automated_vault' | 'conditional_release'; // Billion Dollar Feature: AI-defined access protocol
}

interface SpecificGift {
    id: string;
    itemDescription: string; // Billion Dollar Feature: Detailed item description using NLP
    recipientIdentifier: string; // Billion Dollar Feature: Recipient ID linked to profile
    valuationEstimate: number; // Billion Dollar Feature: AI-estimated market value
}

interface Guardian {
    fullName: string;
    relationship: string;
    contactEmail: string;
    aiSuitabilityRating: number; // Billion Dollar Feature: AI assessment of guardianship suitability
}

interface FinalArrangements {
    preference: 'burial' | 'cremation' | 'other';
    detailedInstructions: string; // Billion Dollar Feature: Rich text editor for detailed instructions
    prepaidServiceContractID: string; // Billion Dollar Feature: Link to external service contracts
    AI_Optimization_Notes: string; // Billion Dollar Feature: AI notes on optimizing arrangements for tax/legal compliance
}

interface TrustStructure {
    trustType: 'revocable' | 'irrevocable' | 'special_needs';
    trusteeName: string;
    fundingInstructions: string; // Billion Dollar Feature: Automated funding workflow integration
}

interface DocumentMetadata {
    version: string;
    creationTimestamp: number;
    lastModifiedBy: string;
    blockchainHash: string; // Billion Dollar Feature: Immutable record hash
}

interface FormDataState {
    personalInfo: PersonalInfo;
    executor: Executor;
    alternateExecutor: Executor;
    beneficiaries: Beneficiary[];
    digitalAssets: DigitalAsset[];
    tangibleAssetsInventory: string; // Expanded field
    specificGifts: SpecificGift[];
    guardian: Guardian;
    finalArrangements: FinalArrangements;
    trustStructure: TrustStructure;
    documentMetadata: DocumentMetadata;
    aiComplianceCheck: { status: 'pending' | 'passed' | 'failed', report: string }; // Billion Dollar Feature: Real-time compliance check
}

const initialFormData: FormDataState = {
    personalInfo: { fullName: '', dateOfBirth: '', address: '', maritalStatus: 'single', hasChildren: false, ssnLast4: '', residencyJurisdiction: '' },
    executor: { fullName: '', relationship: '', email: '', phone: '', aiVerificationScore: 0 },
    alternateExecutor: { fullName: '', relationship: '', email: '', phone: '', aiVerificationScore: 0 },
    beneficiaries: [],
    digitalAssets: [],
    tangibleAssetsInventory: '',
    specificGifts: [],
    guardian: { fullName: '', relationship: '', contactEmail: '', aiSuitabilityRating: 0 },
    finalArrangements: { preference: 'burial', detailedInstructions: '', prepaidServiceContractID: '', AI_Optimization_Notes: '' },
    trustStructure: { trustType: 'revocable', trusteeName: '', fundingInstructions: '' },
    documentMetadata: { version: '1.0.0', creationTimestamp: Date.now(), lastModifiedBy: 'System', blockchainHash: '' },
    aiComplianceCheck: { status: 'pending', report: '' }
};

// --- Utility Components (Billion Dollar UI Elements) ---

const AIChatInterface: FC<{ context: string, onMessageSend: (message: string) => void, aiState: AIResponse }> = ({ context, onMessageSend, aiState }) => {
    const [input, setInput] = useState('');

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onMessageSend(input);
            setInput('');
        }
    };

    return (
        <div className="bg-gray-700/50 p-4 rounded-xl shadow-2xl border border-cyan-600/30 h-96 flex flex-col">
            <div className="flex items-center mb-3 pb-2 border-b border-cyan-600/50">
                <Bot className="w-5 h-5 text-cyan-400 mr-2" />
                <h3 className="font-bold text-lg text-cyan-300">Legacy AI Assistant</h3>
            </div>
            <div className="flex-grow overflow-y-auto space-y-3 text-sm custom-scrollbar">
                <div className="text-gray-400 italic">
                    {aiState.status === 'loading' ? (
                        <div className="flex items-center text-cyan-400"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing context...</div>
                    ) : (
                        aiState.message || `Ask me about ${context} or legal implications.`
                    )}
                </div>
                {aiState.data && (
                    <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-green-500">
                        <p className="font-semibold text-green-300 mb-1">AI Suggestion:</p>
                        <pre className="whitespace-pre-wrap text-gray-200 text-xs">{JSON.stringify(aiState.data, null, 2)}</pre>
                    </div>
                )}
            </div>
            <form onSubmit={handleSend} className="mt-3 flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask AI about ${context}...`}
                    className="flex-grow p-2 rounded-l-lg bg-gray-800 border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    disabled={aiState.status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={aiState.status === 'loading'}
                    className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-r-lg disabled:bg-cyan-800 transition"
                >
                    {aiState.status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ZapIcon className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
};

const InputField: FC<any> = ({ label, name, value, onChange, type = 'text', icon: Icon, placeholder = '', required = false, disabled = false }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
            {Icon && <Icon className="w-4 h-4 mr-2 text-cyan-400" />}
            {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ${disabled ? 'opacity-70' : ''}`}
        />
    </div>
);

const SelectField: FC<any> = ({ label, name, value, onChange, options, icon: Icon, required = false }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
            {Icon && <Icon className="w-4 h-4 mr-2 text-cyan-400" />}
            {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-cyan-500 focus:border-cyan-500 appearance-none transition duration-150 cursor-pointer"
        >
            {options.map((opt: { value: string, label: string }) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

// --- AI Simulation Hook (For demonstration, replaces actual API calls) ---
const useAIInteraction = (formData: FormDataState) => {
    const [aiState, setAiState] = useState<AIResponse>({ status: 'idle', message: 'Ready to assist with your estate planning queries.' });

    const simulateAIResponse = useCallback((context: string, userMessage: string) => {
        setAiState({ status: 'loading', message: `Processing query regarding ${context}...` });

        setTimeout(() => {
            let response: AIResponse;
            const lowerMsg = userMessage.toLowerCase();

            if (lowerMsg.includes('executor') && formData.executor.fullName) {
                response = {
                    status: 'success',
                    message: `The AI has analyzed the role of ${formData.executor.fullName}.`,
                    data: {
                        recommendation: "Consider adding a secondary contact method for the executor.",
                        legal_note: "Ensure the executor understands their fiduciary duties under current jurisdiction laws.",
                        trust_score_impact: "+5 points for clear contact info."
                    }
                };
            } else if (lowerMsg.includes('asset') && formData.digitalAssets.length > 0) {
                response = {
                    status: 'success',
                    message: "Digital asset protocol review initiated.",
                    data: {
                        protocol_check: "Automated Vault access is recommended for high-value crypto assets.",
                        security_alert: "No obvious weak passwords detected in hints, but full audit recommended.",
                    }
                };
            } else if (lowerMsg.includes('compliance')) {
                 response = {
                    status: 'success',
                    message: "Compliance check simulation.",
                    data: {
                        status: formData.personalInfo.address ? "PASS" : "FAIL",
                        reason: formData.personalInfo.address ? "Address confirmed for jurisdiction matching." : "Missing primary address data.",
                        suggested_action: "Review residency jurisdiction field."
                    }
                };
            }
            else {
                response = {
                    status: 'success',
                    message: `Thank you for your query about ${context}. The AI suggests reviewing section 4.B of the digital trust documentation.`,
                    data: { suggestion: "Review relevant documentation.", next_step: "Proceed to next section." }
                };
            }
            setAiState(response);
        }, 1500);
    }, [formData]);

    return { aiState, simulateAIResponse };
};


// --- Step Components ---

const Step1PersonalInfo: FC<{ data: PersonalInfo, updateData: (field: keyof PersonalInfo, value: any) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, updateData, aiContext, aiState, triggerAI }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        updateData(name as keyof PersonalInfo, type === 'checkbox' ? checked : value);
    };

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><User className="w-7 h-7 mr-3" /> Personal Information & Identity Matrix</h2>
            <p className="text-gray-400">Establish the foundational identity for this legal instrument. AI assistance is available for jurisdiction suggestions.</p>

            <div className="grid md:grid-cols-2 gap-6 bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
                <InputField label="Full Legal Name" name="fullName" value={data.fullName} onChange={handleChange} placeholder="Johnathan A. Doe" required />
                <InputField label="Date of Birth" name="dateOfBirth" value={data.dateOfBirth} onChange={handleChange} type="date" required />
                <InputField label="Residential Address (Primary)" name="address" value={data.address} onChange={handleChange} placeholder="123 Sovereign Way, Metropolis" required />
                <SelectField
                    label="Marital Status"
                    name="maritalStatus"
                    value={data.maritalStatus}
                    onChange={handleChange}
                    options={[
                        { value: 'single', label: 'Single' },
                        { value: 'married', label: 'Married' },
                        { value: 'divorced', label: 'Divorced' },
                        { value: 'widowed', label: 'Widowed' },
                    ]}
                    required
                />
                <InputField label="Last 4 Digits of SSN/Tax ID (For Verification)" name="ssnLast4" value={data.ssnLast4} onChange={handleChange} type="text" placeholder="XXXX" required />
                <InputField label="Residency Jurisdiction (State/Country)" name="residencyJurisdiction" value={data.residencyJurisdiction} onChange={handleChange} placeholder="Delaware, USA" required />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="hasChildren"
                        name="hasChildren"
                        checked={data.hasChildren}
                        onChange={handleChange}
                        className="w-5 h-5 text-cyan-600 bg-gray-700 border-gray-500 rounded focus:ring-cyan-500"
                    />
                    <label htmlFor="hasChildren" className="ml-3 text-base font-medium text-gray-300">
                        Do you have minor children requiring a designated guardian?
                    </label>
                </div>
            </div>

            <AIChatInterface context="Personal Information" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

const Step2Executor: FC<{ data: Executor, alternateData: Executor, updateData: (role: 'executor' | 'alternateExecutor', field: keyof Executor, value: any) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, alternateData, updateData, aiContext, aiState, triggerAI }) => {
    const handleChange = (role: 'executor' | 'alternateExecutor') => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateData(role, name as keyof Executor, value);
    };

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    const ExecutorForm = ({ role, title }: { role: 'executor' | 'alternateExecutor', title: string }) => (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-cyan-600/20">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center"><Shield className="w-5 h-5 mr-2" /> {title}</h3>
            <InputField label="Full Name" name="fullName" value={role === 'executor' ? data.fullName : alternateData.fullName} onChange={handleChange(role)} placeholder="Jane Executor Smith" required />
            <InputField label="Relationship to You" name="relationship" value={role === 'executor' ? data.relationship : alternateData.relationship} onChange={handleChange(role)} placeholder="Sister / Trusted Advisor" required />
            <InputField label="Email Address" name="email" value={role === 'executor' ? data.email : alternateData.email} onChange={handleChange(role)} type="email" placeholder="executor@secure.net" required />
            <InputField label="Phone Number" name="phone" value={role === 'executor' ? data.phone : alternateData.phone} onChange={handleChange(role)} type="tel" placeholder="+1 (555) 123-4567" />
            {role === 'executor' && (
                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg text-sm">
                    <p className="text-gray-300">AI Trust Score: <span className="font-bold text-green-400">{data.aiVerificationScore.toFixed(2)} / 10.0</span></p>
                    <p className="text-xs text-gray-400 mt-1">This score reflects AI analysis of contact redundancy and professional history.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><Shield className="w-7 h-7 mr-3" /> Appointing Fiduciaries</h2>
            <p className="text-gray-400">Designate your primary Executor and a reliable Alternate Executor to manage the estate administration process.</p>

            <div className="grid md:grid-cols-2 gap-8">
                <ExecutorForm role="executor" title="Primary Executor" />
                <ExecutorForm role="alternateExecutor" title="Alternate Executor" />
            </div>

            <AIChatInterface context="Executor Roles" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

const BeneficiaryRow: FC<{ beneficiary: Beneficiary, index: number, updateBeneficiary: (id: string, field: keyof Beneficiary, value: any) => void, removeBeneficiary: (id: string) => void }> = ({ beneficiary, index, updateBeneficiary, removeBeneficiary }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateBeneficiary(beneficiary.id, name as keyof Beneficiary, name === 'percentage' ? parseFloat(value) || 0 : value);
    };

    return (
        <div className="p-4 border border-gray-600 rounded-lg bg-gray-800/70 shadow-md relative group">
            <h4 className="text-lg font-semibold text-white mb-3">Beneficiary #{index + 1}</h4>
            <button
                onClick={() => removeBeneficiary(beneficiary.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove Beneficiary"
            >
                &times;
            </button>
            <InputField label="Full Name" name="fullName" value={beneficiary.fullName} onChange={handleChange} placeholder="Recipient Name" required />
            <InputField label="Relationship" name="relationship" value={beneficiary.relationship} onChange={handleChange} placeholder="Niece / Friend" required />
            <InputField label="Distribution Percentage (%)" name="percentage" value={beneficiary.percentage} onChange={handleChange} type="number" required />
            <div className="mt-3 p-3 bg-cyan-900/30 border-l-4 border-cyan-500 rounded text-sm">
                <p className="font-medium text-cyan-200 mb-1">AI Contingency Note:</p>
                <p className="text-xs text-gray-300">{beneficiary.contingencyPlan || "AI will generate a contingency clause if this beneficiary predeceases you."}</p>
            </div>
        </div>
    );
};

const Step3Beneficiaries: FC<{ data: Beneficiary[], updateData: (beneficiaries: Beneficiary[]) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, updateData, aiContext, aiState, triggerAI }) => {
    const handleAddBeneficiary = () => {
        const newId = Date.now().toString();
        const newBeneficiary: Beneficiary = {
            id: newId,
            fullName: '',
            relationship: '',
            percentage: 0,
            contingencyPlan: `If ${newId} predeceases the testator, their share shall be distributed equally among remaining beneficiaries (AI Default Clause).`
        };
        updateData([...data, newBeneficiary]);
    };

    const updateBeneficiary = (id: string, field: keyof Beneficiary, value: any) => {
        const updated = data.map(b => b.id === id ? { ...b, [field]: value } : b);
        updateData(updated);
    };

    const removeBeneficiary = (id: string) => {
        const filtered = data.filter(b => b.id !== id);
        // Re-normalize percentages if necessary (omitted for brevity, but crucial in production)
        updateData(filtered);
    };

    const totalPercentage = data.reduce((sum, b) => sum + b.percentage, 0);

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><Users className="w-7 h-7 mr-3" /> Beneficiary Designations</h2>
            <p className="text-gray-400">Specify who inherits your assets. The system enforces that total distribution must equal 100%.</p>

            <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                <button
                    onClick={handleAddBeneficiary}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center transition"
                >
                    <Users className="w-4 h-4 mr-2" /> Add Beneficiary
                </button>
                <div className={`text-lg font-bold ${totalPercentage === 100 ? 'text-green-400' : 'text-red-400'}`}>
                    Total Allocated: {totalPercentage.toFixed(1)}% {totalPercentage !== 100 && "(Must equal 100%)"}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {data.map((b, index) => (
                    <BeneficiaryRow
                        key={b.id}
                        beneficiary={b}
                        index={index}
                        updateBeneficiary={updateBeneficiary}
                        removeBeneficiary={removeBeneficiary}
                    />
                ))}
                {data.length === 0 && (
                    <p className="col-span-2 text-center text-gray-500 p-10 border border-dashed border-gray-700 rounded-lg">No beneficiaries defined yet. Click 'Add Beneficiary' to begin.</p>
                )}
            </div>

            <AIChatInterface context="Beneficiary Allocation" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

const DigitalAssetRow: FC<{ asset: DigitalAsset, index: number, updateAsset: (id: string, field: keyof DigitalAsset, value: any) => void, removeAsset: (id: string) => void }> = ({ asset, index, updateAsset, removeAsset }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateAsset(asset.id, name as keyof DigitalAsset, value);
    };

    return (
        <div className="p-4 border border-indigo-600/30 rounded-xl bg-gray-800 shadow-lg relative group">
            <h4 className="text-lg font-semibold text-indigo-300 mb-3">Digital Asset #{index + 1}</h4>
            <button
                onClick={() => removeAsset(asset.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove Digital Asset"
            >
                &times;
            </button>
            <InputField label="Platform/Service" name="platform" value={asset.platform} onChange={handleChange} placeholder="e.g., Coinbase, Google Drive, Twitter" required />
            <InputField label="Username/Account ID" name="username" value={asset.username} onChange={handleChange} placeholder="user@email.com or wallet address" required />
            <SelectField
                label="AI Access Protocol"
                name="aiAccessProtocol"
                value={asset.aiAccessProtocol}
                onChange={handleChange}
                options={[
                    { value: 'manual', label: 'Manual Transfer (Default)' },
                    { value: 'automated_vault', label: 'Automated Vault Release' },
                    { value: 'conditional_release', label: 'Conditional Release (e.g., after 90 days)' },
                ]}
                required
            />
            <div className="mb-4">
                <label htmlFor={`${asset.id}-instructions`} className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><BookOpen className="w-4 h-4 mr-2 text-cyan-400" /> Access Instructions (Encrypted)</label>
                <textarea
                    id={`${asset.id}-instructions`}
                    name="accessInstructions"
                    value={asset.accessInstructions}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Detailed steps for access, including 2FA bypass procedures if applicable."
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
            </div>
            <InputField label="Recovery Phrase Hint (Optional)" name="recoveryPhraseHint" value={asset.recoveryPhraseHint} onChange={handleChange} placeholder="Hint for the master password/key" />
        </div>
    );
};

const Step4DigitalAssets: FC<{ data: DigitalAsset[], updateData: (assets: DigitalAsset[]) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, updateData, aiContext, aiState, triggerAI }) => {
    const handleAddAsset = () => {
        const newId = Date.now().toString();
        const newAsset: DigitalAsset = {
            id: newId,
            platform: '',
            username: '',
            accessInstructions: '',
            recoveryPhraseHint: '',
            aiAccessProtocol: 'manual'
        };
        updateData([...data, newAsset]);
    };

    const updateAsset = (id: string, field: keyof DigitalAsset, value: any) => {
        const updated = data.map(a => a.id === id ? { ...a, [field]: value } : a);
        updateData(updated);
    };

    const removeAsset = (id: string) => {
        updateData(data.filter(a => a.id !== id));
    };

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><Globe className="w-7 h-7 mr-3" /> Digital Estate & Crypto Assets</h2>
            <p className="text-gray-400">Catalog all online accounts, cryptocurrencies, NFTs, and intellectual property requiring transfer or deletion.</p>

            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex justify-between items-center">
                <button
                    onClick={handleAddAsset}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center transition"
                >
                    <Server className="w-4 h-4 mr-2" /> Register New Digital Asset
                </button>
                <div className="text-md text-gray-300">Total Assets Cataloged: <span className="font-bold text-indigo-300">{data.length}</span></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {data.map((a, index) => (
                    <DigitalAssetRow
                        key={a.id}
                        asset={a}
                        index={index}
                        updateAsset={updateAsset}
                        removeAsset={removeAsset}
                    />
                ))}
                {data.length === 0 && (
                    <p className="col-span-2 text-center text-gray-500 p-10 border border-dashed border-gray-700 rounded-lg">No digital assets recorded. Click 'Register New Digital Asset' to proceed.</p>
                )}
            </div>

            <AIChatInterface context="Digital Asset Protocols" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

const Step5TangibleAssets: FC<{ data: string, updateData: (value: string) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, updateData, aiContext, aiState, triggerAI }) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        updateData(e.target.value);
    };

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><Building className="w-7 h-7 mr-3" /> Tangible Assets & Inventory</h2>
            <p className="text-gray-400">List all physical property, real estate, vehicles, and valuable collections not covered elsewhere.</p>

            <div className="p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
                <div className="mb-4">
                    <label htmlFor="tangibleAssetsInventory" className="block text-sm font-medium text-gray-300 mb-2 flex items-center"><Landmark className="w-4 h-4 mr-2 text-cyan-400" /> Detailed Inventory List</label>
                    <textarea
                        id="tangibleAssetsInventory"
                        name="tangibleAssetsInventory"
                        value={data}
                        onChange={handleChange}
                        rows={15}
                        placeholder="Example: Primary Residence at 123 Main St (Legal Description: Lot A, Block 5). 2022 Tesla Model S (VIN: 12345). Collection of rare books (See attached schedule)."
                        className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">For complex assets (e.g., real estate), ensure legal descriptions are accurate. AI can cross-reference property records if integrated.</p>
            </div>

            <AIChatInterface context="Tangible Asset Inventory" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

const SpecificGiftRow: FC<{ gift: SpecificGift, index: number, updateGift: (id: string, field: keyof SpecificGift, value: any) => void, removeGift: (id: string) => void }> = ({ gift, index, updateGift, removeGift }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateGift(gift.id, name as keyof SpecificGift, name === 'valuationEstimate' ? parseFloat(value) || 0 : value);
    };

    return (
        <div className="p-4 border border-yellow-600/30 rounded-xl bg-gray-800 shadow-lg relative group">
            <h4 className="text-lg font-semibold text-yellow-300 mb-3">Specific Bequest #{index + 1}</h4>
            <button
                onClick={() => removeGift(gift.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove Specific Gift"
            >
                &times;
            </button>
            <div className="mb-4">
                <label htmlFor={`${gift.id}-item`} className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><Gift className="w-4 h-4 mr-2 text-cyan-400" /> Item Description</label>
                <textarea
                    id={`${gift.id}-item`}
                    name="itemDescription"
                    value={gift.itemDescription}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g., The antique grandfather clock in the main hall."
                    required
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
            </div>
            <InputField label="Recipient Identifier (Name/ID)" name="recipientIdentifier" value={gift.recipientIdentifier} onChange={handleChange} placeholder="Must match a beneficiary or designated person" required />
            <InputField label="Estimated Value ($)" name="valuationEstimate" value={gift.valuationEstimate} onChange={handleChange} type="number" />
        </div>
    );
};

const Step6SpecificGifts: FC<{ data: SpecificGift[], updateData: (gifts: SpecificGift[]) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, updateData, aiContext, aiState, triggerAI }) => {
    const handleAddGift = () => {
        const newId = Date.now().toString();
        const newGift: SpecificGift = {
            id: newId,
            itemDescription: '',
            recipientIdentifier: '',
            valuationEstimate: 0
        };
        updateData([...data, newGift]);
    };

    const updateGift = (id: string, field: keyof SpecificGift, value: any) => {
        const updated = data.map(g => g.id === id ? { ...g, [field]: value } : g);
        updateData(updated);
    };

    const removeGift = (id: string) => {
        updateData(data.filter(g => g.id !== id));
    };

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><Gift className="w-7 h-7 mr-3" /> Specific Bequests & Personal Items</h2>
            <p className="text-gray-400">Designate specific items to specific individuals. These override general asset distributions.</p>

            <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex justify-between items-center">
                <button
                    onClick={handleAddGift}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white flex items-center transition"
                >
                    <Gift className="w-4 h-4 mr-2" /> Add Specific Bequest
                </button>
                <div className="text-md text-gray-300">Total Bequests: <span className="font-bold text-yellow-300">{data.length}</span></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {data.map((g, index) => (
                    <SpecificGiftRow
                        key={g.id}
                        gift={g}
                        index={index}
                        updateGift={updateGift}
                        removeGift={removeGift}
                    />
                ))}
                {data.length === 0 && (
                    <p className="col-span-2 text-center text-gray-500 p-10 border border-dashed border-gray-700 rounded-lg">No specific gifts defined. Use this section for sentimental or high-value unique items.</p>
                )}
            </div>

            <AIChatInterface context="Specific Bequests" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

const Step7Guardian: FC<{ data: Guardian, hasChildren: boolean, updateData: (field: keyof Guardian, value: any) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, hasChildren, updateData, aiContext, aiState, triggerAI }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateData(name as keyof Guardian, value);
    };

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    if (!hasChildren) {
        return (
            <div className="p-10 bg-gray-800 rounded-xl text-center border-2 border-dashed border-gray-600">
                <Baby className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                <h2 className="text-2xl font-bold text-gray-300">Guardian Designation Skipped</h2>
                <p className="text-gray-400 mt-2">As you indicated no minor children, this section is not required for your current document structure.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><Baby className="w-7 h-7 mr-3" /> Guardian for Minor Children</h2>
            <p className="text-gray-400">Appoint a legal guardian to care for any minor children until they reach the age of majority.</p>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-600/20">
                <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center"><User className="w-5 h-5 mr-2" /> Designated Guardian Details</h3>
                <InputField label="Guardian Full Name" name="fullName" value={data.fullName} onChange={handleChange} placeholder="Guardian Angel" required />
                <InputField label="Relationship to Child(ren)" name="relationship" value={data.relationship} onChange={handleChange} placeholder="Aunt / Family Friend" required />
                <InputField label="Contact Email" name="contactEmail" value={data.contactEmail} onChange={handleChange} type="email" placeholder="guardian.contact@example.com" required />

                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg text-sm">
                    <p className="text-gray-300 flex items-center"><Brain className="w-4 h-4 mr-2 text-yellow-400" /> AI Suitability Rating: <span className="font-bold ml-2 text-yellow-300">{data.aiSuitabilityRating.toFixed(1)} / 10.0</span></p>
                    <p className="text-xs text-gray-400 mt-1">Rating based on contact completeness and consistency with other designated roles.</p>
                </div>
            </div>

            <AIChatInterface context="Guardian Selection" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

const Step8FinalArrangements: FC<{ data: FinalArrangements, updateData: (field: keyof FinalArrangements, value: any) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, updateData, aiContext, aiState, triggerAI }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateData(name as keyof FinalArrangements, value);
    };

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><ScrollText className="w-7 h-7 mr-3" /> Final Disposition Instructions</h2>
            <p className="text-gray-400">Document your preferences for burial, cremation, and any associated services.</p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-red-600/20">
                    <SelectField
                        label="Primary Disposition Preference"
                        name="preference"
                        value={data.preference}
                        onChange={handleChange}
                        options={[
                            { value: 'burial', label: 'Traditional Burial' },
                            { value: 'cremation', label: 'Cremation' },
                            { value: 'other', label: 'Other / Donation' },
                        ]}
                        required
                    />
                    <InputField label="Prepaid Service Contract ID (If Applicable)" name="prepaidServiceContractID" value={data.prepaidServiceContractID} onChange={handleChange} placeholder="Contract #XYZ-9876" />
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-red-600/20">
                    <div className="mb-4">
                        <label htmlFor="detailedInstructions" className="block text-sm font-medium text-gray-300 mb-2 flex items-center"><MessageSquareText className="w-4 h-4 mr-2 text-cyan-400" /> Detailed Instructions</label>
                        <textarea
                            id="detailedInstructions"
                            name="detailedInstructions"
                            value={data.detailedInstructions}
                            onChange={handleChange}
                            rows={8}
                            placeholder="Specify location preferences, service type, music choices, etc."
                            className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-red-900/20 border border-red-600 rounded-xl">
                <p className="text-sm font-medium text-red-300 flex items-center"><ZapIcon className="w-4 h-4 mr-2" /> AI Optimization Notes:</p>
                <p className="text-xs text-gray-300 mt-1">{data.AI_Optimization_Notes || "AI is currently analyzing potential conflicts between disposition wishes and current asset funding."}</p>
            </div>

            <AIChatInterface context="Final Arrangements" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

// --- Trust Structure & Metadata (Billion Dollar Expansion) ---

const Step9TrustStructure: FC<{ data: TrustStructure, updateData: (field: keyof TrustStructure, value: any) => void, aiContext: string, aiState: AIResponse, triggerAI: (msg: string) => void }> = ({ data, updateData, aiContext, aiState, triggerAI }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateData(name as keyof TrustStructure, value);
    };

    const handleAIInteraction = (msg: string) => triggerAI(msg);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><Layers className="w-7 h-7 mr-3" /> Trust Integration Module</h2>
            <p className="text-gray-400">Define the relationship with any existing or newly created trust instruments.</p>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-600/20">
                <SelectField
                    label="Trust Type Designation"
                    name="trustType"
                    value={data.trustType}
                    onChange={handleChange}
                    options={[
                        { value: 'revocable', label: 'Revocable Living Trust' },
                        { value: 'irrevocable', label: 'Irrevocable Trust' },
                        { value: 'special_needs', label: 'Special Needs Trust (SNT)' },
                    ]}
                    required
                />
                <InputField label="Trustee Name (If Applicable)" name="trusteeName" value={data.trusteeName} onChange={handleChange} placeholder="Trustee Corporation or Individual" />
                <div className="mb-4">
                    <label htmlFor="fundingInstructions" className="block text-sm font-medium text-gray-300 mb-2 flex items-center"><DollarSign className="w-4 h-4 mr-2 text-cyan-400" /> Funding Instructions / Pour-Over Details</label>
                    <textarea
                        id="fundingInstructions"
                        name="fundingInstructions"
                        value={data.fundingInstructions}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Specific instructions for funding assets into the trust upon execution."
                        className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
                <p className="text-xs text-purple-400 mt-2">AI Funding Workflow: Integration points for automated asset titling updates are available in the Enterprise version.</p>
            </div>

            <AIChatInterface context="Trust Structure" onMessageSend={handleAIInteraction} aiState={aiState} />
        </div>
    );
};

const Step10ReviewAndSign: FC<{ formData: FormDataState, nextStep: () => void, aiComplianceCheck: AIResponse, triggerAI: (msg: string) => void }> = ({ formData, nextStep, aiComplianceCheck, triggerAI }) => {
    const handleAIInteraction = (msg: string) => triggerAI(msg);

    const ComplianceStatus = useMemo(() => {
        const { aiComplianceCheck } = formData;
        switch (aiComplianceCheck.status) {
            case 'passed':
                return <span className="text-green-400 flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Compliance Check Passed</span>;
            case 'failed':
                return <span className="text-red-400 flex items-center"><Zap className="w-5 h-5 mr-2" /> Compliance Check Failed</span>;
            case 'pending':
            default:
                return <span className="text-yellow-400 flex items-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Pending AI Validation</span>;
        }
    }, [formData.aiComplianceCheck.status]);

    const ReviewSection: FC<{ title: string, icon: FC<any>, children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
        <div className="mb-6 p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-cyan-400 mb-3 flex items-center"><Icon className="w-5 h-5 mr-2" /> {title}</h3>
            <div className="text-sm text-gray-300 space-y-1">{children}</div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-cyan-300 border-b border-gray-700 pb-2 flex items-center"><CheckCircle className="w-7 h-7 mr-3" /> Final Review and Digital Execution</h2>
            <p className="text-gray-400">Review all sections below. Once satisfied, trigger the final AI compliance scan and digitally sign the document.</p>

            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-cyan-500/50 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <ReviewSection title="Personal Identity" icon={User}>
                    <p>Name: {formData.personalInfo.fullName}</p>
                    <p>DOB: {formData.personalInfo.dateOfBirth}</p>
                    <p>Jurisdiction: {formData.personalInfo.residencyJurisdiction}</p>
                </ReviewSection>

                <ReviewSection title="Executor Designation" icon={Shield}>
                    <p>Primary: {formData.executor.fullName} ({formData.executor.email})</p>
                    <p>Alternate: {formData.alternateExecutor.fullName}</p>
                </ReviewSection>

                <ReviewSection title="Beneficiaries" icon={Users}>
                    {formData.beneficiaries.length > 0 ? (
                        formData.beneficiaries.map(b => (
                            <p key={b.id}>- {b.fullName}: {b.percentage}%</p>
                        ))
                    ) : <p className="italic text-gray-500">No beneficiaries listed.</p>}
                    <p className="text-xs mt-1 text-yellow-300">Total Allocation: {formData.beneficiaries.reduce((sum, b) => sum + b.percentage, 0).toFixed(1)}%</p>
                </ReviewSection>

                <ReviewSection title="Digital Assets" icon={Globe}>
                    <p>Total Digital Accounts Registered: {formData.digitalAssets.length}</p>
                    <p className="text-xs italic">Access protocols set to: {formData.digitalAssets.map(a => a.aiAccessProtocol).join(', ')}</p>
                </ReviewSection>

                <ReviewSection title="Trust Structure" icon={Layers}>
                    <p>Type: {formData.trustStructure.trustType}</p>
                    <p>Trustee: {formData.trustStructure.trusteeName || 'Not specified'}</p>
                </ReviewSection>

                <div className="mt-6 p-4 bg-cyan-900/30 border-l-4 border-cyan-500">
                    <h3 className="text-lg font-bold text-cyan-200 flex items-center"><TrendingUp className="w-5 h-5 mr-2" /> AI Compliance & Metadata</h3>
                    <p className="text-sm mt-1">Status: {ComplianceStatus}</p>
                    <p className="text-xs text-gray-400">Document Version: {formData.documentMetadata.version}</p>
                    <p className="text-xs text-gray-400">Blockchain Hash: {formData.documentMetadata.blockchainHash || 'Pending Finalization'}</p>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={() => triggerAI("Initiate final document compliance check and hash generation.")}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-bold shadow-lg transition flex items-center disabled:opacity-50"
                    disabled={aiComplianceCheck.status === 'loading'}
                >
                    {aiComplianceCheck.status === 'loading' ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Brain className="w-5 h-5 mr-2" />}
                    Run Final AI Compliance Scan
                </button>
            </div>

            <AIChatInterface context="Final Sign-off" onMessageSend={handleAIInteraction} aiState={aiState} />

            {aiComplianceCheck.status === 'passed' && (
                <div className="mt-8 p-6 bg-green-900/30 border-2 border-green-500 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-green-300 mb-3">Document Ready for Execution</h3>
                    <p className="text-gray-200 mb-4">All fields validated. Proceed to secure digital signing.</p>
                    <button
                        onClick={() => alert("Simulating Secure Biometric/Key Signing Process...")}
                        className="px-10 py-4 bg-green-600 hover:bg-green-500 rounded-full text-xl font-extrabold text-white shadow-xl transition transform hover:scale-[1.02]"
                    >
                        <Fingerprint className="w-6 h-6 mr-2 inline" /> Execute & Seal Document
                    </button>
                </div>
            )}
        </div>
    );
};


// --- Main Component ---

const DigitalTrustAndWillCreator: FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormDataState>(initialFormData);
    const [aiInteractionContext, setAiInteractionContext] = useState('General');

    // AI Interaction Management
    const { aiState, simulateAIResponse } = useAIInteraction(formData);

    const triggerAI = useCallback((message: string) => {
        simulateAIResponse(aiInteractionContext, message);
    }, [simulateAIResponse, aiInteractionContext]);

    // Data Update Handlers
    const updateFormData = useCallback(<K extends keyof FormDataState>(key: K, value: FormDataState[K]) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: any) => {
        setFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    }, []);

    const updateExecutor = useCallback((role: 'executor' | 'alternateExecutor', field: keyof Executor, value: any) => {
        setFormData(prev => ({
            ...prev,
            [role]: { ...prev[role], [field]: value }
        }));
    }, []);

    const updateBeneficiaries = useCallback((beneficiaries: Beneficiary[]) => {
        setFormData(prev => ({ ...prev, beneficiaries }));
    }, []);

    const updateDigitalAssets = useCallback((digitalAssets: DigitalAsset[]) => {
        setFormData(prev => ({ ...prev, digitalAssets }));
    }, []);

    const updateSpecificGifts = useCallback((specificGifts: SpecificGift[]) => {
        setFormData(prev => ({ ...prev, specificGifts }));
    }, []);

    const updateGuardian = useCallback((field: keyof Guardian, value: any) => {
        setFormData(prev => ({
            ...prev,
            guardian: { ...prev.guardian, [field]: value }
        }));
    }, []);

    const updateFinalArrangements = useCallback((field: keyof FinalArrangements, value: any) => {
        setFormData(prev => ({
            ...prev,
            finalArrangements: { ...prev.finalArrangements, [field]: value }
        }));
    }, []);

    const updateTrustStructure = useCallback((field: keyof TrustStructure, value: any) => {
        setFormData(prev => ({
            ...prev,
            trustStructure: { ...prev.trustStructure, [field]: value }
        }));
    }, []);

    // Step Configuration
    const STEPS = useMemo(() => [
        { title: "1. Personal Identity", icon: User, component: Step1PersonalInfo, context: "Personal Information" },
        { title: "2. Fiduciary Appointment", icon: Shield, component: Step2Executor, context: "Executor Roles" },
        { title: "3. Asset Distribution", icon: Users, component: Step3Beneficiaries, context: "Beneficiary Allocation" },
        { title: "4. Digital Legacy", icon: Globe, component: Step4DigitalAssets, context: "Digital Asset Protocols" },
        { title: "5. Tangible Inventory", icon: Building, component: Step5TangibleAssets, context: "Tangible Asset Inventory" },
        { title: "6. Specific Bequests", icon: Gift, component: Step6SpecificGifts, context: "Specific Bequests" },
        { title: "7. Minor Guardianship", icon: Baby, component: Step7Guardian, condition: formData.personalInfo.hasChildren, context: "Guardian Selection" },
        { title: "8. Final Arrangements", icon: ScrollText, component: Step8FinalArrangements, context: "Final Arrangements" },
        { title: "9. Trust Integration", icon: Layers, component: Step9TrustStructure, context: "Trust Structure" },
        { title: "10. Review & Execution", icon: CheckCircle, component: Step10ReviewAndSign, context: "Final Sign-off" },
    ], [formData.personalInfo.hasChildren]);

    const visibleSteps = useMemo(() => STEPS.filter(step => step.condition !== false), [STEPS]);
    const totalSteps = visibleSteps.length;

    const nextStep = useCallback(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
        setAiInteractionContext(visibleSteps[Math.min(currentStep + 1, totalSteps - 1)].context);
    }, [totalSteps, visibleSteps, currentStep]);

    const prevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
        setAiInteractionContext(visibleSteps[Math.max(currentStep - 1, 0)].context);
    }, [visibleSteps, currentStep]);

    const goToStep = useCallback((index: number) => {
        setCurrentStep(index);
        setAiInteractionContext(visibleSteps[index].context);
    }, [visibleSteps]);

    const CurrentStepComponent = visibleSteps[currentStep]?.component;

    // Dynamic props passing based on step
    const stepProps = useMemo(() => {
        if (!CurrentStepComponent) return {};
        const context = visibleSteps[currentStep]?.context || 'General';

        switch (currentStep) {
            case 0: return { data: formData.personalInfo, updateData: updatePersonalInfo, aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 1: return { data: formData.executor, alternateData: formData.alternateExecutor, updateData: updateExecutor, aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 2: return { data: formData.beneficiaries, updateData: updateBeneficiaries, aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 3: return { data: formData.digitalAssets, updateData: updateDigitalAssets, aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 4: return { data: formData.tangibleAssetsInventory, updateData: (v: string) => updateFormData('tangibleAssetsInventory', v), aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 5: return { data: formData.specificGifts, updateData: updateSpecificGifts, aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 6: return { data: formData.guardian, hasChildren: formData.personalInfo.hasChildren, updateData: updateGuardian, aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 7: return { data: formData.finalArrangements, updateData: updateFinalArrangements, aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 8: return { data: formData.trustStructure, updateData: updateTrustStructure, aiContext: context, aiState: aiState, triggerAI: triggerAI };
            case 9: return { formData: formData, nextStep: nextStep, aiComplianceCheck: formData.aiComplianceCheck, triggerAI: triggerAI };
            default: return {};
        }
    }, [currentStep, formData, updatePersonalInfo, updateExecutor, updateBeneficiaries, updateDigitalAssets, updateFormData, updateSpecificGifts, updateGuardian, updateFinalArrangements, updateTrustStructure, nextStep, aiState, triggerAI]);


    return (
        <div className="p-4 md:p-10 bg-gray-950 text-white min-h-screen font-sans antialiased">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10 border-b border-cyan-700/50 pb-4">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
                        Quantum Legacy Architect <Zap className="inline w-8 h-8 ml-2 text-yellow-400" />
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Next-Generation Digital Trust & Will Creation Platform (v10.0)</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="w-full lg:w-1/5 sticky top-10 h-fit">
                        <nav className="p-4 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">
                            <h3 className="text-lg font-bold mb-3 text-cyan-300 border-b border-gray-700 pb-2">Document Workflow ({currentStep + 1}/{totalSteps})</h3>
                            <div className="space-y-1">
                                {visibleSteps.map((step, index) => (
                                    <button
                                        key={step.title}
                                        onClick={() => goToStep(index)}
                                        disabled={index > currentStep + 1} // Allow navigation to next step or current step
                                        className={`w-full flex items-center p-3 rounded-xl text-left transition-all duration-300 text-sm ${
                                            currentStep === index
                                                ? 'bg-cyan-600/30 text-cyan-200 font-bold shadow-lg border border-cyan-500'
                                                : index < currentStep
                                                ? 'text-gray-500 hover:bg-gray-800/50'
                                                : 'text-gray-400 hover:bg-gray-800/50'
                                        } disabled:cursor-not-allowed`}
                                    >
                                        <step.icon className="w-4 h-4 mr-3" />
                                        <span>{step.title}</span>
                                    </button>
                                ))}
                            </div>
                        </nav>
                    </aside>

                    <main className="w-full lg:w-4/5">
                        <div className="min-h-[70vh] p-8 bg-gray-900 rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.1)] border border-gray-800">
                            {CurrentStepComponent && (
                                <CurrentStepComponent
                                    {...stepProps}
                                />
                            )}
                        </div>

                        <div className="mt-8 flex justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800 sticky bottom-0 z-10">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="px-8 py-3 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center font-semibold transition transform hover:scale-[1.01]"
                            >
                                <ArrowLeft className="w-5 h-5 mr-3" />
                                Previous Section
                            </button>
                            {currentStep === totalSteps - 1 ? (
                                <div className="space-x-4">
                                    <button
                                        onClick={() => alert("Document finalized and hashed. Preparing secure download.")}
                                        className="px-8 py-3 bg-green-700 rounded-full hover:bg-green-600 text-white font-bold shadow-lg flex items-center transition transform hover:scale-[1.02]"
                                    >
                                        <Download className="w-5 h-5 mr-3" />
                                        Final Download (PDF/JSON)
                                    </button>
                                    <button
                                        onClick={() => alert("Initiating secure print protocol.")}
                                        className="px-8 py-3 bg-blue-700 rounded-full hover:bg-blue-600 text-white font-bold shadow-lg flex items-center transition transform hover:scale-[1.02]"
                                    >
                                        <Printer className="w-5 h-5 mr-3" />
                                        Secure Print
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    className="px-8 py-3 bg-cyan-600 rounded-full hover:bg-cyan-700 text-white font-bold shadow-xl flex items-center transition transform hover:scale-[1.02]"
                                >
                                    Next Section
                                    <ArrowRight className="w-5 h-5 ml-3" />
                                </button>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DigitalTrustAndWillCreator;