const fs = require("fs");
const path = require("path");

const mkdirFolder = (rootFolder, folderName) => {
  return new Promise((resolve, reject) => {
    const folderPath = path.join(rootFolder, folderName);

    if (fs.existsSync(folderPath)) {
      return reject(new Error("Folder already exists"));
    }

    fs.mkdir(folderPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve({
        message: `Folder ${folderName} created successfully`,
        folderPath,
      });
    });
  });
};

module.exports = {
  mkdirFolder,
};
