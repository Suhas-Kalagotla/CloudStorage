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

const renameFolder = (folderPath, newName) => {
  return new Promise((resolve, reject) => {
    const pathParts = folderPath.split("/");
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join("/");

    fs.rename(folderPath, newPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newPath);
      }
    });
  });
};

module.exports = {
  mkdirFolder,
  renameFolder,
};
