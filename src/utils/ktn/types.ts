declare global {
  interface Object {
    let<T, R>(this: T, block: (it: T) => R): R
    also<T>(this: T, block: (it: T) => unknown | void): T
    takeIf<T>(this: T, block: (it: T) => boolean): T | null
    takeUnless<T>(this: T, block: (it: T) => boolean): T | null
    pick<T, P extends keyof T>(this: T, ...keys: P[]): Pick<T, P>
    omit<T, P extends keyof T>(this: T, ...keys: P[]): Omit<T, P>
  }
  interface Array<T> {
    random(): T
    chunked(size: number): T[][]
    chunked<R>(size: number, transform: (it: T[]) => R): R[]
    count(predicate: (it: T) => boolean): number
    distinct(): T[]
    sum(this: number[]): number
    max(this: number[]): number
    min(this: number[]): number
    average(this: number[]): number
    groupBy<K extends string>(keySelector: (it: T) => K): Record<K, T[]>
    onEach(block: (it: T, index: number, array: T[]) => void | unknown): T[]
    partition(predicate: (it: T) => boolean): [T[], T[]]
    remove(element: T): T[]
    removeAt(index: number): T[]
    shuffle(): T[]
    associate<T, R>(this: T[], transform: (it: T) => R): Map<T, R>
    get isEmpty(): boolean
    get lastIndex(): number
  }
  interface ReadonlyArray<T> {
    random(): T
    random(): T
    chunked(size: number): T[][]
    chunked<R>(size: number, transform: (it: T[]) => R): R[]
    count(predicate: (it: T) => boolean): number
    distinct(): T[]
    sum(this: number[]): number
    max(this: number[]): number
    min(this: number[]): number
    average(this: number[]): number
    groupBy<K extends string>(keySelector: (it: T) => K): Record<K, T[]>
    onEach(block: (it: T, index: number, array: T[]) => void | unknown): T[]
    partition(predicate: (it: T) => boolean): [T[], T[]]
    remove(element: T): T[]
    removeAt(index: number): T[]
    shuffle(): T[]
    associate<T, R>(this: T[], transform: (it: T) => R): Map<T, R>
    get isEmpty(): boolean
    get lastIndex(): number
  }
  interface Number {
    coerceAtLeast(this: number, minimumValue: number): number
    coerceAtMost(this: number, maximumValue: number): number
    coerceIn(this: number, minimumValue: number, maximumValue: number): number
    get absolute(): number
    get floor(): number
    get ceil(): number
  }
}

export {}
