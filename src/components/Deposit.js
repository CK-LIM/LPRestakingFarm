import React, { Component } from 'react'
// import { Link } from 'react-router-dom';
// import dai from '../uniswap-uni-logo.png'
import asterisk from '../asterisk.png'
import exlink from '../link.png'
import purse from '../purse.png'
import pancake from '../pancakeswap.png'
import bigInt from 'big-integer'
import './App.css';

class Deposit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }
    this.state = {
      txValidAmount: false
    }
    this.state = {
      txDeposit: false
    }
    this.state = {
      txWithdraw: false
    }
    this.clickHandlerDeposit = this.clickHandlerDeposit.bind(this)
    this.clickHandlerWithdraw = this.clickHandlerWithdraw.bind(this)
  }

  changeHandler(event) {
    let result = !isNaN(+event); // true if its a number, false if not

    if (event == "") {
      this.setState({
        message: ''
      })
      this.setState({
        txValidAmount: false
      })
    } else if (result == false) {
      this.setState({
        message: 'Not a valid number'
      })
      this.setState({
        txValidAmount: false
      })
    } else if (event <= 0) {
      this.setState({
        message: 'Value need to be greater than 0'
      })
      this.setState({
        txValidAmount: false
      })
    }
    // else if (bigInt(window.web3.utils.toWei(event, 'ether')).value > bigInt(this.props.lpTokenSegmentBalance[this.props.n][this.props.i]).value) {
    //   this.setState({
    //     message: 'Not enough Balance'
    //   })
    //   this.setState({
    //     txValidAmount: false
    //   })
    // }
    else {
      this.setState({
        message: ''
      })
      this.setState({
        txValidAmount: true
      })
    }
  }

  clickHandlerDeposit() {
    // console.log("clicked")
    this.setState({
      txDeposit: true,
      txWithdraw: false
    })
  }

  clickHandlerWithdraw() {
    // console.log("clicked")
    this.setState({
      txDeposit: false,
      txWithdraw: true
    })
  }

  render() {
    return (
      <div id="content" className="mt-3">
        <div className="text-center">

        </div>
        <br /><br />

        <h2 className="center textWhite"><b>{this.props.lpTokenSegmentAsymbol[this.props.n][this.props.i]}-{this.props.lpTokenSegmentBsymbol[this.props.n][this.props.i]} Farm</b></h2>
        <br />
        <div className="center" style={{ color: 'silver' }}>&nbsp;Deposit <b>&nbsp;{this.props.lpTokenSegmentAsymbol[this.props.n][this.props.i]}-{this.props.lpTokenSegmentBsymbol[this.props.n][this.props.i]} LP Token&nbsp;</b> and earn PURSE!!!</div>
        <br />

        <div className="card mb-4 cardbody" >
          <div className="card-body">

          <div className='float-left'>
              <span className='dropdown' style={{ fontSize: '12px' }} onClick={() => {
                window.open(this.props.lpTokenLink[this.props.n][this.props.i], '_blank')
              }}> Get {this.props.lpTokenSegmentAsymbol[this.props.n][this.props.i]}-{this.props.lpTokenSegmentBsymbol[this.props.n][this.props.i]} <img src={exlink} height='10' alt="" />
              </span>
              <span className='dropdown' style={{ fontSize: '12px' }} onClick={() => {
                window.open(this.props.lpTokenContract[this.props.n][this.props.i], '_blank')
              }}> View Contract <img src={exlink} height='10' alt="" />
              </span>
            </div>
          

            <button
              type="submit"
              className="btn btn-success btn-sm float-right"
              style={{ maxWidth: '70px' }}
              onClick={(event) => {
                event.preventDefault()
                this.props.harvest(this.props.i, this.props.n)
              }}>
              <small>Harvest</small>
            </button>  <br/>  <br/>

            <table className="table table-borderless text-center" style={{ color: 'silver' }}>
              <thead>
                <tr>
                  <th scope="col">{this.props.lpTokenSegmentAsymbol[this.props.n][this.props.i]}-{this.props.lpTokenSegmentBsymbol[this.props.n][this.props.i]} LP Staked </th>
                  <th scope="col">PURSE Earned</th>
                </tr>
                <tr>
                  <th scope="col"><img src={pancake} height='30' alt="" /></th>
                  <th scope="col"><img src={purse} height='30' alt="" /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.props.userSegmentInfo[this.props.n][this.props.i]}</td>
                  <td>{this.props.pendingSegmentReward[this.props.n][this.props.i]}</td>
                </tr>
              </tbody>
            </table>


            <div className="card mb-4 cardbody" >
              <div className="card-body">
                {this.props.wallet || this.props.walletConnect ?

                  <form className="mb-3" onSubmit={(event) => {
                    event.preventDefault()
                    if (this.state.txValidAmount === false) {
                      alert("Invalid input! PLease check your input again")
                    } else {
                      let amount = this.input.value.toString()
                      let amountWei = window.web3Bsc.utils.toWei(amount, 'Ether')
                      if (this.state.txDeposit === true && this.state.txWithdraw === false) {
                        if (bigInt(amountWei).value > bigInt(this.props.lpTokenSegmentBalance[this.props.n][this.props.i]).value) {
                          alert("Not enough funds")
                        } else {
                          this.props.deposit(this.props.i, amountWei, this.props.n)
                        }
                      } else if (this.state.txDeposit === false && this.state.txWithdraw === true) {
                        if (bigInt(amountWei).value > bigInt(window.web3Bsc.utils.toWei(this.props.userSegmentInfo[this.props.n][this.props.i], 'Ether')).value) {
                          alert("Withdraw tokens more than deposit LP tokens")
                        } else {
                          this.props.withdraw(this.props.i, amountWei, this.props.n)
                        }
                      }
                    }
                  }}>
                    <div>
                      <label className="float-left" style={{ color: 'silver' }}><b>Start Farming</b></label>
                      <span className="float-right" style={{ color: 'silver' }}>
                        <span>
                          LP Balance &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {window.web3Bsc.utils.fromWei(this.props.lpTokenSegmentBalance[this.props.n][this.props.i].toString(), 'Ether')}
                        </span>
                        <span><br />
                          PURSE Balance&nbsp;: {window.web3Bsc.utils.fromWei(this.props.purseTokenUpgradableBalance, 'Ether')}
                        </span>
                      </span>
                    </div>
                    <br /><br /><br />

                    {this.props.lpTokenSegmentAllowance[this.props.n][this.props.i] > 100000000000000000000000000000 ?
                      <div>
                        <div className="input-group mb-4" >
                          <input
                            type="text"
                            ref={(input) => { this.input = input }}
                            className="form-control form-control-lg cardbody"
                            placeholder="0"
                            onChange={(e) => {
                              const value = e.target.value;
                              this.changeHandler(value)
                            }}
                            required />
                          <div className="input-group-append">
                            <div className="input-group-text cardbody" style={{ color: 'silver' }}>
                              <img src={pancake} height='25' alt="" />
                              &nbsp;&nbsp;&nbsp; LP
                            </div>
                          </div>
                        </div >
                        <div style={{ color: 'red' }}>{this.state.message} </div>

                        <div className="rowC center">
                          <button type="submit" className="btn btn-primary btn-lg" onClick={(event) => {
                            this.clickHandlerDeposit()
                          }}> Deposit </button>&nbsp;&nbsp;&nbsp;
                          <button type="submit" className="btn btn-primary btn-lg" onClick={(event) => {
                            this.clickHandlerWithdraw()
                          }}>Withdraw</button>&nbsp;&nbsp;&nbsp;
                        </div>
                      </div>
                      :
                      <div className="rowC center">
                        <button type="submit" className="btn btn-primary btn-block btn-lg" onClick={(event) => {
                          this.props.approve(this.props.i, this.props.n)
                        }}>Approve</button>
                      </div>
                    }
                  </form>
                  :
                  <div className="rowC center">
                    <button type="submit" className="btn btn-primary btn-lg" onClick={async () => {
                      await this.props.connectWallet()
                    }}>Connect Wallet</button>
                  </div>
                }
              </div>
            </div>
          </div>


        </div>


        <div className="text-center" style={{ color: 'grey' }}><img src={asterisk} height='15' />&nbsp;<small>Every time you stake and unstake LP tokens, the contract will automatically harvest PURSE rewards for you!</small></div>
      </div>

    );
  }
}

export default Deposit;
