const { distance } = require("./distance");
const { ledStrip } = require("./led-strip");

//ledStrip.animateFlame();
distance.on("distance-changed", (data) => {
  console.log(data);
  if (data.distance < data.lastDistance) {
    ledStrip.animateFlame();
  }
});
distance.watch();
distance.start();
ledStrip.turnOff();
