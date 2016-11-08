const Command = require('../command');

class RequestState extends Command {
  constructor() {
    super();

    this.displayName = 'COMMAND_REQUEST_STATE';

    this.id = '07';
    this.value = '0000';
  }
}


module.exports = exports = RequestState;
