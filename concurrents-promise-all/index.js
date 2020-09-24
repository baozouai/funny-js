/*
 * @Description: 用于并发请求的promiseAll
 * @Author: Moriaty
 * @Date: 2020-09-11 11:22:16
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-11 15:17:07
 */
function promiseAll(promises = [], nums = 3) {
  // promiseAll开始运行时间
  const start = new Date().getTime();
  // 以及跑完的promise数量
  let hasRunNum = 0;
  // 下一个进并发数量的索引
  let nextIndex = nums;
  // 存放所有结果，包括成功和失败
  const allRes = [];
  // 最大并发数据
  const maxConcurrents = promises.slice(0, nums);
  // 初始最大并发数组的索引
  let concurrentsIndex = maxConcurrents.map((_, index) => index);
  // 等待执行的promise数组
  const remains = promises.slice(nums);

  return new Promise(resolve => {
    // 最大并发
    console.log(`初始并发数组为[${concurrentsIndex}]`);
    // 遍历初始并发数组
    maxConcurrents.forEach(singleTaskRun);
    
    function singleTaskRun(promise, index) {
      console.log(`我是promises数组中第${index}个元素，我开始运行`)
      const start = new Date().getTime();
      // 如果传入的不是Promise，则将其转换为Promise，是Promise的话则没影响
      Promise.resolve(promise)
        .then(res => addRes(res, index, start))
        .catch(error => addRes(error, index, start))
    }
    // 存放promise运行结果，包含成功及其失败
    function addRes(res, index, start) {
      console.log(`并发数组中的${index}已完成，准备将其剔除`);
      concurrentsIndex = concurrentsIndex.filter(item => item !== index);
      console.log(`剔除${index}后的并发数组为[${concurrentsIndex}]`);
      const end = new Date().getTime();
      console.log(`
      **************************************************************************************************
      * 我是promises数组中第${index}个元素，我运行结束，我的结果为【${res}】，用了【${(end  - start) / 1000}】秒
      **************************************************************************************************
      `);
      allRes[index] = res;
      // 存放后则检查
      check(index);
    }

    function check(index) {
      // 已运行promise数量+1
      ++hasRunNum;
      // 如果等于传入的promise总数，则全部运行完成
      if (hasRunNum === promises.length) {
        const end = new Date().getTime();
        console.log((end - start) / 1000)
        resolve(allRes);
      } else {
        // 否则取remains的下一个promise
        next(index);
      }
    }

    function next(index) {
      // 如果还有剩余的promise，则将其放入并发数组
      if (remains.length) {
        console.log(`现在运行的是由${index}开启的${nextIndex}，将其加入并发数组`)
        const promise = remains.shift();
        concurrentsIndex.push(nextIndex);
        console.log(`目前并发数组为[${concurrentsIndex}]`);
        singleTaskRun(promise, nextIndex);
        ++nextIndex
      }
    }
  })
}
const p0 = new Promise((resolve, reject) => {
  // throw new Error("出错");
  reject("p0错误");
});
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1");
  }, 1000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p2");
  }, 5000);
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p3");
  }, 2000);
});
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p4");
  }, 2500);
});
const p5 = new Promise((resolve, reject) => {
  const start = new Date().getTime();
  setTimeout(() => {
    resolve("p5");
    // 思考为何会输出 【我是promises数组中第5个元素，我运行结束，我的结果为【p5】，用了【0】秒】而不是用了1.5秒
    console.log(`----------------------${(new Date().getTime() - start) / 1000}----------------------`);
  }, 1500);
});
const all = promiseAll([p0, p1, p2, p3, p4, p5, '我不是promise'], 3);
all.then(console.log); // [ 'p0错误', 'p1', 'p2', 'p3', 'p4', 'p5', '我不是promise' ]