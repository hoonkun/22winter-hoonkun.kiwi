---
layout: post.liquid
author: GoHoon
title: React에서 서버사이드 렌더링을 통해 검색엔진 최적화하기
date: 2021-01-11, 18:50
image: /assets/images/posts/2021-01-11-react-search-engine-optimization-with-server-side-rendering/preview.png
categories: [dev,react]
excerpt_separator: <!-- Excerpt -->
use_code_fragment: true
---
React에서 node js 서버사이드 렌더링을 통해 최대한 간단하게 검색엔진을 최적화하는 방법을 알아보자.   
<!-- Excerpt -->
&nbsp;   
들어가기 앞서 주의할 점은 여기서 설명할 방식은 일반적인 React 프로젝트와는 구조가 조금 다를 수 있기 때문에, 구조를 갈아엎을 수 있거나 하는 상황이 아니라면 참고용으로만 읽기를 추천한다.   
&nbsp;   
node js 스크립트와 React 프로젝트를 하나의 큰 프로젝트에서 관리하는 경우가 이 포스트에서 설명하는 방식과 가장 잘 맞다.   
&nbsp;   
&nbsp;   
React를 쓰면서 검색엔진 최적화를 하기 위해 인터넷을 돌아다녀 보면 대부분 서버사이드 렌더링을 추천했다.   
그래서 서버사이드 렌더링을 하려고 검색을 좀 해보니 추가해야할것도 엄청 많고 webpack이니 뭐니 알아야할 것도 너무 많았다.

무엇보다 서버사이드 렌더링을 하려면 컴포넌트에 window 같은 DOM 전용 내장객체의 사용이 없거나 사용할 때마다 각 객체가 유효한지 아닌지 판별해줘야하는데,
이미 너무 많은 DOM 전용 내장 객체를 사용했고 이제 와서 하나하나 유효성 체크를 추가해주자니 너무 양이 많아서 무리일 것 같았다.   
&nbsp;   
우선 하려는 것의 요지는 검색 엔진 최적화이므로 페이지 전체를 렌더링하기보다는 SEO 관련 태그(meta, title 등)만 서버에서 렌더링을 해서
요청에 응답을 보내기 전 템플릿 html 파일에 삽입한 뒤에 응답을 하면 좋을 것 같았다.   
&nbsp;   
전체 과정은 node 스크립트를 React와 서버측 렌더링 코드를 포함해서 작성하고 get request에 응답할 때 요청된 페이지에 맞는 SEO 태그를
렌더링해서 전송하는 것이다. 그럼 바로 준비해보자.   
&nbsp;   
먼저 프로젝트 구조는 다음과 같아야한다. 강제되는 사항이니 독자 여러분께서 작업하는 프로젝트 구조가 이와 다르다면 이 글은 참고만 해주시길 바란다.   
이 프로젝트 구조에 대해서는 [여기]({{ site.baseurl }}/dev/2021/01/08/manage-different-react-projects-in-one-project.html "여러 React 프로젝트를 하나로 관리해보자")에서 다루고 있으니 살펴보는 것도 좋겠다.
<pre><div class="pre_child">[project_root]
    backend
        [node_scripts]
    frontend
        [react_project]
            build
            public
            src
            ...
    node_modules
    package.json</div></pre>
&nbsp;   
가장 먼저 해야할 일은 SEO 태그를 포함한 React 컴포넌트를 만드는 일이다. [react_project]에 만들 것이다.   
SEO 태그는 하나가 아니기 때문에 SEO 태그 전체를 포함한 SEOTag 컴포넌트를 먼저 만들겠다.
<pre><code class="language-javascript">class SEOTag extends React.Component {
    render() {
        return (
            &lt;Helmet&gt;
                &lt;title&gt;{this.props.title}&lt;/title&gt;
                &lt;meta name="title" content={this.props.meta_title}/&gt;
                &lt;meta name="description"
                      content={this.props.meta_description}/&gt;

                &lt;meta property="og:type" content="website"/&gt;
                &lt;meta property="og:url" content={this.props.meta_url}/&gt;
                &lt;meta property="og:title" content={this.props.meta_title}/&gt;
                &lt;meta property="og:description"
                      content={this.props.meta_description}/&gt;
                &lt;meta property="og:image"
                      content={this.props.meta_image}/&gt;

                &lt;meta property="twitter:card" content="summary_large_image"/&gt;
                &lt;meta property="twitter:url" content={this.props.meta_url}/&gt;
                &lt;meta property="twitter:title" content={this.props.meta_title}/&gt;
                &lt;meta property="twitter:description"
                      content={this.props.meta_description}/&gt;
                &lt;meta property="twitter:image"
                      content={this.props.meta_image}/&gt;
            &lt;/Helmet&gt;
        );
    }
}</code></pre>
<div class="code-fragment-name">SEOTag.js</div>

import는 생략했다. react와 react-helmet을 통해 React, Helmet을 import하면 된다.   
props로 전달한 각종 속성을 SEO 태그에 한번에 반영하는 컴포넌트이다.   
&nbsp;   
다음으로는 이 SEO 태그를 포함한, 또다른 컴포넌트를 만들 것이다. 두 가지 유형이 있을 수 있는데 모두 알아보자.   
&nbsp;   
첫 번째로는 정적 SEO 컴포넌트다. props에 변수가 없고 모두 상수 문자열인 형태로, 정해진 SEO 내용을 출력만 하는 태그다. 메인 페이지 같은 곳에 유용하다. 코드를 보면 다음과 같이 간단하다:
<pre><code class="language-javascript">class SeoStatic extends React.Component {
    render() {
        return &lt;SEOTag title="title of title tag" 
                       meta_title="title of meta tag"
                       meta_description="description"
                       meta_url="https://some.url"
                       meta_image="/some/image.jpg"/&gt;
    }
}</code></pre>
<div class="code-fragment-name">SeoStatic.js</div>
&nbsp;   
다음으로는 동적 SEO 컴포넌트다. 이 컴포넌트에 prop 으로 data라는 자바스크립트 객체(object)를 전달해서 그 값을 때에 따라 다르게 출력하는 태그다. 블로그의 포스트 같은 곳에 유용하다. 코드를 보면 다음과 같다:
<pre><code class="language-javascript">class SeoDynamic extends React.Component {
    render() {
        return &lt;SEOTag title={`${this.props.data.title}`}
                       meta_title={`${this.props.data.title}`}
                       meta_description={`${this.props.data.date} - ${this.props.data.description}`}
                       meta_url={`https://some.url/${this.props.data.id}`}
                       meta_image={this.props.data.image ? this.props.data.image : "/default/image.jpg"}/&gt;
    }
}</code></pre>
<div class="code-fragment-name">SeoDynamic.js</div>
&nbsp;   
이제 서버에서 렌더링할 ServerRenderSeo 컴포넌트를 만들 것이다. 스위치와 라우트로 구성되어있다. 소스를 보자:
<pre><code class="language-javascript">class ServerRenderSeo extends React.Component {
    render() {
        return (
            &lt;Switch&gt;
                &lt;Route exact path="/" render={() =&gt; &lt;SeoStatic/&gt;}/&gt;
                &lt;Route path="/some/dynamic/content" render={() =&gt; &lt;SeoDynamic data={this.props.data}/&gt;}/&gt;
            &lt;/Switch&gt;
        )
    }
}</code></pre>
<div class="code-fragment-name">ServerRenderSeo.js</div>
메인 페이지에서는 SeoStatic를 렌더링, 뭔가 동적인 페이지에서는 ServerRenderSeo의 props.data를 SeoDynamic에 전달하여 렌더링한다.   
&nbsp;   
이제 이 ServerRenderSeo 를 서버에서 렌더링하여 html에 삽입, 응답으로 날려줄 것이다. 다음 코드는 node 스크립트이다. 코드를 보자:
<pre><code class="language-javascript">import {StaticRouter} from 'react-router';
import ReactDOMServer from 'react-dom/server';
import Helmet from "react-helmet";

const public_default = path.join(__dirname, "..", "frontend", "project-name", "build");
const html = fs.readFileSync(path.resolve(path.join(public_default, "index.html")), 'utf8');

// Create app instance with express() here.

app.get("/*", (req, res) =&gt; {

    // Create seo data object(seo_data) here if necessary.

    ReactDOMServer.renderToString(&lt;StaticRouter location={req.path}&gt;&lt;ServerRenderSeo data={seo_data}/&gt;&lt;/StaticRouter&gt;);
    const helmet = Helmet.renderStatic();

    let html_ = html;
    html_ = html_.replace(
        '&lt;meta helmet&gt;',
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`
    )

    res.contentType("text/html");
    res.send(html_);

});</code></pre>
<div class="code-fragment-name">main.js</div>
&nbsp;   
그리고 React에 의해 페이지가 바뀌어 url은 바뀌었는데 서버에 요청은 날리지 않았을 경우에도 Seo 태그 내용은 바뀌어야 마음이 편하므로
React 프로젝트의 각 라우터에 설정된 컴포넌트의 render()에 SeoStatic 혹은 SeoDynamic(이 경우에는 서버에서 data prop을 따로 fetch등을 사용해 요청할 필요가 있을 수 있다)을 적절히 추가해주자.
&nbsp;   
다음으로는 React 프로젝트의 public/index.html의 head 태그 안에 다음 내용을 추가한다.
<pre><code class="language-html">&lt;meta helmet&gt;</code></pre>
<div class="code-fragment-name">index.html</div>
&nbsp;   
그리고 최신 문법을 포함하여 작성한 node 스크립트를 구버전 문법으로 바꿔주기 위해 babel을 사용해야한다. 새로운 노드 스크립트를 만들고 다음과 같이 작성한다.
<pre><code class="language-javascript">require('ignore-styles');

require('@babel/register')({
    ignore: [/(node_modules)/],
    presets: ['@babel/preset-env', '@babel/preset-react']
});

require('./main.js');</code></pre>
<div class="code-fragment-name">entry.js</div>

코드를 보면 알겠지만 몇 가지 패키지의 설치가 필요하다. @babel/preset-env, @babel/preset-react, @babel/register, ignore-styles 패키지를 npm을 통해 설치해준다.
<pre><div class="pre_child">&gt; npm install [package_name] --save</div></pre>
&nbsp;   
모든 과정이 끝났다!!   
동작 원리를 간단히 알아보자.   
&nbsp;   
우선 이 프로젝트는 하나의 큰 프로젝트 안에 node 프로젝트와 react 프로젝트가 공존한다. 따라서 React 프로젝트 안에 있는 스크립트는 node 스크립트에서 참조할 수 있으며,
이 점을 이용해 React에 프로젝트에 작성한 SEO 컴포넌트들을 node에서 불러와 서버측 렌더링을 수행, 요청의 응답으로 렌더링한 seo 태그들을 포함한 html을 전달한다.   
&nbsp;   
SEO 컴포넌트는 React에 프로젝트에 작성했으므로 해당 프로젝트 내에서는 당연히 참조 가능하므로 React Router로 url과 컴포넌트가 바뀌었지만 서버에 요청을 보내지 않은 상황에서도
SEO 태그의 내용을 변경할 수 있다.   
&nbsp;   
서버에서 렌더링할 때 스크립트는 React관련 컴포넌트들을 직접 임포트하여 사용하는 최신 javascript 문법을 사용했으나 node 에서는 구버전 문법만 지원하므로
babel로 구버전 문법으로 변경해준 것이다.   
&nbsp;   
이제 마지막으로 작성했던 node 스크립트(entry.js)를 명령창에서 실행해보면 SEO가 적용되어있을 것이다.
굳이 서버측에서 모든 렌더링을 할 필요가 없다면 이 방법도 괜찮을 것 같다.   
&nbsp;   
그런 느낌으로 이번 포스트는 여기까지 하면 될 것 같다. 코드에 문제가 있거나 질문사항이 있으시면 아래의 트위터로 멘션 부탁해요!
