import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import dai from '../uniswap-uni-logo.png'
import asterisk from '../asterisk.png'
import purse from '../pteria.png'
import pancake from '../pancakeswap.png'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from '@material-ui/core/Button';

class PurseUsdcPancake extends Component {

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
      // console.log(this.state.txValid)
    } else if (event <= 0) {
      this.setState({
        message: 'Value need to be greater than 0'
      })
      this.setState({
        txValidAmount: false
      })
    }
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
          <ButtonGroup>
            <Button variant="contained" color="default" component={Link} to="/menu/">pancakeswap</Button>
            <Button variant="outlined" color="default" component={Link} to="/oneinch/">1inch</Button>
          </ButtonGroup>
        </div>
        <br /><br />

        <h2 className="center"><b>PURSE-USDC Farm</b></h2>
        <br />
        <div className="center" style={{ color: 'grey' }}>&nbsp;Deposit <b>&nbsp;PURSE-USDC PANCAKE LP&nbsp;</b> and earn PURSE!!!</div>
        <div className="center" style={{ color: 'grey' }}>&nbsp;APY :  {(28000 * 365 * this.props.poolInfo[0].pursePerBlock / this.props.lpTokenInContract[0]) * 100} %</div>
        <br />

        <div className="card mb-4" >
          <div className="card-body">


            <button
              type="submit"
              className="btn btn-success btn-sm float-right"
              style={{ maxWidth: '70px' }}
              onClick={(event) => {
                event.preventDefault()
                if (this.props.pendingReward <= 0 ) {
                  alert("No token to harvest! Please deposit PURSE-USDC PANCAKE LP to earn PURSE")
                } else {
                  this.props.withdraw(0,0)
                }                
              }}>
              <small>Harvest</small>

            </button>

            <table className="table table-borderless text-muted text-center">

              <thead>
                <tr>
                  <th scope="col">PURSE-USDC LP Staked</th>
                  <th scope="col">PURSE Earned</th>
                </tr>
                <tr>
                  <th scope="col"><img src={pancake} height='30' alt="" /></th>
                  <th scope="col"><img src={purse} height='30' alt="" /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{window.web3.utils.fromWei(this.props.userInfo[0].amount.toString(), 'Ether')}</td> 
                  <td>{window.web3.utils.fromWei(this.props.pendingReward[0], 'Ether')}</td>
                </tr>
              </tbody>
            </table>



            <div className="card mb-4" >
              <div className="card-body">
                <form className="mb-3" onSubmit={(event) => {
                  event.preventDefault()
                  if (this.state.txValidAmount === false) {
                    alert("Invalid input! PLease check your input again")
                  } else {
                    let amount
                    amount = this.input.value.toString()
                    amount = window.web3.utils.toWei(amount, 'Ether')
                    console.log(this.state.txDeposit)
                    console.log(this.state.txWithdraw)
                    if (this.state.txDeposit === true && this.state.txWithdraw === false) {
                      this.props.deposit(0, amount)
                    } else if (this.state.txDeposit === false && this.state.txWithdraw === true)
                      this.props.withdraw(0, amount)
                  }
                }}>
                  <div>
                    <label className="float-left"><b>Deposit</b></label>
                    <span className="float-right text-muted">
                      <span>
                        LP Balance &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {window.web3.utils.fromWei(this.props.lpTokenBalance[0], 'Ether')}</span>
                      <span><br />
                        PURSE Balance&nbsp;: {window.web3.utils.fromWei(this.props.purseTokenUpgradableBalance, 'Ether')}
                      </span>
                    </span>
                  </div>

                  <div className="input-group mb-4" >
                    <input
                      type="text"
                      ref={(input) => { this.input = input }}
                      className="form-control form-control-lg"
                      placeholder="0"
                      onChange={(e) => {
                        const value = e.target.value;
                        // console.log(value)
                        this.changeHandler(value)
                      }}
                      required />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <img src={pancake} height='25' alt="" />
                        &nbsp;&nbsp;&nbsp; LP
                      </div>
                    </div>
                  </div >
                  <div style={{ color: 'red' }}>{this.state.message} </div>

                  <div className="rowC center">
                    <button type="submit" className="btn btn-primary btn-lg" onClick={(event) => {
                      console.log("clicked deposit...")
                      this.clickHandlerDeposit()
                    }}> Deposit </button>&nbsp;&nbsp;&nbsp;
                    <button type="submit" className="btn btn-primary btn-lg" onClick={(event) => {
                      console.log("clicked withdraw...")
                      this.clickHandlerWithdraw()
                    }}>Withdraw</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>





        <div className="text-center" style={{ color: 'grey' }}><img src={asterisk} height='15' />&nbsp;<small>Every time you stake and unstake LP tokens, the contract will automatically harvest PURSE rewards for you!</small></div>
      </div>

    );
  }
}

export default PurseUsdcPancake;
