import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, Form, Input, Upload, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { saveImageToIpfs, ipfsPrefix, web3, courseList } from '../../config';

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "vue", 
      content: "精通vue", 
      target: "20000000000000000000", 
      fundingPrice: "1000000000000000000", 
      price: "2000000000000000000", 
      img: "QmQafQHMWG1cDLUvvHUYavBjD4LcDcnxa1tUBHZ6DxC2bE"
    }
  }

  handleSubmit = async (e) => {
    console.log(this.state);
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    console.log('accounts', accounts);
    const arr = [
      this.state.name,
      this.state.content,
      web3.utils.toWei(this.state.price),
      web3.utils.toWei(this.state.fundingPrice),
      web3.utils.toWei(this.state.target),
      this.state.img
    ];
    console.log(arr, courseList.methods.createCourse);

    await courseList.methods.createCourse(...arr).send({
      from: accounts[0],
      gas: 5000000
    }, (error, hash) => {
      console.log(error, hash);
    });
    console.log('创建课程成功');
    this.setState({
      toHomePage: true
    });
  }

  handleUpload = async (file) => {
    const hash = await saveImageToIpfs(file);
    console.log(hash);
    this.setState({
      img: hash
    });
    return false;
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    if (this.state.toHomePage) {
      return <Redirect to="/"></Redirect>
    }
    return (
      <Row 
        type="flex" 
        justify="center" 
        style={{marginTop: "30px"}}
      >
        <Col span={20}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="课程名">
              <Input name="name" onChange={this.onChange}></Input>
            </FormItem>
            <FormItem label="课程详情">
              <Input.TextArea row={6} name="content" onChange={this.onChange}></Input.TextArea>
            </FormItem>  
            <FormItem label="课程封面">
              <Upload beforeUpload={this.handleUpload} showUploadList={false}>
                {
                  this.state.img ? 
                    <img height="100px" src={`${ipfsPrefix}${this.state.img}`} alt="课程封面"/>
                      :
                    <Button>上传图片</Button>
                }
              </Upload>
            </FormItem>  
            <FormItem label="众筹目标">
              <Input name="target" onChange={this.onChange}></Input>
            </FormItem>          
            <FormItem label="众筹价格">
              <Input name="fundingPrice" onChange={this.onChange}></Input>
            </FormItem>
            <FormItem label="上线价格">
              <Input name="price" onChange={this.onChange}></Input>
            </FormItem>
            <FormItem>
              <Button htmlType="submit">添加课程</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Create;