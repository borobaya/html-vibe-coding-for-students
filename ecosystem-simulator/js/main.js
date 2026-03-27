/**
 * File: main.js
 * Description: Entry point — initialises simulation and runs game loop
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

import { config } from './modules/config.js';
import { Simulation } from './modules/simulation.js';
import { Renderer } from './modules/renderer.js';
import { PopulationGraph } from './modules/graph.js';
import { initControls, updateStats } from './modules/controls.js';

/* ── DOM Elements ── */
const simCanvas = document.getElementById('sim-canvas');
const simCtx = simCanvas.getContext('2d');
const graphCanvas = document.getElementById('graph-canvas');
const graphCtx = graphCanvas.getContext('2d');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');

/* ── State ── */
let simulation;
let renderer;
let graph;
let running = false;
let animFrameId = null;
let lastTimestamp = 0;

/* ── Canvas sizing ── */
function resizeCanvases() {
  const simContainer = simCanvas.parentElement;
  const simW = simContainer.clientWidth;
  const simH = Math.round(simW * (500 / 800));
  simCanvas.width = simW;
  simCanvas.height = simH;
  config.canvasWidth = simW;
  config.canvasHeight = simH;

  const graphContainer = graphCanvas.parentElement;
  const gW = graphContainer.clientWidth;
  graphCanvas.width = gW;
  graphCanvas.height = 200;
  config.graphWidth = gW;
  config.graphHeight = 200;
}

/* ── Init ── */
function init() {
  resizeCanvases();
  simulation = new Simulation();
  renderer = new Renderer(simCtx);
  graph = new PopulationGraph(graphCtx);
  simulation.init();
  initControls();
  renderer.draw(simulation);
  updateStats(simulation.getCounts());
}

/* ── Game loop ── */
function loop(timestamp) {
  if (!running) return;

  const rawDt = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  const dt = Math.min(rawDt, 33) / 16.67;

  simulation.update(dt);
  renderer.draw(simulation);

  const counts = simulation.getCounts();
  updateStats(counts);
  graph.sample(timestamp, counts);
  graph.draw();

  animFrameId = requestAnimationFrame(loop);
}

/* ── Playback controls ── */
function play() {
  if (running) return;
  running = true;
  btnPlay.disabled = true;
  btnPause.disabled = false;
  lastTimestamp = performance.now();
  animFrameId = requestAnimationFrame(loop);
}

function pause() {
  running = false;
  btnPlay.disabled = false;
  btnPause.disabled = true;
  if (animFrameId) cancelAnimationFrame(animFrameId);
}

function reset() {
  pause();
  graph.reset();
  simulation.init();
  renderer.draw(simulation);
  updateStats(simulation.getCounts());
  graph.draw();
}

btnPlay.addEventListener('click', play);
btnPause.addEventListener('click', pause);
btnReset.addEventListener('click', reset);

/* ── Resize ── */
window.addEventListener('resize', () => {
  resizeCanvases();
  if (!running) {
    renderer.draw(simulation);
    graph.draw();
  }
});

/* ── Start ── */
init();
