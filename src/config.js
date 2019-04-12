import ipfsClient from 'ipfs-http-client';
import Web3 from 'web3';
import { notification, message } from 'antd';
import Imooc from '../src/compiled/Imooc.json';
import address from '../src/address';

let ipfs = ipfsClient("ipfs.infura.io", "5001", { protocol: "https" });
// let ipfs = ipfsClient('localhost', '5002', { protocol: 'http' });

let ipfsPrefix = "https://ipfs.infura.io:5001/api/v0/cat?arg=";
// let ipfsPrefix = "http://localhost:5002/ipfs/";
let web3, accounts, courseList;

// web3 = new Web3('ws://localhost:8545');

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
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const buffer = Buffer.from(reader.result);
      console.log(reader.result);
      const res = await ipfs.add(buffer); // 上传
      hide();
      resolve(res[0].hash);
    }
  });
}

function saveJsonToIpfs(data) {
  return new Promise(async (resolve, reject) => {
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

  console.log('合约部署到的地址：', courseList, courseList.methods, courseList.address, res);

  // const res = await courseList.methods.getDetail().call({
  //   from: accounts[0]
  // });  
})();

async function getCourseByAddress(address) {
  return await new web3.eth.Contract(Imooc.Course.abi, address);
}

export { 
  ipfs, 
  ipfsPrefix, 
  saveImageToIpfs, 
  web3, 
  courseList, 
  getCourseByAddress, 
  saveJsonToIpfs,
  getJsonFromIpfs 
};