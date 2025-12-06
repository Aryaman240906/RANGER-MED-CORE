// src/components/global/Confetti.jsx
import { useEffect } from "react";
import { triggerBurst, triggerFireworks } from "../../services/confetti";
import { useDemoStore } from "../../store/demoStore";
import toast from "react-hot-toast";

export default function ConfettiListener() {
  // Listen to the Demo Store for significant events
  const stability = useDemoStore((s) => s.stability);
  const events = useDemoStore((s) => s.events);

  // 1. Trigger on "High Stability" milestone
  useEffect(() => {
    if (stability === 100) {
      triggerFireworks(2000);
      toast.success("MAXIMUM STABILITY REACHED!", {
        icon: "🛡️",
        style: {
          border: "1px solid #22d3ee",
          background: "#0f172a",
          color: "#22d3ee",
        },
      });
    }
  }, [stability]);

  // 2. Trigger on specific "Success" events in the timeline
  useEffect(() => {
    if (events.length > 0) {
      const latest = events[0];
      // If the latest event is a "success" type and happened just now (sanity check)
      if (latest.type === "success") {
        triggerBurst();
      }
    }
  }, [events]);

  // This component renders nothing; it just listens
  return null;
}