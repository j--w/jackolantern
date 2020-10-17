const { gsap } = require("gsap");
const ws281x =
  process.env.NODE_ENV !== "production"
    ? {
        configure() {},
        render(pixels) {
          //console.log(pixels);
        },
      }
    : require("rpi-ws281x");

class LEDStrip {
  constructor() {
    ws281x.configure({
      leds: 12,
      dma: 12,
      brightness: 255,
      gpio: 18,
      type: "grb",
    });

    this.pixels = new Array(12)
      .fill()
      .map((item, index) => ({ index, color: "#FF0000" }));

    this.flameColors = [
      "#860111",
      "#ff4605",
      "#ffd729",
      "#f8a42f",
      "#fa7900",
      "#e71e02",
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
