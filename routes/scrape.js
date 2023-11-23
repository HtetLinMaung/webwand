const { log } = require("starless-logger");
const { getBrowser, authenticatePage } = require("../utils/browser");

module.exports = async (req, res) => {
  let page;
  try {
    const {
      url,
      selectors,
      waitUntil = "networkidle2",
      timeout = "30000",
      viewPortWidth = 1366,
      viewPortHeight = 768,
      auth,
    } = req.body;
    const browser = getBrowser();
    page = await browser.newPage();
    if (auth) {
      await authenticatePage(page, auth);
    }
    await page.goto(url, { waitUntil, timeout });
    await page.setViewport({
      width: viewPortWidth,
      height: viewPortHeight,
    });
    let scrapedData = {};

    for (const [key, selector] of Object.entries(selectors)) {
      const elements = await page.$$(selector);
      scrapedData[key] = await Promise.all(
        elements.map((element) =>
          element.evaluate((node) => node.innerText || node.value)
        )
      );
    }

    page.close();
    res.json({
      code: 200,
      message: "Scrapped data was successfully",
      data: scrapedData,
    });
  } catch (err) {
    if (page) {
      page.close();
    }
    log(err.message, "error", {
      timestampFormat: "DD/mm/yyyy hh:mm:ss a",
    });
    res.status(500).json({
      code: 500,
      message: "Something went wrong!",
    });
  }
};
