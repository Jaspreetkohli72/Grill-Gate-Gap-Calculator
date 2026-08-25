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
  fractionalSoot: number;
  fractionalSootText: string;
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

export function convertInchesToSootBreakdown(totalInches: number): SootBreakdown {
  if (isNaN(totalInches) || totalInches < 0) {
    return {
      wholeInches: 0,
      wholeSoot: 0,
      fractionalSoot: 0,
      fractionalSootText: '',
      totalSoot: 0,
      formattedString: '0 inch 0 soot',
      detailedDisplay: '0" 0 soot',
    };
  }

  const totalSoot = totalInches * 8;
  const wholeInches = Math.floor(totalInches);
  const remainingInches = totalInches - wholeInches;
  const remainingSootDecimal = remainingInches * 8;
  const wholeSoot = Math.floor(remainingSootDecimal);
  const fractionalSoot = remainingSootDecimal - wholeSoot;

  // Format fraction of a soot nicely (nearest 1/8, 1/4, 1/2, 3/4 soot or clean decimal)
  let fractionalSootText = '';
  const roundedSubSoot = Math.round(fractionalSoot * 8) / 8;

  if (roundedSubSoot >= 0.875) {
    fractionalSootText = '';
    // If it rounds up to whole soot
  } else if (Math.abs(roundedSubSoot - 0.75) < 0.05) {
    fractionalSootText = '3/4';
  } else if (Math.abs(roundedSubSoot - 0.5) < 0.05) {
    fractionalSootText = '1/2';
  } else if (Math.abs(roundedSubSoot - 0.25) < 0.05) {
    fractionalSootText = '1/4';
  } else if (Math.abs(roundedSubSoot - 0.125) < 0.05) {
    fractionalSootText = '1/8';
  } else if (roundedSubSoot > 0.02) {
    fractionalSootText = roundedSubSoot.toFixed(2).replace(/^0+/, '');
  }

  const sootDecimalFormatted = remainingSootDecimal.toFixed(2).replace(/\.00$/, '');
  const formattedString = `${wholeInches} inch ${sootDecimalFormatted} soot`;
  
  let detailedDisplay = `${wholeInches}"`;
  if (wholeSoot > 0 || fractionalSootText) {
    detailedDisplay += ` ${wholeSoot}${fractionalSootText ? ' ' + fractionalSootText : ''} soot`;
  } else {
    detailedDisplay += ` 0 soot`;
  }

  return {
    wholeInches,
    wholeSoot,
    fractionalSoot,
    fractionalSootText,
    totalSoot,
    formattedString,
    detailedDisplay,
  };
}

export function formatInchesToSootString(inches: number): string {
  const breakdown = convertInchesToSootBreakdown(inches);
  return breakdown.formattedString;
}

export function calculateRodGaps(input: CalculationInput): CalculationResult {
  const safeFrameInches = Math.max(0, input.frameInches || 0);
  const safeFrameSoot = Math.max(0, input.frameSoot || 0);
  const safeRodMm = Math.max(0, input.rodMm || 0);
  const safeGapNeededInches = Math.max(0, input.gapNeededInches || 0);

  // 1. Total frame width in inches
  // 1 inch = 8 soot, so frameSoot / 8 gives additional inches
  const frameTotalInches = safeFrameInches + (safeFrameSoot / 8);
  const frameTotalMm = frameTotalInches * 25.4;
  const frameTotalSoot = frameTotalInches * 8;

  // 2. Filler material width
  const rodInches = safeRodMm > 0 ? safeRodMm / 25.4 : 0;
  const rodSoot = rodInches * 8;

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
        // If gap can be more than needed, we round down rod count
        // Fewer rods => larger gap
        computedRods = Math.floor(idealRods);
      } else {
        // Gap cannot exceed needed gap, so we round up rod count
        // More rods => smaller gap <= needed gap
        computedRods = Math.ceil(idealRods);
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
  const gapMm = gapInches * 25.4;
  const gapSoot = gapInches * 8;
  const gapBreakdown = convertInchesToSootBreakdown(gapInches);

  // Pitch (Center to Center distance)
  const pitchInches = gapInches + rodInches;
  const pitchMm = pitchInches * 25.4;
  const pitchSoot = pitchInches * 8;
  const pitchBreakdown = convertInchesToSootBreakdown(pitchInches);

  // Summary outputs matching user prompt
  const summaryRodsText = `${rodsNeeded} rods/pipe needed`;
  const summaryGapText = `${gapBreakdown.formattedString} internal gap between rod/pipe`;
  const summaryGapsCreatedText = `${internalGapsCreated} internal gaps created`;

  // 5. Generate marking positions for fabricator tape measure layout
  const markings: MarkingPosition[] = [];
  let currentOffsetInches = 0;

  for (let i = 1; i <= rodsNeeded; i++) {
    // Gap before rod i
    const leftEdgeInches = currentOffsetInches + gapInches;
    const centerInches = leftEdgeInches + (rodInches / 2);
    const rightEdgeInches = leftEdgeInches + rodInches;

    markings.push({
      rodIndex: i,
      leftEdgeInches,
      leftEdgeSootString: formatInchesToSootString(leftEdgeInches),
      leftEdgeMm: leftEdgeInches * 25.4,
      centerInches,
      centerSootString: formatInchesToSootString(centerInches),
      centerMm: centerInches * 25.4,
      rightEdgeInches,
      rightEdgeSootString: formatInchesToSootString(rightEdgeInches),
      rightEdgeMm: rightEdgeInches * 25.4,
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
