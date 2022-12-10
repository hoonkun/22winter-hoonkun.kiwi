import { uuid4 } from "./UUID";

type TimesInstance = {
  timeout?: NodeJS.Timeout
  type: "timeout" | "interval"
  promise: Promise<boolean>
  interruptFlag: "reject" | "return-false"
  resolver: (value: boolean) => void
  rejector: () => void
}
type PartialTimesInstance = Partial<TimesInstance>

export class TimesSkeleton {

  private _instances: { [key: string]: TimesInstance } = { }

  async sleep(ms: number, interruptFlag: "reject" | "return-false" = "return-false"): Promise<boolean> {
    const uuid = uuid4()
    const newInstance: PartialTimesInstance = {  }
    newInstance.promise = new Promise<boolean>((resolve, reject) => {
      newInstance.timeout = setTimeout(() => {
        resolve(true)
        delete this._instances[uuid]
      }, ms)
      newInstance.resolver = resolve
      newInstance.rejector = reject
    })
    newInstance.type = "timeout"
    newInstance.interruptFlag = interruptFlag
    this._instances[uuid] = newInstance as TimesInstance
    return this._instances[uuid].promise
  }

  interrupt() {
    Object.values(this._instances).forEach(it => {
      if (!it.timeout) return
      if (it.type === "timeout") clearTimeout(it.timeout)
      if (it.type === "interval") clearInterval(it.timeout)

      if (it.interruptFlag === "reject") it.rejector()
      else it.resolver(false)
    })
    this._instances = { }
  }

}

export const Times = () => new TimesSkeleton()
