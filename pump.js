const { Gpio } = require("./hardware");

class Pump {
  constructor() {
    this.in2 = new Gpio(process.env.GPIO_PUMP_IN_2, { mode: Gpio.OUTPUT });
    this.in1 = new Gpio(process.env.GPIO_PUMP_IN_1, { mode: Gpio.OUTPUT });
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
