const puppeteer = require('puppeteer');
const fs = require("fs");



//sitename = FRUKLITS

// TODO: versusgamecenter, devir is broken
// TODO: check bookmarks for stores to add

let input = fs.readFileSync('./input.txt').toString().split("\n");
let logger = [];

async function scrape(){
    let oldPrices = getOldPrices();

    let newPrices = [];
    newPrices[0] = {gameName: input[0], from: '', bestPrice: '5000', stock: '', price_jogonamesa: '', stock_jogonamesa: '', price_kultgames: '', stock_kultgames: '', price_gameplay: '', stock_gameplay: '', price_juegosdelamesaredonda: '', stock_juegosdelamesaredonda: '', price_diver: '', stock_diver: '', price_arenaporto: '', stock_arenaporto: '', price_dracotienda: '', stock_dracotienda: '', price_amazon: '', stock_amazon: '', price_planetongames: '', stock_planetongames: '', price_gglounge: '', stock_gglounge: '', price_versusgamecenter: '', stock_versusgamecenter: '', price_devir: '', stock_devir: '', price_ajogar: '', stock_ajogar: '', price_saltadacaixa: '', stock_saltadacaixa: '', price_jubilantsunday: '', stock_jubilantsunday: ''};

    let gameName;
    let k = 0;
    let returnedObj = {};
    //i is for input
    for (let i = 1; i < input.length; i++) {
        let elem = input[i];
        if (isGame(elem)){
            console.log("DEBUG Final Scraped game: ", newPrices[k]);
            gameName = elem;
            newPrices[++k] = {gameName: gameName, from: '', bestPrice: '5000', stock: '', price_jogonamesa: '', stock_jogonamesa: '', price_kultgames: '', stock_kultgames: '', price_gameplay: '', stock_gameplay: '', price_juegosdelamesaredonda: '', stock_juegosdelamesaredonda: '', price_diver: '', stock_diver: '', price_arenaporto: '', stock_arenaporto: '', price_dracotienda: '', stock_dracotienda: '', price_amazon: '', stock_amazon: '', price_planetongames: '', stock_planetongames: '', price_gglounge: '', stock_gglounge: '', price_versusgamecenter: '', stock_versusgamecenter: '', price_devir: '', stock_devir: '', price_ajogar: '', stock_ajogar: '', price_saltadacaixa: '', stock_saltadacaixa: '', price_jubilantsunday: '', stock_jubilantsunday: ''};
        }
        else {
            returnedObj = {};
            let hostName = getHostName(elem);
            // console.log("hostname:", hostName);
            switch(hostName){
                case "jogonamesa.pt": case "www.jogonamesa.pt":
                    returnedObj = await jogonamesa(elem);
                    newPrices[k].price_jogonamesa = returnedObj.price;
                    newPrices[k].stock_jogonamesa = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'jogonamesa', gameName);
                    break;

                case "kultgames.pt": case "www.kultgames.pt":
                    returnedObj = await kultgames(elem);
                    newPrices[k].price_kultgames = returnedObj.price;
                    newPrices[k].stock_kultgames = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'kultgames', gameName);
                    break;

                case "gameplay.pt": case "www.gameplay.pt":
                    returnedObj = await gameplay(elem);
                    newPrices[k].price_gameplay = returnedObj.price;
                    newPrices[k].stock_gameplay = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'gameplay', gameName);
                    break;

                case "juegosdelamesaredonda.com": case "www.juegosdelamesaredonda.com":
                    returnedObj = await juegosdelamesaredonda(elem);
                    newPrices[k].price_juegosdelamesaredonda = returnedObj.price;
                    newPrices[k].stock_juegosdelamesaredonda = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'juegosdelamesaredonda', gameName);
                    break;

                case "diver.pt": case "www.diver.pt":
                    returnedObj = await diver(elem);
                    newPrices[k].price_diver = returnedObj.price;
                    newPrices[k].stock_diver = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'diver', gameName);
                    break;

                case "arenaporto.com": case "www.arenaporto.com":
                    returnedObj = await arenaporto(elem);
                    newPrices[k].price_arenaporto= returnedObj.price;
                    newPrices[k].stock_arenaporto = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'arenaporto', gameName);
                    break;

                case "dracotienda.com": case "www.dracotienda.com":
                    returnedObj = await dracotienda(elem);
                    newPrices[k].price_dracotienda = returnedObj.price;
                    newPrices[k].stock_dracotienda = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'dracotienda', gameName);
                    break;

                case "amazon.es": case "www.amazon.es":
                    returnedObj = await amazon(elem);
                    newPrices[k].price_amazon = returnedObj.price;
                    newPrices[k].stock_amazon = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'amazon', gameName);
                    break;

                case "planetongames.com": case "www.planetongames.com":
                    returnedObj = await planetongames(elem);
                    newPrices[k].price_planetongames = returnedObj.price;
                    newPrices[k].stock_planetongames = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'planetongames', gameName);
                    break;

                case "gglounge.pt": case "www.gglounge.pt":
                    returnedObj = await gglounge(elem);
                    newPrices[k].price_gglounge = returnedObj.price;
                    newPrices[k].stock_gglounge = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'gglounge', gameName);
                    break;

                case "versusgamecenter.pt": case "www.versusgamecenter.pt":
                    returnedObj = await versusgamecenter(elem);
                    newPrices[k].price_versusgamecenter = returnedObj.price;
                    newPrices[k].stock_versusgamecenter = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'versusgamecenter', gameName);
                    break;

                case "devir.pt": case "www.devir.pt":
                    returnedObj = await devir(elem);
                    newPrices[k].price_devir = returnedObj.price;
                    newPrices[k].stock_devir = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'devir', gameName);
                    break;

                // TODO
                case "ajogar.com": case "www.ajogar.com":
                    returnedObj = await ajogar(elem);
                    newPrices[k].price_ajogar = returnedObj.price;
                    newPrices[k].stock_ajogar = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'ajogar', gameName);
                break;

                case "saltadacaixa.pt": case "www.saltadacaixa.pt":
                    returnedObj = await saltadacaixa(elem);
                    newPrices[k].price_saltadacaixa = returnedObj.price;
                    newPrices[k].stock_saltadacaixa = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'saltadacaixa', gameName);
                    break;

                case "jubilantsunday.com": case "www.jubilantsunday.com":
                    returnedObj = await jubilantsunday(elem);
                    newPrices[k].price_jubilantsunday = returnedObj.price;
                    newPrices[k].stock_jubilantsunday = returnedObj.stock;
                    checkOldPrice(newPrices, oldPrices, 'jubilantsunday', gameName);
                break;
            }
            // console.log(hostName + ': ' + JSON.stringify(returnedObj));
            newPrices[k] = evaluateBestPrice(newPrices[k], {hostName, ...returnedObj})
        }
    }
    let result = convertToCSV(newPrices);
    writeScrapped(result);
    console.log("logger: ", logger);
    writeLogger(logger);
    console.log("Closing browser.");
}

function evaluateBestPrice(scraped, elem){
    //TODO implement logic
    let currBest = parseInt(stringFormatPrice(scraped.bestPrice));
    let contender = parseInt(stringFormatPrice(elem.price));
    if(contender < currBest){
        scraped.bestPrice = elem.price;
        scraped.from = elem.hostName;
        scraped.stock = elem.stock;
    }
    return scraped;
}

function convertToCSV(arr) {

    let csv = '';
    let header = Object.keys(arr[0]).join(',');
    let values = arr.map(o => Object.values(o).join(',')).join('\n');
    console.log("header: ", header);
    console.log("values: ", values);
    csv += header + '\n' + values;
    return csv;
  }

function fromCSV(bufferString){
    let arr = bufferString.split('\n');

    let jsonObj = [];
    let headers = arr[0].split(',');
    for(let i = 1; i < arr.length; i++) {
        let data = arr[i].split(',');
        let obj = {};
    for(let j = 0; j < data.length; j++) {
        obj[headers[j].trim()] = data[j].trim();
    }
    jsonObj.push(obj);
    }

    console.log("DEBUG: fromCSV() ");
    return jsonObj;
}

function getOldPrices(){
    let input = "";
    try {
        input = fs.readFileSync('./BoadgamePrices.csv').toString();
        writeOld(input);
        input = fromCSV(input);
    } catch (error) {
        console.log(error);
    }
    console.log("DEBUG: getOldPrices() ");
    return input;
}

function writeScrapped(result){
    let date = new Date(Date.now());
    date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}--${date.getHours()}-${date.getMinutes()}`
    fs.writeFile(`BoadgamePrices.csv`, result, (err) => {
        // throws an error, you could also catch it here
        if (err) console.log(err);

        // success case, the file was saved
        console.log('CSV saved!');
    });
}

function writeOld(old){
    fs.writeFile('BoadgamePricesOld.csv', old, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('Old CSV saved!');
    });
}

function writeLogger(logger){
    let date = new Date(Date.now());
    date = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}--${date.getHours()}-${date.getMinutes()}`
    // Agricola EN has a new best: 49.45 from juegosdelamesaredonda.com was 500.0 from juegosdelamesaredonda.com.
    // logger = logger.map(obj => `${obj.gameName} has new best: ${obj.bestPrice} from ${obj.from} was `)
    fs.writeFile(`BGPrices--${date}.log`,JSON.stringify(logger, undefined, 2), (err) => {
        // throws an error, you could also catch it here
        if (err) console.log(err);

        // success case, the file was saved
        console.log('Logger saved!');
    });
}

function checkOldPrice(newS, oldS, host, gameName){
    let i = getIndex(oldS, gameName);
    if(i == -1 || oldS[i][`price_${host}`] == '' || oldS[i][`stock_${host}`] == '') return ;
    if(newS[i][`price_${host}`] != oldS[i][`price_${host}`] || newS[i][`stock_${host}`] != oldS[i][`stock_${host}`]){
        let result = {game: gameName, from: host, newPrice: newS[i][`price_${host}`], newStock: newS[i][`stock_${host}`], oldPrice: oldS[i][`price_${host}`], oldStock: oldS[i][`stock_${host}`]};
        console.log("DEBUG adding to logger", result);
        logger.push(result);
    }
}

function getIndex(oldS, gameName){
    for (const key in oldS) {
        if(oldS[key].gameName == gameName){
            return key;
        }
    }
    return -1;
}

// ----------- HELPERS ---------------

function getHostName(elem){
    return new URL(elem).hostname;
}

function isGame(elem){
    return !elem.includes("http");
}

function stringFormatPrice(str){
    return str == undefined ? '' : str.replace(/€/, '').replace(',', '.').replace(/\s/g, '').replace(' ', '');
}

function stringFormatStock(str){
    return str == undefined ? '' : str.toLowerCase().replace(/\t/g, '').replace(/\n/g, '').replace(/[^\w\s]/gi, '');
}

function formatterBeforeFormatter(str){
    return str == undefined ? '' : str.replace('Disponibilidad', '');
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// ----------- END HELPERS -----------

// ------------ SITE SCRAPERS---------
async function jogonamesa(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    if(noInfo) return {price: '', stock: ''};;

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
    let stock = undefined;

    stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.entrega')?.textContent);
    if(stock == undefined) stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.esgotado')?.textContent);
    if(stock == undefined) stock =  await page.evaluate(() => document.querySelector('#comprar_visivel > span.reserva')?.textContent);

    if(stock == null) console.log("Couldn't get jogonamesa stock");

    price = (price == undefined ) ? '' : stringFormatPrice(price);
    stock = (stock == undefined ) ? '' : stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function kultgames(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span > span.a-offscreen')?.innerText);
    price = (price == undefined) ? await page.evaluate(() => document.querySelector('#corePrice_desktop > div > table > tbody > tr:nth-child(2) > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span:nth-child(2)')?.innerText) : price;
    price = (price == undefined) ? await page.evaluate(() => document.querySelector('#price')?.innerText) : price;
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    await browser.close();
    return {price: price, stock: stock};
}

async function gglounge(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
    await page.goto(url);
    let failed = false;

    //price with discount
    try{
        await page.waitForXPath("/html/body/div[1]/div[4]/div/div/article/div[2]/div[2]/p[1]/ins/span/bdi/text()", {timeout: 500});
    }
    catch(err){
        console.log("Couldn't get gglounge price with discount:");
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
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
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
    await page.goto(url);
    let failed = false;

    //price with discount
    try{
        await page.waitForXPath("/html/body/div[4]/main/div[2]/div/div[1]/div[2]/div/span[2]/span/span[2]/span", {timeout: 500});
    }
    catch(err){
        console.log("Couldn't get devir price with discount:");
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

async function saltadacaixa(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
    await page.goto(url);
    let failed = false;

    //price with discount
    try{
        await page.waitForXPath("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[1]/div/div/div/div/p/ins/span", {timeout: 500});
    }
    catch(err){
        console.log("Couldn't get saltadacaixa price with discount:");
        failed = true;
    }
    let handlerPrice = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[1]/div/div/div/div/p/ins/span");
    let price        = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);

    //price
    if(failed){
        failed = false;
        try{
            await page.waitForXPath("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[1]/div/div/div/div/p/span/bdi", {timeout: 500});
        }
        catch(err){
            console.log("Couldn't get saltadacaixa price:");
            console.log(err);
            failed = true;
        }
        handlerPrice = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[1]/div/div/div/div/p/span/bdi");
        price        = failed ? '' : await page.evaluate(el => el.textContent, handlerPrice[0]);
    }

    //stock out of stock
    failed = false;
    try{
        await page.waitForXPath("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[3]/div/div/div/div/p", {timeout: 500});
    }
    catch(err){
        console.log("Couldn't get saltadacaixa out of stock:");
        console.log(err);
        failed = true;
    }
    let handlerStock = failed ? '' : await page.$x("//html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[3]/div/div/div/div/p");
    let stock        = failed ? '' : await page.evaluate(el => el.textContent, handlerStock[0]);

    //stock in stock
    if(failed){
        failed = false;
        try{
            await page.waitForXPath("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[3]/div/div/div/div/p/span[2]", {timeout: 500});
        }
        catch(err){
            console.log("Couldn't get saltadacaixa in stock:");
            console.log(err);
            failed = true;
        }
        handlerStock = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[3]/div/div/div/div/p/span[2]");
        stock        = failed ? '' : await page.evaluate(el => el.textContent, handlerStock[0]);
    }

    //stock backorder
    if(failed){
        failed = false;
        try{
            await page.waitForXPath("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[3]/div/div/div/div/p", {timeout: 500});
        }
        catch(err){
            console.log("Couldn't get saltadacaixa backorder:");
            console.log(err);
            failed = true;
        }
        handlerStock = failed ? '' : await page.$x("/html/body/div[1]/div[2]/div/div[2]/div/section[1]/div/div/div[1]/div/div/section[2]/div/div/div[3]/div/div/div/div/p");
        stock        = failed ? '' : await page.evaluate(el => el.textContent, handlerStock[0]);
    }
    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function jubilantsunday(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#main > div.row.product-container > div:nth-child(2) > div.product-prices > div.product-price.h5 > div > span')?.innerText);
    if(price == undefined) console.log("Couldn't get jubilantsunday price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#product-availability')?.innerText);
    if(stock == undefined) console.log("Couldn't get jubilantsunday stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

async function ajogar(url){
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await preparePageForScrape(page);
    await page.goto(url);

    // price
    let price =  undefined;
    price = await page.evaluate(() => document.querySelector('#TPAMultiSection_k8rkawtz > div > div > article > div._12vNY > section:nth-child(2) > div._3bNb3.fggS-.cell > div > div > div > span:nth-child(1)')?.innerText);
    if(price == undefined) console.log("Couldn't get ajogar price");

    //stock
    let stock = undefined;
    stock = await page.evaluate(() => document.querySelector('#TPAMultiSection_k8rkawtz > div > div > article > div._12vNY > section:nth-child(2) > div:nth-child(6) > div._3j0qu._2cVBV.fggS-.cell > button > span')?.innerText);
    if(stock == undefined) console.log("Couldn't get ajogar stock");

    price = stringFormatPrice(price);
    stock = stringFormatStock(stock);

    await browser.close();
    return {price: price, stock: stock};
}

// ------------ END SITE SCRAPERS-----

async function preparePageForScrape(page) {
    // Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
}

scrape();
