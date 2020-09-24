/*
 * @Description: 模拟const window只在浏览器环境
 * @Author: Moriaty
 * @Date: 2020-09-23 22:19:23
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-23 22:26:01
 */
function _const(key, value) {
  const desc = {
    value,
    writtable: false,
  }
  Object.defineProperty(window, key, value);
}

_const('obj', {a: 1})
obj.a = 2;
obj = 3;
console.log(obj);