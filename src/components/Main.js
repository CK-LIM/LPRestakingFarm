import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import asterisk from '../asterisk.png'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">



        <label className="textWhite center" style={{ fontSize: '40px' }}><big><b>PURSE Dashboard</b></big></label>

        <br />

        <br />

        <div className="card mb-4 cardbody" style={{ width: '800px' }} >
          <div className="card-body text-center">
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
                      offsetY={-50}
                      offsetX={5}
                      contentStyle={{ padding: '3px' }}
                    ><span className="textInfo"><small> Currently based on the total supply of purse token </small></span>
                    </Popup></span></th>
                  <th scope="col">PURSE Token Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$ {(window.web3Bsc.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether') * this.props.PURSEPrice).toFixed(2)}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether')).toFixed(4)}</td>
                  <td>$ {this.props.PURSEPrice}</td>
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
                      offsetY={-50}
                      offsetX={5}
                      contentStyle={{ padding: '3px' }}
                    ><span className="textInfo"><small> (Unit in Token / unit in Usd). First line number is accumulative amount since contract created. 2nd line number is past 30 days total amount.</small></span>
                    </Popup></span></th>

                  <th scope="col">Distribution <span className="">
                    <Popup trigger={open => (
                      <span style={{ position: "relative", top: '-1px' }}><BsFillQuestionCircleFill size={10} /></span>
                    )}
                      on="hover"
                      position="right center"
                      offsetY={-50}
                      offsetX={5}
                      contentStyle={{ padding: '3px' }}
                    ><span className="textInfo"><small> (Unit in Token / unit in Usd). </small></span>
                    </Popup></span></th>

                  <th scope="col">Liquidity <span className="">
                    <Popup trigger={open => (
                      <span style={{ position: "relative", top: '-1px' }}><BsFillQuestionCircleFill size={10} /></span>
                    )}
                      on="hover"
                      position="right center"
                      offsetY={-50}
                      offsetX={5}
                      contentStyle={{ padding: '3px' }}
                    ><span className="textInfo"><small> (Unit in Token / unit in Usd). </small></span>
                    </Popup></span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.totalBurnAmount, 'Ether')).toFixed(4)} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.totalBurnAmount, 'Ether')).toFixed(4) * this.props.PURSEPrice).toFixed(2)}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.distributionPoolToken, 'Ether')).toFixed(4) } / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.distributionPoolToken, 'Ether')).toFixed(4) * this.props.PURSEPrice).toFixed(2)}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.distributionPoolToken, 'Ether')).toFixed(4) } / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.distributionPoolToken, 'Ether')).toFixed(4) * this.props.PURSEPrice).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30BurnAmount, 'Ether')).toFixed(4)} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30BurnAmount, 'Ether')).toFixed(4) * this.props.PURSEPrice).toFixed(2)}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30BurnAmount, 'Ether')).toFixed(4) / 2} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30BurnAmount, 'Ether')).toFixed(4) / 2 * this.props.PURSEPrice).toFixed(2)}</td>
                  <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30BurnAmount, 'Ether')).toFixed(4) / 2} / $ {(parseFloat(window.web3Bsc.utils.fromWei(this.props.sum30BurnAmount, 'Ether')).toFixed(4) / 2 * this.props.PURSEPrice).toFixed(2)}</td>
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
