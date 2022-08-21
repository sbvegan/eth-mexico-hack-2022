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

  const [maintainerAddress, setMaintainerAddress] = useState("");
  const [maintainerCreated, setMaintainerCreated] = useState(false)
  const [maintainerId, setMaintainerId] = useState(null)
  const [removeMaintainerId, setRemoveMaintainerId] = useState(null)
  const [tokenApprovalAmount, setTokenApprovalAmount] = useState()

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

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
    } else {
      console.log("Please install MetaMask");
    }
    setLoading(false)
  }


  async function depositTokens() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(dictatorshipAddress, dictatorshipAbi, signer);
      try {
        await contract.depositSuperTokens()
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
        await contract.createMaintainer(maintainerAddress);
        const nextId = await contract.getMaintainerId();
        setMaintainerId(Number(nextId) - 1)
        setMaintainerCreated(true)
        setLoading(false)
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
            {maintainerCreated ?
              <p>The new maintainer id is: {maintainerId}</p>:
              <p></p>
            }
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
      </div>

    </div>
  )
}
