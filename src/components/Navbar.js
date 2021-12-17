import React, { Component } from 'react'
import { Link } from 'react-router-dom';
// import Navbar from 'react-bootstrap/Navbar'
import purse from '../purse.png'
import fox from '../metamask-fox.svg'
import walletconnectLogo from '../walletconnect-logo.svg'
import Buttons from 'react-bootstrap/Button'
// import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './App.css';

// import web3connect from 'web3connect';

import {
  NavLink2,
  NavLink,
  NavLink0,
  NavLinkHome,
  NavLinkSub,
  NavLinkSub1
} from './NavMenu'


class Navb extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

        <div className="navbar-brand col-sm-3 col-md-2 mr-0 rowB">
          <div>
            <NavLinkHome to='/menu' onClick={() => {
              window.open(`https://www.pundix.com/`, '_blank')
            }}>
              <img src={purse} width="30" height="30" className="d-inline-block align-top" alt="" />
              &nbsp; <b> PURSE </b></NavLinkHome></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div>
            <NavLink to='/home' >Home</NavLink>
          </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div>
            <Popup className='popup1' trigger={open => (
              <NavLink0 to='/lpfarm/menu'> LP Farm</NavLink0>
            )}
              on="hover"
              position="bottom left"
              offsetY={-45}
              offsetX={-5}
              mouseLeaveDelay={300}
              contentStyle={{ padding: '5px' }}
              arrow={false}
            ><div>
                <Link></Link>
                <div style={{ marginTop: '5px' }}><Link className='dropdown0' to='/lpfarm/farmInfo' >&nbsp;Farm Dashboard</Link><br /></div>
                <div style={{ marginTop: '8px' }}><Link className='dropdown' to='/lpfarm/menu' >&nbsp;Farm Menu</Link></div>
              </div>
            </Popup>
          </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div>
            <span className='dropdown' style={{ fontSize: '16px' }} onClick={() => {
              window.open(`https://pundix-purse.gitbook.io/untitled/`, '_blank')
            }}> Docs
            </span>
          </div>&nbsp;
        </div>

        <span>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap-small d-none d-sm-none d-sm-block">
              <div className="text-light rowC">
                
                <div className="rowC">
                  <span className='dropdown1 center' onClick={() => {
                    window.open(`https://pancakeswap.finance/swap`, '_blank')
                  }}> <img src={purse} width="30" height="30" className="d-inline-block align-top" alt="" />&nbsp;${this.props.PURSEPrice}
                  </span>
                </div>&nbsp;

                <div className='center'>
                  <Buttons variant="info" size="sm" onClick={() => {
                  }}>{this.props.networkName}
                  </Buttons>
                </div>&nbsp;

                <div className='center'>
                  {this.props.wallet || this.props.walletConnect ?
                    <div>
                      <Popup trigger={open => (
                        <Buttons variant="secondary" size="sm"> {this.props.first4Account}...{this.props.last4Account}</Buttons>
                      )}
                        on="hover"
                        position="bottom right"
                        offsetY={-43}
                        offsetX={0}
                        mouseLeaveDelay={300}
                        contentStyle={{ padding: '5px' }}
                        arrow={false}
                      ><div>
                          <div className='dropdown0' onClick={() => {
                            window.open(`https://bscscan.com/address/${this.props.account}`, '_blank')
                          }}>&nbsp;Wallet</div>
                          <div className='dropdown' onClick={() => {
                            this.props.setWalletTrigger(false)
                            if (this.props.walletConnect == true) {
                              this.props.WalletDisconnect()
                            }
                          }}>&nbsp;Disconnect</div>
                        </div>
                      </Popup>
                    </div> : <div>
                      <Popup trigger={open => (
                        <Buttons variant="secondary" size="sm" > Connect Wallet</Buttons>
                      )}
                        on="hover"
                        position="bottom right"
                        offsetY={-43}
                        offsetX={0}
                        mouseLeaveDelay={300}
                        contentStyle={{ padding: '5px' }}
                        arrow={false}
                      ><div>
                          <div className='dropdown0' onClick={async () => {
                            await this.props.connectWallet()
                          }
                          }><img src={fox} width="23" height="23" className="d-inline-block" alt="" />&nbsp; Metamask</div>
                          <div className='dropdown' onClick={async () => {
                            await this.props.WalletConnect()
                          }
                          }><img src={walletconnectLogo} width="26" height="23" className="d-inline-block" alt="" />&nbsp; WalletConnect</div>
                        </div>
                      </Popup>
                    </div>}</div>

              </div>
            </li>
          </ul>
        </span>
      </nav>

    );
  }
}

export default Navb;
