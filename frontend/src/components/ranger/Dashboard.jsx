// src/components/ranger/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- STORES ---
import { useDemoStore } from "../../store/demoStore";
import { useAuthStore } from "../../store/authStore";

// --- COMPONENTS ---
import StabilityGauge from './StabilityGauge';
import ReadinessBar from './ReadinessBar';
import AICard from './AICard';
import CapsuleButton from './CapsuleButton'; // Assuming this triggers store actions directly
import SymptomForm from './SymptomForm';     // Assuming this triggers store actions directly
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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

/**
 * 🖥️ MAIN DASHBOARD GRID
 * The primary view for the Ranger Med-Core system.
 * Aggregates Telemetry, Actions, and Logs into a unified tactical view.
 */
const Dashboard = ({ isDemoMode = false }) => {
  const navigate = useNavigate();
  
  // 1. User Context
  const { user } = useAuthStore();

  // 2. Telemetry Stream (Unified Source)
  // We pull from the store regardless of mode. The store handles whether data 
  // comes from the Simulation Engine or User Input.
  const { 
    stability, 
    readiness, 
    riskScore, 
    confidence, 
    trend, 
    events, 
    assistantMessage 
  } = useDemoStore();

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
          status={isDemoMode ? "SIMULATION" : "ACTIVE"} 
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
              data-tour="stability-gauge" // 👈 Tutorial Target
              className="h-full"
            >
              <StabilityGauge value={stability} trend={trend} />
            </motion.div>
            
            {/* Readiness */}
            <motion.div 
              variants={itemVariants}
              data-tour="readiness-bar" // 👈 Tutorial Target
              className="h-full"
            >
              <ReadinessBar value={readiness} />
            </motion.div>
            
            {/* 3D Core (Desktop Only) */}
            <motion.div 
              variants={itemVariants} 
              className="hidden xl:block h-full min-h-[200px]"
            >
              <Hologram3DGauge stability={stability} />
            </motion.div>
          </div>

          {/* B. Cortex Intelligence */}
          <motion.div 
            variants={itemVariants}
            data-tour="ai-card" // 👈 Tutorial Target
          >
            <AICard 
              risk={riskScore} 
              confidence={confidence}
              recommendation={isDemoMode ? "Simulation Running: Monitor telemetry variances." : undefined}
            />
          </motion.div>

          {/* C. Quick Action Deck */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-tour="quick-actions" // 👈 Tutorial Target
          >
            <motion.div variants={itemVariants} onClick={() => navigate('/dose')}>
              <CapsuleButton />
            </motion.div>
            <motion.div variants={itemVariants} onClick={() => navigate('/log')}>
              <SymptomForm /> {/* Note: This might be a mini-version or direct link */}
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
            data-tour="timeline" // 👈 Tutorial Target
          >
            {/* Timeline now handles its own internal filtering/styles 
              based on the unified 'events' array from the store.
            */}
            <Timeline events={events} />
          </motion.div>
        </div>
      </div>

      {/* Floating Assistant (Context Aware) */}
      <AssistantBubble message={assistantMessage} />
      
    </motion.div>
  );
};

export default Dashboard;