const cheerio = require('cheerio');
const fetch = require("node-fetch");
const fs = require("fs");
const { log } = require('console');


class CheckPrices{
    constructor(){
        this.games = fs.readFileSync('./input.txt').toString().split(' ').join('+').split("\n");
        this.urls =[
            {name: 'jogonamesa' ,url:"https://jogonamesa.pt/P/search.cgi?search=" },
            {name: 'arenaporto' ,url:"https://arenaporto.com/pesquisa?controller=search&s=" },
        ];
    }

    async scrape(url){
        // const response = fetch(url);
        // let text = await response.text();
        // console.log(text);

        let response = await fetch(url);
        return await response.text();
    }

    async getData(){
        // for (let i = 0; i < this.games.length; i++) {
            // let game = this.games[i];
            let game = this.games[0];
            console.log("Starting with game: ", game);
            for (let j = 0; j < this.urls.length; j++) {
                let site = this.urls[j].name;
                console.log("Game: " + game + "; Site:" + site);
                let url = this.urls[j].url;
                url += game;
                let html = await this.scrape(url);
                let $ = cheerio.load(html);
                switch (site) {
                    case "jogonamesa":
                        let listItems = $(".lista_items");
                        listItems.each(function (idx, el) {
                            
                            console.log($(el).text());
                        });
                        break;
                }
            }
        // }

        // html = await this.scrape(this.urls[0].url);
        // let $ = cheerio.load(html);
        // let listItems = $(".lista_items");

        // listItems.each(function (idx, el) {
        //     console.log($(el).text());
        // });
    }
}

let price = new CheckPrices();
// console.log(price.testURl);
price.getData();
