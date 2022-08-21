// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

// import "hardhat/console.sol";
import "./Dictatorship.sol";
import { ISuperfluid } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

contract DictatorshipFactory {
    Dictatorship[] public dictatorships;
    uint256 dictatorshipCount;
    
    function createDictatorship(ISuperfluid host, address dictator) public {
        assert(address(host) != address(0));
        assert(address(dictator) != address(0));

        Dictatorship dictatorship = new Dictatorship(host, dictator);
        dictatorships.push(dictatorship);
        dictatorshipCount++;
    }

    function getDictatorshipCount() public view returns (uint256) {
        return dictatorshipCount;
    }

    function getDictatorshipAddress(uint256 _index) public view returns (address) {
        return address(dictatorships[_index]);
    }
}