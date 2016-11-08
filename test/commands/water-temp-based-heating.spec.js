const
  { expect }  = require('chai'),
  nock        = require('nock'),
  { KituramiCommands } = require('../../src/'),
  WaterTempBasedHeating = KituramiCommands.WaterTempBasedHeating;


describe('WaterTempBasedHeating', () => {
  const command = new WaterTempBasedHeating();

  it('constructor', () => {
    const command2 = new WaterTempBasedHeating(50);

    expect(command.displayName).to.be.a('string');
    expect(command.id).to.be.a('string');
    expect(command2.value).equals('0050');
  });

  it('setTargetTemp', () => {
    expect(() => command.setTargetTemp('aa')).to.throw(Error);
    expect(() => command.setTargetTemp(-10)).to.throw(Error);
    expect(() => command.setTargetTemp(100)).to.throw(Error);

    command.setTargetTemp();
    command.setTargetTemp(50);
    expect(command.toString()).equals('040050');
  });
});

