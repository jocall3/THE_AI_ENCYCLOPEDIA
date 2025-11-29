import React, { useState, useMemo, CSSProperties, useCallback } from 'react';
import { Cpu, Zap, TrendingUp, ShieldCheck, DollarSign, BookOpen, BarChart3, Settings, User, MessageSquare, LayoutDashboard, Globe, Brain, Lightbulb, Rocket, Infinity, Aperture } from 'lucide-react';

// --- Configuration & Constants for Hyper-Expansion ---

// AI Model Configuration Placeholder (Simulating integration with a massive backend)
const AI_CONFIG = {
    MODEL_NAME: "QuantumFinancialOracle-v9.1",
    LATENCY_MS: 50,
    CONTEXT_DEPTH: 10240,
    SECURITY_LEVEL: "QuantumResistant",
};

// --- SVG Icons as Components (Enhanced & Standardized) ---

const PiggyBankIcon = ({ size = 80, className = '' }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ color: '#E879F9' }}
  >
    <path d="M19.8 12.3c0-1.7-1.4-3.1-3.1-3.1H11V7.1a1 1 0 0 0-2 0v2.1H7.1c-1.7 0-3.1 1.4-3.1 3.1 0 1.5 1 2.7 2.3 3l.3.1c.1 0 .2.1.2.2v.9c0 .6.4 1 1 1h.3c.6 0 1-.4 1-1v-.9c0-.1.1-.2.2-.2l.3-.1c1.3-.3 2.3-1.5 2.3-3Z" />
    <path d="M7.1 12.3H4m15.8 0H18" />
    <path d="M11 9.2V7.1a1 1 0 1 0-2 0v2.1" />
    <path d="M12.4 15.3a3.1 3.1 0 0 0-4.8 0" />
    <path d="M11 3.3a1 1 0 1 0-2 0" />
  </svg>
);

const StarIcon = ({ size = 24, className = '' }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ color: '#FBBF24' }}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const CheckCircleIcon = ({ size = 48, className = '' }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: '#34D399' }}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const XCircleIcon = ({ size = 48, className = '' }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ color: '#F87171' }}>
        <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);

// --- Type Definitions (Expanded for Enterprise Readiness) ---

interface QuizOption {
  id: string;
  text: string;
  aiConfidenceScore?: number; // New AI metric
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  feedback: string;
  aiGeneratedHint?: string; // AI-powered hint system
}

interface Lesson {
  id: string;
  title: string;
  concept: string;
  complexityRating: number; // 1-5 scale
  mascotImage: React.ReactNode;
  quiz: QuizQuestion;
  aiSummary: string; // AI generated summary of the concept
}

interface ModuleState {
    gameState: 'intro' | 'lesson' | 'quiz' | 'feedback' | 'completed' | 'ai_analysis';
    currentLessonIndex: number;
    score: number;
    selectedAnswer: string | null;
    isAnswerCorrect: boolean | null;
    aiFeedbackStatus: 'idle' | 'processing' | 'complete';
}

// --- Educational Content (Massively Expanded and Professionalized) ---

const lessons: Lesson[] = [
  {
    id: 'earning_v2',
    title: 'Module 1: Capital Acquisition & Value Exchange',
    concept: "In the modern economic framework, capital acquisition is the foundational process of generating revenue through the provision of goods or services that possess demonstrable market value. This transcends simple labor; it involves strategic deployment of time, specialized skills, and proprietary assets to create transactional opportunities.",
    complexityRating: 1,
    mascotImage: <DollarSign size={64} className="text-green-600" />,
    aiSummary: "AI Analysis: Earning is the conversion of productive effort into liquid assets. Focus on high-leverage activities.",
    quiz: {
      question: 'Which activity represents the highest leverage in capital acquisition?',
      options: [
        { id: 'a', text: 'Direct hourly labor exchange' },
        { id: 'b', text: 'Developing scalable intellectual property' },
        { id: 'c', text: 'Passive consumption of existing resources' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. Scalable IP allows value creation independent of immediate time input, maximizing return on effort.',
      aiGeneratedHint: "Consider which option allows for exponential scaling without linear input increase."
    },
  },
  {
    id: 'saving_v2',
    title: "Module 2: Asset Preservation and Future Value Hedging",
    concept: 'Saving is the deliberate deferral of current consumption to secure future purchasing power. Advanced saving involves strategic asset allocation designed to hedge against inflation and market volatility, ensuring capital integrity over extended time horizons.',
    complexityRating: 2,
    mascotImage: <PiggyBankIcon size={64} className="text-indigo-500" />,
    aiSummary: "AI Analysis: Saving is not hoarding; it is strategic capital reservation. Implement automated, rule-based transfers to segregated accounts.",
    quiz: {
      question: 'What is the primary risk mitigated by strategic asset preservation?',
      options: [
        { id: 'a', text: 'Opportunity cost of immediate spending' },
        { id: 'b', text: 'Inflationary erosion of principal' },
        { id: 'c', text: 'Transaction fees' },
      ],
      correctAnswerId: 'b',
      feedback: 'Precisely. Inflation is the silent tax on unallocated capital. Preservation strategies aim to maintain real value.',
      aiGeneratedHint: "Think about what happens to the purchasing power of money over a decade."
    },
  },
  {
    id: 'spending_v2',
    title: 'Module 3: Discretionary Expenditure Optimization',
    concept: "Spending decisions must be governed by a rigorous cost-benefit analysis, distinguishing between essential operational requirements ('Needs') and value-additive enhancements ('Wants'). Optimized spending maximizes utility per unit of currency deployed.",
    complexityRating: 1,
    mascotImage: <TrendingUp size={64} className="text-yellow-600" />,
    aiSummary: "AI Analysis: Every expenditure is an investment decision. Prioritize assets that appreciate or generate future utility.",
    quiz: {
      question: 'From a long-term utility perspective, which is a superior expenditure?',
      options: [
        { id: 'a', text: 'A depreciating consumable item' },
        { id: 'b', text: 'A skill acquisition course' },
        { id: 'c', text: 'High-frequency, low-value impulse purchases' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. Investment in human capital (skills) yields the highest long-term ROI.',
      aiGeneratedHint: "Which purchase increases your future earning potential?"
    },
  },
  {
    id: 'budgeting_v2',
    title: 'Module 4: Predictive Financial Modeling (Budgeting)',
    concept: "Budgeting is the implementation of a forward-looking financial model. It requires accurate forecasting of inflows and outflows, establishing dynamic allocation percentages, and incorporating contingency buffers for unforeseen systemic shocks.",
    complexityRating: 3,
    mascotImage: <BarChart3 size={64} className="text-blue-600" />,
    aiSummary: "AI Analysis: A budget is a dynamic simulation. Utilize zero-based budgeting principles for maximum accountability.",
    quiz: {
      question: 'What is the core function of a contingency buffer in a financial model?',
      options: [
        { id: 'a', text: 'To increase immediate spending capacity' },
        { id: 'b', text: 'To absorb variance from unpredictable negative events' },
        { id: 'c', text: 'To fund speculative investments' },
      ],
      correctAnswerId: 'b',
      feedback: 'Affirmative. The buffer ensures operational continuity when actual results deviate negatively from projections.',
      aiGeneratedHint: "This buffer protects the model from unexpected negative deviations."
    },
  },
    {
    id: 'giving_v2',
    title: 'Module 5: Societal Capital Reinvestment (Giving)',
    concept: "Reinvestment into the broader ecosystem, often termed philanthropy or social contribution, is critical for maintaining a stable operating environment. This ensures the longevity of the market structures upon which individual wealth depends.",
    complexityRating: 2,
    mascotImage: <Globe size={64} className="text-purple-600" />,
    aiSummary: "AI Analysis: Strategic giving builds social capital and mitigates systemic risk through community stabilization.",
    quiz: {
      question: 'How does strategic societal reinvestment benefit the individual investor?',
      options: [
        { id: 'a', text: 'It reduces immediate taxable income only.' },
        { id: 'b', text: 'It stabilizes the macro-economic environment.' },
        { id: 'c', text: 'It has no measurable personal benefit.' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. A stable society provides a predictable framework for wealth generation and preservation.',
      aiGeneratedHint: "Think macro-level stability."
    },
  },
  {
    id: 'debt_management',
    title: 'Module 6: Leverage Optimization and Debt Structuring',
    concept: "Debt is a tool for leveraging future earnings. Responsible management requires distinguishing between productive debt (used for asset acquisition that yields returns greater than the interest rate) and consumptive debt.",
    complexityRating: 4,
    mascotImage: <ShieldCheck size={64} className="text-red-500" />,
    aiSummary: "AI Analysis: Productive leverage accelerates growth; consumptive debt accelerates insolvency. Monitor Debt-to-Income ratios rigorously.",
    quiz: {
      question: 'When is debt considered "productive"?',
      options: [
        { id: 'a', text: 'When the interest rate is below 5%.' },
        { id: 'b', text: 'When the asset acquired generates a net positive return exceeding the cost of borrowing.' },
        { id: 'c', text: 'When it is used to purchase a primary residence.' },
      ],
      correctAnswerId: 'b',
      feedback: 'Precisely. The return profile must mathematically outperform the cost of capital.',
      aiGeneratedHint: "Focus on the return on investment (ROI) relative to the borrowing cost."
    },
  },
  {
    id: 'investing_fundamentals',
    title: 'Module 7: Introduction to Compound Growth Mechanics',
    concept: "Compound growth is the eighth wonder of the world. It describes the exponential increase in asset value where returns are reinvested to generate further returns. Understanding the time value of money is paramount.",
    complexityRating: 3,
    mascotImage: <Infinity size={64} className="text-teal-500" />,
    aiSummary: "AI Analysis: Time is the most valuable input in compounding. Early deployment of capital is non-negotiable.",
    quiz: {
      question: 'What is the primary driver of long-term compounding success?',
      options: [
        { id: 'a', text: 'High annual percentage yield (APY)' },
        { id: 'b', text: 'The duration capital remains invested' },
        { id: 'c', text: 'Frequent trading activity' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. While APY matters, the sheer duration allows the compounding effect to reach critical mass.',
      aiGeneratedHint: "Which factor is mathematically the exponent in the compound interest formula?"
    },
  },
];

// --- AI Simulation Service ---

/**
 * Simulates a high-latency, complex AI analysis call.
 * In a real system, this would be an API call to the QuantumFinancialOracle.
 */
const useAISimulation = () => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
    const [result, setResult] = useState<string | null>(null);

    const runAnalysis = useCallback(async (topic: string, context: string) => {
        setStatus('processing');
        setResult(null);
        
        // Simulate network latency and complex computation
        await new Promise(resolve => setTimeout(resolve, AI_CONFIG.LATENCY_MS * 5 + 500)); 

        const simulatedOutput = `[${AI_CONFIG.MODEL_NAME} Analysis]: Based on ${context.length} tokens of input regarding '${topic}', the system projects a ${Math.floor(Math.random() * 50 + 50)}% confidence interval on the core principle. Key insight: ${topic} requires dynamic adaptation, not static adherence.`;
        
        setResult(simulatedOutput);
        setStatus('complete');
    }, []);

    return { runAnalysis, result, status };
};


// --- Main Component ---

const FinancialLiteracyModule: React.FC = () => {
    const [state, setState] = useState<ModuleState>({
        gameState: 'intro',
        currentLessonIndex: 0,
        score: 0,
        selectedAnswer: null,
        isAnswerCorrect: null,
        aiFeedbackStatus: 'idle',
    });

    const { runAnalysis, result: aiResult, status: aiStatus } = useAISimulation();

    const currentLesson = lessons[state.currentLessonIndex];
    const totalLessons = lessons.length;

    const progressPercentage = useMemo(() => {
        if (state.gameState === 'completed') return 100;
        return ((state.currentLessonIndex + (state.gameState === 'lesson' || state.gameState === 'quiz' || state.gameState === 'feedback' ? 0.5 : 0)) / totalLessons) * 100;
    }, [state.currentLessonIndex, totalLessons, state.gameState]);

    // --- State Handlers ---

    const handleStartModule = useCallback(() => {
        setState(prev => ({ ...prev, gameState: 'lesson' }));
    }, []);
    
    const handleStartQuiz = useCallback(() => {
        setState(prev => ({ 
            ...prev, 
            gameState: 'quiz', 
            selectedAnswer: null, 
            isAnswerCorrect: null,
            aiFeedbackStatus: 'idle'
        }));
    }, []);

    const handleSelectAnswer = useCallback((optionId: string) => {
        if (state.gameState === 'quiz') {
            setState(prev => ({ ...prev, selectedAnswer: optionId }));
        }
    }, [state.gameState]);
    
    const handleSubmitAnswer = useCallback(() => {
        if (!state.selectedAnswer) return;

        const correct = state.selectedAnswer === currentLesson.quiz.correctAnswerId;
        
        setState(prev => ({ 
            ...prev, 
            isAnswerCorrect: correct,
            score: correct ? prev.score + (currentLesson.complexityRating * 100) : prev.score, // Score scales with complexity
            gameState: 'feedback'
        }));
        
        // Trigger AI analysis on submission
        runAnalysis(currentLesson.title, currentLesson.concept);

    }, [state.selectedAnswer, currentLesson, runAnalysis]);
    
    const handleNext = useCallback(() => {
        if (state.currentLessonIndex < totalLessons - 1) {
            setState(prev => ({ 
                ...prev, 
                currentLessonIndex: prev.currentLessonIndex + 1, 
                gameState: 'lesson' 
            }));
        } else {
            setState(prev => ({ ...prev, gameState: 'completed' }));
        }
    }, [state.currentLessonIndex, totalLessons]);

    const handleRestart = useCallback(() => {
        setState({
            gameState: 'intro',
            currentLessonIndex: 0,
            score: 0,
            selectedAnswer: null,
            isAnswerCorrect: null,
            aiFeedbackStatus: 'idle',
        });
    }, []);

    const handleViewAIAnalysis = useCallback(() => {
        if (aiStatus === 'complete' && aiResult) {
            setState(prev => ({ ...prev, gameState: 'ai_analysis' }));
        }
    }, [aiStatus, aiResult]);

    // --- Render Functions ---

    const renderHeader = () => (
        <div style={styles.header}>
            <div style={styles.headerSection}>
                <Brain size={20} style={{ marginRight: 5 }} />
                <span style={styles.score}>Score: {state.score}</span>
            </div>
            <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }}></div>
            </div>
            <div style={styles.headerSection}>
                <span style={styles.progressText}>{state.gameState === 'completed' ? totalLessons : state.currentLessonIndex + 1} / {totalLessons}</span>
            </div>
        </div>
    );

    const renderIntro = () => (
        <div style={styles.card}>
            <Aperture size={64} className="text-fuchsia-600 mb-4" />
            <h1 style={styles.title}>Enterprise Financial Literacy Protocol Initialization</h1>
            <div style={{ width: '100%', textAlign: 'left', color: '#333' }}>
                <p style={{...styles.text, marginBottom: '1rem', fontSize: '1.1rem'}}>
                    Welcome to the foundational training matrix for the IDGAF Financial Operating System (IDGAF-FOS). This module is engineered to instill core principles of capital management, essential for all stakeholders operating within the next-generation economic architecture.
                </p>
                <div style={{...styles.alertBox, borderColor: '#6D28D9'}}>
                    <Lightbulb size={20} className="mr-2 text-purple-600 flex-shrink-0" />
                    <p style={{...styles.text, margin: 0, fontSize: '0.95rem', fontWeight: '600'}}>
                        System Mandate: Mastery of these principles is non-negotiable for access to advanced trading algorithms and decentralized governance participation.
                    </p>
                </div>
                <p style={{...styles.text, marginTop: '1rem', fontSize: '1rem'}}>
                    Proceed to initiate the core curriculum sequence.
                </p>
            </div>
            <button style={styles.buttonPrimary} onClick={handleStartModule}>
                <Rocket size={20} style={{ marginRight: 8 }} />
                Initiate Protocol Sequence
            </button>
        </div>
    );

    const renderLesson = () => (
        <div style={styles.card}>
            <h2 style={styles.lessonTitle}>{currentLesson.title}</h2>
            <div style={styles.mascotContainer}>
                {currentLesson.mascotImage}
            </div>
            <p style={{...styles.text, fontSize: '1.2rem', color: '#374151'}}>{currentLesson.concept}</p>
            
            <div style={{...styles.aiSummaryBox, borderColor: '#10B981'}}>
                <Cpu size={20} className="text-green-600 mr-2" />
                <p style={{...styles.text, margin: 0, fontSize: '0.9rem', fontWeight: '500'}}>{currentLesson.aiSummary}</p>
            </div>

            <div style={styles.complexityIndicator}>
                Complexity Rating: {Array(currentLesson.complexityRating).fill(0).map((_, i) => <StarIcon key={i} size={18} />)}
            </div>

            <button style={styles.buttonPrimary} onClick={handleStartQuiz}>
                <Zap size={20} style={{ marginRight: 8 }} />
                Execute Knowledge Validation Test
            </button>
        </div>
    );

    const renderQuiz = () => (
        <div style={styles.card}>
            <h3 style={styles.quizQuestion}>{currentLesson.quiz.question}</h3>
            <div style={styles.optionsContainer}>
                {currentLesson.quiz.options.map(option => (
                    <button
                        key={option.id}
                        style={{...styles.optionButton, ...(state.selectedAnswer === option.id ? styles.optionButtonSelected : {})}}
                        onClick={() => handleSelectAnswer(option.id)}
                        disabled={aiStatus === 'processing'}
                    >
                        <span style={{fontWeight: 'bold', marginRight: 10}}>{option.id.toUpperCase()}.</span>
                        {option.text}
                    </button>
                ))}
            </div>
            <button 
                style={styles.buttonPrimary}
                onClick={handleSubmitAnswer}
                disabled={!state.selectedAnswer || aiStatus === 'processing'}
            >
                {aiStatus === 'processing' ? (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Cpu size={18} className="animate-spin mr-2" />
                        Analyzing...
                    </div>
                ) : (
                    'Submit for Validation'
                )}
            </button>
        </div>
    );

    const renderFeedback = () => {
        const isCorrect = state.isAnswerCorrect === true;
        const bgColor = isCorrect ? '#ECFDF5' : '#FEF2F2';
        const iconColor = isCorrect ? '#10B981' : '#EF4444';
        const titleColor = isCorrect ? '#065F46' : '#B91C1C';

        return (
            <div style={{ ...styles.card, backgroundColor: bgColor }}>
                {isCorrect ? <CheckCircleIcon size={64} style={{ color: iconColor }} /> : <XCircleIcon size={64} style={{ color: iconColor }} />}
                <h2 style={{...styles.title, color: titleColor, fontSize: '2rem' }}>
                    {isCorrect ? 'Validation Successful' : 'Validation Failed'}
                </h2>
                <p style={{...styles.text, color: '#4B5563'}}>
                    {isCorrect ? currentLesson.quiz.feedback : 'Re-evaluate the core concept. The system detected a deviation from established financial axioms.'}
                </p>

                {aiStatus === 'processing' && (
                    <div style={styles.aiProcessingBox}>
                        <Zap size={24} className="animate-pulse text-fuchsia-500 mr-3" />
                        <p>Engaging Quantum Oracle for Post-Mortem Analysis...</p>
                    </div>
                )}

                {aiStatus === 'complete' && aiResult && (
                    <div style={{...styles.aiResultBox, borderLeftColor: isCorrect ? '#34D399' : '#F87171'}}>
                        <h4 style={{margin: '0 0 5px 0', color: '#1F2937'}}>AI Post-Validation Report:</h4>
                        <p style={{...styles.text, margin: 0, fontSize: '0.85rem', lineHeight: '1.4'}}>{aiResult}</p>
                        <button 
                            style={styles.buttonAIView} 
                            onClick={handleViewAIAnalysis}
                        >
                            <MessageSquare size={16} style={{marginRight: 5}} /> View Full Context Log
                        </button>
                    </div>
                )}

                <button style={{...styles.buttonPrimary, backgroundColor: isCorrect ? '#059669' : '#F59E0B'}} onClick={handleNext}>
                    {state.currentLessonIndex < totalLessons - 1 ? 'Advance to Next Module' : 'Finalize Curriculum'}
                </button>
            </div>
        );
    };

    const renderAIAnalysisScreen = () => {
        if (!currentLesson || !aiResult) return renderContent(); // Fallback

        return (
            <div style={styles.card}>
                <h1 style={styles.title}>AI Deep Dive: {currentLesson.title}</h1>
                <div style={{...styles.aiResultBox, width: '100%', padding: '20px', border: '2px solid #A855F7', backgroundColor: '#F3F4F6'}}>
                    <h4 style={{margin: '0 0 10px 0', color: '#6B21A8', display: 'flex', alignItems: 'center'}}><Brain size={20} style={{marginRight: 10}} /> Oracle Output Log</h4>
                    <pre style={styles.aiLogText}>{aiResult}</pre>
                </div>
                <p style={{...styles.text, fontSize: '0.9rem', color: '#6B21A8'}}>
                    Hint Provided: {currentLesson.quiz.aiGeneratedHint}
                </p>
                <button style={styles.buttonPrimary} onClick={() => setState(prev => ({ ...prev, gameState: 'feedback' }))}>
                    Return to Validation Summary
                </button>
            </div>
        );
    };


    const renderCompletion = () => (
        <div style={styles.card}>
            <h1 style={styles.title}>Curriculum Finalized</h1>
            <div style={styles.badge}>
                <Infinity size={60} className="text-white" />
                <span style={styles.badgeText}>IDGAF-FOS Certified</span>
            </div>
            <p style={styles.text}>All foundational economic axioms have been integrated into your operational profile.</p>
            <p style={styles.scoreText}>Final Proficiency Index: {state.score} Points</p>
            <button style={styles.buttonPrimary} onClick={handleRestart}>
                <Settings size={20} style={{ marginRight: 8 }} />
                Re-Initialize Training Matrix
            </button>
        </div>
    );

    const renderContent = () => {
        switch (state.gameState) {
            case 'intro': return renderIntro();
            case 'lesson': return renderLesson();
            case 'quiz': return renderQuiz();
            case 'feedback': return renderFeedback();
            case 'ai_analysis': return renderAIAnalysisScreen();
            case 'completed': return renderCompletion();
            default: return renderIntro();
        }
    };
    
    return (
        <div style={styles.container}>
            <div style={styles.moduleWrapper}>
                {renderHeader()}
                <div style={{padding: '20px'}}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};


// --- Styles (Massively Expanded and Professionalized) ---

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#111827', // Dark background for enterprise feel
        fontFamily: "'Inter', sans-serif",
        padding: '20px',
    },
    moduleWrapper: {
        width: '100%',
        maxWidth: '700px', // Wider for more content
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        border: '3px solid #4B5563',
    },
    header: {
        padding: '15px 25px',
        backgroundColor: '#1F2937', // Dark header
        color: '#D1D5DB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #374151',
    },
    headerSection: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.95rem',
        fontWeight: '500',
    },
    score: {
        fontWeight: 'bold',
        color: '#34D399', // Green for score
    },
    progressText: {
        fontWeight: 'bold',
        color: '#9CA3AF',
    },
    progressBarContainer: {
        flex: 1,
        height: '10px',
        backgroundColor: '#374151',
        borderRadius: '5px',
        margin: '0 20px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#A855F7', // Primary brand color for progress
        borderRadius: '5px',
        transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    card: {
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.2rem',
        color: '#1F2937',
        marginBottom: '25px',
        fontWeight: 800,
    },
    lessonTitle: {
        fontSize: '1.8rem',
        color: '#4B5563',
        marginBottom: '15px',
        fontWeight: 700,
    },
    text: {
        fontSize: '1.1rem',
        color: '#4B5563',
        lineHeight: '1.65',
        marginBottom: '25px',
        maxWidth: '100%',
    },
    mascotContainer: {
        margin: '25px 0',
        padding: '15px',
        backgroundColor: '#F3F4F6',
        borderRadius: '50%',
        border: '3px solid #D1D5DB',
    },
    buttonPrimary: {
        padding: '14px 30px',
        fontSize: '1.15rem',
        fontWeight: '600',
        color: 'white',
        backgroundColor: '#6D28D9', // Deep Purple
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.3s',
        boxShadow: '0 6px 15px rgba(109, 40, 217, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quizQuestion: {
        fontSize: '1.6rem',
        color: '#1F2937',
        marginBottom: '30px',
        fontWeight: 700,
    },
    optionsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '35px',
    },
    optionButton: {
        padding: '16px',
        fontSize: '1.05rem',
        backgroundColor: '#F9FAFB',
        border: '2px solid #E5E7EB',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        width: '100%',
        color: '#374151',
        fontWeight: '500',
    },
    optionButtonSelected: {
        backgroundColor: '#EDE9FE',
        borderColor: '#8B5CF6',
        color: '#4C1D95',
        boxShadow: '0 0 0 3px #C4B5FD',
    },
    badge: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6D28D9',
        borderRadius: '12px',
        width: '180px',
        height: '180px',
        color: 'white',
        boxShadow: '0 0 0 15px #A855F7, 0 10px 30px rgba(0,0,0,0.3)',
        marginBottom: '25px',
    },
    badgeText: {
        fontWeight: 'bold',
        marginTop: '10px',
        fontSize: '1.1rem',
        textAlign: 'center',
    },
    scoreText: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#10B981',
        margin: '15px 0 30px 0',
    },
    // New Styles for Enterprise Features
    alertBox: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        border: '1px solid',
        borderRadius: '8px',
        backgroundColor: '#F3F4F6',
        marginBottom: '20px',
    },
    aiSummaryBox: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        borderLeft: '5px solid',
        borderRadius: '4px',
        backgroundColor: '#F0FDF4',
        marginBottom: '20px',
        width: '100%',
    },
    complexityIndicator: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        color: '#6B7280',
        fontSize: '0.9rem',
    },
    aiProcessingBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px',
        backgroundColor: '#F3E8FF',
        border: '1px dashed #A855F7',
        borderRadius: '8px',
        marginBottom: '20px',
        width: '100%',
        color: '#6B21A8',
        fontWeight: '600',
    },
    aiResultBox: {
        padding: '15px',
        borderLeft: '4px solid',
        borderRadius: '4px',
        marginBottom: '20px',
        width: '100%',
        backgroundColor: '#F9FAFB',
    },
    aiLogText: {
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
        backgroundColor: '#1F2937',
        color: '#34D399',
        padding: '15px',
        borderRadius: '6px',
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #374151',
    },
    buttonAIView: {
        marginTop: '10px',
        padding: '8px 15px',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#4C1D95',
        backgroundColor: '#E0F2F1',
        border: '1px solid #A855F7',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
    }
};

export default FinancialLiteracyModule;