declare global {
  interface Array<T> {
    random(): T
    chucked(size: number): T[]
    chunked<R>(size: number, transform: (it: T[]) => R): R[]
    count(predicate: (it: T) => boolean): number
    distinct(): T[]
    get isEmpty(): boolean
    get lastIndex(): number
  }
  interface Number {
    coerceAtLeast(this: number, minimumValue: number): number
    coerceAtMost(this: number, maximumValue: number): number
    coerceIn(this: number, minimumValue: number, maximumValue: number): number
    get absolute(): number
    get floor(): number
  }
  interface Object {
    let<T, R>(this: T, block: (it: T) => R): R
    also<T>(this: T, block: (it: T) => unknown | void): T
    takeIf<T>(this: T, block: (it: T) => boolean): T | null
    takeUnless<T>(this: T, block: (it: T) => boolean): T | null
    pick<T, P extends keyof T>(this: T, ...keys: P[]): Pick<T, P>
  }
}

const safeDefineProperty = (obj: any, p:  PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => {
  if (obj.hasOwnProperty(p)) return;
  Object.defineProperty(obj, p, attributes);
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

Array.prototype.chunked = function <R>(size: number, transform?: (it: any[]) => R) {
  const result: (R | any)[] = []
  const buffer: any[] = []
  for (let i = 0; i < this.length; i++) {
    buffer.push(this[i])
    if (buffer.length !== size) continue
    result.push(transform ? transform(buffer) : buffer)
    buffer.splice(0, size)
  }
  return result
}

Number.prototype.coerceAtLeast = function (minimumValue) {
  return Math.max(this, minimumValue)
}

Number.prototype.coerceAtMost = function (maximumValue) {
  return Math.min(this, maximumValue)
}

Number.prototype.coerceIn = function (minimumValue, maximumValue) {
  return Math.min(Math.max(this, minimumValue), maximumValue)
}

safeDefineProperty(Number.prototype, "absolute", {
  configurable: false, enumerable: false,
  get: function () { return Math.abs(this) }
})

safeDefineProperty(Number.prototype, "floor", {
  configurable: false, enumerable: false,
  get: function () { return Math.floor(this) }
})

Array.prototype.count = function <T extends Array<T>>(this: T, predicate: (it: T) => boolean) {
  return this.filter(predicate).length
}

Array.prototype.distinct = function () {
  return Array.from(new Set(this));
}

safeDefineProperty(Array.prototype, "isEmpty", {
  configurable: false, enumerable: false,
  get: function () { return this.length === 0 }
})

safeDefineProperty(Array.prototype, "lastIndex", {
  configurable: false, enumerable: false,
  get: function () { return this.length - 1 }
})

safeDefineProperty(Object.prototype, "let", {
  value: function <R>(block: (it: any) => R): R { return block(this) },
  writable: false, configurable: false, enumerable: false
});

safeDefineProperty(Object.prototype, "also", {
  value: function(block: (it: any) => unknown) { block(this); return this; },
  writable: false, configurable: false, enumerable: false
})

safeDefineProperty(Object.prototype, "takeIf", {
  value: function(block: (it: any) => boolean) { return block(this) ? this : null; },
  writable: false, configurable: false, enumerable: false
})

safeDefineProperty(Object.prototype, "takeUnless", {
  value: function(block: (it: any) => boolean) { return block(this) ? null : this; },
  writable: false, configurable: false, enumerable: false
})

safeDefineProperty(Object.prototype, "pick", {
  value: function(...keys: any[]) {
    const result: any = { };
    keys.forEach(it => result[it] = this[it]);
    return result;
  },
  writable: false, configurable: false, enumerable: false
})

export const ArrayK = <T>(length: number, mapper: (index: number) => T): T[] => Array(length).fill(undefined).map((_, index) => mapper(index))

export const EmptyFunction: (...any: any[]) => any = () => {}
