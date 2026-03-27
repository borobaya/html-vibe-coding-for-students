/**
 * File: instruments.js
 * Description: Instrument definitions for the beat maker
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const INSTRUMENTS = [
  { id: 'kick',  name: 'Kick',   shortName: 'KK', colour: '#FF6B6B', defaultVolume: 0.9 },
  { id: 'snare', name: 'Snare',  shortName: 'SN', colour: '#4ECDC4', defaultVolume: 0.8 },
  { id: 'hihat', name: 'Hi-Hat', shortName: 'HH', colour: '#FFE66D', defaultVolume: 0.6 },
  { id: 'clap',  name: 'Clap',   shortName: 'CP', colour: '#FF6BFF', defaultVolume: 0.7 },
  { id: 'tom',   name: 'Tom',    shortName: 'TM', colour: '#45B7D1', defaultVolume: 0.7 },
  { id: 'rim',   name: 'Rim',    shortName: 'RM', colour: '#96CEB4', defaultVolume: 0.6 },
];

export function getInstruments() { return INSTRUMENTS; }
export function getInstrumentById(id) { return INSTRUMENTS.find(i => i.id === id); }
export function getInstrumentCount() { return INSTRUMENTS.length; }
