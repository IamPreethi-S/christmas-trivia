'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import Game from '@/components/Game';
import { triviaQuestions } from '@/data/triviaQuestions';

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
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-6"
          >
            🎄
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-christmas-gold mb-8 text-shadow-lg">
            Game Over!
          </h1>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold text-christmas-gold mb-4">Final Scores</h2>
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-effect rounded-xl p-4 ${
                  index === 0 ? 'border-2 border-christmas-gold' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">
                    {index === 0 && '👑 '}
                    {player}
                  </span>
                  <span className="text-2xl font-bold text-christmas-gold">
                    {scores[player] || 0} / {triviaQuestions.length}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetGame}
            className="bg-christmas-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="text-8xl mb-4"
          >
            🎄
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-christmas-gold mb-4 text-shadow-lg">
            Christmas Movie Trivia
          </h1>
          <p className="text-xl md:text-2xl text-snow-white/90 text-shadow">
            Scan the QR code to join the game!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-3xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow">
              Join Game
            </h2>
            <div className="bg-white p-4 rounded-2xl inline-block mb-6">
              {gameUrl && (
                <QRCodeSVG
                  value={gameUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>
            <p className="text-snow-white/80 text-sm">
              Share this page or scan the QR code
            </p>
          </motion.div>

          {/* Players Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow text-center">
              Players ({players.length})
            </h2>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {players.length === 0 ? (
                <p className="text-center text-snow-white/60 py-8">
                  No players joined yet
                </p>
              ) : (
                players.map((player, index) => (
                  <motion.div
                    key={player}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 rounded-lg p-3 text-center"
                  >
                    <span className="text-lg font-semibold">🎅 {player}</span>
                  </motion.div>
                ))
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartGame}
              disabled={players.length === 0}
              className={`w-full font-bold py-4 px-6 rounded-full text-lg transition-all ${
                players.length > 0
                  ? 'bg-christmas-red hover:bg-red-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Game
            </motion.button>
          </motion.div>
        </div>

        {/* Join Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-effect rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold text-christmas-gold mb-6 text-shadow text-center">
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
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name..."
        className="flex-1 bg-white/20 border border-white/30 rounded-full px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-christmas-gold text-lg"
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-christmas-gold hover:bg-yellow-500 text-christmas-green font-bold py-4 px-8 rounded-full text-lg transition-colors"
      >
        Join
      </motion.button>
    </form>
  );
}

