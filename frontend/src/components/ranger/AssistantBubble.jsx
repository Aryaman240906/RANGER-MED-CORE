// src/components/ranger/AssistantBubble.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import AssistantPanel from './AssistantPanel';

const AssistantBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center"
        >
          {/* Animated rings */}
          <motion.div
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          />

          {/* Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <MessageCircle className="w-6 h-6 text-white" />
            )}
          </motion.div>

          {/* Notification dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-white font-bold">3</span>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Assistant Panel */}
      <AnimatePresence>
        {isOpen && <AssistantPanel onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default AssistantBubble;