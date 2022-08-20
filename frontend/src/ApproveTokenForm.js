import { React } from "react";


export default function ApproveTokenForm (props) {
    function handleApproveTokenAmount(amount){
        console.log(amount)
        props.setApproveTokenAmount(amount)
    }

    function approveTokenHelper(e) {
        console.log('approveTokenHelper')
        console.log(props.approveTokenAmount)
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
