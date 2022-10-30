###  **Promise** 是什么?

- 总结：promise 是 es6 引入的异步编程的新的解决方案，从语法上来说他是一个构造函数，可以实例化对象，封装异步操作，获取成功和失败的结果，其优点是支持链式调用，可以解决回调地狱的问题，指定回调的方式更为灵活；

- 从语法上来说: Promise 是一个构造函数

- 从功能上来说: promise 对象用来封装一个异步操作并可以获取其成功/失败的结果值
- 常见的异步操作
  - fs 文件操作：fs 是 nodejs 下的一个模块，可以对计算机的磁盘进行读写操作
  - 数据库操作：MongoDB、MySQL等
  - ajax 网络请求
  - 定时器 setTimeout

### Promise 的作用

- 可以链式调用，解决回调地狱的问题
- 指定回调函数的方式更加灵活

### promise 的状态

- 实例对象中的一个属性，promiseState
- promise 的状态只能改变一次
- promise 有三种状态：
  - padding  未决定的
  - resolved / fullfilled  成功
  - rejected  失败

##### **如何改变 promise 的状态呢（有如下三种方法）？**

- ` resolve(value)  `  会由 pending 变为 resolved  ；
- ` reject(reason) `  会由 pending 变为 rejected  ；
- 抛出异常 ` throw 'err' `，会由 pending 变为 rejected  ；

### promise 对象的值

- promise 实例对象中的另一个属性，promiseResult，保存着 异步任务成功或失败的结果；
- 只有 resolve 和 reject 这两个函数可以修改 promiseResult 的值

### promise 的返回值

- promise 的返回值还是一个 promise

### Promise 相关的 API

##### Promise 构造函数

```
new Promise(executor);
```

- executor 函数：执行器  `  (resolve, reject) => {}  `;
- resolve 函数：内部定义成功时我们调用的函数；
- reject 函数：内部定义失败时我们调用的函数；
- 注：executor 函数会在 Promise 内部立即同步调用，异步操作在执行器中执行；

```
let p = new Promise((resolve, reject) => {
	// 同步调用的
	console.log(111);
	resolve();
	...
});
console.log(222);
// 执行结果及顺序为： 111  222
```

##### Promise.prototype.then 方法

- 指定用于得到成功 response 的成功回调 和 用于得到失败 error 的失败回调，返回一个新的 promise 对象；

##### Promise.prototype.catch 方法

- 指定用于得到失败 error 的失败回调；

##### Promise.resolve 方法  ` (response) => {} `;

- response 成功的数据或 promise 对象；如果传入的 response 是一个非promise类型的对象，则返回的结果为成功的promise对象；**如果传入 response 是一个 promise 对象，则传入的 response 的结果决定了 resolve 的结果；**
- **属于函数对象的，不是原型上的属性，因此并不在实例对象上；**
- 说明：返回一个成功/失败的promise对象；

```
let p = Promise.resolve(new Promise((resolve, reject) => {
	// resolve('ok'); // p 为成功
	reject('err'); // p 为失败
}))
```

##### Promise.reject 方法 ` (err) => {} `;

- err 失败的数据；即使 传入的 err 为一个成功的 promise 对象，整体结果依然返回失败，返回的状态是 rejected ，失败的结果是传入的 成功的promise 对象的值；
- 说明：**永远返回一个失败的 promise 对象；**

##### Promise.all 方法 ` (promises) => {} `;

- promises 包含 n 个 promise 的数组；
- 说明：**返回一个新的 promise ，只有所有的 promise 都成功才成功，只要有一个失败了就直接失败；**
- 成功的结果是每一个promise对象成功的结果组成的数组（数组中结果的顺序跟promise数组中的顺序一致，**一一对应原则**）；失败的结果是在这个数组当中失败的promise对象的失败的结果；

##### Promise.race 方法：` (promises) => {} ` ;

- promises 包含 n 个 promise 的数组；
- 说明：返回一个新的 promise ，第一个完成的 promise 的结果状态就是最终的结果状态；

### promise 的一些疑问

##### 一个promise指定多个 then ，有多个成功/失败的回调函数，都会被执行吗？

- 当 promise 改变为对应状态时都会执行；如果promise的状态没有改变，一直处于 pending 中，就永远不会进入 then 和 catch 等方法中；

```
let p = new Promise((resolve, reject) => {
	resolve('ok');
})
p.then(res => {
	console.log(res);
})
p.then(res => {
	alert(res);
})
// 结论，两个then中的回调函数都会被执行
```

##### 改变 promise 的状态 和 then方法中的回调函数的执行顺序

- 两者的执行顺序不定，正常情况下是先指定 then 中的回调函数，然后再改变状态（如果 resolve 中 promise 中的异步任务中执行时）；但也可以先改变状态再指定then中的回调函数；
- 注意：then 中的回调函数的执行永远在 promise 改变状态之后；

##### promise.then() 返回的新 promise 的结果状态由什么决定？

- 简述：由 then() 指定的回调函数的执行结果决定；
- 详细：
  - 如果 then 中的回调函数抛出异常，then() 返回的 promise 的状态为 reject	ed；
  - 如果 then 中的回调函数的返回值是一个 非 promise 的任意值，then() 返回的 promise 的状态为 resolved；
  - 如果 then 中的回调函数的返回值是一个 新的promise ，then() 返回的结果就由这个新的 promise 决定；

##### promise 如何串联多个操作任务？

- promise 的 then() 返回一个新的 promise ，可以看成 then() 的链式调用；
- 通过 then 的链式调用串联多个同步/异步任务；

##### promise 异常穿透

- 当使用 promise 的 then 链式调用时，**可以只在最后指定失败的回调（catch()）**；
- 前面任何操作出了异常，都会传到最后失败的回调中处理，且在异常之后的then中的代码都不执行；

```
let p = new Promise((resolve, reject) => {
  resolve('1')
})
p.then(() => {
  console.log('2')
}).then(() => {
  throw 'err';
}).then(() => {
  console.log('3');
}).catch(err => {
  console.log(err);
})
// 控制台结果：2 err
```

##### 如何中断 promise 链（只有一种方法）

- 当使用 promise 的 then 链式调用时，在中间中断，不再调用后面的回调函数；
- 办法：**在回调函数中返回一个 pending 状态的 promise 对象**；

```
let p = new Promise((resolve, reject) => {
  resolve('1');
})
p.then(() => {
  console.log('2');
  // 中断 promise 链
  return new Promise(() => {});
}).then(() => {
  console.log('3');
}).catch(err => {
  console.log(err);
})
// 控制台结果：2
```

