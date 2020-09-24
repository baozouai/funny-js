/*
 * @Description: 模拟async&await 阶段二:  ① 兼容基本类型
 *                                      ② 加上错误处理
 *                                      ③ 返回Promise
 * @Author: Moriaty
 * @Date: 2020-09-20 17:28:14
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-20 17:44:46
 */

function run(gen) {
  return new Promise((resolve, reject) => {
    const g = gen();

    function next(val) {
      try {
        const {
          value,
          done
        } = g.next(val);
        if (done) {
          return resolve(val);
        }
        Promise.resolve(value).then(next, err => g.throw(err));
      } catch (err) {
        reject(err);
      }
    }
    next();
  })
}


function* myGenerator() {
  try {
    console.log(yield 1);
    console.log(yield Promise.resolve(2));
    console.log(yield Promise.reject('error'));
  } catch (err) {
    console.log(err);
  }
}
run(myGenerator);