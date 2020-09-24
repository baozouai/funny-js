/*
 * @Description: requestAnimationFrame实现setInterval requestAnimationFrame只在浏览器环境
 * @Author: Moriaty
 * @Date: 2020-09-22 16:11:49
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-22 16:21:55
 */

function mySetInterval(callback, interval) {
  let timer;
  const now = Date.now;
  let startTime = endTime = now();

  function loop() {
    timer = requestAnimationFrame(loop);
    endTime = now();
    if (endTime - startTime >= interval) {
      callback(timer);
      startTime = endTime = now();
    }
  }
  timer = requestAnimationFrame(loop);
  return timer;
}

let a = 0;
mySetInterval(timer => {
  console.log(a++);
  if (a === 5) {
    cancelAnimationFrame(timer);
  }
}, 1000)