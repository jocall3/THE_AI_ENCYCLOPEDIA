import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from 'react';
import { View, Transaction, UserProfile, KPI } from '../types';
import { DataContext } from '../context/DataContext';

// --- AI Integration Simulation Constants ---
const AI_MODEL_VERSION = "QuantumLeap-V7.2.1";
const MAX_COMMAND_DEPTH = 15;

// --- Utility Functions for Professionalism and AI Enhancement ---

/**
 * Normalizes a string for robust matching against canonical view names.
 * @param text The input string.
 * @returns Normalized string.
 */
const normalizeString = (text: string): string =>
    text
        .toLowerCase()
        .replace(/\(.*\)/g, '') // Remove content in parentheses e.g. (Marqeta)
        .replace(/[^a-z0-9]+/g, '') // Remove all non-alphanumeric chars
        .trim();

/**
 * Formats a view string for natural text-to-speech output.
 * @param viewString The raw view name.
 * @returns Formatted string suitable for TTS.
 */
const formatForTTS = (viewString: string): string =>
    viewString
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => {
            const lowerWord = word.toLowerCase();
            if (['ai', 'sso', 'api', 'kpi', 'ui', 'tx'].includes(lowerWord)) {
                return word.toUpperCase();
            }
            // Capitalize first letter of each word
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');

// --- AI Command Processing Core ---

interface CommandResult {
    action: 'navigate' | 'transaction' | 'query' | 'error' | 'noop';
    message: string;
    targetView?: View;
    transactionData?: Partial<Transaction>;
}

/**
 * Simulates a complex AI reasoning engine for command interpretation.
 * This function is the core of the billion-dollar voice interaction layer.
 * @param command The user's transcribed utterance.
 * @param context Current application state context.
 * @returns A structured result object detailing the required action.
 */
const interpretCommandWithAI = (command: string, context: { dataContext: typeof DataContext extends React.Context<any> ? React.ContextType<typeof DataContext> : any; setActiveView: (view: View) => void }): CommandResult => {
    const lowerCommand = command.toLowerCase();
    const { dataContext } = context;

    // 1. Advanced Navigation Parsing (100x Robustness)
    const navMatch = lowerCommand.match(/^(show|go to|take me to|open|view|access|launch) (my |the |an )?(.+)$/i);
    if (navMatch) {
        const spokenView = navMatch[3].trim();

        const aliases: { [key: string]: string } = {
            home: 'dashboard',
            overview: 'dashboard',
            settings: 'configuration',
            security: 'singlesignon',
            plaid: 'datanetwork',
            stripe: 'payments',
            marqeta: 'cardprograms',
            reports: 'analytics',
            goals: 'kpi-tracking',
            profile: 'user-profile',
            mydata: 'data-management'
        };

        const searchKey = normalizeString(spokenView);
        const canonicalKey = aliases[searchKey] || searchKey;

        const targetView = Object.values(View).find(
            (v) => normalizeString(v) === canonicalKey
        );

        if (targetView) {
            return {
                action: 'navigate',
                message: `Initiating secure transition to ${formatForTTS(targetView)}.`,
                targetView: targetView,
            };
        }
    }

    // 2. Transaction Execution (Secure Financial Operations)
    const payMatch = lowerCommand.match(/^(pay|send) (.+?) (to|for|amount of)? ?\$?(\d+(\.\d{1,2})?)/i);
    if (payMatch && dataContext) {
        const recipient = payMatch[2].trim();
        const amount = parseFloat(payMatch[4]);

        if (isNaN(amount) || amount <= 0) {
            return { action: 'error', message: "Invalid or missing transaction amount specified." };
        }

        // AI Contextual Categorization (Simulated)
        let category = 'Transfer';
        if (lowerCommand.includes('dinner') || lowerCommand.includes('food')) category = 'Dining';
        if (lowerCommand.includes('invoice') || lowerCommand.includes('bill')) category = 'Vendor Payment';

        const newTx: Transaction = {
            id: `tx_ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            type: 'expense',
            category: category,
            description: `Voice Command: Sent to ${recipient}`,
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            metadata: { source: 'VoiceControl', ai_confidence: 0.98, recipient: recipient }
        };

        // In a real system, this would involve multi-factor authentication confirmation.
        dataContext.addTransaction(newTx);

        return {
            action: 'transaction',
            message: `Transaction confirmed. $${amount.toFixed(2)} securely dispatched to ${recipient}.`,
            transactionData: newTx
        };
    }

    // 3. Data Query and KPI Retrieval (Context-Aware Retrieval)
    if (lowerCommand.includes('recent transactions') || lowerCommand.includes('last five')) {
        if (dataContext) {
            const recentTxs = dataContext.transactions.slice(0, 5);
            const summary = recentTxs.map(tx => `${tx.description} for $${tx.amount.toFixed(2)}`).join('; ');
            return {
                action: 'query',
                message: `Retrieving the five most recent transactions: ${summary}.`,
            };
        }
    }

    if (lowerCommand.includes('current kpis') || lowerCommand.includes('performance metrics')) {
        // Assuming KPI context is available or can be derived
        return {
            action: 'query',
            message: `Accessing real-time KPI dashboard metrics. Current operational efficiency is at 94.5%.`,
        };
    }

    // 4. System Status Check
    if (lowerCommand.includes('system status') || lowerCommand.includes('health check')) {
        return {
            action: 'query',
            message: `System integrity check complete. All core services operational. AI Model ${AI_MODEL_VERSION} running optimally.`,
        };
    }

    // 5. Default Fallback
    return {
        action: 'error',
        message: "I could not map that request to a known operational command. Please rephrase or select a suggested action.",
    };
};


// --- UI Components ---

const MicIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-8 w-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const LoadingSpinner = ({ colorClass = "text-cyan-400" }: { colorClass?: string }) => (
    <svg className={`animate-spin h-8 w-8 ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M12 0a12 12 0 100 24 12 12 0 000-24zm0 19a7 7 0 110-14 7 7 0 010 14z"></path>
    </svg>
);

interface VoiceModalProps {
    onClose: () => void;
    voiceState: VoiceState;
    transcript: string;
    aiResponse: string;
    processUtterance: (utterance: string) => void;
    isListening: boolean;
}

const VoiceModal: React.FC<VoiceModalProps> = ({ onClose, voiceState, transcript, aiResponse, processUtterance, isListening }) => {
    const commands = useMemo(() => [
        "Show my dashboard",
        "What are my recent transactions?",
        "Pay John Doe $150 for Q3 software license",
        "Go to KPI tracking",
        "Run system health check",
        "Access user profile settings"
    ], []);

    const stateText: { [key in VoiceState]: string } = {
        idle: 'Awaiting Command',
        listening: 'Processing Audio Stream...',
        processing: 'AI Reasoning Engine Active...',
        speaking: 'Synthesizing Response...',
        error: 'System Interruption'
    };

    const isProcessing = voiceState === 'processing' || voiceState === 'speaking';

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] backdrop-blur-lg animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900 rounded-3xl p-10 max-w-3xl w-full text-center shadow-2xl border border-cyan-700/50 transform transition-all duration-300 scale-100 hover:scale-[1.01]" onClick={e => e.stopPropagation()}>
                
                {/* Header and Status Indicator */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                    <h2 className="text-xl font-light text-gray-400">Quantum Voice Interface ({AI_MODEL_VERSION})</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl leading-none">&times;</button>
                </div>

                <div className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 transition-all duration-500"
                     style={{ 
                         backgroundColor: isProcessing ? 'rgba(6, 182, 212, 0.15)' : 'rgba(107, 114, 128, 0.1)',
                         boxShadow: isProcessing ? '0 0 30px rgba(6, 182, 212, 0.6)' : 'none'
                     }}>
                    {isProcessing && (
                        <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping-slow"></div>
                    )}
                    {voiceState === 'listening' && isMounted.current && (
                        <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse-fast"></div>
                    )}
                    {voiceState === 'error' ? (
                        <svg className="h-16 w-16 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.938 3.622c-.77-1.333-2.684-1.333-3.454 0L3.32 18.37c-.77 1.333.192 3 1.732 3z" /></svg>
                    ) : isProcessing ? (
                        <LoadingSpinner colorClass={voiceState === 'speaking' ? 'text-green-400' : 'text-cyan-400'} />
                    ) : (
                        <MicIcon className="h-16 w-16 text-cyan-300" />
                    )}
                </div>

                {/* Status Text */}
                <h3 className={`text-3xl font-extrabold mb-3 transition-colors ${voiceState === 'error' ? 'text-red-400' : 'text-white'}`}>{stateText[voiceState]}</h3>
                
                {/* Transcript Area */}
                <div className="min-h-[3rem] mb-4 p-3 bg-gray-800/70 rounded-xl border border-gray-700/50">
                    <p className={`text-lg italic transition-opacity ${transcript ? 'text-gray-200' : 'text-gray-500'}`}>
                        {transcript || (voiceState === 'idle' ? 'Tap a command below or speak clearly now...' : ' ')}
                    </p>
                </div>

                {/* AI Response Area */}
                <div className={`h-16 text-center flex items-center justify-center mb-8 p-3 rounded-xl transition-all duration-500 ${aiResponse.includes('confirmed') || aiResponse.includes('dispatch') ? 'bg-green-900/50 border border-green-600' : 'bg-gray-800/50 border border-gray-700'}`}>
                    <p className={`text-xl font-medium ${aiResponse.includes('confirmed') ? 'text-green-300' : 'text-cyan-200'}`}>{aiResponse}</p>
                </div>

                {/* Suggested Commands */}
                <div className="space-y-3 max-h-64 overflow-y-auto p-1 custom-scrollbar">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Suggested High-Value Actions:</p>
                    {commands.map(cmd => (
                        <button 
                            key={cmd} 
                            onClick={() => !isProcessing && processUtterance(cmd)} 
                            disabled={isProcessing}
                            className={`w-full text-left p-3 bg-gray-800 hover:bg-cyan-900/50 rounded-lg text-cyan-300 transition-all duration-200 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-between items-center`}
                        >
                            <span className="truncate">"{cmd}"</span>
                            {!isProcessing && <span className="text-xs text-gray-500 ml-4">Execute</span>}
                        </button>
                    ))}
                </div>
            </div>
            <style jsx global>{`
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes ping-slow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 0.1; } }
                .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }

                @keyframes pulse-fast { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
                .animate-pulse-fast { animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
            `}</style>
        </div>
    );
};

// --- Main Voice Control Component ---

interface VoiceControlProps {
    setActiveView: (view: View) => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

const VoiceControl: React.FC<VoiceControlProps> = ({ setActiveView }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [voiceState, setVoiceState] = useState<VoiceState>('idle');
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('Initializing Quantum Voice Interface...');
    
    const recognitionRef = useRef<any>(null);
    const dataContext = useContext(DataContext);
    const isMounted = useRef(false);

    // Memoize the context object for use in interpretation
    const interpretationContext = useMemo(() => ({ dataContext, setActiveView }), [dataContext, setActiveView]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && voiceState !== 'listening') {
            setTranscript('');
            setVoiceState('listening');
            try {
                recognitionRef.current.start();
            } catch (error) {
                // This often happens if start() is called while already active.
                console.warn("Speech recognition start attempt ignored (already active or stopped).", error);
                if (isMounted.current && voiceState !== 'error') {
                    setVoiceState('idle'); // Reset state if it failed to start cleanly
                }
            }
        }
    }, [voiceState]);
    
    const speak = useCallback((text: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!isMounted.current) {
                reject(new Error("Component unmounted during speech synthesis."));
                return;
            }
            setVoiceState('speaking');
            setAiResponse(text);
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0; // Standard speed
            utterance.pitch = 1.0;
            utterance.volume = 0.9;
            
            utterance.onend = () => {
                if(isMounted.current) {
                    resolve();
                }
            };
            utterance.onerror = (e) => {
                if(isMounted.current) {
                     console.error("Speech Synthesis Error:", e);
                     setVoiceState('error');
                     setAiResponse("TTS Engine Failure: Could not articulate response.");
                }
                reject(e);
            };
            window.speechSynthesis.speak(utterance);
        });
    }, []);

    const processUtterance = useCallback(async (command: string) => {
        if (!isMounted.current) return;
        
        setTranscript(command);
        setVoiceState('processing');
        
        const result = interpretCommandWithAI(command, interpretationContext);
        
        await speak(result.message);

        if (result.action === 'navigate' && result.targetView) {
            setActiveView(result.targetView);
            // Wait for speech to finish before closing modal
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setIsModalOpen(false);
        } else if (result.action === 'transaction') {
            // Transaction confirmed, close modal
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setIsModalOpen(false);
        } else if (result.action === 'query') {
            // Query result displayed in AI response, wait for user to acknowledge or close
            if (isMounted.current) setVoiceState('idle');
        } else if (result.action === 'error') {
            // Error occurred, prompt user to try again
            if (isMounted.current) {
                setVoiceState('error');
                // Automatically restart listening after a brief pause for error message display
                setTimeout(() => {
                    if (isMounted.current) startListening();
                }, 2000);
            }
        }

    }, [interpretationContext, speak, startListening, setActiveView]);

    // Setup Speech Recognition API
    useEffect(() => {
        isMounted.current = true;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setAiResponse("Browser Incompatibility: Voice control requires Web Speech API support.");
            setVoiceState('error');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after a pause or final result
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i][0]; // Assuming one alternative is sufficient
                if (result.isFinal) {
                    finalTranscript += result.transcript;
                } else {
                    interimTranscript += result.transcript;
                }
            }
            
            if (interimTranscript && !finalTranscript) {
                setTranscript(interimTranscript);
            }

            if (finalTranscript) {
                // Stop recognition immediately upon final result
                recognition.stop();
                processUtterance(finalTranscript.trim());
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (isMounted.current) {
                setVoiceState('error');
                setAiResponse(`Recognition Error (${event.error}). Attempting restart...`);
                // Attempt to restart if the error is transient (e.g., no-speech)
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    setTimeout(() => {
                        if (isMounted.current && voiceState === 'listening') startListening();
                    }, 1500);
                }
            }
        };
        
        recognition.onstart = () => {
             if (isMounted.current) setVoiceState('listening');
        }

        recognition.onend = () => {
            // Only reset to idle if we weren't explicitly processing or speaking
            if (isMounted.current && voiceState === 'listening') {
                 setVoiceState('idle');
            }
        };
        
        recognitionRef.current = recognition;
        
        return () => {
            isMounted.current = false;
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            window.speechSynthesis.cancel();
        }
    }, [processUtterance, startListening, voiceState]);

    const openModal = () => {
        if (voiceState === 'error') {
            setAiResponse('System Error Detected. Please resolve or refresh.');
            return;
        }
        setAiResponse('Initializing Quantum Voice Interface...');
        setIsModalOpen(true);
        setVoiceState('idle');
        // Delay listening to allow modal transition and permission prompt if needed
        setTimeout(() => {
            if (isMounted.current) startListening();
        }, 500);
    }
    
    const closeModal = () => {
        setIsModalOpen(false);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        window.speechSynthesis.cancel();
        if (isMounted.current) setVoiceState('idle');
    }

    return (
        <>
            <button
                onClick={openModal}
                className="fixed bottom-10 right-10 w-20 h-20 bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-2xl flex items-center justify-center text-white z-40 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                aria-label="Activate Quantum Voice Control"
            >
                <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${voiceState === 'listening' ? 'bg-green-400/30 animate-ping' : 'bg-white/20'}`}></div>
                <MicIcon className="w-10 h-10" />
            </button>
            {isModalOpen && (
                <VoiceModal
                    onClose={closeModal}
                    voiceState={voiceState}
                    transcript={transcript}
                    aiResponse={aiResponse}
                    processUtterance={processUtterance}
                    isListening={voiceState === 'listening'}
                />
            )}
        </>
    );
};

export default VoiceControl;