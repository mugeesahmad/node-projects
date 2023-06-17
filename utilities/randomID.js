const uniqueID = () => {
  const dataset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const array = dataset.split('');

  let id = [];

  for (let i = 0; i < 5; i++) {
    let random = Math.floor(Math.random() * (array.length - 1));
    id.push(array[random]);
  }

  let unique = id.join('');
  return unique;
};

module.exports = uniqueID;