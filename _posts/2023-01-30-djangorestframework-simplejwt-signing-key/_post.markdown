---
author: GoHoon
title: 장고 서버의 SimpleJWT SIGNING_KEY
date: 2023-01-30, 09:15
categories: [dev, backend]
---
동일 소스를 기반으로 SimpleJWT를 사용하는 여러 장고 서버를 운용할 때 주의할 점에 대해 알아보자.  
<!-- Excerpt -->
## 서론
일반적으로는 하나의 소스로 하나의 서비스를 운용하지만, 그렇지 않고 하나의 소스로 여러 서버를 올려 여러 분산된 서비스를 운용할 때가 있다.  
이런 상황에서, django와 SimpleJWT를 사용하여 구현한 서버를 운용하게 되었는데, 정말 다행히도 한 곳에만 서비스를 시작했을 때 다음과 같은 이슈가 발생했다:  

> A 서비스에서 발급받은 user.id=1 JWT 토큰을 그대로 B 서비스 홈페이지에 대입하면 B 서비스의 user.id=1로 로그인 되는 문제가 있습니다.

이 말인 즉 A 서비스의 토큰으로 B 서비스의 임의 다른 사용자로 로그인할 수 있다는 말이 된다. ~~흠좀무~~  

## 원인
생각보다 복잡하지 않다. JWT의 구조는 단순히 특정 정보를 가진 JSON 오브젝트와 여러 정보(header, payload, signature)를 서버가 가진 SIGNING_KEY 를 사용하여 암호화해놓은 것인데,  
그 내용(payload)의 decode는 아무나 할 수 있지만 서명 및 검증(signature) 는 SIGNING_KEY를 가진 서버밖에 못한다(그래서 JWT를 아무나 만들어낼 수는 없다).  

즉, A 서비스에서 사용된 SIGNING_KEY와 B 서비스에서 사용된 SIGNING_KEY 가 같다는 것에서 문제가 발생한다는 것이다(A, B 서비스 모두 서로의 토큰을 검증할 수 있었기 때문에).  

## 해결
따라서 A 서비스와 B 서비스에서 JWT 암호화(서명)에 사용하는 키를 서로 다른 것을 사용하도록 해주면 해결된다.  
적절히 os.getenv() 를 통해 SECRET_KEY에 할당하여(djangorestframework-simplejwt 의 경우 SIGNING_KEY에 settings.SECRET_KEY를 기본값으로 사용한다) 해결했다.

## 나머지
.env 파일을 읽기 위해 python-dotenv 를 설치하고, load_dotenv 같은 것들을 해주었다.  
근데 이거 조금이라도 나중에 발견했으면... 어우 무서워라. 꼭 기억해뒀다가 나중에 비슷한거 하게되면 잊지 말고 처리해야지.
