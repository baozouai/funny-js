
function isIterable(array) {
  if ([undefined, null].includes(array) || !array[Symbol.iterator]) {
    return false
  }

  return true
}

function resolvePromise(newPromise, x, resolve, reject) {
  if (newPromise === x) return reject(new TypeError('[TypeError: chaining cycle detected for promise #<MyPromise>]'))

  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {

    let called
    try {
      const { then } = x
      if (typeof then === 'function') {
        then.call(x, (value) => {
          if (called) return 
          called = true
          resolvePromise(newPromise, value, resolve, reject)
        }, error => {
          if (called) return 
          called = true
          reject(error)
        })
      } else {
        resolve(x)
      }
    } catch (error) {
      if (called) return 
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}

module.exports = {
  resolvePromise,
  isIterable,
}