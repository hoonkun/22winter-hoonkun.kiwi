---
layout: post.liquid
author: GoHoon
title: kotlin(+IntellijIDEA)를 사용한 마인크래프트 플러그인 개발 준비하기
date: 2021-05-12, 16:28
image: /assets/images/posts/2021-05-12-prepare-creating-minecraft-plugin-using-intellij-and-kotlin/preview.png
categories: [dev,minecraft-plugin]
excerpt_separator: <!-- Excerpt -->
use_code_fragment: true
---
인터넷을 뒤져보니 마크 플러그인을 kotlin으로도 짤 수 있었던 것이다! 그래서 그 방법을 기록해보고자 한다.   
<!-- Excerpt -->

## 서론
대충 마인크래프트 처돌이가 개발에 손을 대기 시작했다는 뜻이다.   
사실 뉴비라서 뭔가 엄청난 장난감을 손에 넣긴 했는데 어떻게 가지고 놀면 재미있을지를 아직까지 파악하고 못하고 있긴 하다.   

우선 IntellijIDEA Ultimate를 사용하여 포스팅하겠다. 다른 gradle 프로젝트를 지원하는 IDE를 써도 상관은 없겠지만 다른 IDE는 잘 모르겠다.   
~~이전엔 뭐 이클립스니 뭐니 하는 에디터를 썼었는데 Jetbrains 계열 IDE를 맛보고 나니까 다른건 눈에 안들어오더라...~~   
~~형, 이제 나(Jetbrains)아니면 만족하지 못하잖아?~~ ~~으악 그만둬~~   


## 해보자!!
### 프로젝트 만들기
우선 IDE를 사용하여 프로젝트를 만든다. 다음 과정을 따른다:
1. File > New > Project... 를 클릭하여 프로젝트 생성 창을 연다.
2. 다음과 같이 왼쪽에서는 Gradle을 선택하고 오른쪽에서 Java, Kotlin/JVM, Kotlin DSL build script를 체크하고 다음으로 넘어간다.
   ![프로젝트 만들기 1번 과정](...image_base.../1_CreateProject-1.png)
3. 다음처럼 적당히 원하는 이름으로 채우고 Finish를 클릭한다.
   ![프로젝트 만들기 2번 과정](...image_base.../2_CreateProject-2.png)
4. 생성이 완료되고 잠시 기다리면 다음과 같은 화면이 될 것이다:
   ![생성이 완료된 프로젝트](...image_base.../3_ProjectFirstView.png)
   
### build.gradle.kts 수정
루트의 build.gradle.kts 파일을 열고 다음 코드를 추가한다.

```kotlin
plugins {
   /* ... */
   id("idea")
   id("com.github.johnrengelman.shadow") version "2.0.4"
}

/* ... */

java {
   sourceCompatibility = JavaVersion.VERSION_1_8
   targetCompatibility = JavaVersion.VERSION_1_8
}

/* ... */

dependencies {
   implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
   /* ... */
}
```
> build.gradle.kts

최종적으로는 다음과 같은 코드이어야 한다.
![최종 build.gradle.kts](...image_base.../4_EditBuildGradle.png)


### java 디렉터리 삭제
그리고 ~~쓸데없는~~ java 소스코드가 들어가는 디렉터리를 지워주자. 우리는 kotlin을 쓸 거니까.
![사라져버려](...image_base.../5_RemoveJavaDirectory.png)


### plugin.yml 파일 작성
중요한 작업이다. 모든 마인크래프트 플러그인에서 꼭 필요한 plugin.yml을 작성해야한다.   
다음처럼 plugin.yml을 [root]/src/main/resources 디렉터리에 추가하고 그 다음의 코드를 추가한다.
![plugin.yml 만들기](...image_base.../6_CreatePluginYml.png)
```yaml
main: org.example.untitled.Entry
name: ExamplePlugin
version: 1.0
author: SomeAuthor
description: SomeDescription
api-version: 1.16 #reference minecraft version.
commands:
    # add commands if needed
permissions:
    # add permissions related with commands if needed
```
> src/main/resources/plugin.yml

main 값은 프로젝트를 생성할 때 입력했던 `[GroupId].[ArtifactId].Entry` 로 입력한다.   
나머지는 대충 적어주면 된다. api-version 값만 주의해서 적어주자.

### 메인 클래스 만들기
이제 클래스들이 포함될 패키지를 만들어야한다. kotlin 디렉터리를 우클릭하고 다음처럼 패키지를 추가하자.   
위 과정에서 입력했던 `[GroupId].[ArtifactId]`를 다시 입력하면 된다.
![패키지 만들기](...image_base.../7_CreatePackage.png)

그리고 플러그인의 메인 클래스를 만든다. 다음처럼 Entry kotlin class를 생성하자.
![메인 클래스 만들기](...image_base.../8_CreateEntryClass.png)

### 라이브러리 추가하기
이제 코드를 입력해볼까 했는데 한 가지 깜빡했다. 라이브러리를 안가져왔다.   
[이 곳](https://getbukkit.org/download/spigot)에 가서 spigot-1.16.5.jar 파일을 받아서 다음처럼 libs 디렉터리에 붙혀넣자.   
libs 디렉터리가 없다면 [root]에 만들면 된다.
![spigot 가져오기](...image_base.../10_MoveLibraryToLibsDirectory.png)

IDE의 우측에 Gradle 탭을 열고, 왼쪽 위의 새로고침 아이콘을 눌러주자. 이게 가져온 라이브러리를 반영하는 역할을 한다.
![gradle 새로고침](...image_base.../11_GradleSync.png)


### 메인 클래스 채워넣기
새로고침이 끝났으면 9번 과정에서 만든 Entry 클래스에 다음처럼 살짝 입력해보자.   
다음처럼 자동완성이 딱 뜬다면 잘 된 것이다.
![자동완성은 최고야](...image_base.../12_CheckLibraryLoaded.png)

이제 드디어 기초 코드를 입력한다. 대충 잘 되는지만 확인하면 되므로 플러그인이 활성화 및 비활성화될 때 로그를 출력하는 코드만 넣어보자.   
패키지는 당연히 만든 패키지에 맞게 수정해줘야한다.
```kotlin
package org.example.untitled

import org.bukkit.plugin.java.JavaPlugin
import java.util.logging.Level

class Entry: JavaPlugin() {

    override fun onEnable() {
        super.onEnable()
        
        server.logger.log(Level.INFO, "Plugin is Enabled!!")
    }

    override fun onDisable() {
        super.onDisable()

        server.logger.log(Level.INFO, "Plugin is Disabled.")
    }

}
```
> Entry.kt


### 빌드된 jar 생성
코드 입력이 끝났으면 최종적으로 플러그인 jar파일을 만들면 된다. 아래처럼 오른쪽 gradle 탭을 다시 열고
Tasks > shadow > shadowJar를 더블클릭하여 실행하자.
![빌드하자](...image_base.../13_RunGradleShadowJar.png)
실행이 완료되면 다음처럼 build/libs 디렉터리에 빌드된 jar파일이 생성될 것이다.
![결과 파일을 확인하자](...image_base.../14_CheckBuiltFile.png)


### 서버를 열자!
이제 서버를 열어보자. 서버를 어찌 여는지 안다면 이 과정을 건너뛰어도 된다.
1. 우선 [이 링크](https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar)를 통해
   BuildTools.jar 파일을 다운받자. 그리고 서버를 만들 디렉터리에 BuildTools라는 디렉터리를 만들고 그 안에 다운받은 파일을 붙혀넣자.
2. 그리고 커맨드창에서 BuildTools.jar가 있는 디렉터리로 cd한 후 다음 커맨드를 입력하자.
   <pre>&gt; java -jar BuildTools.jar --compile craftbukkit</pre>
3. 꽤 걸린다. 길면 5분 정도를 기다려야 끝나니까 끝날때까지 기다리자.
4. 완료되면 BuildTools 디렉터리에 craftbukkit-1.16.5.jar가 생길 것이다. 이걸 서버를 만들 디렉터리(상위 디렉터리)로 옮기자.
5. 그리고 cmd에서 옮긴 craftbukkit-1.16.5.jar가 있는 디렉터리로 cd를 한 후 다음 커맨드를 입력한다.
   <pre>&gt; java -jar -Xmx1024M -Xms1024M craftbukkit-1.16.5.jar</pre>
6. 그럼 아마 튕길것이다. EULA가 어쩌구...하면서. 수정해주면 된다. eula.txt 파일을 열고 아랫줄의 false를 true로 바꾸자.
7. 5번의 커맨드를 다시 입력하자. 그럼 서버가 열릴 것이다.

### 되...나?
서버를 열고 나면 로그를 유심히 살펴보자. 다음과 같은 로그가 출력된다면 정상적으로 플러그인이 동작한 것이다.
![성공? 실패?](...image_base.../15_Success.png)

## 다음은?
다음은 이제 본격적으로 플러그인 개발에 들어가면 된다.   
Listener나 BukkitRunnable같은걸 쓴다던지 암튼 문서...는 잘 안나와있으니 대충 자동완성을 보면서~~???~~ 하면 된다.   
시간이 난다면 모 마인크래프트 유튜버 분이 진행하셨던 컨텐츠에서 사용되었던 플러그인을 클론해서 만들어보았는데 그 과정이나 사용된 코드들을 소개해볼까 한다.   
이걸로 kotlin으로 마인크래프트 개발하는 사람이 늘어났으면 좋겠다 ^오^
