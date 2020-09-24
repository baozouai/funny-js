/*
 * @Description: 深拷贝
 * @Author: Moriaty
 * @Date: 2020-09-21 22:31:52
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-24 09:19:06
 */
/**
 * @description: 版本1
 */
function structualClone(obj) {
  return new Promise(resolve => {
    const {
      port1,
      port2
    } = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  })
};
const obj = {
  a: 1,
  b: {
    c: 2,
  }
};
obj.b.d = obj.b;
const test = async (obj) => {
  const clone = await structualClone(obj);
  console.log(clone);
}
test(obj);
/**
 * @description: 版本2
 */
function deepClone1(obj) {
  function isObject(obj) {
    return obj !== null && ['object', 'function'].includes(typeof obj);
  }
  if (!isObject(obj)) {
    throw new TypeError('obj must be an object!');
  }
  const newObject = Array.isArray(obj) ? [...obj] : { ...obj };
  Reflect.ownKeys(newObject).forEach(key => {
    newObject[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
  })
  return newObject;
};

const obj1 = {
  a: 1,
  b: {
    c: 2,
    d: [1, 2, 3, {e: 4, r: 5}],
    t: {r: {w: 1, g: ['a', 'r']}}
  }
};

let a = deepClone(obj1);
console.log(a);
a.b = 2;
console.log(a)
console.log(obj1);