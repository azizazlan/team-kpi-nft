//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import 'hardhat/console.sol';

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import '@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';

contract TeamKPI is ERC721URIStorage, VRFConsumerBaseV2 {
  VRFCoordinatorV2Interface COORDINATOR;
  LinkTokenInterface LINKTOKEN;

  // Your subscription ID.
  uint64 s_subscriptionId;

  // Rinkeby coordinator. For other networks,
  // see https://docs.chain.link/docs/vrf-contracts/#configurations
  address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;

  // Rinkeby LINK token contract. For other networks,
  // see https://docs.chain.link/docs/vrf-contracts/#configurations
  address link = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;

  // The gas lane to use, which specifies the maximum gas price to bump to.
  // For a list of available gas lanes on each network,
  // see https://docs.chain.link/docs/vrf-contracts/#configurations
  bytes32 keyHash =
    0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;

  // Depends on the number of requested values that you want sent to the
  // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
  // so 100,000 is a safe default for this example contract. Test and adjust
  // this limit based on the network that you select, the size of the request,
  // and the processing of the callback request in the fulfillRandomWords()
  // function.
  uint32 callbackGasLimit = 100000;

  // The default is 3, but you can set this higher.
  uint16 requestConfirmations = 3;

  // For this example, retrieve 2 random values in one request.
  // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
  uint32 numWords = 1;

  uint256[] public s_randomWord;

  uint256 public s_requestId;
  address s_owner;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  struct KPI {
    uint256 engagement;
    uint256 energy;
    uint256 influence;
    uint256 quality;
    uint256 peopleSkills;
    uint256 technicalAbility;
    uint256 results;
    string name;
  }

  KPI[] public kpis;
  mapping(uint256 => string) requestToTeamName;
  mapping(uint256 => address) requestToSender;
  mapping(uint256 => uint256) requestToTokenId;

  constructor(uint64 subscriptionId)
    ERC721('TeamKPI', 'TKPI')
    VRFConsumerBaseV2(vrfCoordinator)
  {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    LINKTOKEN = LinkTokenInterface(link);
    s_owner = msg.sender;
    s_subscriptionId = subscriptionId;
  }

  // Assumes the subscription is funded sufficiently.
  function requestNewTeamKPI(string memory name) public returns (uint256) {
    // Will revert if subscription is not set and funded.
    s_requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );
    requestToTeamName[s_requestId] = name;
    requestToSender[s_requestId] = msg.sender;
    return s_requestId;
  }

  function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory randomWords
  ) internal override {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    uint256 engagement = (randomWords[0] % 100);
    uint256 energy = ((randomWords[0] % 10000) / 100);
    uint256 influence = ((randomWords[0] % 1000000) / 10000);
    uint256 quality = ((randomWords[0] % 100000000) / 1000000);
    uint256 peopleSkills = ((randomWords[0] % 10000000000) / 100000000);
    uint256 technicalAbility = ((randomWords[0] % 1000000000000) / 10000000000);
    uint256 results = 0;

    kpis.push(
      KPI(
        engagement,
        energy,
        influence,
        quality,
        peopleSkills,
        technicalAbility,
        results,
        requestToTeamName[s_requestId]
      )
    );
    _safeMint(requestToSender[s_requestId], newItemId);
  }

  modifier onlyOwner() {
    require(msg.sender == s_owner);
    _;
  }

  function getLevel(uint256 tokenId) public view returns (uint256) {
    return sqrt(kpis[tokenId].results);
  }

  function getNumberOfTeams() public view returns (uint256) {
    return kpis.length;
  }

  function getTeamOverView(uint256 tokenId)
    public
    view
    returns (
      string memory,
      uint256,
      uint256,
      uint256
    )
  {
    return (
      kpis[tokenId].name,
      kpis[tokenId].engagement +
        kpis[tokenId].energy +
        kpis[tokenId].influence +
        kpis[tokenId].quality +
        kpis[tokenId].peopleSkills +
        kpis[tokenId].technicalAbility,
      getLevel(tokenId),
      kpis[tokenId].results
    );
  }

  function getTeamStats(uint256 tokenId)
    public
    view
    returns (
      uint256,
      uint256,
      uint256,
      uint256,
      uint256,
      uint256,
      uint256
    )
  {
    return (
      kpis[tokenId].engagement,
      kpis[tokenId].energy,
      kpis[tokenId].influence,
      kpis[tokenId].quality,
      kpis[tokenId].peopleSkills,
      kpis[tokenId].technicalAbility,
      kpis[tokenId].results
    );
  }

  function sqrt(uint256 x) internal pure returns (uint256 y) {
    uint256 z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
  }
}
