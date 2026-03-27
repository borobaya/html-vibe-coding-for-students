/**
 * File: text.js
 * Description: Meme text rendering — wrapping, styling, stroke + fill
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Applies text styling to a canvas context
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ fontFamily: string, scaledSize: number, textColour: string, strokeColour: string }} opts
 */
export function applyTextStyle(ctx, opts) {
  ctx.font = `bold ${opts.scaledSize}px ${opts.fontFamily}`;
  ctx.fillStyle = opts.textColour;
  ctx.strokeStyle = opts.strokeColour;
  ctx.lineWidth = Math.max(2, opts.scaledSize * 0.08);
  ctx.lineJoin = 'round';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
}

/**
 * Wraps text into lines that fit within maxWidth
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} maxWidth
 * @returns {string[]}
 */
export function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Draws a single line of text with stroke first, then fill
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} line
 * @param {number} x
 * @param {number} y
 */
export function drawStrokedText(ctx, line, x, y) {
  ctx.strokeText(line, x, y);
  ctx.fillText(line, x, y);
}

/**
 * Draws top-positioned meme text
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} w - Canvas width
 * @param {number} h - Canvas height
 * @param {{ fontFamily: string, scaledSize: number, textColour: string, strokeColour: string }} opts
 */
export function drawTopText(ctx, text, w, h, opts) {
  if (!text) return;

  applyTextStyle(ctx, opts);
  const maxWidth = w * 0.9;
  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = opts.scaledSize * 1.2;
  let y = h * 0.05;

  for (const line of lines) {
    drawStrokedText(ctx, line, w / 2, y);
    y += lineHeight;
  }
}

/**
 * Draws bottom-positioned meme text
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} w - Canvas width
 * @param {number} h - Canvas height
 * @param {{ fontFamily: string, scaledSize: number, textColour: string, strokeColour: string }} opts
 */
export function drawBottomText(ctx, text, w, h, opts) {
  if (!text) return;

  applyTextStyle(ctx, opts);
  const maxWidth = w * 0.9;
  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = opts.scaledSize * 1.2;

  // Start from bottom, work upward
  let y = h * 0.95 - lineHeight * lines.length;

  for (const line of lines) {
    drawStrokedText(ctx, line, w / 2, y);
    y += lineHeight;
  }
}

/**
 * Draws both top and bottom text on the canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {{ topText: string, bottomText: string, fontFamily: string, fontSize: number, textColour: string, strokeColour: string }} options
 */
export function drawAllText(ctx, w, h, options) {
  // Scale font size relative to a 600px reference width
  const scaledSize = (options.fontSize / 600) * w;

  const opts = {
    fontFamily: options.fontFamily,
    scaledSize,
    textColour: options.textColour,
    strokeColour: options.strokeColour,
  };

  drawTopText(ctx, options.topText.toUpperCase(), w, h, opts);
  drawBottomText(ctx, options.bottomText.toUpperCase(), w, h, opts);
}
