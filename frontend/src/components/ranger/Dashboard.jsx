// src/components/ranger/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow'; // Performance optimization

// --- STORES ---
import { useDemoStore } from "../../store/demoStore";
import { useAuthStore } from "../../store/authStore";

// --- COMPONENTS ---
import StabilityGauge from './StabilityGauge';
import ReadinessBar from './ReadinessBar';
import AICard from './AICard';
import CapsuleButton from './CapsuleButton'; 
import SymptomForm from './SymptomForm';
import Timeline from './Timeline';
import AssistantBubble from './AssistantBubble';
import RangerHeader from './RangerHeader';
import Badges from './Badges';
import Hologram3DGauge from './Hologram3DGauge';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.4, ease: "circOut" } 
  }
};

/**
 * 🖥️ MAIN DASHBOARD GRID
 * The primary view for the Ranger Med-Core system.
 * Aggregates Telemetry, Actions, and Logs into a unified tactical view.
 * * INTEGRATION NOTE:
 * This component now acts as a Read-Only Surface for the global dataStore.
 * Actions trigger navigation to specific modules (/dose, /log).
 */
const Dashboard = ({ isDemoMode = false }) => {
  const navigate = useNavigate();
  
  // 1. User Context
  const { user } = useAuthStore();

  // 2. Telemetry Stream (Unified Source via useShallow)
  // We select only the visual metrics needed to render the HUD.
  const { 
    stability, 
    readiness, 
    riskScore, 
    confidence, 
    trend, 
    events, 
    assistantMessage,
    systemStatus 
  } = useDemoStore(
    useShallow(s => ({
      stability: s.stability,
      readiness: s.readiness,
      riskScore: s.riskScore,
      confidence: s.confidence,
      trend: s.trend,
      events: s.events,
      assistantMessage: s.assistantMessage,
      systemStatus: s.systemStatus
    }))
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6 pb-6"
    >
      {/* HEADER HUD */}
      <motion.div variants={itemVariants}>
        <RangerHeader 
          user={user} 
          status={isDemoMode ? "SIMULATION" : systemStatus} 
        />
      </motion.div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT COLUMN (Metrics & Actions) --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* A. Vitals Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Stability */}
            <motion.div 
              variants={itemVariants} 
              data-tour="stability-gauge" 
              className="h-full"
            >
              <StabilityGauge value={stability} trend={trend} />
            </motion.div>
            
            {/* Readiness */}
            <motion.div 
              variants={itemVariants}
              data-tour="readiness-bar"
              className="h-full"
            >
              <ReadinessBar value={readiness} />
            </motion.div>
            
            {/* 3D Core (Desktop Only) */}
            <motion.div 
              variants={itemVariants} 
              className="hidden xl:block h-full min-h-[220px]"
            >
              <Hologram3DGauge stability={stability} />
            </motion.div>
          </div>

          {/* B. Cortex Intelligence */}
          <motion.div 
            variants={itemVariants}
            data-tour="ai-card"
          >
            <AICard 
              risk={riskScore} 
              confidence={confidence}
              // Pass a specific simulation hint if in demo mode
              recommendation={isDemoMode ? "SIMULATION ACTIVE: Monitor telemetry variances." : undefined}
            />
          </motion.div>

          {/* C. Quick Action Deck (Navigation Tiles) */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-tour="quick-actions"
          >
            {/* Dose Module Launcher */}
            <motion.div 
              variants={itemVariants} 
              onClick={() => navigate('/dose')}
              className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] relative z-10"
            >
              {/* Note: CapsuleButton here acts as a visual tile */}
              <CapsuleButton />
            </motion.div>
            
            {/* Bio-Scan Module Launcher */}
            <motion.div 
              variants={itemVariants} 
              onClick={() => navigate('/log')}
              className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] relative z-10"
            >
              {/* Note: SymptomForm here acts as a visual tile */}
              <SymptomForm /> 
            </motion.div>
          </div>

          {/* D. Achievements */}
          <motion.div variants={itemVariants}>
            <Badges />
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN (Timeline Stream) --- */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          <motion.div 
            variants={itemVariants} 
            className="h-full min-h-[500px]"
            data-tour="timeline"
          >
            {/* Timeline now handles its own internal filtering/styles 
                based on the unified 'events' array from the store. 
            */}
            <Timeline events={events} filter="all" />
          </motion.div>
        </div>
      </div>

      {/* Floating Assistant (Context Aware) */}
      <AssistantBubble message={assistantMessage} />
      
    </motion.div>
  );
};

export default Dashboard;