'use client';

import { motion } from 'framer-motion';
import { Question } from '@/data/triviaQuestions';
import { useState, useEffect } from 'react';

interface GameProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  players: string[];
  scores: Record<string, number>;
  onAnswer: (playerName: string, answerIndex: number) => void;
  onNextQuestion: () => void;
}

export default function Game({
  question,
  questionNumber,
  totalQuestions,
  players,
  scores,
  onAnswer,
  onNextQuestion,
}: GameProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    setSelectedAnswers({});
    setShowResults(false);
    setTimeLeft(30);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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
      setSelectedAnswers({ ...selectedAnswers, [playerName]: answerIndex });
      onAnswer(playerName, answerIndex);
    }
  };

  const allAnswered = players.every((player) => selectedAnswers[player] !== undefined);
  
  useEffect(() => {
    if (allAnswered && !showResults) {
      const timer = setTimeout(() => setShowResults(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [allAnswered, showResults]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xl font-semibold text-christmas-gold">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-xl font-semibold text-christmas-gold">
              ⏱️ {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              className="bg-christmas-gold h-3 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 md:p-12 mb-8"
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              className="text-5xl mb-4"
            >
              🎬
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-christmas-gold mb-4 text-shadow">
              {question.movie}
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
                  disabled={showResults}
                  className={`p-6 rounded-2xl text-left transition-all ${
                    showResults
                      ? isCorrect
                        ? 'bg-green-500/50 border-2 border-green-400'
                        : 'bg-red-500/30 border-2 border-red-400'
                      : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-effect rounded-3xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-christmas-gold mb-4 text-center">
            Current Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {players
              .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
              .map((player) => (
                <div
                  key={player}
                  className="bg-white/10 rounded-lg p-3 text-center"
                >
                  <div className="text-sm font-semibold">{player}</div>
                  <div className="text-lg font-bold text-christmas-gold">
                    {scores[player] || 0}
                  </div>
                </div>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNextQuestion}
              className="bg-christmas-red hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-colors"
            >
              {questionNumber < totalQuestions ? 'Next Question' : 'View Results'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

