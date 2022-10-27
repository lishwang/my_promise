
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
    self.callbacks.forEach(item => {
      item.onResolved && item.onResolved(data);
    })
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
    self.callbacks.forEach(item => {
      item.onRejected && item.onRejected(data);
    })
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
    reject(e);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  // 根据当前不同的promise状态，调用回调函数，并传入结果值
  if (this.PromiseState === 'fulfilled') {
    onResolved(this.PromiseResult);
  }
  if (this.PromiseState === 'rejected') {
    onRejected(this.PromiseResult);
  }
  /**
   * 处理异步处理程序时js会跳过，会先进入then，此时没有执行 resolveFun 和 rejectFun ，
   * 因此此时promise状态为 pending ，因此可以将then中的两个回调函数保存起来，
   * 然后放到 resolveFun 和 rejectFun 中执行；
   * 因为在异步的情况下，这两个函数会等待 并在异步执行程序中被调用执行；
   */
  if (this.PromiseState === 'pending') {
    this.callbacks.push({
      onResolved,
      onRejected,
    });
  }
};