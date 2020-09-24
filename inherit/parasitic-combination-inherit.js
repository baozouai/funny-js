/*
 * @Description: 寄生组合继承
 * @Author: Moriaty
 * @Date: 2020-09-24 17:36:40
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-24 17:57:16
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

Child.prototype = Object.create(Parent.prototype);
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

console.log(child1 instanceof Child);
console.log(child2 instanceof Child);
console.log(child1 instanceof Parent);
console.log(child2 instanceof Parent);