/*
 * @Description: 借用构造函数继承
 * @Author: Moriaty
 * @Date: 2020-09-24 14:28:42
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-24 16:24:27
 */

 function Parent() {
   this.colors = ['blue', 'red'];
 }
 /**
  * 缺点：
  * ① 只继承了父类的属性，没继承方法
  * ② 每个子类实例都有父类实例的副本，无法实现复用
  * ③ 实际上Parent不是Child的父类 child1 instanceof Parent 为false
  */
 function Child(...args) {
   Parent.call(this, ...args);
 }

 const child1 = new Child();
 const child2 = new Child();
 console.log(child1);
 console.log(child2);
 child1.colors.push('pink');
 console.log(child1.colors);
 console.log(child2.colors);
 console.log(child1);
 console.log(child2);
 console.log(child1 instanceof Parent);
 console.log(child2 instanceof Parent);
 console.log(child1 instanceof Child);
 console.log(child2 instanceof Child);