import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

// ============================================
// FLAMES: Destiny Reveal - Main Application
// A fun, Gen Z-themed FLAMES game with modern UI
// ============================================

// FLAMES result configuration with emojis, colors, and glow classes
const FLAMES_CONFIG = {
  F: {
    result: 'FRIENDS',
    emoji: '🤝',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500',
    glowClass: 'glow-friends',
    meterRange: [40, 80]
  },
  L: {
    result: 'LOVE',
    emoji: '💘',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500',
    glowClass: 'glow-love',
    meterRange: [70, 100]
  },
  A: {
    result: 'AFFECTION',
    emoji: '🫶',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500',
    glowClass: 'glow-affection',
    meterRange: [40, 80]
  },
  M: {
    result: 'MARRIAGE',
    emoji: '💍',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500',
    glowClass: 'glow-marriage',
    meterRange: [70, 100]
  },
  E: {
    result: 'ENEMY',
    emoji: '😈',
    color: 'text-red-500',
    bgColor: 'bg-red-600',
    glowClass: 'glow-enemy',
    meterRange: [0, 30]
  },
  S: {
    result: 'SIBLINGS',
    emoji: '🧑‍🤝‍🧑',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500',
    glowClass: 'glow-siblings',
    meterRange: [20, 60]
  }
};

// Fun lines for Cute Mode
const CUTE_LINES = {
  LOVE: [
    "Aww… soulmate energy overload 😭✨",
    "This is giving destiny vibes 💖",
    "Perfect match loading forever 🫶",
    "The universe said YES to you two! 🌟",
    "Main character love story unlocked 💕"
  ],
  FRIENDS: [
    "Bestie vibes only! 💜",
    "Friendship goals unlocked ✨",
    "Squad energy is immaculate 🙌",
    "Built different together! 💪",
    "The iconic duo energy 🤩"
  ],
  AFFECTION: [
    "Soft hours activated 🥺💕",
    "The vibes are immaculate ✨",
    "Caring energy radiating! 🌸",
    "Warmth overload detected 🫶",
    "Tender moments loading... 💗"
  ],
  MARRIAGE: [
    "Wedding bells in the distance! 💒",
    "Shehnai bajne wali hai! 🎺💕",
    "Already planning the honeymoon! ✈️",
    "Life partner energy detected 💍✨",
    "The stars have aligned for forever! 🌟"
  ],
  ENEMY: [
    "Plot twist: enemies to lovers arc? 👀",
    "The tension is... interesting 😏",
    "Frenemies era begins! ⚔️",
    "Rivals make the best stories 📖",
    "Competition makes you stronger! 💪"
  ],
  SIBLINGS: [
    "Family vibes activated! 🏠",
    "Protective energy unlocked 🛡️",
    "Sibling chaos incoming! 😂",
    "Built-in best friend energy! 🤗",
    "The bickering duo! 😆"
  ]
};

// Fun lines for Roast Mode
const ROAST_LINES = {
  LOVE: [
    "Nee love pannala… Love unakku vandhuduchu! 😂🔥",
    "Bro really manifested this 💀✨",
    "Main character syndrome worked for once 😭",
    "Even the algorithm is shipping you two 📱",
    "Love ah? Real ID se aao cupid 🏹😂"
  ],
  FRIENDS: [
    "Friendzone illa… but situation zone 😳",
    "Bro got the consolation prize 🏆😂",
    "At least you got a +1 for parties 🎉",
    "Friend request accepted, love rejected 💔😂",
    "The 'just friends' energy is strong 💪😭"
  ],
  AFFECTION: [
    "Affection? That's just spicy friendship 🌶️",
    "Almost there but not quite 😭✨",
    "The situationship is strong with this one 💀",
    "Bro stuck in 'it's complicated' 😂",
    "Affection loading... Error 404 Love not found 🤖"
  ],
  MARRIAGE: [
    "Marriage ah? First message panra da 😭📱",
    "Shaadi.com profile ready ah? 💒😂",
    "Bro skipped dating, straight to wedding 🏃‍♂️",
    "Parents already saving for the wedding 💰",
    "Kundli match pannitu vaa first 📜😂"
  ],
  ENEMY: [
    "Blocked and reported energy 🚫😂",
    "The villain origin story begins 💀",
    "Plot twist: you two will become besties 😏",
    "Enemies to lovers arc loading... or not 📖",
    "Tom and Jerry vibes only 🐱🐭"
  ],
  SIBLINGS: [
    "Rakhi incoming in 3... 2... 1... 🎀😭",
    "Bhai-behan ka pyaar OP 😂",
    "Family dinner vibes only 🍽️",
    "Congratulations, you gained a sibling! 🎉",
    "The protective bhai/didi energy 🛡️😂"
  ]
};

// Loading messages sequence
const LOADING_MESSAGES = [
  { text: "Destiny loading", emoji: "🔥" },
  { text: "Love algorithm running", emoji: "💘" },
  { text: "Checking your vibe match", emoji: "😳✨" },
  { text: "Consulting the stars", emoji: "⭐" },
  { text: "Final verdict incoming", emoji: "📜" }
];

// ============================================
// FLAMES Algorithm Implementation
// ============================================
function calculateFlames(name1, name2) {
  // Normalize names: lowercase, remove spaces and special characters
  let n1 = name1.toLowerCase().replace(/[^a-z]/g, '');
  let n2 = name2.toLowerCase().replace(/[^a-z]/g, '');
  
  // Convert to arrays for manipulation
  let arr1 = n1.split('');
  let arr2 = n2.split('');
  
  // Cancel common characters
  for (let i = 0; i < arr1.length; i++) {
    const idx = arr2.indexOf(arr1[i]);
    if (idx !== -1) {
      arr1[i] = null;
      arr2[idx] = null;
    }
  }
  
  // Count remaining characters
  const remaining1 = arr1.filter(c => c !== null).length;
  const remaining2 = arr2.filter(c => c !== null).length;
  const count = remaining1 + remaining2;
  
  // If count is 0, default to some value
  if (count === 0) {
    return 'L'; // Perfect match = Love
  }
  
  // FLAMES elimination
  let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  let index = 0;
  
  while (flames.length > 1) {
    // Calculate the index to eliminate
    index = (index + count - 1) % flames.length;
    flames.splice(index, 1);
    // Adjust index if needed
    if (index >= flames.length) {
      index = 0;
    }
  }
  
  return flames[0];
}

// Generate random meter percentage within range
function getRandomMeter(range) {
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

// Get random line based on result and mode
function getRandomLine(result, isRoastMode) {
  const lines = isRoastMode ? ROAST_LINES[result] : CUTE_LINES[result];
  return lines[Math.floor(Math.random() * lines.length)];
}

// ============================================
// Floating Hearts Background Component
// ============================================
function FloatingHearts() {
  const hearts = ['💕', '💖', '💗', '💘', '❤️', '💝', '💓', '💞'];
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="floating-heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
            fontSize: `${1 + Math.random() * 1.5}rem`
          }}
        >
          {hearts[Math.floor(Math.random() * hearts.length)]}
        </div>
      ))}
    </div>
  );
}

// ============================================
// Bokeh Blur Effects Component
// ============================================
function BokehEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="bokeh-blur w-96 h-96 bg-pink-400 top-10 -left-20" />
      <div className="bokeh-blur w-80 h-80 bg-purple-400 top-1/2 -right-10" />
      <div className="bokeh-blur w-72 h-72 bg-red-400 bottom-20 left-1/3" />
      <div className="bokeh-blur w-64 h-64 bg-orange-300 top-1/4 right-1/4" />
    </div>
  );
}

// ============================================
// Toggle Switch Component
// ============================================
function ToggleSwitch({ isRoastMode, onToggle }) {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <span className={`text-lg transition-all ${!isRoastMode ? 'text-white font-bold' : 'text-white/60'}`}>
        💖 Cute Mode
      </span>
      <button
        onClick={onToggle}
        className={`toggle-switch ${isRoastMode ? 'active' : ''}`}
        aria-label="Toggle between Cute and Roast mode"
      />
      <span className={`text-lg transition-all ${isRoastMode ? 'text-white font-bold' : 'text-white/60'}`}>
        😂 Roast Mode
      </span>
    </div>
  );
}

// ============================================
// Love Meter Component
// ============================================
function LoveMeter({ percentage, color }) {
  return (
    <div className="w-full my-4">
      <div className="flex justify-between text-white/80 text-sm mb-2">
        <span>Compatibility</span>
        <span>{percentage}%</span>
      </div>
      <div className="love-meter h-4 w-full">
        <motion.div
          className={`love-meter-fill ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        />
      </div>
    </div>
  );
}

// ============================================
// Result Card Component (for display)
// ============================================
function ResultCard({ name1, name2, result, config, line, meter, isRoastMode, onDownload, onCopyLink, onShareWhatsApp, onTryAgain }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className={`glass-card rounded-2xl p-6 md:p-8 text-center ${config.glowClass} ${result === 'ENEMY' ? 'animate-shake' : ''}`}
    >
      {/* Names display */}
      <div className="text-white/80 text-lg md:text-xl mb-4">
        <span className="font-bold text-white">{name1}</span>
        <span className="mx-2">+</span>
        <span className="font-bold text-white">{name2}</span>
      </div>

      {/* Big result */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3, duration: 0.5 }}
        className="my-6"
      >
        <div className="text-6xl md:text-8xl mb-4">{config.emoji}</div>
        <h2 className={`text-4xl md:text-6xl font-extrabold ${config.color} drop-shadow-lg`}>
          {result}
        </h2>
      </motion.div>

      {/* Love Meter */}
      <LoveMeter percentage={meter} color={config.bgColor} />

      {/* Fun line */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-white/90 text-lg md:text-xl italic my-4"
      >
        "{line}"
      </motion.p>

      {/* Mode indicator */}
      <div className="text-white/60 text-sm mb-6">
        {isRoastMode ? '😂 Roast Mode' : '💖 Cute Mode'}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDownload}
          className="bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          📥 Download
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCopyLink}
          className="bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          🔗 Copy Link
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShareWhatsApp}
          className="bg-green-500/80 hover:bg-green-500 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          💚 WhatsApp
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTryAgain}
          className="bg-pink-500/80 hover:bg-pink-500 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          🔄 Try Again
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// Downloadable Result Card Component
// ============================================
function DownloadableCard({ name1, name2, result, config, line, meter, isRoastMode }) {
  return (
    <div
      className="result-card-download p-8 text-center"
      style={{ width: '400px', minHeight: '500px' }}
    >
      {/* Logo/Title */}
      <div className="text-white text-2xl font-bold mb-4">
        🔥 FLAMES: Destiny Reveal 🔥
      </div>

      {/* Names */}
      <div className="text-white text-xl mb-6">
        <span className="font-bold">{name1}</span>
        <span className="mx-2 text-white/80">+</span>
        <span className="font-bold">{name2}</span>
      </div>

      {/* Result */}
      <div className="text-7xl mb-4">{config.emoji}</div>
      <h2 className={`text-5xl font-extrabold ${config.color} mb-6`}>
        {result}
      </h2>

      {/* Meter */}
      <div className="bg-white/20 rounded-full h-4 w-4/5 mx-auto mb-2">
        <div
          className={`${config.bgColor} h-4 rounded-full`}
          style={{ width: `${meter}%` }}
        />
      </div>
      <div className="text-white/80 text-lg mb-6">{meter}% Compatible</div>

      {/* Line */}
      <p className="text-white text-lg italic mb-6">"{line}"</p>

      {/* Mode */}
      <div className="text-white/70 text-sm">
        {isRoastMode ? '😂 Roast Mode' : '💖 Cute Mode'}
      </div>

      {/* Footer */}
      <div className="mt-6 text-white/50 text-sm">
        Play at flames-destiny.app 💕
      </div>
    </div>
  );
}

// ============================================
// History Component
// ============================================
function History({ history, onSelectHistory, onClearHistory }) {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-4 md:p-6 mt-6 w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-lg">📜 Recent History</h3>
        <button
          onClick={onClearHistory}
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          Clear ❌
        </button>
      </div>
      <div className="space-y-2">
        {history.map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ x: 5 }}
            onClick={() => onSelectHistory(item)}
            className="history-item w-full text-left py-2 px-3 rounded-lg text-white/90 text-sm md:text-base"
          >
            {item.name1} + {item.name2} → {item.result} {FLAMES_CONFIG[item.resultKey].emoji}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// Loading Screen Component
// ============================================
function LoadingScreen({ messageIndex }) {
  const message = LOADING_MESSAGES[messageIndex];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card rounded-2xl p-8 md:p-12 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-6xl mb-6"
      >
        {message.emoji}
      </motion.div>
      <h2 className="text-white text-xl md:text-2xl font-medium">
        {message.text}<span className="loading-dots"></span>
      </h2>
      <div className="flex justify-center gap-2 mt-6">
        {LOADING_MESSAGES.map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${i === messageIndex ? 'bg-white' : 'bg-white/30'}`}
            animate={i === messageIndex ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// Main App Component
// ============================================
function App() {
  // State management
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Ref for downloadable card
  const downloadCardRef = useRef(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('flamesHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('flamesHistory', JSON.stringify(newHistory));
  };

  // Fire confetti and heart burst
  const fireConfetti = () => {
    // Regular confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Heart-shaped confetti (using emojis not directly supported, but we can use colors)
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ff6b9d', '#ff6b6b', '#ff8e53', '#c44569']
      });
    }, 200);
  };

  // Handle reveal button click
  const handleReveal = () => {
    // Validate inputs
    if (!name1.trim() || !name2.trim()) {
      setError('Please enter both names! 💕');
      return;
    }

    setError('');
    setIsLoading(true);
    setLoadingMessageIndex(0);

    // Cycle through loading messages
    const interval = setInterval(() => {
      setLoadingMessageIndex(prev => {
        if (prev >= LOADING_MESSAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    // After loading, show result
    setTimeout(() => {
      clearInterval(interval);
      
      // Calculate FLAMES result
      const resultKey = calculateFlames(name1, name2);
      const config = FLAMES_CONFIG[resultKey];
      const meter = getRandomMeter(config.meterRange);
      const line = getRandomLine(config.result, isRoastMode);

      const result = {
        name1: name1.trim(),
        name2: name2.trim(),
        result: config.result,
        resultKey,
        meter,
        line,
        isRoastMode,
        timestamp: Date.now()
      };

      setCurrentResult(result);
      setIsLoading(false);
      setShowResult(true);

      // Fire confetti
      fireConfetti();

      // Add to history (keep last 5)
      const newHistory = [result, ...history.filter(h => 
        !(h.name1 === result.name1 && h.name2 === result.name2)
      )].slice(0, 5);
      saveHistory(newHistory);
    }, LOADING_MESSAGES.length * 800 + 500);
  };

  // Handle download card
  const handleDownload = async () => {
    if (!downloadCardRef.current) return;

    try {
      const canvas = await html2canvas(downloadCardRef.current, {
        backgroundColor: null,
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `flames-${currentResult.name1}-${currentResult.name2}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error downloading:', err);
    }
  };

  // Handle copy link
  const handleCopyLink = () => {
    const text = `🔥 FLAMES Result: ${currentResult.name1} + ${currentResult.name2} = ${currentResult.result} ${FLAMES_CONFIG[currentResult.resultKey].emoji}\n\n"${currentResult.line}"\n\nPlay FLAMES: Destiny Reveal! 💕`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Handle WhatsApp share
  const handleShareWhatsApp = () => {
    const text = `🔥 FLAMES Result:\n${currentResult.name1} + ${currentResult.name2} = ${currentResult.result} ${FLAMES_CONFIG[currentResult.resultKey].emoji}\n\n"${currentResult.line}"\n\n💕 Try it yourself!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Handle try again
  const handleTryAgain = () => {
    setName1('');
    setName2('');
    setShowResult(false);
    setCurrentResult(null);
  };

  // Handle history selection
  const handleSelectHistory = (item) => {
    setCurrentResult({
      ...item,
      line: getRandomLine(item.result, item.isRoastMode)
    });
    setName1(item.name1);
    setName2(item.name2);
    setIsRoastMode(item.isRoastMode);
    setShowResult(true);
    fireConfetti();
  };

  // Handle clear history
  const handleClearHistory = () => {
    saveHistory([]);
  };

  return (
    <div className="min-h-screen gradient-bg relative flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background effects */}
      <FloatingHearts />
      <BokehEffects />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo/Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
            🔥 FLAMES 🔥
          </h1>
          <p className="text-white/80 text-lg">Destiny Reveal</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && (
            <LoadingScreen messageIndex={loadingMessageIndex} />
          )}

          {/* Result State */}
          {!isLoading && showResult && currentResult && (
            <ResultCard
              name1={currentResult.name1}
              name2={currentResult.name2}
              result={currentResult.result}
              config={FLAMES_CONFIG[currentResult.resultKey]}
              line={currentResult.line}
              meter={currentResult.meter}
              isRoastMode={currentResult.isRoastMode}
              onDownload={handleDownload}
              onCopyLink={handleCopyLink}
              onShareWhatsApp={handleShareWhatsApp}
              onTryAgain={handleTryAgain}
            />
          )}

          {/* Input State */}
          {!isLoading && !showResult && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl p-6 md:p-8 w-full"
            >
              {/* Name inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Your Name 💕</label>
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="Enter your name..."
                    className="custom-input w-full px-4 py-3 rounded-xl text-white outline-none text-lg"
                    maxLength={30}
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Crush Name 😳💘</label>
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Enter their name..."
                    className="custom-input w-full px-4 py-3 rounded-xl text-white outline-none text-lg"
                    maxLength={30}
                  />
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-yellow-300 text-center mt-4"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Mode toggle */}
              <ToggleSwitch
                isRoastMode={isRoastMode}
                onToggle={() => setIsRoastMode(!isRoastMode)}
              />

              {/* Reveal button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReveal}
                className="reveal-btn w-full py-4 rounded-xl text-white font-bold text-xl shadow-lg mt-4"
              >
                Reveal Relationship 🔥
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History section - show when not loading */}
        {!isLoading && (
          <History
            history={history}
            onSelectHistory={handleSelectHistory}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Copy success toast */}
        <AnimatePresence>
          {copySuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-medium shadow-lg"
            >
              ✅ Copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/50 text-sm mt-8 text-center"
        >
          Made with 💕 for Gen Z vibes ✨
        </motion.p>
      </div>

      {/* Hidden downloadable card */}
      {currentResult && (
        <div className="capture-card" ref={downloadCardRef}>
          <DownloadableCard
            name1={currentResult.name1}
            name2={currentResult.name2}
            result={currentResult.result}
            config={FLAMES_CONFIG[currentResult.resultKey]}
            line={currentResult.line}
            meter={currentResult.meter}
            isRoastMode={currentResult.isRoastMode}
          />
        </div>
      )}
    </div>
  );
}

export default App;
