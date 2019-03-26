import ipfsClient from 'ipfs-http-client';
import Web3 from 'web3';
import { notification } from 'antd';
import Imooc from '../src/compiled/Imooc.json';

// let ipfs = ipfsClient("ipfs.infura.io", "5001", { protocol: "https" });
// let ipfsPrefix = "https://ipfs.infura.io:5001/ipfs/";

let ipfs = ipfsClient('localhost', '5002', { protocol: 'http' });
let ipfsPrefix = "http://localhost:5002/ipfs/";
let web3, accounts, courseList;

web3 = new Web3('ws://localhost:8545');

// if (window.web3) { // 如果是连接到infura, 则这样连接
//   web3 = new Web3(window.web3.currentProvider);
// } else {
//   notification.error({
//     message: '没有检测到以太坊插件',
//     description: '请先安装或激活MetaMask'
//   });
// }

function saveImageToIpfs(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const buffer = Buffer.from(reader.result);
      console.log(reader.result);
      const res = await ipfs.add(buffer); // 上传
      console.log(res);
      resolve(res[0].hash);
    }
  });
}

async function  deploy() {
  accounts = await web3.eth.getAccounts();
  courseList = await new web3.eth.Contract(Imooc.CourseList.abi, accounts[0]);

  // courseList = await new web3.eth.Contract(Imooc.CourseList.abi, address); // 如果部署到了infura, 那这个address就是部署成功时返回的address

  await courseList.deploy({
    data: Imooc.CourseList.evm.bytecode.object
  }).send({
    from: accounts[0],
    gas: 5000000
  });

  console.log('合约部署成功', courseList.options.address);
}

deploy();

export { ipfs, ipfsPrefix, saveImageToIpfs, web3, courseList };