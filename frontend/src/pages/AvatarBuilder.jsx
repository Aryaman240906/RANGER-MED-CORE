import React, { useState } from 'react';
import NeonButton from '../components/global/NeonButton';

/**
 * AvatarBuilder
 * Simple avatar generator for demo: choose color, icon, export PNG (mock).
 */
export default function AvatarBuilder() {
  const [color, setColor] = useState('#06b6d4');
  const [name, setName] = useState('Ranger');

  const avatarStyle = {
    width: 120,
    height: 120,
    borderRadius: 24,
    background: `linear-gradient(135deg, ${color}33, ${color})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    color: '#052028'
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4">Avatar Builder (Demo)</h2>
      <div className="flex gap-8 items-start">
        <div>
          <div style={avatarStyle}>
            <div style={{ color: 'white', fontSize: 40 }}>{name?.[0] || 'R'}</div>
          </div>

          <div className="mt-4">
            <label className="text-xs text-slate-400">Display Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="block mt-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded" />
          </div>
        </div>

        <div className="flex-1">
          <label className="text-xs text-slate-400">Primary Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="block w-24 h-10 p-0 border-none mt-2" />

          <div className="mt-6 flex gap-3">
            <NeonButton onClick={() => alert('Exporting avatar (demo)')}>Export PNG</NeonButton>
            <NeonButton onClick={() => { setColor('#06b6d4'); setName('Ranger'); }}>Reset</NeonButton>
          </div>
        </div>
      </div>
    </div>
  );
}