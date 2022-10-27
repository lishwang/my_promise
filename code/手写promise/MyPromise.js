
function MyPromise (executor) {
  // 添加属性
  this.promiseState = 'pending';
  this.promiseResult = null;
  // 保存实例对象的this
  let self = this;
  // 定义 resolve 函数
  function resolve (data) {
    // 注意：函数作用域中的this默认指向函数调用者，如果没有调用者，就指向window
    // 1、修改对象上的状态（是Promise实例对象上的一个属性 promiseState）
    self.promiseState = 'fulfilled';
    // 2、设置对象结果值（是Promise实例对象上的另一个属性 promiseResult）
    self.promiseResult = data;
  };
  // 定义 reject 函数
  function reject (data) {
    // 1、修改对象上的状态（是Promise实例对象上的一个属性 promiseState）
    self.promiseState = 'rejected';
    // 2、设置对象结果值（是Promise实例对象上的另一个属性 promiseResult）
    self.promiseResult = data;
  };
  // 同步调用 执行器函数executor , 并传入实参 resolve 和 reject
  executor(resolve, reject);
}

MyPromise.prototype.then = function (onResolved, onRejected) { };