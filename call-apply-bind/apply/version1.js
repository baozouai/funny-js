/*
 * @Description: 
 * @Author: Moriaty
 * @Date: 2020-09-21 21:08:30
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-24 08:22:01
 */
Function.prototype.myApply = function (thisArg = window) {
  if (typeof this !== 'function') {
    throw new TypeError("apply must be call by a function");
  }
  // Symbol声明一个唯一对象，防止被覆盖
  const fn = Symbol('fn');
  // 获取额外参数
  const args = arguments[1];
  // 将this绑定到thisArg[fn]
  thisArg[fn] = this;
  // 获取结果
  let result;
  if (Array.isArray(args)) {
    result = thisArg[fn](...args);
  } else {
    result = thisArg[fn]();
  }
  // 解绑属性
  delete thisArg[fn];
  // 返回结果
  return result;
}

function foo() {
  console.log(this.name);
  return [...arguments];
}
foo.prototype.name = 'foo';
const test = {
  name: 'test',
};

console.log(foo.apply(test, [1, 2, 3]));
console.log(foo.myApply(test, [1, 2, 3]));