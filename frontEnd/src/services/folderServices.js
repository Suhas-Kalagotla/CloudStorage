import axios from "axios";
import { url } from "../utils/url";

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
    console.log(err);
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
    console.log(err);
    throw err;
  }
};

export const updateFolderNameApi = async (id, folderName) => {
  try {
    await axios.patch(
      `${url}/user/updateName`,
      { id, folderName },
      { withCredentials: true },
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
