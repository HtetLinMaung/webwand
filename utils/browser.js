const puppeteer = require("puppeteer");

let browser;

exports.initPuppeteer = async () => {
  browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    headless: "new",
  });
  
  return browser;
};

exports.getBrowser = () => browser;
