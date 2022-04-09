const cheerio = require('cheerio');
const fetch = require("node-fetch");

class CheckPrices{
    constructor(){
        let testURl = "https://jogonamesa.pt/P/ficha.cgi?bgg_id=172287";
        // let htmlparser2 = require('htmlparser2');
        // let dom = htmlparser2.parseDocument(document, options);
    }

    async getData(){
        const response = fetch.fetch(testURl);
        let text = await response.text();
        console.log(text);
    }
}

module.exports = CheckPrices;