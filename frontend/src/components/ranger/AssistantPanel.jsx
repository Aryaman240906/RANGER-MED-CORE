// src/components/ranger/AssistantPanel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles } from 'lucide-react';

const AssistantPanel = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI health assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const mockSuggestions = [
    "⚠️ Hydration levels low. Drink 300ml water.",
    "🤖 Cognitive load increased after mission.",
    "💊 Next capsule due in 2 hours.",
    "😴 Sleep quality improved by 15% this week.",
    "📊 Stress levels are within normal range."
  ];

  const quickActions = [
    "How am I doing today?",
    "Show my trends",
    "Medication reminder",
    "Sleep analysis"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your recent data, everything looks good! Your stability is at 76% which is within normal range.",
        "I've analyzed your patterns and recommend taking your next capsule in 2 hours for optimal effectiveness.",
        "Your sleep quality has improved by 15% this week. Keep up the good work!",
        "I notice some fatigue patterns. Consider increasing hydration and monitoring stress levels.",
        "Your vital signs are stable. I'll continue monitoring and alert you of any changes."
      ];

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
    handleSend();
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 right-24 w-96 h-[500px] bg-slate-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="p-2 bg-cyan-500/20 rounded-lg"
          >
            <Bot className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-xl ${
              message.type === 'user'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl">
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-slate-700/50">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction(action)}
              className="text-xs px-3 py-1 bg-slate-800 text-slate-400 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-200"
            >
              {action}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AssistantPanel;