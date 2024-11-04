const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')();

let boardGame = prompt('Boardgame: ');

function getWebsites(boardGame){
  boardGame = encodeURI(boardGame);
  return websites = [
    `https://bgg.cc/geeksearch.php?action=search&objecttype=boardgame&q=${boardGame}`,
    `https://pt.wallapop.com/app/search?keywords=${boardGame}&category_ids=12579&object_type_ids=10100&filters_source=quick_filters`,
    `https://www.kultgames.pt/index.php?fc=module&module=leoproductsearch&controller=productsearch&orderby=position&orderway=desc&cate=&search_query=${boardGame}`,
    `https://versusgamecenter.pt/search?q=${boardGame}`,
    `https://gameplay.pt/pt/pesquisa?controller=search&s=${boardGame}`,
    `https://arenaporto.com/pesquisa?controller=search&s=${boardGame}`,
    `https://jogonamesa.pt/P/search.cgi?search=${boardGame}`,
    `https://gglounge.pt/?post_type=product&s=${boardGame}&product_cat=`,
    `https://www.diver.pt/pt/search?controller=search&orderby=position&orderway=desc&search_query=${boardGame}&submit_search=`,
    `https://devir.pt/catalogsearch/result/?q=${boardGame}`,
    `https://www.ajogar.com/search-results?q=${boardGame}`,
    `https://saltadacaixa.pt/search?type=product&options%5Bunavailable_products%5D=last&options%5Bprefix%5D=none&q=${boardGame}*`,
    `https://jubilantsunday.com/store/pesquisa?controller=search&s=${boardGame}`,
    `https://juegosdelamesaredonda.com/buscar?controller=search&orderby=position&orderway=desc&search_query=${boardGame}&submit_search=`,
    `https://dracotienda.com/busqueda?controller=search&orderby=position&orderway=desc&search_category=all&s=${boardGame}&submit_search=`,
    `https://www.planetongames.com/es/buscar?controller=search&s=${boardGame}`,
    `https://mathom.es/en/search?orderby=position&controller=search&orderway=desc&search_query=${boardGame}`,
    `https://www.padis-store.com/en/?mot_q=${boardGame}`,
    `https://www.masqueoca.com/tienda/buscardo.asp?txtbusqueda=${boardGame}&dondebusco=1&x=0&y=0&ideditor=&edadmin=&njugadores=&njugadoresmax=&duracionmin=&duracionmax=&descuentomin=&vertodo=1&stockneg=1`,
    `https://jugamosotra.com/es/busqueda?controller=search&s=${boardGame}`,
    `https://www.empiregames.es/?s=${boardGame}&post_type=product&dgwt_wcas=1`,
    `https://jugamosuna.es/tienda/busqueda?controller=search&s=${boardGame}`,
    `https://muevecubos.com/buscar/${boardGame}`,
    `https://www.4dados.es/?s=${boardGame}&post_type=product&dgwt_wcas=1`,
    `https://dungeonmarvels.com/?gad_source=1&mot_q=${boardGame}`,
    `https://www.board-game.co.uk/search-results/?query=${boardGame}&search_type=`,
    `https://www.philibertnet.com/en/search?search_query=${boardGame}&submit_search=`,
    `https://www.spielematerial.de/en/catalogsearch/result/?q=${boardGame}`,
    `https://boardanddice.com/?s=${boardGame}&post_type=product`,
    `https://www.whitegoblingames.com/en/?s=${boardGame}&post_type=product&type_aws=true&lang=nl`,
    `https://www.goblintrader.es/gb/search?controller=search&s=${boardGame}`,
    `https://zacatrus.es/catalogsearch/result/?q=${boardGame}`,
    `https://www.sheepgames.be/index.php?route=product/search&search=${boardGame}&description=true`,
    `https://www.amazon.es/s?k=${boardGame}`,
  ];
}

websites = getWebsites(boardGame);
const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
puppeteer.launch({headless: false, args: ['--start-maximized']}).then(async browser => {
  websites.forEach(async website => {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent)
    await page.goto(website, {waitUntil: 'load', timeout: 0});
    await page.setViewport({width: 2560, height: 1440});
  });
});
