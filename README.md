# Chainlink random team creation

This project was inspired by [Patrick's repo](https://github.com/PatrickAlphaC/dungeons-and-dragons-nft).
Unlike the original repo which was built using _truffle_, this project uses _hardhat_.

Instead a _Dungeon and Dragon_'s character, it can create a "team" (for example, a unit in a business enterprise) with the following key performance indicators or KPI. Each indicator's value is obtained randomly using the Chainlink's `VRFConsumerBaseV2` smart contract.

KPI:

```js
uint256 engagement; // team member happiness, email/text responsiveness, external interaction
uint256 energy; // turn up at work ready, proactive, extra efforts
uint256 influence; // leadership, is a subject matter expert, influence peers, respectful
uint256 quality; // attention to detail
uint256 peopleSkills; // networking, work with more people, maintain quality deliverables
uint256 technicalAbility; // possess required skills, task completed? task complexity?
```

In addition, each team will have a (string) name.

## Usage

1. Clone this repo, change into the project directory and then run `npm install`.
2. Create an environment file, `.env` and set the values for `RINKEBY_URL` and `PRIVATE_KEY` in the file.
3. Deploy the smart contract on the Rinkeby network

   `npx hardhat run --network rinkeby scripts/deploy-TeamKPI.ts`

   Once deployed, add another variable `CONTRACT_ADDRESS` and its value (the contract address) in the .env file.

4. Subscribe and add a consumer (you need the contract address above) in the Subscription Manage [page](https://vrf.chain.link/). Make sure you have sufficient ETHER and LINK.
5. Create three (3) teams NFTs:

   `npx hardhat run --network rinkeby scripts/create-nfts.ts`

6.
7.
8.
