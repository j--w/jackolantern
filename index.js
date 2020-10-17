const { distance } = require("./distance");
const { ledStrip } = require("./led-strip");
const { pump } = require("./pump");
const { gsap } = require("gsap");
//ledStrip.animateFlame();
// distance.on("distance-changed", (data) => {
//   console.log(data);
//   if (data.distance < data.lastDistance) {
//     ledStrip.animateFlame();
//   }
// });

function getPumpDutyCycle(distance) {
  return Math.round(
    gsap.utils.normalize(10, 80, gsap.utils.clamp(10, 80, 90 - distance)) * 255
  );
}

distance.on("enter-range", (data) => {
  console.log("ENTERED", data);

  const dutyCycle = getPumpDutyCycle(data.distance);
  pump.turnOn(dutyCycle);
  ledStrip.variedGreen(dutyCycle);
});

distance.on("leave-range", (data) => {
  console.log("LEFT", data);
  pump.turnOff();
  ledStrip.animateFlame();
});

distance.on("range-change", (data) => {
  const dutyCycle = getPumpDutyCycle(data.distance);
  pump.turnOn(dutyCycle);
  ledStrip.variedGreen(dutyCycle);
});
distance.watch();
distance.start();
ledStrip.animateFlame();
