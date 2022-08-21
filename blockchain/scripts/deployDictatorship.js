const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");
const DictatorshipFactoryABI = require("../artifacts/contracts/DictatorshipFactory.sol/DictatorshipFactory.json").abi;
const DictatorshipABI = require("../artifacts/contracts/Dictatorship.sol/Dictatorship.json").abi;

require("dotenv").config();

// $ yarn hardhat run scripts/deployDictatorship.js --network goerli
async function main() {

  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider
  });

  const signers = await hre.ethers.getSigners();

  // const contract = new Contract(DAI.address, DAI.abi, provider.getSigner());
  const dictatorshipFactory = new Contract(
    "0x61b4BD34e4b4132de102f73e4c21F53DDF006df9",
    DictatorshipFactoryABI,
    signers[0]
  )

  console.log(dictatorshipFactory)

  const tx = await dictatorshipFactory.createDictatorship(
    sf.settings.config.hostAddress,
    signers[0]
  );
  tx.wait(1)

  const count = dictatorshipFactory.getDictatorshipCount();
  const dictatorshipAddress = dictatorshipFactory.getDictatorshipAddress(count - 1);

  // const dictatorship = new Contract(
  //   dictatorshipAddress,
  //   DictatorshipABI,
  //   signers[0]
  // )
  // const DictatorshipFactory = await hre.ethers.getContractFactory("DictatorshipFactory");
  // const dictatorshipFactory = await DictatorshipFactory.deploy();
  // await dictatorshipFactory.deployed();

  console.log("Dictatorship factory deployed to:", dictatorshipAddress);
  // 0x61b4BD34e4b4132de102f73e4c21F53DDF006df9
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
