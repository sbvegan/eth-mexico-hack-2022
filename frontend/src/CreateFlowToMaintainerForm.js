import { React } from "react";


export default function CreateFlowToMaintainerForm (props) {
    function handleMaintainerId(id){
        console.log(id)
        props.setMaintainerId(id)
    }

    function handleFlowRate(rate){
        console.log(rate)
        props.setFlowRate(rate)
    }

    function createFlowHelper(e) {
        console.log(e)
        console.log('createFlowHelper')
        // need fDAIx address
        console.log(props.maintainerId)
        console.log(props.flowRate)
    }

    return (
        <div>
        <label for="maintainer-id-create-flow">Input Maintainer ID: </label>
        <input 
          type="number" 
          id="maintainer-id-create-flow" 
          name="maintainer-id-create-flow" 
          onChange={e => handleMaintainerId(e.target.value)} value={props.maintainerId}/>
        <label for="flow-rate-create-flow"> Input Flow Rate: </label>
        <input 
          type="number" 
          id="flow-rate" 
          name="flow-rate" 
          onChange={e => handleFlowRate(e.target.value)} value={props.flowRate}/>
        <input 
          type="submit" 
          value="Create Flow"
          onClick={createFlowHelper}
        />
        </div>

    );
}
