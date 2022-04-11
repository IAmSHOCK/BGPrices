const cheerio = require('cheerio');
const fetch = require("node-fetch");

class CheckPrices{
    constructor(){
        this.testURl = 'https://jogonamesa.pt/P/ficha.cgi?bgg_id=172287';

        // let htmlparser2 = require('htmlparser2');
        // let dom = htmlparser2.parseDocument(document, options);
    }

    getData(){
        // const response = fetch(url);
        // let text = await response.text();
        // console.log(text);

        fetch(this.testURl)
            .then(res => res.text())
            .then(text => console.log(text));
    }
}

let price = new CheckPrices();
// console.log(price.testURl);
price.getData();
