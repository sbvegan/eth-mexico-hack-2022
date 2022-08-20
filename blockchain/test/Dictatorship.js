const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

let accounts;

before(async function() {
  
    //get accounts from hardhat
    accounts = await ethers.getSigners();
    const dictator = accounts[0]
    const maintainer = accounts[1]

    let Dictatorship = await ethers.getContractFactory("Dictatorship", dictator);   
    dictatorship = await Dictatorship.deploy();
    await dictatorship.deployed();
})

describe("Dictatorship", function () {

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDictatorship() {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' 

    // Contracts are deployed using the first signer/account by default
    const [dictator, maintainer1, maintainer2] = await ethers.getSigners();

    let Dictatorship = await ethers.getContractFactory("Dictatorship", dictator);   
    dictatorship = await Dictatorship.deploy();
    await dictatorship.deployed();

    return { dictatorship, dictator, maintainer1, maintainer2, ZERO_ADDRESS };
  }
  
  describe("Maintainers", function () {
    it("Should create one maintainer", async function () {
      const { dictatorship,  maintainer1 } = await loadFixture(deployDictatorship);
      await dictatorship.createMaintainer(maintainer1.address);
      const contractMaintainer = await dictatorship.getMaintainerFromId(0);
      expect(contractMaintainer).to.equal(maintainer1.address);
      const maintainerId = await dictatorship.getMaintainerId();
      expect(maintainerId).to.equal(1)
    });

    it("Should create two maintainers", async function () {
      const { dictatorship,  maintainer1, maintainer2 } = await loadFixture(deployDictatorship);
      await dictatorship.createMaintainer(maintainer1.address);
      const contractMaintainer1 = await dictatorship.getMaintainerFromId(0);
      expect(contractMaintainer1).to.equal(maintainer1.address);
      let maintainerId = await dictatorship.getMaintainerId();
      expect(maintainerId).to.equal(1);
      await dictatorship.createMaintainer(maintainer2.address);
      const contractMaintainer2 = await dictatorship.getMaintainerFromId(1);
      expect(contractMaintainer2).to.equal(maintainer2.address);
      maintainerId = await dictatorship.getMaintainerId();
      expect(maintainerId).to.equal(2);
    });

    it("Should revoke a maintainer's status", async function () {
      const { dictatorship,  maintainer1, ZERO_ADDRESS } = await loadFixture(deployDictatorship);
      await dictatorship.createMaintainer(maintainer1.address);
      const contractMaintainer = await dictatorship.getMaintainerFromId(0);
      expect(contractMaintainer).to.equal(maintainer1.address);
      await dictatorship.revokeMaintainer(0);
      const exContractMaintainer = await dictatorship.getMaintainerFromId(0);
      expect(exContractMaintainer).to.equal(ZERO_ADDRESS);
    });

  });

});
