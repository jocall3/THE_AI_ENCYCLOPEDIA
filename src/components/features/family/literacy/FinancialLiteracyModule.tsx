import React, { useState, useMemo, CSSProperties } from 'react';

// --- SVG Icons as Components ---

const PiggyBankIcon = ({ size = 80 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: '#E879F9' }}
  >
    <path d="M19.8 12.3c0-1.7-1.4-3.1-3.1-3.1H11V7.1a1 1 0 0 0-2 0v2.1H7.1c-1.7 0-3.1 1.4-3.1 3.1 0 1.5 1 2.7 2.3 3l.3.1c.1 0 .2.1.2.2v.9c0 .6.4 1 1 1h.3c.6 0 1-.4 1-1v-.9c0-.1.1-.2.2-.2l.3-.1c1.3-.3 2.3-1.5 2.3-3Z" />
    <path d="M7.1 12.3H4m15.8 0H18" />
    <path d="M11 9.2V7.1a1 1 0 1 0-2 0v2.1" />
    <path d="M12.4 15.3a3.1 3.1 0 0 0-4.8 0" />
    <path d="M11 3.3a1 1 0 1 0-2 0" />
  </svg>
);

const StarIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FBBF24' }}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const CheckCircleIcon = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#34D399' }}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const XCircleIcon = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#F87171' }}>
        <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);

// --- Type Definitions ---

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  feedback: string;
}

interface Lesson {
  id: string;
  title: string;
  concept: string;
  mascotImage: React.ReactNode;
  quiz: QuizQuestion;
}

// --- Educational Content ---

const lessons: Lesson[] = [
  {
    id: 'earning',
    title: 'Earning: Where Money Comes From',
    concept: "Money doesn't grow on trees! People earn money by working at jobs, doing chores, or receiving it as a gift. It's the reward for your hard work and time.",
    mascotImage: <span style={{fontSize: '4rem'}}>💼</span>,
    quiz: {
      question: 'Which of these is a way to earn money?',
      options: [
        { id: 'a', text: 'Watching TV' },
        { id: 'b', text: 'Helping with chores' },
        { id: 'c', text: 'Playing with toys' },
      ],
      correctAnswerId: 'b',
      feedback: 'That\'s right! Helping out with chores like washing the dishes or walking the dog is a great way to earn an allowance.'
    },
  },
  {
    id: 'saving',
    title: "Saving: Your Piggy Bank's Superpower",
    concept: 'Saving means putting money aside for later. It’s like charging up a superpower! The more you save, the more power you have to buy something bigger you really want in the future, like a new bike or a video game.',
    mascotImage: <PiggyBankIcon />,
    quiz: {
      question: 'Why is it a good idea to save money?',
      options: [
        { id: 'a', text: 'To buy something big later' },
        { id: 'b', text: 'So you can lose it' },
        { id: 'c', text: 'To give it all away immediately' },
      ],
      correctAnswerId: 'a',
      feedback: 'Exactly! Saving helps you reach your bigger goals by collecting small amounts of money over time.'
    },
  },
  {
    id: 'spending',
    title: 'Spending: Needs vs. Wants',
    concept: "When we spend, we choose between 'needs' and 'wants'. A 'need' is something you must have to live, like food and a home. A 'want' is something you'd like to have but can live without, like a new toy.",
    mascotImage: <span style={{fontSize: '4rem'}}>🥕</span>,
    quiz: {
      question: 'Which of these is a "need"?',
      options: [
        { id: 'a', text: 'A new video game' },
        { id: 'b', text: 'A box of candy' },
        { id: 'c', text: 'A healthy lunch' },
      ],
      correctAnswerId: 'c',
      feedback: 'You got it! A healthy lunch is a need because your body needs food to have energy and stay healthy. Video games and candy are wants.'
    },
  },
  {
    id: 'budgeting',
    title: 'Budgeting: Being a Money Boss',
    concept: "A budget is a plan for your money. It helps you decide how much to spend, how much to save, and how much to share. Being the boss of your money is a very smart thing to do!",
    mascotImage: <span style={{fontSize: '4rem'}}>📊</span>,
    quiz: {
      question: 'What is a budget?',
      options: [
        { id: 'a', text: 'A type of backpack' },
        { id: 'b', text: 'A plan for your money' },
        { id: 'c', 'text': 'A shopping list' },
      ],
      correctAnswerId: 'b',
      feedback: 'Correct! A budget is a plan that helps you make smart choices with your money.'
    },
  },
    {
    id: 'giving',
    title: 'Giving: Sharing Makes the World Better',
    concept: "Giving, or charity, is about sharing some of what you have to help others. It can be money, time, or even old toys. It feels good to help and makes our communities stronger.",
    mascotImage: <span style={{fontSize: '4rem'}}>💖</span>,
    quiz: {
      question: 'Which of these is an example of giving?',
      options: [
        { id: 'a', text: 'Keeping all your toys' },
        { id: 'b', text: 'Buying a new game for yourself' },
        { id: 'c', text: 'Donating old books to a library' },
      ],
      correctAnswerId: 'c',
      feedback: 'Wonderful! Donating old books is a fantastic way to give. It lets other kids enjoy stories you\'ve already loved.'
    },
  },
];

// --- Main Component ---

const FinancialLiteracyModule: React.FC = () => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'intro' | 'lesson' | 'quiz' | 'feedback' | 'completed'>('intro');
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

    const currentLesson = lessons[currentLessonIndex];
    const totalLessons = lessons.length;

    const progressPercentage = useMemo(() => {
        if (gameState === 'completed') return 100;
        return (currentLessonIndex / totalLessons) * 100;
    }, [currentLessonIndex, totalLessons, gameState]);

    const handleStartModule = () => setGameState('lesson');
    
    const handleStartQuiz = () => {
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setGameState('quiz');
    };

    const handleSelectAnswer = (optionId: string) => {
        if (gameState === 'quiz') {
            setSelectedAnswer(optionId);
        }
    };
    
    const handleSubmitAnswer = () => {
        if (!selectedAnswer) return;

        const correct = selectedAnswer === currentLesson.quiz.correctAnswerId;
        setIsAnswerCorrect(correct);
        if (correct) {
            setScore(prev => prev + 100);
        }
        setGameState('feedback');
    };
    
    const handleNext = () => {
        if (currentLessonIndex < totalLessons - 1) {
            setCurrentLessonIndex(prev => prev + 1);
            setGameState('lesson');
        } else {
            setGameState('completed');
        }
    };

    const handleRestart = () => {
        setCurrentLessonIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setGameState('intro');
    };

    const renderIntro = () => (
        <div style={styles.card}>
            <h1 style={styles.title}>Welcome to Money Town!</h1>
            <PiggyBankIcon size={120} />
            <p style={styles.text}>Are you ready to become a money whiz? Let's learn about earning, saving, and spending in a fun way!</p>
            <button style={styles.buttonPrimary} onClick={handleStartModule}>Let's Go!</button>
        </div>
    );

    const renderLesson = () => (
        <div style={styles.card}>
            <h2 style={styles.lessonTitle}>{currentLesson.title}</h2>
            <div style={styles.mascotContainer}>{currentLesson.mascotImage}</div>
            <p style={styles.text}>{currentLesson.concept}</p>
            <button style={styles.buttonPrimary} onClick={handleStartQuiz}>Take Quiz!</button>
        </div>
    );

    const renderQuiz = () => (
        <div style={styles.card}>
            <h3 style={styles.quizQuestion}>{currentLesson.quiz.question}</h3>
            <div style={styles.optionsContainer}>
                {currentLesson.quiz.options.map(option => (
                    <button
                        key={option.id}
                        style={{...styles.optionButton, ...(selectedAnswer === option.id ? styles.optionButtonSelected : {})}}
                        onClick={() => handleSelectAnswer(option.id)}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
            <button 
                style={styles.buttonPrimary}
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
            >
                Check My Answer
            </button>
        </div>
    );

    const renderFeedback = () => (
        <div style={{ ...styles.card, backgroundColor: isAnswerCorrect ? '#ECFDF5' : '#FEF2F2' }}>
            {isAnswerCorrect ? <CheckCircleIcon /> : <XCircleIcon />}
            <h2 style={{...styles.title, color: isAnswerCorrect ? '#10B981' : '#EF4444' }}>
                {isAnswerCorrect ? 'Correct!' : 'Not Quite!'}
            </h2>
            <p style={styles.text}>
                {isAnswerCorrect ? currentLesson.quiz.feedback : 'That\'s okay! Let\'s try to remember the lesson and try again later.'}
            </p>
            <button style={styles.buttonPrimary} onClick={handleNext}>
                {currentLessonIndex < totalLessons - 1 ? 'Next Lesson' : 'Finish!'}
            </button>
        </div>
    );

    const renderCompletion = () => (
        <div style={styles.card}>
            <h1 style={styles.title}>Congratulations!</h1>
            <div style={styles.badge}>
                <StarIcon size={60} />
                <span style={styles.badgeText}>Financial Whiz!</span>
            </div>
            <p style={styles.text}>You've completed all the lessons!</p>
            <p style={styles.scoreText}>Your Final Score: {score}</p>
            <button style={styles.buttonPrimary} onClick={handleRestart}>Play Again</button>
        </div>
    );

    const renderContent = () => {
        switch (gameState) {
            case 'intro': return renderIntro();
            case 'lesson': return renderLesson();
            case 'quiz': return renderQuiz();
            case 'feedback': return renderFeedback();
            case 'completed': return renderCompletion();
            default: return renderIntro();
        }
    };
    
    return (
        <div style={styles.container}>
            <div style={styles.moduleWrapper}>
                <div style={styles.header}>
                    <span style={styles.score}>Score: {score}</span>
                    <div style={styles.progressBarContainer}>
                        <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }}></div>
                    </div>
                    <span style={styles.progressText}>{currentLessonIndex + 1 > totalLessons ? totalLessons : currentLessonIndex + 1} / {totalLessons}</span>
                </div>
                {renderContent()}
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
        backgroundColor: '#F3E8FF',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        padding: '20px',
    },
    moduleWrapper: {
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    },
    header: {
        padding: '15px 20px',
        backgroundColor: '#9333EA',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    score: {
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    progressText: {
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    progressBarContainer: {
        flex: 1,
        height: '15px',
        backgroundColor: '#C4B5FD',
        borderRadius: '10px',
        margin: '0 15px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FBBF24',
        borderRadius: '10px',
        transition: 'width 0.5s ease-in-out',
    },
    card: {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        fontSize: '2rem',
        color: '#6B21A8',
        marginBottom: '20px',
    },
    lessonTitle: {
        fontSize: '1.75rem',
        color: '#7E22CE',
        marginBottom: '15px',
    },
    text: {
        fontSize: '1.1rem',
        color: '#555',
        lineHeight: '1.6',
        marginBottom: '30px',
        maxWidth: '90%',
    },
    mascotContainer: {
        margin: '20px 0',
    },
    buttonPrimary: {
        padding: '12px 25px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#A855F7',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    quizQuestion: {
        fontSize: '1.5rem',
        color: '#6B21A8',
        marginBottom: '25px',
    },
    optionsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '30px',
    },
    optionButton: {
        padding: '15px',
        fontSize: '1.1rem',
        backgroundColor: '#F3E8FF',
        border: '2px solid #D8B4FE',
        borderRadius: '15px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.2s, border-color 0.2s',
        width: '100%',
    },
    optionButtonSelected: {
        backgroundColor: '#D8B4FE',
        borderColor: '#9333EA',
        color: 'white',
    },
    badge: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F59E0B',
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        color: 'white',
        boxShadow: '0 0 0 10px #FBBF24',
        marginBottom: '20px',
    },
    badgeText: {
        fontWeight: 'bold',
        marginTop: '5px',
    },
    scoreText: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#6B21A8',
        margin: '10px 0 20px 0',
    },
};

// Add hover/disabled styles dynamically if needed, as CSS-in-JS is more complex for pseudo-classes
// For simplicity, we can add this logic in the component or rely on browser defaults.
// For example, the disabled button style is handled via the `:disabled` pseudo-class in browsers.
// Hover for buttonPrimary:
// buttonPrimary:hover { backgroundColor: '#9333EA', transform: 'translateY(-2px)' }


export default FinancialLiteracyModule;