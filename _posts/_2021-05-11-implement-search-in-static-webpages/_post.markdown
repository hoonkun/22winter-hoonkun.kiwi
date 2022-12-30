---
layout: post.liquid
author: GoHoon
title: 정적 블로그에서 검색 기능 구현하기
date: 2021-05-11, 23:39
image: /assets/images/posts/2021-05-11-implement-search-in-static-webpages/preview.png
categories: [dev,dev-others]
excerpt_separator: <!-- Excerpt -->
use_code_fragment: true
---
서드파티 라이브러리인 lunr를 사용해 jekyll 정적 블로그에서 검색 기능을 구현해보자.   
생각보다 어렵지는 않은데 깔끔하지도 않은 것 같다. 언제가 될 지는 잘 모르겠으나 나중에 더 좋은 코드를 만들어보는걸로.   
<!-- Excerpt -->
&nbsp;   

## 서론
그냥 인터넷 뒤져서 검색 기능 구현한 코드 나와있는거를 지금 lunr 버전에 맞게 코드를 약간 수정했다.   
&nbsp;   
생각만큼 어렵지는 않았는데 이게 과연 최선일지는 잘 모르겠다. DOM 엘리먼트를 스크립트에서 하나하나 다 만들어주고 있는 것 부터가.   
독자 여러분은 적당히 참고만 하시고, 이건 이렇게 고치면 좋겠다 싶은게 있으시면 부디 덧글을 달아주세요 ㅋㅋㅋㅋ   
&nbsp;   
~~거기에 지금 약간 반쯤 졸면서 집중도 제대로 못하고 글을 쓰고 있어서 글이 두서가 없고 뭔말인지 모르겠을 수 있습니다~~   
&nbsp;   

## 구현해야할 것들
대충 이런 것들을 구현해야한다.
- 모든 블로그의 포스트 데이터를 하나의 **객체(배열 아님)**에 때려넣는 부분
- url에 포함된 parameter를 가져오는 함수
- lunr 라이브러리에서 한국어 핸들링을 위한 콜백함수
- 검색 결과 중 포스트 하나를 표현하는 DOM 엘리먼트 구조를 만드는 함수
- 바로 위의 함수를 호출하여 최종적으로 검색 결과를 출력하는 함수
- 실제로 검색을 수행하는 부분

&nbsp;   

우선 모든 블로그의 포스트 데이터를 **window.store 객체**에 저장해야한다. 다음 코드를 검색을 수행하게 할 스크립트 태그의 내용 앞쪽에 추가하자.   
**반드시 html의 script 태그 안이어야한다.** js파일로 분리하면 동작하지 않는다. 굳이 js로 분리하겠다면 jekyll의 말머리(front matter)를 추가하고 분리하도록 하자. liquid 태그를 사용하기 때문이다.
<pre><code class="language-javascript">&#123;% assign date_format = site.minima.date_format | default: "%B %-d, %Y" %&#125;

window.store = &#123;
    &#123;% for post in site.posts %&#125;
        "&#123;&#123; post.url | slugify &#125;&#125;": &#123;
            "title": "&#123;&#123; post.title | xml_escape &#125;&#125;",
            "author": "&#123;&#123; post.author | xml_escape &#125;&#125;",
            "category": &#123;&#123; post.categories | xml_escape | jsonify &#125;&#125;,
            "content": &#123;&#123; post.content | strip_html | strip_newlines | jsonify &#125;&#125;,
            "excerpt": &#123;&#123; post.excerpt | strip_html | strip_newlines | jsonify &#125;&#125;,
            "date": "&#123;&#123; post.date | date_to_xmlschema &#125;&#125;",
            "date_formatted": "&#123;&#123; post.date | date: date_format &#125;&#125;",
            "image": "&#123;&#123; post.image_path | strip_html | strip_newlines | xml_escape &#125;&#125;",
            "url": "&#123;&#123; post.url | xml_escape &#125;&#125;"
        &#125;
        &#123;% unless forloop.last %&#125;,&#123;% endunless %&#125;
    &#123;% endfor %&#125;
&#125;;</code></pre>
<div class="code-fragment-name">search.html</div>
&nbsp;   
이해가 가는가? 지금 자바스크립트와 liquid 문법이 섞여있어서 syntax highlighting도 이상하게 되어있고 이게 뭔 코드지 싶을 것이다.   
liquid가 jekyll에서 뭘 하는지 생각을 해보고 주의깊게 살펴본다면 대충 뭘 하는 코드인지는 예상이 가야한다.   
window.store이라는 곳에 모든 포스트 내용을 javascript에서 말하는 object 형태로 추가하고있다.   
중간중간에 값으로 따옴표(")가 있는게 있고 없는게 있는데 다 이유가 있으니 IDE에서 에러를 뿜어내더라도 넘어가자.   
liquid 삽입문을 썼을 때 따옴표가 포함되어있는 경우와 그렇지 않은 경우가 있기 때문에 그런 것이다.   
&nbsp;   
이걸로 일단 검색을 수행할 전체 데이터는 만들어졌다. 다음을 살펴보자.   
<pre><code class="language-javascript">let searchTerm = getParameter("query", (value) => { return decodeURIComponent(value.replace(/\+/g, '%20')); });
    
let searchResult = null;

if (searchTerm) {
    let idx = lunr(function () {
        this.pipeline.reset();
        this.pipeline.add(
            trimmerEnKo,
            lunr.stopWordFilter,
            lunr.stemmer
        );

        this.field('id');
        this.field('title', { boost: 10 });
        this.field('author');
        this.field('category');
        this.field('content');

        Object.keys(window.store).forEach((key) => {
            let each = window.store[key];
            this.add({
                'id': key,
                'title': each.title,
                'author': each.author,
                'category': JSON.stringify(each.category).replace(/&quot;/g, ""),
                'content': each.content
            });
        }, this);
    });

    searchResult = idx.search(searchTerm);
    displaySearchResults();
}

function trimmerEnKo(token) {
    token.str = token.str.replace(/^[^\w가-힣]+/, '').replace(/[^\w가-힣]+$/, '');
    return token;
}

function getParameter(parameterName, returnFunction) {
    let query = window.location.search.substring(1);
    let lets = query.split('&');

    for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split('=');
        if (pair[0] === parameterName) {
            return returnFunction(pair[1]);
        }
    }
    return null;
}
</code></pre>
<div class="code-fragment-name">search.html</div>
으! 뭔가 엄청 길다. 보기가 싫다. 귀찮다...   
&nbsp;   
우선 첫 줄에서는 url에 포함된 parameter로부터 검색어를 가져오고있다.   
getParameter 함수는 아래쪽에 구현이 되어있다. &와 =를 기준으로 분할해서 키에 맞는 값을 가져오는 과정이다.   
&nbsp;   
그리고, 그 가져온 검색어가 유효하다면(if) 안쪽의 문장을 수행하는데, 다음과 같다:   
- lunr 객체를 생성하는데, 그 생성자의 인수로 콜백 하나를 전달한다. 그 콜백 함수에서는 여러 세팅을 해주는데, 약간 정해진 코드 느낌이 물씬 난다. 맞다.   
  this.pipeline을 설정해주는 부분은 그냥 대충 그렇구나 하고 넘어가자. 나도 잘 모르겠다...   
  this.field 함수를 호출하는 부분은, 검색을 수행할 대상을 추가하는 부분인 것 같다. 제목, 작성자, 카테고리, 내용 등을 대상으로 검색하는 것이다.
  콜백의 마지막에서 forEach 부분은 실제로 검색을 수행을 데이터를 추가하는 부분이다. 포스트 데이터가 배열이 아니라 객체임을 주의하자.
- 생성한 lunr 객체를 사용해 검색을 수행한다.
- 검색한 결과를 기반으로 출력한다.

&nbsp;   
<code>displaySearchResults()</code>는 적당히 입맛에 맞게 구현해주면 된다.   
단지, searchResults는 배열인데 검색 결과를 포함하기는 하지만 포스트 데이터를 포함하지는 않는다.   
그래서 포스트 데이터를 가져오려면 window.store에 접근해서 가져와야한다.   
그러니 검색 결과로부터 포스트 데이터를 가져오려면 다음 표현을 쓰자.
<pre><code class="language-javascript">window.store[searchResult[i].ref]</code></pre>
<div class="code-fragment-name">search.js</div>
그냥 검색결과로 for문을 돌리고, 위의 문장으로 포스트 데이터를 가져온 후 포스트를 표현할 DOM 엘리먼트를 만들어서 innerHTML이나 appendChild()같은걸로 출력해주면 된다.~~상당히 귀찮다~~   
&nbsp;   

## 결론
대충 이런 느낌으로 검색은 구현이 된다. 페이징은 자바스크립트를 빡세게 짜면 된다.   
약간... DOM Element를 javascript로 하나하나 만들어줘야해서 뭔가 더 좋은 방법이 없을까 싶지만 일단 지금은 잘 모르겠다.   
&nbsp;   
페이징과 관련해서는 인터넷에 많이 나와있기도 하고 지금은 글을 너무 길게 써서 피곤하니까~~???~~ 다음에 다른 포스트로 알고리즘을 살펴보던지 하겠다.   
