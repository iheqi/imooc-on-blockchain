import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Layout } from 'antd';
import Header from './components/Header';

const { Content, Footer } = Layout;
const Course = () => <span>课程</span>
const Qa = () => <span>问答区</span>
const Create = () => <span>我要众筹</span>

class App extends Component {
  render() {
    return (
      <BrowserRouter className="App">
        <Layout>
          <Header></Header>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
        {/* <div>
          <ul>
            <li>
              <Link to="/">课程</Link>
            </li>
            <li>
              <Link to="/qa">问答区</Link>
            </li>
            <li>
              <Link to="/create">新建</Link>
            </li>
          </ul>

          <Route path="/" exact component={Course}></Route>
          <Route path="/qa" exact component={Qa}></Route>
          <Route path="/create" exact component={Create}></Route>
        </div> */}
      </BrowserRouter>
    );
  }
}

export default App;
