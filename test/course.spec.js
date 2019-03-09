const path = require('path');
const assert = require('assert');

const Web3 = require('web3');
// const ganache = require('ganache-cli');

const web3 = new Web3('ws://localhost:8545');
const Imooc = require(path.resolve(__dirname, '../src/compiled/Imooc.json'));

let accounts;
let courseList; 

describe('测试课程', () => {
  before(async () => {
    accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    courseList = await new web3.eth.Contract(Imooc.CourseList.abi, accounts[0]);

    await courseList.deploy({
      data: Imooc.CourseList.evm.bytecode.object
    }).send({
      from: accounts[0],
      gas: 5000000
    });

  });

  it('合约部署成功', async () => {
    assert.ok(courseList.options.address);
  });

  it('测试添加课程', async () => {
      await courseList.methods.createCourse('vue course').send({
        from: accounts[0],
        gas: 5000000
      });
      await courseList.methods.createCourse('react course').send({
        from: accounts[0],
        gas: 5000000
      });    
      const courses = await courseList.methods.getCourses().call();
      console.log(typeof courses, courses);
  });
  
});