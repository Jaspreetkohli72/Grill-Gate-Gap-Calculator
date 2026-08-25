'use client';

import React, { useState } from 'react';
import { BookOpen, ArrowRightLeft } from 'lucide-react';

export const SootReferenceTable: React.FC = () => {
  const [testSoot, setTestSoot] = useState<string>('4');
  const [testMm, setTestMm] = useState<string>('13');

  const sootTable = [
    { soot: 1, fraction: '1/8"', mm: '3 mm', desc: '1 Soot' },
    { soot: 2, fraction: '1/4" (2/8")', mm: '6 mm', desc: '2 Soot (Quarter)' },
    { soot: 3, fraction: '3/8"', mm: '10 mm', desc: '3 Soot' },
    { soot: 4, fraction: '1/2" (4/8")', mm: '13 mm', desc: '4 Soot (Aadha Inch)' },
    { soot: 5, fraction: '5/8"', mm: '16 mm', desc: '5 Soot' },
    { soot: 6, fraction: '3/4" (6/8")', mm: '19 mm', desc: '6 Soot (Pauna Inch)' },
    { soot: 7, fraction: '7/8"', mm: '22 mm', desc: '7 Soot' },
    { soot: 8, fraction: '1" (8/8")', mm: '25 mm', desc: '1 Full Inch' },
  ];

  const handleSootChange = (val: string) => {
    setTestSoot(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setTestMm(Math.round((num / 8) * 25.4).toString());
    }
  };

  const handleMmChange = (val: string) => {
    setTestMm(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setTestSoot(Math.round((num / 25.4) * 8).toString());
    }
  };

  const currentSootNum = parseFloat(testSoot) || 0;
  const convertedInches = Math.floor(currentSootNum / 8);
  const convertedRemSoot = Math.round(currentSootNum % 8);

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
              Standard Indian &amp; British Imperial Soot Scale (1 Inch = 8 Soot)
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
            <div className="text-xs text-cyan-400 font-semibold font-mono">
              {item.mm}
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
              step="1"
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
              step="1"
              value={testMm}
              onChange={(e) => handleMmChange(e.target.value)}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-cyan-300 font-mono font-bold text-center focus:outline-none focus:border-cyan-500"
            />
            <span className="text-slate-400">MM</span>
          </div>

          <span className="text-slate-500">=</span>

          <div className="text-slate-300 font-mono font-semibold">
            {convertedInches} in {convertedRemSoot} soot
          </div>
        </div>
      </div>
    </div>
  );
};
