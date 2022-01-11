import React, { Component } from 'react'
import bigInt from 'big-integer'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
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
                txValidAmount: false
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
            <div id="content" className="mt-0">
                <h2 className="center textWhite"><b>Claim Distributed PURSE</b></h2>

                <div className="card mb-4 cardbody" >
                    <div className="card-body">
                        <h2 className="center textWhite"><b>Check Your Claimable amount</b></h2>
                        {this.props.wallet || this.props.walletConnect ?
                            <form className="mb-3" onSubmit={(event) => {
                                event.preventDefault()
                                if (this.state.txValidAmount === false) {
                                    alert("Invalid input! PLease check your input again")
                                } else {
                                    // let amount = this.input.value.toString()
                                    // if (this.state.txDeposit === true && this.state.txWithdraw === false) {
                                        // if (bigInt(amountWei).value > 0) {
                                            // alert("No token to claim")
                                            this.props.checkClaimAmount(this.input.value)
                                        // } else {
                                            // this.props.checkClaimAmount(this.input.value)
                                        // }
                                    // }
                                }
                            }}>
                                <div>
                                    <div className="input-group mb-4" >
                                        <input
                                            type="text"
                                            style={{ color: 'grey' }}
                                            ref={(input) => { this.input = input }}
                                            className="form-control form-control-lg cardbody"
                                            placeholder="0"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                this.changeHandler(value)
                                            }}
                                            required />

                                    </div >
                                    <div style={{ color: 'red' }}>{this.state.message} </div>

                                    <div className="rowC center">
                                        <ButtonGroup>
                                            <Button type="submit" className="btn btn-primary btn-lg" >&nbsp;Check&nbsp;</Button>
                                        </ButtonGroup>
                                    </div>
                                </div>
                            </form>
                            :
                            <div className="rowC center">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={async () => {
                                    await this.props.connectWallet()
                                }}>Connect Wallet</button>
                            </div>
                        }
                    </div>
                </div>

            </div>

        );
    }
}

export default Claim;
