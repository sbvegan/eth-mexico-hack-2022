const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;


//$ yarn hardhat run scripts/tokenApproval.js --network goerli
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
  //approve contract to spend 1000 daix
  const dictatorshipApproval = daix.approve({
      receiver: dictatorship.address,
      amount: ethers.utils.parseEther(amount)
  });

  await dictatorshipApproval.exec(signers[0]).then(function (tx) {
    console.log(`
        Approved the contract for ${amount}. 
        Tx Hash: ${tx.hash}
    `)
  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
