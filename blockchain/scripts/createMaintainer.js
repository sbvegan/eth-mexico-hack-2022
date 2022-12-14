const hre = require("hardhat");
const { Framework, getFlowAmountByPerSecondFlowRate } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;

// $ yarn hardhat run scripts/createMaintainer.js --network goerli
async function main() {
    const dictatorshipAddress = "0x3D29250e34fE937DcC0d3d242Dd1fb12b81Cc9C7";
    const account2 = "0xa5e9E3E21E6c3b59c1dE5c8d6F9F8cebb7a24BE1";

    const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

    const signers = await hre.ethers.getSigners();
    const dictatorship = new ethers.Contract(dictatorshipAddress, DictatorshipABI, provider);
    //call money router send lump sum method from signers[0]
    const tx = await dictatorship.connect(signers[0]).createMaintainer(account2)
    console.log(`
        address: ${account2} is being added as a maintainer
        tx hash: ${tx.hash}
    `)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });