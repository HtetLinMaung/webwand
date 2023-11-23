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

exports.authenticatePage = async (page, auth) => {
  if (auth.type === "basic") {
    await page.authenticate({
      username: auth.username,
      password: auth.password,
    });
  } else if (auth.type === "token") {
    await page.setExtraHTTPHeaders({ Authorization: `Bearer ${auth.token}` });
  }
  // Add more conditions for other auth types...
};
