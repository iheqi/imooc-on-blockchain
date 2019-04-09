import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { Layout } from 'antd';
import Course from './pages/Course/Course';
import Create from './pages/Create/Create';
import Detail from './pages/Detail/Detail';
import Qa from './pages/Qa/Qa';
import Discuss from './pages/Discuss/Discuss';
import Header from './components/Header';

const { Content, Footer } = Layout;

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
            <Route path="/detail/:address" exact component={Detail}></Route>
            <Route path="/discuss/:id" exact component={Discuss}></Route>
          </Content>
          {/* <Footer>Footer</Footer> */}
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
