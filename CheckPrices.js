const puppeteer = require('puppeteer');
const fs = require("fs");

//sitename = FRUKLITS

class CheckPrices{
    constructor(){
        this.gamesInput = fs.readFileSync('./input.txt').toString().split("\n");
    }

    async scrape(){
        // {gameName: string, data: [{ store: string, price: (int?), availability: string }] }
        this.scrapedGames = [];

        let gameName = this.gamesInput[0];
        let price = 0;
        let stock = "";

        let prices = [];
        let j = 0;
        let k = 0;
        let obj = {};
        //i is for input, j is for stores of a given game and k is for scrapedGames
        for (let i = 1; i < this.gamesInput.length; i++) {
            let elem = this.gamesInput[i];
            if (this.isGame(elem)){
                let tmp = {gameName: gameName, data: prices};
                console.log("Final scraped game: ", tmp);
                this.scrapedGames[k++] = tmp;
                gameName = elem;
                console.log("Game name: ", gameName);
                prices = [];
                j = 0;
            }
            else {
                let hostName = this.getHostName(elem);
                console.log("hostname:", hostName);
                switch(hostName){
                    case "jogonamesa.pt":
                        await this.jogonamesa(elem);
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

    getHostName(elem){
        return new URL(elem).hostname;
    }

    isGame(elem){
        return !elem.includes("http");
    }

    async jogonamesa(url){
        let browser = await puppeteer.launch();
        this.page = await browser.newPage();
        let failed = false;
        await this.page.goto(url);

        //price
        try{
            await this.page.waitForXPath("/html/body/div[1]/div[2]/div[1]/div[2]/a[1]", {timeout: 500});
        }
        catch(err){
            console.log(err);
            failed = true;
        }
        let handlerPrice = failed ? '' : await this.page.$x("/html/body/div[1]/div[2]/div[1]/div[2]/a[1]");
        let price   = failed ? '' : await this.page.evaluate(el => el.textContent, handlerPrice[0]);
        price = this.stringFormat(price);
        failed = false;

        //stock cant use xpath cause div number depends on amount of publishers
        try{
            await this.page.waitForXPath("/html/body/div[1]/div[2]/div[1]/div[2]/div[3]/span[6]", {timeout: 500});
        }
        catch(err){
            console.log(err);
            failed = true;
        }
        let handlerStock = failed ? '' : await this.page.$x("/html/body/div[1]/div[2]/div[1]/div[2]/div[3]/span[6]");
        let stock = failed ? '' : await this.page.evaluate(el => el.textContent, handlerStock[0]);
        console.log(`price: ${price} \nstock: ${stock}`);
        browser.close();
        // return {price: price, stock: stock};
        return {price: price};
    }

    getOldPrices(){
        return "TODO";
    }

    stringFormat(str){
        return str.replace(/€| /, '').replace(' ', '');
    }

}



let price = new CheckPrices();
price.scrape();
// console.log(price.testURl);
// price.getData();
