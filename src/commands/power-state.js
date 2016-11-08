const
  Command = require('../command'),
  POWER_STATES = {
    TURN_OFF: '0001',
    TURN_ON: '0002'
  };


class PowerState extends Command {
  constructor(shouldTurnOn) {
    super();

    this.displayName = 'COMMAND_POWER_STATE';

    this.id = '01';
    this.value = shouldTurnOn ? POWER_STATES.TURN_ON : POWER_STATES.TURN_OFF;
  }

  turnOn() {
    this.value = POWER_STATES.TURN_ON;
    return this;
  }

  turnOff() {
    this.value = POWER_STATES.TURN_OFF;
    return this;
  }
}


module.exports = exports = PowerState;
