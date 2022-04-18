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
            console.log("hostname:", hostName);
            switch(hostName){
                case "jogonamesa.pt": case "www.jogonamesa.pt":
                    // returnedObj = await jogonamesa(elem);
                    // console.log("returnedObj:", returnedObj);
                    break;

                case "kultgames.pt": case "www.kultgames.pt":
                    // returnedObj = await kultgames(elem);
                    break;

                case "gameplay.pt": case "www.gameplay.pt":
                    // returnedObj = await gameplay(elem);
                    break;

                case "juegosdelamesaredonda.com": case "www.juegosdelamesaredonda.com":
                // returnedObj = await juegosdelamesaredonda(elem);
                break;

                case "diver.pt": case "www.diver.pt":
                returnedObj = await diver(elem);
                break;
            }
            if(!hostName.includes("cultodacaixa.pt")){
                obj = isObjectEmpty(returnedObj) ? {} : {store: hostName, ...returnedObj};

                // obj = { store: string, price: (int?), stock: string }
                if(!isObjectEmpty(obj)) prices[j++] =  obj;
            }
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

function stringFormatPrice(str){
    return str.replace(/€/, '').replace(' ', '');
}

function stringFormatStock(str){
    return str.toLowerCase();
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

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);
    browser.close();
    return {price: price, stock: stock};
}

async function kultgames(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  '';
    price = await page.evaluate(() => document.querySelector('#our_price_display')?.textContent);

    //stock
    let stock = '';
    stock = await page.evaluate(() => document.querySelector('#availability_value')?.textContent);

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);
    return {price: price, stock: stock};
}

async function gameplay(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  '';
    price = await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(1) > div.col-md-3.text-right > div > div > div > div > span')?.textContent);

    //stock
    let stock = '';
    stock = await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.disponib_emstock > p:nth-child(1) > span')?.textContent);

    stock = (stock == undefined) ? await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.disponib_restock > p:nth-child(1) > span')?.textContent) : stock;

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock)
    return {price: price, stock: stock};
}

async function juegosdelamesaredonda(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  '';
    price = await page.evaluate(() => document.querySelector('#our_price_display')?.textContent);

    //stock
    let stock = '';
    stock = await page.evaluate(() => document.querySelector('#availability_value')?.textContent);

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock)
    return {price: price, stock: stock};
}

async function diver(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  '';
    price = await page.evaluate(() => document.querySelector('#our_price_display')?.textContent);

    //stock
    let stock = '';
    stock = await page.evaluate(() => document.querySelector('#availability_value')?.textContent);

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);
    console.log("price:", price);
    console.log("stock:", stock);
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
