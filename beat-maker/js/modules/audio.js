/**
 * File: audio.js
 * Description: Web Audio API – synthesised drum sounds (no sample files needed)
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

let audioCtx = null;
let masterGain = null;
const instrumentGains = {};

/**
 * Initialises the audio context
 * @returns {AudioContext}
 */
export function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.8;
  masterGain.connect(audioCtx.destination);
  return audioCtx;
}

export function getAudioContext() { return audioCtx; }

/**
 * Creates a gain node for an instrument
 * @param {string} id
 * @param {number} defaultVol
 */
export function createInstrumentGain(id, defaultVol) {
  const gain = audioCtx.createGain();
  gain.gain.value = defaultVol;
  gain.connect(masterGain);
  instrumentGains[id] = gain;
}

export function setMasterVolume(val) {
  if (masterGain) masterGain.gain.value = val;
}

export function setInstrumentVolume(id, val) {
  if (instrumentGains[id]) instrumentGains[id].gain.value = val;
}

/**
 * Play a synthesised drum sound at time
 * @param {string} instrument
 * @param {number} time
 */
export function playSample(instrument, time) {
  const dest = instrumentGains[instrument] || masterGain;

  switch (instrument) {
    case 'kick': playKick(time, dest); break;
    case 'snare': playSnare(time, dest); break;
    case 'hihat': playHihat(time, dest); break;
    case 'clap': playClap(time, dest); break;
    case 'tom': playTom(time, dest); break;
    case 'rim': playRim(time, dest); break;
  }
}

function playKick(time, dest) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.5);
}

function playSnare(time, dest) {
  // Noise burst
  const bufferSize = audioCtx.sampleRate * 0.2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.8, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1000;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(dest);
  noise.start(time);
  noise.stop(time + 0.2);

  // Body
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
  oscGain.gain.setValueAtTime(0.7, time);
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
  osc.connect(oscGain);
  oscGain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.1);
}

function playHihat(time, dest) {
  const bufferSize = audioCtx.sampleRate * 0.05;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7000;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  source.start(time);
  source.stop(time + 0.05);
}

function playClap(time, dest) {
  const bufferSize = audioCtx.sampleRate * 0.15;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.6, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2500;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  source.start(time);
  source.stop(time + 0.15);
}

function playTom(time, dest) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);
  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.3);
}

function playRim(time, dest) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, time);
  gain.gain.setValueAtTime(0.3, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.03);
}

export function resumeContext() {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}
