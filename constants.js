const path = require("path");

exports.pdfFolderPath = path.join(__dirname, "pdf");

exports.imageFolderPath = path.join(__dirname, "images");

exports.formatDimensions = {
  A4: { width: 794, height: 1123 }, // Dimensions for A4 at 96 DPI
  Letter: { width: 816, height: 1056 }, // Dimensions for Letter at 96 DPI
};
