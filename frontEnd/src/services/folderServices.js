import axios from "axios";
import { url } from "../utils/url";

export const getFolderInfo = async (folderId) => {
  try {
    const response = await axios.get(`${url}/user/getFolderInfo`, {
      params: {
        folderId: folderId,
      },
      withCredentials: true,
    });
    return response.data.folder;
  } catch (err) {
    throw err;
  }
};

export const getFolders = async (folderId) => {
  try {
    const response = await axios.get(`${url}/user/getFolders`, {
      params: {
        folderId: folderId,
      },
      withCredentials: true,
    });
    return response.data.folders;
  } catch (err) {
    throw err;
  }
};

export const createFolderApi = async (parentId, newName) => {
  try {
    const response = await axios.post(
      `${url}/user/createFolder`,
      { newName, parentId: parentId },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const updateFolderNameApi = async (folderId, folderName) => {
  try {
    await axios.patch(
      `${url}/user/updateName`,
      {},
      {
        params: { folderId, folderName },
        withCredentials: true,
      },
    );
  } catch (err) {
    throw err;
  }
};
