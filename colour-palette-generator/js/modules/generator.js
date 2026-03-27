/**
 * File: generator.js
 * Description: Palette generation algorithms for 6 harmony modes
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * @typedef {{ h: number, s: number, l: number }} HSL
 */

/** Random integer between min and max inclusive */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Clamp hue to 0-359 range */
const clampHue = (h) => ((h % 360) + 360) % 360;

/** Clamp value between min and max */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const randomHue = () => rand(0, 359);
const randomSaturation = () => rand(40, 90);
const randomLightness = () => rand(25, 75);

/**
 * Generates 5 completely random colours
 * @returns {HSL[]}
 */
function randomPalette() {
  return Array.from({ length: 5 }, () => ({
    h: randomHue(),
    s: randomSaturation(),
    l: randomLightness(),
  }));
}

/**
 * Generates a complementary palette (base + complement + accent + variants)
 * @returns {HSL[]}
 */
function complementaryPalette() {
  const h0 = randomHue();
  const s = randomSaturation();
  const l = randomLightness();
  return [
    { h: h0, s, l },
    { h: clampHue(h0 + 180), s, l },
    { h: clampHue(h0 + 90), s, l },
    { h: h0, s, l: clamp(l + 20, 25, 75) },
    { h: clampHue(h0 + 180), s, l: clamp(l - 15, 25, 75) },
  ];
}

/**
 * Generates an analogous palette (60° arc across 5 swatches)
 * @returns {HSL[]}
 */
function analogousPalette() {
  const h0 = randomHue();
  return Array.from({ length: 5 }, (_, i) => ({
    h: clampHue(h0 + (i - 2) * 30),
    s: rand(50, 80),
    l: rand(35, 65),
  }));
}

/**
 * Generates a triadic palette (3 base + 2 lightness variants)
 * @returns {HSL[]}
 */
function triadicPalette() {
  const h0 = randomHue();
  const s = randomSaturation();
  const l = randomLightness();
  const h1 = clampHue(h0 + 120);
  const h2 = clampHue(h0 + 240);
  return [
    { h: h0, s, l },
    { h: h1, s, l },
    { h: h2, s, l },
    { h: h0, s, l: clamp(l + 20, 25, 85) },
    { h: h1, s, l: clamp(l - 20, 15, 75) },
  ];
}

/**
 * Generates a split-complementary palette
 * @returns {HSL[]}
 */
function splitComplementaryPalette() {
  const h0 = randomHue();
  const s = randomSaturation();
  const l = randomLightness();
  const h1 = clampHue(h0 + 150);
  const h2 = clampHue(h0 + 210);
  return [
    { h: h0, s, l },
    { h: h1, s, l },
    { h: h2, s, l },
    { h: h0, s, l: clamp(l + 15, 25, 85) },
    { h: h2, s, l: clamp(l - 15, 15, 75) },
  ];
}

/**
 * Generates a monochromatic palette (single hue, varying L and slight S jitter)
 * @returns {HSL[]}
 */
function monochromaticPalette() {
  const h = randomHue();
  const sBase = randomSaturation();
  return Array.from({ length: 5 }, (_, i) => ({
    h,
    s: clamp(sBase + rand(-10, 10), 20, 95),
    l: 20 + i * 15,
  }));
}

/** Map of mode names to generator functions */
const generators = {
  random: randomPalette,
  complementary: complementaryPalette,
  analogous: analogousPalette,
  triadic: triadicPalette,
  'split-complementary': splitComplementaryPalette,
  monochromatic: monochromaticPalette,
};

/**
 * Generates a 5-colour palette, respecting locked swatches
 * @param {string} mode - One of the harmony mode keys
 * @param {number[]} lockedIndices - Indices to preserve
 * @param {HSL[]} currentColours - Current palette (for locked values)
 * @returns {HSL[]}
 */
export function generatePalette(mode, lockedIndices, currentColours) {
  const gen = generators[mode] || randomPalette;
  const newPalette = gen();

  // Preserve locked swatches
  for (const idx of lockedIndices) {
    if (currentColours[idx]) {
      newPalette[idx] = { ...currentColours[idx] };
    }
  }

  return newPalette;
}
