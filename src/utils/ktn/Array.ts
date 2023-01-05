import { definePropertyIfNotExists } from "./_base";

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.let = function <R>(block: (it: any) => any) {
  return block(this)
}

Array.prototype.also = function (block: (it: any) => unknown) {
  block(this)
  return this
}

Array.prototype.chunked = function <R>(size: number, transform?: (it: any[]) => R) {
  const result: (R | any)[] = []
  const buffer: any[] = []
  for (let i = 0; i < this.length; i++) {
    buffer.push(this[i])
    if (buffer.length !== size) continue
    result.push(transform ? transform([...buffer]) : [...buffer])
    buffer.splice(0, size)
  }
  return result
}

Array.prototype.max = function (this: number[]) {
  return Math.max(...this)
}

Array.prototype.min = function (this: number[]) {
  return Math.min(...this)
}

Array.prototype.sum = function (this: number[]) {
  return this.reduce((p, c) => p + c, 0)
}

Array.prototype.average = function (this: number[]) {
  return this.sum() / this.length
}

Array.prototype.onEach = function (block) {
  this.forEach(block)
  return this
}

Array.prototype.partition = function (predicate) {
  return ([[], []] as [any[], any[]]).also(result => this.forEach(it => result[predicate(it) ? 0 : 1].push(it)))
}

Array.prototype.remove = function (element) {
  return [...this].also(result => result.splice(result.indexOf(element), 1))
}

Array.prototype.removeAt = function (index) {
  return [...this].also(result => result.splice(index, 1))
}

Array.prototype.shuffle = function () {
  return this.sort(() => Math.random() - Math.random())
}

Array.prototype.count = function <T extends Array<T>>(this: T, predicate: (it: T) => boolean) {
  return this.filter(predicate).length
}

Array.prototype.distinct = function () {
  return Array.from(new Set(this));
}

Array.prototype.associate = function <T, R>(this: T[], transform: (it: T) => R) {
  const result: Map<T, R> = new Map<T, R>()
  this.forEach(each => result.set(each, transform(each)))
  return result
}

definePropertyIfNotExists(Array.prototype, "isEmpty", {
  configurable: false, enumerable: false,
  get: function () { return this.length === 0 }
})

definePropertyIfNotExists(Array.prototype, "lastIndex", {
  configurable: false, enumerable: false,
  get: function () { return this.length - 1 }
})

export const ArrayK = <T>(length: number, mapper: (index: number) => T): T[] => Array(length).fill(undefined).map((_, index) => mapper(index))
