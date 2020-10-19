require("dotenv").config();
const { distance } = require("./distance");
const { ledStrip } = require("./led-strip");
const { pump } = require("./pump");
const { gsap } = require("gsap");
//ledStrip.flickerFlame();
// distance.on("distance-changed", (data) => {
//   console.log(data);
//   if (data.distance < data.lastDistance) {
//     ledStrip.flickerFlame();
//   }
// });

function getPumpDutyCycle(distance) {
  return Math.round(
    gsap.utils.normalize(10, 80, gsap.utils.clamp(10, 80, 90 - distance)) * 255
  );
}

distance.on("enter-range", (data) => {
  console.log("ENTERED", data);
  ledStrip.setActive().then(() => {
    pump.turnOn(192);
  });
  //const dutyCycle = getPumpDutyCycle(data.distance);
  //pump.turnOn(dutyCycle);
  //ledStrip.variedGreen(dutyCycle);
});

distance.on("leave-range", (data) => {
  console.log("LEFT", data);
  //pump.turnOff();
  pump.turnOff();
  ledStrip.flickerFlame();
});

// distance.on("range-change", (data) => {
//   console.log("CHANGE", data);
//   //const dutyCycle = getPumpDutyCycle(data.distance);
//   //pump.turnOn(dutyCycle);
//   //ledStrip.variedGreen(dutyCycle);
// });
distance.watch();
distance.start();
ledStrip.flickerFlame();

// const runLoop = () => {
//   ledStrip.flickerFlame();
//   pump.turnOff();
//   setTimeout(() => {
//     ledStrip.setFullGreen();
//     pump.turnOn(192);
//     setTimeout(() => {
//       runLoop();
//     }, 10000);
//   }, 10000);
// };

// runLoop();
