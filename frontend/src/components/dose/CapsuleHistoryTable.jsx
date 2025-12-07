// src/components/dose/CapsuleHistoryTable.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Filter, Calendar, Zap, 
  Activity, Trash2, FileText, ChevronDown 
} from "lucide-react";
import { useDemoStore } from "../../store/demoStore";

// --- HELPERS ---
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
  };
};

const CAPSULE_COLORS = {
  standard: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  booster: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
  emergency: "text-red-400 border-red-500/30 bg-red-500/10"
};

/**
 * 📜 CAPSULE HISTORY LOG
 * A searchable, filterable archive of medication intake.
 */
export default function CapsuleHistoryTable() {
  const events = useDemoStore((s) => s.events);
  const [filter, setFilter] = useState("ALL"); // ALL, 24H, 7D

  // --- DATA PROCESSING ---
  const logs = useMemo(() => {
    const doseEvents = events.filter(e => e.type === "dose");
    const now = new Date();

    if (filter === "24H") {
      const cutoff = new Date(now - 24 * 60 * 60 * 1000);
      return doseEvents.filter(e => new Date(e.timestamp) > cutoff);
    }
    if (filter === "7D") {
      const cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
      return doseEvents.filter(e => new Date(e.timestamp) > cutoff);
    }
    return doseEvents;
  }, [events, filter]);

  // --- ACTIONS ---
  const handleExport = () => {
    const headers = ["Timestamp", "Capsule", "Dosage", "Source"];
    const rows = logs.map(l => [
      l.timestamp, 
      l.capsuleType, 
      l.doseAmount, 
      l.source
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RANGER_DOSE_LOG_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* 1. CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/5 bg-slate-950/30">
        
        {/* Filter Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-white/10">
          {["ALL", "7D", "24H"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-all
                ${filter === f 
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                  : "text-slate-500 hover:text-white"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={logs.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-slate-400 hover:text-cyan-300 transition-all text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Download size={14} />
          <span className="hidden sm:inline group-hover:tracking-widest transition-all duration-300">EXPORT_CSV</span>
        </button>
      </div>

      {/* 2. DATA TABLE HEADER */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-white/5 text-[9px] font-mono text-cyan-500/60 uppercase tracking-widest border-b border-white/5">
        <div className="col-span-4 md:col-span-3">Timestamp</div>
        <div className="col-span-4 md:col-span-3">Payload</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 md:col-span-3 text-right">Telemetry</div>
        <div className="col-span-1"></div> {/* Actions */}
      </div>

      {/* 3. SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        
        {/* Empty State */}
        {logs.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 space-y-4">
            <FileText size={48} className="text-slate-700" />
            <div className="text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No Logs Found</p>
              <p className="text-[10px] font-mono text-slate-600 mt-1">
                Archives empty for selected timeframe.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {logs.map((log, i) => {
            const { date, time } = formatDate(log.timestamp);
            const style = CAPSULE_COLORS[log.capsuleType] || CAPSULE_COLORS.standard;

            return (
              <motion.div
                key={log.timestamp + i} // Unique key fallback
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors group relative"
              >
                {/* Hover Indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Date/Time */}
                <div className="col-span-4 md:col-span-3 flex flex-col">
                  <span className="text-xs font-bold text-slate-300">{date}</span>
                  <span className="text-[10px] font-mono text-slate-500">{time}</span>
                </div>

                {/* Capsule Type */}
                <div className="col-span-4 md:col-span-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${style}`}>
                    {log.capsuleType}
                  </span>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex justify-center">
                  <span className="text-xs font-mono text-slate-400">
                    {log.doseAmount}x
                  </span>
                </div>

                {/* Effect/Telemetry */}
                <div className="col-span-2 md:col-span-3 flex justify-end items-center gap-2">
                  <div className="hidden md:flex gap-0.5">
                    {[1,2,3].map(d => <div key={d} className="w-1 h-2 bg-emerald-500/20 rounded-sm" />)}
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    STABLE
                  </span>
                </div>

                {/* Action (Archive/Delete Placeholder) */}
                <div className="col-span-1 flex justify-end">
                  <button className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 4. FOOTER STATUS */}
      <div className="p-2 border-t border-white/10 bg-slate-950 flex justify-between items-center text-[9px] font-mono text-slate-500">
        <span>RECORDS: {logs.length}</span>
        <div className="flex items-center gap-2">
          <span>ENCRYPTION: AES-256</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-900 border border-emerald-500" />
        </div>
      </div>

    </div>
  );
}