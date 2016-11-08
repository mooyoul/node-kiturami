const
  Command = require('../command');


class TimetableBasedRepeating extends Command {
  constructor() {
    super();

    this.displayName = 'COMMAND_TIMETABLE_BASED_REPEATING';

    this.id = '09';
  }

  setInterval(timetable = '000000000000000000000000000000000000000000000000') {
    if (typeof timetable !== 'string') {
      throw new Error('`timetable` should be string');
    }

    if (timetable.length !== 48) {
      throw new Error('`timetable` should be 48 chars string.');
    }

    const hasInvalidChar = timetable.split('').some(v => v !== '0' && v !== '1');

    if (hasInvalidChar) {
      throw new Error('`timetable should be bit (0/1) string');
    }


    this.value = timetable;

    return this;
  }
}


module.exports = exports = TimetableBasedRepeating;
