
const avatarStyles = [
  'adventurer', 'adventurer-neutral', 'avataaars', 'big-ears', 'big-ears-neutral',
  'big-smile', 'bottts', 'croodles', 'croodles-neutral', 'identicon',
  'initials', 'lorelei', 'micah', 'miniavs', 'notionists',
  'notionists-neutral', 'open-peeps', 'personas', 'pixel-art', 'pixel-art-neutral'
];

/**
 * Generate a random avatar URL with a random DiceBear style.
 * The avatar will be stable across logins using the email as the seed.
 *
 * @param {string} seed - Usually user's email
 * @returns {string} DiceBear avatar URL
 */
export const generateAvatar = (seed) => {
  const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
  return `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${encodeURIComponent(seed)}`;
};
