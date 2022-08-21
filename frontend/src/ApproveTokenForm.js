import { React } from "react";
import { ethers } from "ethers"

export default function ApproveTokenForm (props) {
    function handleApproveTokenAmount(amount){
        console.log(amount)
        props.setApproveTokenAmount(amount)
    }

    async function approveTokenHelper(e) {
        console.log('approveTokenHelper')
        console.log(props.approveTokenAmount)
        console.log(props.provider)
        const signers = props.provider.provider.accounts;
        const dictatorship = new ethers.Contract(
          props.dictatorshipAddress, 
          props.dictatorshipABI, 
          props.provider);
        const daix = await props.sf.loadSuperToken("fDAIx");
        // const amountString = String(props.approveTokenAmount)
        const amount = String(ethers.utils.parseEther(String(props.approveTokenAmount)))
        //approve contract to spend 1000 daix
        const dictatorshipApproval = daix.approve({
            receiver: dictatorship.address,
            amount: ethers.utils.parseEther(amount)
        });

        const tx = await dictatorshipApproval.exec(signers[0])
        console.log(tx.hash)
    }

    return (
        <div>
        <label for="approve-tokens">Approve fDAIx Tokens for Dictatorship: </label>
        <input 
          type="number" 
          id="approve-tokens" 
          name="approve-tokens" 
          onChange={e => handleApproveTokenAmount(e.target.value)} value={props.approveTokenAmount}/>
        <input 
          type="submit" 
          value="Approve Tokens"
          onClick={approveTokenHelper}
        />
        </div>

    );
}
