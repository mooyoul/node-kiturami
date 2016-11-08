/**
 * Module dependencies.
 */
const
  { expect }  = require('chai'),
  nock        = require('nock'),
  { KituramiHttpsAPI, KituramiCommands } = require('../src/');

describe('KituramiHttpsAPI Class', () => {
  const api = new KituramiHttpsAPI();

  beforeEach(() => {
    nock.cleanAll();
  });

  it('has `getAPIKey` method', () => {
    const _api = new KituramiHttpsAPI('foo');
    expect(_api.getAPIkey()).equals('foo');
  });

  it('has `setAPIKey` method', () => {
    const key = 'foobarbaz';

    api.setAPIKey();
    api.setAPIKey(key);

    expect(api.getAPIkey()).equals(key);
  });

  it('has `getNodeId` method', () => {
    const _api = new KituramiHttpsAPI('foo', 'bar');

    expect(_api.getNodeId()).equals('bar');
  });

  it('has `setNodeId` method', () => {
    const id = '12345:12345:1';

    api.setNodeId();
    api.setNodeId(id);

    expect(api.getNodeId()).equals(id);
  });

  it('should reject promise when server respond without status code 200', (done) => {
    nock('https://smart.krb.co.kr:8443')
      .get(/.+/)
      .reply(400, 'Bad Request');

    api.request({
      method: 'GET',
      url: '/some-url'
    }).catch((e) => {
      expect(e).instanceOf(Error);
      done();
    });
  });

  it('should reject promise when request fails', (done) => {
    nock('https://smart.krb.co.kr:8443')
      .get(/.+/)
      .socketDelay(100)
      .reply(400, 'Bad Request');

    api.request({
      method: 'GET',
      url: '/some-url',
      timeout: 50
    }).catch((e) => {
      expect(e).instanceOf(Error);
      done();
    });
  });

  it('should send login request', (done) => {
    nock('https://smart.krb.co.kr:8443')
      .post(/.+/)
      .reply(200, 'OK');


    api.logIn().catch((e) => {
      expect(e).instanceOf(Error);

      return api.logIn('foo');
    }).catch((e) => {
      expect(e).instanceOf(Error);
      return api.logIn('foo', 'bar');
    }).asCallback(done);
  });

  it('should set apiKey/nodeId automatically', (done) => {
    nock('https://smart.krb.co.kr:8443')
      .post(/.+/)
      .reply(200, {
        key: 'ashfsakfsa',
        nodeId: '33333:33333:7'
      });

    api.logIn('aaaaa', 'bbbb').tap((body) => {
      expect(body.key).equals(api.getAPIkey());
      expect(body.nodeId).equals(api.getNodeId());
    }).asCallback(done);
  });


  it('should send device associate request', (done) => {
    const _api = new KituramiHttpsAPI();

    nock('https://smart.krb.co.kr:8443')
      .post(/.+/)
      .reply(200, 'OK');

    _api.associateNode().catch((e) => {
      expect(e).instanceOf(Error);
      return api.associateNode();
    }).catch((e) => {
      expect(e).instanceOf(Error);
      return api.associateNode('foobarbaz');
    }).catch((e) => {
      expect(e).instanceOf(Error);
      return api.associateNode('aabbcc');
    }).asCallback(done);
  });



  it('should send commands', (done) => {
    const _api = new KituramiHttpsAPI();

    nock('https://smart.krb.co.kr:8443')
      .post(/.+/)
      .reply(200, 'OK');


    _api.sendCommand('000000')
    .catch((e) => {
      expect(e).instanceOf(Error);
      _api.setAPIKey('foobarbaz');

      return _api.sendCommand('123456');
    }).catch((e) => {
      expect(e).instanceOf(Error);

      return api.sendCommand('12341234');
    }).asCallback(done);
  });

  it('should send commands (w/ command)', (done) => {
    nock('https://smart.krb.co.kr:8443')
      .post(/.+/)
      .reply(200, 'OK');


    api.sendCommand(KituramiCommands.RequestState.forge())
    .asCallback(done);
  });
});
