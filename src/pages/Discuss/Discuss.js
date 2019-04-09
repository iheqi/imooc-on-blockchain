import React, { Component } from 'react';
import './style.css';
import { Button, Modal, Input } from 'antd';
import { web3, courseList, saveJsonToIpfs } from '../../config';

class Discuss extends Component {
  constructor(props) {
    super(props);

    console.log(this.props.location.query);
    this.state = {
      question: this.props.location.query,
      showReplyModal: false,
      answer: '',
      ansIndex: this.props.match.params.id
    };
    this.init();
  }

  init = async () => {
    let [account] = await web3.eth.getAccounts();
    this.setState({
      account
    });
  }
  handleReplyOk = async () => {
    const item = JSON.parse(JSON.stringify(this.state.question));
    item.answers.push({
      text: this.state.answer
    });
    const hash = await saveJsonToIpfs(item);
    const hash1 = web3.utils.asciiToHex(hash.slice(0, 23), 23);
    const hash2 = web3.utils.asciiToHex(hash.slice(23), 23);
    console.log(hash);
    await courseList.methods.updateQa(this.state.ansIndex, hash1, hash2).send({
      from: this.state.account,
      gas: 5000000
    });
    this.init();
    this.handleReplyCancel();
  }
  handleReplyCancel = () => {
    this.setState({
      showReplyModal: false,
      answer: ''
    });
  }

  handleAnsChange = (e) => {
    this.setState({
      answer: e.target.value
    });
  }


  showModal = () => {
    this.setState({
      showReplyModal: true
    });
  }

  render() {
    return (
      <div>
        <div className="discuss-header">
          <h1>{this.state.question.title}</h1>
          <p>{this.state.question.content}</p>
        </div>

        <div>
          <div className="ans-list-header">
            <span className="count">{this.state.question.answers.length}条回复</span>
            <Button onClick={this.showModal} type="primary">回复</Button>
          </div>
          {
            this.state.question.answers.map((ans, index) => {
              return <div 
                className="ans-item"
                key={ans.text}>
                {ans.text}
                <span className="ans-floor">{index+1}#</span>
              </div>
            })
          }

          <div className="editor-box">
            <Input.TextArea 
              rows={6}
              value={this.state.answer}
              onChange={this.handleAnsChange}
              placeholder="你可以畅所欲言"
            ></Input.TextArea>
            <Button onClick={this.handleReplyOk} type="primary" style={{float: "right"}}>回复</Button>
          </div>
        </div> 

        <Modal
          title="回复"
          visible={this.state.showReplyModal}
          onOk={this.handleReplyOk}
          onCancel={this.handleReplyCancel}
          okText="确定"
          cancelText="取消"
        >
          <Input value={this.state.answer} onChange={this.handleAnsChange}></Input>
        </Modal>                 
      </div>
    )
  }
}

export default Discuss;

