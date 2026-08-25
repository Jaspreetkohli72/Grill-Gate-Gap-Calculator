'use client';

import React, { useState } from 'react';
import { CalculationResult } from '@/utils/calculator';
import { Layers, Eye, Maximize2, HelpCircle } from 'lucide-react';

interface FrameVisualizerProps {
  result: CalculationResult;
}

export const FrameVisualizer: React.FC<FrameVisualizerProps> = ({ result }) => {
  const [hoveredRod, setHoveredRod] = useState<number | null>(null);
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);
  const [showMarkings, setShowMarkings] = useState<boolean>(true);
  const [showPitch, setShowPitch] = useState<boolean>(false);

  const {
    frameTotalInches,
    rodInches,
    gapInches,
    rodsNeeded,
    internalGapsCreated,
    gapBreakdown,
    pitchBreakdown,
    markings,
  } = result;

  if (frameTotalInches <= 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        Enter frame width to preview schematic.
      </div>
    );
  }

  // SVG Dimensioning
  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingTop = 50;
  const frameDrawWidth = svgWidth - paddingX * 2;
  const frameDrawHeight = 120;
  const frameBorderThickness = 12;

  // Scale factor (pixels per inch)
  const scale = frameDrawWidth / frameTotalInches;
  const scaledRodWidth = Math.max(2, rodInches * scale);
  const scaledGap = gapInches * scale;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-md">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
              Interactive 2D Frame & Rod Visualizer
            </h3>
            <p className="text-xs text-slate-400">
              Proportional preview of frame, internal gaps, and rods
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMarkings(!showMarkings)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              showMarkings
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {showMarkings ? 'Hide Markings' : 'Show Markings'}
          </button>
          <button
            type="button"
            onClick={() => setShowPitch(!showPitch)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              showPitch
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {showPitch ? 'Center Pitch' : 'Gap Dimensions'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto bg-slate-950 rounded-xl border border-slate-800/80 p-2 md:p-4">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[600px] select-none"
        >
          <defs>
            {/* Metal Linear Gradient for Rods */}
            <linearGradient id="rodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="30%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Active Hover Rod Gradient */}
            <linearGradient id="rodHoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Frame Outer Pattern */}
            <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Gap Area Pattern */}
            <pattern id="gapGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="8" y2="8" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>

            <marker
              id="arrowhead-cyan"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <polygon points="0 1, 4 3, 0 5" fill="#06b6d4" />
            </marker>
            <marker
              id="arrowhead-amber"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <polygon points="0 1, 4 3, 0 5" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Top Overall Frame Dimension Line */}
          <g>
            <line
              x1={paddingX}
              y1={20}
              x2={paddingX + frameDrawWidth}
              y2={20}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <line x1={paddingX} y1={12} x2={paddingX} y2={28} stroke="#64748b" strokeWidth="1.5" />
            <line
              x1={paddingX + frameDrawWidth}
              y1={12}
              x2={paddingX + frameDrawWidth}
              y2={28}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <rect
              x={svgWidth / 2 - 110}
              y={10}
              width={220}
              height={20}
              fill="#0f172a"
              rx={4}
              stroke="#334155"
              strokeWidth="1"
            />
            <text
              x={svgWidth / 2}
              y={24}
              fill="#e2e8f0"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              className="font-mono"
            >
              FRAME INNER: {frameTotalInches.toFixed(3)}&quot; ({Math.floor(frameTotalInches)}&quot; {((frameTotalInches % 1) * 8).toFixed(1)} soot)
            </text>
          </g>

          {/* Outer Frame Box */}
          <rect
            x={paddingX - frameBorderThickness}
            y={paddingTop - frameBorderThickness}
            width={frameDrawWidth + frameBorderThickness * 2}
            height={frameDrawHeight + frameBorderThickness * 2}
            fill="url(#frameGradient)"
            stroke="#475569"
            strokeWidth="1.5"
            rx="4"
          />

          {/* Inner Clear Opening */}
          <rect
            x={paddingX}
            y={paddingTop}
            width={frameDrawWidth}
            height={frameDrawHeight}
            fill="#020617"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Render Gaps & Rods */}
          {Array.from({ length: internalGapsCreated }).map((_, gapIdx) => {
            const gapLeftX = paddingX + gapIdx * (scaledGap + scaledRodWidth);
            const isHovered = hoveredGap === gapIdx;

            return (
              <g
                key={`gap-${gapIdx}`}
                onMouseEnter={() => setHoveredGap(gapIdx)}
                onMouseLeave={() => setHoveredGap(null)}
                className="cursor-pointer"
              >
                {/* Gap background highlight on hover */}
                <rect
                  x={gapLeftX}
                  y={paddingTop}
                  width={scaledGap}
                  height={frameDrawHeight}
                  fill={isHovered ? 'rgba(6, 182, 212, 0.15)' : 'url(#gapGrid)'}
                  stroke={isHovered ? '#06b6d4' : 'transparent'}
                  strokeWidth="1"
                />

                {/* Gap index label inside gap */}
                {scaledGap > 24 && (
                  <text
                    x={gapLeftX + scaledGap / 2}
                    y={paddingTop + frameDrawHeight / 2}
                    fill={isHovered ? '#22d3ee' : '#475569'}
                    fontSize="10"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono font-medium"
                  >
                    G{gapIdx + 1}
                  </text>
                )}

                {/* Dimension line under or above for gap */}
                {showMarkings && !showPitch && (gapIdx === 0 || gapIdx === internalGapsCreated - 1 || isHovered) && (
                  <g>
                    <line
                      x1={gapLeftX}
                      y1={paddingTop + frameDrawHeight + 15}
                      x2={gapLeftX + scaledGap}
                      y2={paddingTop + frameDrawHeight + 15}
                      stroke="#06b6d4"
                      strokeWidth="1"
                    />
                    <text
                      x={gapLeftX + scaledGap / 2}
                      y={paddingTop + frameDrawHeight + 28}
                      fill="#22d3ee"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {gapBreakdown.formattedString}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Rods */}
          {Array.from({ length: rodsNeeded }).map((_, rodIdx) => {
            const rodLeftX = paddingX + (rodIdx + 1) * scaledGap + rodIdx * scaledRodWidth;
            const isHovered = hoveredRod === rodIdx;
            const marking = markings[rodIdx];

            return (
              <g
                key={`rod-${rodIdx}`}
                onMouseEnter={() => setHoveredRod(rodIdx)}
                onMouseLeave={() => setHoveredRod(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Rod Body */}
                <rect
                  x={rodLeftX}
                  y={paddingTop + 1}
                  width={scaledRodWidth}
                  height={frameDrawHeight - 2}
                  fill={isHovered ? 'url(#rodHoverGradient)' : 'url(#rodGradient)'}
                  stroke={isHovered ? '#fbbf24' : '#1e293b'}
                  strokeWidth="1"
                  rx="2"
                />

                {/* Rod number badge */}
                {scaledRodWidth >= 14 ? (
                  <text
                    x={rodLeftX + scaledRodWidth / 2}
                    y={paddingTop + 16}
                    fill="#0f172a"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {rodIdx + 1}
                  </text>
                ) : null}

                {/* Tape Measure Offset Marker below frame */}
                {showMarkings && marking && (
                  <g>
                    <line
                      x1={rodLeftX + scaledRodWidth / 2}
                      y1={paddingTop + frameDrawHeight}
                      x2={rodLeftX + scaledRodWidth / 2}
                      y2={paddingTop + frameDrawHeight + 45}
                      stroke={isHovered ? '#f59e0b' : '#334155'}
                      strokeWidth="1"
                      strokeDasharray={isHovered ? 'none' : '2 2'}
                    />
                    {isHovered && (
                      <g>
                        <rect
                          x={rodLeftX + scaledRodWidth / 2 - 45}
                          y={paddingTop + frameDrawHeight + 46}
                          width={90}
                          height={24}
                          fill="#0f172a"
                          stroke="#f59e0b"
                          strokeWidth="1"
                          rx="4"
                        />
                        <text
                          x={rodLeftX + scaledRodWidth / 2}
                          y={paddingTop + frameDrawHeight + 62}
                          fill="#fbbf24"
                          fontSize="9.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="font-mono"
                        >
                          CL: {marking.centerSootString}
                        </text>
                      </g>
                    )}
                  </g>
                )}
              </g>
            );
          })}

          {/* Center-to-Center Pitch Indicator if enabled */}
          {showPitch && rodsNeeded >= 2 && (
            <g>
              {Array.from({ length: rodsNeeded - 1 }).map((_, pIdx) => {
                const center1 = paddingX + (pIdx + 1) * scaledGap + pIdx * scaledRodWidth + scaledRodWidth / 2;
                const center2 = paddingX + (pIdx + 2) * scaledGap + (pIdx + 1) * scaledRodWidth + scaledRodWidth / 2;
                const midX = (center1 + center2) / 2;

                return (
                  <g key={`pitch-${pIdx}`}>
                    <line
                      x1={center1}
                      y1={paddingTop + frameDrawHeight + 15}
                      x2={center2}
                      y2={paddingTop + frameDrawHeight + 15}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    <circle cx={center1} cy={paddingTop + frameDrawHeight + 15} r="2.5" fill="#f59e0b" />
                    <circle cx={center2} cy={paddingTop + frameDrawHeight + 15} r="2.5" fill="#f59e0b" />
                    <text
                      x={midX}
                      y={paddingTop + frameDrawHeight + 30}
                      fill="#fbbf24"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono font-bold"
                    >
                      PITCH: {pitchBreakdown.formattedString}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Visualizer Legend / Helper Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/60 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-slate-400 to-slate-200 inline-block border border-slate-600"></span>
            <span>Rods ({result.rodMm}mm / {result.rodInches.toFixed(3)}&quot;)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-950 border border-cyan-500/50 inline-block"></span>
            <span>Gaps ({result.gapBreakdown.formattedString})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Hover over rods or gaps for live layout measurements</span>
        </div>
      </div>
    </div>
  );
};
