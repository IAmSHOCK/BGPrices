const puppeteer = require('puppeteer');
const fs        = require("fs");
const { fail }  = require('assert');
const log4js    = require("log4js");
const pg        = require("pg");

log4js.configure({
  appenders: { cheese: { type: "file", filename: "logging.log" } },
});

let logger = log4js.getLogger("cheese");
logger.level = "debug";
logger.debug("Some debug messages");

const db = new pg.Client({
    user: "BGPrices",
    host: "localhost",
    database: "bgprices",
    password: "bgprices123",
    port: 5432,
  });

function dbInit() {
  db.connect();

}