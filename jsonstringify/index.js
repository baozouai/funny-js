/*
 * @Description: 手写Json.stringify
 * @Author: Moriaty
 * @Date: 2021-11-24 08:22:46
 * @Last modified by: Moriaty
 * @LastEditTime: 2021-11-24 22:42:16
 */
function jsonStringify(data) {
  if (isCycle(data)) throw new TypeError('Converting circular structure to JSON');

  const type = typeof data;
  if (type === 'bigint') throw new TypeError('Do not know how to serialize a BigInt');
  if (isUndefinedOrFunctionOrSymbol(data)) return;
  if ([null, NaN, Infinity].includes(data)) return 'null';
  const exactType = getExactType(data);
  if (exactType === 'string') return `"${data}"`;
  if (['number', 'boolean'].includes(exactType)) return String(data);

  if (type === 'object') {
    if (typeof data.toJSON === 'function') return jsonStringify(data.toJSON());

    if (Array.isArray(data)) {
      const result = data.map(item => isUndefinedOrFunctionOrSymbol(item) ? 'null': jsonStringify(item));
      return `[${result}]`.replace(/'/, '"');
    }

    const result = [];
    Object.entries(data).forEach(([key, value]) => {
      if (!isUndefinedOrFunctionOrSymbol(value)) {
        result.push(`"${key}":${jsonStringify(value)}`);
      }
    })
    return `{${result}}`.replace(/'/, '"');
  }
}

function isCycle(obj) {
  
  let flag = false;
  const set = new Set();

  function detect(obj) {
    if (obj && typeof obj !== 'object') return;
    if (set.has(obj)) return flag = true;

    set.add(obj);

    for (let k in obj) {
      if (obj.hasOwnProperty(k)) detect(obj[k]);
      if (flag) return;
    }
    set.delete(obj);
  }

  detect(obj);
  return flag;
}

function isUndefinedOrFunctionOrSymbol(data, isType) {
  return ['undefined', 'function', 'symbol'].includes(isType ? data: typeof data)
}

function getExactType(data) {
  return Object.prototype.toString.call(data).replace(/\[object (.*)\]/, '$1').toLowerCase();
}

// 1. 测试一下基本输出
console.log(jsonStringify(undefined)) // undefined 
console.log(jsonStringify(() => { })) // undefined
console.log(jsonStringify(Symbol('baozou'))) // undefined
console.log(jsonStringify((NaN))) // null
console.log(jsonStringify((Infinity))) // null
console.log(jsonStringify((null))) // null
console.log(jsonStringify({
  name: 'baozou',
  toJSON() {
    return {
      name: 'baozou2',
      sex: 'boy'
    }
  }
}))
// {"name":"baozou2","sex":"boy"}

// 2. 和原生的JSON.stringify转换进行比较
console.log(jsonStringify(null) === JSON.stringify(null));
// true
console.log(jsonStringify(undefined) === JSON.stringify(undefined));
// true
console.log(jsonStringify(false) === JSON.stringify(false));
// true
console.log(jsonStringify(NaN) === JSON.stringify(NaN));
// true
console.log(jsonStringify(Infinity) === JSON.stringify(Infinity));
// true
let str = "baozou";
console.log(jsonStringify(str) === JSON.stringify(str));
// true
let reg = new RegExp("\w");
console.log(jsonStringify(reg) === JSON.stringify(reg));
// true
let date = new Date();
console.log(jsonStringify(date) === JSON.stringify(date));
// true
let sym = Symbol('baozou');
console.log(jsonStringify(sym) === JSON.stringify(sym));
// true
let array = [1, 2, 3];
console.log(jsonStringify(array) === JSON.stringify(array));
// true
let obj = {
  name: 'baozou',
  age: 18,
  attr: ['coding', 123],
  date: new Date(),
  uni: Symbol(2),
  sayHi: function () {
    console.log("hello world")
  },
  info: {
    age: 16,
    intro: {
      money: undefined,
      job: null
    }
  },
  pakingObj: {
    boolean: new Boolean(false),
    string: new String('baozou'),
    number: new Number(1),
  }
}
console.log(jsonStringify(obj) === JSON.stringify(obj)) 
// true
console.log((jsonStringify(obj)))
// {"name":"baozou","age":18,"attr":["coding",123],"date":"2021-10-06T14:59:58.306Z","info":{"age":16,"intro":{"job":null}},"pakingObj":{"boolean":false,"string":"baozou","number":1}}
console.log(JSON.stringify(obj))
// {"name":"baozou","age":18,"attr":["coding",123],"date":"2021-10-06T14:59:58.306Z","info":{"age":16,"intro":{"job":null}},"pakingObj":{"boolean":false,"string":"baozou","number":1}}

// 3. 测试可遍历对象
let enumerableObj = {}

Object.defineProperties(enumerableObj, {
  name: {
    value: 'baozou',
    enumerable: true
  },
  sex: {
    value: 'boy',
    enumerable: false
  },
})

console.log(jsonStringify(enumerableObj))
// {"name":"baozou"}

// 4. 测试循环引用和Bigint

let obj1 = { a: 'aa' }
let obj2 = { name: 'baozou', a: obj1, b: obj1 }
obj2.obj = obj2

console.log(jsonStringify(obj2))
// TypeError: Converting circular structure to JSON
console.log(jsonStringify(BigInt(1)))
// TypeError: Do not know how to serialize a BigInt
