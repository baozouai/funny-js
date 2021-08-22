/*
 * @Description: 从0实现完整Promise 阶段四： 兼容同步任务，将给resolve/reject的回调放入宏任务队列，即包个setTimeout
 * @Author: Moriaty
 * @Date: 2020-09-20 08:23:42
 * @Last modified by: Moriaty
 * @LastEditTime: 2021-08-22 12:32:00
 */
const Constants = require('./constants');
const { resolvePromise } = require('./util')
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
    executor(this._resolve.bind(this), this._reject.bind(this));
    console.log(`${this.count} 完成executor`)
  }
  // ②触发通知
  _resolve(val) {
    debugger
    const run = () => {
      if (this._status !== PENDING) return;
      this._value = val;
      console.log(`${this.count}开始resolve， this._value = ${this._value}`)
      this._status = FULL_FILLED;
      console.log(`${this.count}清空列表， this._resolveQueue队列有 ${this._resolveQueue.length} 个fn`);
      this.flush(val, this._resolveQueue);
    };
     run();
  }
  // ②触发通知
  _reject(reason) {
    const run = () => {
      if (this._status !== PENDING) return;
      this._value = reason;
      console.log(`${this.count}开始reject, this._value = ${this._value}`)
      this._status = REJECTED;
      console.log(`${this.count}清空列表， this._rejectQueue队列有 ${this._rejectQueue.length} 个fn`);
      this.flush(reason, this._rejectQueue);
    };
     run();
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
    let newPromise = new MyPromise((resolve, reject) => {
      debugger
      // 将resolve，reject 包装一下，为了能够获取回调返回值来分类讨论
      const fullFillFn = () => {
       queueMicrotask(() => {
        try {
          debugger
          console.log(`${this.count}准备执行resolveFn`)
          // 值传透：如果then的resolve不是function，则将值进一步传递，否则会出现链式调用中断
          resolveFn = typeof resolveFn === 'function' ? resolveFn: value => value;
          const x = resolveFn(this._value);
          console.log(`${this.count} resolveFn的值x = ${x}`)
          console.log(`${this.count} x是Promise吗 ？ ${x instanceof MyPromise ? '是，继续将(resolve, reject)放入x的then' : '否,直接resolve(x)'}`)
          // 如果回调返回值为promise继续执行then，等待状态变更，否则直接resolve
          resolvePromise(newPromise, x, resolve, reject)
        } catch (error) {
          reject(error);
        }
       })
      }
      // reject同理
      const rejectedFn = () => {
        try {
          debugger
          console.log(`${this.count}准备执行rejectFn`);
          // 值传透：如果then的reject不是function，则将值进一步传递，否则会出现链式调用中断
          rejectFn = typeof rejectFn === 'function' ? rejectFn: reason => {
            throw reason;
          };
          const x = rejectFn(this._value);
          console.log(`${this.count} rejectFn的x = ${x}`)
          console.log(`${this.count} x是Promise吗 ？ ${x instanceof MyPromise ? '是，继续将(resolve, reject)放入x的then' : '否,直接reject(x)'}`)
          resolvePromise(newPromise, x, resolve, reject)
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
          fullFillFn();
          break;
        case REJECTED:
          console.log(`${this.count}状态已变更为REJECTED 将this._value = ${this._value}放入rejectedFn执行`)
          rejectedFn();
          break;
      }
    })
    return newPromise
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