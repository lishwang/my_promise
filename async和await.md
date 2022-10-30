### async 和 await 的基本使用

##### async 函数

- async 函数的返回值是一个 promise 对象；
- 这个 promise 对象的结果由 async 函数内部执行后的返回值决定；（跟then方法的返回值一致）
  - 如果返回值是一个非promise类型的数据，则 async 函数的返回值的状态就是成功的，结果是返回值；
  - 如果返回值是一个promise对象，则 async 函数的返回值的状态与这个promise对象的执行结果一致，且返回它的执行结果；
  - 如果 async 函数内部 throw 一个错误，则 async 函数的返回值的状态就是失败的；

##### await 表达式

- await 必须写在 async 函数中，但 async 函数中可以没有 await ；

- await 右侧的表达式一般为 promise 对象，但也可以是其他值；
- **如果右侧表达式是promise对象，await返回的是promise成功的值，如果await右侧的表达式的promise是失败状态，则需要通过 try...catch 来捕获错误对象；**
- 如果表达式是其他值，直接将此值作为await的返回值；

##### 答疑

- 元素获取为同步代码；
- await不会等待其他非promise异步程序的执行；
- await右侧为promise的失败的情况时，需要 try...catch 捕获错误；
- await只能等待promise成功的结果；