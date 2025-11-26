'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import Game from '@/components/Game';
import Leaderboard from '@/components/Leaderboard';
import { triviaQuestions } from '@/data/triviaQuestions';
import Snowflakes from '@/components/Snowflakes';
import Sparkles from '@/components/Sparkles';

type GameState = 'lobby' | 'playing' | 'finished';
type ViewMode = 'landing' | 'host' | 'player';

const POINTS_PER_CORRECT_ANSWER = 10;

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [players, setPlayers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [gameUrl, setGameUrl] = useState('');
  const [playerName, setPlayerName] = useState('');

  // Check if user is host or player on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isHost = localStorage.getItem('isHost') === 'true';
      const savedPlayerName = localStorage.getItem('playerName');
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');

      if (mode === 'host' || isHost) {
        setViewMode('host');
        localStorage.setItem('isHost', 'true');
      } else {
        // Default to player view if not host
        if (savedPlayerName) {
          setPlayerName(savedPlayerName);
        }
        setViewMode('player');
        localStorage.setItem('isHost', 'false');
      }

      setGameUrl(window.location.origin + window.location.pathname);
    }
  }, []);

  // Fetch game state from API
  const fetchGameState = async () => {
    try {
      const response = await fetch('/api/game');
      const data = await response.json();
      setPlayers(data.players || []);
      setScores(data.scores || {});
      setGameState(data.gameState || 'lobby');
      setCurrentQuestionIndex(data.currentQuestionIndex || 0);
      setSelectedAnswers(data.selectedAnswers || {});
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  // Poll for game state updates (every 1 second)
  useEffect(() => {
    if (viewMode !== 'landing') {
      fetchGameState();
      const interval = setInterval(fetchGameState, 1000);
      return () => clearInterval(interval);
    }
  }, [viewMode]);

  const handleHostGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isHost', 'true');
      setViewMode('host');
      // Update URL
      window.history.pushState({}, '', window.location.pathname + '?mode=host');
    }
  };

  const handleJoinAsPlayer = async (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      try {
        await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'join', playerName: trimmedName }),
        });
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('playerName', trimmedName);
          localStorage.setItem('isHost', 'false');
        }
        
        setPlayerName(trimmedName);
        setViewMode('player');
        await fetchGameState();
      } catch (error) {
        console.error('Error joining game:', error);
      }
    }
  };

  const handleStartGame = async () => {
    // Only host can start the game
    if (viewMode === 'host' && players.length > 0) {
      try {
        await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start' }),
        });
        await fetchGameState();
      } catch (error) {
        console.error('Error starting game:', error);
      }
    }
  };

  const handleAnswer = async (playerName: string, answerIndex: number) => {
    const currentQuestion = triviaQuestions[currentQuestionIndex];
    try {
      // Record the answer
      await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'answer', 
          playerName,
          answerIndex,
          questionIndex: currentQuestionIndex,
        }),
      });
      
      // Update score if correct
      if (answerIndex === currentQuestion.correctAnswer) {
        await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'updateScore', playerName }),
        });
      }
      await fetchGameState();
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < triviaQuestions.length - 1) {
      try {
        await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'nextQuestion' }),
        });
        await fetchGameState();
      } catch (error) {
        console.error('Error moving to next question:', error);
      }
    } else {
      try {
        await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'finish' }),
        });
        await fetchGameState();
      } catch (error) {
        console.error('Error finishing game:', error);
      }
    }
  };

  const handleResetGame = async () => {
    try {
      await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      await fetchGameState();
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  // Game screens (different views for host and players)
  if (gameState === 'playing') {
    const isHost = viewMode === 'host';
    return (
      <Game
        question={triviaQuestions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={triviaQuestions.length}
        players={players}
        scores={scores}
        selectedAnswers={selectedAnswers}
        isHost={isHost}
        currentPlayer={playerName}
        onAnswer={handleAnswer}
        onNextQuestion={handleNextQuestion}
      />
    );
  }

  if (gameState === 'finished') {
    return (
      <Leaderboard
        players={players}
        scores={scores}
        onReset={handleResetGame}
      />
    );
  }

  // Landing Page
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Snowflakes />
        <Sparkles />
        <div className="max-w-2xl w-full relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="relative inline-block mb-8">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 5, 0],
                  scale: [1, 1.15, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="text-8xl md:text-9xl relative z-10"
              >
                🎄
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-christmas-gold rounded-full blur-3xl"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow-lg">
              <span className="bg-gradient-to-r from-christmas-gold via-yellow-300 to-christmas-gold bg-clip-text text-transparent animate-pulse-glow">
                Christmas Movie Trivia
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-snow-white/95 text-shadow mb-12">
              Ready to test your Christmas movie knowledge?
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(220, 20, 60, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHostGame}
            className="btn-red text-white font-bold py-6 px-12 rounded-full text-2xl transition-all hover:brightness-110 w-full md:w-auto"
          >
            <span className="flex items-center justify-center gap-3">
              🎮 Host a Game
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  // Host View
  if (viewMode === 'host') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Snowflakes />
        <Sparkles />
        <div className="max-w-4xl w-full relative z-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
              <span className="bg-gradient-to-r from-christmas-gold via-yellow-300 to-christmas-gold bg-clip-text text-transparent">
                Host Game
              </span>
            </h1>
            <p className="text-xl text-snow-white/90 text-shadow">
              Share the QR code for players to join
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect-strong rounded-3xl p-8 text-center relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-10 -right-10 w-20 h-20 text-6xl opacity-20"
              >
                🎁
              </motion.div>
              <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow relative z-10">
                Scan to Join
              </h2>
              <div className="bg-white p-4 rounded-2xl inline-block mb-6 relative z-10 shadow-2xl border-4 border-christmas-gold/30">
                {gameUrl && (
                  <QRCodeSVG
                    value={gameUrl}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                )}
              </div>
              <p className="text-snow-white/90 text-sm font-semibold relative z-10">
                Players scan this QR code
              </p>
            </motion.div>

            {/* Players & Leaderboard Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect-strong rounded-3xl p-8 relative overflow-hidden"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 text-3xl opacity-30"
              >
                🎄
              </motion.div>
              <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow text-center relative z-10">
                Leaderboard ({players.length} players)
              </h2>
              
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto relative z-10">
                {players.length === 0 ? (
                  <p className="text-center text-snow-white/70 py-8 font-semibold">
                    No players joined yet
                  </p>
                ) : (
                  players
                    .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
                    .map((player: string, index: number) => (
                      <motion.div
                        key={player}
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                        className={`bg-gradient-to-r from-white/20 to-white/10 rounded-xl p-4 border-2 ${
                          index === 0 ? 'border-christmas-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'border-christmas-gold/30'
                        } shadow-lg`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-christmas-gold w-8">
                              #{index + 1}
                            </span>
                            <span className="text-lg font-semibold flex items-center gap-2">
                              {index === 0 && <span>👑</span>}
                              🎅 {player}
                            </span>
                          </div>
                          <span className="text-xl font-bold bg-gradient-to-r from-christmas-gold to-yellow-300 bg-clip-text text-transparent">
                            {scores[player] || 0} pts
                          </span>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(220, 20, 60, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartGame}
                disabled={players.length === 0}
                className={`w-full font-bold py-4 px-6 rounded-full text-lg transition-all relative z-10 ${
                  players.length > 0
                    ? 'btn-red text-white hover:brightness-110'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {players.length > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    🎮 Start Game
                  </span>
                ) : (
                  'Start Game'
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Player View
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <Snowflakes />
      <Sparkles />
      <div className="max-w-2xl w-full relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="text-7xl md:text-8xl relative z-10"
            >
              🎄
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
            <span className="bg-gradient-to-r from-christmas-gold via-yellow-300 to-christmas-gold bg-clip-text text-transparent">
              Join Game
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect-strong rounded-3xl p-8 relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-32 h-32 text-8xl opacity-10"
          >
            ⭐
          </motion.div>
          
          {!playerName ? (
            <PlayerJoinForm onJoin={handleJoinAsPlayer} />
          ) : (
            <div className="relative z-10">
              <div className="text-center mb-6">
                <p className="text-xl font-semibold text-christmas-gold mb-4">
                  Welcome, {playerName}! 🎅
                </p>
                
                {/* Player's own score card */}
                <div className="bg-gradient-to-r from-christmas-gold/20 to-yellow-300/20 rounded-xl p-6 mb-6 border-2 border-christmas-gold/50">
                  <div className="text-center">
                    <p className="text-sm text-snow-white/80 mb-2">Your Score</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-christmas-gold to-yellow-300 bg-clip-text text-transparent">
                      {scores[playerName] || 0} pts
                    </p>
                  </div>
                </div>

                {/* Waiting message */}
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <p className="text-snow-white/90 font-semibold">
                    {gameState === 'lobby' 
                      ? '⏳ Waiting for host to start the game...' 
                      : '✅ You\'re ready! Waiting for game to begin...'}
                  </p>
                  {players.length > 0 && (
                    <p className="text-sm text-snow-white/70 mt-2">
                      {players.length} player{players.length !== 1 ? 's' : ''} joined
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function PlayerJoinForm({ onJoin }: { onJoin: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10">
      <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow text-center">
        Enter Your Name to Join
      </h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full bg-white/25 border-2 border-white/40 rounded-full px-6 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-christmas-gold/50 focus:border-christmas-gold text-lg font-semibold shadow-lg backdrop-blur-sm"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' }}
          whileTap={{ scale: 0.95 }}
          className="btn-gold text-christmas-green-dark font-bold py-4 px-8 rounded-full text-lg transition-all hover:brightness-110 w-full"
        >
          <span className="flex items-center justify-center gap-2">
            ✨ Join Game
          </span>
        </motion.button>
      </div>
      <p className="text-center text-snow-white/70 text-sm mt-4">
        After joining, wait for the host to start the game
      </p>
    </form>
  );
}
