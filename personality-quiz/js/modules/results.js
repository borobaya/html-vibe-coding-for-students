/**
 * File: results.js
 * Description: Personality type definitions and result calculation
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const personalityTypes = {
  architect: {
    key: 'architect',
    emoji: '\u{1F3D7}\uFE0F',
    title: 'The Architect',
    description: "You think in systems. Before writing a single line of code, you've already mapped out the data flow, the edge cases, and the deployment strategy. Your projects have clear folder structures, meaningful variable names, and documentation that actually makes sense. You believe the best code is the code you planned before you wrote it.",
    traits: [
      'Systems thinker \u2014 sees the big picture first',
      'Loves clean architecture and design patterns',
      'Plans thoroughly before coding',
      'Whiteboard enthusiast and diagram lover',
      'Designs for scale from day one'
    ]
  },
  creative: {
    key: 'creative',
    emoji: '\u{1F3A8}',
    title: 'The Creative',
    description: "Code is your canvas. You're drawn to the visual and interactive side of development \u2014 CSS animations, UI polish, and making things feel alive. You'd rather spend an extra hour perfecting a hover effect than writing backend logic. Your projects might not be the most architecturally pristine, but they always look and feel incredible.",
    traits: [
      'Eye for design and aesthetics',
      'Obsessed with CSS animations and transitions',
      'Cares deeply about user experience',
      'Happiest when building interfaces',
      'Turns wireframes into art'
    ]
  },
  debugger: {
    key: 'debugger',
    emoji: '\u{1F50D}',
    title: 'The Debugger',
    description: "While others create the bugs, you live to squash them. You have an uncanny ability to look at broken code and just know where the problem is. Console.log is your weapon of choice, and you find deep satisfaction in making failing tests pass. You're the person everyone calls when nothing works.",
    traits: [
      'Patience of a saint with broken code',
      'Console.log detective extraordinaire',
      'Reads error messages like poetry',
      'Finds the needle in the haystack',
      'Thrives under "it\'s broken, fix it" pressure'
    ]
  },
  fullstack: {
    key: 'fullstack',
    emoji: '\u26A1',
    title: 'The Full-Stack Hero',
    description: "Frontend? Backend? Databases? DevOps? You do it all and somehow keep it all in your head. You're the Swiss army knife of developers \u2014 maybe not the world's best at any one thing, but dangerously competent across the entire stack. You love building complete projects from scratch.",
    traits: [
      'Jack of all trades, master of shipping',
      'Comfortable across the entire stack',
      'Loves building projects end-to-end',
      'Adapts quickly to any technology',
      'The go-to person for "how does this work?"'
    ]
  },
  hacker: {
    key: 'hacker',
    emoji: '\u{1F480}',
    title: 'The Hacker',
    description: "You don't follow the rules \u2014 you bend them. Your code might look unconventional, but it works, and it works fast. You love shortcuts, clever one-liners, and finding creative workarounds. Hackathons are your natural habitat. Ship first, refactor never (well... maybe later).",
    traits: [
      'Moves fast and ships things',
      'Loves clever shortcuts and one-liners',
      'Hackathon champion energy',
      'Breaks things to understand them',
      '"It works on my machine" is a valid argument'
    ]
  }
};

/** Tie-break priority — earlier in array wins ties */
const PRIORITY_ORDER = ['architect', 'creative', 'debugger', 'fullstack', 'hacker'];

/**
 * Determines the winning personality type from scores
 * @param {object} scores - { architect, creative, debugger, fullstack, hacker }
 * @returns {object} The winning PersonalityResult object
 */
export function getResult(scores) {
  const sorted = Object.entries(scores)
    .sort((a, b) => {
      // Sort by score descending
      if (b[1] !== a[1]) return b[1] - a[1];
      // Tie-break by priority order
      return PRIORITY_ORDER.indexOf(a[0]) - PRIORITY_ORDER.indexOf(b[0]);
    });

  const winnerKey = sorted[0][0];
  return personalityTypes[winnerKey];
}
