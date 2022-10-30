
function MyPromise (executor) {
  // 添加属性
  // promise 的状态
  this.PromiseState = 'pending';
  // promise 的结果
  this.PromiseResult = null;
  // 用于保存异步时，then中的回调函数
  this.callbacks = [];
  // 保存实例对象的this
  let self = this;
  // 定义 resolve 函数
  function resolveFun (data) {
    // 注意：函数作用域中的this默认指向函数调用者，如果没有调用者，就指向window
    // 判断状态是否为 pending ，保证无论实例对象中调用多少次 resolve 和 reject，promise 的状态只能更改一次
    if (self.PromiseState !== 'pending') return;
    // 1、修改对象上的状态（是Promise实例对象上的一个属性 PromiseState）
    self.PromiseState = 'fulfilled';
    // 2、设置对象结果值（是Promise实例对象上的另一个属性 PromiseResult）
    self.PromiseResult = data;
    // 执行回调（异步时，then中的回调函数），并传入结果值
    // 细节完善：then方法中的回调是异步执行的，因此包裹一个setTimeout，可以不设置时间，默认为0
    setTimeout(() => {
      self.callbacks.forEach(item => {
        item.onResolved && item.onResolved(data);
      })
    }, 0);
  };
  // 定义 reject 函数
  function rejectFun (data) {
    // 判断状态是否为 pending ，保证无论实例对象中调用多少次 resolve 和 reject，promise 的状态只能更改一次
    if (self.PromiseState !== 'pending') return;
    // 1、修改对象上的状态（是Promise实例对象上的一个属性 PromiseState）
    self.PromiseState = 'rejected';
    // 2、设置对象结果值（是Promise实例对象上的另一个属性 PromiseResult）
    self.PromiseResult = data;
    // 执行回调（异步时，then中的回调函数），并传入结果值
    // 细节完善：then方法中的回调是异步执行的，因此包裹一个setTimeout，可以不设置时间，默认为0
    setTimeout(() => {
      self.callbacks.forEach(item => {
        item.onRejected && item.onRejected(data);
      })
    }, 0);
  };
  try {
    // 同步调用 执行器函数executor , 并传入实参 resolve 和 reject
    /**
     * 这里比较绕，简单理解就是：
     * 1、如果实例对象中是同步处理程序，则会直接同步执行 resolveFun函数 或 rejectFun函数 中的一个；
     * 2、如果是异步处理程序（setTimeout），相当于 会另外开辟一个进程去处理这个 setTimeout ，
     * 异步中再执行 resolveFun函数，并给 resolveFun函数 传递参数；
     */
    executor(resolveFun, rejectFun);
  } catch (e) {
    // 实例中也可以通过 throw 一个错误来改变promise的状态，直接调用 rejectFun函数 将状态改为失败即可
    rejectFun(e);
  }
}

// 原型上添加 then 方法
MyPromise.prototype.then = function (onResolved, onRejected) {
  let self = this;
  /**
   * 解决catch方法的异常穿透
   * 通常的书写习惯是then方法中没有用第二个函数来处理失败，因此如果没有传第二个函数，就自己定义一个，否则函数调用时会报错undefined，
   * 因为第二个函数是处理失败，因此throw这个错误，才能向下传递，被后面的catch捕获到，实现catch的错误穿透处理；
   */
  if (typeof onRejected !== 'function') {
    onRejected = reason => {
      throw reason;
    }
  };
  /**
   * 解决then方法的值传递
   * 如果上游的then方法中没有传递和执行任何方法，会导致函数调用时报错undefined，
   * 因此需要自己定义一个函数，接收上游传递的值然后直接返回即可；
   */
  if (typeof onResolved !== 'function') {
    onResolved = value => {
      return value;
    }
  };
  // then方法的返回值为一个 promise 对象
  return new MyPromise((resolve, reject) => {
    // 方法抽离封装
    function then_callback (fun_type) {
      // 调用resolve和reject改变状态
      try {
        // 拿到then方法中成功的回调的返回值
        let response = fun_type(self.PromiseResult);
        if (response instanceof MyPromise) {
          // 返回值是一个promise实例，则then方法的返回值由该实例决定
          //（调用then方法拿到该实例的返回的结果，并作为总体then的返回结果返回）
          response.then(v => {
            resolve(v);
          }, r => {
            reject(r);
          })
        } else {
          // 返回值为一个普通的值，则then方法的返回值为一个成功的promise
          resolve(response);
        }
      } catch (error) {
        // 处理then方法中 throw 一个错误
        reject(error);
      }
    };
    // 根据当前不同的promise状态，调用then中的回调函数，并传入结果值
    // 实例中为同步执行程序--进入then的成功回调
    if (this.PromiseState === 'fulfilled') {
      // 细节完善：then方法中的回调是异步执行的，因此包裹一个setTimeout，可以不设置时间，默认为0
      setTimeout(() => {
        then_callback(onResolved);
      }, 0);
    }
    // 实例中为同步执行程序--进入then的失败回调
    if (this.PromiseState === 'rejected') {
      setTimeout(() => {
        then_callback(onRejected);
      }, 0);
    }
    /**
     * 处理异步处理程序时js会跳过，会先进入then，此时没有执行 resolveFun 和 rejectFun ，
     * 因此此时promise状态为 pending ，因此可以将then中的两个回调函数保存起来，
     * 然后放到 resolveFun 和 rejectFun 中执行；
     * 因为在异步的情况下，这两个函数会等待 并在异步执行程序中被调用执行；
     */
    // 实例中为异步执行程序--进入then的成功/失败回调
    if (this.PromiseState === 'pending') {
      this.callbacks.push({
        // 由于这两个方法的调用者都是 item（即对象本身），因此this指向这个被push进去的对象
        onResolved: function () {
          then_callback(onResolved);
        },
        onRejected: function () {
          then_callback(onRejected);
        }
      });
    }
  });
};

// 原型上添加 catch 方法
MyPromise.prototype.catch = function (onRejected) {
  // 由于 catch 方法的处理跟 then 相同，且返回一个 promise，因此可以直接调用then方法
  return this.then(undefined, onRejected);
}

// 构造函数身上的 resolve 方法，不在原型上，因此在实例中也看不到
MyPromise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof MyPromise) {
      value.then(v => {
        resolve(v);
      }, r => {
        reject(r);
      })
    } else {
      resolve(value);
    }
  })
}

// 构造函数身上的 reject 方法，不在原型上，因此在实例中也看不到
// reject 方法始终返回失败的promise
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  })
}

// 构造函数身上的 all 方法，不在原型上，因此在实例中也看不到
MyPromise.all = function (MyPromiseArr) {
  return new MyPromise((resolve, reject) => {
    // 用于记录是否MyPromiseArr中所有的promise都是成功的，只有都成功才返回成功
    let count = 0;
    // 用于存储每个promise的成功的结果，并一一对应
    let resultArr = [];
    for (let i = 0; i < MyPromiseArr.length; i++) {
      MyPromiseArr[i].then(v => {
        count++;
        resultArr[i] = v;
        if (count === MyPromiseArr.length) {
          resolve(resultArr);
        }
      }, r => {
        reject(r);
      })
    }
  })
}

// 构造函数身上的 race 方法，不在原型上，因此在实例中也看不到
MyPromise.race = function (MyPromiseArr) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < MyPromiseArr.length; i++) {
      // 谁先执行，谁返回，状态只改变一次
      MyPromiseArr[i].then(v => {
        resolve(v);
      }, r => {
        reject(r);
      });

    }
  })
}