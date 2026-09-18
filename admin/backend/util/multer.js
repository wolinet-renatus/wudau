//multer
const multer = require("multer");

//fs
const fs = require("fs");

const path = require("path");

//generates a custom filename for uploaded files and sets the destination folder to "storage"
module.exports = multer.diskStorage({
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".mp4";
    let base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "");
    if (!base) base = "media";
    const filename = `${Date.now()}_${Math.floor(Math.random() * 10000)}_${base}${ext}`;
    callback(null, filename);
  },

  destination: (req, file, callback) => {
    if (!fs.existsSync("storage")) {
      fs.mkdirSync("storage");
    }
    callback(null, "storage");
  },
});
