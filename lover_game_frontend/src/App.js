import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Sparkles, Share2, RotateCcw } from 'lucide-react';

// Question bank with romantic couples questions
const QUESTION_BANK = [
  {
    id: 1,
    question: "What's more important in a relationship?",
    options: ["Trust", "Communication", "Passion", "Loyalty"]
  },
  {
    id: 2,
    question: "Your ideal date night would be:",
    options: ["Candlelit dinner", "Movie marathon", "Adventure activity", "Cooking together"]
  },
  {
    id: 3,
    question: "How do you express love best?",
    options: ["Words of affirmation", "Physical touch", "Acts of service", "Quality time"]
  },
  {
    id: 4,
    question: "What makes you feel most loved?",
    options: ["Thoughtful surprises", "Deep conversations", "Physical affection", "Shared experiences"]
  },
  {
    id: 5,
    question: "In a disagreement, you tend to:",
    options: ["Talk it out immediately", "Take time to cool down", "Compromise quickly", "Avoid conflict"]
  },
  {
    id: 6,
    question: "Your partner's best quality is:",
    options: ["Sense of humor", "Kindness", "Intelligence", "Spontaneity"]
  },
  {
    id: 7,
    question: "Perfect weekend getaway:",
    options: ["Beach resort", "Mountain cabin", "City exploration", "Staycation at home"]
  },
  {
    id: 8,
    question: "You show appreciation by:",
    options: ["Giving compliments", "Buying gifts", "Planning surprises", "Spending time together"]
  },
  {
    id: 9,
    question: "Most important shared value:",
    options: ["Family", "Adventure", "Stability", "Growth"]
  },
  {
    id: 10,
    question: "Your love language is:",
    options: ["Words", "Touch", "Gifts", "Time"]
  },
  {
    id: 11,
    question: "Best way to celebrate an anniversary:",
    options: ["Romantic dinner out", "Recreate first date", "Weekend trip", "Cozy night in"]
  },
  {
    id: 12,
    question: "In tough times, you need:",
    options: ["Emotional support", "Problem-solving help", "Space to process", "Physical comfort"]
  },
  {
    id: 13,
    question: "Dream vacation together:",
    options: ["Paris, France", "Bali, Indonesia", "New York City", "Swiss Alps"]
  },
  {
    id: 14,
    question: "You feel closest when:",
    options: ["Having deep talks", "Being physically close", "Laughing together", "Working as a team"]
  },
  {
    id: 15,
    question: "Your relationship motto:",
    options: ["Love conquers all", "Communication is key", "Adventure together", "Trust always"]
  }
];

// Compatibility labels based on score ranges
const getCompatibilityLabel = (score) => {
  if (score >= 90) return { label: "Soulmates 💕", color: "text-pink-600", description: "You two are absolutely perfect for each other!" };
  if (score >= 80) return { label: "Perfect Match 💖", color: "text-rose-500", description: "Your connection is incredibly strong!" };
  if (score >= 70) return { label: "Great Chemistry ✨", color: "text-pink-500", description: "You have amazing potential together!" };
  if (score >= 60) return { label: "Strong Bond 💗", color: "text-rose-400", description: "You share a beautiful connection!" };
  if (score >= 50) return { label: "Growing Together 🌸", color: "text-pink-400", description: "Your love is blossoming nicely!" };
  return { label: "Keep Nurturing 🌱", color: "text-pink-300", description: "Every relationship grows at its own pace!" };
};

// Floating heart component for background animation
const FloatingHeart = ({ delay, size, left }) => (
  <div 
    className={`absolute ${size === 'small' ? 'text-2xl' : size === 'medium' ? 'text-4xl' : 'text-6xl'} opacity-20`}
    style={{
      left: `${left}%`,
      animation: `float ${6 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      bottom: '-10%'
    }}
  >
    ❤️
  </div>
);

// Sparkle component for score reveal
const Sparkle = ({ delay, top, left }) => (
  <div 
    className="absolute text-yellow-400 text-2xl"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      animation: `twinkle 1.5s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    ✨
  </div>
);

// PUBLIC_INTERFACE
/**
 * Main Lover Game App Component
 * A romantic couples quiz application with three-screen flow:
 * 1. Welcome/Name Entry Screen
 * 2. Quiz Screen (10 questions with progress)
 * 3. Score Reveal Screen with animations and results
 */
function App() {
  // Game state
  const [screen, setScreen] = useState('welcome'); // 'welcome', 'quiz', 'results'
  const [playerName, setPlayerName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [score, setScore] = useState(0);
  const [revealPhase, setRevealPhase] = useState(0); // 0: calculating, 1: show score, 2: show details

  // Initialize quiz with randomized questions
  const initializeQuiz = useCallback(() => {
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    setQuestions(selected);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  }, []);

  // Start the game
  const handleStartGame = () => {
    if (playerName.trim() && partnerName.trim()) {
      initializeQuiz();
      setScreen('quiz');
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    const timeSpent = Date.now() - questionStartTime;
    
    // Store answer with timing information
    setAnswers(prev => [...prev, { 
      questionId: questions[currentQuestionIndex].id,
      answer: answerIndex,
      timeSpent 
    }]);

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      // Calculate final score
      calculateScore([...answers, { 
        questionId: questions[currentQuestionIndex].id,
        answer: answerIndex,
        timeSpent 
      }]);
      setScreen('results');
    }
  };

  // Calculate score based on randomization and speed
  const calculateScore = (allAnswers) => {
    // Base random score (40-70)
    let baseScore = Math.floor(Math.random() * 31) + 40;
    
    // Speed bonus: faster answers get bonus points (up to +30)
    const avgTime = allAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / allAnswers.length;
    const speedBonus = Math.max(0, Math.min(30, Math.floor((10000 - avgTime) / 300)));
    
    // Total score (capped at 100)
    const finalScore = Math.min(100, baseScore + speedBonus);
    setScore(finalScore);
  };

  // Reveal score with timed phases
  useEffect(() => {
    if (screen === 'results') {
      // Phase 0: Calculating (2 seconds)
      const timer1 = setTimeout(() => setRevealPhase(1), 2000);
      // Phase 1: Show score (1.5 seconds)
      const timer2 = setTimeout(() => setRevealPhase(2), 3500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [screen]);

  // Play again functionality
  const handlePlayAgain = () => {
    setScreen('welcome');
    setPlayerName('');
    setPartnerName('');
    setAnswers([]);
    setScore(0);
    setRevealPhase(0);
  };

  // Share functionality
  const handleShare = () => {
    const compatibility = getCompatibilityLabel(score);
    const shareText = `${playerName} and ${partnerName} scored ${score}% on the Lover Game! We're ${compatibility.label}! 💕`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Lover Game Results',
        text: shareText,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard!');
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  // Calculate progress percentage
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const compatibility = getCompatibilityLabel(score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50 font-quicksand relative overflow-hidden">
      {/* Floating hearts background animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingHeart delay={0} size="small" left={10} />
        <FloatingHeart delay={1} size="medium" left={25} />
        <FloatingHeart delay={2} size="large" left={45} />
        <FloatingHeart delay={1.5} size="small" left={65} />
        <FloatingHeart delay={2.5} size="medium" left={80} />
        <FloatingHeart delay={0.5} size="small" left={90} />
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        
        {/* WELCOME SCREEN */}
        {screen === 'welcome' && (
          <div className="max-w-lg w-full animate-fade-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Heart className="text-pink-500 w-16 h-16 fill-pink-500" />
                </div>
                <h1 className="text-5xl md:text-6xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 mb-4">
                  Lover Game
                </h1>
                <p className="text-gray-600 text-lg">
                  Discover your romantic compatibility! 💕
                </p>
              </div>

              {/* Name inputs */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-6 py-4 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && document.getElementById('partner-input').focus()}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Partner's Name
                  </label>
                  <input
                    id="partner-input"
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter partner's name..."
                    className="w-full px-6 py-4 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
                  />
                </div>
              </div>

              {/* Start button */}
              <button
                onClick={handleStartGame}
                disabled={!playerName.trim() || !partnerName.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-200 text-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start the Journey
              </button>

              <p className="text-center text-gray-500 text-sm mt-6">
                10 questions • 2 minutes • Pure romance ✨
              </p>
            </div>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {screen === 'quiz' && questions.length > 0 && (
          <div className="max-w-2xl w-full animate-slide-up">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-pink-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 animate-scale-in">
              <div className="text-center mb-8">
                <div className="inline-block bg-pink-100 rounded-full p-4 mb-4">
                  <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800 mb-2">
                  {questions[currentQuestionIndex].question}
                </h2>
                <p className="text-gray-500 text-sm">
                  Choose the answer that resonates with your heart 💖
                </p>
              </div>

              {/* Answer options */}
              <div className="space-y-4">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className="w-full bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border-2 border-pink-200 hover:border-pink-400 text-gray-800 font-medium py-4 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-base md:text-lg">{option}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Names display */}
            <div className="text-center mt-6">
              <p className="text-gray-700 font-medium">
                {playerName} 💕 {partnerName}
              </p>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {screen === 'results' && (
          <div className="max-w-2xl w-full animate-fade-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Sparkles decoration */}
              {revealPhase >= 1 && (
                <div className="absolute inset-0 pointer-events-none">
                  <Sparkle delay={0} top={10} left={15} />
                  <Sparkle delay={0.3} top={20} left={85} />
                  <Sparkle delay={0.6} top={80} left={10} />
                  <Sparkle delay={0.9} top={85} left={90} />
                  <Sparkle delay={0.2} top={50} left={5} />
                  <Sparkle delay={0.8} top={50} left={95} />
                </div>
              )}

              {/* Phase 0: Calculating */}
              {revealPhase === 0 && (
                <div className="text-center animate-pulse">
                  <Sparkles className="w-16 h-16 text-pink-500 mx-auto mb-6 animate-spin" />
                  <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
                    Calculating Your Love Score...
                  </h2>
                  <p className="text-gray-600">
                    Analyzing the chemistry between {playerName} and {partnerName}
                  </p>
                </div>
              )}

              {/* Phase 1: Show score */}
              {revealPhase >= 1 && (
                <div className="text-center animate-scale-in">
                  <div className="mb-8">
                    <Heart className="w-20 h-20 text-pink-500 fill-pink-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-playfair font-bold text-gray-700 mb-2">
                      {playerName} & {partnerName}
                    </h2>
                    <h3 className="text-6xl md:text-8xl font-playfair font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 mb-4">
                      {score}%
                    </h3>
                    <div className={`text-3xl md:text-4xl font-bold ${compatibility.color} mb-2`}>
                      {compatibility.label}
                    </div>
                  </div>

                  {/* Phase 2: Show details */}
                  {revealPhase >= 2 && (
                    <div className="animate-slide-up">
                      <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                        {compatibility.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200">
                          <div className="text-3xl font-bold text-pink-600 mb-1">
                            {questions.length}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Questions Answered
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200">
                          <div className="text-3xl font-bold text-pink-600 mb-1">
                            {Math.round((Date.now() - startTime) / 1000)}s
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Total Time
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={handlePlayAgain}
                          className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Play Again
                        </button>
                        <button
                          onClick={handleShare}
                          className="flex-1 bg-white border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Share2 className="w-5 h-5" />
                          Share Results
                        </button>
                      </div>

                      <p className="text-center text-gray-500 text-sm mt-6">
                        Share your love story with the world! 💕
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
