const fs = require("fs");

const rmFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.rm(filePath, {}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: "success" });
      }
    });
  });
};

module.exports = {
  rmFile,
};
