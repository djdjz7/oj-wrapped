export class DefaultMap<K extends string | number | symbol, V> {
  [key: string | number | symbol]: any
  private map: Map<K, V>
  private defaultFactory: (key: K) => V

  constructor(defaultFactory: (key: K) => V, entries?: Iterable<readonly [K, V]>) {
    this.defaultFactory = defaultFactory
    this.map = new Map<K, V>(entries)

    return new Proxy(this, {
      get: (target, prop: string | symbol) => {
        if (prop in target) {
          return (target as any)[prop]
        }
        return target.get(prop as K)
      },

      set: (target, prop: string | symbol, value) => {
        if (prop in target && typeof (target as any)[prop] !== "function") {
          ;(target as any)[prop] = value
          return true
        }
        target.set(prop as K, value)
        return true
      },

      // for Object.entries, ...
      ownKeys: (target) => {
        return [...target.map.keys()].map((key) => String(key))
      },

      getOwnPropertyDescriptor: (target, prop) => {
        if (typeof prop === "string" && target.map.has(prop as any)) {
          return {
            value: target.get(prop as any),
            enumerable: true,
            configurable: true,
            writable: true,
          }
        }
        return undefined
      },
    })
  }

  get(key: K): V {
    if (!this.map.has(key)) {
      const defaultValue = this.defaultFactory(key)
      this.map.set(key, defaultValue)
      return defaultValue
    }
    return this.map.get(key)!
  }

  set(key: K, value: V): this {
    this.map.set(key, value)
    return this
  }

  has(key: K): boolean {
    return this.map.has(key)
  }

  get size(): number {
    return this.map.size
  }

  keys(): IterableIterator<K> {
    return this.map.keys()
  }

  values(): IterableIterator<V> {
    return this.map.values()
  }

  entries(): IterableIterator<[K, V]> {
    return this.map.entries()
  }

  toJSON(): Record<string, V> {
    const obj: Record<string, V> = {} as Record<string, V>
    this.map.forEach((value, key) => {
      obj[String(key)] = value
    })
    return obj
  }
}

export class Linq {
  static max = <T>(arr: T[], key: (_: T) => number) => {
    let cur_max: undefined | T = undefined
    let cur_max_value: undefined | number = undefined
    for (const item of arr) {
      const value = key(item)
      if (cur_max_value === undefined || value > cur_max_value) {
        cur_max = item
        cur_max_value = value
      }
    }
    return cur_max
  }
}
