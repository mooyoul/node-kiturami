const Command = require('../command');

class IndoorTempBasedHeatingCommand extends Command {
  constructor(temp = 10) {
    super();

    this.displayName = 'COMMAND_INDOOR_TEMP_BASED_HEATING';
    this.id = '03';

    this.setTargetTemp(temp);
  }

  setTargetTemp(temp = 10) {
    if (isNaN(+temp)) {
      throw new Error('`temp` should be Number.');
    }

    const targetTemp = +temp;

    if (targetTemp < 10) {
      throw new Error('`temp` should be grater or equal than 10');
    }

    if (targetTemp > 45) {
      throw new Error('`temp` should be less or equal then 45');
    }

    this.value = `00${targetTemp}`;

    return this;
  }
}

module.exports = exports = IndoorTempBasedHeatingCommand;
