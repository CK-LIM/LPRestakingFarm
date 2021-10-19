import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import fx_token from '../fx_token.png'
import Identicon from 'identicon.js';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn
} from './NavMenu'


class Navb extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://www.pundix.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={fx_token} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; LP Restaking Farm
        </a>

        <span>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap-small d-none d-sm-none d-sm-block">
              <span className="text-light rowC">
                <NavLink to='/home' >Home</NavLink>
                <NavLink to='/menu' >Menu</NavLink>
                <span> {this.props.first4Account}...{this.props.last4Account}&nbsp;
                {this.props.account
                  ? <img
                    className="ml-2"
                    width='25'
                    height='25'
                    src={`data:image/png;base64,${new Identicon(this.props.account).toString()}`}
                    alt=""
                  />
                  : <span></span>
                }</span>
              </span>
            </li>
          </ul>
          </span>
      </nav>
    );
  }
}

export default Navb;
