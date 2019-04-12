import React from 'react';
import { web3, getCourseByAddress, saveImageToIpfs, ipfsPrefix  } from '../../config';
import { Button, Badge, Row, Col, Upload, Icon } from 'antd';
import './style.css';
class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.match.params.address ? this.props.match.params.address : '',
    };
    this.init();
  }

  init = async () => {
    const [account] = await web3.eth.getAccounts();
    const course = await getCourseByAddress(this.state.address);
    this.setState({
      course: course
    });
    const res = await this.state.course.methods.getDetail().call({
      from: account
    });
    let [name, content, price, fundingPrice, target, img, video,  isOnline, count, role] = Object.values(res);

    this.setState({
      account,
      name,
      content,
      img,
      video,
      count: count.toString(),
      isOnline,
      role: role.toString(),
      target: web3.utils.fromWei(target.toString()),
      fundingPrice: web3.utils.fromWei(fundingPrice.toString()),
      price: web3.utils.fromWei(price.toString())
    });
  }
  buyCourse = async () => {
    const contract = await getCourseByAddress(this.state.address);
    const buyPrice = this.state.isOnline ? this.state.price : this.state.fundingPrice;

    await contract.methods.buy().send({
      from: this.state.account,
      value: web3.utils.toWei(buyPrice),
      gas: 6000000
    }, () => {
      this.init();
    });
  }
  handleUpload = async (file) => {
    const hash = await saveImageToIpfs(file);

    // const course = await getCourseByAddress(this.state.address);
    await this.state.course.methods.addVideo(hash).send({
      from: this.state.account,
      gas: 5000000
    }, () => {
      this.init();
      this.setState({
        video: hash
      });
      console.log("视频上传成功", hash);  
    });
  }
  render() {
    return <Row type="flex" justify="center" style={{marginTop: "30px"}} className="detail">
      <Col span={20}>
          <h1 style={{textAlign: "center"}}>{this.state.name}</h1>
          <p style={{textAlign: "center"}}>{this.state.content}</p>

          <div className="wrapper">

            <span className="target"> { this.state.isOnline ? this.state.price : this.state.fundingPrice } ETH </span>
            <ul className="info-bar">
              <li>
                <span>众筹价格</span>
                <span className="nodistance"> {this.state.fundingPrice} ETH</span>
              </li>
              <span> | </span>
              <li>
                <span>上线价格</span>
                <span className="nodistance"> {this.state.price} ETH </span>
              </li>
              <span> | </span>
              <li>
                <span>学习人数</span>
                <span className="nodistance"> {this.state.count} </span>
              </li>
 
              <span className="buy-button">
                {
                  (this.state.role === '2') ? (
                    <span onClick={this.buyCourse}>
                      立即购买
                    </span>
                  ) : "已拥有"
                }
              </span>
            </ul>
            <ul className="info-bar">
              <li>
                <span>状态</span>
                { this.state.isOnline ? <Badge count="已上线" style={{background: "#52c41a"}}></Badge> : <Badge count="众筹中"></Badge> }
              </li>
              <li>
                <span>你的身份</span>
                  {
                  this.state.role === "0" && 
                    <Upload beforeUpload={this.handleUpload} showUploadList={false}>
                      <Button>上传视频</Button>
                    </Upload>
                  }
                  {
                    this.state.role === "1" && "已购买学员"
                  }
                  {
                    this.state.role === "2" && "未购买学员"
                  } 
              </li>              
            </ul>
          </div>

          <div className="video">
            {this.state.video ? (
              this.state.role === "2" ? 
                <span><Icon type="play-circle" />讲师已上传视频，请购买后观看</span> 
                  : <video controls width="300px" src={`${ipfsPrefix}${this.state.video}`}></video>
            ) : <span><Icon type="play-circle" />等待讲师上传视频</span> }
          </div>
      </Col>
    </Row>
  }
}

export default Detail;