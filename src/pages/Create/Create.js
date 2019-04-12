import React from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, Form, Input, Upload, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { saveImageToIpfs, ipfsPrefix, web3, courseList } from '../../config';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;
class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "", 
      content: "", 
      target: "", 
      fundingPrice: "", 
      price: "", 
      img: ""
    }
  }

  handleSubmit = async (e) => {
    console.log(this.state);
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => { // 验证是异步的
      if (err) {
        return;
      } 
      const accounts = await web3.eth.getAccounts();
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
        console.log('创建课程成功');
        this.setState({
          toHomePage: true
        });
      });
    });
  }

  handleOnlineSubmit = async (e) => {
    console.log(this.state);
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      console.log(!!err);

      if (err) {
        return;
      }
      const accounts = await web3.eth.getAccounts();
      const arr = [
        this.state.name,
        this.state.content,
        web3.utils.toWei(this.state.price),
        this.state.img
      ];
      console.log(arr);
  
      await courseList.methods.createOnlineCourse(...arr).send({
        from: accounts[0],
        gas: 5000000
      }, () => {
        console.log('创建课程成功');
        this.setState({
          toHomePage: true
        });
      });      
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

  // handleTabChange = () => {
  //   this.setState({
  //     name: "", 
  //     content: "", 
  //     target: "", 
  //     fundingPrice: "", 
  //     price: "", 
  //     img: ""
  //   });
  //   console.log(this.state);

  // }

  render() {
    if (this.state.toHomePage) {
      return <Redirect to="/"></Redirect>
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
        <TabPane tab="直接创建" key="1">
          <Row 
            type="flex" 
            justify="center" 
            style={{marginTop: "30px"}}
          >

            <Col span={20}>
              <Form onSubmit={this.handleOnlineSubmit}>
                <FormItem label="课程名">
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '请输入课程名!' },
                    ],
                    initialValue: this.state.name
                  })(
                    <Input name="name" onChange={this.onChange}></Input>
                  )}
                </FormItem>
                <FormItem label="课程详情">
                  {getFieldDecorator('content', {
                    rules: [
                      { required: true, message: '请输入课程详情!' },
                    ],
                    initialValue: this.state.content
                  })(
                    <Input.TextArea row={6} name="content" onChange={this.onChange}></Input.TextArea>
                  )}                
                </FormItem>  
                <FormItem label="课程封面">
                  {getFieldDecorator('img', {
                    rules: [
                      { required: true, message: '请输入选择一张图片作为封面!' },
                    ],
                  })(
                    <Upload beforeUpload={this.handleUpload} showUploadList={false}>
                      {
                        this.state.img ? 
                          <img height="100px" src={`${ipfsPrefix}${this.state.img}`} alt="课程封面"/>
                            :
                          <Button>上传图片</Button>
                      }
                    </Upload>
                  )}                 

                </FormItem>  
                <FormItem label="上线价格">
                  {getFieldDecorator('price', {
                    rules: [
                      { required: true, message: '请输入课程上线价格!' },
                    ],
                    initialValue: this.state.price
                  })(
                    <Input name="price" onChange={this.onChange}></Input>
                  )}                  
                </FormItem>
                <FormItem>
                  <Button htmlType="submit">添加课程</Button>
                </FormItem>
              </Form>
            </Col>
          </Row>        
        </TabPane>
        <TabPane tab="我要众筹" key="2">
          <Row 
            type="flex" 
            justify="center" 
            style={{marginTop: "30px"}}
          >

            <Col span={20}>
              <Form onSubmit={this.handleSubmit}>
                <FormItem label="课程名">
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '请输入课程名!' },
                  ],
                  initialValue: this.state.name
                })(
                  <Input name="name" onChange={this.onChange}></Input>
                )}
                </FormItem>
                <FormItem label="课程详情">
                  {getFieldDecorator('content', {
                    rules: [
                      { required: true, message: '请输入课程详情!' },
                    ],
                    initialValue: this.state.content
                  })(
                    <Input.TextArea row={6} name="content" onChange={this.onChange}></Input.TextArea>
                  )}                
                </FormItem>  
                <FormItem label="课程封面">
                  {getFieldDecorator('img', {
                    rules: [
                      { required: true, message: '请输入选择一张图片作为封面!' },
                    ],
                  })(
                    <Upload beforeUpload={this.handleUpload} showUploadList={false}>
                      {
                        this.state.img ? 
                          <img height="100px" src={`${ipfsPrefix}${this.state.img}`} alt="课程封面"/>
                            :
                          <Button>上传图片</Button>
                      }
                    </Upload>
                  )}                 

                </FormItem>  
                <FormItem label="众筹目标">
                  <Input name="target" onChange={this.onChange}></Input>
                </FormItem>          
                <FormItem label="众筹价格">
                  <Input name="fundingPrice" onChange={this.onChange}></Input>
                </FormItem>
                <FormItem label="上线价格">
                  {getFieldDecorator('price', {
                    rules: [
                      { required: true, message: '请输入课程上线价格!' },
                    ],
                    initialValue: this.state.price
                  })(
                    <Input name="price" onChange={this.onChange}></Input>
                  )}                  
                </FormItem>
                <FormItem>
                  <Button htmlType="submit">添加课程</Button>
                </FormItem>
              </Form>
            </Col>
          </Row>        
        </TabPane>
      </Tabs>

    );
  }
}

const WrappedDynamicRule = Form.create({ name: 'form' })(Create);

export default WrappedDynamicRule;