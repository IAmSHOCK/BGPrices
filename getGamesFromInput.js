const fs = require("fs");

function readFile(fileName){
    try {
        input = fs.readFileSync(`./${fileName}`).toString();
    } catch (error) {
        console.log(error);
    }
    return input;
}

function getGamesFromInput(input){
    let games = input.split('\n');
    output = games.filter(game => !game.startsWith("http"));
    return output;
}

function main(){
    let input = readFile('./input.txt');
    let games = getGamesFromInput(input);
    games.forEach(function(entry) {
        console.log(entry);
      });
}

main();