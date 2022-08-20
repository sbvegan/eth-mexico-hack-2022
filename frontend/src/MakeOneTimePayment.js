import { React } from "react";


export default function MakeOneTimePayment (props) {
    function handleReceiverAddress(address){
        console.log(address)
        props.setReceieverAddress(address)
    }

    function handleAmount(amount){
        console.log(amount)
        props.setOneTimePaymentAmount(amount)
    }

    function makeOneTimePayment(e) {
        console.log(e)
        console.log('MakeOneTimePayment')
        // need fDAIx address
        console.log(props.receiverAmount)
        console.log(props.oneTimePaymentAmount)
    }

    return (
        <div>
        <label for="otp-address">Input One Time Payment Address: </label>
        <input 
          type="text" 
          id="otp-address" 
          name="otp-address" 
          onChange={e => handleReceiverAddress(e.target.value)} value={props.receiverAddress}/>
        <label for="payment-amount"> Input Payment Amount: </label>
        <input 
          type="number" 
          id="payment-amount" 
          name="payment-amount" 
          onChange={e => handleAmount(e.target.value)} value={props.oneTimePaymentAmount}/>
        <input 
          type="submit" 
          value="Make One Time Payment"
          onClick={makeOneTimePayment}
        />
        </div>

    );
}
