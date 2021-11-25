class EventEmitter {
  events = {};

  on(type, callback) {
    if (!this.events[type]) this.events[type] = [];

    this.events[type].push(callback);

    return this;
  }

  emit(type, ...payload) {
    if (this.events[type]) {
      this.events[type].forEach(cb => cb(...payload));
    }
    return this;
  }

  off(type, callback) {
    if (type === undefined) {
      this.events = {};
    } else if (this.events[type]) {
      if (typeof callback === 'function') {
        this.events[type] = this.events[type].filter(cb => cb !== callback);
      } else {
        delete this.events[type]
      }
    }

    return this;
  }

  once(type, callback) {
    const proxyCallback = (...payload) => {
      callback(...payload);
      this.off(type, proxyCallback);
    }

    this.on(type, proxyCallback);
    return this;
  }
}

const e1 = new EventEmitter()

const e1Callback1 = (name, sex) => {
  console.log(name, sex, 'evt1---callback1')
}
const e1Callback2 = (name, sex) => {
  console.log(name, sex, 'evt1---callback2')
}
const e1Callback3 = (name, sex) => {
  console.log(name, sex, 'evt1---callback3')
}

e1.on('evt1', e1Callback1).on('evt1', e1Callback2).once('evt1', e1Callback3)
// 只执行一次回调


e1.emit('evt1', 'baozou', 'boy')
// baozou boy evt1---callback1
// baozou boy evt1---callback2
// baozou boy evt1---callback3
console.log('------尝试删除e1Callback1------')
// 移除e1Callback1
e1.off('evt1', e1Callback1).emit('evt1', 'baozou', 'boy')
// baozou boy evt1---callback2