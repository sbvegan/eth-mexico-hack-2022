const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
require("dotenv").config();

// $ yarn hardhat run scripts/deployFactory.js --network goerli
async function main() {

  const DictatorshipFactory = await hre.ethers.getContractFactory("DictatorshipFactory");
  const dictatorshipFactory = await DictatorshipFactory.deploy();
  await dictatorshipFactory.deployed();

  console.log("Dictatorship factory deployed to:", dictatorshipFactory.address);
  // 0x61b4BD34e4b4132de102f73e4c21F53DDF006df9
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
