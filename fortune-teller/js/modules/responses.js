/**
 * File: responses.js
 * Description: Magic 8-Ball response bank — positive, neutral, negative
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/** All classic Magic 8-Ball responses grouped by sentiment */
const RESPONSES = {
  positive: [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes — definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.'
  ],
  neutral: [
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.'
  ],
  negative: [
    'Don\'t count on it.',
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.'
  ]
};

/**
 * Returns a flat array of all 20 responses
 * @returns {string[]}
 */
export function getAllResponses() {
  return [
    ...RESPONSES.positive,
    ...RESPONSES.neutral,
    ...RESPONSES.negative
  ];
}

/**
 * Returns one random response with equal probability
 * @returns {string}
 */
export function getRandomResponse() {
  const all = getAllResponses();
  return all[Math.floor(Math.random() * all.length)];
}

export { RESPONSES };
