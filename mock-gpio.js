class Gpio {
  constructor(pin, config) {
    this.pin = pin;
    console.log(`${this.pin} created as ${config.mode}`);
  }
  on() {
    console.log(`Listener added to ${this.pin}`);
  }

  trigger() {
    console.log(`${this.pin} triggered with ${[...arguments].join(", ")}`);
  }

  digitalWrite(val) {
    console.log(`${this.pin} digital write ${val}`);
  }
  pwmWrite(duty) {
    console.log(`${this.pin} pwm write ${duty}`);
  }
}

module.exports = { Gpio };
