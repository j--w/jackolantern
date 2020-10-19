const { gsap } = require("gsap");
const { ws281x } = require("./hardware");

class LEDStrip {
  constructor() {
    this.pixels = new Array(12)
      .fill()
      .map((item, index) => ({ index, color: "#FF0000" }));

    this.flameColors = [
      "#972207",
      "#f88909",
      "#0b0404",
      "#faf015",
      "#f56408",
      "#000000",
    ];
    gsap.ticker.fps(24);
    gsap.ticker.add(this.draw.bind(this));
    this.currentTween = null;
  }

  getRandomFlameColor() {
    return this.flameColors[
      Math.floor(Math.random() * this.flameColors.length)
    ];
  }

  animateFlame() {
    this.killTween();
    this.currentTween = gsap.to(this.pixels, 0.25, {
      color: () => this.getRandomFlameColor(),
      repeat: -1,
      repeatRefresh: true,
      onComplete: () => {
        this.turnOff();
      },
    });
  }

  variedGreen(dutyCycle) {
    this.killTween();
    this.currentTween = gsap.to(this.pixels, 0, {
      color: `rgb(0, ${dutyCycle}, 0)`,
    });
  }

  setFullGreen() {
    this.killTween();
    this.currentTween = gsap.to(this.pixels, 0.25, {
      color: "#000000",
      ease: "quint.easeOut",
      onComplete: () => {
        this.currentTween = gsap.to(this.pixels, 3, {
          color: "rgb(0, 255, 0)",
          ease: "quint.easeIn",
        });
      },
    });
  }

  getColor(color) {
    const [r, g, b] = gsap.utils.splitColor(color);
    return (r << 16) | (g << 8) | b;
  }

  killTween() {
    if (this.currentTween) {
      console.log("Kill tween");
      this.currentTween.kill();
      this.currentTween = null;
    }
  }

  turnOff() {
    this.killTween();
    this.pixels.forEach((pixel) => {
      pixel.color = "#000000";
    });
  }

  draw() {
    var pixels = new Uint32Array(this.pixels.length);

    this.pixels.forEach((pixel, i) => {
      pixels[i] = this.getColor(pixel.color);
    });

    ws281x.render(pixels);
  }
}

const ledStrip = new LEDStrip();
module.exports = {
  ledStrip,
};
