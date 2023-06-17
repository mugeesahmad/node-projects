const capitilise = (word) => {
  let s = word.toLowerCase().split('');
  s[0] = s[0].toUpperCase();
  return s.join('');
};

module.exports = capitilise;
