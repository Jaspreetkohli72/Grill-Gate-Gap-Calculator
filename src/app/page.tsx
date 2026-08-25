'use client';

import React from 'react';
import { Calculator } from '@/components/Calculator';
import { Shield, Wrench, Sparkles, Scale, Info } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/icon.png"
              alt="Grill & Gate Gap Calculator Logo"
              className="w-10 h-10 rounded-xl shadow-lg shadow-amber-500/10 border border-slate-700/80 object-cover"
            />
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                Grill &amp; Gate Gap Calculator
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Equal internal spacing for grill, gate, railing, and baluster fabrication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">1 Inch =</span>
            <span className="font-bold text-amber-400">8 Soot</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex-grow">
        <Calculator />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500/80" />
            <span>Fabrication & Workshop Precision Engineering Tool</span>
          </div>
          <div className="font-mono text-[11px]">
            1 Soot = 1/8&quot; (0.125&quot; / 3.175 mm) • 1 Inch = 8 Soot (25.4 mm)
          </div>
        </div>
      </footer>
    </main>
  );
}
