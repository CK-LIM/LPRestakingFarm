import React, { Component } from 'react'
import bigInt from 'big-integer'
import Button from 'react-bootstrap/Button'
import './App.css';

class Claim extends Component {

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
    }

    changeHandler(event) {
        if (event == "") {
            this.setState({
                message: ''
            })
            this.setState({
                txValidAdd: false
            })
        } else if (event !== "") {
            let result = window.web3.utils.isAddress(event); // true if its a valid address, false if not
            if (result == false) {
                this.setState({
                    message: 'Not a valid BEP-20 Address'
                })
                this.setState({
                    txValidAdd: false
                })
            }
            else {
                this.setState({
                    message: ''
                })
                this.setState({
                    txValidAdd: true
                })
            }
        }
    }


    render() {
        return (
            <div id="content" className="mt-4">
                <label className="center textWhite mb-5"><b>Claim Distributed PURSE</b></label>
                <div className="rowC">
                    <div className="card cardbody mr-3" style={{ width: '450px', height:'200px', color: 'white' }}>
                        <div className="card-body center">
                            <table className=" textWhiteSmall text-center" style={{ width: '400px'}}>
                                <thead>
                                    <tr>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{Date(this.props.rewardStartTime * 1000)}</td>
                                        <td>{this.props.rewardEndTime}</td>
                                    </tr>
                                </tbody>
                                <thead>
                                    <tr>
                                        <th scope="col">Distributed Amount</th>
                                        <th scope="col">End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{this.props.distributedAmount}</td>
                                        <td>Purse</td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>
                    </div>
                    
                    <div className="card cardbody" style={{ width: '450px', color: 'white' }}>
                        <div className="card-body">
                            {this.props.wallet || this.props.walletConnect ?
                                <div>
                                    <div className="center textWhiteHeading mb-4"><b>Check Your Claimable amount</b></div>
                                    <div>
                                        <div className="textWhiteSmall mb-1"><b>Your address:</b></div>
                                        <div className="textWhiteSmall mb-1"><b>{this.props.account}</b></div>
                                    </div>
                                    <div>
                                        <div className="textWhiteSmall mb-1"><b>Amount:</b></div>
                                        <div className="textWhiteSmall mb-1"><b>~{this.props.account}</b></div>
                                    </div>
                                    <div className="center mt-2 mb-4">
                                        <Button
                                            className="btn-block"
                                            variant="success"
                                            size="sm"
                                            style={{ minWidth: '80px' }}
                                            onClick={(event) => {
                                                event.preventDefault()
                                                this.props.claimDistributePurse()
                                            }}>Claim
                                        </Button>
                                    </div>
                                    <div className="float-left">
                                        <div className="textWhiteMedium mt-2 mb-2" ><b>Check Other Address:</b></div>
                                    </div>
                                    <form onSubmit={(event) => {
                                        event.preventDefault()
                                        if (this.state.txValidAmount === false) {
                                            alert("Invalid input! PLease check your input again")
                                        } else {
                                            this.props.checkClaimAmount(this.input.value)
                                        }
                                    }}>
                                        <div>
                                            <div className="input-group mb-2" >
                                                <input
                                                    type="text"
                                                    style={{ color: 'grey' }}
                                                    ref={(input) => { this.input = input }}
                                                    className="form-control form-control-sm cardbody"
                                                    placeholder="BSC Address"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        this.changeHandler(value)
                                                    }}
                                                    required />
                                            </div >
                                            <div style={{ color: 'red' }}>{this.state.message} </div>
                                            <div className="center mb-2">
                                                <Button type="submit" className="btn btn-block btn-primary btn-sm" >Check</Button>                                                                                    </div>
                                        </div>
                                    </form>
                                </div>
                                :
                                <div>
                                    <div className="center textWhiteMedium mt-2 mb-2"><b>Connect wallet to check distributed PURSE amount</b></div>
                                    <div className="center mt-4"><button type="submit" className="btn btn-primary btn-lg" onClick={async () => {
                                        await this.props.connectWallet()
                                    }}>Connect</button></div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Claim;
