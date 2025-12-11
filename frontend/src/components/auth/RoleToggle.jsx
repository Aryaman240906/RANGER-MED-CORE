import React, { useState } from 'react';
import { User, Activity, ShieldAlert, Lock, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = [
  { 
    id: 'ranger', 
    label: 'Ranger', 
    icon: User, 
    desc: 'Standard Field Operative',
    color: 'text-cyan-400', 
    borderColor: 'border-cyan-500',
    bgActive: 'bg-cyan-500/10',
    shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]'
  },
  { 
    id: 'doctor', 
    label: 'Doctor', 
    icon: Activity, 
    desc: 'Medical Officer (Locked)',
    locked: true,
    version: 'v2.0'
  },
  { 
    id: 'admin', 
    label: 'Admin', 
    icon: ShieldAlert, 
    desc: 'System Overseer (Locked)',
    locked: true,
    version: 'v2.0'
  },
];

export default function RoleToggle({ selectedRole, onSelect }) {
  const [hovered, setHovered] = useState(null);

  const handleRoleClick = (role) => {
    if (!role.locked) {
      onSelect(role.id);
    }
    // If locked, the motion component handles the "shake" via whileTap/animation logic below
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-3">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;
          
          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => handleRoleClick(role)}
              onHoverStart={() => setHovered(role.id)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{ scale: role.locked ? 1 : 1.02 }}
              whileTap={role.locked ? { x: [0, -5, 5, -5, 5, 0] } : { scale: 0.95 }} // Shake if locked
              aria-pressed={isSelected}
              aria-disabled={role.locked}
              className={`
                relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 overflow-hidden group
                ${role.locked 
                  ? 'border-slate-800 bg-slate-900/30 opacity-60 cursor-not-allowed' 
                  : 'cursor-pointer'
                }
                ${isSelected 
                  ? `${role.bgActive} ${role.borderColor} ${role.shadow} border-opacity-100` 
                  : !role.locked && 'bg-slate-900/50 border-slate-700 hover:border-cyan-500/50'
                }
              `}
            >
              {/* --- BACKGROUND TEXTURES --- */}
              {role.locked && (
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none" 
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 10px)' }} 
                />
              )}
              
              {/* --- ICONS & CONTENT --- */}
              <div className="relative z-10">
                {role.locked && (
                  <div className="absolute -top-1 -right-4 text-slate-500 group-hover:text-rose-400 transition-colors">
                    <Lock size={12} />
                  </div>
                )}
                
                <Icon 
                  size={24} 
                  className={`transition-colors duration-300 ${
                    isSelected ? role.color : role.locked ? 'text-slate-600' : 'text-slate-400 group-hover:text-cyan-200'
                  }`} 
                />
              </div>
              
              <span className={`text-[10px] font-mono uppercase tracking-wider relative z-10 transition-colors ${
                isSelected ? 'text-white font-bold' : 'text-slate-500'
              }`}>
                {role.label}
              </span>

              {/* Active Pulse Dot */}
              {isSelected && (
                <span className="absolute top-2 right-2 flex h-1.5 w-1.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${role.color.replace('text-', 'bg-')}`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${role.color.replace('text-', 'bg-')}`}></span>
                </span>
              )}

              {/* Locked "Version" Badge */}
              {role.locked && (
                <div className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {role.version}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* --- CONTEXTUAL INFO / TOOLTIP AREA --- */}
      <div className="h-6 mt-1 flex justify-center items-center">
        <AnimatePresence mode="wait">
          {hovered && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700"
            >
              {roles.find(r => r.id === hovered)?.locked ? (
                 <>
                   <Lock size={10} className="text-rose-400" />
                   <span className="text-rose-300/80">RESTRICTED: FUTURE UPDATE</span>
                 </>
              ) : (
                 <>
                   <ScanLine size={10} className="text-cyan-400" />
                   <span className="text-cyan-300/80">{roles.find(r => r.id === hovered)?.desc}</span>
                 </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}