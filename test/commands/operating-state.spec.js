const
  { expect }  = require('chai'),
  nock        = require('nock'),
  { KituramiCommands } = require('../../src/'),
  { OperatingState } = KituramiCommands;


describe('OperatingState', () => {
  const command = new OperatingState();

  it('constructor', () => {
    expect(command.displayName).to.be.a('string');
    expect(command.id).to.be.a('string');
  });


  it('indoorTempBasedHeating', () => {
    command.indoorTempBasedHeating();
    expect(command.toString()).equals('020004');
  });

  it('waterTempBasedHeating', () => {
    command.waterTempBasedHeating();
    expect(command.toString()).equals('020005');
  });

  it('hotWaterOnly', () => {
    command.hotWaterOnly();
    expect(command.toString()).equals('020003');
  });

  it('intervalBasedRepeating', () => {
    command.intervalBasedRepeating();
    expect(command.toString()).equals('020001');
  });

  it('timetableBasedRepeating', () => {
    command.timetableBasedRepeating();
    expect(command.toString()).equals('020006');
  });

  it('away', () => {
    command.away();
    expect(command.toString()).equals('020002');
  });

});

