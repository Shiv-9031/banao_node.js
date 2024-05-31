import multer from "multer";
import fs from "fs";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("media")) {
      fs.mkdirSync("media");
    }

    if (!fs.existsSync("media/avatar")) {
      fs.mkdirSync("media/avatar");
    }
    cb(null, "media/avatar");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    try {
      let ext = path.extname(file.originalname);

      if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
        cb(new Error("only jpg or jpeg or png file "));
      }
      cb(null, true);
    } catch (error) {
      console.log(error);
    }
  },
});
