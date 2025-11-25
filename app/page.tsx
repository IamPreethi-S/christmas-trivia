'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import Game from '@/components/Game';
import { triviaQuestions } from '@/data/triviaQuestions';
import Snowflakes from '@/components/Snowflakes';
import Sparkles from '@/components/Sparkles';

type GameState = 'lobby' | 'playing' | 'finished';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [players, setPlayers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [gameUrl, setGameUrl] = useState('');

  useEffect(() => {
    // Set the game URL for QR code
    if (typeof window !== 'undefined') {
      setGameUrl(window.location.href);
    }
  }, []);

  const handleJoinGame = (playerName: string) => {
    if (playerName.trim() && !players.includes(playerName.trim())) {
      setPlayers([...players, playerName.trim()]);
      setScores({ ...scores, [playerName.trim()]: 0 });
    }
  };

  const handleStartGame = () => {
    if (players.length > 0) {
      setGameState('playing');
    }
  };

  const handleAnswer = (playerName: string, answerIndex: number) => {
    const currentQuestion = triviaQuestions[currentQuestionIndex];
    if (answerIndex === currentQuestion.correctAnswer) {
      setScores({ ...scores, [playerName]: (scores[playerName] || 0) + 1 });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < triviaQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameState('finished');
    }
  };

  const handleResetGame = () => {
    setGameState('lobby');
    setCurrentQuestionIndex(0);
    setScores({});
  };

  if (gameState === 'playing') {
    return (
      <Game
        question={triviaQuestions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={triviaQuestions.length}
        players={players}
        scores={scores}
        onAnswer={handleAnswer}
        onNextQuestion={handleNextQuestion}
      />
    );
  }

  if (gameState === 'finished') {
    const sortedPlayers = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
    const winner = sortedPlayers[0];
    const maxScore = scores[winner] || 0;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Snowflakes />
        <Sparkles />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect-strong rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center relative z-20"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-7xl md:text-8xl relative z-10"
            >
              🎄
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-christmas-gold rounded-full blur-3xl"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-shadow-lg">
            <span className="bg-gradient-to-r from-christmas-gold via-yellow-300 to-christmas-gold bg-clip-text text-transparent">
              Game Over!
            </span>
          </h1>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold text-christmas-gold mb-4 text-shadow">Final Scores</h2>
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                className={`glass-effect rounded-xl p-4 ${
                  index === 0 
                    ? 'border-4 border-christmas-gold bg-gradient-to-r from-christmas-gold/20 to-yellow-300/20 shadow-[0_0_30px_rgba(255,215,0,0.5)]' 
                    : 'border-2 border-white/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold flex items-center gap-2">
                    {index === 0 && (
                      <motion.span
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        👑
                      </motion.span>
                    )}
                    {player}
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-christmas-gold to-yellow-300 bg-clip-text text-transparent">
                    {scores[player] || 0} / {triviaQuestions.length}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(220, 20, 60, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetGame}
            className="btn-red text-white font-bold py-4 px-10 rounded-full text-lg transition-all hover:brightness-110"
          >
            <span className="flex items-center gap-2">
              🎄 Play Again
            </span>
          </motion.button>
        </motion.div>
      </div>
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
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.span>
            Scan the QR code to join the game!
            <motion.span
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-20 h-20 text-6xl opacity-20"
            >
              🎁
            </motion.div>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
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
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
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
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(220, 20, 60, 0.6)" }}
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
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 text-8xl opacity-10"
          >
            ⭐
          </motion.div>
          <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow text-center relative z-10">
            Enter Your Name
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
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)" }}
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

