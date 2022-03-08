import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';

const teams = [
  'Greyhound',
  'Butt Quick',
  'Blues Brothers',
  'Red Devils',
  'The Family',
];

task('buildteams', 'build five teams with (random) VRF KPI values').setAction(
  async (taskArgs, hre) => {
    const signers = await hre.ethers.getSigners();
    const contractAddress = `${process.env.CONTRACT_ADDRESS}`;
    const TeamKPI = await hre.ethers.getContractFactory('TeamKPI');
    const teamKPI = TeamKPI.attach(contractAddress);

    console.log(`Building ${teams.length} teams at ${teamKPI.address}`);

    for (let team of teams) {
      console.log(`requestNewTeamKPI for ${team}`);
      const tx = await teamKPI.connect(signers[0]).requestNewTeamKPI(team);
      console.log(tx);
    }
  },
);

export default {};
