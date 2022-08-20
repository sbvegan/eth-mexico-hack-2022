// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "./Dictatorship.sol"; 
import { ISuperfluid } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

// TODO: figure out if you can do a factory pattern when the children contracts are ownable

contract DictatorshipFactory {
    
    Dictatorship[] public dictatorshipArray;
    
    function createDictatorship() public {
        Dictatorship dictatorship = new Dictatorship();
        dictatorshipArray.push(dictatorship);
    }
    
    // todo add dictatorship functions
}