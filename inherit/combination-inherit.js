/*
 * @Description: 组合式继承
 * @Author: Moriaty
 * @Date: 2020-09-24 16:37:40
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-24 16:48:18
 */
function Parent(name) {
  this.name = name;
  this.colors = ['blue', 'red'];
}
Parent.prototype.getName = function () {
  return this.name;
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
// 缺点还是原型中存在两份相同的属性/方法，子实例一份，child.__proto__(new Parent())即也有一份
Child.prototype = new Parent();
Child.prototype.constructor = Child;

Child.prototype.getAge = function () {
  return this.age;
}

const child1 = new Child('child1', 12);
const child2 = new Child('child2', 22);

console.log(child1);
console.log(child2);

child1.colors.push('pink');

console.log(child1);
console.log(child2);

console.log(child1 instanceof Parent);
console.log(child2 instanceof Parent);