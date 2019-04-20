import React from 'react';
import { Button, Badge, Icon, Input } from 'antd';
import { web3, imooc } from '../../config';
import "./style.css";

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      teacher: "",
      teachers: [],
      account: '',
      isAdmin: false,
    }
  }
  init = async () => {
    const [account] = await web3.eth.getAccounts(); 
    const teachers = await imooc.methods.getTeachers().call({
      from: account
    });

    const isAdmin = await imooc.methods.isAdmin().call({
      from: account
    });


    this.setState({
      teachers,
      isAdmin: isAdmin,
      account: account
    });

  }

  addTeacher = async () => {
    await imooc.methods.addTeacher(this.state.teacher).send({
      from: this.state.account,
      gas: 5000000
    }, () => {
      this.init();
    });
  }

  removeTeacher = async (i) => {
    try {
      await imooc.methods.removeTeacher(i).send({
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
        {
          !this.state.isAdmin ? <h2 style={{textAlign: "center", marginTop: "10px"}}>你不是管理员，无权操作此页面</h2> : null
        }
        <div className="add">
          <Input onChange={this.handleTeacherChange} value={this.state.teacher}
            placeholder="请输入要授权的讲师的地址"
            style={{width:"400px"}}
          ></Input>
          <Button 
            onClick={this.addTeacher} 
            type="primary" style={{marginTop: "8px", marginLeft:"5px"}}
            disabled={!this.state.isAdmin}>添加讲师</Button>
        </div>
        <div className="teacher-list">
          <h3 style={{textAlign: "center"}}>讲师列表</h3>
          {
            this.state.teachers.length !== 0 ? 
              this.state.teachers.map((item, index) => {
                return (
                  <div key={`${item}${index}`} style={{padding: "10px"}}>
                    <strong>{item}</strong>
                    <Button type="danger" onClick={() => {this.removeTeacher(index)}}
                      style={{float:"right"}}
                      disabled={!this.state.isAdmin}
                    >删除讲师</Button>
                  </div>
                );
              })
               :
              <div style={{margin: "20px"}}>网站暂时没有讲师哦~</div>
          }
        </div>
      </div>
  }
}

export default Course;