// src/components/log/BioScanForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Save, Image, X, UploadCloud, 
  AlertTriangle, Check, Thermometer, Hash 
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- STORES ---
import { useDemoStore } from "../../store/demoStore";
import { queueAction } from "../../services/localPersistence";

// --- CONFIG ---
const SYMPTOM_TAGS = [
  "Headache", "Fatigue", "Nausea", "Dizziness", 
  "Anxiety", "Brain Fog", "Insomnia", "Pain"
];

/**
 * 🧬 BIO-SCAN FORM
 * The primary interface for logging physiological anomalies.
 */
export default function BioScanForm() {
  const { addSymptom } = useDemoStore();
  
  // Local State
  const [severity, setSeverity] = useState(3); // 1-10
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [attachment, setAttachment] = useState(null); // Preview URL
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ACTIONS ---

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachment(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Simulate Processing
    setTimeout(() => {
      const payload = {
        symptom: selectedTags[0] || "General Malaise",
        tags: selectedTags,
        severity,
        notes,
        image: attachment,
        timestamp: new Date().toISOString()
      };

      // 1. Update State
      addSymptom(payload);
      
      // 2. Persist
      queueAction("symptom", payload);

      // 3. Feedback
      toast.success("BIO-SCAN COMPLETE: Telemetry Logged", {
        icon: "🧬",
        style: {
          background: "#050b14",
          color: "#10b981",
          border: "1px solid #059669"
        }
      });

      // Reset
      setSeverity(3);
      setNotes("");
      setSelectedTags([]);
      setAttachment(null);
      setIsSubmitting(false);
    }, 800);
  };

  // Dynamic Severity Color
  const getSeverityColor = (val) => {
    if (val >= 8) return "#ef4444"; // Red
    if (val >= 5) return "#facc15"; // Yellow
    return "#10b981"; // Green
  };

  const currentColor = getSeverityColor(severity);

  return (
    <div className="h-full flex flex-col p-6 bg-slate-900/40 relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" />
            New Entry
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mt-1">LOG ANOMALY #94-B</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
        
        {/* 1. SEVERITY SLIDER */}
        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-end mb-4">
            <label className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest font-bold flex items-center gap-2">
              <Thermometer size={14} /> Intensity Level
            </label>
            <span className="text-2xl font-mono font-bold" style={{ color: currentColor }}>
              {severity}/10
            </span>
          </div>

          <div className="relative h-6 flex items-center">
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer z-20"
            />
            {/* Visual Track */}
            <div className="absolute w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${(severity / 10) * 100}%`,
                  backgroundColor: currentColor
                }}
              />
            </div>
            {/* Thumb */}
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 rounded-full shadow-[0_0_10px_currentColor] pointer-events-none z-10"
              style={{ 
                left: `calc(${(severity / 10) * 100}% - 8px)`,
                borderColor: currentColor,
                color: currentColor
              }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-600">
            <span>MILD</span>
            <span>MODERATE</span>
            <span>CRITICAL</span>
          </div>
        </div>

        {/* 2. TAG ARRAY */}
        <div>
          <label className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
            <Hash size={12} /> Classify Anomaly
          </label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_TAGS.map(tag => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-200
                    ${isActive 
                      ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                      : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
                    }
                  `}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. NOTES FIELD */}
        <div className="flex-1 min-h-[100px]">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ADDITIONAL CONTEXT..."
            className="w-full h-full bg-[#0a1020] border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-700 resize-none"
          />
        </div>

        {/* 4. ATTACHMENT NODE */}
        <div className="relative">
          {attachment ? (
            <div className="relative w-full h-24 rounded-xl overflow-hidden border border-emerald-500/30 group">
              <img src={attachment} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <button 
                type="button"
                onClick={() => setAttachment(null)}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-red-500 hover:text-white text-slate-300 transition-colors"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]" />
            </div>
          ) : (
            <label className="flex items-center justify-center gap-3 w-full h-12 border border-dashed border-slate-700 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer transition-all group">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <Image size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-emerald-400">
                Attach Visual Data
              </span>
            </label>
          )}
        </div>

      </form>

      {/* FOOTER ACTIONS */}
      <div className="pt-6 border-t border-white/5 mt-auto">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!notes && selectedTags.length === 0)}
          className="
            w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed
            text-black font-black tracking-widest uppercase flex items-center justify-center gap-2
            shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all
          "
        >
          {isSubmitting ? (
            <span className="animate-pulse">Uploading...</span>
          ) : (
            <>
              <UploadCloud size={18} />
              <span>Upload Log</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}