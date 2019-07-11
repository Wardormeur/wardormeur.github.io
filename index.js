// yay for another global because I didn't want to create another class. Classy.
let arrows = [];

// How about extending it from HTMLElement, you lazy bastard ?
class RandomQuote {
  constructor(quote) {
    this.quote = quote; 
    this.xDirection = 'right';
    this.yDirection = 'bottom';
    let isCollided = true;
    let retry = 0;
    // yay bruteforce resolution of collision
    while(isCollided && retry < 3) {
      this.generateRandomPosition();
      isCollided = this.checkCollision();
      retry ++;
    }
    this.render();
  }
  generateRandomPosition () {
    this.width = '10vw';
    this.height = '10vh';
    let horizontalAxis; 
    this.xPosition = Math.floor(Math.random() * 10) + 5;
    this.yPosition = Math.floor(Math.random() * 70) + 20;
    if (Math.random() > 0.5) {
      this.xDirection = 'left';
    }
    // While we don't have css transform to orientate the arrows, let's comment that is it's an issue with the collision detection
    /*if (Math.random() > 0.5) {
      this.yDirection = 'top';
    }*/
    // And then "ho, positions can conflict, if only we were not using absolute so they don't stack on top of each other... Well done, well done. Time to recreate your own collision detection 
  }
  checkCollision() {
    // It has side effects, such as enforcing a spread since we don't check the direction
    // But hell, why not.
    return arrows.some((arrow) => {
      const offsetPercent = 20;
      /*return (arrow.xPosition - offsetPercent < this.xPosition &&
              this.xPosition > arrow.xPosition + offsetPercent ) &&  
              (arrow.yPosition - offsetPercent < this.yPosition && 
              this.yPosition > arrow.yPosition + offsetPercent); */
      return Math.abs(arrow.xPosition - this.xPosition) < offsetPercent && Math.abs(arrow.yPosition - this.yPosition) < offsetPercent && this.xDirection === arrow.xDirection && this.yDirection === arrow.yDirection;
    });
  }
  render() {
    // There is no structure, using template tag is a bit pointless, hence it's hacky. Like.. this whole website :) 
    const parentDOM = document.createElement('div');
    const polygons = {
      left: 'polygon(0% 20%, 56% 38%, 60% 0%, 100% 50%, 60% 100%, 60% 59%, 0 65%)',
      right: 'polygon(100% 27%, 56% 38%, 60% 0%, 2% 43%, 60% 100%, 60% 59%, 100% 75%);'
    };
    const xPosition = `${this.xDirection}:${this.xPosition}%`;
    const yPosition = `${this.yDirection}:${this.yPosition}%`;
    const dom = `<div class="arrow-container" style="${xPosition}; ${yPosition}">
      <div class="arrow" style="width:${this.width};height:${this.height};clip-path: ${polygons[this.xDirection]} ;">
      </div>
      <p>${this.quote}${this.xPosition}:${this.yPosition}</p>
    </div>`;
    parentDOM.innerHTML = dom;
    document.body.append(parentDOM);
  }
}

document.addEventListener("DOMContentLoaded", () => { 
  let quotes = ["There's nothing else", "Click one of those", "I promise, it won't bite", "HERE, HERE", "Pretty sure you came for that", "LÀ LÀ"];
  // A quoteFactory would have been nice, I guess.
  // shuffle();
  quotes.forEach((quote, index) => {
    setTimeout(() => {
      arrows.push(new RandomQuote(quote));
    }, 2000 * index);
  });
});
