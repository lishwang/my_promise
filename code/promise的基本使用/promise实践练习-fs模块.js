
/**
 * 控制台执行  node .\promise实践练习-fs模块.js
 */
const fs = require('fs');

// 回调函数 形式
// fs.readFile('./resource.txt', (err, data) => {
//   // 如果出错，抛出错误
//   if (err) throw err;
//   // 输出文件内容
//   console.log(data.toString());
// })

// promise 形式
let p = new Promise((resolve, reject) => {
  // 异步操作
  fs.readFile('./resource.txt', (err, data) => {
    // 如果出错，抛出错误
    if (err) reject(err);
    // 成功
    resolve(data);
  })
})

p.then((res) => {
  console.log(res.toString());
}, (err) => {
  console.log(err);
})