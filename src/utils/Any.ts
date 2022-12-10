export const letIt = <T, R>(it: T, block: (it: T) => R): R => {
  return block(it)
}

export const also = <T>(it: T, block: (it: T) => void): T => {
  block(it)
  return it
}
