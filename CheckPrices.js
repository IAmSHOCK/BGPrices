const cheerio = require('cheerio');
const fetch = require("node-fetch");

class CheckPrices{
    constructor(){
        this.testURl = 'https://jogonamesa.pt/P/search.cgi?search=champions+of+midgard';
        // this.testURl = 'https://arenaporto.com/pesquisa?controller=search&s=roll+for+the+galaxy';

    }

    async scrape(url){
        // const response = fetch(url);
        // let text = await response.text();
        // console.log(text);

        let response = await fetch(url);
        return await response.text();
    }

    async getData(){
        let html = await this.scrape(this.testURl);
        let $ = cheerio.load(html);
        let listItems = $(".lista_items");

        listItems.each(function (idx, el) {
            console.log($(el).text());
          });
    }
}

let price = new CheckPrices();
// console.log(price.testURl);
price.getData();
