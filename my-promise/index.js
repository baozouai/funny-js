/*
 * @Description: 从0实现完整Promise 阶段五： 增加catch、finally、resolve、reject、all、race方法
 * @Author: Moriaty
 * @Date: 2020-09-20 08:23:42
 * @Last modified by: Moriaty
 * @LastEditTime: 2021-08-22 20:29:59
 */
const Constants = require('./constants');
const {
  resolvePromise,
  isIterable
} = require('./util')
const {
  PENDING,
  FULL_FILLED,
  REJECTED,
} = Constants;

class MyPromise {
  _value = undefined
  _status = PENDING
  _resolveQueue = []
  _rejectQueue = []

  constructor(executor) {

    const resolve = (value) => {
      if (this._status === PENDING) {
        this._status = FULL_FILLED
        this._value = value
        this._resolveQueue.forEach(cb => cb())
      }
    }
    const reject = (error) => {
      if (this._status === PENDING) {
        this._status = REJECTED
        this._value = error
        this._rejectQueue.forEach(cb => cb())
      }
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFullfilled, onRejected) {
    const newPromise = new MyPromise((resolve, reject) => {
      onFullfilled = typeof onFullfilled === 'function' ? onFullfilled: value => value
      onRejected = typeof onRejected === 'function' ? onRejected: error => { throw error }

      const fullfillFn = () => {
        queueMicrotask(() => {
          try {
            const x = onFullfilled(this._value)
            resolvePromise(newPromise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      const rejectFn = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this._value)
            resolvePromise(newPromise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      switch (this._status) {
        case FULL_FILLED:
          fullfillFn()
          break;
        case REJECTED:
          rejectFn()
          break;
        default:
          this._resolveQueue.push(fullfillFn)
          this._rejectQueue.push(rejectFn)
          break;
      }
    })

    return newPromise
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(callback) {
    return this.then(value => MyPromise.resolve(callback()).then(() => value), error => MyPromise.resolve(callback()).then(() => { throw error }))
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value

    return new MyPromise(resolve => resolve(value))
  }

  static reject(error) {
    return new MyPromise((_, reject) => reject(error))
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!isIterable(promises)) {
        const type = typeof promises
        const preReason =`${type === 'undefined' ? '': type} ${promises}` 
        return reject(new TypeError(`${preReason} is not iterable (cannot read property Symbol(Symbol.iterable))`))
      }
      if (!promises.length) return resolve([])
      const results = []
      const resultLength = 0

      promises.forEach((promise, index) =>  {
        MyPromise.resolve(promise).then(value => {
          results[index] = value
          resultLength++

          if (resultLength === promises.length)  {
            resolve(results)
          }
        }, reject)
      })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!isIterable(promises)) {
        const type = typeof promises
        const preReason =`${type === 'undefined' ? '': type} ${promises}` 
        return reject(new TypeError(`${preReason} is not iterable (cannot read property Symbol(Symbol.iterable))`))
      }
      if (!promises.length) return
      
      promises.forEach((promise) =>  {
        MyPromise.resolve(promise).then(resolve, reject)
      })
    })
  }
}


MyPromise.defer = MyPromise.deferred = function () {
  let defer = {}
  defer.promise = new MyPromise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}
try {
  module.exports = MyPromise
} catch (e) {}