// yay for another global because I didn't want to create another class. Classy.
let arrows = [];

// How about extending it from HTMLElement, you lazy bastard ?
class RandomQuote {
  constructor(quote) {
    this.quote = quote;
    this.xSide = 'right';
    this.yDirection = 'bottom';
    let isCollided = true;
    this.margin = 12; // as vh, used to select the ranges of random and check collision
    let retry = 0; // Why using a retry when there is a potential next item to render anyway? Like the seed's gonna fix itself miraculously
    // yay bruteforce resolution of collision
    // That's what happens when you don't have a proper algo for spreading them, because you don't know how many arrows you're going to have and the size don't scale
    this.textAlignment = 'left';
    while (isCollided && retry < 3) {
      this.generateRandomPosition();
      isCollided = this.checkCollision();
      retry++;
    }
    // Do not display if after 3 tries, we don't find a randome position that is usable
    if (!isCollided) {
      this.render();
    }
  }
  generateRandomPosition() {
    this.width = Math.floor(Math.random() * 10) + 5;
    this.height = Math.floor(Math.random() * 10) + 5;
    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;
    this.xPosition = Math.floor(Math.random() * 10) + 5;
    this.yPosition = Math.floor(Math.random() * 70) + this.margin;
    if (Math.random() > 0.5) {
      this.xSide = 'left';
      this.textAlignment = 'right';
    }
    const dx = (clientWidth / 2) - (this.xPosition / 100 * clientWidth);
    let dy = (clientHeight / 2) - (this.yPosition / 100 * clientHeight);
    if (this.xSide === 'left') dy *= -1;
    this.angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // And then "ho, positions can conflict, if only we were not using absolute so they don't stack on top of each other... Well done, well done. Time to recreate your own collision detection 
  }
  checkCollision() {
    return arrows.some((arrow) => {
      const offsetPercent = this.margin;
      return Math.abs(arrow.xPosition - this.xPosition) <= offsetPercent && Math.abs(arrow.yPosition - this.yPosition) <= offsetPercent && this.xSide === arrow.xSide;
    });
  }
  render() {
    // There is no structure, using template tag is a bit pointless, hence it's hacky. Like.. this whole website :) 
    const parentDOM = document.createElement('div');
    // TODO: introduce randomisation of the arrow
    const polygon = 'polygon(0% 20%, 56% 38%, 60% 0%, 100% 50%, 60% 100%, 60% 59%, 0 65%)';
    const xPosition = `${this.xSide}:${this.xPosition}%`;
    const yPosition = `${this.yDirection}:${this.yPosition}%`;
    const scale = this.xSide === 'left' ? 1 : -1;
    const paddingForOverflow = this.height; // Magic number padding to avoid the arrow being cut by the overflow hidden required due to Firefox issue https://bugzilla.mozilla.org/show_bug.cgi?id=1671784
    const dom = `<div class="arrow-container" style="${xPosition}; ${yPosition};">
      <div style="border-radius: 0.01px; overflow: hidden;padding-top: ${paddingForOverflow}vh;padding-bottom: ${paddingForOverflow}vh">
        <div class="arrow" style="width:${this.width}vw;height:${this.height}vh;clip-path: ${polygon}; transform: rotate(${this.angle}deg) scaleX(${scale});"></div>
      </div>
      <p style="transform: rotate(${this.angle}deg); text-align: ${this.xSide};position: relative; bottom: ${paddingForOverflow}vh">${this.quote}</p>
    </div>`;
    parentDOM.innerHTML = dom;
    parentDOM.children[0].addEventListener('mouseover', (e) => {
      e.currentTarget.classList.add('removed');
    });
    document.body.append(parentDOM.children[0]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let quotes = ["There's nothing else", "Click one of those", "I promise, it won't bite", "HERE, HERE", "Pretty sure you came here for that", "LÀ LÀ", "I bet you can't do it", "Too good for you?", "Here's my <a href=\"https://www.linkedin.com/in/gfelici/?locale=en_US\">linkedin</a>"];
  // A quoteFactory would have been nice, I guess.
  const shuffledQuotes = quotes.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  setTimeout(() => {
    shuffledQuotes.forEach((quote, index) => {
      setTimeout(() => {
        arrows.push(new RandomQuote(quote));
      }, 5000 * index);
    });
  }, 10000);
});
