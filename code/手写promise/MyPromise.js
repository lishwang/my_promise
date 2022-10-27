
function MyPromise (executor) {
  // 添加属性
  this.PromiseState = 'pending';
  this.PromiseResult = null;
  // 保存实例对象的this
  let self = this;
  // 定义 resolve 函数
  function resolve (data) {
    // 注意：函数作用域中的this默认指向函数调用者，如果没有调用者，就指向window
    // 判断状态是否为 pending ，保证无论实例对象中调用多少次 resolve 和 reject，promise 的状态只能更改一次
    if (self.PromiseState !== 'pending') return;
    // 1、修改对象上的状态（是Promise实例对象上的一个属性 PromiseState）
    self.PromiseState = 'fulfilled';
    // 2、设置对象结果值（是Promise实例对象上的另一个属性 PromiseResult）
    self.PromiseResult = data;
  };
  // 定义 reject 函数
  function reject (data) {
    // 判断状态是否为 pending ，保证无论实例对象中调用多少次 resolve 和 reject，promise 的状态只能更改一次
    if (self.PromiseState !== 'pending') return;
    // 1、修改对象上的状态（是Promise实例对象上的一个属性 PromiseState）
    self.PromiseState = 'rejected';
    // 2、设置对象结果值（是Promise实例对象上的另一个属性 PromiseResult）
    self.PromiseResult = data;
  };
  try {
    // 同步调用 执行器函数executor , 并传入实参 resolve 和 reject
    executor(resolve, reject);
  } catch (e) {
    // 实例中也可以通过 throw 一个错误来改变promise的状态，直接调用 reject 将状态改为失败即可
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
};