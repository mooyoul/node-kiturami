const
  Command = require('../command'),
  OPERATING_STATES = {
    INDOOR_TEMP_BASED_HEATING: '0004',
    WATER_TEMP_BASED_HEATING: '0005',
    HOT_WATER_ONLY: '0003',
    TIMETABLE_BASED_REPEATING: '0006', // Schedule based
    INTERVAL_BASED_REPEATING: '0001', // Interval based
    AWAY: '0002'
  };


class OperatingState extends Command {
  constructor() {
    super();

    this.displayName = 'COMMAND_OPERATING_STATE';

    this.id = '02';
    this.value = OPERATING_STATES.INDOOR_TEMP_BASED_HEATING;
  }

  indoorTempBasedHeating() {
    this.value = OPERATING_STATES.INDOOR_TEMP_BASED_HEATING;

    return this;
  }

  waterTempBasedHeating() {
    this.value = OPERATING_STATES.WATER_TEMP_BASED_HEATING;

    return this;
  }

  hotWaterOnly() {
    this.value = OPERATING_STATES.HOT_WATER_ONLY;

    return this;
  }

  timetableBasedRepeating() {
    this.value = OPERATING_STATES.TIMETABLE_BASED_REPEATING;

    return this;
  }

  intervalBasedRepeating() {
    this.value = OPERATING_STATES.INTERVAL_BASED_REPEATING;

    return this;
  }

  away() {
    this.value = OPERATING_STATES.AWAY;

    return this;
  }
}


module.exports = exports = OperatingState;
