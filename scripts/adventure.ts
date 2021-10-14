import { joinSignature } from "@ethersproject/bytes";
import {BigNumber, utils} from "ethers";
import {ethers} from "hardhat";
import { Rarity, RarityGold,  Erc721Enumerable, Erc721Enumerable__factory, Erc721, AdventureParty, Adventure, Ierc721, Adventure__factory} from "../typechain";
 

const XP_PER_DAY = BigNumber.from(250).mul(BigNumber.from(10).pow(18));
const RARITY_CONTRACT = "0xce761d788df608bd21bdd59d6f4b54b2e27f25bb";
const RARITY_GOLD_CONTRACT = "0x2069B76Afe6b734Fb65D1d099E7ec64ee9CC76B2";


const RARITY_ATTRIBUTES_CTR = "0xB5F5AF1087A8DA62A23b08C00C6ec9af21F397a1";
const RARITY_SKILLS_CTR = "0x51C0B29A1d84611373BA301706c6B4b72283C80F";
const RARITY_CRAFT_CTR = "0x2A0F1cB17680161cF255348dDFDeE94ea8Ca196A";
const RARITY_CRAFTING_CTR = "0xf41270836dF4Db1D28F7fd0935270e3A603e78cC";
const RARITY_FEATS_CTR = "0x4F51ee975c01b0D6B29754657d7b3cC182f20d8a"; 
let ms = 0;
 
 

async function main() {
 
  const [wallet] = await ethers.getSigners();
  console.log(wallet.address);

    // const AdventureParty = <AdventureParty> await ethers.getContractAt("Rarity", RARITY_CONTRACT); 
    // console.log(await AdventureParty.allToken(wallet.address,1));
    // const adventurePartyAddress = "0x10ae917e40910ad84d038282bff04087b729a671";
    // const aParty = <AdventureParty> await ethers.getContractAt("AdventureParty", adventurePartyAddress);

    // await aParty.approveOtherParty("0x76c08936772A02a54BE72A52A63Fe169559Bdb77") //.approve("0x2A66B8373fDe9Ec148b1726DC009DB4628fdc8E8"); 
    // await aParty.transfer("0x76c08936772A02a54BE72A52A63Fe169559Bdb77");
    
    const rarity = <Rarity> await ethers.getContractAt("Rarity", RARITY_CONTRACT);  
    const RarityGold = <Rarity> await ethers.getContractAt("RarityGold", RARITY_GOLD_CONTRACT);  
    // const rcon = await rarity.connect(wallet);
    // const rgcon = await RarityGold.connect(wallet);

    
    // await rarity.approve("0x76c08936772A02a54BE72A52A63Fe169559Bdb77", 2799250); 
    // console.log("----------------approve----------");
    // await rarity.transferFrom("0x2A66B8373fDe9Ec148b1726DC009DB4628fdc8E8", "0xC208305a171fbc66B01F99F2F561271c659D792A", 2799250);
    // console.log("--------------transfer----------------");

    // const CLASSES_TO_SUMMON = [1];
    // await aParty.summonMany(CLASSES_TO_SUMMON);
    // const adventurerID = await aParty.adventurerAt(0);
    // await aParty.transfer(wallet.address);

    //await aParty.transferOwnership(wallet.address);

    // To Wallet NFT SEND  By
    //console.log(await rarity.connect(wallet).transferFrom("0x10ae917E40910ad84d038282bff04087B729A671", "0xC208305a171fbc66B01F99F2F561271c659D792A", 3876745));//tokenOfOwnerByIndex("0x10ae917e40910ad84d038282bff04087b729a671",0));
    
    // NFT OWNER
    for(let x = 3717306; x <= 3717369; x++){ 
      //console.log(await rarity.connect(wallet).ownerOf(x));//3874956 3876745 3876746  3717304 3717369  3717795 3717860 3718150 3718193
      await rarity.connect(wallet).level_up(x);  
      //await RarityGold.connect(wallet).claim(x);              
      console.log(` (${x}): `); 
      sleep();
    }
    //displayStatus()  3719319 3719384  3719150 3719192
    // const gold = <RarityGold> await ethers.getContractAt("RarityGold", RARITY_GOLD_CONTRACT);
      
    // const tokenID = [];
    // let j = 0;

    // for (let c = 0; c < 12; c++) {
    //     rarity.connect(wallet).summon(c); 
    //     console.log((await rarity.connect(wallet).next_summoner()).toString())
    //     // tokenID.push(rarity.connect(wallet).next_summoner().toString());
    // }

    // console.log(tokenID[0]);

    // const adventurer = <Erc721> await ethers.getContractAt("Rarity", RARITY_CONTRACT);
    // console.log(adventurer); 
       
    // const adventureParty = <AdventureParty> await ethers.getContractAt("AdventureParty", "0x10ae917e40910ad84d038282bff04087b729a671"); 
    // console.log(adventureParty);
    // // const x = adventureParty.getAdventurers("0xce761D788DF608BD21bdd59d6f4B54b2e27F25Bb");
    // console.log(adventureParty.allTokens("0x10ae917e40910ad84d038282bff04087b729a671"));

    // const adventurerCount = (await rarity.balanceOf(wallet.address)).toNumber(); 
    // console.log(adventurerCount);


    // const adventurers = await rarity.connect(wallet).getTokenID(wallet.address);
    // console.log(adventurers);
    // console.log((await rarity.connect(wallet).next_summoner()).toString()) 

    // const token = await adventurer["tokenOfOwnerByIndex(" + wallet.address + ",1)"]   //.tokenURI(2042395);
    // console.log(token);
    




    // const tokens = Buffer.from(token, 'base64').toString('utf8');
    // console.log(tokens);

    //console.log((await adventurer.connect(wallet)["tokenOfOwnerByIndex(" + wallet.address + "," + 1 + ")"]))

    // const count = adventurer.totalSupply;
    // const adventurer1 =  (await rarity.ownerOf(2040076)).toString();
    // console.log(count + ":" + adventurer1);
    
    // <Erc721Enumerable> rarity.connect(wallet.address);
    // const adventurerCount = adventurer.adventurers_log(arg);
 
    // for (let i = 0; i < adventurerCount; i++) {
          // console.log((await rarity.connect(wallet).tokenByIndexs(wallet.address,i)).toString());
          // const id = (await adventurer.connect(wallet).tokenByIndex(i));    //tokenOfOwnerByIndex(wallet.address,i));
          // console.log(id);
    // const id = "2042395";
    //     const adventurer = await rarity.connect(wallet).summoner(id);
    //     const xpRequired = await rarity.connect(wallet).xp_required(adventurer._level);
    //     const className = await rarity.connect(wallet).classes(adventurer._class);
    //     const adventure = await rarity.connect(wallet).adventure(id);
    //     console.log("Adventure===" + adventure.blockHash);

    //     const nextLeveling = new Date(adventurer._log.toNumber() * 1000).toLocaleString()
    //     const nbAdventureToLevelUp = xpRequired.sub(adventurer._xp).div(XP_PER_DAY);
    //     const adventurerGold = utils.formatUnits(await gold.balanceOf(id), 18)
    //     console.log(`${className} (${id}): level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)} (nb days to level up: ${nbAdventureToLevelUp.toString()}). Next leveling ${nextLeveling}`);
    // }
  
  
    
}


export function sleep() {
  const randomDelay = Math.floor(Math.random() * 4) * 100;
  return new Promise(resolve => setTimeout(resolve, 30000));
} 
export function formatValue(value: BigNumber) {
    return ethers.utils.formatUnits(value.toString(), 18);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
