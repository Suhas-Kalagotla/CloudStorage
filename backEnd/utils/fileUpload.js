const Busboy = require("busboy");

const upload = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    const busboy = new Busboy({ headers: req.headers });
    req.fileData = {};

    busboy.on("field", (fieldname, value) => {
      req.fileData[fieldname] = value;
    });

    busboy.on("file", (fieldname, file) => {
      file.resume();
    });

    busboy.on("finish", () => {
      next();
    });

    req.pipe(busboy);
  } else {
    next();
  }
};

module.exports = upload;
