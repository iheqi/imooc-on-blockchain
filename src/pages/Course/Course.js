import React from 'react';
import { Button, Row, Col, Badge, Switch, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { ipfsPrefix, web3, courseList, getCourseByAddress } from '../../config';
import './style.css';
class Course extends React.Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      detailList: [],
      addressList: [], 
      account: '',
      isCeo: false,
      showAll: true,
      showLoading: "visible"
    }
  }
  init = async () => {
    const [account] = await web3.eth.getAccounts(); 
    const addressList = await courseList.methods.getCourses().call({
      from: account
    });

    const isCeo = await courseList.methods.isCeo().call({
      from: account
    });

    const detailList = await Promise.all(
      addressList.map(async (address) => {
        const course = await getCourseByAddress(address);
        const res = await course.methods.getDetail().call();
        return res;
      })
    );

    console.log(detailList);

    this.setState({
      detailList: detailList,
      addressList: addressList,
      isCeo: isCeo,
      account: account
    });
  }

  removeCourse = async (i) => {
    try {
      await courseList.methods.removeCourse(i).send({
        from: this.state.account,
        gas: 5000000
      });
    } catch (error) {
      console.log(error);
    }

    this.init();
  }

  onChangeSwitch = (val) => {
    this.setState({
      showAll: val
    });
  }

  handleImgOnLoad = () => {
    this.setState({
      showLoading: "none"
    });
  }

  render() {
    return <div>
      <div>
        <div>
          <Switch 
            onChange={this.onChangeSwitch} 
            checkedChildren="全部" 
            unCheckedChildren="已上线"
            defaultChecked
            style={{margin: "20px"}}
          ></Switch>
        </div>
        {
          this.state.detailList.map((item, index) => {
            let [name, content, price, fundingPrice, target, img, video,  isOnline, count, role] = Object.values(item);
            if (!this.state.showAll && !isOnline) {
              return null;
            }

            target = web3.utils.fromWei(target.toString());
            fundingPrice = web3.utils.fromWei(fundingPrice.toString());
            price = web3.utils.fromWei(price.toString());
            const address = this.state.addressList[index];

            return (
              <Col key={`${img}${index}`} span={6} style={{padding: "10px"}}>
                <div className="course-content">
                  <div style={{ margin: "10px" }}>
                    <span style={{ margin: "10px" }}>{name}</span>
                    <span>
                      {
                        isOnline ? <Badge count="已上线" style={{background: "#52c41a"}}></Badge>
                          :
                        <Badge count="众筹中"></Badge>
                      }
                    </span>
                  </div>

                  <Icon type="loading" style={{display: this.state.showLoading}}/>
                  <img alt="img" className="item" src={`${ipfsPrefix}${img}`} onLoad={this.handleImgOnLoad}/>

                  <div className="center">
                      <p>
                        目标<span style={{color: "#f01414"}}>{target.toString()}</span>ETH, 已有<span style={{color: "#f01414"}}>{count.toString()}</span>人支持。
                      </p>

                      <p>
                        {
                          isOnline ? <Badge count={`上线价${price}ETH`} style={{background: "#52c41a"}}></Badge> :
                            <Badge count={`众筹价${fundingPrice}ETH`} style={{background: "#52c41a"}}></Badge>
                        }
                      </p>

                      <Button type="primary" style={{margin: "5px"}}>
                        <Link to={`/detail/${address}`}>查看详情</Link>
                      </Button>
                      
                      {
                        this.state.isCeo ? 
                          <Button type="danger" style={{margin: "5px"}} onClick={() => this.removeCourse(index)}>删除课程</Button> : null
                      }

                  </div>                  
                </div>
              </Col>
            );
          })
        }
      </div>
    </div>
  }
}

export default Course;