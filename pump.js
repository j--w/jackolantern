console.log(process.env.NODE_ENV);
const { Gpio } =
  process.env.NODE_ENV !== "production"
    ? require("./mock-gpio")
    : require("pigpio");

class Pump {
  constructor() {
    this.in1 = new Gpio(12, { mode: Gpio.OUTPUT });
    this.in2 = new Gpio(13, { mode: Gpio.OUTPUT });
  }

  turnOn(dutyCycle) {
    this.in2.pwmWrite(dutyCycle);
  }

  turnOff() {
    this.in1.digitalWrite(0);
    this.in2.digitalWrite(0);
  }
}

const pump = new Pump();

module.exports = {
  pump,
};
