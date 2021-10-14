import {BigNumber,   utils} from "ethers";
import {ethers} from "hardhat";
import { int } from "hardhat/internal/core/params/argumentTypes";
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
let index = 0;
 
    start();
    setInterval( function(){ 
        start() 
    },  5 * 1000);  



export async function start() {
    
    // console.log(1);
    const [wallet] = await ethers.getSigners();
    const adventurePartyAddress = process.env.ADVENTURE_PARTY;

    if (adventurePartyAddress) {
        // console.log(2);
        const adventureParty = <AdventureParty> await ethers.getContractAt("AdventureParty", adventurePartyAddress);
        const rarity = <Rarity> await ethers.getContractAt("Rarity", RARITY_CONTRACT);
        const gold = <RarityGold> await ethers.getContractAt("RarityGold", RARITY_GOLD_CONTRACT);

        const adventurersCount = await adventureParty.connect(wallet).adventurerCount();
 
 
        // console.log(3);
        const id = await adventureParty.connect(wallet).adventurerAt(index);
        const adventurer = await rarity.connect(wallet).summoner(id);
        const xpRequired = await rarity.connect(wallet).xp_required(adventurer._level);
        const className = await rarity.connect(wallet).classes(adventurer._class);

        // console.log(4);
        const nextLeveling = new Date(adventurer._log.toNumber() * 1000).toLocaleString()
        const nbAdventureToLevelUp = xpRequired.sub(adventurer._xp).div(XP_PER_DAY);
        const adventurerGold = utils.formatUnits(await gold.balanceOf(id), 18);
        const levelxp = await rarity.xp_required(adventurer._level);
            
       

            /*********************  ADVENTURE ***********************/
            // let nextAdventureTime = adventurer._log.toNumber();
            // let currentLevel = adventurer._level.toNumber(); 
            // let currentTime = Math.floor(Date.now() / 1000);
            // // console.info(`----- summoner[${id}] currentTime[${currentTime}]---nextAdventureTime[${nextAdventureTime}]`);

            // if ( currentTime >= nextAdventureTime ) {                 
            //     console.info(`connect adventure : ----- summoner[${id}] Running Adventure-------`);
                
            //     let gasP: any = null;    
            //     try{
            //         gasP = await ethers.provider.getGasPrice();
            //     }catch(e){
            //         console.log(`cathch ${e}`);
            //     }finally{
            //         console.log(`finally1`);
            //     } 
                
                
            //     try{
            //         // await rarity.connect(wallet).adventure(id); 
            //         await adventure(rarity,id,gasP);

            //     }catch(e){
            //         console.log(`cathch1 ${e}`);
            //     }finally{
            //         console.log(`finally2`);
            //     } 

            //     if(index >= ( adventurersCount.toNumber() - 1 )){
            //         console.log(`--------clear------total: ${formatValue(adventurersCount)} index: ${index}`);
            //         index = 0;
        
            //     }else{
            //         index++;
            //         // console.log(`total: ${formatValue(adventurersCount)} index: ${index}`);
            //     }
            //     return;              
            // }else{
            //     console.info(`----- summoner[${id}] Not Adventure----`);
            // }




            /*********************  LEVEL UP ***********************/

            if( adventurer._xp.toBigInt() >= levelxp.toBigInt()  ){
                // console.log(`connect levelup : Adventurers Number: ${index} ${className} (${id}): level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)}  ${formatValue(levelxp)} ${formatValue(adventurer._xp.sub(levelxp))}`); 
                
                try{
                    await rarity.connect(wallet).level_up(id); 
                }catch(e){
                    console.log(e);
                }finally{
                    // console.log(`finally1`);
                }
                // console.log(`---- ${id} levelup --------------`);

                if(index >= ( adventurersCount.toNumber() - 1 )){
                    console.log(`--------clear------total: ${formatValue(adventurersCount)} index: ${index}`);
                    index = 0;
        
                }else{
                    index++;
                    // console.log(`total: ${formatValue(adventurersCount)} index: ${index}`);
                }
                console.log(`${index}/${adventurersCount.toNumber()}  ${className} (${id}): [UP]level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)} (nb days to level up: ${nbAdventureToLevelUp.toString()}). Next leveling ${nextLeveling}`);

                return;
            }else{
                // console.info(`----- summoner[${id}] Not levelup----`);
            }
             
 
            /*********************  Claim Gold  ***********************/ 
            let result : any = null;
            let nonce : any = null;
            let gasPrice : any = 0;  

            try { 
                gasPrice = await ethers.provider.getGasPrice(); // 1000000000000000000;
            } catch (error) {
                console.log(error);
            } finally {
                // console.log(`----  getGasPrice  ------${gasPrice} `);
            }

            try {
                // result = cangetgold(gold.connect(wallet),id); // 1000000000000000000;
                result = await gold.connect(wallet).claimed(id); // 1000000000000000000;
            } catch (error) {
                console.log(error);
            } finally {
                // console.log(`----  ${id}  claimed count ------ ${result} `);
            }
            
            if (adventurer._level.toNumber() > 1 && !result ) {
                // console.log(`connect claim gold: ${id}  `);
                 
                try{
                    result = getgold(gold.connect(wallet),id);
                    //result = await gold.connect(wallet).claim(id);
                }catch(e){
                    console.log(e);
                }finally{
                    // console.log(`finally1 ${result}`);
                }

                // console.log(`---- claim gold ${id}   `);
                if(index >= ( adventurersCount.toNumber() - 1 )){
                    console.log(`--------clear------total: ${formatValue(adventurersCount)} index: ${index}`);
                    index = 0;
        
                }else{
                    index++; 
                }
                console.log(`${index}/${adventurersCount.toNumber()}  ${className} (${id}): level: ${adventurer._level.toString()}, [+]gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)} (nb days to level up: ${nbAdventureToLevelUp.toString()}). Next leveling ${nextLeveling}`);
                return;              
            }else{
                // console.log(`----- summoner[${id}] Not claim Gold -----`);
            } 
            // console.log(`Adventurers Number: ${index} ${className} (${id}): level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)}  ${formatValue(levelxp)} ${formatValue(adventurer._xp.sub(levelxp))}`);  
            
            console.log(`${index}/${adventurersCount.toNumber()}  ${className} (${id}): level: ${adventurer._level.toString()}, gold: ${adventurerGold} xp: ${formatValue(adventurer._xp)} (nb days to level up: ${nbAdventureToLevelUp.toString()}). Next leveling ${nextLeveling}`);

            // console.log(`---- index: ${index} Tot: ${adventurersCount.toNumber()}`);
                if( index >= ( adventurersCount.toNumber() - 1 ) ){
                    // console.log(`--------clear------total: ${adventurersCount.toNumber()} index: ${index}`);
                    index = 0;
        
                }else{
                    index++;
                }
 
        

    }
}
export async function adventure(_summer: Rarity, summonerId: BigNumber, gas: BigNumber) {
    return new Promise(async (resolve, reject) => {
        const provider = new ethers.providers.JsonRpcProvider(`https://rpc.ftm.tools/`); 
        let gasPrice : any = null;
        try{ 
            gasPrice = await provider.getGasPrice();
        }catch(e){
            console.log(e);
        }finally{

        }
        gasPrice = gasPrice.mul(0.8);

        let nonce : any = null;

      _summer.adventure(summonerId, {
        gasLimit: 240000,
        gasPrice: gasPrice,
        nonce
      }).then(async (result) => {
        nonce++;
        console.log(`Summoner[${summonerId}] adventured`);
        resolve(true);
      }).catch(err => {
        console.log(err.reason);
        reject(err);
      });
  
    });
  
}

export async function getgold(_gold: RarityGold, summonerId: BigNumber) {
    return new Promise(async (resolve, reject) => {
        console.log(`-----getgold----`);
        const provider = new ethers.providers.JsonRpcProvider(`https://rpc.ftm.tools/`); 
        let gasPrice : any = 0;
        try{ 
            gasPrice =  await provider.getGasPrice(); 
        }catch(e){
            console.log(e);
        }finally{
            console.log(`${gasPrice}`);
        }
        
        gasPrice = BigNumber.from(gasPrice).mul(0.8);

        let nonce : any = null;

        _gold.claim(summonerId, {
        gasLimit: 240000,
        gasPrice: gasPrice,
        nonce
      }).then(async (result) => {
        nonce++;
        console.log(`Summoner[${summonerId}] gasPrice`);
        resolve(true);
      }).catch(err => {
        console.log(err.reason);
        reject(err);
      });
  
    });
  
}


export async function cangetgold(_gold: RarityGold, summonerId: BigNumber) {
    return new Promise(async (resolve, reject) => {
        console.log(`-----can getgold----`);
        const provider = new ethers.providers.JsonRpcProvider(`https://rpc.ftm.tools/`); 
        let gasPrice : any = 0;
        try{ 
            gasPrice =  await provider.getGasPrice(); 
        }catch(e){
            console.log(e);
        }finally{

        }
        
        //gasPrice = BigNumber.from(gasPrice).mul(0.8);

        let nonce : any = null;

        _gold.claimable(summonerId, {
        gasLimit: 240000,
        gasPrice: gasPrice,
        nonce
      }).then(async (result) => {
        nonce++;
        console.log(`Summoner[${summonerId}] can claim gold`);
        resolve(true);
      }).catch(err => {
        console.log(err.reason);
        reject(err);
      });
  
    });
  
}

export function formatValue(value: BigNumber) {
    return ethers.utils.formatUnits(value.toString(), 18);
}