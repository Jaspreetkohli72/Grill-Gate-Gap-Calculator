'use client';

import React, { useState } from 'react';
import { CalculationResult } from '@/utils/calculator';
import { Ruler, Copy, Check, ListOrdered, Sparkles } from 'lucide-react';

interface MarkingGuideProps {
  result: CalculationResult;
}

export const MarkingGuide: React.FC<MarkingGuideProps> = ({ result }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeUnit, setActiveUnit] = useState<'soot' | 'mm' | 'both'>('both');

  const { markings, rodsNeeded, gapBreakdown, rodMm, frameTotalInches } = result;

  if (rodsNeeded === 0) {
    return null;
  }

  const handleCopyText = () => {
    let text = `--- ROD GAP FABRICATION SHEET ---\n`;
    text += `Frame Inner Width: ${frameTotalInches.toFixed(3)}" (${Math.floor(frameTotalInches)}" ${((frameTotalInches % 1) * 8).toFixed(1)} soot)\n`;
    text += `Rods Needed: ${rodsNeeded} rods (${rodMm} mm)\n`;
    text += `Internal Gap: ${gapBreakdown.formattedString} (${result.gapMm.toFixed(1)} mm)\n`;
    text += `Internal Gaps Created: ${result.internalGapsCreated}\n\n`;
    text += `Tape Measure Marking Positions (From Left Frame Inner Edge):\n`;

    markings.forEach((m) => {
      text += `Rod #${m.rodIndex}: Left Edge = ${m.leftEdgeSootString} (${m.leftEdgeMm.toFixed(1)}mm) | Center = ${m.centerSootString} (${m.centerMm.toFixed(1)}mm)\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
              Workshop Marking & Layout Guide
              <span className="text-[10px] uppercase tracking-wider bg-cyan-500/20 text-cyan-300 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30">
                Tape Measure Offsets
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Hook tape measure to internal left frame edge and mark these positions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setActiveUnit('both')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeUnit === 'both' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Units
            </button>
            <button
              onClick={() => setActiveUnit('soot')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeUnit === 'soot' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inch & Soot
            </button>
            <button
              onClick={() => setActiveUnit('mm')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeUnit === 'mm' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              MM
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Specs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
              <th className="py-3 px-4 font-semibold text-slate-300">Rod #</th>
              <th className="py-3 px-4 font-semibold text-cyan-400">Left Edge (Start)</th>
              <th className="py-3 px-4 font-semibold text-amber-400">Centerline (Punch Point)</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Right Edge (End)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {markings.map((m) => (
              <tr key={m.rodIndex} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-2.5 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-amber-400 font-sans">
                    {m.rodIndex}
                  </span>
                  Rod {m.rodIndex}
                </td>
                
                {/* Left Edge */}
                <td className="py-2.5 px-4">
                  {activeUnit !== 'mm' && (
                    <div className="font-semibold text-cyan-300">{m.leftEdgeSootString}</div>
                  )}
                  {activeUnit !== 'soot' && (
                    <div className="text-[11px] text-slate-400">{m.leftEdgeMm.toFixed(1)} mm</div>
                  )}
                </td>

                {/* Center Line */}
                <td className="py-2.5 px-4">
                  {activeUnit !== 'mm' && (
                    <div className="font-bold text-amber-300">{m.centerSootString}</div>
                  )}
                  {activeUnit !== 'soot' && (
                    <div className="text-[11px] text-amber-500/80">{m.centerMm.toFixed(1)} mm</div>
                  )}
                </td>

                {/* Right Edge */}
                <td className="py-2.5 px-4">
                  {activeUnit !== 'mm' && (
                    <div className="text-slate-300">{m.rightEdgeSootString}</div>
                  )}
                  {activeUnit !== 'soot' && (
                    <div className="text-[11px] text-slate-400">{m.rightEdgeMm.toFixed(1)} mm</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
