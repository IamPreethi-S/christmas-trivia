'use client';

import { motion } from 'framer-motion';

export default function Sparkles() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-2 h-2 rounded-full bg-christmas-gold"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)',
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

