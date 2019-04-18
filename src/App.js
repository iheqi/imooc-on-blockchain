import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import Course from './pages/Course/Course';
import Create from './pages/Create/Create';
import Detail from './pages/Detail/Detail';
import Qa from './pages/Qa/Qa';
import Discuss from './pages/Discuss/Discuss';
import Header from './components/Header';
import CacheRoute from 'react-router-cache-route';
class App extends Component {
  render() {
    return (
      <BrowserRouter className="App">
        <div className="body">
          <Header></Header>
          <main>
              <CacheRoute path="/" exact component={Course}></CacheRoute>
              <CacheRoute path="/qa" exact component={Qa}></CacheRoute>
              <CacheRoute path="/create" exact component={Create}></CacheRoute>
              <CacheRoute path="/detail/:address" exact component={Detail}></CacheRoute>
              <CacheRoute path="/discuss/:id" exact component={Discuss}></CacheRoute>    
          </main>
          <footer>
            慕课 by 何琦
          </footer>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
