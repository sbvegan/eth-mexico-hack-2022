const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;


//$ yarn hardhat run scripts/tokenApproval.js --network goerli
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
  //approve contract to spend 1000 daix
  const dictatorshipApproval = daix.approve({
      receiver: dictatorship.address,
      amount: ethers.utils.parseEther(amount)
  });

  const tx = await dictatorshipApproval.exec(signers[0])
  console.log(tx.hash)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
