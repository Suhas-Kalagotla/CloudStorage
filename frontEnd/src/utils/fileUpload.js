import cryptoJS from "crypto-js";
import axios from "axios";
import { url } from "../utils/url";

const fileUpload = async (
  file,
  setPopupMessage,
  fetchFolders,
  folderId,
  userId,
) => {
  if (!file) {
    setPopupMessage("No file selected");
    return;
  }
  const secretKey = "difficulttofindkey1290";
  const chunk_size = 64 * 1024;
  const reader = new FileReader();
  let offset = 0;

  const uploadChunk = async (encryptedChunk, isLastChunk) => {
    const formData = new FormData();
    formData.append("fileName", file.name);
    formData.append("folderId", folderId ?? userId);
    formData.append("chunk", encryptedChunk);
    formData.append("isLastChunk", isLastChunk);

    try {
      await axios.post(`${url}/user/fileUpload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (isLastChunk) {
        setPopupMessage("Successfully uploaded");
        fetchFolders(folderId || userId);
      }
    } catch (err) {
      console.log(err);
      setPopupMessage(err.message);
    }
  };

  reader.onload = async (e) => {
    const fileChunk = new Uint8Array(e.target.result);
    const encryptedChunk = cryptoJS.AES.encrypt(
      cryptoJS.lib.WordArray.create(fileChunk),
      secretKey,
    ).toString();

    const isLastChunk = offset + chunk_size >= file.size;
    await uploadChunk(encryptedChunk, isLastChunk);

    if (!isLastChunk) {
      offset += chunk_size;
      readNextChunk();
    }
  };
  const readNextChunk = () => {
    const slice = file.slice(offset, offset + chunk_size);
    reader.readAsArrayBuffer(slice);
  };

  reader.onerror = () => {
    setPopupMessage("Error reading file");
  };
  readNextChunk();
};

export default fileUpload;
