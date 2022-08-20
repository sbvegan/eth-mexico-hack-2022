import React, { useState, useEffect } from 'react';

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

import ApproveTokenForm from "./ApproveTokenForm"

import './index.css';
import CreateDictatorshipButton from './CreateDictatorshipButton';
import DepositTokenForm from './DepositTokensForm';
import CreateMaintainerForm from './CreateMaintainerForm';
import CreateFlowToMaintainerForm from './CreateFlowToMaintainerForm';
import DeleteFlowToMaintainerForm from './DeleteFlowToMaintainerForm';
import MakeOneTimePayment from './MakeOneTimePayment';

function App() {

  const [web3Modal, setWeb3Modal] = useState(null)
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(undefined);

  const [approveTokenAmount, setApproveTokenAmount] = useState(0);
  const [depositTokenAmount, setDepositTokenAmount] = useState(0);
  const [maintainerAddress, setMaintainerAddress] = useState("");
  const [maintainerId, setMaintainerId] = useState(0)
  const [deleteMaintainerId, setDeleteMaintainerId] = useState(0)
  const [flowRate, setFlowRate] = useState(0)
  const [receiverAddress, setReceieverAddress] = useState("")
  const [oneTimePaymentAmount, setOneTimePaymentAmount] = useState(0)

  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_KEY,
        }
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, 
      network: "goerli",
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal)
  }, [])

  async function connectWallet() {
    console.log("connectWallet")
    const provider = await web3Modal.connect();
    console.log(provider)
    setProvider(provider)
    setAddress(provider.accounts[0])
  }

  function resetConnection() {
    console.log("reset");
    setAddress("");
    setProvider(undefined);
  }

  

  return (
    <div>
      <header>
        <h1>DICTATOR DAO</h1>
        {
          provider ?
          <button className='connect-button' onClick={resetConnection}>Reset Connection</button>
          :
          <button className='connect-button' onClick={connectWallet}>Connect with Walletconnect</button>
        }
      </header>
          
      <body>
        <p>
          Dictator's Address: {address}
        </p>
        
        <CreateDictatorshipButton />
        <br/>

        <ApproveTokenForm
          setApproveTokenAmount={setApproveTokenAmount}
          approveTokenAmount={approveTokenAmount}
        />
        <br />

        <DepositTokenForm 
          setDepositTokenAmount={setDepositTokenAmount}
          depositTokenAmount={depositTokenAmount}
        />
        <br />

        <CreateMaintainerForm 
          maintainerAddress={maintainerAddress}
          setMaintainerAddress={setMaintainerAddress}
        />
        <br />

        <CreateFlowToMaintainerForm 
          maintainerId={maintainerId}
          setMaintainerId={setMaintainerId}
          flowRate={flowRate}
          setFlowRate={setFlowRate}
        />
        <br />

        <DeleteFlowToMaintainerForm 
          maintainerId={deleteMaintainerId}
          setMaintainerId={setDeleteMaintainerId}
        />
        <br />

        <MakeOneTimePayment 
          receiverAddress={receiverAddress}
          setReceieverAddress={setReceieverAddress}
          oneTimePaymentAmount={oneTimePaymentAmount}
          setOneTimePaymentAmount={setOneTimePaymentAmount}
        />


        
      </body>
    </div>
  );
}

export default App;
