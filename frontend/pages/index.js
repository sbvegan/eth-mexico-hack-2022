import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider"
import {dictatorshipAbi} from "../constants/dictator-abi"
import {fDAIxAbi} from "../constants/fDAIx-abi"
const { Framework } = require("@superfluid-finance/sdk-core");


let web3Modal;
const dictatorshipAddress = "0x3D29250e34fE937DcC0d3d242Dd1fb12b81Cc9C7"
const fDAIxAddress = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00"
const account2Address = "0xa5e9E3E21E6c3b59c1dE5c8d6F9F8cebb7a24BE1"

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        5: process.env.NEXT_PUBLIC_RPC_URL
      }
    }
  }
}

if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions, 
  });
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [sf, setSf] = useState()

  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [notification, setNotification] = useState()

  const [maintainerAddress, setMaintainerAddress] = useState("");
  const [maintainerCreated, setMaintainerCreated] = useState(false)
  const [maintainerId, setMaintainerId] = useState(null)
  const [removeMaintainerId, setRemoveMaintainerId] = useState(null)
  const [tokenApprovalAmount, setTokenApprovalAmount] = useState(0)
  const [tokenDepositAmount, setTokenDepositAmount] = useState(0)
  const [flowToMaintainerId, setFlowToMaintainerId] = useState()
  const [flowRate, setFlowRate] = useState(385802469135802)
  const [flowDeleteMaintainerId, setFlowDeleteMaintainerId] = useState()
  const [oneTimePaymentAddress, setOneTimePaymentAddress] = useState("")
  const [oneTimePaymentAmount, setOneTimePaymentAmount] = useState(0)


  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  useEffect(() => {

  }, [notification])

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect();
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        setSigner(provider.getSigner());

        console.log(provider)
        const sf = await Framework.create({
          chainId: 5,
          provider
        });
        setSf(sf)
        setNotification("Wallet connected!")
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  async function approveTokens() {
    if (typeof window.ethereum !== "undefined") {
      setLoading(true)
      const fdaix = await sf.loadSuperToken("fDAIx");
      const amount = String(tokenApprovalAmount)
      const dictatorshipApproval = fdaix.approve({
        receiver: dictatorshipAddress,
        amount: ethers.utils.parseEther(amount)
      })
      const tx = await dictatorshipApproval.exec(signer)
      setTxHash(tx.hash)
      setNotification(
        `
        address: ${tokenApprovalAmount}fDAIx is being approved

        tx hash: https://goerli.etherscan.io/tx/${tx.hash}
        `)
    } else {
      console.log("Please install MetaMask");
    }
    setLoading(false)
  }


  async function depositTokens() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(dictatorshipAddress, dictatorshipAbi, signer);
      try {
        setLoading(true)
        const fdaix = await sf.loadSuperToken("fDAIx");
        const amount = String(tokenDepositAmount)
        const tx = await contract.depositSuperTokens(fdaix.address, ethers.utils.parseEther(amount))
        setTxHash(tx)
        setNotification(
          `
          address: ${tokenApprovalAmount}fDAIx is being deposited

          tx hash: https://goerli.etherscan.io/tx/${tx.hash}
          `)
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
    setLoading(false)
  }

  async function createFlow() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(dictatorshipAddress, dictatorshipAbi, signer);
      try {
        setLoading(true)
        const fdaix = await sf.loadSuperToken("fDAIx");
        const rate = String(flowRate)
        const tx = await contract.createFlowFromContract(fdaix.address, flowToMaintainerId, rate)
        const addr = await contract.getMaintainerFromId(flowToMaintainerId)
        setTxHash(tx)
        setNotification(
          `
          CFA to MaintainerId: ${flowToMaintainerId} at ${flowRate}

          tx hash: https://goerli.etherscan.io/tx/${tx.hash}

          SF Console: https://console.superfluid.finance/goerli/accounts/${addr}
          `)
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
    setLoading(false)
  }

  async function deleteFlow() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(dictatorshipAddress, dictatorshipAbi, signer);
      try {
        setLoading(true)
        const fdaix = await sf.loadSuperToken("fDAIx");
        const tx = await contract.deleteFlowFromContract(fdaix.address, flowDeleteMaintainerId)
        const addr = await contract.getMaintainerFromId(flowToMaintainerId)
        setNotification(
          `
          CFA to MaintainerId: ${flowToMaintainerId} is being deleted

          tx hash: https://goerli.etherscan.io/tx/${tx.hash}

          SF Console: https://console.superfluid.finance/goerli/accounts/${addr}
          `)
        setTxHash(tx)
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
    setLoading(false)
  }

  async function makeOTP() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(dictatorshipAddress, dictatorshipAbi, signer);
      try {
        setLoading(true)
        const fdaix = await sf.loadSuperToken("fDAIx");
        const amount = String(oneTimePaymentAmount)
        const tx = await contract.makeOneTimePayment(fdaix.address, oneTimePaymentAddress, ethers.utils.parseEther(amount));
        setTxHash(tx)
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
    setLoading(false)
  }

  async function addMaintainer() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(dictatorshipAddress, dictatorshipAbi, signer);
      try {
        setLoading(true)
        const tx = await contract.createMaintainer(maintainerAddress);
        const nextId = await contract.getMaintainerId();
        setMaintainerId(Number(nextId) - 1)
        setMaintainerCreated(true)
        setNotification(
          `
          address: ${maintainerAddress} is being added as a maintainer as id: ${maintainerId}
          
          tx hash: https://goerli.etherscan.io/tx/${tx.hash}
          `)
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <header>
        <div>
          <h1>DICTATOR DAO</h1>
          <button onClick={connectWallet}>Connect with Walletconnect</button>
          {isConnected ?
            <p>Connected.</p> :
            <p>Not connected.</p>
          }
          {loading ?
            <p>Waiting on our transactions...</p>:
            <p></p>
          }
        </div>
        <div className='notification'>
          {notification}
        </div>
      </header>
      <div>
        <div>
            <label>Add Maintainer to Dictatorship: </label>
            <input 
                type="string" 
                onChange={e => setMaintainerAddress(e.target.value)} value={maintainerAddress}/>
            <input 
                type="submit" 
                value={"Add Maintainer"}
                onClick={addMaintainer}
            />
        </div>
      
        <div>
            <label>Approve Tokens for the Dictatorship: </label>
            <input
              type="number"
              onChange={e => setTokenApprovalAmount(e.target.value)} value={tokenApprovalAmount}/>
            <input
              type="submit"
              value="Approve Tokens"
              onClick={approveTokens}
            />
        </div>

        <div>
          <label>Deposit fDAIx Tokens for Dictatorship: </label>
          <input 
            type="number"  
            onChange={e => setTokenDepositAmount(e.target.value)} value={tokenDepositAmount}/>
          <input 
            type="submit" 
            value="Deposit Tokens"
            onClick={depositTokens}
          />
        </div>

        <div>
          <label>Create CFA for Maintainer ID: </label>
          <input 
            type="number" 
            onChange={e => setFlowToMaintainerId(e.target.value)} value={flowToMaintainerId}/>
          <label> Input Flow Rate: </label>
          <input 
            type="number" 
            onChange={e => setFlowRate(e.target.value)} value={flowRate}/>
          <input 
            type="submit" 
            value="Create Flow"
            onClick={createFlow}
          />
        </div>

        <div>
          <label>Delete CFA for Maintainer ID: </label>
          <input 
            type="number" 
            onChange={e => setFlowDeleteMaintainerId(e.target.value)} value={flowDeleteMaintainerId}/>
          <input 
            type="submit" 
            value="Delete Flow"
            onClick={deleteFlow}
          />
        </div>

        <div>
          <label>Make One Time Payment to: </label>
          <input 
            type="string" 
            onChange={e => setOneTimePaymentAddress(e.target.value)} value={oneTimePaymentAddress}/>
          <input
              type="number"
              onChange={e => setOneTimePaymentAmount(e.target.value)} value={oneTimePaymentAmount}/>
          <input
            type="submit"
            value="OTP"
            onClick={makeOTP}
          />
            
        </div>
      </div>

    </div>
  )
}
