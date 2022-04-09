const cheerio = require('cheerio');
const fetch = require("node-fetch");

class CheckPrices{
    constructor(){
        let testURl = "https://jogonamesa.pt/P/ficha.cgi?bgg_id=172287";
        // let htmlparser2 = require('htmlparser2');
        // let dom = htmlparser2.parseDocument(document, options);
    }

    getData(url){
        // const response = fetch(url);
        // let text = await response.text();
        // console.log(text);

        return fetch.fetch(url)
            .then(res => res.text())
            .then(text => console.log(text));
    }
}

module.exports.CheckPrices = { CheckPrices };