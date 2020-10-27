# React Native + React MonoRepo

## 구성 요소

- yarn workspace
  - yarn에서 제공하는 multiple packages setup tool
- lerna
  - monorepo 구성 tool, 현재 yarn workspace로 패키지관리하며, lerna에서 제공하는 script(lerna clean 등) 사용 위해서 설치
- CRA(with typescript template)
- React Native(React Native CLI with typescript template)

## 필수요소

- [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)
- [React Native 환경설정](https://reactnative.dev/docs/environment-setup)
  - node, watchman, xcode 설치 필요

## 참고자료

- https://y0c.github.io/2019/06/14/monorepo-tutorial/

- https://medium.com/@ratebseirawan/react-native-0-63-monorepo-walkthrough-36ea27d95e26

- https://blog.salsitasoft.com/pitfalls-of-building-a-monorepo-for-react-native-and-react-web-apps/

- https://www.vairix.com/tech-blog/monorepo-share-library-with-cra-react-native-with-lerna-101

- https://engineering.brigad.co/react-native-monorepos-code-sharing-f6c08172b417

- https://github.com/wecanooo/react-native-web-mono-repo

## 장점

- 개별 패키지 작성 후 React, React Native에서 npm package처럼(dependancy에 추가 후 import) 사용 가능

  - react-web, react-native에서 공통적으로 사용될 것으로 판단되는 부분 theme, typo, util함수(API 함수 등) 반복작성 없이 사용 가능할 것으로 판단

- 개별 패키지 디렉토리내부로 진입하지 않고 root 디렉토리에서 script실행 가능
  (lerna로 실행할 경우 스크립트 명령어 진행상황이 확인 안되기에 yarn workspace script 가 좀 더 편리한것으로 판단됨)

  `yarn workspace <워크스페이스 이름> <script 명령어>`

  or

  `lerna --scpoe==<워크스페이스 이름> <script 명령어>`

- node_modules 용량 단축 가능
  - 공통된 버전의 패키지일 경우 root node_modules에 저장함으로서(hoist) 공통된 패키지 중복 설치 방지
  - 각자 다른 버전의 패키지를 사용할 경우 package별 node_modules에 저장 됨

## 단점

- 초기세팅 러닝커브

  - react native의 경우 경로 문제로 인해 nohoist설정 및 metro.config.js 파일 수정, ios 및 android 시뮬레이터 설정 수정 필요

- CRA, ReactNativeCLI 등 toolChain 사용 할 경우 같은 패키지(react, eslint, jest 등등)들을 각자 다른 버전으로 의존하기 때문에 그로 인한 버전 충돌 문제 발생

  - 초기 설치 후 jest, eslint등에서 문제 생기는 것 확인
  - error메세지 확인 후 문제 생기는 부분만 개별적으로 dependency에 추가하는 과정통해서 해결가능

- 공용 module작성 시(이 레파지토리의 경우 lib, theme) 등 개별적으로 typescript 추가 및 tsconfig 설정 필요

  - 하나의 패키지가 아닌 개별적인 패키지이기에 각자 typescript dependency 추가 및 tsconfig파일 설정 필요

- 익숙하지 않은 세팅이라 이슈 발생시 해결에 시간이 소요될 수 있다는 점

- npm client로 yarn을 사용해야 한다는 점?

## 사용법

### dependency 추가

`yarn workspace <워크스페이스 이름> add <설치하고자 하는 패키지 이름>`

ex)
`yarn workspace mobile add redux`

### 작성한 공용모듈 추가

`yarn workspace <워크스페이스 이름> add <공용모듈이름><@버전>`

ex)
`yarn workspace mobile add @mono/lib@1.0.0`

- 뒤에 버전정보를 기입하지 않을 시 npm에 등록된 패키지들을 찾기에 버전정보 기입 필수
- 버전정보는 해당하는 모듈의 package.json에 기입된 version value
- 워크스페이스 이름은 해당하는 모듈의 pacakge.json의 name value(통상 앞에 "@preset"을 붙여서 사용)

ex) packages/lib/package.json

```
{
"name": "@mono/lib",
"version": "1.0.0",
"main": "./dist/index.js",
"typings": "./dist/index.d.ts",
"files": [
  "dist"
],
"scripts": {
  "build": "rm -rf ./dist && tsc -p tsconfig.json",
  "prewatch":"rm -rf ./dist",
  "watch": "tsc -p tsconfig.json --watch"
},
"devDependencies": {
  "typescript": "^4.0.3"
},
"license": "MIT",
"dependencies": {
  "axios": "^0.21.0"
}
}
```

### node_modules 초기화 재설치

- node_modules이 꼬였다고 판단될 경우 초기화 후 재설치 가능

- 패키지들 node_modules 초기화

  `lerna clean`

  - 위 스크립트 실행시 root를 제외한 개별 패키지들 node_modules가 삭제 됨
  - 루트 디렉토리 node_modules 삭제하기 위해서는 root directory 이동 후
    `rm -rf node_modules`

- dependency 설치

  - root 디렉토리에서 아래 스크립트 실행 시 개별 패키지들의 dependency정보 수집 후, 재설치 수행

    `yarn install or yarn`

### nohoist 설정

- workspace는 공통되는 dependency를 루트 node_modules에서 관리(hoist)
- 패키지 내부의 dependency중 일부 문제(경로 문제 등)으로 인해서 hoist를 원치 않을 경우 root 디렉토리의 package.json 설정에서 변경 가능
- "workspaces"속성 내부의 "nohoist"에 기입할 경우 hoist되지 않음

ex) package.json

```
{
  "private": true,
  "name": "react_react-native_monorepo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "workspaces": {
    "packages": [
      "packages/*"
    ],
    "nohoist": [
      "**/react-native",
      "**/react-native/**"
    ]
  },
  "scripts": {
    "web": "yarn workspace web",
    "mobile": "yarn workspace mobile",
    "lib": "yarn workspace @mono/lib",
    "theme": "yarn workspace @mono/theme"
  },
  "devDependencies": {
    "lerna": "^3.22.1"
  }
}
```

### 실행가능한 스크립트

1. `yarn web start`

   - web 개발모드 실행 "http://localhost:3000"에서 확인 가능

2. `yarn mobile start`

   - mobile metro server 실행, 시뮬레이터 가동 전 실행시켜줘야 함

3. `yarn mobile ios`

   - ios 시뮬레이터 실행

4. `yarn lib build`

   - @mono/lib 패키지 빌드(ts -> js)

5. `yarn lib watch`

   - @mono/lib 패키지 watch모드 실행(변경 감지 및 자동 빌드)

6. `yarn theme build`

   - @mono/theme 패키지 빌드(ts -> js)

7. `yarn theme watch`
   - @mono/theme 패키지 watch모드 실행(변경 감지 및 자동 빌드)
