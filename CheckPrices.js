const puppeteer = require('puppeteer');
const fs = require("fs");

//sitename = FRUKLITS

class CheckPrices{
    constructor(){
        this.gamesInput = fs.readFileSync('./input.txt').toString().split("\n");
    }

    scrape(){
        // {gameName: string, data: [{ store: string, price: (int?), availability: string }] }
        this.scrapedGames = [];

        let gameName = this.gamesInput[0];
        let price = 0;
        let stock = "";

        let prices = [];
        let j = 0;
        let k = 0;
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
                let obj = {};
                let hostName = this.getHostName(elem);
                console.log("hostname: ", hostName);
                switch(elem){
                    case "jogonames.pt":
                        this.jogonamesa(elem);
                }

                // obj = { store: string, price: (int?), availability: string }
                console.log("obj: ", obj);
                prices[j++] =  obj;
            }
            if(i == 7) break;
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

        browser.close();
    }

    getOldPrices(){
        return "TODO";
    }
}



let price = new CheckPrices();
price.scrape();
// console.log(price.testURl);
// price.getData();
