import React, { Component } from 'react'
import { Link } from 'react-router-dom';
// import Navbar from 'react-bootstrap/Navbar'
import purse from '../purse.png'
import fox from '../metamask-fox.svg'
import walletconnectLogo from '../walletconnect-logo.svg'
import Identicon from 'identicon.js';
import Button from '@material-ui/core/Button';
import Buttons from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

// import web3connect from 'web3connect';

import {
  NavLink2,
  NavLink,
  NavLink0,
  NavLinkHome
  // Bars,
  // NavMenu,
  // NavBtn
} from './NavMenu'


class Navb extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

        <div
          className="navbar-brand col-sm-3 col-md-2 mr-0 rowC"
        >
          <div>
            <NavLinkHome to='/menu' onClick={() => {
              window.open(`https://www.pundix.com/`, '_blank')
            }}>
              <img src={purse} width="30" height="30" className="d-inline-block align-top" alt="" />
              &nbsp; <b>LP Restaking Farm</b></NavLinkHome></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <div>
            <NavLink to='/home' >Home</NavLink>
          </div>&nbsp;&nbsp;&nbsp;
          <div>
            <NavLink to='/menu' >Menu</NavLink>
          </div>&nbsp;&nbsp;&nbsp;
          <div>
            <NavLink0 to='/menu' onClick={() => {
              window.open(`https://pundix-purse.gitbook.io/untitled/`, '_blank')
            }}> Docs
            </NavLink0>
          </div>&nbsp;
        </div>

        <span>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap-small d-none d-sm-none d-sm-block">
              <div className="text-light rowC">
                <div>
                  <NavLink2 to='/menu' onClick={() => {
                    window.open(`https://pancakeswap.finance/swap`, '_blank')
                  }}>
                    <img src={purse} width="30" height="30" className="d-inline-block align-top" alt="" />&nbsp;
                    ${this.props.PURSEPrice}
                  </NavLink2>
                </div>&nbsp;&nbsp;
                <div>
                  <Buttons variant="info" size="sm" onClick={() => {
                  }}>{this.props.networkName}
                  </Buttons>
                </div>&nbsp;
                <div>
                  {this.props.wallet||this.props.walletConnect ?
                    <DropdownButton
                      id="dropdown-menu-align-end"
                      variant="secondary"
                      size="sm"
                      align="end"
                      title={`${this.props.first4Account}...${this.props.last4Account}`}
                    >
                      <Dropdown.Item onClick={() => {
                        window.open(`https://testnet.bscscan.com/address/${this.props.account}`, '_blank')
                      }}
                      >Wallet</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item variant="dark" onClick={() => {
                        this.props.setWalletTrigger(false)
                        if (this.props.walletConnect == true) {
                          this.props.WalletDisconnect()
                        }
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
                      }><img src={fox} width="23" height="23" className="d-inline-block" alt=""/>&nbsp; Metamask</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item variant="dark" onClick={() => {
                        this.props.WalletConnect()
                      }}><img src={walletconnectLogo} width="26" height="23" className="d-inline-block" alt=""/>&nbsp;WalletConnect</Dropdown.Item>
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
