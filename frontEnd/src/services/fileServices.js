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

export const getFileInfo = async (fileId) => {
  try {
    const response = await axios.get(`${url}/user/getFileInfo`, {
      params: { fileId: fileId },
      withCredentials: true,
    });
    return response.data.file;
  } catch (err) {
    throw err;
  }
};
