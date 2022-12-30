import fs from "fs";
import matter from 'gray-matter';

import config from "../config";
import { ArrayK } from "./KTN";
import { Categories, Category } from "./Categories";

export type PostMetadata = {
  title: string
  date: string
  author: string
  categories: string[]
  expand?: { max_columns: number, max_rows: number }
}

export type RawPost = {
  key: string
  data: PostMetadata
  excerpt: string
  category: [Category, Category | undefined]
}

export type Post = RawPost & { expand?: { columns: number, rows: number } }

export type PostWithContent = Post & { content: string }

export class Posts {

  private static get queryset() {
    return fs.readdirSync("./_posts")
      .filter(it => !it.startsWith("_"))
      .reverse()
  }

  static get total() {
    return Posts.queryset.length
  }

  static list(page?: number, expand?: boolean): Post[] {
    if (page === 0) throw Error("invalid page: 0. page must be bigger than zero.")

    return Posts.queryset
      .let(it => page ? it.slice((page - 1) * config.blog.page_size, page * config.blog.page_size) : it)
      .map(key => Posts.retrieve<RawPost>(key))
      .let(it => expand ? Posts.withExpand(it) : it)
  }

  private static withExpand(posts: RawPost[]): Post[] {
    const GridColumns = 3
    const GridRows = (1024 / GridColumns).ceil
    const grid = ArrayK(1024, () => false).chunked(GridColumns)
    let index = 0
    const postsMapper = (post: RawPost): Post => {
      let x = index % GridColumns
      let y = (index / GridColumns).floor

      while (grid[y][x]) {
        index++
        x = index % GridColumns
        y = (index / GridColumns).floor
      }

      grid[y][x] = true

      if (index === 0) {
        grid[y+1][x] = grid[y][x+1] = grid[y+1][x+1] = true
        return ({ ...post, expand: { columns: 2, rows: 2 } })
      }

      if (!post.data.expand)
        return post

      const { max_columns, max_rows } = post.data.expand

      let columns = 1, rows = 1

      while (x + columns <= GridColumns && !grid[y][x + columns] && columns < max_columns) { columns++ }
      if (x + columns > GridColumns) columns--

      while (y + rows <= GridRows && !grid[y + rows][x + columns] && rows < max_rows) { rows++ }
      if (y + rows > GridRows) rows--

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          grid[y + j][x + i] = true
        }
      }

      return ({ ...post, expand: { columns, rows } })
    }
    return posts.map(postsMapper)
  }

  static retrieve<T extends RawPost>(key: string, content: boolean = false): T {
    const categories = Categories.list()

    return fs.readFileSync(`./_posts/${key}/_post.markdown`, { encoding: "utf8" })
      .let(it => matter(it, { excerpt: true, excerpt_separator: config.blog.excerpt_separator }))
      .let(it => content ? it.pick("data", "excerpt", "content") : it.pick("data", "excerpt"))
      .also(it => it.data = it.data.pick("title", "date", "author", "categories", "expand"))
      .let(it => ({ ...it, excerpt: it.excerpt?.replace(/^> .+$/gm, ""), key }) as T)
      .let(it => ({ ...it, category: [categories.find(category => it.data.categories[0] === category.name), categories.find(category => it.data.categories[1] === category.name)] }))
  }

  static next(key: string): Post | null {
    return Posts.queryset[Posts.queryset.findIndex(it => it === key) - 1]
      .let(it => it ? Posts.retrieve(it) : null)
  }

  static previous(key: string): Post | null {
    return Posts.queryset[Posts.queryset.findIndex(it => it === key) + 1]
      .let(it => it ? Posts.retrieve(it) : null)
  }

  static related(key: string, name: string) {
    return Posts.list()
      .filter(it => it.key !== key && it.category[0].name === name).slice(0, 2)
  }

}
