// 指向work-in-progress fiber当前hook
let workInProgressHook;
// 第一次挂载
let isMount = true;
// num用于标记当前hook的第几个update
let num = 1;
// 声明一个fiber
const fiber = {
  // memoizedState 指向第一个hook
  memoizedState: null,
  stateNode: App
};
// ===========================================================================
// ===========================================================================
/**
 * @description: render页面
 * @param {HTML} HTMLElement 新的html
 */
function render(HTMLElement) {
  debugger
  document.querySelector('#app').innerHTML = HTMLElement;
}
/**
 * @description: 模拟调度
 */
function schedule() {
  debugger
  // 调度开始将workInProgressHook指向第一个hook
  workInProgressHook = fiber.memoizedState;
  const HTMLElement = fiber.stateNode();
  isMount = false;
  num = 0;
  // 渲染页面
  render(HTMLElement);
}
// ===========================================================================
// ===========================================================================
/**
 * @description: 
 * @param {object} queue
 * @param {func | newState} action setState中的action
 */
function dispatchAction(queue, action) {
  debugger
  // 创建一个update num只记录该hook的第几个记录而已 实际没有
  const update = {
    action,
    // 指向下一个更新
    next: null,
    num,
  }
  ++num;
  // 这里要拼接一个单向环形链表 start
  // 如果队列中没有pending 即队列为空
  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  // 队列的pending永远指向最新的update
  queue.pending = update;
  // 这里要拼接一个单向环形链表 end
}
// ===========================================================================
// 仅用于记录第几个hook
let hookNum = 0;
function useState(initialState) {
  let hook;
  debugger
  if (isMount) {
    // 如果是开始挂载 声明一个hook，初始memoizedState值为传入的initialState
    hook = {
      queue: {
        pending: null
      },
      // hook保存的数据
      memoizedState: initialState,
      // 指向下一个hook
      next: null,
      hookNum: hookNum++,
    };
    // 如果fiber还没链接hook，则链接
    if (!fiber.memoizedState) {
      // fiber的memoizedState永远指向第一个hook
      fiber.memoizedState = hook;
    } else {
      // 如果fiber已链接第一个hook，意味着这时候hooks的数量 > 2
      // 则上一个useState的hook的next指向现在useState的hook
      workInProgressHook.next = hook;
    }
    // 然后指向当前hook
    workInProgressHook = hook;
  } else {
    // 如果是update
    // 则无须创建新的hook 指向当前工作中的hook
    hook = workInProgressHook;
    // 当前工作中的hook 指向下一个hook
    workInProgressHook = workInProgressHook.next;
  }
  // 本次更新以baseState为基础计算新的state
  let baseState = hook.memoizedState;
  // 如果队列中正在等待 意味着这队列中有环形单向链表
  if (hook.queue.pending) {
    // 由于队列中的update永远指向最新的update
    /**
     *  如环形链表为
     *   hook.queue.pending  ➡️ update5 ➡️ update1 ➡️ update2 
     *                            ⤴️                     ⬇️
     *                          update4    ⬅️         update3
     */
    // 取update1
    let firstUpdate = hook.queue.pending.next;

    do {
      // 取出action
      const action = firstUpdate.action;
      // action如果是函数，则运行函数获取最新值 如setState(num => num + 1),否则，直接取值 如setState(1);
      baseState = typeof action === 'function' ? action(baseState) : action;
      // 指针移动到下一个update
      firstUpdate = firstUpdate.next;
      // 当走完一圈，则跳出
    } while (firstUpdate !== hook.queue.pending.next)
    // 清空队列
    hook.queue.pending = null;
    // update的数量置1
    num = 1;
  }
  // 在计算state完成后，新的state会成为memoizedState
  hook.memoizedState = baseState;
  // 返回 state及其setter
  return [baseState, dispatchAction.bind(null, hook.queue)];
}
// ===========================================================================
// ===========================================================================
/**
 * @description: 针对两个button的点击函数
 * @param {number} nth 第几个button
 * @return {func} setState
 * @return {number} cycleNum setState次数
 */
function bindEvent(nth, setState, cycleNum = 1) {
  debugger
  window[`onclick${nth}`] = () => {
    debugger
    for (let i = 0; i < cycleNum; ++i) {
      debugger
      setState(num => num + 1);
    }
    schedule();
  };
}
// ===========================================================================
// ===========================================================================
function App() {
  debugger
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(10);

  bindEvent(1, setNum1, num1 === 1 ? 3 : 1);
  bindEvent(2, setNum2, num2 === 11 ? 2 : 1);
  return (
    `
    <div class="first">
      <h1>${num1}</h1>
      <button onclick="onclick1()">点我</button>
    </div>
    <div class="second">
      <h1>${num2}</h1>
      <button onclick="onclick2()">点我</button>
    </div>
    `
  )
}
// ===========================================================================
// ===========================================================================
debugger
// 组件首次挂载
schedule();
