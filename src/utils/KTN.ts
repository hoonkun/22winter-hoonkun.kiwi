declare global {
  interface Array<T> {
    random(): T
    get isEmpty(): boolean
    get lastIndex(): number
  }
  interface Object {
    let<T, R>(this: T, block: (it: T) => R): R
    also<T>(this: T, block: (it: T) => unknown | void): T
    takeIf<T>(this: T, block: (it: T) => boolean): T | null
    takeUnless<T>(this: T, block: (it: T) => boolean): T | null
  }
}

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

Object.defineProperty(Array.prototype, "isEmpty", {
  writable: true, configurable: false, enumerable: false,
  get: function () { return this.length === 0 }
})

Object.defineProperty(Array.prototype, "lastIndex", {
  writable: true, configurable: false, enumerable: false,
  get: function () { return this.length - 1 }
})

Object.defineProperty(Object.prototype, "let", {
  value: function <R>(block: (it: any) => R): R { return block(this) },
  writable: true, configurable: false, enumerable: false
});

Object.defineProperty(Object.prototype, "also", {
  value: function(block: (it: any) => unknown) { block(this); return this; },
  writable: true, configurable: false, enumerable: false
})

Object.defineProperty(Object.prototype, "takeIf", {
  value: function(block: (it: any) => boolean) { return block(this) ? this : null; },
  writable: true, configurable: false, enumerable: false
})

Object.defineProperty(Object.prototype, "takeUnless", {
  value: function(block: (it: any) => boolean) { return block(this) ? null : this; },
  writable: true, configurable: false, enumerable: false
})

export const ArrayK = <T>(length: number, mapper: (index: number) => T): T[] => Array(length).fill(undefined).map((_, index) => mapper(index))

export const EmptyFunction: (...any: any[]) => any = () => {}
