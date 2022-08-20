import { React } from "react";


export default function DepositTokenForm (props) {
    function handleDepositTokenAmount(amount){
        console.log(amount)
        props.setDepositTokenAmount(amount)
    }

    function depositTokenHelper(e) {
        console.log('depositTokenHelper')
        console.log(props.depositTokenAmount)
    }

    return (
        <div>
        <label for="deposit-tokens">Deposit fDAIx Tokens for Dictatorship: </label>
        <input 
          type="number" 
          id="deposit-tokens" 
          name="deposit-tokens" 
          onChange={e => handleDepositTokenAmount(e.target.value)} value={props.depositTokenAmount}/>
        <input 
          type="submit" 
          value="Deposit Tokens"
          onClick={depositTokenHelper}
        />
        </div>

    );
}
