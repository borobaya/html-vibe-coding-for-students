/**
 * File: canvas.js
 * Description: Canvas initialisation and image drawing for the meme generator
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Initialises canvas dimensions to match the source image
 * @param {HTMLCanvasElement} canvasEl
 * @param {HTMLImageElement} image
 */
export function initCanvas(canvasEl, image) {
  canvasEl.width = image.naturalWidth;
  canvasEl.height = image.naturalHeight;
}

/**
 * Clears the canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 */
export function clearCanvas(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
}

/**
 * Draws the source image on the canvas, filling it completely
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement} image
 * @param {number} w
 * @param {number} h
 */
export function drawImage(ctx, image, w, h) {
  ctx.drawImage(image, 0, 0, w, h);
}

/**
 * Full draw pipeline: clear → image → text
 * @param {HTMLCanvasElement} canvasEl
 * @param {HTMLImageElement} image
 * @param {{ topText: string, bottomText: string, fontFamily: string, fontSize: number, textColour: string, strokeColour: string }} options
 * @param {function} drawTextFn - Function that draws text overlays
 */
export function drawMeme(canvasEl, image, options, drawTextFn) {
  const ctx = canvasEl.getContext('2d');
  const w = canvasEl.width;
  const h = canvasEl.height;

  clearCanvas(ctx, w, h);
  drawImage(ctx, image, w, h);
  drawTextFn(ctx, w, h, options);
}
