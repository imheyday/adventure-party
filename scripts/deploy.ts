import {BigNumber, utils} from "ethers";
import { ethers } from "hardhat";
import { AdventureParty__factory, AdventureParty } from "../typechain" 

// 44 
const CLASSES_TO_SUMMON = [1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11]

// 66
// const CLASSES_TO_SUMMON = [1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11,1,2,3,4,5,6,7,8,9,10,11]


async function main() {

  // contract creation Method 0x60806040   FEE 0.3799743985679 FTM ($0.47)
  const AdventureParty = <AdventureParty__factory> await ethers.getContractFactory("AdventureParty");
  const adventureParty = await AdventureParty.deploy();
  await adventureParty.deployed();
  console.log("AdventureParty deployed to:", adventureParty.address);

  // Summon Many  77summoner  FEE 2.0383023529341 FTM ($2.51)
  // const [wallet] = await ethers.getSigners();
  // const adventureParty = <AdventureParty> await ethers.getContractAt("AdventureParty", "0x2e5D1F40Aa374Fc914387Eb9bA4cB6C204CAF813");
  console.log(`Summoming ${CLASSES_TO_SUMMON} adventurers, please wait...`);
  await (await adventureParty.summonMany(CLASSES_TO_SUMMON)).wait();

  const lastClass = await adventureParty.adventurerAt(CLASSES_TO_SUMMON.length - 1)
  console.log(`Adventurer number ${CLASSES_TO_SUMMON.length}'s summoner ID is ${lastClass}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
