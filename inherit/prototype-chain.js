/*
 * @Description: 原型链继承
 * @Author: Moriaty
 * @Date: 2020-09-24 10:58:57
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-24 13:58:16
 */

 function Parent() {
   this.name = 'super';
   this.colors = ['red', 'blue']
 }

 Parent.prototype.getName = function () {
   return this.name;
 }

 function Child() {
   this.name = 'name';
 }
 Child.prototype = new Parent();
 Child.prototype.constructor = Child;
 const parent = new Parent();
console.log(parent.colors);
 const child1 = new Child();
 const child2 = new Child();
 console.log(child1.getName());
 console.log(child2.getName());
// 缺点： 多个实例对引用类型的修改会影响所有Child实例
 child1.colors.push('pink');
 console.log('----------------------------------------------------------------------------------------------')
 console.log(child1.colors);
 console.log(child2.colors);
 console.log(parent.colors);

 console.log('----------------------------------------------------------------------------------------------')

console.log(parent);
console.log(child1);
console.log(child2)