const multer = require("multer");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    },
});

module.exports = multer({storage : diskStorage});

