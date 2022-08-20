const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;

// $ yarn hardhat run scripts/deleteFlowToMaintainer.js --network goerli
async function main() {
  const dictatorshipAddress = "0x3D29250e34fE937DcC0d3d242Dd1fb12b81Cc9C7";
  //add the maintainer id of your intended receiver
  const maintainerId = 0;

  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider
  });

  const signers = await hre.ethers.getSigners();
  const dictatorship = new ethers.Contract(dictatorshipAddress, DictatorshipABI, provider);
  const daix = await sf.loadSuperToken("fDAIx");
  
  //call money router create flow into contract method from signers[0] 
  //this flow rate is ~1000 tokens/month
  const tx = await dictatorship.connect(signers[0]).deleteFlowFromContract(daix.address, maintainerId);
  console.log(`
    You are deleting a CFA to maintainer: ${maintainerId}
    tx hash: ${tx.hash}
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});