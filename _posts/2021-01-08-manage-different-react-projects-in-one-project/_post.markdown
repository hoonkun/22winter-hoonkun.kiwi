---
author: GoHoon
title: 여러 React 프로젝트를 하나로 관리해보자
date: 2021-01-08, 14:19
categories: [dev,react]
---
> 이 게시글은 모노레포에 대해 설명합니다.  
> 다만, 레포의 조합이 지금에 와서는 별로 쓰일 일이 없는 조합이므로, 
> 적당히 참고만 해주세요.

여러 React 프로젝트를 하나의 root 디렉터리 안에 때려 넣고, node 프로젝트와 함께 관리하는 방법에 대해 알아보자.   
<!-- Excerpt -->

올해도 어김없이 겨울이 되니 웹코딩 뽕이 찼다. 작년에 하다가 포기했던 react를 다시 해볼까 해서 잡았는데 여러 서버로 페이지를 나눠서 만드려니 문제가 있었다.   

어떤 문제냐면, 블로그와 메인 페이지를 다른 서버로 나눠서 관리하고픈데, npm install을 3번이나 쳐서 설치해야했다.   

메인 프론트엔드 react 프로젝트, 블로그 프론트엔드 react 프로젝트, 백엔드 node 프로젝트까지 총 3개의 프로젝트에 node_modules가 각각 존재하게 되고,
서버에 올렸을 때도 npm install을 하나하나 해줘야한다는 뜻이었다.   

귀찮은건 둘째치고 node_modules 디렉터리당 많으면 100M도 넘게 차지하는데 안그래도 블로그 운영하려면 이미지 때문에라도 용량이 부족하기 마련이라 어떻게든 해야했다.   

일단 디렉터리 구조는 아래처럼 잡았다.

```text
root
    backend
        [node project]
    frontend
        main
            [main react project]
        blog
            [blog react project]
    node_modules
    package.json</div></pre>
```

루트에 있는 node_modules가 유일한 node_modules가 되도록 하는것이 목표다.

다행히 node 스크립트에서는 require()를 사용하면 현재 디렉터리에서 모듈을 찾지 못할 경우 상위 디렉터리로 이동해가면서 검색한다고 한다.   
그래서 node 스크립트를 돌리는 것은 이렇게 디렉터리 구조를 적용하고 기존 노드 프로젝트의 node_modules를 지워도 바로 적용이 되었다.   

다음 문제는 react 프로젝트였다. 얘네들은 build 할 때도, 개발 서버 올릴 때도 src 디렉터리가 있는 프로젝트 루트에 node_modules가 있어야 제대로 동작하는 것 같았다.   

일단 해결책을 먼저 살펴보면 작업 순서는 아래와 같았다.
1. 먼저 각 React 프로젝트의 package.json에 있는 의존 모듈들을 따로 복사해서 어디다가 저장해 둔다
2. 각 React 프로젝트의 node_modules 폴더를 지운다
3. 각 React 프로젝트의 package.json은 내용을 `{"home": "/"}` 한 줄로 바꾼다.
4. 전체 프로젝트 루트(위의 예시에서는 root)에 있는 package.json에 1번 과정에서 복사해뒀던 의존 모듈들을 병합한다.
5. root 디렉터리에서 npm install 커맨드를 입력한다.
6. root 디렉터리의 package.json에서 script 오브젝트에 다음 라인들을 추가한다. cd로 이동하는 타겟 폴더는 react 프로젝트 루트 디렉터리이다.
  ```json
  {
    "start-main": "cd frontend/main && react-scripts start",
    "start-blog": "cd frontend/blog && react-scripts start",
    "build-all": "npm run build-main && npm run build-blog",
    "build-main": "cd frontend/main && react-scripts build && rmdir node_modules /s /q",
    "build-blog": "cd frontend/blog && react-scripts build && rmdir node_modules /s /q"
  }
  ```
  start-*은 각 react project를 개발 서버로 여는 스크립트이고, build-all은 모든 react 프로젝트를 빌드하며 build-*는 각 react 프로젝트를 따로 빌드하는 스크립트이다.

이렇게 해주면 일단 돌아는 간다. 해결책을 먼저 살펴본 이유가 왜 돌아가는지 잘 모르겠어서 설명할 게 없었기 때문이다... ~~???~~   
터미널에서 똑같이 `cd frontend/main`을 하고 `react-scripts build` 를 하면 react-scripts를 찾을 수 없다고 뜨는데 왜일까.   

전체 프로젝트 루트(root) 디렉터리에서 `npm run start-main` 을 하면 frontend/main 디렉터리에 node_modules가 생기긴 하는데 이건 개발 서버가 돌아갈 동안만 유지하면 되고 build하면 지워지도록 명령어가
구성되어있어서 딱히 문제될 건 없어보이긴 한다.   

주의할 점은 각 React 프로젝트 안의 package.json 안의 **hompage 의 값을 ./ 로 설정하면 정적파일을 찾는 과정에서 문제가 생기므로 반드시 /로 설정**해야한다.   

당연히 `npm run build-all`을 해주면 빌드 파일들이 생성되며 그걸로 node 서버를 통해 클라이언트한테 던져주면 잘 렌더링하는 것으로 보아 정상적으로 잘 돌아가는 것 같다.   

이거랑 관련해서 뭔가 문제가 터지면 절대 수정할 수 없을 것 같다는 생각이 들지만 어쨌든 지금 잘 되면 뭐...~~굉장히 위험한 발상~~   
여튼 이번 포스트는 여기까지다.

Happy Coding!!!
