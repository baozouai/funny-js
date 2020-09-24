/*
 * @Description: 模拟new的实现
 * @Author: Moriaty
 * @Date: 2020-09-24 09:00:35
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-24 09:44:46
 */
function myNew(foo, ...args) {
  if (typeof foo !== 'function') {
    throw new TypeError('constructor must be function!');
  }
  // ① 创建新对象，并集成构造函数原型对象上的属性和方法
  const obj = Object.create(foo.prototype);
  // ② 指定构造函数中this为obj，并获取返回结果
  const result = foo.apply(obj, args);
  // ③ result如果为对象，则返回result，否则返回obj
  return Object.prototype.toString.call(result) === '[object Object]' ? result : obj;
}

// 测试
function foo(name) {
  this.name = name;
}
foo.prototype.getName = function() {
  console.log(this.name);
}
function foo1(name) {
  this.name = name;
  return {
    name: 'return obj',
  };
}
foo1.prototype.getName = function() {
  console.log(this.name);
}
const obj = myNew(foo, 'foo');
const obj1 = myNew(foo1, 'foo1');
console.log(obj);
console.log(obj instanceof foo)
obj.getName();
console.log(obj1);
console.log(obj1 instanceof foo1)

// 这类没有getName
obj1.getName();