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
            console.log("Final scraped game: ", tmp);
            scrapedGames[k++] = tmp;
            gameName = elem;
            console.log("Game name: ", gameName);
            prices = [];
            j = 0;
        }
        else {
            obj = {};
            let hostName = getHostName(elem);
            // console.log("hostname:", hostName);
            switch(hostName){
                case "jogonamesa.pt":
                    let returnedObj = await jogonamesa(elem);
                    // console.log("returnedObj:", returnedObj);
                    obj = isObjectEmpty(returnedObj) ? {} : {store: hostName, ...returnedObj};
                    break;

                case "kultgames.pt":
                    console.log("in kultgames");
                    break;
            }

            // obj = { store: string, price: (int?), stock: string }
            // console.log("obj: ", obj);
            if(!isObjectEmpty(obj)) prices[j++] =  obj;
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
    await preparePageForTests(page);
    let failed = false;
    await page.goto(url);
    let noInfo = false
    //price
    try {
        await page.waitForXPath('/html/body/div[1]/div[2]/div[1]/p[1]/b', {timeout: 500});
        noInfo = true;
    } catch (err) {
        //TODO
    }
    if(noInfo) return {};
    try{
        await page.waitForXPath("/html/body/div[1]/div[2]/div[1]/div[2]/a[1]", {timeout: 500});
    }
    catch(err){
        console.log(err);
        failed = true;
    }
    let handlerPrice = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div[1]/div[2]/a[1]");
    let price   = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);
    // console.log("price: ", price);
    price = stringFormat(price);
    failed = false;

    //stock
    let stock = null;
    while(stock === null){
       stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.entrega')?.textContent);
       if(stock != null) break;
       stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.esgotado')?.textContent);
       if(stock != null) break;
       stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.reserva')?.textContent);
       if(stock != null) break;
    }

    // let handlerStock = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div[1]/div[2]/div[3]/span[6]");
    // stock = failed ? '' : await page.evaluate(el => el.textContent, handlerStock[0]);
    stock = stringFormat(stock);
    // console.log("stock: ", stock);
    browser.close();
    return {price: price, stock: stock};
}

function getOldPrices(){
    return "TODO";
}

function stringFormat(str){
    return str.replace(/€| /, '').replace(' ', '');
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

async function preparePageForTests(page) {
    // Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
}

scrape();
