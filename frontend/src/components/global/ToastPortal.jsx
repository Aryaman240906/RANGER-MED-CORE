import React from "react";
import { Toaster } from "react-hot-toast";

const ToastPortal = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // --- DEFAULT GLOBAL STYLES ---
        className: 'ranger-toast',
        duration: 4500,
        style: {
          background: "rgba(5, 11, 20, 0.95)", // Deep Space #050b14
          color: "#ecfeff", // Cyan-50
          border: "1px solid rgba(34,211,238,0.2)", // Cyan border
          padding: "16px",
          borderRadius: "8px", // Boxier tech look
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 40px rgba(0,0,0,0.8)", // Deep shadow depth
          fontFamily: 'monospace', // Matches your tech aesthetic
          fontSize: "12px",
          letterSpacing: "0.05em",
          maxWidth: "380px",
          zIndex: 99999,
        },

        // --- SUCCESS STATE (Emerald) ---
        success: {
          iconTheme: {
            primary: "#10b981", 
            secondary: "#050b14", 
          },
          style: {
            border: "1px solid rgba(16, 185, 129, 0.4)",
            boxShadow: "0 0 30px rgba(16, 185, 129, 0.15)", // Green Glow
          },
        },

        // --- ERROR STATE (Rose) ---
        error: {
          iconTheme: {
            primary: "#ef4444", 
            secondary: "#050b14",
          },
          style: {
            border: "1px solid rgba(239, 68, 68, 0.4)",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.15)", // Red Glow
          },
        },

        // --- LOADING STATE (Cyan) ---
        loading: {
          iconTheme: {
            primary: "#22d3ee", 
            secondary: "#050b14",
          },
          style: {
            border: "1px solid rgba(34, 211, 238, 0.4)",
          },
        },
      }}
    />
  );
};

export default ToastPortal;