import { React } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers"
export default function CreateDictatorshipButton (props) {
    
    async function deployDictatorship(provider)  {
        console.log(provider)
        const sf = await Framework.create({
            chainId: (await provider.getNetwork()).chainId,
            provider
        });
    
        const Dictatorship = await ethers.getContractFactory("Dictatorship");
        const dictatorship = await Dictatorship.deploy(sf.settings.config.hostAddress);
    
        await dictatorship.deployed();
    
        console.log("Dictatorship deployed to:", dictatorship.address);

    }
    
    return (
        <div>
        <button
            onClick={() => deployDictatorship(props.provider)}
        >Create Dictatorship</button>
        </div>

    );
}
