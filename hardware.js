const { Gpio } =
  process.env.NODE_ENV !== "production"
    ? require("./mock-gpio")
    : require("pigpio");

const ws281x =
  process.env.NODE_ENV !== "production"
    ? {
        configure() {},
        render(pixels) {
          //console.log(pixels);
        },
        reset() {},
      }
    : require("rpi-ws281x");
ws281x.configure({
  leds: 12,
  dma: 12,
  brightness: 255,
  gpio: process.env.GPIO_LED_STRIP,
  type: "grb",
});

function exitHandler() {
  ws281x.reset();
  [
    process.env.GPIO_LED_STRIP,
    process.env.GPIO_PUMP_IN_1,
    process.env.GPIO_PUMP_IN_2,
    process.env.GPIO_SONAR_TRIGGER,
    process.env.GPIO_SONAR_ECHO,
  ].forEach((pin) => {
    const gpio = new Gpio(pin, { mode: Gpio.OUTPUT, alert: false });
    gpio.digitalWrite(0);
  });
  return 1;
}

process.on("exit", exitHandler.bind(null));
// catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// catches "kill pid"
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
// catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));

module.exports = {
  Gpio,
  ws281x,
};
