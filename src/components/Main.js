import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import { BsFillQuestionCircleFill } from 'react-icons/bs';

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-4">
        <label className="textWhite center mb-5" style={{ fontSize: '40px' }}><big><b>PURSE Dashboard</b></big></label>
        <div className="card mb-4 cardbody">
          <div className="card-body center">
            <table className="textWhiteSmall">
              <thead>
                <tr>
                  <th scope="col">Market Cap</th>
                  <th scope="col">Circulating Supply <span className="">
                    <Popup trigger={open => (
                      <span style={{ position: "relative", top: '-1px' }}><BsFillQuestionCircleFill size={10} /></span>
                    )}
                      on="hover"
                      position="right center"
                      offsetY={0}
                      offsetX={5}
                      contentStyle={{ padding: '3px' }}
                    ><span className="textInfo"> Currently based on the total supply of purse token </span>
                    </Popup></span></th>
                  <th scope="col">PURSE Token Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${(window.web3Bsc.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether') * this.props.PURSEPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td>${parseFloat(this.props.PURSEPrice).toLocaleString('en-US', { maximumFractionDigits: 6 })}</td>
                </tr>
              </tbody>
              <thead><tr><td></td></tr><tr><td></td></tr></thead>
              <thead>
                <tr>
                  <th scope="col">Burn <span className="">
                    <Popup trigger={open => (
                      <span style={{ position: "relative", top: '-1px' }}><BsFillQuestionCircleFill size={10} /></span>
                    )}
                      on="hover"
                      position="right center"
                      offsetY={0}
                      offsetX={5}
                      contentStyle={{ padding: '1px' }}
                    ><span className="textInfo"> (Unit in Token / unit in Usd)</span>
                    </Popup></span></th>

                  <th scope="col">Distribution <span className="">
                    <Popup trigger={open => (
                      <span style={{ position: "relative", top: '-1px' }}><BsFillQuestionCircleFill size={10} /></span>
                    )}
                      on="hover"
                      position="right center"
                      offsetY={0}
                      offsetX={5}
                      contentStyle={{ padding: '1px' }}
                    ><span className="textInfo"> (Unit in Token / unit in Usd)</span>
                    </Popup></span></th>

                  <th scope="col">Liquidity <span className="">
                    <Popup trigger={open => (
                      <span style={{ position: "relative", top: '-1px' }}><BsFillQuestionCircleFill size={10} /></span>
                    )}
                      on="hover"
                      position="right center"
                      offsetY={0}
                      offsetX={5}
                      contentStyle={{ padding: '1px' }}
                    ><span className="textInfo"> (Unit in Token / unit in Usd) </span>
                    </Popup></span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="col">(Total)</td>
                  <td scope="col">(Total)</td>
                  <td scope="col">(Total)</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.totalBurnAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.totalBurnAmount, 'Ether')).toFixed(4) * this.props.PURSEPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.totalTransferAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.totalTransferAmount, 'Ether')).toFixed(4) * this.props.PURSEPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.totalTransferAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.totalTransferAmount, 'Ether')).toFixed(4) * this.props.PURSEPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th scope="col">(Past 30 days Sum)</th>
                  <th scope="col">(Past 30 days Sum)</th>
                  <th scope="col">(Past 30 days Sum)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30BurnAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30BurnAmount, 'Ether')).toFixed(4) * this.props.PURSEPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30TransferAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30TransferAmount, 'Ether')).toFixed(4) * this.props.PURSEPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30TransferAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30TransferAmount, 'Ether')).toFixed(4) * this.props.PURSEPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    );
  }
}

export default Main;
