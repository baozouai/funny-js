/*
 * @Description: 从0实现完整Promise 阶段一
 * @Author: Moriaty
 * @Date: 2020-09-17 08:52:38
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-17 13:20:42
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
    // 如果传入不是函数，则将值往下传
    resolveFn = typeof resolveFn === 'function' ? resolveFn : value => value;
    rejectFn = typeof rejectFn === 'function' ? rejectFn : reason => new Error(reason);
    // ①收集依赖
    this._resolveQueue.push(resolveFn);
    this._rejectQueue.push(rejectFn);
  }
}
// ------------------------------------------------
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('test');
  }, 5000);
}).then(console.log)
// ------------------------------------------------
const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('test');
  }, 5000);
})
p1.then(console.log);
// ------------------------------------------------