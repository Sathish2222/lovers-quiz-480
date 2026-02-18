import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Share2, RotateCcw, Settings, Plus, Trash2, Edit2, Save, X, Calculator, CheckSquare, Square } from 'lucide-react';

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
 * User Calculator Component
 * Allows users to select admin-configured options and see the running total sum
 * Reads options from localStorage and provides multi-select functionality with reset/clear
 */
function UserCalculator() {
  const [options, setOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  // Load options from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('adminOptions');
    if (stored) {
      try {
        setOptions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored options:', e);
      }
    }
  }, []);

  // Toggle option selection
  const toggleOption = (optionId) => {
    setSelectedIds(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  // Calculate total sum
  const calculateTotal = () => {
    return options
      .filter(opt => selectedIds.includes(opt.id))
      .reduce((sum, opt) => sum + opt.value, 0);
  };

  // Reset/clear all selections
  const handleReset = () => {
    setSelectedIds([]);
  };

  const total = calculateTotal();

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
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calculator className="w-8 h-8 text-pink-500" />
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600">
                  Options Calculator
                </h1>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Back to Quiz
              </button>
            </div>
            <p className="text-gray-600">
              Select options to see your total sum. All values are configured by the admin.
            </p>
          </div>

          {/* Total Display */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
            <div className="text-center">
              <div className="text-gray-600 text-lg mb-2">Current Total</div>
              <div className="text-6xl md:text-8xl font-playfair font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 mb-4">
                {total.toFixed(2)}
              </div>
              <div className="text-gray-500 text-sm">
                {selectedIds.length} option{selectedIds.length !== 1 ? 's' : ''} selected
              </div>
            </div>

            {/* Reset Button */}
            {selectedIds.length > 0 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Clear All Selections
                </button>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
              Available Options ({options.length})
            </h2>
            
            {options.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No options available yet!</p>
                <p className="text-gray-400 text-sm mb-6">
                  An admin needs to add options first before you can use the calculator.
                </p>
                <button
                  onClick={() => navigate('/admin')}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Go to Admin Panel
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {options.map((option) => {
                  const isSelected = selectedIds.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`w-full border-2 rounded-2xl p-4 transition-all duration-200 transform hover:scale-102 ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-100 to-rose-100 border-pink-400 shadow-lg'
                          : 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 hover:border-pink-300 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`flex-shrink-0 ${isSelected ? 'text-pink-600' : 'text-gray-400'}`}>
                            {isSelected ? (
                              <CheckSquare className="w-6 h-6" />
                            ) : (
                              <Square className="w-6 h-6" />
                            )}
                          </div>
                          <div className="text-left flex-1">
                            <div className={`text-lg font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              Value: <span className={`font-bold ${isSelected ? 'text-pink-600' : 'text-pink-500'}`}>
                                {option.value}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0 ml-3">
                            <div className="bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-bold">
                              Selected
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-pink-50/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-200">
            <p className="text-gray-700 text-sm">
              <strong>💡 How it works:</strong> Click on any option to select or deselect it. 
              The total sum updates automatically based on your selections. Use the "Clear All Selections" button to start over.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Admin Panel Component
 * Allows admin to create and manage custom options with labels and numeric values
 * Data is persisted in localStorage
 */
function AdminPanel() {
  const [options, setOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const navigate = useNavigate();

  // Load options from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('adminOptions');
    if (stored) {
      try {
        setOptions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored options:', e);
      }
    }
  }, []);

  // Save options to localStorage whenever they change
  useEffect(() => {
    if (options.length > 0) {
      localStorage.setItem('adminOptions', JSON.stringify(options));
    }
  }, [options]);

  // Add new option
  const handleAddOption = () => {
    if (!newLabel.trim() || !newValue.trim()) {
      alert('Please enter both label and value');
      return;
    }

    const numericValue = parseFloat(newValue);
    if (isNaN(numericValue)) {
      alert('Value must be a number');
      return;
    }

    const newOption = {
      id: Date.now(),
      label: newLabel.trim(),
      value: numericValue
    };

    setOptions(prev => [...prev, newOption]);
    setNewLabel('');
    setNewValue('');
  };

  // Start editing an option
  const handleEditStart = (option) => {
    setEditingId(option.id);
    setEditLabel(option.label);
    setEditValue(option.value.toString());
  };

  // Save edited option
  const handleEditSave = () => {
    if (!editLabel.trim() || !editValue.trim()) {
      alert('Please enter both label and value');
      return;
    }

    const numericValue = parseFloat(editValue);
    if (isNaN(numericValue)) {
      alert('Value must be a number');
      return;
    }

    setOptions(prev => prev.map(opt => 
      opt.id === editingId 
        ? { ...opt, label: editLabel.trim(), value: numericValue }
        : opt
    ));
    setEditingId(null);
    setEditLabel('');
    setEditValue('');
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null);
    setEditLabel('');
    setEditValue('');
  };

  // Delete option
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      setOptions(prev => prev.filter(opt => opt.id !== id));
    }
  };

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
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-pink-500" />
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600">
                  Admin Panel
                </h1>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Back to Quiz
              </button>
            </div>
            <p className="text-gray-600">
              Manage custom options for your quiz. Each option has a label and a numeric value.
            </p>
          </div>

          {/* Add New Option Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6 text-pink-500" />
              Add New Option
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Option Label
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Romantic Dinner"
                  className="w-full px-4 py-3 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && document.getElementById('new-value-input').focus()}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Numeric Value
                </label>
                <input
                  id="new-value-input"
                  type="number"
                  step="0.01"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g., 85"
                  className="w-full px-4 py-3 rounded-full border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddOption}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-4">
              Current Options ({options.length})
            </h2>
            
            {options.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No options yet. Add your first option above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-4"
                  >
                    {editingId === option.id ? (
                      // Edit mode
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="w-full px-4 py-2 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none transition-colors text-gray-800"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            step="0.01"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-4 py-2 rounded-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none transition-colors text-gray-800"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleEditSave}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
                            title="Save"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-lg font-semibold text-gray-800">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            Value: <span className="font-bold text-pink-600">{option.value}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditStart(option)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(option.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-pink-50/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-200">
            <p className="text-gray-700 text-sm">
              <strong>💡 Tip:</strong> Options are stored locally in your browser and will persist across page refreshes. 
              Users can select these options in the calculator to see the total sum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Quiz Game Component
 * The main quiz flow with welcome screen, questions, and results
 */
function QuizGame() {
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
  const navigate = useNavigate();

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

      {/* Navigation buttons */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => navigate('/calculator')}
          className="bg-white/80 backdrop-blur-sm hover:bg-white text-pink-600 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
          title="Calculator"
        >
          <Calculator className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="bg-white/80 backdrop-blur-sm hover:bg-white text-pink-600 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
          title="Admin Panel"
        >
          <Settings className="w-6 h-6" />
        </button>
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

// PUBLIC_INTERFACE
/**
 * Main App Component with Routing
 * Provides navigation between the quiz game, admin panel, and user calculator
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizGame />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/calculator" element={<UserCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;
