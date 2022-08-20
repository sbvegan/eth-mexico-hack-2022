const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
require("dotenv").config();

// $ yarn hardhat run scripts/deploy.js --network goerli
async function main() {

  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  const sf = await Framework.create({
    chainId: (await provider.getNetwork()).chainId,
    provider
  });

  const signers = await hre.ethers.getSigners();
  const Dictatorship = await hre.ethers.getContractFactory("Dictatorship");
  const dictatorship = await Dictatorship.deploy(sf.settings.config.hostAddress);

  await dictatorship.deployed();

  console.log("Dictatorship deployed to:", dictatorship.address);
  // 0xA1e52F22211f53946feDd43a4287Bc47d3B5b376
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
