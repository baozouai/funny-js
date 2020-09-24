function throttle(fn, timeout) {
  const now = Date.now;
  let startTime = now();
  return function () {
    if (now() - startTime >= timeout) {
      startTime = now();
      fn.apply(this, arguments);
    }
  }
}