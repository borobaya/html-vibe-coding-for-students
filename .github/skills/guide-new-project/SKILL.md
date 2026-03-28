---
name: guide-new-project
description: "Guide a student through creating a new website project. Use when: a student wants to build something new, asks to start a project, says 'I want to make a website', or describes an idea they want to build."
---

# Guide a Student Through Creating a New Project

Walk the student through building their website step by step. Keep them involved at each stage — ask questions, show progress, and celebrate wins.

## Step 1 — Discover What They Want

Before writing any code, ask these questions one at a time. Don't overwhelm them — keep it conversational.

1. **What kind of site?** — "What do you want to build? A game, a portfolio, a tool, something else?"
2. **What should it do?** — "What's the main thing you want it to do?" (e.g. "show the weather", "let people play a quiz")
3. **Any style preferences?** — "Do you have a vibe in mind? Dark mode, colourful, minimal, retro?"
4. **Any inspiration?** — "Is there a website or app you've seen that you'd like yours to look or feel like?"

If the student already described what they want in their first message, skip any questions that are already answered. Don't repeat back what they've already told you.

## Step 2 — Set Up the Project

1. Create the project folder at the repo root using the structure from copilot-instructions.md.
2. Create `index.html`, `styles/main.css`, and `js/main.js`.
3. Create a `README.md` with the nav bar and a short description.
4. Add the project to the gallery (this triggers the `add-project-to-gallery` skill).

Tell the student: "I've set up your project folder — let's start building!"

## Step 3 — Build the HTML Structure

1. Create the page layout based on what the student described.
2. Use semantic HTML (`header`, `main`, `section`, `footer`).
3. Show the student what the page looks like so far — describe what they'll see in the browser.

Ask: "Here's the basic layout — does this look like what you had in mind, or would you change anything?"

## Step 4 — Add Styling

1. Add CSS to match their preferred style/vibe.
2. Use CSS variables for colours and spacing so they're easy to tweak later.
3. Make sure it looks good on mobile too.

Tell the student what changed visually. Ask: "How does that look? Want to tweak any colours or spacing?"

## Step 5 — Add Behaviour

1. Add JavaScript features one at a time.
2. After each feature, describe what it does in the browser — not how the code works.
3. Let the student try it before adding the next feature.

Ask after each feature: "Give that a try — does it work the way you expected?"

## Step 6 — Wrap Up and Suggest Next Steps

Once the core features are done:

1. Briefly recap what was built.
2. Suggest 1–2 things they could try next. Frame these as invitations, not instructions.
   - "You could try adding a dark mode toggle — want to give that a go?"
   - "Want to add some animations to make it feel smoother?"

## Reminders

- **Don't dump all the code at once.** Build piece by piece so the student sees progress.
- **Describe results, not code.** The student cares about what they see in the browser.
- **Celebrate progress.** A simple "Nice — that's looking great!" goes a long way.
- **If something breaks, explain briefly.** One sentence about what went wrong and that it's fixed.
