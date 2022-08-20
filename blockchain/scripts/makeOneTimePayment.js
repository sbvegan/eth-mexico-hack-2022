const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;

// $ yarn hardhat run scripts/makeOneTimePayment.js --network goerli
async function main() {
  const dictatorshipAddress = "0x3D29250e34fE937DcC0d3d242Dd1fb12b81Cc9C7";
  const account2 = "0xa5e9E3E21E6c3b59c1dE5c8d6F9F8cebb7a24BE1";

  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider
  });

  const signers = await hre.ethers.getSigners();
  const dictatorship = new ethers.Contract(dictatorshipAddress, DictatorshipABI, provider);
  const daix = await sf.loadSuperToken("fDAIx");
  const amount = "8"
  
  //call money router create flow into contract method from signers[0] 
  //this flow rate is ~1000 tokens/month
  const tx = await dictatorship.connect(signers[0]).makeOneTimePayment(daix.address, account2, ethers.utils.parseEther(amount));
  console.log(`
    You are making a one time payment of: ${amount} fDAIx to ${account2}
    tx hash: ${tx.hash}
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});