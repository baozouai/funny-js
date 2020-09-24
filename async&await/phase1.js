/*
 * @Description: 模拟async&await 阶段一:只支持Promise
 * @Author: Moriaty
 * @Date: 2020-09-20 17:28:14
 * @Last modified by: Moriaty
 * @LastEditTime: 2020-09-20 17:31:39
 */

function run(gen) {
  const g = gen();

  function next(val) {
    debugger
    const {
      value,
      done
    } = g.next(val);
    if (done) {
      return value;
    }
    value.then(next);
  }
  next();
}

function* myGenerator() {
  console.log(yield Promise.resolve(1));
  console.log(yield Promise.resolve(2));
  console.log(yield Promise.resolve(3));
}
run(myGenerator);