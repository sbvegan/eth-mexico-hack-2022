// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { ISuperfluidToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

contract Dictatorship is Ownable {
    // need to read more on emitting events first...
    // event MaintainerCreated(address indexed maintainer, uint indexed id);
    // event MaintainerRevoked(uint indexed id);
    // event DepoistMade(address indexed sender, ISuperToken token, uint amount);
    // event WithdrawMade(address indexed receiver, ISuperToken token, uint amount);
    // event CFACreated(ISuperfluidToken indexed token, uint256 indexed id, int96 indexed flowRate);
    // event CFADeleted(ISuperfluidToken indexed token, uint256 indexed id);

    using CFAv1Library for CFAv1Library.InitData;
    CFAv1Library.InitData public cfaV1; //initialize cfaV1 variable

    address dictator;
    uint256 public maintainerId;
    mapping (uint256 => address) maintainers;

    constructor(ISuperfluid host, address _dictator) {

        assert(address(host) != address(0));
        assert(address(dictator) != address(0));    
        dictator = _dictator;

        //initialize InitData struct, and set equal to cfaV1        
        cfaV1 = CFAv1Library.InitData(
        host,
        //here, we are deriving the address of the CFA using the host contract
        IConstantFlowAgreementV1(
            address(host.getAgreementClass(
                    keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")
                ))
            )
        );
    }

    /**
     * @notice Returns the current maintainerId, which is the next maintainer's id.
     * @return maintainerId the id of the next maintainer
     */
    function getMaintainerId() public view returns(uint256) {
        return maintainerId;
    }

    /**
     * @notice Returns the address of the maintainer from their id.
     * @param _id the maintainer's id
     * @return maintainers[_id] the maintainer's id
     */
    function getMaintainerFromId(uint256 _id) public view returns(address) {
        return maintainers[_id];
    }

    /**
     * @notice Allows the dictator(owner) to create maintainer.
     * @param _maintainer the address of the maintainer
     */
    function createMaintainer(address _maintainer) external  {
        require(msg.sender == dictator);
        uint256 id = maintainerId;
        maintainers[id] = _maintainer;
        maintainerId++;
    }

    /**
     * @notice Allows the dictator(owner) to revoke a maintainer.
     * @param _id the id of the maintainer to be removed.
     */
    function revokeMaintainer(uint256 _id) external  {
        require(msg.sender == dictator);
        maintainers[_id] = address(0);
    }

    /**
     * @notice Allows anyone to deposit SuperTokens into the contract.
     * @param token The SuperToken being deposited into the contract.
     * @param amount The amount of the SuperToken being deposited.
     */
    function depositSuperTokens(ISuperToken token, uint amount) external {
        token.transferFrom(msg.sender, address(this), amount);
    }

    /**
     * @notice Allow the dictator (owner) to withdraw the super tokens
     * @param token The SuperToken being withdrawn from the contract.
     * @param amount The amount of the SuperToken being withdrawn.
     */
    function withdrawFunds(ISuperToken token, uint amount) external {
        require(msg.sender == dictator);
        token.transfer(msg.sender, amount);
    }

    /**
     * @notice Allows the owner to open a CFA to an account.
     * @param token The SuperToken being streamed.
     * @param id The maintainer id of the token stream.
     * @param flowRate The rate in which the token is streamed.
     */
    function createFlowFromContract(ISuperfluidToken token, uint256 id, int96 flowRate) external {
        require(msg.sender == dictator);
        cfaV1.createFlow(maintainers[id], token, flowRate);
    }

    /**
     * @notice Allows the owner to close a CFA to an account.
     * @param token The SuperToken being streamed.
     * @param id The id of the token stream.
     */
    function deleteFlowFromContract(ISuperfluidToken token, uint256 id) external {
        cfaV1.deleteFlow(address(this), maintainers[id], token);
    }

    function makeOneTimePayment(ISuperToken token, address receiver, uint amount) external {
        require(msg.sender == dictator);
        token.transferFrom(address(this), receiver, amount);
    }
}
