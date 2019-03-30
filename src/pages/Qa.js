import React from 'react';
import { Form, Row, Col, message, Input, Button, Comment, Badge, Modal } from 'antd';
import { web3, courseList, saveJsonToIpfs, getJsonFromIpfs } from '../config';

const FormItem = Form.Item;
class Qa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      title: '',
      content: '',
      ansIndex: 0,
      showModal: false,
      answer: ''
    }
    // this.init();
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

  showInfoModal = (i) => {
    this.setState({
      ansIndex: i,
      showModal: true
    });
  }

  handleOk = async (e) => {
    const item = this.state.questions[this.state.ansIndex];
    item.answers.push({
      text: this.state.answer
    });
    const hash = await saveJsonToIpfs(item);
    const hash1 = web3.utils.asciiToHex(hash.slice(0, 23), 23);
    const hash2 = web3.utils.asciiToHex(hash.slice(23), 23);
    await courseList.methods.updateQa(this.state.ansIndex, hash1, hash2).send({
      from: this.state.account,
      gas: 5000000
    });
    this.init();
    this.handleCancel();
  }
  handleCancel = () => {
    this.setState({
      showModal: false,
      answer: ''
    });
  }
  handleAnsChange = (e) => {
    this.setState({
      answer: e.target.value
    });
  }

  render() {
    return <Row justify="center">
      <Button onClick={this.init}>init</Button>
      <Col span={20}>
        {
          this.state.questions.map((item, index) => {
            return <Comment
              actions={[<span onClick={() => this.showInfoModal(index)}>回复</span>]}
              author={item.title}
              content={item.content}
              avatar={<Badge count={index+1}></Badge>}
              key={index}
            >
              {
                item.answers.map((ans) => {
                  return <Comment 
                    key={ans.text}
                    content={ans.text}>
                  </Comment>
                })
              }
            </Comment>
          })
        }
        <Form onSubmit={this.handleSubmit} style={{marginTop: "20px"}}>
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

          <FormItem>
            <Button htmlType="submit">提交</Button>
          </FormItem>
        </Form>

        <Modal
          title="回复"
          visible={this.state.showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          <Input value={this.state.answer} onChange={this.handleAnsChange}></Input>
        </Modal>
      </Col>
    </Row>
  }
}

export default Qa;