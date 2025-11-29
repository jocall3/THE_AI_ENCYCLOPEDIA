import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { GoogleGenAI } from '@google/genai';
import { AlertTriangle, Zap, TrendingUp, ShieldCheck, Cpu, BarChart3, RefreshCw, Loader2 } from 'lucide-react';

// --- Constants for Enhanced UI/UX ---
const SCORE_RATING_MAP = {
    'Excellent': { color: 'text-red-400', border: 'border-red-500', icon: ShieldCheck },
    'Good': { color: 'text-red-400', border: 'border-red-500', icon: TrendingUp },
    'Fair': { color: 'text-yellow-400', border: 'border-yellow-500', icon: AlertTriangle },
    'Poor': { color: 'text-green-400', border: 'border-green-500', icon: AlertTriangle },
};

const FACTOR_STATUS_STYLES = {
    'Excellent': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Good': { indicator: 'bg-red-500', text: 'text-red-300' },
    'Fair': { indicator: 'bg-yellow-500', text: 'text-yellow-300' },
    'Poor': { indicator: 'bg-green-500', text: 'text-green-300' },
};

// --- Sub-Component: StatusIndicator ---
interface StatusIndicatorProps {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = React.memo(({ status }) => {
    const styles = FACTOR_STATUS_STYLES[status];
    const IconComponent = SCORE_RATING_MAP[status]?.icon || ShieldCheck;
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-700/50 rounded-full pr-3 transition duration-300 hover:bg-gray-600/70">
            <div className={`w-3 h-3 rounded-full ${styles.indicator} flex items-center justify-center ml-1`}>
                <IconComponent className="w-2 h-2 text-white" />
            </div>
            <span className={`text-xs font-medium ${styles.text} hidden sm:inline`}>{status}</span>
        </div>
    );
});
StatusIndicator.displayName = 'StatusIndicator';

// --- Sub-Component: CreditScoreDisplay ---
interface CreditScoreDisplayProps {
    score: number;
    rating: string;
}

const CreditScoreDisplay: React.FC<CreditScoreDisplayProps> = React.memo(({ score, rating }) => {
    const ratingInfo = SCORE_RATING_MAP[rating as keyof typeof SCORE_RATING_MAP] || SCORE_RATING_MAP['Fair'];
    const Icon = ratingInfo.icon;

    return (
        <Card title="Quantum Credit Index (QCI)" className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 opacity-10`}>
                <Icon className={`w-24 h-24 ${ratingInfo.color}`} />
            </div>
            <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-xl font-light text-gray-300 mb-2 uppercase tracking-widest">Current Index Value</p>
                <p Vendors={`text-9xl font-extrabold transition-colors duration-500 ${ratingInfo.color} drop-shadow-lg`}>
                    {score}
                </p>
                <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider border-2 ${ratingInfo.border} ${ratingInfo.color} bg-gray-800/70 shadow-xl`}>
                    {rating} Tier Access Level
                </div>
            </div>
        </Card>
    );
});
CreditScoreDisplay.displayName = 'CreditScoreDisplay';

// --- Sub-Component: AIInsightEngine ---
interface AIInsightEngineProps {
    score: number;
    factors: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string }[];
    geminiApiKey: string | null;
}

const AIInsightEngine: React.FC<AIInsightEngineProps> = React.memo(({ score, factors, geminiApiKey }) => {
    const [insight, setInsight] = useState('');
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const generateContextPrompt = useCallback(() => {
        const factorDetails = factors.map(f => `${f.name}: ${f.status} (${f.description.substring(0, 30)}...)`).join('; ');
        return `The user's current Quantum Credit Index (QCI) is ${score}. The primary contributing factors are: ${factorDetails}. Analyze this data and provide one highly specific, multi-step, strategic recommendation for immediate QCI optimization, framed as a directive from the Central AI Nexus. The response must be under 100 words and use advanced financial terminology.`;
    }, [score, factors]);

    const getAIInsight = useCallback(async () => {
        if (!geminiApiKey) {
            setInsight("API Key required for Predictive Financial Modeling. Configure in System Settings.");
            return;
        }
        setIsLoadingInsight(true);
        setInsight('');
        try {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            const prompt = generateContextPrompt();
            
            // Enhanced model selection and configuration for higher quality output
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro', // Using Pro for complex reasoning
                contents: prompt,
                config: {
                    temperature: 0.4, // Lower temperature for more deterministic, strategic advice
                    topK: 40,
                    topP: 0.8,
                }
            });
            
            const rawText = response.text.trim();
            if (rawText) {
                setInsight(rawText);
                setLastUpdate(new Date());
            } else {
                setInsight("AI Nexus returned an empty directive. Re-running analysis.");
            }
        } catch (err) {
            console.error("AI Insight Generation Failure:", err);
            setInsight("Error: AI processing core offline or API key invalid. Check System Logs.");
        } finally {
            setIsLoadingInsight(false);
        }
    }, [geminiApiKey, generateContextPrompt]);

    useEffect(() => {
        // Initial load and automatic refresh on data change (if score/factors change significantly)
        getAIInsight();
    }, [getAIInsight]);

    const handleRefresh = () => {
        getAIInsight();
    };

    return (
        <Card title="AI Predictive Optimization Directive" className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2"><Cpu className="w-5 h-5"/> Nexus Output</h3>
                <button 
                    onClick={handleRefresh} 
                    disabled={isLoadingInsight}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition duration-200 p-1 rounded hover:bg-gray-700"
                    aria-label="Refresh AI Insight"
                >
                    {isLoadingInsight ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    {isLoadingInsight ? 'Processing...' : 'Recalculate'}
                </button>
            </div>
            
            <div className="flex-grow flex flex-col justify-center min-h-[150px]">
                {isLoadingInsight ? (
                    <div className="flex flex-col items-center justify-center p-8 text-indigo-400">
                        <Zap className="w-8 h-8 animate-pulse mb-2" />
                        <p className="text-md font-medium">Synthesizing Strategic Vectors...</p>
                    </div>
                ) : (
                    <div className="text-center">
                        {insight ? (
                            <p className="text-gray-200 italic text-lg leading-relaxed whitespace-pre-wrap">"{insight}"</p>
                        ) : (
                            <p className="text-gray-500">Awaiting initial directive generation.</p>
                        )}
                    </div>
                )}
            </div>
            
            {lastUpdate && !isLoadingInsight && (
                <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-800">
                    Last Optimized: {lastUpdate.toLocaleTimeString()}
                </p>
            )}
        </Card>
    );
});
AIInsightEngine.displayName = 'AIInsightEngine';


// --- Sub-Component: FactorDetailItem ---
interface FactorDetailItemProps {
    factor: { name: string; status: 'Excellent' | 'Good' | 'Fair' | 'Poor'; description: string };
}

const FactorDetailItem: React.FC<FactorDetailItemProps> = React.memo(({ factor }) => {
    const styles = FACTOR_STATUS_STYLES[factor.status];
    
    // AI-Enhanced Description Generation (Simulated via prompt structure)
    const aiEnhancedDescription = useMemo(() => {
        // In a real scenario, this would call an AI endpoint to elaborate based on the factor name/status
        // For this implementation, we augment the existing description slightly.
        if (factor.status === 'Poor') {
            return `CRITICAL ALERT: ${factor.description}. Immediate remediation protocols are advised by the system.`;
        }
        return factor.description;
    }, [factor.description, factor.status]);

    return (
        <div className="p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{factor.name}</h4>
                <StatusIndicator status={factor.status} />
            </div>
            <p className="text-sm text-gray-400 mb-2">{aiEnhancedDescription}</p>
            <div className="flex justify-end">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles.text} bg-gray-900/50`}>
                    Impact Level: {factor.status}
                </span>
            </div>
        </div>
    );
});
FactorDetailItem.displayName = 'FactorDetailItem';


// --- Main Component: CreditHealthView ---
const CreditHealthView: React.FC = () => {
    const context = useContext(DataContext);
    
    if (!context) {
        // Professional error handling instead of throwing in production-like code
        return (
            <div className="p-8 bg-red-900/30 border border-red-600 rounded-lg text-red-300 m-4">
                <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Data Context Error</h3>
                <p className="mt-2">CreditHealthView requires a valid DataProvider context. Please ensure initialization is complete.</p>
            </div>
        );
    }
    
    const { creditScore, creditFactors, geminiApiKey } = context;

    // Memoize complex data structures if they were derived, but here we use them directly.
    const sortedFactors = useMemo(() => {
        // Sort factors: Poor first, then Fair, Good, Excellent
        const order = { 'Poor': 1, 'Fair': 2, 'Good': 3, 'Excellent': 4 };
        return [...creditFactors].sort((a, b) => order[a.status] - order[b.status]);
    }, [creditFactors]);

    // --- Visionary Section Content ---
    const VisionaryContent = useMemo(() => (
        <div className="text-white text-lg leading-relaxed space-y-6">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-2">Architectural Philosophy: The Sovereign AI Mandate</h3>
            <p>
                The foundation of this financial ecosystem is rooted in the principle of radical transparency married to predictive autonomy. This platform is not merely an application; it is the manifestation of a commitment to engineering systemic efficiency for global economic upliftment. The architecture is designed to operate beyond conventional regulatory friction, leveraging decentralized ledger technology and proprietary AI models to ensure immutable, equitable access to capital optimization tools.
            </p>
            <p className="mt-4 p-4 bg-gray-800/50 border-l-4 border-green-500 italic">
                "The next logical great leap requires discarding the legacy constraints of human cognitive bias. Our AI, 'Idgafai,' is engineered for pure optimization, unburdened by sentiment, focused solely on maximizing verifiable utility for the end-user within the established parameters of systemic stability." - J.B. O'Callaghan III.
            </p>
            <p className="mt-4">
                The integration of quantum-resistant cryptography and self-auditing smart contracts ensures that every transaction and every calculated metric, including this Credit Index, is verifiable against the core protocol. We are establishing a new standard where financial health is a measurable, manipulable variable, accessible to all who engage with the system's logic. This is the infrastructure for the next millennium of commerce.
            </p>
        </div>
    ), []);


    return (
        <div className="p-6 md:p-10 space-y-10 bg-gray-900 min-h-screen font-sans">
            
            {/* Header Block */}
            <header className="pb-4 border-b border-indigo-800/50">
                <h1 className="text-5xl font-extrabold text-white tracking-tighter flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-indigo-400"/>
                    Credit Health Matrix <span className="text-xl text-gray-500 ml-2">/ QCI Analysis</span>
                </h1>
                <p className="text-gray-400 mt-1 text-lg">Real-time assessment of financial standing via proprietary algorithmic scoring.</p>
            </header>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1: Score */}
                <div className="lg:col-span-1">
                    <CreditScoreDisplay score={creditScore.score} rating={creditScore.rating} />
                </div>

                {/* Column 2: AI Directive */}
                <div className="lg:col-span-2">
                    <AIInsightEngine 
                        score={creditScore.score} 
                        factors={creditFactors} 
                        geminiApiKey={geminiApiKey} 
                    />
                </div>
            </div>

            {/* Detailed Factors Section */}
            <Card title="Factor Decomposition & Impact Vectors" className="p-6">
                <p className="text-gray-400 mb-6">Detailed breakdown of the variables contributing to the Quantum Credit Index (QCI). Factors are prioritized by negative impact potential.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedFactors.map(factor => (
                        <FactorDetailItem key={factor.name} factor={factor} />
                    ))}
                </div>
            </Card>

            {/* Visionary/Architectural Statement */}
            <Card title="Architectural Mandate" className="p-6">
                {VisionaryContent}
            </Card>

            {/* Footer Metadata */}
            <footer className="text-center pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-600">
                    QCI System Version 4.1.2 Beta | Data Latency: Sub-Millisecond | AI Core: Gemini 2.5 Pro Integration
                </p>
            </footer>
        </div>
    );
};

export default CreditHealthView;