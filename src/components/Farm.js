import React, { Component } from 'react'
import asterisk from '../asterisk.png'

class Farm extends Component {

  render() {
    return (
      <div id="content" className="mt-3">



        <label className="textWhite center" style={{ fontSize : '40px' }}><big><b>Farm Info</b></big></label>

        <div className="center" style={{ color: 'white' }}>&nbsp;Stake <b>&nbsp;Pancakeswap or 1Inch LP Tokens&nbsp;</b> to earn PURSE!!!</div>
        <br /><br />
        <div className="card mb-4 cardbody" style={{ width: '800px' }} >
          <div className="card-body">
            <table className="textWhiteSmall text-center">
              <thead>
                <tr>
                  <th scope="col">Total Pool</th>
                  <th scope="col">PURSE Token Total Supply</th>
                  <th scope="col">Farm PURSE Reward</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.props.poolLength}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether')).toLocaleString('en-US', {maximumFractionDigits:0})} Purse</td>
                  <td>{window.web3Bsc.utils.fromWei(this.props.totalrewardperblock, 'Ether')} Purse per block</td>
                </tr>
              </tbody>
              <thead><tr><td></td></tr><tr><td></td></tr></thead>
              <thead>
                <tr>
                  <th scope="col">Farm's Cap Reward Token</th>
                  <th scope="col">Farm's Minted Reward Token</th>
                  <th scope="col">Farm's PURSE Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.poolCapRewardToken, 'Ether')).toLocaleString('en-US', {maximumFractionDigits:0})} Purse</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.poolMintedRewardToken, 'Ether')).toLocaleString('en-US', {maximumFractionDigits:0})} Purse</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.poolRewardToken, 'Ether')).toLocaleString('en-US', {maximumFractionDigits:0})} Purse</td>
                </tr>
              </tbody>
            </table>
          
          </div></div>
          <br /> <br />

        <div className="text" style={{ color: 'grey' }}>&nbsp;<big>Remarks:</big></div><br />
        <div className="text" style={{ color: 'grey' }}>&nbsp;<small>Farm Cap Reward Token: Total capacity reward tokens will be minted by this farm.</small></div>
        <div className="text" style={{ color: 'grey' }}>&nbsp;<small>Farm Minted Reward Token: Total reward tokens minted by this farm until now.</small></div>
        <div className="text" style={{ color: 'grey' }}>&nbsp;<small>Farm's Reward Token: Total reward tokens inside this farm (smart contract).</small></div>
      </div>


    );
  }
}

export default Farm;
