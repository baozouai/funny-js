function myNew(Constructor, ...args) {
  if (typeof Constructor !== 'function') throw new TypeError('Constructor should be a function');

  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);

  if (result && typeof result === 'object' || typeof result  === 'function') return result;
  return obj;
}

function Person(name, sex) {
  this.name = name
  this.sex = sex
}

Person.prototype.showInfo = function () {
  console.log(this.name, this.sex)
}

let p1 = myNew(Person, 'baozou', 'sex')

console.log(p1) // Person { name: 'baozou', sex: 'sex' }
console.log(p1.showInfo()) // baozou sex

myNew(undefined, 'baozou', 'sex') // TypeError: Constructor should be a function