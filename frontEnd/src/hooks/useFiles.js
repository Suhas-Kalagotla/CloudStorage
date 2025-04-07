import { useState } from "react";
import { getFiles, updateFileNameApi } from "../services/fileServices";
import fileReceive from "../utils/fileReceive";
import { generateUniqueName } from "../utils/genUniqueName";

const useFiles = (files, setFiles, setPopupMessage, folders = []) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async (folderId) => {
    try {
      setIsLoading(true);
      const fileResponse = await getFiles(folderId);
      await fileReceive(setFiles, fileResponse);
    } catch (err) {
      setPopupMessage("Failed to fetch files");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFileName = async (fileId, parent_folder_id, newName) => {
    const uniqueName = generateUniqueName(newName, files, folders, fileId);
    try {
      await updateFileNameApi(fileId, parent_folder_id, uniqueName);
      fetchFiles(parent_folder_id);
    } catch (err) {
      setPopupMessage("Failed to update file name");
    }
  };

  return {
    files,
    fetchFiles,
    updateFileName,
    isLoading,
  };
};

export default useFiles;
