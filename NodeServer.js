const CheckPrices =  require ("./CheckPrices.js");
const fetch = require("node-fetch");

const http = require('http');

const hostname = '127.0.0.1'
const port = 8008

const server = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Olá mundo\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
    console.log("price = " + CheckPrices.getData("https://jogonamesa.pt/P/ficha.cgi?bgg_id=172287"))

});

// let price;
// price = CheckPrices.getData("https://jogonamesa.pt/P/ficha.cgi?bgg_id=172287");
// console.log(price);