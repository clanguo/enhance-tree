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
