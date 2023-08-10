export const throttle = <T extends (...args: any[]) => any>(fn: T, wait: number) => {
  let isThrottle = false
  let timeoutId: ReturnType<typeof setTimeout>
  let time: number
  return function (this: any, ...args: Parameters<T>) {
    const ctx = this
    if (!isThrottle) {
      fn.apply(ctx, args)
      time = Date.now()
      isThrottle = true
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (Date.now() - time >= wait) {
          fn.apply(ctx, args)
          time = Date.now()
        }
      }, Math.max(wait - (Date.now() - time), 0))
    }
  }
}
