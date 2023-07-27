const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Wargame', () => {
    let wargame, token
    let accounts, deployer, user1, user2, user3
    // let result, timeDeployed, allowBuyingAfter
    // let milliseconds = 120000 // Number between 100000 - 999999

    // const MINUTES_TO_ADD = 60000 * 10  // 10 minutes
    // let BEGIN_CROWDSALE_DATE = 0
    let DEPLOY_TIME = 0

    beforeEach(async () => {
      // Load Contracts
      const Wargame = await ethers.getContractFactory('Wargame')
      const Token = await ethers.getContractFactory('Token')

      // Deploy token
      token = await Token.deploy('MCH Media Group', 'MCHT', '1000000')

      // Configure Accounts
      accounts = await ethers.getSigners()
      deployer = accounts[0]
      user1 = accounts[1]
      user2 = accounts[2]
      user3 = accounts[3]
      
      // Calculate Start Date
      // 86400000 milliseconds = 1 day
      // 3600000 milliseconds = 1 hour
      // 60000 milliseconds = 1 minute
      // 1000 milliseconds = 1 second


       DEPLOY_TIME = new Date().getTime();
       //console.log("begin crowdsale dates: ", BEGIN_CROWDSALE_DATE, " milliseconds, ", Date(BEGIN_CROWDSALE_DATE))



      // Deploy Crowdsale
      wargame = await Wargame.deploy(token.address, ether(1), '1000000', DEPLOY_TIME)

      // Send tokens to wargame
      let transaction = await token.connect(deployer).transfer(wargame.address, tokens(1000000))
      await transaction.wait()

    })

    describe('Deployment', () => {

      it('sends tokens to the Wargame contract', async () => {
        expect(await token.balanceOf(wargame.address)).to.equal(tokens(1000000))
      })

      it('returns the price', async () => {
        expect(await wargame.price()).to.equal(ether(1))
      })
  
      it('returns token address', async () => {
        expect(await wargame.token()).to.equal(token.address)
      })
    })

    describe('Paying Players', () => {
      let transaction, result
      let amount = tokens(50)

      describe('Success', () => {
        beforeEach(async () => {
          // console.log("whitelist count:", await crowdsale.whiteListCount())
          // console.log("whitelisted record:", await crowdsale.whiteListed(user1.address))
          console.log(`Wargame contract Tokens before: ${await token.balanceOf(wargame.address)}\n`)
          transaction = await wargame.connect(user1).payPlayer(amount, { value: ether(0) })
          result = await transaction.wait()
          console.log(`Wargame contract Tokens after: ${await token.balanceOf(wargame.address)}\n`)
          console.log(`Tokens transferred to player: ${await token.balanceOf(user1.address)}\n`)
        })

        it('transfers tokens', async () => {
          expect(await token.balanceOf(wargame.address)).to.equal(tokens(999950))
          expect(await token.balanceOf(user1.address)).to.equal(amount)
        })

        it('updates tokensPaid', async () => {
          expect(await wargame.tokensPaid()).to.equal(amount)
        })

        it('updates contracts ether balance', async () => {
          expect(await ethers.provider.getBalance(wargame.address)).to.equal(amount)
        })

        it('emits a PayPlayer event', async () => {
          // --> https://hardhat.org/hardhat-chai-matchers/docs/reference#.emit
          await expect(transaction).to.emit(wargame, "PayPlayer")
            .withArgs(amount, user1.address)
        })
  

      })

      describe('Failure', () => {

        it('rejects insufficent ETH', async () => {
          await expect(wargame.connect(user1).payPlayer(tokens(50), { value: 0 })).to.be.reverted
        })
  
      })
  
    })

    describe('Sending ETH', () => {
      let transaction, result
      let amount = ether(50)
  
      describe('Success', () => {
  
        beforeEach(async () => {
          transaction = await user1.sendTransaction({ to: wargame.address, value: amount })
          result = await transaction.wait()
        })
  
        it('updates contracts ether balance', async () => {
          expect(await ethers.provider.getBalance(wargame.address)).to.equal(amount)
        })
  
        it('updates user token balance', async () => {
          expect(await token.balanceOf(user1.address)).to.equal(amount)
        })
  
      })
    })

    describe('Updating Price', () => {
      let transaction, result
      let price = ether(2)
  
      describe('Success', () => {
  
        beforeEach(async () => {
          transaction = await wargame.connect(deployer).setPrice(ether(2))
          result = await transaction.wait()
        })
  
        it('updates the price', async () => {
          expect(await wargame.price()).to.equal(ether(2))
        })
  
      })
  
      describe('Failure', () => {
  
        it('prevents non-owner from updating price', async () => {
          await expect(wargame.connect(user1).setPrice(price)).to.be.reverted
        })
  
      })
    })

})