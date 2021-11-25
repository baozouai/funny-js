function LRUCache(capacity) {
  this.keys = [];
  this.cache = {};
  this.capacity = capacity;
}

LRUCache.prototype.get = function get(key) {
  if (this.cache[key]) {
    updateKey(this.keys, key);
    return this.cache[key]
  }
  return -1;
}

LRUCache.prototype.put = function put(key, value) {
  if (this.cache[key]) {
    updateKey(this.keys, key);
  } else {
    this.keys.push(key);
    if (this.keys.length > this.capacity) {
      removeCache(this.cache, this.keys)
    }
  }
  this.cache[key] = value
}

function updateKey(keys, key) {
  const oldIndex = keys.indexOf(key);
  if (~oldIndex) keys.splice(oldIndex, 1);
  keys.push(key);
}

function removeCache(cache, keys) {
  const removeKey = keys.shift()
  delete cache[removeKey];
}

function LRUCache1(capacity) {
  this.cache = new Map();
  this.capacity = capacity;
}

LRUCache1.prototype.get = function get(key) {
  if (this.cache.has(key)) {
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  return -1;
}

LRUCache1.prototype.put = function put(key, value) {
  if (this.cache[key]) {
    this.cache.delete(key);
  } else {
    if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
  this.cache.set(key, value);
}


const lRUCache = new LRUCache(2)

console.log(lRUCache.put(1, 1)) // 缓存是 {1=1}
console.log(lRUCache.put(2, 2)) // 缓存是 {1=1, 2=2}
console.log(lRUCache.get(1))    // 返回 1
console.log(lRUCache.put(3, 3)) // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
console.log(lRUCache.get(2))    // 返回 -1 (未找到)
console.log(lRUCache.put(4, 4)) // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
console.log(lRUCache.get(1) )   // 返回 -1 (未找到)
console.log(lRUCache.get(3))    // 返回 3
console.log(lRUCache.get(4) )   // 返回 4

const lRUCache1 = new LRUCache1(2)

console.log(lRUCache1.put(1, 1)) // 缓存是 {1=1}
console.log(lRUCache1.put(2, 2)) // 缓存是 {1=1, 2=2}
console.log(lRUCache1.get(1))    // 返回 1
console.log(lRUCache1.put(3, 3)) // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
console.log(lRUCache1.get(2))    // 返回 -1 (未找到)
console.log(lRUCache1.put(4, 4)) // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
console.log(lRUCache1.get(1) )   // 返回 -1 (未找到)
console.log(lRUCache1.get(3))    // 返回 3
console.log(lRUCache1.get(4) )   // 返回 4