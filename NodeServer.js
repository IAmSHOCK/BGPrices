const CheckPrices =  require ("./checkPrices.js");
const http = require('http');


const server = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Olá mundo\n');
});

server.listen(8008, "127.0.0.1");

let price = new CheckPrices();
console.log("CheckPrices: ", CheckPrices);
price.getData();