const heading = document.querySelector('h1') as HTMLHeadingElement;

const letters = 'abcdefghijklmnopqrstuvwxyz';
const captialLetters = letters.toUpperCase();
const username = 'Senbo';
const realname = 'Harsh';
let isRealNameOnDisplay = false;

let interval: NodeJS.Timeout | undefined = undefined;

heading.addEventListener('mouseenter', () => {
  let iteration = 0;

  clearInterval(interval);

  let name: string;
  if (isRealNameOnDisplay) {
    name = username;
  } else {
    name = realname;
  }

  interval = setInterval(() => {
    heading.innerText = heading.innerText
      .split('')
      .map((_, index) => {
        if (index < iteration) {
          return name[index];
        } else if (index === 0) {
          return captialLetters[
            Math.floor(Math.random() * captialLetters.length)
          ];
        } else {
          return letters[Math.floor(Math.random() * letters.length)];
        }
      })
      .join('');

    if (iteration === name.length) {
      clearInterval(interval);
    }

    iteration += 1 / 3;
  }, 25);

  isRealNameOnDisplay = !isRealNameOnDisplay;
});
