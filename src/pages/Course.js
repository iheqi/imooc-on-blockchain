import React from 'react';
import { Button } from 'antd';
import { ipfsPrefix, web3, courseList, getCourseByAddress } from '../config';

class Course extends React.Component {
  constructor(props) {
    super(props);
  }
  async init() {
    const list = await courseList.methods.getCourses().call();
    console.log(list);
    const course = await getCourseByAddress(list[0]);
    const res = await course.methods.getDetail().call();
    console.log(res);
  }
  render() {
    return <div>
      <Button onClick={this.init}></Button>
    </div>
  }
}

export default Course;