# War Card Game

This is a simple War Card Game that allows a Player to play against the House.  After each play, the higher card wins and both cards are added to the bottom of the winner's pile.  If there is a tie then there is a "battle" where 4 additional cards are played and the winner gets to add all of the cards to the bottom of their pile.  If there is a tie again, there will be another "battle" with the maximum of 2 chances to break the tie.  This is a timed game, so if someone gets all of the cards before the timer expires, they win.  Also once the timer expires, the player with the most cards is the winner.

The payout for winning is in WARCARDS tokens.  If a player wins before the timer expires, they receive 100 tokens.  If a player wins after the timer expires, they receive 50 tokens.  All tokens are accumulated in the game in a "War Chest" and can be saved to the player's Metamask wallet if they so desire.

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Alchemy](https://www.alchemy.com/) (Blockchain Connection)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/). We recommend using the latest LTS (Long-Term-Support) version, and preferably installing NodeJS via [NVM](https://github.com/nvm-sh/nvm#intro).
- Create an [Alchemy](https://www.alchemy.com/) account, you'll need to create an app for the Ethereum chain, on the mainnet network

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`npm install`

### 3. Create and Setup .env
Before running any scripts, you'll want to create a .env file with the following values (see .env.example):

- **GOERLI_ALCHEMY_API_KEY=""**
- **SEPOLIA_ALCHEMY_API_KEY=""**
- **PRIVATE_KEYS=""**

### 4. Run tests
`$ npx hardhat test`

### 5. Start Hardhat node
`$ npx hardhat node`

### 6. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 7. Start frontend
`$ npm run start`
