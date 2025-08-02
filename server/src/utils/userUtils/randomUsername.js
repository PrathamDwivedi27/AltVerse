const adjectives = [
  'dark', 'neon', 'cosmic', 'quantum', 'frozen', 'silent', 'crystal',
  'solar', 'lunar', 'phantom', 'shadow', 'iron', 'steel', 'crimson',
  'golden', 'electric', 'astral', 'void', 'hollow', 'cyber'
];

const nouns = [
  'phoenix', 'tiger', 'storm', 'owl', 'hunter', 'hawk', 'wolf', 'dragon',
  'serpent', 'ghost', 'cyborg', 'knight', 'rogue', 'sentinel', 'wraith',
  'jaguar', 'pilgrim', 'titan', 'viper', 'shard'
];

export const generateRandomUsername = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 10000); 
  return `${adj}${noun}${num}`;
};