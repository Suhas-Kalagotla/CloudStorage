import { useState } from "react";
import {
  getFolders,
  createFolderApi,
  updateFolderNameApi,
  deleteFolderApi,
} from "../services/folderServices";

const useFolders = (setPopupMessage, setIsActive) => {
  const [folders, setFolders] = useState([]);
  const [tempFolder, setTempFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFolders = async (folderId) => {
    try {
      setIsLoading(true);
      const folders = await getFolders(folderId);
      setFolders(folders);
    } catch (err) {
      setPopupMessage("Failed to fetch folders");
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async (parentFolderId, newName) => {
    try {
      const uniqueName = generateUniqueFolderName(newName);
      const response = await createFolderApi(parentFolderId, uniqueName);
      setIsActive({ id: response.folderId, type: "folder" });
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

  const deleteFolder = async (folderId) => {
    try {
      await deleteFolderApi(folderId);
      setIsActive({ id: null, type: null });
    } catch (err) {
      setPopupMessage("Failed to delete folder");
    }
  };

  return {
    folders,
    tempFolder,
    setPopupMessage,
    setTempFolder,
    createFolder,
    updateFolderName,
    fetchFolders,
    isLoading,
    deleteFolder,
  };
};

export default useFolders;
