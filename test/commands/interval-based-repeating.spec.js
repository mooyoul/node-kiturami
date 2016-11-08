const
  { expect }  = require('chai'),
  nock        = require('nock'),
  { KituramiCommands } = require('../../src/'),
  IntervalBasedRepeating = KituramiCommands.IntervalBasedRepeating;


describe('IntervalBasedRepeating', () => {
  const command = new IntervalBasedRepeating();

  it('constructor', () => {
    expect(command.displayName).to.be.a('string');
    expect(command.id).to.be.a('string');
  });

  it('setInterval', () => {
    expect(() => command.setInterval(1)).to.throw(Error);
    expect(() => command.setInterval(1, 5)).to.throw(Error);
    expect(() => command.setInterval('a', 5)).to.throw(Error);
    expect(() => command.setInterval(1, 'foobar')).to.throw(Error);
    expect(() => command.setInterval(5, 0)).to.throw(Error);
    expect(() => command.setInterval(1000, 0)).to.throw(Error);
    expect(() => command.setInterval(10, 'a')).to.throw(Error);
    expect(() => command.setInterval(20, -10)).to.throw(Error);
    expect(() => command.setInterval(999999, 999999)).to.throw(Error);
    expect(() => command.setInterval(15, 999999)).to.throw(Error);

    command.setInterval();
    expect(command.toString()).equals('102001');

    command.setInterval(10, 3);
    expect(command.toString()).equals('101003');
  });
});

