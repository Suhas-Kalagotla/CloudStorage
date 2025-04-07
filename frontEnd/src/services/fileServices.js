import { url } from "../utils/url";
import axios from "axios";

export const getFiles = async (folderId) => {
  try {
    const response = await fetch(`${url}/user/getFiles?folderId=${folderId}`, {
      method: "GET",
      credentials: "include",
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getFileInfo = async (fileId, currentFolderId) => {
  try {
    const response = await axios.get(`${url}/user/getFileInfo`, {
      params: { fileId: fileId, folderId: currentFolderId },
      withCredentials: true,
    });
    return response.data.file;
  } catch (err) {
    throw err;
  }
};

export const deleteFileApi = async (fileId, folderId) => {
  try {
    const response = await axios.delete(`${url}/user/deleteFile`, {
      params: { fileId: fileId, folderId: folderId },
      withCredentials: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateFileNameApi = async (fileId,folderId, fileName) => {
  try {
    await axios.patch(
      `${url}/user/updateFileName`,
      {},
      { params: { fileId, folderId, fileName }, withCredentials: true },
    );
  } catch (err) {
    throw err;
  }
};
