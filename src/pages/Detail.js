import React from 'react';
import { web3, getCourseByAddress, saveImageToIpfs, ipfsPrefix  } from '../config';
import { Button, Badge, Form, Row, Col, Upload } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.match.params.address,
      name: "react", 
      content: "精通react", 
      target: "40000000000000000000", 
      fundingPrice: "1000000000000000000", 
      price: "2000000000000000000", 
      img: "QmQafQHMWG1cDLUvvHUYavBjD4LcDcnxa1tUBHZ6DxC2bE", 
      video: "video", 
      count: 0, 
      isOnline: false, 
      role: 1
    };
    this.init();
  }

  init = async () => {
    const [account] = await web3.eth.getAccounts();
    console.log("当前账号", account);
    const course = await getCourseByAddress(this.state.address);
    const res = await course.methods.getDetail().call({
      from: account
    });
    console.log(res);
    let [name, content, price, fundingPrice, target, img, video,  isOnline, count, role] = Object.values(res);
    this.setState({
      account,
      name,
      content,
      img,
      video,
      count,
      isOnline,
      role,
      target: web3.utils.fromWei(target),
      fundingPrice: web3.utils.fromWei(fundingPrice),
      price: web3.utils.fromWei(price)
    });
    console.log("role", this.state.role);
  }
  buyCourse = async () => {
    const contract = await getCourseByAddress(this.state.address);
    const buyPrice = this.state.isOnline ? this.state.price : this.state.fundingPrice;

    await contract.methods.buy().send({
      from: this.state.account,
      value: web3.utils.toWei(buyPrice),
      gas: 6000000
    });
    this.init();
  }
  handleUpload = async (file) => {
    const hash = await saveImageToIpfs(file);

    const course = await getCourseByAddress(this.state.address);
    await course.methods.addVideo(hash).send({
      from: this.state.account,
      gas: 6000000
    });
    this.setState({
      video: hash
    });
    console.log("视频上传成功", hash);    
    this.init();
  }
  render() {
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 10
      }
    };
    return <Row type="flex" justify="center" style={{marginTop: "30px"}}>
      <Col span={20}>
        <Form>
          <FormItem {...formItemLayout} label="课程名">{this.state.name}</FormItem>
          <FormItem {...formItemLayout} label="课程简介">{this.state.content}</FormItem>
          <FormItem {...formItemLayout} label="众筹目标">{this.state.target} ETH</FormItem>
          <FormItem {...formItemLayout} label="众筹价格">{this.state.fundingPrice} ETH</FormItem>
          <FormItem {...formItemLayout} label="上线价格">{this.state.price} ETH</FormItem>
          <FormItem {...formItemLayout} label="支持人数">{this.state.count}</FormItem>
          <FormItem {...formItemLayout} label="状态">
            { this.state.isOnline ? <Badge count="已上线"></Badge> : <Badge count="众筹中"></Badge> }
          </FormItem>
          <FormItem {...formItemLayout} label="身份">
            {
              this.state.role === "0" && 
              <Upload beforeUpload={this.handleUpload} showUploadList={false}>
                <Button>上传视频</Button>
              </Upload>
            }
            {
              this.state.role === "1" && "已购买"
            }
            {
              this.state.role === "2" && "学员"
            }                        
          </FormItem>

          <FormItem {...formItemLayout} label="视频状态">
            {this.state.video ? (
              this.state.role === "2" ? "已上传" : <video controls width="300px" src={`${ipfsPrefix}${this.state.video}`}></video>
            ) : "等待视频上传" }
          </FormItem>
          <FormItem {...formItemLayout} label="视频状态">
            {
              this.state.role == 2 && (
                <Button onClick={this.buyCourse}>
                  支持 { this.state.isOnline ? this.state.price : this.state.fundingPrice }
                </Button>
              ) 
            }
          </FormItem>
        </Form>
      </Col>
    </Row>
  }
}

export default Detail;