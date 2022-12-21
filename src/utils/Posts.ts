import fs from "fs";
import matter from 'gray-matter';

import config from "../config";

export type Post = {
  key: string
  data: { title: string, date: string, author: string, categories: string[] }
  excerpt: string
}

export type PostWithContent = Post & { content: string }

export class Posts {

  static get total() {
    const dir = fs.readdirSync("./_posts")
    return dir.length
  }

  static list(page: number) {
    if (page === 0) throw Error("invalid page: 0. page must be bigger than zero.")

    return fs.readdirSync("./_posts")
      .slice((page - 1) * config.blog.page_size, page * config.blog.page_size)
      .map(key =>
        fs.readFileSync(`./_posts/${key}/_post.markdown`, { encoding: "utf8" })
          .let(it => matter(it, { excerpt: true, excerpt_separator: config.blog.excerpt_separator }))
          .pick("data", "excerpt")
          .also(it => it.data = it.data.pick("title", "date", "author", "categories"))
          .let(it => ({ ...it, key }))
      )
  }

}
