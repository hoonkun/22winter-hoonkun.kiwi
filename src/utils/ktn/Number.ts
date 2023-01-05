import { definePropertyIfNotExists } from "./_base";

Number.prototype.coerceAtLeast = function (minimumValue) {
  return Math.max(this, minimumValue)
}

Number.prototype.coerceAtMost = function (maximumValue) {
  return Math.min(this, maximumValue)
}

Number.prototype.coerceIn = function (minimumValue, maximumValue) {
  return Math.min(Math.max(this, minimumValue), maximumValue)
}

definePropertyIfNotExists(Number.prototype, "absolute", {
  configurable: false, enumerable: false,
  get: function () { return Math.abs(this) }
})

definePropertyIfNotExists(Number.prototype, "floor", {
  configurable: false, enumerable: false,
  get: function () { return Math.floor(this) }
})

definePropertyIfNotExists(Number.prototype, "ceil", {
  configurable: false, enumerable: false,
  get: function () { return Math.ceil(this) }
})

export {}
