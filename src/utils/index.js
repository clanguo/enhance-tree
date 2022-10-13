export function throttle(callback, duration = 2000) {
  let timer = undefined
  return function (...args) {
    if (timer) return
    let result = callback.call(this, ...args)
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = undefined
    }, duration)
    return result
  }
}

const config = {}

Object.defineProperty(config, '__DEV__', {
  get() {
    return !!window.GLOBAL_CONFIG.development
  }
})

export const CONFIG = config
