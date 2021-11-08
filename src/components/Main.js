import React, { Component } from 'react'
import asterisk from '../asterisk.png'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">



        <label className="center"><big><b>Farm Info</b></big></label>

        <div className="center" style={{ color: 'grey' }}>&nbsp;Stake <b>&nbsp;Pancakeswap or 1Inch LP Tokens&nbsp;</b> to earn PURSE!!!</div>
        <br /><br />
        <div className="card mb-4" style={{ minWidth: '350px' }} >
          <div className="card-body">
            <table className="table table-borderless text-muted text-center">
              <thead>
                <tr>
                  <th scope="col">Total Pool</th>
                  <th scope="col">PURSE Token Total Supply</th>
                  <th scope="col">Total New PURSE Reward per block</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.props.poolLength}</td>
                  <td>{window.web3.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether')} Purse</td>
                  <td>{window.web3.utils.fromWei(this.props.totalrewardperblock, 'Ether')} Purse</td>
                </tr>
              </tbody>
            </table>
            <br />
            <table className="table table-borderless text-muted text-center">
              <thead>
                <tr>
                  <th scope="col">Farm Cap Reward Token</th>
                  <th scope="col">Farm Minted Reward Token</th>
                  <th scope="col">Farm's Reward Token</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{window.web3.utils.fromWei(this.props.poolCapRewardToken, 'Ether')} Purse</td>
                  <td>{window.web3.utils.fromWei(this.props.poolMintedRewardToken, 'Ether')} Purse</td>
                  <td>{window.web3.utils.fromWei(this.props.poolRewardToken, 'Ether')} Purse</td>
                </tr>
              </tbody>
            </table>
          </div></div>
        <br /><br /><br />

        <div className="text" style={{ color: 'grey' }}>&nbsp;<big>Remarks:</big></div><br />
        <div className="text" style={{ color: 'grey' }}>&nbsp;<small>Farm Cap Reward Token: Total capacity reward tokens will be minted by this farm.</small></div>
        <div className="text" style={{ color: 'grey' }}>&nbsp;<small>Farm Minted Reward Token: Total reward tokens minted by this farm until now.</small></div>
        <div className="text" style={{ color: 'grey' }}>&nbsp;<small>Farm's Reward Token: Total reward tokens inside this farm (smart contract).</small></div>
      </div>


    );
  }
}

export default Main;
