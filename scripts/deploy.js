// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  let NAME = 'MCH Media Group'
  let SYMBOL = 'MCHT'
  let MAX_SUPPLY = '1000000'
  const PRICE = ethers.utils.parseUnits('0.025', 'ether')
  const DEPLOY_TIME = new Date().getTime();
  let accounts, deployer, user1, saletime, user2, user3


  // Deploy Token
  const Token = await hre.ethers.getContractFactory("Token")
  const token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
  await token.deployed()

  console.log(`Token deployed to: ${token.address}\n`)

  // Deploy Wargame
  const Wargame = await hre.ethers.getContractFactory("Wargame")
  const wargame = await Wargame.deploy(token.address, PRICE, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'), DEPLOY_TIME)
  await wargame.deployed();

  let timeDeployed = await wargame.timeDeployed();
  timeDeployed = Number(timeDeployed);


  console.log(`Crowdsale deployed to: ${wargame.address}\n`)
  console.log("Time Deployed:", new Date(timeDeployed))

  let transaction = await token.transfer(wargame.address, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'))
  await transaction.wait()

  console.log(`Tokens transferred to Wargame\n`)

  // Configure Accounts
  accounts = await ethers.getSigners()
  deployer = accounts[0]

    // Deploy NFT
    NAME = "MCH Generated NFT"
    SYMBOL = "MCHNFT"
    const COST = ethers.utils.parseUnits("1", "ether") // 1 ETH
  
    const NFT = await hre.ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(NAME, SYMBOL, COST)
    await nft.deployed()
  
    console.log(`Deployed NFT Contract at: ${nft.address}`)
    

  // // Add accounts to white list
  // transaction = await crowdsale.connect(deployer).addToWhiteList(accounts[0].address)
  // transaction = await crowdsale.connect(deployer).addToWhiteList(accounts[1].address)
  // transaction = await crowdsale.connect(deployer).addToWhiteList(accounts[2].address)
  // transaction = await crowdsale.connect(deployer).addToWhiteList(accounts[3].address)
  // await transaction.wait()

  // console.log(`White Listed accounts added to Crowdsale\n`)

 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
