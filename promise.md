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

- response 成功的数据或 promise 对象；
- 说明：返回一个成功/失败的promise对象；

##### Promise.reject 方法 ` (err) => {} `;

- err 失败的数据；
- 说明：返回一个失败的 promise 对象；

##### Promise.all 方法 ` (promise) => {} `;

- promise 包含 n 个 promise 的数组；
- 说明：返回一个新的 promise ，只有所有的 promise 都成功才成功，只要有一个失败了就直接失败；