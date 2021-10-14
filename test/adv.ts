import { expect } from "chai";
import { ethers } from "hardhat";
import { AdventureParty__factory, Rarity, RarityGold } from "../typechain"

describe("AdventureParty", function () {
  it("Should summon", async () => {
    const AdventureParty = <AdventureParty__factory> await ethers.getContractFactory("AdventureParty");
    const adventureParty = await AdventureParty.deploy();
    await adventureParty.deployed();
    await adventureParty.summonMany([1,2,3,4]);
    await adventureParty.adventureAll();

    const rarity = <Rarity>await ethers.getContractAt("Rarity", await adventureParty.rarity());
    const p0 = await adventureParty.adventurerAt(0);
    const xp0 = parseInt(ethers.utils.formatEther(await rarity.xp(p0)));
    expect(xp0).to.be.equal(250, "XP should be 250 after adventuring");
    
    await adventureParty.adventureAll();
    const xp1 = parseInt(ethers.utils.formatEther(await rarity.xp(p0)));
    expect(xp1).to.be.equal(250, "XP should be 250 after adventuring twice in a row");

    await ethers.provider.send('evm_increaseTime', [24*60*60 + 1000]);
    await adventureParty.adventureAll();
    const xp2 = parseInt(ethers.utils.formatEther(await rarity.xp(p0)));
    expect(xp2).to.be.equal(500, "XP should be 500 after adventuring for two days");
  });

  it("Should level up and claim gold", async () => {
    const AdventureParty = <AdventureParty__factory> await ethers.getContractFactory("AdventureParty");
    const adventureParty = await AdventureParty.deploy();
    await adventureParty.deployed();
    await adventureParty.summonMany([1,2,3,4,5,6,7,8,9,10,11]);
    await adventureParty.adventureAll();

    for (let i = 0; i < 11; i ++) {
      await ethers.provider.send('evm_increaseTime', [24*60*60 + 1000]);
      await adventureParty.adventureAll();
    }

    await adventureParty.levelUpAll();

    const rarityGold = <RarityGold>await ethers.getContractAt("RarityGold", await adventureParty.rarityGold());

    console.log("Adventurer 0 balance ", 
      ethers.utils.formatEther(await rarityGold.balanceOf(await adventureParty.adventurerAt(0))));
  });

});