const {gsap} = require("gsap");
if (process.env.ENVIRONMENT === "dev") {
    var ws281x = {
        configure() { },
        render(pixels) {
            console.log(pixels);
        }
    }
} else {
    var ws281x = require('rpi-ws281x');
}
ws281x.configure({
    leds: 12,
    dma: 12,
    brightness: 255,
    gpio: 18,
    type: "grb"
});
gsap.ticker.fps(24);

class Strip {
  constructor() {
    this.pixels = new Array(12)
      .fill()
      .map((item, index) => ({ index, color: "#FF0000"}));
    this.flameColors = [
      "#860111",
      "#ff4605",
      "#ffd729",
      "#f8a42f",
      "#fa7900",
      "#e71e02"
    ];
  }

  getRandomFlameColor() {
    return this.flameColors[
      Math.floor(Math.random() * this.flameColors.length)
    ];
  }

  animateFlame() {
    gsap.to(this.pixels, 0.25, {color: () => this.getRandomFlameColor(), repeat: -1, repeatRefresh: true})
  }
  
//   draw() {
//     const pixelEls = [...document.querySelectorAll('.strip .pixel')];
//     pixelEls.forEach((el, index) => {
//       const {r, g, b} = this.pixels[index];
//       // console.log(r);
//       el.style.backgroundColor = this.pixels[index].color;
//     })
//   }
getColor(color) {
    const [r, g, b] = gsap.utils.splitColor(color);
    return (r << 16) | (g << 8) | b;
}

draw(){
    var pixels = new Uint32Array(this.pixels.length);
    
    this.pixels.forEach((pixel, i) => {
        pixels[i] = this.getColor(pixel.color);
    });
    
    // for (var i = 0; i < this.config.leds; i++)
    //     pixels[i] = this.getColor(...color);

    // Render to strip
    ws281x.render(pixels);
}
 
}

const strip = new Strip();
strip.animateFlame();
//strip.start();

gsap.ticker.add(strip.draw.bind(strip));



//strip.startFlame();
