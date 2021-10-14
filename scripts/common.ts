import {BigNumber, utils} from "ethers";
import {ethers} from "hardhat";
import { AdventureParty, Rarity, RarityGold } from "../typechain";

const XP_PER_DAY = BigNumber.from(250).mul(BigNumber.from(10).pow(18));
const RARITY_CONTRACT = "0xce761d788df608bd21bdd59d6f4b54b2e27f25bb";
const RARITY_GOLD_CONTRACT = "0x2069B76Afe6b734Fb65D1d099E7ec64ee9CC76B2";


const RARITY_ATTRIBUTES_CTR = "0xB5F5AF1087A8DA62A23b08C00C6ec9af21F397a1";
const RARITY_SKILLS_CTR = "0x51C0B29A1d84611373BA301706c6B4b72283C80F";
const RARITY_CRAFT_CTR = "0x2A0F1cB17680161cF255348dDFDeE94ea8Ca196A";
const RARITY_CRAFTING_CTR = "0xf41270836dF4Db1D28F7fd0935270e3A603e78cC";
const RARITY_FEATS_CTR = "0x4F51ee975c01b0D6B29754657d7b3cC182f20d8a"; 

const INTERVAL = process.env.INTERVAL; //15 

export async function displayStatus() {
    const [wallet] = await ethers.getSigners();
    const adventurePartyAddress = process.env.ADVENTURE_PARTY;
    if (adventurePartyAddress) {
        const adventureParty = <AdventureParty> await ethers.getContractAt("AdventureParty", adventurePartyAddress);
        const rarity = <Rarity> await ethers.getContractAt("Rarity", RARITY_CONTRACT);
        const gold = <RarityGold> await ethers.getContractAt("RarityGold", RARITY_GOLD_CONTRACT);

        const adventurersCount = await adventureParty.connect(wallet).adventurerCount();

        console.log("my Adventurers: ");

        for (let i = 0; i < adventurersCount.toNumber(); i++) {
            const id = await adventureParty.connect(wallet).adventurerAt(i);

            const adventurer = await rarity.connect(wallet).summoner(id);
            const xpRequired = await rarity.connect(wallet).xp_required(adventurer._level);
            const className = await rarity.connect(wallet).classes(adventurer._class);

            const nextLeveling = new Date(adventurer._log.toNumber() * 1000).toLocaleString()

            const nbAdventureToLevelUp = xpRequired.sub(adventurer._xp).div(XP_PER_DAY);
            const adventurerGold = utils.formatUnits(await gold.balanceOf(id), 18)
            // console.log(`${className} (${id}): level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)} (nb days to level up: ${nbAdventureToLevelUp.toString()}). Next leveling ${nextLeveling}`);
            const levelxp = await rarity.xp_required(adventurer._level);
            //if(adventurer._level.toNumber() == 1 ) {
            //if(  adventurer._xp.eq(levelxp) && adventurer._xp.sub(levelxp)   ){

            //console.log(`${adventurer._level.eq(1)} : ${levelxp.toBigInt()}`);
            // if(adventurer._level.eq(1) && adventurer._xp.toBigInt() > levelxp.toBigInt()  ){
            //     console.log(`${className} (${id}): level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)}  ${formatValue(levelxp)} ${formatValue(adventurer._xp.sub(levelxp))}`); 
            //     const levelup = await rarity.connect(wallet).level_up(id); 
            //     console.log(`---- ${id} levelup --------------`) 
            //     sleep();
            //     console.log(`---- sleep --------------`) 
                
            //     //const goldclaim = await gold.claim(id);
            //     //console.log(`---- ${id} level:${adventurer._level.toNumber()} goldclaim(${goldclaim}): `) 
            // }else{                
            //     console.log(`${className} (${id}): level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)} (nb days to level up: ${nbAdventureToLevelUp.toString()}). Next leveling ${nextLeveling}`);
            // }
            console.log(`${className} (${id}): level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)} (nb days to level up: ${nbAdventureToLevelUp.toString()}). Next leveling ${nextLeveling}`);
        }
    }
}

export async function runParty() {
    const [wallet] = await ethers.getSigners();

    const adventurePartyAddress = process.env.ADVENTURE_PARTY;

    if (adventurePartyAddress) {

        const adventureParty = <AdventureParty> await ethers.getContractAt("AdventureParty", adventurePartyAddress);

        if (await canAdventure()) {
            console.info("Running Adventure...");
            let trx = await adventureParty.connect(wallet).adventureAll();
            console.info("trx--" + trx.data);
            await trx.wait();
        }

        // if (await canLevelUp()) {
        //     console.info("Leveling up...");
        //     let trx = await adventureParty.connect(wallet).levelUpAll();
        //     console.info("trx--" + trx.data);
        //     await trx.wait();
        // }

        /* claim gold */

    }
}

async function canAdventure() {
    const [wallet] = await ethers.getSigners();
    const adventurePartyAddress = process.env.ADVENTURE_PARTY;
    if (adventurePartyAddress) {
        const adventureParty = <AdventureParty> await ethers.getContractAt("AdventureParty", adventurePartyAddress);
        const rarity = <Rarity> await ethers.getContractAt("Rarity", RARITY_CONTRACT);

        const adventurersCount = await adventureParty.connect(wallet).adventurerCount();

        for (let i = 0; i < adventurersCount.toNumber(); i++) {
            const id = await adventureParty.connect(wallet).adventurerAt(i);
            const adventurer = await rarity.connect(wallet).summoner(id);

            const log = adventurer._log.toNumber() * 1000;
            if (log <= (new Date().getTime()) ) {
                return true;
            }
        }
    }

    return false;
}

async function canLevelUp() {
    const [wallet] = await ethers.getSigners();
    const adventurePartyAddress = process.env.ADVENTURE_PARTY;
    if (adventurePartyAddress) {
        const adventureParty = <AdventureParty> await ethers.getContractAt("AdventureParty", adventurePartyAddress);
        const rarity = <Rarity> await ethers.getContractAt("Rarity", RARITY_CONTRACT);

        const adventurersCount = await adventureParty.connect(wallet).adventurerCount();

        for (let i = 0; i < adventurersCount.toNumber(); i++) {
            const id = await adventureParty.connect(wallet).adventurerAt(i);
            const adventurer = await rarity.connect(wallet).summoner(id);

            const xpRequired = await rarity.connect(wallet).xp_required(adventurer._level);

            if (adventurer._xp.gte(xpRequired)) {
                return true;
            }
        }
    }

    return false;
}
export function sleep() { 
    setInterval(function () {  sleep() }, 15 * 60 * 1000);
}

export function formatValue(value: BigNumber) {
    return ethers.utils.formatUnits(value.toString(), 18);
}
