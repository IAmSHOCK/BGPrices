const cheerio = require('cheerio');
const fetch = require("node-fetch");
const fs = require("fs");
const { log } = require('console');


class CheckPrices{
    constructor(){
        this.gamesInput = fs.readFileSync('./input.txt').toString().split(' ').join('+').split("\n");
        this.urls =[
            {name: 'jogonamesa' ,url:"https://jogonamesa.pt/P/search.cgi?&ordem=nome&search=" },
            {name: 'arenaporto' ,url:"https://arenaporto.com/pesquisa?controller=search&s=" },
        ];
        this.gamesToPrint = [];
    }

    async scrape(url){
        // const response = fetch(url);
        // let text = await response.text();
        // console.log(text);

        let response = await fetch(url);
        return await response.text();
    }

    async getData(){
        // for (let i = 0; i < this.gamesInput.length; i++) {
            // let game = this.gamesInput[i];
            let game = this.gamesInput[0];
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
                        this.jogonamesa($);
                        break;
                }
                console.log(this.gamesToPrint);
            }
        // }

    }

    jogonamesa($){
        let listItems = $(".lista_items a");
        listItems.each( (idx, el) =>{
            if(idx == 3) return false;
            let name = $(el).find(".item_nome").text();
            let price = $(el).find(".item_preco").text();
            let cheaperPrice = $(el).find(".item_preco_barato").text();
            let stock = $(el).find(".item_disponibilidade").text();

            console.log(idx);
            this.gamesToPrint.push({name: name, price: price, cheaperPrice: cheaperPrice, stock: stock});
            // console.log({name: name, price: price, cheaperPrice: cheaperPrice, stock: stock});
            // console.log(`${stock}\n`);
        });
    }
}



let price = new CheckPrices();
// console.log(price.testURl);
price.getData();
