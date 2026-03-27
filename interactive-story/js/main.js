// ── Your story — each "scene" has text, an emoji, and choices that lead to other scenes ──
const story = {
  start: {
    emoji: '🏰',
    text: 'You stand at the gates of an ancient castle. The sky is dark and thunder rumbles in the distance. The gates are slightly open…',
    choices: [
      { text: 'Push open the gates and go inside', next: 'hallway' },
      { text: 'Walk around the castle walls', next: 'garden' },
    ],
  },
  hallway: {
    emoji: '🕯️',
    text: 'You enter a long hallway lit by flickering candles. At the far end, you see two doors — one red, one blue.',
    choices: [
      { text: 'Open the red door', next: 'dragon' },
      { text: 'Open the blue door', next: 'library' },
      { text: 'Go back outside', next: 'start' },
    ],
  },
  garden: {
    emoji: '🌿',
    text: 'You find a moonlit garden with a fountain in the centre. A small creature sits on the edge, watching you curiously.',
    choices: [
      { text: 'Approach the creature', next: 'friend' },
      { text: 'Ignore it and enter through a side door', next: 'hallway' },
    ],
  },
  dragon: {
    emoji: '🐉',
    text: 'A baby dragon is curled up on a pile of treasure! It yawns and looks up at you with big, friendly eyes.',
    choices: [
      { text: 'Pet the dragon', next: 'dragonFriend' },
      { text: 'Grab some treasure and run', next: 'caught' },
    ],
  },
  library: {
    emoji: '📚',
    text: 'You discover a vast library full of glowing books. One book floats off the shelf and opens in front of you, showing a map.',
    choices: [
      { text: 'Follow the map', next: 'treasure' },
      { text: 'Keep exploring the library', next: 'secret' },
    ],
  },
  friend: {
    emoji: '🦊',
    text: 'The creature is a magical fox! It nuzzles your hand and offers to guide you through the castle.',
    choices: [
      { text: 'Follow the fox', next: 'treasure' },
    ],
  },
  dragonFriend: {
    emoji: '💛',
    text: 'The dragon purrs like a kitten! It decides you\'re its new best friend and gives you a golden scale as a gift. You win!',
    choices: [],
  },
  caught: {
    emoji: '😱',
    text: 'The dragon\'s mother appears and blocks the exit! She\'s not happy. You drop the treasure and apologise. She lets you go… barely.',
    choices: [
      { text: 'Try again from the start', next: 'start' },
    ],
  },
  treasure: {
    emoji: '🏆',
    text: 'You find a hidden chamber filled with golden light. In the centre is a chest with your name on it. You open it and find… the real treasure was the adventure itself! 🎉',
    choices: [],
  },
  secret: {
    emoji: '✨',
    text: 'Behind the last bookshelf, you find a secret passage that leads to a rooftop with the most incredible view of the stars. What a night.',
    choices: [],
  },
};

// ── Game engine ──
const storyText = document.getElementById('story-text');
const storyImage = document.getElementById('story-image');
const choicesEl = document.getElementById('choices');
const restartBtn = document.getElementById('restart-btn');

function showScene(sceneId) {
  const scene = story[sceneId];
  if (!scene) return;

  storyImage.textContent = scene.emoji;
  storyText.textContent = scene.text;
  choicesEl.innerHTML = '';

  if (scene.choices.length === 0) {
    restartBtn.hidden = false;
  } else {
    restartBtn.hidden = true;
    for (const choice of scene.choices) {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => showScene(choice.next));
      choicesEl.appendChild(btn);
    }
  }

  // Re-trigger fade animation
  storyImage.style.animation = 'none';
  storyText.style.animation = 'none';
  requestAnimationFrame(() => {
    storyImage.style.animation = '';
    storyText.style.animation = '';
  });
}

restartBtn.addEventListener('click', () => showScene('start'));

// ── Start the story ──
showScene('start');
