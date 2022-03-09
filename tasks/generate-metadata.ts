import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import fs from 'fs';

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

task('metadata', 'Generate metadata').setAction(async (taskArgs, hre) => {
  // Get the smart contract instance
  const signers = await hre.ethers.getSigners();
  const contractAddress = `${process.env.CONTRACT_ADDRESS}`;
  const TeamKPI = await hre.ethers.getContractFactory('TeamKPI');
  const teamKPI = TeamKPI.attach(contractAddress);
  const name = await teamKPI.name();
  const address = teamKPI.address;

  // Get number of teams
  const bnlength = await teamKPI.getNumberOfTeams();
  const length = hre.ethers.BigNumber.from(bnlength).toNumber();
  let index = 0;

  console.log(
    `Create ${length} metadatas for contract name ${name} at ${address}`,
  );
  while (index < length) {
    const tokenId = index;
    let teamMetadata = metadataTemple;
    let teamOverview = await teamKPI.connect(signers[0]).kpis(tokenId);

    teamMetadata['name'] = teamOverview['name'];
    console.log(`Team ${teamMetadata['name']} tokenId ${tokenId}`);

    // Copy and move PNG file to upload directory
    let pathToFile = `imgs/pngs/${index}.png`;
    let uploadImgFleName =
      'imgs/upload/' + teamMetadata['name'].toLowerCase().replace(/\s/g, '-');
    let pathToNewDestination = uploadImgFleName + '.png';
    fs.copyFile(pathToFile, pathToNewDestination, function (err) {
      if (err) {
        throw err;
      } else {
        console.log(
          'Successfully copied and moved the PNG to upload directory!',
        );
      }
    });

    // Create and write the metadata JSON file
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
    console.log(`\t ${filename}.json`);

    index++;
  }
});

export default {};
