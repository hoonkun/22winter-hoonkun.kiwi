const createArrayWithLength = <T>(length: number, mapper: (index: number) => T) => new Array(length).fill(undefined).map<T>((_, index) => mapper(index)) as T[]

export const Arrays = () => ({
  create: createArrayWithLength
})
