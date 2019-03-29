import React from 'react';
import { Form, Row, Col, message, Input, Button } from 'antd';
import { web3, courseList, saveJsonToIpfs } from '../config';

const FormItem = Form.Item;
class Qa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    }
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
  render() {
    return <Row justify="center">
      <Col span={20}>
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
      </Col>
    </Row>
  }
}

export default Qa;