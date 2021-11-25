/*
 * @Description: 用于并发请求的promiseAll
 * @Author: Moriaty
 * @Date: 2020-09-11 11:22:16
 * @Last modified by: Moriaty
 * @LastEditTime: 2021-11-25 19:46:49
 */
function promiseAll(promises = [], nums = 3) {
  // 以及跑完的promise数量
  let hasRunNum = 0;
  // 下一个进并发数量的索引
  let nextIndex = nums;
  // 存放所有结果，包括成功和失败
  const allRes = [];
  // 最大并发数据
  const maxConcurrents = promises.slice(0, nums);
  // 等待执行的promise数组
  const remains = promises.slice(nums);

  return new Promise(resolve => {
    // 遍历初始并发数组
    maxConcurrents.forEach(singleTaskRun);

    function singleTaskRun(promise, index) {
      const callback = addRes.bind(null, index)
      // 如果传入的不是Promise，则将其转换为Promise，是Promise的话则没影响
      Promise.resolve(promise())
        .then(callback)
        .catch(callback)
    }
    // 存放promise运行结果，包含成功及其失败
    function addRes(index,res) {
      allRes[index] = res;
      hasRunNum++;
      // 存放后则检查
      check();
    }

    function check() {
      // 已运行promise数量+1
      // 如果等于传入的promise总数，则全部运行完成
      if (hasRunNum === promises.length) {
        resolve(allRes);
      } else {
        // 否则取remains的下一个promise
        next();
      }
    }

    function next() {
      // 如果还有剩余的promise，则将其放入并发数组
      if (remains.length) {
        const promise = remains.shift();
        singleTaskRun(promise, nextIndex++);
      }
    }
  })
}
// const p0 = new Promise((resolve, reject) => {
//   // throw new Error("出错");
//   reject("p0错误");
// });
// const p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("p1");
//   }, 1000);
// });
// const p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("p2");
//     console.log('p2')
//   }, 5000);
// });
// const p3 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("p3");
//   }, 2000);
// });
// const p4 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("p4");
//   }, 2500);
// });
// const p5 = new Promise((resolve, reject) => {
//   const start = new Date().getTime();
//   setTimeout(() => {
//     resolve("p5");
//     // 思考为何会输出 【我是promises数组中第5个元素，我运行结束，我的结果为【p5】，用了【0】秒】而不是用了1.5秒
//     // console.log(`----------------------${(new Date().getTime() - start) / 1000}----------------------`);
//   }, 1500);
// });
// const all = promiseAll1([p0, p1, p2, p3, p4, p5, '我不是promise'], 3);
// all.then(console.log); // [ 'p0错误', 'p1', 'p2', 'p3', 'p4', 'p5', '我不是promise' ]

const timeout = (time, value) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(value);
      resolve(value)
    }, time)
  })
}

promiseAll([
  () => new Promise((resolve, reject) => {
      // throw new Error("出错");
      reject("p0错误");
    }),
  () => timeout(1000, 1),
  () =>  timeout(500, 2), 
  () => timeout(300,3), 
  () => timeout(400, 4)
], 2).then(console.log)