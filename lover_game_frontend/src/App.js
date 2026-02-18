import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Sparkles, Share2, RotateCcw, Copy, CheckCircle, HeartCrack, Volume2, VolumeX } from 'lucide-react';

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
 * Custom hook for managing sound effects using Web Audio API
 * Generates simple synthesized tones for different game events
 * @returns {Object} Sound player functions and mute state
 */
const useSoundEffects = () => {
  const [isMuted, setIsMuted] = useState(() => {
    // Load mute preference from localStorage
    const saved = localStorage.getItem('loverGameMuted');
    return saved === 'true';
  });
  const audioContextRef = useRef(null);

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported:', e);
      }
    }
    return audioContextRef.current;
  }, []);

  // Play a simple tone with specified parameters
  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.3) => {
    if (isMuted) return;
    
    const context = initAudioContext();
    if (!context) return;

    try {
      // Resume context if suspended (browser autoplay policy)
      if (context.state === 'suspended') {
        context.resume();
      }

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
    } catch (e) {
      console.warn('Error playing sound:', e);
    }
  }, [isMuted, initAudioContext]);

  // Button tap sound - short pleasant beep
  const playButtonTap = useCallback(() => {
    playTone(800, 0.08, 'sine', 0.2);
  }, [playTone]);

  // Success sound - ascending cheerful notes
  const playSuccess = useCallback(() => {
    playTone(523.25, 0.15, 'sine', 0.25); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.25), 80); // E5
    setTimeout(() => playTone(783.99, 0.25, 'sine', 0.25), 160); // G5
  }, [playTone]);

  // Fail sound - descending sad notes
  const playFail = useCallback(() => {
    playTone(493.88, 0.15, 'sine', 0.25); // B4
    setTimeout(() => playTone(392.00, 0.15, 'sine', 0.25), 80); // G4
    setTimeout(() => playTone(329.63, 0.3, 'sine', 0.25), 160); // E4
  }, [playTone]);

  // Reveal sound - magical ascending arpeggio
  const playReveal = useCallback(() => {
    playTone(523.25, 0.12, 'sine', 0.2); // C5
    setTimeout(() => playTone(659.25, 0.12, 'sine', 0.2), 60); // E5
    setTimeout(() => playTone(783.99, 0.12, 'sine', 0.2), 120); // G5
    setTimeout(() => playTone(1046.50, 0.25, 'sine', 0.25), 180); // C6
  }, [playTone]);

  // Heartbreak sound - dramatic low notes
  const playHeartbreak = useCallback(() => {
    playTone(220.00, 0.2, 'square', 0.2); // A3
    setTimeout(() => playTone(196.00, 0.3, 'square', 0.2), 100); // G3
  }, [playTone]);

  // Toggle mute and save preference
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('loverGameMuted', String(newValue));
      return newValue;
    });
  }, []);

  return {
    isMuted,
    toggleMute,
    playButtonTap,
    playSuccess,
    playFail,
    playReveal,
    playHeartbreak
  };
};

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
  if (score >= 90) return { label: "Soulmates 💕", color: "text-pink-600", bgGradient: "from-pink-100 to-rose-100", description: "You two are absolutely perfect for each other!" };
  if (score >= 80) return { label: "Perfect Match 💖", color: "text-rose-500", bgGradient: "from-rose-100 to-pink-100", description: "Your connection is incredibly strong!" };
  if (score >= 70) return { label: "Great Chemistry ✨", color: "text-pink-500", bgGradient: "from-pink-50 to-rose-50", description: "You have amazing potential together!" };
  if (score >= 60) return { label: "Strong Bond 💗", color: "text-rose-400", bgGradient: "from-rose-50 to-pink-50", description: "You share a beautiful connection!" };
  if (score >= 50) return { label: "Growing Together 🌸", color: "text-pink-400", bgGradient: "from-pink-50 to-yellow-50", description: "Your love is blossoming nicely!" };
  return { label: "Room to Grow 💔", color: "text-gray-600", bgGradient: "from-gray-100 to-slate-100", description: "Every relationship needs work and understanding!" };
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

// Confetti particle component for high scores
const ConfettiParticle = ({ delay, startX, color }) => (
  <div 
    className={`absolute w-2 h-2 ${color} rounded-full`}
    style={{
      left: `${startX}%`,
      top: '0%',
      animation: `confettiFall 3s ease-out infinite`,
      animationDelay: `${delay}s`
    }}
  />
);

// Broken heart piece component for low scores
const BrokenHeartPiece = ({ side, delay }) => (
  <div 
    className="absolute text-6xl opacity-80"
    style={{
      left: side === 'left' ? '35%' : '55%',
      top: '30%',
      animation: `heartBreak${side === 'left' ? 'Left' : 'Right'} 1.5s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    {side === 'left' ? '💔' : ''}
  </div>
);

// Crying emoji component for low scores
const CryingEmoji = ({ delay, position }) => (
  <div 
    className="absolute text-3xl opacity-60"
    style={{
      left: `${position}%`,
      top: '60%',
      animation: `tearDrop 2s ease-in infinite`,
      animationDelay: `${delay}s`
    }}
  >
    😢
  </div>
);

// PUBLIC_INTERFACE
/**
 * Mute Toggle Button Component
 * Floating button to toggle sound effects on/off
 */
const MuteToggle = ({ isMuted, onToggle, onSound }) => {
  const handleClick = () => {
    if (!isMuted) {
      onSound(); // Play sound before muting
    }
    onToggle();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 right-4 z-50 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 border-pink-200 hover:border-pink-400"
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-gray-500" />
      ) : (
        <Volume2 className="w-6 h-6 text-pink-500" />
      )}
    </button>
  );
};

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

  // Sound effects hook
  const { isMuted, toggleMute, playButtonTap, playSuccess, playReveal } = useSoundEffects();

  // Handle start quiz
  const handleStartQuiz = () => {
    if (adminName.trim()) {
      playButtonTap();
      setScreen('quiz');
      setCurrentQuestionIndex(0);
      setAnswers([]);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    playButtonTap();
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    // Move to next question or finish
    if (currentQuestionIndex < QUESTION_BANK.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Generate share link
      generateShareLink(newAnswers);
      playSuccess();
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

  // Copy share link to clipboard with multiple fallback methods
  const handleCopyLink = async () => {
    playButtonTap();
    try {
      // Method 1: Modern Clipboard API (preferred)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        return;
      }
      
      // Method 2: Legacy execCommand (fallback for older browsers)
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
          return;
        } else {
          throw new Error('execCommand failed');
        }
      } catch (execErr) {
        document.body.removeChild(textArea);
        throw execErr;
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      // Method 3: Manual selection fallback
      const textInput = document.querySelector('.share-url-input');
      if (textInput) {
        textInput.select();
        textInput.setSelectionRange(0, 99999); // For mobile devices
        alert('Please press Ctrl+C (Cmd+C on Mac) to copy the link, or manually select and copy it.');
      } else {
        alert('Unable to copy automatically. Please manually select and copy the link above.');
      }
    }
  };

  // Reset and start over
  const handleStartOver = () => {
    playButtonTap();
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
      {/* Mute Toggle Button */}
      <MuteToggle isMuted={isMuted} onToggle={toggleMute} onSound={playButtonTap} />

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
                  <Heart className="text-pink-500 w-16 h-16 fill-pink-500 animate-pulse" />
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
                  <Share2 className="text-pink-500 w-16 h-16 animate-bounce" />
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
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    onClick={(e) => e.target.select()}
                    className="share-url-input w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm font-mono break-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    aria-label="Share URL"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Click the link to select it, then copy manually if needed
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

  // Sound effects hook
  const { isMuted, toggleMute, playButtonTap, playSuccess, playFail, playReveal, playHeartbreak } = useSoundEffects();

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
      playButtonTap();
      setScreen('quiz');
      setCurrentQuestionIndex(0);
      setLoverAnswers([]);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    playButtonTap();
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

  // Reveal score with timed phases and sound effects
  useEffect(() => {
    if (screen === 'results') {
      // Phase 0: Calculating (2 seconds)
      const timer1 = setTimeout(() => {
        setRevealPhase(1);
        playReveal();
        // Play success/fail sound based on score
        if (score >= 50) {
          setTimeout(() => playSuccess(), 500);
        } else {
          setTimeout(() => playHeartbreak(), 500);
          setTimeout(() => playFail(), 800);
        }
      }, 2000);
      
      // Phase 1: Show score (1.5 seconds)
      const timer2 = setTimeout(() => setRevealPhase(2), 3500);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [screen, score, playReveal, playSuccess, playFail, playHeartbreak]);

  // Play again - go back to home
  const handlePlayAgain = () => {
    playButtonTap();
    navigate('/');
  };

  const progress = QUESTION_BANK.length > 0 ? ((currentQuestionIndex + 1) / QUESTION_BANK.length) * 100 : 0;
  const compatibility = getCompatibilityLabel(score);
  const isLowScore = score < 50;

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
      {/* Mute Toggle Button */}
      <MuteToggle isMuted={isMuted} onToggle={toggleMute} onSound={playButtonTap} />

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
                  <Heart className="text-pink-500 w-16 h-16 fill-pink-500 animate-pulse" />
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
            <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden ${isLowScore && revealPhase >= 1 ? 'bg-gradient-to-br from-gray-50 to-slate-50' : ''}`}>
              
              {/* Animations based on score */}
              {revealPhase >= 1 && !isLowScore && (
                <>
                  {/* Sparkles for good scores */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Sparkle delay={0} top={10} left={15} />
                    <Sparkle delay={0.3} top={20} left={85} />
                    <Sparkle delay={0.6} top={80} left={10} />
                    <Sparkle delay={0.9} top={85} left={90} />
                    <Sparkle delay={0.2} top={50} left={5} />
                    <Sparkle delay={0.8} top={50} left={95} />
                  </div>
                  {/* Confetti particles for high scores */}
                  {score >= 70 && (
                    <div className="absolute inset-0 pointer-events-none">
                      <ConfettiParticle delay={0} startX={20} color="bg-pink-400" />
                      <ConfettiParticle delay={0.5} startX={40} color="bg-rose-400" />
                      <ConfettiParticle delay={1} startX={60} color="bg-yellow-400" />
                      <ConfettiParticle delay={1.5} startX={80} color="bg-pink-300" />
                      <ConfettiParticle delay={0.3} startX={30} color="bg-rose-300" />
                      <ConfettiParticle delay={0.8} startX={70} color="bg-pink-500" />
                    </div>
                  )}
                </>
              )}

              {/* Heart-break animation for low scores */}
              {revealPhase >= 1 && isLowScore && (
                <div className="absolute inset-0 pointer-events-none">
                  <BrokenHeartPiece side="left" delay={0} />
                  <BrokenHeartPiece side="right" delay={0} />
                  <CryingEmoji delay={0.5} position={25} />
                  <CryingEmoji delay={1} position={75} />
                  <CryingEmoji delay={1.5} position={50} />
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
                  <div className="mt-8 flex justify-center gap-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}

              {/* Phase 1: Show score */}
              {revealPhase >= 1 && (
                <div className="text-center animate-scale-in">
                  <div className="mb-8">
                    {isLowScore ? (
                      <HeartCrack className="w-20 h-20 text-gray-500 mx-auto mb-6 animate-pulse" />
                    ) : (
                      <Heart className={`w-20 h-20 text-pink-500 fill-pink-500 mx-auto mb-6 ${score >= 80 ? 'animate-bounce' : 'animate-pulse'}`} />
                    )}
                    <h2 className="text-2xl font-playfair font-bold text-gray-700 mb-2">
                      {loverName} & {adminName}
                    </h2>
                    <h3 className={`text-6xl md:text-8xl font-playfair font-black mb-4 ${
                      isLowScore 
                        ? 'text-gray-600 animate-pulse' 
                        : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 animate-pulse'
                    }`}>
                      {score}%
                    </h3>
                    <div className={`text-3xl md:text-4xl font-bold ${compatibility.color} mb-2 ${score >= 70 ? 'animate-bounce' : ''}`}>
                      {compatibility.label}
                    </div>
                  </div>

                  {/* Phase 2: Show details */}
                  {revealPhase >= 2 && (
                    <div className="animate-slide-up">
                      <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                        {loverName}, you got {Math.round(score / 10)} out of 10 questions right about {adminName}!
                      </p>
                      <p className={`text-base mb-8 ${isLowScore ? 'text-gray-600' : 'text-gray-700'}`}>
                        {compatibility.description}
                      </p>

                      {isLowScore && (
                        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 animate-scale-in">
                          <p className="text-blue-800 font-medium text-lg mb-2">
                            💡 Don't worry!
                          </p>
                          <p className="text-blue-700 text-sm">
                            Every relationship is unique and grows over time. Use this as an opportunity to learn more about each other and strengthen your bond! 💪❤️
                          </p>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className={`bg-gradient-to-br ${compatibility.bgGradient} rounded-2xl p-4 border-2 ${isLowScore ? 'border-gray-300' : 'border-pink-200'} transform hover:scale-105 transition-transform`}>
                          <div className={`text-3xl font-bold mb-1 ${isLowScore ? 'text-gray-700' : 'text-pink-600'}`}>
                            {Math.round(score / 10)}/10
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Correct Answers
                          </div>
                        </div>
                        <div className={`bg-gradient-to-br ${compatibility.bgGradient} rounded-2xl p-4 border-2 ${isLowScore ? 'border-gray-300' : 'border-pink-200'} transform hover:scale-105 transition-transform`}>
                          <div className={`text-3xl font-bold mb-1 ${isLowScore ? 'text-gray-700' : 'text-pink-600'}`}>
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
                                className={`rounded-2xl p-4 border-2 transform hover:scale-102 transition-all ${
                                  isCorrect 
                                    ? 'bg-green-50 border-green-300 hover:shadow-lg' 
                                    : 'bg-rose-50 border-rose-300 hover:shadow-lg'
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
                          className={`w-full font-semibold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 ${
                            isLowScore
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                              : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                          }`}
                        >
                          <RotateCcw className="w-5 h-5" />
                          Create Your Own Quiz
                        </button>
                      </div>

                      <p className="text-center text-gray-500 text-sm mt-6">
                        {isLowScore ? 'Keep learning about each other! 💪❤️' : 'Share your love story with the world! 💕'}
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
