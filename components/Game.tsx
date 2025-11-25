'use client';

import { motion } from 'framer-motion';
import { Question } from '@/data/triviaQuestions';
import { useState, useEffect } from 'react';
import Snowflakes from '@/components/Snowflakes';
import Sparkles from '@/components/Sparkles';

interface GameProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  players: string[];
  scores: Record<string, number>;
  selectedAnswers?: Record<string, number>;
  onAnswer: (playerName: string, answerIndex: number) => void;
  onNextQuestion: () => void;
}

const POINTS_PER_CORRECT_ANSWER = 10;

export default function Game({
  question,
  questionNumber,
  totalQuestions,
  players,
  scores,
  selectedAnswers: propSelectedAnswers = {},
  onAnswer,
  onNextQuestion,
}: GameProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(propSelectedAnswers);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');

  // Sync selectedAnswers from props (which come from API)
  useEffect(() => {
    setSelectedAnswers(propSelectedAnswers);
  }, [propSelectedAnswers]);

  useEffect(() => {
    // Get current player's name from localStorage
    if (typeof window !== 'undefined') {
      const playerName = localStorage.getItem('playerName');
      if (playerName) {
        setCurrentPlayer(playerName);
      }
    }
  }, []);

  useEffect(() => {
    setSelectedAnswers({});
    setShowResults(false);
    setTimeLeft(30);

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question.id]);

  const handleAnswer = (playerName: string, answerIndex: number) => {
    if (!selectedAnswers[playerName] && !showResults) {
      onAnswer(playerName, answerIndex);
    }
  };

  const allAnswered = players.length > 0 && players.every((player) => selectedAnswers[player] !== undefined);
  
  useEffect(() => {
    if (allAnswered && !showResults) {
      const timer = setTimeout(() => setShowResults(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [allAnswered, showResults]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <Snowflakes />
      <Sparkles />
      <div className="max-w-4xl w-full relative z-20">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xl font-semibold text-christmas-gold text-shadow">
              Question {questionNumber} of {totalQuestions}
            </span>
            <motion.span 
              className="text-xl font-semibold text-christmas-gold text-shadow flex items-center gap-2"
              animate={{ scale: timeLeft <= 5 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
            >
              ⏱️ {timeLeft}s
            </motion.span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 shadow-inner border-2 border-white/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              className="bg-gradient-to-r from-christmas-gold via-yellow-300 to-christmas-gold h-4 rounded-full shadow-lg relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-effect-strong rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-10 -right-10 w-32 h-32 text-8xl opacity-10"
          >
            🎬
          </motion.div>
          <div className="text-center mb-6 relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="text-6xl mb-4"
            >
              🎬
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-shadow-lg">
              <span className="bg-gradient-to-r from-christmas-gold via-yellow-300 to-christmas-gold bg-clip-text text-transparent">
                {question.movie}
              </span>
            </h2>
            <h3 className="text-xl md:text-2xl font-semibold text-white text-shadow">
              {question.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const playerAnswers = Object.entries(selectedAnswers)
                .filter(([_, answerIndex]) => answerIndex === index)
                .map(([player]) => player);

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!showResults ? { scale: 1.02 } : {}}
                  whileTap={!showResults ? { scale: 0.98 } : {}}
                  disabled={showResults || !currentPlayer}
                  onClick={() => {
                    if (currentPlayer && !selectedAnswers[currentPlayer]) {
                      handleAnswer(currentPlayer, index);
                    }
                  }}
                  className={`p-6 rounded-2xl text-left transition-all relative overflow-hidden ${
                    showResults
                      ? isCorrect
                        ? 'bg-gradient-to-r from-green-500/60 to-emerald-500/60 border-4 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                        : 'bg-gradient-to-r from-red-500/40 to-rose-500/40 border-2 border-red-400'
                      : selectedAnswers[currentPlayer] === index
                      ? 'bg-gradient-to-r from-christmas-gold/40 to-yellow-300/40 border-4 border-christmas-gold shadow-[0_0_20px_rgba(255,215,0,0.5)]'
                      : 'bg-gradient-to-r from-white/15 to-white/10 hover:from-white/25 hover:to-white/15 border-2 border-white/30 hover:border-christmas-gold/50 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                    {showResults && isCorrect && (
                      <span className="text-2xl">✓</span>
                    )}
                  </div>
                  {showResults && playerAnswers.length > 0 && (
                    <div className="mt-2 text-sm text-white/80">
                      Answered by: {playerAnswers.join(', ')}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Player Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {players.map((player) => {
              const hasAnswered = selectedAnswers[player] !== undefined;
              const isCorrect = selectedAnswers[player] === question.correctAnswer;
              
              return (
                <motion.div
                  key={player}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-lg text-center ${
                    showResults
                      ? isCorrect
                        ? 'bg-green-500/30'
                        : hasAnswered
                        ? 'bg-red-500/30'
                        : 'bg-gray-500/30'
                      : hasAnswered
                      ? 'bg-christmas-gold/30'
                      : 'bg-white/10'
                  }`}
                >
                  <div className="text-sm font-semibold">{player}</div>
                  <div className="text-xs mt-1">
                    {hasAnswered ? (showResults ? (isCorrect ? '✓' : '✗') : '✓') : '...'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect-strong rounded-3xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-christmas-gold mb-4 text-center text-shadow">
            Current Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {players
              .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
              .map((player, index) => (
                <motion.div
                  key={player}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-4 text-center border-2 ${
                    index === 0 ? 'border-christmas-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'border-white/20'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{player}</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-christmas-gold to-yellow-300 bg-clip-text text-transparent">
                    {scores[player] || 0} pts
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Next Button */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(220, 20, 60, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextQuestion}
              className="btn-red text-white font-bold py-4 px-12 rounded-full text-xl transition-all hover:brightness-110"
            >
              <span className="flex items-center gap-2">
                {questionNumber < totalQuestions ? (
                  <>
                    ➡️ Next Question
                  </>
                ) : (
                  <>
                    🏆 View Leaderboard
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

