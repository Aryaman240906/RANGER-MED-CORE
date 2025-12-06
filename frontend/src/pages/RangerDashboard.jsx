import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

// Components
import Dashboard from "../components/ranger/Dashboard";
import BottomTabNav from "../components/global/BottomTabNav";
import MobileDoseModal from "../components/ranger/MobileDoseModal";
import MobileSymptomModal from "../components/ranger/MobileSymptomModal";

const RangerDashboard = () => {
  // State for Mobile Modals
  const [doseOpen, setDoseOpen] = useState(false);
  const [symOpen, setSymOpen] = useState(false);

  // Listener for Sync Worker events (Optional: notifies when data hits the backend)
  useEffect(() => {
    const handleSync = (e) => {
      // e.detail comes from the custom event dispatched in registerSyncWorker
      if (e.detail?.type === "synced") {
        // Use a unique ID to prevent toast spam if multiple items sync at once
        toast.success("Data synced with Command.", { id: "sync-success" });
      }
    };

    window.addEventListener("syncworker", handleSync);
    return () => window.removeEventListener("syncworker", handleSync);
  }, []);

  return (
    // Added 'pb-24' to ensure content isn't hidden behind the fixed Bottom Nav
    <div className="min-h-screen bg-slate-950 relative overflow-hidden pb-24">
      
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

      {/* --- MAIN CONTENT --- */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10"
      >
        <Dashboard />
      </motion.div>

      {/* --- MOBILE OVERLAYS & NAV --- */}
      {/* These render on top of everything */}
      <MobileDoseModal open={doseOpen} onClose={() => setDoseOpen(false)} />
      <MobileSymptomModal open={symOpen} onClose={() => setSymOpen(false)} />

      <BottomTabNav 
        onOpenDose={() => setDoseOpen(true)} 
        onOpenSymptom={() => setSymOpen(true)} 
      />

      {/* --- TOAST NOTIFICATIONS --- */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(15,23,42,0.9)",
            color: "#e0faff",
            border: "1px solid rgba(34,211,238,0.35)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          },
        }}
      />
    </div>
  );
};

export default RangerDashboard;