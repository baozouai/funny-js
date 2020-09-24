/*
 * @Description: 
 * @Author: Moriaty
 * @Date: 2020-09-21 20:56:22
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-21 21:07:37
 */
Function.prototype.myCall = function(thisArg = window) {
  if (typeof this !== 'function') {
    throw new TypeError("call must be call by a function");
  }
  // 用Symbol声明一个唯一对象，防止被覆盖
  const fn = Symbol('fn');
  // 获取额外参数
  const args = [...arguments].slice(1);
  // 将this绑定到thisArg[fn]上，即this指向调用函数所在对象
  thisArg[fn] = this;
  // 获取结果
  const result = thisArg[fn](...args);
  // 删除属性
  delete thisArg[fn];
  // 返回结果
  return result;
}

function foo() {
  console.log(this.name);
  return [...arguments];
}

const test = {
  name: 'test',
};

console.log(foo.call(test, 'a', 'b', 'c'));
console.log(foo.myCall(test, 'a', 'b', 'c'));