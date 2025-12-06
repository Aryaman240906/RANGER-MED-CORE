// src/components/ranger/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';

// --- STORES ---
import { useDemoStore } from "../../store/demoStore";
import { useAuthStore } from "../../store/authStore";   // ✅ FIXED

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


const Dashboard = ({ isDemoMode = false }) => {
  // 1. Get User Info
  const { user } = useAuthStore();

  // 2. Get Live Simulation Data
  const demoState = useDemoStore((s) => ({
    stability: s.stability,
    readiness: s.readiness,
    risk: s.riskScore,
    confidence: s.confidence,
    events: s.events,
    msg: s.assistantMessage,
    trend: s.trend
  }));

  // 3. Define Static Fallback (Standard Mode)
  const staticData = {
    stability: 76,
    readiness: 88,
    risk: 12,
    confidence: 98,
    events: [
      { id: 1, time: "08:00", label: "Capsule Taken", type: "success" },
      { id: 2, time: "12:00", label: "Headache Logged", type: "warning" },
      { id: 3, time: "15:30", label: "Hydration Alert", type: "info" },
      { id: 4, time: "18:00", label: "AI Risk Update", type: "success" }
    ],
    msg: "System Nominal. Waiting for input.",
  };

  // 4. Determine Active Data Source
  const current = isDemoMode ? demoState : staticData;

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6"
    >
      {/* HEADER: Pass active status so header knows if we are Simulating */}
      <motion.div variants={itemVariants}>
        <RangerHeader user={user} status={isDemoMode ? "SIMULATION" : "ACTIVE"} />
      </motion.div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT COLUMN (Metrics & Actions) --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Row - Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <StabilityGauge value={current.stability} trend={current.trend} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              {/* Note: Ensure ReadinessBar accepts 'score' or 'value' prop. Using 'value' to match your old code */}
              <ReadinessBar value={current.readiness} />
            </motion.div>
            
            <motion.div variants={itemVariants} className="hidden xl:block h-full min-h-[140px]">
              {/* We pass stability to control the hologram rotation speed in the future */}
              <Hologram3DGauge stability={current.stability} />
            </motion.div>
          </div>

          {/* AI Card - Responsive to Risk Score */}
          <motion.div variants={itemVariants}>
            <AICard 
              risk={current.risk} 
              confidence={current.confidence}
              recommendation={isDemoMode ? "Telemetry fluctuation detected. Monitor vitals." : undefined}
            />
          </motion.div>

          {/* Action Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <CapsuleButton />
            </motion.div>
            <motion.div variants={itemVariants}>
              <SymptomForm />
            </motion.div>
          </div>

          {/* Badges / Achievements */}
          <motion.div variants={itemVariants}>
            <Badges />
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN (Timeline) --- */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="h-full">
            {/* Pass the dynamic events array */}
            <Timeline events={current.events} />
          </motion.div>
        </div>
      </div>

      {/* Floating Assistant - Always available, updates with context */}
      <AssistantBubble message={current.msg} />
    </motion.div>
  );
};

export default Dashboard;