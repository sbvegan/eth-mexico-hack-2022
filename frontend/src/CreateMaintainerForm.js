import { React } from "react";

export default function CreateMaintainerForm (props) {

    function handleMaintainerAddress(address) {
        console.log(address)
        props.setMaintainerAddress(address)
    }

    function addMaintainer() {
        console.log('addMaintainer')
        console.log(props.maintainerAddress)
    }

    return (
        <div>
            <label for="approve-tokens">Add Maintainer to Dictatorship: </label>
            <input 
                type="string" 
                id="maintainer-address" 
                name="maintainer-address" 
                onChange={e => handleMaintainerAddress(e.target.value)} value={props.maintainerAddress}/>
            <input 
                type="submit" 
                value="Add Maintainer"
                onClick={addMaintainer}
            />
        </div>
    );
}
