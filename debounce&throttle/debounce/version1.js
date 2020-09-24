function debounce(fn, timeout) {
  let timer;
  const run = () => {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, timeout);
  }
  return run;
}