# node-kiturami
[![Build Status](https://travis-ci.org/mooyoul/node-kiturami.svg?branch=master)](https://travis-ci.org/mooyoul/node-kiturami)
[![Coverage Status](https://coveralls.io/repos/github/mooyoul/node-kiturami/badge.svg?branch=master)](https://coveralls.io/github/mooyoul/node-kiturami?branch=master)
[![codecov.io](https://codecov.io/github/mooyoul/node-kiturami/coverage.svg?branch=master)](https://codecov.io/github/mooyoul/node-kiturami?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/mooyoul/node-kiturami/badges/score.svg)](https://www.bithound.io/github/mooyoul/node-kiturami)
[![Dependency Status](https://david-dm.org/mooyoul/node-kiturami.svg)](https://david-dm.org/mooyoul/node-kiturami)
[![devDependency Status](https://david-dm.org/mooyoul/node-kiturami/dev-status.svg)](https://david-dm.org/mooyoul/node-kiturami#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/mooyoul/node-kiturami/badge.svg)](https://snyk.io/test/github/mooyoul/node-kiturami)
[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://mooyoul.mit-license.org/)

Unofficial kiturami iot thermo controller API for Node.js

_비공식_ 귀뚜라미 IoT 온도제어기 Javascript API

본 API는 CTR-15WIFI (순간식) 모델에서 테스트되었습니다.



## Requirements

- Node.js
- 귀뚜라미 IoT 온도제어기 계정 - 휴대폰에서 미리 연동하세요.
 
 
## Features

현재 구현 및 지원하는 API 목록은 다음과 같습니다:

- API 인증을 위한 로그인 API
- 디바이스 노드 할당 (associate) API
- 난방방식 설정 API
  - 실내모드
  - 난방수온모드
  - 목욕기능
  - 예약기능
  - 외출기능

- 각 난방 방식별 온도 설정 API
- 예약기능 설정 API 
- 상태 요청 API



## Installing

패키지는 NPM을 통해 손쉽게 설치하실 수 있습니다:
 
> $ npm install kiturami --save


## Getting Started

API에 접근하기 위해서는 API Key와 온도제어기의 nodeId가 필요하나,
로그인 API를 통해 API Key로 nodeId를 받아올 수 있습니다.

로그인 API 호출시 응답 본문에 API Key와 nodeId가 존재한다면, 해당 값들은 자동으로 인스턴스에 설정됩니다.


다음 예제는 다음과 같은 기능을 수행합니다:

1. 로그인 API를 통해 API Key와 nodeId를 설정
2. 실내온도를 기준으로 난방을 하는 실내모드 변경
3. 난방이 동작하는 대상 온도를 24도로 설정
4. 상태 갱신을 위한 상태 요청
 

App을 실행시킨 상태에서 아래 코드 스니펫을 실행시, 휴대폰에서 상태가 동기화되는 것을 확인할 수 있습니다.


```javascript
'use strict';

const
  kiturami = require('kiturami'),
  KituramiHttpsAPI = kiturami.KituramiHttpsAPI,
  Commands  = kiturami.KituramiCommands,
  api = new KituramiHttpsAPI();

api.logIn('YOUR_ID', 'YOUR_PASSWORd')
  .then((body) => api.sendCommand(Commands.OperatingState.forge().indoorTempBasedHeating()))
  .then(() => api.sendCommand(Commands.IndoorTempBasedHeating.forge().setTargetTemp(24)))
  .then(() => api.sendCommand(Commands.RequestState.forge()))
  .catch((e) => {
    console.error(e.stack);
  });
```

nodeId와 API Key를 알고있다면, 로그인 과정을 생략할 수도 있습니다.

```javascript
const
  kiturami = require('kiturami'),
  KituramiHttpsAPI = kiturami.KituramiHttpsAPI,
  Commands  = kiturami.KituramiCommands,
  api = new KituramiHttpsAPI('YOUR_API_KEY', 'YOUR_NODE_ID');
  
// you can set apiKey or nodeId by following methods:
// api = new KituramiHttpsAPI();
// api.setAPIKey('YOUR_API_KEY');
// api.setNodeId('YOUR_NODE_ID');

api.sendCommand(Commands.OperatingState.forge().indoorTempBasedHeating())
  .then(() => api.sendCommand(Commands.IndoorTempBasedHeating.forge().setTargetTemp(24)))
  .then(() => api.sendCommand(Commands.RequestState.forge()))
  .catch((e) => {
    console.error(e.stack);
  });

```

## API

본 섹션은 추후 업데이트 될 예정입니다.

### HTTPS API

### Commands




## Testing

> $ npm run lint
> $ npm run coverage


## Build

> $ npm run build


## To-do

- [x] 제어 API 구현
- [ ] 상태 수신을 위한 Receiver 구현
- [ ] TCP Socket API 구현


## License
[MIT](LICENSE)

See full license on [mooyoul.mit-license.org](http://mooyoul.mit-license.org/)


## Disclaimer

> 권리포기각서: 본 `node-kiturami` 패키지는 개인에 의해 만들어진 패키지입니다. 본 패키지의 개발 및 저장소 운영은 `(주)귀뚜라미보일러`와는 무관합니다.
> 본 패키지로 발생하는 책임은 각 사용자에게 있으며, 개발자가 보증하지 않습니다.
