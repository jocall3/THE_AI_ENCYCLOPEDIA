import React, { useState, useMemo, CSSProperties, useCallback } from 'react';
import { Cpu, Zap, TrendingUp, ShieldCheck, DollarSign, BookOpen, BarChart3, Settings, User, MessageSquare, LayoutDashboard, Globe, Brain, Lightbulb, Rocket, Infinity, Aperture } from 'lucide-react';

// --- Basic Configuration ---

const AI_CONFIG = {
    MODEL_NAME: "FinLit-Assistant-v1",
    LATENCY_MS: 50,
    CONTEXT_DEPTH: 1024,
    SECURITY_LEVEL: "Standard",
};

// --- Icons ---

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

// --- Types ---

interface QuizOption {
  id: string;
  text: string;
  aiConfidenceScore?: number;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  feedback: string;
  aiGeneratedHint?: string;
}

interface Lesson {
  id: string;
  title: string;
  concept: string;
  complexityRating: number;
  mascotImage: React.ReactNode;
  quiz: QuizQuestion;
  aiSummary: string;
}

interface ModuleState {
    gameState: 'intro' | 'lesson' | 'quiz' | 'feedback' | 'completed' | 'ai_analysis';
    currentLessonIndex: number;
    score: number;
    selectedAnswer: string | null;
    isAnswerCorrect: boolean | null;
    aiFeedbackStatus: 'idle' | 'processing' | 'complete';
}

// --- Lesson Content ---

const lessons: Lesson[] = [
  {
    id: 'earning',
    title: 'Module 1: Earning Money',
    concept: "Earning is the process of receiving money in exchange for work, services, or products. It is the foundation of personal finance. To increase earnings, one can acquire new skills, work more hours, or create value that others are willing to pay for.",
    complexityRating: 1,
    mascotImage: <DollarSign size={64} className="text-green-600" />,
    aiSummary: "Key Takeaway: Focus on skills and value creation to maximize your earning potential.",
    quiz: {
      question: 'Which is the most effective way to increase long-term earnings?',
      options: [
        { id: 'a', text: 'Working more hours at the same rate' },
        { id: 'b', text: 'Learning new, high-demand skills' },
        { id: 'c', text: 'Waiting for a raise' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. Improving your skills increases the value of your time and work.',
      aiGeneratedHint: "Think about what makes an hour of work more valuable."
    },
  },
  {
    id: 'saving',
    title: "Module 2: Saving for the Future",
    concept: 'Saving means setting aside money today for use in the future. It provides a safety net for emergencies and enables you to make larger purchases later. A good habit is to "pay yourself first" by saving a portion of income immediately.',
    complexityRating: 2,
    mascotImage: <PiggyBankIcon size={64} className="text-indigo-500" />,
    aiSummary: "Key Takeaway: Consistent saving builds financial security and future opportunities.",
    quiz: {
      question: 'Why is it important to have an emergency fund?',
      options: [
        { id: 'a', text: 'To buy things on impulse' },
        { id: 'b', text: 'To cover unexpected expenses without debt' },
        { id: 'c', text: 'To avoid paying taxes' },
      ],
      correctAnswerId: 'b',
      feedback: 'Exactly. An emergency fund protects you from unforeseen financial shocks.',
      aiGeneratedHint: "Consider what happens when a car breaks down or a medical bill arrives."
    },
  },
  {
    id: 'spending',
    title: 'Module 3: Smart Spending',
    concept: "Smart spending involves distinguishing between 'needs' (essentials like food and shelter) and 'wants' (luxuries). It requires making conscious choices to ensure your spending aligns with your values and financial goals.",
    complexityRating: 1,
    mascotImage: <TrendingUp size={64} className="text-yellow-600" />,
    aiSummary: "Key Takeaway: Prioritize needs over wants to maintain financial health.",
    quiz: {
      question: 'Which of the following is considered a "need"?',
      options: [
        { id: 'a', text: 'The latest smartphone model' },
        { id: 'b', text: 'Groceries for the week' },
        { id: 'c', text: 'A subscription to a streaming service' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. Basic nutrition is essential for survival and health.',
      aiGeneratedHint: "Identify the item necessary for daily living."
    },
  },
  {
    id: 'budgeting',
    title: 'Module 4: Budgeting Basics',
    concept: "A budget is a plan for your money. It tracks income and expenses to ensure you don't spend more than you earn. A simple rule is 50/30/20: 50% for needs, 30% for wants, and 20% for savings.",
    complexityRating: 3,
    mascotImage: <BarChart3 size={64} className="text-blue-600" />,
    aiSummary: "Key Takeaway: A budget gives you control over your money rather than wondering where it went.",
    quiz: {
      question: 'What is the primary purpose of a budget?',
      options: [
        { id: 'a', text: 'To restrict you from having fun' },
        { id: 'b', text: 'To track and plan financial flows' },
        { id: 'c', text: 'To increase your credit score automatically' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. A budget is a tool for awareness and planning.',
      aiGeneratedHint: "It acts as a roadmap for your finances."
    },
  },
    {
    id: 'giving',
    title: 'Module 5: Giving Back',
    concept: "Giving back, or philanthropy, involves using your resources to help others. This can be through donating money, time, or skills. It strengthens communities and provides a sense of purpose.",
    complexityRating: 2,
    mascotImage: <Globe size={64} className="text-purple-600" />,
    aiSummary: "Key Takeaway: Generosity supports the community and enhances personal well-being.",
    quiz: {
      question: 'How does giving back benefit the community?',
      options: [
        { id: 'a', text: 'It reduces the taxes of the donor only.' },
        { id: 'b', text: 'It supports essential services and helps those in need.' },
        { id: 'c', text: 'It has no real impact.' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. Charitable contributions support vital community structures.',
      aiGeneratedHint: "Think about the direct impact on recipients."
    },
  },
  {
    id: 'debt',
    title: 'Module 6: Understanding Debt',
    concept: "Debt is money borrowed that must be paid back, usually with interest. 'Good debt' (like a mortgage or student loan) can help build wealth or skills. 'Bad debt' (like high-interest credit cards) drains wealth.",
    complexityRating: 4,
    mascotImage: <ShieldCheck size={64} className="text-red-500" />,
    aiSummary: "Key Takeaway: Manage debt carefully. Avoid high-interest debt whenever possible.",
    quiz: {
      question: 'Which is an example of potentially "good debt"?',
      options: [
        { id: 'a', text: 'A loan for a vacation' },
        { id: 'b', text: 'A student loan for a degree with high earning potential' },
        { id: 'c', text: 'Credit card debt for clothes' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. Education is an investment that can yield higher future returns.',
      aiGeneratedHint: "Look for the option that increases future value."
    },
  },
  {
    id: 'investing',
    title: 'Module 7: Investing & Growth',
    concept: "Investing is putting money to work to grow over time. Through compound interest, your money earns interest on itself. Starting early allows more time for your investments to grow exponentially.",
    complexityRating: 3,
    mascotImage: <Infinity size={64} className="text-teal-500" />,
    aiSummary: "Key Takeaway: Time is your best friend in investing. Start as early as you can.",
    quiz: {
      question: 'What is the most powerful factor in compound interest?',
      options: [
        { id: 'a', text: 'The amount of money you start with' },
        { id: 'b', text: 'Time' },
        { id: 'c', text: 'Picking the perfect stock' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct. The longer money is invested, the more it compounds.',
      aiGeneratedHint: "Which variable allows growth to accelerate over decades?"
    },
  },
];

// --- AI Service ---

const useAISimulation = () => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
    const [result, setResult] = useState<string | null>(null);

    const runAnalysis = useCallback(async (topic: string, context: string) => {
        setStatus('processing');
        setResult(null);
        
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        const simulatedOutput = `[${AI_CONFIG.MODEL_NAME}]: Analysis of '${topic}' complete. The core concept is sound. Remember that ${topic.toLowerCase()} requires consistency and discipline for best results.`;
        
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

    // --- Handlers ---

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
            score: correct ? prev.score + (currentLesson.complexityRating * 100) : prev.score,
            gameState: 'feedback'
        }));
        
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

    // --- Renderers ---

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
            <h1 style={styles.title}>Financial Literacy Module</h1>
            <div style={{ width: '100%', textAlign: 'left', color: '#333' }}>
                <p style={{...styles.text, marginBottom: '1rem', fontSize: '1.1rem'}}>
                    Welcome to the Financial Literacy training. This module is designed to teach the core principles of money management, essential for building a secure financial future.
                </p>
                <div style={{...styles.alertBox, borderColor: '#6D28D9'}}>
                    <Lightbulb size={20} className="mr-2 text-purple-600 flex-shrink-0" />
                    <p style={{...styles.text, margin: 0, fontSize: '0.95rem', fontWeight: '600'}}>
                        Goal: Master these principles to make informed financial decisions.
                    </p>
                </div>
                <p style={{...styles.text, marginTop: '1rem', fontSize: '1rem'}}>
                    Click below to begin the lessons.
                </p>
            </div>
            <button style={styles.buttonPrimary} onClick={handleStartModule}>
                <Rocket size={20} style={{ marginRight: 8 }} />
                Start Training
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
                Difficulty: {Array(currentLesson.complexityRating).fill(0).map((_, i) => <StarIcon key={i} size={18} />)}
            </div>

            <button style={styles.buttonPrimary} onClick={handleStartQuiz}>
                <Zap size={20} style={{ marginRight: 8 }} />
                Take Quiz
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
                        Processing...
                    </div>
                ) : (
                    'Submit Answer'
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
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                </h2>
                <p style={{...styles.text, color: '#4B5563'}}>
                    {isCorrect ? currentLesson.quiz.feedback : 'Review the concept and try again next time.'}
                </p>

                {aiStatus === 'processing' && (
                    <div style={styles.aiProcessingBox}>
                        <Zap size={24} className="animate-pulse text-fuchsia-500 mr-3" />
                        <p>Generating AI Feedback...</p>
                    </div>
                )}

                {aiStatus === 'complete' && aiResult && (
                    <div style={{...styles.aiResultBox, borderLeftColor: isCorrect ? '#34D399' : '#F87171'}}>
                        <h4 style={{margin: '0 0 5px 0', color: '#1F2937'}}>AI Feedback:</h4>
                        <p style={{...styles.text, margin: 0, fontSize: '0.85rem', lineHeight: '1.4'}}>{aiResult}</p>
                        <button 
                            style={styles.buttonAIView} 
                            onClick={handleViewAIAnalysis}
                        >
                            <MessageSquare size={16} style={{marginRight: 5}} /> View Details
                        </button>
                    </div>
                )}

                <button style={{...styles.buttonPrimary, backgroundColor: isCorrect ? '#059669' : '#F59E0B'}} onClick={handleNext}>
                    {state.currentLessonIndex < totalLessons - 1 ? 'Next Lesson' : 'Finish Module'}
                </button>
            </div>
        );
    };

    const renderAIAnalysisScreen = () => {
        if (!currentLesson || !aiResult) return renderContent();

        return (
            <div style={styles.card}>
                <h1 style={styles.title}>AI Insight: {currentLesson.title}</h1>
                <div style={{...styles.aiResultBox, width: '100%', padding: '20px', border: '2px solid #A855F7', backgroundColor: '#F3F4F6'}}>
                    <h4 style={{margin: '0 0 10px 0', color: '#6B21A8', display: 'flex', alignItems: 'center'}}><Brain size={20} style={{marginRight: 10}} /> Analysis Log</h4>
                    <pre style={styles.aiLogText}>{aiResult}</pre>
                </div>
                <p style={{...styles.text, fontSize: '0.9rem', color: '#6B21A8'}}>
                    Hint: {currentLesson.quiz.aiGeneratedHint}
                </p>
                <button style={styles.buttonPrimary} onClick={() => setState(prev => ({ ...prev, gameState: 'feedback' }))}>
                    Back to Feedback
                </button>
            </div>
        );
    };


    const renderCompletion = () => (
        <div style={styles.card}>
            <h1 style={styles.title}>Module Completed</h1>
            <div style={styles.badge}>
                <Infinity size={60} className="text-white" />
                <span style={styles.badgeText}>Certified</span>
            </div>
            <p style={styles.text}>You have completed the financial literacy training.</p>
            <p style={styles.scoreText}>Final Score: {state.score} Points</p>
            <button style={styles.buttonPrimary} onClick={handleRestart}>
                <Settings size={20} style={{ marginRight: 8 }} />
                Restart Training
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


// --- Styles ---

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#111827',
        fontFamily: "'Inter', sans-serif",
        padding: '20px',
    },
    moduleWrapper: {
        width: '100%',
        maxWidth: '700px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        border: '3px solid #4B5563',
    },
    header: {
        padding: '15px 25px',
        backgroundColor: '#1F2937',
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
        color: '#34D399',
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
        backgroundColor: '#A855F7',
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
        backgroundColor: '#6D28D9',
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