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

const POINTS_PER_CORRECT_ANSWER = 10;

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [players, setPlayers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [gameUrl, setGameUrl] = useState('');

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
    fetchGameState();
    const interval = setInterval(fetchGameState, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Set the game URL for QR code
    if (typeof window !== 'undefined') {
      setGameUrl(window.location.href);
    }
  }, []);

  const handleJoinGame = async (playerName: string) => {
    const trimmedName = playerName.trim();
    if (trimmedName && !players.includes(trimmedName)) {
      try {
        await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'join', playerName: trimmedName }),
        });
        // Store player name in localStorage for game screen
        if (typeof window !== 'undefined') {
          localStorage.setItem('playerName', trimmedName);
        }
        // Refresh state
        await fetchGameState();
      } catch (error) {
        console.error('Error joining game:', error);
      }
    }
  };

  const handleStartGame = async () => {
    if (players.length > 0) {
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

  if (gameState === 'playing') {
    return (
      <Game
        question={triviaQuestions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={triviaQuestions.length}
        players={players}
        scores={scores}
        selectedAnswers={selectedAnswers}
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
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow-lg relative">
            <span className="bg-gradient-to-r from-christmas-gold via-yellow-300 to-christmas-gold bg-clip-text text-transparent animate-pulse-glow">
              Christmas Movie Trivia
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-snow-white/95 text-shadow flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              ✨
            </motion.span>
            Scan the QR code to join the game!
            <motion.span
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              ✨
            </motion.span>
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
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-10 -left-10 w-20 h-20 text-6xl opacity-20"
            >
              🎄
            </motion.div>
            <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow relative z-10">
              Join Game
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
              Share this page or scan the QR code
            </p>
          </motion.div>

          {/* Players Section */}
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
              Players ({players.length})
            </h2>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto relative z-10">
              {players.length === 0 ? (
                <p className="text-center text-snow-white/70 py-8 font-semibold">
                  No players joined yet
                </p>
              ) : (
                players.map((player: string, index: number) => (
                  <motion.div
                    key={player}
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                    className="bg-gradient-to-r from-white/20 to-white/10 rounded-xl p-4 text-center border-2 border-christmas-gold/30 shadow-lg hover:border-christmas-gold/60 transition-all"
                  >
                    <span className="text-lg font-semibold flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        🎅
                      </motion.span>
                      {player}
                    </span>
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

        {/* Join Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-effect-strong rounded-3xl p-8 relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-32 h-32 text-8xl opacity-10"
          >
            ⭐
          </motion.div>
          <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow text-center relative z-10">
            Enter Your Name to Join
          </h2>
          <JoinForm onJoin={handleJoinGame} existingPlayers={players} />
        </motion.div>
      </div>
    </div>
  );
}

function JoinForm({ 
  onJoin, 
  existingPlayers 
}: { 
  onJoin: (name: string) => void;
  existingPlayers: string[];
}) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !existingPlayers.includes(name.trim())) {
      onJoin(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 relative z-10">
      <input
        type="text"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        placeholder="Enter your name..."
        className="flex-1 bg-white/25 border-2 border-white/40 rounded-full px-6 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-christmas-gold/50 focus:border-christmas-gold text-lg font-semibold shadow-lg backdrop-blur-sm"
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' }}
        whileTap={{ scale: 0.95 }}
        className="btn-gold text-christmas-green-dark font-bold py-4 px-8 rounded-full text-lg transition-all hover:brightness-110"
      >
        <span className="flex items-center gap-2">
          ✨ Join
        </span>
      </motion.button>
    </form>
  );
}

