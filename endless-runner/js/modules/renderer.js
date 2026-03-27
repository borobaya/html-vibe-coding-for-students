/**
 * File: renderer.js
 * Description: Canvas drawing — sky, parallax layers, ground, player, obstacles
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 320;

let ctx = null;
let cloudOffsetX = 0;
let hillOffsetX = 0;
let groundOffsetX = 0;
let clouds = [];
let birdWingFrame = 0;
let birdWingCounter = 0;

/**
 * @param {HTMLCanvasElement} canvasElement
 */
export function init(canvasElement) {
  ctx = canvasElement.getContext('2d');
  // Generate random clouds
  clouds = [];
  for (let i = 0; i < 7; i++) {
    clouds.push({
      x: Math.random() * CANVAS_WIDTH,
      y: 30 + Math.random() * 100,
      w: 60 + Math.random() * 80,
      h: 20 + Math.random() * 20,
    });
  }
}

/**
 * @param {Object} player - player module
 * @param {Array} obstacles - obstacle objects
 * @param {number} speed - current speed px/s
 * @param {number} dt - delta time seconds
 */
export function draw(player, obstacles, speed, dt) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawSky();
  drawClouds(speed, dt);
  drawHills(speed, dt);
  drawGround(speed, dt);
  drawObstacles(obstacles);
  drawPlayer(player);

  // Bird wing animation
  birdWingCounter++;
  if (birdWingCounter >= 10) {
    birdWingCounter = 0;
    birdWingFrame = 1 - birdWingFrame;
  }
}

function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  gradient.addColorStop(0, '#FF6B35');
  gradient.addColorStop(1, '#FFD166');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);
}

function drawClouds(speed, dt) {
  cloudOffsetX -= speed * 0.1 * dt;
  ctx.fillStyle = '#FFF8E7';

  for (const cloud of clouds) {
    const cx = ((cloud.x + cloudOffsetX) % (CANVAS_WIDTH + 200)) - 100;
    // Draw cloud as overlapping ellipses
    ctx.beginPath();
    ctx.ellipse(cx, cloud.y, cloud.w / 2, cloud.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - cloud.w * 0.25, cloud.y + 5, cloud.w / 3, cloud.h / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + cloud.w * 0.25, cloud.y + 3, cloud.w / 3, cloud.h / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHills(speed, dt) {
  hillOffsetX -= speed * 0.3 * dt;
  ctx.fillStyle = '#A8C256';

  const hillWidth = 200;
  const hillCount = Math.ceil(CANVAS_WIDTH / hillWidth) + 2;
  const baseOffset = ((hillOffsetX % hillWidth) + hillWidth) % hillWidth;

  for (let i = -1; i < hillCount; i++) {
    const x = i * hillWidth + baseOffset;
    ctx.beginPath();
    ctx.arc(x, GROUND_Y, 100, Math.PI, 0);
    ctx.fill();
  }
}

function drawGround(speed, dt) {
  groundOffsetX -= speed * dt;

  // Ground body
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

  // Surface line
  ctx.strokeStyle = '#C4A35A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
  ctx.stroke();

  // Scrolling texture dots
  ctx.fillStyle = '#5C4410';
  const dotSpacing = 40;
  const offset = ((groundOffsetX % dotSpacing) + dotSpacing) % dotSpacing;
  for (let x = -dotSpacing + offset; x < CANVAS_WIDTH; x += dotSpacing) {
    ctx.fillRect(x, GROUND_Y + 15, 8, 2);
    ctx.fillRect(x + 20, GROUND_Y + 35, 6, 2);
    ctx.fillRect(x + 10, GROUND_Y + 55, 10, 2);
  }
}

function drawPlayer(player) {
  const px = player.getX();
  const py = player.getY();
  const pw = player.getWidth();
  const ph = player.getHeight();
  const jumping = player.getIsJumping();
  const ducking = player.getIsDucking();
  const frame = player.getAnimFrame();

  ctx.fillStyle = '#06D6A0';
  ctx.strokeStyle = '#048A65';
  ctx.lineWidth = 2;

  if (ducking) {
    // Wider, shorter body
    ctx.fillRect(px - 5, py + 5, pw + 10, ph - 5);
    ctx.strokeRect(px - 5, py + 5, pw + 10, ph - 5);
    // Head
    ctx.beginPath();
    ctx.arc(px + pw / 2, py + 5, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    // Body
    ctx.fillRect(px + 5, py + 15, pw - 10, ph - 30);
    ctx.strokeRect(px + 5, py + 15, pw - 10, ph - 30);

    // Head
    ctx.beginPath();
    ctx.arc(px + pw / 2, py + 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Legs (alternate frames for running animation)
    if (!jumping) {
      const legOffset = frame % 2 === 0 ? -3 : 3;
      ctx.fillRect(px + 10 + legOffset, py + ph - 18, 6, 18);
      ctx.fillRect(px + pw - 16 - legOffset, py + ph - 18, 6, 18);
    } else {
      // Jumping — both legs together
      ctx.fillRect(px + 12, py + ph - 15, 6, 15);
      ctx.fillRect(px + pw - 18, py + ph - 15, 6, 15);
    }

    // Arms
    if (jumping) {
      // Arms up
      ctx.fillRect(px, py + 5, 6, 4);
      ctx.fillRect(px + pw - 6, py + 5, 6, 4);
    } else {
      ctx.fillRect(px, py + 22, 6, 4);
      ctx.fillRect(px + pw - 6, py + 22, 6, 4);
    }
  }
}

function drawObstacles(obstacles) {
  for (const obs of obstacles) {
    if (obs.type.startsWith('cactus')) {
      drawCactus(obs);
    } else if (obs.type.startsWith('bird')) {
      drawBird(obs);
    }
  }
}

function drawCactus(obs) {
  ctx.fillStyle = '#EF476F';
  ctx.strokeStyle = '#B5173B';
  ctx.lineWidth = 2;

  // Main trunk
  ctx.fillRect(obs.x + obs.width / 2 - 6, obs.y, 12, obs.height);
  ctx.strokeRect(obs.x + obs.width / 2 - 6, obs.y, 12, obs.height);

  if (obs.type === 'cactus_double') {
    // Second trunk
    ctx.fillRect(obs.x + obs.width / 2 + 10, obs.y + 5, 12, obs.height - 5);
    ctx.strokeRect(obs.x + obs.width / 2 + 10, obs.y + 5, 12, obs.height - 5);
    // Arms on first
    ctx.fillRect(obs.x + obs.width / 2 - 14, obs.y + 10, 8, 6);
    ctx.fillRect(obs.x + obs.width / 2 + 18, obs.y + 15, 8, 6);
  } else {
    // Arms
    ctx.fillRect(obs.x + obs.width / 2 - 14, obs.y + obs.height * 0.3, 8, 6);
    ctx.fillRect(obs.x + obs.width / 2 + 6, obs.y + obs.height * 0.5, 8, 6);
  }
}

function drawBird(obs) {
  ctx.fillStyle = '#B5173B';
  ctx.strokeStyle = '#EF476F';
  ctx.lineWidth = 2;

  const cx = obs.x + obs.width / 2;
  const cy = obs.y + obs.height / 2;

  // Body
  ctx.beginPath();
  ctx.ellipse(cx, cy, 15, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Wings
  const wingY = birdWingFrame === 0 ? -12 : 8;
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy);
  ctx.lineTo(cx - 20, cy + wingY);
  ctx.lineTo(cx - 5, cy);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + 10, cy);
  ctx.lineTo(cx + 20, cy + wingY);
  ctx.lineTo(cx + 5, cy);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.moveTo(cx + 15, cy - 2);
  ctx.lineTo(cx + 22, cy);
  ctx.lineTo(cx + 15, cy + 2);
  ctx.fill();
}
