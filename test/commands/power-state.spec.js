const
  { expect }  = require('chai'),
  nock        = require('nock'),
  { KituramiCommands } = require('../../src/'),
  { PowerState } = KituramiCommands;


describe('PowerState', () => {
  const command = new PowerState();

  it('constructor', () => {
    expect(command.displayName).to.be.a('string');
    expect(command.id).to.be.a('string');
  });


  it('turnOn', () => {
    command.turnOn();
    expect(command.toString()).equals('010002');
    expect(PowerState.forge(true).toString()).equals('010002');
  });

  it('turnOff', () => {
    command.turnOff();
    expect(command.toString()).equals('010001');
    expect(PowerState.forge(false).toString()).equals('010001');
  });

  it('toBuffer', () => {
    const buf = command.toBuffer();

    expect(buf).instanceOf(Buffer);
    expect(buf.toString('hex')).equals((new Buffer(command.toString(), 'utf8')).toString('hex'));
  });

  it('toJSON', () => {
    const data = command.toJSON();

    expect(data.name).to.be.a('string');
    expect(data.id).to.be.a('string');
    expect(data.value).to.be.a('string');
  });
});

