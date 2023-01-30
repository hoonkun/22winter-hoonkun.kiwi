---
author: GoHoon
title: JS 주화입마
date: 2023-01-05, 16:51
categories: [dev, frontend]
---
> 이 게시글에는 약팔이가 일부 포함되어있을 수 있습니다.

자바스크립트에서 코틀린에서의 편리한 함수들을 사용할 수 있도록 해보자.  
<!-- Excerpt -->
물론 어디까지나 자바스크립트를 코틀린처럼 이지, 코틀린을 자바스크립트 처럼이 아니기 때문에 코틀린과 동작이 완전히 일치하지는 않는다.  

## 서론
코틀린을 한 번 맛보고 나니 `.let { }` 이나 `.random()` 같은 함수가 없는게 너무 불편했다.  
특히 `.let` 의 경우 여러 번 쓰이는 엄청 긴 표현식이 있는데 변수 만들기는 귀찮고 하나하나 똑같은 표현식을 계속 써주기도 힘들 때 요긴했던 함수인데, 
이게 없으니까 엄청 불편했다.

거기에 `let`은 자바스크립트에서 변수를 선언하는 구문이라 함수의 이름으로는 쓰일 수 없어서, 굳이 만들려면 아래처럼 만들고 써야했다:
```typescript
export const letIt = <T, R>(it: T, block: (it: T) => R): R => {
  return block(it)
}

const summary = letIt(items.reverse().filter(it => it.name.includes(query))[0], it => `${it.title} (${it.count})`)
```
> Any.ts

근데 솔직히 매번 letIt 을 임포트하는것도 귀찮은데다가 코틀린이랑 생긴게 달라서 조금 애매했다.  

## Object 와 prototype 
모든 오브젝트는 Object 의 자손이고, prototype 에 추가된 함수들은 어디서든 쓸 수 있다고 한다!  
물론 추가하는 스크립트가 한 번 이상 실행되도록 루트 스크립트에서 임포트 한 번은 해줘야한다.  

아무튼 그래서 다음처럼 추가했다:

```typescript
Object.defineProperty(Object.prototype, "let", {
  enumerable: false, configurable: false, writable: false,
  value: function <T, R>(this: T, block: (it: T) => R): R { return block(it) }
})

const summary = items
  .reverse()
  .filter(it => it.name.includes(query))[0]
  .let(it => `${it.title} (${it.count})`)
```
> Any.ts

비록 코틀린에서 처럼 중괄호를 바로 쓰지는 못하지만, 어쩔 수 없다. 그거까지 가려면 트랜스파일러를 손봐야할테니...  
근데 위처럼 쓰면 돌아는 가는데, `let` 을 찾을 수 없다고 타입스크립트 컴파일러가 뭐라고 할 것이다.  
그래서 타입도 아래처럼 추가해줬다 ^^

```typescript
declare global {
  interface Object {
    let<T, R>(this: T, block: (it: T) => R): R
    // ...
  }
}
```
> types.ts

`Object.prototype.let = ...` 와 같은 구문을 쓰지 않은 이유는, 오브젝트 prototype에 직접 값을 할당하면 그냥 쓰는데는 문제가 없는데 
React 등에서 오브젝트를 `<Component {...props}/>` 의 형태로 추가하려고 하면 오브젝트에 이상한게 있다고 뻑내버린다.  

그래서, `enumerable: false` 를 통해 spread 연산자가 접근할 수 없도록 하고, 다시 쓰거나 변경할 수 없도록 했다.

## 기타 주절주절
거듭 강조하지만 코틀린을 자바스크립트처럼 이 아닌 자바스크립트를 코틀린처럼 이기 때문에, 코틀린처럼 JVM으로 변환될 때 inline 으로 선언된 함수가 대치되거나 하여 성능도 신경을 썼다던지 그런건 전혀 없다.  
단순히 문법 설탕? 아니지 이거는 오히려 더 가독성을 해칠 수도... 아무튼 그런 느낌이다.  

그리고 함수들의 구현은 내 몫이다. 코틀린에 있는 배열 관련 유틸리티 함수인 `random()` 이나, `chunked()`, `sum()` 등도 추가하려 한다면 직접 구현해야한다.  

이 블로그의 저장소에 보면 실제로 이렇게 구현된 유틸리티 함수들이 `src/utils/ktn/` 디렉터리에 모여있다. 정말 편리하다...  
단지 이것들은 이 프로젝트에서 벗어나기만 해도 다른 모든 프로젝트에는 **그런거 없기 때문에**, 오히려 헷갈리거나 더 불편해질 수도 있다.  

그치만 나는 내 프로젝트에서는 편하게 나 마음대로 하고싶어... (??)  
그리고 이제 실무 프로젝트에 가서 `item.let` 을 입력하고 '아...' 하며 황급히 지우는거지. 주화입마가 따로 없다!!  

언잰가 이런 스크립트들 한데 다 모아서 패키지로 만들어보는 것도 좋을 것 같고... 그렇다.
