---
author: GoHoon
title: jekyll로 만든 정적 사이트를 github pages에 수동으로 배포해보자
date: 2021-05-08, 22:36
categories: [dev,dev-others]
---
> 최근에는 Github Actions 가 꽤 잘 되어있을 것이므로 가능하다면 그것을 사용합시다. 그게 훨 깔끔합니다.

github-page에서 지원하지 않는 gem을 가진 jekyll 프로젝트를 github-pages(gh-pages 브랜치)에 _site의 내용으로 배포해보자.   
<!-- Excerpt -->

## 서론
이번에 블로그 디자인이랑 여러가지로 갈아엎으면서 React로 만들었던 블로그를 jekyll로 바꾸기로 결정했다.   
전자의 경우 서버비가 많이 나가는게 가장 큰 문제였고, 후자의 경우에 얻을 수 있는 이점도 있어서.   
물론 jekyll을 쓸 경우 백엔드를 내 맘대로 구성할 수 없다는 문제가 있었지만, 어차피 백엔드에서 하는 일도 많이 없었기 때문에.

그런 배경에서 jekyll을 가지고 개발하는데, jekyll-paginator 라는 젬이 보였다. 공식 문서에는 얘가 나와있어서 처음에는 얘를 썼는데,
개발하다보니 카테고리별 페이징도 지원을 안하고 인터넷에서는 이미 지원이 끊겼다는 얘기도 보여서 흠터레스팅하더라.   

근데 인터넷을 보니 또 jekyll-paginator-v2 라는게 있단다. 살펴봤더니 카테고리 페이징도 지원을 하고 여러가지로 쓸만한 기능이 많았다.   
근데 문제가, 얘는 github-page에서 지원하는 젬이 아니어서 이걸 하려면 _site 의 내용을 직접 깃헙에 푸시해야 한다고 하더라.   

그래서 또 인터넷을 보니 무슨 CI인가? 를 쓴다는데 뭔가 귀찮아보여서... 꼼수를 생각해냈다 ~~이럴 때만 돌아가는 머리~~   

## 본론
다음 과정을 따른다.   
1. 우선 github에서 저장소를 만든다. 대충 blog라는 이름으로...만들면 되겠지.
2. 로컬에서 적당한 경로에 project, publish 디렉터리를 만든다.
3. 두 디렉터리 모두에서 git init 및 remote add origin, pull을 수행한다. 두 디렉터리 모두 remote 추가는 1과정에서 만든 저장소를 추가한다.
4. project 디렉터리에 jekyll 프로젝트 전체를 붙혀넣고 commit, push한다. 이 때 jekyll 프로젝트의 .gitignore에는 _site 가 포함되어있어야 한다.
5. publish 디렉터리로 cd한 후 <code>git branch gh-pages</code>, <code>git checkout gh-pages</code>를 수행한다.
6. project, publish 디렉터리가 포함된 디렉터리에 publish.bat을 만들고 다음 스크립트를 붙혀넣는다.
   ```shell
   @echo off
   
   cd project
   
   git add .
   git commit -m "some commit in master"
   git push origin master
   
   cd ../publish
   for /f "delims=" %%a in ('dir /b /a:d-h') do rmdir /s /q %%a
   for /f "delims=" %%a in ('dir /b /a:-d-h') do del %%a
   
   cd ../project
   
   xcopy _site\* ..\publish\ /s /e
   
   cd ../publish
   
   git add .
   git commit -m "some commit in gh-pages"
   git push origin gh-pages
   
   cd ../project
   ```
   > publish.bat
7. 만든 publish.bat을 실행한다.


끝이다!   
뭘 한거냐면, 두 개의 디렉토리를 만들고 둘 다 같은 저장소를 remote로 추가한 다음, project 디렉토리는 master 브런치를, publish 디렉토리는 gh-pages 브런치를 사용하도록 설정했다.   
그리고 publish.bat 스크립트를 만들어서, 실행하면 master 브런치의 커밋/푸시는 물론 project 디렉터리의 _site 내용물을 publish 디렉토리로 복사하도록 하여 그것을 자동으로 gh-pages 브런치에 커밋/푸시까지 하게 했다.   

단지, 이 dos 스크립트는 실행하면 project 까지 커밋을 수행하므로 그게 싫다면 git 명령 수행 부분 중 위에 있는 3줄을 지우면 된다.   

다들 이거 하려고 무슨... Tra..? CI...? 인지 그거 쓴다는데 음... 난 그냥 이렇게 할래.
