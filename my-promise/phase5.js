/*
 * @Description: 从0实现完整Promise 阶段四： 增加catch、finally、resolve、reject、all、race方法
 * @Author: Moriaty
 * @Date: 2020-09-20 08:23:42
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-22 17:41:06
 */
const Constants = require('./constants');

const {
  PENDING,
  FULL_FILLED,
  REJECTED,
} = Constants;
let count = 1;
/**
 * @description: Promise本质上是一个状态机，当扭转状态后状态就不可改变
 *                采用了“观察者”设计模式，即：①收集依赖 -> ②触发通知 -> ③取出依赖执行
 */
class MyPromise {
  constructor(executor) {
    // 初始状态为PENDING 意味着还没做出“承诺”
    this._status = PENDING;
    // 成功回调队列
    this._resolveQueue = [];
    // 失败回调队列
    this._rejectQueue = [];
    this.value = undefined;
    this.count = `【 promise ${count++} 】`;
    console.log(`${this.count}new 了`);
    debugger
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (e) {
      this._reject.bind(this, e);
    }
    console.log(`${this.count} 完成executor`)
  }
  // ②触发通知
  _resolve(val) {
    debugger
    if (this._status !== PENDING) return;
    const run = () => {
      this._value = val;
      console.log(`${this.count}开始resolve， this._value = ${this._value}`)
      this._status = FULL_FILLED;
      console.log(`${this.count}清空列表， this._resolveQueue队列有 ${this._resolveQueue.length} 个fn`);
      this.flush(val, this._resolveQueue);
    };
    /**
     *  为了让resolve的执行在then收集回调之后，将其放入宏任务队列
     *  不放入宏任务队列前(即不加setTimeout)，执行顺序：new Promise -> resolve/reject执行回调 -> then()收集回调
     *  加了之后，执行顺序：new Promise -> then()收集回调 -> resolve/reject执行回调
     */
    setTimeout(run);
  }
  // ②触发通知
  _reject(reason) {
    if (this._status !== PENDING) return;
    const run = () => {
      this._value = reason;
      console.log(`${this.count}开始reject, this._value = ${this._value}`)
      this._status = REJECTED;
      console.log(`${this.count}清空列表， this._rejectQueue队列有 ${this._rejectQueue.length} 个fn`);
      this.flush(reason, this._rejectQueue);
    };
    /**
     *  为了让reject的执行在then收集回调之后，将其放入宏任务队列
     *  不放入宏任务队列前(即不加setTimeout)，执行顺序：new Promise -> resolve/reject执行回调 -> then()收集回调
     *  加了之后，执行顺序：new Promise -> then()收集回调 -> resolve/reject执行回调
     */
    setTimeout(run);
  }
  // ③取出依赖执行
  flush(val, queue) {
    // 清空列表
    while (queue.length) {
      const fn = queue.shift();
      fn(val);
    }
  }
  then(resolveFn, rejectFn) {
    console.log(`${this.count}开始then`)
    debugger
    // 为了链式调用，要返回一个promise
    console.log(`${this.count}return 了【 promise ${count} 】`);
    let newPromise;
    return (newPromise = new MyPromise((resolve, reject) => {
      debugger
      // 将resolve，reject 包装一下，为了能够获取回调返回值来分类讨论
      const fullFillFn = val => {
        try {
          debugger
          console.log(`${this.count}准备执行resolveFn`)
          // 值传透：如果then的resolve不是function，则将值进一步传递，否则会出现链式调用中断
          resolveFn = typeof resolveFn === 'function' ? resolveFn : value => value;
          const x = resolveFn(val);
          if (x === newPromise) {
            throw new Error('then can not circular reference');
          }
          console.log(`${this.count} resolveFn的值x = ${x}`)
          console.log(`${this.count} x是Promise吗 ？ ${x instanceof MyPromise ? '是，继续将(resolve, reject)放入x的then' : '否,直接resolve(x)'}`)
          // 如果回调返回值为promise继续执行then，等待状态变更，否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      }
      // reject同理
      const rejectedFn = error => {
        try {
          debugger
          console.log(`${this.count}准备执行rejectFn`);
          // 值传透：如果then的reject不是function，则将值进一步传递，否则会出现链式调用中断
          rejectFn = typeof rejectFn === 'function' ? rejectFn : reason => {
            throw new Error(reason instanceof Error ? reason.message : reason);
          };
          const x = rejectFn(error);
          if (x === newPromise) {
            throw new Error('then can not circular reference');
          }
          console.log(`${this.count} rejectFn的x = ${x}`)
          console.log(`${this.count} x是Promise吗 ？ ${x instanceof MyPromise ? '是，继续将(resolve, reject)放入x的then' : '否,直接reject(x)'}`)
          x instanceof MyPromise ? x.then(resolve, reject) : reject(x);
        } catch (error) {
          reject(error)
        }
      }
      switch (this._status) {
        // 如果状态为等待，则将then回调push进resolve/reject执行队列中等待执行
        case PENDING:
          console.log(`${this.count} 开始将then回调push进resolve/reject执行队列中等待执行`)
          this._resolveQueue.push(fullFillFn);
          this._rejectQueue.push(rejectedFn);
          break;
          // 当状态已变更，直接执行回调
        case FULL_FILLED:
          console.log(`${this.count}状态已变更为FULL_FILLED 将this._value = ${this._value}放入fullFillFn执行`)
          fullFillFn(this._value);
          break;
        case REJECTED:
          console.log(`${this.count}状态已变更为REJECTED 将this._value = ${this._value}放入rejectedFn执行`)
          rejectedFn(this._value);
          break;
      }
    }))
  }
  // catch 方法返回一个promise，并处理拒绝的情况，与调用Promise.then(undefined, rejectFn)相同
  static
  catch (rejectFn) {
    return this.then(undefined, rejectFn);
  }
  /**
   * finally 返回一个promise，无论结果resolve或reject都会执行callback，
   * 在finally之后还可以继续then，并将只原封不动传给后面的then
   */
  static
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback).then(() => {
        throw reason
      })
    )
  }
  /**
   * 如果value为Promise,直接返回，否则返回一个Promise
   */
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise(resolve => resolve(value));
  }
  /**
   *  返回带有拒绝原因的Promise 
   */
  static reject(value) {
    return this.then((_, reject) => reject(value));
  }
  /**
   * promisesArr的每个结果放入result，当任何一个出错则直接reject
   */
  static all(promisesArr) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      promisesArr.forRach((promise, i) => {
        // MyPromise.resolve用于处理非Promise的情况
        MyPromise.resolve(promise).then(value => {
          result.push(value);
          if (i === promisesArr.length - 1) {
            resolve(result);
          }
        }, reject)
      })
    })
  }
  /**
   * 同时执行promiseArr，任何一个resolve或reject则返回结构
   */
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      promiseArr.forRach(promise => {
        MyPromise.resolve(promise).then(resolve, reject);
      })
    })
  }
}

const p = new MyPromise(resolve => {
    debugger
    resolve(1);
    console.log('p1')
  })
  // .then()
  .then(res => {
    debugger
    console.log(res);
    return 2;
  })
  .then(res => {
    debugger
    console.log(res);
    return 3;
  })
  .then(res => {
    debugger
    console.log(res);
  })


// const p1 = new MyPromise(resolve => {
//   debugger
//   setTimeout(() => {
//     debugger
//     resolve(11);
//   }, 500);
// });
// p1.
//   then(res => {
//     console.log(res);
//     return 21;
//   })
//   .then(res => {
//     console.log(res);
//     return 31;
//   })
//   .then(res => {
//     console.log(res);
//   })