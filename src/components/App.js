import React, { Component } from 'react'
import Web3 from 'web3'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LpToken from '../abis/LpToken.json'
import IPancakePair from '../abis/IPancakePair.json'
import PurseTokenUpgradable from '../abis/PurseTokenUpgradable.json'
import RestakingFarm from '../abis/RestakingFarm.json'

import Navb from './Navbar'
import Main from './Main'
import Menu from './Menu'
import Oneinch from './1inch'
import Deposit from './Deposit'
import Popup from './Popup'
import './Popup.css'
import './App.css'
import { FaWindowClose } from 'react-icons/fa';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    while (this.state.loading == false) {
      if (this.state.wallet == false) {
        await this.loadBlockchainData()
        console.log("repeatfalse")
        await this.delay(1500);
      } else {
        window.alert('Please connect metamask wallet to Binance Smart Chain Testnet and refresh webpage.')
        await this.loadBlockchainData()
        console.log("repeat")
        await this.delay(1500);
      }
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    // console.log(window.ethereum)
    // if (window.ethereum) {
    //   const accounts = await web3.eth.getAccounts()
    //   this.setState({ account: accounts[0] })
    //   console.log("abc")
    // } else {
    //   const accounts = "0x0000000000000000000000000000000000000000"
    //   this.setState({ account: accounts })
    // }

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log("abc")
    const first4Account = this.state.account.substring(0, 4)
    const last4Account = this.state.account.slice(-4)
    this.setState({ first4Account: first4Account })
    this.setState({ last4Account: last4Account })
    const networkId = await web3.eth.net.getId()


    // Load PurseTokenUpgradable
    const purseTokenUpgradableData = PurseTokenUpgradable.networks[networkId]
    if (purseTokenUpgradableData) {
      const purseTokenUpgradable = new web3.eth.Contract(PurseTokenUpgradable.abi, purseTokenUpgradableData.address)
      this.setState({ purseTokenUpgradable })
      let purseTokenUpgradableBalance = await purseTokenUpgradable.methods.balanceOf(this.state.account).call()
      this.setState({ purseTokenUpgradableBalance: purseTokenUpgradableBalance.toString() })
      let purseTokenTotalSupply = await purseTokenUpgradable.methods.totalSupply().call()
      this.setState({ purseTokenTotalSupply: purseTokenTotalSupply.toString() })
    }


    // #########################################################################################################################

    // Load RestakingFarm
    const restakingFarmData = RestakingFarm.networks[networkId]
    if (restakingFarmData) {
      const restakingFarm = new web3.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      this.setState({ restakingFarm })

      let poolLength = await restakingFarm.methods.poolLength().call()
      this.setState({ poolLength })

      let totalrewardperblock = 0
      let totalpendingReward = 0

      let userSegmentInfo = [[], []]
      let poolSegmentInfo = [[], []]
      let lpTokenSegmentInContract = [[], []]
      let lpTokenSegmentBalance = [[], []]
      let lpTokenSegmentAsymbol = [[], []]
      let lpTokenSegmentBsymbol = [[], []]
      let pendingSegmentReward = [[], []]
      let n = 0
      let i = 0
      for (i = 0; i < poolLength; i++) {

        let userInfo = await restakingFarm.methods.userInfo(i, this.state.account).call()
        let poolInfo = await restakingFarm.methods.poolInfo(i).call()

        let lpTokenAddress = poolInfo.lpToken
        let lpTokenPair = new web3.eth.Contract(IPancakePair.abi, lpTokenAddress)
        let lpTokenPairA = await lpTokenPair.methods.token0().call()
        let lpTokenPairB = await lpTokenPair.methods.token1().call()
        let lpTokenA = new web3.eth.Contract(LpToken.abi, lpTokenPairA)
        let lpTokenB = new web3.eth.Contract(LpToken.abi, lpTokenPairB)
        let lpTokenInContract = await lpTokenPair.methods.balanceOf(restakingFarmData.address).call()
        let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
        let lpTokenPairsymbol = await lpTokenPair.methods.symbol().call()
        let lpTokenAsymbol = await lpTokenA.methods.symbol().call()
        let lpTokenBsymbol = await lpTokenB.methods.symbol().call()
        let pendingReward = await restakingFarm.methods.pendingReward(i, this.state.account).call()

        totalrewardperblock += parseInt(poolInfo.pursePerBlock)
        totalpendingReward += parseInt(pendingReward)
        // console.log(userInfo)

        if (lpTokenPairsymbol == "Cake-LP") {
          userSegmentInfo[0][n] = userInfo
          poolSegmentInfo[0][n] = poolInfo
          lpTokenSegmentInContract[0][n] = lpTokenInContract
          lpTokenSegmentBalance[0][n] = lpTokenBalance
          lpTokenSegmentAsymbol[0][n] = lpTokenAsymbol
          lpTokenSegmentBsymbol[0][n] = lpTokenBsymbol
          pendingSegmentReward[0][n] = pendingReward
          n += 1
        } else {
          userSegmentInfo[1][n] = userInfo
          poolSegmentInfo[1][n] = poolInfo
          lpTokenSegmentInContract[1][n] = lpTokenInContract
          lpTokenSegmentBalance[1][n] = lpTokenBalance
          lpTokenSegmentAsymbol[1][n] = lpTokenAsymbol
          lpTokenSegmentBsymbol[1][n] = lpTokenBsymbol
          pendingSegmentReward[1][n] = pendingReward
          n += 1
        }
      }
      // this.setState({ n })
      // this.setState({ i })
      this.setState({ userSegmentInfo })
      this.setState({ poolSegmentInfo })
      this.setState({ lpTokenSegmentInContract })
      this.setState({ lpTokenSegmentBalance })
      this.setState({ lpTokenSegmentAsymbol })
      this.setState({ lpTokenSegmentBsymbol })
      this.setState({ pendingSegmentReward })

      this.setState({ totalrewardperblock: totalrewardperblock.toString() })
      this.setState({ totalpendingReward: totalpendingReward.toLocaleString('fullwide', { useGrouping: false }) })


      this.setState({ loading: false })
      this.setState({ wallet: false })
    } else {
      this.setState({ loading: false })
      this.setState({ wallet: true })
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  delay = ms => new Promise(res => setTimeout(res, ms));

  deposit = async (i, amount, n) => {
    this.setState({ loading: true })
    let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
    // console.log(lpTokenAddress)
    let lpToken = new window.web3.eth.Contract(LpToken.abi, lpTokenAddress)
    await lpToken.methods.approve(this.state.restakingFarm._address, amount).send({ from: this.state.account }).then((result) => {
      this.state.restakingFarm.methods.deposit(i, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
        this.componentWillMount()
      })
    })
  }


  withdraw = (i, amount) => {
    this.setState({ loading: true })
    this.state.restakingFarm.methods.withdraw(i, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      this.componentWillMount()
    })
  }

  setI = (type, pair) => {
    this.state.n = type
    this.state.i = pair
    // this.setState({ n: type })
    // this.setState({ i: pair })
  }

  setTrigger = (state) => {
    this.state.buttonPopup = state
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      lpToken: {},
      purseTokenUpgradable: {},
      restakingFarm: {},
      purseTokenUpgradableBalance: '0',
      purseTokenTotalSupply: '0',
      i: '0',
      n: '0',
      loading: true,
      wallet: true,
      poolLength: '0',
      userSegmentInfo: [[]],
      poolSegmentInfo: [[]],
      lpTokenSegmentInContract: [[]],
      lpTokenSegmentBalance: [[]],
      lpTokenSegmentAsymbol: [[]],
      lpTokenSegmentBsymbol: [[]],
      pendingSegmentReward: [[]],
      totalrewardperblock: '0',
      totalpendingReward: '0',
      buttonPopup: false
    }
  }

  render() {
    let maincontent
    let menucontent
    let depositcontent
    let oneinchcontent
    if (this.state.loading || this.state.wallet) {
      maincontent =
        <div className="wrap">
          <div className="loading">
            <div className="bounceball"></div>
            <div className="textLoading">NETWORK IS A LITTLE SLOW...</div>
          </div>
        </div>
      depositcontent =
        <div className="textLoadingSmall">Loading...</div>
      menucontent =
        <div className="wrap">
          <div className="loading">
            <div className="bounceball"></div>
            <div className="textLoading">NETWORK IS A LITTLE SLOW...</div>
          </div>
        </div>
    } else {
      maincontent = <Main
        lpTokenBalance={this.state.lpTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        poolLength={this.state.poolLength}
        deposit={this.deposit}
        withdraw={this.withdraw}
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
        lpTokenInContract={this.state.lpTokenInContract}
        totalrewardperblock={this.state.totalrewardperblock}
      />
      menucontent = <Menu
        lpTokenBalance={this.state.lpTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        deposit={this.deposit}
        withdraw={this.withdraw}
        setI={this.setI}
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
        totalpendingReward={this.state.totalpendingReward}
        totalrewardperblock={this.state.totalrewardperblock}
        userSegmentInfo={this.state.userSegmentInfo}
        poolSegmentInfo={this.state.poolSegmentInfo}
        lpTokenSegmentInContract={this.state.lpTokenSegmentInContract}
        lpTokenSegmentBalance={this.state.lpTokenSegmentBalance}
        lpTokenSegmentAsymbol={this.state.lpTokenSegmentAsymbol}
        lpTokenSegmentBsymbol={this.state.lpTokenSegmentBsymbol}
        pendingSegmentReward={this.state.pendingSegmentReward}
        buttonPopup={this.state.buttonPopup}
        setTrigger={this.setTrigger}
      />
      depositcontent = <Deposit
        lpTokenBalance={this.state.lpTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        deposit={this.deposit}
        withdraw={this.withdraw}
        i={this.state.i}
        n={this.state.n}
        userSegmentInfo={this.state.userSegmentInfo}
        poolSegmentInfo={this.state.poolSegmentInfo}
        lpTokenSegmentInContract={this.state.lpTokenSegmentInContract}
        lpTokenSegmentBalance={this.state.lpTokenSegmentBalance}
        lpTokenSegmentAsymbol={this.state.lpTokenSegmentAsymbol}
        lpTokenSegmentBsymbol={this.state.lpTokenSegmentBsymbol}
        pendingSegmentReward={this.state.pendingSegmentReward}
      />
      oneinchcontent = <Oneinch
        lpTokenBalance={this.state.lpTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        deposit={this.deposit}
        withdraw={this.withdraw}
        setI={this.setI}
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
        totalpendingReward={this.state.totalpendingReward}
        totalrewardperblock={this.state.totalrewardperblock}
        userSegmentInfo={this.state.userSegmentInfo}
        poolSegmentInfo={this.state.poolSegmentInfo}
        lpTokenSegmentInContract={this.state.lpTokenSegmentInContract}
        lpTokenSegmentBalance={this.state.lpTokenSegmentBalance}
        lpTokenSegmentAsymbol={this.state.lpTokenSegmentAsymbol}
        lpTokenSegmentBsymbol={this.state.lpTokenSegmentBsymbol}
        pendingSegmentReward={this.state.pendingSegmentReward}
        buttonPopup={this.state.buttonPopup}
        setTrigger={this.setTrigger}
      />
    }

    return (
      <Router>
        <div>
          <Navb
            account={this.state.account}
            first4Account={this.state.first4Account}
            last4Account={this.state.last4Account}
            setTrigger={this.setTrigger}
          />
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '800px' }}>
                <div className="content mr-auto ml-auto">
                  <Switch>
                    <Route path="/" exact > {maincontent} </Route>
                    <Route path="/home" exact > {maincontent} </Route>
                    <Route path="/menu" exact > {menucontent} </Route>
                    <Route path="/deposit" exact > {depositcontent} </Route>
                    <Route path="/oneinch/" exact > {oneinchcontent} </Route>
                  </Switch>
                </div>
                <Popup trigger={this.state.buttonPopup} setTrigger={this.setTrigger}>
                  {depositcontent}
                </Popup>
              </main>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;