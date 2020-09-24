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