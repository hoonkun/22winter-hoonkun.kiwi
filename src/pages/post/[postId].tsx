import React, { createElement, Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Post, Posts, PostWithContent } from "../../utils/Posts";
import styled from "@emotion/styled";
import { unified } from "unified";
import rehypeReact from "rehype-react";
import remarkRehype from "remark-rehype";
import remarkParse from "remark-parse";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import stringWidth from "string-width";
import remarkGfm from "remark-gfm";
import rehypeParse from "rehype-parse";

import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Highlighter from "react-syntax-highlighter"
import Head from "next/head";
import { Breakpoint, ScaleBreakpoint } from "../../../styles/globals";
import { css, Global } from "@emotion/react";
import { BackButton } from "../../components/Buttons";

type PostPageProps = {
  post: Post
  content: string
  next: Post | null
  previous: Post | null
  related: Post[]
}

const PostPage: NextPage<PostPageProps> = pageProps => {

  const { post: { key }, content, next, previous, related } = pageProps
  const [PostContent, setPostContent] = useState(<Fragment/>)

  const comments = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!content) return

    unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeReact, { createElement, Fragment, components: {
          img: (props: any) => <ContentImage src={props.src} alt={props.alt} postId={key}/>,
          code: (props: any) => props.className ?
            <Highlighter language={props.className.replace("language-", "")} style={darcula}>{props.children}</Highlighter> :
            <InlineCode {...props}/>,
          a: (props: any) => props.href.startsWith("/") ?
            <Link href={props.href} scroll={false}>{props.children}</Link> :
            <a {...props}>{props.children}</a>
        } }
      )
      .process(content)
      .then(file => setPostContent(file.result))
  }, [content, key])

  useLayoutEffect(() => {
    if ((comments.current?.childNodes.length ?? 0) > 0) return

    const script = document.createElement("script")
    script.setAttribute("repo", "hoonkun/22winter-hoonkun.kiwi")
    script.setAttribute("issue-term", "title")
    script.setAttribute("label", "post comment")
    script.setAttribute("theme", "github-dark")
    script.crossOrigin = "anonymous"
    script.async = true
    script.src = "https://utteranc.es/client.js"

    comments.current?.appendChild(script)
  }, [])

  return (
    <Root>
      <Global styles={css`body { background-color: #323232 }`}/>
      <PostHead post={pageProps.post}/>
      <PostLimitedWidth>
        <Link href={"/posts/1"}><BackButton i={"arrow_back"}/></Link>
        <PostTitle>{pageProps.post.data.title}</PostTitle>
        <PostDescription>
          <li>{pageProps.post.data.date}</li>
          <li>{pageProps.post.data.author}</li>
        </PostDescription>
        <PostCategory>
          <li>{pageProps.post.category[0].display}</li>
          {pageProps.post.category[1] && <li>{pageProps.post.category[1].display}</li>}
        </PostCategory>
        <PostPreviewImage
          src={require(`./../../../_posts/${pageProps.post.key}/main.png`).default.src}
          alt={""}
        />
        {PostContent}
        <ExternalLinks>
          <ExternalLink href={"https://twitter.com/arctic_apteryx"} color={"#1d9bf0"}>Twitter</ExternalLink>
          &nbsp;&nbsp;
          <ExternalLink rel={"me"} href={"https://twingyeo.kr/@hoon_kiwicraft"} color={"#595aff"}>Mastodon</ExternalLink>
        </ExternalLinks>
        <Comments ref={comments}/>
        <RecommendedPosts related={related} previous={previous} next={next}/>
      </PostLimitedWidth>
    </Root>
  )
}

export const getStaticProps: GetStaticProps<PostPageProps> = async context => {
  const post = Posts.retrieve<PostWithContent>(context.params!.postId as string, true)

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm, { stringLength: stringWidth })
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex, { strict: false, displayMode: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(post.content)
    .let(async it => String(await it))

  const next = Posts.next(post.key)
  const previous = Posts.previous(post.key)
  const related = Posts.related(post.key, post.category[0].name)

  return { props: { post: post.omit("content"), content: result, next, previous, related } }
}

export const getStaticPaths: GetStaticPaths = () => {
  const postIds = Posts.list().map(it => it.key)
  return { paths: postIds.map(it => ({ params: { postId: it } })), fallback: false }
}

const PostHead: React.FC<{ post: Post }> = ({ post }) => {

  const title = `${post.data.title} - 아무말 집합소`
  const baseurl = `https://hoonkun.kiwi`

  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title}/>
      <meta name="description"
            content={post.excerpt}/>

      <meta property="og:type" content="website"/>
      <meta property="og:url" content={`${baseurl}/post/${post.key}`}/>
      <meta property="og:title" content={title}/>
      <meta property="og:description"
            content={post.excerpt}/>
      <meta property="og:image"
            content={`${baseurl}${require(`./../../../_posts/${post.key}/main.png`).default.src}`}/>

      <meta property="twitter:card" content="summary_large_image"/>
      <meta property="twitter:url" content={`${baseurl}/post/${post.key}`}/>
      <meta property="twitter:title" content={post.data.title}/>
      <meta property="twitter:description"
            content={post.excerpt}/>
      <meta property="twitter:image"
            content={`${baseurl}${require(`./../../../_posts/${post.key}/main.png`).default.src}`}/>
    </Head>
  )
}

const Comments = styled.div``

const ExternalLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 40px 0 20px 0;
  font-size: 14px;
  line-height: 20px;
  border-bottom: 1px solid #ffffff30;
  padding-bottom: 20px;
`

const ExternalLink = styled.a<{ color: string }>`
  text-decoration: none !important;
  padding: 0 10px;
  border-radius: 3px;
  background-color: ${({ color }) => color};
`

const RecommendTypeText = {
  "next": "다음 글",
  "previous": "이전 글",
  "related": "비슷한 글"
} as const

const RecommendedPosts: React.FC<{ related: Post[], next: Post | null, previous: Post | null }> = ({ related, next, previous }) => {
  return (
    <>
      <RecommendedPostTitle>다른 글도 살펴보실래오?</RecommendedPostTitle>
      {related.map(it => <RecommendedPostView key={it.key} post={it} type={"related"}/>)}
      {next && <RecommendedPostView post={next} type={"next"}/>}
      {previous && <RecommendedPostView post={previous} type={"previous"}/>}
    </>
  )
}

const RecommendedPostTitle = styled.div`
  font-size: 25px;
  font-weight: bold;
  margin: 60px 0 20px 0;
`

const RecommendedPostView: React.FC<{ post: Post, type: "next" | "previous" | "related" }> = ({ post, type }) => {
  return (
    <Link href={`/post/${post.key}`} style={{ textDecoration: "none" }}>
      <PostViewRoot>
        <PostPreview src={require(`./../../../_posts/${post.key}/preview.png`).default.src}/>
        <PostOverlay>
          <PostItemDescription>{ RecommendTypeText[type] }</PostItemDescription>
          <PostItemTitle>{ post.data.title }</PostItemTitle>
          <PostItemExcerpt>{ post.excerpt }</PostItemExcerpt>
        </PostOverlay>
      </PostViewRoot>
    </Link>
  )
}

const PostViewRoot = styled.div`
  width: calc(100% + 80px);
  margin-left: -40px;
  height: 250px;
  margin-bottom: 20px;
  position: relative;
  
  ${ScaleBreakpoint} {
    &:hover {
      transform: scale(1);
    }
  }
  
  ${Breakpoint} {
    transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1);
    &:hover {
      transform: scale(1.05);
    }
  }
`

const PostPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  filter: brightness(0.3);
  z-index: 0;
`

const PostOverlay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
`

const PostItemDescription = styled.div`
  position: absolute;
  z-index: 1;
  right: 30px;
  top: 5px;
  font-size: 12px;
  opacity: 0.75;
`

const PostItemTitle = styled.div`
  width: 80%;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  text-shadow: 0 0 5px #00000099;
  word-break: keep-all;
`

const PostItemExcerpt = styled.div`
  width: 80%;
  text-align: center;
  opacity: 0.85;
  font-size: 14px;
  line-height: 20px;
  text-shadow: 0 0 5px #000000;
  word-break: keep-all;
`

const PostLimitedWidth = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  font-size: 16px;
`

const PostTitle = styled.div`
  font-weight: bold;
  font-size: 30px;
  word-break: keep-all;
  line-height: 125%;
  
  ${Breakpoint} {
    margin-top: 20px;
  }
`

const PostDescription = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-inline-start: 0 !important;
  font-size: 13px;
  margin: 10px 0 0 0;
  
  li:nth-of-type(n+2):before {
    content: "|";
    margin: 0 10px;
    opacity: 0.5;
  }
`

const PostCategory = styled(PostDescription)`
  margin: 0 0 20px 0;
  li:nth-of-type(n+2):before {
    content: "〉";
    margin: 0 0 0 10px;
    opacity: 0.5;
  }
`

const PostPreviewImage = styled.img`
  margin: 0 -20px;
  width: calc(100% + 40px);
  
  & + blockquote {
    background-color: #ff572220;
    border-radius: 0;
    border-left: none;
    margin: 15px 0;
  }
`

const Root = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  
  line-height: 250%;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  
  font-family: "IBM Plex Sans KR", sans-serif;

  table {
    border-color: #FFFFFFBB;
    table-layout: fixed;
  }

  table td, th {
    border-color: #FFFFFFBB;
  }

  del {
    opacity: 0.55;
  }

  ul, ol {
    padding-inline-start: 20px;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #FFFFFF;
  }

  .math-inline {
    max-width: 100%;
    margin-bottom: -18.5px;
    display: inline-block;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    color: #FFFFFF;
    padding-right: 3px;
  }

  table .math-inline {
    margin-bottom: -10px;
  }

  p:has(> img) + blockquote {
    text-align: center;
    color: #FFFFFF90;
    font-size: 14px;
    margin-top: -35px;
    background-color: transparent;
    border-left: none;
  }

  code {
    font-family: "JetBrains Mono", sans-serif !important;
    font-size: 13px;
    line-height: 150%;
  }

  pre + blockquote {
    margin: -0.5em 0 0 0;
    font-size: 13px;
    background-color: #00000040;
    padding: 8px 15px;
    font-family: "JetBrains Mono", sans-serif;
    border-radius: 0 0 5px 5px;
    border-left: none;
  }

  pre {
    margin: 0;
    border-radius: 5px 5px 0 0;
    overflow-x: auto;
  }
  
  pre:not(:has(> pre)) {
    border-radius: 5px;
    padding: 7px 15px;
    font-size: 16px;
    font-family: "JetBrains Mono", sans-serif;
    background-color: rgb(43, 43, 43);
  }

  a {
    color: #FFFFFF;
    text-decoration: underline;
  }

  blockquote {
    p {
      margin: 0;
    }
    margin: 0;
    background-color: #FFFFFF10;
    padding: 15px 25px;
    border-left: 5px solid #78a718;
    border-radius: 5px;
  }
  
  .hljs {
    display: block;
    overflow-x: auto;
    padding: 10px 15px;
    border-radius: 5px 5px 0 0;
    background: #00000020;
  }
  
  .hljs {
    color: #bababa;
  }

  .hljs-strong, .hljs-emphasis {
    color: #a8a8a2;
  }

  .hljs-bullet, .hljs-quote, .hljs-link, .hljs-number, .hljs-regexp, .hljs-literal {
    color: #6896ba;
  }

  .hljs-code, .hljs-selector-class {
    color: #a6e22e;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-keyword, .hljs-selector-tag, .hljs-section, .hljs-attribute, .hljs-name, .hljs-variable {
    color: #cb7832;
  }

  .hljs-params {
    color: #b9b9b9;
  }

  .hljs-string {
    color: #6a8759;
  }

  .hljs-subst, .hljs-type, .hljs-built_in, .hljs-builtin-name, .hljs-symbol, .hljs-selector-id, .hljs-selector-attr, .hljs-selector-pseudo, .hljs-template-tag, .hljs-template-variable, .hljs-addition {
    color: #e0c46c;
  }

  .hljs-comment, .hljs-deletion, .hljs-meta {
    color: #7f7f7f;
  }

`

const ContentImage: React.FC<{ alt: string, postId: string, src: string }> = (props) => {
  return (
    <Img src={require(`./../../../_posts/${props.postId}${props.src.replace("...image_base...", "")}`).default.src}
           alt={props.alt}
           style={{ width: "100%", height: "auto", marginTop: 15 }}
    />
  )
}

const Img = styled.img``

const InlineCode = styled.code`
  padding: 2px 5px;
  background-color: #00000040;
  border-radius: 4px;
`

export default PostPage
