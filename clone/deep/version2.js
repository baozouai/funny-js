/*
 * @Description: 
 * @Author: Moriaty
 * @Date: 2020-09-21 22:41:26
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-21 22:46:38
 */
function deepClone(obj) {
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

var obj = {
  a: 1,
  b: {
    c: 2,
    d: [1, 2, 3, {e: 4, r: 5}],
    t: {r: {w: 1, g: ['a', 'r']}}
  }
};

let a = deepClone(obj);
console.log(a);
a.b = 2;
console.log(a)
console.log(obj);