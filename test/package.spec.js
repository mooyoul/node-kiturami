/**
 * Module dependencies.
 */
const
  { expect }  = require('chai'),
  kiturami    = require('../src/');


describe('kiturami module', () => {
  it('should exports `KituramiHttpsAPI` class constructor', () => {
    expect(kiturami.KituramiHttpsAPI).to.be.a('function');
  });

  it('should exports `KituramiCommands` object', () => {
    expect(kiturami.KituramiCommands).to.be.a('object');
  });
});
