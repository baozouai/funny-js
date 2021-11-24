/*
 * @Description: 深拷贝
 * @Author: Moriaty
 * @Date: 2020-09-21 22:31:52
 * @Last modified by: Moriaty
 * @LastEditTime: 2021-11-24 23:01:31
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
function deepClone(obj, cache = new Map()) {
  function isObject(data) {
    return data && typeof data === 'object';
  }

  if (isObject(obj)) {
    if (cache.has(obj)) return cache.get([obj]);

    const targetObject = Array.isArray(obj) ? []: {};
    cache.set(obj, targetObject);
    const propertyNames = Object.getOwnPropertyNames(obj);
    const propertySymbols = Object.getOwnPropertySymbols(obj);

    for (let key of [...propertyNames, ...propertySymbols]) {
      const value = obj[key];
      targetObject[key] = isObject(value) ? deepClone(value, cache): value;
    }
    
    return targetObject;
  }

  return obj;
}

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