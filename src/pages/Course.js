import React from 'react';
import { Button, Row, Col } from 'antd';
import { ipfsPrefix, web3, courseList, getCourseByAddress } from '../config';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailList: [],
      account: ''
    }
  }
  init = async () => {
    const addressList = await courseList.methods.getCourses().call();
    // console.log(addressList);

    const detailList = await Promise.all(
      addressList.map(async (address) => {
        const course = await getCourseByAddress(address);
        const res = await course.methods.getDetail().call();
        return res;
      })
    );

    console.log(detailList);
    this.setState({
      detailList: detailList
    });
  }
  render() {
    return <div>
      <Button onClick={this.init}>init</Button>
      <Row>
        {
          this.state.detailList.map((item) => {
            const [name, content, target, fundingPrice, price, img, video, count, isOnline, isRole] = Object.values(item);
            return (
              <Col key={img}>
                {name}
              </Col>
            );
          })
        }
      </Row>
    </div>
  }
}

export default Course;