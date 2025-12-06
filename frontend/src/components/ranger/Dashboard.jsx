// src/components/ranger/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
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

const Dashboard = () => {
  // Mock data
  const mockStability = 76;
  const mockReadiness = 88;
  const mockEvents = [
    { time: "08:00", label: "Capsule Taken", type: "success" },
    { time: "12:00", label: "Headache Logged", type: "warning" },
    { time: "15:30", label: "Hydration Alert", type: "info" },
    { time: "18:00", label: "AI Risk Update", type: "success" }
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)] pointer-events-none" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <RangerHeader />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Row - Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <StabilityGauge value={mockStability} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <ReadinessBar value={mockReadiness} />
              </motion.div>
              <motion.div variants={itemVariants} className="hidden xl:block">
                <Hologram3DGauge />
              </motion.div>
            </div>

            {/* AI Card */}
            <motion.div variants={itemVariants}>
              <AICard />
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

            {/* Badges */}
            <motion.div variants={itemVariants}>
              <Badges />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div variants={itemVariants}>
              <Timeline events={mockEvents} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating Assistant */}
      <AssistantBubble />
    </div>
  );
};

export default Dashboard;