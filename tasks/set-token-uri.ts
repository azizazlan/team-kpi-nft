import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';

task('seturi', 'Set the tokenURI for each token')
  .addParam('tokenid', 'tokenId')
  .addParam('uri', 'tokenURI')
  .setAction(async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners();
    const contractAddress = `${process.env.CONTRACT_ADDRESS}`;
    const TeamKPI = await hre.ethers.getContractFactory('TeamKPI');
    const teamKPI = TeamKPI.attach(contractAddress);

    const tokenId = taskArgs.tokenid;
    const tokenURI = `${taskArgs.uri}`;

    const tx = await teamKPI.connect(signers[0]).setTokenURI(tokenId, tokenURI);
    console.log(tx);
  });

export default {};
