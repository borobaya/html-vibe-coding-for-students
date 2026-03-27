/**
 * File: charts.js
 * Description: Canvas-rendered donut pie chart and bar chart
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { getCategoryColour, getCategoryLabel } from './categories.js';

/**
 * Sets up canvas for crisp rendering at device pixel ratio
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRenderingContext2D}
 */
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

/**
 * Draws a donut pie chart for expense category data
 * @param {string} canvasId
 * @param {Array<{ categoryId: string, total: number }>} categoryData
 */
export function drawPieChart(canvasId, categoryData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = setupCanvas(canvas);
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);

  if (categoryData.length === 0) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No expense data', w / 2, h / 2);
    return;
  }

  const total = categoryData.reduce((sum, c) => sum + c.total, 0);
  const cx = w / 2;
  const cy = h / 2;
  const outerRadius = Math.min(w, h) / 2 - 10;
  const innerRadius = outerRadius * 0.45;

  let startAngle = -Math.PI / 2;

  for (const cat of categoryData) {
    const sliceAngle = (cat.total / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, startAngle, endAngle);
    ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = getCategoryColour(cat.categoryId);
    ctx.fill();

    // Label for slices ≥ 5%
    const pct = (cat.total / total) * 100;
    if (pct >= 5) {
      const midAngle = startAngle + sliceAngle / 2;
      const labelR = (outerRadius + innerRadius) / 2;
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(pct)}%`, lx, ly);
    }

    startAngle = endAngle;
  }
}

/**
 * Draws a bar chart for monthly income vs expense data
 * @param {string} canvasId
 * @param {Array<{ month: string, income: number, expense: number }>} monthlyData
 */
export function drawBarChart(canvasId, monthlyData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = setupCanvas(canvas);
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);

  if (monthlyData.length === 0) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No data yet', w / 2, h / 2);
    return;
  }

  const padding = { top: 30, right: 20, bottom: 60, left: 70 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Find max value for Y scale
  const maxVal = Math.max(
    ...monthlyData.map((m) => Math.max(m.income, m.expense)),
    1
  );
  const niceMax = getNiceMax(maxVal);

  // Grid lines
  const gridLines = 5;
  ctx.strokeStyle = '#e2e5ec';
  ctx.lineWidth = 1;
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= gridLines; i++) {
    const val = (niceMax / gridLines) * i;
    const y = padding.top + chartH - (val / niceMax) * chartH;

    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    ctx.fillText(`£${Math.round(val)}`, padding.left - 8, y);
  }

  // Bars
  const groupWidth = chartW / monthlyData.length;
  const barWidth = groupWidth * 0.3;
  const gap = groupWidth * 0.05;

  const incomeColour = '#10b981';
  const expenseColour = '#ef4444';

  monthlyData.forEach((m, i) => {
    const x = padding.left + i * groupWidth + groupWidth * 0.175;

    // Income bar
    const incomeH = (m.income / niceMax) * chartH;
    ctx.fillStyle = incomeColour;
    ctx.fillRect(x, padding.top + chartH - incomeH, barWidth, incomeH);

    // Expense bar
    const expenseH = (m.expense / niceMax) * chartH;
    ctx.fillStyle = expenseColour;
    ctx.fillRect(x + barWidth + gap, padding.top + chartH - expenseH, barWidth, expenseH);

    // Month label
    const label = formatMonthLabel(m.month);
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.save();
    const labelX = x + barWidth + gap / 2;
    const labelY = padding.top + chartH + 12;
    if (monthlyData.length > 6) {
      ctx.translate(labelX, labelY);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(label, 0, 0);
    } else {
      ctx.fillText(label, labelX, labelY);
    }
    ctx.restore();
  });
}

/**
 * Rounds up to a nice axis maximum
 * @param {number} val
 * @returns {number}
 */
function getNiceMax(val) {
  const magnitude = Math.pow(10, Math.floor(Math.log10(val)));
  const normalised = val / magnitude;
  let nice;
  if (normalised <= 1) nice = 1;
  else if (normalised <= 2) nice = 2;
  else if (normalised <= 5) nice = 5;
  else nice = 10;
  return nice * magnitude;
}

/**
 * Formats YYYY-MM to "Jan 26"
 * @param {string} month
 * @returns {string}
 */
function formatMonthLabel(month) {
  const [year, m] = month.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m, 10) - 1]} ${year.slice(2)}`;
}

/**
 * Renders the pie chart legend
 * @param {string} containerId
 * @param {Array<{ categoryId: string, total: number }>} categoryData
 */
export function renderPieLegend(containerId, categoryData) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  for (const cat of categoryData) {
    const item = document.createElement('div');
    item.className = 'legend';
    item.innerHTML = `
      <span class="legend__swatch" style="background: ${getCategoryColour(cat.categoryId)}"></span>
      <span>${getCategoryLabel(cat.categoryId)}</span>
    `;
    container.appendChild(item);
  }
}

/**
 * Renders the bar chart legend
 * @param {string} containerId
 */
export function renderBarLegend(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="legend"><span class="legend__swatch" style="background: #10b981"></span><span>Income</span></div>
    <div class="legend"><span class="legend__swatch" style="background: #ef4444"></span><span>Expense</span></div>
  `;
}
