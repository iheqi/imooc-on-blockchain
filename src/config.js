import ipfsClient from 'ipfs-http-client';
import Web3 from 'web3';
import { notification, message } from 'antd';
import Imooc from '../src/compiled/Imooc.json';
import address from '../src/address';
import crypto from './crypto.js';

let ipfs = ipfsClient("ipfs.infura.io", "5001", { protocol: "https" });
let ipfsPrefix = "https://ipfs.infura.io:5001/api/v0/cat?arg=";

// let ipfs = ipfsClient('localhost', '5002', { protocol: 'http' });
// let ipfsPrefix = "http://localhost:5002/ipfs/";
let web3, accounts, courseList;

if (window.web3) { // 如果是连接到MetaMask, 则这样连接
  web3 = new Web3(window.web3.currentProvider);
} else {
  notification.error({
    message: '没有检测到以太坊插件',
    description: '请先安装或激活MetaMask'
  });
}

function saveImageToIpfs(file) {
  const hide = message.loading('上传中');
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const buffer = Buffer.from(reader.result); // 转为buffer对象
      const res = await ipfs.add(buffer); // 上传
      hide();
      resolve(res[0].hash);
    }
  });
}

function saveVideoToIpfs(file) {
  const hide = message.loading('上传中');
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      console.log("reader.result", reader.result); // ArrayBuffer
      const buffer = Buffer.from(reader.result); // 转为buffer对象


      console.log(buffer, JSON.stringify(buffer), JSON.parse(JSON.stringify(buffer)).data);
      console.log(Buffer.from(JSON.parse(JSON.stringify(buffer)).data));

      const encrypted = crypto.encrypt(JSON.stringify(buffer)); 

      // console.log(buffer, encrypted, buffer.toString(), Buffer.from(encrypted));
      // console.log(crypto.decrypt((Buffer.from(encrypted)).toString()));

      // console.log(Buffer.from(crypto.decrypt((Buffer.from(encrypted)).toString())));

      console.log("最终上传的buffer", encrypted, Buffer.from(encrypted), Buffer.from(encrypted).toString());
      return;
      const res = await ipfs.add(Buffer.from(encrypted)); // 上传
      hide();
      resolve(res[0].hash);
    }
  });
}

function saveJsonToIpfs(data) {
  return new Promise(async (resolve) => {
    const buffer = Buffer.from(JSON.stringify(data));
    const res = await ipfs.add(buffer);
    console.log(res);
    resolve(res[0].hash);
  });
}

async function getJsonFromIpfs(v1, v2) {
  return new Promise(async (resolve, reject) => {
    const hash = web3.utils.hexToAscii(v1) + web3.utils.hexToAscii(v2);
    const res = await ipfs.cat(hash);
    const data = new TextDecoder('utf-8').decode(res);
    resolve(JSON.parse(data));
  });  
}

(async function deploy() {
  accounts = await web3.eth.getAccounts();
  console.log("accounts", accounts);
  courseList = await new web3.eth.Contract(Imooc.CourseList.abi, accounts[0]);

  // 如果部署到了infura, 那这个address就是部署成功时返回的address, 直接获取，不用部署了

  courseList = await new web3.eth.Contract(Imooc.CourseList.abi, address); 

  // const result = await courseList.deploy({
  //   data: Imooc.CourseList.evm.bytecode.object
  // }).send({
  //   from: accounts[0],
  //   gas: 5000000
  // });
  const res = await courseList.methods.isCeo().call({
    from: accounts[0]
  });

  // console.log('合约部署到的地址：', courseList, courseList.methods, courseList.address, res);

  // const res = await courseList.methods.getDetail().call({
  //   from: accounts[0]
  // });  
})();

async function getCourseByAddress(address) {
  return await new web3.eth.Contract(Imooc.Course.abi, address);
}

var e1 = crypto.encrypt("QmWRGRh8KTpeSYYJ2cEuH9ZD7adau31LHowjEe5Q2N3fdf");
var e2 = crypto.encrypt("QmarqY6BaGtjzzHYTbnyUJuhKmKYpnSj1PiDXe6729khGG");
var e3 = crypto.encrypt("Qmc6zemvJnpQtobxoedSaLX5SSHUi4G9ddN6h8o3kJ2vS5");
console.log(crypto.decrypt(e1));
console.log(crypto.decrypt(e2));
console.log(crypto.decrypt("29c7c36f396c7b582c31505bea9a679ed4f4ee598821f875145b7ad4c25255c49f4f0203344dfc400b4781513d0fe792"));

export { 
  ipfs, 
  ipfsPrefix, 
  saveImageToIpfs, 
  web3, 
  courseList, 
  getCourseByAddress, 
  saveJsonToIpfs,
  getJsonFromIpfs,
  saveVideoToIpfs 
};