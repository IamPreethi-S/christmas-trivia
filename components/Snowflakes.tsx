'use client';

import { motion } from 'framer-motion';

export default function Snowflakes() {
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 10,
    size: 5 + Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute text-white opacity-60"
          style={{
            left: flake.left,
            fontSize: `${flake.size}px`,
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, Math.random() * 50 - 25],
            rotate: [0, 360],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
}

