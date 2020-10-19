const { Gpio } = require("./hardware");
const EventEmitter = require("events");

class Distance extends EventEmitter {
  constructor() {
    super();
    this.trigger = new Gpio(process.env.GPIO_SONAR_TRIGGER, {
      mode: Gpio.OUTPUT,
    });
    this.echo = new Gpio(process.env.GPIO_SONAR_ECHO, {
      mode: Gpio.INPUT,
      alert: true,
    });
    this.trigger.digitalWrite(0);
    this.triggerInterval = null;
    this.isEntered = false;
  }

  watch() {
    let startTick;
    let distanceSample = [];
    this.echo.on("alert", (level, tick) => {
      if (level == 1) {
        startTick = tick;
      } else {
        const endTick = tick;
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        const distance = diff / 2 / Distance.MICROSECDONDS_PER_CM;
        if (distanceSample.length >= 5) {
          const medianDistance = Distance.median(distanceSample);
          if (!this.isEntered && medianDistance <= 100) {
            this.isEntered = true;
            this.emit("enter-range", { distance: medianDistance });
          } else if (this.isEntered && medianDistance > 100) {
            this.isEntered = false;
            this.emit("leave-range", { distance: medianDistance });
          }
          distanceSample = [];
        }
        distanceSample.push(distance);
        // if (
        //   lastDistance &&
        //   distance < 90 &&
        //   Math.abs(distance - lastDistance) > 5
        // ) {
        //   if (lastDistance >= 90) {
        //     this.emit("enter-range", { distance, lastDistance });
        //   } else {
        //     this.emit("range-change", { distance, lastDistance });
        //   }
        // } else if (lastDistance < 90 && distance >= 90) {
        //   this.emit("leave-range", { distance, lastDistance });
        // }
        // lastDistance = distance;
      }
    });
  }

  start() {
    this.stop();
    this.triggerInterval = setInterval(() => {
      this.trigger.trigger(10, 1);
    }, 100);
  }

  stop() {
    if (this.triggerInterval) {
      clearInterval(this.triggerInterval);
      this.triggerInterval = null;
    }
  }

  static median(numbers) {
    // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
    var median = 0,
      numsLen = numbers.length;
    numbers.sort();

    if (
      numsLen % 2 ===
      0 // is even
    ) {
      // average of two middle numbers
      median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else {
      // is odd
      // middle number only
      median = numbers[(numsLen - 1) / 2];
    }

    return median;
  }
}

Distance.MICROSECDONDS_PER_CM = 1e6 / 34321;
const distance = new Distance();
module.exports = { distance };
