import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-gas-reporter';
import fs from 'fs';

dotenv.config();

// metadataTemple is schema ?
const metadataTemple = {
  name: '',
  description: '',
  image: '',
  attributes: [
    {
      trait_type: 'Engagement',
      value: 0,
    },
    {
      trait_type: 'Energy',
      value: 0,
    },
    {
      trait_type: 'Influence',
      value: 0,
    },
    {
      trait_type: 'Quality',
      value: 0,
    },
    {
      trait_type: 'PeopleSkills',
      value: 0,
    },
    {
      trait_type: 'TechnicalAbility',
      value: 0,
    },
    {
      trait_type: 'Results',
      value: 0,
    },
  ],
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('buildteams', 'Will build three teams').setAction(
  async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners();
    const contractAddress = `${process.env.CONTRACT_ADDRESS}`;
    const TeamKPI = await hre.ethers.getContractFactory('TeamKPI');
    const teamKPI = TeamKPI.attach(contractAddress);

    console.log(`Building teams at ${teamKPI.address}`);

    const tx1 = await teamKPI
      .connect(signers[0])
      .requestNewTeamKPI('Greyhound');
    console.log(tx1);
    const tx2 = await teamKPI
      .connect(signers[0])
      .requestNewTeamKPI('Fat Butt Quick');
    console.log(tx2);
    const tx3 = await teamKPI
      .connect(signers[0])
      .requestNewTeamKPI('Blues Brothers');
    console.log(tx3);
    const tx4 = await teamKPI
      .connect(signers[0])
      .requestNewTeamKPI('Red Devils');
    console.log(tx4);
  },
);

task('metadata', 'Generate metadata').setAction(async (taskArgs, hre) => {
  // Get the smart contract instance
  const signers = await hre.ethers.getSigners();
  const contractAddress = `${process.env.CONTRACT_ADDRESS}`;
  const TeamKPI = await hre.ethers.getContractFactory('TeamKPI');
  const teamKPI = TeamKPI.attach(contractAddress);
  const name = await teamKPI.name();
  const address = teamKPI.address;
  console.log(`Contract name ${name} at ${address}`);

  // Get number of teams
  const bnlength = await teamKPI.getNumberOfTeams();
  console.log(bnlength);

  const length = hre.ethers.BigNumber.from(bnlength).toNumber();
  console.log(`Number of teams ${length}`);
  let index = 1; // should starts frim 0 but i just want 3

  while (index < length) {
    let teamMetadata = metadataTemple;
    let teamOverview = await teamKPI.connect(signers[0]).kpis(index);
    index++;
    teamMetadata['name'] = teamOverview['name'];

    if (
      fs.existsSync(
        'metadata/' +
          teamMetadata['name'].toLowerCase().replace(/\s/g, '-') +
          '.json',
      )
    ) {
      console.log('test');
      continue;
    }
    console.log(teamMetadata['name']);
    teamMetadata['attributes'][0]['value'] =
      teamOverview['engagement'].toNumber();
    teamMetadata['attributes'][1]['value'] = teamOverview['energy'].toNumber();
    teamMetadata['attributes'][2]['value'] =
      teamOverview['influence'].toNumber();
    teamMetadata['attributes'][3]['value'] = teamOverview['quality'].toNumber();
    teamMetadata['attributes'][4]['value'] =
      teamOverview['peopleSkills'].toNumber();
    teamMetadata['attributes'][5]['value'] =
      teamOverview['technicalAbility'].toNumber();
    let filename =
      'metadata/' + teamMetadata['name'].toLowerCase().replace(/\s/g, '-');
    let data = JSON.stringify(teamMetadata);
    fs.writeFileSync(filename + '.json', data);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: '0.8.7',
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
