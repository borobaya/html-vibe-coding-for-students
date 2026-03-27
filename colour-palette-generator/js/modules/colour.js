/**
 * File: colour.js
 * Description: Colour conversion utilities and WCAG luminance calculations
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Converts HSL to RGB
 * @param {number} h - Hue 0-359
 * @param {number} s - Saturation 0-100
 * @param {number} l - Lightness 0-100
 * @returns {{ r: number, g: number, b: number }}
 */
export function hslToRgb(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r1, g1, b1;
  if (h < 60)       { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else              { r1 = c; g1 = 0; b1 = x; }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

/**
 * Converts RGB to hex string
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} e.g. "#FF00AA"
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts HSL directly to hex
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @returns {string}
 */
export function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

/**
 * Converts hex string to RGB
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/**
 * Converts RGB to HSL
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {{ h: number, s: number, l: number }}
 */
export function rgbToHsl(r, g, b) {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const d = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rN) h = ((gN - bN) / d + (gN < bN ? 6 : 0)) * 60;
    else if (max === gN) h = ((bN - rN) / d + 2) * 60;
    else h = ((rN - gN) / d + 4) * 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Calculates WCAG relative luminance
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {number}
 */
export function relativeLuminance(r, g, b) {
  const linearise = (c) => {
    const srgb = c / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

/**
 * Returns black or white hex depending on background luminance
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
export function contrastTextColour(r, g, b) {
  return relativeLuminance(r, g, b) > 0.179 ? '#000000' : '#ffffff';
}

/**
 * Formats RGB as a readable string
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
export function formatRgb(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}
