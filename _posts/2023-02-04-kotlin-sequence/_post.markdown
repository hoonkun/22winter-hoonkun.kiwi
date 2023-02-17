---
author: GoHoon
title: Kotlin 의 Sequence, 그리고 lazy evaluation 에 대해
date: 2023-02-04, 21:56
categories: [dev, dev-others]
---
> 이 게시글은 [이 공식 문서](https://kotlinlang.org/docs/sequences.html)를 참고했으며, 위의 사진에 있는 코드는 잘못된 결과를 야기하는 예제 코드입니다.

아니, 난 분명 .map { ... } 을 했는데 이 람다가 실행이 안된다니까? 왜??
<!-- Excerpt -->

코틀린에는 Iterable 과 Sequence 가 있다. 둘 다 여러 데이터를 저장하는 자료구조 인터페이스 이다.  
Iterable 의 경우 대부분 그를 확장하는 Collection 계열의 데이터 구조(익히 쓰이는 List, Map, Set 등)들로 많이 쓰이고, Sequence 는 그 자체로 쓰인다.  

이번 글에서는 Sequence 에 초점을 맞추되 List 와 일부 동작을 비교하여 차이점을 살펴보려고 한다.  

## Sequence가 뭔데?
Sequence 는 Collection 과 다르게 배열의 내용을 직접 포함하지 않고 iterating 중에 계산하여 생성한다.  
그래서 Sequence 는 Iterable 과 같은 extension 들(filter, map 등)을 제공하지만 실제 그 구현에는 차이가 있다.  

가장 큰 차이점으로는 컬렉션 처리 함수가 호출되었을 때(colection processing), 그 실행 방식에 있다:  
- Iterable 의 경우 처리 함수를 만나면 모든 처리 함수의 람다식을 모든 엘리먼트에 대해 실행한다. 
- Sequence 의 경우 처리 함수를 만나도 람다식을 실행하지 않고, 그것이 소비되는 시점에 필요한 엘리먼트에 대해서만 실행한다.

그렇기 때문에, 여러 처리 함수가 있었을 경우 처리 함수 각각과 그의 람다식의 실행 순서도 다르다:  
- Iterable 의 경우 처리 함수를 만나면 모든 엘리먼트에 대해 다음 처리 함수로 넘어가기 전에 모든 람다식을 실행한다.
- Sequence 의 경우 소비가 이루어진 엘리먼트에 대해서만 처리 함수 체인과 엘리먼트에 해당하는 람다식을 실행한다.  

결론적으로 Sequence 는 불필요한 값이나 계산 중간 값을 최소화해 성능에 이점을 얻을 수 있다.
다만, lazy한 실행의 경우 작은 데이터셋이나 간단한 연산에 대해서는 오히려 불필요한 오버헤드를 발생시킬 수 있으므로, 데이터의 크기 등을 고려해서 어느 것을 사용할지 결정하는 것이 좋다.

## 뭔말인지 모르겠어!
역시 말로 쓰면 어렵다. 코드와 실행 순서를 보자.

### Iterable
```kotlin
val words = "I like solving BiologyII problems in korean high school curriculum".split(" ")
val lengths = words
  .filter { it.length > 4 }
  .map { it.length }
  .take(2)
  
print(lengths)
```
Collection(Iterable 확장)을 확장하는 List로 `filter`, `map` 을 진행하고 앞의 2개를 가져오는 문장이다.  
위의 코드는 아래의 순서로 진행된다:
1. 모든 요소에 대해 길이가 4가 넘는지 확인하여, 4가 넘는 것들만 포함된 중간 결과(`[solving, BiologyII, problems, korean, school, curriculum]`)를 만든다.
2. 1에서 나온 중간 결과의 모든 요소에 대해 length를 구하여 변환된 중간 결과(`[7, 9, 8, 6, 6, 10]`)를 만든다.
3. 2개로 자른 최종 결과(`[7, 9]`)를 만든다.

그러므로 `.take(2)`까지 진행되고 나면 이미 `lengths` 에는 완성된 List가 저장되어있다.

### Sequence
```kotlin
val words = "I like solving BiologyII problems in korean high school curriculum".split(" ")
  .asSequence()
val lengths = words
  .filter { it.length > 4 }
  .map { it.length }
  .take(2)
  
print(lengths.toList())
```
이번에는 `words`가 Collection 이 아닌 Sequence 다.  
위의 코드에서 마지막줄의 `lengths.toList()`가 호출되면, 아래의 순서로 진행된다:

1. `"I"`에 대해 `.filter`를 해본다. 람다식의 리턴값이 `false` 이므로, 이후 체인의 람다(여기서는 map 하나)는 수행하지 않고 스킵한다.
2. `"like""`에 대해 `.filter`를 해본다. 얘도 람다식의 리턴값이 `false` 이므로, 마찬가지로 이후 체인의 람다는 스킵한다.
3. `"solving"`에 대해 `.filter`를 해본다. 얘는 람다가 `true`를 리턴했다. 그러면 그 다음 체인인 `.map`을 수행한다. 모든 체인이 성공적으로 끝나고 결괏값이 있었으므로, 하나를 Iteration 한 것으로 간주한다.
4. `"BiologyII"`에 대해 `.filter`를 해본다. 얘도 람다가 `true`를 리턴했다. 다음 체인인 `.map`을 수행하고 결괏값이 있었으므로 하나를 Iteration 한 것으로 간주한다.
5. 어라? 이미 소비하려는 2개의 Iteration이 완료되었다. 그러면 나머지 요소들에 대해서는 `.filter` 및 `.map`을 비롯한 모든 람다식을 수행하지 않고 스킵한다.

중요한 것은, `print` 라인이 수행되기 전에는 아직 아무런 람다도 실행되지 않은 상태다.  
`lengths.toList()`를 만나는 순간 비로소 필요한 람다식만이 실행된다.  

## 다시 말하면?
Iterable 은 완전히 문장 문장 단위로, 다음 처리 문장으로 넘어가기 전에 **모든 람다식**을 실행한다.  
그러나 Sequence 는 우선 람다식을 어딘가에 넣어놓고, **소비가 이루어지면 그 때 필요한 람다식만**을 실행한다.  

**그렇기에 Sequence 의 `.map` 이나 `.filter` 등의 람다에서 부수효과나 다른 데이터의 조작을 시도할 경우 원하는 결과가 나오지 않을 가능성이 클 것이다.**

## Java의 Stream
다른 이야기이지만, Java의 Stream이 Kotlin의 Sequence와 비슷한 존재이다.  
Java의 Stream은 Sequence와 마찬가지로 map 및 filter 등의 함수를 어딘가에 넣어놓고 소비가 이루어지는 시점에 계산한다.

## 정리해보자
이 글을 쓰게 된 계기가, `.map` 을 했는데 그 안의 람다가 실행이 안되서 의도하지 않은 결과가 나왔기 때문이었다.  
즉, `.map`에서 다른 데이터를 변경했는데(부수효과), Sequence 의 lazy evaluation 때문에 몇몇 `.map` 이 스킵되어 이상한 결과가 나왔다.  

`.map`의 용도는 현 데이터의 변환이기 때문에 다른 작업은 수행하지 않는게 좋겠고, 꼭 필요하다면 `.forEach` 를 사용하자.
