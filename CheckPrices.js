const puppeteer = require('puppeteer');
const fs = require("fs");


class CheckPrices{
    constructor(){
    }

    async init(){
        this.gamesInput = fs.readFileSync('./input.txt').toString().split(' ').join('+').split("\n");
        this.gamesToPrint = [];
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
    }

    jogonamesa($){
    }
}



let price = new CheckPrices();
price.init();
// console.log(price.testURl);
// price.getData();
