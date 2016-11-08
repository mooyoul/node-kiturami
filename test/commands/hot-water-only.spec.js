const
  { expect }  = require('chai'),
  nock        = require('nock'),
  { KituramiCommands } = require('../../src/'),
  HotWaterOnly = KituramiCommands.HotWaterOnly;


describe('HotWaterOnly', () => {
  const command = new HotWaterOnly();

  it('constructor', () => {
    const command2 = new HotWaterOnly(40);

    expect(command.displayName).to.be.a('string');
    expect(command.id).to.be.a('string');
    expect(command2.value).equals('0040');
  });

  it('setTargetTemp', () => {
    expect(() => command.setTargetTemp('aa')).to.throw(Error);
    expect(() => command.setTargetTemp(-10)).to.throw(Error);
    expect(() => command.setTargetTemp(100)).to.throw(Error);

    command.setTargetTemp();
    command.setTargetTemp(40);
    expect(command.toString()).equals('050040');
  });
});

