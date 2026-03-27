/**
 * File: player.js
 * Description: Player character — position, jump/duck physics, hitbox
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const GROUND_Y = 320;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const DUCK_HEIGHT = 35;
const PLAYER_X = 80;
const JUMP_VELOCITY = -550;
const GRAVITY = 1400;

let x = PLAYER_X;
let y = GROUND_Y - PLAYER_HEIGHT;
let width = PLAYER_WIDTH;
let height = PLAYER_HEIGHT;
let velocityY = 0;
let isJumping = false;
let isDucking = false;
let animFrame = 0;
let animCounter = 0;

export function reset() {
  x = PLAYER_X;
  y = GROUND_Y - PLAYER_HEIGHT;
  width = PLAYER_WIDTH;
  height = PLAYER_HEIGHT;
  velocityY = 0;
  isJumping = false;
  isDucking = false;
  animFrame = 0;
  animCounter = 0;
}

/** @param {number} dt - delta time in seconds */
export function update(dt) {
  if (isJumping) {
    velocityY += GRAVITY * dt;
    y += velocityY * dt;

    if (y + height >= GROUND_Y) {
      y = GROUND_Y - height;
      velocityY = 0;
      isJumping = false;
    }
  }

  // Running animation
  animCounter++;
  if (animCounter >= 8) {
    animCounter = 0;
    animFrame = (animFrame + 1) % 4;
  }
}

export function jump() {
  if (!isJumping && !isDucking) {
    velocityY = JUMP_VELOCITY;
    isJumping = true;
  }
}

export function duck() {
  if (!isJumping) {
    isDucking = true;
    height = DUCK_HEIGHT;
    y = GROUND_Y - height;
  }
}

export function standUp() {
  isDucking = false;
  height = PLAYER_HEIGHT;
  y = GROUND_Y - height;
}

/**
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function getHitbox() {
  return {
    x: x + 2,
    y: y + 2,
    width: width - 4,
    height: height - 4,
  };
}

export function getX() { return x; }
export function getY() { return y; }
export function getWidth() { return width; }
export function getHeight() { return height; }
export function getIsJumping() { return isJumping; }
export function getIsDucking() { return isDucking; }
export function getAnimFrame() { return animFrame; }
