import { useState } from "react";
import {
  getFolders,
  createFolderApi,
  updateFolderNameApi,
} from "../services/folderServices";

const useFolders = (user, setPopupMessage) => {
  const [folders, setFolders] = useState([]);
  const [tempFolder, setTempFolder] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null);

  const fetchFolders = async (folderId) => {
    try {
      const folders = await getFolders(folderId);
      setFolders(folders);
    } catch (err) {
      setPopupMessage("Failed to fetch folders");
    }
  };

  const createFolder = async (parentFolderId, newName) => {
    try {
      const uniqueName = generateUniqueFolderName(newName);
      const response = await createFolderApi(parentFolderId, uniqueName);
      setActiveFolderId(response.folderId);
      setTempFolder(null);
      fetchFolders(parentFolderId);
    } catch (err) {
      setTempFolder(null);
      setPopupMessage("Failed to create folder");
    }
  };

  const updateFolderName = async (folderId, parent_folder_id, newName) => {
    const uniqueName = generateUniqueFolderName(newName, folderId);
    try {
      await updateFolderNameApi(folderId, uniqueName);
      fetchFolders(parent_folder_id);
    } catch (err) {
      setPopupMessage("Failed to update folder name");
    }
  };

  const generateUniqueFolderName = (baseName, id = null) => {
    let name = baseName;
    let count = 1;
    let folderName;
    if (id)
      folderName = folders
        .filter((folder) => folder.id !== id)
        .map((folder) => folder.name);
    else folderName = folders.map((folder) => folder.name);

    while (folderName.includes(name)) {
      name = `${baseName} ${count}`;
      count++;
    }
    return name;
  };

  return {
    folders,
    tempFolder,
    setPopupMessage,
    activeFolderId,
    setTempFolder,
    setActiveFolderId,
    createFolder,
    updateFolderName,
    fetchFolders,
  };
};

export default useFolders;
