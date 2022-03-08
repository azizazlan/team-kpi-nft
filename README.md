[#](#) Chainlink random team creation

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
2. Subscribe to chainlink's VRF [here](https://vrf.chain.link/) to get the subscription id. Fund your account with LINK. So ensure your wallet have sufficient ETHER.
3. Create an environment file, `.env` (in the project directory). Then set values for `SUBSCRIPTION_ID`, `RINKEBY_URL` and `PRIVATE_KEY` in the file. You can get the Rinkeby's URL in the network settings of the Metamask, or subscribe https://www.alchemy.com
4. Deploy the smart contract on the Rinkeby network:

   `npx hardhat run scripts/deploy-TeamKPI.ts --network rinkeby`

   Once deployed, add another variable `CONTRACT_ADDRESS` and its value (the contract address) in the .env file. So the contents of the file should look similar as below:

   ```
   SUBSCRIPTION_ID=123
   RINKEBY_URL=https://eth-rinkeby.alchemyapi.io/v2/qJ..
   PRIVATE_KEY=869..
   CONTRACT_ADDRESS=0x..
   ```

5. Build the teams NFTs:

   `npx hardhat buildteams --network rinkeby`

   This will create five teams:

   | Team name      | Token id |
   | -------------- | -------- |
   | Greyhound      | 0        |
   | Butt Quick     | 1        |
   | Blues Brothers | 2        |
   | Red Devils     | 3        |
   | The Family     | 4        |

6. **Optional**: You might want to pin the images of the teams in IPFS. You may five the pngs in the `imgs` directory and you are free to use them. File `0.png` is for token with an id (tokenId) "0", and so on. Then get the CID (contains hash value) of the pinned file.
7. Delete all the .json files in the metadata directory if exist. Then, generate the metadata file for each team:

   ```
   npx hardhat metadata --network rinkeby
   ```

   This will create five \*.json files in the `metadata` directory, for example `greyhound.json`.

8. **Optional**: You might want to set the value of the `image` property in each of the \*.json file.
9. Pin each of the \*.json file to IPFS and record the CID for each team.
10. Set the uri for each team, for example, the "Greyhound" team with the tokenId = 0:

    ```
    npx hardhat seturi --tokenId 0 --uri https://ipfs.io/ipfs/IPFS_CID_HASH?filename=greyhound.json --network rinkeby
    ```
