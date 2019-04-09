import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, message, Input, Button, Comment, Badge, Modal } from 'antd';
import { web3, courseList, saveJsonToIpfs, getJsonFromIpfs } from '../../config';
import './style.css';

const FormItem = Form.Item;
class Qa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      title: '',
      content: '',
      ansIndex: 0,
      showQueryModal: false,
    }
    this.init();
  }

  init = async () => {
    let [account] = await web3.eth.getAccounts();
    const qas = await courseList.methods.getQa().call();
    const res = [];

    for (let i = 0; i < qas.length; i += 2) {
      res.push(getJsonFromIpfs(qas[i], qas[i + 1]));
      // getJsonFromIpfs(qas[i], qas[i + 1]);
    }
    const questions = await Promise.all(res);
    console.log(questions);
    this.setState({
      account,
      questions
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: this.state.title,
      content: this.state.content,
      answers: []
    }
    const hide = message.loading("提问中");
    const hash = await saveJsonToIpfs(data);
    const hash1 = hash.slice(0, 23);
    const hash2 = hash.slice(23);
    console.log(web3.utils.asciiToHex(hash1), web3.utils.asciiToHex(hash2));
    const [account] = await web3.eth.getAccounts();
    await courseList.methods.createQa(
      web3.utils.asciiToHex(hash1, 23),
      web3.utils.asciiToHex(hash2, 23)
    ).send({
      from: account,
      gas: 5000000
    });
    this.setState({
      title: '',
      content: ''
    });
    hide();
  }
  
  handleQueryCancel = () => {
    this.setState({
      showQueryModal: false,
    });
  }


  render() {
    return <Row justify="center">
      <div className="qa-header">
        <span className="text">分享与求助</span>
        <Button className="button" type="primary" onClick={()=> this.setState({showQueryModal: true})}>我要发布</Button>
      </div>
      <Col span={20} className="qa-list">
        {
          this.state.questions.map((item, index) => {
            return (
                
            <Link to={{ pathname: `/discuss/${index}`, query: this.state.questions[index] }} key={index}>
              <Comment
                author={item.title}
                content={item.content}
                avatar={<Badge count={index+1}></Badge>}
                className="qa-content"
              >
              </Comment>
            </Link>)
          })
        }
      </Col>
      <Modal
          title="发布问题"
          visible={this.state.showQueryModal}
          onOk={this.handleSubmit}
          onCancel={this.handleQueryCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form style={{marginTop: "20px"}}>
            <FormItem label="标题">
              <Input value={this.state.title} name="title" onChange={this.handleChange}></Input>
            </FormItem>

            <FormItem label="问题描述">
              <Input.TextArea 
                rows={6}
                value={this.state.content}
                name="content"
                onChange={this.handleChange}
              ></Input.TextArea>
            </FormItem>
          </Form>
        </Modal>    
    </Row>
  }
}

export default Qa;