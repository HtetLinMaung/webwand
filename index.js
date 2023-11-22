require("dotenv").config();

const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { log } = require("starless-logger");
const siteToPdf = require("./routes/site-to-pdf");
const { initPuppeteer } = require("./utils/browser");
const { imageFolderPath, pdfFolderPath } = require("./constants");

const PORT = process.env.PORT || "3000";

const app = express();

if (!fs.existsSync(imageFolderPath)) {
  fs.mkdirSync(imageFolderPath);
}
if (!fs.existsSync(pdfFolderPath)) {
  fs.mkdirSync(pdfFolderPath);
}

app.use(cors());
app.use("/webwand/images", express.static(imageFolderPath));
app.use("/webwand/pdf", express.static(pdfFolderPath));
app.use(express.json());

app.post("/webwand/site-to-pdf", siteToPdf);

app.listen(PORT, () => {
  log(`Server listening on ${PORT}`, "info", {
    timestampFormat: "DD/mm/yyyy hh:mm:ss a",
  });
  initPuppeteer();
});
