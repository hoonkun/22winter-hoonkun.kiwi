const createArrayWithLength = <T>(length: number, mapper: (index: number) => T) => new Array(length).fill(undefined).map<T>((_, index) => mapper(index)) as T[]

const getRandomItem = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)]

export const Arrays = () => ({
  create: createArrayWithLength,
  random: getRandomItem
})
