import { React } from "react";


export default function DeleteFlowToMaintainerForm (props) {
    function handleMaintainerId(id){
        console.log(id)
        props.setMaintainerId(id)
    }

    function deleteFlowHelper(e) {
        console.log(e)
        console.log('deleteFlowHelper')
        // need fDAIx address
        console.log(props.maintainerId)
    }

    return (
        <div>
        <label for="maintainer-id-delete-flow">Input Maintainer ID: </label>
        <input 
          type="number" 
          id="maintainer-id-delete-flow" 
          name="maintainer-id-delete-flow" 
          onChange={e => handleMaintainerId(e.target.value)} value={props.maintainerId}/>
        <input 
          type="submit" 
          value="Delete Flow"
          onClick={deleteFlowHelper}
        />
        </div>

    );
}
