/*
 * @Description: 
 * @Author: Moriaty
 * @Date: 2020-09-21 13:08:38
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-22 21:59:41
 */
Function.prototype.myBind = function (thisArg, ...args) {
  const self = this;
  if (typeof self !== 'function') {
    throw new TypeError('bind must be call on a function');
  }
  const fbound = function () {
    /**
     * bind return的function有两种形式
     * ①：new，则this instanceof self
     * ②：普通调用，则apply第一个参数为myBind的第一个参数thisArg
     */
    const params = args.concat(...arguments);
    if (this instanceof self) {
      return new self(...params);
    }
    self.apply(thisArg, args.concat(...arguments));
  }
  if (self.prototype !== undefined) {
    // Object.create(undefined) 会报错
    fbound.prototype = Object.create(self.prototype);
    fbound.prototype.constructor = fbound;
  }
  return fbound;
}

const foo = {
  name: 'foo',
};

function test() {
  console.log(this.name);
  console.log(...arguments);
}
debugger
test.prototype.name = 'test';
const bound = test.myBind(foo, 'a', 'b', 'c');
// 普通调用
bound('d', 'e');
// new 对象
const boundInstance = new bound('D', 'E');
console.log(boundInstance);
console.log(boundInstance instanceof test)