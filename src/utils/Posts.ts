import fs from "fs";
import matter from 'gray-matter';

import config from "../config";

export type PostMetadata = { title: string, date: string, author: string, categories: string[] }

export type Post = {
  key: string
  data: PostMetadata
  excerpt: string
}

export type PostWithContent = Post & { content: string }

export class Posts {

  static get total() {
    const dir = fs.readdirSync("./_posts")
    return dir.length
  }

  static list(page?: number): Post[] {
    if (page === 0) throw Error("invalid page: 0. page must be bigger than zero.")

    return fs.readdirSync("./_posts")
      .reverse()
      .let(it => page ? it.slice((page - 1) * config.blog.page_size, page * config.blog.page_size) : it)
      .map(key =>
        fs.readFileSync(`./_posts/${key}/_post.markdown`, { encoding: "utf8" })
          .let(it => matter(it, { excerpt: true, excerpt_separator: config.blog.excerpt_separator }))
          .pick("data", "excerpt")
          .also(it => it.data = it.data.pick("title", "date", "author", "categories"))
          .let(it => ({ ...it, key }) as Post)
      )
  }

  static retrieve(key: string): PostWithContent {
    return fs.readFileSync(`./_posts/${key}/_post.markdown`)
      .let(it => matter(it, { excerpt: true, excerpt_separator: config.blog.excerpt_separator }))
      .pick("data", "excerpt", "content")
      .also(it => it.data = it.data.pick("title", "date", "author", "categories"))
      .let(it => ({ ...it, key }) as PostWithContent)
  }

}
