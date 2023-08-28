# SimpleRenamer

파일의 이름을 변경하는 프로그램입니다.

## 실행 방법

### 패키징된 애플리케이션 실행하기

https://github.com/autroshot/simple-renamer/releases/tag/v1.0.0에서 `simple-renamer-${버전}-win.zip`을 받아 압축을 해제하고 `simple-renamer.exe`로 직접 실행할 수 있습니다. 서명이 되어 있지 않아 알 수 없는 게시자라는 경고창이 뜹니다.

### 코드 직접 실행하기

패키지를 설치합니다.

```shell
yarn
```

앱을 실행합니다.

```shell
yarn start
```

## 구현 기능

- 네이티브 윈도우 대화 상자를 이용하여 파일 추가하기
- 드래그 앤 드랍으로 파일 추가하기
- 네이티브 메뉴
- 파일의 이름 지우기
- 파일의 이름에 문자 붙이기
- 파일 이름에 네이밍 컨벤션 적용하기 (예정)

## 주요 패키지

[electron-vite](https://electron-vite.org/)를 사용하여 스캐폴드(scaffold)되었습니다.

- [React](https://react.dev/) - UI를 위한 자바스크립트 라이브러리
- [Eletron](https://www.electronjs.org/) - 데스크톱 앱을 만들 수 있는 프레임워크
- [Chakra UI](https://chakra-ui.com/) - CSS 프레임워크
- [TanStack Table](https://tanstack.com/table) - 테이블을 위한 헤드리스 UI
