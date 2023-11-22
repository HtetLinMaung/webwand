const path = require("path");
const fs = require("fs");
const { log } = require("starless-logger");
const { v4 } = require("uuid");
const { getBrowser } = require("../utils/browser");
const {
  formatDimensions,
  pdfFolderPath,
  imageFolderPath,
} = require("../constants");

module.exports = async (req, res) => {
  let page;
  try {
    const options = req.body;
    page = await getBrowser().newPage();
    const unique_name = v4();
    const pdfOptions = {
      format: options.format || "A4",
      path: path.join(pdfFolderPath, options.output || `${unique_name}.pdf`),
      landscape: options.landscape,
      scale: +options.scale || "1",
      margin: {
        top: options.marginTop || "0",
        bottom: options.marginBottom || "0",
        left: options.marginLeft || "0",
        right: options.marginRight || "0",
      },
      displayHeaderFooter: options.displayHeaderFooter,
      headerTemplate: options.headerTemplate,
      footerTemplate: options.footerTemplate,
      printBackground: true,
      preferCSSPageSize: options.preferCssPageSize,
      pageRanges: options.pageRanges,
    };

    if (options.verbose) {
      log(`options: `, "info", {
        timestampFormat: "DD/mm/yyyy hh:mm:ss a",
      });
      log(options, "info", {
        timestampFormat: "DD/mm/yyyy hh:mm:ss a",
      });
      log(`pdf options: `, "info", {
        timestampFormat: "DD/mm/yyyy hh:mm:ss a",
      });
      log(pdfOptions, "info", {
        timestampFormat: "DD/mm/yyyy hh:mm:ss a",
      });
    }

    let content = options.content;

    if (options.contentType === "file") {
      content = await fs.readFile(options.content, "utf-8");
    }
    if (content) {
      await page.setContent(content, {
        waitUntil: options.waitUntil || "load",
        timeout: +options.timeout || "30000",
      });
    } else {
      await page.goto(options.url, {
        waitUntil: options.waitUntil || "load",
        timeout: +options.timeout || "30000",
      });
    }
    if (options.image) {
      const selectedFormat =
        formatDimensions[options.format] || formatDimensions.A4; // Default to A4 if format not recognized

      await page.setViewport({
        width: selectedFormat.width,
        height: selectedFormat.height,
      });

      const imagePath = path.join(
        imageFolderPath,
        options.imageOutput || `${unique_name}.png`
      );

      await page.screenshot({ path: imagePath, fullPage: true });
    } else {
      await page.emulateMediaType("screen");
      await page.pdf(pdfOptions);
    }
    page.close();
    res.json({
      code: 200,
      message: "Successful.",
      data: `/webwand/${options.image ? "images" : "pdf"}/${unique_name}.${
        options.image ? "png" : "pdf"
      }`,
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
