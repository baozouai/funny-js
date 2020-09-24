function method1() {
  const task = [];

  const run = (i, times = i) => new Promise(resolve => {

    const timer = setTimeout(() => {
      console.log(new Date().toLocaleTimeString() + '=======> ' + i);
      resolve();
      clearTimeout(timer);
    }, times * 1000);
  })

  for (var i = 0; i < 5; ++i) {
    task.push(run(i));
  }

  Promise.all(task).then(() => {
    run(i, 1);
  })
};

// method1();
function method2() {
  const sleep = times => new Promise(resolve => setTimeout(resolve, times));

  (async () => {
    for (var i = 0; i < 5; ++i) {
      await sleep(1000);
      console.log(new Date().toLocaleTimeString().replace(/[A-Z]/g, '') + '=======> ' + i);
    }
    await sleep(1000);
    console.log(new Date().toLocaleTimeString().replace(/[A-Z]/g, '') + '=======> ' + i);
  })()
}

method2();