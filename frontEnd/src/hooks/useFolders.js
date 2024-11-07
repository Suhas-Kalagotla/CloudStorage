import { useState } from "react";
import {
  getFolders,
  createFolderApi,
  updateFolderNameApi,
} from "../services/folderServices";

const useFolders = (user) => {
  const [folders, setFolders] = useState([]);
  const [tempFolder, setTempFolder] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null);

  const fetchFolders = async (folderId = "null") => {
    try {
      const folders = await getFolders(folderId);
      setFolders(folders);
    } catch (err) {
      setPopupMessage("Failed to fetch folders");
    }
  };

  const createFolder = async (newName) => {
    try {
      const uniqueName = generateUniqueFolderName(newName);
      const response = await createFolderApi(user.id, uniqueName);
      setActiveFolderId(response.folderId);
      setTempFolder(null);
      fetchFolders();
    } catch (err) {
      setTempFolder(null);
      setPopupMessage("Failed to create folder");
    }
  };

  const updateFolderName = async (id, newName) => {
    const uniqueName = generateUniqueFolderName(newName, id);
    try {
      await updateFolderNameApi(id, uniqueName);
      fetchFolders();
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
    popupMessage,
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
