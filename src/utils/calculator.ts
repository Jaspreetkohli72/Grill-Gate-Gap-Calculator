export interface CalculationInput {
  frameInches: number;
  frameSoot: number;
  rodMm: number;
  gapNeededInches: number;
  gapCanBeMore: boolean;
  manualRodAdjustment?: number; // delta or override if user adjusts
}

export interface SootBreakdown {
  wholeInches: number;
  wholeSoot: number;
  totalSoot: number;
  formattedString: string;
  detailedDisplay: string;
}

export interface MarkingPosition {
  rodIndex: number;
  leftEdgeInches: number;
  leftEdgeSootString: string;
  leftEdgeMm: number;
  centerInches: number;
  centerSootString: string;
  centerMm: number;
  rightEdgeInches: number;
  rightEdgeSootString: string;
  rightEdgeMm: number;
}

export interface CalculationResult {
  // Frame metrics
  frameTotalInches: number;
  frameTotalMm: number;
  frameTotalSoot: number;
  
  // Rod metrics
  rodInches: number;
  rodMm: number;
  rodSoot: number;
  
  // Computed values
  idealRods: number;
  rodsNeeded: number;
  internalGapsCreated: number;
  
  // Gap metrics
  gapInches: number;
  gapMm: number;
  gapSoot: number;
  gapBreakdown: SootBreakdown;
  
  // Pitch (center to center)
  pitchInches: number;
  pitchMm: number;
  pitchSoot: number;
  pitchBreakdown: SootBreakdown;
  
  // Summary outputs as requested
  summaryRodsText: string;
  summaryGapText: string;
  summaryGapsCreatedText: string;
  
  // Fabrication markings
  markings: MarkingPosition[];
  
  // Status / warnings
  isFit: boolean;
  warningMessage?: string;
}

/**
 * Converts any inches value into clean integer Inches and integer Soot
 * Rule: 1 inch = 8 soot.
 * All soot values are strictly rounded off to nearest integer (e.g. 1.8 -> 2 soot, 1.2 -> 1 soot).
 * No decimals appear anywhere.
 */
export function convertInchesToSootBreakdown(totalInches: number): SootBreakdown {
  if (isNaN(totalInches) || totalInches <= 0) {
    return {
      wholeInches: 0,
      wholeSoot: 0,
      totalSoot: 0,
      formattedString: '0 inch 0 soot',
      detailedDisplay: '0" 0 soot',
    };
  }

  // Strictly round total soot to nearest whole integer
  const roundedTotalSoot = Math.round(totalInches * 8);
  const wholeInches = Math.floor(roundedTotalSoot / 8);
  const wholeSoot = roundedTotalSoot % 8;

  const formattedString = `${wholeInches} inch ${wholeSoot} soot`;
  const detailedDisplay = `${wholeInches}" ${wholeSoot} soot`;

  return {
    wholeInches,
    wholeSoot,
    totalSoot: roundedTotalSoot,
    formattedString,
    detailedDisplay,
  };
}

export function formatInchesToSootString(inches: number): string {
  const breakdown = convertInchesToSootBreakdown(inches);
  return breakdown.formattedString;
}

export function calculateRodGaps(input: CalculationInput): CalculationResult {
  const safeFrameInches = Math.max(0, Math.round(input.frameInches || 0));
  const safeFrameSoot = Math.max(0, Math.round(input.frameSoot || 0));
  const safeRodMm = Math.max(0, Math.round(input.rodMm || 0));
  const safeGapNeededInches = Math.max(0, Math.round(input.gapNeededInches || 0));

  // 1. Total frame width in inches
  // 1 inch = 8 soot, so frameSoot / 8 gives additional inches
  const frameTotalInches = safeFrameInches + (safeFrameSoot / 8);
  const frameTotalMm = Math.round(frameTotalInches * 25.4);
  const frameTotalSoot = Math.round(frameTotalInches * 8);

  // 2. Filler material width
  const rodInches = safeRodMm > 0 ? safeRodMm / 25.4 : 0;
  const rodSoot = Math.round(rodInches * 8);

  // 3. Number of rods calculation
  // Formula:
  // (N + 1) * Gap + N * Rod = FrameWidth
  // FrameWidth - Gap = N * (Rod + Gap)
  // N_ideal = (FrameWidth - Gap_needed) / (Rod + Gap_needed)
  let idealRods = 0;
  let computedRods = 0;

  if (frameTotalInches > 0 && (rodInches + safeGapNeededInches) > 0) {
    idealRods = (frameTotalInches - safeGapNeededInches) / (rodInches + safeGapNeededInches);
    
    if (idealRods <= 0) {
      computedRods = 0;
    } else {
      if (input.gapCanBeMore) {
        // If gap can be more than needed: round down rod count (fewer rods => larger gap)
        computedRods = Math.floor(idealRods);
      } else {
        // Gap MUST always stay less than or equal to whatever the user has inputed
        // Start from ceil(idealRods) and increment if needed to guarantee gap <= safeGapNeededInches
        let candidateRods = Math.max(0, Math.ceil(idealRods));
        while (candidateRods < 1000) {
          const testRemainingSpace = frameTotalInches - (candidateRods * rodInches);
          const testGap = testRemainingSpace / (candidateRods + 1);
          if (testGap <= safeGapNeededInches + 1e-9) {
            break;
          }
          candidateRods++;
        }
        computedRods = candidateRods;
      }
    }
  }

  // Apply manual adjustment if requested (e.g. user toggles +/- buttons)
  if (typeof input.manualRodAdjustment === 'number') {
    computedRods = Math.max(0, input.manualRodAdjustment);
  }

  const rodsNeeded = computedRods;
  const internalGapsCreated = rodsNeeded + 1;

  // 4. Actual Gap Calculation
  // Total available space for gaps = FrameWidth - (rodsNeeded * rodInches)
  const totalRodSpaceInches = rodsNeeded * rodInches;
  const totalGapSpaceInches = frameTotalInches - totalRodSpaceInches;
  
  let isFit = true;
  let warningMessage = '';

  if (totalGapSpaceInches < 0) {
    isFit = false;
    warningMessage = 'Rods exceed frame width. Please reduce rod size or frame width.';
  }

  const gapInches = internalGapsCreated > 0 && totalGapSpaceInches > 0
    ? totalGapSpaceInches / internalGapsCreated
    : 0;
  const gapMm = Math.round(gapInches * 25.4);
  const gapSoot = Math.round(gapInches * 8);
  const gapBreakdown = convertInchesToSootBreakdown(gapInches);

  // Pitch (Center to Center distance)
  const pitchInches = gapInches + rodInches;
  const pitchMm = Math.round(pitchInches * 25.4);
  const pitchSoot = Math.round(pitchInches * 8);
  const pitchBreakdown = convertInchesToSootBreakdown(pitchInches);

  // Summary outputs matching user prompt (no decimals!)
  const summaryRodsText = `${rodsNeeded} rods/pipe needed`;
  const summaryGapText = `${gapBreakdown.formattedString} internal gap between rod/pipe`;
  const summaryGapsCreatedText = `${internalGapsCreated} internal gaps created`;

  // 5. Generate marking positions for fabricator tape measure layout (rounded clean values)
  const markings: MarkingPosition[] = [];
  let currentOffsetInches = 0;

  for (let i = 1; i <= rodsNeeded; i++) {
    const leftEdgeInches = currentOffsetInches + gapInches;
    const centerInches = leftEdgeInches + (rodInches / 2);
    const rightEdgeInches = leftEdgeInches + rodInches;

    markings.push({
      rodIndex: i,
      leftEdgeInches,
      leftEdgeSootString: formatInchesToSootString(leftEdgeInches),
      leftEdgeMm: Math.round(leftEdgeInches * 25.4),
      centerInches,
      centerSootString: formatInchesToSootString(centerInches),
      centerMm: Math.round(centerInches * 25.4),
      rightEdgeInches,
      rightEdgeSootString: formatInchesToSootString(rightEdgeInches),
      rightEdgeMm: Math.round(rightEdgeInches * 25.4),
    });

    currentOffsetInches = rightEdgeInches;
  }

  return {
    frameTotalInches,
    frameTotalMm,
    frameTotalSoot,
    rodInches,
    rodMm: safeRodMm,
    rodSoot,
    idealRods,
    rodsNeeded,
    internalGapsCreated,
    gapInches,
    gapMm,
    gapSoot,
    gapBreakdown,
    pitchInches,
    pitchMm,
    pitchSoot,
    pitchBreakdown,
    summaryRodsText,
    summaryGapText,
    summaryGapsCreatedText,
    markings,
    isFit,
    warningMessage,
  };
}
