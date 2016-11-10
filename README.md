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
- 실시간 상태 수신



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

api.logIn('YOUR_ID', 'YOUR_PASSWORD')
  .then((body) => api.sendCommand(Commands.OperatingState.forge().indoorTempBasedHeating()))
  .then(() => api.sendCommand(Commands.IndoorTempBasedHeating.forge().setTargetTemp(24)))
  .then(() => api.sendCommand(Commands.RequestState.forge()))
  .catch((e) => {
    console.error(e.stack);
  });
```

nodeId와 API Key를 알고있다면, 로그인 과정을 생략할 수도 있습니다.

```javascript
'use strict';

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

상태 수신은 MQTT 클라이언트를 통해 실시간으로 수신되며, nodeId가 필요합니다.

상태 정보는 제어 정보가 변경되거나, `RequestState`를 통해 상태 요청 명령을 전송한 경우 갱신(수신) 됩니다.
 

```javascript
'use strict';

const
  { KituramiReceiver } = require('kiturami'),
  receiver = new KituramiReceiver('YOUR_NODE_ID');

receiver.on('message', (state, topic, bufMessage, bufPacket) => {
  console.log('Device state changed: ', state);
});
```

## API

본 섹션은 추후 업데이트 될 예정입니다.

### HTTPS API

#### KituramiHttpsAPI `constructor` (apiKey, nodeId) -> KituramiHttpsAPI

#### KituramiHttpsAPI.forge(apiKey, nodeId) -> KituramiHttpsAPI
A simple helper function to instantiate a new KituramiHttpsAPI without needing `new`.

#### KIturamiHttpsAPI.setAPIKey(apiKey)

#### KituramiHttpsAPI#login(username, password) -> Promise

#### KituramiHttpsAPI#logIn(username, password) -> Promise
Alias of KituramiHttpsAPI#login

#### KituramiHttpsAPI#associateNode(serial) -> Promise
Associate device node

#### KituramiHttpsAPI#sendCommand(Command|string|Buffer)-> Promise
Send command to API server



### Commands
#### KituramiCommands.PowerState
보일러 전원 설정

- KituramiCommands.PowerState#turnOff
- KituramiCommands.PowerState#turnOn

#### KituramiCommands.OperatingState 
동작 모드 설정 (단순한 동작 모드 변경, 세부 설정 기능이 아님에 주의)

- KituramiCommands.OperatingState#indoorTempBasedHeating
- KituramiCommands.OperatingState#waterTempBasedHeating
- KituramiCommands.OperatingState#hotWaterOnly
- KituramiCommands.OperatingState#timetableBasedRepeating
- KituramiCommands.OperatingState#intervalBasedRepeating
- KituramiCommands.OperatingState#away

#### KituramiCommands.IndoorTempBasedHeating
실내온도 모드 세부 설정 변경

- KituramiCommands.IndoorTempBasedHeating#setTargetTemp(temp)


#### KituramiCommands.WaterTempBasedHeating
난방수온도 모드 세부 설정 변경

- KituramiCommands.WaterTempBasedHeating#setTargetTemp(temp)

#### KituramiCommands.HotWaterOnly
목욕 모드 세부 설정 변경

- KituramiCommands.HotWaterOnly#setTargetTemp(temp)

#### KituramiCommands.IntervalBasedRepeating
가동시간 / 중지시간 설정을 사용하는 반복모드 세부 설정

- KituramiCommands.IntervalBasedRepeating#setInterval(runningMinutes, stoppingHours)
  - runningMinutes, stoppingHours 둘 다 Number 허용
  - runningMinutes 는 5분 단위만 허용
  - stoppingHours 는 시 단위만 허용


#### KituramiCommands.TimetableBasedRepeating
30분 단위 24시간 스케쥴을 사용하는 예약모드 세부 설정

- KituramiCommands.TimetableBasedRepeating#setInterval(timetable)
  - timetable은 48자의 String 형태임


#### KituramiCommands.RequestState
상태 요청, 본 명령 전송시 MQTT를 통해 상태가 실시간으로 전송됩니다.



### Receiver


#### KituramiReceiver `constructor` (nodeId, mqttOptions) -> KituramiReceiver
- mqttOptions.uri: MQTT Broker uri (e.g. `mqtt://test.mosquitto.org`)
- mqttOptions.username: Username for MQTT authentication
- mqttOptions.password: Password for MQTT authentication



#### KituramiReceiver.forge
A simple helper function to instantiate a new KituramiReceiver without needing `new`.


#### `message (state, topic, message, packet)`
- state.name: `INDOOR_TEMP_BASED_HEATING`, `WATER_TEMP_BASED_HEATING`, `HOT_WATER_ONLY`, `AWAY`, ...
- state.props: Related properties


#### State definitions
##### POWER_OFF
- name: POWER_OFF (전원 꺼짐)
- props: N/A

#### POWER_ON
- name: POWER_ON (전원 켜짐)
- props: N/A

#### INDOOR_TEMP_BASED_HEATING
- name: INDOOR_TEMP_BASED_HEATING (실내온도 기준 난방)
- props: Object (2 properties)
- props.targetTemp: Number (in celsius)
- props.currentTemp: Number (in celsius)

#### WATER_TEMP_BASED_HEATING
- name: WATER_TEMP_BASED_HEATING (난방수 온도 기준 난방)
- props: Object (2 properties)
- props.targetTemp: Number (in celsius)
- props.currentTemp: Number (in celsius)

#### HOT_WATER_ONLY
- name: HOT_WATER_ONLY (목욕모드 / 온수전용)
- props: Object (2 properties)
- props.targetTemp: Number (in celsius)
- props.currentTemp: Number (in celsius)

#### AWAY (외출모드)
- name: AWAY
- props: N/A

#### TIMETABLE_BASED_REPEATING (지정시간 기준 예약모드)
- name: TIMETABLE_BASED_REPEATING 
- props: Object (1 property)
- props.timetable: Boolean[], 30분단위, 총 24시간 = 48 slots
  - index 0 - 00:00 ~ 00:30
  - index 1 - 00:30 ~ 01:00
  - ...
  - index 46 - 23:00 ~ 23:30
  - index 47 - 23:30 ~ 24:00


#### INTERVAL_BASED_REPEATING (작동/유휴시간 기준 반복모드)
- name: INTERVAL_BASED_REPEATING
- props: Object (2 properties)
- props.activeMinutes: Number (가동시간, 분단위)
- props.pauseHours: Number (중지시간, 시단위)



## Debugging
Set `DEBUG` environment variable to `node-kiturami:*`.
You will see debug messages on your console.

> $ env DEBUG='node-kiturami:*' node your-app.js
 

## Testing

> $ npm run test

... OR

> $ npm run lint

> $ npm run coverage



## Build

> $ npm run build


## To-do

- [x] 제어 API 구현
- [x] 상태 수신을 위한 Receiver 구현
- [ ] TCP Socket API 구현


## License
[MIT](LICENSE)

See full license on [mooyoul.mit-license.org](http://mooyoul.mit-license.org/)


## Disclaimer

> 권리포기각서: 본 `node-kiturami` 패키지는 개인에 의해 만들어진 패키지입니다. 본 패키지의 개발 및 저장소 운영은 `(주)귀뚜라미보일러`와는 무관합니다.
> 본 패키지로 발생하는 책임은 각 사용자에게 있으며, 개발자가 보증하지 않습니다.
