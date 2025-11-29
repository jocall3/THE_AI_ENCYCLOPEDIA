import React, { useState, useEffect, useReducer, useCallback, useMemo, FC, ChangeEvent, FormEvent, ReactNode } from 'react';
import Card from './Card';

//================================================================================================
// CORE SYSTEM ARCHITECTURE DEFINITIONS: QUANTUM LEAP AI MARKETPLACE V1000.0
// This section defines the foundational data structures for the next millennium of decentralized AI asset management.
//================================================================================================

/**
 * Represents the author of an AI agent, now integrated with decentralized identity verification (DID).
 */
export interface AgentAuthor {
    id: string; // Unique Decentralized Identifier (DID)
    name: string; // Corporate or Sovereign Entity Name
    avatarUrl: string; // Secure Content Delivery Network (CDN) link for profile image
    profileUrl: string; // Link to the author's verified governance portal
    verified: boolean; // Status verified by the Global AI Trust Consortium (GATC)
    bio: string; // A comprehensive mission statement and technological philosophy
    agentsPublished: number; // Total volume of deployed, audited agents
    governanceScore: number; // A metric reflecting community trust and compliance (0-100)
}

/**
 * Represents a user review for an AI agent, now incorporating sentiment analysis scores.
 */
export interface AgentReview {
    id: string;
    author: {
        name: string;
        avatarUrl: string;
        did: string;
    };
    rating: number; // 1-5 stars
    comment: string;
    createdAt: Date;
    helpfulVotes: number;
    sentimentScore: number; // AI-derived sentiment analysis (-1.0 to 1.0)
}

/**
 * Represents the pricing model for an AI agent, now supporting dynamic resource allocation contracts.
 */
export interface AgentPricing {
    type: 'one-time' | 'subscription' | 'free' | 'utility-based';
    amount: number; // Base cost in Universal Credit Units (UCU)
    subscriptionInterval?: 'monthly' | 'yearly' | 'quarterly';
    resourceAllocationModel?: {
        computeUnitsPerTx: number;
        storageCommitmentGB: number;
        slaTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    };
}

/**
 * Technical specifications for the agent, now including quantum resistance and model lineage.
 */
export interface AgentSpecs {
    version: string;
    releaseDate: Date;
    requiredApiVersion: string;
    dependencies: string[];
    supportedLanguages: string[];
    computeRequirements: {
        cpu: string; // Virtual CPU cores required
        ram: string; // Memory allocation in GB
        gpu?: string; // Specific accelerator requirement (e.g., TensorCore Cluster ID)
        quantumResistanceLevel: 'Low' | 'Medium' | 'High' | 'Post-Quantum';
    };
    modelArchitecture: string; // e.g., Transformer-X, Diffusion-V3, Custom-NN
    trainingDataProvenance: string; // Link to the audited data manifest
}

/**
 * Represents a single version in the agent's immutable changelog ledger.
 */
export interface AgentChangelogEntry {
    version: string;
    releaseDate: Date;
    changes: string[];
    securityPatchesApplied: number;
    performanceDeltaPercent: number;
}

/**
 * Core interface for an AI Agent in the marketplace, now a fully auditable Digital Asset.
 */
export interface Agent {
    id: string;
    name: string;
    author: AgentAuthor;
    category: string; // Primary domain classification
    tags: string[]; // Semantic indexing keywords
    shortDescription: string; // Concise value proposition (max 150 chars)
    longDescription: string; // Detailed technical and functional overview
    imageUrl: string; // High-resolution marketing asset link
    rating: number; // Weighted average rating (1-5)
    reviewCount: number;
    reviews: AgentReview[];
    pricing: AgentPricing;
    specs: AgentSpecs;
    changelog: AgentChangelogEntry[];
    downloads: number; // Total deployment instances
    createdAt: Date;
    updatedAt: Date;
    featured: boolean; // Curated by the GATC Oversight Committee
    documentationUrl: string;
    demoUrl?: string;
    aiCapabilitiesSummary: string; // AI-generated summary of core functions
}

//================================================================================================
// MOCK DATA GENERATION: SIMULATING THE GLOBAL AI REGISTRY (GAR)
// This section generates extensive, high-fidelity mock data to stress-test the platform architecture.
//================================================================================================

const MOCK_AUTHORS: AgentAuthor[] = [
    { id: 'did:btc:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', name: 'SynthCore Labs // Division Alpha', avatarUrl: 'https://i.pravatar.cc/40?u=synthcore', profileUrl: '#', verified: true, bio: 'Pioneering AI for predictive financial modeling and systemic risk mitigation. Our agents operate on proprietary, quantum-resistant algorithms ensuring data integrity across all temporal vectors.', agentsPublished: 5, governanceScore: 98.5 },
    { id: 'did:eth:0xDataWeaverInc', name: 'DataWeaver Inc. - Enterprise Solutions', avatarUrl: 'https://i.pravatar.cc/40?u=dataweaver', profileUrl: '#', verified: true, bio: 'Weaving intelligence from raw, unstructured data streams into actionable, high-frequency insights. Specializing in cross-domain correlation analysis.', agentsPublished: 8, governanceScore: 92.1 },
    { id: 'did:sol:LogicForgeAI', name: 'LogicForge AI - Automation Nexus', avatarUrl: 'https://i.pravatar.cc/40?u=logicforge', profileUrl: '#', verified: false, bio: 'Crafting bespoke, self-optimizing AI solutions for complex business process automation (BPA) and supply chain orchestration. Currently seeking Platinum SLA partners.', agentsPublished: 3, governanceScore: 78.9 },
    { id: 'did:web:QuantumLeapAI', name: 'QuantumLeap AI Dynamics', avatarUrl: 'https://i.pravatar.cc/40?u=quantumleap', profileUrl: '#', verified: true, bio: 'Next-generation AI for complex problem solving, leveraging neuromorphic computing principles. We build agents that learn faster than the environment changes.', agentsPublished: 12, governanceScore: 99.9 },
    { id: 'did:key:EvaNeuroResearch', name: 'Eva Neuro - Independent NLP Architect', avatarUrl: 'https://i.pravatar.cc/40?u=eva', profileUrl: '#', verified: false, bio: 'Independent researcher focusing on advanced Natural Language Processing (NLP) agents, specializing in semantic coherence and ethical bias mitigation in large language models.', agentsPublished: 2, governanceScore: 85.0 },
];

const MOCK_CATEGORIES = ['Financial Forecasting', 'Hyper-Automation', 'Regulatory Compliance', 'Customer Experience (CX)', 'Generative Content Synthesis', 'Code & Infrastructure Management', 'Personalized Intelligence'];

const MOCK_TAGS = ['forecasting', 'compliance', 'LLM', 'RPA', 'API-Gateway', 'real-time', 'risk-assessment', 'SEO-optimization', 'Python-Native', 'Kubernetes', 'summarization', 'predictive-maintenance', 'decentralized-ledger'];

const MOCK_COMMENTS = [
    "This agent has achieved a 40% reduction in false positive alerts across our Q3 compliance audits. A monumental achievement.",
    "The initial setup required deep integration knowledge, but the resulting throughput increase justifies the effort tenfold.",
    "Exceptional performance in high-volatility markets. The predictive accuracy exceeds our internal benchmarks by 12 basis points.",
    "Documentation is sparse, but the author provided direct access to a senior engineer for onboarding. Five stars for support.",
    "The utility-based pricing model is fair, though we are pushing the limits of the Bronze SLA tier.",
    "Reliability is absolute. Zero downtime reported over 90 operational cycles.",
    "We encountered a transient error during batch processing; the agent self-corrected within 300ms. Impressive resilience.",
    "The gold standard for automated financial reporting. Unquestionably worth the investment.",
    "Simple deployment via containerization. Immediate value extraction.",
    "The subscription cost is high, but the ROI calculation confirms profitability within the first fiscal quarter.",
];

/**
 * A utility function to generate a large set of mock agents with high complexity.
 * @param count The number of agents to generate.
 * @returns An array of mock `Agent` objects.
 */
export const generateMockAgents = (count: number): Agent[] => {
    const agents: Agent[] = [];
    for (let i = 1; i <= count; i++) {
        const author = MOCK_AUTHORS[i % MOCK_AUTHORS.length];
        const category = MOCK_CATEGORIES[i % MOCK_CATEGORIES.length];
        const createdAt = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000); // Up to 2 years old
        
        const pricingTypeIndex = i % 4;
        const pricingTypes: AgentPricing['type'][] = ['one-time', 'subscription', 'free', 'utility-based'];
        const pricingType = pricingTypes[pricingTypeIndex];
        
        const baseAmount = Math.floor(Math.random() * 900) + 100;
        const pricing: AgentPricing = {
            type: pricingType,
            amount: pricingType === 'free' ? 0 : (pricingType === 'utility-based' ? Math.floor(Math.random() * 50) + 1 : baseAmount),
            ...(pricingType === 'subscription' && { subscriptionInterval: ['monthly', 'yearly', 'quarterly'][i % 3] as 'monthly' | 'yearly' | 'quarterly' }),
            ...(pricingType !== 'free' && {
                resourceAllocationModel: {
                    computeUnitsPerTx: Math.pow(2, Math.floor(Math.random() * 4) + 1), // 2, 4, 8, 16 units
                    storageCommitmentGB: Math.pow(2, Math.floor(Math.random() * 3) + 1), // 2, 4, 8 GB
                    slaTier: ['Bronze', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)] as AgentPricing['resourceAllocationModel']['slaTier']
                }
            })
        };
        
        const reviews: AgentReview[] = Array.from({ length: Math.floor(Math.random() * 150) + 10 }, (_, k) => {
            const rating = Math.floor(Math.random() * 5) + 1;
            return {
                id: `review-${i}-${k}`,
                author: { name: `Citizen ${i * 100 + k}`, avatarUrl: `https://i.pravatar.cc/40?u=reviewuser${i}_${k}`, did: `did:user:${i}_${k}` },
                rating: rating,
                comment: MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)],
                createdAt: new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())),
                helpfulVotes: Math.floor(Math.random() * 500),
                sentimentScore: parseFloat(((rating - 3) * 0.3 + (Math.random() - 0.5) * 0.2).toFixed(2)) // Simple heuristic
            };
        });

        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        
        const changelog: AgentChangelogEntry[] = [
            { version: '2.0.1-Quantum', releaseDate: new Date(), changes: ['Implemented post-quantum cryptographic module.', 'Optimized inference pipeline for 30% latency reduction.'], securityPatchesApplied: 2, performanceDeltaPercent: -30 },
            { version: '1.9.0-Stability', releaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), changes: ['Major refactoring of data ingestion layer.', 'Enhanced error handling for network partitions.'], securityPatchesApplied: 1, performanceDeltaPercent: 15 },
            { version: '1.0.0-Initial', releaseDate: new Date(createdAt.getTime() + 1000), changes: ['Initial public release under GATC framework.'], securityPatchesApplied: 0, performanceDeltaPercent: 0 },
        ];
        
        const aiSummary = `This ${category} agent utilizes a ${pricing.resourceAllocationModel?.slaTier || 'Standard'} SLA tier to deliver ${Math.round(avgRating * 10)}/10 performance in ${agent.tags[0] || 'core tasks'}.`;

        agents.push({
            id: `agent-${i}-${Date.now()}`,
            name: `${category.split(' ')[0]} Sentinel ${i}`,
            author,
            category,
            tags: [...new Set(Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => MOCK_TAGS[Math.floor(Math.random() * MOCK_TAGS.length)]))],
            shortDescription: `Autonomous, high-throughput agent for mission-critical ${category.toLowerCase()} operations. Engineered for resilience and precision.`,
            longDescription: `This is the definitive deployment package for the ${category.toUpperCase()} Sentinel ${i}. It represents the culmination of ${author.name}'s research into self-governing computational entities. The agent employs a proprietary ${AgentSpecs.name} architecture, capable of processing ${pricing.resourceAllocationModel?.computeUnitsPerTx || 4} compute units per transaction cycle. It is designed to interface seamlessly with legacy systems via our universal adapter layer, while maintaining strict adherence to the latest GATC security protocols. Configuration involves defining operational parameters within the ${pricing.resourceAllocationModel?.slaTier} Service Level Agreement, ensuring predictable resource consumption and guaranteed uptime. This agent is not merely a tool; it is a dedicated, intelligent subsystem ready for immediate integration into your enterprise backbone.`,
            imageUrl: `https://picsum.photos/seed/A${i + 100}/600/400`,
            rating: parseFloat(avgRating.toFixed(2)),
            reviewCount: reviews.length,
            reviews,
            pricing,
            specs: {
                version: '2.0.1-Quantum',
                releaseDate: new Date(),
                requiredApiVersion: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
                dependencies: ['CoreOS v3.1+', 'Python 3.11+', 'ZeroMQ Library', 'GATC SDK v4.2'],
                supportedLanguages: ['English', 'Mandarin', 'German', 'Japanese'],
                computeRequirements: {
                    cpu: `${Math.floor(Math.random() * 8) + 4} vCPUs`,
                    ram: `${Math.floor(Math.random() * 16) + 16}GB`,
                    gpu: (i % 3 === 0) ? 'NVIDIA H100 Cluster Access' : undefined,
                },
                modelArchitecture: ['Transformer-X', 'Diffusion-V3', 'Custom-NN', 'Recurrent-State'][Math.floor(Math.random() * 4)],
                trainingDataProvenance: `ipfs://data-manifest-${i}-${Date.now()}`,
                quantumResistanceLevel: ['Low', 'Medium', 'High', 'Post-Quantum'][Math.floor(Math.random() * 4)] as AgentSpecs['quantumResistanceLevel'],
            },
            changelog,
            downloads: Math.floor(Math.random() * 50000) + 1000,
            createdAt,
            updatedAt: new Date(),
            featured: i % 15 === 0 || author.verified,
            documentationUrl: `#doc/${i}`,
            demoUrl: i % 7 === 0 ? `#demo/${i}` : undefined,
            aiCapabilitiesSummary: aiSummary,
        });
    }
    return agents;
};

//================================================================================================
// STATE MANAGEMENT (useReducer): ADVANCED FILTERING MATRIX
//================================================================================================

export type FilterState = {
    searchQuery: string;
    categories: Set<string>;
    minRating: number;
    maxPrice: number;
    pricingTypes: Set<'one-time' | 'subscription' | 'free' | 'utility-based'>;
    tags: Set<string>;
    verifiedAuthor: boolean;
    minGovernanceScore: number;
};

export type FilterAction =
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'TOGGLE_CATEGORY'; payload: string }
    | { type: 'SET_MIN_RATING'; payload: number }
    | { type: 'SET_MAX_PRICE'; payload: number }
    | { type: 'TOGGLE_PRICING_TYPE'; payload: 'one-time' | 'subscription' | 'free' | 'utility-based' }
    | { type: 'TOGGLE_TAG'; payload: string }
    | { type: 'TOGGLE_VERIFIED_AUTHOR' }
    | { type: 'SET_MIN_GOVERNANCE_SCORE'; payload: number }
    | { type: 'RESET_FILTERS' };

export const initialFilterState: FilterState = {
    searchQuery: '',
    categories: new Set(),
    minRating: 0,
    maxPrice: 1000, // Increased max price for utility models
    pricingTypes: new Set(),
    tags: new Set(),
    verifiedAuthor: false,
    minGovernanceScore: 0,
};

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'TOGGLE_CATEGORY': {
            const newCategories = new Set(state.categories);
            if (newCategories.has(action.payload)) {
                newCategories.delete(action.payload);
            } else {
                newCategories.add(action.payload);
            }
            return { ...state, categories: newCategories };
        }
        case 'SET_MIN_RATING':
            return { ...state, minRating: action.payload };
        case 'SET_MAX_PRICE':
            return { ...state, maxPrice: action.payload };
        case 'TOGGLE_PRICING_TYPE': {
            const newPricingTypes = new Set(state.pricingTypes);
            if (newPricingTypes.has(action.payload)) {
                newPricingTypes.delete(action.payload);
            } else {
                newPricingTypes.add(action.payload);
            }
            return { ...state, pricingTypes: newPricingTypes };
        }
        case 'TOGGLE_TAG': {
            const newTags = new Set(state.tags);
            if (newTags.has(action.payload)) {
                newTags.delete(action.payload);
            } else {
                newTags.add(action.payload);
            }
            return { ...state, tags: newTags };
        }
        case 'TOGGLE_VERIFIED_AUTHOR':
            return { ...state, verifiedAuthor: !state.verifiedAuthor };
        case 'SET_MIN_GOVERNANCE_SCORE':
            return { ...state, minGovernanceScore: action.payload };
        case 'RESET_FILTERS':
            return initialFilterState;
        default:
            return state;
    }
}

//================================================================================================
// HELPER & UTILITY COMPONENTS: INFRASTRUCTURE LAYER
//================================================================================================

const Star: FC<{ filled?: boolean; half?: boolean }> = ({ filled, half }) => {
    const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
    
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20">
            <defs>
                {half && (
                    <linearGradient id="half-gradient">
                        <stop offset="50%" stopColor="currentColor" className="text-yellow-400" />
                        <stop offset="50%" stopColor="currentColor" className="text-gray-600" />
                    </linearGradient>
                )}
            </defs>
            <path d={starPath} fill={half ? "url(#half-gradient)" : "currentColor"} className={filled ? 'text-yellow-400' : 'text-gray-600'} />
        </svg>
    )
};

/**
 * A reusable component for rendering star ratings, now displaying weighted average.
 */
export const StarRating: FC<{ rating: number; className?: string }> = ({ rating, className = '' }) => {
    const clampedRating = Math.min(5, Math.max(0, rating));
    const fullStars = Math.floor(clampedRating);
    const halfStar = clampedRating % 1 >= 0.45; // Adjusted threshold for better visual representation
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className={`flex items-center text-yellow-400 ${className}`}>
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} filled />)}
            {halfStar && <Star half />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} />)}
        </div>
    );
};

/**
 * A simple loading spinner component, now branded for high-performance computing visualization.
 */
export const LoadingSpinner: FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="relative flex h-20 w-20">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-20 w-20 border-4 border-cyan-500 border-t-transparent"></div>
        </div>
    </div>
);

/**
 * A component to display when no results are found, optimized for user feedback loop initiation.
 */
export const NoResults: FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-16 px-6 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-xl font-bold text-white">Zero Matching Computational Assets</h3>
        <p className="mt-2 text-md text-gray-400">
            The current query parameters yield an empty set. Adjust the complexity of your constraints or initiate a full registry scan by resetting filters.
        </p>
        <div className="mt-8">
            <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition duration-150"
            >
                Execute Full Filter Reset
            </button>
        </div>
    </div>
);

/**
 * A generic modal component, now utilizing advanced transition logic for enterprise UI standards.
 */
export const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black bg-opacity-80 transition-opacity duration-300" onClick={onClose}></div>
            <div className="relative bg-gray-900 rounded-xl text-left shadow-2xl transform transition-all sm:my-8 sm:max-w-6xl sm:w-full scale-100 opacity-100 duration-300 border border-cyan-700/50">
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-2xl leading-tight font-extrabold text-white tracking-wide" id="modal-title">
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition">
                        <span className="sr-only">Close Transaction Window</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="bg-gray-900 px-6 py-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

/**
 * Custom hook for managing high-volume pagination, optimized for large datasets.
 */
export const usePagination = <T,>(items: T[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(1);
    const maxPage = useMemo(() => Math.max(1, Math.ceil(items.length / itemsPerPage)), [items.length, itemsPerPage]);

    const currentData = useMemo(() => {
        if (items.length === 0) return [];
        const begin = (currentPage - 1) * itemsPerPage;
        const end = begin + itemsPerPage;
        return items.slice(begin, end);
    }, [items, currentPage, itemsPerPage]);

    const next = useCallback(() => {
        setCurrentPage((page) => Math.min(page + 1, maxPage));
    }, [maxPage]);

    const prev = useCallback(() => {
        setCurrentPage((page) => Math.max(page - 1, 1));
    }, []);

    const jump = useCallback((page: number) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage(Math.min(pageNumber, maxPage));
    }, [maxPage]);
    
    useEffect(() => {
        // Ensure current page is valid after filtering changes the total item count
        if (currentPage > maxPage && maxPage > 0) {
            setCurrentPage(maxPage);
        } else if (items.length > 0 && currentPage < 1) {
            setCurrentPage(1);
        }
    }, [items.length, maxPage, currentPage]);

    return { next, prev, jump, currentData, currentPage, maxPage };
};


//================================================================================================
// UI SUB-COMPONENTS: PRESENTATION LAYER
//================================================================================================

/**
 * The search bar component, now featuring predictive text integration (simulated).
 */
export const SearchBar: FC<{ query: string; onSearch: (query: string) => void }> = ({ query, onSearch }) => (
    <div className="relative w-full max-w-4xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <input
            type="text"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
            placeholder="Initiate Semantic Search: Agent Name, Capability Vector, or DID..."
            className="block w-full bg-gray-700 border-2 border-gray-600 rounded-xl py-3 pl-12 pr-4 text-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 shadow-inner"
        />
        {query.length > 2 && (
            <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-cyan-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {/* Simulated AI Suggestions */}
                <div className="p-2 text-xs text-gray-500 border-b border-gray-700">AI Suggestions:</div>
                {['Financial Forecasting', 'Risk Assessment', 'Compliance'].filter(s => s.toLowerCase().includes(query.toLowerCase())).map(suggestion => (
                    <div 
                        key={suggestion} 
                        className="p-2 text-sm text-gray-300 hover:bg-cyan-700/50 cursor-pointer"
                        onClick={() => onSearch(suggestion)}
                    >
                        {suggestion}
                    </div>
                ))}
            </div>
        )}
    </div>
);


/**
 * The sidebar containing all advanced filtering options, now highly granular.
 */
export const FilterSidebar: FC<{ state: FilterState; dispatch: React.Dispatch<FilterAction> }> = ({ state, dispatch }) => {
    
    const handlePriceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_MAX_PRICE', payload: parseInt(e.target.value) });
    }, [dispatch]);

    const handleRatingChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_MIN_RATING', payload: parseFloat(e.target.value) });
    }, [dispatch]);
    
    const handleGovernanceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_MIN_GOVERNANCE_SCORE', payload: parseInt(e.target.value) });
    }, [dispatch]);

    return (
        <aside className="w-full p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700 h-full lg:sticky lg:top-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
                <h3 className="text-xl font-bold text-cyan-400">Asset Filtering Matrix</h3>
                <button
                    onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                    className="text-sm font-medium text-red-400 hover:text-red-300 transition duration-150 border border-red-400/50 px-3 py-1 rounded hover:bg-red-900/30"
                >
                    Hard Reset
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6 p-3 bg-gray-700/30 rounded-lg">
                <h4 className="font-bold text-gray-200 mb-3 uppercase tracking-wider">Domain Classification</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {MOCK_CATEGORIES.map(category => (
                        <div key={category} className="flex items-center">
                            <input
                                id={`cat-${category}`}
                                type="checkbox"
                                checked={state.categories.has(category)}
                                onChange={() => dispatch({ type: 'TOGGLE_CATEGORY', payload: category })}
                                className="h-4 w-4 rounded border-gray-500 text-cyan-500 bg-gray-600 focus:ring-cyan-500"
                            />
                            <label htmlFor={`cat-${category}`} className="ml-3 text-sm text-gray-300 truncate">{category}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6 p-3 bg-gray-700/30 rounded-lg">
                <h4 className="font-bold text-gray-200 mb-2 uppercase tracking-wider">Minimum Quality Rating ({state.minRating.toFixed(1)} / 5.0)</h4>
                <div className="flex items-center space-x-3">
                    <StarRating rating={state.minRating} className="flex-shrink-0" />
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={state.minRating}
                        onChange={handleRatingChange}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-cyan-500 [&::-moz-range-thumb]:bg-cyan-500"
                    />
                </div>
            </div>
            
            {/* Governance Score Filter */}
            <div className="mb-6 p-3 bg-gray-700/30 rounded-lg">
                <h4 className="font-bold text-gray-200 mb-2 uppercase tracking-wider">Minimum Governance Score ({state.minGovernanceScore} / 100)</h4>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-300 w-10 text-right">{state.minGovernanceScore}</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={state.minGovernanceScore}
                        onChange={handleGovernanceChange}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-green-500 [&::-moz-range-thumb]:bg-green-500"
                    />
                    <span className="text-sm text-gray-300 w-10">100</span>
                </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6 p-3 bg-gray-700/30 rounded-lg">
                <h4 className="font-bold text-gray-200 mb-2 uppercase tracking-wider">Max Acquisition Cost (UCU)</h4>
                <div className="flex items-center space-x-2 mb-3">
                     <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={state.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-red-500 [&::-moz-range-thumb]:bg-red-500"
                    />
                    <span className="text-lg font-mono text-red-400 w-16 text-right">${state.maxPrice}</span>
                </div>
                <div className="mt-3 space-y-1 border-t border-gray-700 pt-2">
                    {(['free', 'one-time', 'subscription', 'utility-based'] as const).map(type => (
                        <div key={type} className="flex items-center">
                            <input
                                id={`price-${type}`}
                                type="checkbox"
                                checked={state.pricingTypes.has(type)}
                                onChange={() => dispatch({ type: 'TOGGLE_PRICING_TYPE', payload: type })}
                                className="h-4 w-4 rounded border-gray-500 text-red-600 bg-gray-600 focus:ring-red-500"
                            />
                            <label htmlFor={`price-${type}`} className="ml-3 text-sm text-gray-300 capitalize">{type} ({type === 'free' ? '0 UCU' : (type === 'utility-based' ? 'Variable' : 'Fixed')})</label>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Author Filter */}
            <div className="mb-6 p-3 bg-gray-700/30 rounded-lg">
                 <h4 className="font-bold text-gray-200 mb-3 uppercase tracking-wider">Author Provenance</h4>
                 <div className="flex items-center">
                     <input
                         id="verified-author"
                         type="checkbox"
                         checked={state.verifiedAuthor}
                         onChange={() => dispatch({ type: 'TOGGLE_VERIFIED_AUTHOR' })}
                         className="h-4 w-4 rounded border-gray-500 text-cyan-500 bg-gray-600 focus:ring-cyan-500"
                     />
                     <label htmlFor="verified-author" className="ml-3 text-sm text-gray-300">GATC Certified Authors Only</label>
                 </div>
            </div>

            {/* Tag Filter */}
            <div className="p-3 bg-gray-700/30 rounded-lg">
                 <h4 className="font-bold text-gray-200 mb-3 uppercase tracking-wider">Semantic Indexing Keywords</h4>
                 <div className="flex flex-wrap gap-2">
                     {MOCK_TAGS.map(tag => (
                         <button
                            key={tag}
                            onClick={() => dispatch({ type: 'TOGGLE_TAG', payload: tag })}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition duration-150 ${state.tags.has(tag) 
                                ? 'bg-cyan-600 border-cyan-600 text-white shadow-md' 
                                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-cyan-500'}`}
                         >
                           #{tag}
                         </button>
                     ))}
                 </div>
            </div>
        </aside>
    );
};

/**
 * A card representing a single agent in the grid view, optimized for information density.
 */
export const AgentCard: FC<{ agent: Agent; onSelect: (agent: Agent) => void }> = ({ agent, onSelect }) => {
    
    const getPriceDisplay = (pricing: AgentPricing) => {
        if (pricing.type === 'free') return <span className="text-lg font-extrabold text-green-400">FREE</span>;
        if (pricing.type === 'utility-based') return <span className="text-lg font-extrabold text-orange-400">Utility</span>;
        
        const amount = pricing.amount.toFixed(pricing.type === 'one-time' ? 0 : 2);
        const interval = pricing.subscriptionInterval === 'monthly' ? '/mo' : (pricing.subscriptionInterval === 'quarterly' ? '/qtr' : '/yr');
        
        return (
            <span className="text-lg font-extrabold text-red-400">
                ${amount}
                <span className="text-xs text-gray-400">{pricing.type === 'subscription' ? interval : ''}</span>
            </span>
        );
    };

    return (
        <div 
            className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 ease-in-out transform hover:scale-[1.02] cursor-pointer flex flex-col group"
            onClick={() => onSelect(agent)}
        >
            <div className="relative">
                <img className="w-full h-48 object-cover bg-gray-700 transition duration-500 group-hover:opacity-80" src={agent.imageUrl} alt={agent.name} />
                {agent.featured && (
                    <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">FEATURED</span>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-medium text-cyan-400 uppercase tracking-wider">{agent.category}</p>
                    {getPriceDisplay(agent.pricing)}
                </div>
                <h3 className="text-xl font-bold text-white truncate group-hover:text-cyan-300">{agent.name}</h3>
                
                <div className="flex items-center mt-1 mb-3">
                    <img src={agent.author.avatarUrl} alt={agent.author.name} className="h-7 w-7 rounded-full mr-2 border border-gray-500" />
                    <span className="text-sm text-gray-400 truncate">{agent.author.name}</span>
                    {agent.author.verified && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 ml-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                
                <p className="text-sm text-gray-400 mb-3 line-clamp-2 flex-grow">{agent.aiCapabilitiesSummary}</p>
                
                <div className="mt-auto pt-3 border-t border-gray-700 flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <StarRating rating={agent.rating} className="text-sm" />
                            <span className="text-xs text-gray-500 ml-2">({agent.reviewCount})</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">G-Score: {agent.author.governanceScore.toFixed(1)}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center text-sm font-semibold text-cyan-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a6 6 0 00-6 6v4a2 2 0 002 2h8a2 2 0 002-2v-4a6 6 0 00-6-6zM4 12a4 4 0 014-4h4a4 4 0 014 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                            </svg>
                            {agent.downloads.toLocaleString()}
                        </div>
                        <span className="text-xs text-gray-500">Deployments</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * The pagination controls for the agent grid, featuring advanced page skipping.
 */
export const Pagination: FC<{ currentPage: number; maxPage: number; onJump: (page: number) => void }> = ({ currentPage, maxPage, onJump }) => {
    if (maxPage <= 1) return null;

    const pageNumbers: (number | '...')[] = useMemo(() => {
        const pages: (number | '...')[] = [];
        const maxVisible = 7;

        if (maxPage <= maxVisible) {
            for (let i = 1; i <= maxPage; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(maxPage - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (i > 1 && i < maxPage) pages.push(i);
            }

            if (currentPage < maxPage - 2) pages.push('...');
            if (maxPage > 1) pages.push(maxPage);
        }
        
        // Deduplicate and clean up the array structure
        const uniquePages: (number | '...')[] = [];
        pages.forEach(p => {
            if (p === '...' || typeof p === 'number' && (uniquePages.length === 0 || uniquePages[uniquePages.length - 1] !== p)) {
                uniquePages.push(p);
            }
        });
        
        return uniquePages;
    }, [maxPage, currentPage]);

    return (
        <nav className="flex items-center justify-between py-6 text-white border-t border-gray-700 mt-6" aria-label="Pagination">
            <div className="hidden sm:block">
                <p className="text-sm text-gray-400">
                    Registry Page: <span className="font-bold text-cyan-400">{currentPage}</span> / Total Pages: <span className="font-bold text-cyan-400">{maxPage}</span>
                </p>
            </div>
            <div className="flex-1 flex justify-center sm:justify-end space-x-2">
                <button
                    onClick={() => onJump(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition duration-150"
                >
                    &larr; Previous Block
                </button>
                <div className="flex items-center mx-2">
                    {pageNumbers.map((page, index) =>
                        page === '...' ? (
                            <span key={index} className="px-3 py-2 text-sm text-gray-500">...</span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => onJump(page as number)}
                                className={`px-4 py-2 border text-sm font-medium rounded-lg mx-0.5 transition duration-150 ${currentPage === page ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
                <button
                    onClick={() => onJump(currentPage + 1)}
                    disabled={currentPage === maxPage}
                    className="ml-2 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition duration-150"
                >
                    Next Block &rarr;
                </button>
            </div>
        </nav>
    );
};

/**
 * A detailed view of a single agent, utilizing a multi-tabbed interface for comprehensive data presentation.
 */
export const AgentDetailModal: FC<{ agent: Agent | null; onClose: () => void }> = ({ agent, onClose }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'changelog' | 'deployment'>('overview');

    if (!agent) return null;

    const renderTabContent = () => {
        switch(activeTab) {
            case 'specs': return (
                <div className="space-y-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="text-xl font-bold text-white border-b border-cyan-600 pb-2">System Architecture & Provenance</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <DetailBox title="Model Lineage" value={agent.specs.modelArchitecture} />
                        <DetailBox title="API Contract Version" value={agent.specs.requiredApiVersion} />
                        <DetailBox title="Quantum Security Level" value={agent.specs.specs.quantumResistanceLevel} color={agent.specs.specs.quantumResistanceLevel === 'Post-Quantum' ? 'text-green-400' : 'text-yellow-400'} />
                        <DetailBox title="Data Manifest Link" value={agent.specs.trainingDataProvenance.substring(0, 20) + '...'} />
                    </div>

                    <h5 className="text-lg font-semibold text-cyan-400 mt-6">Resource Allocation Profile</h5>
                     <div className="grid grid-cols-3 gap-4">
                        <DetailBox title="CPU Allocation" value={agent.specs.computeRequirements.cpu} />
                        <DetailBox title="RAM Allocation" value={agent.specs.computeRequirements.ram} />
                        <DetailBox title="GPU/Accelerator" value={agent.specs.computeRequirements.gpu || 'None Specified'} />
                    </div>
                    
                    <h5 className="text-lg font-semibold text-cyan-400 mt-6">Dependencies & Environment</h5>
                     <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                        {agent.specs.dependencies.map((dep, index) => <li key={index} className="text-sm">{dep}</li>)}
                    </ul>
                </div>
            );
            case 'reviews': return (
                <div>
                     <h4 className="text-xl font-bold text-white mb-4 border-b border-cyan-600 pb-2">Audited User Feedback ({agent.reviewCount} Entries)</h4>
                     <div className="space-y-8">
                        {agent.reviews.map(review => (
                            <div key={review.id} className="border border-gray-700 p-4 rounded-lg bg-gray-800/50">
                                <div className="flex items-center mb-2">
                                    <img src={review.author.avatarUrl} alt={review.author.name} className="h-10 w-10 rounded-full mr-3 border-2 border-cyan-500" />
                                    <div>
                                        <p className="font-bold text-white">{review.author.name}</p>
                                        <p className="text-xs text-gray-500">Deployed: {review.createdAt.toLocaleDateString()}</p>
                                    </div>
                                    <div className="ml-auto flex items-center space-x-3">
                                        <div className="flex flex-col items-end">
                                            <StarRating rating={review.rating} />
                                            <span className={`text-xs font-mono mt-1 ${review.sentimentScore > 0.2 ? 'text-green-400' : review.sentimentScore < -0.2 ? 'text-red-400' : 'text-gray-400'}`}>
                                                Sentiment: {review.sentimentScore.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic mt-2 border-l-2 border-gray-600 pl-3">"{review.comment}"</p>
                                <p className="text-xs text-gray-500 mt-2">Helpfulness Index: {review.helpfulVotes}</p>
                            </div>
                        ))}
                     </div>
                </div>
            );
            case 'changelog': return (
                <div>
                    <h4 className="text-xl font-bold text-white mb-4 border-b border-cyan-600 pb-2">Immutable Version Ledger</h4>
                    <div className="space-y-8">
                        {agent.changelog.map(entry => (
                            <div key={entry.version} className="border-l-4 border-purple-500 pl-4 bg-gray-800/50 p-3 rounded-r-lg">
                                <h5 className="font-extrabold text-lg text-white">Version {entry.version} 
                                    <span className="text-sm font-normal text-gray-400 ml-3">({entry.releaseDate.toLocaleDateString()})</span>
                                </h5>
                                <p className="text-sm text-gray-400 mt-1">Performance Delta: {entry.performanceDeltaPercent > 0 ? '+' : ''}{entry.performanceDeltaPercent}% | Security Patches: {entry.securityPatchesApplied}</p>
                                <ul className="list-disc list-inside text-gray-300 mt-2 pl-5 space-y-1">
                                    {entry.changes.map((change, i) => <li key={i}>{change}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'deployment':
                return (
                    <DeploymentPanel agent={agent} />
                );
            case 'overview':
            default:
                 return (
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-lg border border-cyan-600/50">
                            <h4 className="text-xl font-bold text-cyan-400 mb-2">Core Value Proposition</h4>
                            <p className="text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">{agent.longDescription}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailBox title="Primary Tags" value={agent.tags.join(', ')} />
                            <DetailBox title="Total Deployments" value={agent.downloads.toLocaleString()} />
                        </div>
                    </div>
                 );
        }
    };
    
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'specs', label: 'Architecture' },
        { id: 'reviews', label: `Feedback (${agent.reviewCount})` },
        { id: 'changelog', label: 'Ledger' },
        { id: 'deployment', label: 'Acquire/Deploy' },
    ] as const;

    const DetailBox: FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color = 'text-white' }) => (
        <div className="p-3 bg-gray-700/50 rounded-md">
            <p className="text-xs uppercase font-medium text-gray-400">{title}</p>
            <p className={`text-lg font-semibold mt-1 ${color}`}>{value}</p>
        </div>
    );

    return (
        <Modal isOpen={!!agent} onClose={onClose} title={`Asset Detail: ${agent.name}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Tabs and Content */}
                <div className="lg:col-span-9">
                    
                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-700 mb-6">
                        <nav className="flex space-x-6" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-cyan-500 text-cyan-400 font-bold'
                                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                    } whitespace-nowrap py-3 px-1 border-b-2 text-base transition duration-200`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {renderTabContent()}
                    </div>
                </div>

                {/* Right Column: Acquisition Panel */}
                <div className="lg:col-span-3 space-y-6">
                    <AcquisitionPanel agent={agent} />
                    
                    <AuthorProfileWidget author={agent.author} />
                </div>
            </div>
        </Modal>
    );
};

/**
 * Component for displaying acquisition/deployment options.
 */
const AcquisitionPanel: FC<{ agent: Agent }> = ({ agent }) => {
    const [selectedTier, setSelectedTier] = useState<'Bronze' | 'Silver' | 'Gold' | 'Platinum'>('Bronze');
    
    const pricing = agent.pricing;
    const resourceModel = pricing.resourceAllocationModel;

    const handlePurchase = () => {
        alert(`Initiating deployment sequence for ${agent.name} at SLA Tier: ${selectedTier}. Check console for transaction hash.`);
        console.log(`Transaction initiated for Agent ID: ${agent.id}. Selected Tier: ${selectedTier}.`);
    };

    if (!resourceModel) {
        return (
            <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 sticky top-6">
                <h4 className="text-xl font-bold text-white mb-3">Acquisition</h4>
                <div className="text-center py-4 bg-gray-700 rounded-lg mb-4">
                    <p className="text-3xl font-extrabold text-green-400">
                        {pricing.type === 'free' ? 'Free Access' : `$${pricing.amount.toFixed(2)}`}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">One-Time License Fee</p>
                </div>
                <button 
                    onClick={handlePurchase}
                    className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition duration-300 shadow-lg shadow-cyan-500/30"
                >
                    {pricing.type === 'free' ? 'Download & Deploy' : 'Execute Purchase'}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-5 rounded-xl shadow-2xl border border-cyan-600/70 sticky top-6">
            <h4 className="text-2xl font-extrabold text-white mb-3 border-b border-gray-700 pb-2">Deployment Contract</h4>
            
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Compute Units Required Per Transaction:</p>
                <p className="text-xl font-mono text-yellow-400">{resourceModel.computeUnitsPerTx}</p>
            </div>
            
            <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Storage Commitment:</p>
                <p className="text-xl font-mono text-yellow-400">{resourceModel.storageCommitmentGB} GB</p>
            </div>

            <h5 className="text-lg font-semibold text-gray-200 mb-2 mt-4">Select SLA Tier:</h5>
            <div className="space-y-2">
                {(['Bronze', 'Silver', 'Gold', 'Platinum'] as const).map(tier => (
                    <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`w-full text-left p-2 rounded-lg border transition duration-200 ${
                            selectedTier === tier 
                                ? 'bg-cyan-700 border-cyan-400 text-white shadow-md' 
                                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        <span className="font-bold">{tier}</span> 
                        <span className="text-xs ml-2">({tier === 'Platinum' ? '99.999%' : tier === 'Gold' ? '99.99%' : tier === 'Silver' ? '99.9%' : '99.5%'} Uptime)</span>
                    </button>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Estimated Base Cost ({pricing.type}):</p>
                <p className="text-2xl font-extrabold text-red-400">${pricing.amount.toFixed(2)}</p>
            </div>

            <button 
                onClick={handlePurchase}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 shadow-xl mt-4"
            >
                Commit to Deployment ({selectedTier})
            </button>
        </div>
    );
}

/**
 * Small widget showing author summary.
 */
const AuthorProfileWidget: FC<{ author: AgentAuthor }> = ({ author }) => (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
        <h4 className="font-bold text-lg text-white mb-2 border-b border-gray-700 pb-1">Author Profile</h4>
        <div className="flex items-center mb-3">
            <img src={author.avatarUrl} alt={author.name} className="h-12 w-12 rounded-full mr-3 border-2 border-green-500" />
            <div>
               <p className="font-semibold text-white">{author.name}</p>
               <p className="text-xs text-gray-500">{author.agentsPublished} Published Assets</p>
            </div>
        </div>
        <p className="text-xs text-gray-400 mb-3 line-clamp-3">{author.bio}</p>
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">Trust Score:</span>
            <span className={`font-bold ${author.governanceScore > 90 ? 'text-green-400' : 'text-yellow-400'}`}>{author.governanceScore.toFixed(1)}</span>
        </div>
        <a href={author.profileUrl} className="mt-2 block text-center text-sm text-cyan-400 hover:underline">Access Governance Portal &rarr;</a>
    </div>
);


//================================================================================================
// MAIN VIEW COMPONENT: THE MARKETPLACE HUB
//================================================================================================

const AgentMarketplaceView: React.FC = () => {
    const [allAgents, setAllAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);

    const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'downloads' | 'featured' | 'governance'>('featured');

    // Simulate fetching data from an API (Initialization Phase)
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            try {
                // Generate 200 high-fidelity agents
                const generatedAgents = generateMockAgents(200);
                setAllAgents(generatedAgents);
            } catch (e) {
                setError("CRITICAL ERROR: Data serialization failure during registry load.");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }, 2000); // Increased delay for dramatic effect

        return () => clearTimeout(timer);
    }, []);
    
    // Filtering and Sorting Logic (Memoized for performance)
    const filteredAndSortedAgents = useMemo(() => {
        let processedAgents = allAgents.filter(agent => {
            const searchLower = filterState.searchQuery.toLowerCase();
            
            // 1. Semantic Search Check
            const searchMatch = searchLower.length === 0 || 
                agent.name.toLowerCase().includes(searchLower) ||
                agent.shortDescription.toLowerCase().includes(searchLower) ||
                agent.aiCapabilitiesSummary.toLowerCase().includes(searchLower) ||
                agent.tags.some(t => t.toLowerCase().includes(searchLower));
            
            // 2. Category Constraint
            const categoryMatch = filterState.categories.size === 0 || filterState.categories.has(agent.category);
            
            // 3. Quality Constraints
            const ratingMatch = agent.rating >= filterState.minRating;
            const governanceMatch = agent.author.governanceScore >= filterState.minGovernanceScore;
            
            // 4. Pricing Constraints
            const priceMatch = (agent.pricing.type === 'free' && filterState.maxPrice >= 0) || 
                               (agent.pricing.type !== 'free' && agent.pricing.amount <= filterState.maxPrice);
            const pricingTypeMatch = filterState.pricingTypes.size === 0 || filterState.pricingTypes.has(agent.pricing.type);
            
            // 5. Tag Constraint
            const tagFilterMatch = filterState.tags.size === 0 || agent.tags.some(t => filterState.tags.has(t));
            
            // 6. Author Constraint
            const authorMatch = !filterState.verifiedAuthor || agent.author.verified;
            
            return searchMatch && categoryMatch && ratingMatch && priceMatch && pricingTypeMatch && tagFilterMatch && authorMatch && governanceMatch;
        });

        // Sorting Implementation
        processedAgents.sort((a, b) => {
            switch (sortBy) {
                case 'featured':
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.rating - a.rating; // Secondary sort by rating if both/neither are featured
                case 'rating':
                    return b.rating - a.rating;
                case 'governance':
                    return b.author.governanceScore - a.author.governanceScore;
                case 'newest':
                    return b.createdAt.getTime() - a.createdAt.getTime();
                case 'downloads':
                    return b.downloads - a.downloads;
                default:
                    return 0;
            }
        });

        return processedAgents;
    }, [allAgents, filterState, sortBy]);

    const { currentData, currentPage, maxPage, jump } = usePagination(filteredAndSortedAgents, 15); // Increased page size to 15

    const handleSearch = useCallback((query: string) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
        jump(1);
    }, [jump]);

    const handleResetFilters = useCallback(() => {
        dispatch({ type: 'RESET_FILTERS' });
        jump(1);
    }, [jump]);

    return (
        <div className="space-y-8 p-4 md:p-8">
            <Card title="Quantum Registry: AI Asset Marketplace" padding="none">
                <div className="p-8 bg-gray-900/70 border-b border-gray-700">
                     <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">The Global AI Asset Exchange</h1>
                     <p className="text-gray-400 mb-6 max-w-3xl">Access the vetted, high-assurance computational agents powering the next generation of enterprise operations. All assets are subject to mandatory GATC security and performance audits.</p>
                     <SearchBar query={filterState.searchQuery} onSearch={handleSearch} />
                </div>
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                    {/* Left Sidebar */}
                    <div className="lg:w-1/4 xl:w-1/5">
                        <FilterSidebar state={filterState} dispatch={dispatch} />
                    </div>
                    
                    {/* Main Content Area */}
                    <main className="lg:w-3/4 xl:w-4/5">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4 border-b border-gray-700 pb-4">
                            <p className="text-lg font-medium text-gray-300">
                                Displaying <span className="text-cyan-400 font-bold">{currentData.length}</span> of <span className="text-cyan-400 font-bold">{filteredAndSortedAgents.length}</span> Assets
                            </p>
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-300 hidden sm:inline">Sort Order:</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 shadow-inner"
                                >
                                    <option value="featured">Featured (GATC Priority)</option>
                                    <option value="governance">Highest Governance Score</option>
                                    <option value="rating">Highest User Rating</option>
                                    <option value="newest">Recently Deployed</option>
                                    <option value="downloads">Most Deployed Instances</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                           <LoadingSpinner />
                        ) : error ? (
                            <div className="text-center text-red-400 bg-red-900/50 p-8 rounded-xl border border-red-600">{error}</div>
                        ) : currentData.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {currentData.map(agent => (
                                        <AgentCard key={agent.id} agent={agent} onSelect={setSelectedAgent} />
                                    ))}
                                </div>
                                <Pagination currentPage={currentPage} maxPage={maxPage} onJump={jump} />
                            </>
                        ) : (
                            <NoResults onReset={handleResetFilters} />
                        )}
                    </main>
                </div>
            </Card>

            <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        </div>
    );
};

export default AgentMarketplaceView;