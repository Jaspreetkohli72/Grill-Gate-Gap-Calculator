'use client';

import React, { useState } from 'react';
import { BookOpen, ArrowRightLeft, Calculator as CalcIcon } from 'lucide-react';

export const SootReferenceTable: React.FC = () => {
  const [testSoot, setTestSoot] = useState<string>('4');
  const [testMm, setTestMm] = useState<string>('12.7');

  const sootTable = [
    { soot: 1, fraction: '1/8"', decimal: '0.125"', mm: '3.175 mm', desc: '1 Soot' },
    { soot: 2, fraction: '1/4" (2/8")', decimal: '0.250"', mm: '6.350 mm', desc: '2 Soot (Quarter)' },
    { soot: 3, fraction: '3/8"', decimal: '0.375"', mm: '9.525 mm', desc: '3 Soot' },
    { soot: 4, fraction: '1/2" (4/8")', decimal: '0.500"', mm: '12.700 mm', desc: '4 Soot (Aadha Inch)' },
    { soot: 5, fraction: '5/8"', decimal: '0.625"', mm: '15.875 mm', desc: '5 Soot' },
    { soot: 6, fraction: '3/4" (6/8")', decimal: '0.750"', mm: '19.050 mm', desc: '6 Soot (Pauna Inch)' },
    { soot: 7, fraction: '7/8"', decimal: '0.875"', mm: '22.225 mm', desc: '7 Soot' },
    { soot: 8, fraction: '1" (8/8")', decimal: '1.000"', mm: '25.400 mm', desc: '1 Full Inch' },
  ];

  const handleSootChange = (val: string) => {
    setTestSoot(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setTestMm(((num / 8) * 25.4).toFixed(2));
    }
  };

  const handleMmChange = (val: string) => {
    setTestMm(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setTestSoot(((num / 25.4) * 8).toFixed(2));
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base md:text-lg">
              Soot ↔ Inch ↔ MM Conversion Chart
            </h3>
            <p className="text-xs text-slate-400">
              Standard Indian & British Imperial Soot Scale (1 Inch = 8 Soot)
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Soot values */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {sootTable.map((item) => (
          <div
            key={item.soot}
            className="bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/40 rounded-xl p-3 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-amber-400 font-bold text-sm group-hover:text-amber-300">
                {item.soot} Soot
              </span>
              <span className="text-xs font-mono bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded">
                {item.fraction}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              <div>{item.decimal}</div>
              <div className="text-cyan-400/90 font-semibold">{item.mm}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Interactive Mini Converter */}
      <div className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          <span>Quick Converter:</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="any"
              value={testSoot}
              onChange={(e) => handleSootChange(e.target.value)}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-amber-300 font-mono font-bold text-center focus:outline-none focus:border-amber-500"
            />
            <span className="text-slate-400">Soot</span>
          </div>

          <span className="text-slate-500">=</span>

          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="any"
              value={testMm}
              onChange={(e) => handleMmChange(e.target.value)}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-cyan-300 font-mono font-bold text-center focus:outline-none focus:border-cyan-500"
            />
            <span className="text-slate-400">MM</span>
          </div>

          <span className="text-slate-500">=</span>

          <div className="text-slate-300 font-mono">
            {((parseFloat(testSoot) || 0) / 8).toFixed(3)}&quot; Inches
          </div>
        </div>
      </div>
    </div>
  );
};
