const { Gpio } =
  process.env.NODE_ENV !== "production"
    ? require("./mock-gpio")
    : require("pigpio");
const EventEmitter = require("events");

class Distance extends EventEmitter {
  constructor() {
    super();
    this.trigger = new Gpio(23, { mode: Gpio.OUTPUT });
    this.echo = new Gpio(24, { mode: Gpio.INPUT, alert: true });
    this.trigger.digitalWrite(0);
    this.triggerInterval = null;
  }

  watch() {
    let startTick;
    let lastDistance;

    this.echo.on("alert", (level, tick) => {
      if (level == 1) {
        startTick = tick;
      } else {
        const endTick = tick;
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        const distance = diff / 2 / Distance.MICROSECDONDS_PER_CM;
        if (
          lastDistance &&
          distance < 90 &&
          Math.abs(distance - lastDistance) > 5
        ) {
          if (lastDistance >= 90) {
            this.emit("enter-range", { distance, lastDistance });
          } else {
            this.emit("range-change", { distance, lastDistance });
          }
        } else if (lastDistance < 90 && distance >= 90) {
          this.emit("leave-range", { distance, lastDistance });
        }
        lastDistance = distance;
      }
    });
  }

  start() {
    this.stop();
    this.triggerInterval = setInterval(() => {
      this.trigger.trigger(10, 1);
    }, 500);
  }

  stop() {
    if (this.triggerInterval) {
      clearInterval(this.triggerInterval);
      this.triggerInterval = null;
    }
  }
}

Distance.MICROSECDONDS_PER_CM = 1e6 / 34321;
const distance = new Distance();
module.exports = { distance };
