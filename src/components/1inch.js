import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import purse from '../purse.png'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from '@material-ui/core/Button';
import Buttons from 'react-bootstrap/Button'
import './App.css';

class Menu extends Component {

    render() {
        return (
            <div id="content" className="mt-3">
                <div className="text-center">
                    <ButtonGroup>
                        <Button variant="outlined" color="primary" component={Link} to="/menu/" >pancakeswap</Button>
                        <Button variant="contained" color="primary" component={Link} to="/oneinch/" >1inch</Button>
                    </ButtonGroup>
                </div>
                <br />
                <div className="center img">
                    <img src={purse} height='100' alt="" />
                </div><br/>
                <h1 className="textWhite center"><b>LP Restaking Farm</b></h1>
                <div className="center" style={{ color: 'silver' }}>&nbsp;Stake <b>&nbsp;Pancakeswap LP Tokens&nbsp;</b> to earn PURSE!!!</div>
                <br />

                <div className="rowC center">
                    <div className="card mb-4 cardbody" style={{ minWidth: '350px', color: 'silver' }} >
                        <div className="card-body">
                            <span>
                                <span className="float-left">
                                    Your PURSE Balance<br /><b>{window.web3.utils.fromWei(this.props.purseTokenUpgradableBalance, 'Ether')}</b>
                                    <div>
                                    </div>
                                </span><br /><br /><br />
                            </span>
                            <span>
                                <small>
                                    <span className="float-left">Pending harvest</span>
                                    <span className="float-right">
                                        <span>
                                            {window.web3.utils.fromWei(this.props.totalpendingReward, 'Ether')}&nbsp;PURSE
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
                                    Total PURSE Supply<br /><b>{window.web3.utils.fromWei(this.props.purseTokenTotalSupply, 'Ether')}</b>
                                    <div>
                                    </div>
                                </span><br /><br /><br />
                                <span>
                                    <small>
                                        <span className="float-left ">Total Reward/block</span>
                                        <span className="float-right ">
                                            <span>
                                                {window.web3.utils.fromWei(this.props.totalrewardperblock, 'Ether')}&nbsp;PURSE
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
                                        <span className=" text-muted"><small>APY:  {(28000 * 365 * this.props.poolInfo[1].pursePerBlock / this.props.lpTokenInContract[1]) * 100} % </small></span><br />
                                        <span className=" text-muted"><small>LP Staked: {window.web3.utils.fromWei(this.props.userInfo[1].amount, 'Ether')}</small></span><br />
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

                <br />
                {/* <div className="center" style={{ color: 'grey' }}><b><big>Dynamic added farm in progress...</big></b></div><br/> */}

                <div className="row floated" >
                    {this.props.poolSegmentInfo[1].map((poolSegmentInfo, key) => {
                        let i = this.props.poolSegmentInfo[1].indexOf(poolSegmentInfo)
                        return (
                            <div key={key}>
                                <div className="col">
                                    <div className="card mb-4 cardbody card-body text-center" style={{ maxWidth: '230px', color: 'silver' }}>
                                        <span>
                                            <img src={purse} height='30' alt="" /><br/><br/>
                                            <b  className="text">{this.props.lpTokenSegmentAsymbol[1][i]}-{this.props.lpTokenSegmentBsymbol[1][i]}</b>
                                            <div>
                                                <span className=" "><small>Deposit<small className="textSmall">{this.props.lpTokenSegmentAsymbol[1][i]}-{this.props.lpTokenSegmentBsymbol[1][i]} PANCAKE LP</small> to Earn PURSE</small></span><br /><br />
                                                <span className=" "><small>APR:  {this.props.apr[1][i]} % </small></span><br />
                                                <span className=" "><small>LP Staked: {this.props.userSegmentInfo[1][i]}</small></span><br />
                                                <span className=" "><small>Purse Earned: {this.props.pendingSegmentReward[1][i]}</small></span><br />
                                                <span className=" "><small>TVL: $ {this.props.tvl[1][i]}</small></span>
                                                <br />
                                                {/* <Button variant="outlined" color="default" component={Link} onClick={(event) => { this.props.setI(0, i) }} to="/deposit">Select</Button> */}
                                                <Buttons variant="outline-info" size="sm" style={{ minWidth: '80px' }} className="mb-2" onClick={() => {
                                                    this.props.setTrigger(true)
                                                    this.props.setI(1, i)
                                                }}>Select</Buttons>
                                                <div >
                                                    <Buttons
                                                        variant="outline-success"
                                                        type="submit"
                                                        size="sm"
                                                        style={{ minWidth: '80px' }}
                                                        onClick={(event) => {
                                                            event.preventDefault()
                                                            this.props.harvest(i)
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
            </div >
        );
    }
}

export default Menu;
