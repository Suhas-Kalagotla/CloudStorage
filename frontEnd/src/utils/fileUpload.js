import cryptoJS from "crypto-js";
import axios from "axios";
import { url } from "../utils/url";

const fileUpload = async (
  file,
  setPopupMessage,
  fetchFolders,
  folderId,
  userId,
  usedStorage,
  allocatedStorage,
  setStorage,
) => {
  if (!file) {
    setPopupMessage("No file selected");
    return;
  }
  const secretKey = "1ECCF50FDA384EB1EC77071AE4B4F3390951BFE3BC3E802C307AD51C45A45DDF";
  const chunk_size = 64 * 1024;
  const reader = new FileReader();
  let offset = 0;
  if (usedStorage + file.size / (1024 * 1024) > allocatedStorage) {
    setPopupMessage("Storage limit reached contact admin");
    return;
  }

  const uploadChunk = async (encryptedChunk, isLastChunk) => {
    const formData = new FormData();
    formData.append("fileName", file.name);
    formData.append("folderId", folderId ?? userId);
    formData.append("chunk", encryptedChunk);
    formData.append("fileSize", file.size);
    formData.append("isLastChunk", isLastChunk);
    try {
      const response = await axios.post(`${url}/user/fileUpload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (isLastChunk) {
        setPopupMessage("Successfully uploaded");
        fetchFolders(folderId || userId);
        setStorage(response.data.userSize);
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
