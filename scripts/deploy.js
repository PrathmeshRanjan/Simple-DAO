const { ethers } = require("hardhat");

async function main() {
  // Compile the contract
  const MyDAO = await ethers.getContractFactory("MyDAO");
  
  // Deploy the contract
  const dao = await MyDAO.deploy();
  
  // Wait for the contract to be mined
  await dao.deployed();
  
  console.log("MyDAO contract deployed to: ", dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
