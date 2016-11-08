const
  Command = require('../command');


class IntervalBasedRepeating extends Command {
  constructor() {
    super();

    this.displayName = 'COMMAND_INTERVAL_BASED_REPEATING';

    this.id = '10';
  }

  setInterval(runningMinutes = 20, stoppingHours = 1) {
    const
      targetMinutes = +runningMinutes,
      targetHours = +stoppingHours;

    if (isNaN(targetMinutes)) {
      throw new Error('`runningMinutes` should be number');
    }

    if (targetMinutes % 5) {
      throw new Error('`runningMinutes` should be multiply of 5');
    }

    if (targetMinutes < 10) {
      throw new Error('`runningMinutes` should be grater or equal than 10');
    }

    if (targetMinutes > 90) {
      throw new Error('`runningMinutes` should be less or equal then 90');
    }


    if (isNaN(stoppingHours)) {
      throw new Error('`stoppingHours` should be number');
    }

    if (targetHours < 1) {
      throw new Error('`stoppingHours` should be grater or equal than 1');
    }

    if (targetHours > 24) {
      throw new Error('`stoppingHours` should be less or equal then 24');
    }

    this.value = `0${runningMinutes}`.slice(-2) + `0${targetHours}`.slice(-2);

    return this;
  }
}


module.exports = exports = IntervalBasedRepeating;
