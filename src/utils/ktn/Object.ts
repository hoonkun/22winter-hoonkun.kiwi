import { definePropertyIfNotExists } from "./_base";

definePropertyIfNotExists(Object.prototype, "let", {
  value: function <R>(block: (it: any) => R): R { return block(this) },
  writable: false, configurable: false, enumerable: false
});

definePropertyIfNotExists(Object.prototype, "also", {
  value: function(block: (it: any) => unknown) { block(this); return this; },
  writable: false, configurable: false, enumerable: false
})

definePropertyIfNotExists(Object.prototype, "takeIf", {
  value: function(block: (it: any) => boolean) { return block(this) ? this : null; },
  writable: false, configurable: false, enumerable: false
})

definePropertyIfNotExists(Object.prototype, "takeUnless", {
  value: function(block: (it: any) => boolean) { return block(this) ? null : this; },
  writable: false, configurable: false, enumerable: false
})

definePropertyIfNotExists(Object.prototype, "pick", {
  value: function(...keys: any[]) {
    const result: any = { };
    keys.forEach(it => this[it] ? result[it] = this[it] : undefined);
    return result;
  },
  writable: false, configurable: false, enumerable: false
})

definePropertyIfNotExists(Object.prototype, "omit", {
  value: function(...keys: any[]) {
    const pick = Object.keys(this).filter(it => !keys.includes(it))
    return this.pick(...pick);
  },
  writable: false, configurable: false, enumerable: false
})

export {}
