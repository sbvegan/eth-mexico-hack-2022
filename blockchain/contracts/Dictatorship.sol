// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dictatorship is Ownable {

    uint256 public maintainerId;
    mapping (uint256 => address) maintainers;

    constructor() {}

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
     * @return id the new maintainer's id
     */
    function createMaintainer(address _maintainer) external onlyOwner returns(uint256)  {
        uint256 id = maintainerId;
        maintainers[id] = _maintainer;
        maintainerId++;
        return id;
    }

    /**
     * @notice Allows the dictator(owner) to revoke a maintainer.
     * @param _id the id of the maintainer to be removed.
     */
    function revokeMaintainer(uint256 _id) external onlyOwner returns(address)  {
        maintainers[_id] = address(0);
    }


}
