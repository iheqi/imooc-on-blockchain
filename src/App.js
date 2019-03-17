import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Layout } from 'antd';
import Create from './pages/Create';
import Header from './components/Header';

const { Content, Footer } = Layout;
const Course = () => <span>课程</span>
const Qa = () => <span>问答区</span>

class App extends Component {
  render() {
    return (
      <BrowserRouter className="App">
        <Layout>
          <Header></Header>
          <Content>
            <Route path="/" exact component={Course}></Route>
            <Route path="/qa" exact component={Qa}></Route>
            <Route path="/create" exact component={Create}></Route>
          </Content>
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


        </div> */}
      </BrowserRouter>
    );
  }
}

export default App;
