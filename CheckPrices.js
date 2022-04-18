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
    let returnedObj = {};
    //i is for input, j is for stores of a given game and k is for scrapedGames
    for (let i = 1; i < input.length; i++) {
        let elem = input[i];
        if (isGame(elem)){
            let tmp = {gameName: gameName, data: prices};
            scrapedGames[k++] = tmp;
            console.log("Final scraped game: ", tmp);
            gameName = elem;
            console.log("Game name: ", gameName);
            prices = [];
            j = 0;
        }
        else {
            obj = {};
            returnedObj = {};
            let hostName = getHostName(elem);
            // console.log("hostname:", hostName);
            switch(hostName){
                case "jogonamesa.pt": case "www.jogonamesa.pt":
                    returnedObj = await jogonamesa(elem);
                    // console.log("returnedObj:", returnedObj);
                    break;

                case "kultgames.pt": case "www.kultgames.pt":
                    returnedObj = await kultgames(elem);
                    break;

                case "gameplay.pt": case "www.gameplay.pt":
                    returnedObj = await gameplay(elem);
                    break;
            }
            obj = isObjectEmpty(returnedObj) ? {} : {store: hostName, ...returnedObj};

            // obj = { store: string, price: (int?), stock: string }
            // console.log("obj: ", obj);
            if(!isObjectEmpty(obj)) prices[j++] =  obj;
        }
        // if(i == 7) break;
    }

    console.log("Closing browser.");
}

// ----------- HELPERS ---------------

function getHostName(elem){
    return new URL(elem).hostname;
}

function isGame(elem){
    return !elem.includes("http");
}

function stringFormat(str){
    return str.replace(/€/, '').replace(' ', '').toLowerCase();
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// ----------- END HELPERS -----------

// ------------ SITE SCRAPERS---------
async function jogonamesa(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    let failed = false;
    await page.goto(url);
    let noInfo = false

    //no info
    try {
        await page.waitForXPath('/html/body/div[1]/div[2]/div[1]/p[1]/b', {timeout: 500});
        noInfo = true;
    } catch (err) {
        //TODO
    }
    if(noInfo) return {};

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
    // console.log("price: ", price);
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

async function kultgames(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    let failed = false;
    await page.goto(url);

    // price
    let price =  '';
    price = await page.evaluate(() => document.querySelector('#our_price_display')?.textContent);

    //stock
    let stock = '';
    stock = await page.evaluate(() => document.querySelector('#availability_value')?.textContent);

    price = stringFormat(price);
    // console.log("price: ", price);
    return {price: price, stock: stock};
}

async function gameplay(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    let failed = false;
    await page.goto(url);

    // price
    let price =  '';
    price = await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(1) > div.col-md-3.text-right > div > div > div > div > span')?.textContent);

    //stock
    let stock = '';
    stock = await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.disponib_emstock > p:nth-child(1) > span')?.textContent);

    stock = (stock == undefined) ? await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.disponib_restock > p:nth-child(1) > span')?.textContent) : stock;

    price = stringFormat(price);
    stock = stringFormat(stock)
    return {price: price, stock: stock};
}


// ------------ END SITE SCRAPERS-----

function getOldPrices(){
    return "TODO";
}



async function preparePageForTests(page) {
    // Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
}

scrape();
