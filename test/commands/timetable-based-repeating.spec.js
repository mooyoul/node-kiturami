const
  { expect }  = require('chai'),
  nock        = require('nock'),
  { KituramiCommands } = require('../../src/'),
  TimetableBasedRepeating = KituramiCommands.TimetableBasedRepeating;


describe('TimetableBasedRepeating', () => {
  const command = new TimetableBasedRepeating();

  it('constructor', () => {
    expect(command.displayName).to.be.a('string');
    expect(command.id).to.be.a('string');
  });

  it('setInterval', () => {
    expect(() => command.setInterval(1)).to.throw(Error);
    expect(() => command.setInterval('foobarbaz')).to.throw(Error);
    expect(() => command.setInterval('001010101100')).to.throw(Error);
    expect(() => command.setInterval('1010000000000000000000000000000000000000000000ff')).to.throw(Error);

    command.setInterval();
    expect(command.toString()).equals('09000000000000000000000000000000000000000000000000');

    command.setInterval('101000000000000000000000000000000000000000000000');
    expect(command.toString()).equals('09101000000000000000000000000000000000000000000000');
  });
});

