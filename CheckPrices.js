const cheerio = require('cheerio');
const fetch = require("node-fetch");

class CheckPrices{
    constructor(){
        this.testURl = 'https://jogonamesa.pt/P/search.cgi?search=champions+of+midgard';
        this.testURl = 'https://arenaporto.com/pesquisa?controller=search&s=roll+for+the+galaxy';

        // let htmlparser2 = require('htmlparser2');
        // let dom = htmlparser2.parseDocument(document, options);
    }

    async getData(){
        // const response = fetch(url);
        // let text = await response.text();
        // console.log(text);

        let response = await fetch(this.testURl);
        let html = await response.text();
        console.log(html);
    }
}

let price = new CheckPrices();
// console.log(price.testURl);
price.getData();
