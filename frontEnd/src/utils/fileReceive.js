import cryptoJS from "crypto-js";

const fileReceive = async (setFiles, response) => {
  try {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const data = await response.json();
    const { files } = data;
    const imageUrls = [];
    for (let file of files) {
      const { name, id, chunks } = file;
      const decryptedChunks = [];
      for (let { encryptedChunk } of chunks) {
        const bytes = cryptoJS.AES.decrypt(encryptedChunk, secretKey);
        const decryptedString = bytes.toString(cryptoJS.enc.Latin1);
        const len = decryptedString.length;
        let uint8Array = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          uint8Array[i] = decryptedString.charCodeAt(i);
        }
        decryptedChunks.push(uint8Array);
      }
      let totalLength = decryptedChunks.reduce(
        (acc, cur) => acc + cur.length,
        0,
      );
      let combinedArray = new Uint8Array(totalLength);
      let offset = 0;
      decryptedChunks.forEach((chunk) => {
        combinedArray.set(chunk, offset);
        offset += chunk.length;
      });
      const blob = new Blob([combinedArray]);
      const imageUrl = URL.createObjectURL(blob);
      imageUrls.push({ name,id, imageUrl });
    }
    setFiles(imageUrls);
  } catch (err) {
    console.log(err);
  }
};
export default fileReceive;
