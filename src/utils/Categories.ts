import fs from "fs"

export type Category = {
  name: string
  display: string
  parent?: string
  color: {
    dark: string
    bright: string
  }
}

export class Categories {

  static list() {
    return fs.readFileSync("./_posts/_categories.json", { encoding: "utf8" })
      .let(it => JSON.parse(it) as unknown as Category[])
  }

}
