import React from 'react';
import { Row, Col, Form, Input, Upload } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = () => {

  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

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
            <FormItem label="众筹目标">
              <Input name="target" onChange={this.onChange}></Input>
            </FormItem>
            <FormItem label="课程封面">
              <Upload>Upload</Upload>
            </FormItem>            
            <FormItem label="众筹价格">
              <Input name="fundingPrice" onChange={this.onChange}></Input>
            </FormItem>
            <FormItem label="上线价格">
              <Input name="price" onChange={this.onChange}></Input>
            </FormItem>

          </Form>
        </Col>
      </Row>
    );
  }
}

export default Create;