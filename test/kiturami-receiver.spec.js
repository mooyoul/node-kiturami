/**
 * Module dependencies.
 */
const
  { expect }  = require('chai'),
  mqtt        = require('mqtt'),
  { KituramiReceiver } = require('../src/');

describe('KituramiReceiver Class', () => {
  const
    topic = 'node-kiturami:test',
    receiver = KituramiReceiver.forge(topic, {
      uri: 'mqtt://test.mosquitto.org',
      username: null,
      password: null
    });

  const mockPublisher = mqtt.connect('mqtt://test.mosquitto.org');

  it('has `forge` static method', () => {
    expect(KituramiReceiver.forge).to.be.a('function');
  });

  it('automatically connects to target mqtt broker', function(done) {
    this.timeout(30000);

    if (receiver.mqttClient.connected) {
      return done();
    }

    receiver.mqttClient.on('connect', () => {
      done();
    });
  });

  it('parse message from mqtt', function(done) {
    this.timeout(30000);

    receiver.once('message', (state) => {
      expect(state.name).equals('POWER_OFF');
      done();
    });

    mockPublisher.publish(topic, '010001');
  });

  it('ignore unrelated topic message', (done) => {
    receiver.once('message', onMessage);

    setTimeout(() => {
      receiver.removeListener('message', onMessage);
      done();
    }, 100);

    receiver._handleMessage('foobar', new Buffer('foobarbaz', 'utf8'));

    function onMessage() {
      done(new Error('unrelated topic message should be filtered'));
    }
  });

  it('parse without message', () => {
    expect(KituramiReceiver.parse()).equals(null);
    expect(KituramiReceiver.parse(new Buffer(0))).equals(null);
    expect(KituramiReceiver.parse(new Buffer([0x00, 0x00]))).equals(null);
  });

  it('parse POWER_OFF message', () => {
    const state = KituramiReceiver.parse(new Buffer('010001', 'utf8'));

    expect(state.name).equals('POWER_OFF');
  });

  it('parse POWER_ON message', () => {
    const state = KituramiReceiver.parse(new Buffer('010002', 'utf8'));

    expect(state.name).equals('POWER_ON');
  });

  it('parse INDOOR_TEMP_BASED_HEATING state', () => {
    const state = KituramiReceiver.parse(new Buffer('03002330', 'utf8'));

    expect(state.name).equals('INDOOR_TEMP_BASED_HEATING');
    expect(state.props.targetTemp).equals(23);
    expect(state.props.currentTemp).equals(30);
  });

  it('parse WATER_TEMP_BASED_HEATING state', () => {
    const state = KituramiReceiver.parse(new Buffer('04005860', 'utf8'));

    expect(state.name).equals('WATER_TEMP_BASED_HEATING');
    expect(state.props.targetTemp).equals(58);
    expect(state.props.currentTemp).equals(60);
  });

  it('parse AWAY state', () => {
    const state = KituramiReceiver.parse(new Buffer('060000', 'utf8'));

    expect(state.name).equals('AWAY');
  });

  it('parse TIMETABLE_BASED_REPEATING state', () => {
    const state = KituramiReceiver.parse(new Buffer('09100100000000000000000000000000000000000000001001', 'utf8'));

    expect(state.name).equals('TIMETABLE_BASED_REPEATING');
    expect(state.props.timetable[0]).equals(true);
    expect(state.props.timetable[1]).equals(false);
    expect(state.props.timetable[2]).equals(false);
    expect(state.props.timetable[3]).equals(true);
    expect(state.props.timetable[11]).equals(false);
    expect(state.props.timetable[16]).equals(false);
    expect(state.props.timetable[17]).equals(false);
    expect(state.props.timetable[43]).equals(false);
    expect(state.props.timetable[44]).equals(true);
    expect(state.props.timetable[45]).equals(false);
    expect(state.props.timetable[46]).equals(false);
    expect(state.props.timetable[47]).equals(true);
  });

  it('parse INTERVAL_BASED_REPEATING state', () => {
    const state = KituramiReceiver.parse(new Buffer('102004', 'utf8'));

    expect(state.name).equals('INTERVAL_BASED_REPEATING');
    expect(state.props.activeMinutes).equals(20);
    expect(state.props.pauseHours).equals(4);
  });

  it('parse unknown state', () => {
    expect(KituramiReceiver.parse('!@#%#@$', 'utf8')).equals(null);
  });

});
