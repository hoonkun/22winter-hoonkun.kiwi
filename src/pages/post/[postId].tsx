import React, { createElement, Fragment, useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Post, Posts } from "../../utils/Posts";
import styled from "@emotion/styled";
import { unified } from "unified";
import rehypeReact from "rehype-react";
import remarkRehype from "remark-rehype";
import remarkParse from "remark-parse";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { Markdown } from "../../../styles/markdown";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import stringWidth from "string-width";
import remarkGfm from "remark-gfm";
import rehypeParse from "rehype-parse";

import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Highlighter from "react-syntax-highlighter"
import { Highlight } from "../../../styles/highlight";

// const Prism = dynamic<any>(() => import('react-syntax-highlighter').then(it => it.Prism))

type PostPageProps = {
  post: Post
  content: string
}

const PostPage: NextPage<PostPageProps> = pageProps => {

  const { post: { key }, content } = pageProps
  const [PostContent, setPostContent] = useState(<Fragment/>)

  useEffect(() => {
    if (!content) return

    unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeReact, { createElement, Fragment, components: {
          img: (props: any) => <ContentImage src={props.src} alt={props.alt} postId={key}/>,
          code: (props: any) => props.className ?
            <Highlighter language={props.className.replace("language-", "")} style={darcula}>{props.children}</Highlighter> :
            <InlineCode {...props}/>,
          pre: (props: any) => props.className === "important" ? <pre {...props}>{props.children}</pre> : <>{props.children}</>,
          a: (props: any) => props.href.startsWith("/") ?
            <Link href={props.href} scroll={false}><a>{props.children}</a></Link> :
            <a {...props}>{props.children}</a>
        } }
      )
      .process(content)
      .then(file => setPostContent(file.result))
  }, [content, key])


  return (
    <Root>
      {PostContent}
    </Root>
  )
}

export const getStaticProps: GetStaticProps<PostPageProps> = async context => {
  const post = Posts.retrieve(context.params!.postId as string)

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

  return { props: { post: Posts.retrieve(context.params!.postId as string).pick("key", "data", "excerpt"), content: result } }
}

export const getStaticPaths: GetStaticPaths = () => {
  const postIds = Posts.list().map(it => it.key)
  return { paths: postIds.map(it => ({ params: { postId: it } })), fallback: false }
}

const Root = styled.div`
  background-color: #323232;
  
  overflow: auto;
  height: 100%;
  
  ${Highlight};
  
  ${Markdown};
`

const ContentImage: React.FC<{ alt: string, postId: string, src: string }> = (props) => {
  return (
    <Image src={require(`./../../../_posts/${props.postId}${props.src.replace("...image_base...", "")}`)}
           alt={props.alt}
           style={{ width: "100%", height: "auto" }}
    />
  )
}

const InlineCode = styled.code`
  padding: 2px 5px;
  background-color: #00000040;
  border-radius: 4px;
`

export default PostPage
