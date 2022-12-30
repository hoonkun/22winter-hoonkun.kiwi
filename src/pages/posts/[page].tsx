import { Post, Posts } from "../../utils/Posts";
import config from "../../config";
import { ArrayK } from "../../utils/KTN";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import PostsView, { PostPaginator } from "../../components/blog/PostsView";
import { useCallback, useEffect, useMemo, useState } from "react";
import Router from "next/router";
import { SplashView } from "../../components/SplashView";
import styled from "@emotion/styled";
import { Breakpoint, OverlayOverflow } from "../../../styles/globals";
import AsideView from "../../components/blog/AsideView";

export type PostsStaticProps = {
  posts: Post[]
  routedPage: number | null
  total: number
}

const PostsPage: NextPage<PostsStaticProps> = ({ posts, routedPage: page, total }) => {

  const [loading, setLoading] = useState(false)

  const next = useCallback(() => Router.push(`/posts/${(page ??  1) + 1}`), [page])
  const previous = useCallback(() => Router.push(`/posts/${(page ?? 1) - 1}`), [page])
  const navigate = useCallback((page: number) => Router.push(`/posts/${page}`), [])

  const paginator = useMemo<PostPaginator>(() => ({
    next, previous, navigate, maxPage: (total / config.blog.page_size).ceil, page: page ?? 1
  }), [next, previous, navigate, total, page])

  useEffect(() => {
    setLoading(false)
  }, [posts])

  return (
    <Root>
      <Container>
        <AsideView/>
        <PostsView posts={posts} paginator={paginator} requestSplash={setLoading}/>
      </Container>
      <SplashView active={loading}/>
    </Root>
  )
}

export const getStaticProps: GetStaticProps<PostsStaticProps> = context => {
  const page = parseInt(context.params?.page as string ?? "1");
  return { props: { posts: Posts.list(page), routedPage: page, total: Posts.total } }
}

export const getStaticPaths: GetStaticPaths = () => {
  const pages = Math.ceil(Posts.total / config.blog.page_size)

  return {
    paths: ArrayK(pages, it => it + 1).map(it => ({ params: { page: `${it}` } })),
    fallback: false
  }
}

const Root = styled.div`
  background-color: #252525;
  width: 100%;
  height: 100%;
  font-family: "IBM Plex Sans KR", sans-serif;
`

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  
  ${OverlayOverflow};
  overflow-x: hidden;
  overflow-y: auto;
  
  ${Breakpoint} {
    flex-direction: row;
    overflow: unset;
  }
`

export default PostsPage
