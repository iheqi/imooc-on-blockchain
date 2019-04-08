const path = require('path');
const Web3 = require('web3');
const HdWalletProvider = require('truffle-hdwallet-provider'); 
const fs = require('fs');
const Imooc = require(path.resolve(__dirname, '../src/compiled/Imooc.json'));

const mnemonic = 'science bean fancy school actor suggest behind soul flip easy chicken excite';
const url = 'https://ropsten.infura.io/v3/141596ddce424580b319a3ce69a983ed';
const provider = new HdWalletProvider(mnemonic, url);


const web3 = new Web3(provider);

(async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('合约部署的账号: ', accounts); // 由密钥而获取到的账号

  // console.log(Imooc);

  const courseList = await new web3.eth.Contract(Imooc.CourseList.abi, accounts[0]);

  const result = await courseList.deploy({
    data: Imooc.CourseList.evm.bytecode.object
  })
  .send({
    from: accounts[0],
    gas: 5000000
  });  
  console.log('合约部署到的地址：', result.options.address);

})();

// const contractAddress = "0x34328243A5Fd599524575b916c61926185b6EFA9";
// const addressFile = path.resolve(__dirname, '../src/address.js');
// fs.writeFileSync(addressFile, `export default ${JSON.stringify(contractAddress)};`);