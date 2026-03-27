/**
 * File: questions.js
 * Description: Personality quiz question bank — 10 questions, 4 answers each
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

export const questions = [
  {
    question: "You're starting a brand new project. What's the very first thing you do?",
    answers: [
      { text: 'Plan the full architecture on paper first', weights: { architect: 6, creative: 0, debugger: 1, fullstack: 2, hacker: 1 } },
      { text: 'Sketch the UI and pick a colour palette', weights: { architect: 0, creative: 7, debugger: 0, fullstack: 2, hacker: 1 } },
      { text: 'Set up the repo, CI/CD, and folder structure immediately', weights: { architect: 3, creative: 0, debugger: 1, fullstack: 5, hacker: 1 } },
      { text: 'Just start coding and figure it out as I go', weights: { architect: 0, creative: 1, debugger: 1, fullstack: 1, hacker: 7 } }
    ]
  },
  {
    question: "Your code is throwing a weird error. What do you do?",
    answers: [
      { text: 'Read the full error stack trace line by line', weights: { architect: 2, creative: 0, debugger: 7, fullstack: 1, hacker: 0 } },
      { text: 'Add console.log statements everywhere', weights: { architect: 0, creative: 0, debugger: 5, fullstack: 1, hacker: 4 } },
      { text: 'Refactor the whole section — the error means the design was wrong', weights: { architect: 6, creative: 1, debugger: 1, fullstack: 2, hacker: 0 } },
      { text: 'Google the error and paste the first Stack Overflow solution', weights: { architect: 0, creative: 0, debugger: 2, fullstack: 2, hacker: 6 } }
    ]
  },
  {
    question: 'What part of a project excites you the most?',
    answers: [
      { text: 'Designing the system architecture and data models', weights: { architect: 7, creative: 0, debugger: 1, fullstack: 2, hacker: 0 } },
      { text: 'Making the UI beautiful and interactive', weights: { architect: 0, creative: 7, debugger: 0, fullstack: 2, hacker: 1 } },
      { text: 'Making everything work together end-to-end', weights: { architect: 1, creative: 1, debugger: 1, fullstack: 6, hacker: 1 } },
      { text: 'Getting a working prototype out as fast as possible', weights: { architect: 0, creative: 0, debugger: 1, fullstack: 1, hacker: 8 } }
    ]
  },
  {
    question: 'How do you feel about writing documentation?',
    answers: [
      { text: 'Love it — good docs are as important as good code', weights: { architect: 7, creative: 1, debugger: 1, fullstack: 1, hacker: 0 } },
      { text: "I'll write a nice README with screenshots", weights: { architect: 2, creative: 6, debugger: 0, fullstack: 2, hacker: 0 } },
      { text: 'I document the tricky parts and known issues', weights: { architect: 1, creative: 0, debugger: 6, fullstack: 2, hacker: 1 } },
      { text: 'The code is the documentation', weights: { architect: 0, creative: 0, debugger: 1, fullstack: 1, hacker: 8 } }
    ]
  },
  {
    question: 'Pick your ideal weekend coding project:',
    answers: [
      { text: 'A beautifully animated personal portfolio site', weights: { architect: 0, creative: 8, debugger: 0, fullstack: 1, hacker: 1 } },
      { text: 'A full-stack app with auth, database, and deployment', weights: { architect: 2, creative: 0, debugger: 0, fullstack: 7, hacker: 1 } },
      { text: 'A script that automates something annoying in your life', weights: { architect: 1, creative: 0, debugger: 2, fullstack: 1, hacker: 6 } },
      { text: 'Refactoring an open-source project to be cleaner', weights: { architect: 6, creative: 0, debugger: 3, fullstack: 1, hacker: 0 } }
    ]
  },
  {
    question: "A teammate's code has a bug. How do you approach it?",
    answers: [
      { text: 'Step through it mentally, predicting the flow', weights: { architect: 4, creative: 0, debugger: 5, fullstack: 1, hacker: 0 } },
      { text: 'Open DevTools and start inspecting everything', weights: { architect: 0, creative: 2, debugger: 5, fullstack: 1, hacker: 2 } },
      { text: 'Rewrite the function from scratch — faster than fixing', weights: { architect: 1, creative: 0, debugger: 0, fullstack: 2, hacker: 7 } },
      { text: 'Check the tests first, write one that reproduces the bug', weights: { architect: 3, creative: 0, debugger: 4, fullstack: 3, hacker: 0 } }
    ]
  },
  {
    question: "What's your reaction to learning a brand new framework?",
    answers: [
      { text: 'Read the full documentation before writing any code', weights: { architect: 7, creative: 0, debugger: 2, fullstack: 1, hacker: 0 } },
      { text: 'Follow a tutorial and build a small demo', weights: { architect: 1, creative: 2, debugger: 1, fullstack: 5, hacker: 1 } },
      { text: 'Skip the docs — just start building and learn by doing', weights: { architect: 0, creative: 1, debugger: 0, fullstack: 1, hacker: 8 } },
      { text: 'Check what UI components and styling options it offers', weights: { architect: 0, creative: 7, debugger: 1, fullstack: 2, hacker: 0 } }
    ]
  },
  {
    question: 'Which of these bothers you the most in a codebase?',
    answers: [
      { text: 'Inconsistent naming conventions and messy structure', weights: { architect: 7, creative: 1, debugger: 1, fullstack: 1, hacker: 0 } },
      { text: 'Ugly UI with no attention to spacing or colour', weights: { architect: 0, creative: 8, debugger: 0, fullstack: 1, hacker: 1 } },
      { text: 'Unhandled errors and missing edge cases', weights: { architect: 1, creative: 0, debugger: 7, fullstack: 1, hacker: 1 } },
      { text: 'Overengineered code that could be 10× simpler', weights: { architect: 1, creative: 0, debugger: 1, fullstack: 2, hacker: 6 } }
    ]
  },
  {
    question: "You have 24 hours in a hackathon. What's your strategy?",
    answers: [
      { text: 'Spend the first few hours planning, then execute cleanly', weights: { architect: 7, creative: 0, debugger: 1, fullstack: 1, hacker: 1 } },
      { text: 'Build the flashiest demo possible — judges love visuals', weights: { architect: 0, creative: 7, debugger: 0, fullstack: 1, hacker: 2 } },
      { text: 'Go for a complete, working product with all features connected', weights: { architect: 1, creative: 0, debugger: 1, fullstack: 7, hacker: 1 } },
      { text: 'Hack together a prototype in 3 hours, then polish', weights: { architect: 0, creative: 1, debugger: 1, fullstack: 1, hacker: 7 } }
    ]
  },
  {
    question: 'If coding were a superpower, yours would be:',
    answers: [
      { text: 'Seeing the entire system in your head before it exists', weights: { architect: 8, creative: 0, debugger: 1, fullstack: 1, hacker: 0 } },
      { text: 'Making anything look and feel amazing', weights: { architect: 0, creative: 8, debugger: 0, fullstack: 1, hacker: 1 } },
      { text: 'Finding the one broken line in 10,000 lines of code', weights: { architect: 0, creative: 0, debugger: 8, fullstack: 1, hacker: 1 } },
      { text: 'Building a working app in any language in one afternoon', weights: { architect: 1, creative: 0, debugger: 0, fullstack: 5, hacker: 4 } }
    ]
  }
];
