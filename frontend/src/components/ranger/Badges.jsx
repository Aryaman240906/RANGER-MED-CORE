// src/components/ranger/Badges.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, Heart, Brain, Shield } from 'lucide-react';

const Badges = () => {
  const badges = [
    {
      id: 1,
      name: 'Perfect Week',
      description: '7 days of consistent monitoring',
      icon: Target,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      earned: true,
      progress: 100
    },
    {
      id: 2,
      name: 'Stability Master',
      description: 'Maintained 80%+ stability for 30 days',
      icon: Shield,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      earned: true,
      progress: 100
    },
    {
      id: 3,
      name: 'Health Guardian',
      description: 'Logged symptoms consistently',
      icon: Heart,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      earned: true,
      progress: 100
    },
    {
      id: 4,
      name: 'Mind Master',
      description: 'Cognitive performance excellence',
      icon: Brain,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      earned: false,
      progress: 75
    },
    {
      id: 5,
      name: 'Lightning Reflexes',
      description: 'Quick response to alerts',
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      earned: false,
      progress: 45
    },
    {
      id: 6,
      name: 'Elite Ranger',
      description: 'Achieved highest performance tier',
      icon: Award,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      earned: false,
      progress: 20
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const badgeVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Achievements</h3>
        </div>
        <div className="text-sm text-slate-400">
          {badges.filter(b => b.earned).length}/{badges.length} Earned
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.id}
              variants={badgeVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                badge.earned
                  ? `${badge.bg} ${badge.border} ${badge.color}`
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
              }`}
            >
              {badge.earned && (
                <motion.div
                  animate={{ 
                    boxShadow: [
                      `0 0 0 0 ${badge.color.replace('text-', 'rgba(').replace('-400', ', 0.4)')}`,
                      `0 0 0 10px rgba(34, 211, 238, 0)`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl pointer-events-none"
                />
              )}

              <div className="text-center space-y-2">
                <motion.div
                  animate={badge.earned ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: badge.id * 0.2 }}
                  className="mx-auto w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center"
                >
                  <Icon className={`w-6 h-6 ${badge.earned ? badge.color : 'text-slate-600'}`} />
                </motion.div>

                <h4 className={`text-sm font-semibold ${badge.earned ? 'text-white' : 'text-slate-600'}`}>
                  {badge.name}
                </h4>

                <p className={`text-xs ${badge.earned ? 'text-slate-300' : 'text-slate-600'}`}>
                  {badge.description}
                </p>

                {!badge.earned && (
                  <div className="mt-2">
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${badge.progress}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-slate-500 to-slate-400"
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {badge.progress}% Complete
                    </div>
                  </div>
                )}

                {badge.earned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1 }}
                      className="text-white text-xs"
                    >
                      ✓
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Overall Progress</span>
          <span className="text-cyan-400 font-medium">
            {Math.round((badges.filter(b => b.earned).length / badges.length) * 100)}%
          </span>
        </div>
        <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(badges.filter(b => b.earned).length / badges.length) * 100}%` }}
            transition={{ duration: 2, delay: 1 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Badges;