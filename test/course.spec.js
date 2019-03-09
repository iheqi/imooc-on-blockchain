const path = require('path');
const assert = require('assert');

const Web3 = require('web3');
// const ganache = require('ganache-cli');

const web3 = new Web3('ws://localhost:8545');
const Imooc = require(path.resolve(__dirname, '../src/compiled/Imooc.json'));

let accounts;
let courseList; 
let courses;

describe('测试课程', () => {
  before(async () => {
    accounts = await web3.eth.getAccounts();
    courseList = await new web3.eth.Contract(Imooc.CourseList.abi, accounts[0]);

    await courseList.deploy({
      data: Imooc.CourseList.evm.bytecode.object
    }).send({
      from: accounts[0],
      gas: 5000000
    });

  });

  it('合约部署成功', async () => {
    console.log(courseList.options.address);
    assert.ok(courseList.options.address);
  });

  it('测试添加课程', async () => {
    await courseList.methods.createCourse(
      'vue course',
      'vue教程',
      web3.utils.toWei('8'),
      web3.utils.toWei('2'),
      web3.utils.toWei('4'),
      '图片hash1'
    ).send({
      from: accounts[0],
      gas: 5000000
    });
  
    await courseList.methods.createCourse(
      'react course',
      'react教程',
      web3.utils.toWei('8'),
      web3.utils.toWei('2'),
      web3.utils.toWei('4'),
      '图片hash1'
    ).send({
      from: accounts[0],
      gas: 5000000
    });

    courses = await courseList.methods.getCourses().call();
    console.log(courses);
  });

  it('获取课程的属性', async () => {
    const vueCourse = await new web3.eth.Contract(Imooc.Course.abi, courses.split(',')[0]);
    let name = await vueCourse.methods.name().call();
    let content = await vueCourse.methods.content().call();
    let target = await vueCourse.methods.target().call();
    let fundingPrice = await vueCourse.methods.fundingPrice().call();
    let price = await vueCourse.methods.price().call();
    let img = await vueCourse.methods.img().call();
    let video = await vueCourse.methods.video().call();
    let count = await vueCourse.methods.count().call();
    let isOnline = await vueCourse.methods.isOnline().call();
        
    console.log(name, content, target, fundingPrice, price, img, video, count, isOnline);
  });
  
  it('删除课程', async () => {
    // await courseList.methods.createCourse('react course').send({
    //   from: accounts[0],
    //   gas: 5000000
    // });  
    // courses = await courseList.methods.getCourses().call();
    // console.log(courses);
    try {
      await courseList.methods.removeCourse(0).send({
        from: accounts[0],
        gas: 5000000
      });
    } catch (error) {
      console.log(error);
    }

    courses = await courseList.methods.getCourses().call();
    console.log(courses);
  });

  it('是否ceo', async () => {
    const isCeo1 = await courseList.methods.isCeo().call({
      from: accounts[0]
    });
    const isCeo2 = await courseList.methods.isCeo().call({
      from: accounts[1]
    });    
    console.log(isCeo1, isCeo2);
  });
});