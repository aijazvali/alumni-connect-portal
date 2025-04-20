'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const fullText = 'Welcome to Alumni Connect';

export default function Welcome() {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState(fullText);
  const [isErasing, setIsErasing] = useState(false);
  const [index, setIndex] = useState(fullText.length);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isErasing) {
        if (index > 0) {
          setDisplayedText(fullText.slice(0, index - 1));
          setIndex((prev) => prev - 1);
        } else {
          setIsErasing(false);
        }
      } else {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          setIndex((prev) => prev + 1);
        } else {
          setIsErasing(true);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [index, isErasing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-gray-900 text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Glowing Background Gradient Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1.5 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="absolute w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-30"
        style={{ top: '-100px', left: '-100px' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1.5 }}
        transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
        className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"
        style={{ bottom: '-100px', right: '-100px' }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 max-w-2xl px-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-400 drop-shadow-md min-h-[64px] sm:min-h-[72px]">
        {displayedText}
        <span className="animate-pulse">|</span>
        </h1>


        <p className="text-gray-300 text-lg mb-8">
          Reconnect. Reflect. Reunite. A portal for alumni to share opportunities and memories.
        </p>

        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/login')}
            className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg border border-gray-600 transition"
          >
            Register
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}