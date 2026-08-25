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
  RotateCcw,
  Copy,
  Check,
  Plus,
  Minus,
  Info,
  ShieldAlert,
  Sparkles,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const Calculator: React.FC = () => {
  // Input states initialized as empty string with ghost placeholder '0'
  const [frameInches, setFrameInches] = useState<string>('');
  const [frameSoot, setFrameSoot] = useState<string>('');
  const [rodMm, setRodMm] = useState<string>('');
  const [gapNeededInches, setGapNeededInches] = useState<string>('');
  const [gapCanBeMore, setGapCanBeMore] = useState<boolean>(true);
  const [manualRodOverride, setManualRodOverride] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Check which inputs are provided
  const hasFrame = (parseFloat(frameInches) || 0) > 0 || (parseFloat(frameSoot) || 0) > 0;
  const hasRod = (parseFloat(rodMm) || 0) > 0;
  const hasGap = (parseFloat(gapNeededInches) || 0) > 0;
  const isReady = hasFrame && hasRod && hasGap;

  // Compute calculation results in real-time
  const calculationResult: CalculationResult = useMemo(() => {
    const input: CalculationInput = {
      frameInches: Math.round(parseFloat(frameInches) || 0),
      frameSoot: Math.round(parseFloat(frameSoot) || 0),
      rodMm: Math.round(parseFloat(rodMm) || 0),
      gapNeededInches: parseFloat(gapNeededInches) || 0,
      gapCanBeMore,
      manualRodAdjustment: manualRodOverride !== null ? manualRodOverride : undefined,
    };
    return calculateRodGaps(input);
  }, [frameInches, frameSoot, rodMm, gapNeededInches, gapCanBeMore, manualRodOverride]);

  const handleReset = () => {
    setFrameInches('');
    setFrameSoot('');
    setRodMm('');
    setGapNeededInches('');
    setGapCanBeMore(true);
    setManualRodOverride(null);
  };

  const handleCopySummary = () => {
    if (!isReady) return;
    const text = `--- GRILL & GATE GAP SPECIFICATION ---\n` +
      `Frame Internal Width: ${calculationResult.frameTotalInches} in (${frameInches || '0'} in ${frameSoot || '0'} soot / ${calculationResult.frameTotalMm} mm)\n` +
      `Filler Pipe/Rod Width: ${calculationResult.rodMm} mm\n` +
      `Target Gap: ${gapNeededInches || '0'} in\n\n` +
      `=== RESULTS ===\n` +
      `✓ ${calculationResult.summaryRodsText}\n` +
      `✓ ${calculationResult.summaryGapText} (${calculationResult.gapMm} mm)\n` +
      `✓ ${calculationResult.summaryGapsCreatedText}\n` +
      `Center-to-Center Pitch: ${calculationResult.pitchBreakdown.formattedString} (${calculationResult.pitchMm} mm)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const standardRodSizes = [
    { label: '10 mm (3/8" bar)', val: '10' },
    { label: '12 mm (1/2" bar)', val: '12' },
    { label: '16 mm (5/8" pipe)', val: '16' },
    { label: '19 mm (3/4" pipe)', val: '19' },
    { label: '25 mm (1" pipe)', val: '25' },
    { label: '38 mm (1.5" pipe)', val: '38' },
    { label: '50 mm (2" pipe)', val: '50' },
  ];

  const standardGapSizes = ['3', '3.5', '4', '4.5', '5', '6'];
  const numGapNeeded = parseFloat(gapNeededInches) || 0;

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
              Calculate exact rod/pipe counts, equal internal gaps in rounded whole inches &amp; soot, center-to-center pitch, and tape-measure fabrication layout.
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
            {isReady && (
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
            )}
          </div>
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
                  {hasFrame ? `${frameInches || '0'} in ${frameSoot || '0'} soot (${calculationResult.frameTotalMm} mm)` : 'Required'}
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
                      step="1"
                      placeholder="0"
                      value={frameInches}
                      onChange={(e) => {
                        setFrameInches(e.target.value);
                        setManualRodOverride(null);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 font-mono text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
                      max="7"
                      step="1"
                      placeholder="0"
                      value={frameSoot}
                      onChange={(e) => {
                        setFrameSoot(e.target.value);
                        setManualRodOverride(null);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 font-mono text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
                  {hasRod ? `${calculationResult.rodMm} mm (${calculationResult.rodSoot} soot)` : 'Required'}
                </span>
              </div>

              <div className="relative pt-1">
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={rodMm}
                  onChange={(e) => {
                    setRodMm(e.target.value);
                    setManualRodOverride(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 font-mono text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
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

            {/* Input 3: Internal gap needed (Unit in Inches - Supports decimals like 4.5, 3.5) */}
            <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  3. Internal Gap Needed
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {hasGap
                    ? `${Math.floor(numGapNeeded)} in ${Math.round((numGapNeeded % 1) * 8)} soot (${Math.round(numGapNeeded * 25.4)} mm)`
                    : 'Required'}
                </span>
              </div>

              <div className="relative pt-1">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={gapNeededInches}
                  onChange={(e) => {
                    setGapNeededInches(e.target.value);
                    setManualRodOverride(null);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 font-mono text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-amber-400 font-bold">inches</span>
              </div>

              <div className="text-[11px] text-slate-400 pt-0.5">
                Note: Decimal inches supported (e.g. <strong>4.5</strong> = 4 in 4 soot, <strong>3.5</strong> = 3 in 4 soot).
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
                        ✓ <strong>Checked:</strong> Allows gap to exceed target (calculates fewer rods).
                      </span>
                    ) : (
                      <span className="text-amber-400">
                        ⚠ <strong>Unchecked (Strict Max Limit):</strong> Gap will always stay less than or equal to target.
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
          
          {/* If ANY input is missing: Show message for each missing input */}
          {!isReady ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Awaiting Input Dimensions
                  </h3>
                  <p className="text-xs text-slate-400">
                    Please provide the required values on the left to calculate results and schematic.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Status of Required Inputs:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Frame Input Status */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    hasFrame 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-950 border-amber-500/30 text-amber-300'
                  }`}>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      {hasFrame ? '✓ 1. Frame Width' : '❌ 1. Frame Width'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {hasFrame ? `${frameInches || '0'}" ${frameSoot || '0'} soot` : 'Enter inches and soot'}
                    </div>
                  </div>

                  {/* Filler Input Status */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    hasRod 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-950 border-cyan-500/30 text-cyan-300'
                  }`}>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      {hasRod ? '✓ 2. Filler Width' : '❌ 2. Filler Width'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {hasRod ? `${rodMm} mm` : 'Enter width in mm'}
                    </div>
                  </div>

                  {/* Target Gap Status */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    hasGap 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-950 border-amber-500/30 text-amber-300'
                  }`}>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      {hasGap ? '✓ 3. Target Gap' : '❌ 3. Target Gap'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {hasGap ? `${gapNeededInches}"` : 'Enter gap in inches'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* When ALL inputs are given: Show Full Results, 3 Prominent Cards, Specs, and Visualizer */
            <>
              {/* Warning / Error if doesn't fit */}
              {!calculationResult.isFit && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-rose-300 text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <span>{calculationResult.warningMessage}</span>
                </div>
              )}

              {/* THREE MAIN PROMINENT OUTPUT CARDS (Exact Output Spec - No Decimals) */}
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

                {/* OUTPUT 2: "x" inch "x" soot internal gap between rod/pipe (Strictly Rounded, No Decimals) */}
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
                      {calculationResult.gapBreakdown.wholeInches}&quot; {calculationResult.gapBreakdown.wholeSoot} soot
                    </div>
                    <div className="text-xs font-semibold text-cyan-300 pt-1">
                      &quot;{calculationResult.gapBreakdown.wholeInches}&quot; inch &quot;{calculationResult.gapBreakdown.wholeSoot}&quot; soot gap
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      = {calculationResult.gapMm} mm ({calculationResult.gapBreakdown.totalSoot} soot)
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Target: {gapNeededInches || '0'}&quot;</span>
                    <span className={calculationResult.gapInches >= (parseFloat(gapNeededInches) || 0) ? 'text-emerald-400 font-semibold' : 'text-cyan-300 font-semibold'}>
                      {calculationResult.gapInches >= (parseFloat(gapNeededInches) || 0) ? '≥ Target' : '≤ Target'}
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

              {/* Quick Technical Specs Summary Bar (All Rounded Clean Numbers) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block">Frame Opening</span>
                  <span className="font-mono font-bold text-slate-200">
                    {frameInches || '0'}&quot; {frameSoot || '0'} soot ({calculationResult.frameTotalMm} mm)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block">Filler Size</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {calculationResult.rodMm} mm ({calculationResult.rodSoot} soot)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block">Total Rod Space</span>
                  <span className="font-mono font-bold text-amber-300">
                    {calculationResult.rodsNeeded * calculationResult.rodMm} mm
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block">Center Pitch (C-to-C)</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {calculationResult.pitchBreakdown.formattedString} ({calculationResult.pitchMm} mm)
                  </span>
                </div>
              </div>

              {/* Interactive Visualizer Canvas */}
              <FrameVisualizer
                result={calculationResult}
                inputState={{ frameInches, frameSoot, rodMm, gapNeededInches }}
              />

              {/* Workshop Marking Guide & Cut Layout */}
              <MarkingGuide result={calculationResult} />
            </>
          )}

        </div>
      </div>

      {/* Soot Reference Chart & Quick Unit Converter */}
      <SootReferenceTable />
    </div>
  );
};
