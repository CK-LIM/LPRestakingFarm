import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import './App.css';

class Distribution extends Component {

    constructor(props) {
        super(props)
        this.state = { addValid: false }
        this.state = { message: '' }
        this.state = { claimMessage: '' }
    }

    changeHandler(event) {
        if (event == "") {
            this.setState({
                message: ''
            })
            this.setState({
                addValid: false
            })
        } else if (event !== "") {
            let result = window.web3.utils.isAddress(event); // true if its a valid address, false if not
            if (result == false) {
                this.setState({
                    message: 'Not a valid BEP-20 Address'
                })
                this.setState({
                    addValid: false
                })
            } else {
                this.setState({
                    message: ''
                })
                this.setState({
                    addValid: true
                })
            }
        }
    }


    render() {
        return (
            <div id="content" className="mt-4">
                <label className="textWhite center mb-5" style={{ fontSize : '40px' }}><big><b>PURSE Distribution</b></big></label>
                <div className="rowC">
                    <div className="card cardbody mr-3" style={{ width: '450px', height: '410px', color: 'white' }}>
                        <div className="card-body center">
                            <span>
                                <table className=" textWhiteSmall text-center mb-4" style={{ width: '400px' }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">End Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{this.props.rewardStartTimeDate}</td>
                                            <td>{this.props.rewardEndTimeDate}</td>
                                        </tr>
                                    </tbody>
                                    <thead>
                                        <tr>
                                            <th scope="col">Distribution Amount</th>
                                            {/* <th scope="col">Distribution Percentage</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{parseFloat(window.web3Bsc.utils.fromWei(this.props.distributedAmount, 'Ether')).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                                            {/* <td>{this.props.distributedPercentage}</td> */}
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="ml-3"><b>Remarks:</b></div>
                                <ul>
                                    <li className=" textWhiteSmaller">Distributed tokens are from B<b>D</b>L deducted from each PURSE token transaction.</li>
                                    <li className=" textWhiteSmaller">Make sure web app is connected to the wallet(BSC network).</li>
                                    <li className=" textWhiteSmaller">Make sure you have BNB to pay for transaction fees (~1 USD worth of BNB, paid to the network).</li>
                                    <li className=" textWhiteSmaller">Click on claim and confirm the transaction to claim your PURSE tokens.</li>
                                </ul>
                            </span>
                        </div>
                    </div>
                    {this.props.wallet || this.props.walletConnect ?
                        <div className="card cardbody" style={{ width: '450px', color: 'white' }}>
                            <div className="card-body">
                                <div>
                                    <div>
                                        <div className="textWhiteSmall mb-1"><b>Address:</b></div>
                                        <div className="textWhiteSmall mb-1"><b>{this.props.account}</b></div>
                                    </div>
                                    <div>
                                        <div className="textWhiteSmall mb-1"><b>Amount:</b></div>
                                        <div className="textWhiteSmall mb-1"><b>{this.props.claimAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</b></div>
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
                                        <div className="textWhiteSmall mt-2 mb-2" ><b>Check Other Address:</b></div>
                                    </div>
                                    <form onSubmit={async (event) => {
                                        event.preventDefault()
                                        if (this.state.addValid == false) {
                                            alert("Invalid input! PLease check your input again")
                                        } else {
                                            let claimMessage = await this.props.checkClaimAmount(this.input.value)
                                            let otherAddressAmount = "Claimable Amount:" + " " + claimMessage.toLocaleString('en-US', { maximumFractionDigits: 2 })
                                            this.setState({ otherAddressAmount })
                                        }
                                    }}>
                                        <div>
                                            <div className="input-group mb-2" >
                                                <input
                                                    type="text"
                                                    style={{ color: 'white', backgroundColor: '#28313b' }}
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
                                                <Button type="submit" className="btn btn-block btn-primary btn-sm" >Check</Button>
                                            </div>
                                            <div className="textWhiteSmall mt-2"><b>{this.state.otherAddressAmount}</b></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="card cardbody" style={{ width: '450px',  height: '200px', color: 'white' }}>
                            <div className="card-body">
                                <div>
                                    <div className="center textWhiteMedium mt-2 mb-3"><b>Connect wallet to claim distributed PURSE</b></div>
                                    <div className="center mt-4"><button type="submit" className="btn btn-primary btn-lg mt-3" onClick={async () => {
                                        await this.props.connectWallet()
                                    }}>Connect</button></div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div >

        );
    }
}

export default Distribution;
