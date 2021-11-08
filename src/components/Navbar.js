import React, { Component } from 'react'
// import Navbar from 'react-bootstrap/Navbar'
import fx_token from '../x.png'
import Identicon from 'identicon.js';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

// import web3connect from 'web3connect';

import {
  // Nav,
  NavLink
  // Bars,
  // NavMenu,
  // NavBtn
} from './NavMenu'


class Navb extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://www.pundix.com/"
          target="_blank"
          // rel="noopener noreferrer"
        >
          <img src={fx_token} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; LP Restaking Farm
        </a>



        <span>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap-small d-none d-sm-none d-sm-block">
              <div className="text-light rowC">
                <div>
                  <NavLink to='/home' >Home</NavLink>
                </div>&nbsp;&nbsp;
                <div>
                  <NavLink to='/menu' >Menu</NavLink>
                </div>&nbsp;&nbsp;
                <div>
                  <Button variant="info" size="sm" onClick={() => {
                  }}>{this.props.networkName}
                  </Button>
                </div>&nbsp;


                <div>
                  {this.props.wallet ?
                    <DropdownButton
                      id="dropdown-menu-align-end"
                      variant="secondary"
                      size="sm"
                      align="end"
                      title={`${this.props.first4Account}...${this.props.last4Account}`}
                    >
                      <Dropdown.Item onClick={() => {window.open(`https://testnet.bscscan.com/address/${this.props.account}`,'_blank')
                      }}
                      >Wallet</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item variant="dark" onClick={() => {
                        this.props.setWalletTrigger(false)
                      }}>Disconnect</Dropdown.Item>
                    </DropdownButton>
                    : <DropdownButton
                      id="dropdown-menu-align-end"
                      variant="secondary"
                      size="sm"
                      align="end"
                      title="Connect Wallet"
                    >
                      <Dropdown.Item onClick={async () => {
                        await this.props.connectWallet()
                      }
                      }>Metamask</Dropdown.Item>
                    </DropdownButton>}
                </div>&nbsp;
              </div>
            </li>
          </ul>
        </span>
      </nav>

    );
  }
}

export default Navb;
