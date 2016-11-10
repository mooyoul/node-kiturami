/**
 * Module dependencies.
 */

const
  EventEmitter            = require('events'),
  debug                   = require('debug'),
  mqtt                    = require('mqtt'),
  log                     = debug('node-kiturami:KituramiReceiver'),
  DEFAULT_MQTT_BROKER_URI = 'mqtt://121.141.70.61',
  DEFAULT_MQTT_USERNAME   = 'tester2',
  DEFAULT_MQTT_PASSWORD   = 'default2';


class KituramiReceiver extends EventEmitter {
  static forge(...args) {
    return new this(...args);
  }

  constructor(nodeId = '', mqttOptions = {}) {
    super();

    this.nodeId = nodeId;

    const client = this.mqttClient = mqtt.connect(mqttOptions.uri || DEFAULT_MQTT_BROKER_URI, {
      username: mqttOptions.username === undefined ? DEFAULT_MQTT_USERNAME : mqttOptions.username,
      password: mqttOptions.username === undefined ? DEFAULT_MQTT_PASSWORD : mqttOptions.password
    }).on('connect', () => {
      log('Connected to MQTT Broker');

      client.subscribe(nodeId, { qos: 1 });
    }).on('message', this._handleMessage.bind(this));

    ['error'].forEach((eventName) => {
      this.mqttClient.on(eventName, this._proxyEvent(eventName).bind(this));
    });
  }

  _handleMessage(topic, bufMessage, bufPacket) {
    log('Got message from broker (topic: %s): %s', topic, bufMessage);

    if (topic !== this.nodeId) {
      return log('topic %s mismatches with nodeId %s. ignore message...', topic, this.nodeId);
    }

    const state = KituramiReceiver.parse(bufMessage);

    if (state) {
      this.emit('message', state, topic, bufMessage, bufPacket);
    }
  }

  // @todo Refactor
  static parse(bufMessage) {
    if (!(bufMessage && bufMessage.length > 2)) {
      log('failed to parse message, message is invalid format.');
      return null;
    }

    const typeId = bufMessage.slice(0, 2).toString('utf8');

    switch (typeId) {
      case '01':
        return {
          name: bufMessage.slice(2, 6).toString('utf8') === '0001' ? 'POWER_OFF' : 'POWER_ON'
        };
      case '03':
      case '04':
      case '05':
        return {
          name: ({
            '03': 'INDOOR_TEMP_BASED_HEATING',
            '04': 'WATER_TEMP_BASED_HEATING',
            '05': 'HOT_WATER_ONLY'
          })[typeId],
          props: {
            targetTemp: +bufMessage.slice(4, 6).toString('utf8'),
            currentTemp: +bufMessage.slice(6, 8).toString('utf8')
          }
        };
      case '06':
        return {
          name: 'AWAY'
        };
      case '09':
        return {
          name: 'TIMETABLE_BASED_REPEATING',
          props: {
            timetable: bufMessage.slice(2, 50).toString('utf8').split('').map(v => v === '1')
          }
        };
      case '10':
        return {
          name: 'INTERVAL_BASED_REPEATING',
          props: {
            activeMinutes: +bufMessage.slice(2, 4).toString('utf8'),
            pauseHours: +bufMessage.slice(4, 6).toString('utf8')
          }
        };
      default:
        log('failed to parse message. message type is unknown (id: %s).', typeId);
        return null;
    }
  }

  _proxyEvent(name) {
    /* istanbul ignore next */
    return (...eventArgs) => {
      this.emit(name, ...eventArgs);
    };
  }
}

module.exports = exports = KituramiReceiver;
