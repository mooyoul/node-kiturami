const
  { expect }  = require('chai'),
  nock        = require('nock'),
  { KituramiCommands } = require('../../src/'),
  IndoorTempBasedHeating = KituramiCommands.IndoorTempBasedHeating;


describe('IndoorTempBasedHeating', () => {
  const command = new IndoorTempBasedHeating();

  it('constructor', () => {
    const command2 = new IndoorTempBasedHeating(24);

    expect(command.displayName).to.be.a('string');
    expect(command.id).to.be.a('string');
    expect(command2.value).equals('0024');
  });

  it('setTargetTemp', () => {
    expect(() => command.setTargetTemp('aa')).to.throw(Error);
    expect(() => command.setTargetTemp(-10)).to.throw(Error);
    expect(() => command.setTargetTemp(100)).to.throw(Error);

    command.setTargetTemp();
    command.setTargetTemp(20);
    expect(command.toString()).equals('030020');
  });
});

