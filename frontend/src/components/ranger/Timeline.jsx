// src/components/ranger/Timeline.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Pill, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const Timeline = ({ events = [] }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Pill;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-cyan-400';
    }
  };

  const getEventBg = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500/10';
      case 'warning': return 'bg-yellow-500/10';
      case 'info': return 'bg-blue-500/10';
      default: return 'bg-cyan-500/10';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 h-fit"
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Today's Timeline</h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {events.map((event, index) => {
          const Icon = getEventIcon(event.type);
          const isLast = index === events.length - 1;

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-cyan-500/50 to-transparent" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`flex-shrink-0 w-12 h-12 rounded-full ${getEventBg(event.type)} flex items-center justify-center border border-slate-700/50 relative`}
                >
                  <Icon className={`w-5 h-5 ${getEventColor(event.type)}`} />
                  
                  {/* Pulse animation for recent events */}
                  {index === 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-full border-2 ${getEventColor(event.type).replace('text-', 'border-')}`}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      {event.label}
                    </span>
                    <span className={`text-xs font-mono ${getEventColor(event.type)}`}>
                      {event.time}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add new event button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 p-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-200 text-sm"
        >
          + Add Event
        </motion.button>
      </motion.div>

      {/* Timeline stats */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">
              {events.filter(e => e.type === 'success').length}
            </div>
            <div className="text-xs text-slate-500">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">
              {events.filter(e => e.type === 'warning').length}
            </div>
            <div className="text-xs text-slate-500">Alerts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-400">{events.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Timeline;