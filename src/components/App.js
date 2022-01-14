import React, { Component } from 'react'
import Web3 from 'web3'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LpToken from '../abis/LpToken.json'
import IPancakePair from '../abis/IPancakePair.json'
import PurseTokenUpgradable from '../abis/PurseTokenUpgradable.json'
import RestakingFarm from '../abis/RestakingFarm.json'

import PurseFarm from '../farm/farmPurse.json'
import Navb from './Navbar'
import Main from './Main'
import Menu from './Menu'
import Oneinch from './1inch'
import Deposit from './Deposit'
import Popup from './Popup'
import Farm from './Farm'
import Distribution from './Distribution'

import './Popup.css'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadFarmData()
    await this.loadBlockchainData()
    this.loadTVLAPR()
    while (this.state.loading == true) {
      await this.loadBlockchainData()
      await this.delay(1000);
    }
  }

  async loadFarmData() {
    const farm = PurseFarm.farm
    this.setState({ farm })
  }

  async loadBlockchainData() {
    const web3Bsc = window.web3Bsc

    const networkId = "56"

    this.setState({ networkId })
    const farmNetwork = "MAINNET"
    this.setState({ farmNetwork })

    if (this.state.walletConnect == true) {
      if (window.provider.connected == false) {
        await this.WalletDisconnect()
      }
    }

    if (this.state.metamask == true) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.setState({ chainId })

      if (this.state.chainId == "0x61") {
        this.setState({ networkName: "BSC Testnet" })
      } else if (this.state.chainId == "0x38") {
        this.setState({ networkName: "BSC" })
      } else if (this.state.chainId == "0x1") {
        this.setState({ networkName: "Ethereum" })
      } else if (this.state.chainId == "0x3") {
        this.setState({ networkName: "Ropsten" })
      } else if (this.state.chainId == "0x4") {
        this.setState({ networkName: "Rinkeby" })
      } else if (this.state.chainId == "0x2a") {
        this.setState({ networkName: "Kovan" })
      } else if (this.state.chainId == "0x89") {
        this.setState({ networkName: "Polygon" })
      } else if (this.state.chainId == "0x13881") {
        this.setState({ networkName: "Mumbai" })
      } else if (this.state.chainId == "0xa869") {
        this.setState({ networkName: "Fuji" })
      } else if (this.state.chainId == "0xa86a") {
        this.setState({ networkName: "Avalanche" })
      }

      window.ethereum.on('chainChanged', this.handleChainChanged);
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);
    } else {
      this.setState({ chainID: "0x" })
      this.setState({ networkName: "Unavailable" })
    }

    if (this.state.wallet == false && this.state.walletConnect == false) {
      // Load PurseTokenUpgradable
      let response = await fetch(`https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-iqgbt/endpoint/PundiX`);
      const myJson = await response.json();
      let totalTransferAmount = myJson["TransferTotal"]
      let sum30TransferAmount = myJson["Transfer30Days"]
      let totalBurnAmount = myJson["BurnTotal"]
      let sum30BurnAmount = myJson["Burn30Days"]

      this.setState({ totalBurnAmount })
      this.setState({ sum30BurnAmount })
      this.setState({ totalTransferAmount })
      this.setState({ sum30TransferAmount })

      const purseTokenUpgradable = new web3Bsc.eth.Contract(PurseTokenUpgradable.abi, "0x29a63F4B209C29B4DC47f06FFA896F32667DAD2C") //mainnet
      this.setState({ purseTokenUpgradable })
      let purseTokenUpgradableBalance = 0
      this.setState({ purseTokenUpgradableBalance: purseTokenUpgradableBalance.toString() })
      let purseTokenTotalSupply = await purseTokenUpgradable.methods.totalSupply().call()
      this.setState({ purseTokenTotalSupply: purseTokenTotalSupply.toString() })
      let poolRewardToken = await purseTokenUpgradable.methods.balanceOf("0x439ec8159740a9b9a579f286963ac1c050af31c8").call()
      this.setState({ poolRewardToken: poolRewardToken.toString() })

      let rewardEndTime = await this.state.purseTokenUpgradable.methods._getRewardEndTime().call()
      let rewardStartTime = await this.state.purseTokenUpgradable.methods._getRewardStartTime().call()
      let distributedAmount = await this.state.purseTokenUpgradable.methods._monthlyDistributePr().call()
      let distributedPercentage = await this.state.purseTokenUpgradable.methods._percentageDistribute().call()
      let rewardStartTimeDate = this.timeConverter(rewardStartTime)
      let rewardEndTimeDate = this.timeConverter(rewardEndTime)

      const restakingFarm = new web3Bsc.eth.Contract(RestakingFarm.abi, "0x439ec8159740a9b9a579f286963ac1c050af31c8")
      this.setState({ restakingFarm })
      let poolCapRewardToken = await this.state.restakingFarm.methods.capMintToken().call()
      let poolMintedRewardToken = await this.state.restakingFarm.methods.totalMintToken().call()
      let poolLength = await this.state.restakingFarm.methods.poolLength().call()
      this.setState({ poolCapRewardToken })
      this.setState({ poolMintedRewardToken })
      this.setState({ poolLength })

      let totalrewardperblock = 0
      let poolSegmentInfo = [[], []]
      let lpTokenSegmentBalance = [[], []]
      let lpTokenSegmentAsymbol = [[], []]
      let lpTokenSegmentBsymbol = [[], []]
      let bonusMultiplier = [[], []]
      let userSegmentInfo = [[], []]
      let pendingSegmentReward = [[], []]
      let lpTokenLink = [[], []]
      let lpTokenContract = [[], []]

      let lpTokenAsymbols = []
      let lpTokenBsymbols = []
      let lpTokenAddresses = []
      let lpTokenPairAs = []
      let lpTokenPairBs = []
      let lpTokenPairsymbols = []

      let n = 0
      let i = 0

      for (i = 0; i < poolLength; i++) {
        let poolInfo = this.state.farm[i]
        let lpTokenPairA = poolInfo.token[this.state.farmNetwork]["address"]
        let lpTokenPairB = poolInfo.quoteToken[this.state.farmNetwork]["address"]
        let lpTokenPairsymbol = poolInfo.lpTokenPairsymbol
        let lpTokenAsymbol = poolInfo.token[this.state.farmNetwork]["symbol"]
        let lpTokenBsymbol = poolInfo.quoteToken[this.state.farmNetwork]["symbol"]

        let lpTokenBalance = 0
        totalrewardperblock += parseInt(poolInfo.pursePerBlock * poolInfo.bonusMultiplier)

        lpTokenAsymbols[i] = lpTokenAsymbol
        lpTokenBsymbols[i] = lpTokenBsymbol
        lpTokenAddresses[i] = poolInfo.lpAddresses[this.state.networkId]
        lpTokenPairAs[i] = lpTokenPairA
        lpTokenPairBs[i] = lpTokenPairB
        lpTokenPairsymbols[i] = lpTokenPairsymbol

        if (lpTokenPairsymbol == "Cake-LP") {
          userSegmentInfo[0][n] = ""
          pendingSegmentReward[0][n] = ""
          poolSegmentInfo[0][n] = poolInfo
          bonusMultiplier[0][n] = poolInfo.bonusMultiplier
          lpTokenSegmentAsymbol[0][n] = lpTokenAsymbol
          lpTokenSegmentBsymbol[0][n] = lpTokenBsymbol
          lpTokenSegmentBalance[0][n] = lpTokenBalance
          lpTokenLink[0][n] = poolInfo.getLPLink
          lpTokenContract[0][n] = poolInfo.lpContract
          n += 1
        } else {
          userSegmentInfo[1][n] = ""
          pendingSegmentReward[1][n] = ""
          poolSegmentInfo[1][n] = poolInfo
          bonusMultiplier[1][n] = poolInfo.bonusMultiplier
          lpTokenSegmentAsymbol[1][n] = lpTokenAsymbol
          lpTokenSegmentBsymbol[1][n] = lpTokenBsymbol
          lpTokenSegmentBalance[1][n] = lpTokenBalance
          lpTokenLink[1][n] = poolInfo.getLPLink
          lpTokenContract[1][n] = poolInfo.lpContract
          n += 1
        }
      }

      this.setState({ bonusMultiplier })
      this.setState({ poolSegmentInfo })
      this.setState({ lpTokenSegmentBalance })
      this.setState({ lpTokenSegmentAsymbol })
      this.setState({ lpTokenSegmentBsymbol })
      this.setState({ totalrewardperblock: totalrewardperblock.toLocaleString('fullwide', { useGrouping: false }) })
      this.setState({ pendingSegmentReward: [[], []] })
      this.setState({ userSegmentInfo: [[], []] })
      this.setState({ totalpendingReward: "0" })
      this.setState({ lpTokenLink })
      this.setState({ lpTokenContract })

      this.setState({ lpTokenAsymbols })
      this.setState({ lpTokenBsymbols })
      this.setState({ lpTokenAddresses })
      this.setState({ lpTokenPairAs })
      this.setState({ lpTokenPairBs })
      this.setState({ lpTokenPairsymbols })

      this.setState({ rewardStartTime })
      this.setState({ rewardEndTime })
      this.setState({ rewardStartTimeDate })
      this.setState({ rewardEndTimeDate })
      this.setState({ distributedAmount })
      this.setState({ distributedPercentage })

    }
    // ##############################################################################################################################
    else {
      // Load PurseTokenUpgradable
      const restakingFarmData = RestakingFarm.networks[networkId]
      let purseTokenUpgradableBalance = await this.state.purseTokenUpgradable.methods.balanceOf(this.state.account).call()
      this.setState({ purseTokenUpgradableBalance: purseTokenUpgradableBalance.toString() })
      let claimAmount = await this.checkClaimAmount(this.state.account)
      this.setState({ claimAmount })

      // Load RestakingFarm

      let totalpendingReward = 0
      let userSegmentInfo = [[], []]
      let lpTokenSegmentBalance = [[], []]
      let lpTokenSegmentAllowance = [[], []]
      let pendingSegmentReward = [[], []]
      let n = 0
      let i = 0

      for (i = 0; i < this.state.poolLength; i++) {

        let userInfo = await this.state.restakingFarm.methods.userInfo(this.state.lpTokenAddresses[i], this.state.account).call()
        let lpTokenPair = new web3Bsc.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
        let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
        let lpTokenAllowance = await lpTokenPair.methods.allowance(this.state.account, restakingFarmData.address).call()
        let pendingReward = await this.state.restakingFarm.methods.pendingReward(this.state.lpTokenAddresses[i], this.state.account).call()

        totalpendingReward += parseInt(pendingReward)

        if (this.state.lpTokenPairsymbols[i] == "Cake-LP") {

          userSegmentInfo[0][n] = web3Bsc.utils.fromWei(userInfo.amount, 'Ether')
          lpTokenSegmentBalance[0][n] = lpTokenBalance
          lpTokenSegmentAllowance[0][n] = lpTokenAllowance
          pendingSegmentReward[0][n] = web3Bsc.utils.fromWei(pendingReward, 'Ether')
          n += 1
        } else {
          userSegmentInfo[1][n] = web3Bsc.utils.fromWei(userInfo.amount, 'Ether')
          lpTokenSegmentBalance[1][n] = lpTokenBalance
          lpTokenSegmentAllowance[1][n] = lpTokenAllowance
          pendingSegmentReward[1][n] = web3Bsc.utils.fromWei(pendingReward, 'Ether')
          n += 1
        }
      }
      this.setState({ lpTokenSegmentBalance })
      this.setState({ pendingSegmentReward })
      this.setState({ lpTokenSegmentAllowance })
      this.setState({ userSegmentInfo })
      this.setState({ totalpendingReward: totalpendingReward.toLocaleString('fullwide', { useGrouping: false }) })
    }
    this.setState({ loading: true })
    this.setState({ farmLoading: true })
  }

  // ***************************TVL & APR***********************************************************************
  async loadTVLAPR() {
    // Load bavaMasterFarmer

    let tvl = [[], []]
    let apr = [[], []]
    let apyDaily = [[], []]
    let apyWeekly = [[], []]
    let apyMonthly = [[], []]
    let n = 0

    let response = await fetch(`https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-iqgbt/endpoint/TVLAPR`);
    const myJson = await response.json();
    let tvlArray = myJson["TVL"]
    let aprArray = myJson["APR"]
    let apyArray = myJson["APYDaily"]

    for (let i = 0; i < this.state.poolLength; i++) {

      if (this.state.lpTokenPairsymbols[i] == "Cake-LP") {
        tvl[0][n] = tvlArray
        apr[0][n] = aprArray
        apyDaily[0][n] = (Math.pow((1 + 0.8 * apr[0][n] / 36500), 365) - 1) * 100
        apyWeekly[0][n] = (Math.pow((1 + 0.8 * apr[0][n] / 5200), 52) - 1) * 100
        apyMonthly[0][n] = (Math.pow((1 + 0.8 * apr[0][n] / 1200), 12) - 1) * 100
        n += 1
      } else {
        tvl[1][n] = tvlArray
        apr[1][n] = aprArray
        apyDaily[1][n] = (Math.pow((1 + 0.8 * apr[1][n] / 36500), 365) - 1) * 100
        apyWeekly[1][n] = (Math.pow((1 + 0.8 * apr[1][n] / 5200), 52) - 1) * 100
        apyMonthly[1][n] = (Math.pow((1 + 0.8 * apr[1][n] / 1200), 12) - 1) * 100
        n += 1
      }
    }
    this.setState({ tvl })
    this.setState({ apr })
    this.setState({ apyDaily })
    this.setState({ apyWeekly })
    this.setState({ apyMonthly })
    this.setState({ aprloading: true })
  }


  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      // await window.ethereum.enable()
      this.setState({ metamask: true })
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      this.setState({ metamask: true })
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      this.setState({ metamask: false })
      this.setState({ wallet: false })
    }
    // window.web3Bsc = new Web3(`https://data-seed-prebsc-1-s2.binance.org:8545/`);  // testnet
    window.web3Bsc = new Web3(`https://bsc-dataseed.binance.org/`);
    let response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=binancecoin%2Cweth%2Cbinance-usd%2Cusd-coin%2Ctether%2Cbitcoin%2Cpundi-x-purse&vs_currencies=usd`);
    const myJson = await response.json();
    let PURSEPrice = myJson["pundi-x-purse"]["usd"]
    this.setState({ PURSEPrice: PURSEPrice.toFixed(10) })
    let USDTPrice = myJson["tether"]["usd"]
    this.setState({ USDTPrice: USDTPrice.toFixed(10) })
    let USDCPrice = myJson["usd-coin"]["usd"]
    this.setState({ USDCPrice: USDCPrice.toFixed(10) })
    let BNBPrice = myJson["binancecoin"]["usd"]
    this.setState({ BNBPrice: BNBPrice.toFixed(10) })
    let WETHPrice = myJson["weth"]["usd"]
    this.setState({ WETHPrice: WETHPrice.toFixed(10) })
    let BUSDPrice = myJson["binance-usd"]["usd"]
    this.setState({ BUSDPrice: BUSDPrice.toFixed(10) })
    let BTCPrice = myJson["bitcoin"]["usd"]
    this.setState({ BTCPrice: BTCPrice.toFixed(10) })
    this.setState({ loading: true })
  }

  connectWallet = () => {
    if (this.state.metamask == true) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async () => {
          await this.switchNetwork()
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          if (chainId == "0x38") {      // mainnet: 0x38, testnet: 0x61
            this.setWalletTrigger(true)
          }
        })
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            console.error("error");
            console.error(err);
          }
        });
      // this.componentWillMount()
    } else {
      alert("No provider was found")
    }
  }

  WalletConnect = async () => {
    const provider = new WalletConnectProvider({
      rpc: {
        // 97: `https://data-seed-prebsc-1-s3.binance.org:8545/`
        56: `https://bsc-dataseed.binance.org/`
      },
      // chainId: 97,
      chainId: 56,
    });
    window.provider = provider
    // console.log(window.provider)
    await window.provider.enable();
    window.web3Con = await new Web3(window.provider);
    const networkId = await window.web3Con.eth.net.getId();
    if (networkId != 56) {
      alert("You're connected to an unsupported network.")
      this.WalletDisconnect()
    } else {
      const accounts = await window.web3Con.eth.getAccounts();
      this.setState({ account: accounts[0] })
      const first4Account = this.state.account.substring(0, 4)
      const last4Account = this.state.account.slice(-4)
      this.setState({ first4Account: first4Account })
      this.setState({ last4Account: last4Account })
      this.setState({ walletConnect: true })
    }

    // Subscribe to accounts change
    window.provider.on("accountsChanged", this.handleAccountsChanged);

    // Subscribe to session disconnection
    // window.provider.on("disconnect", () => {
    //   this.WalletDisconnect()
    //   window.provider.stop("disconnect", ()=> console.log("exit"))
    // });

  }

  WalletDisconnect = async () => {
    await window.provider.disconnect()
    this.setState({ walletConnect: false })
    this.setState({ pendingSegmentReward: [[], []] })
    this.setState({ userSegmentInfo: [[], []] })
    this.setState({ totalpendingReward: "0" })
  }

  switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],    // mainnet 0x38, testnet: 0x61
      });
    } catch (switchError) {
      // console.log(switchError.code)
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          // console.log(switchError.code)
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x38', rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545'], chainName: 'BSC Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB', // 2-6 characters long
                decimals: 18
              }, blockExplorerUrls: ['https://testnet.bscscan.com/']
            }],
          });
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          // console.log("switched")
          this.setState({ chainId })
          if (this.state.chainId == "0x61") {
            this.setState({ networkName: "BSC Testnet" })
          } else if (this.state.chainId == "0x38") {
            this.setState({ networkName: "BSC" })
          } else if (this.state.chainId == "0x1") {
            this.setState({ networkName: "Ethereum" })
          } else if (this.state.chainId == "0x3") {
            this.setState({ networkName: "Ropsten" })
          } else if (this.state.chainId == "0x4") {
            this.setState({ networkName: "Rinkeby" })
          } else if (this.state.chainId == "0x2a") {
            this.setState({ networkName: "Kovan" })
          } else if (this.state.chainId == "0x89") {
            this.setState({ networkName: "Polygon" })
          } else if (this.state.chainId == "0x13881") {
            this.setState({ networkName: "Mumbai" })
          } else if (this.state.chainId == "0xa869") {
            this.setState({ networkName: "Fuji" })
          } else if (this.state.chainId == "0xa86a") {
            this.setState({ networkName: "Avalanche" })
          }
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }


  handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      // console.log('Please connect to MetaMask.');
      // console.log(accounts)
      this.setWalletTrigger(false)
    } else if (accounts[0] !== this.state.account) {
      // console.log(accounts)
      this.state.account = accounts[0];
      const first4Account = this.state.account.substring(0, 4)
      const last4Account = this.state.account.slice(-4)
      this.setState({ first4Account: first4Account })
      this.setState({ last4Account: last4Account })
      // Do any other work!
    }
  }

  handleChainChanged = async (chainId) => {
    // We recommend reloading the page, unless you must do otherwise
    // window.location.reload();
    // console.log(chainId)
    if (chainId != "0x38") {
      this.setWalletTrigger(false)
    }
    if (this.state.networkId !== chainId) {
      this.state.networkId = chainId
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.setState({ chainId })
      if (this.state.chainId == "0x61") {
        this.setState({ networkName: "BSC Testnet" })
      } else if (this.state.chainId == "0x38") {
        this.setState({ networkName: "BSC" })
      } else if (this.state.chainId == "0x1") {
        this.setState({ networkName: "Ethereum" })
      } else if (this.state.chainId == "0x3") {
        this.setState({ networkName: "Ropsten" })
      } else if (this.state.chainId == "0x4") {
        this.setState({ networkName: "Rinkeby" })
      } else if (this.state.chainId == "0x2a") {
        this.setState({ networkName: "Kovan" })
      } else if (this.state.chainId == "0x89") {
        this.setState({ networkName: "Polygon" })
      } else if (this.state.chainId == "0x13881") {
        this.setState({ networkName: "Mumbai" })
      } else if (this.state.chainId == "0xa869") {
        this.setState({ networkName: "Fuji" })
      } else if (this.state.chainId == "0xa86a") {
        this.setState({ networkName: "Avalanche" })
      }
      this.switchNetwork()
      // Run any other necessary logic...
    }

  }

  timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  delay = ms => new Promise(res => setTimeout(res, ms));

  deposit = async (i, amount, n) => {
    if (this.state.walletConnect == true) {
      this.setState({ loading: false })
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3Con.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      await restakingFarm.methods.deposit(this.state.lpTokenAddresses[i], amount).send({ from: this.state.account }).then(async (result) => {
        let userInfo = await this.state.restakingFarm.methods.userInfo(this.state.lpTokenAddresses[i], this.state.account).call()
        let lpTokenPair = new window.web3Bsc.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
        let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
        let purseTokenUpgradableBalance = await this.state.purseTokenUpgradable.methods.balanceOf(this.state.account).call()
        let pendingReward = await this.state.restakingFarm.methods.pendingReward(this.state.lpTokenAddresses[i], this.state.account).call()

        this.state.userSegmentInfo[n][i] = window.web3Bsc.utils.fromWei(userInfo.amount, 'Ether')
        this.state.lpTokenSegmentBalance[n][i] = lpTokenBalance
        this.state.purseTokenUpgradableBalance = purseTokenUpgradableBalance
        this.state.pendingSegmentReward[n][i] = window.web3Bsc.utils.fromWei(pendingReward, 'ether')
      }).catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert("Something went wrong...Code: 4001 User rejected the request.")
          this.setState({ loading: true })
          this.componentWillMount()
        } else {
          console.error(err);
        }
      });
    } else if (this.state.wallet == true) {
      console.log("efg")
      this.setState({ loading: false })
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      await restakingFarm.methods.deposit(this.state.lpTokenAddresses[i], amount).send({ from: this.state.account }).then(async (result) => {
        let userInfo = await this.state.restakingFarm.methods.userInfo(this.state.lpTokenAddresses[i], this.state.account).call()
        let lpTokenPair = new window.web3Bsc.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
        let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
        let purseTokenUpgradableBalance = await this.state.purseTokenUpgradable.methods.balanceOf(this.state.account).call()
        let pendingReward = await this.state.restakingFarm.methods.pendingReward(this.state.lpTokenAddresses[i], this.state.account).call()

        this.state.userSegmentInfo[n][i] = window.web3Bsc.utils.fromWei(userInfo.amount, 'Ether')
        this.state.lpTokenSegmentBalance[n][i] = lpTokenBalance
        this.state.purseTokenUpgradableBalance = purseTokenUpgradableBalance
        this.state.pendingSegmentReward[n][i] = window.web3Bsc.utils.fromWei(pendingReward, 'ether')
      }).catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert("Something went wrong...Code: 4001 User rejected the request.")
          this.setState({ loading: true })
          this.componentWillMount()
        } else {
          console.error(err);
        }
      });
    }
    this.setState({ loading: true })
    this.componentWillMount()
  }

  approve = async (i, n) => {
    if (this.state.walletConnect == true) {
      this.setState({ loading: false })
      let lpToken = new window.web3Con.eth.Contract(LpToken.abi, this.state.lpTokenAddresses[i])

      await lpToken.methods.approve(this.state.restakingFarm._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account }).then(async (result) => {
        let lpTokenPair = new window.web3Bsc.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
        let lpTokenAllowance = await lpTokenPair.methods.allowance(this.state.account, this.state.restakingFarm._address).call()
        this.state.lpTokenSegmentAllowance[n][i] = lpTokenAllowance
      })
      this.componentWillMount()
      this.setState({ loading: true })
    } else if (this.state.wallet == true) {
      this.setState({ loading: false })
      let lpToken = new window.web3.eth.Contract(LpToken.abi, this.state.lpTokenAddresses[i])

      await lpToken.methods.approve(this.state.restakingFarm._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account }).then(async (result) => {
        let lpTokenPair = new window.web3Bsc.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
        let lpTokenAllowance = await lpTokenPair.methods.allowance(this.state.account, this.state.restakingFarm._address).call()
        this.state.lpTokenSegmentAllowance[n][i] = lpTokenAllowance
      })
      this.componentWillMount()
      this.setState({ loading: true })
    }
  }

  withdraw = async (i, amount, n) => {
    if (this.state.walletConnect == true) {
      this.setState({ loading: false })
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3Con.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      restakingFarm.methods.withdraw(this.state.lpTokenAddresses[i], amount).send({ from: this.state.account }).then(async (result) => {
        let userInfo = await this.state.restakingFarm.methods.userInfo(this.state.lpTokenAddresses[i], this.state.account).call()
        let lpTokenPair = new window.web3Bsc.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
        let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
        let purseTokenUpgradableBalance = await this.state.purseTokenUpgradable.methods.balanceOf(this.state.account).call()
        let pendingReward = await this.state.restakingFarm.methods.pendingReward(this.state.lpTokenAddresses[i], this.state.account).call()

        this.state.userSegmentInfo[n][i] = window.web3Bsc.utils.fromWei(userInfo.amount, 'Ether')
        this.state.lpTokenSegmentBalance[n][i] = lpTokenBalance
        this.state.purseTokenUpgradableBalance = purseTokenUpgradableBalance
        this.state.pendingSegmentReward[n][i] = window.web3Bsc.utils.fromWei(pendingReward, 'ether')
        this.setState({ loading: true })
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert("Something went wrong...Code: 4001 User rejected the request.")
          this.setState({ loading: true })
          this.componentWillMount()
        } else {
          console.error(err);
        }
      });
    } else if (this.state.wallet == true) {
      this.setState({ loading: false })
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      restakingFarm.methods.withdraw(this.state.lpTokenAddresses[i], amount).send({ from: this.state.account }).then(async (result) => {
        let userInfo = await this.state.restakingFarm.methods.userInfo(this.state.lpTokenAddresses[i], this.state.account).call()
        let lpTokenPair = new window.web3Bsc.eth.Contract(IPancakePair.abi, this.state.lpTokenAddresses[i])
        let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
        let purseTokenUpgradableBalance = await this.state.purseTokenUpgradable.methods.balanceOf(this.state.account).call()
        let pendingReward = await this.state.restakingFarm.methods.pendingReward(this.state.lpTokenAddresses[i], this.state.account).call()

        this.state.userSegmentInfo[n][i] = window.web3Bsc.utils.fromWei(userInfo.amount, 'Ether')
        this.state.lpTokenSegmentBalance[n][i] = lpTokenBalance
        this.state.purseTokenUpgradableBalance = purseTokenUpgradableBalance
        this.state.pendingSegmentReward[n][i] = window.web3Bsc.utils.fromWei(pendingReward, 'ether')
        this.setState({ loading: true })
        this.componentWillMount()
      }).catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert("Something went wrong...Code: 4001 User rejected the request.")
          this.setState({ loading: true })
          this.componentWillMount()
        } else {
          console.error(err);
        }
      });
    }
  }

  harvest = async (i, n) => {
    if (this.state.walletConnect == true) {
      if (this.state.pendingSegmentReward[n][i] <= 0) {
        alert("No token to harvest! Please deposit LP to earn PURSE")
      } else {
        this.setState({ loading: false })
        const restakingFarmData = RestakingFarm.networks[this.state.networkId]
        let restakingFarm = new window.web3Con.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
        restakingFarm.methods.claimReward(this.state.lpTokenAddresses[i]).send({ from: this.state.account }).then(async (result) => {
          let purseTokenUpgradableBalance = await this.state.purseTokenUpgradable.methods.balanceOf(this.state.account).call()
          this.state.purseTokenUpgradableBalance = purseTokenUpgradableBalance
          let pendingReward = await this.state.restakingFarm.methods.pendingReward(this.state.lpTokenAddresses[i], this.state.account).call()
          this.state.pendingSegmentReward[n][i] = window.web3.utils.fromWei(pendingReward, 'ether')
          this.componentWillMount()
        }).catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert("Something went wrong...Code: 4001 User rejected the request.")
            this.setState({ loading: true })
            this.componentWillMount()
          } else {
            console.error(err);
          }
        });
      }
      this.setState({ loading: true })
    } else if (this.state.wallet == true) {
      if (this.state.pendingSegmentReward[n][i] <= 0) {
        alert("No token to harvest! Please deposit LP to earn PURSE")
      } else {
        this.setState({ loading: false })
        const restakingFarmData = RestakingFarm.networks[this.state.networkId]
        let restakingFarm = new window.web3.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
        restakingFarm.methods.claimReward(this.state.lpTokenAddresses[i]).send({ from: this.state.account }).then(async (result) => {
          let purseTokenUpgradableBalance = await this.state.purseTokenUpgradable.methods.balanceOf(this.state.account).call()
          this.state.purseTokenUpgradableBalance = purseTokenUpgradableBalance
          let pendingReward = await this.state.restakingFarm.methods.pendingReward(this.state.lpTokenAddresses[i], this.state.account).call()
          this.state.pendingSegmentReward[n][i] = window.web3.utils.fromWei(pendingReward, 'ether')
          this.componentWillMount()
        }).catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert("Something went wrong...Code: 4001 User rejected the request.")
            this.setState({ loading: true })
            this.componentWillMount()
          } else {
            console.error(err);
          }
        });
      }
      this.setState({ loading: true })
    } else {
      alert("Wallet is not connected")
    }
  }

  checkClaimAmount = async (address) => {
    let lastRewardStartTime = await this.state.purseTokenUpgradable.methods._lastRewardStartTime().call()
    let _numOfDays = await this.state.purseTokenUpgradable.methods._numOfDaysPerMth().call()
    let _percentageDis = await this.state.purseTokenUpgradable.methods._percentageDistribute().call()
    let _averageInterval = await this.state.purseTokenUpgradable.methods._averageInterval().call()

    let userRewardInfo = await this.state.purseTokenUpgradable.methods.accAmount(address).call()
    let userBalance = await this.state.purseTokenUpgradable.methods.balanceOf(address).call()
    userBalance = window.web3Bsc.utils.fromWei(userBalance, 'Ether')

    let reward = 0
    if (userRewardInfo.lastUpdateTime == 0) {
      reward = 0
    } else if (userRewardInfo.lastUpdateTime >= this.state.rewardStartTime) {
      reward = userRewardInfo.accReward
    } else if (userRewardInfo.lastUpdateTime < lastRewardStartTime) {
      let interval = (this.state.rewardStartTime - lastRewardStartTime) / _averageInterval;
      let accumulateAmount = userBalance * interval;
      reward = accumulateAmount * this.state.distributedAmount * _percentageDis / this.state.purseTokenTotalSupply / _numOfDays / 100;
    } else {
      let interval = ((this.state.rewardStartTime - userRewardInfo.lastUpdateTime) / _averageInterval).toFixed(0);
      let accumulateAmount = userBalance * interval;
      console.log(userBalance)
      let lastmonthAccAmount = parseInt(window.web3Bsc.utils.fromWei(userRewardInfo.amount, 'Ether')) + accumulateAmount;
      console.log(lastmonthAccAmount)
      reward = lastmonthAccAmount * this.state.distributedAmount * _percentageDis / this.state.purseTokenTotalSupply / _numOfDays / 100;
    }
    return reward
  }

  claimDistributePurse = async () => {
    let rewardEndTime = await this.state.purseTokenUpgradable.methods._getRewardEndTime().call()
    let rewardStartTime = await this.state.purseTokenUpgradable.methods._getRewardStartTime().call()
    if ((Date.now() / 1000).toFixed(0) < rewardStartTime) {
      alert("Distribution not started yet")
    } else if ((Date.now() / 1000).toFixed(0) > rewardEndTime) {
      alert("Distribution already end")
    } else {
      if (this.state.claimAmount == 0) {
        alert("No reward available")
      } else {
        let purseTokenUpgradable = new window.web3.eth.Contract(PurseTokenUpgradable.abi, "0x29a63F4B209C29B4DC47f06FFA896F32667DAD2C")
        await purseTokenUpgradable.methods.claimDistributionPurse().send({ from: this.state.account })
      }
    }
  }

  setI = (type, pair) => {
    this.setState({ n: type })
    this.setState({ i: pair })
  }

  setTrigger = (state) => {
    this.setState({ buttonPopup: state })
  }

  setWalletTrigger = async (state) => {
    if (state == false) {
      await this.setState({ wallet: state })
      this.setState({ pendingSegmentReward: [[], []] })
      this.setState({ userSegmentInfo: [[], []] })
      this.setState({ totalpendingReward: "0" })
    } else {
      const accounts = await window.web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      const first4Account = this.state.account.substring(0, 4)
      const last4Account = this.state.account.slice(-4)
      this.setState({ first4Account: first4Account })
      this.setState({ last4Account: last4Account })
      this.setState({ wallet: state })
    }
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
      totalBurnAmount: '0',
      sum30BurnAmount: '0',
      totalTransferAmount: '0',
      sum30TransferAmount: '0',
      i: '0',
      n: '0',
      loading: false,
      wallet: false,
      metamask: false,
      farmLoading: false,
      walletConnect: false,
      aprloading: false,
      poolLength: '0',
      userSegmentInfo: [[], []],
      poolSegmentInfo: [[], []],
      lpTokenSegmentBalance: [[], []],
      lpTokenSegmentAsymbol: [[], []],
      lpTokenSegmentBsymbol: [[], []],
      pendingSegmentReward: [[], []],
      lpTokenSegmentAllowance: [[], []],
      bonusMultiplier: [[], []],
      tvl: [[], []],
      apr: [[], []],
      apyDaily: [[], []],
      apyWeekly: [[], []],
      apyMonthly: [[], []],
      totalrewardperblock: '0',
      totalpendingReward: '0',
      buttonPopup: false,
      poolCapRewardToken: '0',
      poolMintedRewardToken: '0',
      poolRewardToken: '0',
      networkName: "Loading",
      lpTokenLink: '',
      lpTokenContract: '',
      rewardEndTime: '0',
      rewardStartTime: '0',
      distributedAmount: '0',
      distributedPercentage: '0',
      rewardEndTimeDate: '0',
      rewardStartTimeDate: '0',
      claimAmount: '0'
    }
  }

  render() {
    let maincontent
    let menucontent
    let depositcontent
    let oneinchContent
    let distributionContent
    let farmInfoContent
    if (this.state.loading == false) {
      maincontent =
        <div className="wrap">
          <div className="loading">
            <div className="bounceball"></div>
            <div className="textLoading">NETWORK IS LOADING...</div>
          </div>
        </div>
      depositcontent =
        <div className="textLoadingSmall">Loading...</div>
      menucontent =
        <div className="wrap">
          <div className="loading">
            <div className="bounceball"></div>
            <div className="textLoading">NETWORK IS LOADING...</div>
          </div>
        </div>
    } else {
      maincontent = <Main
        lpTokenBalance={this.state.lpTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        poolLength={this.state.poolLength}
        deposit={this.deposit}
        withdraw={this.withdraw}
        PURSEPrice={this.state.PURSEPrice}
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
        lpTokenInContract={this.state.lpTokenInContract}
        totalrewardperblock={this.state.totalrewardperblock}
        poolCapRewardToken={this.state.poolCapRewardToken}
        poolMintedRewardToken={this.state.poolMintedRewardToken}
        poolRewardToken={this.state.poolRewardToken}
        totalBurnAmount={this.state.totalBurnAmount}
        sum30BurnAmount={this.state.sum30BurnAmount}
        totalTransferAmount={this.state.totalTransferAmount}
        sum30TransferAmount={this.state.sum30TransferAmount}
      />
      menucontent = <Menu
        lpTokenBalance={this.state.lpTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
        totalpendingReward={this.state.totalpendingReward}
        totalrewardperblock={this.state.totalrewardperblock}
        userSegmentInfo={this.state.userSegmentInfo}
        poolSegmentInfo={this.state.poolSegmentInfo}
        lpTokenSegmentBalance={this.state.lpTokenSegmentBalance}
        lpTokenSegmentAsymbol={this.state.lpTokenSegmentAsymbol}
        lpTokenSegmentBsymbol={this.state.lpTokenSegmentBsymbol}
        pendingSegmentReward={this.state.pendingSegmentReward}
        buttonPopup={this.state.buttonPopup}
        tvl={this.state.tvl}
        apr={this.state.apr}
        apyDaily={this.state.apyDaily}
        apyWeekly={this.state.apyWeekly}
        apyMonthly={this.state.apyMonthly}
        bonusMultiplier={this.state.bonusMultiplier}
        farmLoading={this.state.farmLoading}
        aprloading={this.state.aprloading}
        deposit={this.deposit}
        withdraw={this.withdraw}
        setI={this.setI}
        setTrigger={this.setTrigger}
        harvest={this.harvest}
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
        lpTokenSegmentBalance={this.state.lpTokenSegmentBalance}
        lpTokenSegmentAsymbol={this.state.lpTokenSegmentAsymbol}
        lpTokenSegmentBsymbol={this.state.lpTokenSegmentBsymbol}
        pendingSegmentReward={this.state.pendingSegmentReward}
        lpTokenSegmentAllowance={this.state.lpTokenSegmentAllowance}
        wallet={this.state.wallet}
        harvest={this.harvest}
        approve={this.approve}
        connectWallet={this.connectWallet}
        walletConnect={this.state.walletConnect}
        lpTokenLink={this.state.lpTokenLink}
        lpTokenContract={this.state.lpTokenContract}
      />
      oneinchContent = <Oneinch
        lpTokenBalance={this.state.lpTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
        totalpendingReward={this.state.totalpendingReward}
        totalrewardperblock={this.state.totalrewardperblock}
        userSegmentInfo={this.state.userSegmentInfo}
        poolSegmentInfo={this.state.poolSegmentInfo}
        lpTokenSegmentBalance={this.state.lpTokenSegmentBalance}
        lpTokenSegmentAsymbol={this.state.lpTokenSegmentAsymbol}
        lpTokenSegmentBsymbol={this.state.lpTokenSegmentBsymbol}
        pendingSegmentReward={this.state.pendingSegmentReward}
        buttonPopup={this.state.buttonPopup}
        tvl={this.state.tvl}
        apr={this.state.apr}
        apyDaily={this.state.apyDaily}
        apyWeekly={this.state.apyWeekly}
        apyMonthly={this.state.apyMonthly}
        bonusMultiplier={this.state.bonusMultiplier}
        farmLoading={this.state.farmLoading}
        aprloading={this.state.aprloading}
        deposit={this.deposit}
        withdraw={this.withdraw}
        setI={this.setI}
        setTrigger={this.setTrigger}
        harvest={this.harvest}
      />
      farmInfoContent = <Farm
        lpTokenBalance={this.state.lpTokenBalance}
        purseTokenUpgradableBalance={this.state.purseTokenUpgradableBalance}
        poolLength={this.state.poolLength}
        deposit={this.deposit}
        withdraw={this.withdraw}
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
        lpTokenInContract={this.state.lpTokenInContract}
        totalrewardperblock={this.state.totalrewardperblock}
        poolCapRewardToken={this.state.poolCapRewardToken}
        poolMintedRewardToken={this.state.poolMintedRewardToken}
        poolRewardToken={this.state.poolRewardToken}
      />
      distributionContent = <Distribution
        wallet={this.state.wallet}
        walletConnect={this.state.walletConnect}
        connectWallet={this.connectWallet}
        checkClaimAmount={this.checkClaimAmount}
        claimDistributePurse={this.claimDistributePurse}
        account={this.state.account}
        rewardEndTime={this.state.rewardEndTime}
        rewardStartTime={this.state.rewardStartTime}
        distributedAmount={this.state.distributedAmount}
        distributedPercentage={this.state.distributedPercentage}
        rewardStartTimeDate={this.state.rewardStartTimeDate}
        rewardEndTimeDate={this.state.rewardEndTimeDate}
        claimAmount={this.state.claimAmount}
        totalTransferAmount={this.state.totalTransferAmount}
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
      />
    }

    return (
      <Router>
        <div>
          <Navb
            account={this.state.account}
            first4Account={this.state.first4Account}
            last4Account={this.state.last4Account}
            wallet={this.state.wallet}
            setWalletTrigger={this.setWalletTrigger}
            loadWeb3={this.loadWeb3}
            connectWallet={this.connectWallet}
            WalletConnect={this.WalletConnect}
            walletConnect={this.state.walletConnect}
            WalletDisconnect={this.WalletDisconnect}
            networkName={this.state.networkName}
            PURSEPrice={this.state.PURSEPrice}
          />
          <div className="container-fluid mt-4">
            <div className="row">
              <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1000px' }}>
                <div className="content mr-auto ml-auto">
                  <Switch>
                    <Route path="/" exact > {maincontent} </Route>
                    <Route path="/home" exact > {maincontent} </Route>
                    <Route path="/lpfarm/menu" exact > {menucontent} </Route>
                    <Route path="/lpfarm/farmInfo" exact > {farmInfoContent} </Route>
                    <Route path="/lpfarm/oneinch" exact > {oneinchContent} </Route>
                    <Route path="/distribution" exact > {distributionContent} </Route>
                    <Route path="/deposit" exact > {depositcontent} </Route>
                  </Switch>
                  <Popup trigger={this.state.buttonPopup} setTrigger={this.setTrigger}>
                    <div className="container-fluid">{depositcontent}</div>
                  </Popup>
                </div>
              </main>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;