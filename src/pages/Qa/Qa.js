import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, message, Input, Button, Modal, Icon } from 'antd';
import { web3, imooc, saveJsonToIpfs, getJsonFromIpfs } from '../../config';
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
    const qas = await imooc.methods.getQa().call();
    const res = [];

    for (let i = 0; i < qas.length; i += 2) {
      res.push(getJsonFromIpfs(qas[i], qas[i + 1]));
    }
    const questions = await Promise.all(res);
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
    const date = new Date();
    const day = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const data = {
      author: `用户${this.state.account.slice(-7)}`,
      title: this.state.title,
      content: this.state.content,
      day: day,
      time: time,
      answers: []
    }
    const hide = message.loading("提问中");
    const hash = await saveJsonToIpfs(data);
    const hash1 = hash.slice(0, 23);
    const hash2 = hash.slice(23);
    console.log(web3.utils.asciiToHex(hash1), web3.utils.asciiToHex(hash2));
    const [account] = await web3.eth.getAccounts();
    await imooc.methods.createQa(
      web3.utils.asciiToHex(hash1, 23),
      web3.utils.asciiToHex(hash2, 23)
    ).send({
      from: account,
      gas: 5000000
    }, () => {
      this.setState({
        title: '',
        content: ''
      });
      hide();
      this.init();
    });
  }

  handleQueryCancel = () => {
    this.setState({
      showQueryModal: false,
    });
  }

  render() {
    return <Row justify="center">
      <div className="qa-header">
        <span className="text">
          <Icon type="question-circle" style={{marginRight: "6px"}} />分享与求助
        </span>
        <Button className="button" type="primary" onClick={()=> this.setState({showQueryModal: true})}>我要发布</Button>
      </div>
      <div className="qa-list">
        {
          this.state.questions.length !== 0 ?
          this.state.questions.map((item, index) => {
            return (
                
            <Link to={{ pathname: `/discuss/${index}`, query: this.state.questions[index] }} key={index}>
              <div className="qa-content">
                <span className="title">{item.title}</span>
                <p>{item.content}</p>
                <span>{item.author} 
                  <span className="day"> 发表于 {item.day}</span>
                </span>
                <span className="reply"><Icon type="message" /> {item.answers.length}</span>
              </div>
            </Link>)
          }) : 
          <p>暂时没有人发表问答哦，点击“我要发布”进行发帖吧~</p>
        }
      </div>
      <Modal
          title="发布问题"
          visible={this.state.showQueryModal}
          onOk={this.handleSubmit}
          onCancel={this.handleQueryCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form style={{marginTop: "10px"}}>
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