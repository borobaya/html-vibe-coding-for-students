[← Back to all projects](../README.md) | [🌐 Open Website](index.html)

# GloGirl

GloGirl is a colourful wellness and fitness app with bottom-tab sections for daily wellbeing, workouts, community stories, mind wellness, and personal goals.

## Features

- **Wellness Score** — Updates as daily wellbeing tasks are completed.
- **Vibe Picker** — Choose the mood for the day.
- **Sleep Tracker** — Log hours slept and sleep quality.
- **Confidence Boost** — Cycle through encouraging confidence prompts.
- **Fitness Tab** — Browse large Home Workouts, Gym Workouts, and My Workouts sections.
- **Goal Categories** — Workouts are labelled by goals like strength, core, cardio, and posture.
- **Workout Instructions** — Open each workout to see step-by-step instructions and images.
- **Saved Workouts** — Save workouts into My Workouts, with the first saved workout used as the preview image.
- **Community** — Browse video-style journey cards from women sharing wellbeing stories.
- **Mind Wellness** — Use breathing exercises, reflection prompts, and a supportive GloBot chat.
- **One Thing** — Save a short daily goal in the browser.
- **AI-ready GloBot** — Can use real AI replies through the local server when an API key is set safely in the terminal.

## AI Chat Setup

GloBot keeps API keys out of the browser. To use real AI responses, set an API key in your terminal before starting the local server:

```bash
set OPENAI_API_KEY=your_key_here
python3 server.py
```

Then open `http://localhost:5500/glogirl/index.html`.

If no key is set, GloBot shows a clear message and uses simple backup wellbeing guidance.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- localStorage
- Python local server