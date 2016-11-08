/**
 * Module dependencies.
 */
const
  Promise           = require('bluebird'),
  debug             = require('debug'),
  request           = require('request'),
  Command           = require('./command'),
  log               = debug('node-kiturami:KituramiHttpsAPI'),
  DEFAULT_API_KEY   = '11111111-1111-1111-1111-00000000001',
  API_BASE_URL      = 'https://smart.krb.co.kr:8443/harmony/openapi';


/**
 * KituramiHttpsAPI Class
 */
class KituramiHttpsAPI {
  /**
   * KituramiHttpsAPI Class constructor
   *
   * @param apiKey
   * @param nodeId
   */
  constructor(apiKey = '', nodeId = '') {
    this.setAPIKey(apiKey);
    this.setNodeId(nodeId);
  }

  /**
   * `apikey` getter
   *
   * @returns {string|string|*}
   */
  getAPIkey() {
    return this.apiKey;
  }

  /**
   * `apiKey` setter
   *
   * Set `apiKey` and re-create `request` defaults instance
   * to inject `X-OPENAPIKEY` header automatically
   *
   * @param apiKey
   */
  setAPIKey(apiKey = '') {
    this.apiKey = apiKey || DEFAULT_API_KEY;

    this._request = request.defaults({
      baseUrl: API_BASE_URL,
      headers: {
        'X-OPENAPIKEY': this.apiKey
        // @note Omitted User-Agent header.
      }
    });
  }

  /**
   * `nodeId` getter
   *
   * @returns {string|*}
   */
  getNodeId() {
    return this.nodeId;
  }


  /**
   * `nodeId` setter
   *
   * @param nodeId
   */
  setNodeId(nodeId = '') {
    this.nodeId = nodeId;
  }

  /**
   * Base `request` method.
   *
   * @param options
   * @returns {Promise.<*>}
   */
  request(options) {
    return new Promise((resolve, reject) => {
      this._request(options, (e, res, body) => {
        if (e) { return reject(e); }

        if (res.statusCode !== 200) {
          return reject(new Error('Unexpected response code'));
        }

        resolve(body);
      });
    });
  }

  /**
   * login
   *
   * login into service.
   * If login was successful, user profile will be returned
   * and `apiKey` and `nodeId` will be set automatically if found.
   *
   * @param username
   * @param password
   * @returns {Promise.<*>}
   */
  login(username = '', password = '') {
    if (!username) {
      return Promise.reject(new Error('Username must be specified.'));
    }

    if (!password) {
      return Promise.reject(new Error('Password must be specified.'));
    }

    return this.request({
      method: 'POST',
      url: '/user/login.do',
      json: true,
      body: {
        loginId: username,
        password
      }
    }).tap((body) => {
      if (body && body.key) {
        this.setAPIKey(body.key);
      }
      if (body && body.nodeId) {
        this.setNodeId(body.nodeId);
      }
    });
  }

  /**
   * Alias of `login` method.
   *
   * @param args
   * @returns {Promise.<*>}
   */
  logIn(...args) {
    return this.login(...args);
  }


  /**
   * Associate target node (device)
   *
   * @param serial
   * @returns {Promise.<*>}
   */
  associateNode(serial = '') {
    if (this.apiKey === DEFAULT_API_KEY) {
      return Promise.reject(new Error('You must set apiKey before associate node.'));
    }

    if (!(serial && serial.length === 6)) {
      return Promise.reject('Associate serial should be 6 chars.');
    }

    return this.request({
      method: 'POST',
      url: '/device/select/nodeid.json',
      json: true,
      body: {
        productNo: serial
      }
    });
  }

  /**
   * Send command message to server
   *
   * @param message
   * @returns {Promise.<*>}
   */
  sendCommand(_message) {
    let message = _message;

    if (this.apiKey === DEFAULT_API_KEY) {
      return Promise.reject(new Error('You must set apiKey before send command.'));
    }

    if (!this.nodeId) {
      return Promise.reject(new Error('You must set nodeId before send command.'));
    }

    if (message instanceof Command) {
      log('sendCommand - Got Command instance, casting to string..');
      message = message.toString();
      log('casted string: %s', message);
    }

    return this.request({
      method: 'POST',
      url: '/device/manage/udm.do',
      json: true,
      body: {
        source: 'HANDYPIA_MW',
        nodeId: this.nodeId,
        message
      }
    });
  }
}

module.exports = exports = KituramiHttpsAPI;
