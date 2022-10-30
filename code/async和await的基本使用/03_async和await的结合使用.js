/**
 * 案例：读取 resource文件内三个文件的内容，并拼接成后打印输出
 * 控制台执行 node .\03_async和await的结合使用.js
 */

/**
 * 方法一：回调函数法
 */
// const fs = require('fs');

// fs.readFile('./resource/1.txt', (err, data1) => {
//   if (err) throw err;
//   fs.readFile('./resource/2.txt', (err, data2) => {
//     if (err) throw err;
//     fs.readFile('./resource/3.txt', (err, data3) => {
//       if (err) throw err;
//       console.log(data1 + data2 + data3);
//     })
//   })
// })


/**
 * 方法二：await 和 async 实现
 */
const fs = require('fs');
const util = require('util');
// 在 util 中有一个方法 promisify 可以将这些API转换成一个promise类型的函数
const mineReadFile = util.promisify(fs.readFile);

async function main () {
  try {
    let data1 = await mineReadFile('./resource/1.txt');
    let data2 = await mineReadFile('./resource/2.txt');
    let data3 = await mineReadFile('./resource/3.txt');
    console.log(data1 + data2 + data3);
  } catch (error) {
    // await 不会等待promise的错误，因此需要用 try...catch 来处理捕获错误对象
    console.log(error);
  }
}
main();