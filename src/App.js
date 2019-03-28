import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { Layout } from 'antd';
import Create from './pages/Create';
import Course from './pages/Course';
import Header from './components/Header';

const { Content, Footer } = Layout;
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
      </BrowserRouter>
    );
  }
}

export default App;
