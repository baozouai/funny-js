/*
 * @Description: 模拟const window只在浏览器环境
 * @Author: Moriaty
 * @Date: 2020-09-23 22:19:23
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-10-09 23:38:12
 */
function _const(prop, value) {
  const desc = {
    configurable: false,
    writtable: false,
    enumerable: false,
    get() {
      return value;
    },
    set() {
      throw new TypeError('Assignment to constant variable');
    },
  }
  Object.defineProperty(global, prop, desc);
}

_const('obj', {a: 1})
console.log(obj)
_const('a', 1);
console.log(a)
obj.a = 2;
console.log(obj)

obj = 3;
