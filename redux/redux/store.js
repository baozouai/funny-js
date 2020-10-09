
function createStore(reducer) {
  let state = {};
  const observers = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    notify();
  }
  // 订阅
  function subscribe(fn) {
    observers.push(fn);
  }
  // 发布
  function notify() {
    observers.forEach(fn => fn(state));
  }
  // 先初始化state
  dispatch({ type: '@@REDUX_INIT' });
  return {
    getState,
    dispatch,
    subscribe,
  };
}
module.exports = createStore;