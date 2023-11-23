const { log } = require("starless-logger");
const { getBrowser, authenticatePage } = require("../utils/browser");

module.exports = async (req, res) => {
  let page;
  try {
    const {
      url,
      formData,
      submitButtonSelector,
      waitUntil = "networkidle2",
      timeout = "30000",
      auth,
      viewPortWidth = 1366,
      viewPortHeight = 768,
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
    // Fill out the form
    for (const [name, value] of Object.entries(formData)) {
      await page.evaluate(
        (name, value) => {
          let element = document.querySelector(`[name="${name}"]`);
          if (element) element.value = value;
        },
        name,
        value
      );
    }

    // Submit the form
    if (submitButtonSelector) {
      await page.click(submitButtonSelector);
    } else {
      await page.evaluate(() => {
        document.forms[0].submit();
      });
    }

    page.close();
    res.json({
      code: 200,
      message: "Form submitted successfully",
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
