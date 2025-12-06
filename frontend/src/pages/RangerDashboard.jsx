// src/pages/RangerDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

// FIXED: Correct import path + correct casing
import Dashboard from "../components/ranger/Dashboard"; 

const RangerDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      
      {/* --- BACKGROUND LAYERS --- */}
      {/* Soft radial highlight */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_rgba(2,6,23,1))]" />

      {/* Neon grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2322d3ee' stroke-opacity='0.08' stroke-width='1'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* --- CONTENT --- */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10"
      >
        <Dashboard />
      </motion.div>

      {/* --- TOAST NOTIFICATIONS --- */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(15,23,42,0.8)",
            color: "#e0faff",
            border: "1px solid rgba(34,211,238,0.35)",
            borderRadius: "10px",
            backdropFilter: "blur(6px)",
          },
        }}
      />
    </div>
  );
};

export default RangerDashboard;
