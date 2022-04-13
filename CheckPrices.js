const puppeteer = require('puppeteer');
const fs = require("fs");


class CheckPrices{
    constructor(){
        this.gamesInput = fs.readFileSync('./input.txt').toString().split("\n");
    }

    async scrape(){

        // {gameName: string, data: [{ store: string, price: (int?), availability: string }] }
        let browser = await puppeteer.launch();
        this.page = await browser.newPage();
        this.gamesToPrint = [];
        let gameName = "";
        let prices = [];
        let j = 0;
        for (let i = 0; i < this.gamesInput.length; i++) {
            let elem = this.gamesInput[i];
            if (this.isGame(elem)){

                gameName = elem;
                j = 0;
            }
            else {
                switch(elem){

                }

                urls[j++] =  elem;
            }
            if(i == 3)
            // console.log("elem: ", elem);
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
