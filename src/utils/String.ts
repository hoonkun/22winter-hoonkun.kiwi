declare global {
  interface String {
    randomize(this: string, minimumValue: number, maximumValue: number): number
    get byteSize(): number
    truncateByteSize(length: number): string
  }
}

String.prototype.randomize = function (minimumValue, maximumValue) {
  const sum = this.split("").map(it => ((it.codePointAt(0) ?? 0) / 8).floor).sum()
  const diff = maximumValue - minimumValue
  return minimumValue + (sum * 2.183) % diff
}

String.prototype.truncateByteSize = function(length: number) {
  let result = ''
  let currentLength = 0
  for (const it of this.split("")) {
    if (it.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/)) currentLength += 2
    else currentLength += 1
    if (currentLength > length) return result
    result += it
  }
  return result;
}

const safeDefineProperty = (obj: any, p:  PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => {
  if (obj.hasOwnProperty(p)) return;
  Object.defineProperty(obj, p, attributes);
}

safeDefineProperty(String.prototype, "byteSize", {
  configurable: false, enumerable: false,
  get: function () { return (this as string).split("").map(it => it.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/) ? 2 : 1).sum() }
})

export {}
