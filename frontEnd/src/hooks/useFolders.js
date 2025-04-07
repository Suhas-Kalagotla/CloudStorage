import { useState } from "react";
import {
  getFolders,
  createFolderApi,
  updateFolderNameApi,
  deleteFolderApi,
} from "../services/folderServices";
import { generateUniqueName } from "../utils/genUniqueName";

const useFolders = (
  folders,
  setFolders,
  setPopupMessage,
  setIsActive,
  files = [],
) => {
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
      const uniqueName = generateUniqueName(newName, files, folders);
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
    const uniqueName = generateUniqueName(newName, files, folders, folderId);
    try {
      await updateFolderNameApi(folderId, uniqueName);
    } catch (err) {
      setPopupMessage("Failed to update folder name");
    } finally {
      fetchFolders(parent_folder_id);
    }
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
