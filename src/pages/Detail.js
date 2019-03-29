import React from 'react';
import { web3, getCourseByAddress  } from '../config';
import { Button, Badge, Form, Row, Col } from 'antd';
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
    // this.init();
  }

  init = async () => {
    const [account] = await web3.eth.getAccounts();
    const course = await getCourseByAddress(this.state.address);
    const res = await course.methods.getDetail().call();
    let [name, content, target, fundingPrice, price, img, video, count, isOnline, role] = Object.values(res);

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

  }
  buyCourse = () => {

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
              this.state.role == 0 && "上传视频"
            }
            {
              this.state.role == 1 && "已购买"
            }
            {
              this.state.role == 2 && "学员"
            }                        
          </FormItem>

          <FormItem {...formItemLayout} label="视频状态">
            {this.state.video ? "视频播放" : "等待视频上传" }
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