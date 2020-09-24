/*
 * @Description: 
 * @Author: Moriaty
 * @Date: 2020-09-21 22:31:52
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-21 22:34:56
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