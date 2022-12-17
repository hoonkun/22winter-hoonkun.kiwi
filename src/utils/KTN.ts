declare global {
  interface Array<T> {
    random(): T
    let<R>(block: (it: T[]) => R): R
    also(block: (it: T[]) => unknown): T[]
  }
  interface Object {
    let<R>(block: (it: this) => R): R
    also(block: (it: this) => unknown): this
  }
}

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.let = function <R>(block: (it: any) => any) {
  return block(this)
}

Array.prototype.also = function (block: (it: any) => unknown) {
  block(this);
  return this;
}

Object.defineProperty(Object.prototype, "let", {
  value: function <R>(block: (it: any) => R): R { return block(this) },
  writable: true, configurable: false, enumerable: false
});

Object.defineProperty(Object.prototype, "also", {
  value: function(block: (it: any) => unknown) { block(this); return this; },
  writable: true, configurable: false, enumerable: false
})

export const ArrayK = <T>(length: number, mapper: (index: number) => T): T[] => Array(length).fill(undefined).map((_, index) => mapper(index))

export const EmptyFunction: (...any: any[]) => any = () => {}
