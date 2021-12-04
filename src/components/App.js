import React, { Component } from 'react'
import Web3 from 'web3'
// import Web3Modal from "web3modal";
// import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
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
// import { FaWindowClose } from 'react-icons/fa';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    while (this.state.loading == true) {
      await this.loadBlockchainData()
      // console.log("repeatfalse")
      await this.delay(1000);
    }
  }

  async loadBlockchainData() {

    const web3Bsc = window.web3Bsc
    // window.web3 = new Web3(window.ethereum)

    // const chainId = await web3.eth.net.getId()

    const networkId = "97"
    let accounts = []
    if (this.state.metamask == true) {
      const web3 = window.web3
      accounts = await web3.eth.getAccounts()
      // this.setState({ account: accounts[0] })
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      this.setState({ networkId })
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

      // this.handleChainChanged("0x61");

      window.ethereum.on('chainChanged', this.handleChainChanged);
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);
    }


    if (this.state.wallet == false && this.state.walletConnect == false) {
      // Load PurseTokenUpgradable
      const purseTokenUpgradableData = PurseTokenUpgradable.networks[networkId]
      const restakingFarmData = RestakingFarm.networks[networkId]
      if (purseTokenUpgradableData) {
        const purseTokenUpgradable = new web3Bsc.eth.Contract(PurseTokenUpgradable.abi, purseTokenUpgradableData.address)
        this.setState({ purseTokenUpgradable })
        let purseTokenUpgradableBalance = 0
        this.setState({ purseTokenUpgradableBalance: purseTokenUpgradableBalance.toString() })
        let purseTokenTotalSupply = await purseTokenUpgradable.methods.totalSupply().call()
        this.setState({ purseTokenTotalSupply: purseTokenTotalSupply.toString() })
        let poolRewardToken = await purseTokenUpgradable.methods.balanceOf(restakingFarmData.address).call()
        this.setState({ poolRewardToken })
      }
      //////////////////////////////////////////////////////////////////////////////////////////////////

      if (restakingFarmData) {
        const restakingFarm = new web3Bsc.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
        this.setState({ restakingFarm })
        let poolCapRewardToken = await restakingFarm.methods.capMintToken().call()
        let poolMintedRewardToken = await restakingFarm.methods.totalMintToken().call()
        let poolLength = await restakingFarm.methods.poolLength().call()
        this.setState({ poolCapRewardToken })
        this.setState({ poolMintedRewardToken })
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
        let lpTokenValue = [[], []]
        let bonusMultiplier = [[], []]
        let tvl = [[], []]
        let apr = [[], []]
        let n = 0
        let i = 0
        for (i = 0; i < poolLength; i++) {

          let lpTokenAddress = await restakingFarm.methods.poolTokenList(i).call()
          let poolInfo = await restakingFarm.methods.poolInfo(lpTokenAddress).call()
          let lpTokenPair = new web3Bsc.eth.Contract(IPancakePair.abi, lpTokenAddress)
          let lpTokenPairA = await lpTokenPair.methods.token0().call()
          let lpTokenPairB = await lpTokenPair.methods.token1().call()
          let lpTokenA = new web3Bsc.eth.Contract(LpToken.abi, lpTokenPairA)
          let lpTokenB = new web3Bsc.eth.Contract(LpToken.abi, lpTokenPairB)
          let lpTokenInContract = await lpTokenPair.methods.balanceOf(restakingFarmData.address).call()
          lpTokenInContract = web3Bsc.utils.fromWei(lpTokenInContract, "ether")
          let lpTokenBalance = 0
          let lpTokenTSupply = await lpTokenPair.methods.totalSupply().call()
          let lpTokenPairsymbol = await lpTokenPair.methods.symbol().call()
          let lpTokenAsymbol = await lpTokenA.methods.symbol().call()
          let lpTokenBsymbol = await lpTokenB.methods.symbol().call()
          let lpTokenABalanceContract = await lpTokenA.methods.balanceOf(lpTokenAddress).call()
          let lpTokenBBalanceContract = await lpTokenB.methods.balanceOf(lpTokenAddress).call()
          let pendingReward = 0

          let tokenAPrice = 0
          let tokenBPrice = 0
          if (lpTokenAsymbol == "PURSE") {
            tokenAPrice = this.state.PURSEPrice
          } else if (lpTokenAsymbol == "mBNB") {
            tokenAPrice = this.state.BNBPrice
          } else if (lpTokenAsymbol == "mBTC") {
            tokenAPrice = this.state.Price
          } else if (lpTokenAsymbol == "mWETH") {
            tokenAPrice = this.state.WETHPrice
          } else if (lpTokenAsymbol == "mUSDC") {
            tokenAPrice = this.state.USDCPrice
          } else if (lpTokenAsymbol == "mBTC") {
            tokenAPrice = this.state.BTCPrice
          }

          if (lpTokenBsymbol == "PURSE") {
            tokenBPrice = this.state.PURSEPrice
          } else if (lpTokenBsymbol == "mBNB") {
            tokenBPrice = this.state.BNBPrice
          } else if (lpTokenBsymbol == "mBTC") {
            tokenBPrice = this.state.Price
          } else if (lpTokenBsymbol == "mWETH") {
            tokenBPrice = this.state.WETHPrice
          } else if (lpTokenBsymbol == "mUSDC") {
            tokenBPrice = this.state.USDCPrice
          } else if (lpTokenBsymbol == "mBTC") {
            tokenBPrice = this.state.BTCPrice
          }

          let poolbonusMultiplier = poolInfo.bonusMultiplier
          totalrewardperblock += parseInt(poolInfo.pursePerBlock * poolbonusMultiplier)
          // totalpendingReward += parseInt(pendingReward)

          if (lpTokenPairsymbol == "Cake-LP") {
            userSegmentInfo[0][n] = "0"
            poolSegmentInfo[0][n] = poolInfo
            lpTokenSegmentInContract[0][n] = lpTokenInContract
            bonusMultiplier[0][n] = poolbonusMultiplier
            lpTokenSegmentBalance[0][n] = lpTokenBalance
            lpTokenSegmentAsymbol[0][n] = lpTokenAsymbol
            lpTokenSegmentBsymbol[0][n] = lpTokenBsymbol
            pendingSegmentReward[0][n] = pendingReward
            lpTokenValue[0][n] = ((lpTokenABalanceContract * tokenAPrice) + (lpTokenBBalanceContract * tokenBPrice)) / lpTokenTSupply
            tvl[0][n] = lpTokenValue[0][n] * lpTokenInContract
            apr[0][n] = ((28000 * 365 * web3Bsc.utils.fromWei((poolInfo.pursePerBlock * poolbonusMultiplier).toString(), 'Ether') * this.state.PURSEPrice) / tvl[0][n]) * 100
            n += 1
          } else {
            userSegmentInfo[1][n] = "0"
            poolSegmentInfo[1][n] = poolInfo
            lpTokenSegmentInContract[1][n] = lpTokenInContract
            bonusMultiplier[1][n] = poolbonusMultiplier
            lpTokenSegmentBalance[1][n] = lpTokenBalance
            lpTokenSegmentAsymbol[1][n] = lpTokenAsymbol
            lpTokenSegmentBsymbol[1][n] = lpTokenBsymbol
            pendingSegmentReward[1][n] = pendingReward
            tvl[1][n] = lpTokenValue[1][n] * lpTokenInContract
            apr[1][n] = ((28000 * 365 * web3Bsc.utils.fromWei((poolInfo.pursePerBlock * poolbonusMultiplier).toString(), 'Ether') * this.state.PURSEPrice) / tvl[1][n]) * 100
            n += 1
          }

        }
        this.setState({ apr })
        this.setState({ tvl })
        this.setState({ bonusMultiplier })
        this.setState({ userSegmentInfo })
        this.setState({ poolSegmentInfo })
        this.setState({ lpTokenSegmentInContract })
        this.setState({ lpTokenSegmentBalance })
        this.setState({ lpTokenSegmentAsymbol })
        this.setState({ lpTokenSegmentBsymbol })
        this.setState({ pendingSegmentReward })

        this.setState({ totalrewardperblock: totalrewardperblock.toLocaleString('fullwide', { useGrouping: false }) })
        this.setState({ totalpendingReward: totalpendingReward.toLocaleString('fullwide', { useGrouping: false }) })
      }
      // console.log("abcs")
    }

    else {
      const first4Account = this.state.account.substring(0, 4)
      const last4Account = this.state.account.slice(-4)
      this.setState({ first4Account: first4Account })
      this.setState({ last4Account: last4Account })

      // Load PurseTokenUpgradable
      const purseTokenUpgradableData = PurseTokenUpgradable.networks[networkId]
      const restakingFarmData = RestakingFarm.networks[networkId]
      if (purseTokenUpgradableData) {
        const purseTokenUpgradable = new web3Bsc.eth.Contract(PurseTokenUpgradable.abi, purseTokenUpgradableData.address)
        this.setState({ purseTokenUpgradable })
        let purseTokenUpgradableBalance = await purseTokenUpgradable.methods.balanceOf(this.state.account).call()
        this.setState({ purseTokenUpgradableBalance: purseTokenUpgradableBalance.toString() })
        let purseTokenTotalSupply = await purseTokenUpgradable.methods.totalSupply().call()
        this.setState({ purseTokenTotalSupply: purseTokenTotalSupply.toString() })
        let poolRewardToken = await purseTokenUpgradable.methods.balanceOf(restakingFarmData.address).call()
        this.setState({ poolRewardToken })
      }

      // #########################################################################################################################
      // Load RestakingFarm

      if (restakingFarmData) {
        const restakingFarm = new web3Bsc.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
        console.log(restakingFarmData.address)
        this.setState({ restakingFarm })
        let poolCapRewardToken = await restakingFarm.methods.capMintToken().call()
        let poolMintedRewardToken = await restakingFarm.methods.totalMintToken().call()
        let poolLength = await restakingFarm.methods.poolLength().call()
        console.log(poolLength)
        this.setState({ poolCapRewardToken })
        this.setState({ poolMintedRewardToken })
        this.setState({ poolLength })
        let totalrewardperblock = 0
        let totalpendingReward = 0

        let userSegmentInfo = [[], []]
        let poolSegmentInfo = [[], []]
        let lpTokenSegmentInContract = [[], []]
        let lpTokenSegmentBalance = [[], []]
        let lpTokenSegmentAsymbol = [[], []]
        let lpTokenSegmentBsymbol = [[], []]
        let lpTokenSegmentAllowance = [[], []]
        let pendingSegmentReward = [[], []]
        let lpTokenValue = [[], []]
        let tvl = [[], []]
        let apr = [[], []]
        let n = 0
        let i = 0
        for (i = 0; i < poolLength; i++) {

          let lpTokenAddress = await restakingFarm.methods.poolTokenList(i).call()
          let poolInfo = await restakingFarm.methods.poolInfo(lpTokenAddress).call()
          let userInfo = await restakingFarm.methods.userInfo(lpTokenAddress, this.state.account).call()
          let lpTokenPair = new web3Bsc.eth.Contract(IPancakePair.abi, lpTokenAddress)
          let lpTokenPairA = await lpTokenPair.methods.token0().call()
          let lpTokenPairB = await lpTokenPair.methods.token1().call()
          let lpTokenA = new web3Bsc.eth.Contract(LpToken.abi, lpTokenPairA)
          let lpTokenB = new web3Bsc.eth.Contract(LpToken.abi, lpTokenPairB)
          let lpTokenInContract = await lpTokenPair.methods.balanceOf(restakingFarmData.address).call()
          lpTokenInContract = web3Bsc.utils.fromWei(lpTokenInContract, "ether")
          let lpTokenBalance = await lpTokenPair.methods.balanceOf(this.state.account).call()
          let lpTokenTSupply = await lpTokenPair.methods.totalSupply().call()
          let lpTokenPairsymbol = await lpTokenPair.methods.symbol().call()
          let lpTokenAllowance = await lpTokenPair.methods.allowance(this.state.account, restakingFarmData.address).call()
          let lpTokenAsymbol = await lpTokenA.methods.symbol().call()
          let lpTokenBsymbol = await lpTokenB.methods.symbol().call()
          let lpTokenABalanceContract = await lpTokenA.methods.balanceOf(lpTokenAddress).call()
          let lpTokenBBalanceContract = await lpTokenB.methods.balanceOf(lpTokenAddress).call()
          let pendingReward = await restakingFarm.methods.pendingReward(lpTokenAddress, this.state.account).call()


          let tokenAPrice = 0
          let tokenBPrice = 0
          if (lpTokenAsymbol == "PURSE") {
            tokenAPrice = this.state.PURSEPrice
          } else if (lpTokenAsymbol == "mBNB") {
            tokenAPrice = this.state.BNBPrice
          } else if (lpTokenAsymbol == "mBTC") {
            tokenAPrice = this.state.Price
          } else if (lpTokenAsymbol == "mWETH") {
            tokenAPrice = this.state.WETHPrice
          } else if (lpTokenAsymbol == "mUSDC") {
            tokenAPrice = this.state.USDCPrice
          } else if (lpTokenAsymbol == "mBTC") {
            tokenAPrice = this.state.BTCPrice
          }

          if (lpTokenBsymbol == "PURSE") {
            tokenBPrice = this.state.PURSEPrice
          } else if (lpTokenBsymbol == "mBNB") {
            tokenBPrice = this.state.BNBPrice
          } else if (lpTokenBsymbol == "mBTC") {
            tokenBPrice = this.state.Price
          } else if (lpTokenBsymbol == "mWETH") {
            tokenBPrice = this.state.WETHPrice
          } else if (lpTokenBsymbol == "mUSDC") {
            tokenBPrice = this.state.USDCPrice
          } else if (lpTokenBsymbol == "mBTC") {
            tokenBPrice = this.state.BTCPrice
          }

          let poolbonusMultiplier = poolInfo.bonusMultiplier
          totalrewardperblock += parseInt(poolInfo.pursePerBlock)
          totalpendingReward += parseInt(pendingReward)

          if (lpTokenPairsymbol == "Cake-LP") {

            userSegmentInfo[0][n] = web3Bsc.utils.fromWei(userInfo.amount, 'Ether')
            poolSegmentInfo[0][n] = poolInfo
            lpTokenSegmentInContract[0][n] = lpTokenInContract
            lpTokenSegmentBalance[0][n] = lpTokenBalance
            lpTokenSegmentAsymbol[0][n] = lpTokenAsymbol
            lpTokenSegmentBsymbol[0][n] = lpTokenBsymbol
            lpTokenSegmentAllowance[0][n] = lpTokenAllowance
            pendingSegmentReward[0][n] = web3Bsc.utils.fromWei(pendingReward, 'Ether')
            lpTokenValue[0][n] = ((lpTokenABalanceContract * tokenAPrice) + (lpTokenBBalanceContract * tokenBPrice)) / lpTokenTSupply
            tvl[0][n] = lpTokenValue[0][n] * lpTokenInContract
            apr[0][n] = ((28000 * 365 * web3Bsc.utils.fromWei((poolInfo.pursePerBlock * poolbonusMultiplier).toString(), 'Ether') * this.state.PURSEPrice) / tvl[0][n]) * 100
            n += 1
          } else {
            userSegmentInfo[1][n] = web3Bsc.utils.fromWei(userInfo.amount, 'Ether')
            poolSegmentInfo[1][n] = poolInfo
            lpTokenSegmentInContract[1][n] = lpTokenInContract
            lpTokenSegmentBalance[1][n] = lpTokenBalance
            lpTokenSegmentAsymbol[1][n] = lpTokenAsymbol
            lpTokenSegmentBsymbol[1][n] = lpTokenBsymbol
            lpTokenSegmentAllowance[1][n] = lpTokenAllowance
            pendingSegmentReward[1][n] = web3Bsc.utils.fromWei(pendingReward, 'Ether')
            lpTokenValue[1][n] = ((lpTokenABalanceContract * tokenAPrice) + (lpTokenBBalanceContract * tokenBPrice)) / lpTokenTSupply
            tvl[1][n] = lpTokenValue[1][n] * lpTokenInContract
            apr[1][n] = ((28000 * 365 * web3Bsc.utils.fromWei((poolInfo.pursePerBlock * poolbonusMultiplier).toString(), 'Ether') * this.state.PURSEPrice) / tvl[1][n]) * 100
            n += 1
          }
        }
        this.setState({ apr })
        this.setState({ tvl })

        this.setState({ lpTokenSegmentInContract })
        this.setState({ lpTokenSegmentBalance })
        this.setState({ lpTokenSegmentAsymbol })
        this.setState({ lpTokenSegmentBsymbol })
        this.setState({ pendingSegmentReward })
        this.setState({ lpTokenSegmentAllowance })
        this.setState({ userSegmentInfo })
        this.setState({ poolSegmentInfo })
        this.setState({ totalrewardperblock: totalrewardperblock.toLocaleString('fullwide', { useGrouping: false }) })
        this.setState({ totalpendingReward: totalpendingReward.toLocaleString('fullwide', { useGrouping: false }) })
      }
    }
    this.setState({ loading: true })
    this.setState({ farmLoading: true })
  }


  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      window.web3Bsc = new Web3(`https://data-seed-prebsc-1-s3.binance.org:8545/`);
      // await window.ethereum.enable()
      this.setState({ metamask: true })
      // console.log(window.ethereum.isConnected())
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      window.web3Bsc = new Web3(`https://data-seed-prebsc-1-s3.binance.org:8545/`);
      this.setState({ metamask: true })
    }
    else {
      window.web3Bsc = new Web3(`https://data-seed-prebsc-1-s3.binance.org:8545/`);
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      this.setState({ metamask: false })
      this.setState({ wallet: false })
    }
    let response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=binancecoin%2Cweth%2Cbinance-usd%2Cusd-coin%2Ctether%2Cbitcoin%2Cpundi-x-purse&vs_currencies=usd`);
    // let purseResponse = await fetch('https://api.pancakeswap.info/api/v2/tokens/0x29a63F4B209C29B4DC47f06FFA896F32667DAD2C')
    // let purseResponse = await fetch('https://api.1inch.exchange/v4.0/56/quote?fromTokenAddress=0x29a63F4B209C29B4DC47f06FFA896F32667DAD2C&toTokenAddress=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&amount=1000000000000')
    const myJson = await response.json();
    // const purseJson = await purseResponse.json();
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
          if (chainId == "0x61") {
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
    window.provider = new WalletConnectProvider({
      rpc: {
        97: "https://data-seed-prebsc-2-s3.binance.org:8545/"
      },
      chainId: 97,
    });
    await window.provider.enable();
    window.web3Con = await new Web3(window.provider);
    const accounts = await window.web3Con.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const first4Account = this.state.account.substring(0, 4)
    const last4Account = this.state.account.slice(-4)
    this.setState({ first4Account: first4Account })
    this.setState({ last4Account: last4Account })
    this.setState({ walletConnect: true })
  }


  // WalletConnect2 = () => {
  //   console.log("connected")
  //   // Create a connector
  //   const connector = new WalletConnect({
  //     bridge: "https://bridge.walletconnect.org", // Required
  //     qrcodeModal: QRCodeModal,
  //   });

  //   // Check if connection is already established
  //   if (!connector.connected) {
  //     // create new session
  //     connector.createSession({ chainId: 97 });
  //   }

  //   // Subscribe to connection events
  //   connector.on("connect", (error, payload) => {
  //     if (error) {
  //       throw error;
  //     }

  //     // Get provided accounts and chainId
  //     const { accounts, chainId } = payload.params[0];
  //     console.log(accounts)
  //     console.log(chainId)
  //     this.setState({ account: accounts[0] })
  //     const first4Account = this.state.account.substring(0, 4)
  //     const last4Account = this.state.account.slice(-4)
  //     this.setState({ first4Account: first4Account })
  //     this.setState({ last4Account: last4Account })
  //     this.setState({ walletConnect: true })
  //     // window.web3Con = new Web3(window.ethereum)
  //   });

  //   connector.on("session_update", (error, payload) => {
  //     if (error) {
  //       throw error;
  //     }

  //     // Get updated accounts and chainId
  //     const { accounts, chainId } = payload.params[0];
  //     console.log(accounts)
  //     console.log(chainId)
  //     this.setState({ account: accounts[0] })
  //     const first4Account = this.state.account.substring(0, 4)
  //     const last4Account = this.state.account.slice(-4)
  //     this.setState({ first4Account: first4Account })
  //     this.setState({ last4Account: last4Account })
  //     this.setState({ walletConnect: true })
  //   });

  //   connector.on("disconnect", (error, payload) => {
  //     if (error) {
  //       throw error;
  //     }

  //     // Delete connector
  //   });
  // }

  WalletDisconnect = async () => {
    console.log("disconnected")
    await window.provider.disconnect()
    this.setState({ walletConnect: false })
  }

  // WalletDisconnect2 = () => {
  //   console.log("disconnected")
  //   // Create a connector
  //   const connector = new WalletConnect({
  //     bridge: "https://bridge.walletconnect.org", // Required
  //     qrcodeModal: QRCodeModal,
  //   });

  //   // Check if connection is already established
  //   if (connector.connected) {
  //     // create new session
  //     connector.killSession();
  //     this.setState({ walletConnect: false })
  //   };
  // }

  switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
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
              chainId: '0x61', rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545'], chainName: 'BSC Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB', // 2-6 characters long
                decimals: 18
              }, blockExplorerUrls: ['https://testnet.bscscan.com/']
            }],
          });
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
      console.log(accounts)
      this.setWalletTrigger(false)
    } else if (accounts[0] !== this.state.account) {
      console.log(accounts)
      this.state.account = accounts[0];
      const first4Account = this.state.account.substring(0, 4)
      const last4Account = this.state.account.slice(-4)
      this.setState({ first4Account: first4Account })
      this.setState({ last4Account: last4Account })
      // Do any other work!
    }
  }

  handleChainChanged = async (_chainId) => {
    // We recommend reloading the page, unless you must do otherwise
    // window.location.reload();
    if (_chainId != "0x61") {
      this.setWalletTrigger(false)
    }
    if (this.state.networkId !== _chainId) {
      this.state.networkId = _chainId
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

  delay = ms => new Promise(res => setTimeout(res, ms));

  deposit = async (i, amount, n) => {
    if (this.state.walletConnect == true) {
      this.setState({ loading: false })
      let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3Con.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      restakingFarm.methods.deposit(lpTokenAddress, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: true })
        this.componentWillMount()
      })
    } else if (this.state.wallet == true) {
      this.setState({ loading: false })
      let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      restakingFarm.methods.deposit(lpTokenAddress, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: true })
        this.componentWillMount()
      })
    }
  }

  approve = async (i, n) => {
    if (this.state.walletConnect == true) {
      this.setState({ loading: false })
      let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
      let lpToken = new window.web3Con.eth.Contract(LpToken.abi, lpTokenAddress)
      console.log(lpToken)
      console.log(this.state.account)
      console.log(this.state.restakingFarm)
      await lpToken.methods.approve(this.state.restakingFarm._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account })
      this.componentWillMount()
      this.setState({ loading: true })
    } else if (this.state.wallet == true) {
      this.setState({ loading: false })
      let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
      let lpToken = new window.web3.eth.Contract(LpToken.abi, lpTokenAddress)
      console.log(lpToken)
      console.log(this.state.account)
      console.log(this.state.restakingFarm)
      await lpToken.methods.approve(this.state.restakingFarm._address, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({ from: this.state.account })
      this.componentWillMount()
      this.setState({ loading: true })
    }
  }

  withdraw = async (i, amount, n) => {
    if (this.state.walletConnect == true) {
      this.setState({ loading: false })
      let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3Con.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      restakingFarm.methods.withdraw(lpTokenAddress, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: true })
        this.componentWillMount()
      })
    } else if (this.state.wallet == true) {
      this.setState({ loading: false })
      let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      restakingFarm.methods.withdraw(lpTokenAddress, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: true })
        this.componentWillMount()
      })
    }
  }

  harvest = async (i, n) => {
    if (this.state.walletConnect == true) {
      this.setState({ loading: false })
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3Con.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
      if (this.state.walletConnect === false) {
        alert("Wallet is not connected")
      } else {
        if (this.state.pendingSegmentReward[n][i] <= 0) {
          alert("No token to harvest! Please deposit PANCAKE LP to earn PURSE")
        } else {
          this.setState({ loading: true })
          restakingFarm.methods.claimReward(lpTokenAddress).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
            this.componentWillMount()
          })
        }
      }
      this.setState({ loading: true })
    } else if (this.state.wallet == true) {
      this.setState({ loading: false })
      const restakingFarmData = RestakingFarm.networks[this.state.networkId]
      let restakingFarm = new window.web3.eth.Contract(RestakingFarm.abi, restakingFarmData.address)
      let lpTokenAddress = await this.state.poolSegmentInfo[n][i].lpToken
      if (this.state.wallet === false) {
        alert("Wallet is not connected")
      } else {
        if (this.state.pendingSegmentReward[n][i] <= 0) {
          alert("No token to harvest! Please deposit PANCAKE LP to earn PURSE")
        } else {
          this.setState({ loading: true })
          restakingFarm.methods.claimReward(lpTokenAddress).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
            this.componentWillMount()
          })
        }
      }
      this.setState({ loading: true })
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
      // console.log(this.state.wallet)
    } else {
      // console.log("trigger")
      const accounts = await window.web3.eth.getAccounts()
      // console.log(accounts)
      this.setState({ account: accounts[0] })
      const first4Account = this.state.account.substring(0, 4)
      const last4Account = this.state.account.slice(-4)
      this.setState({ first4Account: first4Account })
      this.setState({ last4Account: last4Account })
      this.setState({ wallet: state })
      // console.log(this.state.wallet)
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
      i: '0',
      n: '0',
      loading: false,
      wallet: false,
      metamask: false,
      farmLoading: false,
      walletConnect: false,
      poolLength: '0',
      userSegmentInfo: [[], []],
      poolSegmentInfo: [[], []],
      lpTokenSegmentInContract: [[], []],
      lpTokenSegmentBalance: [[], []],
      lpTokenSegmentAsymbol: [[], []],
      lpTokenSegmentBsymbol: [[], []],
      pendingSegmentReward: [[], []],
      lpTokenSegmentAllowance: [[], []],
      bonusMultiplier: [[], []],
      tvl: [[], []],
      apr: [[], []],
      totalrewardperblock: '0',
      totalpendingReward: '0',
      buttonPopup: false,
      poolCapRewardToken: '0',
      poolMintedRewardToken: '0',
      poolRewardToken: '0',
      networkName: "Loading"
    }
  }

  render() {
    let maincontent
    let menucontent
    let depositcontent
    let oneinchcontent
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
        purseTokenTotalSupply={this.state.purseTokenTotalSupply}
        lpTokenInContract={this.state.lpTokenInContract}
        totalrewardperblock={this.state.totalrewardperblock}
        poolCapRewardToken={this.state.poolCapRewardToken}
        poolMintedRewardToken={this.state.poolMintedRewardToken}
        poolRewardToken={this.state.poolRewardToken}
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
        harvest={this.harvest}
        tvl={this.state.tvl}
        apr={this.state.apr}
        bonusMultiplier={this.state.bonusMultiplier}
        farmLoading={this.state.farmLoading}
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
        lpTokenSegmentAllowance={this.state.lpTokenSegmentAllowance}
        wallet={this.state.wallet}
        harvest={this.harvest}
        approve={this.approve}
        connectWallet={this.connectWallet}
        walletConnect={this.state.walletConnect}
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
      harvest={this.harvest}
      tvl={this.state.tvl}
      apr={this.state.apr}
      bonusMultiplier={this.state.bonusMultiplier}
      farmLoading={this.state.farmLoading}
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
                  <Popup trigger={this.state.buttonPopup} setTrigger={this.setTrigger}>
                    <div className="container-fluid mt-5">{depositcontent}</div>
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