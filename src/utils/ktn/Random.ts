export class Random {
  static range(minInclusive: number, maxExclusive: number): number {
    return minInclusive + Math.random() * (maxExclusive - minInclusive)
  }
  static possibility(): number {
    return Math.random()
  }
  static possible(possibility: number): boolean {
    return Math.random() < possibility
  }
}
