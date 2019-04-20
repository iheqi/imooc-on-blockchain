import React from 'react';
import { Button, Col, Badge, Switch, Icon, Input } from 'antd';
import { Link } from 'react-router-dom';
import { ipfsPrefix, web3, imooc, getCourseByAddress } from '../../config';
class Course extends React.Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      teacher: "",
      teachers: [],
      account: '',
      isAdmin: false,
      showAll: true,
      showLoading: "visible"
    }
  }
  init = async () => {
    const [account] = await web3.eth.getAccounts(); 
    const teachers = await imooc.methods.getTeachers().call({
      from: account
    });

    console.log(teachers);
    const isAdmin = await imooc.methods.isAdmin().call({
      from: account
    });


    this.setState({
      // teachers,
      isAdmin: isAdmin,
      account: account
    });
  }

  addTeacher = async () => {
    await imooc.methods.addTeacher(this.state.teacher).send({
      from: this.state.account,
      gas: 5000000
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

  handleTeacherChange = (e) => {
    this.setState({
      teacher: e.target.value
    });
  }

  render() {
    return <div>
        <div>
          <Input onChange={this.handleTeacherChange} value={this.state.teacher}></Input>
          <Button onClick={this.addTeacher}>添加讲师</Button>
        </div>
        <div>
          {
            this.state.teachers.length !== 0 ? 
              this.state.teachers.map((item, index) => {
                return (
                  <Col key={`${item}${index}`} span={6} style={{padding: "10px"}}>
                  </Col>
                );
              }) :
              <div style={{margin: "20px"}}>网站暂时没有讲师哦~</div>
          }
        </div>
      </div>
  }
}

export default Course;