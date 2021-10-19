import React, { Component } from 'react'


class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">



        <label className="center"><b>Farm Info</b></label><br />
        <div className="center" style={{ color: 'grey' }}>&nbsp;Stake <b>&nbsp;Pancakeswap or 1Inch LP Tokens&nbsp;</b> to earn PURSE!!!</div>
        <br /><br /><br />
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Total Farm</th>
              <th scope="col">PURSE Token Total Supply</th>
              <th scope="col">Total New PURSE Reward per block</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.poolLength} mLp</td>
              <td>{window.web3.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether')}</td>
              <td>{window.web3.utils.fromWei(this.props.totalrewardperblock, 'Ether')}</td>

            </tr>
          </tbody>
        </table>
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              {/* <th scope="col">Total New PURSE Reward per block</th> */}

            </tr>
          </thead>
          <tbody>
            <tr>
              


            </tr>
          </tbody>
        </table>



      </div>

    );
  }
}

export default Main;
