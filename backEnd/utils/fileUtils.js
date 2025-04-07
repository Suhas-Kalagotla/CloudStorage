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

const renameFile = (filePath, newName) => {
  return new Promise((resolve, reject) => {
    const pathParts = filePath.split("/");
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join("/");

    fs.rename(filePath, newPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newPath);
      }
    });
  });
};

module.exports = {
  rmFile,
  renameFile,
};
