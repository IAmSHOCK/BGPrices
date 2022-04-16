const puppeteer = require('puppeteer');
const fs = require("fs");

//sitename = FRUKLITS

let input = fs.readFileSync('./input.txt').toString().split("\n");

async function scrape(){
    // {gameName: string, data: [{ store: string, price: (int?), availability: string }] }
    let scrapedGames = [];

    let gameName = input[0];
    let price = 0;
    let stock = "";

    let prices = [];
    let j = 0;
    let k = 0;
    let obj = {};
    //i is for input, j is for stores of a given game and k is for scrapedGames
    for (let i = 1; i < input.length; i++) {
        let elem = input[i];
        if (isGame(elem)){
            let tmp = {gameName: gameName, data: prices};
            // console.log("Final scraped game: ", tmp);
            scrapedGames[k++] = tmp;
            gameName = elem;
            console.log("Game name: ", gameName);
            prices = [];
            j = 0;
        }
        else {
            let hostName = getHostName(elem);
            // console.log("hostname:", hostName);
            switch(hostName){
                case "jogonamesa.pt":
                    await jogonamesa(elem);
                    // obj = {store: hostName, ...this.jogonamesa(elem)};
                    break;
            }

            // obj = { store: string, price: (int?), stock: string }
            // console.log("obj: ", obj);
            prices[j++] =  obj;
        }
        // if(i == 7) break;
    }

    console.log("Closing browser.");
}

function getHostName(elem){
    return new URL(elem).hostname;
}

function isGame(elem){
    return !elem.includes("http");
}

async function jogonamesa(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    let failed = false;
    await page.goto(url);

    //price
    try{
        await page.waitForXPath("/html/body/div[1]/div[2]/div[1]/div[2]/a[1]", {timeout: 500});
    }
    catch(err){
        console.log(err);
        failed = true;
    }
    let handlerPrice = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div[1]/div[2]/a[1]");
    let price   = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);
    price = stringFormat(price);
    failed = false;

    //stock cant use xpath cause div number depends on amount of publishers
    let stock;
    try{
       stock =  await page.evaluate(() => document.querySelector('.entrega'));
    }
    catch(err){
        console.log(err);
        failed = true;
    }
    if(stock == null){
        try{
            console.log("In 2nd try.");
            stock = await page.evaluate(() => document.querySelector('.esgotado'));
        }
        catch(err){
            console.log(err);
            failed = true;
        }
    }
    // let handlerStock = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div[1]/div[2]/div[3]/span[6]");
    // stock = failed ? '' : await page.evaluate(el => el.textContent, handlerStock[0]);
    console.log("stock: ", stock);
    // console.log("stock.innerText: ", stock.innerText);
    // stock = failed ? '' : stock.innerText;
    // console.log(`price: ${price} \nstock: ${stock}`);
    browser.close();
    // return {price: price, stock: stock};
    return {price: price, stock: stock};
}

function getOldPrices(){
    return "TODO";
}

function stringFormat(str){
    return str.replace(/€| /, '').replace(' ', '');
}

scrape();
// console.log(price.testURl);
// price.getData();
