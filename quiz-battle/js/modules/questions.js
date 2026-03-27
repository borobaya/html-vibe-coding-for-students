/**
 * File: questions.js
 * Description: Question bank for multiple categories
 * Author: AI4Students
 * Created: 2026-03-27
 * Last Modified: 2026-03-27
 */

const QUESTIONS = {
  science: [
    { q: 'What is the chemical symbol for gold?', answers: ['Ag', 'Au', 'Fe', 'Go'], correct: 1 },
    { q: 'What planet is known as the Red Planet?', answers: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correct: 2 },
    { q: 'What gas do plants absorb from the atmosphere?', answers: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2 },
    { q: 'What is the speed of light in km/s (approx)?', answers: ['150,000', '300,000', '500,000', '1,000,000'], correct: 1 },
    { q: 'How many bones are in the adult human body?', answers: ['186', '206', '226', '256'], correct: 1 },
    { q: 'What is the hardest natural substance?', answers: ['Gold', 'Iron', 'Diamond', 'Platinum'], correct: 2 },
    { q: 'Which element has the atomic number 1?', answers: ['Helium', 'Hydrogen', 'Oxygen', 'Carbon'], correct: 1 },
    { q: 'What organ produces insulin?', answers: ['Liver', 'Kidney', 'Pancreas', 'Heart'], correct: 2 },
    { q: 'What is the closest star to Earth?', answers: ['Sirius', 'Alpha Centauri', 'The Sun', 'Betelgeuse'], correct: 2 },
    { q: 'What force keeps us on Earth?', answers: ['Magnetism', 'Friction', 'Gravity', 'Inertia'], correct: 2 },
    { q: 'What is the pH of pure water?', answers: ['5', '7', '9', '10'], correct: 1 },
    { q: 'DNA stands for…', answers: ['Deoxyribonucleic acid', 'Dinitro acid', 'Dynamic nuclear acid', 'Dual nucleus acid'], correct: 0 },
    { q: 'Which planet has the most moons?', answers: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correct: 1 },
    { q: 'What type of animal is a dolphin?', answers: ['Fish', 'Reptile', 'Mammal', 'Amphibian'], correct: 2 },
    { q: 'What is the boiling point of water in °C?', answers: ['90', '100', '110', '120'], correct: 1 },
  ],
  history: [
    { q: 'In what year did World War II end?', answers: ['1943', '1944', '1945', '1946'], correct: 2 },
    { q: 'Who was the first president of the USA?', answers: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Abraham Lincoln'], correct: 2 },
    { q: 'The Great Fire of London occurred in which year?', answers: ['1566', '1666', '1766', '1866'], correct: 1 },
    { q: 'Who painted the Mona Lisa?', answers: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], correct: 2 },
    { q: 'What ancient wonder was in Alexandria?', answers: ['Colossus', 'Lighthouse', 'Hanging Gardens', 'Pyramid'], correct: 1 },
    { q: 'The Berlin Wall fell in which year?', answers: ['1987', '1988', '1989', '1990'], correct: 2 },
    { q: 'Who discovered penicillin?', answers: ['Marie Curie', 'Alexander Fleming', 'Louis Pasteur', 'Edward Jenner'], correct: 1 },
    { q: 'The Titanic sank in which year?', answers: ['1910', '1911', '1912', '1913'], correct: 2 },
    { q: 'Which empire built the Colosseum?', answers: ['Greek', 'Roman', 'Ottoman', 'Persian'], correct: 1 },
    { q: 'Who wrote the Communist Manifesto?', answers: ['Lenin', 'Stalin', 'Marx & Engels', 'Trotsky'], correct: 2 },
    { q: 'What year did the French Revolution begin?', answers: ['1779', '1789', '1799', '1809'], correct: 1 },
    { q: 'Who was the first to circumnavigate the globe?', answers: ['Columbus', 'Magellan\'s expedition', 'Drake', 'Cook'], correct: 1 },
    { q: 'The Renaissance began in which country?', answers: ['France', 'England', 'Italy', 'Spain'], correct: 2 },
    { q: 'Who invented the printing press?', answers: ['Edison', 'Gutenberg', 'Newton', 'Tesla'], correct: 1 },
    { q: 'Which ancient civilisation built Machu Picchu?', answers: ['Maya', 'Aztec', 'Inca', 'Olmec'], correct: 2 },
  ],
  geography: [
    { q: 'What is the largest continent?', answers: ['Africa', 'North America', 'Asia', 'Europe'], correct: 2 },
    { q: 'Which river is the longest in the world?', answers: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correct: 1 },
    { q: 'What is the capital of Australia?', answers: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2 },
    { q: 'Mount Everest is in which mountain range?', answers: ['Andes', 'Alps', 'Himalayas', 'Rockies'], correct: 2 },
    { q: 'Which country has the most people?', answers: ['USA', 'India', 'China', 'Indonesia'], correct: 1 },
    { q: 'What ocean is the largest?', answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
    { q: 'What is the smallest country in the world?', answers: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1 },
    { q: 'The Sahara Desert is in which continent?', answers: ['Asia', 'Africa', 'South America', 'Australia'], correct: 1 },
    { q: 'What is the capital of Japan?', answers: ['Osaka', 'Kyoto', 'Tokyo', 'Yokohama'], correct: 2 },
    { q: 'Which country has the most time zones?', answers: ['USA', 'Russia', 'France', 'China'], correct: 2 },
    { q: 'What is the deepest ocean trench?', answers: ['Tonga', 'Mariana', 'Java', 'Puerto Rico'], correct: 1 },
    { q: 'The Amazon rainforest is mainly in?', answers: ['Colombia', 'Peru', 'Brazil', 'Venezuela'], correct: 2 },
    { q: 'What language is most spoken worldwide?', answers: ['English', 'Spanish', 'Mandarin', 'Hindi'], correct: 2 },
    { q: 'Iceland is in which ocean?', answers: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correct: 1 },
    { q: 'What is the capital of Canada?', answers: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], correct: 2 },
  ],
  entertainment: [
    { q: 'Who directed Jurassic Park?', answers: ['James Cameron', 'Steven Spielberg', 'Ridley Scott', 'George Lucas'], correct: 1 },
    { q: 'What band sang "Bohemian Rhapsody"?', answers: ['The Beatles', 'Led Zeppelin', 'Queen', 'Pink Floyd'], correct: 2 },
    { q: 'In Harry Potter, what house is Harry in?', answers: ['Slytherin', 'Hufflepuff', 'Ravenclaw', 'Gryffindor'], correct: 3 },
    { q: 'Who plays Iron Man in the MCU?', answers: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'], correct: 2 },
    { q: 'What year was Minecraft released?', answers: ['2009', '2011', '2013', '2015'], correct: 1 },
    { q: 'Who wrote "Romeo and Juliet"?', answers: ['Dickens', 'Austen', 'Shakespeare', 'Chaucer'], correct: 2 },
    { q: 'What animated film features a clownfish?', answers: ['Shark Tale', 'Finding Nemo', 'Moana', 'The Little Mermaid'], correct: 1 },
    { q: 'Which artist painted "Starry Night"?', answers: ['Monet', 'Van Gogh', 'Picasso', 'Rembrandt'], correct: 1 },
    { q: 'What is the best-selling video game of all time?', answers: ['Tetris', 'Minecraft', 'GTA V', 'Wii Sports'], correct: 1 },
    { q: 'In The Lion King, who is Simba\'s father?', answers: ['Scar', 'Mufasa', 'Timon', 'Zazu'], correct: 1 },
    { q: 'What TV show features "Winter is Coming"?', answers: ['Vikings', 'The Witcher', 'Game of Thrones', 'Lord of the Rings'], correct: 2 },
    { q: 'Who sings "Shape of You"?', answers: ['Justin Bieber', 'Ed Sheeran', 'Shawn Mendes', 'Bruno Mars'], correct: 1 },
    { q: 'What platform is TikTok also known as in China?', answers: ['WeChat', 'Douyin', 'Weibo', 'Baidu'], correct: 1 },
    { q: 'What fictional metal is Captain America\'s shield?', answers: ['Adamantium', 'Vibranium', 'Uru', 'Carbonadium'], correct: 1 },
    { q: 'Who created Mickey Mouse?', answers: ['Walt Disney', 'Stan Lee', 'Jim Henson', 'Chuck Jones'], correct: 0 },
  ],
  sports: [
    { q: 'How many players are on a football (soccer) team?', answers: ['9', '10', '11', '12'], correct: 2 },
    { q: 'In which sport do you use a shuttlecock?', answers: ['Tennis', 'Badminton', 'Squash', 'Table Tennis'], correct: 1 },
    { q: 'The Olympics are held every how many years?', answers: ['2', '3', '4', '5'], correct: 2 },
    { q: 'What country invented cricket?', answers: ['India', 'Australia', 'England', 'South Africa'], correct: 2 },
    { q: 'How many sets are in a standard tennis match (men)?', answers: ['3', '4', '5', '6'], correct: 2 },
    { q: 'Which country won the 2022 FIFA World Cup?', answers: ['France', 'Brazil', 'Argentina', 'Germany'], correct: 2 },
    { q: 'What is the most-watched sport globally?', answers: ['Basketball', 'Cricket', 'Football (Soccer)', 'Tennis'], correct: 2 },
    { q: 'How many holes in a standard golf course?', answers: ['9', '12', '18', '21'], correct: 2 },
    { q: 'What sport is played at Wimbledon?', answers: ['Cricket', 'Tennis', 'Golf', 'Rugby'], correct: 1 },
    { q: 'Michael Jordan is famous in which sport?', answers: ['Baseball', 'Basketball', 'American Football', 'Boxing'], correct: 1 },
    { q: 'How many points is a touchdown worth?', answers: ['3', '5', '6', '7'], correct: 2 },
    { q: 'What colour is the middle Olympic ring?', answers: ['Red', 'Blue', 'Black', 'Green'], correct: 2 },
    { q: 'In basketball, how high is the hoop (feet)?', answers: ['8', '9', '10', '12'], correct: 2 },
    { q: 'Which country has won the most World Cups?', answers: ['Germany', 'Italy', 'Brazil', 'Argentina'], correct: 2 },
    { q: 'A marathon is how many miles (approx)?', answers: ['20', '24', '26.2', '30'], correct: 2 },
  ],
};

/**
 * Returns shuffled questions for a category
 * @param {string} category
 * @param {number} count
 * @returns {Array}
 */
export function getQuestions(category, count) {
  let pool;
  if (category === 'random') {
    pool = Object.values(QUESTIONS).flat();
  } else {
    pool = [...(QUESTIONS[category] || QUESTIONS.science)];
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}
