/*
 * @Description: 深层代理
 * @Author: Moriaty
 * @Date: 2020-09-22 12:58:49
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-22 14:49:16
 */
function toDeepProxy(object, handle) {
  if (!isPureObject(object)) {
    addSubProxy(object, handle);
  }
  return new Proxy(object, handle);
};

function addSubProxy(object, handle) {
  for (let prop of Object.keys(object)) {
    if (object[prop] !== null && typeof object[prop] === 'object') {
      if (!isPureObject(object[prop])) addSubProxy(object[prop], handle);
      object[prop] = new Proxy(object[prop], handle);
    }
  }
}

function getLogger(target, property) {
  console.log('get property:' + property);
};

function setBind(property, value) {
  console.log('----------------------------------------');
  console.log(value)
  console.log(`property ${property} is set to ${value}`);
}

function isPureObject(object) {
  if (obj === null || typeof object !== 'object') {
    return false;
  }
  for (let prop in object) {
    if (object[prop] !== null && typeof object[prop] === 'object') {
      return false;
    }
  }
  return true;
}
const obj = {
  a: 1,
  b: {
    c: {
      d: {
        e: {
          f: {
            g: {
              h: 2
            }
          }
        }
      }
    }
  }
};
const handle = {
  get(target, property, receiver) {
    getLogger(target, property);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    setBind(property, value);
    return Reflect.set(target, property, value, receiver);
  }
};
const proxy = toDeepProxy(obj, handle);

proxy.b.c.d.e.f.g.h = 1;
proxy.b.c.d = 2;
proxy.b.c.d