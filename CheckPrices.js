const puppeteer = require('puppeteer');
const fs = require("fs");


class CheckPrices{
    constructor(){
        this.gamesInput = fs.readFileSync('./input.txt').toString().split("\n");
    }

    async scrape(){
        let browser = await puppeteer.launch();
        this.page = await browser.newPage();
        this.gamesToPrint = [];
        let obj = {};
        for (let i = 0; i < this.gamesInput.length; i++) {
            let elem = this.gamesInput[i];
            if (this.isGame(elem)){

                obj = {name: elem}
            }
            else {

            }
            console.log("elem: ", elem);
            if(i == 7) break;
        }

        console.log("Closing browser.");
        browser.close();
    }

    isGame(elem){
        return true;
    }

    jogonamesa(){
    }


}



let price = new CheckPrices();
price.scrape();
// console.log(price.testURl);
// price.getData();
