function throttle(fn, timeout) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        clearTimeout(timer);
        timer = null;
      }, timeout); 
    }
  }
}

function throttle1(fn, timeout) {
  const now = Date.now;
  let startTime = now();
  return function () {
    if (now() - startTime >= timeout) {
      startTime = now();
      fn.apply(this, arguments);
    }
  }
}