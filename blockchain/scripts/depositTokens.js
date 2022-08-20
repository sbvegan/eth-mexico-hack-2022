const hre = require("hardhat");
const { Framework, getFlowAmountByPerSecondFlowRate } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;


// $ yarn hardhat run scripts/depositTokens.js --network goerli
async function main() {
  const dictatorshipAddress = "0xA1e52F22211f53946feDd43a4287Bc47d3B5b376";

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
  await dictatorship.connect(signers[0]).depositSuperTokens(daix.address, ethers.utils.parseEther(amount)).then(function (tx) {
    console.log(`
        You sent ${amount} to the contract. 
        Tx Hash: ${tx.hash}
    `)
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});