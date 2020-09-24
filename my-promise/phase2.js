/*
 * @Description: 从0实现完整Promise 阶段二： 增加了then链式调用
 * @Author: Moriaty
 * @Date: 2020-09-17 08:52:38
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-17 14:22:51
 */
const Constants = require('./constants');

const {
  PENDING,
  FULL_FILLED,
  REJECTED,
} = Constants;
/**
 * @description: Promise本质上是一个状态机，当扭转状态后状态就不可改变
 *                采用了“观察者”设计模式，即：①收集依赖 -> ②触发通知 -> ③取出依赖执行
 */
class MyPromise {
  constructor(executor) {
    // 初始状态为PENDING 以为这还没做出“承诺”
    this._status = PENDING;
    // 成功回调队列
    this._resolveQueue = [];
    // 失败回调队列
    this._rejectQueue = [];
    executor(this._resolve.bind(this), this._reject.bind(this));
  }
  // ②触发通知
  _resolve(val) {
    debugger
    if (this._status !== PENDING) return;
    this._status = FULL_FILLED;
    this.flush(val, this._resolveQueue);
  }
  // ②触发通知
  _reject(reason) {
    if (this._status !== PENDING) return;
    this._status = REJECTED;
    this.flush(reason, this._rejectQueue);
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
    // 为了链式调用，要返回一个promise
    return new MyPromise((resolve, reject) => {
      // 将resolve，reject 包装一下，为了能够获取回调返回值来分类讨论
      const fullFillFn = val => {
        try {
          const x = resolveFn(val);
          // 如果回调返回值为promise继续执行then，否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      }
      // 再放入队列
      this._resolveQueue.push(fullFillFn);
      // reject同理
      const rejectedFn = error => {
        try {
          const x = rejectFn(error);
          x instanceof MyPromise ? x.then(resolve, reject) : reject(x);
        } catch (error) {
          reject(error)
        }
      }
      this._rejectQueue.push(rejectedFn);
    })
  }
}

const p = new MyPromise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 500);
  })
  .then(res => {
    console.log(res);
    return 2;
  })
  .then(res => {
    console.log(res);
    return 3;
  })
  .then(res => {
    console.log(res);
  })

  const p1 = new MyPromise(resolve => {
    setTimeout(() => {
      resolve(11);
    }, 500);
  });
  p1.then(res => {
    console.log(res);
    return 21;
  })
  .then(res => {
    console.log(res);
    return 31;
  })
  .then(res => {
    console.log(res);
  })