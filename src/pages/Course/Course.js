import React from 'react';
import { Button, Col, Badge, Switch, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { ipfsPrefix, web3, imooc, getCourseByAddress } from '../../config';
import './style.css';
class Course extends React.Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      detailList: [],
      addressList: [], 
      account: '',
      isAdmin: false,
      showAll: true,
      showLoading: "visible"
    }
  }
  init = async () => {
    const [account] = await web3.eth.getAccounts(); 
    const addressList = await imooc.methods.getCourses().call({
      from: account
    });

    const isAdmin = await imooc.methods.isAdmin().call({
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
      isAdmin: isAdmin,
      account: account
    });
  }

  removeCourse = async (i) => {
    try {
      await imooc.methods.removeCourse(i).send({
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
          <Switch 
            onChange={this.onChangeSwitch} 
            checkedChildren="全部" 
            unCheckedChildren="已上线"
            defaultChecked
            style={{margin: "20px"}}
          ></Switch>
        </div>
        <div>
          {
            this.state.addressList.length !== 0 ? 
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
                    <div className="course-content" key={`${img}${index}`} style={{margin: "10px"}}>
                      <div style={{ margin: "10px" }}>
                        <p className="course-name" style={{ margin: "10px" }}>{name}</p>
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
                          {
                            isOnline && fundingPrice === '0' && target === '0' ? 
                            <p>非众筹课程，直接上线</p> :
                            <p>目标<span style={{color: "#f01414"}}>{target.toString()}</span>ETH, 已有<span style={{color: "#f01414"}}>{count.toString()}</span>人支持。</p>
                          }

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
                            this.state.isAdmin ? 
                              <Button type="danger" style={{margin: "5px"}} onClick={() => this.removeCourse(index)}>删除课程</Button> : null
                          }

                      </div>                  
                    </div>
                );
              }) :
              <div style={{margin: "20px"}}>网站暂时没有课程哦~</div>
          }
        </div>
      </div>
  }
}

export default Course;