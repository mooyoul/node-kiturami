const Command = require('../command');

class HotWaterOnlyCommand extends Command {
  constructor(temp = 35) {
    super();

    this.displayName = 'COMMAND_HOT_WATER_ONLY';
    this.id = '05';

    this.setTargetTemp(temp);
  }

  setTargetTemp(temp = 35) {
    if (isNaN(+temp)) {
      throw new Error('`temp` should be Number.');
    }

    const targetTemp = +temp;

    if (targetTemp < 35) {
      throw new Error('`temp` should be grater or equal than 35');
    }

    if (targetTemp > 60) {
      throw new Error('`temp` should be less or equal then 60');
    }

    this.value = `00${targetTemp}`;

    return this;
  }
}

module.exports = exports = HotWaterOnlyCommand;
