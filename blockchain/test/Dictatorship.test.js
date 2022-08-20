const { Framework } = require("@superfluid-finance/sdk-core");

const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");
const daiABI = require("./abis/fDAIABI");

const deployFramework = require("@superfluid-finance/ethereum-contracts/scripts/deploy-framework");
const deployTestToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-test-token");
const deploySuperToken = require("@superfluid-finance/ethereum-contracts/scripts/deploy-super-token");

const LOG_LINE = '------------------------------------------------'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' 

const provider = web3;

let accounts;

let sf;
let dai;
let daix;
let dictator;
let maintainer1;
let maintainer2;
let dictatorship


const errorHandler = (err) => {
  if (err) throw err;
};


before(async function () {    

  //get accounts from hardhat
  accounts = await ethers.getSigners();

  //deploy the framework
  await deployFramework(errorHandler, {
      web3,
      from: accounts[0].address,
  });

  //deploy a fake erc20 token for borrow token
  let fDAIAddress = await deployTestToken(errorHandler, [":", "fDAI"], {
      web3,
      from: accounts[0].address,
  });

  //deploy a fake erc20 wrapper super token around the fDAI token
  let fDAIxAddress = await deploySuperToken(errorHandler, [":", "fDAI"], {
      web3,
      from: accounts[0].address,
  });

  //initialize the superfluid framework...put custom and web3 only bc we are using hardhat locally
  sf = await Framework.create({
      chainId: 31337,
      provider,
      resolverAddress: process.env.RESOLVER_ADDRESS, //this is how you get the resolver address
      protocolReleaseVersion: "test",
  });    

  dictator = await sf.createSigner({
      signer: accounts[0],
      provider: provider
  });    

  maintainer1 = await sf.createSigner({
      signer: accounts[1],
      provider: provider
  });

  maintainer2 = await sf.createSigner({
      signer: accounts[2],
      provider: provider
  })

  //use the framework to get the super toen
  daix = await sf.loadSuperToken("fDAIx");
  
  //get the contract object for the erc20 token
  let daiAddress = daix.underlyingToken.address;
  dai = new ethers.Contract(daiAddress, daiABI, accounts[0]);
  

});

beforeEach(async function () {
  console.log("Deploying contract...")
  const Dictatorship = await ethers.getContractFactory("Dictatorship", dictator);   
  dictatorship = await Dictatorship.deploy();
  await dictatorship.deployed();
  console.log("Deployed.")
  console.log(LOG_LINE)
  console.log("Topping up account balances...");
        
    await dai.connect(dictator).mint(
        dictator.address, ethers.utils.parseEther("10000")
    );

    await dai.connect(maintainer1).mint(
        maintainer1.address, ethers.utils.parseEther("10000")
    );

    await dai.connect(maintainer2).mint(
        maintainer2.address, ethers.utils.parseEther("1000")
    );    

    await dai.connect(dictator).approve(daix.address, ethers.utils.parseEther("10000"));
    await dai.connect(maintainer1).approve(daix.address, ethers.utils.parseEther("10000"));
    await dai.connect(maintainer2).approve(daix.address, ethers.utils.parseEther("1000"));
    
    const dictatorDaixUpgradeOperation = daix.upgrade({
        amount: ethers.utils.parseEther("10000")
    });
    const maintainer1DaixUpgradeOperation = daix.upgrade({
        amount: ethers.utils.parseEther("10000")
    });
    const maintainer2DaixUpgradeOperation = daix.upgrade({
        amount: ethers.utils.parseEther("1000")
    });
    
    await dictatorDaixUpgradeOperation.exec(dictator);
    await maintainer1DaixUpgradeOperation.exec(maintainer1);
    await maintainer2DaixUpgradeOperation.exec(maintainer2);
})

describe("Dictatorship", function () {
  
  describe("Maintainers", function () {
    it("Should create one maintainer", async function () {
      await dictatorship.createMaintainer(maintainer1.address);
      const contractMaintainer = await dictatorship.getMaintainerFromId(0);
      expect(contractMaintainer).to.equal(maintainer1.address);
      const maintainerId = await dictatorship.getMaintainerId();
      expect(maintainerId).to.equal(1)
    });

    it("Should create two maintainers", async function () {
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
      await dictatorship.createMaintainer(maintainer1.address);
      const contractMaintainer = await dictatorship.getMaintainerFromId(0);
      expect(contractMaintainer).to.equal(maintainer1.address);

      await dictatorship.revokeMaintainer(0);
      const exContractMaintainer = await dictatorship.getMaintainerFromId(0);
      expect(exContractMaintainer).to.equal(ZERO_ADDRESS);
    });

  });

});
