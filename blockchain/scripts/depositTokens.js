const hre = require("hardhat");
const { Framework, getFlowAmountByPerSecondFlowRate } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;


// $ yarn hardhat run scripts/depositTokens.js --network goerli
async function main() {
  const dictatorshipAddress = "0x3D29250e34fE937DcC0d3d242Dd1fb12b81Cc9C7";

  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider
  });

  const signers = await hre.ethers.getSigners();
  const dictatorship = new ethers.Contract(dictatorshipAddress, DictatorshipABI, provider);
  const daix = await sf.loadSuperToken("fDAIx");
  const amount = "1000"
  //call money router send lump sum method from signers[0]
  const tx = await dictatorship.connect(signers[0]).depositSuperTokens(daix.address, ethers.utils.parseEther(amount))
  console.log(`
    ${amount} fDAIx is being deposited
    tx hash: ${tx.hash}
  `)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});