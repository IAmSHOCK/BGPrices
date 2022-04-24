const puppeteer = require('puppeteer');
const fs = require("fs");

//sitename = FRUKLITS

let input = fs.readFileSync('./input.txt').toString().split("\n");


async function scrape(){
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
                    returnedObj = await jogonamesa(elem);
                    break;

                case "kultgames.pt": case "www.kultgames.pt":
                    returnedObj = await kultgames(elem);
                    break;

                case "gameplay.pt": case "www.gameplay.pt":
                    returnedObj = await gameplay(elem);
                    break;

                case "juegosdelamesaredonda.com": case "www.juegosdelamesaredonda.com":
                    returnedObj = await juegosdelamesaredonda(elem);
                    break;

                case "diver.pt": case "www.diver.pt":
                    returnedObj = await diver(elem);
                    break;

                case "arenaporto.com": case "www.arenaporto.com":
                    returnedObj = await arenaporto(elem);
                    break;

                case "dracotienda.com": case "www.dracotienda.com":
                    returnedObj = await dracotienda(elem);
                    break;

                case "amazon.es": case "www.amazon.es":
                    returnedObj = await amazon(elem);
                    break;

                case "planetongames.com": case "www.planetongames.com":
                    returnedObj = await planetongames(elem);
                    break;

                case "gglounge.pt": case "www.gglounge.pt":
                    returnedObj = await gglounge(elem);
                    break;

                case "versusgamecenter.pt": case "www.versusgamecenter.pt":
                    returnedObj = await versusgamecenter(elem);
                    break;

                case "devir.pt": case "www.devir.pt":
                    returnedObj = await devir(elem);
                    break;
            }
            if(!hostName.includes("cultodacaixa.pt")){
                obj = isObjectEmpty(returnedObj) ? {} : {store: hostName, ...returnedObj};

                if(!isObjectEmpty(obj)) prices[j++] =  obj;
            }
        }
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
    return str?.replace(/€/, '').replace(',', '.').replace(/[^\w\s\.]/gi, '').replace(' ', '');
}

function stringFormatStock(str){
    return str?.toLowerCase().replace(/[^\w\s]/gi, '');
}

function formatterBeforeFormatter(str){
    return str?.replace('Disponibilidad', '');
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
        // console.log("Couldn't get jogonamesa no info:");
        // console.log(err);
    }
    if(noInfo) return {};

    //price
    try{
        await page.waitForXPath("/html/body/div[1]/div[2]/div[1]/div[2]/a[1]", {timeout: 500});
    }
    catch(err){
        console.log("Couldn't get jogonamesa price");
        console.log(err);
        failed = true;
    }
    let handlerPrice = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div[1]/div[2]/a[1]");
    let price   = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);

    failed = false;

    //stock
    let stock = null;

    stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.entrega')?.textContent);
    if(stock == null) stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.esgotado')?.textContent);
    if(stock == null) stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.reserva')?.textContent);

    if(stock == null) console.log("Couldn't get jogonamesa stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function kultgames(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price = undefined;
    price = await page.evaluate(() => document.querySelector('#our_price_display')?.textContent);
    if(price == undefined) console.log("Couldn't get kultgames price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#availability_value')?.textContent);
    if(stock == undefined) console.log("Couldn't get kultgames stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function gameplay(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(1) > div.col-md-3.text-right > div > div > div > div > span')?.textContent);
    if(price == undefined) console.log("Couldn't get gameplay price");
    //stock
    let stock = undefined ;
    stock = await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.disponib_emstock > p:nth-child(1) > span')?.textContent);

    stock = (stock == undefined) ? await page.evaluate(() => document.querySelector('#main > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.disponib_restock > p:nth-child(1) > span')?.textContent) : stock;
    if(stock == undefined) console.log("Couldn't get gameplay stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock)

    await browser.close();
    return {price: price, stock: stock};
}

async function juegosdelamesaredonda(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#our_price_display')?.textContent);
    if(price == undefined) console.log("Couldn't get juegosdelamesaredonda price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#availability_value')?.textContent);
    if(stock == undefined) console.log("Couldn't get juegosdelamesaredonda stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock)

    await browser.close();
    return {price: price, stock: stock};
}

async function diver(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#our_price_display')?.textContent);
    if(price == undefined) console.log("Couldn't get diver price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#availability_value')?.textContent);
    if(stock == undefined) console.log("Couldn't get diver stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function arenaporto(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#product-buy-box > div.product-prices > div.product-price.h5.has-discount > div > span:nth-child(1)')?.textContent);

    price = (price == undefined) ? await page.evaluate(() => document.querySelector('#product-buy-box > div.product-prices > div.product-price.h5 > div > span:nth-child(1)')?.textContent) : price;
    if(price == undefined) console.log("Couldn't get arenaporto price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#product-availability')?.innerText);

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);
    if(stock == undefined) console.log("Couldn't get arenaporto stock");

    await browser.close();
    return {price: price, stock: stock};
}

async function dracotienda(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#main > div.laberProduct > div > div:nth-child(2) > div.product-prices > div.product-price.h5.has-discount > div > span:nth-child(2)')?.textContent);

    price = (price == undefined) ? await page.evaluate(() => document.querySelector('#main > div.laberProduct > div > div:nth-child(2) > div.product-prices > div.product-price.h5 > div > span')?.textContent) : price;
    if(price == undefined) console.log("Couldn't get dracotienda price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#main > div.laberProduct > div > div:nth-child(2) > div.LaberProduct-availability > span')?.innerText);
    if(price == undefined) console.log("Couldn't get dracotienda stock");

    stock = formatterBeforeFormatter(stock);

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function amazon(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span > span.a-offscreen')?.innerText);
    price = (price == undefined) ? await page.evaluate(() => document.querySelector('#corePrice_desktop > div > table > tbody > tr:nth-child(2) > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)')?.innerText) : price;
    if(price == undefined) console.log("Couldn't get amazon price");


    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#availability > span')?.innerText);
    stock = (price == undefined) ? await page.evaluate(() => document.querySelector('#availability > span:nth-child(4) > span')?.innerText) : stock;
    if(stock == undefined) console.log("Couldn't get amazon stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function planetongames(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#main > div.row.container_product > div.col-md-3.last_column > div.product-prices > div.product-price.h5.has-discount > div > span:nth-child(1)')?.innerText);

    price = (price == undefined) ? await page.evaluate(() => document.querySelector('#main > div.row.container_product > div.col-md-3.last_column > div.product-prices > div > div > span')?.textContent) : price;
    if(price == undefined) console.log("Couldn't get planetongames price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#availability_value')?.innerText);
    if(stock == undefined) console.log("Couldn't get planetongames stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);
    return {price: price, stock: stock};
}

async function gglounge(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);
    let failed = false;

    //price discount
    try{
        await page.waitForXPath("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[1]/ins/span/bdi/text()", {timeout: 500});
    }
    catch(err){
        console.log("Couldn't get gglounge price with discount:");
        console.log(err);
        failed = true;
    }
    let handlerPrice = failed ? '' : await page.$x("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[1]/ins/span/bdi/text()");
    let price        = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);

    //price
    if(failed){
        failed = false;
        try{
            await page.waitForXPath("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[1]/span/bdi/text()", {timeout: 500});
        }
        catch(err){
            console.log("Couldn't get gglounge price:");
            console.log(err);
            failed = true;
        }
        handlerPrice = failed ? '' : await page.$x("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[1]/span/bdi/text()");
        price        = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);
    }

    //stock out of stock
    failed = false;
    try{
        await page.waitForXPath("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[2]", {timeout: 500});
    }
    catch(err){
        console.log("Couldn't get gglounge out of stock:");
        console.log(err);
        failed = true;
    }
    let handlerStock = failed ? '' : await page.$x("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[2]");
    let stock        = failed ? '' : await page.evaluate(el => el.textContent, handlerStock[0]);

    //stock in stock
    if(failed){
        failed = false;
        try{
            await page.waitForXPath("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[2]", {timeout: 500});
        }
        catch(err){
            console.log("Couldn't get gglounge in stock:");
            console.log(err);
            failed = true;
        }
        handlerStock = failed ? '' : await page.$x("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[2]");
        stock        = failed ? '' : await page.evaluate(el => el.textContent, handlerStock[0]);
    }

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function versusgamecenter(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('body > main > div > div > div > div > div.product-details-inner > div > div.col-md-7 > div > div.pricebox > span')?.innerText);
    if(price == undefined) console.log("Couldn't get versusgamecenter price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('body > main > div > div > div > div > div.product-details-inner > div > div.col-md-7 > div > div.availability.mb-20 > span')?.innerText);
    if(stock == undefined) console.log("Couldn't get versusgamecenter stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function devir(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(url);
    let failed = false;

    //price discount
    try{
        await page.waitForXPath("/html/body/div[4]/main/div[2]/div/div[1]/div[2]/div/span[2]/span/span[2]/span", {timeout: 500});
    }
    catch(err){
        console.log("Couldn't get devir price discount:");
        console.log(err);
        failed = true;
    }
    let handlerPrice = failed ? '' : await page.$x("/html/body/div[4]/main/div[2]/div/div[1]/div[2]/div/span[2]/span/span[2]/span");
    let price        = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);

    //price
    if(failed){
        failed = false;
        try{
            await page.waitForXPath("/html/body/div[4]/main/div[2]/div/div[1]/div[2]/div/span/span/span", {timeout: 500});
        }
        catch(err){
        console.log("Couldn't get devir price:");
            console.log(err);
            failed = true;
        }
        handlerPrice = failed ? '' : await page.$x("/html/body/div[4]/main/div[2]/div/div[1]/div[2]/div/span/span/span");
        price        = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);
    }

    let stock = "available"

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
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
