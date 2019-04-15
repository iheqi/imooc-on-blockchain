import crypto from "crypto";
const CRYPTOJSKEY= Buffer.from("imooc-on-blockchain"); // 秘钥

function encrypt(data) { // 加密
  const cipher = crypto.createCipher('aes128', CRYPTOJSKEY);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) { // 解密
  const decipher = crypto.createDecipher('aes128', CRYPTOJSKEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export default {
  encrypt,
  decrypt
};