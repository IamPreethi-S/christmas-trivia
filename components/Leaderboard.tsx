'use client';

import { motion } from 'framer-motion';
import Snowflakes from '@/components/Snowflakes';
import Sparkles from '@/components/Sparkles';

interface LeaderboardProps {
  players: string[];
  scores: Record<string, number>;
  onReset: () => void;
}

export default function Leaderboard({ players, scores, onReset }: LeaderboardProps) {
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
        className="glass-effect-strong rounded-3xl p-8 md:p-12 max-w-3xl w-full text-center relative z-20"
      >
        <div className="relative inline-block mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-7xl md:text-8xl relative z-10"
          >
            🏆
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-christmas-gold rounded-full blur-3xl"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-shadow-lg">
          <span className="bg-gradient-to-r from-christmas-gold via-yellow-300 to-christmas-gold bg-clip-text text-transparent">
            Final Leaderboard
          </span>
        </h1>
        
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold text-christmas-gold mb-4 text-shadow">Final Scores</h2>
          {sortedPlayers.map((player, index) => {
            const playerScore = scores[player] || 0;
            const isWinner = index === 0 && playerScore === maxScore;
            
            return (
              <motion.div
                key={player}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                className={`glass-effect rounded-xl p-6 ${
                  isWinner 
                    ? 'border-4 border-christmas-gold bg-gradient-to-r from-christmas-gold/20 to-yellow-300/20 shadow-[0_0_30px_rgba(255,215,0,0.5)]' 
                    : 'border-2 border-white/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-christmas-gold w-12">
                      #{index + 1}
                    </span>
                    <span className="text-xl font-semibold flex items-center gap-2">
                      {isWinner && (
                        <motion.span
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          👑
                        </motion.span>
                      )}
                      {player}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-christmas-gold to-yellow-300 bg-clip-text text-transparent">
                      {playerScore} pts
                    </div>
                    {isWinner && (
                      <div className="text-sm text-christmas-gold font-semibold mt-1">
                        Winner! 🎉
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(220, 20, 60, 0.6)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
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

