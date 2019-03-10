const path = require('path');
const assert = require('assert');
const BigNumber = require('bignumber.js');
const Web3 = require('web3');
// const ganache = require('ganache-cli');

const web3 = new Web3('ws://localhost:8545');
const Imooc = require(path.resolve(__dirname, '../src/compiled/Imooc.json'));

let accounts;
let courseList; 
let courses;

describe('测试', () => {
  before(async () => {
    // accounts[0]: ceo
    // accounts[1]: 课程创建者
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
      web3.utils.toWei('4'), // 上线价
      web3.utils.toWei('2'), // 众筹价
      web3.utils.toWei('8'), // 众筹目标
      '图片hash1'
    ).send({
      from: accounts[1],
      gas: 5000000
    });
  
    await courseList.methods.createCourse(
      'react course',
      'react教程',
      web3.utils.toWei('4'), // 上线价
      web3.utils.toWei('2'), // 众筹价
      web3.utils.toWei('8'), // 众筹目标
      '图片hash1'
    ).send({
      from: accounts[1],
      gas: 5000000
    });

    courses = await courseList.methods.getCourses().call();
    console.log(courses);
  });

  it('获取课程的属性', async () => {
    const vueCourse = await new web3.eth.Contract(Imooc.Course.abi, courses[0]);
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

  it('测试课程购买', async () => {
    const vueCourse = await new web3.eth.Contract(Imooc.Course.abi, courses[0]);

    await vueCourse.methods.buy().send({
      from: accounts[2],
      value: web3.utils.toWei('2')
    });

    const value = await vueCourse.methods.users(accounts[2]).call();
    console.log(value);

    const detail1 = await vueCourse.methods.getDetail().call(); // 默认是课程创建者owner调用??
    console.log(detail1);

    const detail2 = await vueCourse.methods.getDetail().call({from: accounts[2]}); // 购买者
    console.log(detail2);

    const detail3 = await vueCourse.methods.getDetail().call({from: accounts[3]}); // 未购买者
    console.log(detail3);    
  });

  it('测试上线逻辑', async () => {
    const vueCourse = await new web3.eth.Contract(Imooc.Course.abi, courses[0]);
    const oldBalance = new BigNumber(await web3.eth.getBalance(accounts[1]));

    await vueCourse.methods.buy().send({
      from: accounts[3],
      value: web3.utils.toWei('2')
    });

    const newBalance = new BigNumber(await web3.eth.getBalance(accounts[1]));
    console.log(oldBalance, newBalance);
  });
  it('未上线不可上传视频', async () => {
    const vueCourse = await new web3.eth.Contract(Imooc.Course.abi, courses[0]);

    try {
      await vueCourse.methods.addVideo('video hash').send({
        from: accounts[1],
        gas: 5000000
      });
    } catch (error) {
      console.log(error.name);
    }

    const video = await vueCourse.methods.video().call();
    console.log(video);

  });
  it('达到众筹目标', async () => {
    const vueCourse = await new web3.eth.Contract(Imooc.Course.abi, courses[0]);
    const oldBalance = new BigNumber(await web3.eth.getBalance(accounts[1]));

    await vueCourse.methods.buy().send({
      from: accounts[4],
      value: web3.utils.toWei('2')
    });

    await vueCourse.methods.buy().send({ // 此时已经达到
      from: accounts[5],
      value: web3.utils.toWei('2')
    });    

    const newBalance = new BigNumber(await web3.eth.getBalance(accounts[1]));
    console.log(oldBalance, newBalance);   
  });

  it('上线后必须以上线价格购买，然后分成', async () => {
    const vueCourse = await new web3.eth.Contract(Imooc.Course.abi, courses[0]);
    const oldBalance0 = new BigNumber(await web3.eth.getBalance(accounts[0]));
    const oldBalance1 = new BigNumber(await web3.eth.getBalance(accounts[1]));
    console.log(oldBalance0, oldBalance1);
    await vueCourse.methods.buy().send({ 
      from: accounts[6],
      value: web3.utils.toWei('4') // 4
    });  

    const newBalance0 = new BigNumber(await web3.eth.getBalance(accounts[0]));
    const newBalance1 = new BigNumber(await web3.eth.getBalance(accounts[1]));  
    console.log(newBalance0 - oldBalance0, newBalance1 - oldBalance1);

  });


  it('已上线后，可上传视频了', async () => {
    const vueCourse = await new web3.eth.Contract(Imooc.Course.abi, courses[0]);

    try {
      await vueCourse.methods.addVideo('video hash').send({
        from: accounts[1],
        gas: 5000000
      });
    } catch (error) {
      console.log(error.name);
    }

    const video = await vueCourse.methods.video().call();
    console.log(video);

  });
});