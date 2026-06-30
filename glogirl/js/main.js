const storageKey = 'glogirl-planner';

const todayLabel = document.getElementById('today-label');
const glowScore = document.getElementById('glow-score');
const glowBar = document.getElementById('glow-bar');
const vibePicker = document.getElementById('vibe-picker');
const vibeOutput = document.getElementById('vibe-output');
const glowList = document.getElementById('glow-list');
const resetBtn = document.getElementById('reset-btn');
const sleepHours = document.getElementById('sleep-hours');
const sleepQuality = document.getElementById('sleep-quality');
const sleepOutput = document.getElementById('sleep-output');
const confidenceLine = document.getElementById('confidence-line');
const confidenceBtn = document.getElementById('confidence-btn');
const dailyQuote = document.getElementById('daily-quote');
const quoteCalendarBtn = document.getElementById('quote-calendar-btn');
const quoteCalendar = document.getElementById('quote-calendar');
const quoteHistory = document.getElementById('quote-history');
const homeWorkoutList = document.getElementById('home-workout-list');
const gymWorkoutList = document.getElementById('gym-workout-list');
const savedWorkoutList = document.getElementById('saved-workout-list');
const savedWorkoutImage = document.getElementById('saved-workout-image');
const savedWorkoutSummary = document.getElementById('saved-workout-summary');
const workoutDetail = document.getElementById('workout-detail');
const workoutDetailImage = document.getElementById('workout-detail-image');
const workoutDetailGoal = document.getElementById('workout-detail-goal');
const workoutDetailTitle = document.getElementById('workout-detail-title');
const workoutDetailSteps = document.getElementById('workout-detail-steps');
const saveWorkoutBtn = document.getElementById('save-workout-btn');
const goalInput = document.getElementById('goal-input');
const saveStatus = document.getElementById('save-status');
const navButtons = document.querySelectorAll('.bottom-nav__item');
const appViews = document.querySelectorAll('.app-view');
const breathCircle = document.getElementById('breath-circle');
const breathText = document.getElementById('breath-text');
const breathBtn = document.getElementById('breath-btn');
const reflectionPrompt = document.getElementById('reflection-prompt');
const reflectionBtn = document.getElementById('reflection-btn');
const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatNote = document.getElementById('chat-note');
const communityMessageList = document.getElementById('community-message-list');
const communityMessageInput = document.getElementById('community-message-input');
const communityMessageBtn = document.getElementById('community-message-btn');
const profilePreviewImg = document.getElementById('profile-preview-img');
const profilePreviewName = document.getElementById('profile-preview-name');
const profilePublicLabel = document.getElementById('profile-public-label');
const profileNameInput = document.getElementById('profile-name-input');
const profilePictureInput = document.getElementById('profile-picture-input');
const publicGoalsToggle = document.getElementById('public-goals-toggle');
const publicGoalsInput = document.getElementById('public-goals-input');
const profileSaveStatus = document.getElementById('profile-save-status');

const boosts = [
  'My body deserves care, not criticism.',
  'I can take up space with confidence.',
  'Small steps still count.',
  'I am allowed to rest and still be strong.',
  'I can do hard things at my own pace.',
];

const workouts = [
  {
    id: 'home-lower-strength',
    place: 'home',
    title: 'Home Lower Body Strength',
    goal: 'Strength',
    image: 'assets/home-workout.svg',
    steps: ['Warm up with 30 seconds of marching.', 'Do 12 slow bodyweight squats.', 'Do 12 glute bridges.', 'Do 10 reverse lunges on each side.', 'Rest for one minute and repeat twice.'],
  },
  {
    id: 'home-core-calm',
    place: 'home',
    title: 'Core and Calm Mat Flow',
    goal: 'Core',
    image: 'assets/home-workout.svg',
    steps: ['Start with three deep breaths on the mat.', 'Hold a plank for 20 seconds.', 'Do 10 dead bugs on each side.', 'Do 12 bird dogs.', 'Finish with a child pose stretch.'],
  },
  {
    id: 'home-cardio-energy',
    place: 'home',
    title: 'No-Equipment Energy Boost',
    goal: 'Cardio',
    image: 'assets/home-workout.svg',
    steps: ['March in place for one minute.', 'Do 20 step jacks.', 'Do 15 standing punches each side.', 'Do 12 calf raises.', 'Repeat for three rounds at a safe pace.'],
  },
  {
    id: 'gym-lower-confidence',
    place: 'gym',
    title: 'Gym Lower Body Confidence',
    goal: 'Strength',
    image: 'assets/gym-workout.svg',
    steps: ['Warm up with five minutes on the treadmill.', 'Use the leg press for 10 controlled reps.', 'Do 10 dumbbell Romanian deadlifts.', 'Do 12 hip thrusts.', 'Cool down with gentle hamstring stretches.'],
  },
  {
    id: 'gym-upper-posture',
    place: 'gym',
    title: 'Upper Body and Posture',
    goal: 'Posture',
    image: 'assets/gym-workout.svg',
    steps: ['Start with light shoulder circles.', 'Do 10 lat pulldowns.', 'Do 10 seated rows.', 'Do 10 dumbbell chest presses.', 'Finish with a doorway chest stretch.'],
  },
  {
    id: 'gym-cardio-stamina',
    place: 'gym',
    title: 'Gym Cardio Stamina',
    goal: 'Cardio',
    image: 'assets/gym-workout.svg',
    steps: ['Walk on the treadmill for five minutes.', 'Increase speed for one minute.', 'Recover slowly for one minute.', 'Repeat the fast and slow pattern six times.', 'Cool down for three minutes.'],
  },
];

const validVibes = ['Energised', 'Calm', 'Strong', 'Focused'];

const reflections = [
  'What is one thing your mind needs less of today?',
  'What would feel kinder than pushing through right now?',
  'Where are you holding tension in your body?',
  'What is one small thing you are proud of today?',
  'What boundary would protect your peace this week?',
];

const breathSteps = [
  { text: 'Inhale slowly for 4.', expand: true },
  { text: 'Hold gently for 2.', expand: true },
  { text: 'Exhale slowly for 6.', expand: false },
  { text: 'Rest for 2.', expand: false },
];

let breathStepIndex = 0;
let breathTimer = null;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

let state = loadState();

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return { vibe: '', tasks: {}, goal: '', sleep: { hours: 8, quality: 3 }, boostIndex: 0, quoteHistory: {}, savedWorkouts: [], profile: { name: '', picture: '', publicGoals: false, goals: '' }, messages: [] };
  }

  try {
    return { sleep: { hours: 8, quality: 3 }, boostIndex: 0, quoteHistory: {}, savedWorkouts: [], profile: { name: '', picture: '', publicGoals: false, goals: '' }, messages: [], ...JSON.parse(saved) };
  } catch {
    return { vibe: '', tasks: {}, goal: '', sleep: { hours: 8, quality: 3 }, boostIndex: 0, quoteHistory: {}, savedWorkouts: [], profile: { name: '', picture: '', publicGoals: false, goals: '' }, messages: [] };
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  saveStatus.textContent = 'Saved on this device.';
}

function updateDate() {
  todayLabel.textContent = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

function updateScore() {
  const checks = [...glowList.querySelectorAll('input')];
  const completed = checks.filter((input) => input.checked).length;
  const score = Math.round((completed / checks.length) * 100);

  glowScore.textContent = `${score}%`;
  glowBar.style.width = `${score}%`;
}

function updateVibe() {
  if (!validVibes.includes(state.vibe)) {
    state.vibe = '';
  }

  const buttons = [...vibePicker.querySelectorAll('button')];
  buttons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.vibe === state.vibe);
  });

  vibeOutput.textContent = state.vibe ? `${state.vibe} energy today.` : 'Pick your vibe.';
}

function updateSleep() {
  sleepHours.value = state.sleep.hours;
  sleepQuality.value = state.sleep.quality;

  const qualityText = ['rough', 'light', 'okay', 'good', 'amazing'][state.sleep.quality - 1];
  sleepOutput.textContent = `${state.sleep.hours} hours with ${qualityText} quality.`;
}

function updateConfidence() {
  confidenceLine.textContent = boosts[state.boostIndex];
  dailyQuote.textContent = boosts[state.boostIndex];
  updateQuoteCalendar();
}

function updateQuoteCalendar() {
  const entries = Object.entries(state.quoteHistory || {}).sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
  quoteCalendarBtn.disabled = entries.length === 0;
  quoteHistory.innerHTML = '';

  if (entries.length === 0) {
    quoteHistory.textContent = 'Press New Boost to save today\'s quote.';
    return;
  }

  entries.forEach(([date, quote]) => {
    const item = document.createElement('article');
    const time = document.createElement('time');
    const text = document.createElement('p');
    time.dateTime = date;
    time.textContent = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
    text.textContent = quote;
    item.append(time, text);
    quoteHistory.append(item);
  });
}

function updateWorkout() {
  renderWorkoutList(homeWorkoutList, workouts.filter((workout) => workout.place === 'home'));
  renderWorkoutList(gymWorkoutList, workouts.filter((workout) => workout.place === 'gym'));
  renderSavedWorkouts();
}

function renderWorkoutList(container, workoutItems) {
  container.innerHTML = '';
  workoutItems.forEach((workout) => {
    container.append(createWorkoutButton(workout));
  });
}

function createWorkoutButton(workout) {
  const button = document.createElement('button');
  const image = document.createElement('img');
  const text = document.createElement('span');
  const goal = document.createElement('small');

  button.className = 'workout-option';
  button.type = 'button';
  button.dataset.workoutId = workout.id;
  image.src = workout.image;
  image.alt = `${workout.title} preview`;
  text.textContent = workout.title;
  goal.textContent = `Goal: ${workout.goal}`;
  text.append(goal);
  button.append(image, text);
  return button;
}

function renderSavedWorkouts() {
  const saved = state.savedWorkouts
    .map((id) => workouts.find((workout) => workout.id === id))
    .filter(Boolean);

  savedWorkoutList.innerHTML = '';
  savedWorkoutImage.src = saved[0]?.image || 'assets/home-workout.svg';
  savedWorkoutSummary.textContent = saved.length ? `${saved.length} saved workout${saved.length === 1 ? '' : 's'}.` : 'Save a workout to build your list.';

  if (!saved.length) {
    const empty = document.createElement('span');
    empty.textContent = 'No saved workouts yet.';
    savedWorkoutList.append(empty);
    return;
  }

  saved.forEach((workout) => {
    savedWorkoutList.append(createWorkoutButton(workout));
  });
}

function showWorkout(workoutId) {
  const workout = workouts.find((item) => item.id === workoutId);
  if (!workout) return;

  state.selectedWorkoutId = workout.id;
  workoutDetail.hidden = false;
  workoutDetailImage.src = workout.image;
  workoutDetailImage.alt = `${workout.title} instructions preview`;
  workoutDetailGoal.textContent = `Goal: ${workout.goal}`;
  workoutDetailTitle.textContent = workout.title;
  workoutDetailSteps.innerHTML = '';
  workout.steps.forEach((step) => {
    const item = document.createElement('li');
    item.textContent = step;
    workoutDetailSteps.append(item);
  });
  saveWorkoutBtn.textContent = state.savedWorkouts.includes(workout.id) ? 'Saved' : 'Save Workout';
  workoutDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function handleWorkoutClick(event) {
  const button = event.target.closest('.workout-option');
  if (!button) return;

  showWorkout(button.dataset.workoutId);
}

function syncUi() {
  goalInput.value = state.goal;
  syncProfile();
  renderCommunityMessages();
  glowList.querySelectorAll('input').forEach((input) => {
    input.checked = Boolean(state.tasks[input.dataset.task]);
  });
  updateDate();
  updateVibe();
  updateSleep();
  updateConfidence();
  updateWorkout();
  updateScore();
}

function syncProfile() {
  profileNameInput.value = state.profile.name;
  publicGoalsInput.value = state.profile.goals;
  publicGoalsToggle.classList.toggle('is-public', state.profile.publicGoals);
  publicGoalsToggle.setAttribute('aria-pressed', String(state.profile.publicGoals));
  publicGoalsToggle.textContent = state.profile.publicGoals ? 'Goals are public' : 'Make my goals public';
  profilePreviewImg.src = state.profile.picture || 'assets/glogirl-mark.svg';
  profilePreviewName.textContent = state.profile.name || 'Your name';
  profilePublicLabel.textContent = state.profile.publicGoals ? 'Goals public' : 'Goals private';
  profileSaveStatus.textContent = 'Profile saved on this device.';
}

function renderCommunityMessages() {
  const savedMessages = state.messages || [];
  communityMessageList.querySelectorAll('.own-message').forEach((message) => message.remove());

  savedMessages.forEach((message) => {
    const item = document.createElement('p');
    item.className = 'own-message';
    const name = document.createElement('strong');
    name.textContent = `${state.profile.name || 'You'}:`;
    item.append(name, ` ${message}`);
    communityMessageList.append(item);
  });
  communityMessageList.scrollTop = communityMessageList.scrollHeight;
}

function sendCommunityMessage() {
  const message = communityMessageInput.value.trim();
  if (!message) return;

  state.messages.push(message);
  communityMessageInput.value = '';
  renderCommunityMessages();
  saveState();
}

function showView(viewId) {
  document.body.classList.toggle('is-secondary-view', viewId !== 'home-view');

  appViews.forEach((view) => {
    const isActive = view.id === viewId;
    view.hidden = !isActive;
    view.classList.toggle('app-view--active', isActive);
  });

  navButtons.forEach((button) => {
    const isActive = button.dataset.view === viewId;
    button.classList.toggle('is-active', isActive);
    if (isActive) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

function runBreathStep() {
  const step = breathSteps[breathStepIndex];
  breathText.textContent = step.text;
  breathCircle.textContent = step.expand ? 'Inhale' : 'Exhale';
  breathCircle.classList.toggle('is-inhale', step.expand);
  breathStepIndex = (breathStepIndex + 1) % breathSteps.length;
}

function toggleBreathing() {
  if (breathTimer) {
    clearInterval(breathTimer);
    breathTimer = null;
    breathBtn.textContent = 'Start Breathing';
    breathText.textContent = 'Paused. Start again whenever you want.';
    breathCircle.textContent = 'Breathe';
    breathCircle.classList.remove('is-inhale');
    return;
  }

  breathBtn.textContent = 'Pause Breathing';
  runBreathStep();
  breathTimer = setInterval(runBreathStep, 3600);
}

function addChatMessage(sender, message, className = '') {
  const item = document.createElement('p');
  if (className) item.classList.add(className);
  const name = document.createElement('strong');
  name.textContent = `${sender}:`;
  item.append(name, ` ${message}`);
  chatLog.append(item);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getBotReply(message) {
  const text = message.toLowerCase();

  if (text.includes('stress') || text.includes('anxious') || text.includes('worried')) {
    return 'That sounds heavy. Try one slow breath, unclench your shoulders, and name one thing you can control right now.';
  }

  if (text.includes('tired') || text.includes('sleep')) {
    return 'Your body may be asking for recovery. A gentle stretch, water, and a calmer bedtime plan could help tonight.';
  }

  if (text.includes('gym') || text.includes('workout') || text.includes('fitness')) {
    return 'Start small and steady. Pick one workout from Fitness and focus on how strong you feel, not perfection.';
  }

  if (text.includes('sad') || text.includes('low') || text.includes('bad')) {
    return 'I am sorry today feels hard. You deserve support. Try texting someone you trust and doing one tiny caring thing for yourself.';
  }

  return 'I hear you. What would make the next ten minutes feel a little easier or kinder?';
}

async function askAiGlobot(message) {
  const endpoint = window.location.protocol === 'file:'
    ? 'http://localhost:5500/api/globot'
    : '/api/globot';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'AI is not available right now.');
  }

  return data.reply;
}

async function sendChatMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addChatMessage('You', message, 'user-message');
  chatInput.value = '';
  chatSendBtn.disabled = true;
  chatNote.textContent = 'GloBot is thinking...';

  try {
    const reply = await askAiGlobot(message);
    addChatMessage('GloBot', reply);
    chatNote.textContent = 'AI replies are connected.';
  } catch (error) {
    addChatMessage('GloBot', error.message, 'system-message');
    addChatMessage('GloBot', getBotReply(message));
    chatNote.textContent = 'Using backup guidance until AI is connected.';
  } finally {
    chatSendBtn.disabled = false;
  }
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.view));
});

vibePicker.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  state.vibe = button.dataset.vibe;
  updateVibe();
  saveState();
});

glowList.addEventListener('change', (event) => {
  state.tasks[event.target.dataset.task] = event.target.checked;
  updateScore();
  saveState();
});

goalInput.addEventListener('input', () => {
  state.goal = goalInput.value;
  saveStatus.textContent = 'Saving...';
  saveState();
});

sleepHours.addEventListener('input', () => {
  state.sleep.hours = sleepHours.value;
  updateSleep();
  saveState();
});

sleepQuality.addEventListener('input', () => {
  state.sleep.quality = Number(sleepQuality.value);
  updateSleep();
  saveState();
});

confidenceBtn.addEventListener('click', () => {
  state.boostIndex = (state.boostIndex + 1) % boosts.length;
  state.quoteHistory[getTodayKey()] = boosts[state.boostIndex];
  updateConfidence();
  saveState();
});

quoteCalendarBtn.addEventListener('click', () => {
  quoteCalendar.hidden = !quoteCalendar.hidden;
});

homeWorkoutList.addEventListener('click', handleWorkoutClick);
gymWorkoutList.addEventListener('click', handleWorkoutClick);
savedWorkoutList.addEventListener('click', handleWorkoutClick);

saveWorkoutBtn.addEventListener('click', () => {
  if (!state.selectedWorkoutId || state.savedWorkouts.includes(state.selectedWorkoutId)) return;

  state.savedWorkouts.push(state.selectedWorkoutId);
  saveWorkoutBtn.textContent = 'Saved';
  updateWorkout();
  saveState();
});

resetBtn.addEventListener('click', () => {
  state.tasks = {};
  syncUi();
  saveState();
});

breathBtn.addEventListener('click', toggleBreathing);

reflectionBtn.addEventListener('click', () => {
  const currentIndex = reflections.indexOf(reflectionPrompt.textContent);
  const nextIndex = (currentIndex + 1) % reflections.length;
  reflectionPrompt.textContent = reflections[nextIndex];
});

chatSendBtn.addEventListener('click', sendChatMessage);

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
});

communityMessageBtn.addEventListener('click', sendCommunityMessage);

communityMessageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendCommunityMessage();
  }
});

profileNameInput.addEventListener('input', () => {
  state.profile.name = profileNameInput.value.trim();
  syncProfile();
  renderCommunityMessages();
  saveState();
});

publicGoalsInput.addEventListener('input', () => {
  state.profile.goals = publicGoalsInput.value;
  profileSaveStatus.textContent = 'Saving profile...';
  saveState();
});

publicGoalsToggle.addEventListener('click', () => {
  state.profile.publicGoals = !state.profile.publicGoals;
  syncProfile();
  saveState();
});

profilePictureInput.addEventListener('change', () => {
  const file = profilePictureInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    state.profile.picture = reader.result;
    syncProfile();
    saveState();
  });
  reader.readAsDataURL(file);
});

syncUi();