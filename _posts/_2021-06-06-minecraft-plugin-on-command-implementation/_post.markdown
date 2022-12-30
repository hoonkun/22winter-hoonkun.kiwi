---
author: GoHoon
title: 마인크래프트 플러그인의 onCommand 함수를 작성해보자
date: 2021-06-06, 17:32
categories: [dev,minecraft-plugin]
---
마인크래프트 플러그인 제작에서 빠질 수 없는 재정의 함수 onCommand를 어떻게 작성하면 복잡하지 않고 관리하기 편하게 작성할 수 있을까에 대해 알아보자.
<!-- Excerpt -->

## 서론
일단 거의 한 달 만의 포스팅인데 음... 한달동안 진짜 너무 많이 바빴다. 지금도 바쁘긴 한데 어쩌다 시간이 나서 글을 적는 것이고...   
아마 다음 글은 또 몇 주 뒤에 쓰게 되지 않을까 싶긴 하다.   

그리고 이 글은 코딩을 거의 처음 하거나 클래스에 대해서 잘 모르는 분들을 위한 것으로, 만약에 두 가지 모두 해당사항이 없다면 다음 문장을 읽고 대충 빠르게 스크롤을 내리는 것을 추천한다:   
**_onCommand를 작성할 때 모든 파생(추가) arguments 가 있는 커맨드들은 별개의 클래스로 분리하시면 됩니다._**   
~~아마 두 가지 모두 해당사항이 없으신 분들은 이미 알아서 잘 하고 있을 것으로 예상이 되지만, 일단...~~   

## 본론
본론으로 들어가서, 마인크래프트 플러그인을 만들다 보면 플레이어로부터 명령을 받아서 일련의 동작을 수행해야할 때가 있는데, 그럴 때 쓰는게 커맨드다.   
커맨드는 바닐라에 있는 것들만 쓸 수 있는게 아니라 플러그인 내에서 얼마든지 추가할 수 있으며 그 동작도 원하는대로 정의해줄 수 있다.   

대충 다음과 같은 과정을 통해 커맨드 하나를 추가할 수 있다:   
1. plugin.yml 파일에 커맨드를 추가한다.
2. Entry 클래스에서 <code>onCommand(...)</code> 함수를 재정의한다.

끝이다!! 정말이지 간단하다. 단지 이걸 어떻게 짜느냐에 따라 가독성이나 관리 측면에서 더 편해질 수도 있고 그렇지 않을 수도 있다는 것이다.   
하나하나 대충 살펴보자. 이 글에서 중점적으로 다룰 것은, '어떻게 <code>onCommand(...)</code>를 재정의하면 조금 더 간단하고 보기 좋고 관리하기 편할까' 에 대해서이다.   

### plugin.yml
```yaml
commands:
  waffle:
    description: main command of this plugin
    permission: waffle
permissions:
  waffle:
    description: allows 'waffle' command
    default: op
```
> src/main/resources/plugin.yml

이게 플러그인에 커맨드 하나를 추가하는데 필요한 plugin.yml의 내용이다.   
살펴보면, 'waffle'이라는 커맨드를 추가하고, op만 사용 가능하도록 하고있다. 솔직히 description 은 안넣어도 될 것 같지만 그냥 넣었다.   
일반적인 yaml 문법으로 되어있고 어렵지 않으니 그냥 대충 컨CV를 해주고 넘어가자.

### onCommand(...) 구현
이제부터 본격적이다. 이것도 사실 어렵지는 않지만 핵심적인 부분이라고 볼 수 있다.   

JavaPlugin 을 확장하고 있는 클래스(보통 plugin.yml 의 main 값에 할당된 클래스)에 가서 onCommand를 재정의할 것이다.
```kotlin
override fun onCommand(
    sender: CommandSender, 
    command: Command, 
    label: String, 
    args: Array&lt;out String&gt;
): Boolean {
    return super.onCommand(sender, command, label, args)
}
```
> Entry.kt

딱 처음 재정의를 하려고 하면 이런 코드가 뜰 것이다. 이제 이것을 자세히 뜯어보자.   

우선 인수들은 다음과 같다:   

- sender: CommandSender → 커맨드를 실행한 주체이다. 플레이어이거나, 커맨드 블럭이거나, 등등.
- command: Command → 커맨드 객체이다. 커맨드에 대한 기본적인 정보를 가져올 수 있다.
- label: String → 입력된 커맨드 이름이다. `command.name`와의 차이점은, `label`은 name일 수도 있고 alias일 수도 있지만 `command.name`은 무조건 name이라는 점이다.
- args: Array<out String> → 명령어의 argument 를 모아놓은 리스트이다. 당연히 순서대로 들어있다.

이제 이것들을 활용해서 적절히 구현을 하면 되는데, 우선 다음을 보자.   
![겁나 길다](...image_base.../wow-sooooo-long.png)

몸체를 축약한건데, 왼쪽의 라인을 보면 200줄이 넘는다. 이게 몇 년 전에 필자가 플러그인을 처음 만들었을 때 짠 코드다.   

모든 arguments 조합에 대한 구현을 when(args[n]) 구문을 사용해서 이 Entry.kt 에서 수행한 것인데, 이럴 경우 다음과 같은 단점이 있다:   

- 스크롤 압박이 너무 크다. 폴딩을 하면 해결되긴 하겠지만 파일을 닫았다 열 때마다 폴딩을 다시해줘야하니 좋지 않다.
- 어디에 어느 커맨드가 구현되어있는지 찾기가 어렵다. 이것도 스크롤 압박이랑 비슷한데 얘는 해결도 안된다.

그래서 이번에 새로운 플러그인을 제작할 때는 다르게 구현해봤다. 위의 이미지에 있는 플러그인보다 분명 더 많은 일을 처리하는데 그 함수의 길이는 아래처럼 11줄이 끝이다:   
```kotlin
override fun onCommand(
    sender: CommandSender, 
    command: Command, 
    label: String, 
    args: Array&lt;out String&gt;
): Boolean {
    if (command.name != "waffle") return false

    return if (sender !is Player) {
        sender.sendMessage("" + ChatColor.RED + "Only player can execute 'waffle' command.")
        true
    } else if (args.isEmpty()) {
        sender.sendMessage("" + ChatColor.GRAY + "main command of 'waffle' plugin.")
        sender.sendMessage("" + ChatColor.GRAY + "usage: waffle [ start | pause | manage | invalidate ]")
        true
    } else {
        executor.execute(sender, args)
    }
}
```
> Entry.kt

이렇게 했을 때의 장점은 다음과 같다:   

- 어디에 어떤 커맨드가 구현되어있는지 바로 알고 이동할 수 있다.
- 관리하기 쉽다! 클래스 파일의 수는 조금 늘어나지만 오히려 이 편이 더 관리하기 편하다.

단점은... 다음과 같은 것이 한 가지 정도 생각이 난다:   

- boilerplate 코드가 늘어난다. 클래스 정의부는 매 클래스마다 계속 반복해서 적어줘야하고, 메인 클래스(Entry)를 거의 모든 커맨드 실행 클래스에 전달해줘야 하다 보니 이것도 계속 적어줘야한다. 

그래도 이 정도면 꽤 쓸만한 방식인 것 같다. 자세히 살펴보자.   

#### 각 커맨드별 구현을 클래스로 분리하자
우선 기본적인 수행은 Entry 에서 정해줘야 한다. 예를 들어 커맨드 실행 주체가 원하는 주체가 아닐 때나, args의 길이가 0일 때 등의 핸들링이 그것이다.
그리고 정상적으로 모든 커맨드를 실행할 수 있을 때, 마지막의 `executor.execute(sender, args)`를 수행했다.   
이게 다른 클래스로 분리하여 실행시킨 것인데, `executor`는 다음과 같이 선언되어있다:   

```kotlin
private val executor = MainExecutor(this)
```
> Entry.kt

다시말해 MainExecutor 라는 클래스에 구현을 옮겨놓은 것이다.   
_그럼 그냥 onCommand에 하는거랑 뭐가 다른가요_ 라는 말이 나올텐데, 한국말은 끝까지 들어보자. 일단 MainExecutor를 살펴보면,   

```kotlin
class MainExecutor(
    private val parent: Entry
) {
    
    companion object {
        const val START = "start"
        const val STOP = "stop"
        const val MANAGE = "manage"
    }
    
    private val manageExecutor = ManageExecutor(parent)

    fun execute(sender: Player, args: Array&lt;out String&gt;): Boolean {
        return when(args[0]) {
            START -&gt; {
                // 'start' command related code here
                true
            }
            STOP -&gt; {
                // 'pause' command related code here
                true
            }
            MANAGE -&gt; {
                // slice 'args' array to exclude current argument.
                manageExecutor.execute(sender, args.sliceArray(1 until args.size))
            }
            else -&gt; false
        }
    }

    // ...

}
```
> executors.MainExecutor.kt

~~그냥 아무렇게나 적은 코드다.~~ 보면 커스텀 커맨드인 waffle start, waffle stop, waffle manage의 구현이 되어있는 것을 볼 수 있다.   
여기서 start, stop은 더 이상 추가 arguments가 없는 것으로 설계했기 때문에 바로 when 안쪽에 구현이 되어있다.   

그런데 when의 MANAGE 부분을 보면, 이번에는 또 <code>manageExecutor</code> 라는 것이 있다. 이 manage 커맨드의 경우에는 뒤에 추가 arguments가 오도록 설계했기 때문에(예를 들어 waffle manage expand, waffle manage state) 다시 새로운 클래스로 분리한 것이다.   

이 ManageExecutor도 MainExecutor와 비슷하게 짜여져 있으며, 이렇게 할 경우 어떤 구현이 어디에 있는지 정확하게 클래스 이름으로 찾아 이동할 수 있게 된다.   


**_기억할 것은, 모든 추가 파생 arguments가 있는 커맨드의 동작은 새로운 class로 분리하는 것이 좋다_** 라는 것이다.   
다시 말해, 이게 최종 커맨드이고 더 이상의 추가 arguments에 의해 나눠질 일이 없는 경우에는 그 클래스에 구현을 하고, 뒤에 다른 추가 arguments에 의해 수행이 나눠질 수 있는 경우에는 새로운 클래스로 분리하라는 것이다.   
위의 예시에서는 start, stop이 최종 커맨드였고 manage가 추가 arguments가 있는 커맨드였다.   

분명 적어야 하는 총 라인의 수는 늘어난다. 위에서도 언급한 boilerplate가 있기 때문에. 하지만 관리하기도, 찾아가기도 편하다.   

## 결론
최대한, 적어도 마인크래프트 플러그인을 만들기로 결심을 한 사람이라면 누구라도 알아볼 수 있도록 최대한 자세하게 적었다.   
그래서 아마 코딩 좀 했다 싶으신 분들은 뭐 이런걸 이렇게 구구절절 길게 적어놨지... 싶을 것이다.   
그냥 마지막에 볼드체 해놓은거 한 줄이면 될텐데... 라고 필자도 생각하고 있긴 하다 ~~...~~   
근데 아마 이제 막 처음 플러그인이란 것을 공부하면서 만드는 초심자라면 필자처럼 충분히 모든 커맨드 조합을 when 만을 사용해 Entry 클래스에 때려넣는 짓을 할 수 있을 것 같아서...   
그런 분들을 위해 적었다. 그래서 글 첫머리에도 한 줄 요약을 적어놓은 것이다.   

암튼... 다음 마인크래프트 플러그인 관련 글은 Particle과 관련된 글이 아닐까 싶다.
