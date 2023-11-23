const { v4 } = require("uuid");
const { imageFolderPath } = require("../constants");
const { getBrowser, authenticatePage } = require("../utils/browser");
const path = require("path");
const { log } = require("starless-logger");

module.exports = async (req, res) => {
  let page;
  try {
    const {
      url,
      format = "png",
      quality,
      fullPage = true,
      waitUntil = "networkidle2",
      timeout = "30000",
      viewPortWidth = 1366,
      viewPortHeight = 768,
      customScript,
      auth,
    } = req.body;
    const browser = getBrowser();
    page = await browser.newPage();
    if (auth) {
      await authenticatePage(page, auth);
    }
    await page.goto(url, { waitUntil, timeout });

    // Execute custom script if provided
    if (customScript) {
      await page.evaluate(customScript);
    }

    const unique_name = v4();
    const imagePath = path.join(imageFolderPath, `${unique_name}.png`);

    const screenshotOptions = {
      path: imagePath,
      fullPage,
      type: format,
    };
    if (format === "jpeg") {
      screenshotOptions.quality = quality || 80;
    }

    await page.setViewport({
      width: viewPortWidth,
      height: viewPortHeight,
    });

    await page.screenshot(screenshotOptions);
    page.close();
    res.json({
      code: 200,
      message: "Successful.",
      data: `/images/${unique_name}.${format}`,
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
