
function MyPromise (executor) {
  // 定义 resolve 函数
  function resolve (data) { };
  // 定义 reject 函数
  function reject (data) { };
  // 同步调用 执行器函数executor , 并传入实参 resolve 和 reject
  executor();
}

MyPromise.prototype.then = function (onResolved, onRejected) { };