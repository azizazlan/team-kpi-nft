import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';

task('geturi', 'Get the tokenURI for each token')
  .addParam('tokenid', 'tokenId')
  .setAction(async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners();
    const contractAddress = `${process.env.CONTRACT_ADDRESS}`;
    const TeamKPI = await hre.ethers.getContractFactory('TeamKPI');
    const teamKPI = TeamKPI.attach(contractAddress);

    const tokenId = taskArgs.tokenid;

    const owner = await teamKPI.ownerOf(tokenId);
    console.log(`Owner ${owner}`);
    const uri = await teamKPI.tokenURI(tokenId);
    console.log(`Token URI ${uri}`);
  });

export default {};
