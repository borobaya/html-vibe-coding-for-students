/**
 * File: graph.js
 * Description: Live scrolling population graph on the graph canvas
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { config } from './config.js';

export class PopulationGraph {
  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx) {
    this.ctx = ctx;
    this.preyData = [];
    this.predatorData = [];
    this.lastSampleTime = 0;
  }

  /** Clears history. */
  reset() {
    this.preyData = [];
    this.predatorData = [];
    this.lastSampleTime = 0;
  }

  /**
   * Samples population data at the configured interval.
   * @param {number} timestamp - performance.now()
   * @param {{ prey: number, predators: number }} counts
   */
  sample(timestamp, counts) {
    if (timestamp - this.lastSampleTime < config.graphSampleInterval) return;
    this.lastSampleTime = timestamp;

    this.preyData.push(counts.prey);
    this.predatorData.push(counts.predators);

    if (this.preyData.length > config.graphMaxSamples) {
      this.preyData.shift();
      this.predatorData.shift();
    }
  }

  /** Redraws the graph canvas. */
  draw() {
    const { ctx } = this;
    const W = config.graphWidth;
    const H = config.graphHeight;
    const PAD_LEFT = 40;
    const PAD_BOTTOM = 20;
    const PAD_TOP = 10;
    const PAD_RIGHT = 10;
    const plotW = W - PAD_LEFT - PAD_RIGHT;
    const plotH = H - PAD_TOP - PAD_BOTTOM;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, W, H);

    if (this.preyData.length < 2) return;

    // Auto-scale Y axis
    const allValues = [...this.preyData, ...this.predatorData];
    const maxVal = Math.max(10, ...allValues);
    const yMax = Math.ceil(maxVal / 10) * 10;

    // Grid lines
    ctx.strokeStyle = '#2a2a4a';
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = PAD_TOP + (plotH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(PAD_LEFT + plotW, y);
      ctx.stroke();

      const label = Math.round(yMax - (yMax / gridLines) * i);
      ctx.fillStyle = '#8892b0';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(label, PAD_LEFT - 6, y + 4);
    }

    // Data lines
    this.drawLine(this.preyData, '#43b581', yMax, plotW, plotH, PAD_LEFT, PAD_TOP);
    this.drawLine(this.predatorData, '#e84057', yMax, plotW, plotH, PAD_LEFT, PAD_TOP);
  }

  /**
   * Draws a single data series.
   * @param {number[]} data
   * @param {string} colour
   * @param {number} yMax
   * @param {number} plotW
   * @param {number} plotH
   * @param {number} padLeft
   * @param {number} padTop
   */
  drawLine(data, colour, yMax, plotW, plotH, padLeft, padTop) {
    const { ctx } = this;
    const step = plotW / (config.graphMaxSamples - 1);

    ctx.strokeStyle = colour;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = padLeft + i * step;
      const y = padTop + plotH - (data[i] / yMax) * plotH;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}
