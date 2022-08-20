const hre = require("hardhat");
const { ethers } = require("hardhat");
require("dotenv").config();
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;

// $ yarn hardhat run scripts/revokeMaintainer.s --network goerli
async function main() {
    const dictatorshipAddress = "0x6D030b8eEa90e82A9992BD6C73baFD72a1C15802";
    const id = 0; // this should be account 2, if createMaintainer.js was run with it's address


    const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

    const signers = await hre.ethers.getSigners();
    const dictatorship = new ethers.Contract(dictatorshipAddress, DictatorshipABI, provider);
    //call money router send lump sum method from signers[0]
    await dictatorship.connect(signers[0]).revokeMaintainer(id).wait(1)
    const zeroAddr = await dictatorship.connect(signers[0]).getMaintainerFromId(0)
    console.log(zeroAddr)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });