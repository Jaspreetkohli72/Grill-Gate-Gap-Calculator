'use client';

import React, { useState, useMemo } from 'react';
import {
  calculateRodGaps,
  CalculationInput,
  CalculationResult,
} from '@/utils/calculator';
import { FrameVisualizer } from './FrameVisualizer';
import { MarkingGuide } from './MarkingGuide';
import { SootReferenceTable } from './SootReferenceTable';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  Minus,
  AlertTriangle,
  Info,
  Maximize,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const Calculator: React.FC = () => {
  // Input states
  const [frameInches, setFrameInches] = useState<string>('48');
  const [frameSoot, setFrameSoot] = useState<string>('0');
  const [rodMm, setRodMm] = useState<string>('19'); // 19mm (~3/4")
  const [gapNeededInches, setGapNeededInches] = useState<string>('4');
  const [gapCanBeMore, setGapCanBeMore] = useState<boolean>(true);
  const [manualRodOverride, setManualRodOverride] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute calculation results in real-time
  const calculationResult: CalculationResult = useMemo(() => {
    const input: CalculationInput = {
      frameInches: parseFloat(frameInches) || 0,
      frameSoot: parseFloat(frameSoot) || 0,
      rodMm: parseFloat(rodMm) || 0,
      gapNeededInches: parseFloat(gapNeededInches) || 0,
      gapCanBeMore,
      manualRodAdjustment: manualRodOverride !== null ? manualRodOverride : undefined,
    };
    return calculateRodGaps(input);
  }, [frameInches, frameSoot, rodMm, gapNeededInches, gapCanBeMore, manualRodOverride]);

  const handleReset = () => {
    setFrameInches('48');
    setFrameSoot('0');
    setRodMm('19');
    setGapNeededInches('4');
    setGapCanBeMore(true);
    setManualRodOverride(null);
  };

  const handleApplyPreset = (preset: {
    inches: string;
    soot: string;
    rod: string;
    gap: string;
    canBeMore: boolean;
  }) => {
    setFrameInches(preset.inches);
    setFrameSoot(preset.soot);
    setRodMm(preset.rod);
    setGapNeededInches(preset.gap);
    setGapCanBeMore(preset.canBeMore);
    setManualRodOverride(null);
  };

  const handleCopySummary = () => {
    const text = `--- ROD GAP SPECIFICATION ---\n` +
      `Frame Internal Width: ${calculationResult.frameTotalInches.toFixed(3)}" (${frameInches} in ${frameSoot} soot)\n` +
      `Filler Pipe/Rod Width: ${calculationResult.rodMm} mm (${calculationResult.rodInches.toFixed(3)}")\n` +
      `Target Gap: ${gapNeededInches}"\n\n` +
      `=== RESULTS ===\n` +
      `✓ ${calculationResult.summaryRodsText}\n` +
      `✓ ${calculationResult.summaryGapText} (${calculationResult.gapMm.toFixed(1)} mm)\n` +
      `✓ ${calculationResult.summaryGapsCreatedText}\n` +
      `Center-to-Center Pitch: ${calculationResult.pitchBreakdown.formattedString} (${calculationResult.pitchMm.toFixed(1)} mm)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Preset options for quick fabrication jobs
  const standardPresets = [
    { name: 'Standard Window Grill (48")', inches: '48', soot: '0', rod: '12', gap: '4', canBeMore: true },
    { name: 'Main Gate Panel (60" 4 Soot)', inches: '60', soot: '4', rod: '25.4', gap: '4.5', canBeMore: true },
    { name: 'Balcony Safety Railing (72")', inches: '72', soot: '0', rod: '19', gap: '4', canBeMore: false },
    { name: 'Staircase Baluster (36")', inches: '36', soot: '2', rod: '16', gap: '3.5', canBeMore: false },
  ];

  const standardRodSizes = [
    { label: '10 mm (3/8" rod)', val: '10' },
    { label: '12 mm (1/2" bar)', val: '12' },
    { label: '16 mm (5/8" pipe)', val: '16' },
    { label: '19 mm (3/4" pipe)', val: '19' },
    { label: '25.4 mm (1" pipe)', val: '25.4' },
    { label: '38 mm (1.5" pipe)', val: '38' },
    { label: '50 mm (2" pipe)', val: '50' },
  ];

  const standardGapSizes = ['3', '3.5', '4', '4.5', '5', '6'];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Soot Fabrication Measurement Engine (1 Inch = 8 Soot)
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Grill &amp; Gate Gap Calculator
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Calculate exact rod/pipe counts, equal internal gaps in inches & soot, center-to-center pitch, and tape-measure fabrication layout.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Inputs
            </button>
            <button
              onClick={handleCopySummary}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied Specs!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Output Specs
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Presets Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets:
          </span>
          {standardPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs Left, Primary Outputs Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INPUTS PANEL (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              Fabrication Inputs
            </h2>
            <span className="text-xs text-slate-400 font-mono">1 Inch = 8 Soot</span>
          </div>

          <div className="space-y-5">
            {/* Input 1: Frame Internal Width (2 Number Boxes: Inches and Soot) */}
            <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  1. Frame Internal Width
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Total: {calculationResult.frameTotalInches.toFixed(3)}&quot; ({calculationResult.frameTotalMm.toFixed(1)} mm)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Inches Box */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-300">Inches (Inch)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={frameInches}
                      onChange={(e) => {
                        setFrameInches(e.target.value);
                        setManualRodOverride(null);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="e.g. 48"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">in</span>
                  </div>
                </div>

                {/* Soot Box */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-300">Soot (0 - 7)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="7.99"
                      step="any"
                      value={frameSoot}
                      onChange={(e) => {
                        setFrameSoot(e.target.value);
                        setManualRodOverride(null);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="e.g. 0"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">soot</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <Info className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span>Example: For 48-1/2&quot;, enter <strong>48</strong> inches and <strong>4</strong> soot (4/8 = 1/2&quot;).</span>
              </div>
            </div>

            {/* Input 2: Width of filler material (rod/pipe) (Unit in MM) */}
            <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  2. Filler Material (Rod/Pipe) Width
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {calculationResult.rodInches.toFixed(3)}&quot; ({calculationResult.rodSoot.toFixed(2)} soot)
                </span>
              </div>

              <div className="relative pt-1">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={rodMm}
                  onChange={(e) => {
                    setRodMm(e.target.value);
                    setManualRodOverride(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="e.g. 19"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-cyan-400 font-bold">mm</span>
              </div>

              {/* Quick Rod Size Buttons */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">
                  Common Standard Sizes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {standardRodSizes.map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => {
                        setRodMm(s.val);
                        setManualRodOverride(null);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        rodMm === s.val
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input 3: Internal gap needed (Unit in Inches) */}
            <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  3. Internal Gap Needed
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {( (parseFloat(gapNeededInches) || 0) * 25.4 ).toFixed(1)} mm
                </span>
              </div>

              <div className="relative pt-1">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={gapNeededInches}
                  onChange={(e) => {
                    setGapNeededInches(e.target.value);
                    setManualRodOverride(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="e.g. 4"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-amber-400 font-bold">inches</span>
              </div>

              {/* Quick Gap Buttons */}
              <div className="flex items-center gap-1.5 pt-2">
                <span className="text-[10px] uppercase font-semibold text-slate-400 mr-1">Target:</span>
                {standardGapSizes.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setGapNeededInches(g);
                      setManualRodOverride(null);
                    }}
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all ${
                      gapNeededInches === g
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Input 4: Gap can be more than needed gap (Checkbox) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 transition-all hover:border-slate-700">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="relative flex items-center pt-0.5">
                  <input
                    type="checkbox"
                    checked={gapCanBeMore}
                    onChange={(e) => {
                      setGapCanBeMore(e.target.checked);
                      setManualRodOverride(null);
                    }}
                    className="w-5 h-5 rounded-lg bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500/30 focus:ring-offset-slate-950 rounded cursor-pointer accent-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">
                    Gap can be more than the needed gap
                  </div>
                  <p className="text-xs text-slate-400">
                    {gapCanBeMore ? (
                      <span className="text-emerald-400">
                        ✓ <strong>Checked:</strong> Allows gap to exceed {gapNeededInches}&quot; (calculates fewer rods: <strong>{calculationResult.rodsNeeded} rods</strong>).
                      </span>
                    ) : (
                      <span className="text-amber-400">
                        ⚠ <strong>Unchecked (Max Gap Constraint):</strong> Gap will not exceed {gapNeededInches}&quot; (calculates more rods: <strong>{calculationResult.rodsNeeded} rods</strong>).
                      </span>
                    )}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* PRIMARY OUTPUT RESULTS PANEL (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Warning / Error if doesn't fit */}
          {!calculationResult.isFit && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-rose-300 text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{calculationResult.warningMessage}</span>
            </div>
          )}

          {/* THREE MAIN PROMINENT OUTPUT CARDS (Exact Output Spec) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* OUTPUT 1: "x" rods/pipe needed */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 hover:border-amber-500/70 rounded-3xl p-5 shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
                  Rods / Pipe Count
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>

              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
                  <span>{calculationResult.rodsNeeded}</span>
                  <span className="text-sm font-sans font-medium text-slate-400">rods</span>
                </div>
                <div className="text-xs font-semibold text-amber-300 pt-1">
                  &quot;{calculationResult.rodsNeeded}&quot; rods/pipe needed
                </div>
              </div>

              {/* Interactive Fine-tune Stepper (+ / -) */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Fine-Tune Count:</span>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                  <button
                    onClick={() => setManualRodOverride(Math.max(0, calculationResult.rodsNeeded - 1))}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all"
                    title="Decrease 1 rod"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-white px-2">
                    {calculationResult.rodsNeeded}
                  </span>
                  <button
                    onClick={() => setManualRodOverride(calculationResult.rodsNeeded + 1)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all"
                    title="Increase 1 rod"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* OUTPUT 2: "x" inch "x" soot internal gap between rod/pipe */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/40 hover:border-cyan-500/70 rounded-3xl p-5 shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/90">
                  Internal Gap
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl md:text-3xl font-black text-white font-mono tracking-tight leading-none">
                  {calculationResult.gapBreakdown.wholeInches}&quot; {((calculationResult.gapInches - calculationResult.gapBreakdown.wholeInches) * 8).toFixed(1)} soot
                </div>
                <div className="text-xs font-semibold text-cyan-300 pt-1">
                  &quot;{calculationResult.gapBreakdown.wholeInches}&quot; inch &quot;{((calculationResult.gapInches - calculationResult.gapBreakdown.wholeInches) * 8).toFixed(1)}&quot; soot gap
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  = {calculationResult.gapMm.toFixed(1)} mm ({calculationResult.gapInches.toFixed(3)}&quot;)
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Target: {gapNeededInches}&quot;</span>
                <span className={calculationResult.gapInches >= parseFloat(gapNeededInches) ? 'text-emerald-400 font-semibold' : 'text-cyan-300 font-semibold'}>
                  {calculationResult.gapInches >= parseFloat(gapNeededInches) ? '≥ Target' : '≤ Target'}
                </span>
              </div>
            </div>

            {/* OUTPUT 3: "x" internal gaps created */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700 hover:border-slate-600 rounded-3xl p-5 shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/10 rounded-full blur-2xl group-hover:bg-slate-500/20 transition-all pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Gaps Created
                </span>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
              </div>

              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
                  <span>{calculationResult.internalGapsCreated}</span>
                  <span className="text-sm font-sans font-medium text-slate-400">spaces</span>
                </div>
                <div className="text-xs font-semibold text-slate-300 pt-1">
                  &quot;{calculationResult.internalGapsCreated}&quot; internal gaps created
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Formula:</span>
                <span className="font-mono text-slate-300">{calculationResult.rodsNeeded} rods + 1 = {calculationResult.internalGapsCreated}</span>
              </div>
            </div>

          </div>

          {/* Quick Technical Specs Summary Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Frame Opening</span>
              <span className="font-mono font-bold text-slate-200">
                {calculationResult.frameTotalInches.toFixed(3)}&quot; ({calculationResult.frameTotalMm.toFixed(1)} mm)
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Filler Size</span>
              <span className="font-mono font-bold text-cyan-300">
                {calculationResult.rodMm} mm ({calculationResult.rodInches.toFixed(3)}&quot;)
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Total Rod Space</span>
              <span className="font-mono font-bold text-amber-300">
                {(calculationResult.rodsNeeded * calculationResult.rodInches).toFixed(3)}&quot; ({(calculationResult.rodsNeeded * calculationResult.rodMm).toFixed(1)} mm)
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Center Pitch (C-to-C)</span>
              <span className="font-mono font-bold text-emerald-400">
                {calculationResult.pitchBreakdown.formattedString} ({calculationResult.pitchMm.toFixed(1)} mm)
              </span>
            </div>
          </div>

          {/* Interactive Visualizer Canvas */}
          <FrameVisualizer result={calculationResult} />

        </div>
      </div>

      {/* Workshop Marking Guide & Cut Layout */}
      <MarkingGuide result={calculationResult} />

      {/* Soot Reference Chart & Quick Unit Converter */}
      <SootReferenceTable />
    </div>
  );
};
