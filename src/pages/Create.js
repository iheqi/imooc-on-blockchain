import React from 'react';
import { Row, Col, Form, Input, Upload, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { saveImageToIpfs, ipfsPrefix } from '../config';

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      content: '',
      img: '',
      target: '',
      fundingPrice: '',
      price: ''
    }
  }

  handleSubmit = (e) => {
    console.log(this.state);
    e.preventDefault();
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
                    <img height="100px" src={`${ipfsPrefix}${this.state.img}`}/>
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