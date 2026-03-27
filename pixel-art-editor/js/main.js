/**
 * File: main.js
 * Description: Pixel Art Editor entry point & orchestration
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

import { initCanvas, setupCanvasListeners, setPixel, getPixel, getGridData, getGridSize, setGridData, clearCanvas, resizeCanvas } from './modules/canvas.js';
import { getActiveTool, setActiveTool, applyTool, setupToolListeners } from './modules/tools.js';
import { getCurrentColour, setCurrentColour, addRecentColour, renderPresetSwatches, setupPaletteListeners } from './modules/palette.js';
import { setupExportListener } from './modules/export.js';
import { undo, redo, clearHistory, updateButtons } from './modules/history.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  initCanvas(16);
  setupToolListeners();
  renderPresetSwatches();
  setupPaletteListeners(onColourChange);
  setupExportListener(getGridData, getGridSize);

  setupCanvasListeners(onCellAction);

  // Undo / Redo
  document.getElementById('btn-undo').addEventListener('click', () => {
    const prev = undo(getGridData());
    if (prev) setGridData(prev);
  });
  document.getElementById('btn-redo').addEventListener('click', () => {
    const next = redo(getGridData());
    if (next) setGridData(next);
  });

  // Clear
  document.getElementById('btn-clear').addEventListener('click', clearCanvas);

  // Resize buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const size = Number(btn.dataset.size);
      clearHistory();
      resizeCanvas(size);
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);

  updateButtons();
}

function onCellAction(row, col) {
  const colour = getCurrentColour();
  const canvasAPI = { setPixel, getPixel, getGridSize, getGridData };
  const picked = applyTool(row, col, colour, canvasAPI);

  if (picked) {
    setCurrentColour(picked);
    addRecentColour(picked);
  } else {
    addRecentColour(colour);
  }
}

function onColourChange(hex) {
  // colour updated via palette
}

function handleKeyboard(e) {
  // Ignore when typing in inputs
  if (e.target.tagName === 'INPUT') return;

  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z') { e.preventDefault(); const prev = undo(getGridData()); if (prev) setGridData(prev); }
    if (e.key === 'y') { e.preventDefault(); const next = redo(getGridData()); if (next) setGridData(next); }
    if (e.key === 's') { e.preventDefault(); document.getElementById('btn-export').click(); }
    return;
  }

  switch (e.key.toLowerCase()) {
    case 'p': setActiveTool('pencil'); break;
    case 'e': setActiveTool('eraser'); break;
    case 'f': setActiveTool('fill'); break;
    case 'i': setActiveTool('picker'); break;
  }
}
