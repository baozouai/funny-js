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
  const sleep = () => new Promise(resolve => setTimeout(resolve, 1000))
  async function log(i) {
    await sleep();
    console.log(`${new Date().toLocaleTimeString().replace(/[A-Z]/g, '')} =====> ${i}`);
  }
  (async() => {
    for (var i = 0; i < 6; ++i) {
      await log(i);
    }
  })()
}

method2();