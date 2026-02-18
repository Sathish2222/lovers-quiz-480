import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Sparkles, Share2, RotateCcw, Copy, CheckCircle } from 'lucide-react';

// Question bank with 10 romantic couples questions
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
  }
];

// PUBLIC_INTERFACE
/**
 * Encode admin quiz data to URL-safe base64 string
 * @param {Object} data - Object containing adminName and answers array
 * @returns {string} Base64-encoded quiz data string
 */
const encodeQuizData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(encodeURIComponent(jsonString));
  } catch (e) {
    console.error('Failed to encode quiz data:', e);
    return '';
  }
};

// PUBLIC_INTERFACE
/**
 * Decode admin quiz data from URL-safe base64 string
 * @param {string} encodedData - Base64-encoded quiz data string
 * @returns {Object|null} Decoded quiz data or null if decode fails
 */
const decodeQuizData = (encodedData) => {
  try {
    const jsonString = decodeURIComponent(atob(encodedData));
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to decode quiz data:', e);
    return null;
  }
};

// Compatibility labels based on score percentage
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
 * Admin Quiz Component
 * Admin enters their name and answers 10 questions, then generates a shareable link
 */
function AdminQuiz() {
  const [screen, setScreen] = useState('welcome'); // 'welcome', 'quiz', 'share'
  const [adminName, setAdminName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Handle start quiz
  const handleStartQuiz = () => {
    if (adminName.trim()) {
      setScreen('quiz');
      setCurrentQuestionIndex(0);
      setAnswers([]);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    // Move to next question or finish
    if (currentQuestionIndex < QUESTION_BANK.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Generate share link
      generateShareLink(newAnswers);
      setScreen('share');
    }
  };

  // Generate shareable link with encoded admin data
  const generateShareLink = (finalAnswers) => {
    const quizData = {
      adminName: adminName.trim(),
      answers: finalAnswers
    };
    const encodedData = encodeQuizData(quizData);
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/lover?data=${encodedData}`;
    setShareUrl(fullUrl);
  };

  // Copy share link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link. Please copy manually.');
    }
  };

  // Reset and start over
  const handleStartOver = () => {
    setScreen('welcome');
    setAdminName('');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShareUrl('');
    setCopied(false);
  };

  const progress = QUESTION_BANK.length > 0 ? ((currentQuestionIndex + 1) / QUESTION_BANK.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50 font-quicksand relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingHeart delay={0} size="small" left={10} />
        <FloatingHeart delay={1} size="medium" left={25} />
        <FloatingHeart delay={2} size="large" left={45} />
        <FloatingHeart delay={1.5} size="small" left={65} />
        <FloatingHeart delay={2.5} size="medium" left={80} />
        <FloatingHeart delay={0.5} size="small" left={90} />
      </div>

      {/* Main content */}
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
                  Test how well your lover knows you! 💕
                </p>
              </div>

              {/* Admin name input */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Enter Your Name
                  </label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g., Sathish"
                    className="w-full px-6 py-4 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleStartQuiz()}
                    autoFocus
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-8 bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                <p className="text-gray-700 text-sm">
                  <strong>📝 How it works:</strong>
                </p>
                <ol className="text-gray-600 text-sm mt-2 space-y-1 list-decimal list-inside">
                  <li>You'll answer 10 questions about yourself</li>
                  <li>Get a shareable link to send to your lover</li>
                  <li>They answer the same questions about YOU</li>
                  <li>See how well they know you! 💖</li>
                </ol>
              </div>

              {/* Start button */}
              <button
                onClick={handleStartQuiz}
                disabled={!adminName.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-200 text-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Answering Questions
              </button>
            </div>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {screen === 'quiz' && (
          <div className="max-w-2xl w-full animate-slide-up">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestionIndex + 1} of {QUESTION_BANK.length}
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
                  {QUESTION_BANK[currentQuestionIndex].question}
                </h2>
                <p className="text-gray-500 text-sm">
                  Choose your honest answer, {adminName} 💖
                </p>
              </div>

              {/* Answer options */}
              <div className="space-y-4">
                {QUESTION_BANK[currentQuestionIndex].options.map((option, index) => (
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
          </div>
        )}

        {/* SHARE LINK SCREEN */}
        {screen === 'share' && (
          <div className="max-w-2xl w-full animate-fade-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Share2 className="text-pink-500 w-16 h-16" />
                </div>
                <h1 className="text-4xl md:text-5xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 mb-4">
                  Your Quiz is Ready!
                </h1>
                <p className="text-gray-600 text-lg">
                  Share this link with your lover to see how well they know you! 💕
                </p>
              </div>

              {/* Share URL Display */}
              <div className="mb-8">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Shareable Link:</p>
                  <p className="text-gray-800 text-sm font-mono break-all">
                    {shareUrl}
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyLink}
                  className={`w-full font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Link to Share
                    </>
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="mb-8 bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                <p className="text-gray-700 text-sm">
                  <strong>💡 Next Steps:</strong>
                </p>
                <ul className="text-gray-600 text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Copy the link above</li>
                  <li>Send it to your lover via text, email, or social media</li>
                  <li>They'll enter their name and answer questions about YOU</li>
                  <li>They'll see their compatibility score instantly!</li>
                </ul>
              </div>

              {/* Start Over Button */}
              <button
                onClick={handleStartOver}
                className="w-full bg-white border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Start Over with New Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Lover Quiz Component
 * Lover opens the shared link, enters their name, and answers questions about the admin
 */
function LoverQuiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [screen, setScreen] = useState('loading'); // 'loading', 'welcome', 'quiz', 'results'
  const [adminName, setAdminName] = useState('');
  const [adminAnswers, setAdminAnswers] = useState([]);
  const [loverName, setLoverName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loverAnswers, setLoverAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [revealPhase, setRevealPhase] = useState(0); // 0: calculating, 1: show score, 2: show details

  // Load admin quiz data from URL on mount
  useEffect(() => {
    const dataParam = searchParams.get('data');
    
    if (dataParam) {
      const decodedData = decodeQuizData(dataParam);
      if (decodedData && decodedData.adminName && decodedData.answers) {
        setAdminName(decodedData.adminName);
        setAdminAnswers(decodedData.answers);
        setScreen('welcome');
      } else {
        alert('Invalid quiz link. Please check the link and try again.');
        navigate('/');
      }
    } else {
      alert('No quiz data found. Please use a valid quiz link.');
      navigate('/');
    }
  }, [searchParams, navigate]);

  // Handle start quiz
  const handleStartQuiz = () => {
    if (loverName.trim()) {
      setScreen('quiz');
      setCurrentQuestionIndex(0);
      setLoverAnswers([]);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...loverAnswers, answerIndex];
    setLoverAnswers(newAnswers);

    // Move to next question or finish
    if (currentQuestionIndex < QUESTION_BANK.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score
      calculateScore(newAnswers);
      setScreen('results');
    }
  };

  // Calculate score by comparing lover's answers with admin's answers
  const calculateScore = (finalLoverAnswers) => {
    let matches = 0;
    for (let i = 0; i < adminAnswers.length; i++) {
      if (finalLoverAnswers[i] === adminAnswers[i]) {
        matches++;
      }
    }
    const percentage = Math.round((matches / adminAnswers.length) * 100);
    setScore(percentage);
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

  // Play again - go back to home
  const handlePlayAgain = () => {
    navigate('/');
  };

  const progress = QUESTION_BANK.length > 0 ? ((currentQuestionIndex + 1) / QUESTION_BANK.length) * 100 : 0;
  const compatibility = getCompatibilityLabel(score);

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50 font-quicksand flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50 font-quicksand relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingHeart delay={0} size="small" left={10} />
        <FloatingHeart delay={1} size="medium" left={25} />
        <FloatingHeart delay={2} size="large" left={45} />
        <FloatingHeart delay={1.5} size="small" left={65} />
        <FloatingHeart delay={2.5} size="medium" left={80} />
        <FloatingHeart delay={0.5} size="small" left={90} />
      </div>

      {/* Main content */}
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
                <p className="text-gray-600 text-lg mb-2">
                  {adminName} wants to know how well you know them! 💕
                </p>
                <p className="text-gray-500 text-sm">
                  Answer 10 questions about {adminName} and see your compatibility score!
                </p>
              </div>

              {/* Lover name input */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Enter Your Name
                  </label>
                  <input
                    type="text"
                    value={loverName}
                    onChange={(e) => setLoverName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-6 py-4 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleStartQuiz()}
                    autoFocus
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-8 bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
                <p className="text-gray-700 text-sm">
                  <strong>💖 Instructions:</strong>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  You'll answer the same 10 questions that {adminName} answered, 
                  but from their perspective. Try to match their answers to get a high score!
                </p>
              </div>

              {/* Start button */}
              <button
                onClick={handleStartQuiz}
                disabled={!loverName.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 transition-all duration-200 text-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start the Quiz
              </button>
            </div>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {screen === 'quiz' && (
          <div className="max-w-2xl w-full animate-slide-up">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestionIndex + 1} of {QUESTION_BANK.length}
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
                  What would {adminName} answer?
                </h2>
                <p className="text-xl md:text-2xl font-medium text-gray-700 mb-3">
                  {QUESTION_BANK[currentQuestionIndex].question}
                </p>
                <p className="text-gray-500 text-sm">
                  Think from {adminName}'s perspective 💖
                </p>
              </div>

              {/* Answer options */}
              <div className="space-y-4">
                {QUESTION_BANK[currentQuestionIndex].options.map((option, index) => (
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
                    Calculating Your Score...
                  </h2>
                  <p className="text-gray-600">
                    Comparing your answers with {adminName}'s
                  </p>
                </div>
              )}

              {/* Phase 1: Show score */}
              {revealPhase >= 1 && (
                <div className="text-center animate-scale-in">
                  <div className="mb-8">
                    <Heart className="w-20 h-20 text-pink-500 fill-pink-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-playfair font-bold text-gray-700 mb-2">
                      {loverName} & {adminName}
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
                        {loverName}, you got {Math.round(score / 10)} out of 10 questions right about {adminName}!
                      </p>
                      <p className="text-gray-600 text-base mb-8">
                        {compatibility.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200">
                          <div className="text-3xl font-bold text-pink-600 mb-1">
                            {Math.round(score / 10)}/10
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Correct Answers
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200">
                          <div className="text-3xl font-bold text-pink-600 mb-1">
                            {score}%
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Compatibility
                          </div>
                        </div>
                      </div>

                      {/* Per-Question Review */}
                      <div className="mb-8">
                        <h3 className="text-xl font-playfair font-bold text-gray-800 mb-4 text-left">
                          Question Review
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {QUESTION_BANK.map((question, index) => {
                            const isCorrect = loverAnswers[index] === adminAnswers[index];
                            const loverAnswerText = question.options[loverAnswers[index]];
                            const adminAnswerText = question.options[adminAnswers[index]];
                            
                            return (
                              <div 
                                key={index}
                                className={`rounded-2xl p-4 border-2 ${
                                  isCorrect 
                                    ? 'bg-green-50 border-green-300' 
                                    : 'bg-rose-50 border-rose-300'
                                }`}
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm ${
                                    isCorrect ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'
                                  }`}>
                                    {isCorrect ? '✓' : '✗'}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800 mb-2">
                                      Q{index + 1}: {question.question}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="ml-9 space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-600">Your answer:</span>
                                    <span className={`font-semibold ${
                                      isCorrect ? 'text-green-700' : 'text-rose-700'
                                    }`}>
                                      {loverAnswerText}
                                    </span>
                                  </div>
                                  
                                  {!isCorrect && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-600">{adminName}'s answer:</span>
                                      <span className="font-semibold text-green-700">
                                        {adminAnswerText}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={handlePlayAgain}
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Create Your Own Quiz
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

// PUBLIC_INTERFACE
/**
 * Main App Component with Routing
 * Provides navigation between admin quiz and lover quiz
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminQuiz />} />
        <Route path="/lover" element={<LoverQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
