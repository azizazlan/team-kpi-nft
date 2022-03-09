# Team KPI NFT

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
2. Signup with [Etherscan](https://etherscan.io/) to get the `ETHERSCAN_API_KEY`. You will need the key to create the environment file in the following step.
3. Subscribe to chainlink's VRF [here](https://vrf.chain.link/) to get the subscription id. Fund your account with LINK. So ensure your wallet have sufficient ETHER.
4. Create an environment file, `.env` (in the project directory). Then set values for `ETHERSCAN_API_KEY`, `SUBSCRIPTION_ID`, `RINKEBY_URL` and `PRIVATE_KEY` in the file. You can get the Rinkeby's URL in the network settings of the Metamask, or subscribe https://www.alchemy.com
5. Deploy the smart contract on the Rinkeby network:

   `npx hardhat run scripts/deploy-TeamKPI.ts --network rinkeby`

   Once deployed, add another variable `CONTRACT_ADDRESS` and its value (the contract address) in the .env file. So the contents of the file should look similar as below:

   ```
   ETHERSCAN_API_KEY=ABC...
   SUBSCRIPTION_ID=123
   RINKEBY_URL=https://eth-rinkeby.alchemyapi.io/v2/qJ..
   PRIVATE_KEY=869..
   CONTRACT_ADDRESS=0x..
   ```

6. You can now check the deployed smart contract at Etherscan:

   ```
   npx hardhat verify --network rinkeby [smart_contract_address] [chainlink_subscription_id]
   ```

7. Build the teams NFTs:

   `npx hardhat buildteams --network rinkeby`

   This will create five teams:

   | Team name      | Token id |
   | -------------- | -------- |
   | Greyhound      | 0        |
   | Butt Quick     | 1        |
   | Blues Brothers | 2        |
   | Red Devils     | 3        |
   | The Family     | 4        |

8. Delete all the .json files in the metadata directory if exist. Then, generate the metadata file for each team:

   ```
   npx hardhat metadata --network rinkeby
   ```

   This will create five \*.json files in the `metadata` directory and corresponding png files in the `imgs/upload` folder. For example `metadata/greyhound.json`, and `imgs/upload/greyhound.png`.

9. Add/pin the png files to IPFS and get the IPFS CID for each of the png file. Then edit each of the json file and set the value of the `image` property. Thank to Anarkrypto, you can use his [tool](https://anarkrypto.github.io/upload-files-to-ipfs-from-browser-panel/public/) to upload/pin the files to IPFS. You can use other services too like Pinata to get the IPFS CIDs.
10. Pin each of the \*.json file to IPFS and record the CID for each of the json file. For example, the content of greyhound.json:

    ```javascript
    {
        "name": "Greyhound",
        "description": "Chainlink VRF",
        "image": "https://ipfs.io/ipfs/[CID_IMAGE]?filename=greyhound.png",
        "attributes": [
            { "trait_type": "Engagement", "value": 48 },
            { "trait_type": "Energy", "value": 20 },
            { "trait_type": "Influence", "value": 7 },
            { "trait_type": "Quality", "value": 40 },
            { "trait_type": "PeopleSkills", "value": 13 },
            { "trait_type": "TechnicalAbility", "value": 41 },
            { "trait_type": "Results", "value": 0 }
         ]
    }
    ```

    You may check the json file on ipfs. To do this, enter the URL in the browser:

    https://ipfs.io/ipfs/[CID_JSON]?filename=greyhound.json

11. Set the uri for each team, for example, the "Greyhound" team with the tokenId = 0:

    ```
    npx hardhat seturi --tokenId 0 --uri https://ipfs.io/ipfs/IPFS_CID_HASH?filename=greyhound.json --network rinkeby
    ```

12. Finally, you can check the NFTs at the [ OpenSea ](https://opensea.io/). Ensure you switch to testnet network. It took a while for the image to appear. You might have to click the refresh button in the NFT card and reload the browser.
