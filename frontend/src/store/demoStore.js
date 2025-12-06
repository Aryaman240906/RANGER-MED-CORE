// src/store/demoStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateTickUpdate } from "../services/demoEngine";

// 🛡️ SYSTEM DEFAULTS (Factory Reset State)
const INITIAL_STATE = {
  stability: 76,
  readiness: 88,
  trend: "Stable",
  confidence: 78,
  riskScore: 42,
  events: [],
  assistantMessage: null,
  systemStatus: "ONLINE", // New: Tracks simulated connection health
};

export const useDemoStore = create(
  persist(
    (set, get) => ({
      // =========================================
      // 🌌 SIMULATION ENGINE STATE
      // =========================================
      demoMode: false,
      running: false,
      speed: 1, // 1x (Normal), 2x (Fast), 4x (Overclock)
      scenario: "normal", // calm | normal | aggressive | unstable
      
      // Internal engine ref (not persisted usually, but kept for logic safety)
      _interval: null,

      // =========================================
      // 📊 TELEMETRY DATA STREAMS
      // =========================================
      ...INITIAL_STATE,

      // =========================================
      // 🕹️ ENGINE CONTROL ACTIONS
      // =========================================

      /**
       * 🔵 Toggle Demo Mode
       * Engages/Disengages the simulation protocol.
       */
      toggleDemoMode: () => {
        const { demoMode, stopSimulation, resetSimulation } = get();
        
        if (demoMode) {
          stopSimulation();
          resetSimulation(); // Auto-reset on exit for cleanliness
        }
        
        set({ demoMode: !demoMode });
      },

      /**
       * 🔵 Start Simulation
       * Spins up the event loop based on current speed.
       */
      startSimulation: () => {
        const { _interval, running, speed } = get();
        
        // Prevent duplicate engines running
        if (_interval) clearInterval(_interval);

        const tickRate = 1000 / (speed || 1);

        const interval = setInterval(() => {
          // 1. Snapshot current state
          const currentState = get();
          
          // 2. Calculate next frame via Engine Service
          const update = generateTickUpdate(currentState);

          // 3. Hydrate state with new telemetry
          set(update); 
        }, tickRate);

        set({ running: true, _interval: interval });
      },

      /**
       * 🔵 Stop/Pause Simulation
       * Halts the event loop immediately.
       */
      pauseSimulation: () => {
        const { _interval } = get();
        if (_interval) clearInterval(_interval);
        set({ running: false, _interval: null });
      },

      // Alias for clarity
      stopSimulation: () => get().pauseSimulation(),

      /**
       * 🔵 Reset Simulation
       * Purges all data and restores factory defaults.
       */
      resetSimulation: () => {
        get().pauseSimulation();
        set({ ...INITIAL_STATE });
      },

      // =========================================
      // 🎛️ PARAMETER TUNING
      // =========================================

      /**
       * 🔵 Set Scenario
       * Hot-swaps the active risk profile.
       */
      setScenario: (newScenario) => {
        set({ scenario: newScenario });
        // Optional: Trigger a toast or log here if needed
      },

      /**
       * 🔵 Set Speed (Time Dilation)
       * Hot-swaps the tick rate without stopping the engine.
       */
      setSpeed: (newSpeed) => {
        const { running, startSimulation, pauseSimulation } = get();
        
        // Update state
        set({ speed: newSpeed });

        // If engine was running, restart it immediately with new timing
        if (running) {
          pauseSimulation(); // clear old timer
          startSimulation(); // start new timer
        }
      },

      // =========================================
      // 📡 DATA INGESTION (Internal)
      // =========================================

      /**
       * 🔵 Push Timeline Event
       * Adds a new log entry, capping history at 20 items.
       */
      addEvent: (event) => {
        const { events } = get();
        const timestampedEvent = { ...event, _receivedAt: Date.now() };
        set({ events: [timestampedEvent, ...events].slice(0, 20) });
      },

      /**
       * 🔵 Set Assistant Message
       * updates the hologram bubble text.
       */
      setAssistantMessage: (msg) => set({ assistantMessage: msg }),
    }),
    {
      name: "ranger-demo-storage", // Unique local storage key
      partialize: (state) => ({ 
        // Only persist these fields (don't persist the interval ID!)
        demoMode: state.demoMode,
        scenario: state.scenario,
        speed: state.speed
      }),
    }
  )
);