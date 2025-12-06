import React from 'react';
import ThemeSwitcher from '../components/global/ThemeSwitcher';
import NeonButton from '../components/global/NeonButton';
import { Bell } from 'lucide-react';

/**
 * DashboardLayout
 * Re-usable layout wrapper for dashboard pages.
 * Places header, optional side panel, and content area.
 *
 * Usage:
 *  <DashboardLayout>
 *     <YourPageContent />
 *  </DashboardLayout>
 */
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/40">
        <div className="flex items-center gap-4">
          <div className="text-cyan-300 font-extrabold tracking-tight">RANGER • MED-CORE</div>
          <div className="text-xs text-slate-400">Command Center</div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <NeonButton onClick={() => alert('Demo action: Send alert')} className="hidden md:inline-flex">
            <Bell className="w-4 h-4 mr-2" /> Send Alert
          </NeonButton>
        </div>
      </header>

      {/* Main content area */}
      <main className="p-6">
        <div className="max-w-[1300px] mx-auto">{children}</div>
      </main>
    </div>
  );
}