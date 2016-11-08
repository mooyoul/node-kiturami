const Command = require('../command');

class WaterTempBasedHeatingCommand extends Command {
  constructor(temp = 45) {
    super();

    this.displayName = 'COMMAND_WATER_TEMP_BASED_HEATING';
    this.id = '04';

    this.setTargetTemp(temp);
  }

  setTargetTemp(temp = 45) {
    if (isNaN(+temp)) {
      throw new Error('`temp` should be Number.');
    }

    const targetTemp = +temp;

    if (targetTemp < 45) {
      throw new Error('`temp` should be grater or equal than 45');
    }

    if (targetTemp > 85) {
      throw new Error('`temp` should be less or equal then 85');
    }

    this.value = `00${targetTemp}`;

    return this;
  }
}

module.exports = exports = WaterTempBasedHeatingCommand;
