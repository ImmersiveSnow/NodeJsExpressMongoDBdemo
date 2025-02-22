import crypto from 'crypto'
import randomBytes from 'crypto'
// 生成一个32字节长的随机字符串
const secret = crypto.randomBytes(32).toString('hex');

console.log("Generated ACCESS_TOKEN_SECRET: ", secret);