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
  // 0x3D29250e34fE937DcC0d3d242Dd1fb12b81Cc9C7
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
