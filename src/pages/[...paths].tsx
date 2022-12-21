import Home from "./index";
import { GetStaticPaths, GetStaticProps } from "next";
import { Post, Posts } from "../utils/Posts";
import config from "../config";
import { ArrayK } from "../utils/KTN";

export default Home;

export type HomeStaticProps = {
  posts: Post[]
  page: number
}

export const getStaticProps: GetStaticProps = context => {
  const page = parseInt(context.params?.paths?.[1] ?? "1");
  return { props: { posts: Posts.list(page), page: page } }
}

export const getStaticPaths: GetStaticPaths = () => {
  const pages = Math.ceil(Posts.total / config.blog.page_size)

  return {
    paths: ArrayK(pages, it => it + 1).map(it => ({ params: { paths: ["page", `${it}`] } })),
    fallback: false
  }
}
