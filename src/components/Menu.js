import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import purse from '../purse.png'
import purse2 from '../purse-.png'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from '@material-ui/core/Button';
import Buttons from 'react-bootstrap/Button'
import './App.css';
import Popup from 'reactjs-popup';
import { BsFillQuestionCircleFill } from 'react-icons/bs';

class Menu extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isShown: false
        }
        this.changeBackgroundColor = this.changeBackgroundColor.bind(this)
    }

    changeBackgroundColor() {
        console.log("clicked")
        this.setState({
            isShown: true
        })
        console.log(this.state.isShown)
    }

    render() {
        return (
            <div id="content" className="mt-3">
                <div className="text-center">
                    <ButtonGroup>
                        <Button variant="contained" color="primary" component={Link} to="/lpfarm/menu/" >pancakeswap</Button>
                        <Button variant="outlined" color="primary" component={Link} to="/lpfarm/oneinch/" >1inch</Button>
                    </ButtonGroup>
                </div>
                <br /><br />
                <div className="center img">
                    <img src={purse2} height='90' alt="" />
                </div><br />
                <h1 className="textWhite center"><b>LP Restaking Farm</b></h1>
                <div className="center" style={{ color: 'silver' }}>&nbsp;Stake <b>&nbsp;Pancakeswap LP Tokens&nbsp;</b> to earn PURSE!!!</div>
                <br />

                <div className="rowC center">
                    <div className="card mb-4 cardbody" style={{ minWidth: '350px', color: 'silver' }} >
                        <div className="card-body">
                            <span>
                                <span className="float-left">
                                    Your PURSE Balance<br /><b>{window.web3Bsc.utils.fromWei(this.props.purseTokenUpgradableBalance, 'Ether')}</b>
                                    <div>
                                    </div>
                                </span><br /><br /><br />
                            </span>
                            <span>
                                <small>
                                    <span className="float-left">Total Pending harvest</span>
                                    <span className="float-right">
                                        <span>
                                            {window.web3Bsc.utils.fromWei(this.props.totalpendingReward, 'Ether')}&nbsp;PURSE
                                        </span>
                                    </span>
                                </small>
                            </span>
                        </div>
                    </div> &nbsp;&nbsp;&nbsp;

                    <div className="card mb-4 cardbody" >
                        <div className="card-body " style={{ minWidth: '350px', color: 'silver' }}>
                            <span>
                                <span className="float-left">
                                    Total PURSE Supply<br /><b>{window.web3Bsc.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether')}</b>
                                    <div>
                                    </div>
                                </span><br /><br /><br />
                                <span>
                                    <small>
                                        <span className="float-left ">Total Reward/block</span>
                                        <span className="float-right ">
                                            <span>
                                                {window.web3Bsc.utils.fromWei(this.props.totalrewardperblock, 'Ether')}&nbsp;PURSE
                                            </span>
                                        </span>
                                    </small>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>



                <br />
                <div className="center" style={{ color: 'white' }}><b><big>Select Your Favourite pool entrees!</big></b></div>
                <div className="center" style={{ color: 'grey' }}><small>&nbsp;! Attention:&nbsp;Be sure to familiar with protocol risks and fees before using the farms!</small></div>
                <br />


                {/* ################################################################################################### */}
                {/* <div className="rowC center">

                    <div className="card mb-4" style={{ maxWidth: '250px' }}>
                        <div className="card-body text-center">
                            <span>
                                <span className="text">
                                    <img src={purse} height='30' alt="" /><br /><br />
                                    <b>PURSE-USDC</b>
                                    <div>
                                        <span className=" text-muted"><small>Deposit<small className="textSmall">PURSE-USDC PANCAKE LP</small> to Earn PURSE</small></span><br /><br />
                                        <span className=" text-muted"><small>APY:  {(28000 * 365 * this.props.poolInfo[0].pursePerBlock / this.props.lpTokenInContract[0]) * 100} % </small></span><br />
                                        <span className=" text-muted"><small>LP Staked: {window.web3.utils.fromWei(this.props.userInfo[0].amount, 'Ether')}</small></span><br />
                                        <span className=" text-muted"><small>TVL: </small></span>
                                        <br /><br />
                                        <Button variant="outlined" color="default" component={Link} to="/menu/PURSE-USDC">Select</Button>
                                    </div>
                                </span>
                            </span>
                        </div>
                    </div>&nbsp;&nbsp;&nbsp;

                    <div className="card mb-4" style={{ maxWidth: '250px' }}>
                        <div className="card-body text-center">
                            <span>
                                <span className="text">
                                    <img src={purse} height='30' alt="" /><br /><br />
                                    <b>PURSE-BNB</b>
                                    <div>
                                        <span className=" text-muted"><small>Deposit<small className="textSmall">PURSE-BNB PANCAKE LP</small> to Earn PURSE</small></span><br /><br />
                                        <span className=" text-muted"><small>APY:  {(28000 * 365 * this.props.poolInfo[1].pursePerBlock / this.props.lpTokenInContract[1]) * 100} % </small></span><br />
                                        <span className=" text-muted"><small>LP Staked: {window.web3.utils.fromWei(this.props.userInfo[1].amount, 'Ether')}</small></span><br />
                                        <span className=" text-muted"><small>TVL: </small></span>
                                        <br /><br />
                                        <Button variant="outlined" color="default" component={Link} to="/menu/PURSE-BNB">Select</Button>
                                    </div>
                                </span>
                            </span>
                        </div>
                    </div>
                </div> */}


                {/* <div className="center" style={{ color: 'grey' }}><b><big>Dynamic added farm in progress...</big></b></div><br/> */}

                {this.props.farmLoading ?
                    <div className="row floated" >
                        {this.props.poolSegmentInfo[0].map((poolSegmentInfo, key) => {
                            let i = this.props.poolSegmentInfo[0].indexOf(poolSegmentInfo)
                            return (
                                <div key={key}>
                                    <div className="col">
                                        <div className="card mb-4 cardbody card-body text-center" style={{ maxWidth: '230px', color: 'silver' }}>
                                            <span>
                                                <img src={purse} height='30' alt="" /><br />
                                                <b className="text">{this.props.lpTokenSegmentAsymbol[0][i]}-{this.props.lpTokenSegmentBsymbol[0][i]}</b>
                                                <div>
                                                    <span className=" "><small>Deposit<small className="textSmall">{this.props.lpTokenSegmentAsymbol[0][i]}-{this.props.lpTokenSegmentBsymbol[0][i]} PANCAKE LP</small> to Earn PURSE</small></span><br /><br />

                                                    <span className="" style={{ color: 'silver' }}> {this.props.aprloading ?
                                                        <div className="">
                                                            <span><small>APR: {parseFloat(this.props.apr[0][i]).toFixed(3)} % &nbsp;</small></span>
                                                            <span className="">
                                                                <Popup trigger={open => (
                                                                    <span style={{ position: "relative", top: '-1px' }}><BsFillQuestionCircleFill size={10} /></span>
                                                                )}
                                                                    on="hover"
                                                                    position="right center"
                                                                    offsetY={-50}
                                                                    offsetX={10}
                                                                    contentStyle={{ padding: '3px' }}
                                                                ><span className="textInfo"><small>APR are affected by the price of PURSE which has not yet stabilized. </small></span>
                                                                    <span className="textInfo"><small>If it shows 'NaN' or 'Infinity', it means currently the pool has no LP token staked. </small></span>
                                                                </Popup></span> </div> :
                                                        <div className="">
                                                            <span><small>APR:</small></span>&nbsp;&nbsp;
                                                            <span className="lds-dual-ring"><div></div><div></div><div></div></span>
                                                        </div>} </span>

                                                    <span className=""><small>Bonus Multiplier: {this.props.bonusMultiplier[0][i]}x &nbsp;
                                                        <Popup
                                                            trigger={open => (
                                                                <span style={{ position: "relative", top: '-0.8px' }}><BsFillQuestionCircleFill size={10} /></span>
                                                            )}
                                                            on="hover"
                                                            position="right center"
                                                            offsetY={-50}
                                                            offsetX={5}
                                                            contentStyle={{ padding: '3px'}}
                                                        >
                                                            <span className="textInfo"><small>The Multiplier represents the proportion of PURSE rewards each farm receives, as a proportion of the PURSE produced each block.</small><br /></span>
                                                            <span className="textInfo"><small>For example, if a 1x farm received 1 PURSE per block, a 40x farm would receive 40 PURSE per block.</small><br /></span>
                                                            <span className="textInfo"><small>This amount is already included in all APR calculations for the farm. </small></span></Popup>&nbsp;</small></span><br />

                                                    <span className=" "><small>LP Staked: {parseFloat(this.props.userSegmentInfo[0][i])}</small></span><br />
                                                    <span className=" "><small>Purse Earned: {parseFloat(this.props.pendingSegmentReward[0][i])}</small></span><br />
                                                    <span className=" "><small>{this.props.aprloading ? <div className="">TVL: $ {parseFloat(this.props.tvl[0][i]).toFixed(3)} </div> :
                                                        <div className="">
                                                            <span><small>TVL:</small></span>&nbsp;&nbsp;
                                                            <span className="lds-dual-ring"><div></div><div></div><div></div></span>
                                                        </div>} </small></span><br />

                                                    <Buttons variant="outline-info" size="sm" style={{ minWidth: '80px', marginTop: '10px' }} className="mb-2" onClick={() => {
                                                        this.props.setTrigger(true)
                                                        this.props.setI(0, i)
                                                    }}>Select</Buttons>
                                                    <div >
                                                        <Buttons
                                                            variant="outline-success"
                                                            type="submit"
                                                            size="sm"
                                                            style={{ minWidth: '80px' }}
                                                            onClick={(event) => {
                                                                event.preventDefault()
                                                                this.props.harvest(i, "0")
                                                            }}>
                                                            Harvest
                                                        </Buttons>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className="center">
                        <div className="bounceball"></div> &nbsp;
                        <div className="textLoadingSmall">NETWORK IS Loading...</div>
                    </div>
                }




            </div >
        );
    }
}

export default Menu;
