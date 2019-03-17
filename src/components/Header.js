import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import MenuItem from 'antd/lib/menu/MenuItem';

const Header = Layout.Header;

class HeadComp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Header>
        <div className="logo">
          <img src="/logo.png" alt="logo"></img>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{lineHeight: '64px'}}
          defaultSelectedKeys={[this.props.location.pathname]}
        >
          <MenuItem key="/">
            <Link to="/">首页</Link>
          </MenuItem>
          <MenuItem key="/qa">
            <Link to="/qa">问答区</Link>
          </MenuItem>
          <MenuItem key="/create">
            <Link to="/create">我要众筹</Link>
          </MenuItem>                    
        </Menu>
      </Header>
    );
  }
}

export default withRouter(HeadComp);